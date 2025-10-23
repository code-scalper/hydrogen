export const DEFAULT_DAL_TO_WON = 1450;

export type CurrencyCode = "USD" | "KRW";

export interface CurrencyOption {
	value: CurrencyCode;
	label: string;
	symbol: string;
}

export const CURRENCY_OPTIONS: CurrencyOption[] = [
	{ value: "USD", label: "미국 달러", symbol: "$" },
	{ value: "KRW", label: "대한민국 원", symbol: "₩" },
];

export interface EconomicCurrencySettings {
	elec: CurrencyCode;
	lqTk: CurrencyCode;
	lqPp: CurrencyCode;
	vap: CurrencyCode;
	cp: CurrencyCode;
	lbk: CurrencyCode;
	hbk: CurrencyCode;
	disp: CurrencyCode;
	yrPrice: CurrencyCode;
	yrPurch: CurrencyCode;
}

export const DEFAULT_CURRENCY_SETTINGS: EconomicCurrencySettings = {
	elec: "USD",
	lqTk: "USD",
	lqPp: "USD",
	vap: "USD",
	cp: "KRW",
	lbk: "KRW",
	hbk: "KRW",
	disp: "KRW",
	yrPrice: "KRW",
	yrPurch: "KRW",
};

export interface EconomicGeneralSettings {
	enabled: boolean;
	graphEnabled: boolean;
	dalToWon: number;
	currencies: EconomicCurrencySettings;
}

export const DEFAULT_GENERAL_SETTINGS: EconomicGeneralSettings = {
	enabled: true,
	graphEnabled: true,
	dalToWon: DEFAULT_DAL_TO_WON,
	currencies: DEFAULT_CURRENCY_SETTINGS,
};

export type EquipmentKey =
	| "elec"
	| "lqTk"
	| "lqPp"
	| "vap"
	| "cp"
	| "lbk"
	| "hbk"
	| "disp";

export type EquipmentFieldKey =
	| "Cont_Po"
	| "Basic_ChR"
	| "Use_ChR"
	| "FuHrPerDay"
	| "FuDayPerYr";

export interface EquipmentExtraFieldConfig {
	key: EquipmentFieldKey;
	label: string;
	unit: string;
	defaultValue: number;
	min?: number;
	max?: number;
}

export interface CurrencyDisplayUnit {
	unit: string;
	/** Number that display value is divided by compared to base currency value */
	scale: number;
}

export interface EquipmentTabConfig {
	key: EquipmentKey;
	title: string;
	xLabel: string;
	xUnit: string;
	yLabel: string;
	yDescription?: string;
	currencyKey: keyof EconomicCurrencySettings;
	usdUnit: CurrencyDisplayUnit;
	krwUnit: CurrencyDisplayUnit;
	defaultSamples: Array<{ x: number; usd: number }>;
	extraFields?: EquipmentExtraFieldConfig[];
}

const USD = (value: number) => value;
const USD_FROM_THOUSAND = (value: number) => value * 1_000;
const USD_FROM_BAEKMAN_WON = (value: number) =>
	(value * 1_000_000) / DEFAULT_DAL_TO_WON;

