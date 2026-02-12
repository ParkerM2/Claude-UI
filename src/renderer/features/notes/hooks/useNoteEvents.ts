/**
 * Note IPC event listeners -> query invalidation
 *
 * Bridges real-time events from the main process to React Query cache.
 */

import { useQueryClient } from '@tanstack/react-query';

import { useIpcEvent } from '@renderer/shared/hooks';

import { noteKeys } from '../api/queryKeys';

export function useNoteEvents() {
  const queryClient = useQueryClient();

  useIpcEvent('event:note.changed', () => {
    void queryClient.invalidateQueries({ queryKey: noteKeys.all });
  });
}
