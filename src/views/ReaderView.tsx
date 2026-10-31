import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BookmarkRecord, CatalogBook, ReadingProgressRecord, UserProfile } from '../types';
import { HtmlBookReader } from '../components/reader/HtmlBookReader';
import { getLocalBookmarks, getLocalImport, getLocalProgress, saveLocalBookmark, deleteLocalBookmark, saveLocalProgress } from '../services/local-db';
import { syncProgressWithCloud } from '../services/supabase';

interface ReaderViewProps {
  catalogBooks: CatalogBook[];
  user: UserProfile | null;
  onToast: (msg: string) => void;
}

export const ReaderView: React.FC<ReaderViewProps> = ({ catalogBooks, user, onToast }) => {
  const { bookId, pageId } = useParams<{ bookId: string; pageId?: string }>();
  const navigate = useNavigate();

  const [book, setBook] = useState<CatalogBook | null>(null);
  const [contentSrc, setContentSrc] = useState<string>('');
  const [progress, setProgress] = useState<ReadingProgressRecord | null>(null);
  const [bookmarks, setBookmarks] = useState<BookmarkRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadBookData() {
      if (!bookId) return;
      setIsLoading(true);

      // Check bundled / catalog books
      let foundBook = catalogBooks.find(b => b.id === bookId);

      // If not in catalog, check IndexedDB local imports
      if (!foundBook) {
        const local = await getLocalImport(bookId);
        if (local) {
          foundBook = local;
          const blob = new Blob([local.html], { type: 'text/html;charset=utf-8' });
          setContentSrc(URL.createObjectURL(blob));
        }
      } else {
        // Resolve path relative to Vite base
        const basePath = import.meta.env.BASE_URL || '/';
        const normalizedBase = basePath.endsWith('/') ? basePath : `${basePath}/`;
        const cleanContentPath = foundBook.contentPath.replace(/^\/?/, '');
        setContentSrc(`${normalizedBase}${cleanContentPath}`);
      }

      setBook(foundBook || null);

      // Load progress & bookmarks
      const [prog, bms] = await Promise.all([
        getLocalProgress(bookId),
        getLocalBookmarks(bookId),
      ]);
      setProgress(prog || null);
      setBookmarks(bms);
      setIsLoading(false);
    }

    loadBookData();
  }, [bookId, catalogBooks]);

  const handlePageChange = async (newPageId: string) => {
    if (!bookId) return;
    const updatedProgress: ReadingProgressRecord = {
      bookId,
      currentPageId: newPageId,
      lastPageId: newPageId,
      completed: progress?.completed || false,
      updatedAt: Date.now(),
      lastOpenedAt: Date.now(),
    };
    setProgress(updatedProgress);
    await saveLocalProgress(updatedProgress);

    if (user) {
      await syncProgressWithCloud(user.id, [updatedProgress]);
    }
  };

  const handleToggleComplete = async () => {
    if (!bookId) return;
    const isNowCompleted = !progress?.completed;
    const updated: ReadingProgressRecord = {
      bookId,
      currentPageId: progress?.currentPageId,
      lastPageId: progress?.lastPageId,
      completed: isNowCompleted,
      updatedAt: Date.now(),
      lastOpenedAt: Date.now(),
    };
    setProgress(updated);
    await saveLocalProgress(updated);
    if (user) {
      await syncProgressWithCloud(user.id, [updated]);
    }
    onToast(isNowCompleted ? 'Marked book as complete!' : 'Marked book as in progress.');
  };

  const handleToggleBookmark = async (currentPageId: string) => {
    if (!bookId || !currentPageId) return;
    const existing = bookmarks.find(b => b.pageId === currentPageId);
    if (existing) {
      await deleteLocalBookmark(existing.bookmarkId);
      setBookmarks(prev => prev.filter(b => b.bookmarkId !== existing.bookmarkId));
      onToast(`Removed bookmark for section: ${currentPageId}`);
    } else {
      const newBm: BookmarkRecord = {
        bookmarkId: `bm-${Date.now().toString(36)}`,
        bookId,
        pageId: currentPageId,
        label: currentPageId.replace(/[-_]/g, ' '),
        createdAt: Date.now(),
      };
      await saveLocalBookmark(newBm);
      setBookmarks(prev => [...prev, newBm]);
      onToast(`Bookmarked section: ${currentPageId}`);
    }
  };

  if (isLoading) {
    return <div style={{ padding: 40 }}>Opening visual book canvas...</div>;
  }

  if (!book || !contentSrc) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <h2>Book not found</h2>
        <p style={{ color: 'var(--color-muted)', margin: '12px 0 20px' }}>
          We could not locate this visual book document.
        </p>
        <button className="btn btn-primary" onClick={() => navigate('/library')}>
          Return to Library
        </button>
      </div>
    );
  }

  return (
    <div>
      <HtmlBookReader
        src={contentSrc}
        bookId={book.id}
        title={book.title}
        initialPageId={pageId || progress?.currentPageId}
        isImported={book.isImported}
        isCompleted={progress?.completed}
        bookmarks={bookmarks}
        onPageChange={handlePageChange}
        onToggleComplete={handleToggleComplete}
        onToggleBookmark={handleToggleBookmark}
        onBack={() => navigate(-1)}
      />
    </div>
  );
};
