# IndexLib Technical Architecture

## 1. System Topology

```text
┌────────────────────────────────────────────────────────┐
│ GitHub Pages (https://saurabhsukant75.github.io/IndexLib/) │
│  - Static React SPA with HashRouter                   │
│  - Bundled sample books (/book/*.html)                │
│  - Bundled catalog (/data/catalog.json)               │
└───────────────┬────────────────────────────────────────┘
                │
                ├──► Browser IndexedDB (Local-First Offline Store)
                │     - Private imported HTML documents
                │     - Offline reading progress & bookmarks
                │
                └──► Supabase Cloud Platform
                      - Auth: PKCE flow
                      - Database: PostgreSQL with Row Level Security (RLS)
                      - Storage: 'books' bucket for user-submitted HTML
                      - Workflow: Submissions in 'pending_review' -> Admin 'published'
```

## 2. Core Components Contract

### 2.1 `<HtmlBookReader />`
- **Location:** `src/components/reader/HtmlBookReader.tsx`
- **Sandbox Policy:** `<iframe sandbox="allow-scripts" referrerpolicy="no-referrer">` (strictly omitting `allow-same-origin` to ensure an opaque `null` origin).
- **Communication Protocol:** `index-dictionary.book` version 1.
  - Messages validated against `event.origin === "null"` and `event.source === frame.contentWindow`.
  - Dispatches `book-ready` on mount, `page-changed` on internal hash/page navigation.
- **Controls:** Table of Contents drawer, text zoom (85% to 130%), bookmarking, completion marking, and deep-link copying.

### 2.2 `<HtmlBookPublisher />`
- **Location:** `src/components/publisher/HtmlBookPublisher.tsx`
- **Validation Engine:** `src/services/validator.ts` checks:
  - HTML5 doctype and structure
  - Unique page IDs matching `^[A-Za-z][A-Za-z0-9_-]{0,99}$`
  - Presence of protocol bridge script (with auto-injection capability)
  - Security audit (no remote unverified script tags)
- **Live Preview:** Side-by-side `<HtmlBookReader />` rendering in-memory Blob URL.
- **Publishing Targets:**
  - *Local Save:* Stores directly in IndexedDB (device-only).
  - *Public Submission:* Uploads to Supabase Storage and creates `catalog_books` record with `status = 'pending_review'`.

## 3. Moderation State Machine
```text
[Author Uploads] -> [Pending Review] -> (Admin Review) -> [Published] / [Archived]
                         ▲
                         │
                 (Changes Requested)
```
