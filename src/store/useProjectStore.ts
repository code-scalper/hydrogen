// store/useProjectStore.ts
import { create } from "zustand";
import { FolderItemInterface } from "@/types";
import { saveLocalStore } from "@/lib/utils";
import { KEYS } from "@/lib/constants";
interface ProjectState {
  selectedProject: FolderItemInterface | null;
  selectedScenario: FolderItemInterface | null;
  selectedDevice: FolderItemInterface | null;
  selectedProperty: FolderItemInterface | null;
  setSelectedProject: (selectedProject: FolderItemInterface) => void;
  setSelectedScenario: (selectedScenario: FolderItemInterface) => void;
  setSelectedDevice: (selectedDevice: FolderItemInterface) => void;
  setSelectedProperty: (selectedProperty: FolderItemInterface) => void;

  scenarios: FolderItemInterface[];
  folderList: FolderItemInterface[];
  setFolderList: (folderList: FolderItemInterface[]) => void;
  addFolder: (folder: FolderItemInterface) => void;
  addScenario: (projectId: string, scenario: FolderItemInterface) => void;

  updateItemName: (
    id: string,
    newName: string,
    type: "project" | "scenario" | "device" | "property",
    parentId?: string
  ) => void;
  deleteItem: (
    id: string,
    type: "project" | "scenario" | "device" | "property",
    parentId?: string
  ) => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
  selectedProject: null,
  selectedScenario: null,
  selectedDevice: null,
  selectedProperty: null,
  setSelectedProject: (selectedProject) => set({ selectedProject }),
  setSelectedScenario: (selectedScenario) => set({ selectedScenario }),
  setSelectedDevice: (selectedDevice) => set({ selectedDevice }),
  setSelectedProperty: (selectedProperty) => set({ selectedProperty }),
  scenarios: [
    {
      id: "SFC1012",
      name: "시나리오 SFC_1012",
      type: "scenario",
      children: [
        { name: "TT1", id: "chap1", type: "device" },
        { name: "MCp1", id: "chap2", type: "device" },
        { name: "MBk", id: "chap3", type: "device" },
        { name: "PSV_MBk", id: "chap4", type: "device" },
        { name: "HBk", id: "chap5", type: "device" },
        { name: "V130-1", id: "chap6", type: "device" },
        { name: "V140-1", id: "chap7", type: "device" },
        { name: "V150-1", id: "chap8", type: "device" },
        { name: "V130-2", id: "chap9", type: "device" },
        { name: "V140-2", id: "chap10", type: "device" },
        { name: "V150-2", id: "chap11", type: "device" },
      ],
    },
    {
      id: "SFC1013",
      name: "시나리오 SFC_1013",
      type: "scenario",
      children: [
        { name: "TT1", id: "chap1", type: "device" },
        { name: "MCp1", id: "chap2", type: "device" },
        { name: "MBk", id: "chap3", type: "device" },
        { name: "PSV_MBk", id: "chap4", type: "device" },
        { name: "HBk", id: "chap5", type: "device" },
        { name: "V130-1", id: "chap6", type: "device" },
        { name: "V140-1", id: "chap7", type: "device" },
        { name: "V150-1", id: "chap8", type: "device" },
        { name: "V130-2", id: "chap9", type: "device" },
        { name: "V140-2", id: "chap10", type: "device" },
        { name: "V150-2", id: "chap11", type: "device" },
      ],
    },
    {
      id: "SFC1022",
      name: "시나리오 SFC_1022",
      type: "scenario",
      children: [
        { name: "TT1", id: "chap1", type: "device" },
        { name: "MCp1", id: "chap2", type: "device" },
        { name: "MBk", id: "chap3", type: "device" },
        { name: "PSV_MBk", id: "chap4", type: "device" },
        { name: "HBk", id: "chap5", type: "device" },
        { name: "V130-1", id: "chap6", type: "device" },
        { name: "V140-1", id: "chap7", type: "device" },
        { name: "V150-1", id: "chap8", type: "device" },
        { name: "V130-2", id: "chap9", type: "device" },
        { name: "V140-2", id: "chap10", type: "device" },
        { name: "V150-2", id: "chap11", type: "device" },
      ],
    },
    {
      id: "SFC1023",
      name: "시나리오 SFC_1023",
      type: "scenario",
      children: [
        { name: "TT1", id: "chap1", type: "device" },
        { name: "MCp1", id: "chap2", type: "device" },
        { name: "MBk", id: "chap3", type: "device" },
        { name: "PSV_MBk", id: "chap4", type: "device" },
        { name: "HBk", id: "chap5", type: "device" },
        { name: "V130-1", id: "chap6", type: "device" },
        { name: "V140-1", id: "chap7", type: "device" },
        { name: "V150-1", id: "chap8", type: "device" },
        { name: "V130-2", id: "chap9", type: "device" },
        { name: "V140-2", id: "chap10", type: "device" },
        { name: "V150-2", id: "chap11", type: "device" },
      ],
    },
    {
      id: "SFC1033",
      name: "시나리오 SFC_1033",
      type: "scenario",
      children: [
        { name: "TT1", id: "chap1", type: "device" },
        { name: "MCp1", id: "chap2", type: "device" },
        { name: "MBk", id: "chap3", type: "device" },
        { name: "PSV_MBk", id: "chap4", type: "device" },
        { name: "HBk", id: "chap5", type: "device" },
        { name: "V130-1", id: "chap6", type: "device" },
        { name: "V140-1", id: "chap7", type: "device" },
        { name: "V150-1", id: "chap8", type: "device" },
        { name: "V130-2", id: "chap9", type: "device" },
        { name: "V140-2", id: "chap10", type: "device" },
        { name: "V150-2", id: "chap11", type: "device" },
      ],
    },
    {
      id: "SFC1232",
      name: "시나리오 SFC_1232",
      type: "scenario",
      children: [
        { name: "TT1", id: "chap1", type: "device" },
        { name: "MCp1", id: "chap2", type: "device" },
        { name: "MBk", id: "chap3", type: "device" },
        { name: "PSV_MBk", id: "chap4", type: "device" },
        { name: "HBk", id: "chap5", type: "device" },
        { name: "V130-1", id: "chap6", type: "device" },
        { name: "V140-1", id: "chap7", type: "device" },
        { name: "V150-1", id: "chap8", type: "device" },
        { name: "V130-2", id: "chap9", type: "device" },
        { name: "V140-2", id: "chap10", type: "device" },
        { name: "V150-2", id: "chap11", type: "device" },
      ],
    },
    {
      id: "SFC1243",
      name: "시나리오 SFC_1243",
      type: "scenario",
      children: [
        { name: "TT1", id: "chap1", type: "device" },
        { name: "MCp1", id: "chap2", type: "device" },
        { name: "MBk", id: "chap3", type: "device" },
        { name: "PSV_MBk", id: "chap4", type: "device" },
        { name: "HBk", id: "chap5", type: "device" },
        { name: "V130-1", id: "chap6", type: "device" },
        { name: "V140-1", id: "chap7", type: "device" },
        { name: "V150-1", id: "chap8", type: "device" },
        { name: "V130-2", id: "chap9", type: "device" },
        { name: "V140-2", id: "chap10", type: "device" },
        { name: "V150-2", id: "chap11", type: "device" },
      ],
    },
    {
      id: "SFC2012",
      name: "시나리오 SFC_2012",
      type: "scenario",
      children: [
        { name: "TT1", id: "chap1", type: "device" },
        { name: "MCp1", id: "chap2", type: "device" },
        { name: "MBk", id: "chap3", type: "device" },
        { name: "PSV_MBk", id: "chap4", type: "device" },
        { name: "HBk", id: "chap5", type: "device" },
        { name: "V130-1", id: "chap6", type: "device" },
        { name: "V140-1", id: "chap7", type: "device" },
        { name: "V150-1", id: "chap8", type: "device" },
        { name: "V130-2", id: "chap9", type: "device" },
        { name: "V140-2", id: "chap10", type: "device" },
        { name: "V150-2", id: "chap11", type: "device" },
      ],
    },
    {
      id: "SFC2022",
      name: "시나리오 SFC_2022",
      type: "scenario",
      children: [
        { name: "TT1", id: "chap1", type: "device" },
        { name: "MCp1", id: "chap2", type: "device" },
        { name: "MBk", id: "chap3", type: "device" },
        { name: "PSV_MBk", id: "chap4", type: "device" },
        { name: "HBk", id: "chap5", type: "device" },
        { name: "V130-1", id: "chap6", type: "device" },
        { name: "V140-1", id: "chap7", type: "device" },
        { name: "V150-1", id: "chap8", type: "device" },
        { name: "V130-2", id: "chap9", type: "device" },
        { name: "V140-2", id: "chap10", type: "device" },
        { name: "V150-2", id: "chap11", type: "device" },
      ],
    },
    {
      id: "SFC2050",
      name: "시나리오 SFC_2050",
      type: "scenario",
      children: [
        { name: "TT1", id: "chap1", type: "device" },
        { name: "MCp1", id: "chap2", type: "device" },
        { name: "MBk", id: "chap3", type: "device" },
        { name: "PSV_MBk", id: "chap4", type: "device" },
        { name: "HBk", id: "chap5", type: "device" },
        { name: "V130-1", id: "chap6", type: "device" },
        { name: "V140-1", id: "chap7", type: "device" },
        { name: "V150-1", id: "chap8", type: "device" },
        { name: "V130-2", id: "chap9", type: "device" },
        { name: "V140-2", id: "chap10", type: "device" },
        { name: "V150-2", id: "chap11", type: "device" },
      ],
    },
    {
      id: "SFC3012",
      name: "시나리오 SFC_3012",
      type: "scenario",
      children: [
        { name: "TT1", id: "chap1", type: "device" },
        { name: "MCp1", id: "chap2", type: "device" },
        { name: "MBk", id: "chap3", type: "device" },
        { name: "PSV_MBk", id: "chap4", type: "device" },
        { name: "HBk", id: "chap5", type: "device" },
        { name: "V130-1", id: "chap6", type: "device" },
        { name: "V140-1", id: "chap7", type: "device" },
        { name: "V150-1", id: "chap8", type: "device" },
        { name: "V130-2", id: "chap9", type: "device" },
        { name: "V140-2", id: "chap10", type: "device" },
        { name: "V150-2", id: "chap11", type: "device" },
      ],
    },
    {
      id: "SFC3022",
      name: "시나리오 SFC_3022",
      type: "scenario",
      children: [
        { name: "TT1", id: "chap1", type: "device" },
        { name: "MCp1", id: "chap2", type: "device" },
        { name: "MBk", id: "chap3", type: "device" },
        { name: "PSV_MBk", id: "chap4", type: "device" },
        { name: "HBk", id: "chap5", type: "device" },
        { name: "V130-1", id: "chap6", type: "device" },
        { name: "V140-1", id: "chap7", type: "device" },
        { name: "V150-1", id: "chap8", type: "device" },
        { name: "V130-2", id: "chap9", type: "device" },
        { name: "V140-2", id: "chap10", type: "device" },
        { name: "V150-2", id: "chap11", type: "device" },
      ],
    },
  ],
  folderList: [],
  setFolderList: (folderList) => set({ folderList }),

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

