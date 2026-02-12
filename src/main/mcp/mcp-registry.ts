/**
 * MCP Server Registry
 *
 * Stores and manages MCP server configurations.
 * Provides lookup, registration, and enumeration of
 * available MCP servers that can be connected to.
 */

import type { McpServerConfig } from './types';

export interface McpRegistry {
  /** Register a server configuration. Overwrites if name already exists. */
  register: (config: McpServerConfig) => void;
  /** Remove a server by name. */
  unregister: (name: string) => boolean;
  /** Get a server config by name, or undefined if not found. */
  getServer: (name: string) => McpServerConfig | undefined;
  /** List all registered server configs. */
  listServers: () => McpServerConfig[];
  /** Check if a server is registered. */
  hasServer: (name: string) => boolean;
  /** Remove all registered servers. */
  clear: () => void;
}

export function createMcpRegistry(): McpRegistry {
  const servers = new Map<string, McpServerConfig>();

  return {
    register(config) {
      if (!config.name) {
        throw new Error('MCP server config must have a name');
      }
      servers.set(config.name, { ...config });
    },

    unregister(name) {
      return servers.delete(name);
    },

    getServer(name) {
      const config = servers.get(name);
      if (!config) {
        return;
      }
      return { ...config };
    },

    listServers() {
      return [...servers.values()].map((config) => ({ ...config }));
    },

    hasServer(name) {
      return servers.has(name);
    },

    clear() {
      servers.clear();
    },
  };
}
