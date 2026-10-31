# Product Requirements Document (PRD): IndexLib

**Product Name:** IndexLib  
**Target Repository:** `/home/saurabh-sukant/dev/IndexLib`  
**Deployment Target:** GitHub Pages (`https://saurabhsukant75.github.io/IndexLib/`)  
**Design & Interaction Prototype:** [`UI-UX-DESIGN.md`](file:///home/saurabh-sukant/dev/IndexLib/UI-UX-DESIGN.md) & [`interactive-prototype.html`](file:///home/saurabh-sukant/dev/IndexLib/interactive-prototype.html)  
**Version:** 2.0.0-PRD  
**Author:** AI Agentic Architecture Team  
**Date:** October 31, 2026  
**Status:** Approved for Implementation  

---

## 1. Executive Summary

### 1.1 Project Overview
**IndexLib** is an open-source visual web library and authoring platform for short, structured, multi-page HTML books. It combines hierarchical taxonomy exploration, a semantic concept knowledge graph, curated learning paths, an offline-first private library, and sandboxed interactive reading.

The project is transitioning from a static vanilla JavaScript codebase (`IndexDictionary`) to a modern React 18/19 + TypeScript application called **IndexLib**, deployed to **GitHub Pages** with **Supabase** providing authentication, database catalog management, storage for published books, and reading progress synchronization.

### 1.2 Core Objectives
1. **Name & Identity:** Rebranded as **IndexLib**, focusing on tactile editorial aesthetics, clarity, and deep knowledge exploration.
2. **Component Reusability:**
   - `<HtmlBookReader />`: A sandboxed, secure, accessible HTML book reader with bi-directional postMessage communication (`index-dictionary.book` protocol v1), Table of Contents drawer, text-zoom controls, deep linking, and progress tracking.
   - `<HtmlBookPublisher />`: A full-featured publishing suite with drag-and-drop file upload, automated structural/accessibility validation, side-by-side live sandboxed preview, and publishing workflows.
3. **Publishing & Approval Lifecycle (Owner Decision):**
   - **Community Submissions:** Any registered user can publish a book.
   - **Submission State (`pending_review`):** When submitted, the book is immediately accessible to its author and platform administrators.
   - **Admin Moderation & Approval (`published`):** Once reviewed and approved by an administrator, the book becomes globally visible in the public catalog. Administrators retain full capabilities to moderate, request revisions, or archive books.
   - **Private Offline Option:** Users can also save private imports directly to browser IndexedDB (device-only, never uploaded).
4. **GitHub Pages Deployment:** Built via Vite into static assets (`dist/`) and deployed seamlessly with GitHub Actions using React Router `HashRouter` to prevent routing errors.
5. **Supabase Cloud Backend:** PostgreSQL with Row Level Security (RLS), Supabase Storage bucket `books`, Supabase Auth with PKCE, and bi-directional progress/bookmark synchronization with browser IndexedDB.

---

## 2. Architecture Diagram & Workflow

```mermaid
flowchart TD
    subgraph Client Architecture (IndexLib SPA on GitHub Pages)
        Router[HashRouter] --> Views[Views: Home | Topics | Concepts | Paths | Library | Publish | Admin]
        Views --> ReaderComponent["<HtmlBookReader /> (Sandboxed Frame)"]
        Views --> PublisherComponent["<HtmlBookPublisher /> (Validate & Preview)"]
        Views --> ConceptGraph["<ConceptGraph /> (Interactive SVG/Canvas)"]
        ReaderComponent --> LocalDB[IndexedDB: Offline Cache, Private Imports]
        PublisherComponent --> LocalDB
    end

    subgraph Supabase Cloud Platform
        Auth[Supabase Auth - PKCE]
        DB[(PostgreSQL Database + RLS)]
        Storage[Supabase Storage: 'books' Bucket]

        DB --> TableProfiles[public.profiles]
        DB --> TableBooks[public.catalog_books]
        DB --> TableProgress[public.reading_progress]
        DB --> TableBookmarks[public.bookmarks]
        DB --> RPCEntry[get_public_leaderboard]
    end

    PublisherComponent -- Upload HTML --> Storage
    PublisherComponent -- Insert draft / pending_review --> TableBooks
    Views -- Query published catalog --> TableBooks
    AdminView[Admin Moderation View] -- Approve -> set status='published' --> TableBooks
    LocalDB <--> |Bi-directional Sync| TableProgress
```

---

## 3. Detailed Component Specifications

### 3.1 `<HtmlBookReader />`
The reader encapsulates the secure display, navigation, and state tracking for an HTML book.

#### 3.1.1 Props Interface
```typescript
export interface HtmlBookReaderProps {
  src: string;                          // HTML URL (Blob, static public path, or Supabase CDN)
  bookId: string;                       // Stable book ID
  title: string;                        // Book title
  initialPageId?: string;               // Deep-linked page ID
  isImported?: boolean;                 // Private device import flag
  isSaved?: boolean;                    // User save state
  isCompleted?: boolean;                // Completion state
  bookmarks?: BookmarkItem[];           // Bookmarked pages
  onPageChange?: (pageId: string) => void;
  onBookReady?: (pageIds: string[]) => void;
  onToggleSave?: () => void;
  onToggleComplete?: () => void;
  onToggleBookmark?: (pageId: string) => void;
  onBack?: () => void;
  className?: string;
}
```

#### 3.1.2 Security & Sandbox Protocol
- `<iframe sandbox="allow-scripts" referrerpolicy="no-referrer">` with no `allow-same-origin`.
- Messages strictly adhere to `index-dictionary.book` version 1:
  - `{ protocol: "index-dictionary.book", version: 1, type: "book-ready", bookId, pageId }`
  - `{ protocol: "index-dictionary.book", version: 1, type: "page-changed", bookId, pageId }`
- Verified origin: `event.origin === "null"` and `event.source === frame.contentWindow`.

---

### 3.2 `<HtmlBookPublisher />`
The publisher provides an interactive workflow for creators to author, test, and publish visual HTML books.

#### 3.2.1 Document Validation Engine (`DocumentInspector`)
- **Structure Check:** Validates HTML5 doctype, UTF-8 charset, and mobile viewport `<meta>`.
- **Page IDs:** Finds all unique DOM element IDs matching `^[A-Za-z][A-Za-z0-9_-]{0,99}$`. Rejects files with duplicate IDs.
- **Security Check:** Blocks external tracking scripts, third-party CDNs, and dangerous DOM attributes.
- **Protocol Bridge:** Checks for the presence of the `notifyParentPage` communication script. Provides a one-click auto-injection button if absent.
- **CSP Injection:** Injects strict Content-Security-Policy before rendering previews.

#### 3.2.2 Lifecycle & Status State Machine
```text
[Author Uploads HTML]
       │
       ▼
[Automated Validation Passes]
       │
       ▼
[Live Sandboxed Preview Verified]
       │
       ▼
[Author Enters Metadata & Clicks "Submit for Review"]
       │
       ├──► Stored in Supabase DB: status = 'pending_review'
       ├──► HTML uploaded to Supabase Storage: books/{author_id}/{book_id}.html
       │
       ▼
[Visible to Author (in My Library) & Administrators (in Admin Queue)]
       │
       ├──► Admin Clicks "Approve" ──► status = 'published' (Globally Live!)
       ├──► Admin Clicks "Reject"  ──► status = 'rejected' (Author Notified)
       └──► Admin/Author "Archive" ──► status = 'archived' (Delisted)
```

---

## 4. Supabase Database Schema & Policies

### 4.1 SQL Schema

```sql
-- 1. Profiles Table with Roles
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text not null check (username ~ '^[A-Za-z0-9_]{3,24}$'),
  role text not null default 'reader' check (role in ('reader', 'author', 'admin')),
  leaderboard_opt_in boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. Books Table with 'pending_review' and Moderation
create table if not exists public.catalog_books (
  id text primary key check (id ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  author_id uuid not null references public.profiles (id) on delete restrict,
  title text not null check (length(title) between 3 and 180),
  summary text not null check (length(summary) between 10 and 500),
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

-- 3. Reading Progress Table
create table if not exists public.reading_progress (
  user_id uuid not null references auth.users (id) on delete cascade,
  book_id text not null,
  page_id text,
  completed boolean not null default false,
  updated_at timestamptz not null default now(),
  primary key (user_id, book_id)
);

-- 4. User Bookmarks Table
create table if not exists public.bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  book_id text not null,
  page_id text not null,
  label text,
  created_at timestamptz not null default now(),
  unique (user_id, book_id, page_id)
);

-- 5. Collections Table
create table if not exists public.collections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null check (length(name) between 1 and 80),
  created_at timestamptz not null default now()
);
```

### 4.2 Row Level Security Policies
```sql
alter table public.catalog_books enable row level security;

-- Public can read ONLY approved published books
create policy "Public can read approved published books"
  on public.catalog_books for select
  using (status = 'published');

-- Authors can view all their own books regardless of status
create policy "Authors can view own books"
  on public.catalog_books for select
  to authenticated
  using (auth.uid() = author_id);

-- Admins can view ALL books in any status
create policy "Admins can view all books"
  on public.catalog_books for select
  to authenticated
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- Any authenticated user can submit a book in 'draft' or 'pending_review'
create policy "Users can submit books for review"
  on public.catalog_books for insert
  to authenticated
  with check (
    auth.uid() = author_id and
    status in ('draft', 'pending_review')
  );

-- Authors can update their own books if not yet approved
create policy "Authors can update own pending books"
  on public.catalog_books for update
  to authenticated
  using (auth.uid() = author_id and status in ('draft', 'pending_review'))
  with check (auth.uid() = author_id and status in ('draft', 'pending_review'));

-- Admins can update any book (approve to published, reject, or archive)
create policy "Admins can moderate any book"
  on public.catalog_books for update
  to authenticated
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'))
  with check (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));
```

---

## 5. GitHub Pages Deployment Configuration

- **Hosting:** GitHub Pages at `https://saurabhsukant75.github.io/IndexLib/`
- **Routing:** React Router v6 with `HashRouter` (e.g. `#/concepts`, `#/read/book-01/cover`).
- **Vite Config:** `base: '/IndexLib/'`, build output `dist/`.
- **CI/CD:** Automated deployment via GitHub Actions `.github/workflows/deploy.yml` on push to branch `main`.

---

## 6. Implementation Plan & Milestones

1. **Phase 1: Project Scaffolding in `IndexLib/`**
   - Initialize Vite + React + TypeScript + Tailwind CSS / design tokens.
   - Configure ESLint, Prettier, and GitHub Actions workflow.
2. **Phase 2: Core Design System & Components**
   - Implement `<ConceptGraph />` matching `https://saurabhsukant75.github.io/INDEX-DICTIONARY/#concepts`.
   - Implement `<HtmlBookReader />` with full sandbox and postMessage protocol support.
   - Implement `<HtmlBookPublisher />` with validation, preview, and submission forms.
3. **Phase 3: Supabase Cloud & Offline Sync Engine**
   - Connect Supabase SDK for Auth and Database queries.
   - Implement typed IndexedDB layer with automated sync for reading progress and bookmarks.
4. **Phase 4: Views & Routing**
   - Implement all views: Home, Topics, Concepts, Learning Paths, Library, Reader, Publisher, Admin Moderation, and Account.
5. **Phase 5: Build Verification & Deployment**
   - Verify `npm run build` generates clean bundle under 250 KB gzipped.
   - Deploy to GitHub Pages and test end-to-end reading, publishing, and admin approval.
