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
  const navigate = useNavigate();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="app-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {onToggleSidebar && (
          <button
            className="sidebar-burger-btn"
            onClick={onToggleSidebar}
            title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label="Toggle sidebar menu"
          >
            ☰
          </button>
        )}
        <Link to="/" className="brand">
          <div className="brand-mark">IL</div>
          <div className="brand-title">IndexLib</div>
        </Link>
      </div>

      <form className="search-bar" onSubmit={handleSearchSubmit}>
        <span className="search-icon">🔍</span>
        <input
          type="text"
          className="search-input"
          placeholder="Search visual books, concepts, topics..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </form>

      <div className="header-actions">
        {user?.role === 'admin' && (
          <>
            <Link to="/publish" className="btn btn-primary">
              ＋ Publish Book
            </Link>
            <Link to="/admin" className="badge badge-warning" style={{ textDecoration: 'none' }}>
              Admin Moderation
            </Link>
          </>
        )}
        <Link to="/account" className="btn">
          {user ? `👤 ${user.username}` : 'Sign In'}
        </Link>
      </div>
    </header>
  );
};
