/**
 * Electron test fixtures for Playwright E2E testing.
 *
 * IMPORTANT: Uses worker-scoped fixtures to reuse a SINGLE Electron instance
 * across all tests, avoiding constant app launching/closing which is disruptive
 * and slow. Tests navigate within the same app instance.
 *
 * Provides:
 * - electronApp: Launches Electron once per worker (reused across all tests)
 * - mainWindow: The main window (reused, navigates to login for unauthenticated tests)
 * - authenticatedWindow: Same window but logged in (stays logged in across tests)
 *
 * Usage:
 * ```typescript
 * import { test, expect } from './electron.setup';
 *
 * test('my test', async ({ mainWindow }) => {
 *   await expect(mainWindow.locator('h1')).toBeVisible();
 * });
 * ```
 *
 * @see https://playwright.dev/docs/api/class-electron
 */
import { existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { config } from 'dotenv';
import { test as base, expect } from '@playwright/test';

// Load .env.test from project root for test credentials (TEST_EMAIL, TEST_PASSWORD, etc.)
const currentFilePath_ = fileURLToPath(import.meta.url);
const projectRoot = resolve(dirname(currentFilePath_), '../..');
const envTestPath = join(projectRoot, '.env.test');

if (existsSync(envTestPath)) {
  config({ path: envTestPath });
}
import { _electron as electron } from 'playwright';

import type { ElectronApplication, Page } from 'playwright';

import { ensureLoggedIn } from './helpers/auth';

// Worker-scoped fixtures (shared across all tests in a worker)
interface WorkerFixtures {
  electronApp: ElectronApplication;
  sharedWindow: Page;
}

// Test-scoped fixtures
interface TestFixtures {
  mainWindow: Page;
  authenticatedWindow: Page;
}

// ESM-compatible dirname equivalent
const currentFilePath = fileURLToPath(import.meta.url);
const currentDir = dirname(currentFilePath);

/**
 * Extended test with Electron fixtures.
 *
 * electronApp and sharedWindow are worker-scoped (launched ONCE, reused).
 * mainWindow and authenticatedWindow are test-scoped wrappers that ensure
 * proper state for each test type.
 */
export const test = base.extend<TestFixtures, WorkerFixtures>({
  // Worker-scoped: Launch Electron ONCE per worker, reuse for all tests
  electronApp: [
    async ({}, use) => {
      const appPath = join(currentDir, '../../out/main/index.cjs');
      const testUserDataDir = join(projectRoot, '.e2e-user-data');

      const app = await electron.launch({
        args: [appPath, `--user-data-dir=${testUserDataDir}`],
        env: {
          ...process.env,
          NODE_ENV: 'test',
          ELECTRON_IS_TEST: '1',
        },
      });

      await use(app);
      await app.close();
    },
    { scope: 'worker' },
  ],

  // Worker-scoped: Get the window once, reuse across tests
  sharedWindow: [
    async ({ electronApp }, use) => {
      const window = await electronApp.firstWindow();
      await window.waitForLoadState('domcontentloaded');
      await use(window);
    },
    { scope: 'worker' },
  ],

  // Test-scoped: For unauthenticated tests, navigate to login page
  mainWindow: async ({ sharedWindow }, use) => {
    // Navigate to login to ensure clean unauthenticated state
    // Uses hash router so we navigate to /#/login
    await sharedWindow.evaluate(() => {
      window.location.hash = '#/login';
    });
    await sharedWindow.waitForLoadState('domcontentloaded');
    await use(sharedWindow);
  },

  // Test-scoped: Ensure logged in state
  authenticatedWindow: async ({ sharedWindow }, use) => {
    await ensureLoggedIn(sharedWindow);
    await use(sharedWindow);
  },
});

export { expect };
