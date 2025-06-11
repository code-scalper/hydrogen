// store/useProjectStore.ts
import { create } from "zustand";
import { FolderItemInterface } from "@/types";
import { saveLocalStore } from "@/lib/utils";
import { KEYS } from "@/lib/constants";
interface ProjectState {
  selectedProject: FolderItemInterface | null;
  scenarios: FolderItemInterface[];
  folderList: FolderItemInterface[];
  setFolderList: (folderList: FolderItemInterface[]) => void;
  setSelectedProject: (selectedProject: FolderItemInterface) => void;
  addFolder: (folder: FolderItemInterface) => void;
  addScenario: (projectId: string, scenario: FolderItemInterface) => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
  selectedProject: null,
  scenarios: [
    {
      id: "scenario1",
      name: "시나리오1 SFC_110",
      children: [
        { name: "장치1", id: "chap1" },
        { name: "장치2", id: "chap1" },
        { name: "장치3", id: "chap1" },
        { name: "장치4", id: "chap1" },
        { name: "장치5", id: "chap1" },
      ],
    },
    {
      id: "scenario2",
      name: "시나리오1 SFC_210",
      children: [
        { name: "장치1", id: "chap1" },
        { name: "장치2", id: "chap1" },
        { name: "장치3", id: "chap1" },
        { name: "장치4", id: "chap1" },
        { name: "장치5", id: "chap1" },
      ],
    },
    {
      id: "scenario3",
      name: "시나리오1 SFC_310",
      children: [
        { name: "장치1", id: "chap1" },
        { name: "장치2", id: "chap1" },
        { name: "장치3", id: "chap1" },
        { name: "장치4", id: "chap1" },
        { name: "장치5", id: "chap1" },
      ],
    },
    {
      id: "scenario4",
      name: "시나리오1 SFC_410",
      children: [
        { name: "장치1", id: "chap1" },
        { name: "장치2", id: "chap1" },
        { name: "장치3", id: "chap1" },
        { name: "장치4", id: "chap1" },
        { name: "장치5", id: "chap1" },
      ],
    },
    {
      id: "scenario5",
      name: "시나리오1 SFC_510",
      children: [
        { name: "장치1", id: "chap1" },
        { name: "장치2", id: "chap1" },
        { name: "장치3", id: "chap1" },
        { name: "장치4", id: "chap1" },
        { name: "장치5", id: "chap1" },
      ],
    },
    {
      id: "scenario6",
      name: "시나리오1 SFC_610",
      children: [
        { name: "장치1", id: "chap1" },
        { name: "장치2", id: "chap1" },
        { name: "장치3", id: "chap1" },
        { name: "장치4", id: "chap1" },
        { name: "장치5", id: "chap1" },
      ],
    },
    {
      id: "scenario7",
      name: "시나리오1 SFC_710",
      children: [
        { name: "장치1", id: "chap1" },
        { name: "장치2", id: "chap1" },
        { name: "장치3", id: "chap1" },
        { name: "장치4", id: "chap1" },
        { name: "장치5", id: "chap1" },
      ],
    },
    {
      id: "scenario8",
      name: "시나리오1 SFC_810",
      children: [
        { name: "장치1", id: "chap1" },
        { name: "장치2", id: "chap1" },
        { name: "장치3", id: "chap1" },
        { name: "장치4", id: "chap1" },
        { name: "장치5", id: "chap1" },
      ],
    },
    {
      id: "scenario9",
      name: "시나리오1 SFC_910",
      children: [
        { name: "장치1", id: "chap1" },
        { name: "장치2", id: "chap1" },
        { name: "장치3", id: "chap1" },
        { name: "장치4", id: "chap1" },
        { name: "장치5", id: "chap1" },
      ],
    },
    {
      id: "scenario10",
      name: "시나리오1 SFC_010",
      children: [
        { name: "장치1", id: "chap1" },
        { name: "장치2", id: "chap1" },
        { name: "장치3", id: "chap1" },
        { name: "장치4", id: "chap1" },
        { name: "장치5", id: "chap1" },
      ],
    },
  ],
  folderList: [],
  setFolderList: (folderList) => set({ folderList }),
  setSelectedProject: (selectedProject) => set({ selectedProject }),
  addFolder: (folder) =>
    set((state) => {
      const folderList = [...state.folderList, folder];
      saveLocalStore(KEYS.PROJECT, folderList);
      return {
        folderList,
      };
    }),
  addScenario: (projectId, scenario) =>
    set((state) => {
      const updatedFolderList = state.folderList.map((folder) => {
        if (folder.id === projectId) {
          const updatedChildren = folder.children
            ? [...folder.children, scenario]
            : [scenario]; // children이 없을 경우 새 배열로 시작
          return {
            ...folder,
            children: updatedChildren,
          };
        }
        return folder;
      });
      saveLocalStore(KEYS.PROJECT, updatedFolderList);
      return {
        folderList: updatedFolderList,
      };
    }),
}));
