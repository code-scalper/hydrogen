import { useState } from "react";
import { Button } from "../button";
import { CreateFolderModal } from "../ui/specific/CreateFolderModal";
import { CreateScenarioModal } from "@/components/ui/specific/CreateScenarioModal";
import { useProjectStore } from "@/store/useProjectStore";
import { generateCustomId } from "@/lib/utils";
const SidebarHeader = () => {
  const addFolder = useProjectStore((state) => state.addFolder);
  const [isOpen, setIsOpen] = useState(false);
  const [isScenarioOpen, setIsScenarioOpen] = useState(false);

  const handleCreate = (folderName: string) => {
    setIsOpen(false);
    addFolder({ name: folderName, id: generateCustomId("project") });
    console.log("생성된 폴더명:", folderName);
    // 여기에 폴더 추가 로직
  };
  const handleCreateScenario = (folderName: string) => {
    setIsScenarioOpen(false);
    // addScenario({ name: folderName });
    console.log("생성된 폴더명:", folderName);
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
        onClick={() => setIsScenarioOpen(true)}
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
        isOpen={isScenarioOpen}
        onClose={() => setIsScenarioOpen(false)}
        onCreate={handleCreateScenario}
      />
    </div>
  );
};

export default SidebarHeader;
