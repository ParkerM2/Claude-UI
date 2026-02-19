/**
 * Data Management IPC Contract
 *
 * Defines invoke channels for data store registry, retention settings,
 * cleanup operations, and data export/import. Also defines event
 * channels for cleanup completion notifications.
 */

import { z } from 'zod';

import { SuccessResponseSchema } from '../common/schemas';

import {
  CleanupResultSchema,
  DataRetentionSettingsSchema,
  DataStoreEntrySchema,
  DataStoreUsageSchema,
  ImportResultSchema,
} from './schemas';

// ─── Invoke Channels ──────────────────────────────────────────

export const dataManagementInvoke = {
  'dataManagement.getRegistry': {
    input: z.object({}),
    output: z.array(DataStoreEntrySchema),
  },
  'dataManagement.getUsage': {
    input: z.object({}),
    output: z.array(DataStoreUsageSchema),
  },
  'dataManagement.getRetention': {
    input: z.object({}),
    output: DataRetentionSettingsSchema,
  },
  'dataManagement.updateRetention': {
    input: DataRetentionSettingsSchema.partial(),
    output: DataRetentionSettingsSchema,
  },
  'dataManagement.clearStore': {
    input: z.object({ storeId: z.string() }),
    output: SuccessResponseSchema,
  },
  'dataManagement.runCleanup': {
    input: z.object({}),
    output: CleanupResultSchema,
  },
  'dataManagement.exportData': {
    input: z.object({}),
    output: z.object({ filePath: z.string() }),
  },
  'dataManagement.importData': {
    input: z.object({ filePath: z.string() }),
    output: ImportResultSchema,
  },
} as const;

// ─── Event Channels ───────────────────────────────────────────

export const dataManagementEvents = {
  'event:dataManagement.cleanupComplete': {
    payload: CleanupResultSchema,
  },
} as const;
