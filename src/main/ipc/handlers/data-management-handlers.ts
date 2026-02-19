/**
 * Data Management IPC handlers
 *
 * Maps data management IPC channels to service operations:
 * store registry, usage inspection, retention settings,
 * cleanup, export, and import.
 */

import type { DataRetentionSettings } from '@shared/types';

import { exportData, importData } from '../../services/data-management/data-export';
import { STORE_CLEANUP_FUNCTIONS } from '../../services/data-management/store-cleaners';
import { DATA_STORE_REGISTRY } from '../../services/data-management/store-registry';

import type { CleanupService } from '../../services/data-management/cleanup-service';
import type { StorageInspector } from '../../services/data-management/storage-inspector';
import type { SettingsService } from '../../services/settings/settings-service';
import type { IpcRouter } from '../router';

const DEFAULT_RETENTION_SETTINGS: DataRetentionSettings = {
  autoCleanupEnabled: true,
  cleanupIntervalHours: 6,
  overrides: {},
};

export function registerDataManagementHandlers(
  router: IpcRouter,
  cleanupService: CleanupService,
  storageInspector: StorageInspector,
  settingsService: SettingsService,
  dataDir: string,
): void {
  router.handle('dataManagement.getRegistry', () =>
    Promise.resolve(DATA_STORE_REGISTRY),
  );

  router.handle('dataManagement.getUsage', () =>
    Promise.resolve(storageInspector.getUsage()),
  );

  router.handle('dataManagement.getRetention', () => {
    const settings = settingsService.getSettings();
    const retention = settings.dataRetention ?? DEFAULT_RETENTION_SETTINGS;
    return Promise.resolve(retention);
  });

  router.handle('dataManagement.updateRetention', (updates) => {
    const current = settingsService.getSettings().dataRetention ?? DEFAULT_RETENTION_SETTINGS;
    const merged: DataRetentionSettings = {
      ...current,
      ...updates,
    };
    settingsService.updateSettings({ dataRetention: merged });
    return Promise.resolve(merged);
  });

  router.handle('dataManagement.clearStore', async ({ storeId }) => {
    if (!Object.hasOwn(STORE_CLEANUP_FUNCTIONS, storeId)) {
      return { success: false };
    }

    // Run the cleaner with a maximally aggressive retention to clear everything
    await STORE_CLEANUP_FUNCTIONS[storeId](dataDir, { maxAgeDays: 0, maxItems: 0, enabled: true });
    return { success: true };
  });

  router.handle('dataManagement.runCleanup', () =>
    cleanupService.runCleanup(),
  );

  router.handle('dataManagement.exportData', async () => {
    const filePath = await exportData(dataDir);
    return { filePath };
  });

  router.handle('dataManagement.importData', ({ filePath }) =>
    Promise.resolve(importData(dataDir, filePath)),
  );
}
