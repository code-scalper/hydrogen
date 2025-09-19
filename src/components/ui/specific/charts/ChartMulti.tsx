import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type MultiChartData = {
  time: number;
  [key: string]: number | undefined;
};

type VariableInfo = {
  key: string;
  name: string;
  unit: string;
  plotId: string;
  color?: string;
};

interface ChartMultiProps {
  data: MultiChartData[];
  variables: VariableInfo[];
}

const ChartMulti: React.FC<ChartMultiProps> = ({ data, variables }) => {
  const grouped = variables.reduce((acc: Record<string, VariableInfo[]>, v) => {
    if (!acc[v.plotId]) acc[v.plotId] = [];
    acc[v.plotId].push(v);
    return acc;
  }, {});

  const palette = [
    "#8884d8",
    "#ff7300",
    "#82ca9d",
    "#a83279",
    "#2ca02c",
    "#ffc658",
  ];

  return (
    <div className="flex flex-col gap-2">
      {Object.entries(grouped).map(([plotId, vars]) => (
        <div key={plotId} className="relative h-[200px]">
          <ResponsiveContainer>
            <LineChart data={data} syncId="multiSync">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              {vars.map((v, idx) => (
                <Line
                  key={v.key}
                  type="monotone"
                  dataKey={v.key}
                  stroke={v.color ?? palette[idx % palette.length]}
                  name={`${v.name} (${v.unit})`}
                  dot={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>

          {/* Legend를 absolute overlay */}
          <div className="absolute top-4 right-4 bg-white/80 rounded-md shadow-md p-2 text-xs">
            {vars.map((v, idx) => (
              <div key={v.key} className="flex items-center gap-2 mb-1">
                <div
                  className="w-3 h-3 rounded"
                  style={{
                    backgroundColor: v.color ?? palette[idx % palette.length],
                  }}
                />
                <span className="whitespace-nowrap">
                  {v.name} ({v.unit})
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChartMulti;
