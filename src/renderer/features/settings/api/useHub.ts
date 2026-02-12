/**
 * React Query hooks for hub connection management
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { ipc } from '@renderer/shared/lib/ipc';

export const hubKeys = {
  all: ['hub'] as const,
  status: () => [...hubKeys.all, 'status'] as const,
  config: () => [...hubKeys.all, 'config'] as const,
};

/** Fetch current hub connection status. */
export function useHubStatus() {
  return useQuery({
    queryKey: hubKeys.status(),
    queryFn: () => ipc('hub.getStatus', {}),
    refetchInterval: 15_000,
  });
}

/** Fetch hub configuration. */
export function useHubConfig() {
  return useQuery({
    queryKey: hubKeys.config(),
    queryFn: () => ipc('hub.getConfig', {}),
    staleTime: 60_000,
  });
}

/** Connect to the hub server. */
export function useHubConnect() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { url: string; apiKey: string }) => ipc('hub.connect', data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: hubKeys.status() });
      void queryClient.invalidateQueries({ queryKey: hubKeys.config() });
    },
  });
}

/** Disconnect from the hub server. */
export function useHubDisconnect() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => ipc('hub.disconnect', {}),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: hubKeys.status() });
    },
  });
}

/** Trigger a manual sync with the hub. */
export function useHubSync() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => ipc('hub.sync', {}),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: hubKeys.status() });
    },
  });
}

/** Remove hub configuration entirely. */
export function useHubRemoveConfig() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => ipc('hub.removeConfig', {}),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: hubKeys.status() });
      void queryClient.invalidateQueries({ queryKey: hubKeys.config() });
    },
  });
}
