/**
 * Fitness IPC event listeners -> query invalidation
 */

import { useQueryClient } from '@tanstack/react-query';

import { useIpcEvent } from '@renderer/shared/hooks';

import { fitnessKeys } from '../api/queryKeys';

export function useFitnessEvents() {
  const queryClient = useQueryClient();

  useIpcEvent('event:fitness.workoutChanged', () => {
    void queryClient.invalidateQueries({ queryKey: fitnessKeys.workouts() });
    void queryClient.invalidateQueries({ queryKey: fitnessKeys.stats() });
  });

  useIpcEvent('event:fitness.measurementChanged', () => {
    void queryClient.invalidateQueries({ queryKey: fitnessKeys.measurements() });
  });

  useIpcEvent('event:fitness.goalChanged', () => {
    void queryClient.invalidateQueries({ queryKey: fitnessKeys.goals() });
  });
}
