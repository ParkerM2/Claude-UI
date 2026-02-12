/**
 * WorkoutLog — Recent workouts list
 */

import { Trash2 } from 'lucide-react';

import type { Workout } from '@shared/types';

import { cn } from '@renderer/shared/lib/utils';

import { useDeleteWorkout, useWorkouts } from '../api/useFitness';

// ── Constants ────────────────────────────────────────────────

const TYPE_LABELS: Record<string, string> = {
  strength: 'Strength',
  cardio: 'Cardio',
  flexibility: 'Flexibility',
  sport: 'Sport',
};

const TYPE_COLORS: Record<string, string> = {
  strength: 'bg-primary/10 text-primary',
  cardio: 'bg-success/10 text-success',
  flexibility: 'bg-info/10 text-info',
  sport: 'bg-warning/10 text-warning',
};

// ── Component ────────────────────────────────────────────────

export function WorkoutLog() {
  const { data: workouts } = useWorkouts();
  const deleteWorkout = useDeleteWorkout();

  const displayWorkouts = workouts ?? [];

  if (displayWorkouts.length === 0) {
    return (
      <div className="text-muted-foreground flex h-32 items-center justify-center text-sm">
        No workouts logged yet
      </div>
    );
  }

  return (
    <div className="divide-border divide-y">
      {displayWorkouts.slice(0, 20).map((workout) => (
        <WorkoutItem
          key={workout.id}
          workout={workout}
          onDelete={() => deleteWorkout.mutate(workout.id)}
        />
      ))}
    </div>
  );
}

// ── WorkoutItem ──────────────────────────────────────────────

interface WorkoutItemProps {
  workout: Workout;
  onDelete: () => void;
}

function WorkoutItem({ workout, onDelete }: WorkoutItemProps) {
  const exerciseCount = workout.exercises.length;
  const totalSets = workout.exercises.reduce((sum, e) => sum + e.sets.length, 0);

  return (
    <div className="flex items-center justify-between px-4 py-3">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'rounded-full px-2 py-0.5 text-xs font-medium',
              TYPE_COLORS[workout.type] ?? 'bg-muted text-muted-foreground',
            )}
          >
            {TYPE_LABELS[workout.type] ?? workout.type}
          </span>
          <span className="text-muted-foreground text-xs">{workout.date}</span>
        </div>
        <p className="text-foreground mt-1 text-sm">
          {String(exerciseCount)} exercise{exerciseCount === 1 ? '' : 's'} &middot;{' '}
          {String(totalSets)} set{totalSets === 1 ? '' : 's'} &middot; {String(workout.duration)}{' '}
          min
        </p>
        {workout.exercises.length > 0 ? (
          <p className="text-muted-foreground mt-0.5 text-xs">
            {workout.exercises.map((e) => e.name).join(', ')}
          </p>
        ) : null}
      </div>
      <button
        aria-label="Delete workout"
        className="text-muted-foreground hover:text-destructive rounded-md p-1.5 transition-colors"
        type="button"
        onClick={onDelete}
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}
