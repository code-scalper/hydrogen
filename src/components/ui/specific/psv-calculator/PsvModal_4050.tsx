import SFC4050 from "@/assets/sfc/sfc_4050.png";
import { DEVICES } from "@/constants/devices";
import { useInteractionStore } from "@/store/useInteractionStore";
import type { DeviceProperty, ScenarioInterface } from "@/types";
import { type FC, useState } from "react";
import ChartModal from "../charts/ChartModal"; // ✅ ChartModal import
import { singleChartData } from "../charts/sample-data";
import PsvButtons from "./PsvButtons";
import PsvInput from "./PsvInput";
import { PsvInputGroup } from "./PsvInputGroup";

interface PsvCalculatorModalProps {
	onCreate?: (projectId: string, scenario: ScenarioInterface) => void;
}

const INPUT_ITEMS: Array<{
	title: string;
	items?: DeviceProperty[];
	x: number;
	y: number;
}> = [
	{ title: "자동차 용기 입력 변수", items: DEVICES.TkVe1.props, x: 40, y: 60 },
	{ title: "충전기 입력 변수", items: DEVICES.Disp1.props, x: 40, y: 280 },
	{
		title: "자동차 용기 출력 변수",
		items: DEVICES.TkVe1.outputProps,
		x: 700,
		y: 340,
	},
	{
		title: "충전기 출력 변수",
		items: DEVICES.Disp1.outputProps,
		x: 480,
		y: 60,
	},
];

export const PsvModal_4050: FC<PsvCalculatorModalProps> = () => {
	const psvOpen = useInteractionStore((s) => s.psvOpen);
	const setPsvOpen = useInteractionStore((s) => s.setPsvOpen);

	const [chartOpen, setChartOpen] = useState(false);

	if (!psvOpen) return null;

	return (
		<div className="fixed inset-0 bg-stone-600 bg-opacity-40 flex items-center justify-center z-50 text-xs">
			<div className="bg-gray-800 w-[96%] h-[90%] shadow-lg border border-stone-600 flex flex-col">
				{/* Header */}
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

				{/* Content */}
				<div className="relative flex-1 p-4 overflow-auto h-full">
					{/* 배경 이미지 */}
					<div className="absolute inset-x-0 top-0 p-5 overflow-hidden flex-1 h-full">
						<img
							src={SFC4050}
							alt="psv1"
							className="block ml-auto max-w-full h-auto relative right-[50px] top-[130px]"
						/>
					</div>

					{/* === INPUT_ITEMS 렌더 === */}
					{INPUT_ITEMS.map((group) => (
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
										value={prop.value}
										unit={prop.unit ?? "-"}
										onChange={() => {
											// TODO: 상태 업데이트 로직
										}}
									/>
								))}
							</div>
						</PsvInputGroup>
					))}
				</div>

				{/* Footer */}
				<PsvButtons setPsvOpen={setPsvOpen} setChartOpen={setChartOpen} />
			</div>

			{/* ✅ ChartModal 호출 */}
			<ChartModal
				open={chartOpen}
				onClose={() => setChartOpen(false)}
				type="line"
				data={singleChartData}
				showTable={false}
			/>
		</div>
	);
};
