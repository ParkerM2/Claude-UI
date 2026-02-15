/**
 * Workspace IPC handlers — Proxies to Hub API via HubApiClient
 */

import type { Workspace, WorkspaceSettings } from '@shared/types';

import type { HubApiClient } from '../../services/hub/hub-api-client';
import type { IpcRouter } from '../router';

/**
 * Transform a Hub API workspace response to the local Workspace shape.
 * Hub settings use `autoStartQueuedTasks` / `maxConcurrentAgents` while local
 * code expects `autoStart` / `maxConcurrent` / `defaultBranch` (all required).
 */
function transformHubWorkspace(raw: Record<string, unknown>): Workspace {
  const hubSettings = (raw.settings ?? {}) as Record<string, unknown>;

  const settings: WorkspaceSettings = {
    autoStart:
      (hubSettings.autoStartQueuedTasks as boolean | undefined) ??
      (hubSettings.autoStart as boolean | undefined) ??
      false,
    maxConcurrent:
      (hubSettings.maxConcurrentAgents as number | undefined) ??
      (hubSettings.maxConcurrent as number | undefined) ??
      3,
    defaultBranch: (hubSettings.defaultBranch as string | undefined) ?? 'main',
  };

  return {
    id: raw.id as string,
    name: raw.name as string,
    description: raw.description as string | undefined,
    hostDeviceId: raw.hostDeviceId as string | undefined,
    settings,
    createdAt: raw.createdAt as string,
    updatedAt: raw.updatedAt as string,
  };
}

export function registerWorkspaceHandlers(router: IpcRouter, hubApiClient: HubApiClient): void {
  router.handle('workspaces.list', async () => {
    const result = await hubApiClient.hubGet<{ workspaces: Array<Record<string, unknown>> }>(
      '/api/workspaces',
    );

    if (!result.ok || !result.data) {
      throw new Error(result.error ?? 'Failed to fetch workspaces');
    }

    return result.data.workspaces.map(transformHubWorkspace);
  });

  router.handle('workspaces.create', async ({ name, description }) => {
    const result = await hubApiClient.hubPost<Record<string, unknown>>('/api/workspaces', {
      name,
      description,
    });

    if (!result.ok || !result.data) {
      throw new Error(result.error ?? 'Failed to create workspace');
    }

    return transformHubWorkspace(result.data);
  });

  router.handle('workspaces.update', async ({ id, ...updates }) => {
    const result = await hubApiClient.hubPatch<Record<string, unknown>>(
      `/api/workspaces/${encodeURIComponent(id)}`,
      updates,
    );

    if (!result.ok || !result.data) {
      throw new Error(result.error ?? `Failed to update workspace ${id}`);
    }

    return transformHubWorkspace(result.data);
  });

  router.handle('workspaces.delete', async ({ id }) => {
    const result = await hubApiClient.hubDelete(`/api/workspaces/${encodeURIComponent(id)}`);

    if (!result.ok) {
      throw new Error(result.error ?? `Failed to delete workspace ${id}`);
    }

    return { success: true };
  });
}
