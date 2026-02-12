/**
 * Spotify API type definitions
 *
 * Types for Spotify Web API responses used by the MCP server.
 * Only the fields we actually consume are typed.
 */

// ── Artist ──────────────────────────────────────────────────

export interface SpotifyArtist {
  id: string;
  name: string;
  uri: string;
}

// ── Album ───────────────────────────────────────────────────

export interface SpotifyAlbum {
  id: string;
  name: string;
  uri: string;
  images: Array<{ url: string; height: number; width: number }>;
  release_date: string;
}

// ── Track ───────────────────────────────────────────────────

export interface SpotifyTrack {
  id: string;
  name: string;
  uri: string;
  duration_ms: number;
  artists: SpotifyArtist[];
  album: SpotifyAlbum;
  is_playable: boolean;
}

// ── Playback State ──────────────────────────────────────────

export interface SpotifyDevice {
  id: string | null;
  name: string;
  type: string;
  is_active: boolean;
  volume_percent: number | null;
}

export interface SpotifyPlaybackState {
  is_playing: boolean;
  progress_ms: number | null;
  item: SpotifyTrack | null;
  device: SpotifyDevice;
  shuffle_state: boolean;
  repeat_state: 'off' | 'track' | 'context';
}

// ── Search ──────────────────────────────────────────────────

export interface SpotifySearchResult {
  tracks: {
    items: SpotifyTrack[];
    total: number;
  };
}

// ── Playlist ────────────────────────────────────────────────

export interface SpotifyPlaylist {
  id: string;
  name: string;
  uri: string;
  description: string | null;
  tracks: { total: number };
  images: Array<{ url: string; height: number | null; width: number | null }>;
}

// ── API Response Wrappers ───────────────────────────────────

export interface SpotifyPlaylistListResponse {
  items: SpotifyPlaylist[];
  total: number;
}
