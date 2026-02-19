/**
 * Data Management types
 *
 * Types for the data management audit feature: storage registry,
 * retention policies, usage tracking, and data export/import.
 */

/** Lifecycle classification for data stores */
export type DataLifecycle = 'transient' | 'session' | 'short-lived' | 'persistent' | 'synced';

/** Retention policy for a single data store */
export interface RetentionPolicy {
  maxAgeDays?: number;
  maxItems?: number;
  enabled: boolean;
}

/** Metadata for a single data store in the registry */
export interface DataStoreEntry {
  id: string;
  label: string;
  description: string;
  filePath: string;
  isDirectory: boolean;
  lifecycle: DataLifecycle;
  encrypted: boolean;
  hubSynced: boolean;
  defaultRetention: RetentionPolicy;
  canClear: boolean;
  canExport: boolean;
  sensitive: boolean;
}

/** Storage usage for a single data store */
export interface DataStoreUsage {
  id: string;
  sizeBytes: number;
  itemCount: number;
  oldestEntry?: string;
}

/** User-configured retention overrides (stored in AppSettings) */
export interface DataRetentionSettings {
  autoCleanupEnabled: boolean;
  cleanupIntervalHours: number;
  overrides: Record<string, RetentionPolicy>;
  lastCleanupAt?: string;
}

/** Export archive metadata */
export interface DataExportArchive {
  version: 1;
  exportedAt: string;
  appVersion: string;
  stores: Record<string, unknown>;
}
