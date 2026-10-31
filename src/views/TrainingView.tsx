import React from 'react';
import { Link } from 'react-router-dom';

interface TrainingModule {
  id: string;
  title: string;
  category: string;
  duration: string;
  summary: string;
  steps: string[];
  templateId?: string;
}

export const TrainingView: React.FC = () => {
  const modules: TrainingModule[] = [
    {
      id: 'module-01',
      title: 'HTML Book Authoring: The Fundamentals',
      category: 'Authoring Basics',
      duration: '12 min',
      summary: 'Learn the HTML5 structure, required meta tags, semantic page containers, and styling practices for IndexLib books.',
      steps: [
        'Understand the HTML5 container architecture and isolated styles',
        'Define navigable page and chapter elements using unique IDs',
        'Implement responsive viewports and typography scaling',
        'Test book rendering inside sandboxed iframe containers',
      ],
      templateId: 'minimal',
    },
    {
      id: 'module-02',
      title: 'Bidirectional Protocol Bridge Integration',
      category: 'Technical Standard',
      duration: '15 min',
      summary: 'Master the index-dictionary.book postMessage protocol: page-changed notifications, TOC handshake, and deep-link synchronization.',
      steps: [
        'Initialize the postMessage protocol event dispatcher',
        'Emit book-ready signals with registered page IDs',
        'Synchronize active chapter hashes on user navigation',
        'Handle reader toolbar zoom and dark mode requests',
      ],
      templateId: 'classic',
    },
    {
      id: 'module-03',
      title: 'Visual Storytelling & Comic Style Design',
      category: 'Creative Design',
      duration: '18 min',
      summary: 'Design compelling visual callouts, SVG concept diagrams, tactile cards, and bite-sized panels that engage modern curious minds.',
      steps: [
        'Color blocking and bold retro comic stroke palettes',
        'Crafting responsive SVGs and diagrams without heavy dependencies',
        'Building micro-summaries and takeaway cards for each chapter',
        'Accessibility checks: high-contrast text and keyboard arrow support',
      ],
      templateId: 'comic',
    },
    {
      id: 'module-04',
      title: 'Publishing, Semantic Versioning & Moderation',
      category: 'Publishing Suite',
      duration: '10 min',
      summary: 'How to use Design Studio to publish new books, update existing editions with SemVer, write changelogs, and submit for admin approval.',
      steps: [
        'Importing HTML files directly into Design Studio',
        'Automated structural and protocol validation check',
        'Semantic versioning: bumping patch, minor, and major editions',
        'Understanding private vs public approval queue lifecycles',
      ],
    },
  ];

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', paddingBottom: 60 }}>
      <p className="page-eyebrow">IndexLib Academy</p>
      <h1 className="page-title">Creator Training & Guides</h1>
      <p className="page-lede">
        Step-by-step masterclasses and specifications on creating, styling, and publishing interactive HTML books for IndexLib.
      </p>

      {/* Overview Banner */}
      <div
        className="comic-card"
        style={{
          background: '#d5ff58',
          border: '3px solid #20241f',
          borderRadius: 12,
          padding: 24,
          boxShadow: '5px 5px 0 #20241f',
          marginBottom: 32,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <span style={{ fontSize: '1.5rem' }}>🎓</span>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 900, margin: 0 }}>
            The Visual Book Creator Standard
          </h2>
        </div>
        <p style={{ fontSize: '0.95rem', color: '#20241f', margin: 0, lineHeight: 1.5 }}>
          IndexLib visual books are standalone HTML5 single-file applications. They load instantly offline, render responsively across mobile and desktop, and communicate with the IndexLib shell via postMessage.
        </p>
      </div>

      {/* Modules List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {modules.map((mod, index) => (
          <div
            key={mod.id}
            style={{
              background: '#fff',
              border: '3px solid #20241f',
              borderRadius: 12,
              padding: 24,
              boxShadow: '4px 4px 0 #20241f',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="comic-issue-no">MODULE #{String(index + 1).padStart(2, '0')}</span>
                <span className="badge badge-accent">{mod.category}</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-muted)', fontWeight: 600 }}>⏱ {mod.duration}</span>
              </div>
              {mod.templateId && (
                <Link
                  to={`/templates?template=${mod.templateId}`}
                  className="btn"
                  style={{ fontSize: '0.8rem', padding: '4px 10px' }}
                >
                  ⚡ Try Template ➔
                </Link>
              )}
            </div>

            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: 8 }}>{mod.title}</h3>
            <p style={{ color: 'var(--color-muted)', fontSize: '0.92rem', marginBottom: 16 }}>{mod.summary}</p>

            {/* Checklist */}
            <div style={{ background: '#fdfcf9', border: '1.5px solid var(--color-line)', borderRadius: 8, padding: 16 }}>
              <strong style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 10 }}>
                Core Skills Covered:
              </strong>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 8 }}>
                {mod.steps.map((step, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: '0.88rem' }}>
                    <span style={{ color: '#166534', fontWeight: 'bold' }}>✓</span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Action Footer */}
      <div style={{ marginTop: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14 }}>
        <Link to="/templates" className="btn btn-primary" style={{ padding: '12px 24px', fontSize: '0.95rem' }}>
          Explore Template Catalog ➔
        </Link>
        <Link to="/publish" className="btn" style={{ padding: '12px 24px', fontSize: '0.95rem' }}>
          Open Design Studio ➔
        </Link>
      </div>
    </div>
  );
};
