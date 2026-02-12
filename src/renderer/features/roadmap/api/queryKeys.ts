/**
 * Milestone query key factory
 */

export const milestoneKeys = {
  all: ['milestones'] as const,
  lists: () => [...milestoneKeys.all, 'list'] as const,
  list: (projectId?: string) => [...milestoneKeys.lists(), { projectId }] as const,
};
