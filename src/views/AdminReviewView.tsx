import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CatalogBook, UserProfile } from '../types';
import { fetchBooksForModeration, updateBookStatus } from '../services/supabase';

interface AdminReviewViewProps {
  user: UserProfile | null;
  onToast: (msg: string) => void;
}

export const AdminReviewView: React.FC<AdminReviewViewProps> = ({ onToast }) => {
  const [books, setBooks] = useState<CatalogBook[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const list = await fetchBooksForModeration();
      setBooks(list);
      setLoading(false);
    }
    load();
  }, []);

  const handleStatusChange = async (bookId: string, newStatus: 'published' | 'archived') => {
    const res = await updateBookStatus(bookId, newStatus);
    if (res.success) {
      setBooks(prev =>
        prev.map(b => (b.id === bookId ? { ...b, status: newStatus } : b))
      );
      onToast(`Book status updated to "${newStatus}".`);
    } else {
      alert(`Error updating status: ${res.error}`);
    }
  };

  return (
    <div>
      <p className="page-eyebrow">Catalog Administration</p>
      <h1 className="page-title">Moderation & Review Queue.</h1>
      <p className="page-lede">
        Community authors submit books in <code>pending_review</code> status. Once approved, books become globally visible in the catalog.
      </p>

      {loading ? (
        <p style={{ padding: 20 }}>Loading moderation queue...</p>
      ) : books.length > 0 ? (
        <div
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-line)',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ background: 'var(--color-sidebar)', borderBottom: '1px solid var(--color-line)' }}>
                <th style={{ padding: '12px 16px', color: 'var(--color-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                  Book
                </th>
                <th style={{ padding: '12px 16px', color: 'var(--color-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                  Topic / Time
                </th>
                <th style={{ padding: '12px 16px', color: 'var(--color-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                  Status
                </th>
                <th style={{ padding: '12px 16px', color: 'var(--color-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {books.map(b => {
                const isPending = b.status === 'pending_review';
                const isPublished = b.status === 'published';

                return (
                  <tr key={b.id} style={{ borderBottom: '1px solid var(--color-line)' }}>
                    <td style={{ padding: '14px 16px' }}>
                      <strong style={{ display: 'block', fontSize: '0.95rem' }}>{b.title}</strong>
                      <small style={{ color: 'var(--color-muted)' }}>ID: {b.id}</small>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span>{b.primaryTaxonomyId}</span> · <small>{b.readingMinutes} min</small>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span
                        className={`badge ${
                          isPublished
                            ? 'badge-green'
                            : isPending
                            ? 'badge-warning'
                            : 'badge-muted'
                        }`}
                      >
                        {b.status || 'published'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <Link
                          to={`/read/${b.id}`}
                          className="btn"
                          style={{ padding: '4px 10px', fontSize: '0.8rem' }}
                        >
                          Read
                        </Link>
                        {isPending && (
                          <button
                            className="btn btn-primary"
                            style={{ padding: '4px 10px', fontSize: '0.8rem' }}
                            onClick={() => handleStatusChange(b.id, 'published')}
                          >
                            Approve & Publish
                          </button>
                        )}
                        {b.status !== 'archived' && (
                          <button
                            className="btn btn-danger"
                            style={{ padding: '4px 10px', fontSize: '0.8rem' }}
                            onClick={() => handleStatusChange(b.id, 'archived')}
                          >
                            Archive
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{ background: 'var(--color-surface)', padding: 32, borderRadius: 'var(--radius-md)', textAlign: 'center', border: '1px solid var(--color-line)' }}>
          <p style={{ color: 'var(--color-muted)' }}>No community books awaiting moderation.</p>
        </div>
      )}
    </div>
  );
};
