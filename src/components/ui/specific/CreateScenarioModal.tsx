import { useState, useMemo, useEffect } from "react";
import SelectBox from "../SelectBox";
import { useProjectStore } from "@/store/useProjectStore";

import { ScenarioInterface } from "@/types";

import SFC1012 from "@/assets/sfc/sfc_1012.png";
import SFC1013 from "@/assets/sfc/sfc_1013.png";
import SFC1022 from "@/assets/sfc/sfc_1022.png";
import SFC1023 from "@/assets/sfc/sfc_1023.png";
import SFC1033 from "@/assets/sfc/sfc_1033.png";
import SFC1232 from "@/assets/sfc/sfc_1232.png";
import SFC1243 from "@/assets/sfc/sfc_1243.png";
import SFC2012 from "@/assets/sfc/sfc_2012.png";
import SFC2022 from "@/assets/sfc/sfc_2022.png";
import SFC2050 from "@/assets/sfc/sfc_2050.png";
import SFC3012 from "@/assets/sfc/sfc_3012.png";
import SFC3022 from "@/assets/sfc/sfc_3022.png";
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

  const selectScenarioItems = useMemo(() => {
    const items =
      scenarios.map((scenario) => {
        return { label: scenario.sfcName, key: scenario.id, data: scenario };
      }) || [];
    return items ? items : [];
  }, [scenarios]);

  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [selectedScenarioId, setSelectedScenarioId] = useState("");
  const [selectedScenario, setSelectedScenario] = useState<any>(null);
  useEffect(() => {
    if (selectedProject) {
      setSelectedProjectId(selectedProject.id);
    }
  }, [selectedProject]);

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
                  if (e.key === "Enter") {
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
              onCreate(selectedProjectId, { ...selectedScenario, name });
              setName("");
              onClose();
            }}
            className="text-xs px-4 py-1  bg-blue-500 text-white hover:bg-blue-600"
          >
            생성
          </button>
        </div>
      </div>
    </div>
  );
};
