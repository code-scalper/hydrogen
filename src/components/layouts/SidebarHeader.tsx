import { useState, useEffect } from "react";
import { Button } from "../button";
import { CreateFolderModal } from "../ui/specific/CreateFolderModal";
import { CreateScenarioModal } from "@/components/ui/specific/CreateScenarioModal";
import { useProjectStore } from "@/store/useProjectStore";
import { useInteractionStore } from "@/store/useInteractionStore";
import { generateCustomId } from "@/lib/utils";

import { FolderItemInterface } from "@/types";

const SidebarHeader = () => {
  const addFolder = useProjectStore((state) => state.addFolder);
  const addScenario = useProjectStore((state) => state.addScenario);
  const scenarioOpen = useInteractionStore((state) => state.scenarioOpen);
  const setScenarioOpen = useInteractionStore((state) => state.setScenarioOpen);
  const [isOpen, setIsOpen] = useState(false);

  const handleCreate = (folderName: string) => {
    setIsOpen(false);
    addFolder({ name: folderName, id: generateCustomId("project") });

    // 여기에 폴더 추가 로직
  };
  const handleCreateScenario = (
    projectId: string,
    scenario: FolderItemInterface
  ) => {
    setScenarioOpen(false);
    addScenario(projectId, scenario);

    // 여기에 폴더 추가 로직
  };

  return (
    <div className="flex justify-center items-center gap-1 pt-3">
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

      <CreateFolderModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onCreate={handleCreate}
      />
      <CreateScenarioModal
        isOpen={scenarioOpen}
        onClose={() => setScenarioOpen(false)}
        onCreate={handleCreateScenario}
      />
    </div>
  );
};

export default SidebarHeader;
