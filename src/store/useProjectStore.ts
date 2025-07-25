import type {
  DeviceInterface,
  ProjectInterface,
  ScenarioInterface,
} from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

import { SCENARIOS } from "@/constants";
import cloneDeep from "lodash/cloneDeep";
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
  addScenario: (projectId: string, scenario: ScenarioInterface) => void;

  updateItemName: (
    id: string,
    newName: string,
    type: "project" | "scenario" | "device" | "property" | "module",
    parentId?: string
  ) => void;

  deleteItem: (
    id: string,
    type: "project" | "scenario" | "device" | "property" | "module",
    parentId?: string
  ) => void;

  updateInputValue: (pointId: string, newValue: string) => void;
  updateDevicePropValue: (
    device: DeviceInterface,
    propKey: string,
    newValue: string
  ) => void;
  updateScenarioBaseDataValue: (key: string, newValue: string) => void;
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
          // 시나리오 전체 deep copy
          const scenarioCopy = cloneDeep(scenario);

          // scenarioCopy 내부 children 배열의 모든 device의 props를 deep copy
          scenarioCopy.children =
            scenarioCopy.children?.map((device) => ({
              ...device,
              props: cloneDeep(device.props),
            })) ?? [];

          const updatedFolderList = state.folderList.map((folder) => {
            if (folder.id === projectId) {
              const updatedChildren = folder.children
                ? [...folder.children, scenarioCopy]
                : [scenarioCopy];

              return { ...folder, children: updatedChildren };
            }
            return folder;
          });

          return { folderList: updatedFolderList };
        }),

      updateItemName: (id, newName, type, parentId) =>
        set((state) => {
          const updateChildren: any = (
            children?: (
              | ProjectInterface
              | ScenarioInterface
              | DeviceInterface
            )[]
          ) => {
            return children?.map((item) => {
              if (item.id === id && item.type === type) {
                return { ...item, name: newName };
              }

              // 재귀는 Project나 Scenario만 해야 함 (Device는 children 없음)
              if ("children" in item && Array.isArray(item.children)) {
                return {
                  ...item,
                  children: updateChildren(item.children),
                };
              }

              return item;
            });
          };

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
          const deleteFromChildren: any = (
            children?: (
              | ProjectInterface
              | ScenarioInterface
              | DeviceInterface
            )[]
          ) =>
            children
              ?.filter((item) => !(item.id === id && item.type === type))
              .map((item) =>
                "children" in item && Array.isArray(item.children)
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
                ? {
                    ...project,
                    children: deleteFromChildren(project.children),
                  }
                : {
                    ...project,
                    children: deleteFromChildren(project.children),
                  }
            );
          }

          return { folderList: updatedFolderList };
        }),

      updateInputValue: (pointId, newValue) => {
        console.log(pointId, newValue);
        const state = get();
        const projectId = state.selectedScenario?.parentId || "";
        const scenarioId = state.selectedScenario?.id || "";

        const updatedFolderList = state.folderList.map((project) => {
          if (project.id !== projectId) return project;

          const updatedChildren = project.children?.map((scenario) => {
            if (scenario.id !== scenarioId) return scenario;

            // const updatedInputPoints = scenario.inputPoints?.map((input) => {
            //   if (input.id === pointId) {
            //     return { ...input, value: newValue };
            //   }
            //   return input;
            // });

            return {
              ...scenario,
              inputPoints: {},
            };
          });

          return {
            ...project,
            children: updatedChildren,
          };
        });

        set({ folderList: updatedFolderList });
      },

      updateDevicePropValue: (device, propKey, newValue) => {
        const state = get();

        const updatedFolderList = state.folderList.map((project) => {
          if (project.id !== device.projectId || !project.children)
            return project;

          const updatedProjectChildren = project.children?.map((scenario) => {
            if (scenario.id !== device.scenarioId) return scenario;

            const updatedScenarioChildren = scenario.children?.map((device) => {
              if (
                device.id !== device.id ||
                device.projectId !== device.projectId ||
                device.scenarioId !== device.scenarioId
              ) {
                return device;
              }

              const propsArray = Array.isArray(device.props)
                ? [...device.props]
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

      updateScenarioBaseDataValue: (key: string, newValue: string) => {
        const state = get();
        const scenarioId = state.selectedScenario?.id;
        const parentId = state.selectedScenario?.parentId;

        if (!scenarioId || !parentId) return;

        const updatedFolderList = state.folderList.map((project) => {
          if (project.id !== parentId) return project;

          const updatedChildren = project.children?.map((scenario) => {
            if (scenario.id !== scenarioId) return scenario;

            const updatedBaseData = scenario.baseData?.map((item) =>
              item.key === key ? { ...item, value: newValue } : item
            );

            return {
              ...scenario,
              baseData: updatedBaseData,
            };
          });

          return { ...project, children: updatedChildren };
        });

        set({ folderList: updatedFolderList });
      },
    }),
    {
      name: "project-store", // localStorage key
      version: 14, // 기존보다 높은 버전 번호로 변경
      // partialize: (state) => ({
      //   folderList: state.folderList,
      //   scenarios: state.scenarios,
      // }),
    }
  )
);
