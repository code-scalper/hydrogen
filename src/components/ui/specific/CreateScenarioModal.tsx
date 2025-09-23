import { useProjectStore } from "@/store/useProjectStore";
import { useEffect, useMemo, useState } from "react";
import SelectBox from "../SelectBox";

import type { ScenarioInterface } from "@/types";

import SFC1012 from "@/assets/sfc/sfc_1012.jpg";
import SFC1013 from "@/assets/sfc/sfc_1013.jpg";
import SFC1022 from "@/assets/sfc/sfc_1022.jpg";
import SFC1023 from "@/assets/sfc/sfc_1023.jpg";
import SFC1033 from "@/assets/sfc/sfc_1033.jpg";
import SFC1232 from "@/assets/sfc/sfc_1232.jpg";
import SFC1243 from "@/assets/sfc/sfc_1243.jpg";
import SFC2012 from "@/assets/sfc/sfc_2012.jpg";
import SFC2022 from "@/assets/sfc/sfc_2022.jpg";
import SFC2050 from "@/assets/sfc/sfc_2050.jpg";
import SFC3012 from "@/assets/sfc/sfc_3012.jpg";
import SFC3022 from "@/assets/sfc/sfc_3022.jpg";
interface CreateScenarioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (projectId: string, scenario: ScenarioInterface) => void;
}

const IMAGES: any = {
  SFC1012,
  SFC1013,
  SFC1022,
  SFC1023,
  SFC1033,
  SFC1232,
  SFC1243,
  SFC2012,
  SFC2022,
  SFC2050,
  SFC3012,
  SFC3022,
};

export const CreateScenarioModal = ({
  isOpen,
  onClose,
  onCreate,
}: CreateScenarioModalProps) => {
  const [typed, setTyped] = useState(false);
  const [name, setName] = useState("");
  const folders = useProjectStore((state) => state.folderList);
  const scenarios = useProjectStore((state) => state.scenarios);
  const selectedProject = useProjectStore((state) => state.selectedProject);



  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [selectedScenarioId, setSelectedScenarioId] = useState("");
  const [selectedScenario, setSelectedScenario] = useState<any>(null);
  // const setSelectedProject = useProjectStore(
  //   (state) => state.setSelectedProject
  // );

  const selectItems = useMemo(() => {
    const items =
      folders.map((folder) => {
        return { label: folder.name, key: folder.id };
      }) || [];
    return items ? items : [];
  }, [folders]);

  const existingScenarioIds = useMemo(() => {
    if (!selectedProjectId) {
      return new Set<string>();
    }

    const project = folders.find((folder) => folder.id === selectedProjectId);
    const ids = project?.children?.map((child) => child.id) || [];

    return new Set(ids);
  }, [folders, selectedProjectId]);

  const selectScenarioItems = useMemo(() => {
    const items =
      scenarios.map((scenario) => {
        const isExisting = existingScenarioIds.has(scenario.id);

        return {
          label: isExisting
            ? `${scenario.sfcName} (이미 추가됨)`
            : scenario.sfcName,
          key: scenario.id,
          data: scenario,
          disabled: isExisting,
          className: isExisting ? "text-gray-400" : undefined,
        };
      }) || [];
    return items ? items : [];
  }, [scenarios, existingScenarioIds]);

  useEffect(() => {
    if (selectedProject) {
      setSelectedProjectId(selectedProject.id);
    }
  }, [selectedProject]);

  useEffect(() => {
    if (!isOpen) {
      setSelectedScenarioId("");
      setSelectedScenario(null);
      setName("");
      setTyped(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (selectedScenarioId && existingScenarioIds.has(selectedScenarioId)) {
      setSelectedScenarioId("");
      setSelectedScenario(null);
      setName("");
      setTyped(false);
    }
  }, [existingScenarioIds, selectedScenarioId]);

  const isScenarioAlreadyInProject = useMemo(() => {
    if (!selectedScenarioId) return false;
    return existingScenarioIds.has(selectedScenarioId);
  }, [existingScenarioIds, selectedScenarioId]);

  const isCreateDisabled =
    !selectedProjectId || !selectedScenario || isScenarioAlreadyInProject;

  const selectedScenarioImage = useMemo(() => {
    const src = IMAGES[selectedScenarioId];
    return src;
  }, [selectedScenarioId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 text-xs">
      <div className="bg-gray-800 rounded-md w-[500px] shadow-lg border border-gray-800 border-r">
        {/* Header */}
        <div className="flex justify-between items-center  p-2 bg-gray-900">
          <h2 className="text-xs text-slate-200  font-semibold">
            시나리오 생성
          </h2>
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-black text-xs"
          >
            ×
          </button>
        </div>

        <div className="p-4 space-y-5">
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
              <SelectBox
                selectItems={selectScenarioItems}
                value={selectedScenarioId}
                onValueChange={(val, data) => {
                  setSelectedScenarioId(val);
                  setSelectedScenario(data);
                  if (!typed || name.trim() === "") {
                    setName(data.name);
                    setTyped(false);
                  }
                }}
              />
            </div>
            <div className=" flex items-center flex-start gap-2">
              <label className="text-xs text-slate-200 mr-3">
                시나리오 이름
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  if (!typed) {
                    setTyped(true);
                  }
                  setName(e.target.value);
                }}
                className="text-white text-xs border-none bg-gray-700 border rounded p-1 px-2 focus:outline-none focus:ring-2 focus:ring-blue-800 flex-1"
                placeholder="예: Scenario Name"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !isCreateDisabled) {
                    onCreate(selectedProjectId, {
                      ...selectedScenario,
                      name,
                    });
                    setTyped(true);
                  }
                }}
                // onKeyDown={(e) => {
                //   if (e.key === "Enter") {
                //     // 엔터를 눌렀을 때 실행할 코드
                //     onCreate(name, description); // 예: 폴더 생성
                //   }
                // }}
              />
            </div>
          </div>

          {selectedScenarioImage && (
            <div className="">
              <img src={selectedScenarioImage} alt={selectedProjectId} />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-4 py-3">
          <button
            onClick={onClose}
            className="text-xs px-4 py-1  bg-gray-500 text-gray-200 hover:bg-gray-600"
          >
            취소
          </button>
          <button
            onClick={() => {
              if (isCreateDisabled) return;
              onCreate(selectedProjectId, { ...selectedScenario, name });
              setName("");
              onClose();
            }}
            disabled={isCreateDisabled}
            className={`text-xs px-4 py-1  ${
              isCreateDisabled
                ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            생성
          </button>
        </div>
      </div>
    </div>
  );
};
