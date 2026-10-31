import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CatalogBook, ConceptNode } from '../types';

interface HomeViewProps {
  books: CatalogBook[];
  concepts: ConceptNode[];
}

export const HomeView: React.FC<HomeViewProps> = ({ books, concepts }) => {
  const publishedBooks = books.filter(b => b.status === 'published' || !b.status);
  const [activeFilter, setActiveFilter] = useState<'all' | 'focus' | 'tech' | 'design'>('all');

  const filteredBooks = publishedBooks.filter(book => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'focus') return book.tags.some(t => /focus|attention|human/i.test(t));
    if (activeFilter === 'tech') return book.tags.some(t => /tech|system/i.test(t));
    if (activeFilter === 'design') return book.tags.some(t => /design|culture/i.test(t));
    return true;
  });

  return (
    <div className="comic-library-page">
      {/* Comic Hero Banner */}
      <section className="comic-hero">
        <div className="comic-hero-badge">⚡ ISSUE #1 · VISUAL EDITION</div>
        <h1 className="comic-hero-title">
          WELCOME TO THE <span className="comic-highlight">INDEXLIB</span> VAULT.
        </h1>
        <p className="comic-hero-speech">
          "Where complex ideas transform into bite-sized, illustrated comic books for curious minds!"
        </p>

        <div className="comic-hero-actions">
          <Link to="/concepts" className="btn comic-btn comic-btn-yellow">
            💡 Explore Concepts
          </Link>
          <Link to="/paths" className="btn comic-btn comic-btn-blue">
            🧭 Learning Paths
          </Link>
          <Link to="/library?tab=history" className="btn comic-btn comic-btn-orange">
            📜 My Space
          </Link>
        </div>
      </section>

      {/* Comic Shelf Bar */}
      <div className="comic-shelf-filter">
        <div className="comic-shelf-title">
          <span className="comic-star">★</span> CURATED COMIC SHELVES
        </div>
        <div className="comic-filter-tags">
          <button
            onClick={() => setActiveFilter('all')}
            className={`comic-tag-btn ${activeFilter === 'all' ? 'active' : ''}`}
          >
            All Issues ({publishedBooks.length})
          </button>
          <button
            onClick={() => setActiveFilter('focus')}
            className={`comic-tag-btn ${activeFilter === 'focus' ? 'active' : ''}`}
          >
            🧠 Focus & Attention
          </button>
          <button
            onClick={() => setActiveFilter('tech')}
            className={`comic-tag-btn ${activeFilter === 'tech' ? 'active' : ''}`}
          >
            ⚡ Technology & Systems
          </button>
          <button
            onClick={() => setActiveFilter('design')}
            className={`comic-tag-btn ${activeFilter === 'design' ? 'active' : ''}`}
          >
            🎨 Design & Society
          </button>
        </div>
      </div>

      {/* Comic Book Shelf Grid */}
      <div className="comic-book-grid">
        {filteredBooks.map((book, idx) => {
          const colors = ['#d5ff58', '#b9d7f6', '#ffb99d', '#ded7f5', '#e7e3d4'];
          const accentColor = colors[idx % colors.length];

          return (
            <Link
              key={book.id}
              to={`/read/${book.id}`}
              className="comic-card"
            >
              {/* Comic Book Cover Art Header */}
              <div className="comic-card-cover" style={{ backgroundColor: accentColor }}>
                <div className="comic-card-ribbon">
                  <span>{book.readingMinutes} MIN READ</span>
                  <span className="comic-issue-no">VOL. {String(idx + 1).padStart(2, '0')}</span>
                </div>
                <div className="comic-cover-art">
                  <div className="comic-cover-icon">📖</div>
                  <h3 className="comic-cover-heading">{book.title}</h3>
                </div>
                <div className="comic-sound-effect">READ!</div>
              </div>

              {/* Comic Book Details */}
              <div className="comic-card-body">
                <p className="comic-card-desc">{book.summary}</p>
                <div className="comic-card-meta">
                  <div className="comic-tag-pills">
                    {book.tags.map(tag => (
                      <span key={tag} className="comic-pill">#{tag}</span>
                    ))}
                  </div>
                  <span className="comic-read-link">OPEN ➔</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Knowledge Web Comic Box */}
      <section className="comic-callout-panel">
        <div className="comic-callout-header">
          <div className="comic-badge-strip">DYNAMIC CONCEPT MAP</div>
          <h2>Follow ideas across interconnected universe nodes!</h2>
          <p>
            Evergreen principles meet today’s trending digital interface patterns. Click to navigate directly into our concept graph.
          </p>
        </div>

        <div className="comic-chips-cloud">
          {concepts.map((concept, i) => (
            <Link
              key={concept.id}
              to={`/concepts?id=${concept.id}`}
              className={`comic-chip ${i % 2 === 0 ? 'chip-evergreen' : 'chip-trending'}`}
            >
              {i % 2 === 0 ? '🌲 ' : '🔥 '} {concept.name}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};
