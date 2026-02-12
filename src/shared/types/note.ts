/**
 * Note-related types
 */

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  projectId?: string;
  taskId?: string;
  createdAt: string;
  updatedAt: string;
  pinned: boolean;
}
