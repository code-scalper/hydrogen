import { motion } from "framer-motion";
import type { FC } from "react";
import ChartArea from "./ChartArea";
import ChartBar from "./ChartBar";
import ChartLine from "./ChartLine";
import ChartMulti, { type MultiChartData } from "./ChartMulti";
import ChartVariableTable from "./ChartVariableTable";

type ChartType = "line" | "bar" | "area" | "multi";

type ChartDatum = MultiChartData;

type VariableDefinition = {
	key: string;
	name: string;
	unit: string;
	plotId: string;
};

interface ChartModalProps {
	open: boolean;
	onClose: () => void;
	type: ChartType;
	data: ChartDatum[];
	variables?: VariableDefinition[];
	showTable?: boolean; // ✅ 테이블 표시 여부
}

const ChartModal: FC<ChartModalProps> = ({
	open,
	onClose,
	type,
	data,
	variables,
	showTable = false,
}) => {
	if (!open) return null;

	const renderChart = () => {
		switch (type) {
			case "line":
				return <ChartLine data={data} />;
			case "bar":
				return <ChartBar data={data} />;
			case "area":
				return <ChartArea data={data} />;
			case "multi":
				return <ChartMulti data={data} variables={variables ?? []} />;
			default:
				return null;
		}
	};

	return (
		<div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
			<motion.div
				initial={{ opacity: 0, scale: 0.9 }}
				animate={{ opacity: 1, scale: 1 }}
				exit={{ opacity: 0, scale: 0.9 }}
				transition={{ duration: 0.3 }}
				className="bg-white rounded-2xl shadow-lg p-6 w-[90%] h-[90%] relative flex flex-col"
			>
				{/* 닫기 버튼 */}
				<button
					type="button"
					onClick={onClose}
					className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-lg"
				>
					✕
				</button>

				<h2 className="text-xl font-bold mb-4">📊 Chart Preview ({type})</h2>

				{/* 차트 영역 */}
				<div className="flex-1 overflow-auto">{renderChart()}</div>

				{/* 테이블 영역 (옵션) */}
				{showTable && variables && <ChartVariableTable variables={variables} />}
			</motion.div>
		</div>
	);
};

export default ChartModal;
