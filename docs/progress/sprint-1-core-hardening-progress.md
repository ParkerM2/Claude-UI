# Feature: Sprint 1 — Core Hardening

**Status**: COMPLETE
**Team**: sprint-1-hardening
**Base Branch**: master
**Feature Branch**: feature/sprint-1-core-hardening
**Design Doc**: .claude/progress/sprint-1-core-hardening-design.md
**Started**: 2026-02-20 01:30
**Last Updated**: 2026-02-20
**Updated By**: team-lead

---

## Agent Registry

| Agent Name | Role | Task IDs | Status | QA Round | Notes |
|------------|------|----------|--------|----------|-------|
| svc-eng-w1 | Service Engineer | T1, T13 | COMPLETE | 1/3 | Auto-updater + assistant context |
| hook-eng-w1 | Hook Engineer | T2 | COMPLETE | 1/3 | Auth token refresh hardening |
| ws-eng-w1 | WebSocket Engineer | T3 | COMPLETE | 1/3 | Exponential backoff |
| comp-eng-w1 | Component Engineer | T4, T5, T6 | COMPLETE | 1/3 | Login rate limit + onRequestChanges + cost display |
| schema-w1 | Schema Designer | T8 | COMPLETE | 1/3 | Git IPC contracts |
| comp-eng-w2 | Component Engineer | T7 | COMPLETE | 1/3 | Task result view component |
| svc-eng-w2 | Service Engineer | T9 | COMPLETE | 1/3 | Git service implementation |
| team-lead | Team Lead | T10, T11 | COMPLETE | — | Git handlers + git status in project list |
| comp-eng-w3 | Component Engineer | T12 | COMPLETE | 1/3 | PR creation dialog |

---

## Task Progress

### Task T1: Auto-updater Startup Check [COMPLETE]
- **Agent**: svc-eng-w1
- **Files Modified**: `src/main/bootstrap/lifecycle.ts`, `src/main/index.ts`
- **Summary**: Added `checkForUpdates()` call in lifecycle setup, guarded by `app.isPackaged`

### Task T2: Auth Token Refresh Hardening [COMPLETE]
- **Agent**: hook-eng-w1
- **Files Modified**: `useTokenRefresh.ts`, `useAuth.ts`, `auth/index.ts`
- **Summary**: Added `useForceLogout` hook; failed refresh calls IPC logout before clearing renderer state

### Task T3: Hub WebSocket Exponential Backoff [COMPLETE]
- **Agent**: ws-eng-w1
- **Files Modified**: `hub-ws-client.ts`
- **Summary**: Replaced fixed 30s interval with exponential backoff: 30s → 60s → 120s → 240s → 300s cap. Resets on successful connection.

### Task T4: Login Rate Limiting [COMPLETE]
- **Agent**: comp-eng-w1
- **Files Modified**: `LoginPage.tsx`
- **Summary**: 5 failed attempts trigger 30s cooldown with countdown message

### Task T5: Wire onRequestChanges in PlanReviewPanel [COMPLETE]
- **Agent**: comp-eng-w1
- **Files Modified**: `TaskDataGrid.tsx`
- **Summary**: Wired `onRequestChanges` callback through TaskDataGrid → TaskDetailRow → PlanViewer using `useReplanWithFeedback`

### Task T6: Task Cost Display [COMPLETE]
- **Agent**: comp-eng-w1
- **Files Modified**: `TaskDetailRow.tsx`
- **Summary**: Added `TaskCostDisplay` component showing tokens + USD using `@ui` Card

### Task T7: Task Result View Component [COMPLETE]
- **Agent**: comp-eng-w2
- **Files Created**: `src/renderer/features/tasks/components/detail/TaskResultView.tsx`
- **Summary**: Shows execution result (status badge, duration, cost card, log summary, View Diff + Create PR buttons)

