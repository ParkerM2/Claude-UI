/**
 * RepoTypeSelector — Shows detected repo type with icon and description
 */

import { FolderOpen, GitBranch, Layers } from 'lucide-react';

import { cn } from '@renderer/shared/lib/utils';

interface RepoTypeSelectorProps {
  detectedType: string;
  selectedType: string;
  onTypeChange: (type: string) => void;
}

const REPO_TYPES = [
  {
    type: 'single',
    label: 'Single Repo',
    description: 'A single repository with one project',
    icon: FolderOpen,
  },
  {
    type: 'monorepo',
    label: 'Monorepo',
    description: 'Multiple packages in one repository',
    icon: GitBranch,
  },
  {
    type: 'multi-repo',
    label: 'Multi-Repo',
    description: 'Multiple separate repositories in a directory',
    icon: Layers,
  },
] as const;

export function RepoTypeSelector({
  detectedType,
  selectedType,
  onTypeChange,
}: RepoTypeSelectorProps) {
  return (
    <div className="space-y-3">
      <p className="text-muted-foreground text-sm">
        Detected type:{' '}
        <span className="text-foreground font-medium">
          {REPO_TYPES.find((r) => r.type === detectedType)?.label ?? detectedType}
        </span>
      </p>
      <div className="grid grid-cols-3 gap-3">
        {REPO_TYPES.map((repo) => (
          <button
            key={repo.type}
            type="button"
            className={cn(
              'border-border flex flex-col items-center gap-2 rounded-lg border p-4 text-center transition-colors',
              'hover:bg-accent',
              selectedType === repo.type && 'border-primary bg-accent',
            )}
            onClick={() => onTypeChange(repo.type)}
          >
            <repo.icon className="h-6 w-6" />
            <span className="text-sm font-medium">{repo.label}</span>
            <span className="text-muted-foreground text-xs">{repo.description}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
