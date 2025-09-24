import { FolderItem } from "@/components/ui/specific/FolderItem";
import { useEffect, useRef, useState } from "react";
import SidebarHeader from "./SidebarHeader";

import { ProjectInterface } from "@/types";
import { useProjectStore } from "@/store/useProjectStore";

import { KEYS } from "@/constants";

const BaseSidebar = () => {
  const folders = useProjectStore((state) => state.folderList);
  const setFolderList = useProjectStore((state) => state.setFolderList);

  const [shouldOpenProjectId, setShouldOpenProjectId] = useState("");

  const mounted = useRef(false);
  useEffect(() => {
    if (mounted.current) {
      return;
    }
    mounted.current = true;
    window.electronStore.delete(KEYS.PROJECT);
    (async () => {
      if (folders.length === 0) {
        const items = await window.electronStore.get(KEYS.PROJECT);
        if (Array.isArray(items) && items.length > 0) {
          setFolderList(items as ProjectInterface[]);
        }
      }
    })();
  }, [folders.length, setFolderList]);

  const handleProjectOpen = (id: string) => {
    setShouldOpenProjectId(id);
  };

  return (
    <div className="overflow-x-hidden overflow-y-hidden">
      <SidebarHeader handleProjectOpen={handleProjectOpen} />
      <div className="p-2">
        {folders.length === 0 && (
          <span className="text-slate-200 text-xs p-5 mt-10">
            생성된 프로젝트가 없습니다.
          </span>
        )}
        {folders.map((folder, index) => (
          <FolderItem
            data={folder}
            key={folder.id ?? index}
            shouldOpenProjectId={shouldOpenProjectId}
          />
        ))}
      </div>
    </div>
  );
};

export default BaseSidebar;
