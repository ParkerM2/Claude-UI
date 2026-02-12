/**
 * QuickActions — Common action buttons for the assistant
 */

import { Bell, ClipboardList, Play, StickyNote } from 'lucide-react';

import { cn } from '@renderer/shared/lib/utils';

interface QuickAction {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  command: string;
}

const quickActions: QuickAction[] = [
  { label: 'New Note', icon: StickyNote, command: 'create a new note' },
  { label: 'New Task', icon: ClipboardList, command: 'create a new task' },
  { label: 'Run Agent', icon: Play, command: 'run agent on current task' },
  { label: 'Remind Me', icon: Bell, command: 'set a reminder' },
];

interface QuickActionsProps {
  onAction: (command: string) => void;
  disabled?: boolean;
}

export function QuickActions({ disabled, onAction }: QuickActionsProps) {
  return (
    <div className="border-border border-b px-4 py-3">
      <div className="mx-auto flex max-w-3xl gap-2">
        {quickActions.map((action) => (
          <button
            key={action.label}
            disabled={disabled}
            className={cn(
              'border-border text-muted-foreground flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs',
              'hover:bg-accent hover:text-foreground transition-colors',
              'disabled:pointer-events-none disabled:opacity-50',
            )}
            onClick={() => onAction(action.command)}
          >
            <action.icon className="h-3.5 w-3.5" />
            <span>{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
