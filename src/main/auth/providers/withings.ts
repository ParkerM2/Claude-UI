import type { OAuthConfig } from '../types';

export const WITHINGS_OAUTH_CONFIG: OAuthConfig = {
  name: 'withings',
  clientId: '',
  clientSecret: '',
  authorizationUrl: 'https://account.withings.com/oauth2_user/authorize2',
  tokenUrl: 'https://wbsapi.withings.net/v2/oauth2',
  redirectUri: 'claude-ui://oauth/callback',
  scopes: ['user.metrics'],
};
