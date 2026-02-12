/**
 * Milestones IPC handlers
 */

import type { MilestonesService } from '../../services/milestones/milestones-service';
import type { IpcRouter } from '../router';

export function registerMilestonesHandlers(router: IpcRouter, service: MilestonesService): void {
  router.handle('milestones.list', (filters) => Promise.resolve(service.listMilestones(filters)));

  router.handle('milestones.create', (data) => Promise.resolve(service.createMilestone(data)));

  router.handle('milestones.update', ({ id, ...updates }) =>
    Promise.resolve(service.updateMilestone(id, updates)),
  );

  router.handle('milestones.delete', ({ id }) => Promise.resolve(service.deleteMilestone(id)));

  router.handle('milestones.addTask', ({ milestoneId, title }) =>
    Promise.resolve(service.addTask(milestoneId, title)),
  );

  router.handle('milestones.toggleTask', ({ milestoneId, taskId }) =>
    Promise.resolve(service.toggleTask(milestoneId, taskId)),
  );
}
