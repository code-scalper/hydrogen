import { useState, useEffect } from "react";
import { ArrowLongRightIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";

import type { InputPoint } from "@/types";

interface FlowInputOverlayProps {
  point: InputPoint;
  scenarioId: string;
  onChange: (id: string, value: string) => void;
  status: "normal" | "warning" | "error";
  label: string;
}

const getArrowColor = (status: "normal" | "warning" | "error") => {
  switch (status) {
    case "normal":
      return "text-green-500";
    case "warning":
      return "text-yellow-400";
    case "error":
      return "text-red-500";
  }
};

const FlowInputOverlay: React.FC<FlowInputOverlayProps> = ({
  point,
  onChange,
  status,
  label = "sample",
}) => {
  const [inputValue, setInputValue] = useState(point.value);

  // 외부 point.value가 변경되면 반영 (e.g. 리셋될 때)
  useEffect(() => {
    setInputValue(point.value);
  }, [point.value]);
  return (
    <div
      className="absolute flex items-center w-[200px] space-x-3 bg-white/80 border border-gray-800 p-1"
      style={{
        left: `${point.x * 100}%`,
        top: `${point.y * 100}%`,
        transform: "translate(-50%, -50%)",
      }}
    >
      <input
        type="text"
        value={inputValue}
        onChange={(e) => {
          const newVal = e.target.value;
          setInputValue(newVal); // 👉 UI 즉시 반영
          onChange(point.id, newVal); // 👉 디바운스 실행
        }}
        className="px-2 w-16 text-xs text-black text-right border-b border-gray-500 bg-transparent 
        focus:outline-none focus:border-b-2 focus:border-blue-600"
      />
      <ArrowLongRightIcon
        className={clsx("min-w-[15px] w-4 h-4 ml-1 ", getArrowColor(status))}
      />
      <span className="text-gray-900 text-xs">{label}</span>
    </div>
  );
};

export default FlowInputOverlay;
