# IndexLib Project Steering Guidelines

## 1. Primary Directives & Invariants

1. **GitHub Pages Compatibility:**
   - Always use React Router's `HashRouter` (`#/read/book-01/cover`).
   - Never use `BrowserRouter` with HTML5 pushState: GitHub Pages does not support server rewrites and will return 404 on refresh.
   - Always verify that the Vite base path is set to `process.env.VITE_BASE_PATH || '/IndexLib/'` or `'./'`.

2. **Security & Iframe Sandboxing:**
   - Books MUST be isolated in an iframe with `sandbox="allow-scripts"` and `referrerpolicy="no-referrer"`.
   - NEVER add `allow-same-origin` to book iframes: books must remain on an opaque `null` origin to prevent reading parent application cookies, IndexedDB, or DOM.
   - All parent-book messaging must adhere to the versioned `index-dictionary.book` postMessage protocol.

3. **Author Access & Moderation Flow:**
   - Any registered user can author and submit a book.
   - New submissions MUST start with status `pending_review`.
   - Submissions in `pending_review` are visible only to the author and platform administrators.
   - Only administrators have authorization to transition status from `pending_review` to `published`.
   - Public readers only see books with status `published`.

4. **Visual & Design System:**
   - Maintain the tactile editorial aesthetic defined in `src/styles/tokens.css`.
   - Base canvas: `#f5f3ed` (warm paper). Ink text: `#20241f`. Accent: `#d5ff58` (electric lime).
   - Headlines use serif typography (`Georgia, Times New Roman, serif`). UI elements use clean sans-serif.

5. **Offline-First Resilience:**
   - Private imports and local reading progress MUST remain fully functional without a network connection or Supabase account via IndexedDB (`src/services/local-db.ts`).
   - Cloud sync occurs opportunistically when authenticated.
