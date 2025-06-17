import { useState } from "react";
import { Button } from "../button";
import { CreateProjectModal } from "../ui/specific/CreateProjectModal";
import { CreateScenarioModal } from "@/components/ui/specific/CreateScenarioModal";
import { CreateDeviceModal } from "@/components/ui/specific/CreateDeviceModal";

import { useProjectStore } from "@/store/useProjectStore";
import { useInteractionStore } from "@/store/useInteractionStore";
import { generateCustomId } from "@/lib/utils";

import { ProjectInterface } from "@/types";

const SidebarHeader = () => {
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
    scenario: ProjectInterface
  ) => {
    setScenarioOpen(false);

    if (scenario.children) {
      scenario.children = scenario.children.map((sc: ProjectInterface) => {
        return { ...sc, projectId, scenarioId: scenario.id };
      });
    }

    addScenario(projectId, {
      ...scenario,
      type: "scenario",
      isExpanded: true,
      parentId: projectId,
    });

    // 여기에 폴더 추가 로직
  };

  const handleCreateDevice = (
    projectId: string,
    scenarioId: string,
    device: ProjectInterface
  ) => {
    setDeviceOpen(false);
    console.log(projectId, scenarioId, device);
    // addScenario(projectId, {
    //   ...scenario,
    //   type: "scenario",
    //   isExpanded: true,
    //   parentId: projectId,
    // });

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
