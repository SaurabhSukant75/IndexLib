import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { BookmarkRecord, CatalogBook, ReadingProgressRecord } from '../types';
import { getAllLocalProgress, getLocalBookmarks, getLocalImports } from '../services/local-db';

interface LibraryViewProps {
  catalogBooks: CatalogBook[];
}

export const LibraryView: React.FC<LibraryViewProps> = ({ catalogBooks }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlTab = searchParams.get('tab');
  const initialTab = urlTab === 'history' ? 'history' : urlTab === 'progress' ? 'progress' : 'all';

  const [activeTab, setActiveTab] = useState<'all' | 'history' | 'progress' | 'bookmarks' | 'imported'>(initialTab as any);
  const [progressList, setProgressList] = useState<ReadingProgressRecord[]>([]);
  const [importedBooks, setImportedBooks] = useState<CatalogBook[]>([]);
  const [bookmarks, setBookmarks] = useState<BookmarkRecord[]>([]);

  useEffect(() => {
    if (urlTab === 'history') setActiveTab('history');
    else if (urlTab === 'progress') setActiveTab('progress');
  }, [urlTab]);

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
  
  // History: books sorted by lastOpenedAt or updatedAt
  const historyList = [...progressList]
    .sort((a, b) => (b.lastOpenedAt || b.updatedAt) - (a.lastOpenedAt || a.updatedAt))
    .map(p => {
      const book = allBooks.find(b => b.id === p.bookId);
      return { progress: p, book };
    })
    .filter((item): item is { progress: ReadingProgressRecord; book: CatalogBook } => Boolean(item.book));

  // User Progress: Completed vs In Progress
  const inProgressList = progressList.filter(p => !p.completed);
  const completedList = progressList.filter(p => p.completed);

  return (
    <div>
      <p className="page-eyebrow">My Space · Personal Reading Vault</p>
      <h1 className="page-title">Reading Hub & Personal Space.</h1>
      <p className="page-lede">
        Inspect your reading history, track your ongoing learning progress, access bookmarks, and manage offline books.
      </p>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, borderBottom: '2px solid var(--color-ink)', paddingBottom: 12, flexWrap: 'wrap' }}>
        {[
          { id: 'all', label: `All Books (${allBooks.length})` },
          { id: 'history', label: `📜 History (${historyList.length})` },
          { id: 'progress', label: `📊 User Progress (${inProgressList.length} reading, ${completedList.length} done)` },
          { id: 'bookmarks', label: `★ Bookmarks (${bookmarks.length})` },
          { id: 'imported', label: `📁 Local Imports (${importedBooks.length})` },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id as any);
              setSearchParams({ tab: tab.id });
            }}
            className={`btn ${activeTab === tab.id ? 'btn-primary' : ''}`}
            style={{ fontSize: '0.88rem' }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content: History */}
      {activeTab === 'history' && (
        <div>
          {historyList.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {historyList.map(({ book, progress }) => {
                const dateStr = new Date(progress.lastOpenedAt || progress.updatedAt).toLocaleString();
                return (
                  <div
                    key={book.id}
                    className="comic-panel-card"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: 16,
                      background: '#fff',
                      border: '2px solid #20241f',
                      borderRadius: 8,
                      boxShadow: '3px 3px 0 #20241f',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <span className={`badge ${progress.completed ? 'badge-green' : 'badge-accent'}`}>
                          {progress.completed ? '✓ Finished' : '📖 Last Read'}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>{dateStr}</span>
                      </div>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{book.title}</h3>
                      <p style={{ fontSize: '0.85rem', color: 'var(--color-muted)' }}>
                        Section: {progress.currentPageId || 'Introduction'}
                      </p>
                    </div>
                    <Link to={`/read/${book.id}/${progress.currentPageId || ''}`} className="btn btn-primary">
                      Resume →
                    </Link>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ padding: 32, textAlign: 'center', background: '#fff', border: '2px dashed var(--color-line)', borderRadius: 8 }}>
              <p style={{ color: 'var(--color-muted)' }}>No reading history recorded yet. Open any book to begin your journey!</p>
            </div>
          )}
        </div>
      )}

      {/* Tab Content: User Progress */}
      {activeTab === 'progress' && (
        <div>
          {/* Progress Overview Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 28 }}>
            <div style={{ background: '#d5ff58', border: '2px solid #20241f', borderRadius: 8, padding: 18, boxShadow: '4px 4px 0 #20241f' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>In Progress</span>
              <h2 style={{ fontSize: '2.4rem', fontWeight: 900, lineHeight: 1.1 }}>{inProgressList.length}</h2>
              <small>Currently reading</small>
            </div>
            <div style={{ background: '#b9d7f6', border: '2px solid #20241f', borderRadius: 8, padding: 18, boxShadow: '4px 4px 0 #20241f' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>Completed</span>
              <h2 style={{ fontSize: '2.4rem', fontWeight: 900, lineHeight: 1.1 }}>{completedList.length}</h2>
              <small>Books finished</small>
            </div>
            <div style={{ background: '#ffb99d', border: '2px solid #20241f', borderRadius: 8, padding: 18, boxShadow: '4px 4px 0 #20241f' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>Saved Bookmarks</span>
              <h2 style={{ fontSize: '2.4rem', fontWeight: 900, lineHeight: 1.1 }}>{bookmarks.length}</h2>
              <small>Key moments pinned</small>
            </div>
          </div>

          <h2 style={{ fontFamily: 'var(--font-editorial)', fontSize: '1.4rem', marginBottom: 12 }}>Active Books</h2>
          {inProgressList.length > 0 ? (
            <div className="book-grid" style={{ marginBottom: 32 }}>
              {inProgressList.map(prog => {
                const book = allBooks.find(b => b.id === prog.bookId);
                if (!book) return null;
                return (
                  <Link key={book.id} to={`/read/${book.id}`} className="book-card">
                    <div>
                      <div className="book-card-header">
                        <span className="badge badge-accent">In Progress</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>{book.readingMinutes} min</span>
                      </div>
                      <h3 className="book-card-title">{book.title}</h3>
                      <p className="book-card-summary">{book.summary}</p>
                    </div>
                    <div className="book-card-footer">
                      <span>Section: {prog.currentPageId || 'Intro'}</span>
                      <span style={{ fontWeight: 600 }}>Resume Reading →</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <p style={{ color: 'var(--color-muted)', marginBottom: 28 }}>No books currently in progress.</p>
          )}

          {completedList.length > 0 && (
            <>
              <h2 style={{ fontFamily: 'var(--font-editorial)', fontSize: '1.4rem', marginBottom: 12 }}>Completed Visual Books</h2>
              <div className="book-grid">
                {completedList.map(prog => {
                  const book = allBooks.find(b => b.id === prog.bookId);
                  if (!book) return null;
                  return (
                    <Link key={book.id} to={`/read/${book.id}`} className="book-card" style={{ borderColor: '#22c55e' }}>
                      <div>
                        <div className="book-card-header">
                          <span className="badge badge-green">✓ Finished</span>
                        </div>
                        <h3 className="book-card-title">{book.title}</h3>
                        <p className="book-card-summary">{book.summary}</p>
                      </div>
                      <div className="book-card-footer">
                        <span>Re-read anytime</span>
                        <span style={{ fontWeight: 600 }}>Open →</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}

      {/* Tab Content: Bookmarks */}
      {activeTab === 'bookmarks' && (
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
      )}

      {/* Tab Content: All Books or Local Imports */}
      {(activeTab === 'all' || activeTab === 'imported') && (
        <div className="book-grid">
          {(activeTab === 'imported' ? importedBooks : allBooks).map(book => {
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
