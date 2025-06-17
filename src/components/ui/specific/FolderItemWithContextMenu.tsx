import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ProjectInterface } from "@/types"; // 너의 FolderItem 타입
// import { MoreHorizontal } from "lucide-react"; // 아이콘 (선택사항)
import { useState } from "react";

interface FolderItemProps {
  data: ProjectInterface;
}

export const FolderItemWithContext = ({ data }: FolderItemProps) => {
  const [open, setOpen] = useState(false);
  const [contextMenuPos, setContextMenuPos] = useState({ x: 0, y: 0 });

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenuPos({ x: e.clientX, y: e.clientY });
    setOpen(true);
  };

  return (
    <div onContextMenu={handleContextMenu} className="relative select-none">
      {/* 폴더 이름 */}
      <div className="text-white px-2 py-1 hover:bg-gray-700 rounded cursor-pointer">
        📁 {data.name}
      </div>

      {/* 드롭다운 메뉴 */}
      {open && (
        <DropdownMenu.Root open={open} onOpenChange={setOpen}>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="bg-white shadow-md rounded-md py-1 text-sm w-40 z-50"
              sideOffset={5}
              style={{
                position: "fixed",
                top: contextMenuPos.y,
                left: contextMenuPos.x,
              }}
            >
              <DropdownMenu.Item
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                onSelect={() => {
                  console.log("이름 변경:", data.name);
                  setOpen(false);
                }}
              >
                이름 변경
              </DropdownMenu.Item>

              <DropdownMenu.Item
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                onSelect={() => {
                  console.log("삭제:", data.name);
                  setOpen(false);
                }}
              >
                삭제
              </DropdownMenu.Item>

              <DropdownMenu.Item
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                onSelect={() => {
                  console.log("하위 폴더 추가:", data.name);
                  setOpen(false);
                }}
              >
                새로 추가
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      )}
    </div>
  );
};
