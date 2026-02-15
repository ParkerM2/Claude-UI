/**
 * React Query hooks for project operations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import type { InvokeInput } from '@shared/ipc-contract';

import { ipc } from '@renderer/shared/lib/ipc';

import { projectKeys } from './queryKeys';

/** Fetch all projects */
export function useProjects() {
  return useQuery({
    queryKey: projectKeys.list(),
    queryFn: () => ipc('projects.list', {}),
    staleTime: 60_000,
  });
}

/** Add a new project */
export function useAddProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (path: string) => ipc('projects.add', { path }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
    },
  });
}

/** Remove a project */
export function useRemoveProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (projectId: string) => ipc('projects.remove', { projectId }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
    },
  });
}

/** Initialize a project (set up .claude-ui folder, etc.) */
export function useInitializeProject() {
  return useMutation({
    mutationFn: (projectId: string) => ipc('projects.initialize', { projectId }),
  });
}

/** Open directory picker dialog */
export function useSelectDirectory() {
  return useMutation({
    mutationFn: () => ipc('projects.selectDirectory', {}),
  });
}

/** Update an existing project */
export function useUpdateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: InvokeInput<'projects.update'>) =>
      ipc('projects.update', data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: projectKeys.all });
    },
  });
}

/** Fetch sub-projects for a project */
export function useSubProjects(projectId: string) {
  return useQuery({
    queryKey: projectKeys.subProjects(projectId),
    queryFn: () => ipc('projects.getSubProjects', { projectId }),
    enabled: projectId.length > 0,
  });
}

/** Create a sub-project */
export function useCreateSubProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: InvokeInput<'projects.createSubProject'>) =>
      ipc('projects.createSubProject', data),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({
        queryKey: projectKeys.subProjects(variables.projectId),
      });
    },
  });
}

/** Delete a sub-project */
export function useDeleteSubProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: InvokeInput<'projects.deleteSubProject'>) =>
      ipc('projects.deleteSubProject', data),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({
        queryKey: projectKeys.subProjects(variables.projectId),
      });
    },
  });
}
