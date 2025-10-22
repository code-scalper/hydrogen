import Plotly from "plotly.js-dist-min";
import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import type { PlotParams } from "react-plotly.js";
import createPlotlyComponent from "react-plotly.js/factory";

const Plot = createPlotlyComponent(Plotly);

interface PlotlyWrapperProps {
	children: (props: {
		Plot: typeof Plot;
		plotEvents: Pick<PlotParams, "onInitialized" | "onUpdate">;
	}) => ReactNode;
}

const PlotlyWrapper = ({ children }: PlotlyWrapperProps) => {
	const plotRef = useRef<HTMLElement | null>(null);

	const handleGraphLifecycle: NonNullable<PlotParams["onInitialized"]> = (
		figure,
		graphDiv,
	) => {
		plotRef.current = graphDiv as HTMLElement;
		return figure;
	};

	useEffect(() => {
		return () => {
			const element = plotRef.current;
			if (element) {
				try {
					Plotly.purge(element);
				} catch (error) {
					console.warn("Plotly purge failed", error);
				}
			}
		};
	}, []);

	return (
		<>
			{children({
				Plot,
				plotEvents: {
					onInitialized: handleGraphLifecycle,
					onUpdate: handleGraphLifecycle,
				},
			})}
		</>
	);
};

export default PlotlyWrapper;
