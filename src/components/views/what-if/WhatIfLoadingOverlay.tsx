import useWhatIfStore from "@/store/useWhatIfStore";

export const WhatIfLoadingOverlay = () => {
	const loading = useWhatIfStore((state) => state.loading);

	if (!loading) {
		return null;
	}

	return (
		<div className="fixed inset-0 z-[1500] flex items-center justify-center bg-slate-950/70">
			<div className="flex flex-col items-center gap-3 rounded-xl border border-slate-700 bg-slate-900/95 px-8 py-6 text-center text-slate-200 shadow-2xl">
				<div className="h-10 w-10 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent" />
				<p className="text-sm font-semibold text-slate-100">
					그래프 데이터를 준비하고 있습니다
				</p>
				<p className="text-xs text-slate-400">잠시만 기다려 주세요...</p>
			</div>
		</div>
	);
};

export default WhatIfLoadingOverlay;
