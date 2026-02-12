/**
 * Milestone/Roadmap-related types
 */

export type MilestoneStatus = 'planned' | 'in-progress' | 'completed';

export interface MilestoneTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  status: MilestoneStatus;
  tasks: MilestoneTask[];
  projectId?: string;
  createdAt: string;
  updatedAt: string;
}
