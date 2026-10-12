import React, { useState } from 'react';
import type { PlatformType, ProductMaster } from '../types';
import { Play, Repeat, AlertTriangle, Send, Sliders } from 'lucide-react';

interface SimulationCenterProps {
  products: ProductMaster[];
  isProcessing: boolean;
  onTriggerSync: (
    sku: string,
    source: PlatformType,
    isEchoAttack?: boolean,
    customTitle?: string,
    customVendor?: string
  ) => void;
}

export const SimulationCenter: React.FC<SimulationCenterProps> = ({
  products,
  isProcessing,
  onTriggerSync,
}) => {
  const [selectedSku, setSelectedSku] = useState(products[0]?.globalSku || 'APL-MBP-16-M3');
  const [selectedSource, setSelectedSource] = useState<PlatformType>('SHOPIFY');
  const [showCustomInjector, setShowCustomInjector] = useState(false);
  const [customTitle, setCustomTitle] = useState(
    'Apple MacBook Pro 16" M3 Max 36GB RAM 1TB SSD Space Black 2024 Edition Premium Laptop Computer with Liquid Retina XDR Display'
  );
  const [customVendor, setCustomVendor] = useState('Apple');

  return (
    <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>Live Webhook Ingestion & Dispatch Simulator</span>
          </h2>
          <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '2px' }}>
            Simulate realistic multi-channel events and observe sub-second dispatching & loop suppression.
          </p>
        </div>

        <button
          className="btn btn-secondary btn-sm"
          onClick={() => setShowCustomInjector(!showCustomInjector)}
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Sliders size={14} />
          <span>{showCustomInjector ? 'Hide Custom Payload' : 'Custom Webhook Injector'}</span>
        </button>
      </div>

      {/* Preset Action Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '12px',
          marginBottom: showCustomInjector ? '20px' : '0',
        }}
      >
        {/* Preset 1: Shopify Order Created */}
        <button
          className="btn btn-secondary"
          disabled={isProcessing}
          onClick={() => onTriggerSync('APL-MBP-16-M3', 'SHOPIFY')}
          style={{
            textAlign: 'left',
            padding: '14px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '6px',
            borderLeft: '4px solid #008060',
            background: 'rgba(0, 128, 96, 0.05)',
            cursor: isProcessing ? 'not-allowed' : 'pointer',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Play size={14} color="#96bf48" /> Shopify Order Created
            </span>
            <span className="badge badge-shopify">Shopify</span>
          </div>
          <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
            Deduct 1 unit (APL-MBP-16-M3) & parallel sync to eBay + Woo (&lt;310ms)
          </span>
        </button>

        {/* Preset 2: eBay Item Sold */}
        <button
          className="btn btn-secondary"
          disabled={isProcessing}
          onClick={() => onTriggerSync('SNY-WH1000-XM5', 'EBAY')}
          style={{
            textAlign: 'left',
            padding: '14px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '6px',
            borderLeft: '4px solid #0064d2',
            background: 'rgba(0, 100, 210, 0.05)',
            cursor: isProcessing ? 'not-allowed' : 'pointer',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Play size={14} color="#60a5fa" /> eBay Listing Sold
            </span>
            <span className="badge badge-ebay">eBay</span>
          </div>
          <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
            Sell 1 unit (SNY-WH1000-XM5) & sync to Shopify GraphQL + Woo
          </span>
        </button>

        {/* Preset 3: CedCommerce Echo Loop Attack */}
        <button
          className="btn btn-secondary"
          disabled={isProcessing}
          onClick={() => onTriggerSync('APL-MBP-16-M3', 'EBAY', true)}
          style={{
            textAlign: 'left',
            padding: '14px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '6px',
            borderLeft: '4px solid #f59e0b',
            background: 'rgba(245, 158, 11, 0.08)',
            cursor: isProcessing ? 'not-allowed' : 'pointer',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Repeat size={14} color="#f59e0b" /> Simulate Echo Loop Attack
            </span>
            <span className="badge badge-locked">Anti-Echo Test</span>
          </div>
          <span style={{ fontSize: '0.74rem', color: '#cbd5e1' }}>
            Fires return webhook within 15s lock window to verify infinite loop neutralization
          </span>
        </button>

        {/* Preset 4: Aspect & Length Stress Test */}
        <button
          className="btn btn-secondary"
          disabled={isProcessing}
          onClick={() =>
            onTriggerSync(
              'prod-stress',
              'SHOPIFY',
              false,
              'Nike Air Max 90 Ultra 2.0 Flyknit Mens Running Shoes Sneakers White Bright Crimson 10.5 High Top Limited Rare Edition',
              ''
            )
          }
          style={{
            textAlign: 'left',
            padding: '14px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '6px',
            borderLeft: '4px solid #f43f5e',
            background: 'rgba(244, 63, 94, 0.05)',
            cursor: isProcessing ? 'not-allowed' : 'pointer',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <AlertTriangle size={14} color="#fb7185" /> Aspect Failure Stress
            </span>
            <span className="badge badge-error">Pain-Point Fix</span>
          </div>
          <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
            Empty vendor + 115-char title &rarr; tests regex extraction & word-boundary truncation
          </span>
        </button>
      </div>

      {/* Expandable Custom Webhook Injector */}
      {showCustomInjector && (
        <div
          style={{
            background: 'rgba(0, 0, 0, 0.35)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            padding: '18px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc' }}>
              Custom Webhook Payload Injector
            </span>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
              Simulates /api/webhooks/&lt;platform&gt; payload ingestion
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                Event Source Platform
              </label>
              <select
                value={selectedSource}
                onChange={(e) => setSelectedSource(e.target.value as PlatformType)}
                style={{
                  width: '100%',
                  background: 'var(--bg-card)',
                  color: '#fff',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '8px',
                  padding: '8px 10px',
                  fontSize: '0.85rem',
                }}
              >
                <option value="SHOPIFY">Shopify (orders/create, inventory/update)</option>
                <option value="EBAY">eBay (ORDER_STATUS_CHANGED)</option>
                <option value="WOOCOMMERCE">WooCommerce (woocommerce_product_stock_updated)</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                Global SKU Target
              </label>
              <select
                value={selectedSku}
                onChange={(e) => setSelectedSku(e.target.value)}
                style={{
                  width: '100%',
                  background: 'var(--bg-card)',
                  color: '#fff',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '8px',
                  padding: '8px 10px',
                  fontSize: '0.85rem',
                }}
              >
                {products.map((p) => (
                  <option key={p.id} value={p.globalSku}>
                    {p.globalSku} — {p.title.slice(0, 35)}...
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                Vendor / Brand Tag
              </label>
              <input
                type="text"
                value={customVendor}
                onChange={(e) => setCustomVendor(e.target.value)}
                placeholder="e.g. Apple, Sony, or empty"
                style={{
                  width: '100%',
                  background: 'var(--bg-card)',
                  color: '#fff',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '8px',
                  padding: '8px 10px',
                  fontSize: '0.85rem',
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
              Product Title (Test truncation and aspect extraction)
            </label>
            <input
              type="text"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              style={{
                width: '100%',
                background: 'var(--bg-card)',
                color: '#fff',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '8px',
                padding: '8px 10px',
                fontSize: '0.85rem',
              }}
            />
          </div>

          <button
            className="btn btn-primary"
            disabled={isProcessing}
            onClick={() => onTriggerSync(selectedSku, selectedSource, false, customTitle, customVendor)}
            style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Send size={15} />
            <span>Fire Ingestion Webhook</span>
          </button>
        </div>
      )}
    </div>
  );
};
