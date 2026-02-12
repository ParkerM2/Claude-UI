/**
 * HubSettings — Hub connection configuration UI
 *
 * Allows users to configure the hub server URL and API key,
 * connect/disconnect, view connection status, and trigger syncs.
 */

import { useState } from 'react';

import { Cloud, CloudOff, Loader2, RefreshCw, Trash2 } from 'lucide-react';

import { cn } from '@renderer/shared/lib/utils';

import {
  useHubConnect,
  useHubDisconnect,
  useHubRemoveConfig,
  useHubStatus,
  useHubSync,
} from '../api/useHub';

// ── Constants ───────────────────────────────────────────────

const ICON_SIZE = 'h-4 w-4';
const BUTTON_BASE =
  'inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors';

const STATUS_STYLES: Record<string, string> = {
  connected: 'bg-success',
  disconnected: 'bg-muted-foreground',
  connecting: 'bg-warning',
  error: 'bg-destructive',
};

const STATUS_LABELS: Record<string, string> = {
  connected: 'Connected',
  disconnected: 'Disconnected',
  connecting: 'Connecting...',
  error: 'Error',
};

// ── Sub-components ──────────────────────────────────────────

interface ConnectionFormProps {
  isConnecting: boolean;
  connectError: boolean;
  onConnect: (url: string, apiKey: string) => void;
}

function ConnectionForm({ isConnecting, connectError, onConnect }: ConnectionFormProps) {
  const [hubUrl, setHubUrl] = useState('');
  const [apiKey, setApiKey] = useState('');

  function handleSubmit() {
    if (hubUrl && apiKey) {
      onConnect(hubUrl, apiKey);
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="text-foreground mb-1.5 block text-sm font-medium" htmlFor="hub-url">
          Hub URL
        </label>
        <input
          className="border-input bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-ring w-full rounded-md border px-3 py-2 text-sm focus:ring-1 focus:outline-none"
          id="hub-url"
          placeholder="https://192.168.1.100:3443"
          type="url"
          value={hubUrl}
          onChange={(e) => {
            setHubUrl(e.target.value);
          }}
        />
      </div>

      <div>
        <label className="text-foreground mb-1.5 block text-sm font-medium" htmlFor="hub-api-key">
          API Key
        </label>
        <input
          className="border-input bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-ring w-full rounded-md border px-3 py-2 text-sm focus:ring-1 focus:outline-none"
          id="hub-api-key"
          placeholder="Enter your hub API key"
          type="password"
          value={apiKey}
          onChange={(e) => {
            setApiKey(e.target.value);
          }}
        />
      </div>

      <button
        disabled={!hubUrl || !apiKey || isConnecting}
        type="button"
        className={cn(
          BUTTON_BASE,
          'bg-primary text-primary-foreground hover:bg-primary/90',
          'disabled:cursor-not-allowed disabled:opacity-50',
        )}
        onClick={handleSubmit}
      >
        {isConnecting ? (
          <Loader2 className={cn(ICON_SIZE, 'animate-spin')} />
        ) : (
          <Cloud className={ICON_SIZE} />
        )}
        {isConnecting ? 'Connecting...' : 'Connect'}
      </button>

      {connectError ? (
        <p className="text-destructive text-sm">Failed to connect. Check your URL and API key.</p>
      ) : null}
    </div>
  );
}

interface ConnectedActionsProps {
  syncPending: boolean;
  onSync: () => void;
  onDisconnect: () => void;
  onRemoveConfig: () => void;
}

function ConnectedActions({
  syncPending,
  onSync,
  onDisconnect,
  onRemoveConfig,
}: ConnectedActionsProps) {
  return (
    <div className="flex flex-wrap gap-3">
      <button
        disabled={syncPending}
        type="button"
        className={cn(
          BUTTON_BASE,
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
          'disabled:cursor-not-allowed disabled:opacity-50',
        )}
        onClick={onSync}
      >
        <RefreshCw className={cn(ICON_SIZE, syncPending && 'animate-spin')} />
        Sync Now
      </button>

      <button
        className={cn(BUTTON_BASE, 'bg-secondary text-secondary-foreground hover:bg-secondary/80')}
        type="button"
        onClick={onDisconnect}
      >
        <CloudOff className={ICON_SIZE} />
        Disconnect
      </button>

      <button
        type="button"
        className={cn(
          BUTTON_BASE,
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        )}
        onClick={onRemoveConfig}
      >
        <Trash2 className={ICON_SIZE} />
        Remove Config
      </button>
    </div>
  );
}

// ── Main component ──────────────────────────────────────────

export function HubSettings() {
  const { data: hubStatus, isLoading } = useHubStatus();
  const connectMutation = useHubConnect();
  const disconnectMutation = useHubDisconnect();
  const syncMutation = useHubSync();
  const removeConfigMutation = useHubRemoveConfig();

  const statusValue = hubStatus?.status ?? 'disconnected';
  const isConnected = statusValue === 'connected';
  const pendingCount = hubStatus?.pendingMutations ?? 0;

  if (isLoading) {
    return (
      <div className="text-muted-foreground flex items-center gap-2 py-4">
        <Loader2 className={cn(ICON_SIZE, 'animate-spin')} />
        <span>Loading hub status...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-foreground text-lg font-semibold">Hub Connection</h3>
        <p className="text-muted-foreground text-sm">
          Connect to a Claude-UI Hub server for cross-device sync and centralized data.
        </p>
      </div>

      {/* Connection status */}
      <div className="flex items-center gap-3">
        <div
          className={cn(
            'h-3 w-3 rounded-full',
            STATUS_STYLES[statusValue] ?? 'bg-muted-foreground',
          )}
        />
        <span className="text-foreground text-sm font-medium">
          {STATUS_LABELS[statusValue] ?? 'Unknown'}
        </span>
        {isConnected && hubStatus?.hubUrl ? (
          <span className="text-muted-foreground text-xs">({hubStatus.hubUrl})</span>
        ) : null}
      </div>

      {/* Pending mutations */}
      {pendingCount > 0 ? (
        <div className="border-warning bg-warning-light rounded-md border p-3">
          <p className="text-warning-foreground text-sm">
            {String(pendingCount)} pending mutation{pendingCount === 1 ? '' : 's'} waiting to sync.
          </p>
        </div>
      ) : null}

      {/* Last connected */}
      {hubStatus?.lastConnected ? (
        <p className="text-muted-foreground text-xs">
          Last connected: {new Date(hubStatus.lastConnected).toLocaleString()}
        </p>
      ) : null}

      {/* Form or actions */}
      {isConnected ? (
        <ConnectedActions
          syncPending={syncMutation.isPending}
          onDisconnect={() => {
            disconnectMutation.mutate();
          }}
          onRemoveConfig={() => {
            removeConfigMutation.mutate();
          }}
          onSync={() => {
            syncMutation.mutate();
          }}
        />
      ) : (
        <ConnectionForm
          connectError={connectMutation.isError}
          isConnecting={connectMutation.isPending}
          onConnect={(url, apiKey) => {
            connectMutation.mutate({ url, apiKey });
          }}
        />
      )}

      {/* Sync result */}
      {syncMutation.isSuccess ? (
        <p className="text-success text-sm">
          Synced {String(syncMutation.data.syncedCount)} item
          {syncMutation.data.syncedCount === 1 ? '' : 's'}.
          {syncMutation.data.pendingCount > 0
            ? ` ${String(syncMutation.data.pendingCount)} still pending.`
            : ''}
        </p>
      ) : null}
    </div>
  );
}
