/**
 * CommunicationsPage — Overview of connected communication services
 */

import { cn } from '@renderer/shared/lib/utils';

import { useCommunicationsEvents } from '../hooks/useCommunicationsEvents';
import { useCommunicationsStore } from '../store';

import { DiscordPanel } from './DiscordPanel';
import { NotificationRules } from './NotificationRules';
import { SlackPanel } from './SlackPanel';

type TabId = 'overview' | 'slack' | 'discord' | 'rules';

const TABS: Array<{ id: TabId; label: string }> = [
  { id: 'overview', label: 'Overview' },
  { id: 'slack', label: 'Slack' },
  { id: 'discord', label: 'Discord' },
  { id: 'rules', label: 'Rules' },
];

function TabContent({ tab }: { tab: TabId }) {
  if (tab === 'slack') {
    return <SlackPanel />;
  }
  if (tab === 'discord') {
    return <DiscordPanel />;
  }
  if (tab === 'rules') {
    return <NotificationRules />;
  }
  // Overview
  return (
    <div className="space-y-4">
      <SlackPanel />
      <DiscordPanel />
    </div>
  );
}

export function CommunicationsPage() {
  useCommunicationsEvents();

  const { activeTab, setActiveTab } = useCommunicationsStore();

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-foreground mb-1 text-lg font-semibold">Communications</h1>
        <p className="text-muted-foreground mb-6 text-sm">
          Manage your Slack and Discord integrations
        </p>

        {/* Tab bar */}
        <div className="border-border mb-6 flex gap-1 border-b">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              className={cn(
                'px-3 py-2 text-sm transition-colors',
                activeTab === tab.id
                  ? 'text-foreground border-primary border-b-2 font-medium'
                  : 'text-muted-foreground hover:text-foreground',
              )}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <TabContent tab={activeTab} />
      </div>
    </div>
  );
}
