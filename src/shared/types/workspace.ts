/**
 * Workspace domain types
 */

export interface WorkspaceSettings {
  autoStart: boolean;
  maxConcurrent: number;
  defaultBranch: string;
}

export interface Workspace {
  id: string;
  name: string;
  description?: string;
  hostDeviceId?: string;
  projectIds: string[];
  settings: WorkspaceSettings;
  createdAt: string;
  updatedAt: string;
}

export interface Device {
  id: string;
  name: string;
  platform: string;
  online: boolean;
  lastSeen: string;
}
