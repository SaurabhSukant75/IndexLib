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

  const [selectedConceptId, setSelectedConceptId] = useState<string>(
    concepts.some(c => c.id === selectedIdFromUrl) ? selectedIdFromUrl : concepts[0]?.id || 'attention'
  );

  const selectedConcept = concepts.find(c => c.id === selectedConceptId) || concepts[0];

  const handleSelectConcept = (conceptId: string) => {
    setSelectedConceptId(conceptId);
    setSearchParams({ id: conceptId });
  };

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
        The knowledge graph shows how concepts relate. It suggests connections—not what order you must learn them in. Click on any node to explore its meaning and discover linked visual books.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: 28, alignItems: 'start' }}>
        {/* Graph Canvas */}
        <div>
          <ConceptGraph
            concepts={concepts}
            relations={relations}
            selectedConceptId={selectedConcept?.id || ''}
            onSelectConcept={handleSelectConcept}
          />

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
