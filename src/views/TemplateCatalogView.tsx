import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export interface BookTemplate {
  id: string;
  name: string;
  tagline: string;
  description: string;
  themeColor: string;
  badge: string;
  pageCount: number;
  previewSvg: string;
  generateHtml: (title: string, author: string) => string;
}

export const BOOK_TEMPLATES: BookTemplate[] = [
  {
    id: 'editorial-standard',
    name: 'Classic Editorial Magazine',
    tagline: 'Warm paper texture with serif typography & callout boxes',
    description: 'Perfect for deep essays, philosophy, psychology, and long-form analysis broken down into visual micro-chapters.',
    themeColor: '#d5ff58',
    badge: 'POPULAR',
    pageCount: 5,
    previewSvg: '📰',
    generateHtml: (title, author) => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title || 'My Visual Book'}</title>
<style>
:root{--paper:#f7f3eb;--ink:#20241f;--muted:#74776f;--line:#ded8cb;--accent:#d5ff58}
*{box-sizing:border-box}body{margin:0;background:var(--paper);color:var(--ink);font-family:Georgia,serif;overflow:hidden}
main{height:100dvh;padding:16px;display:flex;flex-direction:column;align-items:center;justify-content:center}
.stage{width:min(100%,900px);height:min(700px,calc(100dvh - 100px));position:relative}
.page{position:absolute;inset:0;background:#fffdf8;border:2px solid var(--ink);border-radius:12px;box-shadow:6px 6px 0 var(--ink);padding:40px;overflow:auto;opacity:0;pointer-events:none;transition:opacity .2s,transform .2s;transform:translateX(16px)}
.page.active{opacity:1;pointer-events:auto;transform:translateX(0)}
.cover{background:var(--accent)}h1{font-size:clamp(40px,6vw,72px);margin:20px 0 10px}h2{font-size:32px;margin:16px 0 10px}p{font-size:18px;line-height:1.6;color:#374151}
.quote{font-size:26px;border-left:4px solid var(--ink);padding-left:18px;margin:24px 0;font-style:italic}
.controls{display:flex;gap:12px;margin-top:16px;align-items:center}
.btn{padding:8px 16px;background:#fff;border:2px solid var(--ink);border-radius:6px;font-weight:bold;cursor:pointer}
</style>
</head>
<body>
<main>
<div class="stage">
  <article class="page cover active" id="cover" data-name="Cover">
    <div style="font-size:12px;text-transform:uppercase;letter-spacing:1px;color:var(--muted)">Visual Book · Edition 01</div>
    <h1>${title || 'The Knowledge Canvas'}</h1>
    <p>By <strong>${author || 'Independent Creator'}</strong></p>
    <div style="margin-top:auto">Swipe or click Next below to read ➔</div>
  </article>
  <article class="page" id="chapter-1" data-name="Introduction">
    <h2>01 / The Core Question</h2>
    <p>Every breakthrough starts with a curious inquiry. What if complex knowledge could be understood in minutes rather than hours?</p>
    <div class="quote">“Simplicity is about subtracting the obvious and adding the meaningful.”</div>
    <p>Continue exploring the key takeaways across the following sections.</p>
  </article>
  <article class="page" id="chapter-2" data-name="The System">
    <h2>02 / How It Works</h2>
    <p>Break down the subject into its primary interconnected concepts. When you change one variable, what happens to the surrounding ecosystem?</p>
  </article>
  <article class="page" id="recap" data-name="Key Takeaways">
    <h2>03 / Final Summary</h2>
    <p>Remember the main lessons and share this book with other curious minds.</p>
  </article>
</div>
<div class="controls">
  <button class="btn" id="prev">← Prev</button>
  <span id="counter" style="font-size:13px;font-weight:bold">Cover</span>
  <button class="btn" id="next">Next →</button>
</div>
</main>
<script>
(()=>{
  const pages = [...document.querySelectorAll('.page')];
  let cur = 0;
  const bookId = '${title ? title.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'new-book'}';
  function sendMsg(type){if(window.parent&&window.parent!==window){window.parent.postMessage({protocol:'index-dictionary.book',version:1,type,bookId,pageId:pages[cur].id},'*')}}
  function jump(i){
    cur = Math.max(0, Math.min(pages.length - 1, i));
    pages.forEach((p, idx)=>p.classList.toggle('active', idx === cur));
    document.getElementById('counter').textContent = (cur+1) + ' / ' + pages.length;
    sendMsg('page-changed');
  }
  document.getElementById('next').onclick = ()=>jump(cur+1);
  document.getElementById('prev').onclick = ()=>jump(cur-1);
  sendMsg('book-ready');
})();
</script>
</body>
</html>`,
  },
  {
    id: 'comic-pop',
    name: 'Bold Pop-Art Comic',
    tagline: 'High energy, vibrant cards, action badges & sound effects',
    description: 'Designed for fast-paced tech explainers, step-by-step systems, modern product thinking, and memorable takeaways.',
    themeColor: '#b9d7f6',
    badge: 'COMIC STYLE',
    pageCount: 4,
    previewSvg: '⚡',
    generateHtml: (title, author) => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title || 'Comic Explainer'}</title>
<style>
:root{--ink:#1c1917;--yellow:#fde047;--blue:#93c5fd;--red:#f87171}
*{box-sizing:border-box}body{margin:0;background:#fef08a;color:var(--ink);font-family:Impact,sans-serif;overflow:hidden}
main{height:100dvh;padding:20px;display:flex;flex-direction:column;align-items:center;justify-content:center}
.stage{width:min(100%,880px);height:min(660px,calc(100dvh - 100px));position:relative}
.page{position:absolute;inset:0;background:#fff;border:4px solid var(--ink);border-radius:16px;box-shadow:8px 8px 0 var(--ink);padding:32px;overflow:auto;opacity:0;pointer-events:none;transform:scale(0.96);transition:all .2s}
.page.active{opacity:1;pointer-events:auto;transform:scale(1)}
h1{font-size:clamp(44px,7vw,80px);line-height:0.95;margin:10px 0;letter-spacing:-1px}
h2{font-size:36px;margin:8px 0}
p{font-family:-apple-system,sans-serif;font-size:18px;line-height:1.5;color:#292524}
.bubble{background:#fef9c3;border:3px solid var(--ink);border-radius:12px;padding:16px;margin:20px 0;box-shadow:4px 4px 0 var(--ink);font-style:italic}
.controls{display:flex;gap:12px;margin-top:16px}
.btn{padding:10px 20px;background:var(--yellow);border:3px solid var(--ink);border-radius:8px;font-weight:900;box-shadow:4px 4px 0 var(--ink);cursor:pointer}
</style>
</head>
<body>
<main>
<div class="stage">
  <article class="page active" id="cover" data-name="Cover" style="background:#bae6fd">
    <div style="background:var(--ink);color:#fff;display:inline-block;padding:4px 10px;font-size:13px;border-radius:4px">ISSUE #01 · VISUAL EDITION</div>
    <h1>${title || 'SUPERPOWER OF FOCUS!'}</h1>
    <p>Written by <strong>${author || 'Creator'}</strong></p>
    <div class="bubble">“Hold onto your seats! We are about to decode how systems capture your brain!”</div>
  </article>
  <article class="page" id="scene-1" data-name="The Action">
    <h2>BOOM! ENTER THE ALGORITHM</h2>
    <p>Every tap, swipe, and scroll feeds into an invisible feedback mechanism.</p>
    <div class="bubble">Attention is not given—it is captured by design!</div>
  </article>
  <article class="page" id="scene-2" data-name="The Solution">
    <h2>TAKE BACK CONTROL!</h2>
    <p>Here are three moves you can execute today to break the cycle and build your own fortress of focus.</p>
  </article>
</div>
<div class="controls">
  <button class="btn" id="prev">◀ BACK</button>
  <span id="counter" style="font-size:16px;font-weight:900;align-self:center">1 / 3</span>
  <button class="btn" id="next">NEXT ▶</button>
</div>
</main>
<script>
(()=>{
  const pages = [...document.querySelectorAll('.page')];
  let cur = 0;
  const bookId = '${title ? title.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'comic-book'}';
  function sendMsg(type){if(window.parent&&window.parent!==window){window.parent.postMessage({protocol:'index-dictionary.book',version:1,type,bookId,pageId:pages[cur].id},'*')}}
  function jump(i){
    cur = Math.max(0, Math.min(pages.length - 1, i));
    pages.forEach((p, idx)=>p.classList.toggle('active', idx === cur));
    document.getElementById('counter').textContent = (cur+1) + ' / ' + pages.length;
    sendMsg('page-changed');
  }
  document.getElementById('next').onclick = ()=>jump(cur+1);
  document.getElementById('prev').onclick = ()=>jump(cur-1);
  sendMsg('book-ready');
})();
</script>
</body>
</html>`,
  },
  {
    id: 'clean-technical',
    name: 'Minimal Technical Blueprint',
    tagline: 'Clean monospace accents, data tables, and structured grids',
    description: 'Optimal for technical documentation, architectural decision records (ADRs), developer guides, and data workflows.',
    themeColor: '#ded7f5',
    badge: 'TECHNICAL',
    pageCount: 5,
    previewSvg: '📐',
    generateHtml: (title, author) => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title || 'Technical Spec'}</title>
<style>
:root{--bg:#0f172a;--text:#f8fafc;--muted:#94a3b8;--cyan:#38bdf8;--panel:#1e293b}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--text);font-family:ui-monospace,monospace;overflow:hidden}
main{height:100dvh;padding:24px;display:flex;flex-direction:column;align-items:center;justify-content:center}
.stage{width:min(100%,940px);height:min(680px,calc(100dvh - 100px));position:relative}
.page{position:absolute;inset:0;background:var(--panel);border:1px solid #334155;border-radius:10px;padding:36px;overflow:auto;opacity:0;pointer-events:none;transition:opacity .2s}
.page.active{opacity:1;pointer-events:auto}
h1{font-size:38px;color:var(--cyan);margin:0 0 12px}h2{font-size:26px;color:var(--cyan);margin:0 0 12px}
p{font-size:16px;line-height:1.6;color:#cbd5e1}
code{background:#090d16;padding:2px 6px;border-radius:4px;color:#38bdf8}
pre{background:#090d16;padding:16px;border-radius:8px;border:1px solid #334155;overflow-x:auto}
.controls{display:flex;gap:12px;margin-top:16px}
.btn{padding:8px 16px;background:#334155;color:#fff;border:none;border-radius:6px;cursor:pointer;font-family:inherit}
</style>
</head>
<body>
<main>
<div class="stage">
  <article class="page active" id="overview" data-name="Overview">
    <div style="color:var(--muted);font-size:12px;margin-bottom:8px">// SPECIFICATION DOCUMENT</div>
    <h1>${title || 'SYSTEM ARCHITECTURE BLUEPRINT'}</h1>
    <p>Author: <code>${author || 'SysAdmin'}</code></p>
    <p>This technical guide establishes the system parameters, database models, and operational invariants.</p>
  </article>
  <article class="page" id="data-pipeline" data-name="Architecture">
    <h2>01 / DATA INGESTION PIPELINE</h2>
    <p>Incoming payloads undergo validation against standard JSON schemas before entering storage.</p>
    <pre>POST /api/v1/ingest
Content-Type: application/json</pre>
  </article>
  <article class="page" id="benchmarks" data-name="Benchmarks">
    <h2>02 / PERFORMANCE BENCHMARKS</h2>
    <p>Latency metrics consistently resolve under 15ms at 99th percentile across all regional nodes.</p>
  </article>
</div>
<div class="controls">
  <button class="btn" id="prev">← PREV</button>
  <span id="counter" style="color:var(--muted);align-self:center">Page 1</span>
  <button class="btn" id="next">NEXT →</button>
</div>
</main>
<script>
(()=>{
  const pages = [...document.querySelectorAll('.page')];
  let cur = 0;
  const bookId = '${title ? title.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'tech-doc'}';
  function sendMsg(type){if(window.parent&&window.parent!==window){window.parent.postMessage({protocol:'index-dictionary.book',version:1,type,bookId,pageId:pages[cur].id},'*')}}
  function jump(i){
    cur = Math.max(0, Math.min(pages.length - 1, i));
    pages.forEach((p, idx)=>p.classList.toggle('active', idx === cur));
    document.getElementById('counter').textContent = 'Page ' + (cur+1) + ' / ' + pages.length;
    sendMsg('page-changed');
  }
  document.getElementById('next').onclick = ()=>jump(cur+1);
  document.getElementById('prev').onclick = ()=>jump(cur-1);
  sendMsg('book-ready');
})();
</script>
</body>
</html>`,
  },
];

export const TemplateCatalogView: React.FC = () => {
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] = useState<BookTemplate>(BOOK_TEMPLATES[0]);
  const [bookTitle, setBookTitle] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [previewHtml, setPreviewHtml] = useState<string>(() => BOOK_TEMPLATES[0].generateHtml('Sample Book', 'Author'));

  const handleSelectTemplate = (template: BookTemplate) => {
    setSelectedTemplate(template);
    setPreviewHtml(template.generateHtml(bookTitle || 'Sample Visual Book', authorName || 'Creator'));
  };

  const handleCreateWithTemplate = () => {
    const finalHtml = selectedTemplate.generateHtml(
      bookTitle.trim() || selectedTemplate.name,
      authorName.trim() || 'Author'
    );

    // Save template HTML to sessionStorage so Publish Studio can load it immediately
    sessionStorage.setItem('indexlib_template_html', finalHtml);
    sessionStorage.setItem('indexlib_template_title', bookTitle.trim() || selectedTemplate.name);

    navigate('/publish?fromTemplate=true');
  };

  return (
    <div style={{ maxWidth: 1180, margin: '0 auto', paddingBottom: 60 }}>
      <p className="page-eyebrow">Design Studio · Starter Library</p>
      <h1 className="page-title">Book Template Catalog</h1>
      <p className="page-lede">
        Choose a production-ready, accessible HTML book template with built-in postMessage protocol scripts and responsive styling.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28, alignItems: 'start' }}>
        {/* Templates Picker */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {BOOK_TEMPLATES.map((tmpl) => {
            const isSelected = selectedTemplate.id === tmpl.id;
            return (
              <div
                key={tmpl.id}
                onClick={() => handleSelectTemplate(tmpl)}
                style={{
                  background: isSelected ? '#fdfbf7' : '#fff',
                  border: isSelected ? '3px solid #20241f' : '2px solid var(--color-line)',
                  borderRadius: 12,
                  padding: 20,
                  cursor: 'pointer',
                  boxShadow: isSelected ? '5px 5px 0 #20241f' : 'var(--shadow-sm)',
                  transition: 'all 0.15s',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: '1.6rem' }}>{tmpl.previewSvg}</span>
                    <strong style={{ fontSize: '1.2rem' }}>{tmpl.name}</strong>
                  </div>
                  <span className="badge badge-accent">{tmpl.badge}</span>
                </div>
                <p style={{ fontSize: '0.9rem', color: '#374151', margin: '4px 0 10px', fontWeight: 600 }}>
                  {tmpl.tagline}
                </p>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-muted)', margin: 0 }}>
                  {tmpl.description}
                </p>
              </div>
            );
          })}

          {/* Quick Customization Form */}
          <div style={{ background: '#fff', border: '3px solid #20241f', borderRadius: 12, padding: 22, boxShadow: '4px 4px 0 #20241f' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 12 }}>
              Initialize Your Book with {selectedTemplate.name}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: 4 }}>
                  Book Title
                </label>
                <input
                  type="text"
                  className="search-input"
                  style={{ borderRadius: 6 }}
                  placeholder="e.g. The Psychology of Habits"
                  value={bookTitle}
                  onChange={(e) => {
                    setBookTitle(e.target.value);
                    setPreviewHtml(selectedTemplate.generateHtml(e.target.value || 'Sample Book', authorName || 'Creator'));
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: 4 }}>
                  Author Display Name
                </label>
                <input
                  type="text"
                  className="search-input"
                  style={{ borderRadius: 6 }}
                  placeholder="Your Name"
                  value={authorName}
                  onChange={(e) => {
                    setAuthorName(e.target.value);
                    setPreviewHtml(selectedTemplate.generateHtml(bookTitle || 'Sample Book', e.target.value || 'Creator'));
                  }}
                />
              </div>

              <button
                type="button"
                className="btn btn-primary"
                onClick={handleCreateWithTemplate}
                style={{ fontSize: '0.95rem', padding: '10px 20px', marginTop: 8 }}
              >
                Create Book in Publish Studio ➔
              </button>
            </div>
          </div>
        </div>

        {/* Live Template Preview */}
        <div style={{ position: 'sticky', top: 80 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Template Live Canvas</h3>
            <span className="badge badge-accent">{selectedTemplate.name}</span>
          </div>

          <div
            style={{
              background: '#fff',
              border: '3px solid #20241f',
              borderRadius: 12,
              height: 560,
              overflow: 'hidden',
              boxShadow: '6px 6px 0 #20241f',
            }}
          >
            <iframe
              srcDoc={previewHtml}
              title="Template preview"
              style={{ width: '100%', height: '100%', border: 'none' }}
              sandbox="allow-scripts"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
