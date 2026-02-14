/**
 * Projects feature — public API
 */

// API hooks
export {
  useProjects,
  useAddProject,
  useRemoveProject,
  useSelectDirectory,
} from './api/useProjects';
export {
  gitKeys,
  useGitStatus,
  useGitBranches,
  useWorktrees,
  useRepoStructure,
  useCreateBranch,
  useCreateWorktree,
  useRemoveWorktree,
  useMergePreview,
  useCheckConflicts,
  useMergeBranch,
  useAbortMerge,
} from './api/useGit';
export { projectKeys } from './api/queryKeys';

// Events
export { useProjectEvents } from './hooks/useProjectEvents';

// Components
export { ProjectListPage } from './components/ProjectListPage';
export { WorktreeManager } from './components/WorktreeManager';
export { BranchSelector } from './components/BranchSelector';
export { SubprojectSelector } from './components/SubprojectSelector';
export { ProjectInitWizard } from './components/ProjectInitWizard';
export { RepoTypeSelector } from './components/RepoTypeSelector';
export { SubRepoDetector } from './components/SubRepoDetector';
