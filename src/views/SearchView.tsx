import React, { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CatalogData } from '../types';
import { globalSearchIndex } from '../services/search-index';

interface SearchViewProps {
  catalog: CatalogData;
}

export const SearchView: React.FC<SearchViewProps> = ({ catalog }) => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  // Index catalog items into hash index
  useMemo(() => {
    globalSearchIndex.clear();
    catalog.books.forEach(b => globalSearchIndex.indexBook(b));
    catalog.concepts.forEach(c => globalSearchIndex.indexConcept(c));
    catalog.taxonomies.forEach(t => globalSearchIndex.indexTopic(t));
  }, [catalog]);

  const searchResults = useMemo(() => {
    return globalSearchIndex.search(query);
  }, [query]);

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <p className="page-eyebrow">Hash-Based Fast Search</p>
      <h1 className="page-title">Search Results</h1>
      <p className="page-lede">
        {query ? (
          <>
            Showing results for <span className="comic-highlight">"{query}"</span> — {searchResults.length} match(es) found.
          </>
        ) : (
          'Type in the search bar above to look up visual books, concepts, or topics.'
        )}
      </p>

      {query && searchResults.length === 0 && (
        <div style={{ background: '#fff', border: '3px solid #20241f', borderRadius: 12, padding: 32, textAlign: 'center', boxShadow: '5px 5px 0 #20241f' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🔍</div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: 8 }}>No matching entries found</h3>
          <p style={{ color: 'var(--color-muted)', marginBottom: 20 }}>
            Try searching for keywords like "attention", "design", "focus", or "incentives".
          </p>
          <Link to="/" className="btn btn-primary">
            Return to Vault
          </Link>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {searchResults.map((result) => (
          <Link
            key={result.id}
            to={result.url}
            className="comic-card"
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 18,
              border: '3px solid #20241f',
              borderRadius: 10,
              boxShadow: '4px 4px 0 #20241f',
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span
                  className="badge"
                  style={{
                    background:
                      result.type === 'book'
                        ? '#d5ff58'
                        : result.type === 'concept'
                        ? '#b9d7f6'
                        : '#ffb99d',
                    color: '#20241f',
                    border: '1.5px solid #20241f',
                    fontWeight: 800,
                  }}
                >
                  {result.type.toUpperCase()}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-muted)', fontWeight: 600 }}>
                  {result.subtitle}
                </span>
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '4px 0' }}>{result.title}</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--color-muted)', maxWidth: 640 }}>{result.description}</p>
            </div>

            <div style={{ flexShrink: 0, paddingLeft: 16 }}>
              <span className="btn btn-primary" style={{ fontSize: '0.85rem' }}>
                Open ➔
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
