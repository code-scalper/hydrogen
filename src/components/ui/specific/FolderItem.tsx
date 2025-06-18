import { useState, useRef, useEffect } from "react";
import {
  ChevronRightIcon,
  ChevronDownIcon,
  FolderIcon,
  DeviceTabletIcon,
} from "@heroicons/react/24/solid";
import { useProjectStore } from "@/store/useProjectStore";
import FolderContext from "./FolderContext";

import { ProjectInterface, ScenarioInterface, DeviceInterface } from "@/types";
import * as Tooltip from "@radix-ui/react-tooltip";
import "@/css/tooltip.css";

import { useInteractionStore } from "@/store/useInteractionStore";

interface FolderItemProps {
  data: ProjectInterface;
  level?: number;
  parentId?: string;
}

export const FolderItem = ({ data, level = 0 }: FolderItemProps) => {
  // STORE START
  const setSelectedProject = useProjectStore(
    (state) => state.setSelectedProject
  );
  const setSelectedScenario = useProjectStore(
    (state) => state.setSelectedScenario
  );
  const setSelectedDevice = useProjectStore((state) => state.setSelectedDevice);
  const setSelectedProperty = useProjectStore(
    (state) => state.setSelectedProperty
  );

  const selectedProject = useProjectStore((state) => state.selectedProject);
  const selectedScenario = useProjectStore((state) => state.selectedScenario);
  const selectedDevice = useProjectStore((state) => state.selectedDevice);
  const selectedProperty = useProjectStore((state) => state.selectedProperty);

  const folderList = useProjectStore((state) => state.folderList);
  const updateItemName = useProjectStore((state) => state.updateItemName);

  const setScenarioOpen = useInteractionStore((state) => state.setScenarioOpen);
  const setDeviceOpen = useInteractionStore((state) => state.setDeviceOpen);

  // STORE END

  const inputRef = useRef<HTMLInputElement | null>(null);

  const [open, setOpen] = useState(false);

  const [isEditing, setIsEditing] = useState(false); // ✨ 이름 편집 상태
  const [nameInput, setNameInput] = useState(data.name);

  const toggle = () => setOpen((prev) => !prev);

  const [contextOpen, setContextOpen] = useState(false);
  const [contextMenuPos, setContextMenuPos] = useState({ x: 0, y: 0 });

  const findParentProject = (id: string): ProjectInterface | undefined => {
    return folderList.find((project) =>
      project.children?.some(function search(child) {
        if (child.id === id) return true;
        if (child.children) return child.children.some(search);
        return false;
      })
    );
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select(); // ✨ 텍스트 전체 선택
    }
  }, [isEditing]);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenuPos({ x: e.clientX, y: e.clientY });
    setContextOpen(true);
    switch (data.type) {
      case "project":
        if (selectedProject?.id !== data.id)
          setSelectedProject(data as ProjectInterface);
        break;
      case "scenario":
        if (selectedScenario?.id !== data.id)
          setSelectedScenario(data as ScenarioInterface);
        break;
      case "device":
        if (selectedDevice?.id !== data.id)
          setSelectedDevice(data as DeviceInterface);
        break;
      case "property":
        if (selectedProperty?.id !== data.id)
          setSelectedProperty(data as ProjectInterface); // 또는 PropertyInterface로 바꿔야 할 수도 있음
        break;
    }
  };

  const handleRenameFinish = () => {
    setIsEditing(false);
    if (nameInput.trim() === "") return;

    const parentProject = findParentProject(data.id); // 구현 필요 (아래 참조)

    updateItemName(
      data.id,
      nameInput,
      data.type,
      parentProject?.id // scenario, device, property일 때 필요
    );
  };

  const handleScenarioOpen = () => {
    setScenarioOpen(true);
  };

  const handleDeviceOpen = () => {
    setDeviceOpen(true);
  };

  const handleItemClick = () => {
    toggle();

    // if (data.type === "device") {
    //   setSelectedDevice(data)
    //   console.log("device", data);
    // }

    if (data.type === "scenario") {
      setSelectedScenario(data as ScenarioInterface);
      // onScenarioClick(data); // ✅ 커스텀 이벤트 실행
    }
  };

  const handleItemDoubleClick = () => {
    if (data.type === "device") {
      setDeviceOpen(true);
      setSelectedDevice(data as DeviceInterface);
    }
  };

  return (
    <div className="text-white text-xs">
      <div
        className="flex items-center cursor-pointer gap-1 mb-1"
        style={{ paddingLeft: `${level * 16}px` }}
        onContextMenu={handleContextMenu}
        onClick={handleItemClick}
        onDoubleClick={handleItemDoubleClick}
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

        {data.type === "device" ? (
          <DeviceTabletIcon className="h-3 w-3 text-amber-600" />
        ) : (
          <FolderIcon className="h-3 w-3 text-amber-400" />
        )}

        {/* 이름 영역 */}
        {isEditing ? (
          <input
            ref={inputRef}
            className="bg-slate-700 text-white text-xs p-1 rounded outline-none border border-slate-600"
            value={nameInput}
            autoFocus
            onChange={(e) => setNameInput(e.target.value)}
            onBlur={handleRenameFinish}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleRenameFinish();
              } else if (e.key === "Escape") {
                setIsEditing(false);
              }
            }}
          />
        ) : (
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <span>{data.name}</span>
            </Tooltip.Trigger>
            {data.description && (
              <Tooltip.Portal>
                <Tooltip.Content
                  className="TooltipContent "
                  side="right"
                  sideOffset={4}
                >
                  {data.description}
                  <Tooltip.Arrow className="TooltipArrow " />
                </Tooltip.Content>
              </Tooltip.Portal>
            )}
          </Tooltip.Root>
        )}
      </div>

      {open &&
        data.children?.map((child, idx) => (
          <FolderItem
            key={idx}
            data={child}
            level={level + 1}
            parentId={data.id}
          />
        ))}

      <FolderContext
        type={data.type}
        open={contextOpen}
        setOpen={setContextOpen}
        top={contextMenuPos.y}
        left={contextMenuPos.x}
        onScenarioOpen={() => {
          setContextOpen(false);
          handleScenarioOpen();
        }}
        onDeviceOpen={() => {
          setContextOpen(false);
          handleDeviceOpen();
        }}
        onRename={() => {
          setContextOpen(false);
          setIsEditing(true); // 👈 이름 바꾸기 시작
        }}
        onDelete={() => {
          const parent = findParentProject(data.id);
          useProjectStore.getState().deleteItem(
            data.id,
            data.type,
            parent?.id // project가 아닌 경우 필요
          );
        }}
      />
    </div>
  );
};
