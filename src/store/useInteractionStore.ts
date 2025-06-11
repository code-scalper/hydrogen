// store/useProjectStore.ts
import { create } from "zustand";
import { FolderItemInterface } from "@/types";

interface ProjectState {
  scenarioOpen: boolean;
  setScenarioOpen: (open: boolean) => void;
}

export const useInteractionStore = create<ProjectState>((set) => ({
  scenarioOpen: false,
  setScenarioOpen: (open) => set({ scenarioOpen: open }),
}));
