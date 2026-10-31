import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { CatalogBook, ConceptNode } from '../types';

interface HomeViewProps {
  books: CatalogBook[];
  concepts?: ConceptNode[];
}

export const HomeView: React.FC<HomeViewProps> = ({ books }) => {
  const publishedBooks = books.filter(b => b.status === 'published' || !b.status);
  const reelSectionRef = useRef<HTMLDivElement>(null);

  // Reel State
  const [currentReelIndex, setCurrentReelIndex] = useState(0);
  const [likesMap, setLikesMap] = useState<Record<string, number>>({});
  const [userLikedMap, setUserLikedMap] = useState<Record<string, boolean>>({});
  const [commentsMap, setCommentsMap] = useState<Record<string, string[]>>({});
  const [activeCommentInput, setActiveCommentInput] = useState<string>('');
  const [showComments, setShowComments] = useState<boolean>(false);
  const [shareToast, setShareToast] = useState<string>('');

  const colors = ['#d5ff58', '#b9d7f6', '#ffb99d', '#ded7f5', '#e7e3d4'];
  const currentBook = publishedBooks[currentReelIndex] || publishedBooks[0];

  const scrollToReel = () => {
    reelSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleNextReel = () => {
    if (currentReelIndex < publishedBooks.length - 1) {
      setCurrentReelIndex(prev => prev + 1);
      setShowComments(false);
    }
  };

  const handlePrevReel = () => {
    if (currentReelIndex > 0) {
      setCurrentReelIndex(prev => prev - 1);
      setShowComments(false);
    }
  };

  const toggleLike = (bookId: string) => {
    const isLiked = userLikedMap[bookId];
    setUserLikedMap(prev => ({ ...prev, [bookId]: !isLiked }));
    setLikesMap(prev => ({
      ...prev,
      [bookId]: (prev[bookId] || 42) + (isLiked ? -1 : 1),
    }));
  };

  const handleAddComment = (bookId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCommentInput.trim()) return;
    setCommentsMap(prev => ({
      ...prev,
      [bookId]: [...(prev[bookId] || ['Mind-bending visual book! 🔥', 'Clean and illustrated storytelling.']), activeCommentInput.trim()],
    }));
    setActiveCommentInput('');
  };

  const handleShare = (book: CatalogBook) => {
    const url = `${window.location.origin}${window.location.pathname}#/read/${book.id}`;
    navigator.clipboard?.writeText(url);
    setShareToast('Link copied to clipboard! ⎘');
    setTimeout(() => setShareToast(''), 3000);
  };

  const bookLikes = (likesMap[currentBook?.id] !== undefined)
    ? likesMap[currentBook.id]
    : 42 + (currentReelIndex * 7) % 89;

  const bookComments = commentsMap[currentBook?.id] || [
    'Mind-bending visual book! 🔥',
    'Love the comic illustration style on this one.',
  ];

  return (
    <div className="comic-homepage-wrapper">
      {/* =========================================================
          HERO SECTION: COOL CHEWING LLAMA WITH KALA CHASMA
          ========================================================= */}
      <section className="comic-hero-llama-card">
        <div className="comic-hero-grid">
          {/* Left Text & Actions */}
          <div className="comic-hero-intro">
            <div className="comic-hero-stamp">INDEXLIB COMICS · ISSUE #01</div>
            <h1 className="comic-hero-headline">
              SMART IDEAS. <br />
              <span className="comic-highlight-bubble">COMIC VIBES.</span>
            </h1>
            <p className="comic-hero-subtitle">
              Why read plain text when you can binge short, beautifully illustrated visual web books?
              Curated concepts, mental models, and knowledge reels.
            </p>

            <div className="comic-hero-buttons">
              <Link to="/concepts" className="btn comic-action-btn comic-btn-lime">
                1) LEARN →
              </Link>
              <button onClick={scrollToReel} className="btn comic-action-btn comic-btn-blue">
                2) SCROLL REELS ↓
              </button>
            </div>
          </div>

          {/* Right Mascot: Cool Chewing Llama with Sunglasses */}
          <div className="comic-mascot-showcase">
            <div className="comic-speech-bubble">
              "Chew on ideas, not just gum! Scroll down for the visual reel."
            </div>

            <div className="comic-llama-stage">
              <svg
                viewBox="0 0 240 240"
                className="comic-llama-svg"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Llama Back Hair Tufts */}
                <ellipse cx="120" cy="130" rx="48" ry="65" fill="#fdfcf0" stroke="#20241f" strokeWidth="4" />
                <path d="M 85 90 Q 70 70 80 50 Q 95 65 92 88" fill="#fdfcf0" stroke="#20241f" strokeWidth="4" />
                <path d="M 155 90 Q 170 70 160 50 Q 145 65 148 88" fill="#fdfcf0" stroke="#20241f" strokeWidth="4" />

                {/* Ear Insides */}
                <path d="M 83 75 Q 77 60 84 55 Q 89 65 87 75" fill="#ffb99d" />
                <path d="M 157 75 Q 163 60 156 55 Q 151 65 153 75" fill="#ffb99d" />

                {/* Fluffy Head */}
                <circle cx="120" cy="110" r="42" fill="#fffef7" stroke="#20241f" strokeWidth="4" />
                {/* Fluff puffs */}
                <circle cx="100" cy="85" r="14" fill="#fffef7" stroke="#20241f" strokeWidth="3" />
                <circle cx="120" cy="78" r="16" fill="#fffef7" stroke="#20241f" strokeWidth="3" />
                <circle cx="140" cy="85" r="14" fill="#fffef7" stroke="#20241f" strokeWidth="3" />

                {/* Kala Chasma (Iconic Cool Black Sunglasses) */}
                <rect x="85" y="102" width="32" height="20" rx="5" fill="#111" stroke="#20241f" strokeWidth="3" />
                <rect x="123" y="102" width="32" height="20" rx="5" fill="#111" stroke="#20241f" strokeWidth="3" />
                {/* Glasses bridge & sides */}
                <line x1="117" y1="110" x2="123" y2="110" stroke="#20241f" strokeWidth="4" />
                <line x1="85" y1="108" x2="75" y2="104" stroke="#20241f" strokeWidth="4" />
                <line x1="155" y1="108" x2="165" y2="104" stroke="#20241f" strokeWidth="4" />
                {/* Lens Reflections */}
                <line x1="89" y1="106" x2="102" y2="118" stroke="#00e5ff" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="127" y1="106" x2="140" y2="118" stroke="#00e5ff" strokeWidth="2.5" strokeLinecap="round" />

                {/* Llama Muzzle */}
                <ellipse cx="120" cy="138" rx="20" ry="16" fill="#f4ebd9" stroke="#20241f" strokeWidth="3" />
                <ellipse cx="114" cy="133" rx="2.5" ry="3.5" fill="#20241f" />
                <ellipse cx="126" cy="133" rx="2.5" ry="3.5" fill="#20241f" />

                {/* Animated Chewing Bubblegum */}
                <circle cx="132" cy="144" r="14" className="llama-bubblegum" />
                <circle cx="128" cy="140" r="4" fill="#fff" opacity="0.6" />

                {/* Gold Chain / Cool Collar */}
                <path d="M 98 165 Q 120 180 142 165" fill="none" stroke="#eab308" strokeWidth="5" strokeLinecap="round" />
                <circle cx="120" cy="174" r="6" fill="#eab308" stroke="#20241f" strokeWidth="2" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          REEL SECTION: 1 BOOK COVER AT A TIME WITH LIKE / SHARE / COMMENT
          ========================================================= */}
      <section ref={reelSectionRef} className="comic-reel-section">
        <div className="comic-reel-title-bar">
          <div className="comic-reel-tag">⚡ REEL DISCOVERY</div>
          <h2 className="comic-reel-heading">Swipe & Flip Visual Book Covers</h2>
          <p className="comic-reel-sub">
            Issue {currentReelIndex + 1} of {publishedBooks.length} · One concept book at a time
          </p>
        </div>

        {shareToast && <div className="comic-toast">{shareToast}</div>}

        <div className="comic-reel-viewport">
          {/* Main Reel Card Stage */}
          <div className="comic-reel-card-stage">
            {currentBook && (
              <div className="comic-reel-card">
                {/* Top Cover Visual */}
                <div
                  className="comic-reel-cover-art"
                  style={{ backgroundColor: colors[currentReelIndex % colors.length] }}
                >
                  <div className="comic-reel-top-row">
                    <span className="comic-reel-read-time">{currentBook.readingMinutes || 5} MIN READ</span>
                    <span className="comic-reel-vol">VOL. {currentBook.id.replace('book-', '')}</span>
                  </div>

                  <div className="comic-reel-center-art">
                    <div className="comic-reel-icon">📖</div>
                    <h3 className="comic-reel-book-title">{currentBook.title}</h3>
                  </div>

                  <div className="comic-reel-badge-sticker">FEATURED ISSUE!</div>
                </div>

                {/* Card Body & Summary */}
                <div className="comic-reel-body">
                  <p className="comic-reel-desc">{currentBook.summary}</p>

                  <div className="comic-reel-tags-row">
                    {currentBook.tags?.map(t => (
                      <span key={t} className="comic-reel-pill">#{t}</span>
                    ))}
                  </div>

                  <Link to={`/read/${currentBook.id}`} className="btn comic-open-book-btn">
                    OPEN & READ FULL COMIC BOOK ➔
                  </Link>
                </div>
              </div>
            )}

            {/* Reel Action Toolbar: Like, Comment, Share */}
            <aside className="comic-reel-sidebar-actions">
              {/* Like Button */}
              <button
                className={`comic-action-circle ${userLikedMap[currentBook?.id] ? 'active-liked' : ''}`}
                onClick={() => toggleLike(currentBook.id)}
                title="Like this book"
                aria-label="Like"
              >
                <span className="comic-circle-icon">
                  {userLikedMap[currentBook?.id] ? '❤️' : '🤍'}
                </span>
                <span className="comic-action-count">{bookLikes}</span>
              </button>

              {/* Comment Button */}
              <button
                className={`comic-action-circle ${showComments ? 'active-comment' : ''}`}
                onClick={() => setShowComments(prev => !prev)}
                title="View and post comments"
                aria-label="Comments"
              >
                <span className="comic-circle-icon">💬</span>
                <span className="comic-action-count">{bookComments.length}</span>
              </button>

              {/* Share Button */}
              <button
                className="comic-action-circle"
                onClick={() => handleShare(currentBook)}
                title="Copy direct share link"
                aria-label="Share"
              >
                <span className="comic-circle-icon">⎘</span>
                <span className="comic-action-count">SHARE</span>
              </button>
            </aside>
          </div>

          {/* Navigation Controls: Next / Prev Reel */}
          <div className="comic-reel-controls">
            <button
              onClick={handlePrevReel}
              disabled={currentReelIndex === 0}
              className="btn comic-reel-nav-btn"
            >
              ▲ PREV ISSUE
            </button>
            <span className="comic-reel-indicator">
              {currentReelIndex + 1} / {publishedBooks.length}
            </span>
            <button
              onClick={handleNextReel}
              disabled={currentReelIndex === publishedBooks.length - 1}
              className="btn comic-reel-nav-btn"
            >
              ▼ NEXT ISSUE
            </button>
          </div>

          {/* Slide-out Comments Drawer for Current Reel */}
          {showComments && (
            <div className="comic-reel-comments-panel">
              <div className="comic-comments-header">
                <strong>Comments ({bookComments.length})</strong>
                <button
                  onClick={() => setShowComments(false)}
                  className="comic-close-btn"
                  aria-label="Close comments"
                >
                  ✕
                </button>
              </div>

              <div className="comic-comments-list">
                {bookComments.map((comment, i) => (
                  <div key={i} className="comic-comment-bubble">
                    <span className="comic-comment-user">Reader #{i + 1}:</span>
                    <p className="comic-comment-text">{comment}</p>
                  </div>
                ))}
              </div>

              <form
                className="comic-comment-form"
                onSubmit={(e) => handleAddComment(currentBook.id, e)}
              >
                <input
                  type="text"
                  placeholder="Drop your thoughts on this book..."
                  value={activeCommentInput}
                  onChange={(e) => setActiveCommentInput(e.target.value)}
                  className="comic-comment-input"
                />
                <button type="submit" className="btn comic-btn-lime comic-comment-submit">
                  POST
                </button>
              </form>
            </div>
          )}
        </div>
      </section>

      {/* =========================================================
          FOOTER (EXACT SPECIFIED TEXT ONLY)
          ========================================================= */}
      <footer className="comic-exact-footer">
        <div className="comic-footer-container">
          <p className="comic-footer-text">
            IndexLib is an open-source visual web library and authoring platform for short, structured, multi-page HTML books. It combines hierarchical taxonomy exploration, a semantic concept knowledge graph, curated learning paths, an offline-first private library, and sandboxed interactive reading.
          </p>
        </div>
      </footer>
    </div>
  );
};
