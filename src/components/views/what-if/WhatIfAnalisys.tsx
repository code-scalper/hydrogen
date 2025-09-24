import Plotly from "plotly.js-dist-min";
import createPlotlyComponent from "react-plotly.js/factory";

const Plot = createPlotlyComponent(Plotly);

interface WhatIfProps {
	showModal: boolean;
	setShowModal: (arg0: boolean) => void;
	handleEvent: (arg0: string) => void;
}

export const WhatIfAnalisys = ({
	showModal,
	setShowModal,
	handleEvent,
}: WhatIfProps) => {
	if (!showModal) return null;

	// 샘플 데이터
	const data = {
		x: Array.from({ length: 50 }, () => Math.random() * 40 - 30), // Ambient Temp (-30 ~ 10)
		y: Array.from({ length: 50 }, () => Math.random() * 700), // Charging Time
		z: Array.from({ length: 50 }, () => Math.random() * 50 - 40), // Supply Gas Temp
		c: Array.from({ length: 50 }, () => Math.random() * 100 - 50), // 색상용 값
	};

	return (
		<div className="fixed inset-0 bg-stone-600 bg-opacity-40 flex items-center justify-center z-[999] text-xs text-slate-200">
			<div className="bg-gray-800 w-[95%] h-[90%] shadow-lg border border-stone-600 flex flex-col overflow-hidden">
				{/* Header */}
				<div className="flex justify-between items-center p-2 bg-gray-900">
					<h2 className="text-sm text-slate-200 font-semibold">
						What-if 분석 결과
					</h2>
					<button
						type="button"
						onClick={() => setShowModal(false)}
						className="text-slate-300 hover:text-white text-xs"
					>
						×
					</button>
				</div>

				{/* Content */}
				<div className="flex flex-1 overflow-hidden">
					{/* ① 분석표 영역 */}
					<div className="w-[40%] bg-gray-700 p-4 flex flex-col overflow-hidden">
						<table className="w-full border-collapse text-left text-xs">
							<tbody>
								<tr>
									<td className="p-2 border border-gray-600 w-28">시나리오</td>
									<td className="p-2 border border-gray-600">
										프로젝트 1 &gt; 시나리오 1
									</td>
								</tr>
								<tr>
									<td className="p-2 border border-gray-600">외기 온도</td>
									<td className="p-2 border border-gray-600">
										-30 ℃ 부터 0 ℃ 까지
									</td>
								</tr>
								<tr>
									<td className="p-2 border border-gray-600">공급 가스 온도</td>
									<td className="p-2 border border-gray-600">
										-40 ℃ 부터 10 ℃ 까지
									</td>
								</tr>
								<tr>
									<td className="p-2 border border-gray-600">결과 종류</td>
									<td className="p-2 border border-gray-600">
										<select className="bg-gray-700 border border-gray-600 px-2 py-1 w-full">
											<option>충전 중 최고 온도</option>
											<option>충전 시간</option>
											<option>안전 거리</option>
										</select>
									</td>
								</tr>
							</tbody>
						</table>

						{/* 분석표 아래 영역 - 스크롤 가능 */}
						<div className="mt-6 flex-1 flex flex-col overflow-y-auto">
							<div className="text-center text-gray-400 mb-2">
								시뮬레이션 분석표 표시 창
							</div>
							<div className="w-full flex-1 bg-red-500 min-h-[200px]" />
						</div>
					</div>

					{/* ⑤ 그래프 영역 */}
					<div className="flex-1 bg-gray-800 flex items-center justify-center">
						<Plot
							data={[
								{
									x: data.x,
									y: data.y,
									z: data.z,
									mode: "markers",
									type: "scatter3d",
									marker: {
										size: 5,
										color: data.c,
										colorscale: "Jet",
										showscale: true,
										colorbar: { title: "℃" },
									},
								} as Partial<Plotly.Data>,
							]}
							layout={{
								autosize: true,
								margin: { l: 0, r: 0, b: 0, t: 20 },
								scene: {
									xaxis: { title: { text: "Ambient Temp." } },
									yaxis: { title: { text: "Charging Time" } },
									zaxis: { title: { text: "Supply Gas Temp." } },
								},
							}}
							style={{ width: "100%", height: "100%" }}
						/>
					</div>
				</div>

				{/* Footer */}
				<div className="flex justify-center gap-4 px-4 py-3 border-t border-stone-700 bg-gray-900">
					<button
						type="button"
						onClick={() => handleEvent("prev")}
						className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-xs text-white"
					>
						이전
					</button>
					<button
						type="button"
						onClick={() => handleEvent("save")}
						className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-xs text-white"
					>
						저장
					</button>
					<button
						type="button"
						onClick={() => setShowModal(false)}
						className="px-6 py-2 bg-blue-700 hover:bg-blue-800 text-xs text-white"
					>
						닫기
					</button>
				</div>
			</div>
		</div>
	);
};
