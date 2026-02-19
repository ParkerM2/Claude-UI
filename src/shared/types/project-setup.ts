/**
 * Project setup pipeline types
 *
 * Types for codebase analysis results, setup pipeline step tracking,
 * setup progress events, and create-project input.
 */

/** Detected tech stack from codebase analysis */
export interface CodebaseAnalysis {
  languages: Array<{ name: string; percentage: number }>;
  frameworks: string[];
  packageManager: string | null;
  buildTool: string | null;
  testFramework: string | null;
  linter: string | null;
  hasTypeScript: boolean;
  hasTailwind: boolean;
  nodeVersion: string | null;
  monorepoTool: string | null;
}

/** Setup pipeline step status */
export type SetupStepStatus = 'pending' | 'running' | 'done' | 'error' | 'skipped';

/** A single step in the setup pipeline */
export interface SetupStep {
  id: string;
  label: string;
  status: SetupStepStatus;
  error?: string;
}

/** Progress event emitted during setup */
export interface SetupProgressEvent {
  projectId: string;
  currentStep: string;
  steps: SetupStep[];
  analysis?: CodebaseAnalysis;
}

/** Input for creating a new project from scratch */
export interface CreateProjectInput {
  name: string;
  description?: string;
  path: string;
  techStack?: string[];
  githubVisibility: 'public' | 'private';
  createGitHubRepo: boolean;
  workspaceId?: string;
}
