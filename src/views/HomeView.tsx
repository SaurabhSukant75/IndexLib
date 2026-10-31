import React from 'react';
import { Link } from 'react-router-dom';

export const HomeView: React.FC = () => {
  return (
    <div className="home-view-wrapper">
      {/* =========================================================
          HERO SECTION: AI-POWERED DIGITAL WEB LIBRARY
          ========================================================= */}
      <section className="home-hero-section">
        {/* Top Badges */}
        <div className="home-badge-row">
          <span className="home-badge-ai">⚡ AI-POWERED VISUAL LIBRARY</span>
          <span className="home-badge-version">v2.0 · 100 CONCEPTS</span>
        </div>

        {/* Main Title */}
        <h1 className="home-hero-title">
          The Open Digital Library for Visual Mini-Books.
        </h1>

        {/* Lead Text (Strictly as specified by user) */}
        <p className="home-hero-lead">
          IndexLib is an open-source visual web library and authoring platform for short, structured, multi-page HTML books.
        </p>

        {/* Action Buttons */}
        <div className="home-hero-actions">
          <Link to="/concepts" className="btn home-btn-primary">
            1) LEARN CONCEPTS →
          </Link>
          <Link to="/reels" className="btn home-btn-secondary">
            2) SCROLL REELS ➔
          </Link>
        </div>

        {/* Interactive Feature Pills Highlight */}
        <div className="home-features-grid">
          <div className="home-feature-card">
            <span className="home-feature-badge">AI ARCHITECTURE</span>
            <h3>100 Index Dictionaries</h3>
            <p>Every concept is synthesized into an illustrated, structured multi-page mini-book.</p>
          </div>
          <div className="home-feature-card">
            <span className="home-feature-badge">SANDBOXED ENGINE</span>
            <h3>Interactive HTML Canvas</h3>
            <p>Read rich web books with live interactive scripts, diagrams, and responsive touch layout.</p>
          </div>
          <div className="home-feature-card">
            <span className="home-feature-badge">OFFLINE-FIRST</span>
            <h3>Private Local Vault</h3>
            <p>Reading progress, bookmarks, and private HTML book imports persist directly in your browser.</p>
          </div>
        </div>
      </section>

      {/* =========================================================
          INDUSTRY STANDARD PROFESSIONAL FOOTER
          ========================================================= */}
      <footer className="home-site-footer">
        <div className="home-footer-inner">
          <div className="home-footer-brand">
            <div className="home-footer-logo">
              <span className="home-logo-box">IL</span>
              <strong>IndexLib</strong>
            </div>
            <p className="home-footer-tagline">
              Open-source visual web library and AI-assisted authoring platform for structured HTML mini-books.
            </p>
          </div>

          <div className="home-footer-nav">
            <div className="home-footer-col">
              <h4>EXPLORE</h4>
              <Link to="/concepts">100 Concepts</Link>
              <Link to="/paths">Learning Paths</Link>
              <Link to="/reels">Reel Discovery</Link>
            </div>

            <div className="home-footer-col">
              <h4>STUDIO</h4>
              <Link to="/publish">Publish a Book</Link>
              <Link to="/templates">Template Catalog</Link>
              <Link to="/training">Creator Practice</Link>
            </div>

            <div className="home-footer-col">
              <h4>MY VAULT</h4>
              <Link to="/library?tab=all">All Issues</Link>
              <Link to="/library?tab=progress">In Progress</Link>
              <Link to="/library?tab=history">History & Bookmarks</Link>
              <Link to="/account">Reader Profile</Link>
            </div>
          </div>
        </div>

        <div className="home-footer-bottom">
          <p>© {new Date().getFullYear()} IndexLib. Open-Source AI-Powered Visual Web Platform.</p>
          <div className="home-footer-links">
            <a href="https://github.com/SaurabhSukant75/IndexLib" target="_blank" rel="noreferrer">
              GitHub Repository
            </a>
            <Link to="/account">Account Sync</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
