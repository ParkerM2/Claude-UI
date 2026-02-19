/**
 * Security-related types
 */

export type SecurityMode = 'sandboxed' | 'unrestricted';

export type CspMode = 'strict' | 'relaxed';

export interface SecuritySettings {
  /** Agent environment variable handling mode */
  envMode: SecurityMode;
  /** Glob patterns for blocked env vars in sandboxed mode (e.g., 'HUB_*', 'SMTP_*') */
  envBlocklist: string[];
  /** Env vars always passed through regardless of mode */
  envAlwaysPass: string[];
  /** Content Security Policy mode */
  cspMode: CspMode;
  /** Whether IPC channel allowlist is active in preload */
  ipcAllowlistEnabled: boolean;
  /** Whether IPC throttling is active for expensive operations */
  ipcThrottlingEnabled: boolean;
  /** Whether agent working directory is restricted to project paths */
  workdirRestricted: boolean;
  /** Default Claude CLI flags for agent spawning */
  defaultSpawnFlags: string;
}

/** Default security settings */
export const DEFAULT_SECURITY_SETTINGS: SecuritySettings = {
  envMode: 'sandboxed',
  envBlocklist: [
    'HUB_*',
    'SMTP_*',
    'SLACK_*',
    'WEBHOOK_*',
    'GITHUB_TOKEN',
    'DATABASE_*',
    'DB_*',
    'MONGO_*',
    'REDIS_*',
  ],
  envAlwaysPass: [
    'PATH',
    'HOME',
    'USERPROFILE',
    'TERM',
    'COLORTERM',
    'SHELL',
    'COMSPEC',
    'LANG',
    'LC_*',
  ],
  cspMode: 'strict',
  ipcAllowlistEnabled: true,
  ipcThrottlingEnabled: true,
  workdirRestricted: true,
  defaultSpawnFlags: '--dangerously-skip-permissions',
};

export interface SecurityAuditExport {
  exportedAt: string;
  settings: SecuritySettings;
  ipcChannelCount: number;
  activeAgentCount: number;
}
