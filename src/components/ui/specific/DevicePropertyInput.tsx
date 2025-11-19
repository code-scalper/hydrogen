import { useDebouncedCallback } from "@/hooks/useDebouncedCallback";
import { useEffect, useId, useState } from "react";

interface DevicePropertyInputProps {
	label: string;
	value: string;
	unit: string;
	type?: string;
	options?: { id: string; name: string }[];
	onChange: (value: string) => void;
}

const DevicePropertyInput = ({
	label,
	value,
	unit,
	type = "text",
	options,
	onChange,
}: DevicePropertyInputProps) => {
	const [internalValue, setInternalValue] = useState(value ?? "");
	const inputId = useId();
	const isRadio = type === "radio";
	const isSelect = type === "select";

	const debouncedUpdate = useDebouncedCallback((val: string) => {
		onChange(val);
	}, 500); // 500ms 후 반영

	useEffect(() => {
		setInternalValue(value ?? "");
	}, [value]);

	const handleImmediateChange = (val: string) => {
		setInternalValue(val);
		onChange(val);
	};

	const renderControl = () => {
		if (isRadio && options?.length) {
			const radioName = `${inputId}-group`;
			return (
				<div className="flex flex-wrap gap-2 justify-end">
					{options.map((option) => {
						const radioId = `${radioName}-${option.id}`;
						const isChecked = internalValue === option.id;
						return (
							<label
								key={option.id}
								htmlFor={radioId}
								className={`flex items-center gap-2 rounded-full border border-slate-500 px-3 py-1 text-xs text-slate-200 transition-colors hover:border-blue-400 hover:text-white ${
									isChecked ? "bg-slate-700" : "bg-slate-700/40"
								}`}
							>
								<input
									id={radioId}
									type="radio"
									name={radioName}
									value={option.id}
									checked={isChecked}
									onChange={(e) => handleImmediateChange(e.target.value)}
									className="h-3.5 w-3.5 accent-blue-500"
								/>
								<span>{option.name}</span>
							</label>
						);
					})}
				</div>
			);
		}

		if (isSelect && options?.length) {
			return (
				<select
					id={inputId}
					value={internalValue}
					onChange={(e) => handleImmediateChange(e.target.value)}
					className="w-full px-2 py-1 bg-gray-700 text-white border-b border-slate-600 focus:outline-none focus:border-b-2 focus:border-blue-600"
				>
					<option value="">선택</option>
					{options.map((option) => (
						<option key={option.id} value={option.id}>
							{option.name}
						</option>
					))}
				</select>
			);
		}

		return (
			<input
				id={inputId}
				type="text"
				className="w-full px-2 py-1 bg-gray-700 text-white border-b border-slate-600 focus:outline-none focus:border-b-2 focus:border-blue-600"
				value={internalValue}
				onChange={(e) => {
					const val = e.target.value;
					setInternalValue(val);
					debouncedUpdate(val);
				}}
			/>
		);
	};

	return (
		<div
			className={`p-2 flex justify-between rounded shadow-sm mb-2 ${
				isRadio ? "items-start" : "items-center"
			}`}
		>
			<label
				htmlFor={isRadio ? undefined : inputId}
				className="text-slate-200 w-1/3"
			>
				{label}
			</label>
			<div className={isRadio ? "w-2/3" : "w-1/2"}>{renderControl()}</div>
			{!isRadio && (
				<span className="text-slate-400 w-1/6 text-right">
					{unit === "-" ? "" : unit}
				</span>
			)}
		</div>
	);
};

export default DevicePropertyInput;
