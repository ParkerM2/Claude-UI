/**
 * Alert IPC handlers
 */

import type { AlertService } from '../../services/alerts/alert-service';
import type { IpcRouter } from '../router';

export function registerAlertHandlers(router: IpcRouter, service: AlertService): void {
  router.handle('alerts.list', ({ includeExpired }) =>
    Promise.resolve(service.listAlerts(includeExpired ?? false)),
  );

  router.handle('alerts.create', (data) => Promise.resolve(service.createAlert(data)));

  router.handle('alerts.dismiss', ({ id }) => Promise.resolve(service.dismissAlert(id)));

  router.handle('alerts.delete', ({ id }) => Promise.resolve(service.deleteAlert(id)));
}
