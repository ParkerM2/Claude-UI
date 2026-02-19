/**
 * Data Management IPC — Barrel Export
 *
 * Re-exports all data-management-related schemas and contract definitions.
 */

export {
  CleanupResultSchema,
  DataExportArchiveSchema,
  DataLifecycleSchema,
  DataRetentionSettingsSchema,
  DataStoreEntrySchema,
  DataStoreUsageSchema,
  ImportResultSchema,
  RetentionPolicySchema,
} from './schemas';

export { dataManagementEvents, dataManagementInvoke } from './contract';
