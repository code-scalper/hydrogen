import type { FC } from "react";
import {
	Area,
	AreaChart,
	CartesianGrid,
	Legend,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

type ChartAreaProps = {
	data: {
		time: number;
		SOC?: number;
		Flow?: number;
		PRR?: number;
		Break?: number;
		P?: number;
		T?: number;
	}[];
};

const ChartArea: FC<ChartAreaProps> = ({ data }) => {
	return (
		<ResponsiveContainer>
			<AreaChart data={data}>
				<CartesianGrid strokeDasharray="3 3" />
				<XAxis dataKey="time" label={{ value: "Time (s)", dy: 10 }} />
				<YAxis />
				<Tooltip />
				<Legend />
				<Area
					type="monotone"
					dataKey="SOC"
					stroke="#8884d8"
					fill="#8884d8"
					name="SOC_Tk (%)"
				/>
				<Area
					type="monotone"
					dataKey="Flow"
					stroke="#ff7300"
					fill="#ff7300"
					name="m_flow (g/s)"
				/>
				<Area
					type="monotone"
					dataKey="PRR"
					stroke="#82ca9d"
					fill="#82ca9d"
					name="PRR (MPa/min)"
				/>
				<Area
					type="monotone"
					dataKey="Break"
					stroke="#ffc658"
					fill="#ffc658"
					name="P_BreakAway (MPa)"
				/>
				<Area
					type="monotone"
					dataKey="P"
					stroke="#a83279"
					fill="#a83279"
					name="P_Tk (MPa)"
				/>
				<Area
					type="monotone"
					dataKey="T"
					stroke="#2ca02c"
					fill="#2ca02c"
					name="T_Tk (°C)"
				/>
			</AreaChart>
		</ResponsiveContainer>
	);
};

export default ChartArea;