export const EQUIPMENT_TAB_CONFIGS: EquipmentTabConfig[] = [
	{
		key: "elec",
		title: "급전 설비 비용",
		xLabel: "전력 용량",
		xUnit: "bhp",
		yLabel: "설비비",
		yDescription: "전력 설비 선행 투자 비용",
		currencyKey: "elec",
		usdUnit: { unit: "달러", scale: 1 },
		krwUnit: { unit: "백만원", scale: 1_000_000 },
		defaultSamples: [
			{ x: 15, usd: USD(21_000) },
			{ x: 205, usd: USD(29_500) },
			{ x: 800, usd: USD(54_500) },
		],
		extraFields: [
			{
				key: "Cont_Po",
				label: "계약 전력량",
				unit: "kW",
				defaultValue: 500,
				min: 0,
			},
			{
				key: "Basic_ChR",
				label: "기본 요금 단가",
				unit: "원/kW",
				defaultValue: 7_000,
				min: 0,
			},
			{
				key: "Use_ChR",
				label: "사용 요금 단가",
				unit: "원/kW",
				defaultValue: 100,
				min: 0,
			},
			{
				key: "FuHrPerDay",
				label: "1일 운전시간",
				unit: "hr",
				defaultValue: 16,
				min: 0,
			},
			{
				key: "FuDayPerYr",
				label: "연간 운전일수",
				unit: "day",
				defaultValue: 365,
				min: 0,
				max: 365,
			},
		],
	},
	{
		key: "lqTk",
		title: "액화수소 탱크 비용",
		xLabel: "탱크 용량",
		xUnit: "m³",
		yLabel: "설비비",
		currencyKey: "lqTk",
		usdUnit: { unit: "달러", scale: 1 },
		krwUnit: { unit: "백만원", scale: 1_000_000 },
		defaultSamples: [
			{ x: 20, usd: USD(85_000) },
			{ x: 30, usd: USD(95_000) },
			{ x: 50, usd: USD(120_000) },
		],
	},
	{
		key: "lqPp",
		title: "액화수소 펌프 비용",
		xLabel: "펌프 유량",
		xUnit: "kg/h",
		yLabel: "설비비",
		currencyKey: "lqPp",
		usdUnit: { unit: "천달러", scale: 1_000 },
		krwUnit: { unit: "백만원", scale: 1_000_000 },
		defaultSamples: [
			{ x: 100, usd: USD_FROM_THOUSAND(68.28) },
			{ x: 200, usd: USD_FROM_THOUSAND(124.99) },
		],
	},
	{
		key: "vap",
		title: "액화수소 기화기 비용",
		xLabel: "기화기 유량",
		xUnit: "kg/h",
		yLabel: "설비비",
		currencyKey: "vap",
		usdUnit: { unit: "천달러", scale: 1_000 },
		krwUnit: { unit: "백만원", scale: 1_000_000 },
		defaultSamples: [
			{ x: 100, usd: USD_FROM_THOUSAND(92.48) },
			{ x: 200, usd: USD_FROM_THOUSAND(182.57) },
		],
	},
	{
		key: "cp",
		title: "압축기 비용",
		xLabel: "압축기 유량",
		xUnit: "kg/h",
		yLabel: "설비비",
		currencyKey: "cp",
		usdUnit: { unit: "천달러", scale: 1_000 },
		krwUnit: { unit: "백만원", scale: 1_000_000 },
		defaultSamples: [
			{ x: 40, usd: USD_FROM_BAEKMAN_WON(670) },
			{ x: 30.5, usd: USD_FROM_BAEKMAN_WON(500) },
			{ x: 208.5, usd: USD_FROM_BAEKMAN_WON(1_865.5) },
			{ x: 118.2, usd: USD_FROM_BAEKMAN_WON(670) },
			{ x: 126.5, usd: USD_FROM_BAEKMAN_WON(670) },
			{ x: 132.3, usd: USD_FROM_BAEKMAN_WON(1_200) },
		],
	},
	{
		key: "lbk",
		title: "저압 뱅크 및 버퍼 비용",
		xLabel: "용량",
		xUnit: "kg",
		yLabel: "설비비",
		currencyKey: "lbk",
		usdUnit: { unit: "천달러", scale: 1_000 },
		krwUnit: { unit: "백만원", scale: 1_000_000 },
		defaultSamples: [
			{ x: 93, usd: USD_FROM_BAEKMAN_WON(160) },
			{ x: 178, usd: USD_FROM_BAEKMAN_WON(150) },
			{ x: 239, usd: USD_FROM_BAEKMAN_WON(160) },
			{ x: 442, usd: USD_FROM_BAEKMAN_WON(313) },
			{ x: 93, usd: USD_FROM_BAEKMAN_WON(150) },
			{ x: 172, usd: USD_FROM_BAEKMAN_WON(240) },
			{ x: 173, usd: USD_FROM_BAEKMAN_WON(240) },
		],
	},
	{
		key: "hbk",
		title: "고압 뱅크 비용",
		xLabel: "용량",
		xUnit: "kg",
		yLabel: "설비비",
		currencyKey: "hbk",
		usdUnit: { unit: "천달러", scale: 1_000 },
		krwUnit: { unit: "백만원", scale: 1_000_000 },
		defaultSamples: [
			{ x: 91, usd: USD_FROM_BAEKMAN_WON(236) },
			{ x: 124, usd: USD_FROM_BAEKMAN_WON(244) },
			{ x: 132, usd: USD_FROM_BAEKMAN_WON(244) },
			{ x: 140, usd: USD_FROM_BAEKMAN_WON(244) },
		],
	},
	{
		key: "disp",
		title: "수소충전기 비용",
		xLabel: "충전기 수량",
		xUnit: "ea",
		yLabel: "설비비",
		currencyKey: "disp",
		usdUnit: { unit: "천달러", scale: 1_000 },
		krwUnit: { unit: "백만원", scale: 1_000_000 },
		defaultSamples: [
			{ x: 1, usd: USD_FROM_BAEKMAN_WON(295) },
			{ x: 2, usd: USD_FROM_BAEKMAN_WON(520) },
			{ x: 3, usd: USD_FROM_BAEKMAN_WON(735) },
			{ x: 4, usd: USD_FROM_BAEKMAN_WON(940) },
		],
	},
];
export interface InstallationFactors {
	F_Inst_Comp: number;
	F_Inst_Bank: number;
	F_Inst_Disp: number;
	F_Inst_LqTk: number;
	F_Inst_LqPp: number;
	F_Inst_LqVap: number;
	F_Inst_Elec: number;
}

