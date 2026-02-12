/**
 * NotesList — Filterable, searchable notes list
 */

import { Pin, Plus, Search } from 'lucide-react';

import type { Note } from '@shared/types';

import { cn } from '@renderer/shared/lib/utils';

import { useCreateNote, useNotes, useSearchNotes } from '../api/useNotes';
import { useNotesUI } from '../store';

// ── Component ────────────────────────────────────────────────

export function NotesList() {
  const { selectedNoteId, searchQuery, selectedTag, selectNote, setSearchQuery, setSelectedTag } =
    useNotesUI();

  const createNote = useCreateNote();

  const { data: allNotes } = useNotes(undefined, selectedTag ?? undefined);
  const { data: searchResults } = useSearchNotes(searchQuery);

  const notes = searchQuery.length > 0 ? searchResults : allNotes;
  const displayNotes = notes ?? [];

  // Collect all unique tags across notes
  const allTags = [...new Set((allNotes ?? []).flatMap((n) => n.tags))].sort();

  function handleCreateNote() {
    createNote.mutate(
      { title: 'Untitled Note', content: '' },
      {
        onSuccess: (newNote) => {
          selectNote(newNote.id);
        },
      },
    );
  }

  function handleTagClick(tag: string) {
    setSelectedTag(selectedTag === tag ? null : tag);
  }

  return (
    <div className="flex h-full flex-col">
      {/* Search */}
      <div className="border-border border-b px-3 py-2">
        <div className="bg-muted flex items-center gap-2 rounded-md px-2.5 py-1.5">
          <Search className="text-muted-foreground h-4 w-4 shrink-0" />
          <input
            aria-label="Search notes"
            className="text-foreground placeholder:text-muted-foreground w-full bg-transparent text-sm outline-none"
            placeholder="Search notes..."
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Tags filter */}
      {allTags.length > 0 ? (
        <div className="border-border flex flex-wrap gap-1.5 border-b px-3 py-2">
          {allTags.map((tag) => (
            <button
              key={tag}
              type="button"
              className={cn(
                'rounded-full px-2 py-0.5 text-xs transition-colors',
                selectedTag === tag
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-accent',
              )}
              onClick={() => handleTagClick(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      ) : null}

      {/* New note button */}
      <div className="border-border border-b px-3 py-2">
        <button
          className="bg-primary text-primary-foreground hover:bg-primary/90 flex w-full items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors"
          type="button"
          onClick={handleCreateNote}
        >
          <Plus className="h-4 w-4" />
          New Note
        </button>
      </div>

      {/* Notes list */}
      <div className="flex-1 overflow-y-auto">
        {displayNotes.length === 0 ? (
          <div className="text-muted-foreground flex h-32 items-center justify-center text-sm">
            {searchQuery.length > 0 ? 'No notes found' : 'No notes yet'}
          </div>
        ) : (
          <div className="divide-border divide-y">
            {displayNotes.map((note) => (
              <NoteListItem
                key={note.id}
                isSelected={selectedNoteId === note.id}
                note={note}
                onSelect={() => selectNote(note.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── NoteListItem ─────────────────────────────────────────────

interface NoteListItemProps {
  note: Note;
  isSelected: boolean;
  onSelect: () => void;
}

function NoteListItem({ note, isSelected, onSelect }: NoteListItemProps) {
  const preview = note.content.length > 80 ? `${note.content.slice(0, 80)}...` : note.content;

  return (
    <button
      type="button"
      className={cn(
        'w-full px-3 py-3 text-left transition-colors',
        'hover:bg-accent',
        isSelected ? 'bg-accent border-primary border-l-2' : 'border-l-2 border-transparent',
      )}
      onClick={onSelect}
    >
      <div className="flex items-start justify-between gap-2">
        <h3
          className={cn(
            'text-sm leading-tight font-medium',
            isSelected ? 'text-foreground' : 'text-foreground',
          )}
        >
          {note.title}
        </h3>
        {note.pinned ? <Pin className="text-primary h-3 w-3 shrink-0" /> : null}
      </div>
      {preview.length > 0 ? (
        <p className="text-muted-foreground mt-1 line-clamp-2 text-xs">{preview}</p>
      ) : null}
      <div className="mt-1.5 flex items-center gap-2">
        <span className="text-muted-foreground text-xs">
          {new Date(note.updatedAt).toLocaleDateString()}
        </span>
        {note.tags.length > 0 ? (
          <div className="flex gap-1">
            {note.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="bg-muted text-muted-foreground rounded px-1 text-xs">
                {tag}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </button>
  );
}
