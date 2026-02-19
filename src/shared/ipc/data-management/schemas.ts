/**
 * Data Management IPC Schemas
 *
 * Zod schemas for data store registry, retention policies,
 * usage tracking, cleanup results, and data export/import.
 * Matches the TypeScript types defined in src/shared/types/data-management.ts.
 */

import { z } from 'zod';

/** Lifecycle classification for data stores */
export const DataLifecycleSchema = z.enum([
  'transient',
  'session',
  'short-lived',
  'persistent',
  'synced',
]);

/** Retention policy for a single data store */
export const RetentionPolicySchema = z.object({
  maxAgeDays: z.number().optional(),
  maxItems: z.number().optional(),
  enabled: z.boolean(),
});

/** Metadata for a single data store in the registry */
export const DataStoreEntrySchema = z.object({
  id: z.string(),
  label: z.string(),
  description: z.string(),
  filePath: z.string(),
  isDirectory: z.boolean(),
  lifecycle: DataLifecycleSchema,
  encrypted: z.boolean(),
  hubSynced: z.boolean(),
  defaultRetention: RetentionPolicySchema,
  canClear: z.boolean(),
  canExport: z.boolean(),
  sensitive: z.boolean(),
});

/** Storage usage for a single data store */
export const DataStoreUsageSchema = z.object({
  id: z.string(),
  sizeBytes: z.number(),
  itemCount: z.number(),
  oldestEntry: z.string().optional(),
});

/** User-configured retention overrides */
export const DataRetentionSettingsSchema = z.object({
  autoCleanupEnabled: z.boolean(),
  cleanupIntervalHours: z.number(),
  overrides: z.record(z.string(), RetentionPolicySchema),
  lastCleanupAt: z.string().optional(),
});

/** Export archive metadata */
export const DataExportArchiveSchema = z.object({
  version: z.literal(1),
  exportedAt: z.string(),
  appVersion: z.string(),
  stores: z.record(z.string(), z.unknown()),
});

/** Result of a cleanup operation */
export const CleanupResultSchema = z.object({
  cleaned: z.number(),
  freedBytes: z.number(),
});

/** Result of a data import operation */
export const ImportResultSchema = z.object({
  success: z.boolean(),
  imported: z.number(),
});
