/**
 * Assistant Service — Persistent AI Assistant
 *
 * Processes natural language commands through intent classification
 * and routes them to the appropriate MCP server or internal service.
 * Manages command history and emits events for streaming responses.
 */

import { randomUUID } from 'node:crypto';

import type { AssistantResponse, CommandHistoryEntry } from '@shared/types';

import type { McpManager } from '@main/mcp/mcp-manager';

import { createCommandExecutor } from './command-executor';
import { createHistoryStore } from './history-store';
import { classifyIntent } from './intent-classifier';

import type { CommandExecutor } from './command-executor';
import type { HistoryStore } from './history-store';
import type { IpcRouter } from '../../ipc/router';

export interface AssistantService {
  /** Process a user command (async — may call MCP tools or APIs). */
  sendCommand: (input: string, context?: string) => Promise<AssistantResponse>;
  /** Get command history entries, newest first. Sync. */
  getHistory: (limit?: number) => CommandHistoryEntry[];
  /** Clear all command history. */
  clearHistory: () => void;
}

export interface AssistantServiceDeps {
  router: IpcRouter;
  mcpManager: McpManager;
}

export function createAssistantService(deps: AssistantServiceDeps): AssistantService {
  const { router, mcpManager } = deps;
  const history: HistoryStore = createHistoryStore();
  const executor: CommandExecutor = createCommandExecutor({ mcpManager });

  return {
    async sendCommand(input, _context) {
      const trimmedInput = input.trim();
      if (trimmedInput.length === 0) {
        return {
          type: 'error',
          content: 'Empty command',
        };
      }

      // Emit thinking state
      router.emit('event:assistant.thinking', { isThinking: true });

      try {
        // Classify the intent
        const intent = classifyIntent(trimmedInput);
        console.log(
          `[Assistant] Classified "${trimmedInput}" as ${intent.type}/${intent.subtype ?? 'none'} (confidence: ${String(intent.confidence)})`,
        );

        // Execute the command
        const response = await executor.execute(intent);

        // Log to history
        const entry: CommandHistoryEntry = {
          id: randomUUID(),
          input: trimmedInput,
          intent: intent.type,
          responseSummary: response.content.slice(0, 200),
          timestamp: new Date().toISOString(),
        };
        history.addEntry(entry);

        // Emit the response event
        router.emit('event:assistant.response', {
          content: response.content,
          type: response.type,
        });

        return response;
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.error('[Assistant] Command processing failed:', message);

        const errorResponse: AssistantResponse = {
          type: 'error',
          content: `Something went wrong: ${message}`,
        };

        router.emit('event:assistant.response', {
          content: errorResponse.content,
          type: 'error',
        });

        return errorResponse;
      } finally {
        router.emit('event:assistant.thinking', { isThinking: false });
      }
    },

    getHistory(limit) {
      return history.getEntries(limit);
    },

    clearHistory() {
      history.clear();
    },
  };
}
