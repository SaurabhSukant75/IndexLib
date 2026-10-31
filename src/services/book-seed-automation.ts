/**
 * BookSeedAutomationService
 * Clean-architecture service that enables an autonomous agent or system process
 * to generate accessible, interactive HTML5 visual books from concept specs
 * and seed/publish them directly to IndexLib via Supabase or catalog formats.
 */

import { CatalogBook, BookStatus } from '../types';
import { submitBookToSupabase } from './supabase';
import { DetailedConcept, CONCEPTS_100 } from '../data/concepts100';

export interface ConceptSeedSpec {
  conceptId: string;
  title?: string;
  summary?: string;
  primaryTaxonomyId?: string;
  readingMinutes?: number;
  tags?: string[];
  templateStyle?: 'comic-card' | 'interactive-diagram' | 'step-story';
}

export interface SeedResult {
  success: boolean;
  bookId?: string;
  version?: string;
  error?: string;
}

export class BookSeedAutomationService {
  /**
   * Generates a fully compliant, self-contained HTML5 Visual Book for a given concept.
   * Adheres to the IndexLib postMessage communication protocol and dark/light accessible theme.
   */
  public generateBookHtml(concept: DetailedConcept, spec?: Partial<ConceptSeedSpec>): string {
    const title = spec?.title || concept.name;
    const question = concept.description;
    const category = concept.category;
    const theme = concept.theme;
    const num = concept.num;

    const accentColor = category === 'trending' ? '#f97316' : '#2563eb';
    const softColor = category === 'trending' ? '#fff7ed' : '#eff6ff';

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeXml(title)}</title>
  <style>
    :root {
      --bg: #ffffff;
      --ink: #1e293b;
      --muted: #64748b;
      --card-bg: #f8fafc;
      --border: #e2e8f0;
      --accent: ${accentColor};
      --soft: ${softColor};
    }
    @media (prefers-color-scheme: dark) {
      :root {
        --bg: #0f172a;
        --ink: #f8fafc;
        --muted: #94a3b8;
        --card-bg: #1e293b;
        --border: #334155;
      }
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background: var(--bg);
      color: var(--ink);
      line-height: 1.6;
      padding: clamp(16px, 4vw, 36px);
      max-width: 860px;
      margin: 0 auto;
    }
    .header-badge {
      display: inline-block;
      font-size: 0.8rem;
      font-weight: 800;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      padding: 4px 10px;
      border-radius: 6px;
      background: var(--soft);
      color: var(--accent);
      margin-bottom: 12px;
      border: 1px solid var(--accent);
    }
    h1 {
      font-size: clamp(1.8rem, 4vw, 2.8rem);
      line-height: 1.15;
      margin-bottom: 14px;
      font-weight: 900;
      letter-spacing: -0.03em;
    }
    .hook-question {
      font-size: clamp(1.1rem, 2.5vw, 1.35rem);
      color: var(--accent);
      font-weight: 600;
      margin-bottom: 24px;
      padding-left: 14px;
      border-left: 4px solid var(--accent);
    }
    .comic-panel {
      background: var(--card-bg);
      border: 2px solid var(--border);
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 24px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    }
    .comic-panel h2 {
      font-size: 1.3rem;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .panel-step {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      background: var(--accent);
      color: #fff;
      border-radius: 50%;
      font-size: 0.85rem;
      font-weight: bold;
    }
    .interactive-box {
      border: 2px dashed var(--accent);
      border-radius: 8px;
      padding: 16px;
      margin-top: 16px;
      background: var(--soft);
      cursor: pointer;
      text-align: center;
      user-select: none;
      transition: transform 0.15s ease;
    }
    .interactive-box:hover {
      transform: scale(1.01);
    }
    .key-takeaway {
      background: var(--soft);
      border: 1px solid var(--accent);
      border-radius: 8px;
      padding: 18px;
      font-weight: 500;
      margin-top: 24px;
    }
    .page-footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid var(--border);
      display: flex;
      justify-content: space-between;
      font-size: 0.85rem;
      color: var(--muted);
    }
  </style>
</head>
<body>
  <div class="header-badge">#${num} · ${escapeXml(theme)} · ${escapeXml(category.toUpperCase())}</div>
  <h1>${escapeXml(title)}</h1>
  <p class="hook-question">“${escapeXml(question)}”</p>

