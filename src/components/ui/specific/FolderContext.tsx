import { useState } from "react";
import { DropdownMenu } from "radix-ui";

import {
  DotFilledIcon,
  CheckIcon,
  ChevronRightIcon,
} from "@radix-ui/react-icons";
import "@/css/dropdown.css";

interface FolderContextInterface {
  open: boolean;
  setOpen: (arg1: boolean) => void;
  top: number;
  left: number;
  onRename?: () => void; // ✨ 이름 바꾸기 콜백
  type: string;
  onDelete: () => void;
  onScenarioOpen: () => void;
  onDeviceOpen: () => void;
}

const FolderContext = ({
  open,
  setOpen,
  onRename,
  top,
  left,
  type = "project",
  onDelete,
  onDeviceOpen,
  onScenarioOpen,
}: FolderContextInterface) => {
  const [bookmarksChecked, setBookmarksChecked] = useState(true);
  const [urlsChecked, setUrlsChecked] = useState(false);
  const [person, setPerson] = useState("pedro");
  return (
    <DropdownMenu.Root open={open} onOpenChange={setOpen}>
      {/* <DropdownMenu.Trigger asChild>
        <button className="IconButton" aria-label="Customise options">
          <HamburgerMenuIcon />
        </button>
      </DropdownMenu.Trigger> */}

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="DropdownMenuContent"
          sideOffset={5}
          style={{
            position: "fixed",
            top,
            left,
          }}
        >
          <DropdownMenu.Item
            className="DropdownMenuItem"
            onClick={() => {
              onDeviceOpen();
            }}
          >
            상세보기 <div className="RightSlot">⌘+T</div>
          </DropdownMenu.Item>
          <DropdownMenu.Item className="DropdownMenuItem">
            새 프로젝트 <div className="RightSlot">⌘+T</div>
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className="DropdownMenuItem"
            onClick={() => {
              onScenarioOpen();
            }}
          >
            새 시나리오 <div className="RightSlot">⌘+T</div>
          </DropdownMenu.Item>

          {type === "project" && (
            <>
              <DropdownMenu.Item
                className="DropdownMenuItem"
                onClick={() => {
                  onRename?.(); // 부모에서 처리
                }}
              >
                이름 바꾸기 <div className="RightSlot">F2</div>
              </DropdownMenu.Item>{" "}
              <DropdownMenu.Item
                className="DropdownMenuItem text-rose-400"
                onClick={() => {
                  setOpen(false);
                  onDelete(); // 전달된 삭제 콜백 실행
                }}
              >
                삭제하기 <div className="RightSlot">⌘+D</div>
              </DropdownMenu.Item>
            </>
          )}
          {type === "scenario" && (
            <>
              <DropdownMenu.Item
                className="DropdownMenuItem"
                onClick={() => {
                  onRename?.(); // 부모에서 처리
                }}
              >
                이름 바꾸기 <div className="RightSlot">F2</div>
              </DropdownMenu.Item>{" "}
              <DropdownMenu.Item
                className="DropdownMenuItem text-red-500"
                onClick={() => {
                  setOpen(false);
                  onDelete(); // 전달된 삭제 콜백 실행
                }}
              >
                삭제하기 <div className="RightSlot">⌘+D</div>
              </DropdownMenu.Item>
            </>
          )}

          {type === "device" && <></>}
          {type === "property" && <></>}

          {/*<DropdownMenu.Item className="DropdownMenuItem" disabled>
            New Private Window <div className="RightSlot">⇧+⌘+N</div>
          </DropdownMenu.Item> */}
          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger className="DropdownMenuSubTrigger">
              더 보기
              <div className="RightSlot">
                <ChevronRightIcon />
              </div>
            </DropdownMenu.SubTrigger>
            <DropdownMenu.Portal>
              <DropdownMenu.SubContent
                className="DropdownMenuSubContent"
                sideOffset={2}
                alignOffset={-5}
              >
                <DropdownMenu.Item className="DropdownMenuItem">
                  저장하기… <div className="RightSlot">⌘+S</div>
                </DropdownMenu.Item>
                <DropdownMenu.Item className="DropdownMenuItem">
                  저장하기2…
                </DropdownMenu.Item>
                <DropdownMenu.Item className="DropdownMenuItem">
                  저장하기3…
                </DropdownMenu.Item>
                <DropdownMenu.Separator className="DropdownMenu.Separator" />
                <DropdownMenu.Item className="DropdownMenuItem">
                  저장하려다 지우기
                </DropdownMenu.Item>
              </DropdownMenu.SubContent>
            </DropdownMenu.Portal>
          </DropdownMenu.Sub>

          <DropdownMenu.Separator className="DropdownMenuSeparator" />

          <DropdownMenu.CheckboxItem
            className="DropdownMenuCheckboxItem"
            checked={bookmarksChecked}
            onCheckedChange={setBookmarksChecked}
          >
            <DropdownMenu.ItemIndicator className="DropdownMenuItemIndicator">
              <CheckIcon />
            </DropdownMenu.ItemIndicator>
            화면에 무엇 표시 <div className="RightSlot">⌘+B</div>
          </DropdownMenu.CheckboxItem>
          <DropdownMenu.CheckboxItem
            className="DropdownMenuCheckboxItem"
            checked={urlsChecked}
            onCheckedChange={setUrlsChecked}
          >
            <DropdownMenu.ItemIndicator className="DropdownMenuItemIndicator">
              <CheckIcon />
            </DropdownMenu.ItemIndicator>
            화면이 이거도 표시
          </DropdownMenu.CheckboxItem>

          <DropdownMenu.Separator className="DropdownMenuSeparator" />

          <DropdownMenu.Label className="DropdownMenuLabel">
            프로젝트 옵션
          </DropdownMenu.Label>
          <DropdownMenu.RadioGroup value={person} onValueChange={setPerson}>
            <DropdownMenu.RadioItem
              className="DropdownMenuRadioItem"
              value="option1"
            >
              <DropdownMenu.ItemIndicator className="DropdownMenuItemIndicator">
                <DotFilledIcon />
              </DropdownMenu.ItemIndicator>
              이런이런 옵션이다
            </DropdownMenu.RadioItem>
            <DropdownMenu.RadioItem
              className="DropdownMenuRadioItem"
              value="option2"
            >
              <DropdownMenu.ItemIndicator className="DropdownMenuItemIndicator">
                <DotFilledIcon />
              </DropdownMenu.ItemIndicator>
              저런저런 옵션이다
            </DropdownMenu.RadioItem>
          </DropdownMenu.RadioGroup>

          <DropdownMenu.Arrow className="DropdownMenuArrow" />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default FolderContext;
