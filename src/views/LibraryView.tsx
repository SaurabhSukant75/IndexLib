import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookmarkRecord, CatalogBook, ReadingProgressRecord } from '../types';
import { getAllLocalProgress, getLocalBookmarks, getLocalImports } from '../services/local-db';

interface LibraryViewProps {
  catalogBooks: CatalogBook[];
}

export const LibraryView: React.FC<LibraryViewProps> = ({ catalogBooks }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'recent' | 'saved' | 'imported' | 'bookmarks'>('all');
  const [progressList, setProgressList] = useState<ReadingProgressRecord[]>([]);
  const [importedBooks, setImportedBooks] = useState<CatalogBook[]>([]);
  const [bookmarks, setBookmarks] = useState<BookmarkRecord[]>([]);

  useEffect(() => {
    async function loadData() {
      const [prog, imp, bms] = await Promise.all([
        getAllLocalProgress(),
        getLocalImports(),
        getLocalBookmarks(),
      ]);
      setProgressList(prog);
      setImportedBooks(imp);
      setBookmarks(bms);
    }
    loadData();
  }, []);

  const allBooks = [...catalogBooks, ...importedBooks];
  const inProgressBooks = allBooks.filter(b => {
    const prog = progressList.find(p => p.bookId === b.id);
    return prog && !prog.completed;
  });

  return (
    <div>
      <p className="page-eyebrow">Your Space · Offline-First</p>
      <h1 className="page-title">My Library.</h1>
      <p className="page-lede">
        Pick up where you left off, access bookmarked pages, and manage private local HTML imports.
      </p>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, borderBottom: '1px solid var(--color-line)', paddingBottom: 12 }}>
        {[
          { id: 'all', label: 'All Books' },
          { id: 'recent', label: `In Progress (${inProgressBooks.length})` },
          { id: 'imported', label: `Imports (${importedBooks.length})` },
          { id: 'bookmarks', label: `Bookmarks (${bookmarks.length})` },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`btn ${activeTab === tab.id ? 'btn-primary' : ''}`}
            style={{ fontSize: '0.85rem' }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'bookmarks' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {bookmarks.length > 0 ? (
            bookmarks.map(bm => {
              const book = allBooks.find(b => b.id === bm.bookId);
              return (
                <Link
                  key={bm.bookmarkId}
                  to={`/read/${bm.bookId}/${bm.pageId}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: 14,
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-line)',
                    borderRadius: 'var(--radius-sm)',
                    textDecoration: 'none',
                    color: 'inherit',
                  }}
                >
                  <div>
                    <strong style={{ fontSize: '0.95rem', display: 'block' }}>
                      {bm.label || bm.pageId}
                    </strong>
                    <small style={{ color: 'var(--color-muted)' }}>
                      {book?.title || bm.bookId} · Page: {bm.pageId}
                    </small>
                  </div>
                  <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>Open →</span>
                </Link>
              );
            })
          ) : (
            <p style={{ color: 'var(--color-muted)', padding: 20 }}>No bookmarks saved yet.</p>
          )}
        </div>
      ) : (
        <div className="book-grid">
          {(activeTab === 'recent'
            ? inProgressBooks
            : activeTab === 'imported'
            ? importedBooks
            : allBooks
          ).map(book => {
            const prog = progressList.find(p => p.bookId === book.id);
            return (
              <Link key={book.id} to={`/read/${book.id}`} className="book-card">
                <div>
                  <div className="book-card-header">
                    <span className="badge badge-accent">
                      {prog?.completed ? '✓ Completed' : prog ? 'In Progress' : `${book.readingMinutes} min`}
                    </span>
                    {book.isImported && <span className="badge badge-warning">Local Import</span>}
                  </div>
                  <h3 className="book-card-title">{book.title}</h3>
                  <p className="book-card-summary">{book.summary}</p>
                </div>
                <div className="book-card-footer">
                  <span>{book.tags.join(' · ')}</span>
                  <span style={{ fontWeight: 600 }}>{prog ? 'Resume →' : 'Read →'}</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};
