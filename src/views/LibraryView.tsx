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
  const initialTab =
    urlTab === 'history'
      ? 'history'
      : urlTab === 'progress'
      ? 'progress'
      : urlTab === 'bookmarks'
      ? 'bookmarks'
      : urlTab === 'imported'
      ? 'imported'
      : 'all';

  const [activeTab, setActiveTab] = useState<'all' | 'history' | 'progress' | 'bookmarks' | 'imported'>(initialTab as any);
  const [progressList, setProgressList] = useState<ReadingProgressRecord[]>([]);
  const [importedBooks, setImportedBooks] = useState<CatalogBook[]>([]);
  const [bookmarks, setBookmarks] = useState<BookmarkRecord[]>([]);

  useEffect(() => {
    if (urlTab === 'history') setActiveTab('history');
    else if (urlTab === 'progress') setActiveTab('progress');
    else if (urlTab === 'bookmarks') setActiveTab('bookmarks');
    else if (urlTab === 'imported') setActiveTab('imported');
    else if (urlTab === 'all') setActiveTab('all');
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
  const colors = ['#d5ff58', '#b9d7f6', '#ffb99d', '#ded7f5', '#e7e3d4'];

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
  const inProgressBooks = inProgressList
    .map(p => allBooks.find(b => b.id === p.bookId))
    .filter((b): b is CatalogBook => Boolean(b));

  const completedList = progressList.filter(p => p.completed);
  const completedBooks = completedList
    .map(p => allBooks.find(b => b.id === p.bookId))
    .filter((b): b is CatalogBook => Boolean(b));

  const renderComicCard = (book: CatalogBook, idx: number, customSound?: string, extraBadge?: string) => {
    const accentColor = colors[idx % colors.length];
    const prog = progressList.find(p => p.bookId === book.id);
    const soundText = customSound || (prog?.completed ? 'DONE!' : prog ? 'RESUME!' : 'READ!');

    return (
      <Link
        key={book.id}
        to={`/read/${book.id}${prog?.currentPageId ? `/${prog.currentPageId}` : ''}`}
        className="comic-card"
      >
        <div className="comic-card-cover" style={{ backgroundColor: accentColor }}>
          <div className="comic-card-ribbon">
            <span>{book.readingMinutes || 5} MIN READ</span>
            <span className="comic-issue-no">
              {extraBadge || `VOL. ${book.id.replace('book-', '')}`}
            </span>
          </div>
          <div className="comic-cover-art">
            <div className="comic-cover-icon">📖</div>
            <h3 className="comic-cover-heading">{book.title}</h3>
          </div>
          <div className="comic-sound-effect">{soundText}</div>
        </div>

        <div className="comic-card-body">
          <p className="comic-card-desc">{book.summary}</p>
          <div className="comic-card-meta">
            <div className="comic-tag-pills">
              {book.tags?.slice(0, 2).map(tag => (
                <span key={tag} className="comic-pill">#{tag}</span>
              ))}
            </div>
            <span className="comic-read-link">
              {prog?.completed ? 'RE-READ ➔' : prog ? 'RESUME ➔' : 'OPEN ➔'}
            </span>
          </div>
        </div>
      </Link>
    );
  };

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', paddingBottom: 60 }}>
      {/* Comic Filter Bar for Library Tabs */}
      <div className="comic-shelf-filter" style={{ marginBottom: 24, paddingBottom: 16 }}>
        <div className="comic-filter-tags">
          <button
            onClick={() => {
              setActiveTab('all');
              setSearchParams({ tab: 'all' });
            }}
            className={`comic-tag-btn ${activeTab === 'all' ? 'active' : ''}`}
          >
            All Books ({allBooks.length})
          </button>
          <button
            onClick={() => {
              setActiveTab('progress');
              setSearchParams({ tab: 'progress' });
            }}
            className={`comic-tag-btn ${activeTab === 'progress' ? 'active' : ''}`}
          >
            📊 In Progress ({inProgressList.length})
          </button>
          <button
            onClick={() => {
              setActiveTab('history');
              setSearchParams({ tab: 'history' });
            }}
            className={`comic-tag-btn ${activeTab === 'history' ? 'active' : ''}`}
          >
            📜 History ({historyList.length})
          </button>
          <button
            onClick={() => {
              setActiveTab('bookmarks');
              setSearchParams({ tab: 'bookmarks' });
            }}
            className={`comic-tag-btn ${activeTab === 'bookmarks' ? 'active' : ''}`}
          >
            ★ Bookmarks ({bookmarks.length})
          </button>
          <button
            onClick={() => {
              setActiveTab('imported');
              setSearchParams({ tab: 'imported' });
            }}
            className={`comic-tag-btn ${activeTab === 'imported' ? 'active' : ''}`}
          >
            📁 Local Imports ({importedBooks.length})
          </button>
        </div>
      </div>

      {/* Tab Content: All Books */}
      {activeTab === 'all' && (
        <div className="comic-book-grid">
          {allBooks.map((book, idx) => renderComicCard(book, idx))}
        </div>
      )}

      {/* Tab Content: In Progress */}
      {activeTab === 'progress' && (
        <div>
          {inProgressBooks.length > 0 ? (
            <div className="comic-book-grid">
              {inProgressBooks.map((book, idx) => renderComicCard(book, idx, 'RESUME!'))}
            </div>
          ) : (
            <div
              style={{
                background: '#fff',
                border: '3px solid var(--color-ink)',
                borderRadius: 12,
                padding: 40,
                textAlign: 'center',
                boxShadow: '4px 4px 0 var(--color-ink)',
              }}
            >
              <p style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-ink)', margin: 0 }}>
                No books currently in progress. Start reading from our catalog!
              </p>
              <button
                onClick={() => {
                  setActiveTab('all');
                  setSearchParams({ tab: 'all' });
                }}
                className="btn comic-btn comic-btn-yellow"
                style={{ marginTop: 14 }}
              >
                Browse All Books
              </button>
            </div>
          )}

          {completedBooks.length > 0 && (
            <div style={{ marginTop: 40 }}>
              <div className="comic-shelf-title" style={{ marginBottom: 16 }}>
                <span className="comic-star">★</span> COMPLETED ISSUES ({completedBooks.length})
              </div>
              <div className="comic-book-grid">
                {completedBooks.map((book, idx) => renderComicCard(book, idx, 'DONE!'))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab Content: History */}
      {activeTab === 'history' && (
        <div>
          {historyList.length > 0 ? (
            <div className="comic-book-grid">
              {historyList.map(({ book, progress }, idx) =>
                renderComicCard(book, idx, progress.completed ? 'DONE!' : 'LAST READ!')
              )}
            </div>
          ) : (
            <div
              style={{
                background: '#fff',
                border: '3px solid var(--color-ink)',
                borderRadius: 12,
                padding: 40,
                textAlign: 'center',
                boxShadow: '4px 4px 0 var(--color-ink)',
              }}
            >
              <p style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-ink)', margin: 0 }}>
                No reading history recorded yet. Open any book to begin!
              </p>
              <button
                onClick={() => {
                  setActiveTab('all');
                  setSearchParams({ tab: 'all' });
                }}
                className="btn comic-btn comic-btn-yellow"
                style={{ marginTop: 14 }}
              >
                Start Reading
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab Content: Bookmarks */}
      {activeTab === 'bookmarks' && (
        <div>
          {bookmarks.length > 0 ? (
            <div className="comic-book-grid">
              {bookmarks.map((bm, idx) => {
                const book = allBooks.find(b => b.id === bm.bookId);
                const accentColor = colors[idx % colors.length];

                return (
                  <Link
                    key={bm.bookmarkId}
                    to={`/read/${bm.bookId}/${bm.pageId}`}
                    className="comic-card"
                  >
                    <div className="comic-card-cover" style={{ backgroundColor: accentColor }}>
                      <div className="comic-card-ribbon">
                        <span>BOOKMARK PIN</span>
                        <span className="comic-issue-no">PAGE {bm.pageId}</span>
                      </div>
                      <div className="comic-cover-art">
                        <div className="comic-cover-icon">★</div>
                        <h3 className="comic-cover-heading">{bm.label || book?.title || bm.bookId}</h3>
                      </div>
                      <div className="comic-sound-effect">PINNED!</div>
                    </div>

                    <div className="comic-card-body">
                      <p className="comic-card-desc">
                        Saved bookmark in <strong>{book?.title || bm.bookId}</strong> at section "{bm.pageId}".
                      </p>
                      <div className="comic-card-meta">
                        <div className="comic-tag-pills">
                          <span className="comic-pill">#bookmark</span>
                        </div>
                        <span className="comic-read-link">JUMP TO PAGE ➔</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div
              style={{
                background: '#fff',
                border: '3px solid var(--color-ink)',
                borderRadius: 12,
                padding: 40,
                textAlign: 'center',
                boxShadow: '4px 4px 0 var(--color-ink)',
              }}
            >
              <p style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-ink)', margin: 0 }}>
                No bookmarks pinned yet. Tap ★ Bookmark while reading any issue to save it here!
              </p>
            </div>
          )}
        </div>
      )}

      {/* Tab Content: Imported */}
      {activeTab === 'imported' && (
        <div>
          {importedBooks.length > 0 ? (
            <div className="comic-book-grid">
              {importedBooks.map((book, idx) => renderComicCard(book, idx, 'LOCAL!', 'IMPORTED'))}
            </div>
          ) : (
            <div
              style={{
                background: '#fff',
                border: '3px solid var(--color-ink)',
                borderRadius: 12,
                padding: 40,
                textAlign: 'center',
                boxShadow: '4px 4px 0 var(--color-ink)',
              }}
            >
              <p style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-ink)', margin: 0 }}>
                No private HTML visual books imported yet.
              </p>
              <Link
                to="/publish"
                className="btn comic-btn comic-btn-yellow"
                style={{ marginTop: 14, display: 'inline-block' }}
              >
                Import / Publish Book
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
