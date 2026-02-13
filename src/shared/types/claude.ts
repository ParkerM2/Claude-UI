/**
 * Claude SDK-related types
 *
 * Types for the persistent Claude client that wraps the Anthropic SDK.
 */

/** A message in a Claude conversation. */
export interface ClaudeMessage {
  role: 'user' | 'assistant';
  content: string;
}

/** Summary info about a conversation. */
export interface ClaudeConversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messageCount: number;
}

/** Input for sending a message to Claude. */
export interface ClaudeSendMessageInput {
  conversationId: string;
  message: string;
  model?: string;
  maxTokens?: number;
  systemPrompt?: string;
}

/** Response from sending a message (non-streaming). */
export interface ClaudeSendMessageResponse {
  conversationId: string;
  message: string;
  usage: ClaudeTokenUsage;
}

/** A streaming chunk from Claude. */
export interface ClaudeStreamChunk {
  conversationId: string;
  type: 'content_delta' | 'message_start' | 'message_stop' | 'error';
  content?: string;
  usage?: ClaudeTokenUsage;
  error?: string;
}

/** Token usage information. */
export interface ClaudeTokenUsage {
  inputTokens: number;
  outputTokens: number;
}

/** Configuration for the Claude client. */
export interface ClaudeClientConfig {
  apiKey: string;
  defaultModel?: string;
  defaultMaxTokens?: number;
}

/** Errors specific to Claude operations. */
export type ClaudeErrorCode =
  | 'not_configured'
  | 'invalid_api_key'
  | 'rate_limited'
  | 'context_length_exceeded'
  | 'unknown_error';

/** Structured Claude error. */
export interface ClaudeError {
  code: ClaudeErrorCode;
  message: string;
  retryAfter?: number;
}
