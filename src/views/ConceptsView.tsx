import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CatalogBook, ConceptRelation } from '../types';
import { CONCEPTS_100 } from '../data/concepts100';

interface ConceptsViewProps {
  concepts?: any[];
  relations?: ConceptRelation[];
  books?: CatalogBook[];
}

export const ConceptsView: React.FC<ConceptsViewProps> = ({
  books = [],
}) => {
  const navigate = useNavigate();
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
      // Category filter
      if (filterTab !== 'all' && c.category !== filterTab) {
        return false;
      }
      // Theme filter
      if (selectedTheme !== 'all' && c.theme !== selectedTheme) {
        return false;
      }
      return true;
    });

    // Sort
    return filtered.sort((a, b) => {
      if (sortOrder === 'a-z') {
        return a.name.localeCompare(b.name);
      }
      if (sortOrder === 'z-a') {
        return b.name.localeCompare(a.name);
      }
      return a.num.localeCompare(b.num);
    });
  }, [filterTab, selectedTheme, sortOrder]);

  // Book lookup map
  const booksMap = useMemo(() => {
    const map = new Map<string, CatalogBook>();
    books.forEach(b => map.set(b.id, b));
    return map;
  }, [books]);

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', paddingBottom: 60 }}>
      {/* Standard IndexLib Page Header */}
      <div style={{ marginBottom: 20 }}>
        <p className="page-eyebrow">Visual Dictionaries</p>
        <h1 className="page-title">Explore Concepts.</h1>
        <p className="page-lede">
          Foundational questions about how people think, how societies coordinate, how power moves, and how technology reshapes the world.
        </p>
      </div>

      {/* Filter and Sorting Controls Toolbar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          padding: '12px 16px',
          background: 'var(--color-surface)',
          border: '2px solid #20241f',
          borderRadius: 12,
          boxShadow: '3px 3px 0 #20241f',
          marginBottom: 24,
        }}
      >
        {/* Category Tabs without count */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button
            onClick={() => setFilterTab('all')}
            className="btn"
            style={{
              background: filterTab === 'all' ? '#20241f' : '#fff',
              color: filterTab === 'all' ? '#ffe600' : '#20241f',
              fontWeight: 700,
              fontSize: '0.85rem',
              border: '2px solid #20241f',
              padding: '6px 14px',
              borderRadius: 8,
              boxShadow: filterTab === 'all' ? '2px 2px 0 #20241f' : 'none',
            }}
          >
            All Concepts
          </button>
          <button
            onClick={() => setFilterTab('evergreen')}
            className="btn"
            style={{
              background: filterTab === 'evergreen' ? '#166534' : '#fff',
              color: filterTab === 'evergreen' ? '#fff' : '#166534',
              fontWeight: 700,
              fontSize: '0.85rem',
              border: '2px solid #166534',
              padding: '6px 14px',
              borderRadius: 8,
              boxShadow: filterTab === 'evergreen' ? '2px 2px 0 #20241f' : 'none',
            }}
          >
            🌲 Evergreen
          </button>
          <button
            onClick={() => setFilterTab('trending')}
            className="btn"
            style={{
              background: filterTab === 'trending' ? '#ea580c' : '#fff',
              color: filterTab === 'trending' ? '#fff' : '#ea580c',
              fontWeight: 700,
              fontSize: '0.85rem',
              border: '2px solid #ea580c',
              padding: '6px 14px',
              borderRadius: 8,
              boxShadow: filterTab === 'trending' ? '2px 2px 0 #20241f' : 'none',
            }}
          >
            🔥 Trending
          </button>
        </div>

        {/* Theme Filter and A-Z Sorting Options */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Theme Selector */}
          <select
            value={selectedTheme}
            onChange={(e) => setSelectedTheme(e.target.value)}
            style={{
              padding: '7px 12px',
              borderRadius: 8,
              border: '2px solid #20241f',
              background: '#fff',
              fontWeight: 600,
              fontSize: '0.85rem',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="all">All Themes</option>
            {allThemes.map((theme) => (
              <option key={theme} value={theme}>
                {theme}
              </option>
            ))}
          </select>

          {/* Sort Dropdown (A-Z, Z-A, Original Order) */}
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as any)}
            style={{
              padding: '7px 12px',
              borderRadius: 8,
              border: '2px solid #20241f',
              background: '#fff',
              fontWeight: 600,
              fontSize: '0.85rem',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="num-asc">Sort: Concept # (001 - 100)</option>
            <option value="a-z">Sort: A to Z</option>
            <option value="z-a">Sort: Z to A</option>
          </select>
        </div>
      </div>

      {/* Concept Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: 20,
        }}
      >
        {displayedConcepts.map((concept) => {
          const linkedBook = concept.bookId ? booksMap.get(concept.bookId) : undefined;
          const isTrending = concept.category === 'trending';
          const badgeBg = isTrending ? '#fff7ed' : '#f0fdf4';
          const badgeColor = isTrending ? '#c2410c' : '#166534';
          const badgeBorder = isTrending ? '#ea580c' : '#16a34a';

          return (
            <div
              key={concept.num}
              style={{
                background: '#fff',
                border: '2px solid #20241f',
                borderRadius: 12,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                boxShadow: '4px 4px 0 #20241f',
                transition: 'transform 0.15s ease',
              }}
            >
              {/* Card Header */}
              <div
                style={{
                  padding: '10px 14px',
                  background: isTrending ? '#fffaf5' : '#fafdfb',
                  borderBottom: '2px solid #20241f',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span
                    style={{
                      background: '#20241f',
                      color: '#ffe600',
                      fontSize: '0.75rem',
                      fontWeight: 900,
                      padding: '2px 6px',
                      borderRadius: 4,
                    }}
                  >
                    #{concept.num}
                  </span>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      padding: '2px 8px',
                      borderRadius: 12,
                      background: badgeBg,
                      color: badgeColor,
                      border: `1px solid ${badgeBorder}`,
                    }}
                  >
                    {isTrending ? '🔥 Trending' : '🌲 Evergreen'}
                  </span>
                </div>
                <span
                  style={{
                    fontSize: '0.75rem',
                    color: '#64748b',
                    fontWeight: 600,
                    maxWidth: 160,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                  title={concept.theme}
                >
                  {concept.theme}
                </span>
              </div>

              {/* Card Body */}
              <div style={{ padding: 16, flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3
                  style={{
                    fontSize: '1.2rem',
                    margin: '0 0 8px 0',
                    lineHeight: 1.25,
                    fontFamily: 'var(--font-editorial)',
                    color: '#1a202c',
                  }}
                >
                  {concept.name}
                </h3>
                <p
                  style={{
                    fontSize: '0.9rem',
                    lineHeight: 1.5,
                    color: '#4a5568',
                    fontStyle: 'italic',
                    margin: '0 0 16px 0',
                    flex: 1,
                  }}
                >
                  “{concept.description}”
                </p>

                {/* Book Linkage & Thumbnail Area */}
                {linkedBook ? (
                  <div
                    style={{
                      background: '#f8fafc',
                      border: '2px solid #20241f',
                      borderRadius: 8,
                      padding: 10,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      marginTop: 'auto',
                    }}
                  >
                    <div
                      style={{
                        width: 42,
                        height: 52,
                        background: '#20241f',
                        color: '#ffe600',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 900,
                        fontSize: '0.85rem',
                        borderRadius: 4,
                        flexShrink: 0,
                        border: '1px solid #20241f',
                      }}
                    >
                      {linkedBook.id.slice(-2)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <span
                        style={{
                          display: 'block',
                          fontSize: '0.75rem',
                          fontWeight: 800,
                          textTransform: 'uppercase',
                          color: '#16a34a',
                        }}
                      >
                        ✓ Visual Book Available
                      </span>
                      <strong
                        style={{
                          display: 'block',
                          fontSize: '0.88rem',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          color: '#1a202c',
                        }}
                        title={linkedBook.title}
                      >
                        {linkedBook.title}
                      </strong>
                    </div>
                    <Link
                      to={`/read/${linkedBook.id}`}
                      className="btn btn-primary"
                      style={{
                        fontSize: '0.78rem',
                        padding: '6px 12px',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Read 📖
                    </Link>
                  </div>
                ) : (
                  <div
                    style={{
                      background: '#f8fafc',
                      border: '1px dashed #cbd5e1',
                      borderRadius: 8,
                      padding: 10,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 8,
                      marginTop: 'auto',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: '1.1rem', opacity: 0.7 }}>⏳</span>
                      <div>
                        <span style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#64748b' }}>
                          In Preparation
                        </span>
                        <span style={{ display: 'block', fontSize: '0.7rem', color: '#94a3b8' }}>
                          Hook #{concept.num}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        navigate(`/templates?concept=${concept.id}&num=${concept.num}`);
                      }}
                      className="btn"
                      style={{
                        fontSize: '0.72rem',
                        padding: '5px 10px',
                        background: '#fff',
                        borderColor: '#20241f',
                        color: '#20241f',
                        fontWeight: 700,
                      }}
                      title="Author or seed visual book for this concept"
                    >
                      Author +
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {displayedConcepts.length === 0 && (
        <div
          style={{
            background: '#fff',
            border: '2px dashed #20241f',
            borderRadius: 12,
            padding: 40,
            textAlign: 'center',
            marginTop: 20,
          }}
        >
          <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#64748b', margin: 0 }}>
            No concepts matched the selected theme.
          </p>
          <button
            onClick={() => {
              setFilterTab('all');
              setSelectedTheme('all');
            }}
            className="btn btn-primary"
            style={{ marginTop: 14 }}
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};
