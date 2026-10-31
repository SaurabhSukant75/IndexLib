import React from 'react';
import { NavLink } from 'react-router-dom';

interface SidebarProps {
  conceptCount?: number;
  pathCount?: number;
  libraryCount?: number;
  isAdmin?: boolean;
  isCollapsed?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  conceptCount = 100,
  pathCount = 1,
  isAdmin = false,
  isCollapsed = false,
  onCloseMobile,
}) => {
  const handleNavClick = () => {
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : 'mobile-open'}`}>
      {/* Comic Sidebar Vault Header */}
      <div className="comic-sidebar-header">
        <div className="comic-sidebar-badge">INDEX VAULT</div>
        <div className="comic-sidebar-vol">SERIES 1.0</div>
      </div>

      {/* Primary Navigation Sections */}
      <div className="comic-sidebar-content">
        {/* Explore Section */}
        <div className="comic-sidebar-group">
          <div className="comic-sidebar-group-title">EXPLORE</div>
          <ul className="comic-nav-list">
            <li>
              <NavLink
                to="/concepts"
                onClick={handleNavClick}
                className={({ isActive }) => `comic-nav-link ${isActive ? 'active' : ''}`}
                title="100 Concepts"
              >
                <span className="comic-nav-label">Concepts</span>
                <span className="comic-nav-count">{conceptCount}</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/paths"
                onClick={handleNavClick}
                className={({ isActive }) => `comic-nav-link ${isActive ? 'active' : ''}`}
                title="Learning Paths"
              >
                <span className="comic-nav-label">Learning Paths</span>
                <span className="comic-nav-count">{pathCount}</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/training"
                onClick={handleNavClick}
                className={({ isActive }) => `comic-nav-link ${isActive ? 'active' : ''}`}
                title="Creator Training"
              >
                <span className="comic-nav-label">Training</span>
                <span className="comic-nav-chip">PRO</span>
              </NavLink>
            </li>
          </ul>
        </div>

        {/* Studio Section */}
        <div className="comic-sidebar-group">
          <div className="comic-sidebar-group-title">STUDIO</div>
          <ul className="comic-nav-list">
            <li>
              <NavLink
                to="/publish"
                onClick={handleNavClick}
                className={({ isActive }) => `comic-nav-link ${isActive ? 'active' : ''}`}
                title="Publish a Visual Book"
              >
                <span className="comic-nav-label">Publish Book</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/templates"
                onClick={handleNavClick}
                className={({ isActive }) => `comic-nav-link ${isActive ? 'active' : ''}`}
                title="Template Catalog"
              >
                <span className="comic-nav-label">Templates</span>
              </NavLink>
            </li>
          </ul>
        </div>

        {/* My Vault Section */}
        <div className="comic-sidebar-group">
          <div className="comic-sidebar-group-title">MY VAULT</div>
          <ul className="comic-nav-list">
            <li>
              <NavLink
                to="/library?tab=all"
                onClick={handleNavClick}
                className={({ isActive }) => `comic-nav-link ${isActive ? 'active' : ''}`}
                title="All Issues"
              >
                <span className="comic-nav-label">All Issues</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/library?tab=progress"
                onClick={handleNavClick}
                className={({ isActive }) => `comic-nav-link ${isActive ? 'active' : ''}`}
                title="In Progress"
              >
                <span className="comic-nav-label">In Progress</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/library?tab=history"
                onClick={handleNavClick}
                className={({ isActive }) => `comic-nav-link ${isActive ? 'active' : ''}`}
                title="Reading History"
              >
                <span className="comic-nav-label">History</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/library?tab=bookmarks"
                onClick={handleNavClick}
                className={({ isActive }) => `comic-nav-link ${isActive ? 'active' : ''}`}
                title="Bookmarks"
              >
                <span className="comic-nav-label">Bookmarks</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/account"
                onClick={handleNavClick}
                className={({ isActive }) => `comic-nav-link ${isActive ? 'active' : ''}`}
                title="Account & Sync"
              >
                <span className="comic-nav-label">Account & Sync</span>
              </NavLink>
            </li>
          </ul>
        </div>

        {/* Admin Section */}
        {isAdmin && (
          <div className="comic-sidebar-group">
            <div className="comic-sidebar-group-title">ADMIN</div>
            <ul className="comic-nav-list">
              <li>
                <NavLink
                  to="/admin"
                  onClick={handleNavClick}
                  className={({ isActive }) => `comic-nav-link ${isActive ? 'active' : ''}`}
                  title="Admin Moderation Queue"
                >
                  <span className="comic-nav-label">Moderation Queue</span>
                  <span className="comic-nav-chip chip-admin">SHIELD</span>
                </NavLink>
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Footer Vault Issue Stamp */}
      <div className="comic-sidebar-footer">
        <div className="comic-issue-stamp">ISSUE NO. 01</div>
        <small className="comic-sidebar-copyright">© IndexLib Visuals</small>
      </div>
    </aside>
  );
};
