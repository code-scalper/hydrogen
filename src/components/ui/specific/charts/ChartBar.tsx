import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type ChartBarProps = {
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

const ChartBar: React.FC<ChartBarProps> = ({ data }) => {
  return (
    <ResponsiveContainer>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" label={{ value: "Time (s)", dy: 10 }} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="SOC" fill="#8884d8" name="SOC_Tk (%)" />
        <Bar dataKey="Flow" fill="#ff7300" name="m_flow (g/s)" />
        <Bar dataKey="PRR" fill="#82ca9d" name="PRR (MPa/min)" />
        <Bar dataKey="Break" fill="#ffc658" name="P_BreakAway (MPa)" />
        <Bar dataKey="P" fill="#a83279" name="P_Tk (MPa)" />
        <Bar dataKey="T" fill="#2ca02c" name="T_Tk (°C)" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ChartBar;
