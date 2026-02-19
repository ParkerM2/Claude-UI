/**
 * StepDetails — Wizard step for project name, description, and folder selection
 */

import { FolderOpen, Loader2 } from 'lucide-react';

import { cn } from '@renderer/shared/lib/utils';

interface StepDetailsProps {
  name: string;
  description: string;
  path: string;
  isSelectingFolder: boolean;
  onNameChange: (name: string) => void;
  onDescriptionChange: (description: string) => void;
  onSelectFolder: () => void;
}

export function StepDetails({
  name,
  description,
  path,
  isSelectingFolder,
  onNameChange,
  onDescriptionChange,
  onSelectFolder,
}: StepDetailsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">Project Details</h3>

      <div>
        <label className="text-muted-foreground mb-1 block text-sm" htmlFor="create-wizard-name">
          Project Name <span className="text-destructive">*</span>
        </label>
        <input
          id="create-wizard-name"
          placeholder="my-awesome-project"
          type="text"
          value={name}
          className={cn(
            'border-border bg-background w-full rounded-lg border px-3 py-2 text-sm',
            'focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none',
          )}
          onChange={(e) => onNameChange(e.target.value)}
        />
      </div>

      <div>
        <label
          className="text-muted-foreground mb-1 block text-sm"
          htmlFor="create-wizard-description"
        >
          Description
        </label>
        <textarea
          id="create-wizard-description"
          placeholder="Optional project description"
          rows={2}
          value={description}
          className={cn(
            'border-border bg-background w-full resize-none rounded-lg border px-3 py-2 text-sm',
            'focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none',
          )}
          onChange={(e) => onDescriptionChange(e.target.value)}
        />
      </div>

      <div>
        <label
          className="text-muted-foreground mb-1 block text-sm"
          htmlFor="create-wizard-folder"
        >
          Target Folder
        </label>
        <div className="flex items-center gap-2">
          <button
            disabled={isSelectingFolder}
            id="create-wizard-folder"
            type="button"
            className={cn(
              'border-border bg-background flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors',
              'hover:bg-accent disabled:opacity-50',
            )}
            onClick={onSelectFolder}
          >
            {isSelectingFolder ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <FolderOpen className="h-4 w-4 shrink-0" />
            )}
            {isSelectingFolder ? 'Selecting...' : 'Choose Folder'}
          </button>
          {path.length > 0 ? (
            <span className="text-muted-foreground min-w-0 flex-1 truncate text-xs">{path}</span>
          ) : (
            <span className="text-muted-foreground text-xs italic">No folder selected</span>
          )}
        </div>
      </div>
    </div>
  );
}
