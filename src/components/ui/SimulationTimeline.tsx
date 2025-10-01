import { type ChangeEvent, useEffect, useMemo, useState } from "react";

import useSimulationStore from "@/store/useSimulationStore";

const formatTime = (seconds: number) => {
	if (!Number.isFinite(seconds)) return "00:00";
	const safeSeconds = Math.max(0, Math.floor(seconds));
	const mins = String(Math.floor(safeSeconds / 60)).padStart(2, "0");
	const secs = String(safeSeconds % 60).padStart(2, "0");
	return `${mins}:${secs}`;
};

interface SimulationTimelineProps {
	width?: number;
}

const SimulationTimeline = ({ width = 240 }: SimulationTimelineProps) => {
	const totalDuration = useSimulationStore((state) => state.totalDuration);
	const currentTime = useSimulationStore((state) => state.currentTime);
	const playing = useSimulationStore((state) => state.playing);
	const pause = useSimulationStore((state) => state.pause);
	const resume = useSimulationStore((state) => state.resume);
	const playFromStart = useSimulationStore((state) => state.playFromStart);
	const seekTo = useSimulationStore((state) => state.seekTo);

	const [isScrubbing, setIsScrubbing] = useState(false);
	const [scrubTime, setScrubTime] = useState(currentTime);
	const [wasPlaying, setWasPlaying] = useState(false);

	useEffect(() => {
		if (!isScrubbing) {
			setScrubTime(currentTime);
		}
	}, [currentTime, isScrubbing]);

	const sliderMax = useMemo(() => {
		return totalDuration > 0 ? totalDuration : 0;
	}, [totalDuration]);

	const finishScrub = () => {
		setIsScrubbing(false);
		if (wasPlaying) {
			resume();
		}
		setWasPlaying(false);
	};

	const handlePointerDown = () => {
		setIsScrubbing(true);
		setWasPlaying(playing);
		if (playing) {
			pause();
		}
	};

	const handlePointerUp = () => {
		finishScrub();
	};

	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		const next = Number.parseFloat(event.target.value);
		if (!Number.isFinite(next)) {
			return;
		}
		setScrubTime(next);
		seekTo(next);
	};

	const handleDoubleClick = () => {
		if (totalDuration <= 0) return;
		playFromStart();
	};

	const displayTime = isScrubbing ? scrubTime : currentTime;

	return (
		<div className="flex items-center gap-2 text-[11px] text-slate-300 select-none">
			<span className="w-12 text-right font-mono">
				{formatTime(displayTime)}
			</span>
			<div className="flex items-center" style={{ width }}>
				<input
					type="range"
					min={0}
					max={sliderMax}
					step={0.1}
					value={displayTime}
					onChange={handleChange}
					onPointerDown={handlePointerDown}
					onPointerUp={handlePointerUp}
					onPointerCancel={finishScrub}
					onBlur={finishScrub}
					onDoubleClick={handleDoubleClick}
					disabled={sliderMax <= 0}
					className="h-1 w-full cursor-pointer accent-emerald-400 disabled:opacity-40"
				/>
			</div>
			<span className="w-12 font-mono text-slate-400 text-right">
				{formatTime(totalDuration)}
			</span>
		</div>
	);
};

export default SimulationTimeline;
