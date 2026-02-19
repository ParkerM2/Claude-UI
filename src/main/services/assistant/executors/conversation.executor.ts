/**
 * Conversation executor — handles freeform conversation via Claude CLI.
 */

import { execFile } from 'node:child_process';
import { platform } from 'node:os';

import type { AssistantContext, AssistantResponse } from '@shared/types';

import { serviceLogger } from '@main/lib/logger';

import { buildErrorResponse, buildTextResponse, UNKNOWN_ERROR } from './response-builders';

import type { ClassifiedIntent } from '../intent-classifier';

const CLI_TIMEOUT_MS = 60_000;
const CLI_MAX_BUFFER = 1_048_576; // 1 MB

/** Build a prompt prefix with active project context when available. */
function buildProjectPrefix(context?: AssistantContext): string {
  if (!context?.activeProjectName) {
    return '';
  }

  const parts = [`The user's active project is "${context.activeProjectName}"`];

  // Include path if enriched context provides it
  const enriched = context as unknown as Record<string, unknown>;
  if (typeof enriched.activeProjectPath === 'string') {
    parts.push(`at "${enriched.activeProjectPath}"`);
  }
  if (typeof enriched.activeProjectType === 'string') {
    parts.push(`(type: ${enriched.activeProjectType})`);
  }

  return `Context: ${parts.join(' ')}.\n\n`;
}

function runClaudeCli(prompt: string): Promise<string> {
  return new Promise((resolve, reject) => {
    execFile(
      'claude',
      ['--print', '-p', prompt],
      {
        timeout: CLI_TIMEOUT_MS,
        maxBuffer: CLI_MAX_BUFFER,
        shell: platform() === 'win32',
      },
      (error, stdout, stderr) => {
        if (error) {
          const detail = stderr.trim() || error.message;
          reject(new Error(detail));
          return;
        }
        resolve(stdout.trim());
      },
    );
  });
}

export async function executeConversation(
  intent: ClassifiedIntent,
  context?: AssistantContext,
): Promise<AssistantResponse> {
  try {
    const prefix = buildProjectPrefix(context);
    const prompt = `${prefix}${intent.originalInput}`;
    const response = await runClaudeCli(prompt);
    return buildTextResponse(response);
  } catch (error) {
    const message = error instanceof Error ? error.message : UNKNOWN_ERROR;
    serviceLogger.error('[CommandExecutor] Claude CLI error:', message);
    return buildErrorResponse(`Claude CLI error: ${message}`);
  }
}
