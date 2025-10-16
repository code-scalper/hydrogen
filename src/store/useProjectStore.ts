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

type ProjectTreeNode = ProjectInterface | ScenarioInterface | DeviceInterface;
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
		parentId?: string,
	) => void;

	deleteItem: (
		id: string,
		type: "project" | "scenario" | "device" | "property" | "module" | "input",
		parentId?: string,
	) => void;

	updateInputValue: (pointId: string, newValue: string) => void;
	updateDevicePropValue: (
		device: DeviceInterface,
		propKey: string,
		newValue: string,
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
					const renameDevices = (
						devices?: DeviceInterface[],
					): DeviceInterface[] | undefined => {
						if (!devices) return devices;
						let mutated = false;
						const nextDevices = devices.map((device) => {
							let current = device;
							if (
								(type === "device" || type === "module") &&
								device.id === id
							) {
								current = { ...device, name: newName };
								mutated = true;
							}

							if (device.children) {
								const updatedChildren = renameDevices(device.children);
								if (updatedChildren !== device.children) {
									current = { ...current, children: updatedChildren };
									mutated = true;
								}
							}

							return current;
						});

						return mutated ? nextDevices : devices;
					};

					const renameScenarios = (
						scenarios?: ScenarioInterface[],
					): ScenarioInterface[] | undefined => {
						if (!scenarios) return scenarios;
						let mutated = false;
						const nextScenarios = scenarios.map((scenario) => {
							let current = scenario;
							if (type === "scenario" && scenario.id === id) {
								current = { ...scenario, name: newName };
								mutated = true;
							}

							const updatedDevices = renameDevices(scenario.children);
							if (updatedDevices !== scenario.children) {
								current = { ...current, children: updatedDevices };
								mutated = true;
							}

							return current;
						});

						return mutated ? nextScenarios : scenarios;
					};

					const shouldProcessProject = (projectId: string) =>
						parentId ? projectId === parentId : true;

					const updatedFolderList = state.folderList.map((project) => {
						if (type === "project" && project.id === id) {
							return { ...project, name: newName };
						}

						if (type === "scenario" || type === "device" || type === "module") {
							if (!shouldProcessProject(project.id)) {
								return project;
							}

							const updatedChildren = renameScenarios(project.children);
							if (updatedChildren !== project.children) {
								return { ...project, children: updatedChildren };
							}
						}

						return project;
					});

					return { folderList: updatedFolderList };
				}),
			deleteItem: (id, type, parentId) =>
				set((state) => {
					const removeDevices = (
						devices?: DeviceInterface[],
					): DeviceInterface[] | undefined => {
						if (!devices) return devices;
						let mutated = false;
						const nextDevices: DeviceInterface[] = [];

						for (const device of devices) {
							if (
								(type === "device" || type === "module") &&
								device.id === id
							) {
								mutated = true;
								continue;
							}

							let current = device;
							if (device.children) {
								const updatedChildren = removeDevices(device.children);
								if (updatedChildren !== device.children) {
									current = { ...current, children: updatedChildren };
									mutated = true;
								}
							}

							nextDevices.push(current);
						}

						return mutated ? nextDevices : devices;
					};

					const removeScenarios = (
						scenarios?: ScenarioInterface[],
					): ScenarioInterface[] | undefined => {
						if (!scenarios) return scenarios;
						let mutated = false;
						const nextScenarios: ScenarioInterface[] = [];

						for (const scenario of scenarios) {
							if (type === "scenario" && scenario.id === id) {
								mutated = true;
								continue;
							}

							let current = scenario;
							const updatedDevices = removeDevices(scenario.children);
							if (updatedDevices !== scenario.children) {
								current = { ...current, children: updatedDevices };
								mutated = true;
							}

							nextScenarios.push(current);
						}

						return mutated ? nextScenarios : scenarios;
					};

					let updatedFolderList = [...state.folderList];

					if (type === "project") {
						updatedFolderList = updatedFolderList.filter(
							(project) => project.id !== id,
						);
					} else {
						updatedFolderList = updatedFolderList.map((project) => {
							if (parentId && project.id !== parentId) {
								return project;
							}

							const updatedChildren = removeScenarios(project.children);
							if (updatedChildren !== project.children) {
								return { ...project, children: updatedChildren };
							}
							return project;
						});
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
					updatedProject?.children?.find(
						(scenario) => scenario.id === scenarioId,
					) ?? null;

				set({
					folderList: updatedFolderList,
					selectedScenario: updatedScenario,
				});
			},

			updateDevicePropValue: (device, propKey, newValue) => {
				const state = get();

				const updatedFolderList = state.folderList.map((project) => {
					if (project.id !== device.projectId || !project.children)
						return project;

					const updatedProjectChildren = project.children?.map((scenario) => {
						if (scenario.id !== device.scenarioId) return scenario;

						const updatedScenarioChildren = scenario.children?.map(
							(candidate) => {
								if (
									candidate.id !== device.id ||
									candidate.projectId !== device.projectId ||
									candidate.scenarioId !== device.scenarioId
								) {
									return candidate;
								}

								const propsArray = Array.isArray(candidate.props)
									? [...candidate.props]
									: [];
								const index = propsArray.findIndex(
									(prop) => prop.key === propKey,
								);

								if (index !== -1) {
									propsArray[index] = {
										...propsArray[index],
										value: newValue,
									};
								}

								return {
									...candidate,
									props: propsArray,
								};
							},
						);

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

						const normalizedPropKey =
							targetBaseData?.altName?.replace(/[()]/g, "").trim() ||
							targetBaseData?.key ||
							key;

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
					updatedProject?.children?.find(
						(scenario) => scenario.id === scenarioId,
					) ?? null;

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
		},
	),
);
