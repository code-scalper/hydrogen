import { useInteractionStore } from "@/store/useInteractionStore";

import type { ScenarioInterface } from "@/types";

// custom components
import PsvInput from "./PsvInput";

interface PsvCalculatorModalProps {
  onCreate: (projectId: string, scenario: ScenarioInterface) => void;
}

const properties1 = [
  { name: "분출계수(Kb)", key: "kb", value: "", unit: "-" },
  { name: "배관보정계수(Kb)", key: "kb_pipe", value: "", unit: "-" },
  { name: "파열판설정계수(Kc)", key: "kc", value: "", unit: "-" },
  {
    name: "PSV 개방계시압력 대비 설정압력 비율",
    key: "psv_ratio",
    value: "",
    unit: "-",
  },
  { name: "Tank 표면온도", key: "tank_temp", value: "", unit: "K" },
];
const properties2 = [
  { name: "분출계수(Kb)", key: "kb", value: "", unit: "-" },
  { name: "배관보정계수(Kb)", key: "kb_pipe", value: "", unit: "-" },
  { name: "파열판설정계수(Kc)", key: "kc", value: "", unit: "-" },
  {
    name: "PSV 개방계시압력 대비 설정압력 비율",
    key: "psv_ratio",
    value: "",
    unit: "-",
  },
  { name: "Tank 표면온도", key: "tank_temp", value: "", unit: "K" },
];
export const PsvModal1 = ({ onCreate }: PsvCalculatorModalProps) => {
  const psvOpen = useInteractionStore((state) => state.psvOpen);
  const setPsvOpen = useInteractionStore((state) => state.setPsvOpen);

  if (!psvOpen) return null;

  return (
    <div className="fixed inset-0 bg-stone-600 bg-opacity-40 flex items-center justify-center z-50 text-xs">
      <div className="bg-gray-800 rounded-md w-[96%] h-[90%] shadow-lg border border-gray-800 border-r">
        {/* Header */}
        <div className="flex justify-between items-center  p-2 bg-gray-900">
          <h2 className="text-xs text-slate-200  font-semibold">
            시나리오 생성
          </h2>
          <button
            onClick={() => setPsvOpen(false)}
            className="text-slate-300 hover:text-black text-xs"
          >
            ×
          </button>
        </div>

        {/* 여기에 컨텐츠 */}
        <div className="flex flex-wrap gap-4 p-4 relative h-full">
          <div className="absolute top-0 w-full h-full flex items-center justify-center p-[200px]">
            <img
              src="/src/assets/psv/psv1.png"
              alt="psv1"
              className="w-[90%]"
            />
          </div>
          <div className="w-[320px] bg-gray-700 overflow-y-auto text-[10px]">
            <p className="bg-stone-700 p-2">
              Input Specification: Pressure safety value
            </p>
            {properties1.map((prop, index) => (
              <PsvInput
                key={index}
                label={prop.name}
                value={prop.value}
                unit={prop.unit}
                onChange={(val) => {
                  // prop 업데이트 로직
                }}
              />
            ))}
            <p className="bg-stone-700 p-2">
              Input Specification: Pressure safety value
            </p>
            {properties2.map((prop, index) => (
              <PsvInput
                key={index}
                label={prop.name}
                value={prop.value}
                unit={prop.unit}
                onChange={(val) => {
                  // prop 업데이트 로직
                }}
              />
            ))}
          </div>
          {/* 다른 영역들도 같은 방식으로 배치 */}
          <div className="absolute top-0 right-0 bg-gray-700">
            <p className="bg-stone-700 p-2">
              Input Specification: Pressure safety value
            </p>
            {properties2.map((prop, index) => (
              <PsvInput
                key={index}
                label={prop.name}
                value={prop.value}
                unit={prop.unit}
                onChange={(val) => {
                  // prop 업데이트 로직
                }}
              />
            ))}
          </div>
          <div className="absolute bottom-0 right-[50%] bg-gray-700">
            <p className="bg-stone-700 p-2">
              Input Specification: Pressure safety value
            </p>
            {properties2.map((prop, index) => (
              <PsvInput
                key={index}
                label={prop.name}
                value={prop.value}
                unit={prop.unit}
                onChange={(val) => {
                  // prop 업데이트 로직
                }}
              />
            ))}
          </div>
          <div className="absolute bottom-0 right-0 bg-gray-700">
            <p className="bg-stone-700 p-2">
              Input Specification: Pressure safety value
            </p>
            {properties2.map((prop, index) => (
              <PsvInput
                key={index}
                label={prop.name}
                value={prop.value}
                unit={prop.unit}
                onChange={(val) => {
                  // prop 업데이트 로직
                }}
              />
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2 px-4 py-3">
          <button
            onClick={() => setPsvOpen(false)}
            className="text-xs px-4 py-1  bg-gray-500 text-gray-200 hover:bg-gray-600"
          >
            취소
          </button>
          {/* <button
						onClick={() => {
							onCreate(selectedProjectId, { ...selectedScenario, name });
							setName("");
							onClose();
						}}
						className="text-xs px-4 py-1  bg-blue-500 text-white hover:bg-blue-600"
					>
						생성
					</button> */}
        </div>
      </div>
    </div>
  );
};
