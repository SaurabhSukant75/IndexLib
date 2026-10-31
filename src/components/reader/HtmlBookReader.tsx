import React, { useEffect, useRef, useState } from 'react';
import { BookmarkRecord } from '../../types';
import { ReaderToolbar } from './ReaderToolbar';
import { TableOfContents } from './TableOfContents';

export interface HtmlBookReaderProps {
  src: string;
  bookId: string;
  title: string;
  initialPageId?: string;
  isImported?: boolean;
  isSaved?: boolean;
  isCompleted?: boolean;
  bookmarks?: BookmarkRecord[];
  onPageChange?: (pageId: string) => void;
  onBookReady?: (pageIds: string[]) => void;
  onToggleSave?: () => void;
  onToggleComplete?: () => void;
  onToggleBookmark?: (pageId: string) => void;
  onBack?: () => void;
  className?: string;
}

const BOOK_MESSAGE_PROTOCOL = 'index-dictionary.book';

export const HtmlBookReader: React.FC<HtmlBookReaderProps> = ({
  src,
  bookId,
  title,
  initialPageId,
  isImported = false,
  isSaved = false,
  isCompleted = false,
  bookmarks = [],
  onPageChange,
  onBookReady,
  onToggleSave,
  onToggleComplete,
  onToggleBookmark,
  onBack,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [currentPageId, setCurrentPageId] = useState<string>(initialPageId || '');
  const [pageIds, setPageIds] = useState<string[]>([]);
  const [zoomLevel, setZoomLevel] = useState<number>(1.0);
  const [isTocOpen, setIsTocOpen] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Monitor native fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        if (containerRef.current?.requestFullscreen) {
          await containerRef.current.requestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        }
      }
    } catch (err) {
      // Fallback: toggle pseudo fullscreen CSS class
      setIsFullscreen(prev => !prev);
    }
  };

  // Message Handler for postMessage protocol
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (!iframeRef.current || event.source !== iframeRef.current.contentWindow) {
        return;
      }

      // Check protocol signature
      const data = event.data;
      if (!data || typeof data !== 'object') return;
      if (data.protocol !== BOOK_MESSAGE_PROTOCOL || data.version !== 1) return;
      if (data.bookId !== bookId) return;

      const pageId = data.pageId;
      if (typeof pageId === 'string') {
        setCurrentPageId(pageId);
        if (onPageChange) onPageChange(pageId);
      }

      if (data.type === 'book-ready') {
        if (data.pageIds && Array.isArray(data.pageIds)) {
          setPageIds(data.pageIds);
          if (onBookReady) onBookReady(data.pageIds);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [bookId, onPageChange, onBookReady]);

  // Navigate iframe to specific page
  const handleSelectPage = (pageId: string) => {
    setCurrentPageId(pageId);
    if (iframeRef.current && iframeRef.current.contentWindow) {
      // Post navigation message or update hash
      try {
        const frameUrl = new URL(iframeRef.current.src, window.location.href);
        frameUrl.hash = pageId;
        iframeRef.current.src = frameUrl.href;
      } catch {
        // Fallback
      }
    }
    if (onPageChange) onPageChange(pageId);
  };

  const isCurrentPageBookmarked = bookmarks.some(b => b.pageId === currentPageId);

  // Calculate progress percentage
  const currentIndex = pageIds.indexOf(currentPageId);
  const progressPercent = pageIds.length > 1 && currentIndex >= 0
    ? Math.round(((currentIndex + 1) / pageIds.length) * 100)
    : isCompleted ? 100 : 15;

  const handleShare = () => {
    const currentUrl = window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl);
      alert('Direct link to this page copied to clipboard!');
    }
  };

  return (
    <div
      ref={containerRef}
      className={`reader-container ${className} ${isFullscreen ? 'reader-fullscreen' : ''}`}
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-line)',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-md)',
        display: 'flex',
        flexDirection: 'column',
        height: isFullscreen ? '100vh' : 'calc(100vh - var(--header-height) - 64px)',
        minHeight: 560,
        overflow: 'hidden',
        ...(isFullscreen
          ? {
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 9999,
              borderRadius: 0,
              border: 'none',
            }
          : {}),
      }}
    >
      <ReaderToolbar
        title={title}
        currentPageId={currentPageId}
        isSaved={isSaved}
        isCompleted={isCompleted}
        isBookmarked={isCurrentPageBookmarked}
        isImported={isImported}
        isFullscreen={isFullscreen}
        zoomLevel={zoomLevel}
        onZoomChange={setZoomLevel}
        onToggleFullscreen={toggleFullscreen}
        onToggleSave={onToggleSave}
        onToggleComplete={onToggleComplete}
        onToggleBookmark={() => onToggleBookmark && onToggleBookmark(currentPageId)}
        onShare={isImported ? undefined : handleShare}
        onOpenToc={() => setIsTocOpen(true)}
        onBack={onBack}
      />

      {/* Progress track */}
      <div style={{ height: 4, background: 'var(--color-line)', width: '100%' }}>
        <div
          style={{
            height: '100%',
            background: 'var(--color-green)',
            width: `${progressPercent}%`,
            transition: 'width 0.3s ease',
          }}
        />
      </div>

      {/* Sandboxed iframe */}
      <div
        style={{
          flex: 1,
          overflow: 'hidden',
          display: 'flex',
          justifyContent: 'center',
          backgroundColor: '#fdfcf9',
        }}
      >
        <iframe
          ref={iframeRef}
          src={initialPageId ? `${src}#${initialPageId}` : src}
          title={`${title} reading canvas`}
          sandbox="allow-scripts"
          referrerPolicy="no-referrer"
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            transform: zoomLevel !== 1.0 ? `scale(${zoomLevel})` : undefined,
            transformOrigin: 'top center',
            transition: 'transform 0.15s ease',
          }}
        />
      </div>

      {/* Table of Contents Drawer */}
      <TableOfContents
        pageIds={pageIds.length ? pageIds : ['cover', 'contents', 'chapter-1', 'recap']}
        currentPageId={currentPageId}
        isOpen={isTocOpen}
        onSelectPage={handleSelectPage}
        onClose={() => setIsTocOpen(false)}
      />
    </div>
  );
};
