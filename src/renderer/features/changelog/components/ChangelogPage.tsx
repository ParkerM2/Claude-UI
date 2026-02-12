import { Plus, RefreshCw, ScrollText, Trash2, Wrench } from 'lucide-react';

import type { ChangeCategory, ChangeType } from '@shared/types';

import { useChangelog } from '../api/useChangelog';

const CATEGORY_CONFIG: Record<
  ChangeType,
  { label: string; icon: React.ComponentType<{ className?: string }>; cssVar: string }
> = {
  added: { label: 'Added', icon: Plus, cssVar: '--success' },
  changed: { label: 'Changed', icon: RefreshCw, cssVar: '--info' },
  fixed: { label: 'Fixed', icon: Wrench, cssVar: '--warning' },
  removed: { label: 'Removed', icon: Trash2, cssVar: '--destructive' },
};

function CategorySection({ category }: { category: ChangeCategory }) {
  const config = CATEGORY_CONFIG[category.type];
  const IconComponent = config.icon;

  return (
    <div className="space-y-2">
      <div
        className="flex items-center gap-2 text-sm font-semibold"
        style={{ color: `hsl(var(${config.cssVar}))` }}
      >
        <IconComponent className="h-4 w-4" />
        <span>{config.label}</span>
      </div>
      <ul className="text-foreground space-y-1 pl-6 text-sm">
        {category.items.map((item) => (
          <li key={item} className="list-disc">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function VersionCard({
  entry,
}: {
  entry: { version: string; date: string; categories: ChangeCategory[] };
}) {
  return (
    <div className="relative pl-8">
      {/* Timeline dot */}
      <div className="border-primary bg-primary/30 absolute top-1 left-0 h-3 w-3 rounded-full border-2" />

      {/* Version header */}
      <div className="mb-3">
        <h3 className="text-foreground text-lg font-semibold">
          {entry.version}{' '}
          <span className="text-muted-foreground text-sm font-normal">-- {entry.date}</span>
        </h3>
      </div>

      {/* Content card */}
      <div className="border-border bg-card space-y-4 rounded-lg border p-4">
        {entry.categories.map((category) => (
          <CategorySection key={category.type} category={category} />
        ))}
      </div>
    </div>
  );
}

export function ChangelogPage() {
  const { data: entries, isLoading } = useChangelog();
  const items = entries ?? [];

  return (
    <div className="h-full overflow-y-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <ScrollText className="text-muted-foreground h-6 w-6" />
          <h1 className="text-foreground text-2xl font-bold">Changelog</h1>
        </div>
        <p className="text-muted-foreground mt-1 text-sm">Version history and release notes</p>
      </div>

      {/* Timeline */}
      {isLoading ? (
        <div className="text-muted-foreground flex items-center justify-center py-12">
          Loading changelog...
        </div>
      ) : null}

      {!isLoading && items.length > 0 ? (
        <div className="relative space-y-8">
          {/* Timeline line */}
          <div className="bg-border absolute top-0 bottom-0 left-[5px] w-px" />

          {items.map((entry) => (
            <VersionCard key={entry.version} entry={entry} />
          ))}
        </div>
      ) : null}

      {!isLoading && items.length === 0 ? (
        <div className="border-border rounded-lg border border-dashed p-12 text-center">
          <ScrollText className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
          <p className="text-lg font-medium">No changelog entries</p>
          <p className="text-muted-foreground mt-1 text-sm">
            Entries will appear here as releases are published
          </p>
        </div>
      ) : null}
    </div>
  );
}
