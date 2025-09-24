// components/ui/specific/psv-calculator/PsvInput.tsx
import type { ReactNode } from "react";

type PsvInputProps = {
	label: ReactNode;
	unit?: string;
	value?: string | number;
	onChange?: (v: string) => void;
	disabled?: boolean;
	placeholder?: string;
	className?: string;
};

export default function PsvInput({
	label,
	unit = "-",
	value = "",
	onChange,
	disabled,
	placeholder = "999.999",
	className = "",
}: PsvInputProps) {
	const displayValue =
		typeof value === "number" ? value.toString() : (value ?? "");
	return (
		<label
			className={`grid grid-cols-[1fr,140px,56px] items-center gap-x-2 py-0.5 ${className}`}
		>
			{/* 라벨 */}
			<span className="text-[10px] leading-tight text-slate-200 truncate">
				{label}
			</span>

			{/* 입력 */}
			<input
				type="text"
				value={displayValue}
				onChange={(e) => onChange?.(e.target.value)}
				placeholder={placeholder}
				disabled={disabled}
				className={[
					"h-6 w-full rounded px-2",
					"text-[10px] leading-none text-slate-100 placeholder:text-slate-500",
					"border border-slate-600/60 bg-[#1e2430]/90",
					"focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50",
					"disabled:opacity-60",
				].join(" ")}
			/>

			{/* 단위 */}
			<span className="h-6 inline-flex items-center justify-center rounded border border-slate-600/60 bg-[#1e2430]/90 text-[10px] leading-none text-slate-300 px-2">
				{unit}
			</span>
		</label>
	);
}
