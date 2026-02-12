/**
 * Discord API type definitions
 *
 * Types for Discord REST API v10 responses used by the MCP server.
 * Only the fields we actually consume are typed.
 */

// ── User ─────────────────────────────────────────────────────

export interface DiscordUser {
  id: string;
  username: string;
  discriminator: string;
  avatar: string | null;
  global_name: string | null;
}

// ── Guild (Server) ──────────────────────────────────────────

export interface DiscordGuild {
  id: string;
  name: string;
  icon: string | null;
  owner_id: string;
  member_count?: number;
}

// ── Channel ─────────────────────────────────────────────────

export interface DiscordChannel {
  id: string;
  name?: string;
  type: number;
  guild_id?: string;
  topic?: string | null;
}

// ── Message ─────────────────────────────────────────────────

export interface DiscordMessage {
  id: string;
  channel_id: string;
  author: DiscordUser;
  content: string;
  timestamp: string;
  edited_timestamp: string | null;
  attachments: Array<{ url: string; filename: string }>;
  embeds: Array<{ title?: string; description?: string }>;
}

// ── Presence ────────────────────────────────────────────────

export type DiscordStatusType = 'online' | 'dnd' | 'idle' | 'invisible';

export interface DiscordPresenceUpdate {
  status: DiscordStatusType;
  activities?: Array<{
    name: string;
    type: number;
  }>;
}
