import type { FC } from "react";

type VariableInfo = {
	key: string;
	name: string;
	unit: string;
	plotId: string;
};

interface ChartVariableTableProps {
	variables: VariableInfo[];
}

const ChartVariableTable: FC<ChartVariableTableProps> = ({ variables }) => {
	return (
		<div className="overflow-x-auto mt-2">
			<table className="min-w-full border border-gray-700 text-xs">
				<thead className="bg-gray-800 text-white">
					<tr>
						<th className="border px-2 py-1">Key</th>
						<th className="border px-2 py-1">Name</th>
						<th className="border px-2 py-1">Unit</th>
						<th className="border px-2 py-1">Plot ID</th>
					</tr>
				</thead>
				<tbody>
					{variables.map((v) => (
						<tr key={v.key} className="bg-gray-50">
							<td className="border px-2 py-1">{v.key}</td>
							<td className="border px-2 py-1">{v.name}</td>
							<td className="border px-2 py-1">{v.unit}</td>
							<td className="border px-2 py-1">{v.plotId}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default ChartVariableTable;
