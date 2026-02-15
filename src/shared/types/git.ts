/**
 * Git-related types
 */

export interface GitStatus {
  branch: string;
  isClean: boolean;
  ahead: number;
  behind: number;
  staged: string[];
  modified: string[];
  untracked: string[];
}

export interface GitBranch {
  name: string;
  current: boolean;
  remote?: string;
  lastCommit?: string;
}

export interface Worktree {
  id: string;
  projectId: string;
  subprojectId?: string;
  path: string;
  branch: string;
  taskId?: string;
  createdAt: string;
}

export interface DetectedSubProject {
  id: string;
  name: string;
  relativePath: string;
  gitRemote?: string;
  defaultBranch?: string;
}

export type RepoStructure = 'single' | 'monorepo' | 'polyrepo';

export interface MergeResult {
  success: boolean;
  conflicts?: string[];
  message: string;
}
