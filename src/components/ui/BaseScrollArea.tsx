import { ScrollArea } from "radix-ui";
import "@/css/scroll.css";

interface BaseScrollAreaProps {
  items: string[];
}
const BaseScrollArea = ({ items }: BaseScrollAreaProps) => (
  <ScrollArea.Root className="ScrollAreaRoot bg-gray-700">
    {items.length === 0 ? (
      <span className="w-full h-full flex items-start p-10  text-slate-400 justify-center">
        아이템이 없습니다
      </span>
    ) : (
      <>
        <ScrollArea.Viewport className="ScrollAreaViewport">
          <div
            style={{ padding: "0px 10px" }}
            className="bg-gray-700 text-stone-300"
          >
            {items.map((item) => (
              <div className="Tag" key={item}>
                {item}
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
