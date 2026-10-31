export const SAFE_PAGE_ID = /^[A-Za-z][A-Za-z0-9_-]{0,99}$/;
export const BOOK_MESSAGE_PROTOCOL = "index-dictionary.book";

export interface ValidationReport {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  pageIds: string[];
  hasProtocolScript: boolean;
  titleSuggestion: string;
}

export function inspectBookHtml(html: string): ValidationReport {
  const errors: string[] = [];
  const warnings: string[] = [];
  const pageIds: string[] = [];
  let titleSuggestion = "";
  let hasProtocolScript = false;

  if (typeof html !== "string" || !html.trim()) {
    return {
      isValid: false,
      errors: ["The uploaded file is empty."],
      warnings: [],
      pageIds: [],
      hasProtocolScript: false,
      titleSuggestion: ""
    };
  }

  if (!/<(?:!doctype\s+html|html\b)/i.test(html)) {
    errors.push("The document is missing an HTML5 <!doctype html> declaration.");
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  if (doc.documentElement?.localName !== "html" || !doc.body) {
    errors.push("Malformed HTML document structure.");
    return { isValid: false, errors, warnings, pageIds, hasProtocolScript, titleSuggestion };
  }

  // Check document title
  const titleEl = doc.querySelector("title");
  if (titleEl && titleEl.textContent?.trim()) {
    titleSuggestion = titleEl.textContent.trim();
  } else {
    warnings.push("Document lacks a <title> element; please specify a book title in the metadata.");
  }

  // Check viewport meta
  const viewportMeta = doc.querySelector("meta[name='viewport']");
  if (!viewportMeta) {
    warnings.push("No mobile viewport meta tag found. The book might not render responsively on mobile devices.");
  }

  // Check Page IDs
  const idCounts = new Map<string, number>();
  const idElements = doc.body.querySelectorAll("[id]");
  for (const el of Array.from(idElements)) {
    const id = el.id.trim();
    if (SAFE_PAGE_ID.test(id)) {
      idCounts.set(id, (idCounts.get(id) || 0) + 1);
    } else {
      warnings.push(`Element ID "${id}" does not follow safe naming convention (^[A-Za-z][A-Za-z0-9_-]{0,99}$).`);
    }
  }

  for (const [id, count] of idCounts.entries()) {
    if (count > 1) {
      errors.push(`Duplicate ID "${id}" detected ${count} times. Navigable page IDs must be unique.`);
    } else {
      pageIds.push(id);
    }
  }

  if (pageIds.length < 2) {
    warnings.push(`Only ${pageIds.length} valid page ID(s) detected. A visual book typically has multiple sections/pages.`);
  }

  // Check for external scripts
  const scripts = doc.querySelectorAll("script[src]");
  for (const script of Array.from(scripts)) {
    const src = script.getAttribute("src") || "";
    if (/^https?:\/\//i.test(src)) {
      warnings.push(`External remote script "${src}" detected. Sandboxed offline reader may block network requests.`);
    }
  }

  // Check for protocol bridge script
  hasProtocolScript = html.includes(BOOK_MESSAGE_PROTOCOL);
  if (!hasProtocolScript) {
    warnings.push("The standard communication bridge script ('index-dictionary.book') was not found in the HTML. Reader page tracking may be disabled unless injected.");
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    pageIds,
    hasProtocolScript,
    titleSuggestion
  };
}

export function injectProtocolBridge(html: string, bookId: string): string {
  const bridgeScript = `
<script>
(function() {
  var bookId = "${bookId}";
  var hasSentReady = false;
  function notifyParent(pageId) {
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({
        protocol: "${BOOK_MESSAGE_PROTOCOL}",
        version: 1,
        type: hasSentReady ? "page-changed" : "book-ready",
        bookId: bookId,
        pageId: pageId
      }, "*");
      hasSentReady = true;
    }
  }
  window.addEventListener("DOMContentLoaded", function() {
    var initialPage = window.location.hash.replace(/^#/, "") || document.body.querySelector("[id]")?.id || "cover";
    notifyParent(initialPage);
  });
  window.addEventListener("hashchange", function() {
    var page = window.location.hash.replace(/^#/, "");
    if (page) notifyParent(page);
  });
})();
</script>
`;
  if (html.includes("</body>")) {
    return html.replace("</body>", `${bridgeScript}\n</body>`);
  }
  return html + bridgeScript;
}
