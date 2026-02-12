/**
 * Discord MCP Server — Configuration and entry point
 *
 * Defines the server config for Discord integration.
 * The server requires OAuth/bot token authentication.
 */

import type { McpServerConfig } from '../../mcp/types';

export const DISCORD_SERVER_CONFIG: McpServerConfig = {
  name: 'discord',
  displayName: 'Discord',
  transport: 'stdio',
  requiresAuth: true,
  authProvider: 'discord',
};

export { createDiscordClient } from './discord-client';
export { DISCORD_TOOLS, executeDiscordTool } from './tools';
export type { DiscordClient } from './discord-client';
export type { DiscordChannel, DiscordGuild, DiscordMessage, DiscordUser } from './types';
