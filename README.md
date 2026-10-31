# IndexLib

**IndexLib** is a visual web library, interactive HTML book reader, and authoring studio.

## Features
- **Visual HTML Books:** Structured, multi-page, responsive reading experiences rendered in an isolated sandbox (`sandbox="allow-scripts"` without `allow-same-origin`).
- **Interactive Concept Graph:** Browse semantic relationships between concepts (e.g., *Attention* explains *Incentives*, introduces *Engagement*) referencing the knowledge web.
- **Hierarchical Topics & Learning Paths:** Dual organizational structure supporting open exploration and sequential learning.
- **Reusable React Components:**
  - `<HtmlBookReader />`: Self-contained sandboxed reader with Table of Contents drawer, text zoom, reading progress bar, bookmarking, and deep linking (`#/read/:bookId/:pageId`).
  - `<HtmlBookPublisher />`: Authoring studio with drag-and-drop HTML upload, automated validation checklist (HTML5 structure, page IDs, CSP, bridge script), live side-by-side sandboxed preview, and two-tier publishing.
- **Author & Moderation Workflow:**
  - Anyone with an account can submit a book.
  - Submissions are set to `pending_review` (accessible to the author and admins).
  - Administrators review and approve submissions into `published` status for global catalog distribution.
  - Readers can also save private imports locally in browser IndexedDB without an account.
- **Supabase Cloud Backend:**
  - Supabase Auth with PKCE flow.
  - PostgreSQL with Row Level Security (RLS) policies.
  - Supabase Storage bucket for visual book documents.
- **GitHub Pages Deployment:**
  - Built with Vite and React Router (`HashRouter`), deployed via GitHub Actions (`.github/workflows/deploy.yml`).

## Project Structure
```text
IndexLib/
├── UI-UX-DESIGN.md            # Detailed UI & Interaction Specification
├── interactive-prototype.html # Standalone interactive HTML/SVG prototype
├── public/
│   ├── book/                      # Bundled sample visual books (HTML)
│   └── data/                      # Bundled static catalog.json
├── src/
│   ├── components/
│   │   ├── common/                # Header, Sidebar, Layout, Toast
│   │   ├── concepts/              # Interactive ConceptGraph SVG
│   │   ├── reader/                # HtmlBookReader, ReaderToolbar, TableOfContents
│   │   └── publisher/             # HtmlBookPublisher, ValidationReport
│   ├── services/
│   │   ├── catalog.ts             # Hybrid static + cloud catalog loader
│   │   ├── local-db.ts            # IndexedDB offline-first storage
│   │   ├── supabase.ts            # Supabase Auth, DB, and Storage client
│   │   └── validator.ts           # HTML inspector & protocol bridge injector
│   ├── styles/                    # tokens.css, app.css
│   ├── types/                     # TypeScript definitions
│   └── views/                     # Home, Topics, Concepts, Paths, Library, Reader, Publish, Admin, Account
├── supabase/
│   └── schema.sql                 # SQL tables, RLS policies, triggers, and RPC
└── .github/workflows/
    └── deploy.yml                 # Automated GitHub Pages CI/CD workflow
```

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## Build & Verification

```bash
# Typecheck
npm run typecheck

# Production build
npm run build
```
