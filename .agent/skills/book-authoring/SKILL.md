---
name: book-authoring
description: >-
  Procedures and rules for validating, authoring, and structuring visual HTML books
  for the IndexLib platform. Use when creating or testing new visual books or modifying
  book templates.
---

# Visual Book Authoring Skill for IndexLib

## 1. Document Structure Checklist

Every standalone book for IndexLib must be a self-contained HTML5 document conforming to the following:

1. **DOCTYPE & Metadata:**
   - Starts with `<!doctype html>`.
   - Includes `<meta charset="utf-8">` and `<meta name="viewport" content="width=device-width, initial-scale=1.0">`.
   - Has a descriptive `<title>Book Title</title>`.

2. **Page IDs:**
   - Every navigable section/chapter must have a unique ID matching `^[A-Za-z][A-Za-z0-9_-]{0,99}$`.
   - Example IDs: `cover`, `contents`, `chapter-1`, `chapter-2`, `takeaways`.

3. **Bridge Communication Script:**
   - Must include the `index-dictionary.book` postMessage handshake:
   ```javascript
   var bookId = "my-book-id";
   var hasSentReady = false;
   function notifyParent(pageId) {
     if (window.parent && window.parent !== window) {
       window.parent.postMessage({
         protocol: "index-dictionary.book",
         version: 1,
         type: hasSentReady ? "page-changed" : "book-ready",
         bookId: bookId,
         pageId: pageId
       }, "*");
       hasSentReady = true;
     }
   }
   ```

4. **Self-Contained Styling:**
   - All styles should be inline `<style>` tags within the document.
   - External fonts and CDN scripts should be avoided to allow reliable offline reading.
