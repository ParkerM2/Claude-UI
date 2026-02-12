/**
 * CommandInput — Always-visible input at bottom for sending commands
 */

import { useEffect, useRef } from 'react';

import { ArrowUp } from 'lucide-react';

import { cn } from '@renderer/shared/lib/utils';

import { useAssistantStore } from '../store';

interface CommandInputProps {
  onSubmit: (input: string) => void;
  disabled?: boolean;
}

export function CommandInput({ disabled, onSubmit }: CommandInputProps) {
  const { commandDraft, setCommandDraft } = useAssistantStore();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  function handleSubmit() {
    const trimmed = commandDraft.trim();
    if (trimmed.length === 0) return;
    onSubmit(trimmed);
    setCommandDraft('');
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  return (
    <div className="border-border bg-card border-t p-4">
      <div className="mx-auto flex max-w-3xl items-end gap-2">
        <textarea
          ref={textareaRef}
          disabled={disabled}
          placeholder="Ask the assistant anything..."
          rows={1}
          value={commandDraft}
          className={cn(
            'border-border bg-background text-foreground flex-1 resize-none rounded-lg border px-3 py-2 text-sm',
            'placeholder:text-muted-foreground',
            'focus:ring-ring focus:ring-1 focus:outline-none',
            'disabled:opacity-50',
          )}
          onChange={(e) => setCommandDraft(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          aria-label="Send command"
          disabled={disabled === true || commandDraft.trim().length === 0}
          className={cn(
            'bg-primary text-primary-foreground rounded-lg p-2',
            'hover:bg-primary/90 transition-colors',
            'disabled:pointer-events-none disabled:opacity-50',
          )}
          onClick={handleSubmit}
        >
          <ArrowUp className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
