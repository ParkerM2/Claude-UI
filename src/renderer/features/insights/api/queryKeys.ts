/**
 * Insights query key factory
 */

export const insightKeys = {
  all: ['insights'] as const,
  metrics: (projectId?: string) => [...insightKeys.all, 'metrics', { projectId }] as const,
  timeSeries: (projectId?: string, days?: number) =>
    [...insightKeys.all, 'timeSeries', { projectId, days }] as const,
  distribution: (projectId?: string) =>
    [...insightKeys.all, 'distribution', { projectId }] as const,
  projectBreakdown: () => [...insightKeys.all, 'projectBreakdown'] as const,
};
