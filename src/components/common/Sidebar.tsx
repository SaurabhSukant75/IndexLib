import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

interface SidebarProps {
  conceptCount?: number;
  pathCount?: number;
  libraryCount?: number;
  isAdmin?: boolean;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  conceptCount = 4,
  pathCount = 1,
  isAdmin = false,
  isCollapsed = false,
  onToggleCollapse,
}) => {
  // Vertical collapse/expand state for sidebar sections
  const [isExploreOpen, setIsExploreOpen] = useState(true);
  const [isPublishOpen, setIsPublishOpen] = useState(true);
  const [isMySpaceOpen, setIsMySpaceOpen] = useState(true);
  const [isAdminOpen, setIsAdminOpen] = useState(true);

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header-row">
        {!isCollapsed && <span className="sidebar-brand-sub">Navigation</span>}
        <button
          className="sidebar-toggle-btn"
          onClick={onToggleCollapse}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? '❯' : '❮'}
        </button>
      </div>

      {/* 1. Explore Section (Collapsible) */}
      <div className="sidebar-section">
        <div
          className="nav-group-header"
          onClick={() => !isCollapsed && setIsExploreOpen(prev => !prev)}
          title={isExploreOpen ? 'Collapse Explore' : 'Expand Explore'}
        >
          <span className="nav-group-title">{!isCollapsed ? 'Explore' : '•••'}</span>
          {!isCollapsed && (
            <span className="section-toggle-icon">{isExploreOpen ? '▾' : '▸'}</span>
          )}
        </div>
        {(!isCollapsed ? isExploreOpen : true) && (
          <ul className="nav-list">
            <li>
              <NavLink
                to="/concepts"
                className={({ isActive }) => `nav-item-link ${isActive ? 'active' : ''}`}
                title="Concepts (Evergreen & Trending)"
              >
                <span className="nav-item-icon">💡</span>
                {!isCollapsed && <span>Concepts</span>}
                {!isCollapsed && <span className="nav-counter">{conceptCount}</span>}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/paths"
                className={({ isActive }) => `nav-item-link ${isActive ? 'active' : ''}`}
                title="Learning Paths"
              >
                <span className="nav-item-icon">🧭</span>
                {!isCollapsed && <span>Learning Paths</span>}
                {!isCollapsed && <span className="nav-counter">{pathCount}</span>}
              </NavLink>
            </li>
          </ul>
        )}
      </div>

      {/* 2. Publish a Book Section (Placed after Explore and before My Space) */}
      <div className="sidebar-section">
        <div
          className="nav-group-header"
          onClick={() => !isCollapsed && setIsPublishOpen(prev => !prev)}
          title={isPublishOpen ? 'Collapse Publish' : 'Expand Publish'}
        >
          <span className="nav-group-title">{!isCollapsed ? 'Publish a Book' : '•••'}</span>
          {!isCollapsed && (
            <span className="section-toggle-icon">{isPublishOpen ? '▾' : '▸'}</span>
          )}
        </div>
        {(!isCollapsed ? isPublishOpen : true) && (
          <ul className="nav-list">
            <li>
              <NavLink
                to="/publish"
                className={({ isActive }) => `nav-item-link ${isActive ? 'active' : ''}`}
                title="Publish a Book"
              >
                <span className="nav-item-icon">✍️</span>
                {!isCollapsed && <span>Publish Studio</span>}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/publish?mode=manage"
                className={({ isActive }) => `nav-item-link ${isActive ? 'active' : ''}`}
                title="Manage Versions"
              >
                <span className="nav-item-icon">🔄</span>
                {!isCollapsed && <span>My Book Versions</span>}
              </NavLink>
            </li>
          </ul>
        )}
      </div>

      {/* 3. My Space Section (Collapsible) */}
      <div className="sidebar-section">
        <div
          className="nav-group-header"
          onClick={() => !isCollapsed && setIsMySpaceOpen(prev => !prev)}
          title={isMySpaceOpen ? 'Collapse My Space' : 'Expand My Space'}
        >
          <span className="nav-group-title">{!isCollapsed ? 'My Space' : '•••'}</span>
          {!isCollapsed && (
            <span className="section-toggle-icon">{isMySpaceOpen ? '▾' : '▸'}</span>
          )}
        </div>
        {(!isCollapsed ? isMySpaceOpen : true) && (
          <ul className="nav-list">
            <li>
              <NavLink
                to="/library?tab=history"
                className={({ isActive }) => `nav-item-link ${isActive ? 'active' : ''}`}
                title="History"
              >
                <span className="nav-item-icon">📜</span>
                {!isCollapsed && <span>History</span>}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/library?tab=progress"
                className={({ isActive }) => `nav-item-link ${isActive ? 'active' : ''}`}
                title="User Progress"
              >
                <span className="nav-item-icon">📊</span>
                {!isCollapsed && <span>User Progress</span>}
              </NavLink>
            </li>
          </ul>
        )}
      </div>

      {/* 4. Creator & Admin Section (For Admin Users) */}
      {isAdmin && (
        <div className="sidebar-section">
          <div
            className="nav-group-header"
            onClick={() => !isCollapsed && setIsAdminOpen(prev => !prev)}
            title={isAdminOpen ? 'Collapse Admin' : 'Expand Admin'}
          >
            <span className="nav-group-title">{!isCollapsed ? 'Admin' : '•••'}</span>
            {!isCollapsed && (
              <span className="section-toggle-icon">{isAdminOpen ? '▾' : '▸'}</span>
            )}
          </div>
          {(!isCollapsed ? isAdminOpen : true) && (
            <ul className="nav-list">
              <li>
                <NavLink
                  to="/admin"
                  className={({ isActive }) => `nav-item-link ${isActive ? 'active' : ''}`}
                  title="Admin Moderation"
                >
                  <span className="nav-item-icon">🛡️</span>
                  {!isCollapsed && <span>Moderation Queue</span>}
                </NavLink>
              </li>
            </ul>
          )}
        </div>
      )}
    </aside>
  );
};
