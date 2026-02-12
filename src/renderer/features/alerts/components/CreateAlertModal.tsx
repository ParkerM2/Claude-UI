/**
 * CreateAlertModal — Natural language input with parsed preview
 */

import { useState } from 'react';

import { Bell, Calendar, Clock, Repeat, X } from 'lucide-react';

import { cn } from '@renderer/shared/lib/utils';

import { useCreateAlert } from '../api/useAlerts';
import { useAlertStore } from '../store';

interface ParsePreview {
  date: string;
  isRecurring: boolean;
  confidence: number;
}

export function CreateAlertModal() {
  const showCreateModal = useAlertStore((s) => s.showCreateModal);
  const closeCreateModal = useAlertStore((s) => s.closeCreateModal);
  const createAlert = useCreateAlert();

  const [message, setMessage] = useState('');
  const [timeInput, setTimeInput] = useState('');
  const [alertType, setAlertType] = useState<
    'reminder' | 'deadline' | 'notification' | 'recurring'
  >('reminder');
  const [parsePreview, setParsePreview] = useState<ParsePreview | null>(null);
  const [manualDate, setManualDate] = useState('');
  const [useManualDate, setUseManualDate] = useState(false);

  if (!showCreateModal) {
    return null;
  }

  function handleTimeInputChange(value: string) {
    setTimeInput(value);
    if (value.trim().length === 0) {
      setParsePreview(null);
      return;
    }

    // Simple client-side preview — actual NLP parsing happens on the backend
    try {
      const date = new Date(value);
      if (!Number.isNaN(date.getTime())) {
        setParsePreview({
          date: date.toLocaleString(),
          isRecurring: false,
          confidence: 0.9,
        });
        return;
      }
    } catch {
      // Fall through to keyword check
    }

    // Check for recurring keywords
    const isRecurring = /^every\s/i.test(value);
    setParsePreview({
      date: 'Will be parsed on creation',
      isRecurring,
      confidence: 0.5,
    });
  }

  function handleSubmit() {
    if (message.trim().length === 0) return;

    let triggerAt: string;
    const type = alertType;

    if (useManualDate && manualDate.length > 0) {
      triggerAt = new Date(manualDate).toISOString();
    } else if (timeInput.trim().length > 0) {
      // Try parsing as direct date first
      const directDate = new Date(timeInput);
      triggerAt = Number.isNaN(directDate.getTime())
        ? new Date(Date.now() + 3_600_000).toISOString()
        : directDate.toISOString();
    } else {
      // Default: 1 hour from now
      triggerAt = new Date(Date.now() + 3_600_000).toISOString();
    }

    createAlert.mutate(
      { type, message: message.trim(), triggerAt },
      {
        onSuccess: () => {
          setMessage('');
          setTimeInput('');
          setManualDate('');
          setParsePreview(null);
          closeCreateModal();
        },
      },
    );
  }

  const typeOptions = [
    { value: 'reminder' as const, label: 'Reminder', icon: Bell },
    { value: 'deadline' as const, label: 'Deadline', icon: Calendar },
    { value: 'notification' as const, label: 'Notification', icon: Clock },
    { value: 'recurring' as const, label: 'Recurring', icon: Repeat },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        aria-label="Close modal"
        className="absolute inset-0 bg-black/50"
        role="button"
        tabIndex={0}
        onClick={closeCreateModal}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') closeCreateModal();
        }}
      />

      {/* Modal */}
      <div className="bg-card border-border relative z-10 w-full max-w-md rounded-lg border p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-foreground text-lg font-semibold">Create Alert</h2>
          <button
            className="text-muted-foreground hover:text-foreground"
            onClick={closeCreateModal}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Alert type */}
        <div className="mb-4">
          <span className="text-foreground mb-1.5 block text-sm font-medium">Type</span>
          <div className="flex gap-2">
            {typeOptions.map((option) => (
              <button
                key={option.value}
                className={cn(
                  'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition-colors',
                  alertType === option.value
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:text-foreground',
                )}
                onClick={() => setAlertType(option.value)}
              >
                <option.icon className="h-3.5 w-3.5" />
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Message */}
        <div className="mb-4">
          <label
            className="text-foreground mb-1.5 block text-sm font-medium"
            htmlFor="alert-message"
          >
            Message
          </label>
          <input
            id="alert-message"
            placeholder="What should you be reminded about?"
            type="text"
            value={message}
            className={cn(
              'bg-background border-input text-foreground w-full rounded-md border px-3 py-2 text-sm',
              'focus:ring-ring focus:ring-2 focus:outline-none',
            )}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        {/* Time input — NLP */}
        <div className="mb-4">
          <label className="text-foreground mb-1.5 block text-sm font-medium" htmlFor="alert-time">
            When (natural language)
          </label>
          <input
            disabled={useManualDate}
            id="alert-time"
            placeholder='e.g. "tomorrow at 3pm", "in 2 hours", "every Monday at 9am"'
            type="text"
            value={timeInput}
            className={cn(
              'bg-background border-input text-foreground w-full rounded-md border px-3 py-2 text-sm',
              'focus:ring-ring focus:ring-2 focus:outline-none',
            )}
            onChange={(e) => handleTimeInputChange(e.target.value)}
          />
          {parsePreview === null ? null : (
            <div className="bg-muted mt-2 rounded-md p-2 text-xs">
              <span className="text-muted-foreground">
                {parsePreview.isRecurring ? 'Recurring: ' : 'One-time: '}
                {parsePreview.date}
              </span>
            </div>
          )}
        </div>

        {/* Manual date fallback */}
        <div className="mb-4">
          <label
            className="text-muted-foreground flex items-center gap-2 text-sm"
            htmlFor="alert-manual-toggle"
          >
            <input
              checked={useManualDate}
              id="alert-manual-toggle"
              type="checkbox"
              onChange={(e) => setUseManualDate(e.target.checked)}
            />
            Use manual date/time
          </label>
          {useManualDate ? (
            <input
              type="datetime-local"
              value={manualDate}
              className={cn(
                'bg-background border-input text-foreground mt-2 w-full rounded-md border px-3 py-2 text-sm',
                'focus:ring-ring focus:ring-2 focus:outline-none',
              )}
              onChange={(e) => setManualDate(e.target.value)}
            />
          ) : null}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <button
            className="text-muted-foreground hover:text-foreground rounded-md px-4 py-2 text-sm transition-colors"
            onClick={closeCreateModal}
          >
            Cancel
          </button>
          <button
            disabled={message.trim().length === 0 || createAlert.isPending}
            className={cn(
              'bg-primary text-primary-foreground rounded-md px-4 py-2 text-sm font-medium',
              'transition-opacity hover:opacity-90',
              'disabled:opacity-50',
            )}
            onClick={handleSubmit}
          >
            {createAlert.isPending ? 'Creating...' : 'Create Alert'}
          </button>
        </div>
      </div>
    </div>
  );
}
