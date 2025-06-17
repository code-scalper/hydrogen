import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ProjectInterface, ScenarioInterface, DeviceInterface } from "@/types";

import { SCENARIOS } from "@/constants";

interface ProjectState {
  selectedProject: ProjectInterface | null;
  selectedScenario: ScenarioInterface | null;
  selectedDevice: DeviceInterface | null;
  selectedProperty: ProjectInterface | null;
  folderList: ProjectInterface[];
  scenarios: ScenarioInterface[];

  setSelectedProject: (selectedProject: ProjectInterface) => void;
  setSelectedScenario: (selectedScenario: ScenarioInterface) => void;
  setSelectedDevice: (selectedDevice: DeviceInterface) => void;
  setSelectedProperty: (selectedProperty: ProjectInterface) => void;
  setFolderList: (folderList: ProjectInterface[]) => void;

  addFolder: (folder: ProjectInterface) => void;
  addScenario: (projectId: string, scenario: ProjectInterface) => void;

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

  updateInputValue: (pointId: string, newValue: string) => void;
  updateDevicePropValue: (
    deviceId: string,
    propKey: string,
    newValue: string
  ) => void;
}

export const useProjectStore = create<ProjectState>()(
  persist(
    (set, get) => ({
      selectedProject: null,
      selectedScenario: null,
      selectedDevice: null,
      selectedProperty: null,
      scenarios: SCENARIOS,
      folderList: [],

      setSelectedProject: (selectedProject) => set({ selectedProject }),
      setSelectedScenario: (selectedScenario) => set({ selectedScenario }),
      setSelectedDevice: (selectedDevice) => set({ selectedDevice }),
      setSelectedProperty: (selectedProperty) => set({ selectedProperty }),

      setFolderList: (folderList) => set({ folderList }),

      addFolder: (folder) =>
        set((state) => ({
          folderList: [...state.folderList, folder],
        })),

      addScenario: (projectId, scenario) =>
        set((state) => {
          const updatedFolderList = state.folderList.map((folder) => {
            if (folder.id === projectId) {
              const updatedChildren = folder.children
                ? [...folder.children, scenario]
                : [scenario];
              return { ...folder, children: updatedChildren };
            }
            return folder;
          });
          return { folderList: updatedFolderList };
        }),

      updateItemName: (id, newName, type, parentId) =>
        set((state) => {
          const updateChildren = (
            children?: ProjectInterface[]
          ): ProjectInterface[] | undefined =>
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

          return { folderList: updatedFolderList };
        }),

      deleteItem: (id, type, parentId) =>
        set((state) => {
          const deleteFromChildren = (
            items?: ProjectInterface[]
          ): ProjectInterface[] =>
            items
              ?.filter((item) => !(item.id === id && item.type === type))
              .map((item) =>
                item.children
                  ? { ...item, children: deleteFromChildren(item.children) }
                  : item
              ) || [];

          let updatedFolderList = [...state.folderList];

          if (type === "project") {
            updatedFolderList = updatedFolderList.filter(
              (item) => item.id !== id
            );
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

          return { folderList: updatedFolderList };
        }),

      updateInputValue: (pointId, newValue) => {
        const state = get();
        const projectId = state.selectedScenario?.parentId || "";
        const scenarioId = state.selectedScenario?.id || "";

        const updatedFolderList = state.folderList.map((project) => {
          if (project.id !== projectId) return project;

          const updatedChildren = project.children?.map((scenario) => {
            if (scenario.id !== scenarioId) return scenario;

            const updatedInputPoints = scenario.inputPoints?.map((input) => {
              if (input.id === pointId) {
                return { ...input, value: newValue };
              }
              return input;
            });

            return { ...scenario, inputPoints: updatedInputPoints };
          });

          return { ...project, children: updatedChildren };
        });

        set({ folderList: updatedFolderList });
      },

      updateDevicePropValue: (deviceId, propKey, newValue) => {
        const state = get();

        const updatedFolderList = state.folderList.map((project) => {
          const updatedProjectChildren = project.children?.map((scenario) => {
            const updatedScenarioChildren = scenario.children?.map((device) => {
              if (device.id !== deviceId) return device;
              const deviceTyped = device as DeviceInterface;

              const propsArray = Array.isArray(deviceTyped.props)
                ? [...deviceTyped.props]
                : [];
              const index = propsArray.findIndex(
                (prop) => prop.key === propKey
              );
              if (index !== -1) {
                propsArray[index] = {
                  ...propsArray[index],
                  value: newValue,
                };
              }

              return {
                ...device,
                props: propsArray,
              };
            });

            return {
              ...scenario,
              children: updatedScenarioChildren,
            };
          });

          return {
            ...project,
            children: updatedProjectChildren,
          };
        });

        set({ folderList: updatedFolderList });
      },
    }),
    {
      name: "project-store", // localStorage key
      partialize: (state) => ({ folderList: state.folderList }), // 원하는 항목만 저장
    }
  )
);
