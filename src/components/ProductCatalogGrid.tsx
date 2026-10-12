import type { ProductMaster } from '../types';
import { Database } from 'lucide-react';

interface ProductCatalogGridProps {
  products: ProductMaster[];
  isProcessing: boolean;
  onSellUnit: (sku: string, source: 'SHOPIFY' | 'EBAY' | 'WOOCOMMERCE') => void;
}

export const ProductCatalogGrid: React.FC<ProductCatalogGridProps> = ({
  products,
  isProcessing,
  onSellUnit,
}) => {
  return (
    <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Database size={20} color="#6366f1" />
            <span>Central Product Registry & Multi-Channel Inventory Grid</span>
          </h2>
          <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '2px' }}>
            Prisma <code style={{ color: '#06b6d4' }}>ProductMaster</code> Single Source of Truth mapped to Shopify, eBay, & WooCommerce.
          </p>
        </div>

        <span className="badge" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}>
          {products.length} Master SKUs Tracked
        </span>
      </div>

      {/* Catalog Table */}
      <div style={{ overflowX: 'auto', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '10px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8rem' }}>
          <thead>
            <tr style={{ background: 'rgba(255, 255, 255, 0.03)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <th style={{ padding: '12px 16px', color: '#94a3b8', fontWeight: 600 }}>Global SKU & Title</th>
              <th style={{ padding: '12px 16px', color: '#94a3b8', fontWeight: 600 }}>Master Stock</th>
              <th style={{ padding: '12px 16px', color: '#94a3b8', fontWeight: 600 }}>Shopify</th>
              <th style={{ padding: '12px 16px', color: '#94a3b8', fontWeight: 600 }}>eBay</th>
              <th style={{ padding: '12px 16px', color: '#94a3b8', fontWeight: 600 }}>WooCommerce</th>
              <th style={{ padding: '12px 16px', color: '#94a3b8', fontWeight: 600 }}>Selling Price</th>
              <th style={{ padding: '12px 16px', color: '#94a3b8', fontWeight: 600, textAlign: 'right' }}>Trigger Live Sale</th>
            </tr>
          </thead>
          <tbody>
            {products.map((prod, idx) => {
              const shopifyMap = prod.platformMappings.find((m) => m.platform === 'SHOPIFY');
              const ebayMap = prod.platformMappings.find((m) => m.platform === 'EBAY');
              const wooMap = prod.platformMappings.find((m) => m.platform === 'WOOCOMMERCE');

              return (
                <tr
                  key={prod.id}
                  style={{
                    borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                    background: idx % 2 === 0 ? 'transparent' : 'rgba(255, 255, 255, 0.01)',
                  }}
                >
                  {/* SKU & Title */}
                  <td style={{ padding: '12px 16px', maxWidth: '280px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                      <span className="font-mono" style={{ fontWeight: 800, color: '#f8fafc', fontSize: '0.82rem' }}>
                        {prod.globalSku}
                      </span>
                      {prod.brand && (
                        <span className="badge" style={{ background: 'rgba(255, 255, 255, 0.08)', color: '#cbd5e1', fontSize: '0.66rem' }}>
                          {prod.brand}
                        </span>
                      )}
                    </div>
                    <div
                      style={{
                        fontSize: '0.74rem',
                        color: '#94a3b8',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                      title={prod.title}
                    >
                      {prod.title}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '2px' }}>
                      UPC: {prod.barcode || 'N/A'} &bull; eBay Cat: {prod.ebayCategoryId}
                    </div>
                  </td>

                  {/* Master Stock */}
                  <td style={{ padding: '12px 16px' }}>
                    <span
                      className="font-mono"
                      style={{
                        fontSize: '1rem',
                        fontWeight: 800,
                        color: prod.masterQuantity > 10 ? '#34d399' : prod.masterQuantity > 0 ? '#fbbf24' : '#fb7185',
                      }}
                    >
                      {prod.masterQuantity}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: '#64748b', marginLeft: '4px' }}>units</span>
                  </td>

                  {/* Shopify */}
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span className="font-mono" style={{ fontWeight: 700, color: '#e2e8f0' }}>
                        {shopifyMap?.syncedStock ?? 0}
                      </span>
                      <span className="badge badge-synced" style={{ fontSize: '0.65rem', padding: '2px 5px' }}>
                        {shopifyMap?.syncStatus ?? 'SYNCED'}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '2px' }} className="font-mono">
                      var: {shopifyMap?.platformItemId.slice(-7)}
                    </div>
                  </td>

                  {/* eBay */}
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span className="font-mono" style={{ fontWeight: 700, color: '#e2e8f0' }}>
                        {ebayMap?.syncedStock ?? 0}
                      </span>
                      <span className="badge badge-synced" style={{ fontSize: '0.65rem', padding: '2px 5px' }}>
                        {ebayMap?.syncStatus ?? 'SYNCED'}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '2px' }} className="font-mono">
                      item: {ebayMap?.platformItemId.slice(-6)}
                    </div>
                  </td>

                  {/* WooCommerce */}
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span className="font-mono" style={{ fontWeight: 700, color: '#e2e8f0' }}>
                        {wooMap?.syncedStock ?? 0}
                      </span>
                      <span className="badge badge-synced" style={{ fontSize: '0.65rem', padding: '2px 5px' }}>
                        {wooMap?.syncStatus ?? 'SYNCED'}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '2px' }} className="font-mono">
                      id: {wooMap?.platformItemId}
                    </div>
                  </td>

                  {/* Price */}
                  <td style={{ padding: '12px 16px' }}>
                    <span className="font-mono" style={{ fontWeight: 700, color: '#f8fafc' }}>
                      ${prod.sellingPrice.toFixed(2)}
                    </span>
                  </td>

                  {/* Trigger Action */}
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '5px', justifyContent: 'flex-end' }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        disabled={isProcessing || prod.masterQuantity <= 0}
                        onClick={() => onSellUnit(prod.globalSku, 'SHOPIFY')}
                        title="Simulate 1 sale on Shopify"
                        style={{ fontSize: '0.7rem', padding: '4px 8px' }}
                      >
                        Sell (SP)
                      </button>
                      <button
                        className="btn btn-secondary btn-sm"
                        disabled={isProcessing || prod.masterQuantity <= 0}
                        onClick={() => onSellUnit(prod.globalSku, 'EBAY')}
                        title="Simulate 1 sale on eBay"
                        style={{ fontSize: '0.7rem', padding: '4px 8px' }}
                      >
                        Sell (EB)
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
