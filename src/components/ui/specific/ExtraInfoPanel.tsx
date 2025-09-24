import type { DeviceInterface } from "@/types";
const ExtraInfoPanel = ({ props }: { props: DeviceInterface["props"] }) => {
	return (
		<div className="w-[400px] bg-gray-700 p-3 text-[10px] overflow-y-auto max-h-[550px]">
			<h3 className="text-sm font-bold mb-2 text-white">추가 정보</h3>
			<table className="w-full text-left border-collapse">
				<thead>
					<tr className="border-b border-gray-600">
						<th className="py-1 px-2 text-gray-300">Name</th>
						<th className="py-1 px-2 text-gray-300">Description</th>
						<th className="py-1 px-2 text-gray-300">Unit</th>
						<th className="py-1 px-2 text-gray-300">Min</th>
						<th className="py-1 px-2 text-gray-300">Max</th>
					</tr>
				</thead>
				<tbody>
					{props.map((prop) => (
						<tr key={prop.key} className="border-b border-gray-600">
							<td className="py-1 px-2 text-white">{prop.name}</td>
							<td className="py-1 px-2 text-white">{prop.description}</td>
							<td className="py-1 px-2 text-white">{prop.unit}</td>
							<td className="py-1 px-2 text-white" /> {/* min */}
							<td className="py-1 px-2 text-white" /> {/* max */}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default ExtraInfoPanel;
