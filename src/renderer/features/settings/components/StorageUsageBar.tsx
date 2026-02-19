/**
 * StorageUsageBar — Visual bar showing storage breakdown by lifecycle category
 */

import { useMemo } from 'react';

import type { DataLifecycle, DataStoreEntry, DataStoreUsage } from '@shared/types/data-management';

import { cn } from '@renderer/shared/lib/utils';

interface StorageUsageBarProps {
  usage: DataStoreUsage[];
  registry: DataStoreEntry[];
}

interface LifecycleBucket {
  lifecycle: DataLifecycle;
  label: string;
  sizeBytes: number;
  colorClass: string;
}

const LIFECYCLE_CONFIG: Record<DataLifecycle, { label: string; colorClass: string }> = {
  transient: { label: 'Transient', colorClass: 'bg-destructive/60' },
  session: { label: 'Session', colorClass: 'bg-accent' },
  'short-lived': { label: 'Short-lived', colorClass: 'bg-secondary' },
  persistent: { label: 'Persistent', colorClass: 'bg-primary' },
  synced: { label: 'Synced', colorClass: 'bg-muted' },
};

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const base = 1024;
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(base)), units.length - 1);
  const value = bytes / base ** exponent;
  return `${value.toFixed(exponent === 0 ? 0 : 1)} ${units[exponent]}`;
}

export function StorageUsageBar({ usage, registry }: StorageUsageBarProps) {
  const { buckets, totalBytes } = useMemo(() => {
    const registryMap = new Map(registry.map((entry) => [entry.id, entry]));

    const bucketMap = new Map<DataLifecycle, number>();
    let total = 0;

    for (const item of usage) {
      const entry = registryMap.get(item.id);
      if (entry) {
        const current = bucketMap.get(entry.lifecycle) ?? 0;
        bucketMap.set(entry.lifecycle, current + item.sizeBytes);
        total += item.sizeBytes;
      }
    }

    const result: LifecycleBucket[] = [];
    for (const [lifecycle, config] of Object.entries(LIFECYCLE_CONFIG)) {
      const sizeBytes = bucketMap.get(lifecycle as DataLifecycle) ?? 0;
      if (sizeBytes > 0) {
        result.push({
          lifecycle: lifecycle as DataLifecycle,
          label: config.label,
          sizeBytes,
          colorClass: config.colorClass,
        });
      }
    }

    return { buckets: result, totalBytes: total };
  }, [usage, registry]);

  return (
    <div className="border-border bg-card rounded-lg border p-4">
      <div className="mb-2 flex items-baseline justify-between">
        <span className="text-foreground text-sm font-medium">Total Storage</span>
        <span className="text-muted-foreground text-sm">{formatBytes(totalBytes)}</span>
      </div>

      {/* Bar */}
      <div className="bg-muted/30 flex h-3 overflow-hidden rounded-full">
        {buckets.map((bucket) => (
          <div
            key={bucket.lifecycle}
            className={cn('h-full min-w-1 transition-all', bucket.colorClass)}
            style={{ flex: totalBytes > 0 ? bucket.sizeBytes / totalBytes : 0 }}
            title={`${bucket.label}: ${formatBytes(bucket.sizeBytes)}`}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
        {buckets.map((bucket) => (
          <div key={bucket.lifecycle} className="flex items-center gap-1.5">
            <div className={cn('h-2.5 w-2.5 rounded-sm', bucket.colorClass)} />
            <span className="text-muted-foreground text-xs">
              {bucket.label} ({formatBytes(bucket.sizeBytes)})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
