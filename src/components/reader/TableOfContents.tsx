import React from 'react';

interface TableOfContentsProps {
  pageIds: string[];
  currentPageId: string;
  isOpen: boolean;
  onSelectPage: (pageId: string) => void;
  onClose: () => void;
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({
  pageIds,
  currentPageId,
  isOpen,
  onSelectPage,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.4)',
        zIndex: 200,
        display: 'flex',
        justifyContent: 'flex-end',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: 320,
          background: 'var(--color-surface)',
          height: '100%',
          boxShadow: 'var(--shadow-md)',
          padding: 24,
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ fontFamily: 'var(--font-editorial)', fontSize: '1.4rem' }}>Table of Contents</h3>
          <button
            onClick={onClose}
            className="btn"
            style={{ padding: '4px 8px', fontSize: '0.9rem' }}
          >
            ✕
          </button>
        </div>

        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
          {pageIds.map((pageId, index) => {
            const isActive = pageId === currentPageId;
            return (
              <li key={pageId}>
                <button
                  onClick={() => {
                    onSelectPage(pageId);
                    onClose();
                  }}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    background: isActive ? 'var(--color-ink)' : 'transparent',
                    color: isActive ? '#fff' : 'var(--color-ink)',
                    fontWeight: isActive ? 600 : 400,
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.75rem',
                      opacity: 0.7,
                      minWidth: 20,
                    }}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span style={{ textTransform: 'capitalize' }}>
                    {pageId.replace(/[-_]/g, ' ')}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};
