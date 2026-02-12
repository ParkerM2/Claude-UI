/**
 * Assistant-related types
 */

export type IntentType = 'quick_command' | 'task_creation' | 'conversation';

export interface AssistantCommand {
  input: string;
  context?: string;
}

export interface AssistantResponse {
  type: 'text' | 'action' | 'error';
  content: string;
  intent?: IntentType;
  metadata?: Record<string, unknown>;
}

export interface CommandHistoryEntry {
  id: string;
  input: string;
  intent: IntentType;
  responseSummary: string;
  timestamp: string;
}
