import React from 'react';
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

      <div>
        <p className="nav-group-title">{!isCollapsed ? 'Explore' : '•••'}</p>
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
      </div>

      <div>
        <p className="nav-group-title">{!isCollapsed ? 'My Space' : '•••'}</p>
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
      </div>

      {isAdmin && (
        <div>
          <p className="nav-group-title">{!isCollapsed ? 'Creator & Admin' : '•••'}</p>
          <ul className="nav-list">
            <li>
              <NavLink
                to="/publish"
                className={({ isActive }) => `nav-item-link ${isActive ? 'active' : ''}`}
                title="Publish Book"
              >
                <span className="nav-item-icon">✍️</span>
                {!isCollapsed && <span>Publish Book</span>}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin"
                className={({ isActive }) => `nav-item-link ${isActive ? 'active' : ''}`}
                title="Admin Moderation"
              >
                <span className="nav-item-icon">🛡️</span>
                {!isCollapsed && <span>Admin Moderation</span>}
              </NavLink>
            </li>
          </ul>
        </div>
      )}
    </aside>
  );
};
