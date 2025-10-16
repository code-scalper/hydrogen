// store/useProjectStore.ts
import { create } from "zustand";

interface InteractionState {
	scenarioOpen: boolean;
	setScenarioOpen: (open: boolean) => void;
	deviceOpen: boolean;
	setDeviceOpen: (open: boolean) => void;
	adjustBasicDataOpen: boolean;
	setAdjustBasicDataOpen: (open: boolean) => void;
	psvOpen: boolean;
	setPsvOpen: (open: boolean) => void;
	invalidInputKeys: Record<string, true>;
	setInputValidity: (key: string, isValid: boolean) => void;
	clearInvalidInputs: () => void;
	skipRunExe: boolean;
	setSkipRunExe: (skip: boolean) => void;
}

export const useInteractionStore = create<InteractionState>((set) => ({
	scenarioOpen: false,
	setScenarioOpen: (open) => set({ scenarioOpen: open }),
	deviceOpen: false,
	setDeviceOpen: (open) => set({ deviceOpen: open }),
	adjustBasicDataOpen: false,
	setAdjustBasicDataOpen: (open) => set({ adjustBasicDataOpen: open }),
	psvOpen: false,
	setPsvOpen: (open) => set({ psvOpen: open }),
	invalidInputKeys: {},
	setInputValidity: (key, isValid) =>
		set((state) => {
			const next = { ...state.invalidInputKeys };

			if (isValid) {
				if (!(key in next)) {
					return state;
				}
				delete next[key];
				return { invalidInputKeys: next };
			}

			if (next[key]) {
				return state;
			}

			next[key] = true;
			return { invalidInputKeys: next };
		}),
	clearInvalidInputs: () => set({ invalidInputKeys: {} }),
	skipRunExe: false,
	setSkipRunExe: (skip) => set({ skipRunExe: skip }),
}));
