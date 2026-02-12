/**
 * MCP (Model Context Protocol) Types
 *
 * Internal types for the MCP infrastructure layer.
 * These types define server configurations, tool schemas,
 * and connection states used by the client, registry, and manager.
 */

/** Transport protocol for connecting to an MCP server. */
export type McpTransport = 'stdio' | 'sse';

/** Connection lifecycle states for an MCP client. */
export type McpConnectionState = 'disconnected' | 'connecting' | 'connected' | 'error';

/** Configuration for an MCP server that can be registered and connected to. */
export interface McpServerConfig {
  /** Unique identifier for this server. */
  name: string;
  /** Human-readable label shown in the UI. */
  displayName: string;
  /** Transport protocol used for communication. */
  transport: McpTransport;
  /** Command to spawn for stdio transport (e.g. 'node', 'python'). */
  command?: string;
  /** Arguments passed to the spawned command. */
  args?: string[];
  /** Environment variables for the spawned process. */
  env?: Record<string, string>;
  /** URL for SSE transport connections. */
  url?: string;
  /** Whether this server requires OAuth/API-key authentication. */
  requiresAuth?: boolean;
  /** Name of the auth provider to use (e.g. 'oauth', 'api-key'). */
  authProvider?: string;
  /** Whether to automatically connect on registration. */
  autoConnect?: boolean;
}

/** A tool exposed by an MCP server. */
export interface McpTool {
  /** Tool identifier. */
  name: string;
  /** Human-readable description of what the tool does. */
  description: string;
  /** JSON Schema describing the tool's input parameters. */
  inputSchema: Record<string, unknown>;
}

/** A single content block within an MCP tool result. */
export interface McpToolResultContent {
  /** Content type (e.g. 'text', 'image', 'resource'). */
  type: string;
  /** Text content of the result block. */
  text: string;
}

/** Result returned from calling an MCP tool. */
export interface McpToolResult {
  /** Content blocks returned by the tool. */
  content: McpToolResultContent[];
  /** Whether the tool call resulted in an error. */
  isError: boolean;
}

/** Tool definition as advertised by an MCP server during capability negotiation. */
export interface McpToolDefinition {
  /** Tool identifier. */
  name: string;
  /** Human-readable description. */
  description: string;
  /** JSON Schema for the tool's input parameters. */
  inputSchema: Record<string, unknown>;
}

/** Events emitted by an MCP client. */
export interface McpClientEvents {
  connected: [serverName: string];
  disconnected: [serverName: string];
  error: [serverName: string, error: Error];
  'tools-updated': [serverName: string, tools: McpTool[]];
}

/** Events emitted by the MCP manager. */
export interface McpManagerEvents {
  'connection-state-changed': [serverName: string, state: McpConnectionState];
  'health-check-failed': [serverName: string, error: Error];
}
