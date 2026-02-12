/**
 * Hub IPC handlers
 */

import type { HubConnectionManager } from '../../services/hub/hub-connection';
import type { HubSyncService } from '../../services/hub/hub-sync';
import type { IpcRouter } from '../router';

export function registerHubHandlers(
  router: IpcRouter,
  connectionManager: HubConnectionManager,
  syncService: HubSyncService,
): void {
  router.handle('hub.connect', async ({ url, apiKey }) => {
    connectionManager.configure(url, apiKey);
    const result = await connectionManager.connect();
    return { success: result.success, error: result.error };
  });

  router.handle('hub.disconnect', () => {
    connectionManager.disconnect();
    return Promise.resolve({ success: true });
  });

  router.handle('hub.getStatus', () => {
    const connection = connectionManager.getConnection();
    return Promise.resolve({
      status: connectionManager.getStatus(),
      hubUrl: connection?.hubUrl,
      enabled: connection?.enabled ?? false,
      lastConnected: connection?.lastConnected,
      pendingMutations: syncService.getPendingCount(),
    });
  });

  router.handle('hub.sync', async () => {
    const syncedCount = await syncService.syncPending();
    return { syncedCount, pendingCount: syncService.getPendingCount() };
  });

  router.handle('hub.getConfig', () => {
    const connection = connectionManager.getConnection();
    return Promise.resolve({
      hubUrl: connection?.hubUrl,
      enabled: connection?.enabled ?? false,
      lastConnected: connection?.lastConnected,
    });
  });

  router.handle('hub.removeConfig', () => {
    connectionManager.removeConfig();
    return Promise.resolve({ success: true });
  });
}