export const DEFAULT_INSTALLATION_FACTORS: InstallationFactors = {
	F_Inst_Comp: 1.2,
	F_Inst_Bank: 1.3,
	F_Inst_Disp: 1.2,
	F_Inst_LqTk: 1.2,
	F_Inst_LqPp: 1.2,
	F_Inst_LqVap: 1.2,
	F_Inst_Elec: 2.24,
};

export interface IndirectCostFactors {
	F_Indi_SitePrep: number;
	F_Indi_DesignEng: number;
	F_Indi_Contingency: number;
	F_Indi_Permit: number;
	F_Indi_Licens: number;
}

export const DEFAULT_INDIRECT_COST_FACTORS: IndirectCostFactors = {
	F_Indi_SitePrep: 0.05,
	F_Indi_DesignEng: 0.1,
	F_Indi_Contingency: 0.05,
	F_Indi_Permit: 0.03,
	F_Indi_Licens: 0,
};

export interface OpexCostFactors {
	F_Opex_Insurance: number;
	F_Opex_PropertyTax: number;
	F_Opex_LicenPermit: number;
	F_Opex_OpexComp: number;
	F_Opex_OpexBk: number;
	F_Opex_OpexDisp: number;
}

export const DEFAULT_OPEX_COST_FACTORS: OpexCostFactors = {
	F_Opex_Insurance: 0.01,
	F_Opex_PropertyTax: 0.0075,
	F_Opex_LicenPermit: 0.001,
	F_Opex_OpexComp: 0.04,
	F_Opex_OpexBk: 0.01,
	F_Opex_OpexDisp: 0.03,
};

export interface LaborInfoDefaults {
	MinPer1Fu: number;
	WorkHrPerDay: number;
	WagePerHr: number;
	R_OverhGnA: number;
}

export const DEFAULT_LABOR_INFO: LaborInfoDefaults = {
	MinPer1Fu: 10,
	WorkHrPerDay: 8,
	WagePerHr: 25_000,
	R_OverhGnA: 0.2,
};

export interface ChargingInfoDefaults {
	N_FuHDV_0: number;
	N_FuLDV_0: number;
	M_1FuHDV: number;
	M_2FuLDV: number;
	R_GrowHDV: number;
	R_GrowLDV: number;
	R_H2Loss: number;
	t_BrkLDV: number;
	t_BrkHDV: number;
	t_FuLDV: number;
	t_FuHDV: number;
}

export const DEFAULT_CHARGING_INFO: ChargingInfoDefaults = {
	N_FuHDV_0: 4,
	N_FuLDV_0: 20,
	M_1FuHDV: 25,
	M_2FuLDV: 5,
	R_GrowHDV: 0.2,
	R_GrowLDV: 0.15,
	R_H2Loss: 0.039,
	t_BrkLDV: 3,
	t_BrkHDV: 5,
	t_FuLDV: 3.5,
	t_FuHDV: 12.3,
};

