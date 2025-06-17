import { ScrollArea } from "radix-ui";
import "@/css/scroll.css";
import clsx from "clsx";

interface BaseScrollAreaProps {
  items: any[];
  displayProperty: string;
  selectedId?: string;
  onItemClick?: (item: any) => void;
}

const BaseScrollArea = ({
  items,
  displayProperty,
  selectedId,
  onItemClick,
}: BaseScrollAreaProps) => (
  <ScrollArea.Root className="ScrollAreaRoot bg-gray-700">
    {items.length === 0 ? (
      <span className="w-full h-full flex items-start p-10 text-slate-400 justify-center ">
        아이템이 없습니다
      </span>
    ) : (
      <>
        <ScrollArea.Viewport className="ScrollAreaViewport">
          <div className="bg-gray-700 text-stone-300 px-2 py-1  ">
            {items.map((item, index) => (
              <div
                key={index}
                onClick={() => onItemClick?.(item)}
                className={clsx(
                  "Tag cursor-pointer px-2 py-2  transition ",
                  item.id === selectedId
                    ? "bg-blue-500 text-white"
                    : "hover:bg-gray-600"
                )}
              >
                {item[displayProperty]}
              </div>
            ))}
          </div>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar
          className="ScrollAreaScrollbar"
          orientation="vertical"
        >
          <ScrollArea.Thumb className="ScrollAreaThumb" />
        </ScrollArea.Scrollbar>
        <ScrollArea.Scrollbar
          className="ScrollAreaScrollbar"
          orientation="horizontal"
        >
          <ScrollArea.Thumb className="ScrollAreaThumb" />
        </ScrollArea.Scrollbar>
        <ScrollArea.Corner className="ScrollAreaCorner" />
      </>
    )}
  </ScrollArea.Root>
);

export default BaseScrollArea;
