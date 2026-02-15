/**
 * Project IPC handlers — proxies to Hub API via ProjectService
 */

import { detectRepoStructure } from '../../services/project/project-detector';

import type { ProjectService } from '../../services/project/project-service';
import type { IpcRouter } from '../router';

export function registerProjectHandlers(router: IpcRouter, service: ProjectService): void {
  router.handle('projects.list', async () => {
    return await service.listProjects();
  });

  router.handle('projects.add', async ({ path }) => {
    return await service.addProject({ path });
  });

  router.handle('projects.remove', async ({ projectId }) => {
    return await service.removeProject(projectId);
  });

  router.handle('projects.initialize', ({ projectId: _projectId }) =>
    Promise.resolve({ success: true }),
  );

  router.handle('projects.selectDirectory', async () => {
    return await service.selectDirectory();
  });

  router.handle('projects.detectRepo', ({ path }) =>
    Promise.resolve(detectRepoStructure(path)),
  );

  router.handle('projects.update', async ({ projectId, ...updates }) => {
    return await service.updateProject({ projectId, ...updates });
  });

  router.handle('projects.getSubProjects', async ({ projectId }) => {
    return await service.getSubProjects(projectId);
  });

  router.handle('projects.createSubProject', async (input) => {
    return await service.createSubProject(input);
  });

  router.handle('projects.deleteSubProject', async ({ projectId, subProjectId }) => {
    return await service.deleteSubProject(projectId, subProjectId);
  });
}
