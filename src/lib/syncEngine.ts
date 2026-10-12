import type { PlatformType, RedisLock, PipelineStageMilestone } from '../types';

export interface ResolutionResult {
  brand: string;
  source: 'VENDOR' | 'TITLE_REGEX' | 'FALLBACK';
  ruleStep: number;
  explanation: string;
}

/**
 * CEDCOMMERCE PAIN-POINT KILLER #1:
 * Smart Aspect & Brand Auto-Resolver Waterfall
 */
export function resolveBrand(
  vendorTag: string | null | undefined,
  title: string,
  userDefaultBrand = 'Unbranded Store'
): ResolutionResult {
  // Step 1: Shopify Vendor tag check
  if (vendorTag && vendorTag.trim().length > 0 && vendorTag.toLowerCase() !== 'unknown' && vendorTag.toLowerCase() !== 'n/a') {
    return {
      brand: vendorTag.trim(),
      source: 'VENDOR',
      ruleStep: 1,
      explanation: `Step 1 Passed: Detected direct Shopify vendor attribute "${vendorTag.trim()}"`,
    };
  }

  // Step 2: Algorithmic Regex brand extraction from Product Title
  // Captures common leading brand syntax (e.g., "Apple MacBook", "Sony WH-1000XM5", "Nike Air Max", "Logitech MX")
  const brandRegex = /^([A-Z0-9][A-Za-z0-9&'\.\-]+(?:\s+[A-Za-z0-9&'\.\-]+)?)/;
  const match = title.trim().match(brandRegex);
  if (match && match[1] && match[1].length >= 2 && match[1].length <= 25) {
    const candidate = match[1].trim();
    // Exclude generic descriptor words
    const genericWords = ['NEW', 'ORIGINAL', 'AUTHENTIC', 'HOT', 'PREMIUM', 'SALE', 'REFURBISHED'];
    if (!genericWords.includes(candidate.toUpperCase())) {
      return {
        brand: candidate,
        source: 'TITLE_REGEX',
        ruleStep: 2,
        explanation: `Step 2 Regex Match: Extracted leading brand signature "${candidate}" from product title`,
      };
    }
  }

  // Step 3: Account-level Fallback
  return {
    brand: userDefaultBrand,
    source: 'FALLBACK',
    ruleStep: 3,
    explanation: `Step 3 Fallback Applied: Used account safe default "${userDefaultBrand}" to prevent eBay 21919301 rejection`,
  };
}

/**
 * CEDCOMMERCE PAIN-POINT KILLER #1 (Part B):
 * Algorithmic Word-Boundary Title Truncator (eBay 80-Char Safe Mode)
 * Never truncates mid-word, preserving trailing keywords and punctuation safety.
 */
export function truncateTitleForEbay(title: string, maxLength = 80): {
  original: string;
  truncated: string;
  isTruncated: boolean;
  charCount: number;
  naiveTruncated: string;
} {
  const clean = title.replace(/\s+/g, ' ').trim();
  const naive = clean.slice(0, maxLength);

  if (clean.length <= maxLength) {
    return {
      original: clean,
      truncated: clean,
      isTruncated: false,
      charCount: clean.length,
      naiveTruncated: clean,
    };
  }

  const sub = clean.slice(0, maxLength);
  const lastSpace = sub.lastIndexOf(' ');

  let safe = sub;
  if (lastSpace > 0) {
    safe = sub.slice(0, lastSpace).trim();
  }

  // Clean trailing punctuation
  safe = safe.replace(/[,;:\-\s]+$/, '');

  return {
    original: clean,
    truncated: safe,
    isTruncated: true,
    charCount: safe.length,
    naiveTruncated: naive,
  };
}

/**
 * CEDCOMMERCE PAIN-POINT KILLER #2:
 * Anti-Echo Engine (Infinite Loop Prevention)
 */
export function checkIsEcho(
  locks: RedisLock[],
  sku: string,
  platform: PlatformType
): { isEcho: boolean; activeLock?: RedisLock } {
  const now = Date.now();
  const lockKey = `lock:sku:${sku}:${platform}`;
  const activeLock = locks.find((l) => l.key === lockKey && l.expiresAt > now);

  return {
    isEcho: !!activeLock,
    activeLock,
  };
}

