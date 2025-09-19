import { ArrowLongRightIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";
import { useEffect, useState } from "react";
import type { DeviceProperty } from "@/types";

interface FlowOutputOverlayProps {
  point: DeviceProperty;
  scenarioId: string;
  onChange: (id: string, value: string) => void;
  status?: "normal" | "warning" | "error";
  label: string;
  overlayStyle?: React.CSSProperties;
  scale: number;
  inputHeight: number;
  fixedInputWidth?: number;
  reverseOrder?: boolean;
}

const getArrowColor = (status: "normal" | "warning" | "error") => {
  // switch (status) {
  //   case "normal":
  //     return "text-sky-400"; // 파란색
  //   case "warning":
  //     return "text-yellow-400"; // 노란색
  //   case "error":
  //     return "text-red-500"; // 빨간색
  // }
  console.log(status);
  return "text-red-500";
};

const FlowOutputOverlay: React.FC<FlowOutputOverlayProps> = ({
  point,
  onChange,
  status = "normal",
  label = "sample",
  overlayStyle = {},
  scale,
  inputHeight,
  fixedInputWidth = 0,
}) => {
  const [inputValue, setInputValue] = useState(point.value);

  useEffect(() => {
    setInputValue(point.value);
  }, [point.value]);
  return (
    <div
      className={clsx(
        "absolute flex items-center space-x-1 p-1 rounded",
        "transform -translate-y-1/2",
        "flex-row-reverse" // 항상 오른쪽 기준 (인풋이 오른쪽 끝)
      )}
      style={overlayStyle}
    >
      {/* 인풋 박스 */}
      <input
        type="text"
        value={inputValue}
        readOnly
        onChange={(e) => {
          const newVal = e.target.value;
          setInputValue(newVal);
          onChange(point.key, newVal);
        }}
        className="px-2 text-xs text-white text-right border border-gray-600 bg-black
          focus:outline-none focus:border-blue-500 rounded-sm"
        style={{
          height: `${Math.max(18, Math.min(inputHeight, 32))}px`,
          width: `${fixedInputWidth}px`, // 👈 고정폭
          fontSize: `${Math.max(10, Math.min(12 * scale, 18))}px`,
          minWidth: "40px",
          maxWidth: "120px",
          minHeight: "18px",
          maxHeight: "32px",
        }}
      />

      {/* 화살표 */}
      <ArrowLongRightIcon
        style={{
          fontWeight: "bold",
          width: `${Math.max(16, Math.min(16 * scale, 24))}px`,
          height: `${Math.max(16, Math.min(16 * scale, 24))}px`,
        }}
        className={clsx(getArrowColor(status))}
      />

      {/* 라벨 */}
      <span
        className="font-medium"
        style={{
          fontSize: `${Math.max(8, Math.min(10 * scale, 14))}px`,
          color: "white",
        }}
      >
        {label}
      </span>
    </div>
  );
};

export default FlowOutputOverlay;
