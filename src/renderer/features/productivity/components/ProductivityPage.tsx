/**
 * ProductivityPage — Dashboard combining Calendar and Spotify widgets
 */

import { Calendar, Headphones, LayoutGrid } from 'lucide-react';

import { cn } from '@renderer/shared/lib/utils';

import { useProductivityStore } from '../store';

import { CalendarWidget } from './CalendarWidget';
import { SpotifyWidget } from './SpotifyWidget';

// ── Constants ────────────────────────────────────────────────

const TABS = [
  { id: 'overview' as const, label: 'Overview', icon: LayoutGrid },
  { id: 'calendar' as const, label: 'Calendar', icon: Calendar },
  { id: 'spotify' as const, label: 'Spotify', icon: Headphones },
];

const TAB_BASE = 'flex items-center gap-1.5 border-b-2 px-3 py-2 text-sm transition-colors';
const TAB_ACTIVE = 'border-primary text-foreground font-medium';
const TAB_INACTIVE = 'border-transparent text-muted-foreground hover:text-foreground';

// ── Component ────────────────────────────────────────────────

export function ProductivityPage() {
  const { activeTab, setActiveTab } = useProductivityStore();

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      {/* Header */}
      <div className="border-border border-b px-6 py-4">
        <h1 className="text-foreground text-2xl font-bold">Productivity</h1>
        <p className="text-muted-foreground text-sm">
          Calendar, music, and productivity tools in one place
        </p>
      </div>

      {/* Tabs */}
      <div className="border-border border-b px-6">
        <div className="flex gap-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              className={cn(TAB_BASE, activeTab === tab.id ? TAB_ACTIVE : TAB_INACTIVE)}
              type="button"
              onClick={() => {
                setActiveTab(tab.id);
              }}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        {activeTab === 'overview' ? (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <CalendarWidget />
            <SpotifyWidget />
          </div>
        ) : null}

        {activeTab === 'calendar' ? (
          <div className="mx-auto max-w-2xl">
            <CalendarWidget />
          </div>
        ) : null}

        {activeTab === 'spotify' ? (
          <div className="mx-auto max-w-md">
            <SpotifyWidget />
          </div>
        ) : null}
      </div>
    </div>
  );
}
