import React, { useState } from 'react';
import { resolveBrand, truncateTitleForEbay } from '../lib/syncEngine';
import { Sparkles, Check, ArrowDown } from 'lucide-react';

export const AspectResolverLab: React.FC = () => {
  const [testTitle, setTestTitle] = useState(
    'Apple MacBook Pro 16" M3 Max 36GB RAM 1TB SSD Space Black 2024 Edition Premium Laptop Computer with Liquid Retina XDR Display'
  );
  const [vendorTag, setVendorTag] = useState('');
  const [defaultBrand, setDefaultBrand] = useState('Valued Merchant Tech');

  const brandResult = resolveBrand(vendorTag, testTitle, defaultBrand);
  const truncResult = truncateTitleForEbay(testTitle, 80);

  return (
    <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={20} color="#06b6d4" />
            <span>Smart Aspect & Brand Auto-Resolver Playground (CedCommerce Killer #1)</span>
          </h2>
          <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '2px' }}>
            Eliminates eBay rejection code <code style={{ color: '#fb7185' }}>21919301</code> (Missing Item Specifics) and <code style={{ color: '#fb7185' }}>21916635</code> (Title &gt; 80 chars).
          </p>
        </div>

        <div className="badge badge-synced" style={{ fontSize: '0.78rem' }}>
          Waterfall Rule Active
        </div>
      </div>

      {/* Two Column Layout: Brand Waterfall + Title Truncator */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        
        {/* Left Column: Brand Auto-Resolver Waterfall */}
        <div style={{ background: 'rgba(0, 0, 0, 0.25)', borderRadius: '12px', padding: '18px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
          <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#f1f5f9', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>A. 3-Step Brand Resolution Waterfall</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
            <div>
              <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                Shopify Vendor Tag (Try leaving empty to trigger Regex step):
              </label>
              <input
                type="text"
                value={vendorTag}
                onChange={(e) => setVendorTag(e.target.value)}
                placeholder="(Empty — will test title regex)"
                style={{
                  width: '100%',
                  background: 'var(--bg-card)',
                  color: '#fff',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '6px',
                  padding: '7px 10px',
                  fontSize: '0.82rem',
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                Account Default Brand Fallback:
              </label>
              <input
                type="text"
                value={defaultBrand}
                onChange={(e) => setDefaultBrand(e.target.value)}
                style={{
                  width: '100%',
                  background: 'var(--bg-card)',
                  color: '#fff',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '6px',
                  padding: '7px 10px',
                  fontSize: '0.82rem',
                }}
              />
            </div>
          </div>

          {/* Visual Waterfall Steps */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {/* Step 1 */}
            <div
              style={{
                padding: '10px',
                borderRadius: '8px',
                background: brandResult.ruleStep === 1 ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                border: `1px solid ${brandResult.ruleStep === 1 ? '#10b981' : 'rgba(255, 255, 255, 0.05)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ fontSize: '0.76rem' }}>
                <span style={{ fontWeight: 700, color: brandResult.ruleStep === 1 ? '#34d399' : '#94a3b8' }}>Step 1: </span>
                <span style={{ color: '#cbd5e1' }}>Check Shopify Vendor Tag</span>
              </div>
              {brandResult.ruleStep === 1 ? (
                <span className="badge badge-synced">Matched ({vendorTag})</span>
              ) : (
                <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Empty &rarr; Pass</span>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <ArrowDown size={14} color="#64748b" />
            </div>

            {/* Step 2 */}
            <div
              style={{
                padding: '10px',
                borderRadius: '8px',
                background: brandResult.ruleStep === 2 ? 'rgba(6, 182, 212, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                border: `1px solid ${brandResult.ruleStep === 2 ? '#06b6d4' : 'rgba(255, 255, 255, 0.05)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ fontSize: '0.76rem' }}>
                <span style={{ fontWeight: 700, color: brandResult.ruleStep === 2 ? '#06b6d4' : '#94a3b8' }}>Step 2: </span>
                <span style={{ color: '#cbd5e1' }}>Regex Title Brand Extractor</span>
              </div>
              {brandResult.ruleStep === 2 ? (
                <span className="badge" style={{ background: 'rgba(6, 182, 212, 0.2)', color: '#06b6d4' }}>
                  Extracted ({brandResult.brand})
                </span>
              ) : brandResult.ruleStep === 1 ? (
                <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Skipped (Resolved at Step 1)</span>
              ) : (
                <span style={{ fontSize: '0.7rem', color: '#64748b' }}>No Match &rarr; Pass</span>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <ArrowDown size={14} color="#64748b" />
            </div>

            {/* Step 3 */}
            <div
              style={{
                padding: '10px',
                borderRadius: '8px',
                background: brandResult.ruleStep === 3 ? 'rgba(245, 158, 11, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                border: `1px solid ${brandResult.ruleStep === 3 ? '#f59e0b' : 'rgba(255, 255, 255, 0.05)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ fontSize: '0.76rem' }}>
                <span style={{ fontWeight: 700, color: brandResult.ruleStep === 3 ? '#fbbf24' : '#94a3b8' }}>Step 3: </span>
                <span style={{ color: '#cbd5e1' }}>Account Default Brand Fallback</span>
              </div>
              {brandResult.ruleStep === 3 ? (
                <span className="badge badge-locked">Auto-Assigned</span>
              ) : (
                <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Fallback Ready</span>
              )}
            </div>
          </div>

          {/* Resolved Result Box */}
          <div
            style={{
              marginTop: '14px',
              padding: '10px 12px',
              borderRadius: '8px',
              background: 'rgba(99, 102, 241, 0.1)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ fontSize: '0.7rem', color: '#818cf8', textTransform: 'uppercase', fontWeight: 700 }}>
                Resolved eBay Brand Attribute:
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: '#fff' }}>
                "{brandResult.brand}"
              </div>
            </div>
            <span className="badge" style={{ background: 'rgba(99, 102, 241, 0.25)', color: '#c7d2fe' }}>
              Source: {brandResult.source}
            </span>
          </div>
        </div>

        {/* Right Column: Algorithmic Word-Boundary Title Truncator */}
        <div style={{ background: 'rgba(0, 0, 0, 0.25)', borderRadius: '12px', padding: '18px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
          <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#f1f5f9', marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>B. 80-Char Word-Boundary Safe Truncator</span>
            <span
              style={{
                fontSize: '0.74rem',
                fontWeight: 700,
                color: testTitle.length > 80 ? '#fb7185' : '#34d399',
              }}
            >
              {testTitle.length} / 80 Chars (eBay Limit)
            </span>
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
              Live Product Title Input (Type to test boundary cuts):
            </label>
            <textarea
              rows={3}
              value={testTitle}
              onChange={(e) => setTestTitle(e.target.value)}
              style={{
                width: '100%',
                background: 'var(--bg-card)',
                color: '#fff',
                border: `1px solid ${testTitle.length > 80 ? 'rgba(244, 63, 94, 0.4)' : 'rgba(255, 255, 255, 0.12)'}`,
                borderRadius: '6px',
                padding: '8px 10px',
                fontSize: '0.82rem',
                fontFamily: 'inherit',
                resize: 'vertical',
              }}
            />
          </div>

          {/* Comparison Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            
            {/* CedCommerce Naive Cut */}
            <div
              style={{
                padding: '10px 12px',
                borderRadius: '8px',
                background: 'rgba(244, 63, 94, 0.06)',
                border: '1px solid rgba(244, 63, 94, 0.25)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#fb7185' }}>
                  ❌ CedCommerce Naive Slice (.slice(0, 80))
                </span>
                <span style={{ fontSize: '0.68rem', color: '#64748b' }}>
                  {truncResult.naiveTruncated.length} chars
                </span>
              </div>
              <div className="font-mono" style={{ fontSize: '0.75rem', color: '#e2e8f0', wordBreak: 'break-all' }}>
                {truncResult.naiveTruncated}
                {testTitle.length > 80 && (
                  <span style={{ background: '#ef4444', color: '#fff', padding: '1px 4px', borderRadius: '2px', fontWeight: 700 }}>
                    &lt;-- Cut in mid-word!
                  </span>
                )}
              </div>
            </div>

            {/* OmniPulse Algorithmic Word-Boundary Cut */}
            <div
              style={{
                padding: '10px 12px',
                borderRadius: '8px',
                background: 'rgba(16, 185, 129, 0.06)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#34d399', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Check size={12} /> OmniPulse Word-Boundary Safe Mode
                </span>
                <span style={{ fontSize: '0.68rem', color: '#34d399', fontWeight: 700 }}>
                  {truncResult.charCount} chars (Safe)
                </span>
              </div>
              <div className="font-mono" style={{ fontSize: '0.75rem', color: '#f8fafc', fontWeight: 600 }}>
                "{truncResult.truncated}"
              </div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '6px' }}>
                {truncResult.isTruncated ? (
                  <span>
                    &bull; Backtracked to last whitespace delimiter. Zero truncated half-words. Ready for eBay Sell Inventory API.
                  </span>
                ) : (
                  <span>&bull; Title within 80-character boundary. No truncation necessary.</span>
                )}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
