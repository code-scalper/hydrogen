import { create } from "zustand";

import type { SimulationFrame } from "./useSimulationStore";

interface SimulationOutputState {
	frames: SimulationFrame[];
	sourceDate: string | null;
	loading: boolean;
	error: string | null;
	setOutput: (
		frames: SimulationFrame[],
		metadata?: { sourceDate?: string | null },
	) => void;
	clear: () => void;
	refreshLatest: () => Promise<void>;
	refreshForDate: (date: string) => Promise<void>;
}

const MIN_TIME_STEP_SECONDS = 1;

const downsampleFrames = (
	frames: SimulationFrame[],
	minStepSeconds: number,
): SimulationFrame[] => {
	if (frames.length <= 2) {
		return frames;
	}

	const result: SimulationFrame[] = [];
	let lastAcceptedTime = Number.NEGATIVE_INFINITY;

	frames.forEach((frame, index) => {
		const time = frame.time;
		const isFirst = index === 0;
		const isLast = index === frames.length - 1;

		if (isFirst) {
			result.push(frame);
			lastAcceptedTime = time;
			return;
		}

		if (isLast) {
			if (result.at(-1)?.time !== time) {
				result.push(frame);
			}
			return;
		}

		if (time - lastAcceptedTime >= minStepSeconds) {
			result.push(frame);
			lastAcceptedTime = time;
		}
	});

	return result;
};

const sanitizeFrames = (frames: SimulationFrame[]): SimulationFrame[] => {
	const sorted = frames
		.filter(
			(frame) =>
				frame &&
				Number.isFinite(frame.time) &&
				typeof frame.values === "object",
		)
		.map((frame) => ({
			time: frame.time,
			values: Object.fromEntries(
				Object.entries(frame.values ?? {}).map(([key, value]) => [
					key,
					`${value ?? ""}`,
				]),
			),
		}))
		.sort((a, b) => a.time - b.time);

	return downsampleFrames(sorted, MIN_TIME_STEP_SECONDS);
};

const readOutputData = async (date?: string) => {
	if (typeof window === "undefined") {
		return { frames: [] as SimulationFrame[], date: null as string | null };
	}

	const api = window.electronAPI as {
		readOutputData?: (payload?: { date?: string }) => Promise<{
			frames: SimulationFrame[];
			date: string | null;
		}>;
	};

	if (typeof api?.readOutputData !== "function") {
		return { frames: [] as SimulationFrame[], date: null as string | null };
	}

	const payload = date ? { date } : undefined;
	const response = await api.readOutputData(payload);

	return {
		frames: Array.isArray(response?.frames) ? response.frames : [],
		date: response?.date ?? null,
	};
};

export const useSimulationOutputStore = create<SimulationOutputState>(
	(set) => ({
		frames: [],
		sourceDate: null,
		loading: false,
		error: null,
		setOutput: (frames, metadata) => {
			set({
				frames: sanitizeFrames(frames),
				sourceDate: metadata?.sourceDate ?? null,
				error: null,
			});
		},
		clear: () => set({ frames: [], sourceDate: null, error: null }),
		refreshLatest: async () => {
			set({ loading: true, error: null });
			try {
				const { frames, date } = await readOutputData();
				set({
					frames: sanitizeFrames(frames),
					sourceDate: date,
				});
			} catch (error) {
				console.error("최근 출력 데이터 로드 실패", error);
				set({
					error:
						error instanceof Error
							? error.message
							: "데이터를 불러오지 못했습니다.",
					frames: [],
					sourceDate: null,
				});
			} finally {
				set({ loading: false });
			}
		},
		refreshForDate: async (date) => {
			set({ loading: true, error: null });
			try {
				const { frames, date: resolvedDate } = await readOutputData(date);
				set({
					frames: sanitizeFrames(frames),
					sourceDate: resolvedDate ?? date,
				});
			} catch (error) {
				console.error("지정 날짜 출력 데이터 로드 실패", { date }, error);
				set({
					error:
						error instanceof Error
							? error.message
							: "데이터를 불러오지 못했습니다.",
					frames: [],
					sourceDate: null,
				});
			} finally {
				set({ loading: false });
			}
		},
	}),
);

export default useSimulationOutputStore;
