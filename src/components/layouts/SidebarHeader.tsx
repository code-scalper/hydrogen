import { CreateDeviceModal } from "@/components/ui/specific/CreateDeviceModal";
import { CreateScenarioModal } from "@/components/ui/specific/CreateScenarioModal";
import { useState } from "react";
import { Button } from "../button";
import { CreateProjectModal } from "../ui/specific/CreateProjectModal";

import { generateCustomId } from "@/lib/utils";
import { useInteractionStore } from "@/store/useInteractionStore";
import { useProjectStore } from "@/store/useProjectStore";

import type { ScenarioInterface } from "@/types";

// constants
import { SCENARIO_BASE_DATA } from "@/constants";
import cloneDeep from "lodash/cloneDeep";

interface SidebarHeaderProps {
	handleProjectOpen: (arg: string) => void;
}

const SidebarHeader = ({ handleProjectOpen }: SidebarHeaderProps) => {
	const addFolder = useProjectStore((state) => state.addFolder);
	const addScenario = useProjectStore((state) => state.addScenario);

	const scenarioOpen = useInteractionStore((state) => state.scenarioOpen);
	const setScenarioOpen = useInteractionStore((state) => state.setScenarioOpen);
	const deviceOpen = useInteractionStore((state) => state.deviceOpen);
	const setDeviceOpen = useInteractionStore((state) => state.setDeviceOpen);

	const [isOpen, setIsOpen] = useState(false);

	const handleCreate = (folderName: string, description: string) => {
		setIsOpen(false);
		const id = generateCustomId("project");
		addFolder({
			name: folderName,
			id,
			isExpanded: true,
			type: "project",
			description,
		});

		// 여기에 폴더 추가 로직
	};
	const handleCreateScenario = (
		projectId: string,
		scenario: ScenarioInterface,
		optionKey?: string,
	) => {
		setScenarioOpen(false);

		const scenarioPayload: ScenarioInterface = {
			...cloneDeep(scenario),
			type: "scenario",
			isExpanded: true,
			parentId: projectId,
			baseData: cloneDeep(SCENARIO_BASE_DATA),
		};

		if (optionKey) {
			scenarioPayload.optionKey = optionKey;
		}

		addScenario(projectId, scenarioPayload, optionKey);

		// ✅ 프로젝트 폴더 펼침 상태 강제
		handleProjectOpen(projectId);
	};

	const handleCreateDevice = () => {
		setDeviceOpen(false);

		// 여기에 폴더 추가 로직
	};

	return (
		<div className="flex justify-center items-center gap-1 pt-2">
			{/* <BaseDialog
        name="프로젝트생성"
        title="프로젝트생성"
        content={<CreateProjectDialog />}
      /> */}
			<Button onClick={() => setIsOpen(true)} className="text-xs bg-gray-700">
				프로젝트생성
			</Button>
			<Button
				onClick={() => setScenarioOpen(true)}
				className="text-xs bg-gray-700"
			>
				시나리오생성
			</Button>

			<CreateProjectModal
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				onCreate={handleCreate}
			/>
			<CreateScenarioModal
				isOpen={scenarioOpen}
				onClose={() => setScenarioOpen(false)}
				onCreate={handleCreateScenario}
			/>
			<CreateDeviceModal
				isOpen={deviceOpen}
				onClose={() => setDeviceOpen(false)}
				onCreate={handleCreateDevice}
			/>
		</div>
	);
};

export default SidebarHeader;
