import SFC4500 from "@/assets/sfc/sfc_4500.png";
import { DEVICES } from "@/constants/devices";
import useOutputTotalDownloader from "@/hooks/useOutputTotalDownloader";
import { usePsvSimulation } from "@/hooks/usePsvSimulation";
import { useInteractionStore } from "@/store/useInteractionStore";
import type { DeviceProperty, ScenarioInterface } from "@/types";
import clsx from "clsx";
import { type FC, useMemo, useState } from "react";

import ChartModal from "../charts/ChartModal";
import PsvButtons from "./PsvButtons";
import PsvInput from "./PsvInput";
import { PsvInputGroup } from "./PsvInputGroup";
import { usePsvTypeTabs } from "./usePsvTypeTabs";

interface PsvCalculatorModalProps {
	onCreate?: (projectId: string, scenario: ScenarioInterface) => void;
}

type GroupKind = "input" | "output";

type GroupDefinition = {
	title: string;
	items?: DeviceProperty[];
	x: number;
	y: number;
	kind: GroupKind;
};

type ChartVariable = {
	key: string;
	name: string;
	unit: string;
	plotId: string;
};

const GROUPS: GroupDefinition[] = [
	{
		title: "탱크 입력 변수",
		items: DEVICES.Lq_Tk.props,
		x: 60,
		y: 20,
		kind: "input",
	},
	{
		title: "탱크 출력 변수",
		items: DEVICES.Lq_Tk.outputProps,
		x: 520,
		y: 20,
		kind: "output",
	},
];

const DIAGRAM = {
	x: 520,
	y: 30,
	width: 760,
	height: 620,
};

const CHART_VARIABLES: ChartVariable[] = [
	{
		key: "T_GTkO",
		name: "T_GTkO",
		unit: "-",
		plotId: "PlotLqTk1 · Tank Temperatures",
	},
	{
		key: "T_ITkO",
		name: "T_ITkO",
		unit: "-",
		plotId: "PlotLqTk1 · Tank Temperatures",
	},
	{
		key: "T_LTkO",
		name: "T_LTkO",
		unit: "-",
		plotId: "PlotLqTk1 · Tank Temperatures",
	},
	{
		key: "P_GTkO",
		name: "P_GTkO",
		unit: "-",
		plotId: "PlotLqTk1 · Tank Pressures",
	},
	{
		key: "P_OpStO_LqTk",
		name: "P_OpStO_LqTk",
		unit: "-",
		plotId: "PlotLqTk1 · Tank Pressures",
	},
	{
		key: "P_ReseatO_LqTk",
		name: "P_ReseatO_LqTk",
		unit: "-",
		plotId: "PlotLqTk1 · Tank Pressures",
	},
	{
		key: "m_BOGO",
		name: "m_BOGO",
		unit: "-",
		plotId: "PlotLqTk1 · Mass Flows",
	},
	{
		key: "m_PSVO_LqTk",
		name: "m_PSVO_LqTk",
		unit: "-",
		plotId: "PlotLqTk1 · Mass Flows",
	},
	{ key: "Q_InGO", name: "Q_InGO", unit: "-", plotId: "PlotLqTk2" },
	{ key: "Q_InLO", name: "Q_InLO", unit: "-", plotId: "PlotLqTk2" },
	{ key: "Q_InGIO", name: "Q_InGIO", unit: "-", plotId: "PlotLqTk2" },
	{ key: "Q_InILO", name: "Q_InILO", unit: "-", plotId: "PlotLqTk2" },
];

const flattenProps = (groups: GroupDefinition[], kind: GroupKind) =>
	groups
		.filter((group) => group.kind === kind)
		.flatMap((group) => group.items ?? []);

