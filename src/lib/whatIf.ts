import {
	WHAT_IF_AXIS_MAP,
	WHAT_IF_BASIC_FIELDS,
	type WhatIfAxisKey,
	type WhatIfFieldDefinition,
	type WhatIfInputs,
} from "@/constants/whatIf";
import type { SimulationFrame } from "@/store/useSimulationStore";

export interface WhatIfValidationResult {
	errors: Partial<Record<keyof WhatIfInputs, string>>;
	normalized: WhatIfNormalizedInputs | null;
	valid: boolean;
}

export interface WhatIfNormalizedInputs {
	N_InSelec: number;
	N_OutSelec: number;
	T_AmbC_Min: number;
	T_AmbC_Max: number;
	T_BaC_Min: number;
	T_BaC_Max: number;
	P_Tk0C_Min: number;
	P_Tk0C_Max: number;
	MaxIter: number;
}

const fieldMap = new Map<keyof WhatIfInputs, WhatIfFieldDefinition>(
	WHAT_IF_BASIC_FIELDS.map((field) => [field.key, field]),
);

const parseNumber = (raw: string) => {
	if (raw === undefined || raw === null) return Number.NaN;
	const trimmed = `${raw}`.trim();
	if (trimmed.length === 0) return Number.NaN;
	return Number.parseFloat(trimmed);
};

export const validateWhatIfInputs = (
	inputs: WhatIfInputs,
): WhatIfValidationResult => {
	const errors: Partial<Record<keyof WhatIfInputs, string>> = {};
	const normalized: Partial<WhatIfNormalizedInputs> = {};

	for (const [key, value] of Object.entries(inputs) as [
		keyof WhatIfInputs,
		string,
	][]) {
		const definition = fieldMap.get(key);
		if (!definition) {
			continue;
		}

		if (definition.type === "select") {
			if (!definition.options?.some((opt) => opt.value === value)) {
				errors[key] = "허용되지 않은 선택값입니다.";
			} else {
				normalized[key as keyof WhatIfNormalizedInputs] = Number.parseInt(
					value,
					10,
				);
			}
			continue;
		}

		const parsed = parseNumber(value);
		if (!Number.isFinite(parsed)) {
			errors[key] = "숫자를 입력하세요.";
			continue;
		}

		if (definition.min !== undefined && parsed < definition.min) {
			errors[key] = `${definition.min} 이상이어야 합니다.`;
		}
		if (definition.max !== undefined && parsed > definition.max) {
			errors[key] = `${definition.max} 이하이어야 합니다.`;
		}

		normalized[key as keyof WhatIfNormalizedInputs] = parsed;
	}

	// Ensure min <= max for paired fields
	const pairs: Array<
		[minKey: keyof WhatIfInputs, maxKey: keyof WhatIfInputs, label: string]
	> = [
		["T_AmbC_Min", "T_AmbC_Max", "외기 온도"],
		["T_BaC_Min", "T_BaC_Max", "Bank 온도"],
		["P_Tk0C_Min", "P_Tk0C_Max", "탱크 초기 압력"],
	];

	for (const [minKey, maxKey, label] of pairs) {
		const minValue = normalized[minKey as keyof WhatIfNormalizedInputs];
		const maxValue = normalized[maxKey as keyof WhatIfNormalizedInputs];
		if (
			minValue !== undefined &&
			maxValue !== undefined &&
			Number.isFinite(minValue) &&
			Number.isFinite(maxValue) &&
			(minValue as number) > (maxValue as number)
		) {
			errors[minKey] = `${label} 최소값이 최대값보다 클 수 없습니다.`;
			errors[maxKey] = `${label} 최대값이 최소값보다 작을 수 없습니다.`;
		}
	}

	const hasError = Object.keys(errors).length > 0;
	return {
		errors,
		normalized: hasError ? null : (normalized as WhatIfNormalizedInputs),
		valid: !hasError,
	};
};

export interface WhatIfPoint {
	x: number;
	y: number;
	z: number;
}

export interface WhatIfDataset {
	xLabel: string;
	yLabel: string;
	zLabel: string;
	xValues: number[];
	yValues: number[];
	zMatrix: (number | null)[][];
	points: WhatIfPoint[];
	sourceDate: string | null;
	mode: "surface" | "scatter";
}

const uniqueSorted = (values: number[]) =>
	Array.from(new Set(values)).sort((a, b) => a - b);

