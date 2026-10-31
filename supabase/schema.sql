-- ====================================================================
-- IndexLib Supabase Database & Security Schema
-- Product: IndexLib (v2.0)
-- Host: GitHub Pages with Supabase Backend
-- ====================================================================

-- 1. PROFILES TABLE
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text not null check (username ~ '^[A-Za-z0-9_]{3,24}$'),
  role text not null default 'reader' check (role in ('reader', 'author', 'admin')),
  leaderboard_opt_in boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists profiles_username_lower_idx
  on public.profiles (lower(username));

-- 2. CATALOG BOOKS TABLE
-- Supports moderation lifecycle: draft -> pending_review -> published / rejected / archived
create table if not exists public.catalog_books (
  id text primary key check (id ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  author_id uuid not null references public.profiles (id) on delete restrict,
  title text not null check (length(title) between 3 and 180),
  summary text not null check (length(summary) between 5 and 500),
  content_url text not null,
  storage_path text not null,
  status text not null default 'pending_review' check (status in ('draft', 'pending_review', 'published', 'rejected', 'archived')),
  reading_minutes integer not null default 10 check (reading_minutes > 0),
  primary_taxonomy_id text not null,
  taxonomy_ids jsonb not null default '[]'::jsonb,
  tags jsonb not null default '[]'::jsonb,
  concept_links jsonb not null default '[]'::jsonb,
  page_ids jsonb not null default '[]'::jsonb,
  admin_feedback text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3. USER READING PROGRESS
create table if not exists public.reading_progress (
  user_id uuid not null references auth.users (id) on delete cascade,
  book_id text not null,
  page_id text,
  completed boolean not null default false,
  updated_at timestamptz not null default now(),
  primary key (user_id, book_id)
);

-- 4. USER BOOKMARKS
create table if not exists public.bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  book_id text not null,
  page_id text not null,
  label text,
  created_at timestamptz not null default now(),
  unique (user_id, book_id, page_id)
);

-- 5. ENABLE ROW LEVEL SECURITY
alter table public.profiles enable row level security;
alter table public.catalog_books enable row level security;
alter table public.reading_progress enable row level security;
alter table public.bookmarks enable row level security;

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

-- Profiles Policies
create policy "Public can view basic author profiles" on public.profiles
  for select using (true);

create policy "Users can update their own profile" on public.profiles
  for update to authenticated using (auth.uid() = id);

create policy "Users can insert their own profile" on public.profiles
  for insert to authenticated with check (auth.uid() = id);

-- Catalog Books Policies
-- 1. Public can read ONLY approved published books
create policy "Public can view published books" on public.catalog_books
  for select using (status = 'published');

-- 2. Authors can view all their own books (even when pending_review or draft)
create policy "Authors can view own submitted books" on public.catalog_books
  for select to authenticated using (auth.uid() = author_id);

-- 3. Admins can view ALL books in any status
create policy "Admins can view all books" on public.catalog_books
  for select to authenticated
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- 4. Any authenticated user can submit a book for review (status = 'pending_review' or 'draft')
create policy "Authenticated users can submit books for review" on public.catalog_books
  for insert to authenticated
  with check (
    auth.uid() = author_id and
    status in ('draft', 'pending_review')
  );

-- 5. Authors can update their own book while pending review
create policy "Authors can update own pending books" on public.catalog_books
  for update to authenticated
  using (auth.uid() = author_id and status in ('draft', 'pending_review'))
  with check (auth.uid() = author_id and status in ('draft', 'pending_review'));

-- 6. Admins can approve, moderate, or archive any book
create policy "Admins can moderate any book" on public.catalog_books
  for update to authenticated
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'))
  with check (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- Reading Progress Policies
create policy "Users manage own reading progress" on public.reading_progress
  for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Bookmarks Policies
create policy "Users manage own bookmarks" on public.bookmarks
  for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ====================================================================
-- AUTOMATIC PROFILE TRIGGER ON SIGNUP
-- ====================================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.profiles (id, username, role)
  values (
    new.id,
    coalesce(nullif(new.raw_user_meta_data ->> 'username', ''), 'reader_' || left(replace(new.id::text, '-', ''), 12)),
    'reader'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ====================================================================
-- PUBLIC LEADERBOARD RPC
-- ====================================================================
create or replace function public.get_public_leaderboard()
returns table (username text, completed_books bigint)
language sql
stable
security definer
as $$
  select p.username, count(r.book_id) as completed_books
  from public.profiles p
  join public.reading_progress r on r.user_id = p.id
  where p.leaderboard_opt_in = true and r.completed = true
  group by p.username
  order by completed_books desc
  limit 25;
$$;
