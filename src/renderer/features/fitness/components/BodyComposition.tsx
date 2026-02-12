/**
 * BodyComposition — Body composition breakdown and measurement logging
 */

import { useState } from 'react';

import { Plus, Scale } from 'lucide-react';

import { cn } from '@renderer/shared/lib/utils';

import { useLogMeasurement, useMeasurements } from '../api/useFitness';

// ── Component ────────────────────────────────────────────────

export function BodyComposition() {
  const { data: measurements } = useMeasurements(30);
  const logMeasurement = useLogMeasurement();
  const [showForm, setShowForm] = useState(false);
  const [weight, setWeight] = useState('');
  const [bodyFat, setBodyFat] = useState('');

  const displayMeasurements = measurements ?? [];
  const latest = displayMeasurements.length > 0 ? displayMeasurements[0] : null;

  function handleSubmit() {
    const weightNum = weight === '' ? undefined : Number(weight);
    const bodyFatNum = bodyFat === '' ? undefined : Number(bodyFat);

    if (weightNum === undefined && bodyFatNum === undefined) return;

    logMeasurement.mutate(
      {
        date: new Date().toISOString().split('T')[0],
        weight: weightNum,
        bodyFat: bodyFatNum,
        source: 'manual',
      },
      {
        onSuccess: () => {
          setWeight('');
          setBodyFat('');
          setShowForm(false);
        },
      },
    );
  }

  return (
    <div className="space-y-4">
      {/* Latest measurements */}
      {latest ? (
        <div className="bg-card border-border rounded-lg border p-4">
          <h4 className="text-muted-foreground mb-3 text-xs font-medium tracking-wider uppercase">
            Latest Measurements
          </h4>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {latest.weight === undefined ? null : (
              <div>
                <span className="text-muted-foreground text-xs">Weight</span>
                <p className="text-foreground text-lg font-bold">{String(latest.weight)} kg</p>
              </div>
            )}
            {latest.bodyFat === undefined ? null : (
              <div>
                <span className="text-muted-foreground text-xs">Body Fat</span>
                <p className="text-foreground text-lg font-bold">{String(latest.bodyFat)}%</p>
              </div>
            )}
            {latest.muscleMass === undefined ? null : (
              <div>
                <span className="text-muted-foreground text-xs">Muscle Mass</span>
                <p className="text-foreground text-lg font-bold">{String(latest.muscleMass)} kg</p>
              </div>
            )}
            {latest.waterPercentage === undefined ? null : (
              <div>
                <span className="text-muted-foreground text-xs">Water</span>
                <p className="text-foreground text-lg font-bold">
                  {String(latest.waterPercentage)}%
                </p>
              </div>
            )}
            {latest.visceralFat === undefined ? null : (
              <div>
                <span className="text-muted-foreground text-xs">Visceral Fat</span>
                <p className="text-foreground text-lg font-bold">{String(latest.visceralFat)}</p>
              </div>
            )}
          </div>
          <p className="text-muted-foreground mt-2 text-xs">
            {latest.date} &middot; {latest.source}
          </p>
        </div>
      ) : (
        <div className="text-muted-foreground flex h-24 items-center justify-center text-sm">
          <Scale className="mr-2 h-5 w-5 opacity-40" />
          No measurements recorded yet
        </div>
      )}

      {/* Add measurement */}
      {showForm ? (
        <div className="bg-card border-border rounded-lg border p-4">
          <h4 className="text-foreground mb-3 text-sm font-medium">Log Measurement</h4>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-muted-foreground mb-1 block text-xs" htmlFor="measure-weight">
                Weight (kg)
              </label>
              <input
                className="bg-muted text-foreground w-full rounded-md px-3 py-2 text-sm outline-none"
                id="measure-weight"
                placeholder="75.5"
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <label className="text-muted-foreground mb-1 block text-xs" htmlFor="measure-bodyfat">
                Body Fat (%)
              </label>
              <input
                className="bg-muted text-foreground w-full rounded-md px-3 py-2 text-sm outline-none"
                id="measure-bodyfat"
                placeholder="18.5"
                type="number"
                value={bodyFat}
                onChange={(e) => setBodyFat(e.target.value)}
              />
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            <button
              disabled={weight === '' && bodyFat === ''}
              type="button"
              className={cn(
                'bg-primary text-primary-foreground hover:bg-primary/90 flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                'disabled:opacity-50',
              )}
              onClick={handleSubmit}
            >
              Save
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
      ) : (
        <button
          className="text-primary flex items-center gap-2 text-sm font-medium"
          type="button"
          onClick={() => setShowForm(true)}
        >
          <Plus className="h-4 w-4" />
          Log Measurement
        </button>
      )}

      {/* History */}
      {displayMeasurements.length > 1 ? (
        <div className="bg-card border-border rounded-lg border">
          <h4 className="text-muted-foreground border-border border-b px-4 py-2 text-xs font-medium tracking-wider uppercase">
            History
          </h4>
          <div className="divide-border divide-y">
            {displayMeasurements.slice(0, 10).map((m) => (
              <div key={m.id} className="flex items-center justify-between px-4 py-2">
                <span className="text-foreground text-sm">{m.date}</span>
                <div className="flex gap-4">
                  {m.weight === undefined ? null : (
                    <span className="text-muted-foreground text-sm">{String(m.weight)} kg</span>
                  )}
                  {m.bodyFat === undefined ? null : (
                    <span className="text-muted-foreground text-sm">{String(m.bodyFat)}%</span>
                  )}
                  <span className="text-muted-foreground text-xs capitalize">{m.source}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
