/**
 * ActionsCell — AG-Grid cell renderer with row action buttons.
 * Play/Stop toggle and Delete (with confirmation). Icon-only with aria-labels.
 */

import { useState } from 'react';

import { Play, Square, Trash2 } from 'lucide-react';

import type { TaskStatus } from '@shared/types';

import { ConfirmDialog } from '@renderer/shared/components/ConfirmDialog';
import { cn } from '@renderer/shared/lib/utils';

import { useDeleteTask } from '../../api/useTaskMutations';

import type { CustomCellRendererProps } from 'ag-grid-react';

interface ActionsCellData {
  id: string;
  status: TaskStatus;
}

interface ActionsCellProps extends CustomCellRendererProps {
  onPlay?: (taskId: string) => void;
  onStop?: (taskId: string) => void;
  onDelete?: (taskId: string) => void;
}

export function ActionsCell(props: ActionsCellProps) {
  const data = props.data as ActionsCellData | undefined;
  const deleteTask = useDeleteTask();
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  if (!data) {
    return null;
  }

  const taskId = data.id;
  const isRunning = data.status === 'in_progress';

  function handlePlayStop(event: React.MouseEvent) {
    event.stopPropagation();
    if (isRunning) {
      props.onStop?.(taskId);
    } else {
      props.onPlay?.(taskId);
    }
  }

  function handleDeleteClick(event: React.MouseEvent) {
    event.stopPropagation();
    setDeleteConfirmOpen(true);
  }

  return (
    <div className="flex items-center gap-1 py-1">
      <button
        aria-label={isRunning ? 'Stop task' : 'Run task'}
        className={cn(
          'hover:bg-accent rounded p-1.5 transition-colors',
          isRunning ? 'text-warning' : 'text-muted-foreground hover:text-foreground',
        )}
        onClick={handlePlayStop}
      >
        {isRunning ? <Square className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
      </button>
      <button
        aria-label="Delete task"
        className="text-muted-foreground hover:bg-accent hover:text-destructive rounded p-1.5 transition-colors"
        onClick={handleDeleteClick}
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>

      <ConfirmDialog
        confirmLabel="Delete"
        description="Are you sure you want to delete this task? This action cannot be undone."
        loading={deleteTask.isPending}
        open={deleteConfirmOpen}
        title="Delete Task"
        variant="destructive"
        onOpenChange={setDeleteConfirmOpen}
        onConfirm={() => {
          deleteTask.mutate(
            { taskId },
            {
              onSuccess: () => {
                setDeleteConfirmOpen(false);
              },
            },
          );
        }}
      />
    </div>
  );
}
