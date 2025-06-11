import { useState, useMemo, useEffect } from "react";
import { useProjectStore } from "@/store/useProjectStore";
import { FolderItemInterface } from "@/types";

// components
import BaseScrollArea from "../BaseScrollArea";
import DevicePropertyInput from "./DevicePropertyInput";

interface CreateDeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (
    projectId: string,
    scenarioId: string,
    device: FolderItemInterface
  ) => void;
}

export const CreateDeviceModal = ({
  isOpen,
  onClose,
  onCreate,
}: CreateDeviceModalProps) => {
  const folders = useProjectStore((state) => state.folderList);
  const scenarios = useProjectStore((state) => state.scenarios);
  const selectedDevice = useProjectStore((state) => state.selectedDevice);

  const selectItems = useMemo(() => {
    const items =
      folders.map((folder) => {
        return { label: folder.name, key: folder.id };
      }) || [];
    return items ? items : [];
  }, [folders]);

  const selectScenarioItems = useMemo(() => {
    const items =
      scenarios.map((scenario) => {
        return { label: scenario.name, key: scenario.id, data: scenario };
      }) || [];
    return items ? items : [];
  }, [scenarios]);

  useEffect(() => {
    console.log(selectedDevice, "selected^^Device");
  }, [selectedDevice]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 text-xs text-slate-200">
      <div className="bg-gray-800 rounded-md w-[800px] shadow-lg border border-gray-800 border-r">
        {/* Header */}
        <div className="flex justify-between items-center  p-2 bg-gray-900">
          <h2 className="text-xs text-slate-200  font-semibold">
            장치 상세보기
          </h2>
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-black text-xs"
          >
            ×
          </button>
        </div>
        <div className="p-4 flex space-x-5">
          <div className="space-y-3">
            <label className="text-md text-slate-200 mr-3 font-bold">
              시나리오 SFC2023
            </label>
            <BaseScrollArea items={[]} />
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-md  mr-3 font-bold">변수 입력 영역</label>
              <span>입력 변수 범위확인</span>
            </div>
            <div className="w-[250px] h-[400px] bg-gray-700">
              <DevicePropertyInput
                label="test"
                value="text"
                unit="kg"
                onChange={() => {}}
              />
            </div>
          </div>
        </div>

        {/* <div className="p-4 space-y-5">
          <div className="space-y-2">
            <div className="flex items-center flex-start gap-2">
              <label className="text-xs text-slate-200 mr-3">
                프로젝트 선택
              </label>
              <SelectBox
                selectItems={selectItems}
                value={selectedProjectId}
                onValueChange={(val) => setSelectedProjectId(val)}
              />
            </div>
            <div className="flex items-center flex-start gap-2">
              <label className="text-xs text-slate-200 mr-3">
                시나리오 선택
              </label>
            </div>
          </div>
        </div> */}

        {/* Footer */}
        <div className="flex justify-end gap-2 px-4 py-3">
          <button
            onClick={onClose}
            className="text-xs px-4 py-1 rounded bg-gray-500 text-gray-200 hover:bg-gray-600"
          >
            취소
          </button>
          <button
            // onClick={() => {
            //   onCreate(selectedProjectId, selectedScenario);

            //   onClose();
            // }}
            className="text-xs px-4 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
          >
            생성
          </button>
        </div>
      </div>
    </div>
  );
};
