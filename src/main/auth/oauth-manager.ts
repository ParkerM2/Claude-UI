/**
 * OAuth Manager — Generic OAuth2 authorization flow handler.
 *
 * Handles the full lifecycle: authorization URL generation, BrowserWindow-based
 * consent flow, code exchange, token storage, automatic refresh, and revocation.
 */

import { BrowserWindow } from 'electron';

import type { TokenStore } from './token-store';
import type { OAuthConfig, OAuthTokens, TokenExchangeResponse } from './types';

const AUTH_TIMEOUT_MS = 5 * 60 * 1000;
const TOKEN_REFRESH_BUFFER_MS = 60 * 1000;
const MAX_RETRY_ATTEMPTS = 3;
const RETRY_DELAY_MS = 1000;

export interface OAuthManager {
  /** Start OAuth flow — opens browser window, returns tokens */
  authorize: (provider: string) => Promise<OAuthTokens>;
  /** Get current valid token (refreshes if expired) */
  getAccessToken: (provider: string) => Promise<string>;
  /** Check if provider is authenticated */
  isAuthenticated: (provider: string) => boolean;
  /** Revoke provider tokens */
  revoke: (provider: string) => Promise<void>;
}

function buildAuthUrl(config: OAuthConfig, state: string): string {
  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    response_type: 'code',
    scope: config.scopes.join(' '),
    state,
  });
  return `${config.authorizationUrl}?${params.toString()}`;
}

function generateState(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

function isTokenExpired(tokens: OAuthTokens): boolean {
  if (!tokens.expiresAt) {
    return false;
  }
  const expiresAt = new Date(tokens.expiresAt).getTime();
  return Date.now() >= expiresAt - TOKEN_REFRESH_BUFFER_MS;
}

function computeExpiresAt(expiresIn: number): string {
  return new Date(Date.now() + expiresIn * 1000).toISOString();
}

async function delay(ms: number): Promise<void> {
  await new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function exchangeCodeForTokens(config: OAuthConfig, code: string): Promise<OAuthTokens> {
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: config.redirectUri,
    client_id: config.clientId,
    client_secret: config.clientSecret,
  });

  const response = await fetchWithRetry(config.tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
    body: body.toString(),
  });

  const data = (await response.json()) as TokenExchangeResponse;
  return mapTokenResponse(data);
}

async function refreshAccessToken(config: OAuthConfig, refreshToken: string): Promise<OAuthTokens> {
  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
    client_id: config.clientId,
    client_secret: config.clientSecret,
  });

  const response = await fetchWithRetry(config.tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
    body: body.toString(),
  });

  const data = (await response.json()) as TokenExchangeResponse;
  return mapTokenResponse(data);
}

function mapTokenResponse(data: TokenExchangeResponse): OAuthTokens {
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresAt: data.expires_in === undefined ? undefined : computeExpiresAt(data.expires_in),
    tokenType: data.token_type,
    scope: data.scope,
  };
}

async function fetchWithRetry(url: string, options: RequestInit): Promise<Response> {
  let lastError: Error | undefined;

  for (let attempt = 0; attempt < MAX_RETRY_ATTEMPTS; attempt++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) {
        return response;
      }
      throw new Error(`Token exchange failed with status: ${response.status}`);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (attempt < MAX_RETRY_ATTEMPTS - 1) {
        await delay(RETRY_DELAY_MS * (attempt + 1));
      }
    }
  }

  throw lastError ?? new Error('Token exchange failed after retries');
}

function extractCodeFromUrl(url: string, expectedState: string): string {
  const parsed = new URL(url);
  const code = parsed.searchParams.get('code');
  const state = parsed.searchParams.get('state');
  const error = parsed.searchParams.get('error');

  if (error) {
    const description = parsed.searchParams.get('error_description') ?? error;
    throw new Error(`OAuth error: ${description}`);
  }

  if (state !== expectedState) {
    throw new Error('OAuth state mismatch — possible CSRF attack');
  }

  if (!code) {
    throw new Error('No authorization code in callback URL');
  }

  return code;
}

function openAuthWindow(authUrl: string): BrowserWindow {
  const authWindow = new BrowserWindow({
    width: 800,
    height: 700,
    show: true,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  void authWindow.loadURL(authUrl);
  return authWindow;
}

export function createOAuthManager(deps: {
  tokenStore: TokenStore;
  providers: Map<string, OAuthConfig>;
}): OAuthManager {
  const { tokenStore, providers } = deps;

  function getProvider(provider: string): OAuthConfig {
    const config = providers.get(provider);
    if (!config) {
      throw new Error(`Unknown OAuth provider: ${provider}`);
    }
    return config;
  }

  return {
    async authorize(provider) {
      const config = getProvider(provider);
      const state = generateState();
      const authUrl = buildAuthUrl(config, state);
      const authWindow = openAuthWindow(authUrl);

      return await new Promise<OAuthTokens>((resolve, reject) => {
        let settled = false;

        const timeout = setTimeout(() => {
          if (!settled) {
            settled = true;
            authWindow.close();
            reject(new Error('OAuth authorization timed out after 5 minutes'));
          }
        }, AUTH_TIMEOUT_MS);

        function cleanup(): void {
          clearTimeout(timeout);
          if (!authWindow.isDestroyed()) {
            authWindow.close();
          }
        }

        function handleRedirect(url: string): void {
          if (settled) return;
          if (!url.startsWith(config.redirectUri)) return;

          settled = true;
          cleanup();

          void (async () => {
            try {
              const code = extractCodeFromUrl(url, state);
              const tokens = await exchangeCodeForTokens(config, code);
              tokenStore.setTokens(provider, tokens);
              resolve(tokens);
            } catch (error) {
              const message = error instanceof Error ? error.message : String(error);
              reject(new Error(`OAuth code exchange failed: ${message}`));
            }
          })();
        }

        authWindow.webContents.on('will-redirect', (_event, url) => {
          handleRedirect(url);
        });

        authWindow.webContents.on('will-navigate', (_event, url) => {
          handleRedirect(url);
        });

        authWindow.on('closed', () => {
          if (!settled) {
            settled = true;
            clearTimeout(timeout);
            reject(new Error('OAuth window closed by user'));
          }
        });
      });
    },

    async getAccessToken(provider) {
      const config = getProvider(provider);
      const tokens = tokenStore.getTokens(provider);

      if (!tokens) {
        throw new Error(`No tokens stored for provider: ${provider}`);
      }

      if (!isTokenExpired(tokens)) {
        return tokens.accessToken;
      }

      if (!tokens.refreshToken) {
        tokenStore.deleteTokens(provider);
        throw new Error(`Token expired and no refresh token for provider: ${provider}`);
      }

      try {
        const refreshed = await refreshAccessToken(config, tokens.refreshToken);
        const merged: OAuthTokens = {
          ...refreshed,
          refreshToken: refreshed.refreshToken ?? tokens.refreshToken,
        };
        tokenStore.setTokens(provider, merged);
        return merged.accessToken;
      } catch {
        tokenStore.deleteTokens(provider);
        throw new Error(`Token refresh failed for provider: ${provider}`);
      }
    },

    isAuthenticated(provider) {
      return tokenStore.hasTokens(provider);
    },

    async revoke(provider) {
      tokenStore.deleteTokens(provider);
      await Promise.resolve();
    },
  };
}
