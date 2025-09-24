import SFC4500 from "@/assets/sfc/sfc_4500.png";
import { DEVICES } from "@/constants/devices";
import { useInteractionStore } from "@/store/useInteractionStore";
import type { DeviceProperty, ScenarioInterface } from "@/types";
import { type FC, useState } from "react";
import ChartModal from "../charts/ChartModal"; // ✅ ChartModal import
import { multiData, variableDefs } from "../charts/sample-data";
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
	{ title: "자동차 용기 입력 변수", items: DEVICES.Lq_Tk.props, x: 40, y: 20 },
	{
		title: "자동차 용기 출력 변수",
		items: DEVICES.Lq_Tk.outputProps,
		x: 800,
		y: 20,
	},
];

export const PsvModal_4500: FC<PsvCalculatorModalProps> = () => {
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
					{/* 배경 이미지 (컨테이너 폭 안에서만 표시) */}
					<div className="absolute inset-x-0 top-0 p-5 overflow-hidden h-full">
						<img
							src={SFC4500}
							alt="psv1"
							className="block ml-auto max-w-full h-auto relative left-[-50px] top-[150px]"
						/>
					</div>

					{/* === 여기부터 INPUT_ITEMS 렌더 (x,y에 따라 배치) === */}

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
											// TODO: 상태/스토어에 맞춰 업데이트 로직 작성
											// 예) updateDeviceProp(group.title, prop.key, v)
										}}
									/>
								))}
							</div>
						</PsvInputGroup>
					))}
					<PsvInputGroup title="[On/Off Switch]" x={420} y={20}>
						<div>Hello</div>
					</PsvInputGroup>
					{/* === INPUT_ITEMS 렌더 끝 === */}
				</div>

				{/* Footer */}
				<PsvButtons setPsvOpen={setPsvOpen} setChartOpen={setChartOpen} />
				{/* ✅ ChartModal 호출 */}
				<ChartModal
					open={chartOpen}
					onClose={() => setChartOpen(false)}
					type="multi"
					data={multiData}
					variables={variableDefs}
					showTable={true}
				/>
			</div>
		</div>
	);
};
