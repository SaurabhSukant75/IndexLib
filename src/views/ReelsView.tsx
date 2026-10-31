import React from 'react';
import { Link } from 'react-router-dom';

export const ReelsView: React.FC = () => {
  return (
    <div style={{ maxWidth: 800, margin: '40px auto', textAlign: 'center', padding: '0 20px' }}>
      <div
        style={{
          background: '#fff',
          border: '3px solid var(--color-ink)',
          borderRadius: 16,
          padding: '48px 32px',
          boxShadow: '6px 6px 0 var(--color-ink)',
        }}
      >
        <div
          style={{
            display: 'inline-block',
            background: 'var(--color-ink)',
            color: 'var(--color-accent)',
            fontSize: '0.85rem',
            fontWeight: 900,
            letterSpacing: '1.5px',
            padding: '4px 12px',
            borderRadius: 4,
            marginBottom: 16,
          }}
        >
          ⚡ FEATURE IN PIPELINE
        </div>

        <h1
          style={{
            fontFamily: 'var(--font-editorial)',
            fontSize: 'clamp(2.2rem, 4vw, 3rem)',
            fontWeight: 900,
            lineHeight: 1.1,
            color: 'var(--color-ink)',
            marginBottom: 16,
          }}
        >
          Reel Discovery Service
        </h1>

        <p
          style={{
            fontSize: '1.15rem',
            color: 'var(--color-muted)',
            lineHeight: 1.6,
            maxWidth: 580,
            margin: '0 auto 28px',
          }}
        >
          We are building a dedicated vertical full-screen reel streaming player with seamless video-style card flipping, interactive bookmarks, and audio book narration.
        </p>

        <div
          style={{
            display: 'inline-block',
            background: 'var(--color-peach)',
            border: '2px solid var(--color-ink)',
            borderRadius: 8,
            padding: '10px 20px',
            fontWeight: 900,
            fontSize: '1rem',
            letterSpacing: '1px',
            boxShadow: '3px 3px 0 var(--color-ink)',
            marginBottom: 32,
          }}
        >
          COMING SOON 🚀
        </div>

        <div>
          <Link
            to="/concepts"
            className="btn comic-action-btn comic-btn-lime"
            style={{ textDecoration: 'none', display: 'inline-block' }}
          >
            Explore 100 Visual Concepts →
          </Link>
        </div>
      </div>
    </div>
  );
};
