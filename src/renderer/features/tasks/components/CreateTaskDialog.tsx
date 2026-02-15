/**
 * CreateTaskDialog — Modal dialog for creating a new task
 */

import { useCallback, useEffect, useState } from 'react';

import { AlertTriangle, ListPlus, Loader2, X } from 'lucide-react';

import { cn } from '@renderer/shared/lib/utils';
import { useLayoutStore } from '@renderer/shared/stores/layout-store';

import { useCreateTask } from '../api/useTasks';

type TaskPriority = 'low' | 'normal' | 'high' | 'urgent';

const PRIORITY_OPTIONS: readonly TaskPriority[] = ['low', 'normal', 'high', 'urgent'];

interface CreateTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateTaskDialog({ open, onOpenChange }: CreateTaskDialogProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('normal');
  const [error, setError] = useState<string | null>(null);

  const activeProjectId = useLayoutStore((s) => s.activeProjectId);
  const createTask = useCreateTask();

  const resetForm = useCallback(() => {
    setTitle('');
    setDescription('');
    setPriority('normal');
    setError(null);
  }, []);

  // Reset form when dialog opens or closes
  useEffect(() => {
    resetForm();
  }, [open, resetForm]);

  function handleClose() {
    onOpenChange(false);
  }

  function handleSubmit() {
    if (activeProjectId === null) return;
    if (title.trim().length === 0) return;

    setError(null);
    createTask.mutate(
      {
        projectId: activeProjectId,
        title: title.trim(),
        description: description.trim().length > 0 ? description.trim() : undefined,
        priority: priority === 'normal' ? undefined : priority,
      },
      {
        onSuccess: () => {
          handleClose();
        },
        onError: (err) => {
          setError(err instanceof Error ? err.message : 'Failed to create task');
        },
      },
    );
  }

  if (!open) {
    return null;
  }

  const isFormValid = title.trim().length > 0 && activeProjectId !== null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        aria-label="Close dialog"
        className="absolute inset-0 bg-black/50"
        role="button"
        tabIndex={0}
        onClick={handleClose}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') handleClose();
        }}
      />

      {/* Modal */}
      <div
        aria-labelledby="create-task-dialog-title"
        className="bg-card border-border relative z-10 w-full max-w-lg rounded-lg border shadow-xl"
        role="dialog"
      >
        {/* Header */}
        <div className="border-border flex items-center justify-between border-b px-6 py-4">
          <div className="flex items-center gap-3">
            <ListPlus className="text-primary h-5 w-5" />
            <h2 className="text-foreground text-lg font-semibold" id="create-task-dialog-title">
              Create Task
            </h2>
          </div>
          <button
            aria-label="Close dialog"
            className="text-muted-foreground hover:text-foreground transition-colors"
            type="button"
            onClick={handleClose}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-4 px-6 py-4">
          {activeProjectId === null ? (
            <div className="bg-info/10 text-info rounded-md p-3 text-sm">
              Select a project first to create a task.
            </div>
          ) : null}

          {/* Title field */}
          <div className="space-y-1.5">
            <label className="text-foreground text-sm font-medium" htmlFor="create-task-title">
              Title <span className="text-destructive">*</span>
            </label>
            <input
              aria-required="true"
              disabled={activeProjectId === null}
              id="create-task-title"
              placeholder="Task title..."
              type="text"
              value={title}
              className={cn(
                'bg-card border-border text-foreground placeholder:text-muted-foreground',
                'h-9 w-full rounded-md border px-3 text-sm',
                'focus:border-primary focus:ring-ring focus:ring-1 focus:outline-none',
                'disabled:cursor-not-allowed disabled:opacity-50',
              )}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && isFormValid && !createTask.isPending) {
                  handleSubmit();
                }
              }}
            />
          </div>

          {/* Description field */}
          <div className="space-y-1.5">
            <label
              className="text-foreground text-sm font-medium"
              htmlFor="create-task-description"
            >
              Description
            </label>
            <textarea
              disabled={activeProjectId === null}
              id="create-task-description"
              placeholder="Describe the task..."
              rows={3}
              value={description}
              className={cn(
                'bg-card border-border text-foreground placeholder:text-muted-foreground',
                'w-full resize-none rounded-md border px-3 py-2 text-sm',
                'focus:border-primary focus:ring-ring focus:ring-1 focus:outline-none',
                'disabled:cursor-not-allowed disabled:opacity-50',
              )}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Priority field */}
          <div className="space-y-1.5">
            <label className="text-foreground text-sm font-medium" htmlFor="create-task-priority">
              Priority
            </label>
            <select
              disabled={activeProjectId === null}
              id="create-task-priority"
              value={priority}
              className={cn(
                'bg-card border-border text-foreground',
                'h-9 w-full rounded-md border px-3 text-sm',
                'focus:border-primary focus:ring-ring focus:ring-1 focus:outline-none',
                'disabled:cursor-not-allowed disabled:opacity-50',
              )}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
            >
              {PRIORITY_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt.charAt(0).toUpperCase() + opt.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Error message */}
          {error === null ? null : (
            <div className="rounded-md bg-red-500/10 p-3">
              <div className="flex items-center gap-2 text-sm text-red-400">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-border flex items-center justify-end gap-2 border-t px-6 py-4">
          <button
            type="button"
            className={cn(
              'text-muted-foreground hover:text-foreground rounded-md px-4 py-2 text-sm',
              'transition-colors',
            )}
            onClick={handleClose}
          >
            Cancel
          </button>
          <button
            disabled={!isFormValid || createTask.isPending}
            type="button"
            className={cn(
              'bg-primary text-primary-foreground flex items-center gap-2 rounded-md px-4 py-2',
              'text-sm font-medium transition-opacity hover:opacity-90',
              'disabled:pointer-events-none disabled:opacity-50',
            )}
            onClick={handleSubmit}
          >
            {createTask.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <ListPlus className="h-4 w-4" />
                Create Task
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
