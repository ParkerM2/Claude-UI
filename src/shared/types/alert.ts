/**
 * Alert/Reminder domain types
 */

export interface RecurringConfig {
  frequency: 'daily' | 'weekly' | 'monthly';
  time: string;
  daysOfWeek?: number[];
}

export interface AlertLinkedTo {
  type: 'task' | 'event' | 'note';
  id: string;
}

export interface Alert {
  id: string;
  type: 'reminder' | 'deadline' | 'notification' | 'recurring';
  message: string;
  triggerAt: string;
  recurring?: RecurringConfig;
  linkedTo?: AlertLinkedTo;
  dismissed: boolean;
  createdAt: string;
}
