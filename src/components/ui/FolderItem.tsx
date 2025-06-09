import { useState } from "react";
import {
  ChevronRightIcon,
  ChevronDownIcon,
  FolderIcon,
} from "@heroicons/react/24/solid";

type FolderData = {
  name: string;
  children?: FolderData[];
};

interface FolderItemProps {
  data: FolderData;
  level?: number;
}

export const FolderItem = ({ data, level = 0 }: FolderItemProps) => {
  const [open, setOpen] = useState(false);

  const toggle = () => setOpen((prev) => !prev);

  return (
    <div className="text-white text-xs">
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
    </div>
  );
};
