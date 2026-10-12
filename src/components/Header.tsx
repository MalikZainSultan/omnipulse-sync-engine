import React from 'react';
import { Activity, Zap, ShieldCheck, Database, FileText, CheckCircle2 } from 'lucide-react';

interface HeaderProps {
  onOpenMasterPlan: () => void;
  avgLatency: number;
  totalSyncedCount: number;
  echoNeutralizedCount: number;
  activeLockCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenMasterPlan,
  avgLatency,
  totalSyncedCount,
  echoNeutralizedCount,
  activeLockCount,
}) => {
  return (
    <header className="glass-panel" style={{ padding: '18px 24px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        
        {/* Brand & Live Pulse */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)',
            }}
          >
            <Activity size={24} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#fff' }}>
                OmniPulse
              </h1>
              <span className="badge" style={{ background: 'rgba(99, 102, 241, 0.2)', color: '#818cf8', borderColor: 'rgba(99, 102, 241, 0.4)' }}>
                Sync Engine v1.0
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#10b981', fontWeight: 600 }}>
                <span className="live-dot"></span>
                <span>Active</span>
              </div>
            </div>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '2px' }}>
              CedCommerce-Killer Architecture • Sub-Second Multi-Channel Sync Pipeline
            </p>
          </div>
        </div>

        {/* Telemetry KPIs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          {/* OmniPulse vs CedCommerce Benchmark */}
          <div
            style={{
              background: 'rgba(6, 182, 212, 0.08)',
              border: '1px solid rgba(6, 182, 212, 0.25)',
              borderRadius: '10px',
              padding: '6px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <Zap size={18} color="#06b6d4" />
            <div>
              <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#06b6d4', fontWeight: 700 }}>
                Average Latency
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                <span className="font-mono">{avgLatency}ms</span>
                <span style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 700 }}>
                  (65x vs CedCommerce ~18.4s)
                </span>
              </div>
            </div>
          </div>

          {/* Total Synced KPI */}
          <div
            style={{
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              borderRadius: '10px',
              padding: '6px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <Activity size={18} color="#10b981" />
            <div>
              <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#10b981', fontWeight: 700 }}>
                Events Ingested
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc' }} className="font-mono">
                {totalSyncedCount.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Anti-Echo Shield Counter */}
          <div
            style={{
              background: 'rgba(245, 158, 11, 0.08)',
              border: '1px solid rgba(245, 158, 11, 0.25)',
              borderRadius: '10px',
              padding: '6px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <ShieldCheck size={18} color="#f59e0b" />
            <div>
              <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#f59e0b', fontWeight: 700 }}>
                Loops Neutralized
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc' }} className="font-mono">
                {echoNeutralizedCount}
                <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 400, marginLeft: '6px' }}>
                  ({activeLockCount} active locks)
                </span>
              </div>
            </div>
          </div>

          {/* Master Plan Trigger Button */}
          <button
            className="btn btn-secondary"
            onClick={onOpenMasterPlan}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <FileText size={16} color="#818cf8" />
            <span>Master Plan Docs</span>
          </button>
        </div>

      </div>

      {/* Connected Channels Status Bar */}
      <div
        style={{
          marginTop: '16px',
          paddingTop: '12px',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          fontSize: '0.8rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <span style={{ color: '#64748b', fontWeight: 600 }}>Active Channels:</span>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#96bf48' }}></span>
            <span style={{ color: '#e2e8f0', fontWeight: 600 }}>Shopify GraphQL</span>
            <span style={{ color: '#64748b', fontSize: '0.72rem' }}>• 2024-04 API</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#0064d2' }}></span>
            <span style={{ color: '#e2e8f0', fontWeight: 600 }}>eBay Sell Inventory</span>
            <span style={{ color: '#64748b', fontSize: '0.72rem' }}>• OAuth 2.0</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#96588a' }}></span>
            <span style={{ color: '#e2e8f0', fontWeight: 600 }}>WooCommerce Batch REST</span>
            <span style={{ color: '#64748b', fontSize: '0.72rem' }}>• v3 Endpoints</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', color: '#94a3b8' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Database size={14} color="#6366f1" />
            <span>Prisma PostgreSQL (Indexed)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <CheckCircle2 size={14} color="#10b981" />
            <span>BullMQ Workers (4 Concurrency)</span>
          </div>
        </div>
      </div>
    </header>
  );
};
