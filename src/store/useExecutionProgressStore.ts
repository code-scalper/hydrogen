import { create } from "zustand";

import {
	EXECUTION_PROGRESS_STEPS,
	type ExecutionProgressStep,
} from "@/constants/executionProgress";
import type { ExecutionLogEntry } from "@/lib/executionProgress";

export type ExecutionProgressStatus = "pending" | "active" | "complete";

export interface ExecutionProgressStepState extends ExecutionProgressStep {
	status: ExecutionProgressStatus;
	completedAt?: string;
	entry?: ExecutionLogEntry;
}

interface ExecutionProgressState {
	isOpen: boolean;
	dateKey: string | null;
	steps: ExecutionProgressStepState[];
	entries: ExecutionLogEntry[];
	error: string | null;
	startedAt: number | null;
	lastUpdatedAt: number | null;
	start: (dateKey: string) => void;
	updateFromEntries: (entries: ExecutionLogEntry[]) => void;
	complete: () => void;
	fail: (message: string) => void;
	close: () => void;
	reset: () => void;
}

const withStatus = (
	steps: ExecutionProgressStep[],
	status: ExecutionProgressStatus,
): ExecutionProgressStepState[] => steps.map((step) => ({ ...step, status }));

const INITIAL_STATE: Omit<
	ExecutionProgressState,
	"start" | "updateFromEntries" | "complete" | "fail" | "close" | "reset"
> = {
	isOpen: false,
	dateKey: null,
	steps: withStatus(EXECUTION_PROGRESS_STEPS, "pending"),
	entries: [],
	error: null,
	startedAt: null,
	lastUpdatedAt: null,
};

export const useExecutionProgressStore = create<ExecutionProgressState>(
	(set, get) => ({
		...INITIAL_STATE,
		start: (dateKey) => {
			set({
				isOpen: true,
				dateKey,
				entries: [],
				error: null,
				startedAt: Date.now(),
				lastUpdatedAt: Date.now(),
				steps: withStatus(EXECUTION_PROGRESS_STEPS, "pending").map(
					(step, index) => ({
						...step,
						status: index === 0 ? "active" : "pending",
					}),
				),
			});
		},
		updateFromEntries: (entries) => {
			const prevEntries = get().entries;
			const prevLastCode = prevEntries.at(-1)?.code ?? null;
			const nextLastCode = entries.at(-1)?.code ?? null;
			if (
				prevEntries.length === entries.length &&
				prevLastCode === nextLastCode
			) {
				return;
			}

			const progressSteps = EXECUTION_PROGRESS_STEPS;
			const entriesByCode = new Map<string, ExecutionLogEntry>();
			for (const entry of entries) {
				if (!entry.code) continue;
				entriesByCode.set(entry.code, entry);
			}

			const completedIndices = progressSteps
				.map((step, index) => ({ step, index }))
				.filter(({ step }) =>
					step.code ? entriesByCode.has(step.code) : false,
				)
				.map(({ index }) => index);

			const highestComplete = completedIndices.length
				? Math.max(...completedIndices)
				: -1;

			const nextActive = highestComplete + 1;

			set({
				steps: progressSteps.map((step, index) => {
					const entry = step.code ? entriesByCode.get(step.code) : undefined;
					if (index <= highestComplete) {
						return {
							...step,
							status: "complete" as const,
							completedAt: entry?.timestamp,
							entry,
						};
					}
					if (index === nextActive) {
						return {
							...step,
							status: "active" as const,
							entry,
						};
					}
					return {
						...step,
						status: "pending" as const,
						entry,
					};
				}),
				entries,
				error: null,
				lastUpdatedAt: Date.now(),
			});
		},
		complete: () => {
			const { steps } = get();
			set({
				steps: steps.map((step) => ({ ...step, status: "complete" as const })),
				lastUpdatedAt: Date.now(),
			});
		},
		fail: (message) => {
			set({
				error: message,
				isOpen: true,
				lastUpdatedAt: Date.now(),
			});
		},
		close: () => {
			set({
				isOpen: false,
			});
		},
		reset: () => set({ ...INITIAL_STATE }),
	}),
);

export default useExecutionProgressStore;
