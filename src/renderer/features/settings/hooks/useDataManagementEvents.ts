/**
 * Data management IPC event listeners -> query invalidation
 *
 * Bridges real-time cleanup completion events from the main process
 * to the React Query cache.
 */

import { useQueryClient } from '@tanstack/react-query';

import { useIpcEvent } from '@renderer/shared/hooks';

import { dataManagementKeys } from '../api/useDataManagement';

/** Subscribe to data management IPC events */
export function useDataManagementEvents(): void {
  const queryClient = useQueryClient();

  useIpcEvent('event:dataManagement.cleanupComplete', () => {
    void queryClient.invalidateQueries({ queryKey: dataManagementKeys.usage() });
    void queryClient.invalidateQueries({ queryKey: dataManagementKeys.retention() });
  });
}
