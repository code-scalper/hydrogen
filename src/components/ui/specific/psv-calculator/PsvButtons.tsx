interface PsvButtonsProps {
	onClose: () => void;
	onRun: () => void;
	onOpenChart: () => void;
	onSave?: () => void;
	disabled?: boolean;
	chartDisabled?: boolean;
}

const PsvButtons = ({
	onClose,
	onRun,
	onOpenChart,
	onSave,
	disabled,
	chartDisabled,
}: PsvButtonsProps) => {
	return (
		<div className="flex justify-center gap-2 px-4 py-3 border-t border-stone-700">
			<button
				type="button"
				onClick={onClose}
				className="text-xs px-6 py-2 bg-gray-500 text-gray-200 hover:bg-gray-600"
			>
				닫기
			</button>
			<button
				type="button"
				onClick={onRun}
				disabled={disabled}
				className="text-xs px-6 py-2 bg-blue-700 text-gray-200 hover:bg-blue-600 disabled:opacity-60 disabled:cursor-not-allowed"
			>
				계산
			</button>
			<button
				type="button"
				onClick={onOpenChart}
				disabled={chartDisabled}
				className="text-xs px-6 py-2 bg-blue-700 text-gray-200 hover:bg-blue-600 disabled:opacity-60 disabled:cursor-not-allowed"
			>
				그래프 출력
			</button>
			<button
				type="button"
				onClick={onSave ?? onClose}
				className="text-xs px-6 py-2 bg-blue-700 text-gray-200 hover:bg-blue-600"
			>
				저장
			</button>
		</div>
	);
};

export default PsvButtons;
