/**
 * Communications Store — UI state for the communications feature
 */

import { create } from 'zustand';

type ServiceStatus = 'connected' | 'disconnected' | 'error';

interface NotificationRule {
  id: string;
  service: 'slack' | 'discord';
  pattern: string;
  enabled: boolean;
}

interface CommunicationsState {
  slackStatus: ServiceStatus;
  discordStatus: ServiceStatus;
  notificationRules: NotificationRule[];
  activeTab: 'overview' | 'slack' | 'discord' | 'rules';
  setSlackStatus: (status: ServiceStatus) => void;
  setDiscordStatus: (status: ServiceStatus) => void;
  setActiveTab: (tab: CommunicationsState['activeTab']) => void;
  addNotificationRule: (rule: Omit<NotificationRule, 'id'>) => void;
  removeNotificationRule: (id: string) => void;
  toggleNotificationRule: (id: string) => void;
}

export const useCommunicationsStore = create<CommunicationsState>((set) => ({
  slackStatus: 'disconnected',
  discordStatus: 'disconnected',
  notificationRules: [],
  activeTab: 'overview',

  setSlackStatus: (status) => set({ slackStatus: status }),

  setDiscordStatus: (status) => set({ discordStatus: status }),

  setActiveTab: (tab) => set({ activeTab: tab }),

  addNotificationRule: (rule) =>
    set((state) => ({
      notificationRules: [...state.notificationRules, { ...rule, id: crypto.randomUUID() }],
    })),

  removeNotificationRule: (id) =>
    set((state) => ({
      notificationRules: state.notificationRules.filter((r) => r.id !== id),
    })),

  toggleNotificationRule: (id) =>
    set((state) => ({
      notificationRules: state.notificationRules.map((r) =>
        r.id === id ? { ...r, enabled: !r.enabled } : r,
      ),
    })),
}));
