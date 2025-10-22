export type WhatIfComboOption = {
	value: string;
	label: string;
};

export type WhatIfFieldType = "number" | "select";

export interface WhatIfFieldDefinition {
	key: keyof WhatIfInputs;
	label: string;
	unit?: string;
	type: WhatIfFieldType;
	min?: number;
	max?: number;
	defaultValue: string;
	description?: string;
	options?: WhatIfComboOption[];
}

export interface WhatIfInputs {
	N_InSelec: string;
	N_OutSelec: string;
	T_AmbC_Min: string;
	T_AmbC_Max: string;
	T_BaC_Min: string;
	T_BaC_Max: string;
	P_Tk0C_Min: string;
	P_Tk0C_Max: string;
	MaxIter: string;
}

export const WHAT_IF_TABS = [
	{ id: "basic", label: "What-if 기본정보" },
	{ id: "dispenser1", label: "수소충전기 1" },
	{ id: "vehicle1", label: "수소자동차 용기 1" },
] as const;

export type WhatIfTabId = (typeof WHAT_IF_TABS)[number]["id"];

export const WHAT_IF_BASIC_FIELDS: WhatIfFieldDefinition[] = [
	{
		key: "N_InSelec",
		label: "입력 조합 선택",
		type: "select",
		defaultValue: "1",
		options: [
			{ value: "1", label: "(1) T_AmbC + T_BaC" },
			{ value: "2", label: "(2) T_AmbC + P_Tk0C" },
			{ value: "3", label: "(3) T_BaC + P_Tk0C" },
		],
		description: "그래프의 X/Y 축을 결정하는 입력 조합을 선택합니다.",
	},
	{
		key: "N_OutSelec",
		label: "출력 선택",
		type: "select",
		defaultValue: "1",
		options: [
			{ value: "1", label: "(1) T_TkMax" },
			{ value: "2", label: "(2) t_Elep" },
		],
		description: "그래프의 Z 축에 표시할 출력을 선택합니다.",
	},
	{
		key: "T_AmbC_Min",
		label: "외기온도 최소값",
		unit: "℃",
		type: "number",
		min: -40,
		max: 50,
		defaultValue: "-40",
		description: "시뮬레이션에 사용할 외기온도의 하한값입니다.",
	},
	{
		key: "T_AmbC_Max",
		label: "외기온도 최대값",
		unit: "℃",
		type: "number",
		min: -40,
		max: 50,
		defaultValue: "50",
		description: "시뮬레이션에 사용할 외기온도의 상한값입니다.",
	},
	{
		key: "T_BaC_Min",
		label: "Bank 온도 최소값",
		unit: "℃",
		type: "number",
		min: -40,
		max: -17.5,
		defaultValue: "-40",
		description: "뱅크 온도의 하한값입니다.",
	},
	{
		key: "T_BaC_Max",
		label: "Bank 온도 최대값",
		unit: "℃",
		type: "number",
		min: -40,
		max: -17.5,
		defaultValue: "-17.5",
		description: "뱅크 온도의 상한값입니다.",
	},
	{
		key: "P_Tk0C_Min",
		label: "Tank 초기 압력 최소값",
		unit: "MPa",
		type: "number",
		min: 0.5,
		max: 70,
		defaultValue: "0.5",
		description: "탱크 초기 압력의 하한값입니다.",
	},
	{
		key: "P_Tk0C_Max",
		label: "Tank 초기 압력 최대값",
		unit: "MPa",
		type: "number",
		min: 0.5,
		max: 70,
		defaultValue: "20",
		description: "탱크 초기 압력의 상한값입니다.",
	},
	{
		key: "MaxIter",
		label: "반복 계산 횟수",
		type: "number",
		min: 1,
		max: 2,
		defaultValue: "2",
		description: "계산 반복 횟수입니다.",
	},
];

export const DEFAULT_WHAT_IF_INPUTS: WhatIfInputs = (() => {
	const result = {} as WhatIfInputs;
	for (const field of WHAT_IF_BASIC_FIELDS) {
		result[field.key] = field.defaultValue;
	}
	return result;
})();

export const WHAT_IF_AXIS_MAP = {
	in: {
		"1": {
			x: { key: "T_Amb", label: "외기 온도 (℃)" },
			y: { key: "T_Ba1", label: "Bank 온도 (℃)" },
		},
		"2": {
			x: { key: "T_Amb", label: "외기 온도 (℃)" },
			y: { key: "P_Tk_01", label: "탱크 초기 압력 (MPa)" },
		},
		"3": {
			x: { key: "T_Ba1", label: "Bank 온도 (℃)" },
			y: { key: "P_Tk_01", label: "탱크 초기 압력 (MPa)" },
		},
	},
	out: {
		"1": { key: "T_TkMax1", label: "탱크 최대 온도 (℃)" },
		"2": { key: "t_ElepS1", label: "전기 에너지 소비 시간 (s)" },
	},
} as const;

export type WhatIfInputKey = keyof WhatIfInputs;
export type WhatIfAxisKey =
	(typeof WHAT_IF_AXIS_MAP.in)[keyof typeof WHAT_IF_AXIS_MAP.in][
		| "x"
		| "y"]["key"];
