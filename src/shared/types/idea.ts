/**
 * Ideation-related types
 */

export type IdeaStatus = 'new' | 'exploring' | 'accepted' | 'rejected' | 'implemented';

export type IdeaCategory = 'feature' | 'improvement' | 'bug' | 'performance';

export interface Idea {
  id: string;
  title: string;
  description: string;
  status: IdeaStatus;
  category: IdeaCategory;
  tags: string[];
  projectId?: string;
  votes: number;
  createdAt: string;
  updatedAt: string;
}
