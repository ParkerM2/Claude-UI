/**
 * Communications query keys factory
 */
export const communicationsKeys = {
  all: ['communications'] as const,
  slackChannels: () => [...communicationsKeys.all, 'slack-channels'] as const,
  discordServers: () => [...communicationsKeys.all, 'discord-servers'] as const,
};
