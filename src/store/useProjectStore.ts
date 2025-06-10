// store/useProjectStore.ts
import { create } from "zustand";
import { FolderItemInterface } from "@/types";

interface ProjectState {
  scenarios: FolderItemInterface[];
  folderList: FolderItemInterface[];
  setFolderList: (folderList: FolderItemInterface[]) => void;

  addFolder: (folder: FolderItemInterface) => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
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
  folderList: [
    {
      id: "sdjakadsad",
      name: "프로젝트1",
      children: [
        {
          id: "scenario_123",
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
          id: "scenario_1234",
          name: "시나리오2 SFC_220",
          children: [
            { name: "dd1", id: "chap1" },
            { name: "dd2", id: "chap1" },
          ],
        },
        {
          id: "scenario_1235",
          name: "시나리오3 SFC_330",
        },
      ],
    },
  ],
  setFolderList: (folderList) => set({ folderList }),
  addFolder: (folder) =>
    set((state) => ({
      folderList: [...state.folderList, folder],
    })),
}));
