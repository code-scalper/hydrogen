import { ArrowLongRightIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";
import { useEffect, useState } from "react";
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
  fixedInputWidth?: number;
  reverseOrder?: boolean;
}

const getArrowColor = (status: "normal" | "warning" | "error") => {
  switch (status) {
    case "normal":
      return "text-sky-400"; // 파란색
    case "warning":
      return "text-yellow-400"; // 노란색
    case "error":
      return "text-red-500"; // 빨간색
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
  fixedInputWidth = 0,
  reverseOrder = false,
}) => {
  const [inputValue, setInputValue] = useState(point.value);

  useEffect(() => {
    setInputValue(point.value);
  }, [point.value]);

  return (
    <div
      className={clsx(
        "absolute flex items-center justify-start space-x-1 p-1 rounded",
        "transform -translate-y-1/2", // X축 중앙정렬 제거
        reverseOrder ? "flex-row-reverse space-x-reverse" : "flex-row"
      )}
      style={overlayStyle}
    >
      {/* 인풋 박스 */}
      <input
        type="text"
        value={inputValue}
        onChange={(e) => {
          const newVal = e.target.value;
          setInputValue(newVal);
          onChange(point.key, newVal);
        }}
        className="px-2 text-xs text-white text-right border border-gray-600 bg-black
          focus:outline-none focus:border-blue-500 rounded-sm"
        style={{
          height: `${Math.max(18, Math.min(inputHeight, 32))}px`,
          width: fixedInputWidth
            ? `${fixedInputWidth}px`
            : `${Math.max(30, Math.min(40 * scale, 80))}px`,
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

export default FlowInputOverlay;
