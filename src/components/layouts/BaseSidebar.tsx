import SidebarHeader from "./SidebarHeader";
import { FolderItem } from "@/components/ui/specific/FolderItem";

import { useProjectStore } from "@/store/useProjectStore";

const BaseSidebar = () => {
  const folders = useProjectStore((state) => state.folderList);
  // const setFolders = useProjectStore((state) => state.setFolderList);

  return (
    <div>
      <SidebarHeader />
      <div className="p-2">
        {folders.map((folder, index) => (
          <FolderItem data={folder} key={index} />
        ))}
      </div>
    </div>
  );
};

export default BaseSidebar;
