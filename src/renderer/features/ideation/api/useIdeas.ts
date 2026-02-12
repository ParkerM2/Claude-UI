/**
 * React Query hooks for ideas
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { IdeaCategory, IdeaStatus } from '@shared/types';

import { ipc } from '@renderer/shared/lib/ipc';

import { ideaKeys } from './queryKeys';

/** Fetch ideas with optional filters */
export function useIdeas(projectId?: string, status?: IdeaStatus, category?: IdeaCategory) {
  return useQuery({
    queryKey: ideaKeys.list(projectId, status, category),
    queryFn: () => ipc('ideas.list', { projectId, status, category }),
  });
}

/** Create a new idea */
export function useCreateIdea() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      title: string;
      description: string;
      category: IdeaCategory;
      tags?: string[];
      projectId?: string;
    }) => ipc('ideas.create', data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ideaKeys.lists() });
    },
  });
}

/** Update an existing idea */
export function useUpdateIdea() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      id: string;
      title?: string;
      description?: string;
      status?: IdeaStatus;
      category?: IdeaCategory;
      tags?: string[];
    }) => ipc('ideas.update', data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ideaKeys.lists() });
    },
  });
}

/** Delete an idea */
export function useDeleteIdea() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => ipc('ideas.delete', { id }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ideaKeys.lists() });
    },
  });
}

/** Vote on an idea */
export function useVoteIdea() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { id: string; delta: number }) => ipc('ideas.vote', data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ideaKeys.lists() });
    },
  });
}
