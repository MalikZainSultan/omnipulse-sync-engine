import type { PipelineStageMilestone } from '../types';
import { ShieldAlert, CheckCircle, RefreshCw } from 'lucide-react';

interface PipelineVisualizerProps {
  milestones: PipelineStageMilestone[];
  isProcessing: boolean;
  activeSku: string;
}

export const PipelineVisualizer: React.FC<PipelineVisualizerProps> = ({
  milestones,
  isProcessing,
  activeSku,
}) => {
  const getStageColor = (status: PipelineStageMilestone['status']) => {
    switch (status) {
      case 'running':
        return '#06b6d4'; // Cyan
      case 'completed':
        return '#10b981'; // Emerald
      case 'skipped':
        return '#f59e0b'; // Amber for Echo skip
      default:
        return 'rgba(255, 255, 255, 0.2)';
    }
  };

  return (
    <section className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>Live High-Speed Pipeline Architecture</span>
            {isProcessing && (
              <span className="badge" style={{ background: 'rgba(6, 182, 212, 0.2)', color: '#06b6d4', borderColor: 'rgba(6, 182, 212, 0.4)' }}>
                <RefreshCw size={12} className="animate-spin" /> In Flight ({activeSku})
              </span>
            )}
          </h2>
          <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '2px' }}>
            Event-driven sub-second micro-pipeline architecture (Total Target: 250ms – 450ms)
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.75rem', color: '#94a3b8' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></span>
            <span>Completed</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#06b6d4' }}></span>
            <span>Executing</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b' }}></span>
            <span>Echo Skipped</span>
          </div>
        </div>
      </div>

      {/* Pipeline 5-Stage Diagram */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '14px',
          alignItems: 'stretch',
          position: 'relative',
        }}
      >
        {milestones.map((stage, index) => {
          const color = getStageColor(stage.status);
          const isCurrent = stage.status === 'running';

          return (
            <div
              key={stage.stageId}
              style={{
                background: isCurrent ? 'rgba(6, 182, 212, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                border: `1px solid ${isCurrent ? 'rgba(6, 182, 212, 0.6)' : color === '#10b981' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(255, 255, 255, 0.07)'}`,
                borderRadius: '12px',
                padding: '16px',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: isCurrent ? '0 0 20px rgba(6, 182, 212, 0.25)' : 'none',
                transition: 'all 0.3s ease',
              }}
            >
              <div>
                {/* Stage Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        color: color,
                        background: 'rgba(255, 255, 255, 0.05)',
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {index + 1}
                    </span>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f1f5f9' }}>
                      {stage.title}
                    </span>
                  </div>

                  {stage.status === 'completed' && <CheckCircle size={16} color="#10b981" />}
                  {stage.status === 'running' && <RefreshCw size={16} color="#06b6d4" className="animate-spin" />}
                  {stage.status === 'skipped' && <ShieldAlert size={16} color="#f59e0b" />}
                </div>

                {/* Details */}
                <p style={{ fontSize: '0.75rem', color: '#94a3b8', lineHeight: '1.4', marginBottom: '12px' }}>
                  {stage.details}
                </p>
              </div>

              {/* Sub-components for Stage 4 (Sync Orchestrator Worker Engine) */}
              {stage.stageId === 'orchestrator' && (
                <div
                  style={{
                    background: 'rgba(0, 0, 0, 0.25)',
                    borderRadius: '8px',
                    padding: '8px 10px',
                    marginBottom: '10px',
                    fontSize: '0.7rem',
                    color: '#cbd5e1',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                  }}
                >
                  <div style={{ color: '#06b6d4', fontWeight: 600 }}>Sync Worker Engine Sub-Steps:</div>
                  <div>• 1. Loop Prevention (Cache Lock)</div>
                  <div>• 2. Global SKU Mapping Lookup</div>
                  <div>• 3. Aspect & Taxonomy Resolution</div>
                  <div>• 4. Concurrent Parallel Dispatch</div>
                </div>
              )}

              {/* Latency Footer */}
              <div
                style={{
                  paddingTop: '8px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.72rem',
                }}
              >
                <span style={{ color: '#64748b' }}>Estimated Latency:</span>
                <span className="font-mono" style={{ color: color, fontWeight: 700 }}>
                  {stage.status === 'skipped' ? 'Neutralized' : `<${stage.latencyMs}ms`}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
