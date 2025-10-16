import Plotly from "plotly.js-dist-min";
import { useEffect, useMemo, useState } from "react";
import createPlotlyComponent from "react-plotly.js/factory";

import {
	OUTPUT_CHART_GROUPS,
	type SimulationChartDefinition,
	type SimulationChartGroupDefinition,
} from "@/constants/outputCharts";
import type { SimulationFrame } from "@/store/useSimulationStore";

const Plot = createPlotlyComponent(Plotly);

interface SimulationGraphModalProps {
	isOpen: boolean;
	onClose: () => void;
	frames: SimulationFrame[];
	sourceDate: string | null;
	loading?: boolean;
	error?: string | null;
	onReload?: () => void;
}

const DEFAULT_COLORS = [
	"#60a5fa",
	"#34d399",
	"#f87171",
	"#facc15",
	"#a855f7",
	"#38bdf8",
	"#fb7185",
	"#f97316",
	"#22d3ee",
	"#c084fc",
];

const formatSourceDate = (sourceDate: string | null): string => {
	if (!sourceDate) return "-";
	const normalized = sourceDate.replace(/[^0-9]/g, "");
	if (normalized.length !== 8) return sourceDate;
	const year = normalized.slice(0, 4);
	const month = normalized.slice(4, 6);
	const day = normalized.slice(6, 8);
	return `${year}-${month}-${day}`;
};

const toNumber = (value: unknown): number | null => {
	if (typeof value === "number") {
		return Number.isFinite(value) ? value : null;
	}
	if (typeof value === "string") {
		const trimmed = value.trim();
		if (!trimmed) return null;
		const sanitized = trimmed.replace(/,/g, "");
		const parsed = Number.parseFloat(sanitized);
		return Number.isFinite(parsed) ? parsed : null;
	}
	return null;
};

const colorForKey = (key: string): string => {
	let hash = 0;
	for (let i = 0; i < key.length; i += 1) {
		hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
	}
	return DEFAULT_COLORS[hash % DEFAULT_COLORS.length];
};

const hasSeriesData = (frames: SimulationFrame[], key: string): boolean => {
	for (const frame of frames) {
		const value = toNumber(frame.values?.[key]);
		if (value !== null) {
			return true;
		}
	}
	return false;
};

const buildChartTraces = (
	frames: SimulationFrame[],
	chart: SimulationChartDefinition,
) => {
	const xValues = frames.map((frame) => frame.time);

	return chart.series
		.map((series, index) => {
			const yValues = frames.map((frame) =>
				toNumber(frame.values?.[series.key]),
			);
			const hasValidValues = yValues.some((value) => value !== null);
			if (!hasValidValues) {
				return null;
			}
			return {
				x: xValues,
				y: yValues,
				type: "scatter" as const,
				mode: "lines" as const,
				name: series.label,
				line: {
					color: colorForKey(series.key),
					width: chart.series.length > 1 ? 2 : 2.5,
				},
				hovertemplate: `%{x:.3f}s<br>${series.label}: %{y}<extra></extra>`,
			};
		})
		.filter((trace): trace is NonNullable<typeof trace> => trace !== null);
};

const findFirstGroupWithData = (
	groups: SimulationChartGroupDefinition[],
	frames: SimulationFrame[],
): string | null => {
	for (const group of groups) {
		const groupHasData = group.charts.some((chart) =>
			chart.series.some((series) => hasSeriesData(frames, series.key)),
		);
		if (groupHasData) {
			return group.id;
		}
	}
	return groups[0]?.id ?? null;
};

const modalContainerClass =
	"fixed inset-0 z-[1100] flex items-center justify-center bg-black/60 px-6 py-8";

const contentClass =
	"flex h-full max-h-[90vh] w-full max-w-7xl overflow-hidden rounded-lg border border-slate-700 bg-slate-900/95 shadow-2xl";

