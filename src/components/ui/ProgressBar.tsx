import { Progress } from "radix-ui";
import * as React from "react";
import "@/css/progress-bar.css";

const ProgressBar = () => {
	const [progress, setProgress] = React.useState(13);

	React.useEffect(() => {
		const timer = setTimeout(() => setProgress(66), 500);
		return () => clearTimeout(timer);
	}, []);

	return (
		<Progress.Root className="ProgressRoot" value={progress}>
			<Progress.Indicator
				className="ProgressIndicator"
				style={{ transform: `translateX(-${100 - progress}%)` }}
			/>
		</Progress.Root>
	);
};

export default ProgressBar;
