# Team Alpha Playbook — Hub Connection Layer

**Status**: READY TO START
**Branch**: `feature/alpha-hub-connection`
**Base**: `master`
**Coordination**: `docs/plans/2026-02-14-hub-frontend-integration.md`
**Progress File**: `docs/progress/alpha-hub-connection-progress.md`

---

## Mission

Build the WebSocket connection layer in main process that connects to Hub, receives real-time events, and relays them to the renderer via IPC. Expand the Hub API client with full CRUD methods.

---

## Quick Start

```bash
cd Claude-UI
git checkout master && git pull
git checkout -b feature/alpha-hub-connection
```

---

## Wave 1: WebSocket Foundation

**Goal**: Connect to Hub WebSocket, handle auth, auto-reconnect, and relay events to renderer.

### 1.1 Hub WebSocket Service

**File**: `src/main/services/hub/hub-websocket.ts`

```typescript
/**
 * Hub WebSocket — Real-time connection to Hub server
 *
 * Features:
 * - First-message auth protocol (send API key)
 * - Auto-reconnect with exponential backoff
 * - Parse WsBroadcastMessage and emit typed IPC events
 */

import WebSocket from 'ws';
import { BrowserWindow } from 'electron';

interface WsBroadcastMessage {
  type: 'mutation';
  entity: string;
  action: 'created' | 'updated' | 'deleted' | 'progress' | 'completed' | 'execute' | 'cancel';
  id: string;
  data: unknown;
  timestamp: string;
}

interface HubWebSocketOptions {
  hubUrl: string;
  apiKey: string;
  onStatusChange?: (status: 'connected' | 'disconnected' | 'connecting') => void;
}

export class HubWebSocket {
  private ws: WebSocket | null = null;
  private hubUrl: string;
  private apiKey: string;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 10;
  private reconnectDelay = 1000;
  private status: 'connected' | 'disconnected' | 'connecting' = 'disconnected';
  private onStatusChange?: (status: 'connected' | 'disconnected' | 'connecting') => void;

  constructor(options: HubWebSocketOptions) {
    this.hubUrl = options.hubUrl.replace(/^http/, 'ws') + '/ws';
    this.apiKey = options.apiKey;
    this.onStatusChange = options.onStatusChange;
  }

  connect(): void {
    if (this.ws) {
      this.ws.close();
    }

    this.setStatus('connecting');
    this.ws = new WebSocket(this.hubUrl);

    this.ws.on('open', () => {
      // Send auth message
      this.ws?.send(JSON.stringify({ type: 'auth', apiKey: this.apiKey }));
      this.setStatus('connected');
      this.reconnectAttempts = 0;
      console.log('[HubWS] Connected');
    });

    this.ws.on('message', (data) => {
      try {
        const msg = JSON.parse(String(data)) as WsBroadcastMessage;
        if (msg.type === 'mutation') {
          this.emitEvent(msg);
        }
      } catch (err) {
        console.error('[HubWS] Failed to parse message:', err);
      }
    });

    this.ws.on('close', (code) => {
      console.log(`[HubWS] Disconnected (code: ${code})`);
      this.setStatus('disconnected');
      this.scheduleReconnect();
    });

    this.ws.on('error', (err) => {
      console.error('[HubWS] Error:', err.message);
    });
  }

  disconnect(): void {
    this.reconnectAttempts = this.maxReconnectAttempts; // Prevent reconnect
    this.ws?.close();
    this.ws = null;
    this.setStatus('disconnected');
  }

  getStatus(): 'connected' | 'disconnected' | 'connecting' {
    return this.status;
  }

  private setStatus(status: 'connected' | 'disconnected' | 'connecting'): void {
    this.status = status;
    this.onStatusChange?.(status);
  }

  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('[HubWS] Max reconnect attempts reached');
      return;
    }

    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts);
    this.reconnectAttempts++;
    console.log(`[HubWS] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`);

    setTimeout(() => {
      this.connect();
    }, delay);
  }

  private emitEvent(msg: WsBroadcastMessage): void {
    const channel = `event:hub.${msg.entity}.${msg.action}`;
    const windows = BrowserWindow.getAllWindows();
    for (const win of windows) {
      win.webContents.send(channel, msg.data);
    }
  }
}
```

### 1.2 Hub Event Types

**File**: `src/shared/types/hub-events.ts`

```typescript
/**
 * Hub WebSocket event types
 */

export interface HubTaskEvent {
  id: string;
  title: string;
  status: string;
  projectId: string;
  workspaceId: string | null;
  progress?: {
    phase: string;
    phaseIndex: number;
    totalPhases: number;
  };
}

export interface HubDeviceEvent {
  id: string;
  deviceName: string;
  deviceType: 'desktop' | 'mobile' | 'web';
  isOnline: boolean;
}

export interface HubWorkspaceEvent {
  id: string;
  name: string;
  hostDeviceId: string | null;
}

export interface HubProjectEvent {
  id: string;
  name: string;
  path: string;
  workspaceId: string | null;
}

export type HubEventEntity = 'tasks' | 'devices' | 'workspaces' | 'projects' | 'sub_projects';
export type HubEventAction = 'created' | 'updated' | 'deleted' | 'progress' | 'completed' | 'execute' | 'cancel';

export interface HubBroadcastMessage {
  type: 'mutation';
  entity: HubEventEntity;
  action: HubEventAction;
  id: string;
  data: unknown;
  timestamp: string;
}
```

