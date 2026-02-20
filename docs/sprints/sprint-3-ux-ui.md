# Sprint 3: UX/UI — The Fun Sprint

**Goal:** Full compositional decomposition of the UI layer so every component is plug-and-play. Custom theme cleanup. Layout becomes fully customizable without breaking data flow. This is the foundation that makes Sprint 4's visual polish possible.

**Status:** IMPLEMENTED (P0 items — 6 tasks across 2 waves)

---

## Focus Areas

### 1. Compositional Component Architecture

The big refactor: decompose all view-layer components into a shadcn-style compositional pattern where every component is self-contained, reusable, and context-aware through React Query's cache layer.

#### Pattern Target
```tsx
// Before: tightly coupled to parent layout
<TaskDashboard projectId={projectId} workspaceId={workspaceId}
  tasks={tasks} onUpdate={handleUpdate} filters={filters} ... />

// After: compositional, plug-and-play anywhere
<TaskDashboard.Root>
  <TaskDashboard.Filters />
  <TaskDashboard.Grid />
  <TaskDashboard.Detail />
</TaskDashboard.Root>
// Each sub-component pulls its own data via React Query
// Drop it in any layout and it just works
```

#### Key Principles
- Components own their data fetching (React Query hooks, not prop drilling)
- UI state lives in Zustand stores (scoped per feature)
- Form state via TanStack Form + Zod validation + React Query mutations
- Layout is separate from content — containers don't know about data
- Every component works in isolation (storybook-testable)

#### Implementation Checklist
- [ ] Audit all current components — identify tight coupling points
- [ ] Define compositional API for each major view (Dashboard, TaskGrid, ProjectView, etc.)
- [ ] Extract shared primitives to `@ui/` (already exists, needs expansion)
- [x] Implement TanStack Form + Zod for all form components (DONE — auth + settings forms migrated)
- [ ] Ensure React Query cache is the single source of truth for server state
- [ ] Zustand stores contain ONLY UI state (selections, filters, panel sizes)
- [ ] All components render correctly when dropped into different layout contexts

### 2. Layout System Decomposition

Make the app layout fully customizable without disrupting data flow.

- [ ] Abstract layout shells (sidebar + content, full-width, split-pane, etc.)
- [ ] Layout slots system — named regions that accept any component
- [ ] Persistent layout preferences per user (stored in settings)
- [ ] Responsive breakpoints that reorganize layout (not just shrink)
- [x] Panel resize handles work everywhere (DONE — react-resizable-panels integrated in RootLayout)

### 3. Theme System Cleanup

- [x] Audit all hardcoded colors (DONE — 25+ replaced with theme-aware alternatives)
- [ ] Verify all themes render correctly across every component
- [ ] Add missing theme tokens if any components are under-themed
- [ ] Smooth theme transitions (no flash on switch)
- [ ] Dark/light mode works in every view

### 4. Navigation & Routing Cleanup

- [x] All routes load cleanly (DONE — lazy loading + route-specific skeletons)
- [x] Deep linking works (DONE — verified via sidebar active state fix)
- [ ] Breadcrumbs or back-navigation consistent
- [x] Sidebar navigation reflects current route state (DONE — startsWith/endsWith matching)

---

## Architecture Decisions

### Data Flow After Refactor
```
React Query Cache (server state)
  ↓ useQuery hooks in feature api/ folders
Components (render data)
  ↓ useMutation hooks for writes
IPC → Main Process → Hub API

Zustand Stores (UI-only state)
  - selectedTaskId, panelWidth, filterState, etc.
  - NEVER duplicates server state

TanStack Form + Zod (form state)
  - Validation at the form level
  - Submission via React Query mutations
  - Optimistic updates where appropriate
```

### Component Hierarchy
```
Layout Shell (sidebar, topbar, content area)
  └─ Feature Root (e.g., <Tasks.Root>)
       ├─ Feature Toolbar (filters, actions)
       ├─ Feature Content (grid, list, detail)
       └─ Feature Modals/Dialogs
```

---

## Success Criteria

> Any major view component can be moved to a different layout position (sidebar → main, tab → page, panel → modal) without code changes beyond the layout config. Data flows through React Query, not props.

---

## Dependencies

- Sprint 1 and 2 should be mostly complete (stable features to refactor)
- TanStack Form needs to be added to deps (`npm install @tanstack/react-form`)

---

## Risk: Should This Come First?

See discussion in sprint overview doc — there's a strong case for pulling the compositional refactor forward as "Sprint 0.5" to make Sprint 1 and 2 easier.

---

## Notes

_This sprint will likely generate the most PRs and touch the most files. Plan for incremental migration — don't try to refactor everything at once. Feature-by-feature conversion._
