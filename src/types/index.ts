export type BookStatus = 'draft' | 'pending_review' | 'published' | 'rejected' | 'archived';
export type UserRole = 'reader' | 'author' | 'admin';

export interface ConceptLink {
  conceptId: string;
  role: 'explains' | 'introduces' | 'applies' | 'related';
}

export interface CatalogBook {
  id: string;
  title: string;
  summary: string;
  contentPath: string;
  status: BookStatus;
  readingMinutes: number;
  primaryTaxonomyId: string;
  taxonomyIds: string[];
  tags: string[];
  conceptLinks: ConceptLink[];
  authorId?: string;
  authorUsername?: string;
  revision?: number;
  isImported?: boolean;
}

export interface TaxonomyNode {
  id: string;
  name: string;
  description: string;
  parentTaxonomyId?: string;
}

export interface ConceptNode {
  id: string;
  name: string;
  description: string;
  x?: number;
  y?: number;
  fill?: string;
}

export interface ConceptRelation {
  fromConceptId: string;
  toConceptId: string;
  type: string;
}

export interface LearningPathItem {
  bookId: string;
  order: number;
  note?: string;
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  taxonomyId: string;
  items: LearningPathItem[];
}

export interface CatalogData {
  schemaVersion: number;
  books: CatalogBook[];
  taxonomies: TaxonomyNode[];
  concepts: ConceptNode[];
  conceptRelations: ConceptRelation[];
  learningPaths: LearningPath[];
}

export interface ReadingProgressRecord {
  bookId: string;
  currentPageId?: string;
  lastPageId?: string;
  completed: boolean;
  updatedAt: number;
  lastOpenedAt?: number;
}

export interface BookmarkRecord {
  bookmarkId: string;
  bookId: string;
  pageId: string;
  label?: string;
  createdAt: number;
}

export interface CollectionRecord {
  collectionId: string;
  name: string;
  createdAt: number;
}

export interface UserProfile {
  id: string;
  username: string;
  role: UserRole;
  leaderboardOptIn: boolean;
  createdAt: string;
}
