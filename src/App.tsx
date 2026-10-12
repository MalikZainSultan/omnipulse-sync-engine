import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import type { PlatformType, ProductMaster, SyncLog, RedisLock, PipelineStageMilestone } from './types';
import { INITIAL_PRODUCTS, INITIAL_LOGS } from './lib/initialData';
import { runSimulatedSyncStep, createLock } from './lib/syncEngine';

import { Header } from './components/Header';
import { PipelineVisualizer } from './components/PipelineVisualizer';
import { SimulationCenter } from './components/SimulationCenter';
import { AntiEchoLab } from './components/AntiEchoLab';
import { AspectResolverLab } from './components/AspectResolverLab';
import { ErrorResolverBox } from './components/ErrorResolverBox';
import { CategoryMapper } from './components/CategoryMapper';
import { ProductCatalogGrid } from './components/ProductCatalogGrid';
import { AuditLogStream } from './components/AuditLogStream';
import { MasterPlanModal } from './components/MasterPlanModal';

export const App: React.FC = () => {
  const [products, setProducts] = useState<ProductMaster[]>(INITIAL_PRODUCTS);
  const [logs, setLogs] = useState<SyncLog[]>(INITIAL_LOGS);
  const [activeLocks, setActiveLocks] = useState<RedisLock[]>([
    createLock('APL-MBP-16-M3', 'EBAY', 12),
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeSku, setActiveSku] = useState('APL-MBP-16-M3');
  const [isMasterPlanOpen, setIsMasterPlanOpen] = useState(false);
  const [echoNeutralizedCount, setEchoNeutralizedCount] = useState(3142);
  const [totalSyncedCount, setTotalSyncedCount] = useState(14892);

  // Default Pipeline Milestones
  const [milestones, setMilestones] = useState<PipelineStageMilestone[]>([
    {
      stageId: 'event',
      title: 'Store Event Ingestion',
      latencyMs: 12,
      status: 'completed',
      details: 'Incoming webhook from Shopify (orders/create)',
    },
    {
      stageId: 'edge',
      title: 'Edge Ingestion Layer',
      latencyMs: 28,
      status: 'completed',
      details: 'HMAC signature validated & payload sanitized (<40ms)',
    },
    {
      stageId: 'queue',
      title: 'Redis BullMQ Queue',
      latencyMs: 35,
      status: 'completed',
      details: 'In-memory deduplication hash validated (<80ms)',
    },
    {
      stageId: 'orchestrator',
      title: 'Sync Orchestrator Worker',
      latencyMs: 64,
      status: 'completed',
      details: 'Anti-Echo lock check, Global SKU lookup, Aspect resolution',
    },
    {
      stageId: 'targets',
      title: 'Target Parallel Dispatch',
      latencyMs: 145,
      status: 'completed',
      details: 'Concurrent parallel dispatch: eBay Sell Inventory & WooCommerce',
    },
  ]);

  // Active Timer to expire and refresh Redis TTL progress bars
  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      setActiveLocks((prev) => prev.filter((l) => l.expiresAt > now));
    }, 150);

    return () => clearInterval(timer);
  }, []);

  // Calculate dynamic average latency
  const avgLatency = Math.round(
    logs.reduce((acc, curr) => acc + curr.latencyMs, 0) / (logs.length || 1)
  );

  // Main Event Ingestion & Sync Handler
  const handleTriggerSync = async (
    sku: string,
    source: PlatformType,
    isEchoAttack = false,
    _customTitle?: string,
    _customVendor?: string
  ) => {
    if (isProcessing) return;

    setIsProcessing(true);
    setActiveSku(sku);

    const simulationResult = await runSimulatedSyncStep(
      (newMilestones) => setMilestones(newMilestones),
      sku,
      source,
      isEchoAttack,
      activeLocks
    );

    const nowStr = new Date().toLocaleTimeString();

    if (simulationResult.isEchoBlocked) {
      // Loop neutralized!
      setEchoNeutralizedCount((prev) => prev + 1);

      const echoLog: SyncLog = {
        id: `log-${Date.now()}`,
        storeId: `store-${source.toLowerCase()}-01`,
        sku,
        eventSource: source,
        action: 'ECHO_LOOP_PREVENTED',
        latencyMs: simulationResult.totalLatencyMs,
        status: 'ECHO_SKIPPED',
        errorMessage: null,
        createdAt: nowStr,
        details: {
          lockKey: `lock:sku:${sku}:${source}`,
        },
      };

      setLogs((prev) => [echoLog, ...prev]);

      // Subtle amber confetti
      confetti({
        particleCount: 25,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#f59e0b', '#fbbf24', '#06b6d4'],
      });
    } else {
      // Real sale / sync!
      setTotalSyncedCount((prev) => prev + 1);

      // Decrement stock in catalog
      setProducts((prev) =>
        prev.map((p) => {
          if (p.globalSku === sku && p.masterQuantity > 0) {
            const nextQty = Math.max(0, p.masterQuantity - 1);
            return {
              ...p,
              masterQuantity: nextQty,
              platformMappings: p.platformMappings.map((m) => ({
                ...m,
                syncedStock: nextQty,
                lastSyncedAt: new Date().toISOString(),
              })),
            };
          }
          return p;
        })
      );

      // Create new Redis Locks for target platforms to prevent return echo
      const targetsToLock = simulationResult.targetsNotified;
      const newLocks = targetsToLock.map((t) => createLock(sku, t, 15));
      setActiveLocks((prev) => [...prev, ...newLocks]);

      const successLog: SyncLog = {
        id: `log-${Date.now()}`,
        storeId: `store-${source.toLowerCase()}-01`,
        sku,
        eventSource: source,
        action: 'STOCK_DECREMENT',
        latencyMs: simulationResult.totalLatencyMs,
        status: 'SUCCESS',
        errorMessage: null,
        createdAt: nowStr,
        details: {
          targetsNotified: simulationResult.targetsNotified,
        },
      };

      setLogs((prev) => [successLog, ...prev]);

      // Emerald celebration confetti
      confetti({
        particleCount: 45,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#10b981', '#34d399', '#6366f1'],
      });
    }

    setIsProcessing(false);
  };

  const handleSellUnit = (sku: string, source: PlatformType) => {
    handleTriggerSync(sku, source, false);
  };

  const handleAutoFixTriggered = (_actionName: string) => {
    // Creates a resolution log in real-time
    const fixLog: SyncLog = {
      id: `fix-${Date.now()}`,
      storeId: 'store-eb-01',
      sku: 'APL-MBP-16-M3',
      eventSource: 'EBAY',
      action: 'ASPECT_CORRECTION',
      latencyMs: 142,
      status: 'SUCCESS',
      errorMessage: null,
      createdAt: new Date().toLocaleTimeString(),
      details: {
        resolvedBrand: 'Apple',
      },
    };
    setLogs((prev) => [fixLog, ...prev]);

    confetti({
      particleCount: 30,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#6366f1', '#06b6d4'],
    });
  };

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '24px 20px 60px' }}>
      {/* Telemetry Header */}
      <Header
        onOpenMasterPlan={() => setIsMasterPlanOpen(true)}
        avgLatency={avgLatency}
        totalSyncedCount={totalSyncedCount}
        echoNeutralizedCount={echoNeutralizedCount}
        activeLockCount={activeLocks.length}
      />

      {/* Main 5-Stage Live Pipeline Architecture */}
      <PipelineVisualizer
        milestones={milestones}
        isProcessing={isProcessing}
        activeSku={activeSku}
      />

      {/* Webhook Ingestion & Simulation Center */}
      <SimulationCenter
        products={products}
        isProcessing={isProcessing}
        onTriggerSync={handleTriggerSync}
      />

      {/* CedCommerce Pain-Point Killer #2: Anti-Echo Engine Lab */}
      <AntiEchoLab
        activeLocks={activeLocks}
        onTriggerEchoAttack={(sku, platform) => handleTriggerSync(sku, platform, true)}
        isProcessing={isProcessing}
      />

      {/* CedCommerce Pain-Point Killer #1: Smart Aspect & Brand Auto-Resolver */}
      <AspectResolverLab />

      {/* CedCommerce Pain-Point Killer #3: Bilingual Error Resolver */}
      <ErrorResolverBox onAutoFixTriggered={handleAutoFixTriggered} />

      {/* Phase 4: Visual Category & Aspect Taxonomy Mapper */}
      <CategoryMapper />

      {/* Central Product Master & Multi-Store Inventory Grid */}
      <ProductCatalogGrid
        products={products}
        isProcessing={isProcessing}
        onSellUnit={handleSellUnit}
      />

      {/* Real-time Audit Stream */}
      <AuditLogStream logs={logs} onClearLogs={() => setLogs([])} />

      {/* Technical Blueprint & Prisma Schema Modal */}
      <MasterPlanModal
        isOpen={isMasterPlanOpen}
        onClose={() => setIsMasterPlanOpen(false)}
      />
    </div>
  );
};

export default App;
