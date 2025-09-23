import type {
  DeviceInterface,
  DeviceProperty,
  ProjectInterface,
  ScenarioInterface,
} from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

import { SCENARIOS } from "@/constants";
import cloneDeep from "lodash/cloneDeep";
interface ProjectState {
  selectedPsvKey: string | null;
  selectedProject: ProjectInterface | null;
  selectedScenario: ScenarioInterface | null;
  selectedDevice: DeviceInterface | null;
  selectedProperty: ProjectInterface | null;
  folderList: ProjectInterface[];
  scenarios: ScenarioInterface[];
  setSelectedPsvKey: (key: string) => void;
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
    type: "project" | "scenario" | "device" | "property" | "module" | "input",
    parentId?: string
  ) => void;

  deleteItem: (
    id: string,
    type: "project" | "scenario" | "device" | "property" | "module" | "input",
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
      selectedPsvKey: null,
      selectedProject: null,
      selectedScenario: null,
      selectedDevice: null,
      selectedProperty: null,
      scenarios: SCENARIOS,
      folderList: [],

      setSelectedPsvKey: (selectedPsvKey) => set({ selectedPsvKey }),
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
        const state = get();
        const projectId = state.selectedScenario?.parentId;
        const scenarioId = state.selectedScenario?.id;

        if (!projectId || !scenarioId) return;

        const updatedFolderList = state.folderList.map((project) => {
          if (project.id !== projectId || !project.children) return project;

          const updatedScenarios = project.children.map((scenario) => {
            if (scenario.id !== scenarioId) return scenario;

            const updatedChildren = scenario.children?.map((device) => {
              let touched = false;

              const updatedProps = device.props?.map((prop) => {
                if (prop.key === pointId) {
                  touched = true;
                  return { ...prop, value: newValue };
                }
                return prop;
              });

              const updatedOutputProps = device.outputProps?.map((prop) => {
                if (prop.key === pointId) {
                  touched = true;
                  return { ...prop, value: newValue };
                }
                return prop;
              });

              if (!touched) {
                return device;
              }

              return {
                ...device,
                props: updatedProps ?? device.props,
                outputProps: updatedOutputProps ?? device.outputProps,
              };
            });

            return {
              ...scenario,
              children: updatedChildren,
            };
          });

          return {
            ...project,
            children: updatedScenarios,
          };
        });

        const updatedProject = updatedFolderList.find(
          (project) => project.id === projectId,
        );
        const updatedScenario =
          updatedProject?.children?.find((scenario) => scenario.id === scenarioId) ??
          null;

        set({ folderList: updatedFolderList, selectedScenario: updatedScenario });
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

            const targetBaseData = scenario.baseData?.find(
              (item) => item.key === key,
            );

            const normalizedPropKey = targetBaseData?.altName
              ?.replace(/[()]/g, "")
              .trim() || targetBaseData?.key || key;

            const updatedBaseData = scenario.baseData?.map((item) =>
              item.key === key ? { ...item, value: newValue } : item,
            );

            let updatedScenarioChildren = scenario.children;

            if (normalizedPropKey) {
              updatedScenarioChildren = scenario.children?.map((device) => {
                if (
                  !device ||
                  (device.id !== "Basic_Da" && device.engName !== "Basic_Da")
                ) {
                  return device;
                }

                let changed = false;

                const syncProps = (props?: DeviceProperty[]) => {
                  if (!props) return props;
                  let propsChanged = false;
                  const nextProps = props.map((prop) => {
                    if (prop.key !== normalizedPropKey) return prop;

                    const currentValue =
                      prop.value === undefined || prop.value === null
                        ? ""
                        : `${prop.value}`;

                    if (currentValue === `${newValue}`) {
                      return prop;
                    }

                    propsChanged = true;
                    return { ...prop, value: newValue };
                  });

                  if (!propsChanged) {
                    return props;
                  }

                  changed = true;
                  return nextProps;
                };

                const nextProps = syncProps(device.props);
                const nextOutputProps = syncProps(device.outputProps);

                if (!changed) {
                  return device;
                }

                return {
                  ...device,
                  props: nextProps ?? device.props,
                  outputProps: nextOutputProps ?? device.outputProps,
                };
              });
            }

            return {
              ...scenario,
              baseData: updatedBaseData,
              children: updatedScenarioChildren,
            };
          });

          return { ...project, children: updatedChildren };
        });

        const updatedProject = updatedFolderList.find(
          (project) => project.id === parentId,
        );
        const updatedScenario =
          updatedProject?.children?.find((scenario) => scenario.id === scenarioId) ??
          null;

        set({
          folderList: updatedFolderList,
          selectedScenario: updatedScenario,
        });
      },
    }),
    {
      name: "project-store", // localStorage key
      version: 25, // 기존보다 높은 버전 번호로 변경
      // partialize: (state) => ({
      //   folderList: state.folderList,
      //   scenarios: state.scenarios,
      // }),
    }
  )
);