### 1.3 Update IPC Contract

**File**: `src/shared/ipc-contract.ts`

Add to `ipcEventContract`:

```typescript
// ── Hub Events ──
'event:hub.tasks.created': {
  payload: z.object({ id: z.string(), data: z.unknown() }),
},
'event:hub.tasks.updated': {
  payload: z.object({ id: z.string(), data: z.unknown() }),
},
'event:hub.tasks.deleted': {
  payload: z.object({ id: z.string() }),
},
'event:hub.tasks.progress': {
  payload: z.object({ id: z.string(), progress: z.unknown() }),
},
'event:hub.tasks.completed': {
  payload: z.object({ id: z.string(), result: z.string() }),
},
// ... similar for devices, workspaces, projects
```

### 1.4 Initialize WebSocket in Main

**File**: `src/main/index.ts`

```typescript
import { HubWebSocket } from './services/hub/hub-websocket';

let hubWs: HubWebSocket | null = null;

// When hub config is available:
function connectToHub(config: { url: string; apiKey: string }) {
  hubWs = new HubWebSocket({
    hubUrl: config.url,
    apiKey: config.apiKey,
    onStatusChange: (status) => {
      // Emit status to renderer
      BrowserWindow.getAllWindows().forEach(win => {
        win.webContents.send('event:hub.connection.status', { status });
      });
    },
  });
  hubWs.connect();
}

// Add IPC handler for status
ipcMain.handle('hub.ws.status', () => ({
  status: hubWs?.getStatus() ?? 'disconnected',
}));
```

---

## Wave 1 Checklist

- [ ] Create `hub-websocket.ts`
- [ ] Create `hub-events.ts` types
- [ ] Update `ipc-contract.ts` with event channels
- [ ] Initialize WebSocket in main process
- [ ] Add `hub.ws.status` IPC handler
- [ ] Test: Connect to Hub, receive events
- [ ] Update progress file

**Sync Point**: Test with Team Beta's event hooks.

---

## Wave 2: Task Hub Integration

### 2.1 Expand Hub API Client

**File**: `src/main/services/hub/hub-api-client.ts`

Add methods:

```typescript
// Tasks
async createTask(data: CreateTaskInput): Promise<Task> {
  return this.post('/api/tasks', data);
}

async updateTask(id: string, data: UpdateTaskInput): Promise<Task> {
  return this.put(`/api/tasks/${id}`, data);
}

async updateTaskStatus(id: string, status: string): Promise<Task> {
  return this.patch(`/api/tasks/${id}/status`, { status });
}

async deleteTask(id: string): Promise<{ success: boolean }> {
  return this.delete(`/api/tasks/${id}`);
}

async executeTask(id: string): Promise<{ queued: boolean; taskId: string }> {
  return this.post(`/api/tasks/${id}/execute`, {});
}

async cancelTask(id: string): Promise<{ cancelled: boolean }> {
  return this.post(`/api/tasks/${id}/cancel`, {});
}

async completeTask(id: string, result: { result: 'success' | 'error'; summary?: string }): Promise<Task> {
  return this.post(`/api/tasks/${id}/complete`, result);
}
```

### 2.2 Hub Task IPC Handlers

**File**: `src/main/ipc/handlers/hub-handlers.ts`

```typescript
router.handle('hub.tasks.list', async ({ projectId, workspaceId }) => {
  const params = new URLSearchParams();
  if (projectId) params.set('project_id', projectId);
  if (workspaceId) params.set('workspace_id', workspaceId);
  return hubClient.listTasks(params);
});

router.handle('hub.tasks.create', (data) => hubClient.createTask(data));
router.handle('hub.tasks.update', ({ id, ...data }) => hubClient.updateTask(id, data));
router.handle('hub.tasks.updateStatus', ({ taskId, status }) => hubClient.updateTaskStatus(taskId, status));
router.handle('hub.tasks.delete', ({ taskId }) => hubClient.deleteTask(taskId));
router.handle('hub.tasks.execute', ({ taskId }) => hubClient.executeTask(taskId));
```

### 2.3 Update IPC Contract

Add to `ipcInvokeContract`:

```typescript
'hub.tasks.list': {
  input: z.object({ projectId: z.string().optional(), workspaceId: z.string().optional() }),
  output: z.array(TaskSchema),
},
'hub.tasks.create': {
  input: TaskCreateSchema,
  output: TaskSchema,
},
// ... etc
```

---

## Wave 2 Checklist

- [ ] Add task methods to `hub-api-client.ts`
- [ ] Add `hub.tasks.*` IPC handlers
- [ ] Update IPC contract
- [ ] Test: Create task via IPC, verify Hub receives
- [ ] Update progress file

