/**
 * NoteEditor — Title + content textarea for editing a note
 */

import { useCallback, useEffect, useState } from 'react';

import { Pin, PinOff, Save, Trash2, X } from 'lucide-react';

import type { Note } from '@shared/types';

import { cn } from '@renderer/shared/lib/utils';

import { useDeleteNote, useUpdateNote } from '../api/useNotes';
import { useNotesUI } from '../store';

// ── Types ────────────────────────────────────────────────────

interface NoteEditorProps {
  note: Note;
}

// ── Component ────────────────────────────────────────────────

export function NoteEditor({ note }: NoteEditorProps) {
  const updateNote = useUpdateNote();
  const deleteNote = useDeleteNote();
  const { selectNote } = useNotesUI();

  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [tagsInput, setTagsInput] = useState(note.tags.join(', '));

  // Sync local state when the selected note changes
  useEffect(() => {
    setTitle(note.title);
    setContent(note.content);
    setTagsInput(note.tags.join(', '));
  }, [note.id, note.title, note.content, note.tags]);

  const handleSave = useCallback(() => {
    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    updateNote.mutate({
      id: note.id,
      title,
      content,
      tags,
    });
  }, [note.id, title, content, tagsInput, updateNote]);

  function handleDelete() {
    deleteNote.mutate(note.id);
    selectNote(null);
  }

  function handleTogglePin() {
    updateNote.mutate({ id: note.id, pinned: !note.pinned });
  }

  function handleClose() {
    selectNote(null);
  }

  const hasChanges =
    title !== note.title || content !== note.content || tagsInput !== note.tags.join(', ');

  return (
    <div className="flex h-full flex-col">
      {/* Toolbar */}
      <div className="border-border flex items-center justify-between border-b px-4 py-2">
        <div className="flex items-center gap-2">
          <button
            aria-label={note.pinned ? 'Unpin note' : 'Pin note'}
            type="button"
            className={cn(
              'hover:bg-accent rounded-md p-1.5 transition-colors',
              note.pinned ? 'text-primary' : 'text-muted-foreground',
            )}
            onClick={handleTogglePin}
          >
            {note.pinned ? <Pin className="h-4 w-4" /> : <PinOff className="h-4 w-4" />}
          </button>
          <button
            aria-label="Save note"
            disabled={!hasChanges}
            type="button"
            className={cn(
              'hover:bg-accent rounded-md p-1.5 transition-colors',
              hasChanges ? 'text-primary' : 'text-muted-foreground',
            )}
            onClick={handleSave}
          >
            <Save className="h-4 w-4" />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            aria-label="Delete note"
            className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive rounded-md p-1.5 transition-colors"
            type="button"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4" />
          </button>
          <button
            aria-label="Close editor"
            className="text-muted-foreground hover:bg-accent hover:text-foreground rounded-md p-1.5 transition-colors"
            type="button"
            onClick={handleClose}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Title */}
      <div className="border-border border-b px-4 py-3">
        <input
          aria-label="Note title"
          className="text-foreground placeholder:text-muted-foreground w-full bg-transparent text-lg font-semibold outline-none"
          placeholder="Note title..."
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      {/* Tags */}
      <div className="border-border border-b px-4 py-2">
        <input
          aria-label="Tags (comma separated)"
          className="text-muted-foreground placeholder:text-muted-foreground w-full bg-transparent text-sm outline-none"
          placeholder="Tags (comma separated)..."
          type="text"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
        />
      </div>

      {/* Content */}
      <div className="flex-1 p-4">
        <textarea
          aria-label="Note content"
          className="text-foreground placeholder:text-muted-foreground h-full w-full resize-none bg-transparent outline-none"
          placeholder="Write your note..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      {/* Footer */}
      <div className="border-border text-muted-foreground border-t px-4 py-2 text-xs">
        Updated {new Date(note.updatedAt).toLocaleString()}
      </div>
    </div>
  );
}
