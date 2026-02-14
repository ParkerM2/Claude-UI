/**
 * Hub IPC handlers
 */

import type { TaskPriority, TaskStatus } from '@shared/types/hub-protocol';

import { HubApiError } from '../../services/hub/hub-errors';

import type { HubApiClient } from '../../services/hub/hub-api-client';
import type { HubConnectionManager } from '../../services/hub/hub-connection';
import type { HubSyncService } from '../../services/hub/hub-sync';
import type { IpcRouter } from '../router';

/**
 * Helper to throw a HubApiError from an API response.
 */
function throwIfError(response: { ok: boolean; error?: string; statusCode?: number }, fallback: string): void {
  if (!response.ok) {
    throw new HubApiError(
      response.statusCode ?? 500,
      response.error ?? fallback,
    );
  }
}

export function registerHubHandlers(
  router: IpcRouter,
  connectionManager: HubConnectionManager,
  syncService: HubSyncService,
  hubApiClient: HubApiClient,
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

  // ── Hub Tasks handlers ──────────────────────────────────────────

  router.handle('hub.tasks.list', async ({ projectId, workspaceId }) => {
    const query: Record<string, string> = {};
    if (projectId) {
      query.projectId = projectId;
    }
    if (workspaceId) {
      query.workspaceId = workspaceId;
    }
    const response = await hubApiClient.listTasks(query);
    throwIfError(response, 'Failed to list tasks');
    return response.data ?? { tasks: [] };
  });

  router.handle('hub.tasks.get', async ({ taskId }) => {
    const response = await hubApiClient.getTask(taskId);
    throwIfError(response, 'Failed to get task');
    return response.data;
  });

  router.handle('hub.tasks.create', async ({ title, description, projectId, workspaceId: _workspaceId, priority }) => {
    const response = await hubApiClient.createTask({
      title,
      description: description ?? '',
      projectId,
      priority: priority as TaskPriority | undefined,
    });
    throwIfError(response, 'Failed to create task');
    return response.data;
  });

  router.handle('hub.tasks.update', async ({ taskId, title, description, priority, status }) => {
    const response = await hubApiClient.updateTask(taskId, {
      title,
      description,
      priority: priority as TaskPriority | undefined,
      status: status as TaskStatus | undefined,
    });
    throwIfError(response, 'Failed to update task');
    return response.data;
  });

  router.handle('hub.tasks.updateStatus', async ({ taskId, status }) => {
    const response = await hubApiClient.updateTaskStatus(taskId, status as TaskStatus);
    throwIfError(response, 'Failed to update task status');
    return response.data;
  });

  router.handle('hub.tasks.delete', async ({ taskId }) => {
    const response = await hubApiClient.deleteTask(taskId);
    throwIfError(response, 'Failed to delete task');
    return { success: true };
  });

  router.handle('hub.tasks.execute', async ({ taskId }) => {
    const response = await hubApiClient.executeTask(taskId);
    throwIfError(response, 'Failed to execute task');
    if (!response.data) {
      throw new HubApiError(500, 'No data returned from execute task');
    }
    return { sessionId: response.data.sessionId, status: response.data.status };
  });

  router.handle('hub.tasks.cancel', async ({ taskId, reason }) => {
    const response = await hubApiClient.cancelTask(taskId, reason);
    throwIfError(response, 'Failed to cancel task');
    if (!response.data) {
      throw new HubApiError(500, 'No data returned from cancel task');
    }
    return { success: response.data.success, previousStatus: response.data.previousStatus };
  });
}
