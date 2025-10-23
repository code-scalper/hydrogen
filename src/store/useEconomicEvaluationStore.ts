import { create } from "zustand";
import { persist } from "zustand/middleware";

import {
	DEFAULT_CHARGING_INFO,
	DEFAULT_CURRENCY_SETTINGS,
	DEFAULT_ESCALATION,
	DEFAULT_GENERAL_SETTINGS,
	DEFAULT_INDIRECT_COST_FACTORS,
	DEFAULT_INSTALLATION_FACTORS,
	DEFAULT_LABOR_INFO,
	DEFAULT_OPEX_COST_FACTORS,
	DEFAULT_PURCHASE_PRICE_POINTS,
	DEFAULT_SALES_PRICE_POINTS,
	EQUIPMENT_TAB_CONFIGS,
} from "@/constants/economicEvaluation";
import type {
	ChargingInfoDefaults,
	EconomicGeneralSettings,
	EquipmentFieldKey,
	EquipmentKey,
	EscalationDefaults,
	IndirectCostFactors,
	InstallationFactors,
	LaborInfoDefaults,
	OpexCostFactors,
	TimelinePoint,
} from "@/constants/economicEvaluation";
import type { CurrencyCode } from "@/constants/economicEvaluation";

const MAX_SAMPLE_COUNT = 15;
const MAX_TIMELINE_POINTS = 15;

interface EquipmentSample {
	id: string;
	x: number | null;
	usd: number | null;
}

interface EquipmentState {
	samples: EquipmentSample[];
	extra: Partial<Record<EquipmentFieldKey, number>>;
}

interface EconomicEvaluationOutputs {
	report: Record<string, number | string | null>;
	cashflow: Array<Record<string, number | string | null>>;
	coefficients: Array<Record<string, number | string | null>>;
	date: string | null;
}

interface EconomicEvaluationState {
	general: EconomicGeneralSettings;
	equipment: Record<EquipmentKey, EquipmentState>;
	installation: InstallationFactors;
	indirect: IndirectCostFactors;
	opex: OpexCostFactors;
	labor: LaborInfoDefaults;
	charging: ChargingInfoDefaults;
	salesPrice: TimelinePoint[];
	purchasePrice: TimelinePoint[];
	escalation: EscalationDefaults;
	outputs: EconomicEvaluationOutputs;
	setGeneral: (values: Partial<EconomicGeneralSettings>) => void;
	setCurrency: (
		key: keyof EconomicGeneralSettings["currencies"],
		value: CurrencyCode,
	) => void;
	setDalToWon: (value: number) => void;
	setEquipmentSample: (
		key: EquipmentKey,
		index: number,
		value: Partial<EquipmentSample>,
	) => void;
	setEquipmentExtra: (
		key: EquipmentKey,
		field: EquipmentFieldKey,
		value: number,
	) => void;
	resetEquipment: (key: EquipmentKey) => void;
	setInstallation: (values: Partial<InstallationFactors>) => void;
	setIndirect: (values: Partial<IndirectCostFactors>) => void;
	setOpex: (values: Partial<OpexCostFactors>) => void;
	setLabor: (values: Partial<LaborInfoDefaults>) => void;
	setCharging: (values: Partial<ChargingInfoDefaults>) => void;
	setSalesPoint: (index: number, value: Partial<TimelinePoint>) => void;
	setPurchasePoint: (index: number, value: Partial<TimelinePoint>) => void;
	setEscalation: (values: Partial<EscalationDefaults>) => void;
	setOutputs: (outputs: EconomicEvaluationOutputs) => void;
	resetAll: () => void;
}

const createEmptySamples = (key: EquipmentKey): EquipmentSample[] =>
	Array.from({ length: MAX_SAMPLE_COUNT }, (_, index) => ({
		id: `${key}-sample-${index + 1}`,
		x: null,
		usd: null,
	}));

const createEquipmentState = (
	config: (typeof EQUIPMENT_TAB_CONFIGS)[number],
): EquipmentState => {
	const samples = createEmptySamples(config.key);
	config.defaultSamples.forEach((sample, index) => {
		if (index >= samples.length) return;
		samples[index] = { ...samples[index], x: sample.x, usd: sample.usd };
	});
	const extra: Partial<Record<EquipmentFieldKey, number>> = {};
	if (config.extraFields) {
		for (const field of config.extraFields) {
			extra[field.key] = field.defaultValue;
		}
	}
	return { samples, extra };
};

