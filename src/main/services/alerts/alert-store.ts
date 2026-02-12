/**
 * Alert Store — JSON file persistence for alerts
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { app } from 'electron';

import type { Alert } from '@shared/types';

interface AlertStoreData {
  alerts: Alert[];
}

function getFilePath(): string {
  return join(app.getPath('userData'), 'alerts.json');
}

export function loadAlerts(): Alert[] {
  const filePath = getFilePath();
  if (existsSync(filePath)) {
    try {
      const raw = readFileSync(filePath, 'utf-8');
      const data = JSON.parse(raw) as unknown as AlertStoreData;
      return Array.isArray(data.alerts) ? data.alerts : [];
    } catch {
      return [];
    }
  }
  return [];
}

export function saveAlerts(alerts: Alert[]): void {
  const filePath = getFilePath();
  const dir = join(filePath, '..');
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  const data: AlertStoreData = { alerts };
  writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}
