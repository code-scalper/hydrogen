import { useMemo } from "react";

import { EXECUTION_PROGRESS_STEPS } from "@/constants/executionProgress";
import useExecutionProgressStore, {
	type ExecutionProgressStepState,
} from "@/store/useExecutionProgressStore";

const statusColors: Record<string, string> = {
	complete: "bg-emerald-500 text-emerald-950",
	active: "bg-amber-400 text-amber-950",
	pending: "bg-slate-700 text-slate-200",
};

const statusDotColors: Record<string, string> = {
	complete: "bg-emerald-400",
	active: "bg-amber-300",
	pending: "bg-slate-600",
};

const ExecutionProgressModal = () => {
	const isOpen = useExecutionProgressStore((state) => state.isOpen);
	const steps = useExecutionProgressStore(
		(state) => state.steps,
	) as ExecutionProgressStepState[];
	const error = useExecutionProgressStore((state) => state.error);
	const startedAt = useExecutionProgressStore((state) => state.startedAt);
	const lastUpdatedAt = useExecutionProgressStore(
		(state) => state.lastUpdatedAt,
	);
	const close = useExecutionProgressStore((state) => state.close);

	const { completedCount, activeIndex } = useMemo(() => {
		const completed = steps.filter((step) => step.status === "complete").length;
		const active = steps.findIndex((step) => step.status === "active");
		return { completedCount: completed, activeIndex: active };
	}, [steps]);

	const total = EXECUTION_PROGRESS_STEPS.length;
	const percent = Math.min(100, Math.round((completedCount / total) * 100));
	const remaining = total - completedCount;

	const lastUpdateText = useMemo(() => {
		if (!startedAt) {
			return null;
		}
		const started = new Date(startedAt);
		const updated = lastUpdatedAt ? new Date(lastUpdatedAt) : new Date();
		const elapsedSeconds = Math.max(
			0,
			Math.round((updated.getTime() - started.getTime()) / 1000),
		);
		return `${elapsedSeconds}초 경과`;
	}, [startedAt, lastUpdatedAt]);

	if (!isOpen) {
		return null;
	}

	return (
		<div className="fixed inset-0 z-[1200] flex items-center justify-center bg-slate-950/70 backdrop-blur-sm">
			<div className="w-[520px] max-w-[92vw] rounded-2xl border border-slate-700 bg-slate-900/95 p-6 text-slate-100 shadow-2xl">
				<header className="flex items-start justify-between">
					<div>
						<h2 className="text-lg font-semibold text-slate-50">
							시뮬레이션 진행 상황
						</h2>
						<p className="mt-1 text-xs text-slate-400">
							총 {total}단계 중 {completedCount}단계 완료
							{remaining > 0 ? ` · 남은 단계 ${remaining}` : " · 완료됨"}
						</p>
						{lastUpdateText && (
							<p className="mt-1 text-[11px] text-slate-500">
								{lastUpdateText}
							</p>
						)}
					</div>
					{error ? (
						<button
							type="button"
							onClick={close}
							className="rounded-md border border-rose-500 px-3 py-1 text-xs text-rose-200 transition hover:bg-rose-500/10"
						>
							닫기
						</button>
					) : (
						<div className="flex items-center gap-2 text-xs text-slate-400">
							<span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
							<span>{percent}%</span>
						</div>
					)}
				</header>

				<div className="mt-5">
					<div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
						<div
							className="h-full rounded-full bg-emerald-400 transition-all"
							style={{ width: `${percent}%` }}
						/>
					</div>
				</div>

				<ol className="mt-6 space-y-3 text-sm">
					{steps.map((step, index) => {
						const badgeClass = statusColors[step.status];
						const dotClass = statusDotColors[step.status];
						const isActive = step.status === "active";
						return (
							<li
								key={step.code}
								className={`rounded-xl border border-slate-800/80 bg-slate-900/60 px-3 py-3 shadow-sm transition ${
									isActive ? "ring-1 ring-amber-400/60" : ""
								}`}
							>
								<div className="flex items-start gap-3">
									<div className="flex flex-col items-center gap-1 pt-1">
										<span
											className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold ${badgeClass}`}
										>
											{index + 1}
										</span>
										<span
											className={`h-2 w-2 rounded-full ${dotClass} ${
												isActive ? "animate-ping" : ""
											}`}
										/>
									</div>
									<div className="flex-1">
										<div className="flex items-center justify-between">
											<p className="text-sm font-semibold text-slate-100">
												{step.label}
											</p>
											<span className="text-[11px] text-slate-500">
												#{step.code}
											</span>
										</div>
										<p className="mt-1 text-xs text-slate-300">
											{step.entry?.description ?? step.description}
										</p>
										{step.entry?.solutionKo && (
											<p className="mt-1 text-[11px] text-slate-400">
												{step.entry.solutionKo}
											</p>
										)}
										{step.completedAt && (
											<p className="mt-1 text-[10px] uppercase tracking-wide text-slate-500">
												완료 시각: {step.completedAt}
											</p>
										)}
									</div>
								</div>
							</li>
						);
					})}
				</ol>

				{error ? (
					<p className="mt-6 rounded-lg border border-rose-500/60 bg-rose-500/10 p-3 text-[13px] text-rose-200">
						실행 중 오류가 발생했습니다. 로그를 확인한 뒤 다시 시도하세요.
						<br />
						<span className="text-[12px] text-rose-300/80">{error}</span>
					</p>
				) : (
					<p className="mt-6 text-[11px] text-slate-500">
						실행이 완료되면 창이 자동으로 닫힙니다.
						{activeIndex >= 0 && remaining > 0
							? ` 현재 단계 (${activeIndex + 1}/${total}) 진행 중...`
							: ""}
					</p>
				)}
			</div>
		</div>
	);
};

export default ExecutionProgressModal;
