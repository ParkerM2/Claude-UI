/**
 * HotkeySettings — Global hotkey configuration
 *
 * Displays current hotkey bindings and allows customization
 * via text input for Electron accelerator strings.
 */

import { useState } from 'react';

import { Keyboard } from 'lucide-react';

import { cn } from '@renderer/shared/lib/utils';

import { useUpdateSettings } from '../api/useSettings';

// ── Types ────────────────────────────────────────────────────

interface HotkeyBinding {
  id: string;
  label: string;
  description: string;
  defaultAccelerator: string;
}

// ── Constants ────────────────────────────────────────────────

const DEFAULT_HOTKEYS: HotkeyBinding[] = [
  {
    id: 'quickCommand',
    label: 'Quick Command',
    description: 'Open the quick command popup',
    defaultAccelerator: 'Ctrl+Shift+Space',
  },
  {
    id: 'quickNote',
    label: 'Quick Note',
    description: 'Open the app for quick note taking',
    defaultAccelerator: 'Ctrl+Shift+N',
  },
  {
    id: 'quickTask',
    label: 'Quick Task',
    description: 'Open the app for quick task creation',
    defaultAccelerator: 'Ctrl+Shift+T',
  },
];

// ── Hotkey Row ───────────────────────────────────────────────

interface HotkeyRowProps {
  binding: HotkeyBinding;
  currentValue: string;
  onSave: (id: string, accelerator: string) => void;
}

function HotkeyRow({ binding, currentValue, onSave }: HotkeyRowProps) {
  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState(currentValue);

  function handleSave() {
    const trimmed = inputValue.trim();
    if (trimmed.length > 0) {
      onSave(binding.id, trimmed);
    }
    setEditing(false);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      handleSave();
    } else if (event.key === 'Escape') {
      setInputValue(currentValue);
      setEditing(false);
    }
  }

  function handleEditClick() {
    setInputValue(currentValue);
    setEditing(true);
  }

  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div className="flex-1">
        <p className="text-sm font-medium">{binding.label}</p>
        <p className="text-muted-foreground text-xs">{binding.description}</p>
      </div>
      {editing ? (
        <div className="flex items-center gap-2">
          <input
            aria-label={`Hotkey for ${binding.label}`}
            className="border-border bg-background focus:border-primary w-44 rounded-md border px-3 py-1.5 text-sm outline-none"
            placeholder="e.g. Ctrl+Shift+Space"
            type="text"
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            className="text-primary text-xs font-medium hover:underline"
            type="button"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      ) : (
        <button className="group flex items-center gap-2" type="button" onClick={handleEditClick}>
          <kbd
            className={cn(
              'bg-muted text-muted-foreground rounded-md px-2.5 py-1 font-mono text-xs',
              'group-hover:bg-accent group-hover:text-foreground transition-colors',
            )}
          >
            {currentValue}
          </kbd>
        </button>
      )}
    </div>
  );
}

// ── Component ────────────────────────────────────────────────

export function HotkeySettings() {
  const updateSettings = useUpdateSettings();

  const [hotkeys, setHotkeys] = useState<Record<string, string>>(() => {
    const defaults: Record<string, string> = {};
    for (const binding of DEFAULT_HOTKEYS) {
      defaults[binding.id] = binding.defaultAccelerator;
    }
    return defaults;
  });

  function handleSaveHotkey(id: string, accelerator: string) {
    setHotkeys((previous) => ({ ...previous, [id]: accelerator }));
    updateSettings.mutate({ hotkeys: { ...hotkeys, [id]: accelerator } });
  }

  return (
    <section className="mb-8">
      <h2 className="text-muted-foreground mb-3 flex items-center gap-2 text-sm font-medium tracking-wider uppercase">
        <Keyboard className="h-4 w-4" />
        Global Hotkeys
      </h2>
      <div className="border-border bg-card divide-border divide-y rounded-lg border px-4">
        {DEFAULT_HOTKEYS.map((binding) => (
          <HotkeyRow
            key={binding.id}
            binding={binding}
            currentValue={hotkeys[binding.id] ?? binding.defaultAccelerator}
            onSave={handleSaveHotkey}
          />
        ))}
      </div>
      <p className="text-muted-foreground mt-2 text-xs">
        Use Electron accelerator format: Ctrl+Shift+Key, CmdOrCtrl+Key, Alt+Key
      </p>
    </section>
  );
}
