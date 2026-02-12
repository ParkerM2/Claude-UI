/**
 * Background Manager — Orchestrates background jobs
 *
 * Registers default background jobs and provides a unified
 * interface for managing the background scheduler.
 */

import type { Scheduler } from './scheduler';

// ── Types ────────────────────────────────────────────────────

export interface BackgroundManager {
  /** Start the background scheduler with default jobs */
  start: () => void;
  /** Stop the scheduler and clear all intervals */
  stop: () => void;
  /** Add a custom background job */
  addJob: (name: string, intervalMs: number, handler: () => void) => string;
  /** Remove a background job by ID */
  removeJob: (jobId: string) => void;
}

interface BackgroundManagerDeps {
  scheduler: Scheduler;
}

// ── Constants ────────────────────────────────────────────────

const ALERT_CHECK_INTERVAL = 60_000; // 60 seconds
const HEALTH_CHECK_INTERVAL = 300_000; // 5 minutes

// ── Default Job Handlers ─────────────────────────────────────

function handleAlertCheck(): void {
  // Placeholder: Check for pending alerts and notifications
  console.log('[BackgroundManager] Alert check completed');
}

function handleHealthCheck(): void {
  // Placeholder: Check system health (memory, disk, connectivity)
  const memoryUsage = process.memoryUsage();
  const heapMb = Math.round(memoryUsage.heapUsed / 1024 / 1024);
  console.log(`[BackgroundManager] Health check — heap: ${String(heapMb)}MB`);
}

// ── Factory ──────────────────────────────────────────────────

export function createBackgroundManager(deps: BackgroundManagerDeps): BackgroundManager {
  const { scheduler } = deps;

  return {
    start() {
      // Register default background jobs
      scheduler.addJob({
        name: 'Alert Check',
        interval: ALERT_CHECK_INTERVAL,
        handler: handleAlertCheck,
        enabled: true,
      });

      scheduler.addJob({
        name: 'Health Check',
        interval: HEALTH_CHECK_INTERVAL,
        handler: handleHealthCheck,
        enabled: true,
      });

      scheduler.start();
      console.log('[BackgroundManager] Started with default jobs');
    },

    stop() {
      scheduler.stop();
      console.log('[BackgroundManager] Stopped');
    },

    addJob(name, intervalMs, handler) {
      return scheduler.addJob({
        name,
        interval: intervalMs,
        handler,
        enabled: true,
      });
    },

    removeJob(jobId) {
      scheduler.removeJob(jobId);
    },
  };
}
