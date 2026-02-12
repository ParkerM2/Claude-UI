/**
 * React Query hooks for fitness
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { Exercise, FitnessGoalType, MeasurementSource, WorkoutType } from '@shared/types';

import { ipc } from '@renderer/shared/lib/ipc';

import { fitnessKeys } from './queryKeys';

/** List workouts with optional filters */
export function useWorkouts(filters?: {
  startDate?: string;
  endDate?: string;
  type?: WorkoutType;
}) {
  return useQuery({
    queryKey: fitnessKeys.workoutList(filters),
    queryFn: () => ipc('fitness.listWorkouts', filters ?? {}),
  });
}

/** Log a new workout */
export function useLogWorkout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      date: string;
      type: WorkoutType;
      duration: number;
      exercises: Exercise[];
      notes?: string;
    }) => ipc('fitness.logWorkout', data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: fitnessKeys.workouts() });
      void queryClient.invalidateQueries({ queryKey: fitnessKeys.stats() });
    },
  });
}

/** Delete a workout */
export function useDeleteWorkout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => ipc('fitness.deleteWorkout', { id }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: fitnessKeys.workouts() });
      void queryClient.invalidateQueries({ queryKey: fitnessKeys.stats() });
    },
  });
}

/** Get body measurements */
export function useMeasurements(limit?: number) {
  return useQuery({
    queryKey: fitnessKeys.measurementList(limit),
    queryFn: () => ipc('fitness.getMeasurements', { limit }),
  });
}

/** Log a body measurement */
export function useLogMeasurement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      date: string;
      weight?: number;
      bodyFat?: number;
      muscleMass?: number;
      boneMass?: number;
      waterPercentage?: number;
      visceralFat?: number;
      source: MeasurementSource;
    }) => ipc('fitness.logMeasurement', data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: fitnessKeys.measurements() });
    },
  });
}

/** Get fitness stats */
export function useFitnessStats() {
  return useQuery({
    queryKey: fitnessKeys.stats(),
    queryFn: () => ipc('fitness.getStats', {}),
  });
}

/** List fitness goals */
export function useFitnessGoals() {
  return useQuery({
    queryKey: fitnessKeys.goals(),
    queryFn: () => ipc('fitness.listGoals', {}),
  });
}

/** Set a new fitness goal */
export function useSetGoal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      type: FitnessGoalType;
      target: number;
      unit: string;
      deadline?: string;
    }) => ipc('fitness.setGoal', data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: fitnessKeys.goals() });
    },
  });
}

/** Update goal progress */
export function useUpdateGoalProgress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { goalId: string; current: number }) =>
      ipc('fitness.updateGoalProgress', data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: fitnessKeys.goals() });
    },
  });
}

/** Delete a goal */
export function useDeleteGoal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => ipc('fitness.deleteGoal', { id }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: fitnessKeys.goals() });
    },
  });
}
