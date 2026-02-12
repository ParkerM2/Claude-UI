/**
 * NotificationRules — Configure notification filtering rules
 */

import { useState } from 'react';

import { Plus, Trash2 } from 'lucide-react';

import { cn } from '@renderer/shared/lib/utils';

import { useCommunicationsStore } from '../store';

export function NotificationRules() {
  const { notificationRules, addNotificationRule, removeNotificationRule, toggleNotificationRule } =
    useCommunicationsStore();

  const [newPattern, setNewPattern] = useState('');
  const [newService, setNewService] = useState<'slack' | 'discord'>('slack');

  function handleAdd() {
    const trimmed = newPattern.trim();
    if (trimmed.length === 0) return;
    addNotificationRule({ service: newService, pattern: trimmed, enabled: true });
    setNewPattern('');
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      handleAdd();
    }
  }

  return (
    <div className="bg-card border-border rounded-lg border p-4">
      <h3 className="text-foreground mb-3 text-sm font-semibold">Notification Rules</h3>
      <p className="text-muted-foreground mb-4 text-xs">
        Filter notifications by keyword pattern. Matching messages will trigger desktop alerts.
      </p>

      {/* Add rule */}
      <div className="mb-4 flex gap-2">
        <select
          value={newService}
          className={cn(
            'border-border bg-background text-foreground rounded-md border px-2 py-1.5 text-sm',
            'focus:ring-ring focus:ring-1 focus:outline-none',
          )}
          onChange={(e) => setNewService(e.target.value as 'slack' | 'discord')}
        >
          <option value="slack">Slack</option>
          <option value="discord">Discord</option>
        </select>

        <input
          placeholder="Keyword or pattern..."
          type="text"
          value={newPattern}
          className={cn(
            'border-border bg-background text-foreground flex-1 rounded-md border px-3 py-1.5 text-sm',
            'placeholder:text-muted-foreground',
            'focus:ring-ring focus:ring-1 focus:outline-none',
          )}
          onChange={(e) => setNewPattern(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <button
          aria-label="Add notification rule"
          disabled={newPattern.trim().length === 0}
          className={cn(
            'bg-primary text-primary-foreground rounded-md px-3 py-1.5',
            'hover:bg-primary/90 transition-colors',
            'disabled:pointer-events-none disabled:opacity-50',
          )}
          onClick={handleAdd}
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {/* Rules list */}
      {notificationRules.length > 0 ? (
        <ul className="space-y-2">
          {notificationRules.map((rule) => (
            <li
              key={rule.id}
              className="border-border flex items-center gap-3 rounded-md border px-3 py-2"
            >
              <input
                checked={rule.enabled}
                className="accent-primary h-4 w-4"
                type="checkbox"
                onChange={() => toggleNotificationRule(rule.id)}
              />
              <span className="bg-muted text-muted-foreground rounded px-1.5 py-0.5 text-xs capitalize">
                {rule.service}
              </span>
              <span className="text-foreground min-w-0 flex-1 text-sm">{rule.pattern}</span>
              <button
                aria-label={`Remove rule: ${rule.pattern}`}
                className="text-muted-foreground hover:text-destructive shrink-0"
                onClick={() => removeNotificationRule(rule.id)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-muted-foreground text-center text-xs">No rules configured</p>
      )}
    </div>
  );
}
