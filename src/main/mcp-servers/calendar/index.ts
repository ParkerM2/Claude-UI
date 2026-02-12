/**
 * Calendar MCP Server — Configuration and entry point
 *
 * Defines the server config for Google Calendar integration.
 * The server requires OAuth authentication via the Google provider.
 */

import type { McpServerConfig } from '../../mcp/types';

export const CALENDAR_SERVER_CONFIG: McpServerConfig = {
  name: 'calendar',
  displayName: 'Google Calendar',
  transport: 'stdio',
  requiresAuth: true,
  authProvider: 'google',
};

export { createCalendarClient } from './calendar-client';
export { executeCalendarTool, CALENDAR_TOOLS } from './tools';
export type { CalendarClient } from './calendar-client';
export type {
  CalendarAttendee,
  CalendarDateTime,
  CalendarEvent,
  CalendarListEntry,
  FreeBusyResponse,
  FreeBusyTimePeriod,
} from './types';
