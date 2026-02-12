/**
 * GoalsPanel — Set and view fitness goals
 */

import { useState } from 'react';

import { Plus, Target, Trash2 } from 'lucide-react';

import type { FitnessGoal, FitnessGoalType } from '@shared/types';

import { cn } from '@renderer/shared/lib/utils';

import { useDeleteGoal, useFitnessGoals, useSetGoal } from '../api/useFitness';

// ── Constants ────────────────────────────────────────────────

const GOAL_TYPE_LABELS: Record<FitnessGoalType, string> = {
  weight: 'Weight',
  workout_frequency: 'Workout Frequency',
  lift_target: 'Lift Target',
  cardio_target: 'Cardio Target',
};

const GOAL_TYPES: FitnessGoalType[] = [
  'weight',
  'workout_frequency',
  'lift_target',
  'cardio_target',
];

// ── Component ────────────────────────────────────────────────

export function GoalsPanel() {
  const { data: goals } = useFitnessGoals();
  const setGoal = useSetGoal();
  const deleteGoal = useDeleteGoal();
  const [showForm, setShowForm] = useState(false);
  const [goalType, setGoalType] = useState<FitnessGoalType>('weight');
  const [target, setTarget] = useState('');
  const [unit, setUnit] = useState('kg');

  const displayGoals = goals ?? [];

  function handleSubmit() {
    const targetNum = Number(target);
    if (targetNum <= 0) return;

    setGoal.mutate(
      { type: goalType, target: targetNum, unit },
      {
        onSuccess: () => {
          setTarget('');
          setShowForm(false);
        },
      },
    );
  }

  return (
    <div className="space-y-4">
      {/* Goals list */}
      {displayGoals.length > 0 ? (
        <div className="space-y-3">
          {displayGoals.map((goal) => (
            <GoalCard key={goal.id} goal={goal} onDelete={() => deleteGoal.mutate(goal.id)} />
          ))}
        </div>
      ) : (
        <div className="text-muted-foreground flex h-24 items-center justify-center text-sm">
          <Target className="mr-2 h-5 w-5 opacity-40" />
          No goals set yet
        </div>
      )}

      {/* Add goal form */}
      {showForm ? (
        <div className="bg-card border-border rounded-lg border p-4">
          <h4 className="text-foreground mb-3 text-sm font-medium">Set Goal</h4>
          <div className="space-y-3">
            <div>
              <label className="text-muted-foreground mb-1 block text-xs" htmlFor="goal-type">
                Goal Type
              </label>
              <select
                className="bg-muted text-foreground w-full rounded-md px-3 py-2 text-sm outline-none"
                id="goal-type"
                value={goalType}
                onChange={(e) => setGoalType(e.target.value as FitnessGoalType)}
              >
                {GOAL_TYPES.map((gt) => (
                  <option key={gt} value={gt}>
                    {GOAL_TYPE_LABELS[gt]}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-muted-foreground mb-1 block text-xs" htmlFor="goal-target">
                  Target
                </label>
                <input
                  className="bg-muted text-foreground w-full rounded-md px-3 py-2 text-sm outline-none"
                  id="goal-target"
                  placeholder="100"
                  type="number"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                />
              </div>
              <div className="w-24">
                <label className="text-muted-foreground mb-1 block text-xs" htmlFor="goal-unit">
                  Unit
                </label>
                <input
                  className="bg-muted text-foreground w-full rounded-md px-3 py-2 text-sm outline-none"
                  id="goal-unit"
                  placeholder="kg"
                  type="text"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                disabled={Number(target) <= 0}
                type="button"
                className={cn(
                  'bg-primary text-primary-foreground hover:bg-primary/90 flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  'disabled:opacity-50',
                )}
                onClick={handleSubmit}
              >
                Set Goal
              </button>
              <button
                className="text-muted-foreground hover:bg-accent rounded-md px-3 py-2 text-sm transition-colors"
                type="button"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          className="text-primary flex items-center gap-2 text-sm font-medium"
          type="button"
          onClick={() => setShowForm(true)}
        >
          <Plus className="h-4 w-4" />
          Set New Goal
        </button>
      )}
    </div>
  );
}

// ── GoalCard ─────────────────────────────────────────────────

interface GoalCardProps {
  goal: FitnessGoal;
  onDelete: () => void;
}

function GoalCard({ goal, onDelete }: GoalCardProps) {
  const progress = goal.target > 0 ? Math.min((goal.current / goal.target) * 100, 100) : 0;

  return (
    <div className="bg-card border-border rounded-lg border p-4">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-muted-foreground text-xs font-medium">
            {GOAL_TYPE_LABELS[goal.type]}
          </span>
          <p className="text-foreground text-sm font-semibold">
            {String(goal.current)} / {String(goal.target)} {goal.unit}
          </p>
        </div>
        <button
          aria-label="Delete goal"
          className="text-muted-foreground hover:text-destructive p-1 transition-colors"
          type="button"
          onClick={onDelete}
        >
          <Trash2 className="h-3 w-3" />
        </button>
      </div>
      <div className="bg-muted mt-2 h-2 overflow-hidden rounded-full">
        <div
          className="bg-primary h-full rounded-full transition-all"
          style={{ width: `${String(Math.round(progress))}%` }}
        />
      </div>
      <p className="text-muted-foreground mt-1 text-xs">
        {String(Math.round(progress))}% complete
        {goal.deadline ? ` \u00B7 Due ${goal.deadline}` : ''}
      </p>
    </div>
  );
}
