/**
 * Assistant Store — UI state for the assistant feature
 */

import { create } from 'zustand';

import type { IntentType } from '@shared/types';

interface ResponseEntry {
  id: string;
  input: string;
  response: string;
  type: 'text' | 'action' | 'error';
  intent?: IntentType;
  timestamp: string;
}

interface AssistantState {
  isThinking: boolean;
  currentResponse: string;
  commandDraft: string;
  responseHistory: ResponseEntry[];
  setIsThinking: (isThinking: boolean) => void;
  setCurrentResponse: (response: string) => void;
  clearCurrentResponse: () => void;
  setCommandDraft: (draft: string) => void;
  addResponseEntry: (entry: Omit<ResponseEntry, 'id' | 'timestamp'>) => void;
}

export type { ResponseEntry };

export const useAssistantStore = create<AssistantState>((set) => ({
  isThinking: false,
  currentResponse: '',
  commandDraft: '',
  responseHistory: [],

  setIsThinking: (isThinking) => set({ isThinking }),

  setCurrentResponse: (response) => set({ currentResponse: response }),

  clearCurrentResponse: () => set({ currentResponse: '' }),

  setCommandDraft: (draft) => set({ commandDraft: draft }),

  addResponseEntry: (entry) =>
    set((state) => ({
      responseHistory: [
        ...state.responseHistory,
        {
          ...entry,
          id: crypto.randomUUID(),
          timestamp: new Date().toISOString(),
        },
      ],
    })),
}));
