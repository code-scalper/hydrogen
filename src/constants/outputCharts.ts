export interface SimulationChartSeries {
	key: string;
	label: string;
}

export interface SimulationChartDefinition {
	id: string;
	title: string;
	series: SimulationChartSeries[];
	note?: string;
}

export interface SimulationChartGroupDefinition {
	id: string;
	title: string;
	description?: string;
	charts: SimulationChartDefinition[];
}

export const OUTPUT_CHART_GROUPS: SimulationChartGroupDefinition[] = [
	{
		id: "PlotLqTk1",
		title: "PlotLqTk1",
		description: "액화수소 탱크 온도/압력/유량",
		charts: [
			{
				id: "tank-temperatures",
				title: "Tank Temperatures",
				series: [
					{ key: "T_GTkO", label: "T_GTkO" },
					{ key: "T_ITkO", label: "T_ITkO" },
					{ key: "T_LTkO", label: "T_LTkO" },
				],
			},
			{
				id: "tank-pressures",
				title: "Tank Pressures",
				series: [
					{ key: "P_GTkO", label: "P_GTkO" },
					{ key: "P_OpStO_LqTk", label: "P_OpStO_LqTk" },
					{ key: "P_ReseatO_LqTk", label: "P_ReseatO_LqTk" },
				],
			},
			{
				id: "mass-flows",
				title: "Mass Flows",
				series: [
					{ key: "m_BOGO", label: "m_BOGO" },
					{ key: "m_PSVO_LqTk", label: "m_PSVO_LqTk" },
				],
			},
		],
	},
	{
		id: "PlotLqTk2",
		title: "PlotLqTk2",
		description: "액화수소 탱크 유입 유량",
		charts: [
			{
				id: "lqtank-inflows",
				title: "Inlet Flow",
				series: [
					{ key: "Q_InGO", label: "Q_InGO" },
					{ key: "Q_InLO", label: "Q_InLO" },
					{ key: "Q_InGIO", label: "Q_InGIO" },
					{ key: "Q_InILO", label: "Q_InILO" },
				],
			},
		],
	},
	{
		id: "PlotPSVLBK1",
		title: "PlotPSVLBK1",
		description: "저압 뱅크 압력",
		charts: [
			{
				id: "psv-lbk-pressures",
				title: "Tank Pressures (LBK)",
				series: [
					{ key: "P_TkAccL", label: "P_TkAccL" },
					{ key: "P_TkOpFullL", label: "P_TkOpFullL" },
					{ key: "P_TkOpStartL", label: "P_TkOpStartL" },
					{ key: "P_TkL", label: "P_TkL" },
				],
			},
		],
	},
	{
		id: "PlotPSVLBK2",
		title: "PlotPSVLBK2",
		description: "저압 뱅크 질량 유량",
		charts: [
			{
				id: "psv-lbk-mass-flow",
				title: "Mass Flow (LBK)",
				series: [
					{ key: "W_Req_kgsL", label: "W_Req_kgsL" },
					{ key: "W_OpFullL", label: "W_OpFullL" },
					{ key: "W_OutL", label: "W_OutL" },
				],
			},
		],
	},
	{
		id: "PlotPSVLBK3",
		title: "PlotPSVLBK3",
		description: "저압 뱅크 토출 상태",
		charts: [
			{
				id: "psv-lbk-discharge",
				title: "Discharge Status (LBK)",
				series: [
					{ key: "W_OutL", label: "W_OutL" },
					{ key: "SD_1PL", label: "SD_1PL" },
				],
			},
		],
	},
	{
		id: "PlotPSVMBK1",
		title: "PlotPSVMBK1",
		description: "중압 뱅크 압력",
		charts: [
			{
				id: "psv-mbk-pressures",
				title: "Tank Pressures (MBK)",
				series: [
					{ key: "P_TkAccM", label: "P_TkAccM" },
					{ key: "P_TkOpFullM", label: "P_TkOpFullM" },
					{ key: "P_TkOpStartM", label: "P_TkOpStartM" },
					{ key: "P_TkM", label: "P_TkM" },
				],
			},
		],
	},
	{
		id: "PlotPSVMBK2",
		title: "PlotPSVMBK2",
		description: "중압 뱅크 질량 유량",
		charts: [
			{
				id: "psv-mbk-mass-flow",
				title: "Mass Flow (MBK)",
				series: [
					{ key: "W_Req_kgsM", label: "W_Req_kgsM" },
					{ key: "W_OpFullM", label: "W_OpFullM" },
					{ key: "W_OutM", label: "W_OutM" },
				],
			},
		],
	},
	{
		id: "PlotPSVMBK3",
		title: "PlotPSVMBK3",
		description: "중압 뱅크 토출 상태",
		charts: [
			{
				id: "psv-mbk-discharge",
				title: "Discharge Status (MBK)",
				series: [
					{ key: "W_OutM", label: "W_OutM" },
					{ key: "SD_1PM", label: "SD_1PM" },
				],
			},
		],
	},
	{
		id: "PlotPSVHBK1",
		title: "PlotPSVHBK1",
		description: "고압 뱅크 압력",
		charts: [
			{
				id: "psv-hbk-pressures",
				title: "Tank Pressures (HBK)",
				series: [
					{ key: "P_TkAccH", label: "P_TkAccH" },
					{ key: "P_TkOpFullH", label: "P_TkOpFullH" },
					{ key: "P_TkOpStartH", label: "P_TkOpStartH" },
					{ key: "P_TkH", label: "P_TkH" },
				],
			},
		],
	},
	{
		id: "PlotPSVHBK2",
		title: "PlotPSVHBK2",
		description: "고압 뱅크 질량 유량",
		charts: [
			{
				id: "psv-hbk-mass-flow",
				title: "Mass Flow (HBK)",
				series: [
					{ key: "W_Req_kgsH", label: "W_Req_kgsH" },
					{ key: "W_OpFullH", label: "W_OpFullH" },
					{ key: "W_OutH", label: "W_OutH" },
				],
			},
		],
	},
	{
		id: "PlotPSVHBK3",
		title: "PlotPSVHBK3",
		description: "고압 뱅크 토출 상태",
		charts: [
			{
				id: "psv-hbk-discharge",
				title: "Discharge Status (HBK)",
				series: [
					{ key: "W_OutH", label: "W_OutH" },
					{ key: "SD_1PH", label: "SD_1PH" },
				],
			},
		],
	},
	{
		id: "Plot1TimeFu",
		title: "Plot1TimeFu",
		description: "1회 충전 시 연료 탱크 상태",
		charts: [
			{
				id: "fueling-state-1",
				title: "Fueling State",
				series: [
					{ key: "SOC_Tk1_1", label: "SOC_Tk1_1" },
					{ key: "m_HFP1", label: "m_HFP1" },
					{ key: "APRR1", label: "APRR1" },
					{ key: "P_Ba1", label: "P_Ba1" },
					{ key: "T_Ba1", label: "T_Ba1" },
					{ key: "P_Tk1", label: "P_Tk1" },
					{ key: "T_Tk1", label: "T_Tk1" },
				],
			},
		],
	},
	{
		id: "PlotWISim",
		title: "PlotWISim",
		description: "What-if 시뮬레이션 결과",
		charts: [
			{
				id: "what-if",
				title: "What-if Result",
				series: [
					{ key: "T_Amb", label: "T_Amb" },
					{ key: "T_Ba1_1", label: "T_Ba1_1" },
					{ key: "P_Tk_01", label: "P_Tk_01" },
					{ key: "T_TkMax1", label: "T_TkMax1" },
					{ key: "t_ElepS1", label: "t_ElepS1" },
				],
			},
		],
	},
	{
		id: "PlotDisp1",
		title: "PlotDisp1",
		description: "Dispensing Station 1",
		charts: [
			{
				id: "disp1-fueling-state",
				title: "Fueling State",
				series: [
					{ key: "SOC_Tk1_3", label: "SOC_Tk1_3" },
					{ key: "m_HFP1_1", label: "m_HFP1_1" },
					{ key: "APRR1_1", label: "APRR1_1" },
					{ key: "P_Ba1_1", label: "P_Ba1_1" },
					{ key: "P_Tk1_3", label: "P_Tk1_3" },
					{ key: "T_Tk1_1", label: "T_Tk1_1" },
				],
			},
			{
				id: "disp1-fueling-step",
				title: "Fueling Step",
				series: [{ key: "D1Step", label: "D1Step" }],
			},
			{
				id: "disp1-cascade",
				title: "Cascade Flow Rate",
				series: [
					{ key: "DeFuel1_LBk", label: "DeFuel1_LBk" },
					{ key: "DeFuel1_MBk", label: "DeFuel1_MBk" },
					{ key: "DeFuel1_HBk", label: "DeFuel1_HBk" },
				],
			},
			{
				id: "disp1-mobility-pressure",
				title: "Mobility Tank Pressure",
				series: [{ key: "P_Tk1_4", label: "P_Tk1_4" }],
			},
		],
	},
	{
		id: "PlotDisp2",
		title: "PlotDisp2",
		description: "Dispensing Station 2",
		charts: [
			{
				id: "disp2-fueling-state",
				title: "Fueling State",
				series: [
					{ key: "SOC_Tk2_1", label: "SOC_Tk2_1" },
					{ key: "m_HFP2", label: "m_HFP2" },
					{ key: "APRR2", label: "APRR2" },
					{ key: "P_Ba2", label: "P_Ba2" },
					{ key: "P_Tk2_1", label: "P_Tk2_1" },
					{ key: "T_Tk2", label: "T_Tk2" },
				],
			},
			{
				id: "disp2-fueling-step",
				title: "Fueling Step",
				series: [{ key: "D2Step", label: "D2Step" }],
			},
			{
				id: "disp2-cascade",
				title: "Cascade Flow Rate",
				series: [
					{ key: "DeFuel2_LBk", label: "DeFuel2_LBk" },
					{ key: "DeFuel2_MBk", label: "DeFuel2_MBk" },
					{ key: "DeFuel2_HBk", label: "DeFuel2_HBk" },
				],
			},
			{
				id: "disp2-mobility-pressure",
				title: "Mobility Tank Pressure",
				series: [{ key: "P_Tk2_2", label: "P_Tk2_2" }],
			},
		],
	},
	{
		id: "PlotPTks",
		title: "PlotPTks",
		description: "탱크 압력 비교",
		charts: [
			{
				id: "ptks",
				title: "Tank Pressures",
				series: [
					{ key: "P_HBk", label: "P_HBk" },
					{ key: "P_MBk", label: "P_MBk" },
					{ key: "P_LBk", label: "P_LBk" },
					{ key: "P_TT1_1", label: "P_TT1_1" },
					{ key: "P_TT2_1", label: "P_TT2_1" },
					{ key: "P_Buf1_1", label: "P_Buf1_1" },
				],
			},
		],
	},
	{
		id: "PlotCps",
		title: "PlotCps",
		description: "Cold box 성능",
		charts: [
			{
				id: "cps",
				title: "CPS",
				series: [
					{ key: "m_HCpCapa", label: "m_HCpCapa" },
					{ key: "m_HCpReal_1", label: "m_HCpReal_1" },
					{ key: "m_MCp2Capa", label: "m_MCp2Capa" },
					{ key: "m_MCp2Real_1", label: "m_MCp2Real_1" },
					{ key: "m_MCp1Capa", label: "m_MCp1Capa" },
					{ key: "m_MCp1Real_1", label: "m_MCp1Real_1" },
					{ key: "m_LCpCapa", label: "m_LCpCapa" },
					{ key: "m_LCpReal_1", label: "m_LCpReal_1" },
				],
			},
		],
	},
];
