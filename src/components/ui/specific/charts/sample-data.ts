export const multiData = [
  {
    time: 0,
    P_Tk: 85,
    P_Acc: 115,
    P_OpFull: 95,
    W_Req: 1.8,
    W_Out: 0,
    SafetyDistance: 0,
  },
  {
    time: 500,
    P_Tk: 87,
    P_Acc: 115,
    P_OpFull: 95,
    W_Req: 1.8,
    W_Out: 0,
    SafetyDistance: 0,
  },
  {
    time: 1000,
    P_Tk: 90,
    P_Acc: 115,
    P_OpFull: 95,
    W_Req: 1.8,
    W_Out: 5,
    SafetyDistance: 10,
  },
  {
    time: 1500,
    P_Tk: 95,
    P_Acc: 115,
    P_OpFull: 95,
    W_Req: 1.8,
    W_Out: 10,
    SafetyDistance: 20,
  },
  {
    time: 2000,
    P_Tk: 96,
    P_Acc: 115,
    P_OpFull: 95,
    W_Req: 1.8,
    W_Out: 9,
    SafetyDistance: 25,
  },
];

export const variableDefs = [
  {
    key: "P_Tk",
    name: "Tank Pressure",
    unit: "MPa",
    plotId: "Plot1",
    color: "#a83279",
  },
  {
    key: "P_Acc",
    name: "Acceptance Pressure",
    unit: "MPa",
    plotId: "Plot1",
    color: "#1f77b4",
  },
  {
    key: "P_OpFull",
    name: "Operation Full Pressure",
    unit: "MPa",
    plotId: "Plot1",
    color: "#ff7f0e",
  },

  {
    key: "W_Req",
    name: "Requested Flow",
    unit: "kg/s",
    plotId: "Plot2",
    color: "#2ca02c",
  },
  {
    key: "W_Out",
    name: "Outlet Flow",
    unit: "kg/s",
    plotId: "Plot2",
    color: "#d62728",
  },

  {
    key: "SafetyDistance",
    name: "Safety Distance",
    unit: "m",
    plotId: "Plot3",
    color: "#9467bd",
  },
];

export const singleChartData = [
  { time: 0, SOC: 10, Flow: 0, PRR: 1, Break: 10, P: 10, T: 15 },
  { time: 100, SOC: 20, Flow: 2, PRR: 5, Break: 20, P: 15, T: 25 },
  { time: 200, SOC: 30, Flow: 5, PRR: 10, Break: 25, P: 20, T: 35 },
  { time: 400, SOC: 50, Flow: 8, PRR: 20, Break: 30, P: 30, T: 50 },
  { time: 600, SOC: 70, Flow: 6, PRR: 18, Break: 35, P: 40, T: 70 },
  { time: 700, SOC: 90, Flow: 4, PRR: 15, Break: 40, P: 50, T: 90 },
];
