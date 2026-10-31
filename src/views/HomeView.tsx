import React from 'react';
import { Link } from 'react-router-dom';

export const HomeView: React.FC = () => {
  return (
    <div className="comic-homepage-wrapper">
      {/* =========================================================
          HERO SECTION: COOL CHEWING LLAMA WITH KALA CHASMA
          ========================================================= */}
      <section className="comic-hero-llama-card">
        <div className="comic-hero-grid">
          {/* Left Text & Actions */}
          <div className="comic-hero-intro">
            <p className="comic-hero-description-lead">
              IndexLib is an open-source visual web library and authoring platform for short, structured, multi-page HTML books. It combines hierarchical taxonomy exploration, a semantic concept knowledge graph, curated learning paths, an offline-first private library, and sandboxed interactive reading.
            </p>

            <div className="comic-hero-buttons">
              <Link to="/concepts" className="btn comic-action-btn comic-btn-lime">
                1) LEARN →
              </Link>
              <Link to="/reels" className="btn comic-action-btn comic-btn-blue">
                2) SCROLL ➔
              </Link>
            </div>
          </div>

          {/* Right Mascot: Cool Chewing Llama with Sunglasses */}
          <div className="comic-mascot-showcase">
            <div className="comic-speech-bubble">
              "Chew on ideas, not just gum! Tap Learn or Scroll to begin."
            </div>

            <div className="comic-llama-stage">
              <svg
                viewBox="0 0 240 240"
                className="comic-llama-svg"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Llama Back Hair Tufts */}
                <ellipse cx="120" cy="130" rx="48" ry="65" fill="#fdfcf0" stroke="#20241f" strokeWidth="4" />
                <path d="M 85 90 Q 70 70 80 50 Q 95 65 92 88" fill="#fdfcf0" stroke="#20241f" strokeWidth="4" />
                <path d="M 155 90 Q 170 70 160 50 Q 145 65 148 88" fill="#fdfcf0" stroke="#20241f" strokeWidth="4" />

                {/* Ear Insides */}
                <path d="M 83 75 Q 77 60 84 55 Q 89 65 87 75" fill="#ffb99d" />
                <path d="M 157 75 Q 163 60 156 55 Q 151 65 153 75" fill="#ffb99d" />

                {/* Fluffy Head */}
                <circle cx="120" cy="110" r="42" fill="#fffef7" stroke="#20241f" strokeWidth="4" />
                <circle cx="100" cy="85" r="14" fill="#fffef7" stroke="#20241f" strokeWidth="3" />
                <circle cx="120" cy="78" r="16" fill="#fffef7" stroke="#20241f" strokeWidth="3" />
                <circle cx="140" cy="85" r="14" fill="#fffef7" stroke="#20241f" strokeWidth="3" />

                {/* Kala Chasma (Iconic Cool Black Sunglasses) */}
                <rect x="85" y="102" width="32" height="20" rx="5" fill="#111" stroke="#20241f" strokeWidth="3" />
                <rect x="123" y="102" width="32" height="20" rx="5" fill="#111" stroke="#20241f" strokeWidth="3" />
                <line x1="117" y1="110" x2="123" y2="110" stroke="#20241f" strokeWidth="4" />
                <line x1="85" y1="108" x2="75" y2="104" stroke="#20241f" strokeWidth="4" />
                <line x1="155" y1="108" x2="165" y2="104" stroke="#20241f" strokeWidth="4" />
                {/* Lens Reflections */}
                <line x1="89" y1="106" x2="102" y2="118" stroke="#00e5ff" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="127" y1="106" x2="140" y2="118" stroke="#00e5ff" strokeWidth="2.5" strokeLinecap="round" />

                {/* Llama Muzzle */}
                <ellipse cx="120" cy="138" rx="20" ry="16" fill="#f4ebd9" stroke="#20241f" strokeWidth="3" />
                <ellipse cx="114" cy="133" rx="2.5" ry="3.5" fill="#20241f" />
                <ellipse cx="126" cy="133" rx="2.5" ry="3.5" fill="#20241f" />

                {/* Animated Chewing Bubblegum */}
                <circle cx="132" cy="144" r="14" className="llama-bubblegum" />
                <circle cx="128" cy="140" r="4" fill="#fff" opacity="0.6" />

                {/* Gold Chain / Cool Collar */}
                <path d="M 98 165 Q 120 180 142 165" fill="none" stroke="#eab308" strokeWidth="5" strokeLinecap="round" />
                <circle cx="120" cy="174" r="6" fill="#eab308" stroke="#20241f" strokeWidth="2" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          FOOTER (EXACT SPECIFIED TEXT ONLY)
          ========================================================= */}
      <footer className="comic-exact-footer">
        <div className="comic-footer-container">
          <p className="comic-footer-text">
            IndexLib is an open-source visual web library and authoring platform for short, structured, multi-page HTML books. It combines hierarchical taxonomy exploration, a semantic concept knowledge graph, curated learning paths, an offline-first private library, and sandboxed interactive reading.
          </p>
        </div>
      </footer>
    </div>
  );
};
