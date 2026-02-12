/**
 * Insights IPC handlers
 */

import type { InsightsService } from '../../services/insights/insights-service';
import type { IpcRouter } from '../router';

export function registerInsightsHandlers(router: IpcRouter, service: InsightsService): void {
  router.handle('insights.getMetrics', ({ projectId }) =>
    Promise.resolve(service.getMetrics(projectId)),
  );

  router.handle('insights.getTimeSeries', ({ projectId, days }) =>
    Promise.resolve(service.getTimeSeries(projectId, days)),
  );

  router.handle('insights.getTaskDistribution', ({ projectId }) =>
    Promise.resolve(service.getTaskDistribution(projectId)),
  );

  router.handle('insights.getProjectBreakdown', () =>
    Promise.resolve(service.getProjectBreakdown()),
  );
}
