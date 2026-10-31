import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CatalogBook, ConceptNode, ConceptRelation } from '../types';
import { ConceptGraph } from '../components/concepts/ConceptGraph';

interface ConceptsViewProps {
  concepts: ConceptNode[];
  relations: ConceptRelation[];
  books: CatalogBook[];
}

export const ConceptsView: React.FC<ConceptsViewProps> = ({
  concepts,
  relations,
  books,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedIdFromUrl = searchParams.get('id') || 'attention';
  const [filterTab, setFilterTab] = useState<'all' | 'evergreen' | 'trending'>('all');

  const [selectedConceptId, setSelectedConceptId] = useState<string>(
    concepts.some(c => c.id === selectedIdFromUrl) ? selectedIdFromUrl : concepts[0]?.id || 'attention'
  );

  const selectedConcept = concepts.find(c => c.id === selectedConceptId) || concepts[0];

  const handleSelectConcept = (conceptId: string) => {
    setSelectedConceptId(conceptId);
    setSearchParams({ id: conceptId });
  };

  // Divide into Evergreen and Trending concepts
  const evergreenConcepts = concepts.filter(c => c.category === 'evergreen' || (!c.category && (c.id === 'attention' || c.id === 'incentives')));
  const trendingConcepts = concepts.filter(c => c.category === 'trending' || (!c.category && (c.id === 'engagement' || c.id === 'interface-design')));

  // Filtered concepts based on tab
  const displayedConcepts =
    filterTab === 'evergreen'
      ? evergreenConcepts
      : filterTab === 'trending'
      ? trendingConcepts
      : concepts;

  // Find linked books
  const linkedBooks = books.filter(b =>
    b.conceptLinks?.some(link => link.conceptId === selectedConcept?.id)
  );

  // Find active relationships
  const activeRelations = relations.filter(
    r => r.fromConceptId === selectedConcept?.id || r.toConceptId === selectedConcept?.id
  );

  return (
    <div>
      <p className="page-eyebrow">Explore Connections</p>
      <h1 className="page-title">Follow an idea.</h1>
      <p className="page-lede">
        The knowledge graph shows how concepts relate. Explore timeless evergreen concepts and fast-evolving trending patterns, click on any node to discover linked visual books.
      </p>

      {/* Evergreen vs Trending Tabs */}
      <div className="comic-concept-tabs" style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <button
          onClick={() => setFilterTab('all')}
          className={`btn ${filterTab === 'all' ? 'btn-primary' : ''}`}
          style={{ fontSize: '0.9rem' }}
        >
          All Concepts ({concepts.length})
        </button>
        <button
          onClick={() => setFilterTab('evergreen')}
          className={`btn ${filterTab === 'evergreen' ? 'btn-primary' : ''}`}
          style={{ fontSize: '0.9rem', borderColor: filterTab === 'evergreen' ? '#20241f' : '#22c55e' }}
        >
          🌲 Evergreen Concepts ({evergreenConcepts.length})
        </button>
        <button
          onClick={() => setFilterTab('trending')}
          className={`btn ${filterTab === 'trending' ? 'btn-primary' : ''}`}
          style={{ fontSize: '0.9rem', borderColor: filterTab === 'trending' ? '#20241f' : '#f97316' }}
        >
          🔥 Trending Concepts ({trendingConcepts.length})
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: 28, alignItems: 'start' }}>
        {/* Graph Canvas */}
        <div>
          <ConceptGraph
            concepts={displayedConcepts}
            relations={relations}
            selectedConceptId={selectedConcept?.id || ''}
            onSelectConcept={handleSelectConcept}
          />

          {/* Categorized Concept Quick Chips */}
          <div style={{ marginTop: 20, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={{ background: '#fff', border: '2px solid #20241f', borderRadius: 8, padding: 14, boxShadow: '3px 3px 0 #20241f' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                <span style={{ fontSize: '1.1rem' }}>🌲</span>
                <strong style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Evergreen</strong>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-muted)', marginBottom: 10 }}>Foundational mental models that stand the test of time.</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {evergreenConcepts.map(c => (
                  <button
                    key={c.id}
                    onClick={() => handleSelectConcept(c.id)}
                    className="btn"
                    style={{
                      fontSize: '0.8rem',
                      padding: '4px 10px',
                      background: selectedConceptId === c.id ? '#20241f' : '#f0fdf4',
                      color: selectedConceptId === c.id ? '#fff' : '#166534',
                      borderColor: '#166534',
                    }}
                  >
                    ● {c.name}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ background: '#fff', border: '2px solid #20241f', borderRadius: 8, padding: 14, boxShadow: '3px 3px 0 #20241f' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                <span style={{ fontSize: '1.1rem' }}>🔥</span>
                <strong style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Trending</strong>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-muted)', marginBottom: 10 }}>Modern design, emergent digital behaviors, and active shifts.</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {trendingConcepts.map(c => (
                  <button
                    key={c.id}
                    onClick={() => handleSelectConcept(c.id)}
                    className="btn"
                    style={{
                      fontSize: '0.8rem',
                      padding: '4px 10px',
                      background: selectedConceptId === c.id ? '#20241f' : '#fff7ed',
                      color: selectedConceptId === c.id ? '#fff' : '#c2410c',
                      borderColor: '#ea580c',
                    }}
                  >
                    ● {c.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Accessible Relationship List */}
          <details
            style={{
              marginTop: 16,
              background: 'var(--color-surface)',
              border: '1px solid var(--color-line)',
              borderRadius: 'var(--radius-sm)',
              padding: '12px 16px',
              fontSize: '0.88rem',
            }}
          >
            <summary style={{ cursor: 'pointer', fontWeight: 600 }}>
              Read relationships as a structured list
            </summary>
            <ul style={{ marginTop: 10, paddingLeft: 20, color: 'var(--color-muted)', lineHeight: 1.8 }}>
              {activeRelations.map((rel, i) => {
                const fromName = concepts.find(c => c.id === rel.fromConceptId)?.name;
                const toName = concepts.find(c => c.id === rel.toConceptId)?.name;
                return (
                  <li key={`rel-list-${i}`}>
                    <strong style={{ color: 'var(--color-ink)' }}>{fromName}</strong>{' '}
                    <span>{rel.type.replace(/_/g, ' ')}</span>{' '}
                    <strong style={{ color: 'var(--color-ink)' }}>{toName}</strong>
                  </li>
                );
              })}
            </ul>
          </details>
        </div>

        {/* Selected Concept Detail Panel */}
        <aside
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-line)',
            borderRadius: 'var(--radius-md)',
            padding: 24,
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <p className="page-eyebrow">Selected Concept</p>
          <h2 style={{ fontFamily: 'var(--font-editorial)', fontSize: '1.8rem', marginBottom: 8 }}>
            {selectedConcept?.name}
          </h2>
          <p style={{ color: 'var(--color-muted)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: 24 }}>
            {selectedConcept?.description}
          </p>

          <h3
            style={{
              fontSize: '0.85rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              color: 'var(--color-muted)',
              marginBottom: 12,
            }}
          >
            Books that explain it
          </h3>

          {linkedBooks.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {linkedBooks.map((book) => {
                const role = book.conceptLinks?.find(l => l.conceptId === selectedConcept?.id)?.role || 'related';
                return (
                  <Link
                    key={book.id}
                    to={`/read/${book.id}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 16,
                      padding: 12,
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
                        width: 38,
                        height: 46,
                        background: 'var(--color-ink)',
                        color: 'var(--color-accent)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        fontSize: '0.85rem',
                        borderRadius: 4,
                        flexShrink: 0,
                      }}
                    >
                      {book.id.slice(-2)}
                    </div>
                    <div>
                      <strong style={{ display: 'block', fontSize: '0.95rem', marginBottom: 2 }}>
                        {book.title}
                      </strong>
                      <small style={{ color: 'var(--color-muted)', fontSize: '0.8rem', textTransform: 'capitalize' }}>
                        {role} · {book.readingMinutes} min read
                      </small>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem' }}>
              No visual books are linked to this concept yet.
            </p>
          )}
        </aside>
      </div>
    </div>
  );
};
