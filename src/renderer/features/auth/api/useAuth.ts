/**
 * React Query hooks for auth
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { ipc } from '@renderer/shared/lib/ipc';

import { useAuthStore } from '../store';

import { authKeys } from './queryKeys';

/** Login mutation — stores token + user on success */
export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { email: string; password: string }) => ipc('auth.login', data),
    onSuccess: (result) => {
      setAuth(result.user, result.token);
      void queryClient.invalidateQueries({ queryKey: authKeys.me() });
    },
  });
}

/** Register mutation — stores token + user on success */
export function useRegister() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { email: string; password: string; displayName: string }) =>
      ipc('auth.register', data),
    onSuccess: (result) => {
      setAuth(result.user, result.token);
      void queryClient.invalidateQueries({ queryKey: authKeys.me() });
    },
  });
}

/** Logout mutation — clears auth store */
export function useLogout() {
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => ipc('auth.logout', {}),
    onSuccess: () => {
      clearAuth();
      queryClient.removeQueries({ queryKey: authKeys.me() });
    },
  });
}

/** Fetch current user — only runs when a token is stored */
export function useCurrentUser() {
  const token = useAuthStore((s) => s.token);

  return useQuery({
    queryKey: authKeys.me(),
    queryFn: () => ipc('auth.me', { token: token ?? '' }),
    enabled: token !== null,
    staleTime: 300_000,
  });
}