  <section class="comic-panel">
    <h2><span class="panel-step">1</span> The Core Paradox</h2>
    <p>
      At first glance, our intuition suggests a straightforward answer. However, when examining
      <strong>${escapeXml(title)}</strong> systematically, hidden feedback loops, cognitive shortcuts,
      or misaligned incentives create surprising outcomes.
    </p>
    <div class="interactive-box" id="toggleBox" role="button" tabindex="0">
      💡 <strong>Click to reveal the mental model shift</strong>
      <p id="hiddenDetail" style="display:none; margin-top:8px; font-size:0.95rem;">
        Recognizing this pattern allows us to anticipate systemic errors and make conscious interventions.
      </p>
    </div>
  </section>

  <section class="comic-panel">
    <h2><span class="panel-step">2</span> Real-World Manifestation</h2>
    <p>
      Whether in personal decision-making, economic markets, or digital platform interactions,
      this dynamic continuously influences human systems. Observing it in action turns confusion into clarity.
    </p>
  </section>

  <div class="key-takeaway">
    🎯 <strong>Key Insight:</strong> Understanding <em>${escapeXml(title)}</em> equips you with a reusable mental lens to see through superficial explanations and grasp underlying forces.
  </div>

  <footer class="page-footer">
    <span>IndexLib Visual Dictionaries</span>
    <span>Concept Hook #${num}</span>
  </footer>

  <script>
    // PostMessage protocol integration with IndexLib Reader
    window.addEventListener('load', () => {
      window.parent.postMessage({
        type: 'index-dictionary.book',
        action: 'page-loaded',
        pageId: 'p1',
        totalPages: 1
      }, '*');
    });

    const box = document.getElementById('toggleBox');
    const detail = document.getElementById('hiddenDetail');
    if (box && detail) {
      box.addEventListener('click', () => {
        const isHidden = detail.style.display === 'none';
        detail.style.display = isHidden ? 'block' : 'none';
        window.parent.postMessage({
          type: 'index-dictionary.book',
          action: 'progress-update',
          progress: isHidden ? 100 : 50
        }, '*');
      });
    }
  </script>
</body>
</html>`;
  }

  /**
   * Seeds and publishes a book for a specific concept using Supabase.
   */
  public async seedBookForConcept(
    conceptIdOrNum: string,
    options: {
      userId: string;
      authorUsername?: string;
      autoPublish?: boolean;
      customSpec?: Partial<ConceptSeedSpec>;
    }
  ): Promise<SeedResult> {
    const concept = CONCEPTS_100.find(
      c => c.id === conceptIdOrNum || c.num === conceptIdOrNum
    );

    if (!concept) {
      return { success: false, error: `Concept not found for id/num: ${conceptIdOrNum}` };
    }

    const bookId = `book-seed-${concept.num}`;
    const title = options.customSpec?.title || concept.name;
    const summary = options.customSpec?.summary || concept.description;
    const status: BookStatus = options.autoPublish ? 'published' : 'draft';

    const htmlContent = this.generateBookHtml(concept, options.customSpec);

    const catalogBookData: Omit<CatalogBook, 'status'> & { status?: BookStatus } = {
      id: bookId,
      title,
      summary,
      contentPath: `cloud://${bookId}.html`,
      status,
      readingMinutes: options.customSpec?.readingMinutes || 3,
      primaryTaxonomyId: options.customSpec?.primaryTaxonomyId || (concept.category === 'trending' ? 'tech' : 'cognition'),
      taxonomyIds: [concept.category === 'trending' ? 'tech' : 'cognition'],
      tags: options.customSpec?.tags || [concept.category, concept.theme],
      conceptLinks: [
        {
          conceptId: concept.id,
          role: 'explains',
        },
      ],
      authorId: options.userId,
      authorUsername: options.authorUsername || 'AgentPublisher',
      revision: 1,
      version: '1.0.0',
      changelog: `Initial automated seed for Concept #${concept.num}: ${concept.name}`,
    };

    const res = await submitBookToSupabase(
      catalogBookData,
      htmlContent,
      options.userId,
      options.authorUsername || 'AgentPublisher'
    );

    if (!res.success) {
      return { success: false, error: res.error };
    }

    return {
      success: true,
      bookId,
      version: '1.0.0',
    };
  }

  /**
   * Retrieves all 100 concepts grouped by category (Evergreen vs Trending).
   */
  public getBifurcatedConcepts() {
    return {
      evergreen: CONCEPTS_100.filter(c => c.category === 'evergreen'),
      trending: CONCEPTS_100.filter(c => c.category === 'trending'),
      all: CONCEPTS_100,
    };
  }
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export const bookSeedAutomation = new BookSeedAutomationService();
