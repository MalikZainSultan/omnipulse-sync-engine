import React, { useState } from 'react';
import type { CategoryMappingItem } from '../types';
import { INITIAL_CATEGORY_MAPPINGS } from '../lib/initialData';
import { Layers, ArrowRight, CheckCircle2, SlidersHorizontal } from 'lucide-react';

export const CategoryMapper: React.FC = () => {
  const [mappings, setMappings] = useState<CategoryMappingItem[]>(INITIAL_CATEGORY_MAPPINGS);
  const [selectedId, setSelectedId] = useState<string>(mappings[0]?.id || 'cat-1');
  const [notification, setNotification] = useState<string | null>(null);

  const selectedMapping = mappings.find((m) => m.id === selectedId) || mappings[0];

  const handleSaveAspect = (index: number, newSource: string) => {
    const updated = mappings.map((m) => {
      if (m.id === selectedId) {
        const aspects = [...m.requiredAspects];
        aspects[index] = {
          ...aspects[index],
          mappedSource: newSource,
          status: 'MAPPED',
        };
        return { ...m, requiredAspects: aspects };
      }
      return m;
    });
    setMappings(updated);
    setNotification(`Successfully updated mapping for "${selectedMapping.requiredAspects[index].name}"`);
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={20} color="#06b6d4" />
            <span>Visual Category & Aspect Taxonomy Mapper (Phase 4 Prototype)</span>
          </h2>
          <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '2px' }}>
            Side-by-side taxonomy mapping between Shopify categories and eBay leaf taxonomy trees.
          </p>
        </div>

        <span className="badge badge-synced" style={{ fontSize: '0.78rem' }}>
          3 Active Category Bridges
        </span>
      </div>

      {notification && (
        <div
          style={{
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '8px',
            padding: '10px 14px',
            marginBottom: '16px',
            fontSize: '0.8rem',
            color: '#34d399',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <CheckCircle2 size={16} />
          <span>{notification}</span>
        </div>
      )}

      {/* Category Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', overflowX: 'auto', paddingBottom: '4px' }}>
        {mappings.map((m) => {
          const isSelected = m.id === selectedId;
          return (
            <button
              key={m.id}
              onClick={() => setSelectedId(m.id)}
              style={{
                background: isSelected ? 'rgba(6, 182, 212, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                border: `1px solid ${isSelected ? 'rgba(6, 182, 212, 0.5)' : 'rgba(255, 255, 255, 0.08)'}`,
                color: isSelected ? '#fff' : '#94a3b8',
                borderRadius: '8px',
                padding: '8px 14px',
                fontSize: '0.8rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                whiteSpace: 'nowrap',
              }}
            >
              <span style={{ fontWeight: 600 }}>{m.shopifyCategory.split('>').pop()?.trim()}</span>
              <span className="badge badge-ebay font-mono">{m.ebayCategoryId}</span>
            </button>
          );
        })}
      </div>

      {/* Side-by-Side Taxonomy Alignment Box */}
      <div
        style={{
          background: 'rgba(0, 0, 0, 0.3)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          borderRadius: '12px',
          padding: '18px',
          marginBottom: '20px',
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', alignItems: 'center' }}>
          
          {/* Source Taxonomy (Shopify) */}
          <div
            style={{
              background: 'rgba(0, 128, 96, 0.06)',
              border: '1px solid rgba(0, 128, 96, 0.25)',
              borderRadius: '8px',
              padding: '12px 14px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.72rem', color: '#a3e635', fontWeight: 700, textTransform: 'uppercase' }}>
                Shopify Taxonomy Tree
              </span>
              <span className="badge badge-shopify">Source</span>
            </div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f1f5f9' }}>
              {selectedMapping.shopifyCategory}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '4px' }}>
              Extracted from Shopify standard product taxonomy
            </div>
          </div>

          {/* Bridge Arrow */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'rgba(99, 102, 241, 0.15)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ArrowRight size={18} color="#818cf8" />
            </div>
          </div>

          {/* Target Taxonomy (eBay) */}
          <div
            style={{
              background: 'rgba(0, 100, 210, 0.06)',
              border: '1px solid rgba(0, 100, 210, 0.25)',
              borderRadius: '8px',
              padding: '12px 14px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.72rem', color: '#60a5fa', fontWeight: 700, textTransform: 'uppercase' }}>
                eBay Taxonomy Leaf Category
              </span>
              <span className="badge badge-ebay font-mono">ID: {selectedMapping.ebayCategoryId}</span>
            </div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f1f5f9' }}>
              {selectedMapping.ebayCategoryName}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '4px' }}>
              eBay Sell Inventory API taxonomy v1
            </div>
          </div>
        </div>
      </div>

      {/* Aspect Mapping Matrix Table */}
      <div>
        <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#f1f5f9', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <SlidersHorizontal size={15} color="#06b6d4" />
          <span>Mandatory & Optional Item Specifics Mapping Matrix</span>
        </div>

        <div style={{ overflowX: 'auto', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '8px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.78rem' }}>
            <thead>
              <tr style={{ background: 'rgba(255, 255, 255, 0.03)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <th style={{ padding: '10px 14px', color: '#94a3b8', fontWeight: 600 }}>eBay Required Aspect</th>
                <th style={{ padding: '10px 14px', color: '#94a3b8', fontWeight: 600 }}>Mapped Source in OmniPulse</th>
                <th style={{ padding: '10px 14px', color: '#94a3b8', fontWeight: 600 }}>Sync Status</th>
                <th style={{ padding: '10px 14px', color: '#94a3b8', fontWeight: 600, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {selectedMapping.requiredAspects.map((aspect, idx) => (
                <tr
                  key={aspect.name}
                  style={{
                    borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                    background: idx % 2 === 0 ? 'transparent' : 'rgba(255, 255, 255, 0.01)',
                  }}
                >
                  <td style={{ padding: '10px 14px', fontWeight: 700, color: '#f8fafc' }}>
                    {aspect.name}
                  </td>
                  <td style={{ padding: '10px 14px', color: '#cbd5e1' }} className="font-mono">
                    {aspect.mappedSource}
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    {aspect.status === 'MAPPED' && <span className="badge badge-synced">Mapped</span>}
                    {aspect.status === 'FALLBACK_AUTO' && <span className="badge badge-locked">Smart Waterfall</span>}
                    {aspect.status === 'MISSING' && <span className="badge badge-error">Missing</span>}
                  </td>
                  <td style={{ padding: '10px 14px', textAlign: 'right' }}>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleSaveAspect(idx, `ProductMaster.aspectsJson.${aspect.name.toLowerCase()}`)}
                      style={{ fontSize: '0.72rem', padding: '3px 8px' }}
                    >
                      Remap
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
