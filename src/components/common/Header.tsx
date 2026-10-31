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
      <div className="header-brand-group">
        {onToggleSidebar && (
          <button
            className="sidebar-burger-btn"
            onClick={onToggleSidebar}
            title={isSidebarCollapsed ? 'Open navigation menu' : 'Close navigation menu'}
            aria-label="Toggle navigation menu"
          >
            {isSidebarCollapsed ? '☰' : '✕'}
          </button>
        )}
        <Link to="/" className="brand">
          <div className="brand-mark">IL</div>
          <div className="brand-title">IndexLib</div>
        </Link>
      </div>

      <form
        className={`search-bar ${isSearchExpandedMobile ? 'search-bar-expanded' : ''}`}
        onSubmit={handleSearchSubmit}
      >
        <span className="search-icon">🔍</span>
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

      <div className="header-actions">
        <button
          type="button"
          className="search-toggle-mobile-btn"
          onClick={() => setIsSearchExpandedMobile(prev => !prev)}
          aria-label="Toggle search input"
          title="Search"
        >
          🔍
        </button>

        {user?.role === 'admin' && (
          <>
            <Link to="/publish" className="btn btn-primary header-admin-btn">
              ＋ Publish
            </Link>
            <Link to="/admin" className="badge badge-warning header-admin-badge" style={{ textDecoration: 'none' }}>
              Admin
            </Link>
          </>
        )}
        <Link to="/account" className="btn header-auth-btn">
          {user ? `👤 ${user.username}` : 'Sign In'}
        </Link>
      </div>
    </header>
  );
};
