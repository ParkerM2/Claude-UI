/**
 * MutationErrorToast — Toast notification for mutation errors
 *
 * Renders error toasts from the shared toast store.
 * Positioned fixed bottom-right. Auto-dismisses via the store.
 */

import { AlertTriangle, X } from 'lucide-react';

import { cn } from '@renderer/shared/lib/utils';
import { useToastStore } from '@renderer/shared/stores/toast-store';

export function MutationErrorToast() {
  const toasts = useToastStore((s) => s.toasts);
  const removeToast = useToastStore((s) => s.removeToast);

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div
      aria-label="Error notifications"
      aria-live="assertive"
      className="fixed right-4 bottom-16 z-50 flex flex-col gap-2"
      role="alert"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            'flex max-w-sm items-start gap-3 rounded-lg border p-3 shadow-lg',
            'bg-card border-border text-foreground',
          )}
        >
          <AlertTriangle aria-hidden="true" className="text-destructive mt-0.5 h-4 w-4 shrink-0" />
          <p className="min-w-0 flex-1 text-sm">{toast.message}</p>
          <button
            aria-label="Dismiss error notification"
            className="text-muted-foreground hover:text-foreground shrink-0 p-0.5"
            type="button"
            onClick={() => {
              removeToast(toast.id);
            }}
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
