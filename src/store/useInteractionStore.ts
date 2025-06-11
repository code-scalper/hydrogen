// store/useProjectStore.ts
import { create } from "zustand";
import { FolderItemInterface } from "@/types";

interface ProjectState {
  scenarioOpen: boolean;
  setScenarioOpen: (open: boolean) => void;
  deviceOpen: boolean;
  setDeviceOpen: (open: boolean) => void;
}

export const useInteractionStore = create<ProjectState>((set) => ({
  scenarioOpen: false,
  setScenarioOpen: (open) => set({ scenarioOpen: open }),
  deviceOpen: false,
  setDeviceOpen: (open) => set({ deviceOpen: open }),
}));
