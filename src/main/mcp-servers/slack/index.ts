/**
 * Slack MCP Server — Configuration and entry point
 *
 * Defines the server config for Slack integration.
 * The server requires OAuth authentication via the Slack provider.
 */

import type { McpServerConfig } from '../../mcp/types';

export const SLACK_SERVER_CONFIG: McpServerConfig = {
  name: 'slack',
  displayName: 'Slack',
  transport: 'stdio',
  requiresAuth: true,
  authProvider: 'slack',
};

export { createSlackClient } from './slack-client';
export { executeSlackTool, SLACK_TOOLS } from './tools';
export type { SlackClient } from './slack-client';
export type {
  SlackChannel,
  SlackMessage,
  SlackSearchResult,
  SlackUser,
  StandupEntry,
} from './types';
