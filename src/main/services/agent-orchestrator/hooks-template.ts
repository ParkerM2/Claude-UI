/**
 * Hooks Template — Generates Claude hooks config for progress tracking
 *
 * Creates a temporary settings file with PostToolUse and Stop hooks
 * that write progress entries to a per-task JSONL file.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

interface HookEntry {
  command: string;
  timeout: number;
}

interface HooksConfig {
  hooks: {
    PostToolUse: HookEntry[];
    Stop: HookEntry[];
  };
}

interface WriteHooksResult {
  configPath: string;
  originalContent: string | null;
}

/**
 * Generates the content for a Claude hooks settings file.
 *
 * The hooks write JSONL entries to a progress file that the
 * progress watcher monitors for real-time UI updates.
 */
export function generateHooksConfig(taskId: string, progressDir: string): HooksConfig {
  // Normalize path separators for cross-platform compat in the node -e script
  const normalizedDir = progressDir.replaceAll('\\', '/');
  const progressFile = `${normalizedDir}/${taskId}.jsonl`;

  const postToolUseScript = [
    `const fs=require('fs');`,
    `const entry=JSON.stringify({`,
    `type:'tool_use',`,
    `tool:process.env.CLAUDE_TOOL_USE_NAME||'unknown',`,
    `timestamp:new Date().toISOString()`,
    `})+'\\n';`,
    `fs.appendFileSync('${progressFile}',entry);`,
  ].join('');

  const stopScript = [
    `const fs=require('fs');`,
    `const entry=JSON.stringify({`,
    `type:'agent_stopped',`,
    `reason:process.env.CLAUDE_STOP_REASON||'unknown',`,
    `timestamp:new Date().toISOString()`,
    `})+'\\n';`,
    `fs.appendFileSync('${progressFile}',entry);`,
  ].join('');

  return {
    hooks: {
      PostToolUse: [
        {
          command: `node -e "${postToolUseScript}"`,
          timeout: 5000,
        },
      ],
      Stop: [
        {
          command: `node -e "${stopScript}"`,
          timeout: 10_000,
        },
      ],
    },
  };
}

/**
 * Merges hooks config into the project's `.claude/settings.local.json`.
 *
 * Claude CLI only reads hooks from `settings.local.json`, so we merge
 * our progress-tracking hooks into the existing file (if any) and
 * return the original content for later restoration.
 */
export function writeHooksConfig(
  taskId: string,
  projectPath: string,
  progressDir: string,
): WriteHooksResult {
  const config = generateHooksConfig(taskId, progressDir);
  const claudeDir = join(projectPath, '.claude');
  const configPath = join(claudeDir, 'settings.local.json');

  // Ensure directories exist
  mkdirSync(claudeDir, { recursive: true });
  mkdirSync(progressDir, { recursive: true });

  // Read existing settings (if any)
  let originalContent: string | null = null;
  let existingSettings: Record<string, unknown> = {};

  if (existsSync(configPath)) {
    try {
      originalContent = readFileSync(configPath, 'utf-8');
      existingSettings = JSON.parse(originalContent) as Record<string, unknown>;
    } catch {
      // Malformed JSON — start fresh, but still preserve the raw content for backup
      originalContent = readFileSync(configPath, 'utf-8');
      existingSettings = {};
    }
  }

  // Merge hooks into existing settings
  const rawHooks: unknown = existingSettings.hooks;
  const existingHooks = isHooksObject(rawHooks) ? rawHooks : {};

  const mergedHooks: Record<string, HookEntry[]> = { ...existingHooks };

  for (const [eventName, entries] of Object.entries(config.hooks)) {
    const existing: HookEntry[] = Array.isArray(mergedHooks[eventName])
      ? mergedHooks[eventName]
      : [];
    mergedHooks[eventName] = [...existing, ...entries];
  }

  const mergedSettings = {
    ...existingSettings,
    hooks: mergedHooks,
  };

  writeFileSync(configPath, JSON.stringify(mergedSettings, null, 2), 'utf-8');

  return { configPath, originalContent };
}

/** Type guard: checks if a value is a record of hook entry arrays. */
function isHooksObject(value: unknown): value is Record<string, HookEntry[]> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
