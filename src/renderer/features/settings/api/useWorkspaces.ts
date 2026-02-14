/**
 * React Query hooks for workspace operations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { ipc } from '@renderer/shared/lib/ipc';

export const workspaceKeys = {
  all: ['workspaces'] as const,
  list: () => [...workspaceKeys.all, 'list'] as const,
  devices: () => ['devices', 'list'] as const,
};

/** Fetch all workspaces */
export function useWorkspaces() {
  return useQuery({
    queryKey: workspaceKeys.list(),
    queryFn: () => ipc('workspaces.list', {}),
    staleTime: 60_000,
  });
}

/** Create a new workspace */
export function useCreateWorkspace() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string; description?: string }) =>
      ipc('workspaces.create', data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: workspaceKeys.list() });
    },
  });
}

/** Update an existing workspace */
export function useUpdateWorkspace() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      id: string;
      name?: string;
      description?: string;
      hostDeviceId?: string;
      settings?: { autoStart?: boolean; maxConcurrent?: number; defaultBranch?: string };
    }) => ipc('workspaces.update', data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: workspaceKeys.list() });
    },
  });
}

/** Delete a workspace */
export function useDeleteWorkspace() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => ipc('workspaces.delete', { id }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: workspaceKeys.list() });
    },
  });
}

/** Fetch all devices */
export function useDevices() {
  return useQuery({
    queryKey: workspaceKeys.devices(),
    queryFn: () => ipc('devices.list', {}),
    staleTime: 30_000,
  });
}
