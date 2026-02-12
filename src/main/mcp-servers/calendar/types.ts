/**
 * Google Calendar API type definitions
 *
 * Types for Google Calendar API v3 responses used by the MCP server.
 * Only the fields we actually consume are typed.
 */

// ── Date/Time ───────────────────────────────────────────────

export interface CalendarDateTime {
  /** RFC 3339 date-time (e.g. 2026-02-12T10:00:00-05:00) */
  dateTime?: string;
  /** All-day date (e.g. 2026-02-12) */
  date?: string;
  /** IANA time zone (e.g. America/New_York) */
  timeZone?: string;
}

// ── Attendee ────────────────────────────────────────────────

export interface CalendarAttendee {
  email: string;
  displayName?: string;
  responseStatus: 'needsAction' | 'declined' | 'tentative' | 'accepted';
  self?: boolean;
}

// ── Event ───────────────────────────────────────────────────

export interface CalendarEvent {
  id: string;
  summary: string;
  description?: string;
  location?: string;
  start: CalendarDateTime;
  end: CalendarDateTime;
  status: 'confirmed' | 'tentative' | 'cancelled';
  htmlLink: string;
  attendees?: CalendarAttendee[];
  creator?: { email: string; displayName?: string };
  organizer?: { email: string; displayName?: string };
  recurringEventId?: string;
  created: string;
  updated: string;
}

// ── Free/Busy ───────────────────────────────────────────────

export interface FreeBusyTimePeriod {
  start: string;
  end: string;
}

export interface FreeBusyCalendar {
  busy: FreeBusyTimePeriod[];
  errors?: Array<{ domain: string; reason: string }>;
}

export interface FreeBusyResponse {
  kind: string;
  timeMin: string;
  timeMax: string;
  calendars: Record<string, FreeBusyCalendar>;
}

// ── Calendar List ───────────────────────────────────────────

export interface CalendarListEntry {
  id: string;
  summary: string;
  primary?: boolean;
  backgroundColor?: string;
  foregroundColor?: string;
  accessRole: 'freeBusyReader' | 'reader' | 'writer' | 'owner';
}

// ── API Response Wrappers ───────────────────────────────────

export interface CalendarEventListResponse {
  items: CalendarEvent[];
  nextPageToken?: string;
  summary?: string;
  timeZone?: string;
}

export interface CalendarListResponse {
  items: CalendarListEntry[];
}
