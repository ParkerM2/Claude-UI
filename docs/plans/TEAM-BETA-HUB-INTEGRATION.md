# Team Beta Playbook — Hub Frontend Integration

**Status**: READY TO START
**Branch**: `feature/beta-frontend-integration`
**Base**: `master`
**Coordination**: `docs/plans/2026-02-14-hub-frontend-integration.md`
**Progress File**: `docs/progress/beta-frontend-integration-progress.md`

---

## Mission

Wire the frontend to consume Hub API via WebSocket events and IPC handlers. Replace local-only operations with Hub-synced operations for real-time multi-device support.

---

## Quick Start

```bash
cd Claude-UI
git checkout master && git pull
git checkout -b feature/beta-frontend-integration
```

---

## Wave 1: Event Infrastructure

**Goal**: Create the hooks and utilities to receive Hub WebSocket events and invalidate React Query caches.

### 1.1 Create Hub Event Hook

**File**: `src/renderer/shared/hooks/useHubEvents.ts`

```typescript
/**
 * useHubEvent — Subscribe to Hub WebSocket events via IPC
 *
 * Usage:
 *   useHubEvent('hub.tasks.created', (data) => {
 *     console.log('Task created:', data);
 *   });
 */
import { useEffect } from 'react';
import { ipcOn, ipcOff } from '@renderer/shared/lib/ipc';

type HubEventType =
  | 'hub.tasks.created'
  | 'hub.tasks.updated'
  | 'hub.tasks.deleted'
  | 'hub.tasks.progress'
  | 'hub.tasks.completed'
  | 'hub.devices.created'
  | 'hub.devices.updated'
  | 'hub.devices.deleted'
  | 'hub.workspaces.created'
  | 'hub.workspaces.updated'
  | 'hub.workspaces.deleted'
  | 'hub.projects.created'
  | 'hub.projects.updated'
  | 'hub.projects.deleted';

export function useHubEvent<T = unknown>(
  eventType: HubEventType,
  callback: (data: T) => void,
): void {
  useEffect(() => {
    const channel = `event:${eventType}`;
    ipcOn(channel, callback);
    return () => {
      ipcOff(channel, callback);
    };
  }, [eventType, callback]);
}
```

### 1.2 Create Query Invalidation Sync

**File**: `src/renderer/shared/lib/hub-query-sync.ts`

```typescript
/**
 * Hub Query Sync — Invalidate React Query caches on Hub events
 */
import { QueryClient } from '@tanstack/react-query';
import { ipcOn } from '@renderer/shared/lib/ipc';

const EVENT_TO_QUERY_MAP: Record<string, string[]> = {
  'hub.tasks.created': ['tasks'],
  'hub.tasks.updated': ['tasks'],
  'hub.tasks.deleted': ['tasks'],
  'hub.tasks.progress': ['tasks'],
  'hub.tasks.completed': ['tasks'],
  'hub.devices.created': ['devices'],
  'hub.devices.updated': ['devices'],
  'hub.devices.deleted': ['devices'],
  'hub.workspaces.created': ['workspaces'],
  'hub.workspaces.updated': ['workspaces'],
  'hub.workspaces.deleted': ['workspaces'],
  'hub.projects.created': ['projects'],
  'hub.projects.updated': ['projects'],
  'hub.projects.deleted': ['projects'],
};

export function setupHubQuerySync(queryClient: QueryClient): () => void {
  const handlers: Array<{ channel: string; handler: () => void }> = [];

  for (const [event, queryKeys] of Object.entries(EVENT_TO_QUERY_MAP)) {
    const channel = `event:${event}`;
    const handler = () => {
      for (const key of queryKeys) {
        void queryClient.invalidateQueries({ queryKey: [key] });
      }
    };
    ipcOn(channel, handler);
    handlers.push({ channel, handler });
  }

  // Return cleanup function
  return () => {
    for (const { channel, handler } of handlers) {
      ipcOff(channel, handler);
    }
  };
}
```

### 1.3 Wire Into App

**File**: `src/renderer/app/providers/QueryProvider.tsx` (or wherever QueryClient is created)

