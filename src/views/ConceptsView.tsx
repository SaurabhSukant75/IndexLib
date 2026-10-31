import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CatalogBook, ConceptNode, ConceptRelation } from '../types';
import { CONCEPTS_100 } from '../data/concepts100';

interface ConceptsViewProps {
  concepts?: ConceptNode[];
  relations?: ConceptRelation[];
  books?: CatalogBook[];
}

export const ConceptsView: React.FC<ConceptsViewProps> = ({
  books = [],
}) => {
  const navigate = useNavigate();
  const [filterTab, setFilterTab] = useState<'all' | 'evergreen' | 'trending'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTheme, setSelectedTheme] = useState<string>('all');

  // Extract themes
  const allThemes = useMemo(() => {
    const set = new Set<string>();
    CONCEPTS_100.forEach(c => set.add(c.theme));
    return Array.from(set);
  }, []);

  // Filtered concepts
  const filteredConcepts = useMemo(() => {
    return CONCEPTS_100.filter(c => {
      // Category filter
      if (filterTab !== 'all' && c.category !== filterTab) {
        return false;
      }
      // Theme filter
      if (selectedTheme !== 'all' && c.theme !== selectedTheme) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = c.name.toLowerCase().includes(query);
        const matchesDesc = c.description.toLowerCase().includes(query);
        const matchesTheme = c.theme.toLowerCase().includes(query);
        const matchesNum = c.num.includes(query);
        if (!matchesName && !matchesDesc && !matchesTheme && !matchesNum) {
          return false;
        }
      }
      return true;
    });
  }, [filterTab, selectedTheme, searchQuery]);

  const evergreenCount = CONCEPTS_100.filter(c => c.category === 'evergreen').length;
  const trendingCount = CONCEPTS_100.filter(c => c.category === 'trending').length;

  // Book lookup map
  const booksMap = useMemo(() => {
    const map = new Map<string, CatalogBook>();
    books.forEach(b => map.set(b.id, b));
    return map;
  }, [books]);

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', paddingBottom: 60 }}>
      {/* Header Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #f8fafc 0%, #edf2f7 100%)',
          border: '3px solid #20241f',
          borderRadius: 16,
          padding: 'clamp(24px, 4vw, 36px)',
          boxShadow: '6px 6px 0 #20241f',
          marginBottom: 32,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div
              style={{
                display: 'inline-block',
                background: '#20241f',
                color: '#ffe600',
                fontWeight: 900,
                fontSize: '0.8rem',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                padding: '4px 10px',
                borderRadius: 4,
                marginBottom: 10,
              }}
            >
              100 IndexDictionaries Hooks
            </div>
            <h1
              style={{
                fontFamily: 'var(--font-editorial)',
                fontSize: 'clamp(2rem, 4vw, 3.2rem)',
                lineHeight: 1.1,
                color: '#20241f',
                margin: '0 0 10px 0',
              }}
            >
              Understand Concepts. Connect Ideas.
            </h1>
            <p style={{ color: '#4a5568', fontSize: '1.05rem', maxWidth: 780, margin: 0, lineHeight: 1.5 }}>
              One hundred foundational questions about how people think, how societies coordinate,
              how power moves, and how technology reshapes the world.
            </p>
          </div>

          <div
            style={{
              background: '#fff',
              border: '2px solid #20241f',
              borderRadius: 12,
              padding: '16px 24px',
              textAlign: 'center',
              boxShadow: '3px 3px 0 #20241f',
              minWidth: 140,
            }}
          >
            <strong style={{ display: 'block', fontSize: '2.5rem', lineHeight: 1, color: '#2563eb' }}>
              100
            </strong>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#64748b' }}>
              Total Concepts
            </span>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div
          style={{
            marginTop: 24,
            paddingTop: 20,
            borderTop: '2px dashed #cbd5e1',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
          }}
        >
          {/* Bifurcated Category Tabs */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button
              onClick={() => setFilterTab('all')}
              className="btn"
              style={{
                background: filterTab === 'all' ? '#20241f' : '#fff',
                color: filterTab === 'all' ? '#ffe600' : '#20241f',
                fontWeight: 700,
                fontSize: '0.88rem',
                border: '2px solid #20241f',
                padding: '8px 16px',
                borderRadius: 8,
                boxShadow: filterTab === 'all' ? '2px 2px 0 #20241f' : 'none',
              }}
            >
              All Concepts (100)
            </button>
            <button
              onClick={() => setFilterTab('evergreen')}
              className="btn"
              style={{
                background: filterTab === 'evergreen' ? '#166534' : '#fff',
                color: filterTab === 'evergreen' ? '#fff' : '#166534',
                fontWeight: 700,
                fontSize: '0.88rem',
                border: '2px solid #166534',
                padding: '8px 16px',
                borderRadius: 8,
                boxShadow: filterTab === 'evergreen' ? '2px 2px 0 #20241f' : 'none',
              }}
            >
              🌲 Evergreen ({evergreenCount})
            </button>
            <button
              onClick={() => setFilterTab('trending')}
              className="btn"
              style={{
                background: filterTab === 'trending' ? '#ea580c' : '#fff',
                color: filterTab === 'trending' ? '#fff' : '#ea580c',
                fontWeight: 700,
                fontSize: '0.88rem',
                border: '2px solid #ea580c',
                padding: '8px 16px',
                borderRadius: 8,
                boxShadow: filterTab === 'trending' ? '2px 2px 0 #20241f' : 'none',
              }}
            >
              🔥 Trending ({trendingCount})
            </button>
          </div>

          {/* Search Input & Theme Selector */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', flex: '1 1 300px', justifyContent: 'flex-end' }}>
            <select
              value={selectedTheme}
              onChange={(e) => setSelectedTheme(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: 8,
                border: '2px solid #20241f',
                background: '#fff',
                fontWeight: 600,
                fontSize: '0.85rem',
                outline: 'none',
              }}
            >
              <option value="all">All 8 Themes</option>
              {allThemes.map((theme) => (
                <option key={theme} value={theme}>
                  {theme}
                </option>
              ))}
            </select>

            <input
              type="search"
              placeholder="Search concepts or hooks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                padding: '8px 14px',
                borderRadius: 8,
                border: '2px solid #20241f',
                background: '#fff',
                fontSize: '0.88rem',
                minWidth: 200,
                maxWidth: 320,
                outline: 'none',
              }}
            />
          </div>
        </div>
      </div>

      {/* Concept Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: 22,
        }}
      >
        {filteredConcepts.map((concept) => {
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
                  padding: '12px 16px',
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
                    maxWidth: 150,
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
              <div style={{ padding: 18, flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3
                  style={{
                    fontSize: '1.25rem',
                    margin: '0 0 10px 0',
                    lineHeight: 1.25,
                    fontFamily: 'var(--font-editorial)',
                    color: '#1a202c',
                  }}
                >
                  {concept.name}
                </h3>
                <p
                  style={{
                    fontSize: '0.92rem',
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
                        width: 44,
                        height: 56,
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
                      <span style={{ fontSize: '1.2rem', opacity: 0.7 }}>⏳</span>
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

      {filteredConcepts.length === 0 && (
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
            No concepts matched your filter or search query.
          </p>
          <button
            onClick={() => {
              setFilterTab('all');
              setSelectedTheme('all');
              setSearchQuery('');
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
