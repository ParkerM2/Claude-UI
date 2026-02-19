/**
 * Email IPC handlers
 */

import { createThrottle } from '../throttle';

import type { EmailService } from '../../services/email/email-service';
import type { IpcRouter } from '../router';

export function registerEmailHandlers(router: IpcRouter, service: EmailService): void {
  const allowSend = createThrottle(2000);

  router.handle('email.send', (email) => {
    if (!allowSend()) {
      throw new Error('Too many requests. Please wait.');
    }
    return service.sendEmail(email);
  });

  router.handle('email.getConfig', () => Promise.resolve(service.getConfig()));

  router.handle('email.updateConfig', (config) => {
    service.updateConfig(config);
    return Promise.resolve({ success: true });
  });

  router.handle('email.testConnection', () => service.testConnection());

  router.handle('email.getQueue', () => Promise.resolve(service.getQueuedEmails()));

  router.handle('email.retryQueued', ({ emailId }) => service.retryQueuedEmail(emailId));

  router.handle('email.removeFromQueue', ({ emailId }) => {
    service.removeFromQueue(emailId);
    return Promise.resolve({ success: true });
  });
}
