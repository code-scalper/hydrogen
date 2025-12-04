import type {
	DeviceInterface,
	DeviceProperty,
	ProjectInterface,
	ScenarioInterface,
} from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

import { SCENARIOS } from "@/constants";
import {
	DEFAULT_SCENARIO_VALUES,
	type ScenarioDefaultValue,
} from "@/constants/defaultValue";
import { SCENARIO_OPTIONS } from "@/constants/scenarioOptions";
import { generateCustomId } from "@/lib/utils";
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
	addScenario: (
		projectId: string,
		scenario: ScenarioInterface,
		optionKey?: string,
	) => void;

	updateItemName: (
		id: string,
		newName: string,
		type: "project" | "scenario" | "device" | "property" | "module" | "input",
		parentId?: string,
	) => void;
	updateProjectDetails: (
		projectId: string,
		updates: { name?: string; description?: string },
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

			addScenario: (projectId, scenario, optionKey) =>
				set((state) => {
					const scenarioTemplateId = scenario.templateId ?? scenario.id;
					const scenarioCopy = cloneDeep(scenario);
					const uniqueScenarioId = generateCustomId(
						scenarioTemplateId || "scenario",
					);

					scenarioCopy.templateId = scenarioTemplateId;
					scenarioCopy.id = uniqueScenarioId;
					scenarioCopy.parentId = projectId;
					scenarioCopy.optionKey = optionKey ?? scenario.optionKey;
					const templateOptions =
						scenarioTemplateId && scenarioTemplateId in SCENARIO_OPTIONS
							? SCENARIO_OPTIONS[
									scenarioTemplateId as keyof typeof SCENARIO_OPTIONS
								]
							: undefined;
					const optionLabel = optionKey
						? (templateOptions?.find((opt) => opt.key === optionKey)?.name ??
							optionKey)
						: undefined;
					scenarioCopy.optionLabel = optionLabel;
					scenarioCopy.isExpanded = true;

					const scenarioDefaultsRaw = (() => {
						if (!scenarioCopy.sfcName) {
							return undefined;
						}
						const scenarioKey =
							`SFC${scenarioCopy.sfcName}` as keyof typeof DEFAULT_SCENARIO_VALUES;
						if (!(scenarioKey in DEFAULT_SCENARIO_VALUES)) {
							return undefined;
						}
						const scenarioEntry = DEFAULT_SCENARIO_VALUES[scenarioKey];
						const optionKey = scenarioCopy.optionKey;
						if (
							optionKey &&
							Object.prototype.hasOwnProperty.call(scenarioEntry, optionKey)
						) {
							return scenarioEntry[optionKey as keyof typeof scenarioEntry];
						}
						return scenarioEntry.type1;
					})();

					const scenarioDefaults: ScenarioDefaultValue =
						scenarioDefaultsRaw ?? {};

					const normalizeKey = (key?: string, altName?: string) =>
						altName?.replace(/[()]/g, "").trim() || key || "";

					const getDefaultValue = (key?: string, altName?: string): string => {
						const normalized = normalizeKey(key, altName);
						if (!normalized) {
							return "0";
						}
						const raw = scenarioDefaults[normalized];
						if (raw === undefined || raw === null) {
							return "0";
						}
						if (typeof raw === "boolean") {
							return raw ? "true" : "false";
						}
						return `${raw}`;
					};

					const applyDefaultsToDevice = (
						device: DeviceInterface,
					): DeviceInterface => {
						const mappedProps = device.props?.map((prop) => ({
							...prop,
							value: getDefaultValue(prop.key, prop.name),
						}));
						const mappedOutputProps = device.outputProps?.map((prop) => ({
							...prop,
							value: getDefaultValue(prop.key, prop.name),
						}));
						const mappedChildren = device.children?.map((child) =>
							applyDefaultsToDevice(child as DeviceInterface),
						);

						return {
							...device,
							projectId,
							scenarioId: uniqueScenarioId,
							props: mappedProps ?? device.props,
							outputProps: mappedOutputProps ?? device.outputProps,
							children: mappedChildren ?? device.children,
						};
					};

					if (scenarioCopy.baseData) {
						scenarioCopy.baseData = scenarioCopy.baseData.map((item) => ({
							...item,
							value: getDefaultValue(item.key, item.altName),
						}));
					}

					scenarioCopy.children =
						scenarioCopy.children?.map((device) =>
							applyDefaultsToDevice({
								...device,
								props: cloneDeep(device.props),
								outputProps: cloneDeep(device.outputProps),
								children: device.children
									? cloneDeep(device.children)
									: undefined,
							}),
						) ?? [];

					const updatedFolderList = state.folderList.map((folder) => {
						if (folder.id !== projectId) {
							return folder;
						}

						const existingChildren = folder.children ?? [];
						const baseName = scenarioCopy.name;
						let displayName = baseName;

						if (scenarioCopy.optionKey) {
							const displayOption = existingChildren.filter(
								(child) => child.optionKey === scenarioCopy.optionKey,
							).length;

							const label = optionLabel ?? scenarioCopy.optionKey;

							displayName = `${baseName} #${label}`;

							if (displayOption > 0) {
								displayName = `${displayName}-${displayOption + 1}`;
							}
						} else {
							const conflictingNameCount = existingChildren.filter(
								(child) => child.name === baseName,
							).length;

							if (conflictingNameCount > 0) {
								displayName = `${baseName} #${conflictingNameCount + 1}`;
							}
						}

						scenarioCopy.name = displayName;

						const updatedChildren = [...existingChildren, scenarioCopy];

						return { ...folder, children: updatedChildren };
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
			updateProjectDetails: (projectId, updates) =>
				set((state) => {
					const updatedFolderList = state.folderList.map((project) =>
						project.id === projectId ? { ...project, ...updates } : project,
					);
					const selectedProject =
						state.selectedProject && state.selectedProject.id === projectId
							? { ...state.selectedProject, ...updates }
							: state.selectedProject;
					return { folderList: updatedFolderList, selectedProject };
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

				const updatedProject = updatedFolderList.find(
					(project) => project.id === device.projectId,
				);
				const updatedScenario = updatedProject?.children?.find(
					(scenario) => scenario.id === device.scenarioId,
				) as ScenarioInterface | undefined;
				const updatedDevice = updatedScenario?.children?.find(
					(candidate) => candidate.id === device.id,
				) as DeviceInterface | undefined;

				const shouldSyncScenario =
					state.selectedScenario?.id === device.scenarioId;

				set({
					folderList: updatedFolderList,
					selectedDevice:
						state.selectedDevice && state.selectedDevice.id === device.id
							? (updatedDevice ?? state.selectedDevice)
							: state.selectedDevice,
					selectedScenario: shouldSyncScenario
						? (updatedScenario ?? state.selectedScenario)
						: state.selectedScenario,
				});
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
			version: 1, // 기존보다 높은 버전 번호로 변경
			// partialize: (state) => ({
			//   folderList: state.folderList,
			//   scenarios: state.scenarios,
			// }),
		},
	),
);
