import React from 'react';
import { Link } from 'react-router-dom';

export const HomeView: React.FC = () => {
  return (
    <div className="home-3d-wrapper">
      {/* =========================================================
          3D CARTOON-STYLE GRAND LIBRARY HERO SECTION
          ========================================================= */}
      <section className="home-3d-hero" aria-label="IndexLib 3D library home">
        {/* Main 3D Artwork Layer */}
        <div className="home-3d-art-wrapper">
          <img
            className="home-3d-art"
            src="./images/hero-3d-library.png"
            alt="A child reading a book in an immersive 3D magical library with open hero book and wooden signboards"
          />

          {/* Interactive Overlay Links mapped over the 3D Artwork */}
          {/* 1) Hero Book CTA: Learn Concepts */}
          <Link
            to="/concepts"
            className="art-link learn"
            aria-label="Learn concepts"
            title="Learn Concepts"
          />

          {/* 2) Hero Book CTA: Scroll Reels */}
          <Link
            to="/reels"
            className="art-link reels"
            aria-label="Scroll reels"
            title="Scroll Reels"
          />

          {/* 3) Library Signboard: Concepts */}
          <Link
            to="/concepts"
            className="art-link concepts"
            aria-label="Explore Concepts"
            title="Concepts"
          />

          {/* 4) Library Signboard: My Learning */}
          <Link
            to="/paths"
            className="art-link learning"
            aria-label="My Learning Paths"
            title="My Learning"
          />

          {/* 5) Library Signboard: My Space / Vault */}
          <Link
            to="/library?tab=history"
            className="art-link space"
            aria-label="My Space Vault and History"
            title="My Space"
          />
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

