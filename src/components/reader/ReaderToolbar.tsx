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
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 20px',
        background: '#fff',
        borderBottom: '1px solid var(--color-line)',
        flexWrap: 'wrap',
        gap: 12,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        {onBack && (
          <button className="btn" onClick={onBack} title="Return to library">
            ← Library
          </button>
        )}
        <div>
          <strong style={{ fontSize: '1.05rem', display: 'block' }}>{title}</strong>
          <small style={{ color: 'var(--color-muted)', fontSize: '0.78rem' }}>
            {isImported ? 'Private HTML import · Local Device' : `Section: ${currentPageId || 'Introduction'}`}
          </small>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {/* Zoom Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginRight: 8 }}>
          <button
            className="btn"
            style={{ padding: '4px 8px', fontSize: '0.8rem' }}
            onClick={() => onZoomChange(Math.max(0.85, zoomLevel - 0.1))}
            title="Decrease font size"
          >
            A-
          </button>
          <span style={{ fontSize: '0.8rem', color: 'var(--color-muted)', minWidth: 40, textAlign: 'center' }}>
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            className="btn"
            style={{ padding: '4px 8px', fontSize: '0.8rem' }}
            onClick={() => onZoomChange(Math.min(1.3, zoomLevel + 0.1))}
            title="Increase font size"
          >
            A+
          </button>
        </div>

        <button
          className="btn"
          onClick={onOpenToc}
          title="Open Table of Contents"
        >
          ☰ Contents
        </button>

        {onToggleFullscreen && (
          <button
            className={`btn ${isFullscreen ? 'btn-primary' : ''}`}
            onClick={onToggleFullscreen}
            title={isFullscreen ? 'Exit Full Screen' : 'Maximize Full Screen'}
          >
            {isFullscreen ? '⤓ Exit Full' : '⛶ Full Screen'}
          </button>
        )}

        {onToggleBookmark && (
          <button
            className="btn"
            onClick={onToggleBookmark}
            style={{ color: isBookmarked ? 'var(--color-green)' : 'inherit' }}
          >
            {isBookmarked ? '★ Bookmarked' : '☆ Bookmark'}
          </button>
        )}

        {onToggleSave && (
          <button
            className="btn"
            onClick={onToggleSave}
            style={{ color: isSaved ? 'var(--color-green)' : 'inherit' }}
          >
            {isSaved ? '★ Saved' : '☆ Save'}
          </button>
        )}

        {onToggleComplete && (
          <button
            className={`btn ${isCompleted ? 'btn-primary' : ''}`}
            onClick={onToggleComplete}
          >
            {isCompleted ? '✓ Completed' : 'Mark Complete'}
          </button>
        )}

        {onShare && (
          <button className="btn" onClick={onShare} title="Copy direct link">
            Share ⎘
          </button>
        )}
      </div>
    </div>
  );
};
