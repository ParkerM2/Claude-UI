/**
 * Security IPC Contract
 *
 * Invoke channels for security settings management and audit export.
 */

import { z } from 'zod';

import { SecurityAuditExportSchema, SecuritySettingsSchema } from './schemas';

/** Invoke channels for security operations */
export const securityInvoke = {
  'security.getSettings': {
    input: z.object({}),
    output: SecuritySettingsSchema,
  },
  'security.updateSettings': {
    input: SecuritySettingsSchema.partial(),
    output: SecuritySettingsSchema,
  },
  'security.exportAudit': {
    input: z.object({}),
    output: SecurityAuditExportSchema,
  },
} as const;
