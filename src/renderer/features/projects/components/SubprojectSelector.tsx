/**
 * SubprojectSelector — Shows detected repo structure and subprojects
 */

import { FolderTree, Loader2 } from 'lucide-react';

import { cn } from '@renderer/shared/lib/utils';

import { useRepoStructure } from '../api/useGit';

interface SubprojectSelectorProps {
  repoPath: string;
}

function structureLabel(structure: string): string {
  if (structure === 'monorepo') return 'Monorepo';
  if (structure === 'polyrepo') return 'Polyrepo';
  return 'Single repo';
}

function structureBadgeClass(structure: string): string {
  if (structure === 'monorepo') return 'bg-info/10 text-info';
  if (structure === 'polyrepo') return 'bg-warning/10 text-warning';
  return 'bg-muted text-muted-foreground';
}

export function SubprojectSelector({ repoPath }: SubprojectSelectorProps) {
  const { data, isLoading } = useRepoStructure(repoPath);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
        <span className="text-muted-foreground">Detecting structure...</span>
      </div>
    );
  }

  if (!data) return null;

  const { structure } = data;

  return (
    <div className="flex items-center gap-2">
      <FolderTree className="text-muted-foreground h-4 w-4" />
      <span
        className={cn(
          'rounded-full px-2 py-0.5 text-xs font-medium',
          structureBadgeClass(structure),
        )}
      >
        {structureLabel(structure)}
      </span>
    </div>
  );
}
