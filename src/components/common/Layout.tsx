import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
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
  const location = useLocation();
  const isReaderRoute = location.pathname.startsWith('/read/');

  // Initial state: collapse on mobile screens <= 768px or in reader view
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth > 768 && !isReaderRoute;
    }
    return true;
  });

  // Automatically close sidebar when navigating to a new route on mobile or reader
  useEffect(() => {
    if (typeof window !== 'undefined' && (window.innerWidth <= 768 || isReaderRoute)) {
      setIsSidebarOpen(false);
    }
  }, [location.pathname, isReaderRoute]);

  const handleToggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
  };

  const shouldHideSidebar = hideSidebar || isReaderRoute;

  return (
    <div>
      <Header
        user={user}
        onToggleSidebar={shouldHideSidebar ? undefined : handleToggleSidebar}
        isSidebarCollapsed={!isSidebarOpen}
      />
      <div className={`app-container ${!isSidebarOpen ? 'sidebar-is-collapsed' : ''}`}>
        {!shouldHideSidebar && (
          <>
            {/* Mobile backdrop for drawer sidebar */}
            {isSidebarOpen && (
              <div
                className="sidebar-backdrop"
                onClick={handleCloseSidebar}
                aria-label="Close navigation menu"
              />
            )}
            <Sidebar
              conceptCount={conceptCount}
              pathCount={pathCount}
              libraryCount={libraryCount}
              isAdmin={user?.role === 'admin'}
              isCollapsed={!isSidebarOpen}
              onToggleCollapse={handleToggleSidebar}
              onCloseMobile={handleCloseSidebar}
            />
          </>
        )}
        <main className={`main-viewport ${isReaderRoute ? 'reader-main-viewport' : ''}`}>
          {children}
        </main>
      </div>
    </div>
  );
};
