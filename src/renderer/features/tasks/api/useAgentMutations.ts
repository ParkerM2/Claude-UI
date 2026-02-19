/**
 * Agent orchestrator mutation hooks
 *
 * React Query mutations for agent planning, execution, kill, and restart IPC calls.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useMutationErrorToast } from '@renderer/shared/hooks';
import { ipc } from '@renderer/shared/lib/ipc';

import { taskKeys } from './queryKeys';

/** Start planning for a task — spawns a headless Claude agent */
export function useStartPlanning() {
  const queryClient = useQueryClient();
  const { onError } = useMutationErrorToast();
  return useMutation({
    mutationFn: (input: {
      taskId: string;
      projectPath: string;
      taskDescription: string;
      subProjectPath?: string;
    }) => ipc('agent.startPlanning', input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
    },
    onError: onError('start planning'),
  });
}

/** Start execution for a task — spawns a headless Claude agent */
export function useStartExecution() {
  const queryClient = useQueryClient();
  const { onError } = useMutationErrorToast();
  return useMutation({
    mutationFn: (input: {
      taskId: string;
      projectPath: string;
      taskDescription: string;
      planRef?: string;
      subProjectPath?: string;
    }) => ipc('agent.startExecution', input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
    },
    onError: onError('start execution'),
  });
}

/** Re-plan a task with user feedback on what to change */
export function useReplanWithFeedback() {
  const queryClient = useQueryClient();
  const { onError } = useMutationErrorToast();
  return useMutation({
    mutationFn: (input: {
      taskId: string;
      projectPath: string;
      taskDescription: string;
      feedback: string;
      previousPlanPath?: string;
      subProjectPath?: string;
    }) => ipc('agent.replanWithFeedback', input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
    },
    onError: onError('re-plan with feedback'),
  });
}

/** Kill an active agent session */
export function useKillAgent() {
  const queryClient = useQueryClient();
  const { onError } = useMutationErrorToast();
  return useMutation({
    mutationFn: (input: { sessionId: string }) => ipc('agent.killSession', input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
    },
    onError: onError('kill agent'),
  });
}

/** Restart an agent from its last checkpoint */
export function useRestartFromCheckpoint() {
  const queryClient = useQueryClient();
  const { onError } = useMutationErrorToast();
  return useMutation({
    mutationFn: (input: { taskId: string; projectPath: string }) =>
      ipc('agent.restartFromCheckpoint', input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
    },
    onError: onError('restart from checkpoint'),
  });
}
