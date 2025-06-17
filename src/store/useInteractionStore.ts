// store/useProjectStore.ts
import { create } from "zustand";

interface InteractionState {
  scenarioOpen: boolean;
  setScenarioOpen: (open: boolean) => void;
  deviceOpen: boolean;
  setDeviceOpen: (open: boolean) => void;
  adjustBasicDataOpen: boolean;
  setAdjustBasicDataOpen: (open: boolean) => void;
}

export const useInteractionStore = create<InteractionState>((set) => ({
  scenarioOpen: false,
  setScenarioOpen: (open) => set({ scenarioOpen: open }),
  deviceOpen: false,
  setDeviceOpen: (open) => set({ deviceOpen: open }),
  adjustBasicDataOpen: false,
  setAdjustBasicDataOpen: (open) => set({ adjustBasicDataOpen: open }),
}));
