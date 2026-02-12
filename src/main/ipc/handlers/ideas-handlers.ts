/**
 * Ideas IPC handlers
 */

import type { IdeasService } from '../../services/ideas/ideas-service';
import type { IpcRouter } from '../router';

export function registerIdeasHandlers(router: IpcRouter, service: IdeasService): void {
  router.handle('ideas.list', (filters) => Promise.resolve(service.listIdeas(filters)));

  router.handle('ideas.create', (data) => Promise.resolve(service.createIdea(data)));

  router.handle('ideas.update', ({ id, ...updates }) =>
    Promise.resolve(service.updateIdea(id, updates)),
  );

  router.handle('ideas.delete', ({ id }) => Promise.resolve(service.deleteIdea(id)));

  router.handle('ideas.vote', ({ id, delta }) => Promise.resolve(service.voteIdea(id, delta)));
}
