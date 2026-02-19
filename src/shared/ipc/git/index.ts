/**
 * Git IPC — Barrel Export
 */

export { gitEvents, gitInvoke } from './contract';
export {
  GitBranchSchema,
  GitCommitInputSchema,
  GitCommitOutputSchema,
  GitConflictStrategySchema,
  GitCreatePrInputSchema,
  GitCreatePrOutputSchema,
  GitPushInputSchema,
  GitPushOutputSchema,
  GitResolveConflictInputSchema,
  GitResolveConflictOutputSchema,
  GitStatusSchema,
  RepoStructureSchema,
  WorktreeSchema,
} from './schemas';
