import { PlayIcon, StopIcon } from "@radix-ui/react-icons";

import { useInteractionStore } from "@/store/useInteractionStore";
import useSimulationStore from "@/store/useSimulationStore";

import BaseAvatar from "../ui/BaseAvatar";
import BaseSeparator from "../ui/BaseSeperator";
import ProgressBar from "../ui/ProgressBar";
import FooterTools from "./FooterTools";
const formatTime = (seconds: number) => {
	const safeSeconds = Number.isFinite(seconds)
		? Math.max(0, Math.floor(seconds))
		: 0;
	const hrs = String(Math.floor(safeSeconds / 3600)).padStart(2, "0");
	const mins = String(Math.floor((safeSeconds % 3600) / 60)).padStart(2, "0");
	const secs = String(safeSeconds % 60).padStart(2, "0");
	return `${hrs}:${mins}:${secs}`;
};
const BaseFooter = () => {
	const currentTime = useSimulationStore((state) => state.currentTime);
	const totalDuration = useSimulationStore((state) => state.totalDuration);
	const playing = useSimulationStore((state) => state.playing);
	const playFromStart = useSimulationStore((state) => state.playFromStart);
	const pause = useSimulationStore((state) => state.pause);
	const stop = useSimulationStore((state) => state.stop);
	const resume = useSimulationStore((state) => state.resume);
	const hasInvalidInputs = useInteractionStore(
		(state) => Object.keys(state.invalidInputKeys).length > 0,
	);

	const playDisabled = hasInvalidInputs;

	const elapsedSeconds = formatTime(currentTime);
	const totalSeconds = formatTime(totalDuration);

	const handlePlayClick = () => {
		if (playDisabled) {
			console.warn("유효하지 않은 입력값이 있어 실행을 막았습니다.");
			return;
		}

		if (playing) {
			pause();
			return;
		}

		if (totalDuration > 0 && currentTime >= totalDuration) {
			playFromStart();
			return;
		}

		if (currentTime > 0 && totalDuration > 0) {
			resume();
			return;
		}

		playFromStart();
	};

	return (
		<div className="bg-slate-700/90 flex justify-between p-2 px-4">
			<div className="flex items-center">
				<BaseAvatar />
				<BaseSeparator />
				<ul className="flex space-x-2 cursor-pointer">
					<li>
						<button
							type="button"
							onClick={handlePlayClick}
							disabled={playDisabled}
							title={
								playDisabled
									? "숫자 입력값을 모두 유효하게 수정해야 실행할 수 있습니다."
									: undefined
							}
							className="flex items-center justify-center rounded bg-transparent p-1 text-emerald-500 hover:bg-slate-600/60 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							<PlayIcon className="w-4 h-4" />
						</button>
					</li>
					<li>
						<button
							type="button"
							onClick={stop}
							className="flex items-center justify-center rounded bg-transparent p-1 text-rose-500 hover:bg-slate-600/60"
						>
							<StopIcon className="w-4 h-4" />
						</button>
					</li>
					{/* <li>
            <PlusIcon className="w-4 h-4 text-white" />
          </li>
          <li>
            <DownloadIcon className="w-4 h-4 text-white" />
          </li> */}
				</ul>
			</div>

			<div className="flex items-center ">
				<div className="text-slate-400 text-xs w-[130px] text-right mr-4">
					{elapsedSeconds} / {totalSeconds}
				</div>
				<ProgressBar />

				<div className="flex items-center">
					<BaseSeparator />
					<FooterTools />
				</div>
			</div>
		</div>
	);
};

export default BaseFooter;
