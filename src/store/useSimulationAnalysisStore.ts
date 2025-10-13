import { create } from "zustand";

import {
	type SimulationAnalysisSummary,
	buildSimulationAnalysis,
} from "@/lib/simulationAnalysis";
import type { SimulationFrame } from "@/store/useSimulationStore";

interface SimulationAnalysisState {
	isOpen: boolean;
	analysis: SimulationAnalysisSummary | null;
	openWithResult: (result: {
		status?: string;
		frames?: SimulationFrame[] | null;
	}) => void;
	close: () => void;
}

export const useSimulationAnalysisStore = create<SimulationAnalysisState>(
	(set) => ({
		isOpen: false,
		analysis: null,
		openWithResult: (result) => {
			const analysis = buildSimulationAnalysis(result ?? {});
			set({ analysis, isOpen: true });
		},
		close: () => set({ isOpen: false }),
	}),
);

export default useSimulationAnalysisStore;
