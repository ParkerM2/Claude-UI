/**
 * TimeBlockEditor — Create/edit time blocks
 */

import { useState } from 'react';

import { Plus, X } from 'lucide-react';

import type { TimeBlock } from '@shared/types';

const BLOCK_TYPES: Array<{ value: TimeBlock['type']; label: string }> = [
  { value: 'focus', label: 'Focus' },
  { value: 'meeting', label: 'Meeting' },
  { value: 'break', label: 'Break' },
  { value: 'other', label: 'Other' },
];

interface TimeBlockEditorProps {
  editingBlock?: TimeBlock;
  onSave: (block: Omit<TimeBlock, 'id'>) => void;
  onCancel: () => void;
}

export function TimeBlockEditor({ editingBlock, onSave, onCancel }: TimeBlockEditorProps) {
  const [startTime, setStartTime] = useState(editingBlock?.startTime ?? '09:00');
  const [endTime, setEndTime] = useState(editingBlock?.endTime ?? '10:00');
  const [label, setLabel] = useState(editingBlock?.label ?? '');
  const [blockType, setBlockType] = useState<TimeBlock['type']>(editingBlock?.type ?? 'focus');

  function handleSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    if (label.trim().length === 0) return;

    onSave({
      startTime,
      endTime,
      label: label.trim(),
      type: blockType,
    });
  }

  return (
    <form className="border-border bg-card space-y-3 rounded-lg border p-4" onSubmit={handleSubmit}>
      <div className="flex items-center justify-between">
        <h4 className="text-foreground text-sm font-medium">
          {editingBlock ? 'Edit Time Block' : 'New Time Block'}
        </h4>
        <button
          aria-label="Cancel"
          className="text-muted-foreground hover:text-foreground transition-colors"
          type="button"
          onClick={onCancel}
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <label className="space-y-1">
          <span className="text-muted-foreground text-xs">Start</span>
          <input
            className="border-input bg-background text-foreground focus:ring-ring w-full rounded-md border px-2.5 py-1.5 text-sm outline-none focus:ring-1"
            type="time"
            value={startTime}
            onChange={(event) => setStartTime(event.target.value)}
          />
        </label>
        <label className="space-y-1">
          <span className="text-muted-foreground text-xs">End</span>
          <input
            className="border-input bg-background text-foreground focus:ring-ring w-full rounded-md border px-2.5 py-1.5 text-sm outline-none focus:ring-1"
            type="time"
            value={endTime}
            onChange={(event) => setEndTime(event.target.value)}
          />
        </label>
      </div>

      <label className="block space-y-1">
        <span className="text-muted-foreground text-xs">Label</span>
        <input
          className="border-input bg-background text-foreground focus:ring-ring w-full rounded-md border px-2.5 py-1.5 text-sm outline-none focus:ring-1"
          placeholder="What are you working on?"
          type="text"
          value={label}
          onChange={(event) => setLabel(event.target.value)}
        />
      </label>

      <label className="block space-y-1">
        <span className="text-muted-foreground text-xs">Type</span>
        <select
          className="border-input bg-background text-foreground focus:ring-ring w-full rounded-md border px-2.5 py-1.5 text-sm outline-none focus:ring-1"
          value={blockType}
          onChange={(event) => setBlockType(event.target.value as TimeBlock['type'])}
        >
          {BLOCK_TYPES.map((bt) => (
            <option key={bt.value} value={bt.value}>
              {bt.label}
            </option>
          ))}
        </select>
      </label>

      <div className="flex justify-end gap-2">
        <button
          className="text-muted-foreground hover:text-foreground rounded-md px-3 py-1.5 text-sm transition-colors"
          type="button"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors"
          disabled={label.trim().length === 0}
          type="submit"
        >
          <Plus className="h-3.5 w-3.5" />
          {editingBlock ? 'Update' : 'Add Block'}
        </button>
      </div>
    </form>
  );
}
