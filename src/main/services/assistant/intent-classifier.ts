/**
 * Intent Classifier
 *
 * Synchronous, rule-based classification of user input into
 * intent types with extracted entities. No API calls needed.
 * First match wins — order of rules matters.
 */

import type { IntentType } from '@shared/types';

export interface ClassifiedIntent {
  type: IntentType;
  subtype?: string;
  confidence: number;
  extractedEntities: Record<string, string>;
  originalInput: string;
}

interface IntentRule {
  pattern: RegExp;
  type: IntentType;
  subtype: string;
  confidence: number;
  extractEntities: (input: string, match: RegExpMatchArray) => Record<string, string>;
}

function stripPrefix(input: string, pattern: RegExp): string {
  return input.replace(pattern, '').trim();
}

const INTENT_RULES: IntentRule[] = [
  // Notes: "note: ..." or "remember ..."
  {
    pattern: /^(note[:\s]|remember\s)/i,
    type: 'quick_command',
    subtype: 'notes',
    confidence: 0.95,
    extractEntities: (input) => ({
      content: stripPrefix(input, /^(note[:\s]|remember\s)/i),
    }),
  },
  // Standup: "#standup ..."
  {
    pattern: /^#standup\s/i,
    type: 'quick_command',
    subtype: 'standup',
    confidence: 0.95,
    extractEntities: (input) => ({
      raw: input,
    }),
  },
  // Task creation: "create task ...", "add task ...", "build ...", "implement ...", "fix ..."
  {
    pattern: /^(create task|add task|build|implement|fix)\s/i,
    type: 'task_creation',
    subtype: 'task',
    confidence: 0.9,
    extractEntities: (input) => ({
      title: stripPrefix(input, /^(create task|add task)[:\s]?/i),
    }),
  },
  // Spotify: "play ...", "pause", "skip", "next", "previous", "volume ..."
  {
    pattern: /^(play|pause|skip|next|previous|volume)\s?/i,
    type: 'quick_command',
    subtype: 'spotify',
    confidence: 0.9,
    extractEntities: (input) => {
      const parts = input.split(/\s/);
      return {
        action: (parts[0] ?? '').toLowerCase(),
        query: parts.slice(1).join(' '),
      };
    },
  },
  // Reminders: "remind ..." or "alert ..."
  {
    pattern: /^(remind|alert)\s/i,
    type: 'quick_command',
    subtype: 'reminder',
    confidence: 0.85,
    extractEntities: (input) => ({
      content: input,
    }),
  },
  // Launcher: "open ..." or "launch ..."
  {
    pattern: /^(open|launch)\s/i,
    type: 'quick_command',
    subtype: 'launcher',
    confidence: 0.9,
    extractEntities: (input) => ({
      target: stripPrefix(input, /^(open|launch)\s/i),
    }),
  },
];

/**
 * Classify user input into an intent type with extracted entities.
 * Synchronous — no API calls. First matching rule wins.
 * Unknown inputs default to 'conversation' with confidence 0.5.
 */
export function classifyIntent(input: string): ClassifiedIntent {
  const normalized = input.trim();
  if (normalized.length === 0) {
    return {
      type: 'conversation',
      confidence: 0.5,
      extractedEntities: {},
      originalInput: input,
    };
  }

  for (const rule of INTENT_RULES) {
    const match = normalized.match(rule.pattern);
    if (match) {
      return {
        type: rule.type,
        subtype: rule.subtype,
        confidence: rule.confidence,
        extractedEntities: rule.extractEntities(normalized, match),
        originalInput: input,
      };
    }
  }

  // Default: conversation (send to Claude API)
  return {
    type: 'conversation',
    confidence: 0.5,
    extractedEntities: {},
    originalInput: input,
  };
}
