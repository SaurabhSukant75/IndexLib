import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CatalogBook, TaxonomyNode } from '../types';

interface TopicsViewProps {
  taxonomies: TaxonomyNode[];
  books: CatalogBook[];
}

export const TopicsView: React.FC<TopicsViewProps> = ({ taxonomies, books }) => {
  const [selectedTopicId, setSelectedTopicId] = useState<string>(taxonomies[0]?.id || 'human-nature');

  const selectedTopic = taxonomies.find(t => t.id === selectedTopicId) || taxonomies[0];
  const topicBooks = books.filter(b => b.taxonomyIds?.includes(selectedTopic?.id || ''));

  return (
    <div>
      <p className="page-eyebrow">Browse by Subject</p>
      <h1 className="page-title">Explore Topics.</h1>
      <p className="page-lede">
        Hierarchical categorization answers “what is this subject?” Browse broad topics and discover curated visual books.
      </p>

      {/* Topic selection pills */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28 }}>
        {taxonomies.map(topic => (
          <button
            key={topic.id}
            onClick={() => setSelectedTopicId(topic.id)}
            className={`btn ${selectedTopicId === topic.id ? 'btn-primary' : ''}`}
            style={{ fontSize: '0.9rem' }}
          >
            {topic.name}
          </button>
        ))}
      </div>

      <div style={{ background: 'var(--color-surface)', padding: 24, borderRadius: 'var(--radius-md)', border: '1px solid var(--color-line)' }}>
        <h2 style={{ fontFamily: 'var(--font-editorial)', fontSize: '1.6rem', marginBottom: 6 }}>
          {selectedTopic?.name}
        </h2>
        <p style={{ color: 'var(--color-muted)', fontSize: '0.95rem', marginBottom: 24 }}>
          {selectedTopic?.description}
        </p>

        <h3 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--color-muted)', marginBottom: 16 }}>
          Books in this topic ({topicBooks.length})
        </h3>

        {topicBooks.length > 0 ? (
          <div className="book-grid">
            {topicBooks.map(book => (
              <Link key={book.id} to={`/read/${book.id}`} className="book-card">
                <div>
                  <div className="book-card-header">
                    <span className="badge badge-accent">{book.readingMinutes} min</span>
                  </div>
                  <h4 className="book-card-title">{book.title}</h4>
                  <p className="book-card-summary">{book.summary}</p>
                </div>
                <div className="book-card-footer">
                  <span>{book.tags.join(' · ')}</span>
                  <span style={{ fontWeight: 600 }}>Read →</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem' }}>
            No visual books are assigned to this topic yet.
          </p>
        )}
      </div>
    </div>
  );
};
