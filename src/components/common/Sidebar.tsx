import React from 'react';
import { NavLink } from 'react-router-dom';

interface SidebarProps {
  conceptCount?: number;
  pathCount?: number;
  libraryCount?: number;
  isAdmin?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  conceptCount = 5,
  pathCount = 2,
  libraryCount = 0,
  isAdmin = false,
}) => {
  return (
    <aside className="sidebar">
      <div>
        <p className="nav-group-title">Explore</p>
        <ul className="nav-list">
          <li>
            <NavLink to="/topics" className={({ isActive }) => `nav-item-link ${isActive ? 'active' : ''}`}>
              <span>Topics</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/concepts" className={({ isActive }) => `nav-item-link ${isActive ? 'active' : ''}`}>
              <span>Concepts</span>
              <span className="nav-counter">{conceptCount}</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/paths" className={({ isActive }) => `nav-item-link ${isActive ? 'active' : ''}`}>
              <span>Learning Paths</span>
              <span className="nav-counter">{pathCount}</span>
            </NavLink>
          </li>
        </ul>
      </div>

      <div>
        <p className="nav-group-title">My Space</p>
        <ul className="nav-list">
          <li>
            <NavLink to="/library" className={({ isActive }) => `nav-item-link ${isActive ? 'active' : ''}`}>
              <span>My Library</span>
              {libraryCount > 0 && <span className="nav-counter">{libraryCount}</span>}
            </NavLink>
          </li>
          <li>
            <NavLink to="/learning" className={({ isActive }) => `nav-item-link ${isActive ? 'active' : ''}`}>
              <span>Reading Activity</span>
            </NavLink>
          </li>
        </ul>
      </div>

      <div>
        <p className="nav-group-title">Creator & Admin</p>
        <ul className="nav-list">
          <li>
            <NavLink to="/publish" className={({ isActive }) => `nav-item-link ${isActive ? 'active' : ''}`}>
              <span>Publish Book</span>
            </NavLink>
          </li>
          {isAdmin && (
            <li>
              <NavLink to="/admin" className={({ isActive }) => `nav-item-link ${isActive ? 'active' : ''}`}>
                <span>Admin Moderation</span>
              </NavLink>
            </li>
          )}
        </ul>
      </div>
    </aside>
  );
};
