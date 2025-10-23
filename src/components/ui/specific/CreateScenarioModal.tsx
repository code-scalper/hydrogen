import { useProjectStore } from "@/store/useProjectStore";
import { useEffect, useMemo, useState } from "react";
import SelectBox from "../SelectBox";

import type { ScenarioInterface } from "@/types";

import SFC1012 from "@/assets/sfc/sfc_1012.jpg";
import SFC1013 from "@/assets/sfc/sfc_1013.jpg";
import SFC1022 from "@/assets/sfc/sfc_1022.jpg";
import SFC1023 from "@/assets/sfc/sfc_1023.jpg";
import SFC1033 from "@/assets/sfc/sfc_1033.jpg";
import SFC1232 from "@/assets/sfc/sfc_1232.jpg";
import SFC1243 from "@/assets/sfc/sfc_1243.jpg";
import SFC2012 from "@/assets/sfc/sfc_2012.jpg";
import SFC2022 from "@/assets/sfc/sfc_2022.jpg";
import SFC2050 from "@/assets/sfc/sfc_2050.jpg";
import SFC3012 from "@/assets/sfc/sfc_3012.jpg";
import SFC3022 from "@/assets/sfc/sfc_3022.jpg";
import { DEFAULT_SCENARIO_VALUES } from "@/constants/defaultValue";
import { SCENARIO_OPTIONS } from "@/constants/scenarioOptions";
interface CreateScenarioModalProps {
	isOpen: boolean;
	onClose: () => void;
	onCreate: (
		projectId: string,
		scenario: ScenarioInterface,
		optionKey?: string,
	) => void;
}

const IMAGES: Record<string, string> = {
	SFC1012,
	SFC1013,
	SFC1022,
	SFC1023,
	SFC1033,
	SFC1232,
	SFC1243,
	SFC2012,
	SFC2022,
	SFC2050,
	SFC3012,
	SFC3022,
};

