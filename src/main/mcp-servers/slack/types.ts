/**
 * Slack API type definitions
 *
 * Types for Slack Web API responses used by the MCP server.
 * Only the fields we actually consume are typed.
 */

// ── User ─────────────────────────────────────────────────────

export interface SlackUser {
  id: string;
  name: string;
  real_name: string;
  profile: {
    display_name: string;
    image_48: string;
    status_text: string;
    status_emoji: string;
  };
}

// ── Channel ─────────────────────────────────────────────────

export interface SlackChannel {
  id: string;
  name: string;
  is_channel: boolean;
  is_im: boolean;
  is_member: boolean;
  is_archived: boolean;
  topic: { value: string };
  purpose: { value: string };
  num_members: number;
}

// ── Message ─────────────────────────────────────────────────

export interface SlackMessage {
  type: string;
  user: string;
  text: string;
  ts: string;
  thread_ts?: string;
  reply_count?: number;
  reactions?: Array<{ name: string; count: number }>;
}

// ── Search Result ───────────────────────────────────────────

export interface SlackSearchResult {
  messages: {
    matches: SlackMessage[];
    total: number;
  };
}

// ── Standup ─────────────────────────────────────────────────

export interface StandupEntry {
  yesterday: string;
  today: string;
  blockers: string;
}

// ── API Response Envelope ───────────────────────────────────

export interface SlackApiResponse {
  ok: boolean;
  error?: string;
}

export interface SlackChannelListResponse extends SlackApiResponse {
  channels: SlackChannel[];
}

export interface SlackMessageListResponse extends SlackApiResponse {
  messages: SlackMessage[];
}

export interface SlackPostMessageResponse extends SlackApiResponse {
  ts: string;
  channel: string;
}

export interface SlackSearchResponse extends SlackApiResponse {
  messages: {
    matches: SlackMessage[];
    total: number;
  };
}

export interface SlackThreadResponse extends SlackApiResponse {
  messages: SlackMessage[];
}