const createTimelinePoints = (defaults: TimelinePoint[]): TimelinePoint[] => {
	const points: TimelinePoint[] = Array.from(
		{ length: MAX_TIMELINE_POINTS },
		(_, index) => ({
			id: `timeline-${index + 1}`,
			year: 0,
			value: 0,
		}),
	);
	defaults.slice(0, MAX_TIMELINE_POINTS).forEach((entry, index) => {
		points[index] = { ...points[index], ...entry };
	});
	return points;
};

const buildEquipmentState = (): Record<EquipmentKey, EquipmentState> =>
	EQUIPMENT_TAB_CONFIGS.reduce(
		(acc, config) => {
			acc[config.key] = createEquipmentState(config);
			return acc;
		},
		{} as Record<EquipmentKey, EquipmentState>,
	);

const ensureEquipmentSampleIds = (
	key: EquipmentKey,
	samples: EquipmentSample[] | undefined,
): EquipmentSample[] => {
	const base = createEmptySamples(key);
	return (samples ?? base).map((sample, index) => ({
		id: sample?.id ?? base[index]?.id ?? `${key}-sample-${index + 1}`,
		x: sample?.x ?? null,
		usd: sample?.usd ?? null,
	}));
};

const ensureTimelineIds = (
	prefix: string,
	points: TimelinePoint[] | undefined,
): TimelinePoint[] => {
	if (!points) {
		return Array.from({ length: MAX_TIMELINE_POINTS }, (_, index) => ({
			id: `${prefix}-${index + 1}`,
			year: 0,
			value: 0,
		}));
	}
	return points.map((point, index) => ({
		id: point?.id ?? `${prefix}-${index + 1}`,
		year: point?.year ?? 0,
		value: point?.value ?? 0,
	}));
};

const INITIAL_OUTPUTS: EconomicEvaluationOutputs = {
	report: {},
	cashflow: [],
	coefficients: [],
	date: null,
};

