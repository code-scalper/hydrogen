import { useEffect, useMemo, useState } from "react";

interface LogLine {
	ts?: string;
	level?: string;
	code?: string;
	desc?: string;
	solution?: { ko?: string; en?: string };
}

interface RecentLog {
	date: string;
	entries: LogLine[];
}

interface LogHistoryModalProps {
	isOpen: boolean;
	onClose: () => void;
}

const weekdayNames = ["일", "월", "화", "수", "목", "금", "토"];

const formatDateLabel = (date: string) => {
	const asDate = new Date(`${date}T00:00:00`);
	if (Number.isNaN(asDate.getTime())) {
		return date;
	}
	const weekday = weekdayNames[asDate.getDay()];
	return `${date} (${weekday})`;
};

const extractTime = (timestamp?: string) => {
	if (!timestamp) return "";
	const parts = timestamp.split(" ");
	return parts.length > 1 ? parts[1] : timestamp;
};

const buildSummary = (line: LogLine) => {
	const codeAndLevel = [line.code, line.level]
		.filter((value) => Boolean(value))
		.join(" · ");
	return codeAndLevel;
};

export const LogHistoryModal = ({ isOpen, onClose }: LogHistoryModalProps) => {
	const [logs, setLogs] = useState<RecentLog[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!isOpen) {
			return;
		}

		let cancelled = false;
		setLoading(true);
		setError(null);

		window.electronAPI
			.readRecentLogs()
			.then((data) => {
				if (!cancelled) {
					setLogs(Array.isArray(data) ? data : []);
				}
			})
			.catch((err) => {
				if (!cancelled) {
					console.error("로그 로드 실패", err);
					setError("로그 데이터를 불러오지 못했습니다.");
					setLogs([]);
				}
			})
			.finally(() => {
				if (!cancelled) {
					setLoading(false);
				}
			});

		return () => {
			cancelled = true;
		};
	}, [isOpen]);

	const modalBody = useMemo(() => {
		if (loading) {
			return <p className="text-slate-300">불러오는 중...</p>;
		}

		if (error) {
			return <p className="text-rose-400">{error}</p>;
		}

		if (logs.length === 0) {
			return <p className="text-slate-300">최근 로그가 없습니다.</p>;
		}

		return (
			<div className="space-y-4 max-h-[360px] overflow-y-auto pr-1">
				{logs.map((daily) => (
					<div key={daily.date} className="rounded-md border border-slate-700 bg-slate-800/80 p-3">
						<div className="flex items-center justify-between text-xs text-slate-200 font-semibold">
							<span>{formatDateLabel(daily.date)}</span>
							<span className="text-slate-400">
								{daily.entries.length > 0 ? `${daily.entries.length}건` : "데이터 없음"}
							</span>
						</div>
						<div className="mt-2 space-y-3 text-xs text-slate-200">
							{daily.entries.length === 0 ? (
								<p className="text-slate-400">해당 날짜의 로그가 없습니다.</p>
							) : (
								daily.entries.map((entry, index) => {
									const time = extractTime(entry.ts);
									const summary = buildSummary(entry);
									return (
										<div key={`${entry.ts ?? index}-${index}`} className="border-l border-slate-600 pl-3">
											<p className="font-semibold text-slate-100">
												{time ? `${time} · ` : ""}
												{entry.desc ?? "설명 없음"}
											</p>
											{entry.solution?.ko && (
												<p className="text-slate-300">{entry.solution.ko}</p>
											)}
											{summary && (
												<p className="text-slate-500">{summary}</p>
											)}
										</div>
									);
								})
							)}
						</div>
					</div>
				))}
			</div>
		);
	}, [error, loading, logs]);

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-[1000] flex items-start justify-end bg-black/40 p-4">
			<div className="w-full max-w-md rounded-lg border border-slate-700 bg-slate-900/95 shadow-xl">
				<div className="flex items-center justify-between border-b border-slate-700 px-4 py-2">
					<h2 className="text-sm font-semibold text-slate-100">
						실행 로그 내역 확인
					</h2>
					<button
						type="button"
						onClick={onClose}
						className="rounded px-2 py-1 text-xs text-slate-300 hover:bg-slate-700"
					>
						닫기
					</button>
				</div>
				<div className="px-4 py-3 text-xs text-slate-200">{modalBody}</div>
			</div>
		</div>
	);
};

export default LogHistoryModal;
