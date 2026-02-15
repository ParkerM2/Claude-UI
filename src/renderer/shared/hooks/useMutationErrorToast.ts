/**
 * useMutationErrorToast — Factory for mutation onError callbacks
 *
 * Provides a helper that creates typed onError handlers for React Query mutations.
 * When a mutation fails, it logs the error and pushes a toast notification
 * via the shared toast store.
 *
 * @example
 * const { onError } = useMutationErrorToast();
 * useMutation({
 *   mutationFn: ...,
 *   onError: onError('delete task'),
 * });
 */

import { useCallback } from 'react';

import { useToastStore } from '@renderer/shared/stores/toast-store';

interface MutationErrorToast {
  /** Returns an onError callback that shows a toast for a specific action */
  onError: (action: string) => (error: unknown) => void;
}

export function useMutationErrorToast(): MutationErrorToast {
  const addToast = useToastStore((s) => s.addToast);

  const onError = useCallback(
    (action: string) => (error: unknown) => {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error(`[Mutation Error] Failed to ${action}:`, message);
      addToast(`Failed to ${action}: ${message}`, 'error');
    },
    [addToast],
  );

  return { onError };
}
