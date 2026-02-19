/**
 * Projects IPC — Barrel Export
 *
 * Re-exports project-related schemas and contract definitions.
 * Git and merge operations are in their own domain folders.
 */

export {
  ChildRepoSchema,
  CodebaseAnalysisSchema,
  CreateProjectInputSchema,
  ProjectSchema,
  RepoDetectionResultSchema,
  RepoTypeSchema,
  SetupProgressEventSchema,
  SetupStepSchema,
  SetupStepStatusSchema,
  SubProjectSchema,
} from './schemas';

export { projectsEvents, projectsInvoke } from './contract';
