/**
 * Assistant query keys factory
 */
export const assistantKeys = {
  all: ['assistant'] as const,
  history: (limit?: number) => [...assistantKeys.all, 'history', limit] as const,
};
