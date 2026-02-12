/**
 * Daily Planner types
 */

export interface TimeBlock {
  id: string;
  startTime: string;
  endTime: string;
  label: string;
  type: 'focus' | 'meeting' | 'break' | 'other';
  color?: string;
}

export interface ScheduledTask {
  taskId: string;
  scheduledTime?: string;
  estimatedDuration?: number;
  completed: boolean;
}

export interface DailyPlan {
  date: string;
  goals: string[];
  scheduledTasks: ScheduledTask[];
  timeBlocks: TimeBlock[];
  reflection?: string;
}
