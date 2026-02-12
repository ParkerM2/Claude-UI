/**
 * Browser MCP Server — Configuration and entry point
 *
 * Provides browser control tools (open URL, search, open apps).
 * Does not require authentication.
 */

import type { McpServerConfig } from '../../mcp/types';

export const BROWSER_SERVER_CONFIG: McpServerConfig = {
  name: 'browser',
  displayName: 'Browser',
  transport: 'stdio',
  requiresAuth: false,
};

export { executeBrowserTool, BROWSER_TOOLS } from './tools';