export interface TimelinePoint {
	id: string;
	year: number;
	value: number;
}

export const DEFAULT_SALES_PRICE_POINTS: TimelinePoint[] = [
	{ id: "sales-1", year: 2031, value: 8_800 },
	{ id: "sales-2", year: 2041, value: 8_500 },
	{ id: "sales-3", year: 2051, value: 8_200 },
];

export const DEFAULT_PURCHASE_PRICE_POINTS: TimelinePoint[] = [
	{ id: "purchase-1", year: 2031, value: 6_500 },
	{ id: "purchase-2", year: 2041, value: 5_000 },
	{ id: "purchase-3", year: 2051, value: 3_500 },
];

export interface EscalationDefaults {
	R_Inflation: number;
	R_WageIncrease: number;
	R_ElecBillIncrease: number;
	R_Depreciation: number;
	R_SalvageVal: number;
	R_Discount: number;
	Yr_Life: number;
	Yr_Base: number;
	Yr_DoStart: number;
	Yr_EE: number;
}

export const DEFAULT_ESCALATION: EscalationDefaults = {
	R_Inflation: 0.004,
	R_WageIncrease: 0.029,
	R_ElecBillIncrease: 0.03,
	R_Depreciation: 0.139,
	R_SalvageVal: 0.05,
	R_Discount: 0.045,
	Yr_Life: 20,
	Yr_Base: 2025,
	Yr_DoStart: 2027,
	Yr_EE: 30,
};

export interface EconomicReportField {
	key: string;
	label: string;
	unit?: string;
}

export const ECONOMIC_REPORT_FIELDS: EconomicReportField[] = [
	{ key: "C_LCpCA", label: "저압 압축기 CAPEX", unit: "원" },
	{ key: "C_MCp2CA", label: "중압 압축기 2 CAPEX", unit: "원" },
	{ key: "C_MCp1CA", label: "중압 압축기 1 CAPEX", unit: "원" },
	{ key: "C_HCpCA", label: "고압 압축기 CAPEX", unit: "원" },
	{ key: "C_CpCA", label: "압축기 CAPEX 합계", unit: "원" },
	{ key: "C_BufCA", label: "버퍼탱크 CAPEX", unit: "원" },
	{ key: "C_LBkCA", label: "저압 뱅크 CAPEX", unit: "원" },
	{ key: "C_MBkCA", label: "중압 뱅크 CAPEX", unit: "원" },
	{ key: "C_HBkCA", label: "고압 뱅크 CAPEX", unit: "원" },
	{ key: "C_BkCA", label: "뱅크 CAPEX 합계", unit: "원" },
	{ key: "C_Disp1CA", label: "수소충전기 1 CAPEX", unit: "원" },
	{ key: "C_Disp2CA", label: "수소충전기 2 CAPEX", unit: "원" },
	{ key: "C_DispCA", label: "수소충전기 CAPEX 합계", unit: "원" },
	{ key: "C_LH2TkCA", label: "액화수소 탱크 CAPEX", unit: "원" },
	{ key: "C_LH2PpCA", label: "액화수소 펌프 CAPEX", unit: "원" },
	{ key: "C_LH2VapCA", label: "액화수소 기화기 CAPEX", unit: "원" },
	{ key: "C_LH2CA", label: "액화수소 설비 CAPEX", unit: "원" },
	{ key: "C_ElecCA", label: "전기 설비 CAPEX", unit: "원" },
	{ key: "C_ElecOP", label: "전기 설비 OPEX", unit: "원/월" },
	{ key: "WonCAPEX", label: "초기 투자비 (CAPEX)", unit: "원" },
	{ key: "WonOPEX", label: "연간 운전비 (OPEX)", unit: "원" },
	{ key: "NPV", label: "순현재가치 (NPV)", unit: "원" },
	{ key: "BCR", label: "편익/비용 비율 (BCR)" },
	{ key: "IRR", label: "내부수익률 (IRR)", unit: "%" },
	{ key: "yr_Payback", label: "투자 회수기간", unit: "년" },
];
