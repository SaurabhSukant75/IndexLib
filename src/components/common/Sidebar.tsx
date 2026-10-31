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
  const [isDesignStudioOpen, setIsDesignStudioOpen] = useState(true);
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
            <li>
              <NavLink
                to="/training"
                className={({ isActive }) => `nav-item-link ${isActive ? 'active' : ''}`}
                title="Creator Training"
              >
                <span className="nav-item-icon">🎓</span>
                {!isCollapsed && <span>Training</span>}
              </NavLink>
            </li>
          </ul>
        )}
      </div>

      {/* 2. Design Studio Section (Publish a book & Template Catalog) */}
      <div className="sidebar-section">
        <div
          className="nav-group-header"
          onClick={() => !isCollapsed && setIsDesignStudioOpen(prev => !prev)}
          title={isDesignStudioOpen ? 'Collapse Design Studio' : 'Expand Design Studio'}
        >
          <span className="nav-group-title">{!isCollapsed ? 'Design Studio' : '•••'}</span>
          {!isCollapsed && (
            <span className="section-toggle-icon">{isDesignStudioOpen ? '▾' : '▸'}</span>
          )}
        </div>
        {(!isCollapsed ? isDesignStudioOpen : true) && (
          <ul className="nav-list">
            <li>
              <NavLink
                to="/publish"
                className={({ isActive }) => `nav-item-link ${isActive ? 'active' : ''}`}
                title="Publish a Book"
              >
                <span className="nav-item-icon">✍️</span>
                {!isCollapsed && <span>Publish a Book</span>}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/templates"
                className={({ isActive }) => `nav-item-link ${isActive ? 'active' : ''}`}
                title="Template Catalog"
              >
                <span className="nav-item-icon">📑</span>
                {!isCollapsed && <span>Template Catalog</span>}
              </NavLink>
            </li>
          </ul>
        )}
      </div>

      {/* 3. My Space Section (Direct link, No dropdown needed) */}
      <div className="sidebar-section">
        <ul className="nav-list">
          <li>
            <NavLink
              to="/library?tab=history"
              className={({ isActive }) => `nav-item-link ${isActive ? 'active' : ''}`}
              title="My Space"
            >
              {!isCollapsed ? (
                <strong style={{ letterSpacing: '0.3px', fontSize: '0.95rem' }}>My Space</strong>
              ) : (
                <span style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>MS</span>
              )}
            </NavLink>
          </li>
        </ul>
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
