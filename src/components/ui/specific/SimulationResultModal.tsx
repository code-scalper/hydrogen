import useSimulationAnalysisStore from "@/store/useSimulationAnalysisStore";

const SimulationResultModal = () => {
	const isOpen = useSimulationAnalysisStore((state) => state.isOpen);
	const analysis = useSimulationAnalysisStore((state) => state.analysis);
	const close = useSimulationAnalysisStore((state) => state.close);

	if (!isOpen || !analysis) {
		return null;
	}

	if (isOpen) {
		setTimeout(() => {
			return null;
		}, 3000);
	}

	return (
		<div className="fixed inset-0 z-[1200] flex items-center justify-center overflow-y-auto bg-black/60 px-4 py-6">
			<div className="w-full max-w-2xl overflow-hidden rounded-lg border border-slate-700 bg-slate-900/95 shadow-2xl max-h-[90vh] flex flex-col">
				<div className="flex items-center justify-between border-b border-slate-700 px-5 py-3">
					<div>
						<h2 className="text-base font-semibold text-slate-100">
							시뮬레이션 계산이 완료 되었습니다.
						</h2>
						<p className="text-xs text-slate-400">
							생성 {new Date(analysis.generatedAt).toLocaleString()}
						</p>
					</div>
					<button
						type="button"
						onClick={close}
						className="rounded px-3 py-1 text-xs font-medium text-slate-200 hover:bg-slate-700"
					>
						닫기
					</button>
				</div>
				<div className="flex-1 overflow-y-auto px-5 py-4 text-sm text-slate-200">
					<div className="space-y-2">
						{analysis.notes.map((note) => (
							<p key={note} className="text-slate-200">
								{note}
							</p>
						))}
					</div>
					{/* 
					{analysis.highlights.length > 0 ? (
						<div className="mt-5">
							<h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
								주요 수치 변화
							</h3>
							<ul className="mt-3 space-y-3">
								{analysis.highlights.map((item) => (
									<li
										key={item.key}
										className="rounded-md border border-slate-700 bg-slate-800/80 px-4 py-3"
									>
										<div className="text-sm font-semibold text-emerald-300">
											{item.key}
										</div>
										<div className="mt-1 grid gap-1 text-xs text-slate-200 md:grid-cols-[minmax(0,_1fr)_minmax(0,_1fr)]">
											<div>
												<span className="text-slate-400">최종값</span>
												<span className="ml-2 text-slate-100">
													{item.finalValue}
												</span>
											</div>
											{item.changeText ? (
												<div>
													<span className="text-slate-400">변화량</span>
													<span className="ml-2 text-slate-100">
														{item.changeText}
													</span>
												</div>
											) : (
												<div className="text-slate-400">변화 데이터 부족</div>
											)}
											<div className="md:col-span-2">
												{item.rangeText ? (
													<p>
														<span className="text-slate-400">관측 범위</span>
														<span className="ml-2 text-slate-100">
															{item.rangeText}
														</span>
													</p>
												) : (
													<p className="text-slate-400">범위 데이터 부족</p>
												)}
											</div>
										</div>
										{item.note && (
											<p className="mt-2 text-xs text-slate-400">{item.note}</p>
										)}
									</li>
								))}
							</ul>
						</div>
					) : (
						<p className="mt-5 text-xs text-slate-400">
							수치형 출력 항목을 찾지 못했습니다.
						</p>
					)} */}
				</div>
			</div>
		</div>
	);
};

export default SimulationResultModal;
