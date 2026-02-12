/**
 * WorktreeManager — Lists and manages git worktrees for a project
 */

import { useState } from 'react';

import { FolderGit2, Loader2, Plus, Trash2, GitBranch } from 'lucide-react';

import { cn } from '@renderer/shared/lib/utils';

import { useWorktrees, useCreateWorktree, useRemoveWorktree } from '../api/useGit';

interface WorktreeManagerProps {
  projectId: string;
  repoPath: string;
}

export function WorktreeManager({ projectId, repoPath }: WorktreeManagerProps) {
  const { data: worktrees, isLoading } = useWorktrees(projectId);
  const createWorktree = useCreateWorktree();
  const removeWorktree = useRemoveWorktree();

  const [branch, setBranch] = useState('');
  const [worktreePath, setWorktreePath] = useState('');
  const [showForm, setShowForm] = useState(false);

  async function handleCreate() {
    if (!branch || !worktreePath) return;
    await createWorktree.mutateAsync({ repoPath, worktreePath, branch });
    setBranch('');
    setWorktreePath('');
    setShowForm(false);
  }

  function handleRemove(wtPath: string) {
    removeWorktree.mutate({ repoPath, worktreePath: wtPath });
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="text-muted-foreground h-5 w-5 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-sm font-medium">
          <FolderGit2 className="h-4 w-4" />
          Worktrees
        </h3>
        <button
          className={cn(
            'text-muted-foreground hover:text-foreground flex items-center gap-1 text-xs',
            'transition-colors',
          )}
          onClick={() => setShowForm(!showForm)}
        >
          <Plus className="h-3 w-3" />
          New
        </button>
      </div>

      {showForm ? (
        <div className="border-border space-y-2 rounded-md border p-3">
          <input
            className="border-input bg-background w-full rounded-md border px-3 py-1.5 text-sm"
            placeholder="Branch name"
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
          />
          <input
            className="border-input bg-background w-full rounded-md border px-3 py-1.5 text-sm"
            placeholder="Worktree path"
            value={worktreePath}
            onChange={(e) => setWorktreePath(e.target.value)}
          />
          <div className="flex gap-2">
            <button
              disabled={!branch || !worktreePath || createWorktree.isPending}
              className={cn(
                'bg-primary text-primary-foreground rounded-md px-3 py-1 text-xs font-medium',
                'disabled:pointer-events-none disabled:opacity-50',
              )}
              onClick={handleCreate}
            >
              {createWorktree.isPending ? 'Creating...' : 'Create'}
            </button>
            <button
              className="text-muted-foreground hover:text-foreground text-xs"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : null}

      {worktrees && worktrees.length > 0 ? (
        <div className="space-y-1">
          {worktrees.map((wt) => (
            <div
              key={wt.id}
              className={cn(
                'border-border flex items-center justify-between rounded-md border px-3 py-2',
                'text-sm',
              )}
            >
              <div className="flex items-center gap-2">
                <GitBranch className="text-muted-foreground h-3.5 w-3.5" />
                <span className="font-medium">{wt.branch}</span>
                <span className="text-muted-foreground text-xs">{wt.path}</span>
              </div>
              <button
                className="text-muted-foreground hover:text-destructive p-1"
                onClick={() => handleRemove(wt.path)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground text-xs">No worktrees created yet.</p>
      )}
    </div>
  );
}