---

## Wave 3: Auth & Token Storage

### 3.1 Token Store

**File**: `src/main/services/hub/hub-token-store.ts`

```typescript
import Store from 'electron-store';

interface TokenData {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
}

const store = new Store<{ hubTokens?: TokenData }>({
  name: 'hub-auth',
  encryptionKey: 'your-encryption-key', // Or use safeStorage
});

export const tokenStore = {
  getTokens(): TokenData | null {
    return store.get('hubTokens') ?? null;
  },

  setTokens(tokens: TokenData): void {
    store.set('hubTokens', tokens);
  },

  clearTokens(): void {
    store.delete('hubTokens');
  },

  isExpired(): boolean {
    const tokens = this.getTokens();
    if (!tokens) return true;
    return new Date(tokens.expiresAt) <= new Date();
  },
};
```

### 3.2 Auth API Methods

**File**: `src/main/services/hub/hub-api-client.ts`

```typescript
async register(data: { email: string; password: string; displayName: string }): Promise<AuthResponse> {
  const response = await this.post('/api/auth/register', data);
  tokenStore.setTokens({
    accessToken: response.accessToken,
    refreshToken: response.refreshToken,
    expiresAt: response.expiresAt,
  });
  return response;
}

async login(data: { email: string; password: string; device?: DeviceInfo }): Promise<AuthResponse> {
  const response = await this.post('/api/auth/login', data);
  tokenStore.setTokens({ ... });
  return response;
}

async logout(): Promise<void> {
  await this.post('/api/auth/logout', {});
  tokenStore.clearTokens();
}

async refreshToken(): Promise<{ accessToken: string }> {
  const tokens = tokenStore.getTokens();
  if (!tokens) throw new Error('No tokens');
  const response = await this.post('/api/auth/refresh', { refreshToken: tokens.refreshToken });
  tokenStore.setTokens({ ...tokens, accessToken: response.accessToken, expiresAt: response.expiresAt });
  return response;
}
```

### 3.3 Auto-Refresh

Add token refresh logic before API calls:

```typescript
private async request<T>(method: string, path: string, body?: unknown): Promise<T> {
  // Check if token needs refresh
  if (tokenStore.isExpired()) {
    await this.refreshToken();
  }

  const tokens = tokenStore.getTokens();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (tokens) {
    headers['Authorization'] = `Bearer ${tokens.accessToken}`;
  }

  // ... make request
}
```

### 3.4 Auth IPC Handlers

```typescript
router.handle('hub.auth.register', (data) => hubClient.register(data));
router.handle('hub.auth.login', (data) => hubClient.login(data));
router.handle('hub.auth.logout', () => hubClient.logout());
router.handle('hub.auth.me', () => hubClient.getCurrentUser());
```

---

## Wave 3 Checklist

- [ ] Create `hub-token-store.ts`
- [ ] Add auth methods to API client
- [ ] Implement auto-refresh
- [ ] Add auth IPC handlers
- [ ] Test: Register → Login → Token persists → Refresh works
- [ ] Update progress file

---

## Wave 4: Device & Cleanup

### 4.1 Device Registration

On first login, register this device:

```typescript
async registerDevice(): Promise<Device> {
  const machineId = getMachineId(); // Use node-machine-id or similar
  return this.post('/api/devices', {
    machineId,
    deviceType: 'desktop',
    deviceName: os.hostname(),
    capabilities: { canExecute: true, repos: [] },
    appVersion: app.getVersion(),
  });
}
```

### 4.2 Device Heartbeat

```typescript
// In main process, every 30 seconds:
setInterval(() => {
  if (hubClient.isConnected()) {
    void hubClient.heartbeat(deviceId);
  }
}, 30000);
```

### 4.3 Remove Mocks

- Delete `MOCK_USER`, `MOCK_TOKEN` from `auth-handlers.ts`
- Remove fallback mock logic

### 4.4 Error Handling

Standardize all API errors:

```typescript
class HubApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}
```

---

## Wave 4 Checklist

- [ ] Add device registration
- [ ] Add heartbeat
- [ ] Remove all mock auth
- [ ] Standardize errors
- [ ] Full verification
- [ ] Update progress file to COMPLETE

---

## Files to Create/Modify

### New Files
- `src/main/services/hub/hub-websocket.ts`
- `src/main/services/hub/hub-token-store.ts`
- `src/shared/types/hub-events.ts`

### Modified Files
- `src/main/services/hub/hub-api-client.ts`
- `src/main/ipc/handlers/hub-handlers.ts`
- `src/main/index.ts`
- `src/shared/ipc-contract.ts`

---

## When Done

1. Run verification:
   ```bash
   npm run lint && npx tsc --noEmit && npm run build
   ```

2. Update progress file to COMPLETE

3. Push and create PR:
   ```bash
   git push -u origin feature/alpha-hub-connection
   ```

4. Coordinate with Team Beta for final merge