```typescript
import { setupHubQuerySync } from '@renderer/shared/lib/hub-query-sync';

// In the provider component:
useEffect(() => {
  const cleanup = setupHubQuerySync(queryClient);
  return cleanup;
}, [queryClient]);
```

### 1.4 Connection Status Component

**File**: `src/renderer/shared/components/HubStatus.tsx`

```typescript
import { useQuery } from '@tanstack/react-query';
import { ipc } from '@renderer/shared/lib/ipc';
import { Wifi, WifiOff, Loader2 } from 'lucide-react';

export function HubStatus() {
  const { data: status } = useQuery({
    queryKey: ['hub', 'status'],
    queryFn: () => ipc('hub.getStatus', {}),
    refetchInterval: 5000,
  });

  if (!status) return null;

  return (
    <div className="flex items-center gap-1 text-xs text-muted-foreground">
      {status.connected ? (
        <>
          <Wifi className="h-3 w-3 text-success" />
          <span>Hub</span>
        </>
      ) : status.connecting ? (
        <>
          <Loader2 className="h-3 w-3 animate-spin" />
          <span>Connecting...</span>
        </>
      ) : (
        <>
          <WifiOff className="h-3 w-3 text-destructive" />
          <span>Offline</span>
        </>
      )}
    </div>
  );
}
```

**Add to TopBar**: Import and add `<HubStatus />` to the top bar.

---

## Wave 1 Checklist

- [ ] Create `useHubEvents.ts`
- [ ] Create `hub-query-sync.ts`
- [ ] Wire sync into QueryProvider
- [ ] Create `HubStatus.tsx`
- [ ] Add HubStatus to TopBar
- [ ] Test: Start app, verify no errors
- [ ] Update progress file

**Sync Point**: Wait for Team Alpha to complete WebSocket layer, then test end-to-end.

---

## Wave 2: Task Integration

**Goal**: Route all task operations through Hub API instead of local IPC.

### 2.1 Update Task Query

**File**: `src/renderer/features/tasks/api/useTasks.ts`

Change:
```typescript
// OLD
queryFn: () => ipc('tasks.list', { projectId }),

// NEW
queryFn: () => ipc('hub.tasks.list', { projectId, workspaceId }),
```

Add workspaceId from settings/context.

### 2.2 Update Task Mutations

**File**: `src/renderer/features/tasks/api/useTaskMutations.ts`

```typescript
// useCreateTask
mutationFn: (data) => ipc('hub.tasks.create', data),

// useUpdateTaskStatus
mutationFn: ({ taskId, status }) => ipc('hub.tasks.updateStatus', { taskId, status }),

// useDeleteTask
mutationFn: (taskId) => ipc('hub.tasks.delete', { taskId }),

// useExecuteTask
mutationFn: (taskId) => ipc('hub.tasks.execute', { taskId }),
```

Remove optimistic updates — WebSocket events will trigger query invalidation.

### 2.3 Update Task Event Listeners

**File**: `src/renderer/features/tasks/hooks/useTaskEvents.ts`

```typescript
import { useHubEvent } from '@renderer/shared/hooks/useHubEvents';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export function useTaskEvents() {
  const queryClient = useQueryClient();

  useHubEvent('hub.tasks.completed', (data: { taskId: string; result: string }) => {
    void queryClient.invalidateQueries({ queryKey: ['tasks'] });
    if (data.result === 'success') {
      toast.success('Task completed successfully');
    } else {
      toast.error('Task failed');
    }
  });

  useHubEvent('hub.tasks.progress', (data: { taskId: string; progress: unknown }) => {
    // Update specific task in cache without full refetch
    queryClient.setQueryData(['tasks'], (old: Task[] | undefined) => {
      if (!old) return old;
      return old.map(t => t.id === data.taskId ? { ...t, progress: data.progress } : t);
    });
  });
}
```

### 2.4 Live Progress in TaskTableRow

Update `TaskTableRow.tsx` to show progress from WebSocket updates (already in cache via setQueryData).

---

## Wave 2 Checklist

- [ ] Update `useTasks.ts` to use `hub.tasks.list`
- [ ] Update all mutations to use `hub.tasks.*`
- [ ] Remove optimistic updates
- [ ] Update `useTaskEvents.ts` for hub events
- [ ] Add progress cache updates
- [ ] Test: Create task, verify appears on other device
- [ ] Update progress file

