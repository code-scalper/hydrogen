import type {
	CurrencyCode,
	EquipmentTabConfig,
} from "@/constants/economicEvaluation";

const isFiniteNumber = (value: unknown): value is number =>
	typeof value === "number" && Number.isFinite(value);

export const sanitizeNumericInput = (
	value: string | number | null | undefined,
): number | null => {
	if (value === null || value === undefined) {
		return null;
	}
	if (typeof value === "number") {
		return Number.isFinite(value) ? value : null;
	}
	const trimmed = `${value}`.replace(/,/g, "").trim();
	if (trimmed.length === 0) {
		return null;
	}
	const parsed = Number.parseFloat(trimmed);
	if (!Number.isFinite(parsed)) {
		return null;
	}
	return parsed;
};

export const convertUsdToDisplay = (
	usd: number | null,
	config: EquipmentTabConfig,
	currency: CurrencyCode,
	dalToWon: number,
): number | null => {
	if (!isFiniteNumber(usd) || usd === 0) {
		return usd ?? null;
	}
	if (currency === "USD") {
		return usd / config.usdUnit.scale;
	}
	const wonValue = usd * dalToWon;
	return wonValue / config.krwUnit.scale;
};

export const convertDisplayToUsd = (
	displayValue: number | null,
	config: EquipmentTabConfig,
	currency: CurrencyCode,
	dalToWon: number,
): number | null => {
	if (!isFiniteNumber(displayValue) || displayValue === 0) {
		return displayValue ?? null;
	}
	if (currency === "USD") {
		return displayValue * config.usdUnit.scale;
	}
	const wonValue = displayValue * config.krwUnit.scale;
	if (dalToWon <= 0) {
		return null;
	}
	return wonValue / dalToWon;
};

export const convertKrwToDisplay = (
	krw: number | null,
	currency: CurrencyCode,
	dalToWon: number,
	usdScale = 1,
	krwScale = 1,
): number | null => {
	if (!isFiniteNumber(krw) || krw === 0) {
		return krw ?? null;
	}
	if (currency === "KRW") {
		return krw / krwScale;
	}
	if (dalToWon <= 0) {
		return null;
	}
	return krw / dalToWon / usdScale;
};

export const convertDisplayToKrw = (
	displayValue: number | null,
	currency: CurrencyCode,
	dalToWon: number,
	usdScale = 1,
	krwScale = 1,
): number | null => {
	if (!isFiniteNumber(displayValue) || displayValue === 0) {
		return displayValue ?? null;
	}
	if (currency === "KRW") {
		return displayValue * krwScale;
	}
	return displayValue * usdScale * dalToWon;
};

export interface AverageCostResult {
	totalCostWon: number;
	totalQuantity: number;
	averageWonPerUnit: number | null;
}

export const calculateAverageCost = (
	points: Array<{
		quantity?: number | null;
		x?: number | null;
		usd: number | null;
	}>,
	dalToWon: number,
): AverageCostResult => {
	let totalCostWon = 0;
	let totalQuantity = 0;

	for (const point of points) {
		const quantity = point.quantity ?? point.x ?? null;
		if (!isFiniteNumber(quantity) || !isFiniteNumber(point.usd)) {
			continue;
		}
		const won = point.usd * dalToWon;
		totalCostWon += won;
		totalQuantity += quantity;
	}

	return {
		totalCostWon,
		totalQuantity,
		averageWonPerUnit: totalQuantity > 0 ? totalCostWon / totalQuantity : null,
	};
};

export const sortTimelinePoints = <T extends { year: number }>(
	points: T[],
): T[] => {
	return [...points].sort((a, b) => a.year - b.year);
};
