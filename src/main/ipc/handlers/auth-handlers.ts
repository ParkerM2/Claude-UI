/**
 * Auth IPC handlers — real Hub API integration
 *
 * Handles user authentication via the Hub server.
 * Tokens are stored securely via the shared TokenStore.
 */

import type { HubAuthService } from '@main/services/hub/hub-auth-service';

import type { IpcRouter } from '../router';

export interface AuthHandlerDependencies {
  hubAuthService: HubAuthService;
}

export function registerAuthHandlers(
  router: IpcRouter,
  deps: AuthHandlerDependencies,
): void {
  const { hubAuthService } = deps;

  router.handle('auth.login', async ({ email, password }) => {
    const result = await hubAuthService.login({ email, password });

    if (!result.ok || !result.data) {
      throw new Error(result.error ?? 'Login failed');
    }

    const { user, accessToken } = result.data;
    return {
      token: accessToken,
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
      },
    };
  });

  router.handle('auth.register', async ({ email, password, displayName }) => {
    const result = await hubAuthService.register({ email, password, displayName });

    if (!result.ok || !result.data) {
      throw new Error(result.error ?? 'Registration failed');
    }

    const { user, accessToken } = result.data;
    return {
      token: accessToken,
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
      },
    };
  });

  router.handle('auth.me', async () => {
    const result = await hubAuthService.getCurrentUser();

    if (!result.ok || !result.data) {
      throw new Error(result.error ?? 'Failed to get current user');
    }

    const user = result.data;
    return {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
    };
  });

  router.handle('auth.logout', async () => {
    await hubAuthService.logout();
    return { success: true };
  });

  router.handle('auth.refresh', async () => {
    const result = await hubAuthService.refreshToken();

    if (!result.ok || !result.data) {
      throw new Error(result.error ?? 'Token refresh failed');
    }

    return { token: result.data.accessToken };
  });
}