  updateItemName: (
    id: string,
    newName: string,
    type: FolderItemInterface["type"],
    parentId?: string
  ) =>
    set((state) => {
      const updateChildren = (
        children?: FolderItemInterface[]
      ): FolderItemInterface[] | undefined =>
        children?.map((item) => {
          if (item.id === id && item.type === type) {
            return { ...item, name: newName };
          }
          if (item.children) {
            return { ...item, children: updateChildren(item.children) };
          }
          return item;
        });

      const updatedFolderList = state.folderList.map((project) => {
        if (type === "project" && project.id === id) {
          return { ...project, name: newName };
        }

        if (type !== "project" && project.id === parentId) {
          return {
            ...project,
            children: updateChildren(project.children),
          };
        }

        return project;
      });

      saveLocalStore(KEYS.PROJECT, updatedFolderList);
      return {
        folderList: updatedFolderList,
      };
    }),
  deleteItem: (
    id: string,
    type: "project" | "scenario" | "device" | "property",
    parentId?: string
  ) =>
    set((state) => {
      const deleteFromChildren = (
        items?: FolderItemInterface[]
      ): FolderItemInterface[] =>
        items
          ?.filter((item) => !(item.id === id && item.type === type))
          .map((item) =>
            item.children
              ? { ...item, children: deleteFromChildren(item.children) }
              : item
          ) || [];

      let updatedFolderList = [...state.folderList];

      if (type === "project") {
        updatedFolderList = updatedFolderList.filter((item) => item.id !== id);
      } else {
        updatedFolderList = updatedFolderList.map((project) =>
          project.id === parentId
            ? { ...project, children: deleteFromChildren(project.children) }
            : {
                ...project,
                children: deleteFromChildren(project.children),
              }
        );
      }
      saveLocalStore(KEYS.PROJECT, updatedFolderList);
      return { folderList: updatedFolderList };
    }),
}));
