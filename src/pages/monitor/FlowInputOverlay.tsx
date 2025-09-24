import { useDebouncedCallback } from "@/hooks/useDebouncedCallback";
import type { DeviceProperty } from "@/types";
import { ArrowLongRightIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";
import { useEffect, useMemo, useState } from "react";

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
	onValidityChange?: (identifier: string, isValid: boolean) => void;
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
	scenarioId,
	onChange,
	status = "normal",
	label = "sample",
	overlayStyle = {},
	scale,
	inputHeight,
	fixedInputWidth = 0,
	reverseOrder = false,
	onValidityChange,
}) => {
	const [inputValue, setInputValue] = useState(point.value ?? "");
	const debouncedOnChange = useDebouncedCallback(onChange, 500);

	const identifier = useMemo(
		() => `${scenarioId}:${point.key}`,
		[point.key, scenarioId],
	);

	const isNumeric = (value: string) => {
		const trimmed = value.trim();
		if (trimmed === "") return false;
		if (trimmed === "-" || trimmed === "." || trimmed === "-.") return false;
		const numericPattern = /^-?(?:\d+\.?\d*|\d*\.\d+)$/;
		return numericPattern.test(trimmed);
	};

	const isValid = isNumeric(inputValue);

	useEffect(() => {
		setInputValue(point.value ?? "");
	}, [point.value]);

	useEffect(() => {
		onValidityChange?.(identifier, isValid);
	}, [identifier, isValid, onValidityChange]);

	useEffect(() => {
		return () => {
			onValidityChange?.(identifier, true);
		};
	}, [identifier, onValidityChange]);

	return (
		<div
			className={clsx(
				"absolute flex items-center justify-start space-x-1 p-1 rounded",
				"transform -translate-y-1/2", // X축 중앙정렬 제거
				reverseOrder ? "flex-row-reverse space-x-reverse" : "flex-row",
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
					if (isNumeric(newVal)) {
						const normalized = newVal.trim();
						debouncedOnChange(point.key, normalized);
					}
				}}
				className={clsx(
					"px-2 text-xs text-white text-right bg-black focus:outline-none rounded-sm transition-shadow",
					isValid
						? "border border-gray-600 focus:border-blue-500"
						: "border border-red-500 focus:border-red-500 shadow-[0_0_0_1px_rgba(248,113,113,0.4)]",
				)}
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
				className={clsx(getArrowColor(isValid ? status : "error"))}
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
