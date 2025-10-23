import { InfoCircledIcon } from "@radix-ui/react-icons";
import { useMemo, useState } from "react";

import {
	WHAT_IF_BASIC_FIELDS,
	WHAT_IF_TABS,
	type WhatIfInputs,
} from "@/constants/whatIf";
import { buildWhatIfDataset, validateWhatIfInputs } from "@/lib/whatIf";
import useSimulationOutputStore from "@/store/useSimulationOutputStore";
import useWhatIfStore from "@/store/useWhatIfStore";

interface WhatIfProps {
	showModal: boolean;
	setShowModal: (open: boolean) => void;
	handleEvent: (event: string) => void;
}

const Tooltip = ({ content }: { content: string }) => {
	const [open, setOpen] = useState(false);
	return (
		<div className="relative inline-flex">
			<button
				type="button"
				onClick={() => setOpen((prev) => !prev)}
				className="text-slate-400 hover:text-slate-200"
				aria-label="도움말"
			>
				<InfoCircledIcon className="h-4 w-4" />
			</button>
			{open && (
				<div className="absolute left-1/2 top-full z-10 mt-1 w-56 -translate-x-1/2 rounded-md border border-slate-700 bg-slate-900 p-2 text-[11px] leading-relaxed text-slate-200 shadow-lg">
					{content}
				</div>
			)}
		</div>
	);
};

const FieldError = ({ message }: { message?: string }) => {
	if (!message) return null;
	return <p className="mt-1 text-[11px] text-rose-400">{message}</p>;
};

