# Coding Standards for IndexLib

## 1. React & TypeScript
- Use functional components with typed props (`React.FC<Props>` or explicitly typed arguments).
- Keep components modular: reader toolbar, table of contents, and sandbox hooks must remain reusable outside page views.
- No direct DOM manipulation: state changes must be declarative.

## 2. Accessibility (a11y)
- Maintain minimum 4.5:1 color contrast for all text against backgrounds.
- Provide visible 2px solid focus rings on interactive elements.
- Every SVG graph element must have accessible names (`aria-label`) and textual fallbacks for screen readers.

## 3. Build & Performance
- Zero unused imports or variables (`noUnusedLocals: true`, `noUnusedParameters: true`).
- Gzipped JS bundle must remain under 250 kB.
- Vite build must cleanly generate output into `dist/`.
