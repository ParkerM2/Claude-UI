/**
 * Idea IPC event listeners -> query invalidation
 */

import { useQueryClient } from '@tanstack/react-query';

import { useIpcEvent } from '@renderer/shared/hooks';

import { ideaKeys } from '../api/queryKeys';

export function useIdeaEvents() {
  const queryClient = useQueryClient();

  useIpcEvent('event:idea.changed', () => {
    void queryClient.invalidateQueries({ queryKey: ideaKeys.all });
  });
}
