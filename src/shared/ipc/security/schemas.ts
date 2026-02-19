/**
 * Security IPC Schemas
 *
 * Zod schemas for security settings and audit export.
 */

import { z } from 'zod';

export const SecurityModeSchema = z.enum(['sandboxed', 'unrestricted']);

export const CspModeSchema = z.enum(['strict', 'relaxed']);

export const SecuritySettingsSchema = z.object({
  envMode: SecurityModeSchema,
  envBlocklist: z.array(z.string()),
  envAlwaysPass: z.array(z.string()),
  cspMode: CspModeSchema,
  ipcAllowlistEnabled: z.boolean(),
  ipcThrottlingEnabled: z.boolean(),
  workdirRestricted: z.boolean(),
  defaultSpawnFlags: z.string(),
});

export const SecurityAuditExportSchema = z.object({
  exportedAt: z.string(),
  settings: SecuritySettingsSchema,
  ipcChannelCount: z.number(),
  activeAgentCount: z.number(),
});
