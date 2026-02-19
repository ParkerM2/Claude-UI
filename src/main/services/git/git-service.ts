/**
 * Git Service — Core git operations via simple-git
 *
 * All methods are async because git commands are async.
 * Uses simple-git library for all git operations (no raw process spawning).
 */

import { existsSync } from 'node:fs';

import simpleGit from 'simple-git';

import type { GitBranch, GitStatus, RepoStructure } from '@shared/types';

import type { PolyrepoService } from './polyrepo-service';

export interface GitService {
  getStatus: (repoPath: string) => Promise<GitStatus>;
  listBranches: (repoPath: string) => Promise<GitBranch[]>;
  createBranch: (
    repoPath: string,
    branchName: string,
    baseBranch?: string,
  ) => Promise<{ success: boolean }>;
  switchBranch: (repoPath: string, branchName: string) => Promise<void>;
  detectStructure: (repoPath: string) => Promise<RepoStructure>;
  initRepo: (repoPath: string) => Promise<void>;
  initialCommit: (repoPath: string, message: string) => Promise<void>;
}

function validateRepoPath(repoPath: string): void {
  if (!existsSync(repoPath)) {
    throw new Error(`Repository path does not exist: ${repoPath}`);
  }
}

export function createGitService(polyrepoService: PolyrepoService): GitService {
  return {
    async getStatus(repoPath) {
      validateRepoPath(repoPath);
      const git = simpleGit(repoPath);
      const status = await git.status();
      return {
        branch: status.current ?? 'unknown',
        isClean: status.isClean(),
        ahead: status.ahead,
        behind: status.behind,
        staged: status.staged,
        modified: status.modified,
        untracked: status.not_added,
      };
    },

    async listBranches(repoPath) {
      validateRepoPath(repoPath);
      const git = simpleGit(repoPath);
      const summary = await git.branchLocal();
      return Object.entries(summary.branches).map(([name, info]) => ({
        name,
        current: info.current,
        lastCommit: info.label,
      }));
    },

    async createBranch(repoPath, branchName, baseBranch) {
      validateRepoPath(repoPath);
      const git = simpleGit(repoPath);
      await (baseBranch
        ? git.checkoutBranch(branchName, baseBranch)
        : git.checkoutLocalBranch(branchName));
      return { success: true };
    },

    async switchBranch(repoPath, branchName) {
      validateRepoPath(repoPath);
      const git = simpleGit(repoPath);
      await git.checkout(branchName);
    },

    detectStructure(repoPath) {
      validateRepoPath(repoPath);
      return Promise.resolve(polyrepoService.detectStructure(repoPath));
    },

    async initRepo(repoPath) {
      validateRepoPath(repoPath);
      const git = simpleGit(repoPath);
      await git.init();
    },

    async initialCommit(repoPath, message) {
      validateRepoPath(repoPath);
      const git = simpleGit(repoPath);
      await git.add('.');
      await git.commit(message);
    },
  };
}
