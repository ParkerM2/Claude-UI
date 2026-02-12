/**
 * Claude CLI output patterns for parsing agent status.
 *
 * These patterns are matched against CLI stdout to detect
 * status changes, progress updates, and errors.
 */

/** Patterns that indicate the agent has started working */
export const STATUS_RUNNING_PATTERNS = ['Starting task'] as const;

/** Patterns that indicate the agent completed successfully */
export const STATUS_COMPLETED_PATTERNS = ['Task completed', '\u2713 Done'] as const;

/** Patterns that indicate the agent encountered an error */
export const STATUS_ERROR_PATTERNS = ['Error:', '\u2717 Failed'] as const;

/** Patterns that indicate progress updates */
export const PROGRESS_PATTERNS = ['Phase:', 'Step:'] as const;
