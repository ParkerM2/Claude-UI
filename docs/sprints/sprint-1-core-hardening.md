# Sprint 1: Core Hardening

**Goal:** Bulletproof the install-to-completed-task pipeline. A new user should be able to install, set up, connect to Hub, create a project, run a task with an agent, and review the results — without hitting dead ends.

**Status:** NOT STARTED

---

## Focus Areas

### 1. Installation & First Boot
- [ ] Clean first-run experience (no errors, no blank screens)
- [ ] Verify `npm install` + `npm run build` + packaged installer all work
- [ ] Electron auto-updater configuration tested
- [ ] First-boot onboarding flow (Hub URL, registration/login)
- [ ] Error states for common setup failures (port in use, network down, bad Node version)

### 2. Authentication & OAuth
- [ ] Email/password login + registration fully working end-to-end
- [ ] Social login (GitHub, Google, Discord) — Task #5
- [ ] Token refresh cycle verified (15min access tokens, auto-refresh)
- [ ] Logout clears all local state + Hub session
- [ ] OAuth provider setup for GitHub (PRs, issues, notifications)
- [ ] OAuth provider setup for Google (Calendar integration later)
- [ ] Graceful handling of expired/revoked tokens

### 3. Hub Connection
- [ ] Hub server setup documented and streamlined
- [ ] Health check + WebSocket connection reliable
- [ ] Reconnection logic tested (Hub goes down and comes back)
- [ ] Hub connection status indicator in sidebar
- [ ] Error messages for connection failures are actionable

### 4. Projects & Workspaces
- [ ] Create/edit/delete projects works end-to-end
- [ ] Multi-repo project detection (polyrepo, monorepo)
- [ ] Workspace CRUD fully functional
- [ ] Project ↔ Workspace association correct
- [ ] Project directory picker works on Windows + macOS

### 5. Task Pipeline (Core Loop)
- [ ] Task creation from UI works
- [ ] Task assignment to agents works
- [ ] Agent execution + progress tracking visible
- [ ] Task status transitions correct (queued → running → completed/failed)
- [ ] Task results viewable (logs, output, cost)
- [ ] Task cancellation works

### 6. Git Integration
- [ ] Git diff viewer working (git-diff-view)
- [ ] Merge conflict detection and display
- [ ] Branch management (create, switch, list)
- [ ] PR creation flow from completed tasks
- [ ] Git status displayed per project

### 7. QA / CI-CD Process
- [ ] QA review loop working (agent submits → QA reviews → approve/reject)
- [ ] Test suite runs as part of task verification
- [ ] Build verification gate before PR creation
- [ ] CI/CD integration hooks (GitHub Actions awareness)

### 8. Assistant Usage
- [ ] Chat interface functional
- [ ] Intent classification routing commands correctly
- [ ] Command execution working (natural language → action)
- [ ] Assistant context includes project/workspace state
- [ ] Error handling for failed commands

---

## Success Criteria

> A user can: install the app → connect to Hub → register → create a project → launch a coding task → watch it execute → review the git diff → approve/reject → create a PR. Every step works without workarounds.

---

## Dependencies

- Hub server must be running (local or remote)
- Node.js >= 22
- Git installed on the system

---

## Notes

_Sprint details will be fleshed out as we work through each area. Items may be promoted/demoted based on what we discover during implementation._
