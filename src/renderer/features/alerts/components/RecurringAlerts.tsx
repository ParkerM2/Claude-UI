/**
 * RecurringAlerts — Manage recurring alert schedules
 */

import { Repeat, Trash2 } from 'lucide-react';

import type { Alert } from '@shared/types';

import { cn } from '@renderer/shared/lib/utils';

import { useDeleteAlert } from '../api/useAlerts';

interface RecurringAlertsProps {
  alerts: Alert[];
}

function formatRecurringSchedule(alert: Alert): string {
  if (!alert.recurring) return 'No schedule';

  const { frequency, time, daysOfWeek } = alert.recurring;
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  switch (frequency) {
    case 'daily': {
      return `Every day at ${time}`;
    }
    case 'weekly': {
      if (daysOfWeek && daysOfWeek.length > 0) {
        const days = daysOfWeek.map((d) => dayNames[d] ?? '?').join(', ');
        return `Every ${days} at ${time}`;
      }
      return `Every week at ${time}`;
    }
    case 'monthly': {
      return `Every month at ${time}`;
    }
  }
}

export function RecurringAlerts({ alerts }: RecurringAlertsProps) {
  const deleteAlert = useDeleteAlert();

  const recurringAlerts = alerts.filter((a) => a.type === 'recurring' || a.recurring !== undefined);

  if (recurringAlerts.length === 0) {
    return (
      <div className="text-muted-foreground flex flex-col items-center justify-center py-12 text-sm">
        <Repeat className="mb-2 h-8 w-8 opacity-50" />
        <p>No recurring alerts</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {recurringAlerts.map((alert) => (
        <div
          key={alert.id}
          className={cn('bg-card border-border flex items-center gap-3 rounded-lg border p-3')}
        >
          <Repeat className="text-primary h-4 w-4 shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-foreground truncate text-sm font-medium">{alert.message}</p>
            <p className="text-muted-foreground text-xs">{formatRecurringSchedule(alert)}</p>
          </div>
          <button
            className="text-muted-foreground hover:text-destructive shrink-0 transition-colors"
            title="Delete recurring alert"
            onClick={() => deleteAlert.mutate(alert.id)}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
