import { useState } from "react";
import {
  ChevronRightIcon,
  ChevronDownIcon,
  FolderIcon,
} from "@heroicons/react/24/solid";
import { useProjectStore } from "@/store/useProjectStore";

import FolderContext from "./FolderContext";

import { FolderItemInterface } from "@/types";

interface FolderItemProps {
  data: FolderItemInterface;
  level?: number;
}

export const FolderItem = ({ data, level = 0 }: FolderItemProps) => {
  const setSelectedProject = useProjectStore(
    (state) => state.setSelectedProject
  );

  const [open, setOpen] = useState(false);

  const toggle = () => setOpen((prev) => !prev);

  const [contextOpen, setContextOpen] = useState(false);
  const [contextMenuPos, setContextMenuPos] = useState({ x: 0, y: 0 });

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenuPos({ x: e.clientX, y: e.clientY });
    setContextOpen(true);
    setSelectedProject(data);
  };
  return (
    <div className="text-white text-xs" onContextMenu={handleContextMenu}>
      <div
        className="flex items-center cursor-pointer gap-1 mb-1"
        style={{ paddingLeft: `${level * 16}px` }}
        onClick={toggle}
      >
        {data.children?.length ? (
          open ? (
            <ChevronDownIcon className="h-3 w-3 text-slate-300" />
          ) : (
            <ChevronRightIcon className="h-3 w-3 text-slate-300" />
          )
        ) : (
          <div className="w-3 h-3" />
        )}

        <FolderIcon className="h-3 w-3 text-amber-400" />
        <span>{data.name}</span>
      </div>

      {open &&
        data.children?.map((child, idx) => (
          <FolderItem key={idx} data={child} level={level + 1} />
        ))}

      <FolderContext
        open={contextOpen}
        setOpen={setContextOpen}
        top={contextMenuPos.y}
        left={contextMenuPos.x}
      />
    </div>
  );
};
