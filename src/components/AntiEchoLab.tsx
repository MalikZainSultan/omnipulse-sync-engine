import React from 'react';
import type { RedisLock } from '../types';
import { ShieldCheck, ShieldAlert, Lock, Zap, Clock } from 'lucide-react';

interface AntiEchoLabProps {
  activeLocks: RedisLock[];
  onTriggerEchoAttack: (sku: string, platform: RedisLock['platform']) => void;
  isProcessing: boolean;
}

export const AntiEchoLab: React.FC<AntiEchoLabProps> = ({
  activeLocks,
  onTriggerEchoAttack,
  isProcessing,
}) => {
  const now = Date.now();

  return (
    <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={20} color="#f59e0b" />
            <span>Anti-Echo Engine: Infinite Loop Prevention (CedCommerce Killer #2)</span>
          </h2>
          <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '2px' }}>
            Atomic Redis in-memory locks (<code style={{ color: '#06b6d4' }}>lock:sku:&#123;sku&#125;:&#123;platform&#125;</code>) with 15-second TTL.
          </p>
        </div>

        <span className="badge badge-locked" style={{ fontSize: '0.78rem' }}>
          {activeLocks.length} Active Locks Guarding Sync
        </span>
      </div>

      {/* Comparative Architecture Explainer */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '14px',
          marginBottom: '20px',
        }}
      >
        <div
          style={{
            background: 'rgba(244, 63, 94, 0.05)',
            border: '1px solid rgba(244, 63, 94, 0.25)',
            borderRadius: '10px',
            padding: '14px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#fb7185', fontWeight: 700, fontSize: '0.84rem', marginBottom: '6px' }}>
            <ShieldAlert size={16} />
            <span>Why CedCommerce Fails (Stock Zeroing Bug)</span>
          </div>
          <p style={{ fontSize: '0.75rem', color: '#cbd5e1', lineHeight: '1.5' }}>
            CedCommerce relies on slow relational database row flags (<code style={{ color: '#fb7185' }}>is_syncing = true</code>). 
            When Shopify stock is updated, eBay takes 400ms to send a webhook back. CedCommerce's database write lock is still pending, 
            so the incoming webhook is treated as a fresh customer purchase, firing another deduction loop until stock hits <strong>0</strong>.
          </p>
        </div>

        <div
          style={{
            background: 'rgba(16, 185, 129, 0.05)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            borderRadius: '10px',
            padding: '14px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#34d399', fontWeight: 700, fontSize: '0.84rem', marginBottom: '6px' }}>
            <Zap size={16} />
            <span>The OmniPulse Sub-Millisecond Solution</span>
          </div>
          <p style={{ fontSize: '0.75rem', color: '#cbd5e1', lineHeight: '1.5' }}>
            OmniPulse sets an atomic in-memory Redis lock via <code style={{ color: '#34d399' }}>SET lock:sku:SKU:PLATFORM 1 EX 15 NX</code> in 
            <strong> &lt;1.8ms</strong> <em>before</em> sending the HTTP dispatch. When the echo webhook returns from the marketplace, it is instantly recognized 
            and dropped in &lt;12ms with zero database contention.
          </p>
        </div>
      </div>

      {/* Live Redis Lock Visualizer */}
      <div style={{ background: 'rgba(0, 0, 0, 0.25)', borderRadius: '12px', padding: '16px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f1f5f9', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Lock size={14} color="#f59e0b" />
            <span>Active In-Memory Lock Registry (Redis / Upstash)</span>
          </span>
          <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
            Auto-expires after 15,000ms TTL
          </span>
        </div>

        {activeLocks.length === 0 ? (
          <div style={{ padding: '24px', textAlign: 'center', color: '#64748b', fontSize: '0.82rem' }}>
            No active locks currently held. Trigger any sync above to observe atomic lock generation and countdown.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {activeLocks.map((lock) => {
              const remainingMs = Math.max(0, lock.expiresAt - now);
              const remainingSec = (remainingMs / 1000).toFixed(1);
              const progressPct = Math.max(0, Math.min(100, (remainingMs / (lock.ttlTotal * 1000)) * 100));

              return (
                <div
                  key={lock.key}
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                    borderRadius: '8px',
                    padding: '12px 14px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span className="badge badge-locked font-mono">{lock.key}</span>
                      <span style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>
                        SKU: <strong>{lock.sku}</strong> &rarr; Target: <strong>{lock.platform}</strong>
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', color: '#f59e0b' }}>
                        <Clock size={13} />
                        <span className="font-mono">{remainingSec}s TTL remaining</span>
                      </div>

                      <button
                        className="btn btn-danger btn-sm"
                        disabled={isProcessing}
                        onClick={() => onTriggerEchoAttack(lock.sku, lock.platform)}
                        style={{ fontSize: '0.72rem', padding: '4px 10px' }}
                      >
                        Fire Echo Webhook Attack
                      </button>
                    </div>
                  </div>

                  {/* Countdown Progress Bar */}
                  <div style={{ width: '100%', height: '4px', background: 'rgba(255, 255, 255, 0.06)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${progressPct}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, #f59e0b, #ef4444)',
                        transition: 'width 0.2s linear',
                      }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