### Task T8: Git Operations IPC Contracts [COMPLETE]
- **Agent**: schema-w1
- **Files Modified**: `src/shared/ipc/git/schemas.ts`, `contract.ts`, `index.ts`, `src/shared/ipc/index.ts`
- **Summary**: Added 9 Zod schemas + 4 invoke channels (git.commit, git.push, git.resolveConflict, git.createPr)

### Task T9: Git Operations Service Implementation [COMPLETE]
- **Agent**: svc-eng-w2
- **Files Modified**: `src/main/services/git/git-service.ts`
- **Summary**: Added commit, push, resolveConflict, createPr methods using simple-git + gh CLI

### Task T10: Git Operations IPC Handlers [COMPLETE]
- **Agent**: team-lead
- **Files Modified**: `src/main/ipc/handlers/git-handlers.ts`
- **Summary**: Wired 4 new handlers mapping contract inputs to service methods

### Task T11: Git Status in Project Card [COMPLETE]
- **Agent**: team-lead
- **Files Modified**: `src/renderer/features/projects/components/ProjectList.tsx`
- **Summary**: Added `GitStatusIndicator` sub-component showing branch name + clean/changed badge using existing `useGitStatus` hook

### Task T12: PR Creation Flow [COMPLETE]
- **Agent**: comp-eng-w3
- **Files Created**: `src/renderer/features/tasks/components/CreatePrDialog.tsx`
- **Files Modified**: `TaskResultView.tsx`, `tasks/index.ts`
- **Summary**: Radix Dialog-based PR creation with pre-filled title/body, base/head branch inputs, success/error states

### Task T13: Assistant Project Context [COMPLETE]
- **Agent**: svc-eng-w1
- **Files Modified**: `assistant-service.ts`, `conversation.executor.ts`, `router.ts`, `service-registry.ts`
- **Summary**: Active project name/path/type injected into assistant system prompt

### Task T14: Documentation Updates [COMPLETE]
- **Agent**: team-lead
- **Files Modified**: progress file, tracker.json, FEATURES-INDEX.md
- **Summary**: Updated all tracking files with completion status

---

## Dependency Graph

```
Wave 1 (parallel — no blockers):
  T1 Auto-updater ──────────────────────────────────────┐
  T2 Auth refresh ──────────────────────────────────────┤
  T3 WS backoff ────────────────────────────────────────┤
  T4 Login rate limit ──────────────────────────────────┤
  T5 onRequestChanges ─────────────────────────────────┤
  T6 Cost display ────────────┐                         │
  T8 Git IPC contracts ──────┤                          │
  T13 Assistant context ─────┤                          │
                             │                          │
Wave 2:                      │                          │
  T7 Task result view ◄──────┘ (blocked by T6)         │
  T9 Git service ◄──────────── (blocked by T8)         │
  T10 Git handlers ◄────────── (blocked by T8, T9)     │
                                                        │
Wave 3:                                                 │
  T11 Git status card ◄─────── (blocked by T10)        │
  T12 PR creation ◄─────────── (blocked by T7, T10)    │
                                                        │
Wave 4:                                                 │
  T14 Docs ◄────────────────────────────────────────────┘
```

---

## QA Results

All 14 tasks passed individual verification. Final integration verification:
- `npm run lint`: 0 errors (20 pre-existing warnings in @ui components)
- `npm run typecheck`: 0 errors
- `npm run test`: 152 tests passing (6 test files)
- `npm run build`: Success (main 641KB, preload 96KB, renderer 6.5MB)
- `npm run check:docs`: PASS

---

## Integration Checklist

- [x] All tasks COMPLETE with QA PASS
- [x] `npm run lint` passes on feature branch
- [x] `npm run typecheck` passes on feature branch
- [x] `npm run test` passes on feature branch
- [x] `npm run build` passes on feature branch
- [x] `npm run check:docs` passes on feature branch
- [x] `docs/tracker.json` updated — status set to IMPLEMENTED
- [x] Progress file status set to COMPLETE
- [x] Design doc status updated to IMPLEMENTED
- [ ] Committed with descriptive message
- [ ] PR created
