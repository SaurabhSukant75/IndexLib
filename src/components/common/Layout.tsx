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
  const isHomeRoute = location.pathname === '/' || location.pathname === '';

  // Initial state: by default, collapse on Home page, Reader page, and mobile screens <= 768px
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth > 768 && !isReaderRoute && !isHomeRoute;
    }
    return false;
  });

  // Automatically close sidebar when navigating to Home, Reader, or on mobile
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth <= 768 || isReaderRoute || isHomeRoute) {
        setIsSidebarOpen(false);
      }
    }
  }, [location.pathname, isReaderRoute, isHomeRoute]);

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
