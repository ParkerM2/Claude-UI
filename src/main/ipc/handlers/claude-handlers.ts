/**
 * Claude SDK IPC handlers
 *
 * Registers handlers for Claude SDK operations including
 * conversation management and message sending.
 */

import type { ClaudeClient } from '../../services/claude';
import type { IpcRouter } from '../router';

export function registerClaudeHandlers(router: IpcRouter, claudeClient: ClaudeClient): void {
  // Check if Claude is configured
  router.handle('claude.isConfigured', () =>
    Promise.resolve({ configured: claudeClient.isConfigured() }),
  );

  // Create a new conversation
  router.handle('claude.createConversation', ({ title }) =>
    Promise.resolve({ conversationId: claudeClient.createConversation(title) }),
  );

  // List all conversations
  router.handle('claude.listConversations', () =>
    Promise.resolve(claudeClient.listConversations()),
  );

  // Get messages from a conversation
  router.handle('claude.getMessages', ({ conversationId }) =>
    Promise.resolve(claudeClient.getMessages(conversationId)),
  );

  // Clear a conversation's history
  router.handle('claude.clearConversation', ({ conversationId }) => {
    claudeClient.clearConversation(conversationId);
    return Promise.resolve({ success: true });
  });

  // Send a message (non-streaming)
  router.handle(
    'claude.sendMessage',
    async ({ conversationId, message, model, maxTokens, systemPrompt }) => {
      return await claudeClient.sendMessage(conversationId, message, {
        model,
        maxTokens,
        systemPrompt,
      });
    },
  );

  // Send a message with streaming (emits events via router)
  router.handle(
    'claude.streamMessage',
    async ({ conversationId, message, model, maxTokens, systemPrompt }) => {
      await claudeClient.streamMessage(conversationId, message, {
        model,
        maxTokens,
        systemPrompt,
      });
      return { success: true };
    },
  );
}
