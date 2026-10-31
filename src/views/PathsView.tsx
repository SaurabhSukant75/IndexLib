import React from 'react';
import { Link } from 'react-router-dom';
import { CatalogBook, LearningPath } from '../types';

interface PathsViewProps {
  paths: LearningPath[];
  books: CatalogBook[];
}

export const PathsView: React.FC<PathsViewProps> = ({ paths, books }) => {
  return (
    <div>
      <p className="page-eyebrow">Structured Progression</p>
      <h1 className="page-title">Curated Learning Paths.</h1>
      <p className="page-lede">
        Unlike the concept graph which encourages wandering, learning paths present a deliberate, ordered sequence of books curated by editors.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        {paths.map(path => (
          <div
            key={path.id}
            style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-line)',
              borderRadius: 'var(--radius-md)',
              padding: 28,
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <h2 style={{ fontFamily: 'var(--font-editorial)', fontSize: '1.6rem', marginBottom: 6 }}>
              {path.title}
            </h2>
            <p style={{ color: 'var(--color-muted)', fontSize: '0.95rem', marginBottom: 24, maxWidth: 640 }}>
              {path.description}
            </p>

            <h3 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--color-muted)', marginBottom: 16 }}>
              Path Sequence ({path.items.length} steps)
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {path.items.map((item, index) => {
                const book = books.find(b => b.id === item.bookId);
                if (!book) return null;

                return (
                  <Link
                    key={`${path.id}-${item.bookId}`}
                    to={`/read/${book.id}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 16,
                      padding: 14,
                      background: 'var(--color-background)',
                      border: '1px solid var(--color-line)',
                      borderRadius: 'var(--radius-sm)',
                      textDecoration: 'none',
                      color: 'inherit',
                      transition: 'transform 0.15s, border-color 0.15s',
                    }}
                  >
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        background: 'var(--color-ink)',
                        color: 'var(--color-accent)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        fontSize: '0.9rem',
                        flexShrink: 0,
                      }}
                    >
                      {index + 1}
                    </div>

                    <div style={{ flex: 1 }}>
                      <strong style={{ fontSize: '1rem', display: 'block', marginBottom: 2 }}>
                        {book.title}
                      </strong>
                      <small style={{ color: 'var(--color-muted)', fontSize: '0.85rem' }}>
                        {item.note || book.summary} · {book.readingMinutes} min
                      </small>
                    </div>

                    <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>Start →</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
