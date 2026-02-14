/**
 * Workspace IPC handlers — stub implementation with in-memory data
 */

import type { Device, Workspace } from '@shared/types';

import type { IpcRouter } from '../router';

const workspaces: Workspace[] = [
  {
    id: 'ws-1',
    name: 'Personal Projects',
    description: 'Side projects and experiments',
    hostDeviceId: 'dev-1',
    projectIds: [],
    settings: { autoStart: false, maxConcurrent: 2, defaultBranch: 'main' },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const devices: Device[] = [
  {
    id: 'dev-1',
    name: 'Desktop PC',
    platform: 'win32',
    online: true,
    lastSeen: new Date().toISOString(),
  },
  {
    id: 'dev-2',
    name: 'Laptop',
    platform: 'darwin',
    online: false,
    lastSeen: new Date(Date.now() - 86_400_000).toISOString(),
  },
];

let nextWorkspaceId = 2;

export function registerWorkspaceHandlers(router: IpcRouter): void {
  router.handle('workspaces.list', () => Promise.resolve([...workspaces]));

  router.handle('workspaces.create', ({ name, description }) => {
    const workspace: Workspace = {
      id: `ws-${String(nextWorkspaceId++)}`,
      name,
      description,
      projectIds: [],
      settings: { autoStart: false, maxConcurrent: 2, defaultBranch: 'main' },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    workspaces.push(workspace);
    return Promise.resolve(workspace);
  });

  router.handle('workspaces.update', ({ id, ...updates }) => {
    const index = workspaces.findIndex((w) => w.id === id);
    if (index === -1) {
      return Promise.reject(new Error(`Workspace ${id} not found`));
    }
    const existing = workspaces[index];
    const updated: Workspace = {
      ...existing,
      name: updates.name ?? existing.name,
      description: updates.description ?? existing.description,
      hostDeviceId: updates.hostDeviceId ?? existing.hostDeviceId,
      settings: updates.settings
        ? { ...existing.settings, ...updates.settings }
        : existing.settings,
      updatedAt: new Date().toISOString(),
    };
    workspaces[index] = updated;
    return Promise.resolve(updated);
  });

  router.handle('workspaces.delete', ({ id }) => {
    const index = workspaces.findIndex((w) => w.id === id);
    if (index !== -1) {
      workspaces.splice(index, 1);
    }
    return Promise.resolve({ success: true });
  });

  router.handle('devices.list', () => Promise.resolve([...devices]));
}