export const useEconomicEvaluationStore = create<EconomicEvaluationState>()(
	persist(
		(set, get) => ({
			general: {
				...DEFAULT_GENERAL_SETTINGS,
				currencies: { ...DEFAULT_GENERAL_SETTINGS.currencies },
			},
			equipment: buildEquipmentState(),
			installation: { ...DEFAULT_INSTALLATION_FACTORS },
			indirect: { ...DEFAULT_INDIRECT_COST_FACTORS },
			opex: { ...DEFAULT_OPEX_COST_FACTORS },
			labor: { ...DEFAULT_LABOR_INFO },
			charging: { ...DEFAULT_CHARGING_INFO },
			salesPrice: createTimelinePoints(DEFAULT_SALES_PRICE_POINTS),
			purchasePrice: createTimelinePoints(DEFAULT_PURCHASE_PRICE_POINTS),
			escalation: { ...DEFAULT_ESCALATION },
			outputs: { ...INITIAL_OUTPUTS },
			setGeneral: (values) => {
				set((state) => ({
					general: {
						...state.general,
						...values,
						currencies: {
							...state.general.currencies,
							...(values.currencies ?? {}),
						},
					},
				}));
			},
			setCurrency: (key, value) => {
				set((state) => ({
					general: {
						...state.general,
						currencies: {
							...state.general.currencies,
							[key]: value,
						},
					},
				}));
			},
			setDalToWon: (value) => {
				set((state) => ({
					general: {
						...state.general,
						dalToWon: value,
					},
				}));
			},
			setEquipmentSample: (key, index, value) => {
				set((state) => {
					const target = state.equipment[key];
					if (!target) {
						return {};
					}
					const samples = target.samples.map((sample, sampleIndex) => {
						if (sampleIndex !== index) {
							return sample;
						}
						return {
							id: sample.id,
							x: value.x ?? sample.x ?? null,
							usd: value.usd ?? sample.usd ?? null,
						};
					});
					return {
						equipment: {
							...state.equipment,
							[key]: {
								samples,
								extra: target.extra,
							},
						},
					};
				});
			},
			setEquipmentExtra: (key, field, value) => {
				set((state) => {
					const target = state.equipment[key];
					if (!target) {
						return {};
					}
					return {
						equipment: {
							...state.equipment,
							[key]: {
								samples: target.samples,
								extra: {
									...target.extra,
									[field]: value,
								},
							},
						},
					};
				});
			},
			resetEquipment: (key) => {
				set((state) => {
					const config = EQUIPMENT_TAB_CONFIGS.find((item) => item.key === key);
					if (!config) {
						return {};
					}
					return {
						equipment: {
							...state.equipment,
							[key]: createEquipmentState(config),
						},
					};
				});
			},
			setInstallation: (values) => {
				set((state) => ({
					installation: {
						...state.installation,
						...values,
					},
				}));
			},
			setIndirect: (values) => {
				set((state) => ({
					indirect: {
						...state.indirect,
						...values,
					},
				}));
			},
			setOpex: (values) => {
				set((state) => ({
					opex: {
						...state.opex,
						...values,
					},
				}));
			},
			setLabor: (values) => {
				set((state) => ({
					labor: {
						...state.labor,
						...values,
					},
				}));
			},
			setCharging: (values) => {
				set((state) => ({
					charging: {
						...state.charging,
						...values,
					},
				}));
			},
			setSalesPoint: (index, value) => {
				set((state) => {
					if (index < 0 || index >= state.salesPrice.length) {
						return {};
					}
					const next = state.salesPrice.map((point, idx) =>
						idx === index
							? {
									...point,
									...value,
								}
							: point,
					);
					return { salesPrice: next };
				});
			},
			setPurchasePoint: (index, value) => {
				set((state) => {
					if (index < 0 || index >= state.purchasePrice.length) {
						return {};
					}
					const next = state.purchasePrice.map((point, idx) =>
						idx === index
							? {
									...point,
									...value,
								}
							: point,
					);
					return { purchasePrice: next };
				});
			},
			setEscalation: (values) => {
				set((state) => ({
					escalation: {
						...state.escalation,
						...values,
					},
				}));
			},
			setOutputs: (outputs) => {
				set({ outputs });
			},
			resetAll: () => {
				set({
					general: {
						...DEFAULT_GENERAL_SETTINGS,
						currencies: { ...DEFAULT_CURRENCY_SETTINGS },
					},
					equipment: EQUIPMENT_TAB_CONFIGS.reduce(
						(acc, config) => {
							acc[config.key] = createEquipmentState(config);
							return acc;
						},
						{} as Record<EquipmentKey, EquipmentState>,
					),
					installation: { ...DEFAULT_INSTALLATION_FACTORS },
					indirect: { ...DEFAULT_INDIRECT_COST_FACTORS },
					opex: { ...DEFAULT_OPEX_COST_FACTORS },
					labor: { ...DEFAULT_LABOR_INFO },
					charging: { ...DEFAULT_CHARGING_INFO },
					salesPrice: createTimelinePoints(DEFAULT_SALES_PRICE_POINTS),
					purchasePrice: createTimelinePoints(DEFAULT_PURCHASE_PRICE_POINTS),
					escalation: { ...DEFAULT_ESCALATION },
					outputs: { ...INITIAL_OUTPUTS },
				});
			},
		}),
		{
			name: "economic-evaluation-store",
			version: 2,
			migrate: (persistedState, version) => {
				if (!persistedState || version >= 2) {
					return persistedState;
				}
				const draft = persistedState as Partial<EconomicEvaluationState>;
				const equipment = { ...draft.equipment } as Record<
					EquipmentKey,
					EquipmentState
				>;
				for (const config of EQUIPMENT_TAB_CONFIGS) {
					const current = equipment?.[config.key];
					if (current) {
						equipment[config.key] = {
							samples: ensureEquipmentSampleIds(config.key, current.samples),
							extra: current.extra,
						};
					} else {
						equipment[config.key] = createEquipmentState(config);
					}
				}
				return {
					...draft,
					equipment,
					salesPrice: ensureTimelineIds("sales", draft.salesPrice),
					purchasePrice: ensureTimelineIds("purchase", draft.purchasePrice),
				};
			},
		},
	),
);

export default useEconomicEvaluationStore;
