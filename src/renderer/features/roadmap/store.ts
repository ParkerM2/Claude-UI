/**
 * Roadmap UI state store
 */

import { create } from 'zustand';

interface RoadmapUIState {
  selectedMilestoneId: string | null;
  isCreating: boolean;
  selectMilestone: (id: string | null) => void;
  setCreating: (creating: boolean) => void;
}

export const useRoadmapUI = create<RoadmapUIState>()((set) => ({
  selectedMilestoneId: null,
  isCreating: false,
  selectMilestone: (id) => set({ selectedMilestoneId: id }),
  setCreating: (creating) => set({ isCreating: creating }),
}));