export const CreateScenarioModal = ({
	isOpen,
	onClose,
	onCreate,
}: CreateScenarioModalProps) => {
	const [typed, setTyped] = useState(false);
	const [name, setName] = useState("");
	const folders = useProjectStore((state) => state.folderList);
	const scenarios = useProjectStore((state) => state.scenarios);
	const selectedProject = useProjectStore((state) => state.selectedProject);

	const [selectedProjectId, setSelectedProjectId] = useState("");
	const [selectedScenarioId, setSelectedScenarioId] = useState("");
	const [selectedScenario, setSelectedScenario] =
		useState<ScenarioInterface | null>(null);
	const [selectedOptionKey, setSelectedOptionKey] = useState<string>("");
	// const setSelectedProject = useProjectStore(
	//   (state) => state.setSelectedProject
	// );

	const scenarioNameInputId = "create-scenario-name";

	const selectItems = useMemo(() => {
		const items =
			folders.map((folder) => {
				return { label: folder.name, key: folder.id };
			}) || [];
		return items ? items : [];
	}, [folders]);

	const selectScenarioItems = useMemo(() => {
		const items =
			scenarios.map((scenario) => ({
				label: scenario.sfcName,
				key: scenario.id,
				data: scenario,
			})) || [];
		return items ? items : [];
	}, [scenarios]);

	const scenarioOptions = useMemo(() => {
		if (!selectedScenarioId) {
			return [] as Array<{ key: string; name: string }>;
		}
		const defaults =
			DEFAULT_SCENARIO_VALUES[
				selectedScenarioId as keyof typeof DEFAULT_SCENARIO_VALUES
			];
		if (!defaults) {
			return [];
		}
		const override =
			SCENARIO_OPTIONS[selectedScenarioId as keyof typeof SCENARIO_OPTIONS] ??
			[];
		return Object.keys(defaults).map((key) => {
			const custom = override.find((option) => option.key === key);
			const fallback = key.startsWith("type")
				? `타입${key.replace("type", "")}`
				: key;
			return {
				key,
				name: custom?.name ?? fallback,
			};
		});
	}, [selectedScenarioId]);

	useEffect(() => {
		if (selectedProject) {
			setSelectedProjectId(selectedProject.id);
		}
	}, [selectedProject]);

	useEffect(() => {
		if (!isOpen) {
			setSelectedScenarioId("");
			setSelectedScenario(null);
			setName("");
			setTyped(false);
			setSelectedOptionKey("");
		}
	}, [isOpen]);

	useEffect(() => {
		if (!isOpen) {
			return;
		}

		const firstOption = scenarioOptions[0]?.key;
		if (!firstOption) {
			setSelectedOptionKey("");
			return;
		}

		setSelectedOptionKey((prev) => {
			if (prev && scenarioOptions.some((option) => option.key === prev)) {
				return prev;
			}
			return firstOption;
		});
	}, [scenarioOptions, isOpen]);

	const requiresOptionSelection = scenarioOptions.length > 1;
	const resolvedOptionKey =
		scenarioOptions.length > 0
			? selectedOptionKey || scenarioOptions[0]?.key || ""
			: "";
	const isCreateDisabled =
		!selectedProjectId ||
		!selectedScenario ||
		(requiresOptionSelection && !resolvedOptionKey);

	const selectedScenarioImage = useMemo(() => {
		const src = IMAGES[selectedScenarioId];
		return src;
	}, [selectedScenarioId]);

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 text-xs">
			<div className="bg-gray-800 rounded-md w-[500px] shadow-lg border border-gray-800 border-r">
				{/* Header */}
				<div className="flex justify-between items-center  p-2 bg-gray-900">
					<h2 className="text-xs text-slate-200  font-semibold">
						시나리오 생성
					</h2>
					<button
						type="button"
						onClick={onClose}
						className="text-slate-300 hover:text-black text-xs"
					>
						×
					</button>
				</div>

				<div className="p-4 space-y-5">
					<div className="space-y-2">
						<div className="flex items-center flex-start gap-2">
							<span className="text-xs text-slate-200 mr-3">프로젝트 선택</span>
							<SelectBox
								selectItems={selectItems}
								value={selectedProjectId}
								onValueChange={(val) => setSelectedProjectId(val)}
							/>
						</div>

						<div className="flex items-center flex-start gap-2">
							<span className="text-xs text-slate-200 mr-3">시나리오 선택</span>
							<SelectBox
								selectItems={selectScenarioItems}
								value={selectedScenarioId}
								onValueChange={(val, data) => {
									setSelectedScenarioId(val);
									const scenarioData =
										(data as ScenarioInterface | undefined) ?? null;
									setSelectedScenario(scenarioData);
									const defaults =
										DEFAULT_SCENARIO_VALUES[
											val as keyof typeof DEFAULT_SCENARIO_VALUES
										];
									const firstKey = defaults
										? (Object.keys(defaults)[0] ?? "")
										: "";
									setSelectedOptionKey(firstKey);
									if (scenarioData && (!typed || name.trim() === "")) {
										setName(scenarioData.name);
										setTyped(false);
									}
								}}
							/>
						</div>
						{scenarioOptions.length > 1 && (
							<div className="flex items-center gap-3 text-slate-200">
								<span className="text-xs whitespace-nowrap">시나리오 옵션</span>
								<div className="flex flex-wrap gap-3 ml-2">
									{scenarioOptions.map((option) => {
										const radioId = `scenario-option-${selectedScenarioId}-${option.key}`;
										return (
											<label
												key={option.key}
												htmlFor={radioId}
												className="flex items-center gap-2 rounded-full border border-slate-500 bg-slate-700/40 px-3 py-1 text-xs text-slate-200 transition-colors hover:border-blue-400 hover:text-white"
											>
												<input
													id={radioId}
													type="radio"
													name={`scenario-option-group-${selectedScenarioId}`}
													value={option.key}
													checked={selectedOptionKey === option.key}
													onChange={() => setSelectedOptionKey(option.key)}
													className="h-3.5 w-3.5 accent-blue-500"
												/>
												<span className="text-xs">{option.name}</span>
											</label>
										);
									})}
								</div>
							</div>
						)}
						<div className=" flex items-center flex-start gap-2">
							<label
								htmlFor={scenarioNameInputId}
								className="text-xs text-slate-200 mr-3"
							>
								시나리오 이름
							</label>
							<input
								id={scenarioNameInputId}
								type="text"
								value={name}
								onChange={(e) => {
									if (!typed) {
										setTyped(true);
									}
									setName(e.target.value);
								}}
								className="text-white text-xs border-none bg-gray-700 border rounded p-1 px-2 focus:outline-none focus:ring-2 focus:ring-blue-800 flex-1"
								placeholder="예: Scenario Name"
								onKeyDown={(e) => {
									if (
										e.key === "Enter" &&
										!isCreateDisabled &&
										selectedScenario
									) {
										onCreate(
											selectedProjectId,
											{ ...selectedScenario, name },
											resolvedOptionKey || undefined,
										);
										setTyped(true);
									}
								}}
								// onKeyDown={(e) => {
								//   if (e.key === "Enter") {
								//     // 엔터를 눌렀을 때 실행할 코드
								//     onCreate(name, description); // 예: 폴더 생성
								//   }
								// }}
							/>
						</div>
					</div>

					{selectedScenarioImage && (
						<div className="">
							<img src={selectedScenarioImage} alt={selectedProjectId} />
						</div>
					)}
				</div>

				{/* Footer */}
				<div className="flex justify-end gap-2 px-4 py-3">
					<button
						type="button"
						onClick={onClose}
						className="text-xs px-4 py-1  bg-gray-500 text-gray-200 hover:bg-gray-600"
					>
						취소
					</button>
					<button
						type="button"
						onClick={() => {
							if (isCreateDisabled) return;
							if (!selectedScenario) return;
							onCreate(
								selectedProjectId,
								{ ...selectedScenario, name },
								resolvedOptionKey || undefined,
							);
							setName("");
							onClose();
						}}
						disabled={isCreateDisabled}
						className={`text-xs px-4 py-1  ${
							isCreateDisabled
								? "bg-gray-600 text-gray-300 cursor-not-allowed"
								: "bg-blue-500 text-white hover:bg-blue-600"
						}`}
					>
						생성
					</button>
				</div>
			</div>
		</div>
	);
};
