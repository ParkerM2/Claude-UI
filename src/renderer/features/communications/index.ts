/**
 * Communications feature — public API
 */

// Components
export { CommunicationsPage } from './components/CommunicationsPage';

// Store
export { useCommunicationsStore } from './store';

// API
export { communicationsKeys } from './api/queryKeys';
export type { McpToolCallParams, McpToolResult } from './api/useMcpTool';
export { useMcpConnectedServers, useMcpConnectionState, useMcpToolCall } from './api/useMcpTool';

// Events
export { useCommunicationsEvents } from './hooks/useCommunicationsEvents';
