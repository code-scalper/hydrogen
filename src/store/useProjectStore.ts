// store/useProjectStore.ts
import { create } from "zustand";
import { FolderItemInterface } from "@/types";

interface ProjectState {
  folderList: FolderItemInterface[];
  setFolderList: (folderList: FolderItemInterface[]) => void;

  addFolder: (folder: FolderItemInterface) => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
  folderList: [
    {
      name: "프로젝트1",
      children: [
        {
          name: "시나리오1 SFC_110",
          children: [
            { name: "장치1" },
            { name: "장치2" },
            { name: "장치3" },
            { name: "장치4" },
            { name: "장치5" },
          ],
        },
        {
          name: "시나리오2 SFC_220",
          children: [{ name: "dd1" }, { name: "dd2" }],
        },
        { name: "시나리오3 SFC_330" },
      ],
    },
  ],
  setFolderList: (folderList) => set({ folderList }),
  addFolder: (folder) =>
    set((state) => ({
      folderList: [...state.folderList, folder],
    })),
}));
