import { useState } from "react";
import { useInteractionStore } from "@/store/useInteractionStore";
import type { ScenarioInterface } from "@/types";
import PsvInput from "./PsvInput";
import SFC4500 from "@/assets/sfc/sfc_4500.png";
import { DEVICES } from "@/constants/devices";
import { PsvInputGroup } from "./PsvInputGroup";
import PsvButtons from "./PsvButtons";
interface PsvCalculatorModalProps {
  onCreate?: (projectId: string, scenario: ScenarioInterface) => void;
}

const INPUT_ITEMS = [
  { title: "자동차 용기 입력 변수", items: DEVICES.Lq_Tk.props, x: 40, y: 20 },

  {
    title: "자동차 용기 출력 변수",
    items: DEVICES.Lq_Tk.outputProps,
    x: 800,
    y: 20,
  },
];
// charts
import ChartModal from "../charts/ChartModal"; // ✅ ChartModal import
import { multiData, variableDefs } from "../charts/sample-data";

export const PsvModal_4500 = ({}: PsvCalculatorModalProps) => {
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

          {INPUT_ITEMS.map((group, gIdx) => (
            <PsvInputGroup
              key={gIdx}
              title={group.title}
              x={group.x}
              y={group.y}
            >
              <div className="pr-1">
                {group.items?.map((prop: any, i: number) => (
                  <PsvInput
                    key={prop.key ?? i}
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
