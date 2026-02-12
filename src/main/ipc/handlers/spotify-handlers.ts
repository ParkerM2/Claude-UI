/**
 * Spotify IPC handlers
 */

import type { SpotifyService } from '../../services/spotify/spotify-service';
import type { IpcRouter } from '../router';

export function registerSpotifyHandlers(router: IpcRouter, service: SpotifyService): void {
  router.handle('spotify.getPlayback', async () => {
    return await service.getPlayback();
  });

  router.handle('spotify.play', async (params) => {
    return await service.play(params);
  });

  router.handle('spotify.pause', async () => {
    return await service.pause();
  });

  router.handle('spotify.next', async () => {
    return await service.next();
  });

  router.handle('spotify.previous', async () => {
    return await service.previous();
  });

  router.handle('spotify.search', async (params) => {
    return await service.search(params);
  });

  router.handle('spotify.setVolume', async (params) => {
    return await service.setVolume(params);
  });

  router.handle('spotify.addToQueue', async (params) => {
    return await service.addToQueue(params);
  });
}
