import React, { useState } from 'react';
import { X, Copy, Check, FileCode, CheckCircle2, Zap } from 'lucide-react';

interface MasterPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MasterPlanModal: React.FC<MasterPlanModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const prismaSchemaCode = `datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// User & Account Management
model Account {
  id              String         @id @default(uuid())
  email           String         @unique
  organization    String
  plan            String         @default("PRO") // STARTER, PRO, ENTERPRISE
  stores          Store[]
  productMasters  ProductMaster[]
  createdAt       DateTime       @default(now())
}

// Connected Marketplaces (Shopify, eBay, WooCommerce)
model Store {
  id              String         @id @default(uuid())
  accountId       String
  account         Account        @relation(fields: [accountId], references: [id], onDelete: Cascade)
  platform        PlatformType   // SHOPIFY, EBAY, WOOCOMMERCE
  storeName       String
  storeDomain     String
  isMasterSource  Boolean        @default(false)
  
  // Auth & API Credentials (Encrypted)
  accessToken     String
  refreshToken    String?
  apiSecret       String?
  webhookSecret   String?
  
  mappings        ProductPlatformMapping[]
  syncLogs        SyncLog[]
  createdAt       DateTime       @default(now())
}

enum PlatformType {
  SHOPIFY
  EBAY
  WOOCOMMERCE
}

// Central Product Registry (Single Source of Truth)
model ProductMaster {
  id              String         @id @default(uuid())
  accountId       String
  account         Account        @relation(fields: [accountId], references: [id], onDelete: Cascade)
  globalSku       String         @unique
  barcode         String?        // UPC / EAN / GTIN
  title           String
  description     String?
  costPrice       Float?
  sellingPrice    Float
  masterQuantity  Int            @default(0)
  
  // Category & Aspects
  ebayCategoryId  String?
  brand           String?
  aspectsJson     Json?          // Dynamic attributes: Color, Size, MPN, Material
  
  platformMappings ProductPlatformMapping[]
  updatedAt       DateTime       @updatedAt
  createdAt       DateTime       @default(now())

  @@index([accountId, globalSku])
}

// Mapping Table between Master SKU and Specific Marketplace IDs
model ProductPlatformMapping {
  id              String         @id @default(uuid())
  productId       String
  product         ProductMaster  @relation(fields: [productId], references: [id], onDelete: Cascade)
  storeId         String
  store           Store          @relation(fields: [storeId], references: [id], onDelete: Cascade)
  
  // Platform specific keys
  platformItemId  String         // Shopify variant_id, WooCommerce variation_id, eBay ItemID
  inventoryItemId String?        // Shopify inventory_item_id
  syncedStock     Int            @default(0)
  syncStatus      SyncStatus     @default(SYNCED)
  lastErrorReason String?
  lastSyncedAt    DateTime       @default(now())

  @@unique([storeId, platformItemId])
  @@index([productId])
}

enum SyncStatus {
  SYNCED
  PENDING
  ERROR
}

// Real-Time Event & Audit Log Stream
model SyncLog {
  id              String         @id @default(uuid())
  storeId         String
  store           Store          @relation(fields: [storeId], references: [id], onDelete: Cascade)
  sku             String
  eventSource     PlatformType
  action          String         // STOCK_DECREMENT, PRICE_UPDATE, ASPECT_CORRECTION
  latencyMs       Int
  status          String         // SUCCESS, FAILED
  errorMessage    String?
  createdAt       DateTime       @default(now())

  @@index([storeId, createdAt])
}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(prismaSchemaCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(8px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '860px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#0d101a',
          border: '1px solid rgba(99, 102, 241, 0.4)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '18px 24px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FileCode size={20} color="#818cf8" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc' }}>
              OmniPulse Technical Master Plan & Schema Blueprint
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '4px',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div style={{ padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Section 1: Architecture Highlights */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#38bdf8', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Zap size={16} /> 1. Sub-Second Pipeline Milestones
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase' }}>Ingestion</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f8fafc' }}>Next.js Edge</div>
                <div className="font-mono" style={{ fontSize: '0.75rem', color: '#10b981' }}>&lt;40ms</div>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase' }}>Queue & Dedupe</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f8fafc' }}>Redis BullMQ</div>
                <div className="font-mono" style={{ fontSize: '0.75rem', color: '#10b981' }}>&lt;80ms</div>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase' }}>Worker Core</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f8fafc' }}>Anti-Echo + Aspects</div>
                <div className="font-mono" style={{ fontSize: '0.75rem', color: '#10b981' }}>&lt;70ms</div>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase' }}>Total Sync Cycle</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f8fafc' }}>Target Marketplaces</div>
                <div className="font-mono" style={{ fontSize: '0.75rem', color: '#06b6d4' }}>250ms – 450ms</div>
              </div>
            </div>
          </div>

          {/* Section 2: Prisma Schema */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#818cf8' }}>
                2. Database Schema (Prisma / PostgreSQL)
              </h4>
              <button
                className="btn btn-secondary btn-sm"
                onClick={handleCopy}
                style={{ fontSize: '0.74rem', padding: '4px 10px', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                {copied ? <Check size={13} color="#10b981" /> : <Copy size={13} />}
                <span>{copied ? 'Copied to Clipboard' : 'Copy Schema'}</span>
              </button>
            </div>
            <pre
              style={{
                background: 'rgba(0, 0, 0, 0.5)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '8px',
                padding: '16px',
                fontSize: '0.75rem',
                fontFamily: 'var(--font-mono)',
                color: '#e2e8f0',
                maxHeight: '260px',
                overflowY: 'auto',
                lineHeight: '1.45',
              }}
            >
              {prismaSchemaCode}
            </pre>
          </div>

          {/* Section 3: Phase 1 - Phase 4 Milestones */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#34d399', marginBottom: '10px' }}>
              3. Execution Roadmap Milestones
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.8rem', color: '#cbd5e1' }}>
                <CheckCircle2 size={16} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong>Phase 1: Engine Foundation & Database</strong> &mdash; PostgreSQL Prisma schema, Next.js 15 App router dashboard, Redis (Upstash) setup.
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.8rem', color: '#cbd5e1' }}>
                <CheckCircle2 size={16} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong>Phase 2: Marketplace Handshakes</strong> &mdash; Shopify App Bridge OAuth, eBay Sell Inventory API, WooCommerce REST keys.
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.8rem', color: '#cbd5e1' }}>
                <CheckCircle2 size={16} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong>Phase 3: The Sub-Second Sync Engine</strong> &mdash; Webhook ingestion routes, BullMQ parallel worker dispatches, Anti-Echo engine.
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.8rem', color: '#cbd5e1' }}>
                <CheckCircle2 size={16} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong>Phase 4: Category Mapping & Error Resolver</strong> &mdash; Visual taxonomy mapper, Urdu/English guidance translator, Real-time WebSockets.
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
