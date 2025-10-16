import { ScrollArea } from "radix-ui";
import "@/css/scroll.css";
import clsx from "clsx";

type ScrollItem = {
	id?: string;
	engName?: string;
};

interface BaseScrollAreaProps<T extends ScrollItem> {
	items: T[];
	displayProperty: keyof T;
	selectedId?: string;
	onItemClick?: (item: T) => void;
}

const BaseScrollArea = <T extends ScrollItem>({
	items,
	displayProperty,
	selectedId,
	onItemClick,
}: BaseScrollAreaProps<T>) => {
	const resolveLabel = (item: T): string => {
		const candidates = [item[displayProperty], item.engName, item.id];
		for (const candidate of candidates) {
			if (candidate === null || candidate === undefined) {
				continue;
			}
			const text = String(candidate).trim();
			if (text.length > 0) {
				return text;
			}
		}
		return "";
	};

	return (
		<ScrollArea.Root className="ScrollAreaRoot bg-gray-700">
			{items.length === 0 ? (
				<span className="w-full h-full flex items-start p-10 text-slate-400 justify-center ">
					아이템이 없습니다
				</span>
			) : (
				<>
					<ScrollArea.Viewport className="ScrollAreaViewport">
						<div className="bg-gray-700 text-stone-300 px-2 py-1  ">
							{items.map((item, index) => {
								const label = resolveLabel(item);
								const renderKey = item.id || `${index}-${label}`;
								return (
									<button
										type="button"
										key={renderKey}
										onClick={() => onItemClick?.(item)}
										className={clsx(
											"Tag cursor-pointer px-2 py-2 transition text-left w-full",
											item.id === selectedId
												? "bg-blue-500 text-white"
												: "hover:bg-gray-600",
										)}
									>
										{label || item.id || ""}
									</button>
								);
							})}
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
};

export default BaseScrollArea;
