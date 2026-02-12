/**
 * Spotify MCP Server — Configuration and entry point
 *
 * Defines the server config for Spotify integration.
 * The server requires OAuth authentication via the Spotify provider.
 */

import type { McpServerConfig } from '../../mcp/types';

export const SPOTIFY_SERVER_CONFIG: McpServerConfig = {
  name: 'spotify',
  displayName: 'Spotify',
  transport: 'stdio',
  requiresAuth: true,
  authProvider: 'spotify',
};

export { createSpotifyClient } from './spotify-client';
export { executeSpotifyTool, SPOTIFY_TOOLS } from './tools';
export type { SpotifyClient } from './spotify-client';
export type {
  SpotifyAlbum,
  SpotifyArtist,
  SpotifyDevice,
  SpotifyPlaybackState,
  SpotifyPlaylist,
  SpotifyTrack,
} from './types';
