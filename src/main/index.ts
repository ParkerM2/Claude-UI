/**
 * Main Process Entry Point
 *
 * Creates the window, initializes services, registers IPC handlers.
 * Logic lives in bootstrap modules and services — this file orchestrates startup.
 */

import { join } from 'node:path';

import { app, BrowserWindow, shell } from 'electron';

import {
  createServiceRegistry,
  setupLifecycle,
  wireEventForwarding,
  wireIpcHandlers,
} from './bootstrap';

import type { SettingsService } from './services/settings/settings-service';

let mainWindow: BrowserWindow | null = null;
let settingsServiceRef: SettingsService | null = null;

function getMainWindow(): BrowserWindow | null {
  return mainWindow;
}

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 900,
    minHeight: 600,
    show: false,
    webPreferences: {
      preload: join(__dirname, '../preload/index.mjs'),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    void shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.on('ready-to-show', () => {
    const startMin = settingsServiceRef?.getSettings().startMinimized;
    if (!startMin) {
      mainWindow?.show();
    }
  });

  mainWindow.on('close', (event) => {
    const minToTray = settingsServiceRef?.getSettings().minimizeToTray;
    if (minToTray && mainWindow && !(app as unknown as Record<string, boolean>).isQuitting) {
      event.preventDefault();
      mainWindow.hide();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  if (process.env.ELECTRON_RENDERER_URL) {
    void mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL);
  } else {
    void mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
  }
}

// ─── Initialize & Start ──────────────────────────────────────────

function initializeApp(): void {
  const registry = createServiceRegistry(getMainWindow);

  // Store ref for createWindow() settings checks
  settingsServiceRef = registry.settingsService;

  // Wire IPC handlers
  wireIpcHandlers(registry.router, registry.services);

  // Wire service events → renderer
  wireEventForwarding({
    router: registry.router,
    agentOrchestrator: registry.agentOrchestrator,
    jsonlProgressWatcher: registry.jsonlProgressWatcher,
    watchEvaluator: registry.watchEvaluator,
    webhookRelay: registry.webhookRelay,
    hubConnectionManager: registry.hubConnectionManager,
  });

  // Register app lifecycle handlers (quit, activate, cleanup)
  setupLifecycle({
    createWindow,
    terminalService: registry.terminalService,
    agentService: registry.agentService,
    agentOrchestrator: registry.agentOrchestrator,
    jsonlProgressWatcher: registry.jsonlProgressWatcher,
    alertService: registry.alertService,
    hubConnectionManager: registry.hubConnectionManager,
    notificationManager: registry.notificationManager,
    briefingService: registry.briefingService,
    watchEvaluator: registry.watchEvaluator,
    hotkeyManager: registry.hotkeyManager,
    getHeartbeatIntervalId: () => registry.heartbeatIntervalId,
  });
}

void (async () => {
  await app.whenReady();
  initializeApp();
  createWindow();
})();
