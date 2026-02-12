/**
 * AlertNotification — Toast-style notification for triggered alerts
 */

import { Bell, X } from 'lucide-react';

import { cn } from '@renderer/shared/lib/utils';

import { useDismissAlert } from '../api/useAlerts';
import { useAlertStore } from '../store';

export function AlertNotification() {
  const notifications = useAlertStore((s) => s.notifications);
  const dismissNotification = useAlertStore((s) => s.dismissNotification);
  const dismissAlert = useDismissAlert();

  if (notifications.length === 0) {
    return null;
  }

  function handleDismiss(alertId: string) {
    dismissNotification(alertId);
    dismissAlert.mutate(alertId);
  }

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {notifications.map((notification) => (
        <div
          key={notification.alertId}
          className={cn(
            'bg-card border-border flex items-start gap-3 rounded-lg border p-4',
            'shadow-lg',
            'animate-in slide-in-from-right fade-in',
            'max-w-sm',
          )}
        >
          <Bell className="text-primary mt-0.5 h-4 w-4 shrink-0" />
          <p className="text-foreground flex-1 text-sm">{notification.message}</p>
          <button
            className="text-muted-foreground hover:text-foreground shrink-0"
            onClick={() => handleDismiss(notification.alertId)}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
