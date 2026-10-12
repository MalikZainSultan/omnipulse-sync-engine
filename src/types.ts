export type PlatformType = 'SHOPIFY' | 'EBAY' | 'WOOCOMMERCE';

export type SyncStatus = 'SYNCED' | 'PENDING' | 'ERROR' | 'ECHO_LOCKED';

export interface ProductPlatformMapping {
  id: string;
  productId: string;
  storeId: string;
  platform: PlatformType;
  platformItemId: string; // e.g. Shopify variant_id, WooCommerce variation_id, eBay ItemID
  inventoryItemId?: string;
  syncedStock: number;
  syncStatus: SyncStatus;
  lastErrorReason?: string | null;
  lastSyncedAt: string;
}

export interface ProductMaster {
  id: string;
  accountId: string;
  globalSku: string;
  barcode?: string;
  title: string;
  description?: string;
  costPrice?: number;
  sellingPrice: number;
  masterQuantity: number;
  ebayCategoryId?: string;
  brand?: string;
  aspectsJson?: {
    brand?: string;
    mpn?: string;
    color?: string;
    size?: string;
    material?: string;
    [key: string]: string | undefined;
  };
  platformMappings: ProductPlatformMapping[];
  updatedAt: string;
  createdAt: string;
}

export interface SyncLog {
  id: string;
  storeId: string;
  sku: string;
  eventSource: PlatformType;
  action: 'STOCK_DECREMENT' | 'PRICE_UPDATE' | 'ASPECT_CORRECTION' | 'ECHO_LOOP_PREVENTED' | 'INITIAL_SYNC';
  latencyMs: number;
  status: 'SUCCESS' | 'ECHO_SKIPPED' | 'FAILED';
  errorMessage?: string | null;
  createdAt: string;
  details?: {
    previousStock?: number;
    newStock?: number;
    targetsNotified?: PlatformType[];
    resolvedBrand?: string;
    truncatedTitle?: string;
    lockKey?: string;
  };
}

export interface RedisLock {
  key: string;
  sku: string;
  platform: PlatformType;
  createdAt: number;
  ttlTotal: number; // in seconds
  expiresAt: number; // timestamp in ms
}

export interface PipelineStageMilestone {
  stageId: 'event' | 'edge' | 'queue' | 'orchestrator' | 'targets';
  title: string;
  latencyMs: number;
  status: 'pending' | 'running' | 'completed' | 'skipped';
  details: string;
}

export interface ErrorGuidance {
  code: string;
  platform: PlatformType;
  rawError: string;
  englishExplanation: string;
  urduExplanation: string;
  autoFixAvailable: boolean;
  fixActionName: string;
  category: 'ASPECT_MISSING' | 'TITLE_LENGTH' | 'LOCATION_ID' | 'AUTH_FORBIDDEN';
}

export interface CategoryMappingItem {
  id: string;
  shopifyCategory: string;
  ebayCategoryId: string;
  ebayCategoryName: string;
  requiredAspects: {
    name: string;
    mappedSource: string;
    status: 'MAPPED' | 'FALLBACK_AUTO' | 'MISSING';
  }[];
}