export const WhatIf = ({
	showModal,
	setShowModal,
	handleEvent,
}: WhatIfProps) => {
	const {
		activeTab,
		inputs,
		errors,
		setActiveTab,
		setInput,
		setErrors,
		setDataset,
		setLoading,
		reset,
	} = useWhatIfStore();
	const {
		frames,
		sourceDate,
		refreshLatest,
		loading: outputLoading,
	} = useSimulationOutputStore();

	const [touched, setTouched] = useState<Partial<WhatIfInputs>>({});

	const markAllTouched = () => {
		const next: Partial<WhatIfInputs> = {};
		for (const key of Object.keys(inputs) as Array<keyof WhatIfInputs>) {
			next[key] = "true";
		}
		setTouched(next);
	};

	const basicFields = WHAT_IF_BASIC_FIELDS;

	const handleClose = () => {
		setShowModal(false);
	};

	const setFieldTouched = (key: keyof WhatIfInputs) => {
		setTouched((prev) => ({ ...prev, [key]: "true" }));
	};

	const resetForm = () => {
		reset();
		setTouched({});
	};

	const handleStoreInput = (key: keyof WhatIfInputs, value: string) => {
		setInput(key, value);
		setFieldTouched(key);
	};

	const validationState = useMemo(() => validateWhatIfInputs(inputs), [inputs]);

	const primaryAction = async () => {
		markAllTouched();
		const result = validateWhatIfInputs(inputs);
		setErrors(result.errors, result.normalized);
		if (!result.valid || !result.normalized) {
			return;
		}

		setLoading(true);
		try {
			let workingFrames = frames;

			if (workingFrames.length === 0) {
				await refreshLatest();
				workingFrames = useSimulationOutputStore.getState().frames;
			}

			if (workingFrames.length === 0) {
				setErrors(
					{
						MaxIter:
							"출력 데이터를 찾을 수 없습니다. 시뮬레이션을 먼저 실행하세요.",
					},
					result.normalized,
				);
				return;
			}

			const dataset = buildWhatIfDataset(
				workingFrames,
				result.normalized,
				sourceDate ?? useSimulationOutputStore.getState().sourceDate,
			);

			if (!dataset) {
				setErrors(
					{
						N_InSelec: "선택한 범위에 해당하는 데이터가 없습니다.",
					},
					result.normalized,
				);
				return;
			}

			setDataset(dataset);
			setShowModal(false);
			handleEvent("whatif");
		} finally {
			setLoading(false);
		}
	};

	if (!showModal) {
		return null;
	}

	return (
		<div className="fixed inset-0 z-[999] flex items-center justify-center bg-stone-900/60 text-xs text-slate-200">
			<div className="flex h-[600px] w-[820px] flex-col overflow-hidden rounded-xl border border-slate-700 bg-slate-900 shadow-2xl">
				<div className="flex items-center justify-between border-b border-slate-700 px-4 py-3">
					<h2 className="text-sm font-semibold text-slate-100">
						What-if 입력 설정
					</h2>
					<div className="flex items-center gap-2">
						{outputLoading && (
							<span className="text-[11px] text-emerald-300">
								출력 데이터를 불러오는 중...
							</span>
						)}
						<button
							type="button"
							onClick={() => {
								resetForm();
								handleClose();
							}}
							className="text-slate-300 hover:text-white"
						>
							×
						</button>
					</div>
				</div>

				<div className="flex flex-1 overflow-hidden">
					<div className="w-48 border-r border-slate-800 bg-slate-950/60">
						<ul className="flex flex-col">
							{WHAT_IF_TABS.map((tab) => (
								<li key={tab.id}>
									<button
										type="button"
										onClick={() => setActiveTab(tab.id)}
										className={`flex w-full flex-col gap-1 px-4 py-3 text-left text-[13px] transition ${
											tab.id === activeTab
												? "bg-slate-800/70 text-slate-50"
												: "hover:bg-slate-800/40"
										}`}
									>
										<span className="font-semibold">{tab.label}</span>
										<span className="text-[11px] text-slate-400">
											{tab.id === "basic"
												? "입력 범위 및 출력 선택"
												: "향후 확장 예정"}
										</span>
									</button>
								</li>
							))}
						</ul>
					</div>

					<div className="flex flex-1 flex-col overflow-y-auto px-6 py-4">
						{activeTab === "basic" ? (
							<div className="space-y-4">
								<p className="max-w-2xl text-[12px] text-slate-300">
									What-if 분석에 사용할 입력 범위를 지정하고, 결과 그래프 축을
									선택하세요. 모든 값은 사양서에 정의된 허용 범위 내에서만
									입력됩니다.
								</p>

								<div className="grid grid-cols-2 gap-4">
									{basicFields.map((field) => {
										const value = inputs[field.key];
										const error = touched[field.key]
											? errors[field.key]
											: undefined;
										return (
											<label
												key={field.key}
												className="flex flex-col gap-1 rounded-md border border-slate-800 bg-slate-950/40 p-3"
											>
												<div className="flex items-center justify-between gap-2">
													<span className="text-[12px] font-semibold text-slate-100">
														{field.label}
													</span>
													{field.description && (
														<Tooltip content={field.description} />
													)}
												</div>
												{field.type === "select" ? (
													<select
														value={value}
														onChange={(event) =>
															handleStoreInput(field.key, event.target.value)
														}
														className="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-slate-100"
													>
														{field.options?.map((option) => (
															<option value={option.value} key={option.value}>
																{option.label}
															</option>
														))}
													</select>
												) : (
													<div className="flex items-center gap-2">
														<input
															type="number"
															inputMode="decimal"
															value={value ?? ""}
															onChange={(event) =>
																handleStoreInput(field.key, event.target.value)
															}
															className={`w-full rounded border px-2 py-1 text-right text-slate-100 ${
																error
																	? "border-rose-400 bg-rose-950/20"
																	: "border-slate-700 bg-slate-900"
															}`}
															placeholder={field.defaultValue}
														/>
														{field.unit && (
															<span className="text-[11px] text-slate-400">
																{field.unit}
															</span>
														)}
													</div>
												)}
												<FieldError message={error} />
											</label>
										);
									})}
								</div>
							</div>
						) : (
							<div className="flex h-full items-center justify-center text-[12px] text-slate-500">
								해당 탭은 추후 업데이트 예정입니다.
							</div>
						)}
					</div>
				</div>

				<div className="flex justify-between border-t border-slate-700 bg-slate-900 px-6 py-3 text-[12px]">
					<button
						type="button"
						onClick={() => {
							resetForm();
						}}
						className="rounded bg-slate-800 px-3 py-2 text-slate-200 hover:bg-slate-700"
					>
						기본값으로 초기화
					</button>
					<div className="flex items-center gap-3">
						<button
							type="button"
							onClick={() => {
								setDataset(null);
								handleClose();
							}}
							className="rounded bg-slate-700 px-4 py-2 text-slate-200 hover:bg-slate-600"
						>
							취소
						</button>
						<button
							type="button"
							onClick={primaryAction}
							className="rounded bg-emerald-500 px-4 py-2 font-semibold text-emerald-950 hover:bg-emerald-400"
						>
							그래프 생성
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};
