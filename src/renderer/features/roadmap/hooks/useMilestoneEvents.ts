/**
 * Milestone IPC event listeners -> query invalidation
 */

import { useQueryClient } from '@tanstack/react-query';

import { useIpcEvent } from '@renderer/shared/hooks';

import { milestoneKeys } from '../api/queryKeys';

export function useMilestoneEvents() {
  const queryClient = useQueryClient();

  useIpcEvent('event:milestone.changed', () => {
    void queryClient.invalidateQueries({ queryKey: milestoneKeys.all });
  });
}
