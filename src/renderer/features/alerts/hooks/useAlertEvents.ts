/**
 * Alert IPC event listeners -> query invalidation
 */

import { useQueryClient } from '@tanstack/react-query';

import { useIpcEvent } from '@renderer/shared/hooks';

import { alertKeys } from '../api/queryKeys';
import { useAlertStore } from '../store';

export function useAlertEvents() {
  const queryClient = useQueryClient();
  const addNotification = useAlertStore((s) => s.addNotification);

  useIpcEvent('event:alert.triggered', ({ alertId, message }) => {
    addNotification({ alertId, message });
    void queryClient.invalidateQueries({ queryKey: alertKeys.lists() });
  });

  useIpcEvent('event:alert.changed', () => {
    void queryClient.invalidateQueries({ queryKey: alertKeys.lists() });
  });
}
