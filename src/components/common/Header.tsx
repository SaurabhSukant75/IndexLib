import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserProfile } from '../../types';

interface HeaderProps {
  user: UserProfile | null;
  onSignOut?: () => void;
  onToggleSidebar?: () => void;
  isSidebarCollapsed?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ user, onToggleSidebar, isSidebarCollapsed }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchExpandedMobile, setIsSearchExpandedMobile] = useState(false);
  const navigate = useNavigate();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchExpandedMobile(false);
    }
  };

  return (
    <header className="app-header">
      {/* Brand & Drawer Toggle */}
      <div className="header-brand-group">
        {onToggleSidebar && (
          <button
            className="sidebar-burger-btn"
            onClick={onToggleSidebar}
            title={isSidebarCollapsed ? 'Open navigation vault' : 'Close navigation vault'}
            aria-label="Toggle navigation vault"
          >
            {isSidebarCollapsed ? '☰' : '✕'}
          </button>
        )}
        <Link to="/" className="brand">
          <div className="brand-mark">IL</div>
          <div className="brand-title">INDEXLIB</div>
        </Link>
      </div>

      {/* Desktop Search Bar / Mobile Expanded Bar */}
      <form
        className={`search-bar ${isSearchExpandedMobile ? 'search-bar-expanded' : ''}`}
        onSubmit={handleSearchSubmit}
      >
        <span className="search-icon-text">SEARCH</span>
        <input
          type="text"
          className="search-input"
          placeholder="Search books, concepts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {isSearchExpandedMobile && (
          <button
            type="button"
            className="search-close-mobile-btn"
            onClick={() => setIsSearchExpandedMobile(false)}
            aria-label="Close search"
          >
            ✕
          </button>
        )}
      </form>

      {/* Header Actions */}
      <div className="header-actions">
        {/* Mobile Search Trigger Icon */}
        <button
          type="button"
          className="search-toggle-mobile-btn"
          onClick={() => setIsSearchExpandedMobile(prev => !prev)}
          aria-label="Search"
          title="Search"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>

        {user?.role === 'admin' && (
          <>
            <Link to="/publish" className="btn comic-header-btn comic-header-btn-yellow header-admin-btn">
              + PUBLISH
            </Link>
            <Link to="/admin" className="comic-header-badge header-admin-badge">
              ADMIN
            </Link>
          </>
        )}

        {/* User / Sign In Button */}
        <Link
          to="/account"
          className={`btn comic-user-btn ${user ? 'comic-user-active' : ''}`}
        >
          {user ? (
            <span className="comic-user-label">
              <span className="comic-user-tag">READER</span>
              <strong className="comic-user-name">{user.username}</strong>
            </span>
          ) : (
            <span className="comic-signin-label">SIGN IN</span>
          )}
        </Link>
      </div>
    </header>
  );
};
