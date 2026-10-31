import { CatalogBook, ConceptNode, TaxonomyNode } from '../types';

export interface SearchResultItem {
  id: string;
  type: 'book' | 'concept' | 'topic';
  title: string;
  subtitle: string;
  description: string;
  url: string;
  tags: string[];
  score: number;
}

/**
 * Normalizes text into search tokens:
 * lowercase, removes non-alphanumeric, splits into tokens
 */
export function tokenize(text: string): string[] {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s_-]/g, ' ')
    .split(/[\s_-]+/)
    .filter(token => token.length >= 2);
}

/**
 * In-memory Hash-Based Inverted Index
 * Maps: token -> Set<entityId>
 */
export class HashSearchIndex {
  private tokenIndex = new Map<string, Set<string>>();
  private entityMap = new Map<string, SearchResultItem>();

  public clear() {
    this.tokenIndex.clear();
    this.entityMap.clear();
  }

  public indexBook(book: CatalogBook) {
    const item: SearchResultItem = {
      id: `book:${book.id}`,
      type: 'book',
      title: book.title,
      subtitle: `${book.readingMinutes} min read · ${book.status === 'published' ? 'Published' : 'Private/Pending'}`,
      description: book.summary,
      url: `/read/${book.id}`,
      tags: book.tags || [],
      score: 0,
    };
    this.addEntity(item, [
      book.title,
      book.summary,
      ...(book.tags || []),
      book.authorUsername || '',
      book.primaryTaxonomyId || '',
    ]);
  }

  public indexConcept(concept: ConceptNode) {
    const item: SearchResultItem = {
      id: `concept:${concept.id}`,
      type: 'concept',
      title: concept.name,
      subtitle: concept.category ? `${concept.category.toUpperCase()} CONCEPT` : 'CONCEPT',
      description: concept.description,
      url: `/concepts?id=${concept.id}`,
      tags: [concept.category || 'general'],
      score: 0,
    };
    this.addEntity(item, [concept.name, concept.description, concept.category || '']);
  }

  public indexTopic(topic: TaxonomyNode) {
    const item: SearchResultItem = {
      id: `topic:${topic.id}`,
      type: 'topic',
      title: topic.name,
      subtitle: 'TOPIC CATEGORY',
      description: topic.description,
      url: `/topics?id=${topic.id}`,
      tags: ['topic'],
      score: 0,
    };
    this.addEntity(item, [topic.name, topic.description]);
  }

  private addEntity(item: SearchResultItem, textFields: string[]) {
    this.entityMap.set(item.id, item);

    // Extract unique tokens
    const tokens = new Set<string>();
    for (const field of textFields) {
      for (const token of tokenize(field)) {
        tokens.add(token);
      }
    }

    // Add to token hash map
    for (const token of tokens) {
      let set = this.tokenIndex.get(token);
      if (!set) {
        set = new Set<string>();
        this.tokenIndex.set(token, set);
      }
      set.add(item.id);
    }
  }

  /**
   * Fast hash lookup for queries
   */
  public search(query: string, limit = 20): SearchResultItem[] {
    const queryTokens = tokenize(query);
    if (queryTokens.length === 0) return [];

    const scores = new Map<string, number>();

    for (const qToken of queryTokens) {
      // 1. Exact hash token match (Highest weight: 10 points)
      const exactMatches = this.tokenIndex.get(qToken);
      if (exactMatches) {
        for (const id of exactMatches) {
          scores.set(id, (scores.get(id) || 0) + 10);
        }
      }

      // 2. Prefix hash search (Token starts with qToken, e.g. "atten" -> "attention": 5 points)
      for (const [indexedToken, entityIds] of this.tokenIndex.entries()) {
        if (indexedToken !== qToken && indexedToken.startsWith(qToken)) {
          for (const id of entityIds) {
            scores.set(id, (scores.get(id) || 0) + 5);
          }
        }
      }
    }

    const results: SearchResultItem[] = [];
    for (const [id, score] of scores.entries()) {
      const entity = this.entityMap.get(id);
      if (entity) {
        results.push({
          ...entity,
          score,
        });
      }
    }

    // Sort by descending score
    return results.sort((a, b) => b.score - a.score).slice(0, limit);
  }
}

export const globalSearchIndex = new HashSearchIndex();
