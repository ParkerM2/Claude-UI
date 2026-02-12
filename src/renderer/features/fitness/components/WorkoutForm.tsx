/**
 * WorkoutForm — Log a new workout
 */

import { useState } from 'react';

import { Plus, Send, Trash2, X } from 'lucide-react';

import type { Exercise, ExerciseSet, WorkoutType } from '@shared/types';

import { cn } from '@renderer/shared/lib/utils';

import { useLogWorkout } from '../api/useFitness';
import { useFitnessUI } from '../store';

// ── Helpers ─────────────────────────────────────────────────

let nextId = 0;
function uid(): string {
  nextId += 1;
  return `ex-${String(nextId)}`;
}

interface FormExercise extends Exercise {
  _key: string;
  _setKeys: string[];
}

// ── Constants ────────────────────────────────────────────────

const WORKOUT_TYPES: Array<{ value: WorkoutType; label: string }> = [
  { value: 'strength', label: 'Strength' },
  { value: 'cardio', label: 'Cardio' },
  { value: 'flexibility', label: 'Flexibility' },
  { value: 'sport', label: 'Sport' },
];

// ── Component ────────────────────────────────────────────────

export function WorkoutForm() {
  const logWorkout = useLogWorkout();
  const { setShowWorkoutForm } = useFitnessUI();

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [type, setType] = useState<WorkoutType>('strength');
  const [duration, setDuration] = useState('');
  const [notes, setNotes] = useState('');
  const [exercises, setExercises] = useState<FormExercise[]>([]);

  function handleAddExercise() {
    setExercises([...exercises, { name: '', sets: [{}], _key: uid(), _setKeys: [uid()] }]);
  }

  function handleRemoveExercise(index: number) {
    setExercises(exercises.filter((_, i) => i !== index));
  }

  function handleExerciseNameChange(index: number, name: string) {
    const updated = [...exercises];
    updated[index] = { ...updated[index], name };
    setExercises(updated);
  }

  function handleAddSet(exerciseIndex: number) {
    const updated = [...exercises];
    updated[exerciseIndex] = {
      ...updated[exerciseIndex],
      sets: [...updated[exerciseIndex].sets, {}],
      _setKeys: [...updated[exerciseIndex]._setKeys, uid()],
    };
    setExercises(updated);
  }

  function handleSetChange(
    exerciseIndex: number,
    setIndex: number,
    field: keyof ExerciseSet,
    value: string,
  ) {
    const updated = [...exercises];
    const sets = [...updated[exerciseIndex].sets];
    const numericValue = value === '' ? undefined : Number(value);
    sets[setIndex] = { ...sets[setIndex], [field]: numericValue };
    updated[exerciseIndex] = { ...updated[exerciseIndex], sets };
    setExercises(updated);
  }

  function handleSubmit() {
    const durationNum = Number(duration);
    if (durationNum <= 0) return;

    const validExercises = exercises.filter((e) => e.name.trim().length > 0);

    logWorkout.mutate(
      {
        date,
        type,
        duration: durationNum,
        exercises: validExercises,
        notes: notes.trim().length > 0 ? notes.trim() : undefined,
      },
      {
        onSuccess: () => {
          setShowWorkoutForm(false);
        },
      },
    );
  }

  return (
    <div className="bg-card border-border rounded-lg border">
      {/* Header */}
      <div className="border-border flex items-center justify-between border-b px-4 py-3">
        <h3 className="text-foreground text-sm font-semibold">Log Workout</h3>
        <button
          aria-label="Close form"
          className="text-muted-foreground hover:bg-accent rounded-md p-1 transition-colors"
          type="button"
          onClick={() => setShowWorkoutForm(false)}
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-4 p-4">
        {/* Date + Type */}
        <div className="flex gap-3">
          <div className="flex-1">
            <label
              className="text-muted-foreground mb-1 block text-xs font-medium"
              htmlFor="workout-date"
            >
              Date
            </label>
            <input
              className="bg-muted text-foreground w-full rounded-md px-3 py-2 text-sm outline-none"
              id="workout-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="flex-1">
            <label
              className="text-muted-foreground mb-1 block text-xs font-medium"
              htmlFor="workout-type"
            >
              Type
            </label>
            <select
              className="bg-muted text-foreground w-full rounded-md px-3 py-2 text-sm outline-none"
              id="workout-type"
              value={type}
              onChange={(e) => setType(e.target.value as WorkoutType)}
            >
              {WORKOUT_TYPES.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Duration */}
        <div>
          <label
            className="text-muted-foreground mb-1 block text-xs font-medium"
            htmlFor="workout-duration"
          >
            Duration (minutes)
          </label>
          <input
            className="bg-muted text-foreground w-full rounded-md px-3 py-2 text-sm outline-none"
            id="workout-duration"
            min="1"
            placeholder="45"
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
        </div>

        {/* Exercises */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-muted-foreground text-xs font-medium">Exercises</span>
            <button
              className="text-primary flex items-center gap-1 text-xs font-medium"
              type="button"
              onClick={handleAddExercise}
            >
              <Plus className="h-3 w-3" />
              Add Exercise
            </button>
          </div>
          <div className="space-y-3">
            {exercises.map((exercise, exerciseIndex) => (
              <ExerciseInput
                key={exercise._key}
                exercise={exercise}
                exerciseIndex={exerciseIndex}
                onAddSet={() => handleAddSet(exerciseIndex)}
                onNameChange={(name) => handleExerciseNameChange(exerciseIndex, name)}
                onRemove={() => handleRemoveExercise(exerciseIndex)}
                onSetChange={(setIndex, field, value) =>
                  handleSetChange(exerciseIndex, setIndex, field, value)
                }
              />
            ))}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label
            className="text-muted-foreground mb-1 block text-xs font-medium"
            htmlFor="workout-notes"
          >
            Notes
          </label>
          <textarea
            className="bg-muted text-foreground h-16 w-full resize-none rounded-md px-3 py-2 text-sm outline-none"
            id="workout-notes"
            placeholder="Optional notes..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        {/* Submit */}
        <button
          disabled={Number(duration) <= 0}
          type="button"
          className={cn(
            'bg-primary text-primary-foreground hover:bg-primary/90 flex w-full items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
            'disabled:opacity-50',
          )}
          onClick={handleSubmit}
        >
          <Send className="h-4 w-4" />
          Log Workout
        </button>
      </div>
    </div>
  );
}

// ── ExerciseInput ────────────────────────────────────────────

interface ExerciseInputProps {
  exercise: FormExercise;
  exerciseIndex: number;
  onNameChange: (name: string) => void;
  onRemove: () => void;
  onAddSet: () => void;
  onSetChange: (setIndex: number, field: keyof ExerciseSet, value: string) => void;
}

function ExerciseInput({
  exercise,
  exerciseIndex,
  onNameChange,
  onRemove,
  onAddSet,
  onSetChange,
}: ExerciseInputProps) {
  return (
    <div className="bg-muted/50 rounded-md p-3">
      <div className="mb-2 flex items-center gap-2">
        <input
          aria-label={`Exercise ${String(exerciseIndex + 1)} name`}
          className="bg-muted text-foreground flex-1 rounded px-2 py-1 text-sm outline-none"
          placeholder="Exercise name"
          type="text"
          value={exercise.name}
          onChange={(e) => onNameChange(e.target.value)}
        />
        <button
          aria-label="Remove exercise"
          className="text-muted-foreground hover:text-destructive p-1"
          type="button"
          onClick={onRemove}
        >
          <Trash2 className="h-3 w-3" />
        </button>
      </div>
      <div className="space-y-1">
        {exercise.sets.map((exerciseSet, setIndex) => (
          <div key={exercise._setKeys[setIndex]} className="flex items-center gap-2">
            <span className="text-muted-foreground w-8 text-xs">S{String(setIndex + 1)}</span>
            <input
              aria-label={`Set ${String(setIndex + 1)} reps`}
              className="bg-muted w-16 rounded px-2 py-1 text-xs outline-none"
              placeholder="Reps"
              type="number"
              value={exerciseSet.reps ?? ''}
              onChange={(e) => onSetChange(setIndex, 'reps', e.target.value)}
            />
            <input
              aria-label={`Set ${String(setIndex + 1)} weight`}
              className="bg-muted w-20 rounded px-2 py-1 text-xs outline-none"
              placeholder="Weight"
              type="number"
              value={exerciseSet.weight ?? ''}
              onChange={(e) => onSetChange(setIndex, 'weight', e.target.value)}
            />
            <span className="text-muted-foreground text-xs">lbs</span>
          </div>
        ))}
      </div>
      <button className="text-primary mt-1 text-xs font-medium" type="button" onClick={onAddSet}>
        + Add Set
      </button>
    </div>
  );
}
