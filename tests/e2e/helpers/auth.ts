/**
 * E2E authentication helpers.
 *
 * Provides functions to log in via the UI and ensure authenticated state.
 * Reads credentials from environment variables:
 * - TEST_EMAIL, TEST_PASSWORD: Login credentials
 * - TEST_HUB_URL, TEST_HUB_API_KEY: Hub configuration
 */

import type { Page } from 'playwright';

/**
 * Configure Hub server if not already configured.
 *
 * Checks if we're on the login page with "Hub URL not configured" error,
 * and if so, navigates to Hub setup and configures the Hub.
 */
async function ensureHubConfigured(page: Page): Promise<void> {
  const hubUrl = process.env['TEST_HUB_URL'];
  const apiKey = process.env['TEST_HUB_API_KEY'];

  if (!hubUrl || !apiKey) {
    throw new Error(
      'E2E auth: TEST_HUB_URL and TEST_HUB_API_KEY environment variables are required. ' +
        'Set them in .env.test before running E2E tests.',
    );
  }

  // Check if Hub is already configured by looking for the Hub error message
  const hubError = page.locator('text=Hub URL not configured');
  const isHubError = await hubError.isVisible({ timeout: 2000 }).catch(() => false);

  if (!isHubError) {
    // Hub is already configured, nothing to do
    return;
  }

  // Navigate to Hub setup via the "Change Hub server" button
  await page.getByRole('button', { name: 'Change Hub server' }).click();

  // Wait for Hub setup page to load
  await page
    .getByRole('heading', { name: 'Welcome to ADC' })
    .waitFor({ state: 'visible', timeout: 10_000 });

  // Expand manual configuration section
  await page.getByRole('button', { name: 'I have my own Hub server' }).click();

  // Fill Hub URL and API key
  await page.getByLabel('Hub URL').fill(hubUrl);
  await page.getByLabel('API Key').fill(apiKey);

  // Click Connect button
  await page.getByRole('button', { name: 'Connect' }).click();

  // Wait for redirect back to login page (Hub setup calls onSuccess which navigates to login)
  await page
    .getByRole('heading', { name: 'Sign In' })
    .waitFor({ state: 'visible', timeout: 15_000 });

  // Give Hub connection time to establish
  await page.waitForTimeout(2000);
}

/**
 * Wait for login form to be ready.
 */
async function waitForLoginReady(page: Page): Promise<void> {
  await page.getByPlaceholder('you@example.com').waitFor({ state: 'visible', timeout: 10_000 });
}

/**
 * Handle the first-run setup wizard if it appears after login.
 * Clicks through the wizard to get to the main dashboard.
 */
async function handleSetupWizardIfPresent(page: Page): Promise<void> {
  // Check if we're on the setup wizard (shows "Welcome to ADC" heading)
  const welcomeHeading = page.getByRole('heading', { name: 'Welcome to ADC' });
  const isWizardVisible = await welcomeHeading.isVisible({ timeout: 2000 }).catch(() => false);

  if (!isWizardVisible) {
    return;
  }

  // Click "Get Started" to proceed through the wizard
  const getStartedButton = page.getByRole('button', { name: 'Get Started' });
  if (await getStartedButton.isVisible().catch(() => false)) {
    await getStartedButton.click();
  }

  // The wizard may have multiple steps — keep clicking "Next" or "Skip" until done
  const maxSteps = 5;
  for (let step = 0; step < maxSteps; step++) {
    // Wait a moment for the next step to load
    await page.waitForTimeout(500);

    // Check if we've reached the dashboard (sidebar visible)
    const sidebar = page.locator('aside').first();
    if (await sidebar.isVisible().catch(() => false)) {
      return;
    }

    // Try clicking various wizard navigation buttons
    const nextButton = page.getByRole('button', { name: /next|continue|skip|finish|done/i });
    if (
      await nextButton
        .first()
        .isVisible()
        .catch(() => false)
    ) {
      await nextButton.first().click();
    } else {
      break;
    }
  }
}

/**
 * Log in using the test account credentials from environment variables.
 *
 * Fills the login form (email + password), clicks "Sign In",
 * and waits for redirect to the dashboard route.
 * Includes retry logic for cases where Hub connection isn't ready.
 *
 * @throws If TEST_EMAIL or TEST_PASSWORD environment variables are missing.
 */
export async function loginWithTestAccount(page: Page): Promise<void> {
  const email = process.env['TEST_EMAIL'];
  const password = process.env['TEST_PASSWORD'];

  if (!email || !password) {
    throw new Error(
      'E2E auth: TEST_EMAIL and TEST_PASSWORD environment variables are required. ' +
        'Set them before running E2E tests.',
    );
  }

  // Ensure Hub is configured before attempting login
  await waitForLoginReady(page);
  await ensureHubConfigured(page);

  // Retry login up to 3 times (Hub connection may still be establishing)
  const maxAttempts = 3;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    // Fill the login form
    await page.getByPlaceholder('you@example.com').fill(email);
    await page.getByPlaceholder('Enter your password').fill(password);

    // Click the Sign In button
    await page.getByRole('button', { name: 'Sign In' }).click();

    // Check if we got a Hub connection error
    const hubError = page.locator('text=Hub URL not configured');
    const dashboardUrl = page.waitForURL(/\/dashboard/, { timeout: 10_000 });

    // Race between error appearing and successful navigation
    const result = await Promise.race([
      hubError.waitFor({ state: 'visible', timeout: 5_000 }).then(() => 'hub_error' as const),
      dashboardUrl.then(() => 'success' as const),
    ]).catch(() => 'timeout' as const);

    if (result === 'success') {
      // Login succeeded — handle setup wizard if shown
      await handleSetupWizardIfPresent(page);

      // Verify we're on the authenticated layout by checking for Dashboard button in sidebar
      await page
        .getByRole('button', { name: 'Dashboard' })
        .waitFor({ state: 'visible', timeout: 10_000 });
      return;
    }

    if (result === 'hub_error' && attempt < maxAttempts) {
      // Hub not ready yet, wait and retry
      await page.waitForTimeout(2000);
      continue;
    }

    // Final attempt or timeout — let it fail naturally
    if (attempt === maxAttempts) {
      // One final wait for dashboard redirect
      await page.waitForURL(/\/dashboard/, { timeout: 15_000 });
      await page
        .getByRole('button', { name: 'Dashboard' })
        .waitFor({ state: 'visible', timeout: 10_000 });
    }
  }
}

/**
 * Ensure the page is in an authenticated state.
 *
 * Checks for authenticated layout indicators (Dashboard button in sidebar).
 * If already logged in, returns immediately. Otherwise, logs in.
 */
export async function ensureLoggedIn(page: Page): Promise<void> {
  // Check for Dashboard button which exists in all sidebar layouts when logged in
  const dashboardButton = page.getByRole('button', { name: 'Dashboard' });
  const isLoggedIn = await dashboardButton.isVisible({ timeout: 2000 }).catch(() => false);

  if (isLoggedIn) {
    return;
  }

  await loginWithTestAccount(page);
}
