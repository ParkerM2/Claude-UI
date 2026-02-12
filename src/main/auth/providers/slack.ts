import type { OAuthConfig } from '../types';

export const SLACK_OAUTH_CONFIG: OAuthConfig = {
  name: 'slack',
  clientId: '',
  clientSecret: '',
  authorizationUrl: 'https://slack.com/oauth/v2/authorize',
  tokenUrl: 'https://slack.com/api/oauth.v2.access',
  redirectUri: 'claude-ui://oauth/callback',
  scopes: ['channels:read', 'chat:write', 'search:read', 'users.profile:write'],
};
