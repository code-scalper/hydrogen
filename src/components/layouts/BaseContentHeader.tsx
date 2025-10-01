import {
	DownloadIcon,
	GearIcon,
	PlayIcon,
	PlusIcon,
	StopIcon,
} from "@radix-ui/react-icons";
import { Button } from "@radix-ui/themes";
import { Download, Folder, Play, Square } from "lucide-react";
import { useState } from "react";

// custom components
import { AdjustBasicDataModal } from "../ui/specific/AdjustBasicDataModal";

// store
import { collectScenarioInputValues } from "@/lib/simulation";
import { useInteractionStore } from "@/store/useInteractionStore";
import { useProjectStore } from "@/store/useProjectStore";
import useSimulationStore from "@/store/useSimulationStore";
import CircularProgress from "../ui/CircularProgress";
import SimulationTimeline from "../ui/SimulationTimeline";
import LogHistoryModal from "../ui/specific/LogHistoryModal";

const BaseContentHeader = () => {
	const selectedScenario = useProjectStore((state) => state.selectedScenario);
	const adjustBasicDataOpen = useInteractionStore(
		(state) => state.adjustBasicDataOpen,
	);
	const setAdjustBasicDataOpen = useInteractionStore(
		(state) => state.setAdjustBasicDataOpen,
	);
	const hasInvalidInputs = useInteractionStore(
		(state) => Object.keys(state.invalidInputKeys).length > 0,
	);

	const type = "A";
	const [displayExtraTool] = useState(false);
	const [logModalOpen, setLogModalOpen] = useState(false);
	const [running, setRunning] = useState(false);

	const setSimulationFrames = useSimulationStore((state) => state.setFrames);
	const playSimulation = useSimulationStore((state) => state.playFromStart);
	const stopSimulationPlayback = useSimulationStore((state) => state.stop);

	const handleCreate = () => {};

	const handleRun = async () => {
		if (hasInvalidInputs) {
			console.warn("유효하지 않은 입력값이 있어 실행을 막았습니다.");
			return;
		}

		const payload = collectScenarioInputValues(selectedScenario);
		if (!payload) {
			console.warn("실행할 시나리오가 선택되지 않았습니다.");
			return;
		}

		setRunning(true);
		stopSimulationPlayback();

		try {
			const result = await window.electronAPI.runExe(payload);
			if (
				result &&
				typeof result === "object" &&
				Array.isArray(result.frames)
			) {
				setSimulationFrames(result.frames);
				if (result.frames.length > 0) {
					playSimulation();
				}
			}
		} catch (error) {
			console.error("실행 실패", error);
		} finally {
			setRunning(false);
		}
	};

	return (
		<>
			<div className="bg-cyan-950 p-2 w-full z-50 flex items-center justify-between gap-6">
				<div className="flex items-center gap-4">
					{selectedScenario?.baseData && (
						<Button
							variant="solid"
							radius="none"
							className="!bg-cyan-800 !cursor-pointer"
							onClick={() => setAdjustBasicDataOpen(true)}
						>
							<GearIcon /> 기준정보
						</Button>
					)}
					<SimulationTimeline width={280} />
				</div>

				<div className="flex items-center gap-4 ml-auto">
					{displayExtraTool && (
						<div>
							{type === "A" ? (
								<ul className="flex space-x-2 cursor-pointer">
									<li>
										<PlayIcon className="w-4 h-4 text-emerald-500" />
									</li>
									<li>
										<StopIcon className="w-4 h-4 text-rose-500" />
									</li>
									<li>
										<PlusIcon className="w-4 h-4" />
									</li>
									<li>
										<DownloadIcon className="w-4 h-4" />
									</li>
								</ul>
							) : (
								<ul className="flex space-x-2 cursor-pointer">
									<li>
										<Play className="w-4 h-4 text-emerald-500" />
									</li>
									<li>
										<Square className="w-4 h-4 text-rose-500" />
									</li>
									<li>
										<Folder className="w-4 h-4 text-yellow-600" />
									</li>
									<li>
										<Download className="w-4 h-4 text-blue-500" />
									</li>
								</ul>
							)}
						</div>
					)}
					<Button
						variant="solid"
						radius="none"
						className="!bg-slate-700 !text-slate-200 hover:!bg-slate-600"
						onClick={() => setLogModalOpen(true)}
					>
						로그 확인
					</Button>
				</div>
			</div>
			<div className="mb-10" />
			<AdjustBasicDataModal
				isOpen={adjustBasicDataOpen}
				onClose={() => setAdjustBasicDataOpen(false)}
				onCreate={handleCreate}
			/>

			<LogHistoryModal
				isOpen={logModalOpen}
				onClose={() => setLogModalOpen(false)}
			/>

			{running && <CircularProgress progress={66} label="실행 중..." />}
		</>
	);
};

export default BaseContentHeader;