const isWithinInputRange = (
	key: WhatIfAxisKey,
	value: number,
	normalized: WhatIfNormalizedInputs,
): boolean => {
	switch (key) {
		case "T_Amb":
			return value >= normalized.T_AmbC_Min && value <= normalized.T_AmbC_Max;
		case "T_Ba1":
			return value >= normalized.T_BaC_Min && value <= normalized.T_BaC_Max;
		case "P_Tk_01":
			return value >= normalized.P_Tk0C_Min && value <= normalized.P_Tk0C_Max;
		default:
			return true;
	}
};

export const buildWhatIfDataset = (
	frames: SimulationFrame[],
	normalized: WhatIfNormalizedInputs,
	sourceDate: string | null,
): WhatIfDataset | null => {
	const axisCombo = WHAT_IF_AXIS_MAP.in[normalized.N_InSelec.toString() as "1"];
	const outputCombo =
		WHAT_IF_AXIS_MAP.out[normalized.N_OutSelec.toString() as "1"];

	if (!axisCombo || !outputCombo) {
		console.log("[buildWhatIfDataset] 축 선택 정보가 잘못되었습니다.", {
			N_InSelec: normalized.N_InSelec,
			N_OutSelec: normalized.N_OutSelec,
			axisCombo,
			outputCombo,
		});
		return null;
	}

	const { x, y } = axisCombo;
	const z = outputCombo;

	const points: WhatIfPoint[] = [];

	for (const [i, frame] of frames.entries()) {
		const rawX = frame.values?.[x.key];
		const rawY = frame.values?.[y.key];
		const rawZ = frame.values?.[z.key];

		if (rawX === undefined || rawY === undefined || rawZ === undefined) {
			console.log(`[buildWhatIfDataset][frame ${i}] 값 없음`, {
				xKey: x.key,
				rawX,
				yKey: y.key,
				rawY,
				zKey: z.key,
				rawZ,
				frame,
			});
			continue;
		}

		const xValue = Number.parseFloat(`${rawX}`);
		const yValue = Number.parseFloat(`${rawY}`);
		const zValue = Number.parseFloat(`${rawZ}`);

		if (
			!Number.isFinite(xValue) ||
			!Number.isFinite(yValue) ||
			!Number.isFinite(zValue)
		) {
			console.log(`[buildWhatIfDataset][frame ${i}] 숫자 변환 실패`, {
				rawX,
				xValue,
				rawY,
				yValue,
				rawZ,
				zValue,
				frame,
			});
			continue;
		}

		if (!isWithinInputRange(x.key, xValue, normalized)) {
			console.log(`[buildWhatIfDataset][frame ${i}] x 입력 범위 벗어남`, {
				xKey: x.key,
				xValue,
				range: [normalized.T_AmbC_Min, normalized.T_AmbC_Max],
				frame,
			});
			continue;
		}
		if (!isWithinInputRange(y.key, yValue, normalized)) {
			console.log(`[buildWhatIfDataset][frame ${i}] y 입력 범위 벗어남`, {
				yKey: y.key,
				yValue,
				range: [normalized.T_BaC_Min, normalized.T_BaC_Max],
				frame,
			});
			continue;
		}

		points.push({ x: xValue, y: yValue, z: zValue });
	}

	console.log("[buildWhatIfDataset] points 생성 결과", {
		pointsLength: points.length,
		points,
		axisCombo,
		outputCombo,
		normalized,
	});

	console.log(frames, "framse");
	if (points.length === 0) {
		console.log("[buildWhatIfDataset] 유효한 데이터 포인트가 없습니다.", {
			framesLength: frames.length,
			normalized,
			axisCombo,
			outputCombo,
		});
		return null;
	}

	const xValues = uniqueSorted(points.map((point) => point.x));
	const yValues = uniqueSorted(points.map((point) => point.y));

	const grid = yValues.map(() => xValues.map(() => ({ sum: 0, count: 0 })));

	for (const point of points) {
		const xIndex = xValues.indexOf(point.x);
		const yIndex = yValues.indexOf(point.y);
		if (xIndex === -1 || yIndex === -1) {
			continue;
		}
		const cell = grid[yIndex][xIndex];
		cell.sum += point.z;
		cell.count += 1;
	}

	const zMatrix: (number | null)[][] = grid.map((row) =>
		row.map((cell) => (cell.count > 0 ? cell.sum / cell.count : null)),
	);

	const populatedCells = zMatrix
		.flat()
		.filter((value) => value !== null).length;
	const mode =
		populatedCells >= Math.min(9, points.length) ? "surface" : "scatter";

	return {
		xLabel: x.label,
		yLabel: y.label,
		zLabel: z.label,
		xValues,
		yValues,
		zMatrix,
		points,
		sourceDate,
		mode,
	};
};
