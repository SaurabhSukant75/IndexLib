import React from 'react';
import { Link } from 'react-router-dom';
import { CatalogBook, ConceptNode } from '../types';

interface HomeViewProps {
  books: CatalogBook[];
  concepts: ConceptNode[];
}

export const HomeView: React.FC<HomeViewProps> = ({ books, concepts }) => {
  const publishedBooks = books.filter(b => b.status === 'published' || !b.status);

  return (
    <div>
      <p className="page-eyebrow">Welcome to IndexLib</p>
      <h1 className="page-title">Curated visual books for curious minds.</h1>
      <p className="page-lede">
        IndexLib is an open digital library of structured visual HTML books. Follow ideas through our concept graph, explore hierarchical topics, or follow a curated learning path.
      </p>

      {/* Action shortcuts */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 36, flexWrap: 'wrap' }}>
        <Link to="/concepts" className="btn btn-primary">
          Explore Concept Graph →
        </Link>
        <Link to="/topics" className="btn">
          Browse Topics
        </Link>
        <Link to="/paths" className="btn">
          Learning Paths
        </Link>
        <Link to="/publish" className="btn" style={{ marginLeft: 'auto' }}>
          ＋ Publish a Book
        </Link>
      </div>

      {/* Featured Books Grid */}
      <section style={{ marginTop: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ fontFamily: 'var(--font-editorial)', fontSize: '1.6rem' }}>Featured Visual Books</h2>
          <Link to="/topics" style={{ fontSize: '0.9rem', color: 'var(--color-ink)', fontWeight: 600 }}>
            View all ({publishedBooks.length}) →
          </Link>
        </div>

        <div className="book-grid">
          {publishedBooks.slice(0, 6).map((book) => (
            <Link
              key={book.id}
              to={`/read/${book.id}`}
              className="book-card"
            >
              <div>
                <div className="book-card-header">
                  <span className="badge badge-accent">
                    {book.readingMinutes} min read
                  </span>
                  {book.isImported && <span className="badge badge-warning">Local</span>}
                </div>
                <h3 className="book-card-title">{book.title}</h3>
                <p className="book-card-summary">{book.summary}</p>
              </div>

              <div className="book-card-footer">
                <span>{book.tags.join(' · ') || 'Visual Book'}</span>
                <span style={{ fontWeight: 600 }}>Read Now →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Concept Cloud */}
      <section style={{ marginTop: 48, background: 'var(--color-surface)', padding: 24, borderRadius: 'var(--radius-md)', border: '1px solid var(--color-line)' }}>
        <p className="page-eyebrow">Knowledge Web</p>
        <h3 style={{ fontFamily: 'var(--font-editorial)', fontSize: '1.4rem', marginBottom: 12 }}>Connected Concepts</h3>
        <p style={{ color: 'var(--color-muted)', fontSize: '0.95rem', marginBottom: 16 }}>
          Explore the semantic relationships between ideas. Click on a concept to open the interactive graph.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {concepts.map(concept => (
            <Link
              key={concept.id}
              to={`/concepts?id=${concept.id}`}
              className="btn"
              style={{ fontSize: '0.85rem' }}
            >
              ● {concept.name}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};
