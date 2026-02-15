/**
 * SubprojectSelector — Shows sub-projects for a project with add/remove controls
 */

import { useState } from 'react';

import { FolderGit2, FolderTree, Loader2, Plus, Trash2 } from 'lucide-react';

import { cn } from '@renderer/shared/lib/utils';

import { useRepoStructure } from '../api/useGit';
import { useSubProjects, useCreateSubProject, useDeleteSubProject } from '../api/useProjects';

interface SubprojectSelectorProps {
  projectId: string;
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

export function SubprojectSelector({ projectId, repoPath }: SubprojectSelectorProps) {
  const { data: structureData, isLoading: structureLoading } = useRepoStructure(repoPath);
  const { data: subProjects, isLoading: subProjectsLoading } = useSubProjects(projectId);
  const createSubProject = useCreateSubProject();
  const deleteSubProject = useDeleteSubProject();

  const [newName, setNewName] = useState('');
  const [newPath, setNewPath] = useState('');

  function handleAdd() {
    if (newName.trim().length === 0 || newPath.trim().length === 0) return;
    createSubProject.mutate(
      { projectId, name: newName.trim(), relativePath: newPath.trim() },
      {
        onSuccess: () => {
          setNewName('');
          setNewPath('');
        },
      },
    );
  }

  function handleRemove(subProjectId: string) {
    deleteSubProject.mutate({ projectId, subProjectId });
  }

  if (structureLoading || subProjectsLoading) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
        <span className="text-muted-foreground">Loading sub-projects...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Structure badge */}
      {structureData ? (
        <div className="flex items-center gap-2">
          <FolderTree className="text-muted-foreground h-4 w-4" />
          <span
            className={cn(
              'rounded-full px-2 py-0.5 text-xs font-medium',
              structureBadgeClass(structureData.structure),
            )}
          >
            {structureLabel(structureData.structure)}
          </span>
        </div>
      ) : null}

      {/* Sub-project list */}
      {subProjects && subProjects.length > 0 ? (
        <div className="space-y-1">
          {subProjects.map((sub) => (
            <div
              key={sub.id}
              className="border-border flex items-center gap-2 rounded-md border px-3 py-2 text-sm"
            >
              <FolderGit2 className="text-muted-foreground h-4 w-4 shrink-0" />
              <div className="min-w-0 flex-1">
                <span className="font-medium">{sub.name}</span>
                <span className="text-muted-foreground ml-2 text-xs">{sub.relativePath}</span>
              </div>
              <button
                aria-label={`Remove ${sub.name}`}
                className="text-muted-foreground hover:text-destructive rounded p-1 transition-colors"
                disabled={deleteSubProject.isPending}
                type="button"
                onClick={() => handleRemove(sub.id)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground text-sm">No sub-projects configured.</p>
      )}

      {/* Add sub-project form */}
      <div className="border-border space-y-2 rounded-lg border p-3">
        <p className="text-xs font-medium">Add Sub-project</p>
        <div className="flex gap-2">
          <input
            placeholder="Name"
            type="text"
            value={newName}
            className={cn(
              'border-border bg-background flex-1 rounded-md border px-2 py-1.5 text-sm',
              'focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none',
            )}
            onChange={(e) => setNewName(e.target.value)}
          />
          <input
            placeholder="Relative path"
            type="text"
            value={newPath}
            className={cn(
              'border-border bg-background flex-1 rounded-md border px-2 py-1.5 text-sm',
              'focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none',
            )}
            onChange={(e) => setNewPath(e.target.value)}
          />
          <button
            type="button"
            className={cn(
              'bg-primary text-primary-foreground rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
              'hover:bg-primary/90 disabled:opacity-50',
            )}
            disabled={
              createSubProject.isPending ||
              newName.trim().length === 0 ||
              newPath.trim().length === 0
            }
            onClick={handleAdd}
          >
            {createSubProject.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
