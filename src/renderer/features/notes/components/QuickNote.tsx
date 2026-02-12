/**
 * QuickNote — Floating quick-add note widget
 */

import { useState } from 'react';

import { Plus, Send, X } from 'lucide-react';

import { cn } from '@renderer/shared/lib/utils';

import { useCreateNote } from '../api/useNotes';

// ── Component ────────────────────────────────────────────────

export function QuickNote() {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const createNote = useCreateNote();

  function handleSubmit() {
    if (title.trim().length === 0) return;

    createNote.mutate(
      { title: title.trim(), content: content.trim() },
      {
        onSuccess: () => {
          setTitle('');
          setContent('');
          setIsOpen(false);
        },
      },
    );
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSubmit();
    }
  }

  if (!isOpen) {
    return (
      <button
        aria-label="Quick add note"
        type="button"
        className={cn(
          'bg-primary text-primary-foreground fixed right-6 bottom-6 z-50 rounded-full p-3 shadow-lg transition-transform',
          'hover:scale-105 active:scale-95',
        )}
        onClick={() => setIsOpen(true)}
      >
        <Plus className="h-5 w-5" />
      </button>
    );
  }

  return (
    <div className="bg-card border-border fixed right-6 bottom-6 z-50 w-80 rounded-lg border shadow-xl">
      {/* Header */}
      <div className="border-border flex items-center justify-between border-b px-3 py-2">
        <span className="text-foreground text-sm font-medium">Quick Note</span>
        <button
          aria-label="Close quick note"
          className="text-muted-foreground hover:bg-accent rounded-md p-1 transition-colors"
          type="button"
          onClick={() => setIsOpen(false)}
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Form */}
      <div className="space-y-2 p-3">
        <input
          aria-label="Note title"
          className="bg-muted text-foreground placeholder:text-muted-foreground w-full rounded-md px-3 py-2 text-sm outline-none"
          placeholder="Title..."
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <textarea
          aria-label="Note content"
          className="bg-muted text-foreground placeholder:text-muted-foreground h-24 w-full resize-none rounded-md px-3 py-2 text-sm outline-none"
          placeholder="Write a note... (Ctrl+Enter to save)"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          className="bg-primary text-primary-foreground hover:bg-primary/90 flex w-full items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors disabled:opacity-50"
          disabled={title.trim().length === 0}
          type="button"
          onClick={handleSubmit}
        >
          <Send className="h-4 w-4" />
          Save Note
        </button>
      </div>
    </div>
  );
}
