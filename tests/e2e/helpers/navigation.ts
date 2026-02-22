/**
 * E2E navigation helpers — click-only, zero programmatic navigation.
 *
 * Every navigation function uses real Playwright clicks on DOM elements.
 * No `page.evaluate()`, `pushState`, or `location.hash` anywhere.
 */

import { expect } from '@playwright/test';

import type { Page } from 'playwright';

// ─── Constants ────────────────────────────────────────────────

/**
 * Top-level sidebar navigation labels (matches Sidebar.tsx personalItems).
 * Briefing, Notes, Planner, Alerts, Comms were moved to Productivity tabs
 * in the ui-layout-refactor and are no longer sidebar items.
 */
export const TOP_LEVEL_NAV_ITEMS = ['Dashboard', 'My Work', 'Fitness', 'Productivity'] as const;

/** Expected URL path segments for each top-level sidebar label. */
export const ROUTE_URL_MAP: Record<string, string> = {
  Dashboard: '/dashboard',
  'My Work': '/my-work',
  Fitness: '/fitness',
  Productivity: '/productivity',
};

/** Project-scoped sidebar navigation labels (matches Sidebar.tsx projectItems). */
export const PROJECT_NAV_ITEMS = [
  'Tasks',
  'Terminals',
  'Agents',
  'Pipeline',
  'Roadmap',
  'Ideation',
  'GitHub',
  'Changelog',
  'Insights',
] as const;

// ─── Top-Level Navigation ─────────────────────────────────────

/**
 * Click a top-level sidebar nav item by its visible label text.
 *
 * Uses role-based selectors that work with custom sidebar layouts
 * (which don't use <aside> elements).
 */
export async function navigateToSidebarItem(page: Page, label: string): Promise<void> {
  // Use getByRole for better compatibility with custom layouts
  const navButton = page.getByRole('button', { name: label, exact: true });
  await navButton.click();
  await page.waitForLoadState('networkidle');
}

/**
 * Click the Settings button in the sidebar footer.
 */
export async function navigateToSettings(page: Page): Promise<void> {
  const settingsButton = page.getByRole('button', { name: 'Settings', exact: true });
  await settingsButton.click();
  await expect(page).toHaveURL(/\/settings/, { timeout: 10_000 });
}

/**
 * Click a project-scoped sidebar nav item by its visible label text.
 *
 * These items require an active project. If no project is active, they are disabled.
 */
export async function navigateToProjectView(page: Page, label: string): Promise<void> {
  const navButton = page.getByRole('button', { name: label, exact: true });
  // Ensure button is not disabled before clicking
  await expect(navButton).toBeEnabled({ timeout: 5_000 });
  await navButton.click();
  await page.waitForLoadState('networkidle');
}

// ─── Sidebar Mechanics ────────────────────────────────────────

/**
 * Click the sidebar collapse toggle button.
 */
export async function toggleSidebarCollapse(page: Page): Promise<void> {
  // Use aria-label which works across all layout variants
  const toggleButton = page.getByRole('button', { name: /toggle sidebar/i });
  await toggleButton.click();
}

/**
 * Check whether the sidebar is currently collapsed.
 * Returns true if the expand button is visible (meaning sidebar is collapsed).
 */
export async function isSidebarCollapsed(page: Page): Promise<boolean> {
  // When collapsed, sidebar shows icons only - check if Dashboard text is hidden
  const dashboardText = page.locator('button:has-text("Dashboard") >> text=Dashboard');
  const textVisible = await dashboardText.isVisible().catch(() => false);
  return !textVisible;
}

// ─── Project Navigation ───────────────────────────────────────

/**
 * Click the "+" button in the TopBar to navigate to the Projects list.
 */
export async function navigateToProjectsList(page: Page): Promise<void> {
  const addButton = page.locator('button[title="Open project"]');
  await addButton.click();
  await expect(page).toHaveURL(/\/projects/, { timeout: 10_000 });
}

/**
 * Open the first available project by clicking its row in the projects list.
 * Returns true if a project was opened, false if no projects exist.
 *
 * Assumes you are already on the /projects page.
 */
export async function openFirstProject(page: Page): Promise<boolean> {
  // Wait for loading to complete
  await page.waitForLoadState('networkidle');

  // Check for empty state
  const emptyState = page.locator('[data-slot="empty-state"]');
  const hasEmpty = await emptyState.isVisible().catch(() => false);

  if (hasEmpty) {
    return false;
  }

  // Look for project rows — buttons that contain a folder icon
  const projectRows = page.locator('button:has(.lucide-folder-open)');
  const count = await projectRows.count();

  if (count === 0) {
    return false;
  }

  // Click the first project
  await projectRows.first().click();
  await expect(page).toHaveURL(/\/projects\/[^/]+\/tasks/, { timeout: 15_000 });
  return true;
}

// ─── Page Assertions ──────────────────────────────────────────

/**
 * Assert that the page loaded successfully.
 *
 * Checks that:
 * 1. No error boundary fallback is showing
 * 2. The page has visible content (not blank)
 */
export async function assertPageLoaded(page: Page): Promise<void> {
  const errorBoundary = page.getByText('Something went wrong');
  const hasError = await errorBoundary.isVisible().catch(() => false);

  if (hasError) {
    throw new Error('Page shows error boundary fallback: "Something went wrong"');
  }

  const bodyText = await page.locator('body').innerText();

  if (bodyText.trim().length === 0) {
    throw new Error('Page appears blank — body has no text content');
  }
}

/**
 * Wait for the page URL to match a given pattern.
 */
export async function waitForRoute(page: Page, urlPattern: string | RegExp): Promise<void> {
  if (typeof urlPattern === 'string') {
    await page.waitForURL(`**${urlPattern}**`, { timeout: 10_000 });
  } else {
    await page.waitForURL(urlPattern, { timeout: 10_000 });
  }
}
