/**
 * Calendar IPC handlers
 */

import type { CalendarService } from '../../services/calendar/calendar-service';
import type { IpcRouter } from '../router';

export function registerCalendarHandlers(router: IpcRouter, service: CalendarService): void {
  router.handle('calendar.listEvents', async (params) => {
    return await service.listEvents(params);
  });

  router.handle('calendar.createEvent', async (params) => {
    return await service.createEvent(params);
  });

  router.handle('calendar.deleteEvent', async (params) => {
    return await service.deleteEvent(params);
  });
}
