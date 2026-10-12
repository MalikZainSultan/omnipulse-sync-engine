import React, { useState } from 'react';
import type { ErrorGuidance } from '../types';
import { ERROR_GUIDANCE_CATALOG } from '../lib/initialData';
import { AlertTriangle, CheckCircle2, Wrench, Languages, HelpCircle } from 'lucide-react';

interface ErrorResolverBoxProps {
  onAutoFixTriggered: (fixActionName: string) => void;
}

export const ErrorResolverBox: React.FC<ErrorResolverBoxProps> = ({ onAutoFixTriggered }) => {
  const [selectedError, setSelectedError] = useState<ErrorGuidance>(ERROR_GUIDANCE_CATALOG[0]);
  const [fixedErrors, setFixedErrors] = useState<string[]>([]);

  const handleFix = (code: string, fixActionName: string) => {
    if (!fixedErrors.includes(code)) {
      setFixedErrors([...fixedErrors, code]);
    }
    onAutoFixTriggered(fixActionName);
  };

  return (
    <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Languages size={20} color="#6366f1" />
            <span>Human-Readable Error Resolver (Bilingual: English & Urdu Guidance)</span>
          </h2>
          <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '2px' }}>
            Translates cryptic marketplace API codes into clear English & Urdu with 1-Click Auto-Fix actions.
          </p>
        </div>

        <span className="badge" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#a5b4fc', borderColor: 'rgba(99, 102, 241, 0.3)' }}>
          CedCommerce Pain-Point Killer #3
        </span>
      </div>

      {/* Error Selector Tabs */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '16px' }}>
        {ERROR_GUIDANCE_CATALOG.map((err) => {
          const isSelected = selectedError.code === err.code;
          const isFixed = fixedErrors.includes(err.code);

          return (
            <button
              key={err.code}
              onClick={() => setSelectedError(err)}
              style={{
                background: isSelected ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                border: `1px solid ${isSelected ? 'rgba(99, 102, 241, 0.6)' : 'rgba(255, 255, 255, 0.08)'}`,
                color: isSelected ? '#fff' : '#94a3b8',
                borderRadius: '8px',
                padding: '8px 14px',
                fontSize: '0.78rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s',
              }}
            >
              <span
                style={{
                  fontWeight: 700,
                  color: err.platform === 'EBAY' ? '#60a5fa' : err.platform === 'SHOPIFY' ? '#a3e635' : '#e879f9',
                }}
              >
                {err.platform}
              </span>
              <span className="font-mono">Code {err.code}</span>
              {isFixed && <CheckCircle2 size={13} color="#10b981" />}
            </button>
          );
        })}
      </div>

      {/* Selected Error Guidance Card */}
      <div
        style={{
          background: 'rgba(0, 0, 0, 0.35)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '12px',
          padding: '20px',
        }}
      >
        {/* Raw Error Banner */}
        <div
          style={{
            background: 'rgba(244, 63, 94, 0.08)',
            border: '1px solid rgba(244, 63, 94, 0.25)',
            borderRadius: '8px',
            padding: '12px 14px',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
          }}
        >
          <AlertTriangle size={18} color="#fb7185" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <div style={{ fontSize: '0.72rem', color: '#fb7185', fontWeight: 700, textTransform: 'uppercase' }}>
              Raw Marketplace API Response ({selectedError.platform} Error Code: {selectedError.code})
            </div>
            <div className="font-mono" style={{ fontSize: '0.78rem', color: '#e2e8f0', marginTop: '2px' }}>
              "{selectedError.rawError}"
            </div>
          </div>
        </div>

        {/* Bilingual Explanations Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '20px' }}>
          {/* English Guidance */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: '8px',
              padding: '14px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', fontWeight: 700, color: '#38bdf8', marginBottom: '6px' }}>
              <span>🇬🇧 Plain English Explanation:</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#cbd5e1', lineHeight: '1.5' }}>
              {selectedError.englishExplanation}
            </p>
          </div>

          {/* Urdu Guidance */}
          <div
            style={{
              background: 'rgba(99, 102, 241, 0.04)',
              border: '1px solid rgba(99, 102, 241, 0.2)',
              borderRadius: '8px',
              padding: '14px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', fontWeight: 700, color: '#818cf8', marginBottom: '6px' }}>
              <span>🇵🇰 اردو رہنمائی (Urdu Translation & Solution):</span>
            </div>
            <p style={{ fontSize: '0.82rem', color: '#e2e8f0', lineHeight: '1.6', direction: 'rtl', textAlign: 'right' }}>
              {selectedError.urduExplanation}
            </p>
          </div>
        </div>

        {/* Action / Auto-Fix Footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            paddingTop: '14px',
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: '#94a3b8' }}>
            <HelpCircle size={15} color="#818cf8" />
            <span>
              {fixedErrors.includes(selectedError.code)
                ? '✅ Auto-fix executed and verified across connected stores.'
                : 'Automated remediation available. Click button to fix immediately.'}
            </span>
          </div>

          {selectedError.autoFixAvailable ? (
            <button
              className="btn btn-primary"
              onClick={() => handleFix(selectedError.code, selectedError.fixActionName)}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem' }}
            >
              <Wrench size={14} />
              <span>{selectedError.fixActionName}</span>
            </button>
          ) : (
            <span className="badge" style={{ background: 'rgba(255, 255, 255, 0.05)', color: '#94a3b8' }}>
              Requires Credential Re-Generation in Settings
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
