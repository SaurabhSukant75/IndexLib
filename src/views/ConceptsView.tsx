import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { CatalogBook, ConceptRelation } from '../types';
import { CONCEPTS_100 } from '../data/concepts100';

interface ConceptsViewProps {
  concepts?: any[];
  relations?: ConceptRelation[];
  books?: CatalogBook[];
}

export const ConceptsView: React.FC<ConceptsViewProps> = () => {
  const [filterTab, setFilterTab] = useState<'all' | 'evergreen' | 'trending'>('all');
  const [selectedTheme, setSelectedTheme] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'num-asc' | 'a-z' | 'z-a'>('num-asc');

  // Extract themes
  const allThemes = useMemo(() => {
    const set = new Set<string>();
    CONCEPTS_100.forEach(c => set.add(c.theme));
    return Array.from(set);
  }, []);

  // Filtered and sorted concepts
  const displayedConcepts = useMemo(() => {
    const filtered = CONCEPTS_100.filter(c => {
      if (filterTab !== 'all' && c.category !== filterTab) return false;
      if (selectedTheme !== 'all' && c.theme !== selectedTheme) return false;
      return true;
    });

    return filtered.sort((a, b) => {
      if (sortOrder === 'a-z') return a.name.localeCompare(b.name);
      if (sortOrder === 'z-a') return b.name.localeCompare(a.name);
      return a.num.localeCompare(b.num);
    });
  }, [filterTab, selectedTheme, sortOrder]);

  const colors = ['#d5ff58', '#b9d7f6', '#ffb99d', '#ded7f5', '#e7e3d4'];

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', paddingBottom: 60 }}>
      {/* Comic Filter and Sorting Controls Toolbar */}
      <div className="comic-shelf-filter" style={{ marginBottom: 24, paddingBottom: 16 }}>
        <div className="comic-filter-tags">
          <button
            onClick={() => setFilterTab('all')}
            className={`comic-tag-btn ${filterTab === 'all' ? 'active' : ''}`}
          >
            All Concepts ({CONCEPTS_100.length})
          </button>
          <button
            onClick={() => setFilterTab('evergreen')}
            className={`comic-tag-btn ${filterTab === 'evergreen' ? 'active' : ''}`}
          >
            🌲 Evergreen
          </button>
          <button
            onClick={() => setFilterTab('trending')}
            className={`comic-tag-btn ${filterTab === 'trending' ? 'active' : ''}`}
          >
            🔥 Trending
          </button>
        </div>

        {/* Theme Filter and A-Z Sorting Options */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          <select
            value={selectedTheme}
            onChange={(e) => setSelectedTheme(e.target.value)}
            style={{
              padding: '6px 12px',
              borderRadius: 8,
              border: '2px solid var(--color-ink)',
              background: '#fff',
              fontWeight: 700,
              fontSize: '0.84rem',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="all">All Themes ({allThemes.length})</option>
            {allThemes.map(theme => (
              <option key={theme} value={theme}>
                Theme: {theme}
              </option>
            ))}
          </select>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as any)}
            style={{
              padding: '6px 12px',
              borderRadius: 8,
              border: '2px solid var(--color-ink)',
              background: '#fff',
              fontWeight: 700,
              fontSize: '0.84rem',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="num-asc">Sort: Vol # (001 - 100)</option>
            <option value="a-z">Sort: A to Z</option>
            <option value="z-a">Sort: Z to A</option>
          </select>
        </div>
      </div>

      {/* Comic Book Shelf Grid */}
      <div className="comic-book-grid">
        {displayedConcepts.map((concept, idx) => {
          const accentColor = colors[idx % colors.length];
          const targetBookId = concept.bookId || `book-${concept.num}`;

          return (
            <Link
              key={concept.num}
              to={`/read/${targetBookId}`}
              className="comic-card"
            >
              {/* Comic Book Cover Art Header */}
              <div className="comic-card-cover" style={{ backgroundColor: accentColor }}>
                <div className="comic-card-ribbon">
                  <span>5 MIN READ</span>
                  <span className="comic-issue-no">VOL. {concept.num}</span>
                </div>
                <div className="comic-cover-art">
                  <div className="comic-cover-icon">📖</div>
                  <h3 className="comic-cover-heading">{concept.name} · {concept.num}</h3>
                </div>
                <div className="comic-sound-effect">READ!</div>
              </div>

              {/* Comic Book Details */}
              <div className="comic-card-body">
                <p className="comic-card-desc">{concept.description}</p>
                <div className="comic-card-meta">
                  <div className="comic-tag-pills">
                    <span className="comic-pill">
                      #{concept.category === 'trending' ? 'Trending' : 'Evergreen'}
                    </span>
                    <span className="comic-pill">#{concept.theme}</span>
                  </div>
                  <span className="comic-read-link">OPEN ➔</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {displayedConcepts.length === 0 && (
        <div
          style={{
            background: '#fff',
            border: '3px solid var(--color-ink)',
            borderRadius: 12,
            padding: 40,
            textAlign: 'center',
            marginTop: 20,
            boxShadow: '4px 4px 0 var(--color-ink)',
          }}
        >
          <p style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-ink)', margin: 0 }}>
            No concepts matched the selected theme.
          </p>
          <button
            onClick={() => {
              setFilterTab('all');
              setSelectedTheme('all');
            }}
            className="btn comic-btn comic-btn-yellow"
            style={{ marginTop: 14 }}
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};
