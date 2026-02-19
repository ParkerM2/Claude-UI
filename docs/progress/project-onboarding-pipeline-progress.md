# Feature: Project Onboarding Pipeline

**Status**: IN_PROGRESS
**Team**: project-onboarding
**Base Branch**: master
**Feature Branch**: feature/project-onboarding-pipeline
**Design Doc**: .claude/progress/project-onboarding-pipeline-design.md
**Started**: 2026-02-19 18:30
**Last Updated**: 2026-02-19 18:30
**Updated By**: team-lead

---

## Agent Registry

| Agent Name | Role | Task ID | Status | QA Round | Notes |
|------------|------|---------|--------|----------|-------|
| schema-designer | Schema Designer | #1 | PENDING | 0/3 | Types + IPC contracts |
| svc-analyzer | Service Engineer | #2 | PENDING | 0/3 | Codebase analyzer |
| svc-claudemd | Service Engineer | #3 | PENDING | 0/3 | CLAUDE.md generator |
| svc-skills | Service Engineer | #4 | PENDING | 0/3 | Skills resolver |
| svc-docs | Service Engineer | #5 | PENDING | 0/3 | Doc generator |
| svc-git | Service Engineer | #6 | PENDING | 0/3 | Git init + GitHub |
| svc-pipeline | Service Engineer | #7 | PENDING | 0/3 | Setup pipeline orchestrator |
| ipc-engineer | IPC Handler Engineer | #8 | PENDING | 0/3 | IPC handlers + wiring |
| ui-add-dialog | Component Engineer | #9 | PENDING | 0/3 | Add Project Dialog + Progress Modal |
| ui-wizard | Component Engineer | #10 | PENDING | 0/3 | Create Project Wizard |
| ui-wiring | Component Engineer | #11 | PENDING | 0/3 | Final wiring + dashboard |

---

## Task Progress

### Task #1: Shared Types & IPC Contract Extensions [PENDING]
- **Agent**: schema-designer
- **Files Create**: `src/shared/types/project-setup.ts`
- **Files Modify**: `src/shared/ipc/projects/schemas.ts`, `src/shared/ipc/projects/contract.ts`, `src/shared/types/index.ts`

### Task #2: Codebase Analyzer Service [PENDING]
- **Agent**: svc-analyzer
- **Files Create**: `src/main/services/project/codebase-analyzer.ts`

### Task #3: CLAUDE.md Generator [PENDING]
- **Blocked By**: Tasks #1, #2
- **Files Create**: `src/main/services/project/claudemd-generator.ts`

### Task #4: Skills Resolver Service [PENDING]
- **Blocked By**: Task #1
- **Files Create**: `src/main/services/project/skills-resolver.ts`

### Task #5: Doc Generator Service [PENDING]
- **Blocked By**: Task #1
- **Files Create**: `src/main/services/project/doc-generator.ts`

### Task #6: Git Init + GitHub Repo Creation [PENDING]
- **Files Modify**: `src/main/services/git/git-service.ts`
- **Files Create**: `src/main/services/project/github-repo-creator.ts`

### Task #7: Setup Pipeline Orchestrator [PENDING]
- **Blocked By**: Tasks #1-6
- **Files Create**: `src/main/services/project/setup-pipeline.ts`

### Task #8: IPC Handlers + Service Wiring [PENDING]
- **Blocked By**: Tasks #1, #2
- **Files Modify**: `src/main/ipc/handlers/project-handlers.ts`, `src/main/bootstrap/service-registry.ts`

### Task #9: Add Project Dialog + Setup Progress Modal [PENDING]
- **Blocked By**: Tasks #1, #7, #8
- **Files Create**: `AddProjectDialog.tsx`, `SetupProgressModal.tsx`, `useSetupProgress.ts`
- **Files Modify**: `ProjectListPage.tsx`, `useProjects.ts`, `projects/index.ts`

### Task #10: Create Project Wizard [PENDING]
- **Blocked By**: Tasks #1, #8
- **Files Create**: `CreateProjectWizard.tsx`, `create-wizard-steps/*.tsx`

### Task #11: Wire Init Wizard + Dashboard Integration [PENDING]
- **Blocked By**: Tasks #9, #10
- **Files Modify**: `ProjectInitWizard.tsx`, `RecentProjects.tsx`, `useProjects.ts`

---

## Dependency Graph

```
#1 Types ──────┐
               ├──> #3 CLAUDE.md Gen ────┐
               ├──> #4 Skills Resolver ──┤
#2 Analyzer ──┤──> #5 Doc Generator ────┼──> #7 Pipeline ──┐
               └──> #6 Git + GitHub ────┘                   ├──> #9 Add Dialog + Progress ──┐
                                          #8 IPC Handlers ──┘    #10 Create Wizard ─────────┼──> #11 Final Wiring
```

---

## QA Results

(None yet)

---

## Blockers

| Blocker | Affected Task | Reported By | Status | Resolution |
|---------|---------------|-------------|--------|------------|
| None | | | | |

---

## Integration Checklist

- [ ] All tasks COMPLETE with QA PASS
- [ ] `npm run lint` passes on merged branch
- [ ] `npm run typecheck` passes on merged branch
- [ ] `npm run test` passes on merged branch
- [ ] `npm run build` passes on merged branch
- [ ] `npm run check:docs` passes on merged branch
- [ ] `docs/tracker.json` updated — status set to IMPLEMENTED
- [ ] Progress file status set to COMPLETE
- [ ] Committed with descriptive message
- [ ] PR created

---

## Recovery Notes

If this feature is resumed by a new session:

1. Read this file for current state
2. Run `git status` to check uncommitted work
3. Check `~/.claude/teams/project-onboarding/config.json` for team state
4. Use `TaskList` to get current task status
5. Resume from the first non-COMPLETE task
6. Update "Last Updated" and "Updated By" fields
