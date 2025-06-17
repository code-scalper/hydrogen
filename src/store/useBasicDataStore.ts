import { create } from "zustand";
import { persist } from "zustand/middleware";
import { throttledBackup } from "@/lib/utils";

interface BasicDataState {
  dataset: Record<string, string>;
  setValue: (key: string, value: string) => void;
  resetDataset: () => void;
}

export const useBasicDataStore = create<BasicDataState>()(
  persist(
    (set, get) => ({
      dataset: {},
      setValue: (key, value) => {
        const updated = {
          ...get().dataset,
          [key]: value,
        };

        set({ dataset: updated });

        // ✅ 업데이트된 dataset을 백업
        throttledBackup(updated, "BASIC_DATA");
      },

      resetDataset: () => set({ dataset: {} }),
    }),
    {
      name: "basic-data-store", // localStorage에 저장될 키
    }
  )
);
