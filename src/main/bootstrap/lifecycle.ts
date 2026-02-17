/**
 * Lifecycle — Electron app lifecycle event handlers.
 *
 * Handles:
 * - window-all-closed: quit on non-macOS
 * - before-quit: dispose all services, clear intervals
 * - activate: re-create window on macOS dock click
 */

import { app, BrowserWindow } from 'electron';

import type { createAgentService } from '../services/agent/agent-service';
import type { createAgentOrchestrator } from '../services/agent-orchestrator/agent-orchestrator';
import type { createJsonlProgressWatcher } from '../services/agent-orchestrator/jsonl-progress-watcher';
import type { createAlertService } from '../services/alerts/alert-service';
import type { createWatchEvaluator } from '../services/assistant/watch-evaluator';
import type { createBriefingService } from '../services/briefing/briefing-service';
import type { createHubConnectionManager } from '../services/hub/hub-connection';
import type { createNotificationManager } from '../services/notifications';
import type { createTerminalService } from '../services/terminal/terminal-service';
import type { HotkeyManager } from '../tray/hotkey-manager';

export interface LifecycleDeps {
  createWindow: () => void;
  terminalService: ReturnType<typeof createTerminalService>;
  agentService: ReturnType<typeof createAgentService>;
  agentOrchestrator: ReturnType<typeof createAgentOrchestrator>;
  jsonlProgressWatcher: ReturnType<typeof createJsonlProgressWatcher>;
  alertService: ReturnType<typeof createAlertService>;
  hubConnectionManager: ReturnType<typeof createHubConnectionManager>;
  notificationManager: ReturnType<typeof createNotificationManager>;
  briefingService: ReturnType<typeof createBriefingService>;
  watchEvaluator: ReturnType<typeof createWatchEvaluator>;
  hotkeyManager: HotkeyManager;
  getHeartbeatIntervalId: () => ReturnType<typeof setInterval> | null;
}

/** Registers Electron app lifecycle event handlers. */
export function setupLifecycle(deps: LifecycleDeps): void {
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) deps.createWindow();
  });

  app.on('before-quit', () => {
    (app as unknown as Record<string, boolean>).isQuitting = true;
    deps.hotkeyManager.unregisterAll();
    deps.terminalService.dispose();
    deps.agentService.dispose();
    deps.agentOrchestrator.dispose();
    deps.jsonlProgressWatcher.stop();
    deps.alertService.stopChecking();
    deps.hubConnectionManager.dispose();
    deps.notificationManager.dispose();
    deps.briefingService.stopScheduler();
    deps.watchEvaluator.stop();

    const heartbeatId = deps.getHeartbeatIntervalId();
    if (heartbeatId !== null) {
      clearInterval(heartbeatId);
    }
  });
}
