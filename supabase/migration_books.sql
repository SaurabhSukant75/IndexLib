-- ====================================================================
-- IndexLib: Migration for Books Catalog, Moderation & Storage
-- Project: https://tlygkjoiinshwfayjcjw.supabase.co
-- ====================================================================

-- 1. ADD ROLE COLUMN TO EXISTING PROFILES
-- Roles: 'reader', 'author', 'admin'
alter table public.profiles
  add column if not exists role text not null default 'reader'
  check (role in ('reader', 'author', 'admin'));

-- Allow public/readers to view author usernames for published books
drop policy if exists "Public can view basic author profiles" on public.profiles;
create policy "Public can view basic author profiles"
  on public.profiles for select
  using (true);

-- 2. CREATE CATALOG BOOKS TABLE
-- Supports:
--   - 'draft' / 'private': visible ONLY to author
--   - 'pending_review': visible to author + admins (submitted for review)
--   - 'published': visible to everyone (approved by admin)
--   - 'rejected', 'archived': visible to author + admins
create table if not exists public.catalog_books (
  id text primary key check (id ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  author_id uuid not null references public.profiles (id) on delete cascade,
  author_username text,
  title text not null check (length(title) between 3 and 180),
  summary text not null check (length(summary) between 5 and 500),
  content_url text not null,
  storage_path text not null,
  status text not null default 'pending_review'
    check (status in ('draft', 'private', 'pending_review', 'published', 'rejected', 'archived')),
  reading_minutes integer not null default 10 check (reading_minutes > 0),
  primary_taxonomy_id text not null,
  taxonomy_ids jsonb not null default '[]'::jsonb,
  tags jsonb not null default '[]'::jsonb,
  concept_links jsonb not null default '[]'::jsonb,
  page_ids jsonb not null default '[]'::jsonb,
  search_tokens jsonb not null default '[]'::jsonb,
  admin_feedback text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Index for status and author lookup
create index if not exists idx_catalog_books_status on public.catalog_books (status);
create index if not exists idx_catalog_books_author on public.catalog_books (author_id);

-- 3. ENABLE ROW LEVEL SECURITY ON CATALOG BOOKS
alter table public.catalog_books enable row level security;

-- Policy 1: Anyone (including anonymous) can view PUBLISHED books
drop policy if exists "Anyone can view published books" on public.catalog_books;
create policy "Anyone can view published books"
  on public.catalog_books for select
  using (status = 'published');

-- Policy 2: Authors can view ALL their own books (draft, private, pending_review, published)
drop policy if exists "Authors can view own books" on public.catalog_books;
create policy "Authors can view own books"
  on public.catalog_books for select to authenticated
  using ((select auth.uid()) = author_id);

-- Policy 3: Admins can view ALL books
drop policy if exists "Admins can view all books" on public.catalog_books;
create policy "Admins can view all books"
  on public.catalog_books for select to authenticated
  using (
    exists (
      select 1 from public.profiles
      where id = (select auth.uid()) and role = 'admin'
    )
  );

-- Policy 4: Authenticated users can insert their own books ('draft', 'private', or 'pending_review')
drop policy if exists "Users can insert own books" on public.catalog_books;
create policy "Users can insert own books"
  on public.catalog_books for insert to authenticated
  with check (
    (select auth.uid()) = author_id and
    status in ('draft', 'private', 'pending_review')
  );

-- Policy 5: Authors can update their own books if not yet approved
drop policy if exists "Authors can update own non-published books" on public.catalog_books;
create policy "Authors can update own non-published books"
  on public.catalog_books for update to authenticated
  using (
    (select auth.uid()) = author_id and
    status in ('draft', 'private', 'pending_review')
  )
  with check (
    (select auth.uid()) = author_id and
    status in ('draft', 'private', 'pending_review')
  );

-- Policy 6: Admins can update/moderate any book (e.g. approve to 'published', reject, add feedback)
drop policy if exists "Admins can moderate any book" on public.catalog_books;
create policy "Admins can moderate any book"
  on public.catalog_books for update to authenticated
  using (
    exists (
      select 1 from public.profiles
      where id = (select auth.uid()) and role = 'admin'
    )
  )
  with check (
    exists (
      select 1 from public.profiles
      where id = (select auth.uid()) and role = 'admin'
    )
  );

-- Policy 7: Authors can delete their own private or draft books
drop policy if exists "Authors can delete own private books" on public.catalog_books;
create policy "Authors can delete own private books"
  on public.catalog_books for delete to authenticated
  using ((select auth.uid()) = author_id and status in ('draft', 'private'));

-- Grants
grant select on public.catalog_books to anon;
grant select, insert, update, delete on public.catalog_books to authenticated;

-- 4. STORAGE BUCKET CONFIGURATION ('books')
-- Create bucket 'books' if it doesn't already exist
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'books',
  'books',
  true,
  5242880, -- 5 MB
  array['text/html']
)
on conflict (id) do update set
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = array['text/html'];

-- Storage RLS: Public read for published files or anyone viewing their own
drop policy if exists "Public book files read access" on storage.objects;
create policy "Public book files read access"
  on storage.objects for select
  using (bucket_id = 'books');

-- Storage RLS: Authors can upload to their own user directory: books/{user_id}/*
drop policy if exists "Authors can upload book files" on storage.objects;
create policy "Authors can upload book files"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'books' and
    (storage.foldername(name))[1] = (select auth.uid())::text
  );

-- Storage RLS: Authors can update/overwrite their own book files
drop policy if exists "Authors can update own book files" on storage.objects;
create policy "Authors can update own book files"
  on storage.objects for update to authenticated
  using (
    bucket_id = 'books' and
    (storage.foldername(name))[1] = (select auth.uid())::text
  );
