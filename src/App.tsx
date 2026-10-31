import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { CatalogData, UserProfile } from './types';
import { loadCatalog } from './services/catalog';
import { getCurrentUserProfile } from './services/supabase';
import { Layout } from './components/common/Layout';
import { Toast } from './components/common/Toast';
import { HomeView } from './views/HomeView';
import { ConceptsView } from './views/ConceptsView';
import { TopicsView } from './views/TopicsView';
import { PathsView } from './views/PathsView';
import { LibraryView } from './views/LibraryView';
import { ReaderView } from './views/ReaderView';
import { PublishView } from './views/PublishView';
import { AdminReviewView } from './views/AdminReviewView';
import { AccountView } from './views/AccountView';
import { SearchView } from './views/SearchView';

export const App: React.FC = () => {
  const [catalog, setCatalog] = useState<CatalogData | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [toastMessage, setToastMessage] = useState<string>('');

  const refreshUser = async () => {
    const profile = await getCurrentUserProfile();
    setUser(profile);
  };

  useEffect(() => {
    async function init() {
      const data = await loadCatalog();
      setCatalog(data);
      await refreshUser();
    }
    init();
  }, []);

  if (!catalog) {
    return (
      <div style={{ padding: 40, fontFamily: 'var(--font-body)', textAlign: 'center' }}>
        <h2>Loading IndexLib...</h2>
      </div>
    );
  }

  return (
    <Layout
      user={user}
      conceptCount={catalog.concepts.length}
      pathCount={catalog.learningPaths.length}
    >
      <Routes>
        <Route path="/" element={<HomeView books={catalog.books} concepts={catalog.concepts} />} />
        <Route
          path="/concepts"
          element={
            <ConceptsView
              concepts={catalog.concepts}
              relations={catalog.conceptRelations}
              books={catalog.books}
            />
          }
        />
        <Route
          path="/topics"
          element={<TopicsView taxonomies={catalog.taxonomies} books={catalog.books} />}
        />
        <Route
          path="/paths"
          element={<PathsView paths={catalog.learningPaths} books={catalog.books} />}
        />
        <Route path="/library" element={<LibraryView catalogBooks={catalog.books} />} />
        <Route
          path="/read/:bookId/:pageId?"
          element={<ReaderView catalogBooks={catalog.books} user={user} onToast={setToastMessage} />}
        />
        <Route
          path="/publish"
          element={
            <PublishView
              user={user}
              taxonomies={catalog.taxonomies}
              concepts={catalog.concepts}
              onToast={setToastMessage}
            />
          }
        />
        <Route
          path="/admin"
          element={<AdminReviewView user={user} onToast={setToastMessage} />}
        />
        <Route
          path="/account"
          element={<AccountView user={user} onUserChange={refreshUser} onToast={setToastMessage} />}
        />
        <Route
          path="/search"
          element={<SearchView catalog={catalog} />}
        />
      </Routes>

      <Toast message={toastMessage} onClose={() => setToastMessage('')} />
    </Layout>
  );
};