export const PsvModal_4500: FC<PsvCalculatorModalProps> = () => {
	const psvOpen = useInteractionStore((s) => s.psvOpen);
	const setPsvOpen = useInteractionStore((s) => s.setPsvOpen);
	const [chartOpen, setChartOpen] = useState(false);

	const inputProps = useMemo(() => flattenProps(GROUPS, "input"), []);
	const outputProps = useMemo(() => flattenProps(GROUPS, "output"), []);

	const {
		inputs,
		outputs,
		chartData,
		running,
		outputDate,
		runSimulation,
		setInputValue,
		loadInputs,
	} = usePsvSimulation({
		sfc: "4500",
		inputProps,
		outputProps,
	});

	const downloadOutputTotal = useOutputTotalDownloader(outputDate);
	const { typeTabs, activeType, selectType } = usePsvTypeTabs({
		sfc: "4500",
		inputProps,
		inputs,
		loadInputs,
	});

	const chartVariables = useMemo(() => CHART_VARIABLES, []);

	const handleOpenChart = () => {
		if (chartData.length === 0) return;
		setChartOpen(true);
	};

	const handleRun = () => {
		void runSimulation().catch((error) => {
			console.error("PSV 4500 simulation failed", error);
		});
	};

	const getValueForProp = (kind: GroupKind, key?: string) => {
		if (!key) return "";
		return kind === "input" ? (inputs[key] ?? "") : (outputs[key] ?? "");
	};

	if (!psvOpen) return null;

	return (
		<div className="fixed inset-0 bg-stone-600 bg-opacity-40 flex items-center justify-center z-50 text-xs">
			<div className="relative bg-gray-800 w-[1320px] max-w-[95vw] h-[90%] shadow-lg border border-stone-600 flex flex-col">
				<div className="flex justify-between items-center p-2 bg-gray-900">
					<h2 className="text-xs text-slate-200 font-semibold">
						시나리오 생성
					</h2>
					<button
						type="button"
						onClick={() => setPsvOpen(false)}
						className="text-slate-300 hover:text-white text-xs"
					>
						×
					</button>
				</div>

				{typeTabs.length > 0 && (
					<div className="flex items-center gap-2 px-4 py-2 border-b border-stone-700 bg-slate-900">
						{typeTabs.map((tab) => (
							<button
								key={tab.key}
								type="button"
								onClick={() => selectType(tab.key)}
								className={clsx(
									"px-3 py-1 text-xs font-medium rounded transition",
									activeType === tab.key
										? "bg-emerald-500/20 text-emerald-100 border border-emerald-400"
										: "bg-slate-800 text-slate-300 hover:text-white",
								)}
							>
								{tab.label}
							</button>
						))}
					</div>
				)}

				<div className="relative flex-1 p-4 overflow-auto h-full">
					<div
						className="pointer-events-none absolute"
						style={{
							left: `${DIAGRAM.x}px`,
							top: `${DIAGRAM.y}px`,
							width: `${DIAGRAM.width}px`,
							height: `${DIAGRAM.height}px`,
						}}
					>
						<img
							src={SFC4500}
							alt="psv4500"
							className="h-full w-full object-contain"
						/>
					</div>

					{GROUPS.map((group) => (
						<PsvInputGroup
							key={group.title}
							title={group.title}
							x={group.x}
							y={group.y}
						>
							<div className="pr-1">
								{group.items?.map((prop) => (
									<PsvInput
										key={prop.key ?? `${group.title}-${prop.name}`}
										label={prop.name}
										value={getValueForProp(group.kind, prop.key)}
										unit={prop.unit ?? "-"}
										disabled={group.kind === "output"}
										onChange={(value) => {
											if (group.kind === "input" && prop.key) {
												setInputValue(prop.key, value);
											}
										}}
									/>
								))}
							</div>
						</PsvInputGroup>
					))}
				</div>

				<PsvButtons
					onClose={() => setPsvOpen(false)}
					onRun={handleRun}
					onOpenChart={handleOpenChart}
					onSave={downloadOutputTotal}
					disabled={running}
					chartDisabled={chartData.length === 0}
				/>

				{running && (
					<div className="absolute inset-0 bg-black/40 flex items-center justify-center text-sm text-white">
						계산을 실행 중입니다...
					</div>
				)}

				<ChartModal
					open={chartOpen}
					onClose={() => setChartOpen(false)}
					type="multi"
					data={chartData}
					variables={chartVariables}
					showTable={false}
				/>
			</div>
		</div>
	);
};
