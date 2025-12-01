import { useCallback, useMemo, useState } from "react";

import { useInteractionStore } from "@/store/useInteractionStore";
import useSimulationAnalysisStore from "@/store/useSimulationAnalysisStore";
import type { DeviceProperty } from "@/types";

export type SimulationFrame = {
	time: number;
	values: Record<string, string>;
};

type PsvSimulationOptions = {
	sfc: string;
	inputProps: readonly DeviceProperty[];
	outputProps: readonly DeviceProperty[];
};

type ValueMap = Record<string, string>;

const toStringValue = (value: unknown): string => {
	if (value === null || value === undefined) return "";
	if (typeof value === "number")
		return Number.isFinite(value) ? `${value}` : "";
	return `${value}`;
};

const extractKeys = (props: readonly DeviceProperty[] = []) =>
	props
		.map((prop) => prop.key)
		.filter((key): key is string => typeof key === "string" && key.length > 0);

export const usePsvSimulation = ({
	sfc,
	inputProps,
	outputProps,
}: PsvSimulationOptions) => {
	const inputKeys = useMemo(() => extractKeys(inputProps), [inputProps]);
	const outputKeys = useMemo(() => extractKeys(outputProps), [outputProps]);

	const [inputs, setInputs] = useState<ValueMap>(() => {
		const initial: ValueMap = {};
		for (const prop of inputProps) {
			if (prop.key) initial[prop.key] = toStringValue(prop.value);
		}
		return initial;
	});

	const [outputs, setOutputs] = useState<ValueMap>(() => {
		const initial: ValueMap = {};
		for (const prop of outputProps) {
			if (prop.key) initial[prop.key] = toStringValue(prop.value);
		}
		return initial;
	});

	const [frames, setFrames] = useState<SimulationFrame[]>([]);
	const [status, setStatus] = useState<string>("");
	const [running, setRunning] = useState(false);
	const [outputDate, setOutputDate] = useState<string | null>(null);
	const skipRunExe = useInteractionStore((state) => state.skipRunExe);
	const openAnalysisModal = useSimulationAnalysisStore(
		(state) => state.openWithResult,
	);

	const chartData = useMemo(() => {
		if (frames.length === 0)
			return [] as Array<{ time: number; [key: string]: number }>;

		return frames.map((frame) => {
			const entry: { time: number; [key: string]: number } = {
				time: frame.time,
			};
			for (const [key, raw] of Object.entries(frame.values)) {
				const parsed = Number.parseFloat(raw ?? "");
				if (Number.isFinite(parsed)) {
					entry[key] = parsed;
				}
			}
			return entry;
		});
	}, [frames]);

	const setInputValue = useCallback((key: string, value: string) => {
		setInputs((prev) => ({ ...prev, [key]: value }));
	}, []);

	const loadInputs = useCallback(
		(values: ValueMap) => {
			setInputs((prev) => {
				const next: ValueMap = { ...prev };
				for (const key of inputKeys) {
					if (Object.prototype.hasOwnProperty.call(values, key)) {
						next[key] = toStringValue(values[key]);
					}
				}
				return next;
			});
		},
		[inputKeys],
	);

	const runSimulation = useCallback(async () => {
		if (typeof window === "undefined" || !window.electronAPI?.runExe) {
			console.warn("runExe API is unavailable in the current environment.");
			return;
		}
		setRunning(true);
		try {
			const payloadValues: Record<string, string> = {};
			for (const key of inputKeys) {
				// 빈 문자열은 전달하지 않음
				const value = inputs[key];
				if (value !== undefined && value !== "") {
					payloadValues[key] = value;
				}
			}

			const result = await window.electronAPI.runExe({
				sfc,
				values: payloadValues,
				skipExe: skipRunExe,
			});

			setStatus(result?.status ?? "");
			setOutputDate(result?.outputDate ?? null);

			if (Array.isArray(result?.frames)) {
				const sorted = [...result.frames].sort((a, b) => a.time - b.time);
				setFrames(sorted);

				const latest = sorted.at(-1);
				if (latest) {
					setOutputs((prev) => {
						const next: ValueMap = { ...prev };
						for (const key of outputKeys) {
							const raw = latest.values[key];
							const parsed = Number.parseFloat(raw ?? "");
							next[key] = Number.isFinite(parsed)
								? parsed.toFixed(6)
								: (raw ?? "");
						}
						return next;
					});
				}
			}
			openAnalysisModal(result);
		} catch (error) {
			console.error("PSV simulation failed", error);
			setStatus("simulation failed");
			throw error;
		} finally {
		setRunning(false);
		}
	}, [inputKeys, inputs, openAnalysisModal, outputKeys, sfc, skipRunExe]);

	return {
		inputs,
		outputs,
		frames,
		chartData,
		running,
		status,
		outputDate,
		setInputValue,
		loadInputs,
		runSimulation,
	};
};

export type UsePsvSimulationReturn = ReturnType<typeof usePsvSimulation>;

export default usePsvSimulation;
