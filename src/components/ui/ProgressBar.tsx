import * as Progress from "@radix-ui/react-progress";

import "@/css/progress-bar.css";

import useSimulationStore from "@/store/useSimulationStore";

const ProgressBar = () => {
	const currentTime = useSimulationStore((state) => state.currentTime);
	const totalDuration = useSimulationStore((state) => state.totalDuration);

	const progress = totalDuration > 0 ? (currentTime / totalDuration) * 100 : 0;
	const clamped = Math.min(100, Math.max(0, progress));

	return (
		<Progress.Root className="ProgressRoot" value={clamped}>
			<Progress.Indicator
				className="ProgressIndicator"
				style={{ transform: `translateX(-${100 - clamped}%)` }}
			/>
		</Progress.Root>
	);
};

export default ProgressBar;
