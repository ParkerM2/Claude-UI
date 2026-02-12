/**
 * Planner IPC event listeners -> query invalidation
 */

import { useQueryClient } from '@tanstack/react-query';

import { useIpcEvent } from '@renderer/shared/hooks';

import { plannerKeys } from '../api/queryKeys';

export function usePlannerEvents() {
  const queryClient = useQueryClient();

  useIpcEvent('event:planner.dayChanged', ({ date }) => {
    void queryClient.invalidateQueries({ queryKey: plannerKeys.day(date) });
  });
}
