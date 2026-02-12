/**
 * Fitness IPC handlers
 */

import type { FitnessService } from '../../services/fitness/fitness-service';
import type { IpcRouter } from '../router';

export function registerFitnessHandlers(router: IpcRouter, service: FitnessService): void {
  router.handle('fitness.logWorkout', (data) => Promise.resolve(service.logWorkout(data)));

  router.handle('fitness.listWorkouts', (filters) =>
    Promise.resolve(service.listWorkouts(filters)),
  );

  router.handle('fitness.deleteWorkout', ({ id }) => Promise.resolve(service.deleteWorkout(id)));

  router.handle('fitness.logMeasurement', (data) => Promise.resolve(service.logMeasurement(data)));

  router.handle('fitness.getMeasurements', ({ limit }) =>
    Promise.resolve(service.getMeasurements(limit)),
  );

  router.handle('fitness.getStats', () => Promise.resolve(service.getStats()));

  router.handle('fitness.setGoal', (data) => Promise.resolve(service.setGoal(data)));

  router.handle('fitness.listGoals', () => Promise.resolve(service.listGoals()));

  router.handle('fitness.updateGoalProgress', ({ goalId, current }) =>
    Promise.resolve(service.updateGoalProgress(goalId, current)),
  );

  router.handle('fitness.deleteGoal', ({ id }) => Promise.resolve(service.deleteGoal(id)));
}
