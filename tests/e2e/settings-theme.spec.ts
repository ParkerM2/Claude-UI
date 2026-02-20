/**
 * E2E Tests: Settings Page & Theme System
 *
 * Verifies:
 * - Settings page loads with all expected sections
 * - Theme/appearance mode selector is interactive (Light/Dark/System)
 * - Dark mode toggle changes class on <html>
 * - Background color changes after dark mode toggle
 * - Navigate to theme editor via Customize Theme button
 * - Theme editor page loads with color controls
 * - Hub settings section is visible
 * - Profile section is accessible
 * - No console errors during settings and theme editor navigation
 */

import { test, expect } from './electron.setup';
import { createConsoleCollector, assertNoConsoleErrors } from './helpers/console-collector';

import type { Page } from 'playwright';

/**
 * Navigate to the settings page from an authenticated window.
 * Clicks the Settings button in the sidebar and waits for the route.
 */
async function navigateToSettings(page: Page): Promise<void> {
  const settingsButton = page.locator('button', { hasText: 'Settings' });
  await settingsButton.click();
  await page.waitForURL(/\/settings/, { timeout: 10_000 });
  // Wait for the settings heading to confirm page loaded
  await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible({ timeout: 10_000 });
}

test.describe('Settings Page & Theme System', () => {
  test('settings page loads with all expected sections', async ({ authenticatedWindow: page }) => {
    await navigateToSettings(page);

    // Verify key section headings are visible
    await expect(page.getByText('Appearance')).toBeVisible();
    await expect(page.getByText('Color Theme')).toBeVisible();
    await expect(page.getByText('Hub Connection')).toBeVisible();
    await expect(page.getByText('Language')).toBeVisible();
    await expect(page.getByText('About')).toBeVisible();
  });

  test('appearance mode selector is present and interactive', async ({
    authenticatedWindow: page,
  }) => {
    await navigateToSettings(page);

    // Three mode buttons should be visible: Light, Dark, System
    const lightButton = page.getByRole('button', { name: 'Light' });
    const darkButton = page.getByRole('button', { name: 'Dark' });
    const systemButton = page.getByRole('button', { name: 'System' });

    await expect(lightButton).toBeVisible();
    await expect(darkButton).toBeVisible();
    await expect(systemButton).toBeVisible();

    // Dark mode is the default — its button should have the active style
    await expect(darkButton).toHaveClass(/border-primary/);

    // Click Light — it should become active
    await lightButton.click();
    await expect(lightButton).toHaveClass(/border-primary/);
  });

  test('dark mode toggle changes class on html', async ({ authenticatedWindow: page }) => {
    await navigateToSettings(page);

    const htmlElement = page.locator('html');

    // Default is dark mode — html should have "dark" class
    const hasDarkInitially = await htmlElement.evaluate((el) => el.classList.contains('dark'));
    expect(hasDarkInitially).toBe(true);

    // Click Light to switch mode
    const lightButton = page.getByRole('button', { name: 'Light' });
    await lightButton.click();

    // Now html should have "light" class and no "dark" class
    const hasDarkAfterLight = await htmlElement.evaluate((el) => el.classList.contains('dark'));
    const hasLightAfterLight = await htmlElement.evaluate((el) => el.classList.contains('light'));
    expect(hasDarkAfterLight).toBe(false);
    expect(hasLightAfterLight).toBe(true);

    // Switch back to dark
    const darkButton = page.getByRole('button', { name: 'Dark' });
    await darkButton.click();

    const hasDarkRestored = await htmlElement.evaluate((el) => el.classList.contains('dark'));
    expect(hasDarkRestored).toBe(true);
  });

  test('background color changes after dark mode toggle', async ({
    authenticatedWindow: page,
  }) => {
    await navigateToSettings(page);

    // Capture body/root background in dark mode
    const bgDark = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);

    // Switch to light mode
    const lightButton = page.getByRole('button', { name: 'Light' });
    await lightButton.click();

    // Wait for class change to take effect
    await expect(page.locator('html')).toHaveClass(/light/);

    // Capture body background in light mode
    const bgLight = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);

    // Dark and light backgrounds should differ
    expect(bgLight).not.toBe(bgDark);

    // Restore dark mode
    const darkButton = page.getByRole('button', { name: 'Dark' });
    await darkButton.click();
  });

  test('navigate to theme editor via Customize Theme button', async ({
    authenticatedWindow: page,
  }) => {
    await navigateToSettings(page);

    // The Color Theme section should show a "Customize Theme" button
    const customizeButton = page.getByRole('button', { name: 'Customize Theme' });
    await customizeButton.scrollIntoViewIfNeeded();
    await expect(customizeButton).toBeVisible();

    // Click the button to navigate to theme editor
    await customizeButton.click();

    // Verify URL changed to the theme editor route
    await page.waitForURL(/\/settings\/themes/, { timeout: 10_000 });
  });

  test('theme editor page loads with color controls', async ({ authenticatedWindow: page }) => {
    // Navigate directly to theme editor
    await navigateToSettings(page);

    const customizeButton = page.getByRole('button', { name: 'Customize Theme' });
    await customizeButton.scrollIntoViewIfNeeded();
    await customizeButton.click();
    await page.waitForURL(/\/settings\/themes/, { timeout: 10_000 });

    // Theme editor should have color section headings (Base, Brand, Semantic, etc.)
    // Wait for the page to fully load
    const bodyText = await page.locator('body').innerText();
    expect(bodyText.length).toBeGreaterThan(0);

    // Verify at least one color control section is visible
    // The editor organizes controls in sections like "Base", "Card & Surface", "Brand"
    const hasColorSection =
      (await page.getByText('Base').isVisible().catch(() => false)) ||
      (await page.getByText('Brand').isVisible().catch(() => false)) ||
      (await page.getByText('Semantic').isVisible().catch(() => false));
    expect(hasColorSection).toBe(true);
  });

  test('hub settings section is visible', async ({ authenticatedWindow: page }) => {
    await navigateToSettings(page);

    // Scroll to Hub Connection section
    const hubHeading = page.getByText('Hub Connection', { exact: true }).first();
    await hubHeading.scrollIntoViewIfNeeded();
    await expect(hubHeading).toBeVisible();

    // The Hub Connection sub-component should show its heading
    const hubSubHeading = page.getByText('Hub Connection').last();
    await expect(hubSubHeading).toBeVisible();

    // Should show status or connection form
    const statusOrForm =
      (await page.getByText('Connected').isVisible().catch(() => false)) ||
      (await page.getByText('Disconnected').isVisible().catch(() => false)) ||
      (await page.getByText('Hub URL').isVisible().catch(() => false));
    expect(statusOrForm).toBe(true);
  });

  test('profile section is accessible', async ({ authenticatedWindow: page }) => {
    await navigateToSettings(page);

    // Profiles section heading
    const profilesHeading = page.getByText('Profiles', { exact: true });
    await profilesHeading.scrollIntoViewIfNeeded();
    await expect(profilesHeading).toBeVisible();

    // "Add Profile" button should be visible
    const addProfileButton = page.getByRole('button', { name: 'Add Profile' });
    await expect(addProfileButton).toBeVisible();
  });

  test('no console errors during settings and theme editor navigation', async ({
    authenticatedWindow: page,
  }) => {
    const collector = createConsoleCollector(page);

    // Navigate to settings
    await navigateToSettings(page);

    // Toggle dark/light mode
    const lightButton = page.getByRole('button', { name: 'Light' });
    await lightButton.click();
    await expect(page.locator('html')).toHaveClass(/light/);

    const darkButton = page.getByRole('button', { name: 'Dark' });
    await darkButton.click();
    await expect(page.locator('html')).toHaveClass(/dark/);

    // Navigate to theme editor
    const customizeButton = page.getByRole('button', { name: 'Customize Theme' });
    await customizeButton.scrollIntoViewIfNeeded();
    await customizeButton.click();
    await page.waitForURL(/\/settings\/themes/, { timeout: 10_000 });

    // Navigate back (browser back or sidebar)
    await page.goBack();
    await page.waitForURL(/\/settings/, { timeout: 10_000 });

    // Assert no unexpected console errors occurred
    assertNoConsoleErrors(collector);
  });
});