export function createLock(
  sku: string,
  platform: PlatformType,
  ttlSeconds = 15
): RedisLock {
  const now = Date.now();
  return {
    key: `lock:sku:${sku}:${platform}`,
    sku,
    platform,
    createdAt: now,
    ttlTotal: ttlSeconds,
    expiresAt: now + ttlSeconds * 1000,
  };
}

/**
 * Simulates the Sub-Second Sync Engine pipeline execution
 */
export async function runSimulatedSyncStep(
  onProgress: (milestones: PipelineStageMilestone[]) => void,
  sku: string,
  eventSource: PlatformType,
  isEchoScenario: boolean,
  currentLocks: RedisLock[]
): Promise<{
  totalLatencyMs: number;
  isEchoBlocked: boolean;
  milestones: PipelineStageMilestone[];
  targetsNotified: PlatformType[];
}> {
  const allPlatforms: PlatformType[] = ['SHOPIFY', 'EBAY', 'WOOCOMMERCE'];
  const targetPlatforms = allPlatforms.filter((p) => p !== eventSource);

  const milestones: PipelineStageMilestone[] = [
    {
      stageId: 'event',
      title: 'Store Event Ingestion',
      latencyMs: 12,
      status: 'running',
      details: `Incoming webhook from ${eventSource} (SKU: ${sku})`,
    },
    {
      stageId: 'edge',
      title: 'Edge Ingestion Layer',
      latencyMs: 28,
      status: 'pending',
      details: 'HMAC signature validated & payload sanitized (<40ms)',
    },
    {
      stageId: 'queue',
      title: 'Redis BullMQ Queue',
      latencyMs: 35,
      status: 'pending',
      details: 'Job queued with in-memory deduplication hash',
    },
    {
      stageId: 'orchestrator',
      title: 'Sync Orchestrator Worker',
      latencyMs: 64,
      status: 'pending',
      details: 'Anti-Echo lock check, Global SKU lookup, Aspect resolution',
    },
    {
      stageId: 'targets',
      title: 'Target Parallel Dispatch',
      latencyMs: 145,
      status: 'pending',
      details: `Concurrent dispatch to: ${targetPlatforms.join(', ')}`,
    },
  ];

  // Stage 1: Store Event
  onProgress([...milestones]);
  await new Promise((r) => setTimeout(r, 60));
  milestones[0].status = 'completed';
  milestones[1].status = 'running';
  onProgress([...milestones]);

  // Stage 2: Edge Ingestion
  await new Promise((r) => setTimeout(r, 70));
  milestones[1].status = 'completed';
  milestones[2].status = 'running';
  onProgress([...milestones]);

  // Stage 3: Queue Layer
  await new Promise((r) => setTimeout(r, 80));
  milestones[2].status = 'completed';
  milestones[3].status = 'running';
  onProgress([...milestones]);

  // Stage 4: Orchestrator & Loop Prevention
  await new Promise((r) => setTimeout(r, 90));
  const echoCheck = checkIsEcho(currentLocks, sku, eventSource);

  if (isEchoScenario || echoCheck.isEcho) {
    milestones[3].status = 'completed';
    milestones[3].details = `🛑 Anti-Echo lock active (Key: lock:sku:${sku}:${eventSource}). Webhook recognized as loop echo & safely neutralised!`;
    milestones[4].status = 'skipped';
    milestones[4].details = 'Skipped to prevent zeroing master inventory';
    onProgress([...milestones]);

    return {
      totalLatencyMs: 12 + 28 + 35 + 24, // ~99ms
      isEchoBlocked: true,
      milestones,
      targetsNotified: [],
    };
  }

  milestones[3].status = 'completed';
  milestones[4].status = 'running';
  onProgress([...milestones]);

  // Stage 5: Concurrent Parallel Dispatches
  await new Promise((r) => setTimeout(r, 110));
  milestones[4].status = 'completed';
  milestones[4].details = `Parallel dispatches confirmed: Shopify GraphQL (${Math.floor(Math.random() * 20) + 75}ms), eBay Sell Inventory (${Math.floor(Math.random() * 25) + 110}ms), WooCommerce REST (${Math.floor(Math.random() * 20) + 95}ms)`;
  onProgress([...milestones]);

  const total = 12 + 28 + 35 + 64 + (Math.floor(Math.random() * 30) + 130);

  return {
    totalLatencyMs: total,
    isEchoBlocked: false,
    milestones,
    targetsNotified: targetPlatforms,
  };
}
