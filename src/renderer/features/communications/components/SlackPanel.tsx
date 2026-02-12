/**
 * SlackPanel — Quick Slack actions and status display
 */

import { Hash, MessageSquare, Search, UserCircle } from 'lucide-react';

import { cn } from '@renderer/shared/lib/utils';

import { useCommunicationsStore } from '../store';

const STATUS_COLORS: Record<string, string> = {
  connected: 'bg-success',
  disconnected: 'bg-muted-foreground',
  error: 'bg-destructive',
};

interface QuickAction {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const slackActions: QuickAction[] = [
  { label: 'Send Message', icon: MessageSquare, description: 'Send to a channel or DM' },
  { label: 'Read Channel', icon: Hash, description: 'View recent messages' },
  { label: 'Search', icon: Search, description: 'Search workspace messages' },
  { label: 'Set Status', icon: UserCircle, description: 'Update your Slack status' },
];

export function SlackPanel() {
  const { slackStatus } = useCommunicationsStore();

  return (
    <div className="bg-card border-border rounded-lg border p-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-foreground text-sm font-semibold">Slack</h3>
          <span className={cn('inline-block h-2 w-2 rounded-full', STATUS_COLORS[slackStatus])} />
          <span className="text-muted-foreground text-xs capitalize">{slackStatus}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {slackActions.map((action) => (
          <button
            key={action.label}
            disabled={slackStatus !== 'connected'}
            className={cn(
              'border-border flex items-start gap-2 rounded-md border p-3 text-left',
              'hover:bg-accent transition-colors',
              'disabled:pointer-events-none disabled:opacity-40',
            )}
          >
            <action.icon className="text-muted-foreground mt-0.5 h-4 w-4 shrink-0" />
            <div>
              <p className="text-foreground text-xs font-medium">{action.label}</p>
              <p className="text-muted-foreground text-xs">{action.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
