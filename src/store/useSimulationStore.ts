import { create } from "zustand";

export type SimulationFrame = {
	time: number;
	values: Record<string, string>;
};

interface SimulationState {
	frames: SimulationFrame[];
	currentIndex: number;
	currentTime: number;
	totalDuration: number;
	playing: boolean;
	currentValues: Record<string, string>;
	playbackTimer: number | null;
	setFrames: (frames: SimulationFrame[]) => void;
	playFromStart: () => void;
	resume: () => void;
	pause: () => void;
	stop: () => void;
	seekTo: (time: number) => void;
}

const useSimulationStore = create<SimulationState>((set, get) => {
	const safeClearTimeout = (timer: number | null) => {
		if (timer !== null && typeof window !== "undefined") {
			window.clearTimeout(timer);
		}
	};

	const clearTimer = () => {
		const { playbackTimer } = get();
		if (playbackTimer === null) {
			return;
		}
		safeClearTimeout(playbackTimer);
		set({ playbackTimer: null });
	};

	const commitFrame = (frame?: SimulationFrame) => {
		if (!frame) return;
		const previous = get().currentValues;
		const next: Record<string, string> = {};
		let changed = false;

		for (const [key, value] of Object.entries(frame.values ?? {})) {
			const normalized = `${value ?? ""}`;
			next[key] = normalized;
			if (!changed && previous[key] !== normalized) {
				changed = true;
			}
		}

		if (!changed) {
			const prevKeys = Object.keys(previous);
			const nextKeys = Object.keys(next);
			if (prevKeys.length !== nextKeys.length) {
				changed = true;
			}
		}

		if (!changed) {
			return;
		}

		set({ currentValues: next });
	};

	const scheduleNext = () => {
		const state = get();
		if (!state.playing) return;

		const nextIndex = state.currentIndex + 1;
		if (nextIndex >= state.frames.length) {
			clearTimer();
			const lastFrame = state.frames[state.frames.length - 1];
			set({
				playing: false,
				currentIndex: state.frames.length - 1,
				currentTime: lastFrame ? lastFrame.time : state.currentTime,
			});
			return;
		}

		const currentFrame = state.frames[state.currentIndex];
		const nextFrame = state.frames[nextIndex];
		const deltaSeconds = Math.max(0, nextFrame.time - currentFrame.time);
		const delayMs = Math.max(16, deltaSeconds * 1000);

		const timer =
			typeof window === "undefined"
				? null
				: window.setTimeout(() => {
						commitFrame(nextFrame);
						set({ currentIndex: nextIndex, currentTime: nextFrame.time });
						scheduleNext();
					}, delayMs);

		set({ playbackTimer: timer });
	};

	return {
		frames: [],
		currentIndex: 0,
		currentTime: 0,
		totalDuration: 0,
		playing: false,
		currentValues: {},
		playbackTimer: null,
		setFrames: (frames) => {
			clearTimer();

			const sanitized = Array.isArray(frames)
				? frames
						.filter((frame) => frame && Number.isFinite(frame.time))
						.map((frame) => ({
							time: frame.time,
							values: Object.fromEntries(
								Object.entries(frame.values ?? {}).map(([key, value]) => [
									key,
									`${value ?? ""}`,
								]),
							),
						}))
						.sort((a, b) => a.time - b.time)
				: [];

			const firstFrame = sanitized[0];

			set({
				frames: sanitized,
				currentIndex: firstFrame ? 0 : 0,
				currentTime: firstFrame ? firstFrame.time : 0,
				totalDuration: sanitized.at(-1)?.time ?? 0,
				playing: false,
				playbackTimer: null,
				currentValues: firstFrame ? { ...firstFrame.values } : {},
			});
		},
		playFromStart: () => {
			const { frames } = get();
			if (frames.length === 0) {
				return;
			}

			clearTimer();
			const firstFrame = frames[0];
			commitFrame(firstFrame);
			set({ playing: true, currentIndex: 0, currentTime: firstFrame.time });
			scheduleNext();
		},
		resume: () => {
			const { frames, playing, currentIndex } = get();
			if (playing || frames.length === 0) {
				return;
			}

			clearTimer();
			const clampedIndex = Math.min(
				Math.max(currentIndex, 0),
				frames.length - 1,
			);
			commitFrame(frames[clampedIndex]);
			set({
				playing: true,
				currentIndex: clampedIndex,
				currentTime: frames[clampedIndex].time,
			});
			scheduleNext();
		},
		pause: () => {
			if (!get().playing) return;
			clearTimer();
			set({ playing: false });
		},
		stop: () => {
			const { frames } = get();
			clearTimer();
			const firstFrame = frames[0];
			if (firstFrame) {
				commitFrame(firstFrame);
			} else {
				set({ currentValues: {} });
			}
			set({
				playing: false,
				currentIndex: firstFrame ? 0 : 0,
				currentTime: firstFrame ? firstFrame.time : 0,
			});
		},
		seekTo: (time) => {
			const { frames } = get();
			if (frames.length === 0) {
				return;
			}

			const lastFrame = frames[frames.length - 1];
			const clampedTime = Math.max(0, Math.min(time, lastFrame.time));

			let targetIndex = frames.findIndex((frame) => frame.time >= clampedTime);
			if (targetIndex === -1) {
				targetIndex = frames.length - 1;
			} else if (targetIndex > 0) {
				const prevFrame = frames[targetIndex - 1];
				const currentFrame = frames[targetIndex];
				if (
					Math.abs(prevFrame.time - clampedTime) <
					Math.abs(currentFrame.time - clampedTime)
				) {
					targetIndex -= 1;
				}
			}

			clearTimer();
			const targetFrame = frames[targetIndex];
			commitFrame(targetFrame);
			set({
				currentIndex: targetIndex,
				currentTime: targetFrame.time,
				playing: false,
			});
		},
	};
});

export default useSimulationStore;