**Sync Point**: Multi-device test with Team Alpha.

---

## Wave 3: Auth & Workspace Integration

### 3.1 Update Auth Store

**File**: `src/renderer/features/auth/store.ts`

```typescript
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;
}
```

Remove any mock user references.

### 3.2 Update Auth Hooks

**File**: `src/renderer/features/auth/api/useAuth.ts`

```typescript
export function useLogin() {
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: (data: { email: string; password: string }) =>
      ipc('hub.auth.login', data),
    onSuccess: (response) => {
      setUser(response.user);
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (data: { email: string; password: string; displayName: string }) =>
      ipc('hub.auth.register', data),
  });
}

export function useLogout() {
  const logout = useAuthStore((s) => s.logout);

  return useMutation({
    mutationFn: () => ipc('hub.auth.logout', {}),
    onSuccess: () => {
      logout();
    },
  });
}

export function useCurrentUser() {
  const setUser = useAuthStore((s) => s.setUser);

  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: () => ipc('hub.auth.me', {}),
    onSuccess: (user) => {
      setUser(user);
    },
  });
}
```

### 3.3 Auth Guard

Create a component or hook that checks auth state and redirects to login if not authenticated.

### 3.4 Workspace Hooks

**File**: `src/renderer/features/settings/api/useWorkspaces.ts`

Update to use `hub.workspaces.*` channels.

---

## Wave 3 Checklist

- [ ] Update auth store (remove mocks)
- [ ] Update `useLogin`, `useRegister`, `useLogout`
- [ ] Add `useCurrentUser` hook
- [ ] Create auth guard/redirect
- [ ] Update workspace hooks
- [ ] Test: Register → Login → Create workspace
- [ ] Update progress file

---

## Wave 4: Polish

### 4.1 Loading States

Add skeleton loaders to:
- TaskTable (while loading)
- WorkspacesTab (while loading)
- Project list (while loading)

### 4.2 Error States

Show meaningful errors:
- Auth failures
- Hub connection errors
- Task operation failures

### 4.3 Offline Banner

When Hub disconnects, show a banner:
```typescript
{!hubStatus.connected && (
  <div className="bg-destructive/10 text-destructive px-4 py-2 text-center text-sm">
    Hub disconnected. Some features unavailable.
  </div>
)}
```

### 4.4 Remove Dead Code

- Find IPC handlers that are now unused
- Remove or archive them
- Clean up imports

---

## Wave 4 Checklist

- [ ] Add loading skeletons
- [ ] Add error states with retry
- [ ] Add offline banner
- [ ] Remove dead code
- [ ] Full end-to-end test
- [ ] Update progress file to COMPLETE

---

## Files to Create/Modify

### New Files
- `src/renderer/shared/hooks/useHubEvents.ts`
- `src/renderer/shared/lib/hub-query-sync.ts`
- `src/renderer/shared/components/HubStatus.tsx`

### Modified Files
- `src/renderer/app/providers/QueryProvider.tsx`
- `src/renderer/app/layouts/TopBar.tsx`
- `src/renderer/features/tasks/api/useTasks.ts`
- `src/renderer/features/tasks/api/useTaskMutations.ts`
- `src/renderer/features/tasks/hooks/useTaskEvents.ts`
- `src/renderer/features/auth/store.ts`
- `src/renderer/features/auth/api/useAuth.ts`
- `src/renderer/features/settings/api/useWorkspaces.ts`

---

## Linting Reminders

- Use `import type { X }` for type-only imports
- No `any` — use `unknown` and narrow
- No non-null assertions `!` — use `?? fallback`
- Numbers can't be booleans: use `arr.length > 0` not `arr.length`
- Always handle promises: use `void` or await

---

## Commit Message Format

```
feat(hub-integration): <summary>

- Detail 1
- Detail 2

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
```

---

## When Done

1. Run full verification:
   ```bash
   npm run lint && npx tsc --noEmit && npm run build
   ```

2. Update progress file to COMPLETE

3. Push branch:
   ```bash
   git push -u origin feature/beta-frontend-integration
   ```

4. Create PR to master

5. Coordinate with Team Alpha for final merge
