# Feature Design: Bootstrap Integration + Missing FEATURE.md Files

**Author**: /create-feature-plan
**Created**: 2026-02-16
**Status**: READY FOR IMPLEMENTATION
**Workflow Mode**: standard
**Branch**: `techdebt/scalable-code-structure-and-documentation` (existing)

---

## 1. Overview

The Codebase Separation of Concerns refactor (23 tasks, all complete) split monolithic files into domain folders and extracted bootstrap modules from `src/main/index.ts`. However, the bootstrap modules were written before master received crash resilience features (PRs #34-#36). The merge from master brought the service files but left the bootstrap wiring incomplete.

This plan covers two work streams: (A) integrating 4 master features into the refactored bootstrap modules, and (B) creating 9 missing FEATURE.md documentation files. Both must be completed before the separation-of-concerns branch can pass verification and be PR-ready.

There is NO new feature work here — only wiring existing services into existing bootstrap infrastructure, plus writing documentation for existing code.

## 2. Requirements

### Functional Requirements

**Bootstrap Integration (Work Stream A):**
- Wire `createErrorCollector` into `service-registry.ts` with `onError` and `onCapacityAlert` callbacks that emit IPC events
- Wire `createHealthRegistry` into `service-registry.ts` with `onUnhealthy` callback that emits IPC events
- Wire `createAgentWatchdog` into `service-registry.ts` with `onAlert` callback that emits IPC events, and call `start()`
- Wire `createQaTrigger` into `service-registry.ts` (self-wires via orchestrator event listener)
- Add `initNonCritical` helper to service-registry for graceful degradation of non-critical services (milestones, ideas, changelog, fitness, spotify, calendar, voice, screenCapture)
- Add `errorCollector.dispose()`, `healthRegistry.dispose()`, `agentWatchdog.dispose()`, `qaTrigger.dispose()` to lifecycle cleanup
- Add `healthRegistry.register()` calls for `hubHeartbeat` and `hubWebSocket`
- Add `healthRegistry.pulse()` calls in heartbeat interval and WebSocket message handler
- Wire `errorCollectorRef.report()` into `unhandledRejection` handler in `index.ts`
- Create `src/shared/ipc/health/` domain folder with Zod schemas and IPC contract for the 5 health/error channels
- Update root IPC barrel to merge health domain
- Update `ipc-contract.ts` re-exports to include health schemas

**Documentation (Work Stream B):**
- Create 9 FEATURE.md files following the established 18-27 line template
- Each documents: module purpose, key files with one-line descriptions, optional sub-grouping section, upstream/downstream connections

### Non-Functional Requirements
- All 5 verification commands must pass: lint, typecheck, test, build, check:docs
- No new dependencies introduced
- Existing tests must continue passing
- File size limits respected (service-registry.ts may grow but should stay under 500 lines)

### Out of Scope
- New renderer components for error/health display (future work)
- New tests for the health services themselves (they already exist on master)
- Refactoring the health services
- Updating the schema-designer agent definition to reference new IPC domain folders (separate task)

## 3. Architecture

### Selected Approach

**Direct integration** — copy the exact wiring patterns from master's monolithic `index.ts` into the appropriate bootstrap module files. This is the lowest-risk approach since the code is proven working on master.

### Data Model

No new types needed. All types exist at:
- `src/shared/types/health.ts` — ErrorSeverity, ErrorTier, ErrorCategory, ErrorContext, ErrorEntry, ErrorStats, ServiceHealthStatus, ServiceHealth, HealthStatus

### IPC Surface (new domain folder)

Create `src/shared/ipc/health/` with 5 invoke channels (matching master's `app.*` prefix):

| Channel | Input | Output |
|---------|-------|--------|
| `app.getErrorLog` | `{ since?: string }` | `{ entries: ErrorEntry[] }` |
| `app.getErrorStats` | `{}` | `ErrorStats` |
| `app.clearErrorLog` | `{}` | `{ success: boolean }` |
| `app.reportRendererError` | `{ severity, tier, category, message, stack?, route?, routeHistory?, projectId? }` | `{ success: boolean }` |
| `app.getHealthStatus` | `{}` | `HealthStatus` |

3 event channels:

| Channel | Payload |
|---------|---------|
| `event:app.error` | `ErrorEntry` |
| `event:app.capacityAlert` | `{ count: number, message: string }` |
| `event:app.serviceUnhealthy` | `{ serviceName: string, missedCount: number }` |

### Integration Points

**New -> Existing:**
- `service-registry.ts` calls `createErrorCollector(dataDir, callbacks)` and `createHealthRegistry(callbacks)`
- `service-registry.ts` calls `createAgentWatchdog(orchestrator, {}, notificationManager)`
- `service-registry.ts` calls `createQaTrigger({ qaRunner, orchestrator, hubApiClient, router })`
- `lifecycle.ts` calls `.dispose()` on all 4 new services
- Root IPC barrel imports and merges health domain

**Existing -> Modified:**
- `ServiceRegistryResult` interface gains 4 new fields
- `LifecycleDeps` interface gains 4 new fields
- `Services` bag in service-registry already has `errorCollector` and `healthRegistry` fields (required by `ipc/index.ts`'s `Services` interface) — they just need values
- `index.ts` `unhandledRejection` handler gains `errorCollectorRef?.report()` call

## 4. Task Breakdown

### Task #1: Create health IPC domain folder

**Agent**: service-engineer (schema work within service scope)
**Wave**: 1
**Blocked by**: none
**Estimated complexity**: LOW
**Context budget**: ~13,000 tokens (files: 5)

**Description**:
Create `src/shared/ipc/health/` domain folder with Zod schemas matching master's health/error IPC channels. Follow the exact pattern used by other domain folders (e.g., `src/shared/ipc/app/`). The schemas must match the TypeScript types in `src/shared/types/health.ts` exactly.

**Files to Create**:
- `src/shared/ipc/health/schemas.ts` — All 9 Zod schemas (ErrorSeveritySchema through HealthStatusSchema)
- `src/shared/ipc/health/contract.ts` — 5 invoke channels + 3 event channels
- `src/shared/ipc/health/index.ts` — Barrel re-export

**Files to Modify**:
- `src/shared/ipc/index.ts` — Import health domain, spread into merged contracts, re-export schemas
- `src/shared/ipc-contract.ts` — Add health schema re-exports to the export list

**Files to Read for Context**:
- `src/shared/ipc/app/contract.ts` — Pattern to follow for contract structure
- `src/shared/ipc/app/index.ts` — Pattern to follow for barrel
- `src/shared/ipc/common/schemas.ts` — Pattern to follow for schema file
- `src/shared/ipc/index.ts` — Understand merge pattern
- `src/shared/types/health.ts` — Types the schemas must match
- `src/main/ipc/handlers/error-handlers.ts` — Channels that must match

**Acceptance Criteria**:
- [ ] `src/shared/ipc/health/` folder created with 3 files
- [ ] All 9 Zod schemas match `src/shared/types/health.ts` types exactly
- [ ] 5 invoke channels match `error-handlers.ts` registrations exactly
- [ ] 3 event channels defined for error, capacityAlert, serviceUnhealthy
- [ ] Root barrel merges health domain into unified contracts
- [ ] `ipc-contract.ts` re-exports all 9 health schemas
- [ ] Automated checks pass (lint, typecheck, test, build)

**QA Sections**: Automated Checks, Type Safety, Code Structure, Architecture, API Contract, Documentation

**Feature-Specific QA Checks**:
- [ ] Schema field names match TypeScript interface field names exactly
- [ ] Channel names match handler registrations in error-handlers.ts
- [ ] No duplicate schemas (health schemas not duplicated in app domain)

**Implementation Notes**:
- Keep `app.*` channel prefix even though schemas live in `health/` folder — channel prefixes don't need to match folder names
- Follow `z.enum()` pattern for union types, `z.object()` for interfaces
- The `ErrorContextSchema` has several optional fields — use `.optional()` consistently

---

### Task #2: Wire crash resilience into bootstrap modules

**Agent**: service-engineer
**Wave**: 2
**Blocked by**: #1
**Estimated complexity**: MEDIUM
**Context budget**: ~17,000 tokens (files: 7)

**Description**:
Integrate Error Collector, Health Registry, Agent Watchdog, and QA Trigger into the refactored bootstrap modules. This is a straightforward port of wiring from master's monolithic `index.ts` into the modular bootstrap files. Also add the `initNonCritical` helper for graceful service degradation.

**Files to Modify**:
- `src/main/bootstrap/service-registry.ts` — Import 4 factories, create instances, add to ServiceRegistryResult interface and return value, add initNonCritical helper, wrap non-critical services, add health registry enrollments and pulse calls
- `src/main/bootstrap/lifecycle.ts` — Add 4 dispose calls to LifecycleDeps and before-quit handler
- `src/main/bootstrap/event-wiring.ts` — Add agentWatchdog alert forwarding to IPC events (watchdog `onAlert` -> `event:agent.orchestrator.watchdogAlert`)
- `src/main/index.ts` — Add errorCollectorRef module-level variable, wire `unhandledRejection` report, pass new fields from registry to lifecycle/event-wiring

**Files to Read for Context**:
- Master's `index.ts` (via `git show master:src/main/index.ts`) — Reference implementation for all wiring
- `src/main/services/health/error-collector.ts` — Factory signature and interface
- `src/main/services/health/health-registry.ts` — Factory signature and interface
- `src/main/services/agent-orchestrator/agent-watchdog.ts` — Factory signature and interface
- `src/main/services/qa/qa-trigger.ts` — Factory signature and interface
- `src/main/ipc/index.ts` — Services interface (already requires errorCollector + healthRegistry)

**Acceptance Criteria**:
- [ ] `createErrorCollector` called with `dataDir` and IPC event callbacks
- [ ] `createHealthRegistry` called with `onUnhealthy` IPC event callback
- [ ] `createAgentWatchdog` called with orchestrator, config, notificationManager; `onAlert` wired; `start()` called
- [ ] `createQaTrigger` called with qaRunner, orchestrator, hubApiClient, router
- [ ] `initNonCritical` helper added — wraps factory in try/catch, reports to errorCollector on failure, returns null
- [ ] Non-critical services wrapped: milestones, ideas, changelog, fitness, spotify, calendar, voice, screenCapture
- [ ] `healthRegistry.register('hubHeartbeat', 60_000)` and `register('hubWebSocket', 30_000)` called
- [ ] `healthRegistry.pulse('hubHeartbeat')` called in heartbeat interval
- [ ] `healthRegistry.pulse('hubWebSocket')` called in WebSocket message handler
- [ ] All 4 services added to `ServiceRegistryResult` interface and return value
- [ ] All 4 services disposed in `lifecycle.ts` before-quit handler (health last)
- [ ] `errorCollectorRef` wired in `index.ts` for `unhandledRejection` reporting
- [ ] Watchdog `onAlert` events forwarded to `event:agent.orchestrator.watchdogAlert` in event-wiring
- [ ] `errorCollector` and `healthRegistry` added to Services bag (fixes type error)
- [ ] Automated checks pass (lint, typecheck, test, build)

**QA Sections**: Automated Checks, Type Safety, Code Structure, Architecture, Error Handling, Documentation

**Feature-Specific QA Checks**:
- [ ] ErrorCollector created EARLY (before other services) so initNonCritical can use it
- [ ] HealthRegistry created EARLY (before services that call pulse)
- [ ] Dispose order: health registry and error collector disposed LAST in before-quit
- [ ] Non-critical services use `?? undefined` when passed to assistantService (not `?? null`)
- [ ] service-registry.ts stays under 500 lines
- [ ] No module-level refs leaked into service-registry (only index.ts should have refs)

**Implementation Notes**:
- On master, `initNonCritical` is a standalone function in `index.ts`. In the refactored version, it should be a private function inside `createServiceRegistry()` since it captures `errorCollector` via closure.
- The `agentOrchestrator` creation passes `milestonesService ?? undefined` since milestones is now nullable. Already handled in current code.
- Watchdog event wiring can go in `event-wiring.ts` alongside orchestrator event wiring, or in `service-registry.ts` right after creation. Match master's pattern: wire in the same place the watchdog is created (service-registry), similar to how watchEvaluator.onTrigger is wired in event-wiring.
- ErrorCollector callbacks emit to `event:app.error`, `event:app.capacityAlert`. HealthRegistry callback emits to `event:app.serviceUnhealthy`. These are defined in Task #1's health IPC contract.

---

### Task #3: Create 5 main-process FEATURE.md files

**Agent**: codebase-guardian
**Wave**: 2
**Blocked by**: none (documentation only — no code deps)
**Estimated complexity**: LOW
**Context budget**: ~16,000 tokens (files: 5 create + 6 read)

**Description**:
Create 5 FEATURE.md files for main-process service domains. Each follows the established template: 18-27 lines, `# Title`, opening sentence, `## Key Files` with bold-backtick file names and em-dash descriptions, optional middle section for sub-groupings, `## How It Connects` with upstream/downstream bullets. No code blocks. No verbose explanations.

**Files to Create**:
- `src/main/services/assistant/FEATURE.md` — Documents assistant-service.ts, claude-classifier.ts, command-executor.ts (re-export), cross-device-query.ts, history-store.ts, intent-classifier.ts (re-export), watch-evaluator.ts, watch-store.ts, plus references to executors/ and intent-classifier/ sub-modules (which have their own FEATURE.md)
- `src/main/services/hub/FEATURE.md` — Documents hub-api-client.ts, hub-auth-service.ts, hub-client.ts, hub-config-store.ts, hub-connection.ts, hub-errors.ts, hub-event-mapper.ts, hub-sync.ts, hub-ws-client.ts, webhook-relay.ts
- `src/main/services/agent-orchestrator/FEATURE.md` — Documents agent-orchestrator.ts, agent-watchdog.ts, hooks-template.ts, jsonl-progress-watcher.ts, types.ts
- `src/main/services/notifications/FEATURE.md` — Documents github-watcher.ts, notification-filter.ts, notification-manager.ts, notification-store.ts, notification-watcher.ts, slack-watcher.ts, index.ts
- `src/main/services/email/FEATURE.md` — Documents email-config.ts, email-encryption.ts, email-queue.ts, email-service.ts, email-store.ts, smtp-transport.ts, index.ts

**Files to Read for Context**:
- `src/main/bootstrap/FEATURE.md` — Template reference (existing)
- `src/main/services/assistant/executors/FEATURE.md` — Template reference (existing)
- `src/main/services/assistant/intent-classifier/FEATURE.md` — Template reference (existing)
- Each service directory's files (to describe them accurately)

**Acceptance Criteria**:
- [ ] 5 FEATURE.md files created
- [ ] Each 18-27 lines
- [ ] Each follows the template: `# Title`, opening sentence, `## Key Files`, optional grouping section, `## How It Connects`
- [ ] File descriptions are accurate (verified against actual file contents)
- [ ] No code blocks used
- [ ] Bold backtick format for file names with em-dash descriptions
- [ ] Automated checks pass (lint, typecheck, test, build, check:docs)

**QA Sections**: Automated Checks, Code Structure, Architecture, Documentation

**Feature-Specific QA Checks**:
- [ ] Each FEATURE.md accurately reflects the files that exist in the directory
- [ ] "How It Connects" sections identify correct upstream callers and downstream dependencies
- [ ] No FEATURE.md references files that don't exist

---

### Task #4: Create 4 renderer-feature FEATURE.md files

**Agent**: codebase-guardian
**Wave**: 2
**Blocked by**: none (documentation only)
**Estimated complexity**: LOW
**Context budget**: ~16,000 tokens (files: 4 create + 8 read)

**Description**:
Create 4 FEATURE.md files for renderer feature modules. Same template as Task #3. These are larger modules with more files, so the Key Files section may use inline comma-separated lists for component enumerations (following the pattern in existing intent-classifier FEATURE.md).

**Files to Create**:
- `src/renderer/features/tasks/FEATURE.md` — Documents store.ts, api/ (queryKeys, useTasks, useTaskMutations, useAgentMutations, useQaMutations), hooks/ (useTaskEvents, useAgentEvents, useQaEvents), components/ (CreateTaskDialog, TaskFiltersToolbar, TaskStatusBadge), components/grid/ (TaskDataGrid, ag-grid-modules, ag-grid-theme.css), components/cells/ (13 cell renderers), components/detail/ (7 detail components)
- `src/renderer/features/settings/FEATURE.md` — Documents api/ (useHub, useSettings, useWebhookConfig), components/ (SettingsPage, HubSettings, BackgroundSettings, HotkeySettings, OAuthProviderSettings, WebhookSettings, ProfileSection, etc.)
- `src/renderer/features/planner/FEATURE.md` — Documents store.ts, api/ (queryKeys, usePlanner, useWeeklyReview), hooks/ (usePlannerEvents), components/ (PlannerPage, DayView, WeekOverview, TimeBlockEditor, GoalsList, CalendarOverlay, WeeklyReviewPage, etc.)
- `src/main/services/briefing/FEATURE.md` — Documents briefing-cache.ts, briefing-config.ts, briefing-generator.ts, briefing-service.ts, briefing-summary.ts, suggestion-engine.ts

**Files to Read for Context**:
- `src/shared/ipc/FEATURE.md` — Template reference (larger module pattern)
- `src/renderer/app/routes/FEATURE.md` — Template reference (renderer module)
- Each feature directory's files (to describe them accurately)

**Acceptance Criteria**:
- [ ] 4 FEATURE.md files created
- [ ] Each 18-27 lines (may be up to 30 for very large modules)
- [ ] Each follows the template exactly
- [ ] Inline comma-separated lists used for enumerating many similar files
- [ ] Automated checks pass

**QA Sections**: Automated Checks, Code Structure, Architecture, Documentation

**Feature-Specific QA Checks**:
- [ ] Tasks FEATURE.md covers all 3 sub-directories (cells/, detail/, grid/)
- [ ] Settings FEATURE.md covers both OAuth and appearance sub-components
- [ ] All referenced files actually exist in the directories

---

### Task #5: Verification and doc updates

**Agent**: codebase-guardian
**Wave**: 3
**Blocked by**: #1, #2, #3, #4
**Estimated complexity**: LOW
**Context budget**: ~14,000 tokens (files: 6)

**Description**:
Run the full 5-command verification suite. Update `ai-docs/` documentation files as needed to reflect the bootstrap integration changes. Specifically update ARCHITECTURE.md (bootstrap module descriptions), DATA-FLOW.md (error/health flow), and FEATURES-INDEX.md (new FEATURE.md index). Fix any lint/typecheck/test/build failures discovered.

**Files to Modify**:
- `ai-docs/ARCHITECTURE.md` — Update bootstrap module descriptions to mention error collector, health registry, watchdog, QA trigger
- `ai-docs/DATA-FLOW.md` — Add error collection and health monitoring flow diagrams
- `ai-docs/FEATURES-INDEX.md` — Add entries for new FEATURE.md files and health IPC domain

**Files to Read for Context**:
- Current `ai-docs/ARCHITECTURE.md`
- Current `ai-docs/DATA-FLOW.md`
- Current `ai-docs/FEATURES-INDEX.md`

**Acceptance Criteria**:
- [ ] `npm run lint` passes with zero violations
- [ ] `npm run typecheck` passes with zero errors
- [ ] `npm run test` passes (all unit + integration)
- [ ] `npm run build` succeeds
- [ ] `npm run check:docs` passes
- [ ] ARCHITECTURE.md updated for bootstrap changes
- [ ] DATA-FLOW.md updated for error/health flows
- [ ] FEATURES-INDEX.md updated for new FEATURE.md files and health IPC domain

**QA Sections**: Automated Checks, Architecture, Documentation

**Feature-Specific QA Checks**:
- [ ] All 5 verification commands pass in a single run
- [ ] No new eslint-disable comments added (or if added, justified)

## 5. Wave Plan

### Wave 1: IPC Schema Foundation (no blockers)
- **Task #1**: Create health IPC domain folder — service-engineer

### Wave 2: Bootstrap Wiring + Documentation (blocked by Wave 1 for Task #2; Tasks #3, #4 are independent)
- **Task #2**: Wire crash resilience into bootstrap modules — service-engineer (blocked by #1)
- **Task #3**: Create 5 main-process FEATURE.md files — codebase-guardian (no blockers)
- **Task #4**: Create 4 renderer-feature FEATURE.md files — codebase-guardian (no blockers)

### Wave 3: Final Verification (blocked by all)
- **Task #5**: Verification and doc updates — codebase-guardian (blocked by #1, #2, #3, #4)

### Dependency Graph

```
#1 Health IPC ──────┐
                    ├──> #5 Verification
#2 Bootstrap Wire ──┘       ▲
   (blocked by #1)          │
                            │
#3 Main FEATURE.md ─────────┤
   (independent)            │
                            │
#4 Renderer FEATURE.md ─────┘
   (independent)
```

### Parallel Opportunities

- Wave 2: Tasks #3 and #4 can run in parallel (different directories, documentation only)
- Wave 2: Task #2 and Tasks #3/#4 can run in parallel (different files — #2 modifies bootstrap, #3/#4 create FEATURE.md files)
- Maximum parallelism in Wave 2: all 3 tasks simultaneously

## 6. File Ownership Matrix

| File | Task |
|------|------|
| `src/shared/ipc/health/schemas.ts` | #1 |
| `src/shared/ipc/health/contract.ts` | #1 |
| `src/shared/ipc/health/index.ts` | #1 |
| `src/shared/ipc/index.ts` | #1 |
| `src/shared/ipc-contract.ts` | #1 |
| `src/main/bootstrap/service-registry.ts` | #2 |
| `src/main/bootstrap/lifecycle.ts` | #2 |
| `src/main/bootstrap/event-wiring.ts` | #2 |
| `src/main/index.ts` | #2 |
| `src/main/services/assistant/FEATURE.md` | #3 |
| `src/main/services/hub/FEATURE.md` | #3 |
| `src/main/services/agent-orchestrator/FEATURE.md` | #3 |
| `src/main/services/notifications/FEATURE.md` | #3 |
| `src/main/services/email/FEATURE.md` | #3 |
| `src/renderer/features/tasks/FEATURE.md` | #4 |
| `src/renderer/features/settings/FEATURE.md` | #4 |
| `src/renderer/features/planner/FEATURE.md` | #4 |
| `src/main/services/briefing/FEATURE.md` | #4 |
| `ai-docs/ARCHITECTURE.md` | #5 |
| `ai-docs/DATA-FLOW.md` | #5 |
| `ai-docs/FEATURES-INDEX.md` | #5 |

**Conflicts: NONE** — every file is owned by exactly one task.

## 7. Context Budget

| Task | Files (Create/Modify) | Files (Read) | Estimated Tokens |
|------|----------------------|-------------|-----------------|
| #1 | 5 | 6 | ~14,000 |
| #2 | 4 | 6 | ~17,000 |
| #3 | 5 | 6 | ~16,000 |
| #4 | 4 | 8 | ~16,000 |
| #5 | 3 | 3 | ~14,000 |

All tasks are within the Medium threshold (18,000). No splitting needed.

## 8. Risk Assessment

### Technical Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Type errors from Services interface mismatch | High | Medium | Task #2 explicitly adds errorCollector + healthRegistry to services bag, fixing the known type error |
| Existing tests break after bootstrap changes | Low | Medium | No test logic changes — only wiring. Run full test suite in Task #5 |
| service-registry.ts exceeds 500-line limit | Low | Low | Adding ~40 lines of wiring to a 427-line file. Stays under 500 |

### Scope Risks

| Risk | Mitigation |
|------|----------|
| FEATURE.md descriptions may be inaccurate | QA verifies each file description against actual file contents |
| check:docs may require additional doc updates | Task #5 explicitly handles this with ai-docs updates |

### Integration Risks

| Risk | Mitigation |
|------|----------|
| Health IPC schemas don't match handler expectations | Task #1 reads error-handlers.ts to match channel names exactly |
| Event channel payloads don't match renderer expectations | Using exact same payload shapes as master |

## 9. QA Strategy

### Per-Task QA Sections

| Task | Sections |
|------|----------|
| #1 (IPC schemas) | Automated, Type Safety, Code Structure, Architecture, API Contract, Documentation |
| #2 (Bootstrap wiring) | Automated, Type Safety, Code Structure, Architecture, Error Handling, Documentation |
| #3 (Main FEATURE.md) | Automated, Code Structure, Architecture, Documentation |
| #4 (Renderer FEATURE.md) | Automated, Code Structure, Architecture, Documentation |
| #5 (Verification) | Automated, Architecture, Documentation |

### Feature-Specific QA Checks

- [ ] All 9 Zod schemas match TypeScript types field-for-field
- [ ] All 5 IPC channels match error-handlers.ts registrations
- [ ] ErrorCollector created before initNonCritical usage
- [ ] Dispose order: health/error services disposed last
- [ ] All 9 FEATURE.md files follow the 18-27 line template
- [ ] No FEATURE.md references non-existent files
- [ ] Full 5-command verification suite passes

### Guardian Focus Areas

- File placement: health IPC domain folder matches existing pattern
- Module completeness: health domain has schemas + contract + barrel
- Cross-module consistency: Zod schemas match TypeScript types
- Size limits: service-registry.ts under 500 lines after changes

## 10. Implementation Notes

### Patterns to Follow

**Health IPC domain folder** — Follow `src/shared/ipc/app/` exactly:
- `schemas.ts` exports individual schemas
- `contract.ts` exports `healthInvoke` and `healthEvents` objects
- `index.ts` re-exports everything
- Root barrel in `src/shared/ipc/index.ts` imports and spreads

**Service wiring in service-registry.ts** — Follow the existing creation order pattern:
1. ErrorCollector + HealthRegistry created EARLY (after OAuth/MCP, before core services)
2. Watchdog + QaTrigger created LATE (after orchestrator + qaRunner)
3. initNonCritical is a local function inside createServiceRegistry, not exported

**Event wiring** — Watchdog alerts go in `event-wiring.ts` alongside orchestrator events. ErrorCollector and HealthRegistry callbacks are wired at creation time in service-registry.ts (they emit directly via router).

### Known Gotchas

- `ipc-contract.ts` is a thin re-export barrel — add health schemas to its export list, not inline
- `Services` interface in `src/main/ipc/index.ts` already requires `errorCollector` and `healthRegistry` — this is currently a type error that Task #2 fixes
- The `initNonCritical` helper wraps service factories. Wrapped services return `T | null`. Some downstream consumers (assistantService) need `?? undefined` not `?? null` for optional deps
- Agent watchdog is at `src/main/services/agent-orchestrator/agent-watchdog.ts` (NOT `agent/`)
- QA trigger is at `src/main/services/qa/qa-trigger.ts`
- Health schemas use `app.*` channel prefix even though they live in `health/` domain folder — this is intentional (channel prefix doesn't need to match folder name)
