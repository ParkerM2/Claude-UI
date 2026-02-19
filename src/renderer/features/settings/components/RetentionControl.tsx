/**
 * RetentionControl — Per-store retention editor card
 */

import { useState } from 'react';

import { Loader2 } from 'lucide-react';

import type { DataStoreEntry, DataStoreUsage, RetentionPolicy } from '@shared/types/data-management';

import { ConfirmDialog } from '@renderer/shared/components/ConfirmDialog';
import { cn } from '@renderer/shared/lib/utils';

interface RetentionControlProps {
  entry: DataStoreEntry;
  retention?: RetentionPolicy;
  onUpdate: (policy: Partial<RetentionPolicy>) => void;
  onClear: () => void;
  usage?: DataStoreUsage;
  clearPending?: boolean;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const base = 1024;
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(base)), units.length - 1);
  const value = bytes / base ** exponent;
  return `${value.toFixed(exponent === 0 ? 0 : 1)} ${units[exponent]}`;
}

function getLifecycleColor(lifecycle: string): string {
  switch (lifecycle) {
    case 'transient':
      return 'bg-destructive/20 text-destructive';
    case 'session':
      return 'bg-accent text-accent-foreground';
    case 'short-lived':
      return 'bg-secondary text-secondary-foreground';
    case 'persistent':
      return 'bg-primary/20 text-primary';
    case 'synced':
      return 'bg-muted text-muted-foreground';
    default:
      return 'bg-muted text-muted-foreground';
  }
}

export function RetentionControl({
  entry,
  retention,
  onUpdate,
  onClear,
  usage,
  clearPending = false,
}: RetentionControlProps) {
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);

  const isEnabled = retention?.enabled ?? entry.defaultRetention.enabled;
  const maxAgeDays = retention?.maxAgeDays ?? entry.defaultRetention.maxAgeDays;
  const maxItems = retention?.maxItems ?? entry.defaultRetention.maxItems;

  function handleToggle() {
    onUpdate({ enabled: !isEnabled });
  }

  function handleMaxAgeDaysChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = Number(event.target.value);
    if (value >= 0) {
      onUpdate({ maxAgeDays: value > 0 ? value : undefined });
    }
  }

  function handleMaxItemsChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = Number(event.target.value);
    if (value >= 0) {
      onUpdate({ maxItems: value > 0 ? value : undefined });
    }
  }

  function handleClearConfirm() {
    onClear();
    setConfirmClearOpen(false);
  }

  return (
    <>
      <div className="border-border bg-card rounded-lg border p-4">
        {/* Header */}
        <div className="mb-2 flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-foreground truncate text-sm font-medium">{entry.label}</h3>
              <span
                className={cn(
                  'inline-flex shrink-0 rounded px-1.5 py-0.5 text-xs font-medium',
                  getLifecycleColor(entry.lifecycle),
                )}
              >
                {entry.lifecycle}
              </span>
            </div>
            <p className="text-muted-foreground mt-0.5 text-xs">{entry.description}</p>
          </div>
        </div>

        {/* Badges */}
        <div className="mb-3 flex flex-wrap gap-1.5">
          {entry.hubSynced ? (
            <span className="bg-info/10 text-info inline-flex rounded px-1.5 py-0.5 text-xs">
              Hub Synced
            </span>
          ) : null}
          {entry.encrypted ? (
            <span className="bg-success/10 text-success inline-flex rounded px-1.5 py-0.5 text-xs">
              Encrypted
            </span>
          ) : null}
          {entry.sensitive ? (
            <span className="bg-warning/10 text-warning inline-flex rounded px-1.5 py-0.5 text-xs">
              Sensitive
            </span>
          ) : null}
        </div>

        {/* Usage */}
        {usage === undefined ? null : (
          <div className="text-muted-foreground mb-3 flex gap-4 text-xs">
            <span>Size: {formatBytes(usage.sizeBytes)}</span>
            <span>Items: {String(usage.itemCount)}</span>
          </div>
        )}

        {/* Retention toggle */}
        <div className="mb-2 flex items-center gap-2">
          <label className="flex items-center gap-2 text-sm" htmlFor={`retention-${entry.id}`}>
            <input
              checked={isEnabled}
              className="accent-primary h-4 w-4"
              id={`retention-${entry.id}`}
              type="checkbox"
              onChange={handleToggle}
            />
            Retention enabled
          </label>
        </div>

        {/* Retention fields (shown only when enabled) */}
        {isEnabled ? (
          <div className="ml-6 flex gap-4">
            <label className="flex items-center gap-1.5 text-xs" htmlFor={`age-${entry.id}`}>
              Max age (days):
              <input
                className="border-input bg-background w-16 rounded border px-2 py-1 text-xs"
                id={`age-${entry.id}`}
                min={0}
                type="number"
                value={maxAgeDays ?? ''}
                onChange={handleMaxAgeDaysChange}
              />
            </label>
            <label className="flex items-center gap-1.5 text-xs" htmlFor={`items-${entry.id}`}>
              Max items:
              <input
                className="border-input bg-background w-16 rounded border px-2 py-1 text-xs"
                id={`items-${entry.id}`}
                min={0}
                type="number"
                value={maxItems ?? ''}
                onChange={handleMaxItemsChange}
              />
            </label>
          </div>
        ) : null}

        {/* Clear button */}
        {entry.canClear ? (
          <div className="mt-3 border-t border-border pt-3">
            <button
              disabled={clearPending}
              type="button"
              className={cn(
                'text-destructive hover:bg-destructive/10 flex items-center gap-1.5 rounded px-2.5 py-1 text-xs transition-colors',
                'disabled:pointer-events-none disabled:opacity-50',
              )}
              onClick={() => {
                setConfirmClearOpen(true);
              }}
            >
              {clearPending ? <Loader2 className="h-3 w-3 animate-spin" /> : null}
              Clear store data
            </button>
          </div>
        ) : null}
      </div>

      <ConfirmDialog
        confirmLabel="Clear"
        description={`This will remove all data from "${entry.label}". This action cannot be undone.`}
        loading={clearPending}
        open={confirmClearOpen}
        title={`Clear ${entry.label}?`}
        variant="destructive"
        onConfirm={handleClearConfirm}
        onOpenChange={setConfirmClearOpen}
      />
    </>
  );
}
