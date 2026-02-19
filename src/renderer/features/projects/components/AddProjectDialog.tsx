/**
 * AddProjectDialog — Modal for adding an existing project after folder selection.
 *
 * Shows project name (pre-filled from folder basename), description, and
 * workspace selector. On submit, creates the project record and starts
 * the setup pipeline.
 */

import { useEffect, useState } from 'react';

import { FolderOpen, Loader2, X } from 'lucide-react';

import { cn } from '@renderer/shared/lib/utils';

import { useWorkspaces } from '@features/workspaces';

import { useAddProject, useSetupExisting } from '../api/useProjects';

const INPUT_BASE_CLASS =
  'border-border bg-background text-foreground w-full rounded-md border px-3 py-2 text-sm';
const INPUT_FOCUS_CLASS = 'focus:ring-ring focus:border-ring focus:outline-none focus:ring-1';
const INPUT_PLACEHOLDER_CLASS = 'placeholder:text-muted-foreground';

interface AddProjectDialogProps {
  open: boolean;
  folderPath: string;
  onClose: () => void;
  onSetupStarted: (projectId: string) => void;
}

export function AddProjectDialog({
  open,
  folderPath,
  onClose,
  onSetupStarted,
}: AddProjectDialogProps) {
  // 1. Hooks
  const addProject = useAddProject();
  const setupExisting = useSetupExisting();
  const { data: workspaces } = useWorkspaces();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [workspaceId, setWorkspaceId] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 2. Derived state
  const isSubmitting = addProject.isPending || setupExisting.isPending;
  const nameIsEmpty = name.trim().length === 0;
  const hasWorkspaces = (workspaces?.length ?? 0) > 0;

  // Pre-fill name from folder basename when dialog opens
  useEffect(() => {
    if (open && folderPath.length > 0) {
      const folderName = folderPath.split(/[\\/]/).pop() ?? '';
      setName(folderName);
      setDescription('');
      setWorkspaceId('');
      setErrorMessage(null);
    }
  }, [open, folderPath]);

  // Escape key closes dialog
  useEffect(() => {
    if (!open) {
      return;
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  // 3. Handlers
  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();

    if (nameIsEmpty || isSubmitting) {
      return;
    }

    setErrorMessage(null);

    try {
      const project = await addProject.mutateAsync({
        path: folderPath,
        name: name.trim(),
        description: description.trim() || undefined,
        workspaceId: workspaceId || undefined,
      });

      // Start the setup pipeline (fire-and-forget — progress tracked via events)
      void setupExisting.mutateAsync({ projectId: project.id });

      onSetupStarted(project.id);
    } catch (error: unknown) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to add project');
    }
  }

  // 4. Render
  if (!open) {
    return null;
  }

  return (
    <div
      aria-label="Add project"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
    >
      {/* Backdrop */}
      <div
        aria-label="Close dialog"
        className="absolute inset-0 bg-black/50"
        role="button"
        tabIndex={0}
        onClick={onClose}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') onClose();
        }}
      />

      {/* Modal */}
      <div className="bg-card border-border relative z-10 w-full max-w-lg rounded-lg border shadow-xl">
        {/* Header */}
        <div className="border-border flex items-center justify-between border-b px-6 py-4">
          <div className="flex items-center gap-3">
            <FolderOpen className="text-primary h-5 w-5" />
            <h2 className="text-foreground text-lg font-semibold">Add Project</h2>
          </div>
          <button
            aria-label="Close"
            className="text-muted-foreground hover:text-foreground transition-colors"
            type="button"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 px-6 py-4">
            {/* Folder path (read-only display) */}
            <div>
              <span className="text-muted-foreground mb-1 block text-xs">Folder</span>
              <p className="bg-muted text-foreground truncate rounded-md px-3 py-2 text-sm">
                {folderPath}
              </p>
            </div>

            {/* Name */}
            <div>
              <label
                className="text-foreground mb-1 block text-sm font-medium"
                htmlFor="add-project-name"
              >
                Name <span className="text-destructive">*</span>
              </label>
              <input
                className={cn(INPUT_BASE_CLASS, INPUT_FOCUS_CLASS, INPUT_PLACEHOLDER_CLASS)}
                id="add-project-name"
                placeholder="Project name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* Description */}
            <div>
              <label
                className="text-foreground mb-1 block text-sm font-medium"
                htmlFor="add-project-description"
              >
                Description
              </label>
              <textarea
                id="add-project-description"
                placeholder="Optional project description"
                rows={3}
                value={description}
                className={cn(
                  INPUT_BASE_CLASS,
                  INPUT_FOCUS_CLASS,
                  INPUT_PLACEHOLDER_CLASS,
                  'resize-none',
                )}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Workspace */}
            {hasWorkspaces ? (
              <div>
                <label
                  className="text-foreground mb-1 block text-sm font-medium"
                  htmlFor="add-project-workspace"
                >
                  Workspace
                </label>
                <select
                  className={cn(INPUT_BASE_CLASS, INPUT_FOCUS_CLASS)}
                  id="add-project-workspace"
                  value={workspaceId}
                  onChange={(e) => setWorkspaceId(e.target.value)}
                >
                  <option value="">No workspace</option>
                  {workspaces?.map((ws) => (
                    <option key={ws.id} value={ws.id}>
                      {ws.name}
                    </option>
                  ))}
                </select>
              </div>
            ) : null}
          </div>

          {/* Error message */}
          {errorMessage === null ? null : (
            <div className="mx-6 mb-4 rounded-md bg-destructive/10 p-3">
              <p className="text-destructive text-sm">{errorMessage}</p>
            </div>
          )}

          {/* Footer */}
          <div className="border-border flex items-center justify-end gap-2 border-t px-6 py-4">
            <button
              type="button"
              className={cn(
                'text-muted-foreground hover:text-foreground rounded-md px-4 py-2 text-sm',
                'transition-colors',
              )}
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              disabled={nameIsEmpty || isSubmitting}
              type="submit"
              className={cn(
                'bg-primary text-primary-foreground flex items-center gap-2 rounded-md px-4 py-2',
                'text-sm font-medium transition-opacity hover:opacity-90',
                'disabled:pointer-events-none disabled:opacity-50',
              )}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Setting up...
                </>
              ) : (
                'Add & Setup'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
