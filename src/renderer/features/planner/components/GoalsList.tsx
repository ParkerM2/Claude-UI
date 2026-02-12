/**
 * GoalsList — Daily goals checklist
 */

import { useState } from 'react';

import { Check, Plus, Trash2, X } from 'lucide-react';

import { cn } from '@renderer/shared/lib/utils';

interface GoalsListProps {
  goals: string[];
  onUpdate: (goals: string[]) => void;
}

export function GoalsList({ goals, onUpdate }: GoalsListProps) {
  const [newGoal, setNewGoal] = useState('');
  const [completed, setCompleted] = useState<Set<number>>(new Set());

  function handleAdd() {
    const trimmed = newGoal.trim();
    if (trimmed.length === 0) return;
    onUpdate([...goals, trimmed]);
    setNewGoal('');
  }

  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.key === 'Enter') {
      handleAdd();
    }
  }

  function handleRemove(index: number) {
    const updated = goals.filter((_g, idx) => idx !== index);
    const updatedCompleted = new Set<number>();
    for (const c of completed) {
      if (c < index) {
        updatedCompleted.add(c);
      } else if (c > index) {
        updatedCompleted.add(c - 1);
      }
    }
    setCompleted(updatedCompleted);
    onUpdate(updated);
  }

  function handleToggle(index: number) {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }

  return (
    <div className="space-y-3">
      <h3 className="text-foreground text-sm font-semibold">Daily Goals</h3>

      {goals.length === 0 ? (
        <p className="text-muted-foreground text-xs">No goals set for today.</p>
      ) : (
        <ul className="space-y-1.5">
          {goals.map((goal, index) => {
            const isComplete = completed.has(index);
            return (
              <li key={`goal-${String(index)}`} className="group flex items-center gap-2">
                <button
                  aria-label={isComplete ? 'Mark incomplete' : 'Mark complete'}
                  className={cn(
                    'flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors',
                    isComplete
                      ? 'border-success bg-success text-success-foreground'
                      : 'border-border hover:border-primary',
                  )}
                  onClick={() => handleToggle(index)}
                >
                  {isComplete ? <Check className="h-3 w-3" /> : null}
                </button>
                <span
                  className={cn(
                    'flex-1 text-sm',
                    isComplete ? 'text-muted-foreground line-through' : 'text-foreground',
                  )}
                >
                  {goal}
                </span>
                <button
                  aria-label="Remove goal"
                  className="text-muted-foreground hover:text-destructive opacity-0 transition-opacity group-hover:opacity-100"
                  onClick={() => handleRemove(index)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <div className="flex items-center gap-2">
        <input
          className="border-input bg-background text-foreground placeholder:text-muted-foreground focus:ring-ring flex-1 rounded-md border px-2.5 py-1.5 text-sm outline-none focus:ring-1"
          placeholder="Add a goal..."
          type="text"
          value={newGoal}
          onChange={(event) => setNewGoal(event.target.value)}
          onKeyDown={handleKeyDown}
        />
        {newGoal.trim().length > 0 ? (
          <>
            <button
              aria-label="Add goal"
              className="text-primary hover:text-primary/80 transition-colors"
              onClick={handleAdd}
            >
              <Plus className="h-4 w-4" />
            </button>
            <button
              aria-label="Cancel"
              className="text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setNewGoal('')}
            >
              <X className="h-4 w-4" />
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
}
