/**
 * Scheduler — Interval-based job runner
 *
 * Manages periodic background jobs using setInterval.
 * All intervals are cleaned up on stop().
 */

import { randomUUID } from 'node:crypto';

// ── Types ────────────────────────────────────────────────────

export interface ScheduledJob {
  id: string;
  name: string;
  /** Interval in milliseconds */
  interval: number;
  handler: () => void;
  lastRun: string | null;
  enabled: boolean;
}

export interface Scheduler {
  /** Add a new scheduled job. Returns the job ID. */
  addJob: (job: Omit<ScheduledJob, 'id' | 'lastRun'>) => string;
  /** Remove a job by ID */
  removeJob: (jobId: string) => void;
  /** Start all enabled jobs */
  start: () => void;
  /** Stop all running jobs and clear intervals */
  stop: () => void;
  /** List all registered jobs */
  listJobs: () => ScheduledJob[];
}

// ── Factory ──────────────────────────────────────────────────

export function createScheduler(): Scheduler {
  const jobs = new Map<string, ScheduledJob>();
  const intervals = new Map<string, ReturnType<typeof setInterval>>();
  let running = false;

  function startJob(job: ScheduledJob): void {
    if (!job.enabled) return;

    // Clear any existing interval for this job
    const existing = intervals.get(job.id);
    if (existing !== undefined) {
      clearInterval(existing);
    }

    const interval = setInterval(() => {
      try {
        job.handler();
        job.lastRun = new Date().toISOString();
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        console.error(`[Scheduler] Job "${job.name}" failed: ${message}`);
      }
    }, job.interval);

    intervals.set(job.id, interval);
    console.log(`[Scheduler] Started job "${job.name}" (every ${String(job.interval / 1000)}s)`);
  }

  function stopJob(jobId: string): void {
    const interval = intervals.get(jobId);
    if (interval !== undefined) {
      clearInterval(interval);
      intervals.delete(jobId);
    }
  }

  return {
    addJob(config) {
      const id = randomUUID();
      const job: ScheduledJob = {
        id,
        name: config.name,
        interval: config.interval,
        handler: config.handler,
        lastRun: null,
        enabled: config.enabled,
      };

      jobs.set(id, job);
      console.log(`[Scheduler] Added job "${job.name}" (id: ${id})`);

      // If scheduler is already running, start this job immediately
      if (running && job.enabled) {
        startJob(job);
      }

      return id;
    },

    removeJob(jobId) {
      const job = jobs.get(jobId);
      if (job === undefined) {
        console.warn(`[Scheduler] Job not found: ${jobId}`);
        return;
      }

      stopJob(jobId);
      jobs.delete(jobId);
      console.log(`[Scheduler] Removed job "${job.name}"`);
    },

    start() {
      if (running) return;
      running = true;

      for (const job of jobs.values()) {
        startJob(job);
      }

      console.log(`[Scheduler] Started (${String(jobs.size)} jobs)`);
    },

    stop() {
      if (!running) return;
      running = false;

      for (const [jobId] of intervals) {
        stopJob(jobId);
      }

      console.log('[Scheduler] Stopped — all intervals cleared');
    },

    listJobs() {
      return [...jobs.values()];
    },
  };
}
