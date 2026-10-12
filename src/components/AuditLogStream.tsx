import React, { useState } from 'react';
import type { SyncLog } from '../types';
import { Terminal, ShieldCheck, Download, Trash2, Zap } from 'lucide-react';

interface AuditLogStreamProps {
  logs: SyncLog[];
  onClearLogs: () => void;
}

export const AuditLogStream: React.FC<AuditLogStreamProps> = ({ logs, onClearLogs }) => {
  const [filter, setFilter] = useState<'ALL' | 'SUCCESS' | 'ECHO_SKIPPED'>('ALL');

  const filteredLogs = logs.filter((log) => {
    if (filter === 'SUCCESS') return log.status === 'SUCCESS';
    if (filter === 'ECHO_SKIPPED') return log.status === 'ECHO_SKIPPED';
    return true;
  });

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `omnipulse_sync_audit_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Terminal size={20} color="#10b981" />
            <span>Real-Time Audit Log & Event Stream</span>
          </h2>
          <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '2px' }}>
            Prisma <code style={{ color: '#06b6d4' }}>SyncLog</code> stream with millisecond latency telemetry & loop suppression audit.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', background: 'rgba(255, 255, 255, 0.04)', borderRadius: '6px', padding: '2px' }}>
            {(['ALL', 'SUCCESS', 'ECHO_SKIPPED'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setFilter(mode)}
                style={{
                  background: filter === mode ? 'rgba(99, 102, 241, 0.3)' : 'transparent',
                  color: filter === mode ? '#fff' : '#94a3b8',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '4px 10px',
                  fontSize: '0.72rem',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                {mode === 'ALL' ? 'All Events' : mode === 'SUCCESS' ? 'Success' : 'Echo Shielded'}
              </button>
            ))}
          </div>

          <button
            className="btn btn-secondary btn-sm"
            onClick={handleExportJson}
            title="Download JSON audit log"
            style={{ fontSize: '0.72rem', padding: '4px 8px' }}
          >
            <Download size={13} />
            <span>Export JSON</span>
          </button>

          <button
            className="btn btn-secondary btn-sm"
            onClick={onClearLogs}
            title="Clear current stream"
            style={{ fontSize: '0.72rem', padding: '4px 8px' }}
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* Log Feed */}
      <div
        style={{
          background: 'rgba(0, 0, 0, 0.45)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '10px',
          padding: '14px',
          maxHeight: '320px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          fontFamily: 'var(--font-mono)',
        }}
      >
        {filteredLogs.length === 0 ? (
          <div style={{ padding: '20px', textAlign: 'center', color: '#64748b', fontSize: '0.8rem' }}>
            No logs recorded in this filter view.
          </div>
        ) : (
          filteredLogs.map((log) => {
            const isEcho = log.status === 'ECHO_SKIPPED';
            return (
              <div
                key={log.id}
                style={{
                  background: isEcho ? 'rgba(245, 158, 11, 0.05)' : 'rgba(255, 255, 255, 0.02)',
                  border: `1px solid ${isEcho ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.04)'}`,
                  borderRadius: '6px',
                  padding: '8px 12px',
                  fontSize: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '8px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <span style={{ color: '#64748b', fontSize: '0.7rem' }}>
                    [{log.createdAt}]
                  </span>

                  <span
                    className="badge"
                    style={{
                      background:
                        log.eventSource === 'SHOPIFY'
                          ? 'rgba(0, 128, 96, 0.2)'
                          : log.eventSource === 'EBAY'
                          ? 'rgba(0, 100, 210, 0.2)'
                          : 'rgba(150, 88, 138, 0.2)',
                      color:
                        log.eventSource === 'SHOPIFY'
                          ? '#a3e635'
                          : log.eventSource === 'EBAY'
                          ? '#60a5fa'
                          : '#e879f9',
                    }}
                  >
                    {log.eventSource}
                  </span>

                  <span style={{ color: '#f8fafc', fontWeight: 700 }}>
                    {log.sku}
                  </span>

                  <span
                    style={{
                      color: isEcho ? '#fbbf24' : '#94a3b8',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    {isEcho ? (
                      <>
                        <ShieldCheck size={14} color="#f59e0b" />
                        <span>ECHO_LOOP_NEUTRALIZED (15s Lock Enforced)</span>
                      </>
                    ) : (
                      <span>{log.action}</span>
                    )}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {log.details?.targetsNotified && log.details.targetsNotified.length > 0 && (
                    <span style={{ color: '#64748b', fontSize: '0.7rem' }}>
                      &rarr; Synced to {log.details.targetsNotified.join(', ')}
                    </span>
                  )}

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      color: log.latencyMs < 350 ? '#34d399' : '#fbbf24',
                      fontWeight: 700,
                    }}
                  >
                    <Zap size={12} />
                    <span>{log.latencyMs}ms</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
