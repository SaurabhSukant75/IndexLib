import React, { useState } from 'react';
import { CatalogBook, ConceptNode, TaxonomyNode, UserProfile } from '../../types';
import { inspectBookHtml, injectProtocolBridge, ValidationReport as IValidationReport } from '../../services/validator';
import { saveLocalImport } from '../../services/local-db';
import { submitBookToSupabase } from '../../services/supabase';
import { ValidationReport } from './ValidationReport';
import { HtmlBookReader } from '../reader/HtmlBookReader';

export interface HtmlBookPublisherProps {
  user: UserProfile | null;
  taxonomies: TaxonomyNode[];
  concepts: ConceptNode[];
  onPublishSuccess?: (bookId: string, status: string) => void;
  onCancel?: () => void;
}

export const HtmlBookPublisher: React.FC<HtmlBookPublisherProps> = ({
  user,
  taxonomies,
  concepts,
  onPublishSuccess,
  onCancel,
}) => {
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [blobUrl, setBlobUrl] = useState<string>('');
  const [report, setReport] = useState<IValidationReport | null>(null);

  // Form Fields
  const [title, setTitle] = useState<string>('');
  const [summary, setSummary] = useState<string>('');
  const [readingMinutes, setReadingMinutes] = useState<number>(10);
  const [primaryTaxonomyId, setPrimaryTaxonomyId] = useState<string>(taxonomies[0]?.id || 'human-nature');
  const [selectedConceptIds, setSelectedConceptIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string>('');

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
    const bookId = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'new-book';
    const updatedHtml = injectProtocolBridge(htmlContent, bookId);
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

  // Local Save (IndexedDB)
  const handleSaveLocal = async () => {
    if (!htmlContent || !title.trim()) {
      alert('Please provide a file and a book title.');
      return;
    }

    const bookId = `import-${Date.now().toString(36)}`;
    const newBook: CatalogBook = {
      id: bookId,
      title: title.trim(),
      summary: summary.trim() || 'Private local HTML book',
      contentPath: blobUrl,
      status: 'draft',
      readingMinutes,
      primaryTaxonomyId,
      taxonomyIds: [primaryTaxonomyId],
      tags: ['Local Import'],
      conceptLinks: selectedConceptIds.map(cId => ({ conceptId: cId, role: 'related' })),
      isImported: true,
    };

    await saveLocalImport(newBook, htmlContent);
    if (onPublishSuccess) onPublishSuccess(bookId, 'local');
  };

  // Submit to Supabase (Pending Review)
  const handleSubmitReview = async () => {
    if (!htmlContent || !title.trim()) {
      alert('Please upload an HTML document and enter a title.');
      return;
    }

    if (!user) {
      alert('You must be signed in to submit a book for public review.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    const stableId = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || `book-${Date.now().toString(36)}`;

    const result = await submitBookToSupabase(
      {
        id: stableId,
        title: title.trim(),
        summary: summary.trim() || 'A new visual book on IndexLib.',
        contentPath: '',
        readingMinutes,
        primaryTaxonomyId,
        taxonomyIds: [primaryTaxonomyId],
        tags: ['Community'],
        conceptLinks: selectedConceptIds.map(cId => ({ conceptId: cId, role: 'explains' })),
        authorId: user.id,
      },
      htmlContent,
      user.id
    );

    setIsSubmitting(false);

    if (result.success) {
      if (onPublishSuccess) onPublishSuccess(stableId, 'pending_review');
    } else {
      setSubmitError(result.error || 'Failed to submit book.');
    }
  };

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      <p className="page-eyebrow">Author Studio</p>
      <h1 className="page-title">Publish an HTML book.</h1>
      <p className="page-lede">
        Upload your visual HTML book. Anyone can submit; your book enters <strong>Pending Review</strong> and becomes visible globally once approved by an administrator.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: blobUrl ? '1fr 1fr' : '1fr', gap: 28, alignItems: 'start' }}>
        {/* Left Column: Upload & Metadata */}
        <div>
          {/* Dropzone */}
          <label
            style={{
              display: 'block',
              border: '2px dashed var(--color-line)',
              borderRadius: 'var(--radius-md)',
              padding: '36px 20px',
              textAlign: 'center',
              background: 'var(--color-surface)',
              cursor: 'pointer',
              transition: 'border-color 0.2s',
            }}
          >
            <input
              type="file"
              accept=".html,.htm"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
            <div style={{ fontSize: '2.4rem', marginBottom: 8 }}>📄</div>
            <strong style={{ display: 'block', fontSize: '1.05rem', color: 'var(--color-ink)' }}>
              {fileName ? fileName : 'Choose HTML book or drag & drop here'}
            </strong>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-muted)', marginTop: 4, display: 'block' }}>
              Accepts .html and .htm files up to 5 MiB
            </span>
          </label>

          {/* Verification Report */}
          <ValidationReport report={report} onInjectBridge={handleInjectBridge} />

          {/* Metadata Form */}
          <div
            style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-line)',
              borderRadius: 'var(--radius-md)',
              padding: 24,
              marginTop: 20,
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <h3 style={{ fontSize: '1.1rem', marginBottom: 16 }}>Book Metadata</h3>

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 4 }}>
                Book Title *
              </label>
              <input
                type="text"
                className="search-input"
                style={{ borderRadius: 'var(--radius-sm)' }}
                placeholder="e.g. The Architecture of Habit"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 4 }}>
                Summary / Premise
              </label>
              <textarea
                className="search-input"
                style={{ borderRadius: 'var(--radius-sm)', minHeight: 70, resize: 'vertical' }}
                placeholder="A concise premise describing what readers will learn..."
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 4 }}>
                  Primary Topic
                </label>
                <select
                  className="search-input"
                  style={{ borderRadius: 'var(--radius-sm)', height: 38 }}
                  value={primaryTaxonomyId}
                  onChange={(e) => setPrimaryTaxonomyId(e.target.value)}
                >
                  {taxonomies.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 4 }}>
                  Est. Minutes
                </label>
                <input
                  type="number"
                  className="search-input"
                  style={{ borderRadius: 'var(--radius-sm)' }}
                  min={1}
                  value={readingMinutes}
                  onChange={(e) => setReadingMinutes(parseInt(e.target.value) || 10)}
                />
              </div>
            </div>

            {/* Concept Links */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 8 }}>
                Link to Concepts
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
                        background: isSelected ? 'var(--color-ink)' : '#fff',
                        color: isSelected ? '#fff' : 'inherit',
                      }}
                    >
                      {concept.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {submitError && (
              <p style={{ color: 'var(--color-danger)', fontSize: '0.85rem', marginBottom: 12 }}>
                {submitError}
              </p>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, borderTop: '1px solid var(--color-line)' }}>
              <button
                type="button"
                className="btn"
                onClick={handleSaveLocal}
                title="Save strictly on this device in IndexedDB"
              >
                Save Private (Local)
              </button>

              <div style={{ display: 'flex', gap: 8 }}>
                {onCancel && (
                  <button type="button" className="btn" onClick={onCancel}>
                    Cancel
                  </button>
                )}
                <button
                  type="button"
                  className="btn btn-primary"
                  disabled={isSubmitting || !htmlContent}
                  onClick={handleSubmitReview}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit for Review →'}
                </button>
              </div>
            </div>
            <small style={{ display: 'block', color: 'var(--color-muted)', marginTop: 8, fontSize: '0.78rem' }}>
              Submitting adds the book to your account and puts it in the Admin Queue for public catalog approval.
            </small>
          </div>
        </div>

        {/* Right Column: Live Sandboxed Preview */}
        {blobUrl && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h3 style={{ fontSize: '1.1rem' }}>Live Sandboxed Preview</h3>
              <span className="badge badge-accent">Isolated Preview</span>
            </div>
            <HtmlBookReader
              src={blobUrl}
              bookId={title.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'preview'}
              title={title || 'Untitled Visual Book'}
              isImported={true}
            />
          </div>
        )}
      </div>
    </div>
  );
};
