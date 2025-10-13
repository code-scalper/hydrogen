import type { SimulationFrame } from "@/store/useSimulationStore";

export interface SimulationMetricHighlight {
	key: string;
	finalValue: string;
	changeText?: string;
	rangeText?: string;
	note?: string;
}

export interface SimulationAnalysisSummary {
	statusText: string;
	totalFrames: number;
	trackedKeys: number;
	startTime?: number;
	endTime?: number;
	duration?: number;
	highlights: SimulationMetricHighlight[];
	notes: string[];
	generatedAt: string;
}

const toNumber = (value: unknown): number | null => {
	if (typeof value === "number") {
		return Number.isFinite(value) ? value : null;
	}
	if (typeof value === "string") {
		const trimmed = value.trim();
		if (trimmed.length === 0) return null;
		const parsed = Number.parseFloat(trimmed.replace(/,/g, ""));
		return Number.isFinite(parsed) ? parsed : null;
	}
	return null;
};

const formatNumber = (value: number | undefined | null): string => {
	if (value === undefined || value === null || !Number.isFinite(value)) {
		return "-";
	}
	const abs = Math.abs(value);
	if (abs === 0) return "0";
	if (abs >= 10000 || abs < 0.001) {
		return value.toExponential(3);
	}
	if (abs >= 100) {
		return value.toFixed(1);
	}
	if (abs >= 10) {
		return value.toFixed(2);
	}
	return value.toFixed(3).replace(/\.0+$/, ".0").replace(/0+$/, "").replace(/\.$/, "");
};

const formatSeconds = (value: number | undefined): string => {
	if (value === undefined || !Number.isFinite(value) || value < 0) {
		return "-";
	}
	if (value < 60) {
		return `${value.toFixed(1)}초`;
	}
	const minutes = Math.floor(value / 60);
	const seconds = value % 60;
	if (minutes >= 60) {
		const hours = Math.floor(minutes / 60);
		const remainMinutes = minutes % 60;
		return `${hours}시간 ${remainMinutes}분 ${seconds.toFixed(0)}초`;
	}
	return `${minutes}분 ${seconds.toFixed(0)}초`;
};

type MetricAccumulator = {
	first: number | null;
	last: number | null;
	min: number | null;
	max: number | null;
	count: number;
};

const upsertMetric = (acc: MetricAccumulator, value: number) => {
	if (acc.first === null) {
		acc.first = value;
	}
	acc.last = value;
	acc.min = acc.min === null ? value : Math.min(acc.min, value);
	acc.max = acc.max === null ? value : Math.max(acc.max, value);
	acc.count += 1;
};

const describeTrend = (first: number | null, last: number | null) => {
	if (first === null || last === null) return null;
	const diff = last - first;
	const absDiff = Math.abs(diff);
	if (absDiff < 1e-6) {
		return {
			label: "변화 없음",
			changeText: `Δ ${formatNumber(0)}`,
		};
	}
	const direction = diff > 0 ? "상승" : "하락";
	return {
		label: direction,
		changeText: `${direction} ${diff > 0 ? "+" : ""}${formatNumber(diff)}`,
	};
};

export const sanitizeFrames = (frames: SimulationFrame[]): SimulationFrame[] => {
	return frames
		.filter((frame) => frame && Number.isFinite(frame.time))
		.sort((a, b) => a.time - b.time)
		.map((frame) => ({
			time: frame.time,
			values: { ...frame.values },
		}));
};

export const buildSimulationAnalysis = (
	result: {
		status?: string;
		frames?: SimulationFrame[] | null;
	},
): SimulationAnalysisSummary => {
	const safeFrames = Array.isArray(result?.frames)
		? sanitizeFrames(result.frames)
		: [];

	const totalFrames = safeFrames.length;
	const startTime = totalFrames > 0 ? safeFrames[0]?.time : undefined;
	const endTime = totalFrames > 0 ? safeFrames[totalFrames - 1]?.time : undefined;
	const duration =
		startTime !== undefined && endTime !== undefined
			? Math.max(0, endTime - startTime)
			: undefined;

	const metrics = new Map<string, MetricAccumulator>();

	for (const frame of safeFrames) {
		for (const [key, raw] of Object.entries(frame.values ?? {})) {
			const numericValue = toNumber(raw);
			if (numericValue === null) continue;
			if (!metrics.has(key)) {
				metrics.set(key, {
					first: null,
					last: null,
					min: null,
					max: null,
					count: 0,
				});
			}
			const metric = metrics.get(key)!;
			upsertMetric(metric, numericValue);
		}
	}

	const metricEntries = Array.from(metrics.entries()).map(([key, data]) => {
		const range =
			data.min !== null && data.max !== null ? data.max - data.min : undefined;
		const trend = describeTrend(data.first, data.last);
		return {
			key,
			first: data.first,
			last: data.last,
			min: data.min,
			max: data.max,
			range,
			diff: data.first !== null && data.last !== null ? data.last - data.first : undefined,
			trend,
		};
	});

	metricEntries.sort((a, b) => {
		const diffA = Math.abs(a.diff ?? 0);
		const diffB = Math.abs(b.diff ?? 0);
		if (diffB !== diffA) return diffB - diffA;
		const rangeA = Math.abs(a.range ?? 0);
		const rangeB = Math.abs(b.range ?? 0);
		if (rangeB !== rangeA) return rangeB - rangeA;
		return a.key.localeCompare(b.key);
	});

	const topHighlights = metricEntries.slice(0, 5).map((entry) => {
		const rangeText =
			entry.min !== null && entry.max !== null
				? `${formatNumber(entry.min)} ~ ${formatNumber(entry.max)}`
				: undefined;
		const changeText = entry.trend?.changeText ?? undefined;
		return {
			key: entry.key,
			finalValue: formatNumber(entry.last ?? null),
			changeText,
			rangeText,
			note: entry.trend?.label,
		};
	});

	const notes: string[] = [];
	const statusText = result?.status?.trim().length
		? result.status
		: "실행 상태 정보를 찾을 수 없습니다.";

	notes.push(`실행 상태: ${statusText}`);

	if (totalFrames === 0) {
		notes.push("출력 데이터가 없어 추가 분석을 제공할 수 없습니다.");
	} else {
		notes.push(
			`총 ${totalFrames}개 프레임을 분석했습니다 (${formatSeconds(
				duration,
			)} 구간).`,
		);
		notes.push(
			`분석된 출력 항목: ${metrics.size}개${metrics.size > topHighlights.length ? ` (상위 ${topHighlights.length}개 표시)` : ""}.`,
		);
	}

	if (totalFrames > 0 && startTime !== undefined && endTime !== undefined) {
		notes.push(
			`시간 범위: ${formatNumber(startTime)}s → ${formatNumber(endTime)}s`,
		);
	}

	return {
		statusText,
		totalFrames,
		trackedKeys: metrics.size,
		startTime,
		endTime,
		duration,
		highlights: topHighlights,
		notes,
		generatedAt: new Date().toISOString(),
	};
};
