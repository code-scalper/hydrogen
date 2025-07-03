import { useState, useMemo, useEffect } from "react";
import { useBasicDataStore } from "@/store/useBasicDataStore";
import { useProjectStore } from "@/store/useProjectStore";
import LabeledInput from "../LabelInput";
import LabelSelect from "../LabelSelect";

import { Button } from "@radix-ui/themes";

import { useDebouncedCallback } from "@/hooks/useDebouncedCallback";
interface AdjustBasicDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string, description: string) => void;
}

export const AdjustBasicDataModal = ({
  isOpen,
  onClose,
  onCreate,
}: AdjustBasicDataModalProps) => {
  // 상태 접근
  const { setValue, getDatasetById } = useBasicDataStore();

  const selectedScenario = useProjectStore((state) => state.selectedScenario);
  const { updateScenarioBaseDataValue } = useProjectStore();
  const [name, setName] = useState("");

  const targetId = useMemo(() => {
    return selectedScenario
      ? `${selectedScenario.parentId}_${selectedScenario.id}`
      : "NONE";
  }, [selectedScenario]);

  const scenarioBaseData = useMemo(() => {
    return selectedScenario?.baseData || [];
  }, [selectedScenario]);

  const baseData1 = useMemo(() => {
    const half = Math.ceil(scenarioBaseData.length / 2);
    return scenarioBaseData.slice(0, half);
  }, [scenarioBaseData]);

  const baseData2 = useMemo(() => {
    const half = Math.ceil(scenarioBaseData.length / 2);
    return scenarioBaseData.slice(half);
  }, [scenarioBaseData]);

  const [formState, setFormState] = useState<Record<string, string>>({});
  const debouncedUpdateValue = useDebouncedCallback(
    (key: string, value: string) => {
      console.log(key, value);
      setValue(targetId, key, value);
      updateScenarioBaseDataValue(key, value);
    },
    300 // 300ms debounce
  );
  // 시나리오 변경 or 모달 열릴 때 초기값 설정
  useEffect(() => {
    if (!selectedScenario || !isOpen) return;

    const targetId = `${selectedScenario.parentId}_${selectedScenario.id}`;
    const raw = getDatasetById(targetId) || [];

    const obj = raw.reduce((acc, cur) => {
      acc[cur.key] = cur.value;
      return acc;
    }, {} as Record<string, string>);

    setFormState(obj);
  }, [selectedScenario, isOpen]);

  const handleChange = (key: string, val: string) => {
    setFormState((prev) => ({
      ...prev,
      [key]: val,
    }));

    debouncedUpdateValue(key, val);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-md w-[700px] shadow-lg border border-gray-800 border-r">
        {/* Header */}
        <div className="flex justify-between items-center  p-2 bg-gray-900">
          <h2 className="text-sm text-slate-200  font-semibold">
            기준정보 조정
          </h2>
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-black text-sm"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-2">
          <div className="flex items-center  justify-between mb-5">
            <h2 className="mr-5 font-bold">{selectedScenario?.sfcName}</h2>
            <Button variant="outline" radius="none" onClick={() => {}}>
              입력변수 범위 확인
            </Button>
          </div>
          <div className="flex space-x-3">
            <div className="flex-1 space-y-2">
              {baseData1.map((input, index) =>
                input.type === "text" ? (
                  <LabeledInput
                    key={index}
                    label={input.name}
                    name={input.key}
                    unit={input.unit}
                    description={input.description}
                    value={formState[input.key] || ""}
                    onChange={handleChange}
                    placeholder={input.placeholder || ""}
                    onEnter={() => onCreate(name, "")}
                  />
                ) : (
                  <LabelSelect
                    key={index}
                    label={input.name}
                    name={input.key}
                    unit={input.unit}
                    description={input.description}
                    options={input.options}
                    value={formState[input.key] || ""}
                    onChange={handleChange}
                  />
                )
              )}
            </div>
            <div className="flex-1 space-y-2">
              {baseData2.map((input, index) =>
                input.type === "text" ? (
                  <LabeledInput
                    key={index}
                    label={input.name}
                    name={input.key}
                    unit={input.unit}
                    description={input.description}
                    value={formState[input.key] || ""}
                    onChange={handleChange}
                    placeholder={input.placeholder}
                    onEnter={() => onCreate(name, "")}
                  />
                ) : (
                  <LabelSelect
                    key={index}
                    label={input.name}
                    name={input.key}
                    unit={input.unit}
                    description={input.description}
                    options={input.options}
                    value={formState[input.key] || ""}
                    onChange={handleChange}
                  />
                )
              )}
            </div>
          </div>
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
              onCreate(name, "");
              setName("");
              onClose();
            }}
            className="text-xs px-4 py-1  bg-emerald-600 text-white hover:bg-emerald-700"
          >
            적용
          </button>
        </div>
      </div>
    </div>
  );
};
