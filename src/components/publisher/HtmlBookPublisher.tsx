import React, { useEffect, useRef, useState } from 'react';
import { CatalogBook, ConceptNode, TaxonomyNode, UserProfile } from '../../types';
import { inspectBookHtml, injectProtocolBridge, ValidationReport as IValidationReport } from '../../services/validator';
import { submitBookToSupabase, fetchUserBooks } from '../../services/supabase';
import { ValidationReport } from './ValidationReport';
import { HtmlBookReader } from '../reader/HtmlBookReader';

export interface HtmlBookPublisherProps {
  user: UserProfile | null;
  taxonomies: TaxonomyNode[];
  concepts: ConceptNode[];
  initialMode?: 'create' | 'manage';
  onPublishSuccess?: (bookId: string, status: string) => void;
  onCancel?: () => void;
}

export const HtmlBookPublisher: React.FC<HtmlBookPublisherProps> = ({
  user,
  taxonomies = [],
  concepts = [],
  initialMode = 'create',
  onPublishSuccess,
  onCancel,
}) => {
  const [activeTab, setActiveTab] = useState<'create' | 'manage'>(initialMode);
  const [userBooks, setUserBooks] = useState<CatalogBook[]>([]);
  const [isLoadingUserBooks, setIsLoadingUserBooks] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form Fields
  const [bookId, setBookId] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [summary, setSummary] = useState<string>('');
  const [authorName, setAuthorName] = useState<string>(user?.username || '');
  const [version, setVersion] = useState<string>('1.0.0');
  const [revision, setRevision] = useState<number>(1);
  const [changelog, setChangelog] = useState<string>('');
  const [readingMinutes, setReadingMinutes] = useState<number>(10);
  const [primaryTaxonomyId, setPrimaryTaxonomyId] = useState<string>(taxonomies?.[0]?.id || 'human-nature');
  const [selectedConceptIds, setSelectedConceptIds] = useState<string[]>([]);
  const [tagsInput, setTagsInput] = useState<string>('Visual Book, Design');
  const [visibilityChoice, setVisibilityChoice] = useState<'request_approval' | 'private'>('request_approval');

  // File & Validation
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [blobUrl, setBlobUrl] = useState<string>('');
  const [report, setReport] = useState<IValidationReport | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string>('');

  // Load existing author books for version management
  const loadAuthorBooks = async () => {
    if (!user) return;
    setIsLoadingUserBooks(true);
    try {
      const books = await fetchUserBooks(user.id);
      setUserBooks(books);
    } catch {
      // offline / table pending
    } finally {
      setIsLoadingUserBooks(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadAuthorBooks();
      if (!authorName) setAuthorName(user.username);
    }
  }, [user]);

  // Load an existing book for updating/republishing with version bump
  const handleSelectBookToRepublish = (book: CatalogBook) => {
    setBookId(book.id);
    setTitle(book.title);
    setSummary(book.summary);
    setAuthorName(book.authorUsername || user?.username || '');
    setPrimaryTaxonomyId(book.primaryTaxonomyId);
    setReadingMinutes(book.readingMinutes || 10);
    setTagsInput((book.tags || []).join(', '));
    setSelectedConceptIds((book.conceptLinks || []).map(c => c.conceptId));
    setVisibilityChoice(book.status === 'private' ? 'private' : 'request_approval');

    // Auto calculate next patch version e.g. 1.0.0 -> 1.1.0
    const currentVer = book.version || '1.0.0';
    const parts = currentVer.split('.').map(n => parseInt(n) || 0);
    if (parts.length === 3) {
      parts[1] += 1;
      setVersion(parts.join('.'));
    } else {
      setVersion('1.1.0');
    }
    setRevision((book.revision || 1) + 1);
    setChangelog(`Updated edition v${parts.join('.') || '1.1.0'}`);
    setActiveTab('create');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.match(/\.html?$/i)) {
      alert('Please upload an HTML document (.html or .htm).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('File size exceeds the 5 MiB limit.');
      return;
    }

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      const content = reader.result as string;
      setHtmlContent(content);

      const inspection = inspectBookHtml(content);
      setReport(inspection);

      if (inspection.titleSuggestion && !title) {
        setTitle(inspection.titleSuggestion);
      }

      // Generate preview Blob URL
      const blob = new Blob([content], { type: 'text/html;charset=utf-8' });
      if (blobUrl) URL.revokeObjectURL(blobUrl);
      setBlobUrl(URL.createObjectURL(blob));
    };
    reader.readAsText(file);
  };

  const handleInjectBridge = () => {
    if (!htmlContent) return;
    const targetId = bookId || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'my-book';
    const updatedHtml = injectProtocolBridge(htmlContent, targetId);
    setHtmlContent(updatedHtml);

    const inspection = inspectBookHtml(updatedHtml);
    setReport(inspection);

    const blob = new Blob([updatedHtml], { type: 'text/html;charset=utf-8' });
    if (blobUrl) URL.revokeObjectURL(blobUrl);
    setBlobUrl(URL.createObjectURL(blob));
  };

  const toggleConcept = (conceptId: string) => {
    setSelectedConceptIds(prev =>
      prev.includes(conceptId) ? prev.filter(id => id !== conceptId) : [...prev, conceptId]
    );
  };

  const handleSubmitCloud = async () => {
    if (!htmlContent || !title.trim()) {
      alert('Please import an HTML document and enter a book title.');
      return;
    }

    if (!user) {
      alert('Please sign in to publish books.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    const stableId =
      bookId ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') ||
      `book-${Date.now().toString(36)}`;

    const targetStatus = visibilityChoice === 'request_approval' ? 'pending_review' : 'private';
    const parsedTags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);

    const result = await submitBookToSupabase(
      {
        id: stableId,
        title: title.trim(),
        summary: summary.trim() || 'A new visual HTML book on IndexLib.',
        contentPath: '',
        status: targetStatus,
        readingMinutes,
        primaryTaxonomyId,
        taxonomyIds: [primaryTaxonomyId],
        tags: parsedTags.length ? parsedTags : ['Visual Book'],
        conceptLinks: selectedConceptIds.map(cId => ({ conceptId: cId, role: 'explains' })),
        authorId: user.id,
        version,
        revision,
        changelog,
      },
      htmlContent,
      user.id,
      authorName.trim() || user.username
    );

    setIsSubmitting(false);

    if (result.success) {
      await loadAuthorBooks();
      if (onPublishSuccess) onPublishSuccess(stableId, targetStatus);
    } else {
      setSubmitError(result.error || 'Failed to publish book to database.');
    }
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', paddingBottom: 60 }}>
      {/* Editorial Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
        <div>
          <p className="page-eyebrow">IndexLib Creator Suite</p>
          <h1 className="page-title">Publish Studio</h1>
          <p className="page-lede" style={{ marginBottom: 0 }}>
            Author, version, and publish interactive visual HTML books.
          </p>
        </div>

        {/* Top Right Mode Toggle: "Publish a Book" vs "My Book" */}
        <div style={{ display: 'flex', gap: 6, background: '#fff', padding: 4, borderRadius: 8, border: '2px solid #20241f', boxShadow: '3px 3px 0 #20241f' }}>
          <button
            onClick={() => setActiveTab('create')}
            className={`btn ${activeTab === 'create' ? 'btn-primary' : ''}`}
            style={{ fontSize: '0.85rem' }}
          >
            ✍️ Publish a Book
          </button>
          <button
            onClick={() => {
              setActiveTab('manage');
              loadAuthorBooks();
            }}
            className={`btn ${activeTab === 'manage' ? 'btn-primary' : ''}`}
            style={{ fontSize: '0.85rem' }}
          >
            📚 My Book ({userBooks.length})
          </button>
        </div>
      </div>

      {/* Tab: My Book Management */}
      {activeTab === 'manage' && (
        <div style={{ background: '#fff', border: '3px solid #20241f', borderRadius: 12, padding: 24, boxShadow: '5px 5px 0 #20241f' }}>
          <h2 style={{ fontFamily: 'var(--font-editorial)', fontSize: '1.4rem', marginBottom: 12 }}>
            Your Published & Draft Books
          </h2>
          <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem', marginBottom: 20 }}>
            Select any existing book to upload a revised HTML file, bump the version number, update release notes, and republish.
          </p>

          {isLoadingUserBooks ? (
            <p>Loading your books from Supabase...</p>
          ) : userBooks.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {userBooks.map(b => (
                <div
                  key={b.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: 16,
                    border: '2px solid var(--color-line)',
                    borderRadius: 8,
                    background: '#fdfbf7',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span className="badge badge-accent">v{b.version || '1.0.0'}</span>
                      <span className={`badge ${b.status === 'published' ? 'badge-green' : 'badge-warning'}`}>
                        {b.status.toUpperCase()}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--color-muted)' }}>
                        Revision #{b.revision || 1}
                      </span>
                    </div>
                    <strong style={{ fontSize: '1.1rem', display: 'block' }}>{b.title}</strong>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-muted)', margin: '4px 0' }}>{b.summary}</p>
                    {b.changelog && (
                      <small style={{ color: '#166534', fontWeight: 600 }}>Changelog: {b.changelog}</small>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                    <button
                      className="btn btn-primary"
                      onClick={() => handleSelectBookToRepublish(b)}
                    >
                      Bump Version & Edit ➔
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: 32, textAlign: 'center', border: '2px dashed var(--color-line)', borderRadius: 8 }}>
              <p style={{ color: 'var(--color-muted)' }}>You haven't authored any books yet. Click "Publish a Book" to create your first visual book!</p>
            </div>
          )}
        </div>
      )}

      {/* Tab: Publish a Book (Unified Single Clean Section) */}
      {activeTab === 'create' && (
        <div style={{ display: 'grid', gridTemplateColumns: blobUrl ? '1.15fr 0.85fr' : '1fr', gap: 24, alignItems: 'start' }}>
          {/* Single Unified Card Clubbing All Publisher Settings */}
          <div style={{ background: '#fff', border: '3px solid #20241f', borderRadius: 12, padding: 26, boxShadow: '5px 5px 0 #20241f' }}>
            
            {/* Header row with Title and Top-Right HTML Import Button */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 20, paddingBottom: 16, borderBottom: '2px solid var(--color-line)' }}>
              <div>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0 }}>
                  {bookId ? `Republish Book (v${version})` : 'Book Details & Content'}
                </h2>
                <small style={{ color: 'var(--color-muted)' }}>
                  {fileName ? `Loaded: ${fileName}` : 'Import an HTML book file to publish or preview'}
                </small>
              </div>

              {/* Top-Right Small Import Button */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".html,.htm"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
                <button
                  type="button"
                  className="btn"
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    border: '2px solid #20241f',
                    background: htmlContent ? '#dcfce7' : '#fff',
                    color: htmlContent ? '#166534' : '#20241f',
                    fontWeight: 700,
                    padding: '6px 14px',
                    fontSize: '0.85rem',
                  }}
                >
                  {htmlContent ? '✓ Change HTML File' : '📥 Import HTML Book'}
                </button>
              </div>
            </div>

            {/* Validation Banner if HTML loaded */}
            {report && (
              <div style={{ marginBottom: 20 }}>
                <ValidationReport
                  report={report}
                  onInjectBridge={!report.hasProtocolScript ? handleInjectBridge : undefined}
                />
              </div>
            )}

            {/* Book Metadata Fields */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: 4 }}>
                  Book Title *
                </label>
                <input
                  type="text"
                  className="search-input"
                  style={{ borderRadius: 6 }}
                  placeholder="e.g. The Attention Economy · 01"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: 4 }}>
                  Short Summary / Premise *
                </label>
                <textarea
                  className="search-input"
                  rows={2}
                  style={{ borderRadius: 6, minHeight: 64, resize: 'vertical' }}
                  placeholder="A concise summary explaining what readers will discover..."
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: 4 }}>
                    Author Name
                  </label>
                  <input
                    type="text"
                    className="search-input"
                    style={{ borderRadius: 6 }}
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: 4 }}>
                    Topic Category
                  </label>
                  <select
                    className="search-input"
                    style={{ borderRadius: 6, height: 38 }}
                    value={primaryTaxonomyId}
                    onChange={(e) => setPrimaryTaxonomyId(e.target.value)}
                  >
                    {taxonomies.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: 4 }}>
                    Est. Minutes
                  </label>
                  <input
                    type="number"
                    className="search-input"
                    style={{ borderRadius: 6 }}
                    min={1}
                    max={120}
                    value={readingMinutes}
                    onChange={(e) => setReadingMinutes(parseInt(e.target.value) || 10)}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: 4 }}>
                    Tags (Comma-separated)
                  </label>
                  <input
                    type="text"
                    className="search-input"
                    style={{ borderRadius: 6 }}
                    placeholder="Focus, Systems, Design"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                  />
                </div>
              </div>

              {/* Version & Changelog Row */}
              <div style={{ padding: 14, background: '#fdfcf9', border: '1.5px solid var(--color-line)', borderRadius: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                    Edition Versioning
                  </label>
                  <span className="badge badge-accent">Revision #{revision}</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr', gap: 12, marginBottom: 10 }}>
                  <input
                    type="text"
                    className="search-input"
                    style={{ borderRadius: 6, fontWeight: 'bold' }}
                    placeholder="1.0.0"
                    value={version}
                    onChange={(e) => setVersion(e.target.value)}
                  />
                  <input
                    type="text"
                    className="search-input"
                    style={{ borderRadius: 6 }}
                    placeholder="Changelog (e.g. Revised chapter 2, added diagrams)"
                    value={changelog}
                    onChange={(e) => setChangelog(e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', gap: 6 }}>
                  <button
                    type="button"
                    className="btn"
                    style={{ fontSize: '0.75rem', padding: '3px 8px' }}
                    onClick={() => {
                      const p = version.split('.').map(n => parseInt(n) || 0);
                      if (p.length === 3) { p[2] += 1; setVersion(p.join('.')); }
                    }}
                  >
                    + Patch (0.0.1)
                  </button>
                  <button
                    type="button"
                    className="btn"
                    style={{ fontSize: '0.75rem', padding: '3px 8px' }}
                    onClick={() => {
                      const p = version.split('.').map(n => parseInt(n) || 0);
                      if (p.length === 3) { p[1] += 1; p[2] = 0; setVersion(p.join('.')); }
                    }}
                  >
                    + Minor (0.1.0)
                  </button>
                  <button
                    type="button"
                    className="btn"
                    style={{ fontSize: '0.75rem', padding: '3px 8px' }}
                    onClick={() => {
                      const p = version.split('.').map(n => parseInt(n) || 0);
                      if (p.length === 3) { p[0] += 1; p[1] = 0; p[2] = 0; setVersion(p.join('.')); }
                    }}
                  >
                    + Major (1.0.0)
                  </button>
                </div>
              </div>

              {/* Concept Tags */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: 6 }}>
                  Connect Concepts
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {concepts.map(concept => {
                    const isSelected = selectedConceptIds.includes(concept.id);
                    return (
                      <button
                        key={concept.id}
                        type="button"
                        onClick={() => toggleConcept(concept.id)}
                        className="btn"
                        style={{
                          padding: '4px 10px',
                          fontSize: '0.8rem',
                          background: isSelected ? '#20241f' : '#fff',
                          color: isSelected ? '#fff' : 'inherit',
                          borderColor: '#20241f',
                        }}
                      >
                        {isSelected ? '✓ ' : '+ '} {concept.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Visibility Choice */}
              <div style={{ padding: 14, background: '#fdfcf9', border: '1.5px solid var(--color-line)', borderRadius: 8 }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: 8 }}>
                  Visibility
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.88rem' }}>
                    <input
                      type="radio"
                      name="pub_visibility"
                      checked={visibilityChoice === 'request_approval'}
                      onChange={() => setVisibilityChoice('request_approval')}
                    />
                    <span>
                      <strong>Public Approval</strong> — Immediate access for you; queued for admin moderation.
                    </span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.88rem' }}>
                    <input
                      type="radio"
                      name="pub_visibility"
                      checked={visibilityChoice === 'private'}
                      onChange={() => setVisibilityChoice('private')}
                    />
                    <span>
                      <strong>Private to My Account</strong> — Visible only when signed into your account.
                    </span>
                  </label>
                </div>
              </div>

              {submitError && (
                <div style={{ padding: 10, background: '#fee2e2', border: '1px solid #ef4444', borderRadius: 6, color: '#b91c1c', fontSize: '0.85rem' }}>
                  {submitError}
                </div>
              )}

              {/* Bottom Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 12, paddingTop: 16, borderTop: '2px solid var(--color-line)' }}>
                {onCancel && (
                  <button type="button" className="btn" onClick={onCancel}>
                    Cancel
                  </button>
                )}
                <button
                  type="button"
                  className="btn btn-primary"
                  disabled={isSubmitting || !htmlContent}
                  onClick={handleSubmitCloud}
                  style={{ fontSize: '0.95rem', padding: '10px 24px' }}
                >
                  {isSubmitting
                    ? 'Publishing...'
                    : bookId
                    ? `Republish v${version} ➔`
                    : 'Publish Book ➔'}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Live Reader Canvas Preview */}
          {blobUrl && (
            <div style={{ position: 'sticky', top: 80 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Live Reader Canvas</h3>
                <span className="badge badge-accent">Isolated Sandbox</span>
              </div>
              <HtmlBookReader
                src={blobUrl}
                bookId={bookId || title.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'preview'}
                title={title || 'Untitled Visual Book'}
                isImported={true}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
