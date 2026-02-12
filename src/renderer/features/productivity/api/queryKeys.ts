/**
 * React Query cache key factory for productivity features
 */

export const spotifyKeys = {
  all: ['spotify'] as const,
  playback: () => [...spotifyKeys.all, 'playback'] as const,
  search: (query: string) => [...spotifyKeys.all, 'search', query] as const,
};

export const calendarKeys = {
  all: ['calendar'] as const,
  events: (timeMin: string, timeMax: string) =>
    [...calendarKeys.all, 'events', timeMin, timeMax] as const,
};
