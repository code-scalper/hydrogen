import { create } from "zustand";

import {
	DEFAULT_WHAT_IF_DISPENSER_INPUTS,
	DEFAULT_WHAT_IF_INPUTS,
	DEFAULT_WHAT_IF_VEHICLE_INPUTS,
	type WhatIfDispenserInputs,
	type WhatIfInputs,
	type WhatIfTabId,
	type WhatIfVehicleInputs,
} from "@/constants/whatIf";
import type { WhatIfDataset, WhatIfNormalizedInputs } from "@/lib/whatIf";

interface WhatIfState {
	activeTab: WhatIfTabId;
	inputs: WhatIfInputs;
	errors: Partial<Record<keyof WhatIfInputs, string>>;
	normalized: WhatIfNormalizedInputs | null;
	dataset: WhatIfDataset | null;
	loading: boolean;
	dispenserInputs: WhatIfDispenserInputs;
	vehicleInputs: WhatIfVehicleInputs;
	setVehicleInput: (key: string, value: string) => void;
	setDispenserInput: (key: string, value: string) => void;
	setActiveTab: (tab: WhatIfTabId) => void;
	setInput: (key: keyof WhatIfInputs, value: string) => void;
	setInputs: (inputs: WhatIfInputs) => void;
	setErrors: (
		errors: Partial<Record<keyof WhatIfInputs, string>>,
		normalized?: WhatIfNormalizedInputs | null,
	) => void;
	setDataset: (dataset: WhatIfDataset | null) => void;
	setLoading: (loading: boolean) => void;
	reset: () => void;
}

export const useWhatIfStore = create<WhatIfState>((set) => ({
	activeTab: "basic",
	inputs: { ...DEFAULT_WHAT_IF_INPUTS },
	errors: {},
	normalized: null,
	dataset: null,
	loading: false,
	dispenserInputs: { ...DEFAULT_WHAT_IF_DISPENSER_INPUTS },
	vehicleInputs: { ...DEFAULT_WHAT_IF_VEHICLE_INPUTS },
	setActiveTab: (activeTab) => set({ activeTab }),
	setInput: (key, value) =>
		set((state) => ({
			inputs: { ...state.inputs, [key]: value },
			errors: { ...state.errors, [key]: undefined },
		})),
	setInputs: (inputs) => set({ inputs, errors: {} }),
	setErrors: (errors, normalized = null) => set({ errors, normalized }),
	setDataset: (dataset) => set({ dataset }),
	setLoading: (loading) => set({ loading }),
	setDispenserInput: (key, value) =>
		set((state) => ({
			dispenserInputs: { ...state.dispenserInputs, [key]: value },
		})),
	setVehicleInput: (key, value) =>
		set((state) => ({
			vehicleInputs: { ...state.vehicleInputs, [key]: value },
		})),
	reset: () =>
		set({
			activeTab: "basic",
			inputs: { ...DEFAULT_WHAT_IF_INPUTS },
			errors: {},
			normalized: null,
			dataset: null,
			loading: false,
			dispenserInputs: { ...DEFAULT_WHAT_IF_DISPENSER_INPUTS },
			vehicleInputs: { ...DEFAULT_WHAT_IF_VEHICLE_INPUTS },
		}),
}));

export default useWhatIfStore;
