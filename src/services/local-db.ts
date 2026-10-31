import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { BookmarkRecord, CatalogBook, CollectionRecord, ReadingProgressRecord } from '../types';

interface IndexLibDB extends DBSchema {
  imported_books: {
    key: string;
    value: CatalogBook & { html: string };
  };
  reading_progress: {
    key: string;
    value: ReadingProgressRecord;
  };
  bookmarks: {
    key: string;
    value: BookmarkRecord;
    indexes: { 'by-book': string };
  };
  collections: {
    key: string;
    value: CollectionRecord;
  };
}

let dbPromise: Promise<IDBPDatabase<IndexLibDB>> | null = null;

export async function getDB(): Promise<IDBPDatabase<IndexLibDB>> {
  if (!dbPromise) {
    dbPromise = openDB<IndexLibDB>('indexlib-store', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('imported_books')) {
          db.createObjectStore('imported_books', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('reading_progress')) {
          db.createObjectStore('reading_progress', { keyPath: 'bookId' });
        }
        if (!db.objectStoreNames.contains('bookmarks')) {
          const bookmarkStore = db.createObjectStore('bookmarks', { keyPath: 'bookmarkId' });
          bookmarkStore.createIndex('by-book', 'bookId');
        }
        if (!db.objectStoreNames.contains('collections')) {
          db.createObjectStore('collections', { keyPath: 'collectionId' });
        }
      },
    });
  }
  return dbPromise;
}

export async function saveLocalProgress(progress: ReadingProgressRecord): Promise<void> {
  const db = await getDB();
  await db.put('reading_progress', progress);
}

export async function getLocalProgress(bookId: string): Promise<ReadingProgressRecord | undefined> {
  const db = await getDB();
  return db.get('reading_progress', bookId);
}

export async function getAllLocalProgress(): Promise<ReadingProgressRecord[]> {
  const db = await getDB();
  return db.getAll('reading_progress');
}

export async function saveLocalBookmark(bookmark: BookmarkRecord): Promise<void> {
  const db = await getDB();
  await db.put('bookmarks', bookmark);
}

export async function deleteLocalBookmark(bookmarkId: string): Promise<void> {
  const db = await getDB();
  await db.delete('bookmarks', bookmarkId);
}

export async function getLocalBookmarks(bookId?: string): Promise<BookmarkRecord[]> {
  const db = await getDB();
  if (bookId) {
    return db.getAllFromIndex('bookmarks', 'by-book', bookId);
  }
  return db.getAll('bookmarks');
}

export async function saveLocalImport(book: CatalogBook, html: string): Promise<void> {
  const db = await getDB();
  await db.put('imported_books', { ...book, html });
}

export async function getLocalImports(): Promise<(CatalogBook & { html: string })[]> {
  const db = await getDB();
  return db.getAll('imported_books');
}

export async function getLocalImport(bookId: string): Promise<(CatalogBook & { html: string }) | undefined> {
  const db = await getDB();
  return db.get('imported_books', bookId);
}
