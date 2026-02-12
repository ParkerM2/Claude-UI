/**
 * BranchSelector — Displays and selects git branches for a project
 */

import { useState } from 'react';

import { ChevronDown, GitBranch, Loader2, Plus } from 'lucide-react';

import { cn } from '@renderer/shared/lib/utils';

import { useGitBranches, useGitStatus, useCreateBranch } from '../api/useGit';

interface BranchSelectorProps {
  repoPath: string;
}

export function BranchSelector({ repoPath }: BranchSelectorProps) {
  const { data: status, isLoading: statusLoading } = useGitStatus(repoPath);
  const { data: branches, isLoading: branchesLoading } = useGitBranches(repoPath);
  const createBranch = useCreateBranch();

  const [isOpen, setIsOpen] = useState(false);
  const [showNewBranch, setShowNewBranch] = useState(false);
  const [newBranchName, setNewBranchName] = useState('');

  const isLoading = statusLoading || branchesLoading;

  async function handleCreateBranch() {
    if (!newBranchName) return;
    await createBranch.mutateAsync({ repoPath, branchName: newBranchName });
    setNewBranchName('');
    setShowNewBranch(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      void handleCreateBranch();
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
        <span className="text-muted-foreground">Loading...</span>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        className={cn(
          'border-border flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm',
          'hover:bg-accent transition-colors',
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <GitBranch className="h-3.5 w-3.5" />
        <span className="font-medium">{status?.branch ?? 'unknown'}</span>
        {status ? (
          <span className="text-muted-foreground text-xs">
            {status.isClean ? '' : `${String(status.modified.length)} modified`}
          </span>
        ) : null}
        <ChevronDown className="h-3 w-3" />
      </button>

      {isOpen ? (
        <div
          className={cn(
            'border-border bg-popover absolute top-full z-50 mt-1 min-w-[200px] rounded-md border shadow-md',
          )}
        >
          <div className="max-h-60 overflow-y-auto p-1">
            {branches?.map((b) => (
              <div
                key={b.name}
                className={cn(
                  'flex items-center gap-2 rounded px-3 py-1.5 text-sm',
                  b.current ? 'bg-accent font-medium' : 'hover:bg-accent/50 cursor-pointer',
                )}
              >
                <GitBranch className="h-3 w-3" />
                <span>{b.name}</span>
                {b.current ? (
                  <span className="text-muted-foreground ml-auto text-xs">current</span>
                ) : null}
              </div>
            ))}
          </div>

          <div className="border-border border-t p-1">
            {showNewBranch ? (
              <div className="flex items-center gap-1 px-2 py-1">
                <input
                  className="border-input bg-background flex-1 rounded border px-2 py-0.5 text-xs"
                  placeholder="new-branch"
                  value={newBranchName}
                  onChange={(e) => setNewBranchName(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <button
                  className="bg-primary text-primary-foreground rounded px-2 py-0.5 text-xs disabled:opacity-50"
                  disabled={!newBranchName || createBranch.isPending}
                  onClick={handleCreateBranch}
                >
                  Create
                </button>
              </div>
            ) : (
              <button
                className="hover:bg-accent/50 flex w-full items-center gap-2 rounded px-3 py-1.5 text-sm"
                onClick={() => setShowNewBranch(true)}
              >
                <Plus className="h-3 w-3" />
                New branch
              </button>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
