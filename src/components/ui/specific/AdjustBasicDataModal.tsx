import { useState } from "react";
import { useBasicDataStore } from "@/store/useBasicDataStore";
import LabeledInput from "../LabelInput";
import LabelSelect from "../LabelSelect";

import { Button } from "@radix-ui/themes";
interface AdjustBasicDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string, description: string) => void;
}

const INPUT_LIST1 = [
  {
    key: "key1",
    label: "대기 온도 (T_AmbC)",
    type: "text",
    placeholder: "예: 40",
    unit: "kg",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. ",
  },
  {
    key: "key2",
    label: "HBk 초기 압력 (P_Hbk_0)",
    type: "text",
    placeholder: "예: 40",
    unit: "kg",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. ",
  },
  { key: "key3", label: "SFC", type: "text", placeholder: "예: 40" },
  {
    key: "key4",
    label: "디스펜서 2 적용 여부 (D2ON)",
    type: "text",
    placeholder: "예: 40",
    unit: "kg",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. ",
  },
  {
    key: "key5",
    label: "연속 충전 적용 여부 (ContOn)",
    type: "text",
    placeholder: "예: 40",
    unit: "kg",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. ",
  },
];

const INPUT_LIST2 = [
  {
    key: "key1",
    label: "버퍼 탱크 충전 시간",
    type: "text",
    placeholder: "예: 40",
    unit: "kg",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. ",
  },
  {
    key: "key2",
    label: "PSV 용량 계산 적용 여부",
    type: "text",
    placeholder: "예: 40",
    unit: "kg",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. ",
  },
  {
    key: "key3",
    label: "디스펜서1 설정 시간 (t_PreSet1)",
    type: "text",
    placeholder: "예: 40",
    unit: "kg",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. ",
  },
  {
    key: "key4",
    label: "디스펜서2 설정 시간 (t_PreSet2)",
    type: "text",
    placeholder: "예: 40",
    unit: "kg",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. ",
  },
  {
    key: "key5",
    label: "압축기 작동 모드 (CompMod)",
    type: "text",
    placeholder: "예: 40",
    unit: "kg",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. ",
  },
];

export const AdjustBasicDataModal = ({
  isOpen,
  onClose,
  onCreate,
}: AdjustBasicDataModalProps) => {
  // 상태 접근
  const { dataset, setValue, resetDataset } = useBasicDataStore();

  const [name, setName] = useState("");
  const deviceOptions = [
    { id: "1", name: "온도센서" },
    { id: "2", name: "압력센서" },
  ];

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
          <div>
            <Button variant="solid" radius="none" onClick={() => {}}>
              입력변수
            </Button>
          </div>
          <div className="flex space-x-3">
            <div className="flex-1 space-y-2">
              {INPUT_LIST1.map((input, index) =>
                input.type === "text" ? (
                  <LabeledInput
                    key={index}
                    label={input.label}
                    name={input.key}
                    unit={input.unit}
                    description={input.description}
                    value={dataset[input.key] || ""}
                    onChange={setValue}
                    placeholder={input.placeholder}
                    onEnter={() => onCreate(name, "")}
                  />
                ) : (
                  <LabelSelect
                    label={input.label}
                    name={input.key}
                    unit={input.unit}
                    description={input.description}
                    options={deviceOptions}
                    value={dataset[input.key] || ""}
                    onChange={setValue}
                  />
                )
              )}
            </div>
            <div className="flex-1 space-y-2">
              {INPUT_LIST2.map((input, index) =>
                input.type === "text" ? (
                  <LabeledInput
                    key={index}
                    label={input.label}
                    name={input.key}
                    unit={input.unit}
                    description={input.description}
                    value={dataset[input.key] || ""}
                    onChange={setValue}
                    placeholder={input.placeholder}
                    onEnter={() => onCreate(name, "")}
                  />
                ) : (
                  <LabelSelect
                    label={input.label}
                    name={input.key}
                    unit={input.unit}
                    description={input.description}
                    options={deviceOptions}
                    value={dataset[input.key] || ""}
                    onChange={setValue}
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
