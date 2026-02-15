/**
 * Auth event hooks — session restoration and auth lifecycle
 */

import { useEffect, useRef } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { ipc } from '@renderer/shared/lib/ipc';

import { authKeys } from '../api/queryKeys';
import { useAuthStore } from '../store';

/**
 * Restores auth session from stored tokens on app startup.
 *
 * Checks if tokens are persisted in localStorage (via the store's initial state),
 * then attempts to validate the session by calling auth.me. If the session is
 * invalid, attempts a token refresh. If both fail, clears stored auth.
 *
 * Call this once at the app root level.
 */
export function useAuthInit(): void {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const refreshToken = useAuthStore((s) => s.refreshToken);
  const setUser = useAuthStore((s) => s.setUser);
  const updateTokens = useAuthStore((s) => s.updateTokens);
  const setExpiresAt = useAuthStore((s) => s.setExpiresAt);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const setInitializing = useAuthStore((s) => s.setInitializing);
  const queryClient = useQueryClient();
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;

    if (!isAuthenticated) {
      setInitializing(false);
      return;
    }

    hasRun.current = true;

    void (async () => {
      try {
        const user = await ipc('auth.me', {});
        setUser(user);
        void queryClient.invalidateQueries({ queryKey: authKeys.me() });
      } catch {
        if (!refreshToken) {
          clearAuth();
          return;
        }

        try {
          const result = await ipc('auth.refresh', { refreshToken });
          updateTokens(result.tokens);
          setExpiresAt(Date.now() + result.tokens.expiresIn * 1000);

          const user = await ipc('auth.me', {});
          setUser(user);
          void queryClient.invalidateQueries({ queryKey: authKeys.me() });
        } catch {
          clearAuth();
        }
      } finally {
        setInitializing(false);
      }
    })();
  }, [isAuthenticated, refreshToken, setUser, updateTokens, setExpiresAt, clearAuth, setInitializing, queryClient]);
}
