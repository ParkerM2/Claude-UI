/**
 * NLP Time Parser — Natural language date/time parsing
 *
 * Uses chrono-node for single expressions ("tomorrow at 3pm").
 * Custom regex for recurring patterns ("every day at 9am", "every Monday").
 */

import * as chrono from 'chrono-node';

export interface RecurringSchedule {
  frequency: 'daily' | 'weekly' | 'monthly';
  time: string;
  daysOfWeek?: number[];
}

export interface ParsedTime {
  date: Date;
  isRecurring: boolean;
  recurring?: RecurringSchedule;
  confidence: number;
  originalText: string;
}

const DAY_NAMES = new Map<string, number>([
  ['sunday', 0],
  ['monday', 1],
  ['tuesday', 2],
  ['wednesday', 3],
  ['thursday', 4],
  ['friday', 5],
  ['saturday', 6],
  ['sun', 0],
  ['mon', 1],
  ['tue', 2],
  ['wed', 3],
  ['thu', 4],
  ['fri', 5],
  ['sat', 6],
]);

/**
 * Attempt to parse recurring patterns like:
 * - "every day at 9am"
 * - "every weekday at 8:30am"
 * - "every Monday at 10am"
 * - "every Monday and Wednesday at 2pm"
 * - "every month on the 1st at 9am"
 */
function parseRecurring(input: string, referenceDate: Date): ParsedTime | undefined {
  const normalized = input.toLowerCase().trim();

  // "every day at <time>"
  const dailyMatch = /^every\s+day\s+at\s+(.+)$/i.exec(normalized);
  if (dailyMatch) {
    const timeStr = dailyMatch[1];
    const parsed = chrono.parseDate(`today at ${timeStr}`, referenceDate);
    if (parsed) {
      return {
        date: parsed,
        isRecurring: true,
        recurring: {
          frequency: 'daily',
          time: formatTime(parsed),
        },
        confidence: 0.9,
        originalText: input,
      };
    }
  }

  // "every weekday at <time>"
  const weekdayMatch = /^every\s+weekday\s+at\s+(.+)$/i.exec(normalized);
  if (weekdayMatch) {
    const timeStr = weekdayMatch[1];
    const parsed = chrono.parseDate(`today at ${timeStr}`, referenceDate);
    if (parsed) {
      return {
        date: parsed,
        isRecurring: true,
        recurring: {
          frequency: 'weekly',
          time: formatTime(parsed),
          daysOfWeek: [1, 2, 3, 4, 5],
        },
        confidence: 0.9,
        originalText: input,
      };
    }
  }

  // "every <day(s)> at <time>" — e.g. "every Monday and Wednesday at 2pm"
  const specificDayMatch =
    /^every\s+((?:(?:sun|mon|tue|wed|thu|fri|sat)(?:day|s?day)?(?:\s*(?:,|and)\s*)?)+)\s+at\s+(.+)$/i.exec(
      normalized,
    );
  if (specificDayMatch) {
    const daysStr = specificDayMatch[1];
    const timeStr = specificDayMatch[2];
    const days = parseDayNames(daysStr);
    if (days.length > 0) {
      const parsed = chrono.parseDate(`today at ${timeStr}`, referenceDate);
      if (parsed) {
        return {
          date: parsed,
          isRecurring: true,
          recurring: {
            frequency: 'weekly',
            time: formatTime(parsed),
            daysOfWeek: days,
          },
          confidence: 0.85,
          originalText: input,
        };
      }
    }
  }

  // "every month on the <day> at <time>"
  const monthlyMatch =
    /^every\s+month\s+(?:on\s+(?:the\s+)?)?\d{1,2}(?:st|nd|rd|th)?\s+at\s+(.+)$/i.exec(normalized);
  if (monthlyMatch) {
    const timeStr = monthlyMatch[1];
    const parsed = chrono.parseDate(`today at ${timeStr}`, referenceDate);
    if (parsed) {
      return {
        date: parsed,
        isRecurring: true,
        recurring: {
          frequency: 'monthly',
          time: formatTime(parsed),
        },
        confidence: 0.8,
        originalText: input,
      };
    }
  }
}

function parseDayNames(input: string): number[] {
  const days: number[] = [];
  const parts = input.split(/[\s,]+|and/i).filter((s) => s.trim().length > 0);

  for (const part of parts) {
    const trimmed = part.trim().toLowerCase();
    // Strip trailing "s" or "day" suffix for matching
    const key = trimmed.replace(/s?day$/, '').toLowerCase();
    const fullKey = trimmed.replace(/s$/, '');

    const byTrimmed = DAY_NAMES.get(trimmed);
    const byKey = DAY_NAMES.get(key);
    const byFullKey = DAY_NAMES.get(fullKey);

    if (byTrimmed !== undefined) {
      days.push(byTrimmed);
    } else if (byKey !== undefined) {
      days.push(byKey);
    } else if (byFullKey !== undefined) {
      days.push(byFullKey);
    }
  }

  return [...new Set(days)].sort((a, b) => a - b);
}

function formatTime(date: Date): string {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

/**
 * Parse a natural language time expression.
 * Returns undefined if the input cannot be parsed.
 */
export function parseTimeExpression(input: string, referenceDate?: Date): ParsedTime | undefined {
  const ref = referenceDate ?? new Date();

  // Try recurring patterns first
  const recurring = parseRecurring(input, ref);
  if (recurring) {
    return recurring;
  }

  // Try chrono-node for single expressions
  const results = chrono.parse(input, ref);
  if (results.length === 0) {
    return;
  }

  const result = results[0];
  const date = result.date();

  return {
    date,
    isRecurring: false,
    confidence: calculateConfidence(result),
    originalText: input,
  };
}

function calculateConfidence(result: chrono.ParsedResult): number {
  let confidence = 0.5;

  // More components specified = higher confidence
  if (result.start.isCertain('hour')) confidence += 0.15;
  if (result.start.isCertain('day')) confidence += 0.15;
  if (result.start.isCertain('month')) confidence += 0.1;
  if (result.start.isCertain('year')) confidence += 0.1;

  return Math.min(confidence, 1);
}
