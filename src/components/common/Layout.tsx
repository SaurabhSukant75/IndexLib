import React from 'react';
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
  return (
    <div>
      <Header user={user} />
      <div className="app-container">
        {!hideSidebar && (
          <Sidebar
            conceptCount={conceptCount}
            pathCount={pathCount}
            libraryCount={libraryCount}
            isAdmin={user?.role === 'admin'}
          />
        )}
        <main className="main-viewport">{children}</main>
      </div>
    </div>
  );
};
