import React, { useState } from 'react';
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
  // Collapsible Explore and Studio sections
  const [isExploreOpen, setIsExploreOpen] = useState(true);
  const [isStudioOpen, setIsStudioOpen] = useState(true);
  const [isAdminOpen, setIsAdminOpen] = useState(true);

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

      <div className="comic-sidebar-content">
        {/* 1. Explore Section (Collapsible) */}
        <div className="comic-sidebar-group">
          <div
            className="comic-sidebar-group-header"
            onClick={() => setIsExploreOpen(prev => !prev)}
            title={isExploreOpen ? 'Collapse Explore' : 'Expand Explore'}
          >
            <span className="comic-sidebar-group-title">EXPLORE</span>
            <span className="comic-group-caret">{isExploreOpen ? '▾' : '▸'}</span>
          </div>

          {isExploreOpen && (
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
                  title="Practice"
                >
                  <span className="comic-nav-label">Practice</span>
                  <span className="comic-nav-chip">PRO</span>
                </NavLink>
              </li>
            </ul>
          )}
        </div>

        {/* 2. Studio Section (Collapsible) */}
        <div className="comic-sidebar-group">
          <div
            className="comic-sidebar-group-header"
            onClick={() => setIsStudioOpen(prev => !prev)}
            title={isStudioOpen ? 'Collapse Studio' : 'Expand Studio'}
          >
            <span className="comic-sidebar-group-title">STUDIO</span>
            <span className="comic-group-caret">{isStudioOpen ? '▾' : '▸'}</span>
          </div>

          {isStudioOpen && (
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
          )}
        </div>

        {/* 3. My Vault (Direct link to History page without sub-categories) */}
        <div className="comic-sidebar-group">
          <ul className="comic-nav-list">
            <li>
              <NavLink
                to="/library?tab=history"
                onClick={handleNavClick}
                className={({ isActive }) => `comic-nav-link ${isActive ? 'active' : ''}`}
                title="My Vault & Reading History"
              >
                <span className="comic-nav-label" style={{ fontWeight: 800 }}>MY VAULT</span>
                <span className="comic-nav-chip">VAULT</span>
              </NavLink>
            </li>
          </ul>
        </div>

        {/* 4. Admin Section (If admin) */}
        {isAdmin && (
          <div className="comic-sidebar-group">
            <div
              className="comic-sidebar-group-header"
              onClick={() => setIsAdminOpen(prev => !prev)}
            >
              <span className="comic-sidebar-group-title">ADMIN</span>
              <span className="comic-group-caret">{isAdminOpen ? '▾' : '▸'}</span>
            </div>

            {isAdminOpen && (
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
            )}
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
