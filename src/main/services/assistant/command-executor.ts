/**
 * Command Executor
 *
 * Routes classified intents to the appropriate MCP server
 * or internal service. Returns an AssistantResponse for every
 * input — errors are returned as response objects, never thrown.
 */

import type { AssistantResponse } from '@shared/types';

import type { McpManager } from '@main/mcp/mcp-manager';

import type { ClassifiedIntent } from './intent-classifier';

export interface CommandExecutorDeps {
  mcpManager: McpManager;
}

export interface CommandExecutor {
  /** Execute a classified intent and return a response. Never throws. */
  execute: (intent: ClassifiedIntent) => Promise<AssistantResponse>;
}

/** Map of intent subtypes to MCP server names. */
const SUBTYPE_TO_SERVER: Record<string, string> = {
  spotify: 'spotify',
  notes: 'notes',
  reminder: 'alerts',
  standup: 'standup',
  launcher: 'launcher',
};

/** Map of intent subtypes to MCP tool names. */
const SUBTYPE_TO_TOOL: Record<string, string> = {
  spotify: 'spotify_control',
  notes: 'create_note',
  reminder: 'create_reminder',
  standup: 'log_standup',
  launcher: 'open_app',
};

function buildErrorResponse(message: string): AssistantResponse {
  return {
    type: 'error',
    content: message,
  };
}

function buildTextResponse(content: string): AssistantResponse {
  return {
    type: 'text',
    content,
  };
}

function buildActionResponse(content: string, intent: ClassifiedIntent): AssistantResponse {
  return {
    type: 'action',
    content,
    intent: intent.type,
    metadata: {
      subtype: intent.subtype ?? '',
      ...intent.extractedEntities,
    },
  };
}

async function executeQuickCommand(
  intent: ClassifiedIntent,
  mcpManager: McpManager,
): Promise<AssistantResponse> {
  const subtype = intent.subtype ?? '';
  const serverName = SUBTYPE_TO_SERVER[subtype];
  const toolName = SUBTYPE_TO_TOOL[subtype];

  if (!serverName || !toolName) {
    return buildTextResponse(
      `I understood that as a "${subtype}" command, but no handler is configured yet.`,
    );
  }

  // Check if the MCP server is connected
  const client = mcpManager.getClient(serverName);
  if (!client?.isConnected()) {
    return buildTextResponse(
      `The ${serverName} service is not connected. I'll note your request: "${intent.originalInput}"`,
    );
  }

  try {
    const result = await mcpManager.callTool(serverName, toolName, intent.extractedEntities);

    if (result.isError) {
      const errorText =
        result.content.length > 0
          ? result.content.map((c) => c.text).join('\n')
          : 'Unknown error from tool';
      return buildErrorResponse(`${serverName} error: ${errorText}`);
    }

    const responseText =
      result.content.length > 0
        ? result.content.map((c) => c.text).join('\n')
        : `Done (${subtype})`;
    return buildActionResponse(responseText, intent);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[CommandExecutor] MCP tool call failed:`, message);
    return buildErrorResponse(`Failed to execute ${subtype} command: ${message}`);
  }
}

function executeTaskCreation(intent: ClassifiedIntent): AssistantResponse {
  const title = intent.extractedEntities.title || intent.originalInput;
  return {
    type: 'action',
    content: `Task ready to create: "${title}"`,
    intent: 'task_creation',
    metadata: {
      subtype: 'task',
      title,
      requiresConfirmation: 'true',
    },
  };
}

function executeConversation(intent: ClassifiedIntent): AssistantResponse {
  // Conversation mode placeholder — will be connected to Claude API
  // when the conversation service is implemented
  return buildTextResponse(
    `I received your message: "${intent.originalInput}". Conversation mode is not yet connected to an AI backend.`,
  );
}

export function createCommandExecutor(deps: CommandExecutorDeps): CommandExecutor {
  const { mcpManager } = deps;

  return {
    async execute(intent) {
      try {
        switch (intent.type) {
          case 'quick_command': {
            return await executeQuickCommand(intent, mcpManager);
          }
          case 'task_creation': {
            return executeTaskCreation(intent);
          }
          case 'conversation': {
            return executeConversation(intent);
          }
          default: {
            return buildTextResponse("I'm not sure how to handle that. Could you rephrase?");
          }
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.error('[CommandExecutor] Unexpected error:', message);
        return buildErrorResponse(`Something went wrong: ${message}`);
      }
    },
  };
}
