import { CatalogBook, CatalogData, ConceptNode, TaxonomyNode } from '../types';
import { fetchPublishedBooks, fetchUserBooks, getCurrentUserProfile } from './supabase';
import { getLocalImports } from './local-db';

let cachedCatalog: CatalogData | null = null;

export async function loadCatalog(): Promise<CatalogData> {
  if (cachedCatalog) return cachedCatalog;

  try {
    const basePath = import.meta.env.BASE_URL || '/';
    const normalizedBase = basePath.endsWith('/') ? basePath : `${basePath}/`;
    const response = await fetch(`${normalizedBase}data/catalog.json`);
    if (!response.ok) {
      throw new Error(`Failed to load catalog JSON: ${response.status}`);
    }
    const data: CatalogData = await response.json();

    // Fetch dynamic published books from Supabase
    try {
      const cloudBooks = await Promise.race([
        fetchPublishedBooks(),
        new Promise<CatalogBook[]>((_, reject) => setTimeout(() => reject(new Error('timeout')), 3000)),
      ]);
      const existingIds = new Set(data.books.map(b => b.id));
      for (const cloudBook of cloudBooks) {
        if (!existingIds.has(cloudBook.id)) {
          data.books.push(cloudBook);
          existingIds.add(cloudBook.id);
        }
      }

      // If user is logged in, also fetch user's own private/pending books
      const user = await getCurrentUserProfile();
      if (user) {
        const userBooks = await fetchUserBooks(user.id);
        for (const uBook of userBooks) {
          if (!existingIds.has(uBook.id)) {
            data.books.push(uBook);
            existingIds.add(uBook.id);
          }
        }
      }
    } catch {
      // Offline fallback: keep static bundled books
    }

    // Load private local imports
    try {
      const localImports = await getLocalImports();
      for (const imported of localImports) {
        data.books.push({
          ...imported,
          isImported: true,
        });
      }
    } catch {
      // IndexedDB not ready or private mode
    }

    cachedCatalog = data;
    return data;
  } catch (err) {
    console.error('Catalog load error:', err);
    // Return empty fallback catalog
    return {
      schemaVersion: 1,
      books: [],
      taxonomies: [],
      concepts: [],
      conceptRelations: [],
      learningPaths: [],
    };
  }
}

export function findBook(catalog: CatalogData, bookId: string): CatalogBook | undefined {
  return catalog.books.find(b => b.id === bookId);
}

export function getConceptById(catalog: CatalogData, conceptId: string): ConceptNode | undefined {
  return catalog.concepts.find(c => c.id === conceptId);
}

export function getTaxonomyById(catalog: CatalogData, taxonomyId: string): TaxonomyNode | undefined {
  return catalog.taxonomies.find(t => t.id === taxonomyId);
}
