import { useState, useEffect } from "react";
import { ArrowLongRightIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";

import type { DeviceProperty } from "@/types";

interface FlowInputOverlayProps {
  point: DeviceProperty;
  scenarioId: string;
  onChange: (id: string, value: string) => void;
  status?: "normal" | "warning" | "error";
  label: string;
  overlayStyle?: React.CSSProperties;
  scale: number;
  inputHeight: number;
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
  status = "normal",
  label = "sample",
  overlayStyle = {},
  scale,
  inputHeight,
}) => {
  const [inputValue, setInputValue] = useState(point.value);

  // 외부 point.value가 변경되면 반영 (e.g. 리셋될 때)
  useEffect(() => {
    setInputValue(point.value);
  }, [point.value]);
  return (
    <div
      className={clsx(
        "absolute flex items-center min-w-[200px] space-x-3 bg-white/80 border border-gray-800 p-1",
        "transform -translate-x-1/2 -translate-y-1/2"
      )}
      style={overlayStyle}
    >
      <input
        type="text"
        value={inputValue}
        onChange={(e) => {
          const newVal = e.target.value;
          setInputValue(newVal); // 👉 UI 즉시 반영
          onChange(point.key, newVal); // 👉 디바운스 실행
        }}
        className="px-2 text-xs text-black text-right border-b border-gray-500 bg-transparent 
        focus:outline-none focus:border-b-2 focus:border-blue-600"
        style={{
          height: `${inputHeight}px`,
          width: `${60 * scale}px`,
          fontSize: `${12 * scale}px`,
          padding: `${2 * scale}px`,
        }}
      />
      <ArrowLongRightIcon
        style={{
          width: `${16 * scale}px`,
          height: `${16 * scale}px`,
          minWidth: `${15 * scale}px`,
        }}
        className={clsx("ml-1", getArrowColor(status))}
      />

      <span className="text-gray-900" style={{ fontSize: `${12 * scale}px` }}>
        {label}
      </span>
    </div>
  );
};

export default FlowInputOverlay;