export const SimulationGraphModal = ({
	isOpen,
	onClose,
	frames,
	sourceDate,
	loading = false,
	error = null,
	onReload,
}: SimulationGraphModalProps) => {
	const sortedFrames = useMemo(() => {
		return [...frames].sort((a, b) => a.time - b.time);
	}, [frames]);

	const firstAvailableGroupId = useMemo(() => {
		return findFirstGroupWithData(OUTPUT_CHART_GROUPS, sortedFrames);
	}, [sortedFrames]);

	const [activeGroupId, setActiveGroupId] = useState<string | null>(
		firstAvailableGroupId,
	);

	useEffect(() => {
		if (!isOpen) {
			return;
		}
		setActiveGroupId((previous) => previous ?? firstAvailableGroupId);
	}, [firstAvailableGroupId, isOpen]);

	if (!isOpen) {
		return null;
	}

	const activeGroup = OUTPUT_CHART_GROUPS.find(
		(group) => group.id === activeGroupId,
	);

	const renderCharts = () => {
		if (loading) {
			return (
				<div className="flex flex-1 items-center justify-center text-sm text-slate-200">
					데이터를 불러오는 중...
				</div>
			);
		}

		if (error) {
			return (
				<div className="flex flex-1 flex-col items-center justify-center gap-3 text-sm text-rose-400">
					<p>{error}</p>
					{onReload && (
						<button
							type="button"
							onClick={onReload}
							className="rounded bg-slate-800 px-3 py-1 text-xs text-slate-200 hover:bg-slate-700"
						>
							다시 시도
						</button>
					)}
				</div>
			);
		}

		if (!activeGroup) {
			return (
				<div className="flex flex-1 items-center justify-center text-sm text-slate-300">
					표시할 그래프 구성이 없습니다.
				</div>
			);
		}

		const groupHasAnyData = activeGroup.charts.some((chart) =>
			chart.series.some((series) => hasSeriesData(sortedFrames, series.key)),
		);

		if (!groupHasAnyData) {
			return (
				<div className="flex flex-1 items-center justify-center text-sm text-slate-300">
					선택한 그룹에서 표시할 데이터가 없습니다.
				</div>
			);
		}

		return (
			<div className="flex-1 overflow-y-auto bg-slate-950/40 px-4 py-4">
				<div className="space-y-4">
					{activeGroup.charts.map((chart) => {
						const traces = buildChartTraces(sortedFrames, chart);
						if (traces.length === 0) {
							return (
								<div
									key={chart.id}
									className="rounded-lg border border-slate-800 bg-slate-900/70 p-4 text-sm text-slate-400"
								>
									{chart.title} 그래프를 그릴 수 있는 데이터가 없습니다.
								</div>
							);
						}

						return (
							<div
								key={chart.id}
								className="rounded-lg border border-slate-800 bg-slate-900/60 p-3"
							>
								<div className="mb-2 flex items-center justify-between gap-2 text-sm text-slate-200">
									<span className="font-semibold">{chart.title}</span>
									{chart.note && (
										<span className="text-xs text-slate-400">{chart.note}</span>
									)}
								</div>
								<Plot
									data={traces as Partial<Plotly.Data>[]}
									layout={{
										paper_bgcolor: "rgba(15, 23, 42, 0.6)",
										plot_bgcolor: "rgba(15, 23, 42, 0.9)",
										margin: { l: 50, r: 20, t: 30, b: 40 },
										legend: {
											orientation: traces.length > 2 ? "h" : "v",
											x: traces.length > 2 ? 0 : 1,
											xanchor: traces.length > 2 ? "left" : "right",
											y: traces.length > 2 ? 1.12 : 1,
											yanchor: "bottom",
											font: { color: "#cbd5f5", size: 10 },
										},
										xaxis: {
											title: { text: "Time (s)" },
											gridcolor: "rgba(148, 163, 184, 0.2)",
											zerolinecolor: "rgba(148, 163, 184, 0.2)",
											color: "#e2e8f0",
										},
										yaxis: {
											title:
												chart.series.length === 1
													? { text: chart.series[0].label }
													: undefined,
											gridcolor: "rgba(148, 163, 184, 0.2)",
											zerolinecolor: "rgba(148, 163, 184, 0.2)",
											color: "#e2e8f0",
										},
										font: { color: "#e2e8f0", size: 11 },
									}}
									config={{ displayModeBar: false, responsive: true }}
									useResizeHandler
									style={{ width: "100%", height: "260px" }}
								/>
							</div>
						);
					})}
				</div>
			</div>
		);
	};

	return (
		<div className={modalContainerClass}>
			<div className={contentClass}>
				<div className="flex w-64 shrink-0 flex-col border-r border-slate-800 bg-slate-950/60">
					<div className="border-b border-slate-800 px-4 py-3">
						<h2 className="text-base font-semibold text-slate-100">
							시뮬레이션 그래프
						</h2>
						<p className="mt-1 text-xs text-slate-400">
							기준 날짜: {formatSourceDate(sourceDate)}
						</p>
					</div>
					<div className="flex-1 overflow-y-auto">
						<ul className="divide-y divide-slate-800 text-sm text-slate-300">
							{OUTPUT_CHART_GROUPS.map((group) => {
								const groupHasData = group.charts.some((chart) =>
									chart.series.some((series) =>
										hasSeriesData(sortedFrames, series.key),
									),
								);
								const isActive = group.id === activeGroupId;
								return (
									<li key={group.id}>
										<button
											type="button"
											onClick={() => setActiveGroupId(group.id)}
											className={`flex w-full flex-col items-start gap-0.5 px-4 py-3 text-left transition ${
												isActive
													? "bg-slate-800/70 text-slate-50"
													: groupHasData
														? "hover:bg-slate-900/60"
														: "opacity-50"
											}`}
										>
											<span className="font-semibold">{group.title}</span>
											{group.description && (
												<span className="text-xs text-slate-400">
													{group.description}
												</span>
											)}
											{!groupHasData && (
												<span className="text-[11px] text-slate-500">
													데이터 없음
												</span>
											)}
										</button>
									</li>
								);
							})}
						</ul>
					</div>
					<div className="border-t border-slate-800 px-4 py-3 text-right">
						<button
							type="button"
							onClick={onClose}
							className="rounded bg-slate-800 px-3 py-1 text-xs text-slate-200 hover:bg-slate-700"
						>
							닫기
						</button>
					</div>
				</div>
				<div className="flex flex-1 flex-col">{renderCharts()}</div>
			</div>
		</div>
	);
};

export default SimulationGraphModal;
