import { useState } from "react";
import createPlotlyComponent from "react-plotly.js/factory";
import Plotly from "plotly.js-dist-min";

const Plot = createPlotlyComponent(Plotly);

interface EconomicEvaluationWithGraphProps {
  showModal: boolean;
  setShowModal: (arg0: boolean) => void;
}

export const EconomicEvaluationWithGraph = ({
  showModal,
  setShowModal,
}: EconomicEvaluationWithGraphProps) => {
  const [selectedResult, setSelectedResult] = useState<any | null>(null);

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-stone-600 bg-opacity-40 flex items-center justify-center z-[999] text-xs text-slate-200">
      <div className="bg-gray-800 w-[96%] h-[90%] rounded-md shadow-lg border border-stone-600 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-2 bg-gray-900">
          <h2 className="text-xs text-slate-200 font-semibold">
            시뮬레이션 결과
          </h2>
          <button
            onClick={() => setShowModal(false)}
            className="text-slate-300 hover:text-white text-xs"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-1 overflow-hidden mt-5">
          {/* 왼쪽 리스트 */}
          <div className="flex flex-col w-[35%] bg-gray-700 rounded overflow-y-auto">
            <table className="w-full table-fixed border-collapse text-left text-xs">
              <thead className="bg-gray-900 text-slate-200 sticky top-0">
                <tr>
                  <th className="px-2 h-[32px] border border-gray-600 w-20">
                    시나리오
                  </th>
                  <th className="px-2 h-[32px] border border-gray-600">
                    장치명
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  "수소튜브트레일러1",
                  "종압축기1",
                  "중압탱크",
                  "PSV_중압탱크",
                  "고압탱크",
                  "PSV_고압탱크",
                  "V130-1",
                  "V140-1",
                  "V150-1",
                  "V130-2",
                  "V140-2",
                  "V150-2",
                ].map((item) => (
                  <tr key={item} className="hover:bg-gray-600">
                    <td className="px-2 h-[32px] border border-gray-600 text-center">
                      <input type="checkbox" className="accent-blue-500" />
                    </td>
                    <td className="px-2 h-[32px] border border-gray-600">
                      {item}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 오른쪽 결과 테이블 */}
          <div className="flex-1 bg-gray-700 rounded overflow-y-auto">
            <table className="w-full table-fixed border-collapse text-left text-xs">
              <thead className="bg-gray-900 text-slate-200 sticky top-0">
                <tr>
                  <th className="px-2 h-[32px] border border-gray-600">
                    결과명
                  </th>
                  <th className="px-2 h-[32px] border border-gray-600">
                    결과값
                  </th>
                  <th className="px-2 h-[32px] border border-gray-600">단위</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: "TT 내부 압력", value: 0, unit: "ea" },
                  { name: "TT 내부 온도", value: 0, unit: "ea" },
                  { name: "TT 내부 가스 질량", value: 0, unit: "-" },
                  { name: "중압탱크 압력", value: 0, unit: "MPa" },
                  { name: "중압탱크 온도", value: 0, unit: "°C" },
                  { name: "중압탱크 가스 질량", value: 0, unit: "kg" },
                  { name: "중압탱크 SOC", value: 0, unit: "%" },
                  { name: "고압탱크 압력", value: 0, unit: "MPa" },
                  { name: "고압탱크 온도", value: 0, unit: "°C" },
                  { name: "고압탱크 가스 질량", value: 0, unit: "kg" },
                  { name: "고압탱크 SOC", value: 0, unit: "%" },
                  { name: "압력상승률", value: 0, unit: "MPa/min" },
                ].map((row) => (
                  <tr
                    key={row.name}
                    className="hover:bg-gray-600 cursor-pointer"
                    onClick={() => setSelectedResult(row)}
                  >
                    <td className="px-2 h-[32px] border border-gray-600">
                      {row.name}
                    </td>
                    <td className="px-2 h-[32px] border border-gray-600 text-right">
                      {row.value}
                    </td>
                    <td className="px-2 h-[32px] border border-gray-600">
                      {row.unit}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 그래프 영역 */}
          <div className="w-[40%] bg-gray-800 flex items-center justify-center">
            {selectedResult ? (
              <Plot
                data={[
                  {
                    x: Array.from({ length: 50 }, (_, i) => i - 25),
                    y: Array.from({ length: 50 }, () => Math.random() * 700),
                    z: Array.from(
                      { length: 50 },
                      () => Math.random() * 70 - 30
                    ),
                    mode: "markers",
                    marker: {
                      size: 6,
                      color: Array.from(
                        { length: 50 },
                        () => Math.random() * 70
                      ),
                      colorscale: "Jet",
                      showscale: true,
                    },
                    type: "scatter3d",
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
            ) : (
              <p className="text-gray-400">
                결과값을 선택하면 그래프가 표시됩니다.
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-center gap-2 px-4 py-3 border-t border-stone-700 bg-gray-900">
          <button
            onClick={() => alert("저장 기능")}
            className="text-xs px-6 py-2 bg-gray-500 text-gray-200 hover:bg-gray-600"
          >
            저장
          </button>
          <button
            onClick={() => setShowModal(false)}
            className="text-xs px-6 py-2 bg-blue-700 text-gray-200 hover:bg-gray-600"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
