import type { FC } from "react";
import {
	CartesianGrid,
	Legend,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

type ChartLineProps = {
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

const ChartLine: FC<ChartLineProps> = ({ data }) => {
	return (
		<ResponsiveContainer>
			<LineChart data={data}>
				<CartesianGrid strokeDasharray="3 3" />
				<XAxis dataKey="time" label={{ value: "Time (s)", dy: 10 }} />
				<YAxis />
				<Tooltip />
				<Legend />
				<Line
					type="monotone"
					dataKey="SOC"
					stroke="#8884d8"
					name="SOC_Tk (%)"
				/>
				<Line
					type="monotone"
					dataKey="Flow"
					stroke="#ff7300"
					name="m_flow (g/s)"
				/>
				<Line
					type="monotone"
					dataKey="PRR"
					stroke="#82ca9d"
					name="PRR (MPa/min)"
				/>
				<Line
					type="monotone"
					dataKey="Break"
					stroke="#ffc658"
					name="P_BreakAway (MPa)"
				/>
				<Line type="monotone" dataKey="P" stroke="#a83279" name="P_Tk (MPa)" />
				<Line type="monotone" dataKey="T" stroke="#2ca02c" name="T_Tk (°C)" />
			</LineChart>
		</ResponsiveContainer>
	);
};

export default ChartLine;
