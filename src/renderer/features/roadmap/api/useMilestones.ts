/**
 * React Query hooks for milestones
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { MilestoneStatus } from '@shared/types';

import { ipc } from '@renderer/shared/lib/ipc';

import { milestoneKeys } from './queryKeys';

/** Fetch milestones with optional project filter */
export function useMilestones(projectId?: string) {
  return useQuery({
    queryKey: milestoneKeys.list(projectId),
    queryFn: () => ipc('milestones.list', { projectId }),
  });
}

/** Create a new milestone */
export function useCreateMilestone() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      title: string;
      description: string;
      targetDate: string;
      projectId?: string;
    }) => ipc('milestones.create', data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: milestoneKeys.lists() });
    },
  });
}

/** Update a milestone */
export function useUpdateMilestone() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      id: string;
      title?: string;
      description?: string;
      targetDate?: string;
      status?: MilestoneStatus;
    }) => ipc('milestones.update', data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: milestoneKeys.lists() });
    },
  });
}

/** Delete a milestone */
export function useDeleteMilestone() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => ipc('milestones.delete', { id }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: milestoneKeys.lists() });
    },
  });
}

/** Add a task to a milestone */
export function useAddMilestoneTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { milestoneId: string; title: string }) => ipc('milestones.addTask', data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: milestoneKeys.lists() });
    },
  });
}

/** Toggle a milestone task's completion */
export function useToggleMilestoneTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { milestoneId: string; taskId: string }) =>
      ipc('milestones.toggleTask', data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: milestoneKeys.lists() });
    },
  });
}
