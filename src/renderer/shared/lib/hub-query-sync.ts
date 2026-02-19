/**
 * Hub Query Sync — Invalidate React Query caches when Hub entity events arrive.
 *
 * Called once at app startup from Providers. Returns a cleanup function.
 * Runs OUTSIDE React components, so it calls window.api.on() directly.
 */

import type { EventChannel } from '@shared/ipc-contract';

import type { QueryClient } from '@tanstack/react-query';

/** Map hub entity events to the React Query keys they should invalidate */
const EVENT_TO_QUERY_MAP: Partial<Record<EventChannel, readonly string[]>> = {
  'event:hub.tasks.created': ['tasks'],
  'event:hub.tasks.updated': ['tasks'],
  'event:hub.tasks.deleted': ['tasks'],
  'event:hub.tasks.progress': ['tasks'],
  'event:hub.tasks.completed': ['tasks'],
  'event:hub.devices.online': ['devices'],
  'event:hub.devices.offline': ['devices'],
  'event:hub.workspaces.updated': ['workspaces'],
  'event:hub.projects.updated': ['projects'],
};

/** Wire up Hub event -> query invalidation. Returns cleanup function. */
export function setupHubQuerySync(queryClient: QueryClient): () => void {
  // Guard: window.api only exists in Electron (preload bridge)
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, @typescript-eslint/strict-boolean-expressions
  if (typeof window === 'undefined' || !window.api) {
    return () => {
      /* noop outside Electron */
    };
  }

  const cleanups: Array<() => void> = [];

  for (const [event, queryKeys] of Object.entries(EVENT_TO_QUERY_MAP)) {
    const typedEvent = event as EventChannel;
    const cleanup = window.api.on(typedEvent, () => {
      for (const key of queryKeys) {
        void queryClient.invalidateQueries({ queryKey: [key] });
      }
    });
    cleanups.push(cleanup);
  }

  return () => {
    for (const cleanup of cleanups) {
      cleanup();
    }
  };
}
