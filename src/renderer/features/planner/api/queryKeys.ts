/**
 * Planner query keys factory
 */
export const plannerKeys = {
  all: ['planner'] as const,
  days: () => [...plannerKeys.all, 'day'] as const,
  day: (date: string) => [...plannerKeys.days(), date] as const,
};
