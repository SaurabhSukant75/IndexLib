import React from 'react';
import { ValidationReport as IValidationReport } from '../../services/validator';

interface ValidationReportProps {
  report: IValidationReport | null;
  onInjectBridge?: () => void;
}

export const ValidationReport: React.FC<ValidationReportProps> = ({
  report,
  onInjectBridge,
}) => {
  if (!report) return null;

  return (
    <div
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-line)',
        borderRadius: 'var(--radius-md)',
        padding: 20,
        boxShadow: 'var(--shadow-sm)',
        marginTop: 16,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <strong style={{ fontSize: '0.95rem' }}>Automated Verification Report</strong>
        <span
          className={`badge ${report.isValid ? 'badge-green' : 'badge-warning'}`}
        >
          {report.isValid ? 'Validation Passed' : 'Action Required'}
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.88rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ color: 'var(--color-green)', fontWeight: 'bold' }}>✓</span>
          <span>HTML5 Document Structure & Encoding</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ color: 'var(--color-green)', fontWeight: 'bold' }}>✓</span>
          <span>
            {report.pageIds.length} Unique Navigable Page ID(s): [{report.pageIds.slice(0, 5).join(', ')}
            {report.pageIds.length > 5 ? '...' : ''}]
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ color: report.hasProtocolScript ? 'var(--color-green)' : 'var(--color-warning-text)', fontWeight: 'bold' }}>
            {report.hasProtocolScript ? '✓' : '⚠'}
          </span>
          <span>
            {report.hasProtocolScript
              ? 'Communication protocol bridge script detected'
              : 'Communication bridge script missing'}
          </span>
          {!report.hasProtocolScript && onInjectBridge && (
            <button
              className="btn"
              style={{ padding: '2px 8px', fontSize: '0.75rem', marginLeft: 'auto' }}
              onClick={onInjectBridge}
            >
              Auto-Inject Bridge
            </button>
          )}
        </div>

        {report.errors.map((err, i) => (
          <div key={`err-${i}`} style={{ color: 'var(--color-danger)', display: 'flex', gap: 8, marginTop: 4 }}>
            <span>✕</span>
            <span>{err}</span>
          </div>
        ))}

        {report.warnings.map((warn, i) => (
          <div key={`warn-${i}`} style={{ color: 'var(--color-warning-text)', display: 'flex', gap: 8, marginTop: 4 }}>
            <span>⚠</span>
            <span>{warn}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
