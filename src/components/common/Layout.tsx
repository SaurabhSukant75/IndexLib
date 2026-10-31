import React, { useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { UserProfile } from '../../types';

interface LayoutProps {
  user: UserProfile | null;
  children: React.ReactNode;
  conceptCount?: number;
  pathCount?: number;
  libraryCount?: number;
  hideSidebar?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({
  user,
  children,
  conceptCount,
  pathCount,
  libraryCount,
  hideSidebar = false,
}) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div>
      <Header
        user={user}
        onToggleSidebar={() => setIsSidebarCollapsed(prev => !prev)}
        isSidebarCollapsed={isSidebarCollapsed}
      />
      <div className={`app-container ${isSidebarCollapsed ? 'sidebar-is-collapsed' : ''}`}>
        {!hideSidebar && (
          <Sidebar
            conceptCount={conceptCount}
            pathCount={pathCount}
            libraryCount={libraryCount}
            isAdmin={user?.role === 'admin'}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={() => setIsSidebarCollapsed(prev => !prev)}
          />
        )}
        <main className="main-viewport">{children}</main>
      </div>
    </div>
  );
};
