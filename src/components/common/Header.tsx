import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserProfile } from '../../types';

interface HeaderProps {
  user: UserProfile | null;
  onSignOut?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user }) => {
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
      <Link to="/" className="brand">
        <div className="brand-mark">IL</div>
        <div className="brand-title">IndexLib</div>
      </Link>

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
        <Link to="/publish" className="btn btn-primary">
          ＋ Publish Book
        </Link>
        {user?.role === 'admin' && (
          <Link to="/admin" className="badge badge-warning" style={{ textDecoration: 'none' }}>
            Admin Moderation
          </Link>
        )}
        <Link to="/account" className="btn">
          {user ? `👤 ${user.username}` : 'Sign In'}
        </Link>
      </div>
    </header>
  );
};
