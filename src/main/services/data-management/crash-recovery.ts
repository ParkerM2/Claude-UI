/**
 * Crash Recovery Service — Startup-time cleanup of orphaned artifacts
 *
 * Runs ONCE at app startup to detect and fix artifacts left behind
 * by agent sessions that crashed without proper cleanup:
 * - Orphaned hooks in .claude/settings.local.json
 * - Orphaned progress files (older than 24h)
 * - Orphaned QA directories (older than 7 days)
 */

import {
  existsSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs';
import { join } from 'node:path';

import { createScopedLogger } from '@main/lib/logger';

// ─── Types ────────────────────────────────────────────────────

interface ActiveSessionInfo {
  projectPath: string;
}

export interface CrashRecoveryDeps {
  dataDir: string;
  listProjectPaths: () => string[];
  listActiveSessions: () => ActiveSessionInfo[];
}

export interface CrashRecovery {
  recover: () => { fixed: number; details: string[] };
}

// ─── Constants ────────────────────────────────────────────────

const MS_PER_HOUR = 3_600_000;
const MS_PER_DAY = 24 * MS_PER_HOUR;
const ORPHANED_PROGRESS_AGE_MS = MS_PER_DAY;
const ORPHANED_QA_AGE_MS = 7 * MS_PER_DAY;

const logger = createScopedLogger('recovery');
const UNKNOWN_ERROR = 'Unknown error';

// ─── Helpers ──────────────────────────────────────────────────

/** Normalize a path for cross-platform comparison in hook command strings. */
function normalizePath(p: string): string {
  return p.replaceAll('\\', '/');
}

/** Extract the command string from a hook entry object, if present. */
function getHookCommand(entry: unknown): string | undefined {
  if (typeof entry !== 'object' || entry === null || !('command' in entry)) {
    return undefined;
  }
  const { command } = entry as { command: unknown };
  return typeof command === 'string' ? command : undefined;
}

// ─── Factory ──────────────────────────────────────────────────

export function createCrashRecovery(deps: CrashRecoveryDeps): CrashRecovery {
  const { dataDir, listProjectPaths, listActiveSessions } = deps;

  /** Normalized dataDir for matching inside hook command strings. */
  const normalizedDataDir = normalizePath(dataDir);

  /**
   * Checks whether a hook command string references the ADC data directory.
   */
  function isAdcHookCommand(command: string, normalizedProgressDir: string): boolean {
    return command.includes(normalizedProgressDir) || command.includes(normalizedDataDir);
  }

  /**
   * Checks whether a parsed settings object contains ADC hook markers.
   * ADC hooks reference the progress directory path in their commands.
   */
  function containsAdcHooks(
    settings: Record<string, unknown>,
    progressDir: string,
  ): boolean {
    const { hooks } = settings;
    if (typeof hooks !== 'object' || hooks === null || Array.isArray(hooks)) {
      return false;
    }

    const normalizedProgressDir = normalizePath(progressDir);
    const hooksRecord = hooks as Record<string, unknown>;

    for (const entries of Object.values(hooksRecord)) {
      if (!Array.isArray(entries)) {
        continue;
      }
      for (const entry of entries) {
        const command = getHookCommand(entry);
        if (command !== undefined && isAdcHookCommand(command, normalizedProgressDir)) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Removes ADC hook entries from a parsed settings object.
   * Returns the cleaned settings and whether any non-ADC content remains.
   */
  function removeAdcHookEntries(
    settings: Record<string, unknown>,
    progressDir: string,
  ): { cleaned: Record<string, unknown>; hasOtherContent: boolean } {
    const normalizedProgressDir = normalizePath(progressDir);
    const cleaned = { ...settings };

    const { hooks } = settings;
    if (typeof hooks !== 'object' || hooks === null || Array.isArray(hooks)) {
      return { cleaned, hasOtherContent: Object.keys(settings).length > 0 };
    }

    const hooksRecord = hooks as Record<string, unknown>;
    const cleanedHooks: Record<string, unknown[]> = {};
    let hasRemainingHooks = false;

    for (const [eventName, entries] of Object.entries(hooksRecord)) {
      if (!Array.isArray(entries)) {
        cleanedHooks[eventName] = entries as unknown[];
        hasRemainingHooks = true;
        continue;
      }

      const filtered = entries.filter((entry: unknown) => {
        const command = getHookCommand(entry);
        if (command === undefined) {
          return true;
        }
        // Keep entries that do NOT reference the ADC progress/data directory
        return !isAdcHookCommand(command, normalizedProgressDir);
      });

      if (filtered.length > 0) {
        cleanedHooks[eventName] = filtered;
        hasRemainingHooks = true;
      }
    }

    if (hasRemainingHooks) {
      cleaned.hooks = cleanedHooks;
    } else {
      delete cleaned.hooks;
    }

    // Check if there's other meaningful content beyond hooks
    const otherKeys = Object.keys(cleaned).filter((k) => k !== 'hooks');
    const hasOtherContent = otherKeys.length > 0 || hasRemainingHooks;

    return { cleaned, hasOtherContent };
  }

  /**
   * Recovers orphaned hooks from project .claude/settings.local.json files.
   */
  function recoverOrphanedHooks(details: string[]): number {
    let fixed = 0;
    const progressDir = join(dataDir, 'progress');
    const projectPaths = listProjectPaths();
    const activeSessions = listActiveSessions();
    const activeProjectPaths = new Set(
      activeSessions.map((s) => s.projectPath.toLowerCase()),
    );

    for (const projectPath of projectPaths) {
      try {
        const settingsPath = join(projectPath, '.claude', 'settings.local.json');

        if (!existsSync(settingsPath)) {
          continue;
        }

        const raw = readFileSync(settingsPath, 'utf-8');
        let settings: Record<string, unknown>;

        try {
          settings = JSON.parse(raw) as Record<string, unknown>;
        } catch {
          // Malformed JSON — skip, don't delete user files
          continue;
        }

        if (!containsAdcHooks(settings, progressDir)) {
          continue;
        }

        // Check if any active session uses this project path
        if (activeProjectPaths.has(projectPath.toLowerCase())) {
          continue;
        }

        // Orphaned hooks detected — clean up
        const { cleaned, hasOtherContent } = removeAdcHookEntries(settings, progressDir);

        if (hasOtherContent) {
          // Write back the settings with ADC hooks removed
          writeFileSync(settingsPath, JSON.stringify(cleaned, null, 2), 'utf-8');
          details.push(`Removed orphaned ADC hooks from ${settingsPath}`);
        } else {
          // File only had ADC hooks — delete it
          unlinkSync(settingsPath);
          details.push(`Deleted orphaned hooks file ${settingsPath}`);
        }

        fixed += 1;
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : UNKNOWN_ERROR;
        logger.error(`Failed to recover hooks for ${projectPath}: ${message}`);
      }
    }

    return fixed;
  }

  /**
   * Cleans up orphaned progress files older than 24 hours.
   */
  function recoverOrphanedProgressFiles(details: string[]): number {
    let fixed = 0;
    const progressDir = join(dataDir, 'progress');

    if (!existsSync(progressDir)) {
      return 0;
    }

    const now = Date.now();
    const activeSessions = listActiveSessions();

    try {
      const files = readdirSync(progressDir);

      for (const file of files) {
        if (!file.endsWith('.jsonl') && !file.endsWith('.log')) {
          continue;
        }

        const filePath = join(progressDir, file);

        try {
          // Check if any active session references this file path
          const isActive = activeSessions.some(
            (s) => filePath.toLowerCase().includes(s.projectPath.toLowerCase()),
          );

          if (isActive) {
            continue;
          }

          const fileStat = statSync(filePath);
          const ageMs = now - fileStat.mtimeMs;

          if (ageMs > ORPHANED_PROGRESS_AGE_MS) {
            unlinkSync(filePath);
            details.push(
              `Deleted orphaned progress file ${filePath} (age: ${String(Math.round(ageMs / MS_PER_HOUR))}h)`,
            );
            fixed += 1;
          }
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : UNKNOWN_ERROR;
          logger.error(`Failed to clean progress file ${filePath}: ${message}`);
        }
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : UNKNOWN_ERROR;
      logger.error(`Failed to read progress directory: ${message}`);
    }

    return fixed;
  }

  /**
   * Removes orphaned QA directories older than 7 days.
   */
  function recoverOrphanedQaDirectories(details: string[]): number {
    let fixed = 0;
    const qaDir = join(dataDir, 'qa');

    if (!existsSync(qaDir)) {
      return 0;
    }

    const now = Date.now();

    try {
      const entries = readdirSync(qaDir);

      for (const entry of entries) {
        const entryPath = join(qaDir, entry);

        try {
          const entryStat = statSync(entryPath);

          if (!entryStat.isDirectory()) {
            continue;
          }

          const ageMs = now - entryStat.mtimeMs;

          if (ageMs > ORPHANED_QA_AGE_MS) {
            rmSync(entryPath, { recursive: true });
            details.push(
              `Deleted orphaned QA directory ${entryPath} (age: ${String(Math.round(ageMs / MS_PER_DAY))}d)`,
            );
            fixed += 1;
          }
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : UNKNOWN_ERROR;
          logger.error(`Failed to clean QA directory ${entryPath}: ${message}`);
        }
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : UNKNOWN_ERROR;
      logger.error(`Failed to read QA directory: ${message}`);
    }

    return fixed;
  }

  // ─── Public API ───────────────────────────────────────────────

  return {
    recover() {
      const details: string[] = [];
      let fixed = 0;

      logger.info('Starting startup recovery scan...');

      fixed += recoverOrphanedHooks(details);
      fixed += recoverOrphanedProgressFiles(details);
      fixed += recoverOrphanedQaDirectories(details);

      if (fixed > 0) {
        logger.info(`Recovery complete: ${String(fixed)} items fixed`);
        for (const detail of details) {
          logger.info(`  - ${detail}`);
        }
      } else {
        logger.info('No orphaned artifacts found');
      }

      return { fixed, details };
    },
  };
}
