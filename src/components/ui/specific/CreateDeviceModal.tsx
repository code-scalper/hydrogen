import { useProjectStore } from "@/store/useProjectStore";
import { useInteractionStore } from "@/store/useInteractionStore";
import type {
  DeviceInterface,
  ProjectInterface,
  ScenarioInterface,
} from "@/types";
import { useMemo, useState } from "react";

import BaseToast from "../BaseToast";

// components
import BaseScrollArea from "../BaseScrollArea";
import DevicePropertyInput from "./DevicePropertyInput";

import { PsvCalculatorModal } from "./PsvCalculatorModal";

interface CreateDeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (
    projectId: string,
    scenarioId: string,
    device: DeviceInterface
  ) => void;
}

const ExtraInfoPanel = ({ props }: { props: DeviceInterface["props"] }) => {
  return (
    <div className="w-[400px] bg-gray-700 p-3 text-[10px] overflow-y-auto max-h-[550px]">
      <h3 className="text-sm font-bold mb-2 text-white">추가 정보</h3>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-600">
            <th className="py-1 px-2 text-gray-300">Name</th>
            <th className="py-1 px-2 text-gray-300">Description</th>
            <th className="py-1 px-2 text-gray-300">Unit</th>
            <th className="py-1 px-2 text-gray-300">Min</th>
            <th className="py-1 px-2 text-gray-300">Max</th>
          </tr>
        </thead>
        <tbody>
          {props.map((prop) => (
            <tr key={prop.key} className="border-b border-gray-600">
              <td className="py-1 px-2 text-white">{prop.name}</td>
              <td className="py-1 px-2 text-white">{prop.description}</td>
              <td className="py-1 px-2 text-white">{prop.unit}</td>
              <td className="py-1 px-2 text-white"></td> {/* min */}
              <td className="py-1 px-2 text-white"></td> {/* max */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export const CreateDeviceModal = ({
  isOpen,
  onClose,
}: CreateDeviceModalProps) => {
  const folders = useProjectStore((state) => state.folderList);
  const selectedDevice = useProjectStore((state) => state.selectedDevice);
  const setSelectedDevice = useProjectStore((state) => state.setSelectedDevice);
  const updateDevicePropValue = useProjectStore(
    (state) => state.updateDevicePropValue
  );

  // const psvOpen = useInteractionStore((state)=>state.psvOpen)
  const setPsvOpen = useInteractionStore((state) => state.setPsvOpen);

  const [open, setOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const showToast = (message: string) => {
    setToastMessage(message);
    setOpen(false); // 이전 Toast 닫기
    setTimeout(() => setOpen(true), 10); // 새 Toast 열기 (React state refresh 대응)
    setTimeout(() => setOpen(false), 2000); // 새 Toast 열기 (React state refresh 대응)
  };

  const [showExtra, setShowExtra] = useState(false);

  const [properties1, properties2] = useMemo(() => {
    const allProps = selectedDevice?.props || [];
    const half = Math.ceil(allProps.length / 2);
    const first = allProps.slice(0, half);
    const second = allProps.slice(half);
    return [first, second];
  }, [selectedDevice]);

  const parentProject = useMemo<ProjectInterface | null>(() => {
    const target = folders.find(
      (folder) => folder.id === selectedDevice?.projectId
    );
    return target ?? null;
  }, [selectedDevice]);

  const parentScenario = useMemo<
    ScenarioInterface | { name: string; children: DeviceInterface[] }
  >(() => {
    const target = parentProject?.children?.find(
      (scenario) => scenario.id === selectedDevice?.scenarioId
    ) as ScenarioInterface | undefined;

    return (
      target ?? {
        name: "No Item",
        children: [],
      }
    );
  }, [selectedDevice, parentProject]);

  const devices = useMemo<DeviceInterface[]>(() => {
    return (parentScenario.children as DeviceInterface[]) || [];
  }, [parentScenario]);

  const onPsvClick = () => {
    setPsvOpen(true);
    // console.log("psv click");
    // showToast("PSV 계산 UI 개발중");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-[999] text-xs text-slate-200">
      <div
        className={`bg-gray-800 rounded-md shadow-lg border border-gray-800 border-r overflow-hidden flex transition-all duration-300`}
        style={{ width: showExtra ? "1400px" : "1000px" }}
      >
        {/* Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center p-2 bg-gray-900">
            <h2 className="text-xs text-slate-200 font-semibold">
              장치 상세보기
            </h2>
            <button
              onClick={onClose}
              className="text-slate-300 hover:text-black text-xs"
            >
              ×
            </button>
          </div>
          <div className="p-4 flex space-x-5 flex-1">
            <div className="space-y-3">
              <label className="text-md text-slate-200 mr-3 font-bold">
                {parentScenario.name}
              </label>
              <BaseScrollArea
                items={devices}
                displayProperty="name"
                selectedId={selectedDevice?.id}
                onItemClick={(device) => setSelectedDevice(device)}
              />
            </div>
            <div className="space-y-3 flex-1">
              <div className="flex justify-between">
                <label className="text-md mr-3 font-bold">변수 입력 영역</label>

                <button
                  onClick={() => setShowExtra(!showExtra)}
                  className="text-xs px-4 py-1 bg-gray-500 text-gray-200 hover:bg-gray-600"
                >
                  입력 변수 범위확인 {showExtra ? "닫기" : "열기"}
                </button>
              </div>
              {selectedDevice && (
                <div className="flex space-x-5">
                  <div className="w-[350px] bg-gray-700 overflow-y-auto max-h-[400px]">
                    {properties1.map((prop, index) => (
                      <DevicePropertyInput
                        label={prop.name || prop.key}
                        key={`${selectedDevice?.id}-${prop.key}-${index}-${selectedDevice.scenarioId}`}
                        value={prop.value || ""}
                        unit={prop.unit}
                        onChange={(val) =>
                          updateDevicePropValue(selectedDevice, prop.key, val)
                        }
                      />
                    ))}
                  </div>
                  <div className="w-[350px] bg-gray-700 overflow-y-auto max-h-[400px]">
                    {properties2.map((prop, index) => (
                      <DevicePropertyInput
                        label={prop.name || prop.key}
                        key={`${selectedDevice?.id}-${prop.key}-${index}-${selectedDevice.scenarioId}`}
                        value={prop.value || ""}
                        unit={prop.unit}
                        onChange={(val) =>
                          updateDevicePropValue(selectedDevice, prop.key, val)
                        }
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end px-4 py-3 bg-gray-900">
            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="text-xs px-4 py-1 bg-gray-500 text-gray-200 hover:bg-gray-600"
              >
                취소
              </button>
              <button
                onClick={onPsvClick}
                className="text-xs px-4 py-1 bg-rose-500 text-gray-200 hover:bg-gray-600"
              >
                PSV 계산
              </button>
            </div>
          </div>
        </div>

        {/* 추가 정보 영역 */}
        {showExtra && selectedDevice && (
          <ExtraInfoPanel props={selectedDevice.props} />
        )}

        <BaseToast open={open} setOpen={setOpen} toastMessage={toastMessage} />
      </div>
      <PsvCalculatorModal onCreate={() => {}} />
    </div>
  );
};
