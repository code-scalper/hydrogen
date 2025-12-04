import { useCallback } from "react";

import PlotlyWrapper from "@/components/ui/PlotlyWrapper";
import { WHAT_IF_BASIC_FIELDS } from "@/constants/whatIf";
import useWhatIfStore from "@/store/useWhatIfStore";

interface WhatIfAnalysisProps {
	showModal: boolean;
	setShowModal: (open: boolean) => void;
	handleEvent: (event: string) => void;
}

const SummaryRow = ({ label, value }: { label: string; value: string }) => (
	<div className="flex items-center justify-between border-b border-slate-700 px-3 py-2 text-[12px] text-slate-200">
		<span className="text-slate-400">{label}</span>
		<span className="font-semibold">{value}</span>
	</div>
);

export const WhatIfAnalisys = ({
	showModal,
	setShowModal,
	handleEvent,
}: WhatIfAnalysisProps) => {
	const dataset = useWhatIfStore((state) => state.dataset);
	const normalized = useWhatIfStore((state) => state.normalized);
	const loading = useWhatIfStore((state) => state.loading);
	const setLoading = useWhatIfStore((state) => state.setLoading);

	const close = () => {
		setShowModal(false);
		setLoading(false);
	};

	const handlePlotRendered = useCallback(() => {
		setLoading(false);
	}, [setLoading]);

	if (!showModal) {
		return null;
	}

	const chartData = (): Partial<Plotly.Data>[] => {
		if (!dataset) {
			return [];
		}

		if (dataset.mode === "surface") {
			return [
				{
					type: "surface",
					x: dataset.xValues,
					y: dataset.yValues,
					z: dataset.zMatrix,
					colorscale: "Viridis",
					opacity: 0.95,
					showscale: true,
					colorbar: { title: { text: dataset.zLabel } },
					hovertemplate: `<b>${dataset.zLabel}</b><br>${dataset.xLabel}: %{x:.2f}<br>${dataset.yLabel}: %{y:.2f}<br>${dataset.zLabel}: %{z:.2f}<extra></extra>`,
				} satisfies Partial<Plotly.Data>,
			];
		}

		return [
			{
				type: "scatter3d",
				mode: "markers",
				x: dataset.points.map((point) => point.x),
				y: dataset.points.map((point) => point.y),
				z: dataset.points.map((point) => point.z),
				marker: {
					size: 4,
					color: dataset.points.map((point) => point.z),
					colorscale: "Viridis",
					colorbar: { title: { text: dataset.zLabel } },
				},
				hovertemplate: `<b>${dataset.zLabel}</b><br>${dataset.xLabel}: %{x:.2f}<br>${dataset.yLabel}: %{y:.2f}<br>${dataset.zLabel}: %{z:.2f}<extra></extra>`,
			} satisfies Partial<Plotly.Data>,
		];
	};

	const infoRows = () => {
		if (!dataset || !normalized) {
			return null;
		}

		return (
			<div className="mt-4 rounded-lg border border-slate-700">
				<SummaryRow
					label="데이터 기준 날짜"
					value={dataset.sourceDate ? dataset.sourceDate : "-"}
				/>
				<SummaryRow
					label="데이터 포인트 수"
					value={`${dataset.points.length.toLocaleString()} 개`}
				/>
				<SummaryRow
					label="X 축 범위"
					value={`${dataset.xValues[0]?.toFixed(2) ?? "-"} ~ ${
						dataset.xValues.at(-1)?.toFixed(2) ?? "-"
					}`}
				/>
				<SummaryRow
					label="Y 축 범위"
					value={`${dataset.yValues[0]?.toFixed(2) ?? "-"} ~ ${
						dataset.yValues.at(-1)?.toFixed(2) ?? "-"
					}`}
				/>
				<SummaryRow label="출력 축" value={dataset.zLabel} />
			</div>
		);
	};

	return (
		<div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-950/70 text-xs text-slate-200">
			<div className="flex h-[90%] w-[92%] flex-col overflow-hidden rounded-xl border border-slate-700 bg-slate-900 shadow-2xl">
				<div className="flex items-center justify-between border-b border-slate-700 px-4 py-3">
					<h2 className="text-sm font-semibold text-slate-100">
						What-if 분석 결과
					</h2>
					<button
						type="button"
						onClick={close}
						className="text-slate-300 hover:text-white"
					>
						×
					</button>
				</div>

				<div className="flex flex-1 overflow-hidden">
					<div className="w-[320px] shrink-0 border-r border-slate-800 bg-slate-950/60 p-4">
						<div className="space-y-4">
							<div>
								<h3 className="text-[13px] font-semibold text-slate-100">
									입력 요약
								</h3>
								<p className="mt-1 text-[11px] text-slate-400">
									사용자가 지정한 범위와 출력 설정을 요약합니다.
								</p>
							</div>
							<div className="space-y-2 text-[12px] text-slate-200">
								<p>
									<span className="text-slate-400">입력 조합</span>
									<br />
									<span className="font-semibold">
										{normalized
											? (WHAT_IF_BASIC_FIELDS.find(
													(field) => field.key === "N_InSelec",
												)?.options?.find(
													(opt) =>
														opt.value === normalized.N_InSelec.toString(),
												)?.label ?? "-")
											: "-"}
									</span>
								</p>
								<p>
									<span className="text-slate-400">출력 선택</span>
									<br />
									<span className="font-semibold">
										{dataset?.zLabel ?? "-"}
									</span>
								</p>
							</div>
							<div className="space-y-1 text-[11px] text-slate-300">
								<p>
									외기 온도: {normalized?.T_AmbC_Min ?? "-"} ℃ ~{" "}
									{normalized?.T_AmbC_Max ?? "-"} ℃
								</p>
								<p>
									Bank 온도: {normalized?.T_BaC_Min ?? "-"} ℃ ~{" "}
									{normalized?.T_BaC_Max ?? "-"} ℃
								</p>
								<p>
									탱크 초기 압력: {normalized?.P_Tk0C_Min ?? "-"} MPa ~{" "}
									{normalized?.P_Tk0C_Max ?? "-"} MPa
								</p>
								<p>반복 계산 횟수: {normalized?.MaxIter ?? "-"}</p>
							</div>

							{infoRows()}
						</div>
					</div>

					<div className="flex flex-1 flex-col bg-slate-900/60">
						{dataset ? (
							<PlotlyWrapper>
								{({ Plot, plotEvents }) => (
									<Plot
										data={chartData()}
										layout={{
											autosize: true,
											margin: { l: 40, r: 20, b: 60, t: 40 },
											scene: {
												xaxis: { title: { text: dataset.xLabel } },
												yaxis: { title: { text: dataset.yLabel } },
												zaxis: { title: { text: dataset.zLabel } },
												camera: { eye: { x: 1.6, y: 1.8, z: 1.2 } },
											},
											paper_bgcolor: "rgba(15, 23, 42, 0.8)",
											plot_bgcolor: "rgba(15, 23, 42, 0.8)",
										}}
										config={{ responsive: true, displaylogo: false }}
										onInitialized={(figure, graphDiv) => {
											plotEvents.onInitialized?.(figure, graphDiv);
											handlePlotRendered();
										}}
										onUpdate={(figure, graphDiv) => {
											plotEvents.onUpdate?.(figure, graphDiv);
											handlePlotRendered();
										}}
										style={{ width: "100%", height: "100%" }}
									/>
								)}
							</PlotlyWrapper>
						) : (
							<div className="flex h-full w-full flex-col items-center justify-center gap-3 text-sm text-slate-300">
								{loading ? (
									<span>그래프 데이터를 준비 중입니다...</span>
								) : (
									<span>
										표시할 What-if 결과가 없습니다. 입력 값을 확인해 주세요.
									</span>
								)}
							</div>
						)}
					</div>
				</div>

				<div className="flex justify-end gap-3 border-t border-slate-700 bg-slate-900 px-6 py-3 text-[12px]">
					<button
						type="button"
						onClick={() => handleEvent("prev")}
						className="rounded bg-slate-700 px-4 py-2 text-slate-200 hover:bg-slate-600"
					>
						입력 수정
					</button>
					<button
						type="button"
						onClick={close}
						className="rounded bg-emerald-500 px-4 py-2 font-semibold text-emerald-950 hover:bg-emerald-400"
					>
						닫기
					</button>
				</div>
			</div>
		</div>
	);
};
