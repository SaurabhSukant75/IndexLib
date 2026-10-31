import React from 'react';

interface ReaderToolbarProps {
  title: string;
  currentPageId: string;
  isSaved?: boolean;
  isCompleted?: boolean;
  isBookmarked?: boolean;
  isImported?: boolean;
  isFullscreen?: boolean;
  zoomLevel: number;
  onZoomChange: (newZoom: number) => void;
  onToggleFullscreen?: () => void;
  onToggleSave?: () => void;
  onToggleComplete?: () => void;
  onToggleBookmark?: () => void;
  onShare?: () => void;
  onOpenToc: () => void;
  onBack?: () => void;
}

export const ReaderToolbar: React.FC<ReaderToolbarProps> = ({
  title,
  currentPageId,
  isSaved = false,
  isCompleted = false,
  isBookmarked = false,
  isImported = false,
  isFullscreen = false,
  zoomLevel,
  onZoomChange,
  onToggleFullscreen,
  onToggleSave,
  onToggleComplete,
  onToggleBookmark,
  onShare,
  onOpenToc,
  onBack,
}) => {
  return (
    <div className="reader-toolbar-container">
      <div className="reader-toolbar-left">
        {onBack && (
          <button className="btn reader-back-btn" onClick={onBack} title="Return to library">
            ← <span className="reader-btn-text">Library</span>
          </button>
        )}
        <div className="reader-title-box">
          <strong className="reader-book-title">{title}</strong>
          <small className="reader-page-sub">
            {isImported ? 'Private Import · Local' : `Sec: ${currentPageId || 'Introduction'}`}
          </small>
        </div>
      </div>

      <div className="reader-toolbar-actions">
        {/* Zoom Controls */}
        <div className="reader-zoom-group">
          <button
            className="btn reader-icon-btn"
            onClick={() => onZoomChange(Math.max(0.85, zoomLevel - 0.1))}
            title="Decrease font size"
            aria-label="Decrease font size"
          >
            A-
          </button>
          <span className="reader-zoom-text">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            className="btn reader-icon-btn"
            onClick={() => onZoomChange(Math.min(1.3, zoomLevel + 0.1))}
            title="Increase font size"
            aria-label="Increase font size"
          >
            A+
          </button>
        </div>

        <button
          className="btn reader-action-btn"
          onClick={onOpenToc}
          title="Open Table of Contents"
        >
          ☰ <span className="reader-btn-text">Contents</span>
        </button>

        {onToggleFullscreen && (
          <button
            className={`btn reader-action-btn ${isFullscreen ? 'btn-primary' : ''}`}
            onClick={onToggleFullscreen}
            title={isFullscreen ? 'Exit Full Screen' : 'Maximize Full Screen'}
          >
            {isFullscreen ? '⤓' : '⛶'} <span className="reader-btn-text">{isFullscreen ? 'Exit' : 'Full'}</span>
          </button>
        )}

        {onToggleBookmark && (
          <button
            className="btn reader-action-btn"
            onClick={onToggleBookmark}
            style={{ color: isBookmarked ? 'var(--color-green)' : 'inherit' }}
            title={isBookmarked ? 'Bookmarked' : 'Add Bookmark'}
          >
            {isBookmarked ? '★' : '☆'} <span className="reader-btn-text">{isBookmarked ? 'Marked' : 'Bookmark'}</span>
          </button>
        )}

        {onToggleSave && (
          <button
            className="btn reader-action-btn reader-hide-small"
            onClick={onToggleSave}
            style={{ color: isSaved ? 'var(--color-green)' : 'inherit' }}
            title={isSaved ? 'Saved in library' : 'Save to library'}
          >
            {isSaved ? '★' : '☆'} <span className="reader-btn-text">{isSaved ? 'Saved' : 'Save'}</span>
          </button>
        )}

        {onToggleComplete && (
          <button
            className={`btn reader-action-btn ${isCompleted ? 'btn-primary' : ''}`}
            onClick={onToggleComplete}
            title={isCompleted ? 'Finished reading' : 'Mark as completed'}
          >
            {isCompleted ? '✓' : '○'} <span className="reader-btn-text">{isCompleted ? 'Done' : 'Complete'}</span>
          </button>
        )}

        {onShare && (
          <button className="btn reader-action-btn" onClick={onShare} title="Copy link" aria-label="Share">
            ⎘ <span className="reader-btn-text">Share</span>
          </button>
        )}
      </div>
    </div>
  );
};
