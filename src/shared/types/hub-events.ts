/**
 * Hub WebSocket Event Types
 *
 * Type definitions for all real-time events broadcast by Hub.
 * These match the WsBroadcastMessage format from hub-device-protocol.md v2.0.0
 */

// ─── Event Entities & Actions ────────────────────────────────────

export type HubEventEntity =
  | 'tasks'
  | 'devices'
  | 'workspaces'
  | 'projects'
  | 'sub_projects';

export type HubEventAction =
  | 'created'
  | 'updated'
  | 'deleted'
  | 'progress'
  | 'completed'
  | 'execute'
  | 'cancel';

// ─── Broadcast Message Format ────────────────────────────────────

export interface HubBroadcastMessage<T = unknown> {
  type: 'mutation';
  entity: HubEventEntity;
  action: HubEventAction;
  id: string;
  data: T;
  timestamp: string;
}

// ─── Task Event Payloads ─────────────────────────────────────────

export interface HubTaskProgress {
  phase: string;
  phaseIndex: number;
  totalPhases: number;
  currentAgent: string | null;
  filesChanged: number;
  lastActivity: string;
  logs: string[];
}

export interface HubTaskData {
  id: string;
  projectId: string;
  workspaceId: string | null;
  subProjectId: string | null;
  title: string;
  description: string;
  status: string;
  priority: number;
  assignedDeviceId: string | null;
  createdByDeviceId: string | null;
  executionSessionId: string | null;
  progress: HubTaskProgress | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
}

export interface HubTaskCompletedData {
  id: string;
  result: 'success' | 'error';
  prUrl?: string;
  summary?: string;
  errorMessage?: string;
}

export interface HubTaskExecuteData {
  id: string;
  hostDeviceId: string;
  task: HubTaskData;
}

export interface HubTaskCancelData {
  id: string;
  reason?: string;
}

// ─── Device Event Payloads ───────────────────────────────────────

export interface HubDeviceCapabilities {
  canExecute: boolean;
  repos: string[];
}

export interface HubDeviceData {
  id: string;
  machineId: string | null;
  userId: string;
  deviceType: 'desktop' | 'mobile' | 'web';
  deviceName: string;
  capabilities: HubDeviceCapabilities;
  isOnline: boolean;
  lastSeen: string | null;
  appVersion: string | null;
  createdAt: string;
}

// ─── Workspace Event Payloads ────────────────────────────────────

export interface HubWorkspaceData {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  hostDeviceId: string | null;
  settings: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
}

// ─── Project Event Payloads ──────────────────────────────────────

export interface HubProjectData {
  id: string;
  name: string;
  path: string;
  workspaceId: string | null;
  gitUrl: string | null;
  repoStructure: 'single' | 'monorepo' | 'multi-repo';
  defaultBranch: string | null;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface HubSubProjectData {
  id: string;
  projectId: string;
  name: string;
  relativePath: string;
  gitUrl: string | null;
  defaultBranch: string | null;
  createdAt: string;
}

// ─── Connection Status ───────────────────────────────────────────

export type HubConnectionStatus = 'connected' | 'disconnected' | 'connecting' | 'error';

export interface HubConnectionState {
  status: HubConnectionStatus;
  lastConnectedAt: string | null;
  reconnectAttempts: number;
  error: string | null;
}

// ─── Event Channel Names ─────────────────────────────────────────

export const HUB_EVENT_CHANNELS = {
  // Tasks
  TASKS_CREATED: 'event:hub.tasks.created',
  TASKS_UPDATED: 'event:hub.tasks.updated',
  TASKS_DELETED: 'event:hub.tasks.deleted',
  TASKS_PROGRESS: 'event:hub.tasks.progress',
  TASKS_COMPLETED: 'event:hub.tasks.completed',
  TASKS_EXECUTE: 'event:hub.tasks.execute',
  TASKS_CANCEL: 'event:hub.tasks.cancel',

  // Devices
  DEVICES_CREATED: 'event:hub.devices.created',
  DEVICES_UPDATED: 'event:hub.devices.updated',
  DEVICES_DELETED: 'event:hub.devices.deleted',

  // Workspaces
  WORKSPACES_CREATED: 'event:hub.workspaces.created',
  WORKSPACES_UPDATED: 'event:hub.workspaces.updated',
  WORKSPACES_DELETED: 'event:hub.workspaces.deleted',

  // Projects
  PROJECTS_CREATED: 'event:hub.projects.created',
  PROJECTS_UPDATED: 'event:hub.projects.updated',
  PROJECTS_DELETED: 'event:hub.projects.deleted',

  // Sub-projects
  SUB_PROJECTS_CREATED: 'event:hub.sub_projects.created',
  SUB_PROJECTS_DELETED: 'event:hub.sub_projects.deleted',

  // Connection
  CONNECTION_STATUS: 'event:hub.connection.status',
} as const;

export type HubEventChannel = (typeof HUB_EVENT_CHANNELS)[keyof typeof HUB_EVENT_CHANNELS];
