/**
 * Planner Service — Disk-persisted daily plans
 *
 * Each day is stored as a separate JSON file in dataDir/planner/<date>.json.
 * All methods are synchronous (following the service pattern).
 */

import { randomUUID } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { app } from 'electron';

import type { DailyPlan, ScheduledTask, TimeBlock } from '@shared/types';

import type { IpcRouter } from '../../ipc/router';

export interface PlannerService {
  getDay: (date: string) => DailyPlan;
  updateDay: (
    date: string,
    updates: {
      goals?: string[];
      scheduledTasks?: ScheduledTask[];
      reflection?: string;
    },
  ) => DailyPlan;
  addTimeBlock: (date: string, block: Omit<TimeBlock, 'id'>) => TimeBlock;
  updateTimeBlock: (
    date: string,
    blockId: string,
    updates: Partial<Omit<TimeBlock, 'id'>>,
  ) => TimeBlock;
  removeTimeBlock: (date: string, blockId: string) => { success: boolean };
}

function getPlannerDir(): string {
  return join(app.getPath('userData'), 'planner');
}

function getPlanFilePath(date: string): string {
  return join(getPlannerDir(), `${date}.json`);
}

function ensurePlannerDir(): void {
  const dir = getPlannerDir();
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

function makeEmptyPlan(date: string): DailyPlan {
  return {
    date,
    goals: [],
    scheduledTasks: [],
    timeBlocks: [],
  };
}

function loadPlan(date: string): DailyPlan {
  const filePath = getPlanFilePath(date);
  if (existsSync(filePath)) {
    try {
      const raw = readFileSync(filePath, 'utf-8');
      return JSON.parse(raw) as DailyPlan;
    } catch {
      return makeEmptyPlan(date);
    }
  }
  return makeEmptyPlan(date);
}

function savePlan(plan: DailyPlan): void {
  ensurePlannerDir();
  const filePath = getPlanFilePath(plan.date);
  writeFileSync(filePath, JSON.stringify(plan, null, 2), 'utf-8');
}

export function createPlannerService(router: IpcRouter): PlannerService {
  function emitDayChanged(date: string): void {
    router.emit('event:planner.dayChanged', { date });
  }

  return {
    getDay(date) {
      return loadPlan(date);
    },

    updateDay(date, updates) {
      const plan = loadPlan(date);

      if (updates.goals !== undefined) {
        plan.goals = updates.goals;
      }
      if (updates.scheduledTasks !== undefined) {
        plan.scheduledTasks = updates.scheduledTasks;
      }
      if (updates.reflection !== undefined) {
        plan.reflection = updates.reflection;
      }

      savePlan(plan);
      emitDayChanged(date);
      return plan;
    },

    addTimeBlock(date, block) {
      const plan = loadPlan(date);
      const newBlock: TimeBlock = {
        ...block,
        id: randomUUID(),
      };
      plan.timeBlocks.push(newBlock);
      savePlan(plan);
      emitDayChanged(date);
      return newBlock;
    },

    updateTimeBlock(date, blockId, updates) {
      const plan = loadPlan(date);
      const index = plan.timeBlocks.findIndex((b) => b.id === blockId);
      if (index === -1) {
        throw new Error(`Time block not found: ${blockId}`);
      }
      const existing = plan.timeBlocks[index];
      const updated: TimeBlock = { ...existing, ...updates };
      plan.timeBlocks[index] = updated;
      savePlan(plan);
      emitDayChanged(date);
      return updated;
    },

    removeTimeBlock(date, blockId) {
      const plan = loadPlan(date);
      const index = plan.timeBlocks.findIndex((b) => b.id === blockId);
      if (index === -1) {
        throw new Error(`Time block not found: ${blockId}`);
      }
      plan.timeBlocks.splice(index, 1);
      savePlan(plan);
      emitDayChanged(date);
      return { success: true };
    },
  };
}
