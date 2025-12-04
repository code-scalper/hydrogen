import { useProjectStore } from "@/store/useProjectStore";

import {
	DEFAULT_SCENARIO_VALUES,
	type ScenarioDefaultValue,
} from "@/constants/defaultValue";
import type {
	DeviceInterface,
	DeviceProperty,
	ProjectInterface,
	ScenarioInterface,
} from "@/types";
import { useCallback, useEffect, useMemo, useState } from "react";

import BaseToast from "../BaseToast";

// components
import BaseScrollArea from "../BaseScrollArea";
import DevicePropertyInput from "./DevicePropertyInput";
import ExtraInfoPanel from "./ExtraInfoPanel";

interface CreateDeviceModalProps {
	isOpen: boolean;
	onClose: () => void;
	onCreate: (
		projectId: string,
		scenarioId: string,
		device: DeviceInterface,
	) => void;
}

export const CreateDeviceModal = ({
	isOpen,
	onClose,
}: CreateDeviceModalProps) => {
	const folders = useProjectStore((state) => state.folderList);
	const selectedDevice = useProjectStore((state) => state.selectedDevice);
	const setSelectedDevice = useProjectStore((state) => state.setSelectedDevice);
	const updateDevicePropValue = useProjectStore(
		(state) => state.updateDevicePropValue,
	);

	// const psvOpen = useInteractionStore((state)=>state.psvOpen)
	// const setPsvOpen = useInteractionStore((state) => state.setPsvOpen);

	const [open, setOpen] = useState(false);
	const [toastMessage] = useState("");
	// const showToast = (message: string) => {
	//   setToastMessage(message);
	//   setOpen(false); // 이전 Toast 닫기
	//   setTimeout(() => setOpen(true), 10); // 새 Toast 열기 (React state refresh 대응)
	//   setTimeout(() => setOpen(false), 2000); // 새 Toast 열기 (React state refresh 대응)
	// };

	const [showExtra, setShowExtra] = useState(false);
	const [pendingProps, setPendingProps] = useState<DeviceProperty[]>([]);

	const scenarioDefaults = useMemo<ScenarioDefaultValue | undefined>(() => {
		if (!selectedDevice) {
			return undefined;
		}
		const parentProject = folders.find(
			(folder) => folder.id === selectedDevice.projectId,
		);
		const scenario = parentProject?.children?.find(
			(child) =>
				child.id === selectedDevice.scenarioId && child.type === "scenario",
		) as ScenarioInterface | undefined;
		if (!scenario || !scenario.sfcName) {
			return undefined;
		}
		const scenarioKey =
			`SFC${scenario.sfcName}` as keyof typeof DEFAULT_SCENARIO_VALUES;
		if (!(scenarioKey in DEFAULT_SCENARIO_VALUES)) {
			return undefined;
		}
		const entry = DEFAULT_SCENARIO_VALUES[scenarioKey];
		const optionKey = scenario.optionKey;
		if (optionKey && Object.prototype.hasOwnProperty.call(entry, optionKey)) {
			return entry[optionKey as keyof typeof entry];
		}
		return entry.type1;
	}, [folders, selectedDevice]);

	const hydrateProps = useCallback(
		(props?: DeviceProperty[] | null) => {
			if (!props) return [] as DeviceProperty[];
			return props.map((prop) => {
				const rawKey = prop.key ?? prop.name ?? "";
				const normalized = rawKey.replace(/[()]/g, "").trim();
				const scenarioDefault =
					normalized && scenarioDefaults
						? scenarioDefaults[normalized as keyof ScenarioDefaultValue]
						: undefined;
				const resolvedDefault = (() => {
					if (scenarioDefault === undefined || scenarioDefault === null) {
						return prop.defaultValue;
					}
					return typeof scenarioDefault === "boolean"
						? scenarioDefault
							? "true"
							: "false"
						: `${scenarioDefault}`;
				})();

				const hasMeaningfulValue = (value: unknown) => {
					if (value === undefined || value === null) return false;
					const text = `${value}`.trim();
					if (text.length === 0) return false;
					return text !== "0";
				};
				const existingValue = hasMeaningfulValue(prop.value)
					? `${prop.value}`
					: "";
				const nextValue =
					existingValue.length > 0
						? existingValue
						: (resolvedDefault ?? prop.value ?? "");

				return {
					...prop,
					value: nextValue,
					defaultValue: resolvedDefault ?? prop.defaultValue ?? nextValue,
				};
			});
		},
		[scenarioDefaults],
	);

	useEffect(() => {
		if (!selectedDevice) {
			setPendingProps([]);
			return;
		}
		setPendingProps(hydrateProps(selectedDevice.props));
	}, [hydrateProps, selectedDevice]);

	const resetPropsToDefault = useCallback(() => {
		if (!selectedDevice) return;
		const confirmed = window.confirm(
			"입력했던 모든 값이 초기화됩니다. 초기화 하시겠습니까?",
		);
		if (!confirmed) {
			return;
		}
		setPendingProps((previous) =>
			previous.map((prop) => ({
				...prop,
				value: prop.defaultValue ?? "",
			})),
		);
	}, [selectedDevice]);

	const { firstProps, secondProps, splitIndex } = useMemo(() => {
		const half = Math.ceil(pendingProps.length / 2);
		return {
			firstProps: pendingProps.slice(0, half),
			secondProps: pendingProps.slice(half),
			splitIndex: half,
		};
	}, [pendingProps]);

	const handlePendingPropChange = useCallback(
		(propIndex: number, value: string) => {
			setPendingProps((previous) => {
				if (!previous[propIndex]) {
					return previous;
				}
				const next = [...previous];
				next[propIndex] = { ...next[propIndex], value };
				return next;
			});
		},
		[],
	);

	const hasPendingChanges = useMemo(() => {
		if (!selectedDevice) {
			return false;
		}
		const originalProps = selectedDevice.props ?? [];
		if (originalProps.length !== pendingProps.length) {
			return true;
		}
		return pendingProps.some((prop, index) => {
			const original = originalProps[index];
			return `${original?.value ?? ""}` !== `${prop.value ?? ""}`;
		});
	}, [pendingProps, selectedDevice]);

	const handleApplyChanges = useCallback(() => {
		if (!selectedDevice || pendingProps.length === 0) {
			return;
		}
		if (!hasPendingChanges) {
			return;
		}
		const originalProps = selectedDevice.props ?? [];
		pendingProps.forEach((prop, index) => {
			if (!prop.key) {
				return;
			}
			const nextValue = `${prop.value ?? ""}`;
			const prevValue = `${originalProps[index]?.value ?? ""}`;
			if (nextValue === prevValue) {
				return;
			}
			updateDevicePropValue(selectedDevice, prop.key, nextValue);
		});
		setSelectedDevice({
			...selectedDevice,
			props: pendingProps.map((prop) => ({ ...prop })),
		});
	}, [
		hasPendingChanges,
		pendingProps,
		selectedDevice,
		setSelectedDevice,
		updateDevicePropValue,
	]);

	const parentProject = useMemo<ProjectInterface | null>(() => {
		const target = folders.find(
			(folder) => folder.id === selectedDevice?.projectId,
		);
		return target ?? null;
	}, [folders, selectedDevice]);

	const parentScenario = useMemo<
		ScenarioInterface | { name: string; children: DeviceInterface[] }
	>(() => {
		const target = parentProject?.children?.find(
			(scenario) => scenario.id === selectedDevice?.scenarioId,
		) as ScenarioInterface | undefined;

		return (
			target ?? {
				name: "No Item",
				children: [],
			}
		);
	}, [selectedDevice, parentProject]);

	const devices = useMemo<DeviceInterface[]>(() => {
		return (parentScenario.children as DeviceInterface[]) || [];
	}, [parentScenario]);

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-[999] text-xs text-slate-200">
			<div
				className="bg-gray-800 rounded-md shadow-lg border border-gray-800 border-r overflow-hidden flex transition-all duration-300"
				style={{ width: showExtra ? "1400px" : "1000px" }}
			>
				{/* Content */}
				<div className="flex-1 flex flex-col">
					{/* Header */}
					<div className="flex justify-between items-center p-2 bg-gray-900">
						<h2 className="text-xs text-slate-200 font-semibold">
							장치 상세보기
						</h2>
						<button
							type="button"
							onClick={onClose}
							className="text-slate-300 hover:text-black text-xs"
						>
							×
						</button>
					</div>
					<div className="p-4 flex space-x-5 flex-1">
						<div className="space-y-3">
							<p className="text-md text-slate-200 mr-3 font-bold">
								{parentScenario.name}
							</p>
							<BaseScrollArea
								items={devices}
								displayProperty="name"
								selectedId={selectedDevice?.id}
								onItemClick={(device) => {
									const hydratedProps = hydrateProps(device.props);
									setSelectedDevice({
										...device,
										props: hydratedProps,
										outputProps: hydrateProps(
											(device.outputProps as DeviceProperty[] | undefined) ??
												[],
										),
									});
									setPendingProps(hydratedProps);
								}}
							/>
						</div>
						<div className="space-y-3 flex-1">
							<div className="flex justify-between items-center">
								<p className="text-md mr-3 font-bold">변수 입력 영역</p>

								<div className="flex items-center gap-2">
									<button
										type="button"
										onClick={resetPropsToDefault}
										className="text-xs px-4 py-1 rounded bg-gray-600 text-gray-100 hover:bg-gray-500"
									>
										기본값 초기화
									</button>
									<button
										type="button"
										onClick={() => setShowExtra(!showExtra)}
										className="text-xs px-4 py-1 bg-gray-500 text-gray-200 hover:bg-gray-600"
									>
										입력 변수 범위확인 {showExtra ? "닫기" : "열기"}
									</button>
								</div>
							</div>
							{selectedDevice && (
								<div className="flex space-x-5">
									<div className="w-[350px] bg-gray-700 overflow-y-auto max-h-[400px]">
										{firstProps.map((prop, index) => (
											<DevicePropertyInput
												label={prop.name || prop.key}
												key={`${selectedDevice?.id}-${
													prop.key ?? index
												}-${index}-${selectedDevice.scenarioId}`}
												value={prop.value || ""}
												unit={prop.unit}
												type={prop.type}
												options={prop.options}
												onChange={(val) => handlePendingPropChange(index, val)}
											/>
										))}
									</div>
									<div className="w-[350px] bg-gray-700 overflow-y-auto max-h-[400px]">
										{secondProps.map((prop, index) => (
											<DevicePropertyInput
												label={prop.name || prop.key}
												key={`${selectedDevice?.id}-${prop.key ?? index}-${
													splitIndex + index
												}-${selectedDevice.scenarioId}`}
												value={prop.value || ""}
												unit={prop.unit}
												type={prop.type}
												options={prop.options}
												onChange={(val) =>
													handlePendingPropChange(splitIndex + index, val)
												}
											/>
										))}
									</div>
								</div>
							)}
						</div>
					</div>

					{/* Footer */}
					<div className="flex justify-end px-4 py-3 bg-gray-900">
						<div className="flex gap-2">
							<button
								type="button"
								onClick={onClose}
								className="text-xs px-4 py-1 bg-gray-500 text-gray-200 hover:bg-gray-600"
							>
								닫기
							</button>
							<button
								type="button"
								onClick={handleApplyChanges}
								disabled={!hasPendingChanges}
								className={`text-xs px-4 py-1 font-semibold ${
									hasPendingChanges
										? "bg-emerald-500 text-emerald-950 hover:bg-emerald-400"
										: "bg-gray-700/60 text-gray-400 cursor-not-allowed"
								}`}
							>
								적용
							</button>
							{/* <button
                onClick={onPsvClick}
                className="text-xs px-4 py-1 bg-rose-500 text-gray-200 hover:bg-gray-600"
              >
                PSV 계산
              </button> */}
						</div>
					</div>
				</div>

				{/* 추가 정보 영역 */}
				{showExtra && selectedDevice && <ExtraInfoPanel props={pendingProps} />}

				<BaseToast open={open} setOpen={setOpen} toastMessage={toastMessage} />
			</div>
			{/* <PsvModal1 onCreate={() => {}} /> */}
		</div>
	);
};

export default CreateDeviceModal;
