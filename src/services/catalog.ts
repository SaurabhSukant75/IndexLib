import { CatalogBook, CatalogData, ConceptNode, TaxonomyNode } from '../types';
import { fetchPublishedBooks, fetchUserBooks, getCurrentUserProfile } from './supabase';
import { getLocalImports } from './local-db';
import { CONCEPTS_100 } from '../data/concepts100';

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
    const rawData = await response.json();
    const loadedConcepts: ConceptNode[] = (rawData.concepts || []).slice();
    const existingConceptIds = new Set(loadedConcepts.map(c => c.id));

    // Merge in the 100 concepts from CONCEPTS_100
    for (const c100 of CONCEPTS_100) {
      if (!existingConceptIds.has(c100.id)) {
        loadedConcepts.push({
          id: c100.id,
          name: c100.name,
          description: c100.description,
          category: c100.category,
          num: c100.num,
          theme: c100.theme,
          bookId: c100.bookId,
        });
        existingConceptIds.add(c100.id);
      } else {
        // Enrich existing concept with num, theme, and category
        const idx = loadedConcepts.findIndex(c => c.id === c100.id);
        if (idx !== -1) {
          loadedConcepts[idx] = {
            ...loadedConcepts[idx],
            num: c100.num,
            theme: c100.theme,
            category: c100.category || loadedConcepts[idx].category,
            bookId: c100.bookId || loadedConcepts[idx].bookId,
          };
        }
      }
    }

    const data: CatalogData = {
      schemaVersion: rawData.schemaVersion || 1,
      books: rawData.books || [],
      taxonomies: rawData.taxonomies || rawData.taxonomy || [],
      concepts: loadedConcepts,
      conceptRelations: rawData.conceptRelations || [],
      learningPaths: rawData.learningPaths || [],
    };

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
