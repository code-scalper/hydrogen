import { useState } from "react";
import { Play, Square, Folder, Download } from "lucide-react";
import {
  PlayIcon,
  StopIcon,
  PlusIcon,
  DownloadIcon,
  GearIcon,
} from "@radix-ui/react-icons";
import { Button } from "@radix-ui/themes";

// custom components
import { AdjustBasicDataModal } from "../ui/specific/AdjustBasicDataModal";

// store
import { useInteractionStore } from "@/store/useInteractionStore";

const BaseContentHeader = () => {
  const adjustBasicDataOpen = useInteractionStore(
    (state) => state.adjustBasicDataOpen
  );
  const setAdjustBasicDataOpen = useInteractionStore(
    (state) => state.setAdjustBasicDataOpen
  );
  const handleCreate = () => {
    console.log("handle create");
  };

  const type = "A";

  const [displayExtraTool] = useState(false);
  return (
    <>
      <div className="bg-cyan-950 p-2  fixed w-full z-50 flex items-center">
        <div className="mr-5">
          <Button
            variant="solid"
            radius="none"
            className="!bg-cyan-800 !cursor-pointer"
            onClick={() => setAdjustBasicDataOpen(true)}
          >
            <GearIcon /> 기준정보
          </Button>
        </div>
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
      </div>
      <div className="mb-10"></div>
      <AdjustBasicDataModal
        isOpen={adjustBasicDataOpen}
        onClose={() => setAdjustBasicDataOpen(false)}
        onCreate={handleCreate}
      />
    </>
  );
};

export default BaseContentHeader;
