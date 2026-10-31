import { createClient } from '@supabase/supabase-js';
import { BookStatus, CatalogBook, ReadingProgressRecord, UserProfile } from '../types';

export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://tlygkjoiinshwfayjcjw.supabase.co";
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_aHSEdKaFW3DKxG4X-QyvoA_bw4lXaM1";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    flowType: 'pkce',
    persistSession: true,
    detectSessionInUrl: true,
    autoRefreshToken: true,
  },
});

export async function getCurrentUserProfile(): Promise<UserProfile | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error || !data) {
    return {
      id: user.id,
      username: user.email?.split('@')[0] || 'reader',
      role: 'reader',
      leaderboardOptIn: false,
      createdAt: user.created_at,
    };
  }

  return {
    id: data.id,
    username: data.username,
    role: data.role || 'reader',
    leaderboardOptIn: data.leaderboard_opt_in,
    createdAt: data.created_at,
  };
}

export async function fetchPublishedBooks(): Promise<CatalogBook[]> {
  const { data, error } = await supabase
    .from('catalog_books')
    .select('*')
    .eq('status', 'published');

  if (error || !data) return [];
  return data.map(mapDbBookToCatalogBook);
}

export async function fetchBooksForModeration(): Promise<CatalogBook[]> {
  const { data, error } = await supabase
    .from('catalog_books')
    .select('*')
    .order('created_at', { ascending: false });

  if (error || !data) return [];
  return data.map(mapDbBookToCatalogBook);
}

export async function submitBookToSupabase(
  book: Omit<CatalogBook, 'status'> & { status?: BookStatus },
  htmlContent: string,
  userId: string,
  authorUsername?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const bookStatus = book.status || 'pending_review';
    // 1. Upload HTML to Supabase Storage
    const storagePath = `${userId}/${book.id}.html`;
    const blob = new Blob([htmlContent], { type: 'text/html' });

    // Attempt upload to 'books' bucket
    const { error: storageError } = await supabase.storage.from('books').upload(storagePath, blob, {
      contentType: 'text/html',
      upsert: true,
    });

    if (storageError) {
      console.warn('Storage upload notice (falling back or checking bucket):', storageError.message);
    }

    const { data: publicUrlData } = supabase.storage.from('books').getPublicUrl(storagePath);
    const contentUrl = publicUrlData?.publicUrl || `book/${book.id}.html`;

    // 2. Insert record in catalog_books
    const { error } = await supabase.from('catalog_books').upsert({
      id: book.id,
      author_id: userId,
      author_username: authorUsername || 'author',
      title: book.title,
      summary: book.summary,
      content_url: contentUrl,
      storage_path: storagePath,
      status: bookStatus,
      reading_minutes: book.readingMinutes || 10,
      primary_taxonomy_id: book.primaryTaxonomyId,
      taxonomy_ids: book.taxonomyIds || [],
      tags: book.tags || [],
      concept_links: book.conceptLinks || [],
      version: book.version || '1.0.0',
      revision: (book.revision || 0) + 1,
      changelog: book.changelog || '',
      updated_at: new Date().toISOString(),
    });

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Submission failed' };
  }
}

export async function fetchUserBooks(userId: string): Promise<CatalogBook[]> {
  const { data, error } = await supabase
    .from('catalog_books')
    .select('*')
    .eq('author_id', userId)
    .order('created_at', { ascending: false });

  if (error || !data) return [];
  return data.map(mapDbBookToCatalogBook);
}

export async function updateBookStatus(
  bookId: string,
  status: BookStatus
): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from('catalog_books')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', bookId);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function syncProgressWithCloud(
  userId: string,
  localProgress: ReadingProgressRecord[]
): Promise<void> {
  const records = localProgress.map(p => ({
    user_id: userId,
    book_id: p.bookId,
    page_id: p.currentPageId || p.lastPageId || null,
    completed: p.completed,
    updated_at: new Date(p.updatedAt).toISOString(),
  }));

  if (records.length) {
    await supabase
      .from('reading_progress')
      .upsert(records, { onConflict: 'user_id,book_id' });
  }
}

function mapDbBookToCatalogBook(dbRecord: any): CatalogBook {
  return {
    id: dbRecord.id,
    title: dbRecord.title,
    summary: dbRecord.summary,
    contentPath: dbRecord.content_url || `book/${dbRecord.id}.html`,
    status: dbRecord.status as BookStatus,
    readingMinutes: dbRecord.reading_minutes || 10,
    primaryTaxonomyId: dbRecord.primary_taxonomy_id,
    taxonomyIds: dbRecord.taxonomy_ids || [],
    tags: dbRecord.tags || [],
    conceptLinks: dbRecord.concept_links || [],
    authorId: dbRecord.author_id,
    authorUsername: dbRecord.author_username,
    version: dbRecord.version || '1.0.0',
    revision: dbRecord.revision || 1,
    changelog: dbRecord.changelog || '',
  };
}
