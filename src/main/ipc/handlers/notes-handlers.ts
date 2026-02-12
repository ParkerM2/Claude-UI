/**
 * Notes IPC handlers
 */

import type { NotesService } from '../../services/notes/notes-service';
import type { IpcRouter } from '../router';

export function registerNotesHandlers(router: IpcRouter, service: NotesService): void {
  router.handle('notes.list', (filters) => Promise.resolve(service.listNotes(filters)));

  router.handle('notes.create', (data) => Promise.resolve(service.createNote(data)));

  router.handle('notes.update', ({ id, ...updates }) =>
    Promise.resolve(service.updateNote(id, updates)),
  );

  router.handle('notes.delete', ({ id }) => Promise.resolve(service.deleteNote(id)));

  router.handle('notes.search', ({ query }) => Promise.resolve(service.searchNotes(query)));
}
