export const OUTPUT_PROPERTIES = {
	P_LqTk: {
		key: "P_LqTk",
		name: "탱크 내부 압력",
		unit: "MPaa",
		description: "탱크 내부 압력",
		type: "output",
		order: 1,
	},
	T_LqTk: {
		key: "T_LqTk",
		name: "탱크 내부 온도",
		unit: "℃",
		description: "탱크 내부 온도",
		type: "output",
		order: 2,
	},
	m_Sum_LqTk: {
		key: "m_Sum_LqTk",
		name: "탱크 내부 가스 질량",
		unit: "kg",
		description: "탱크 내부 가스의 질량",
		type: "output",
		order: 3,
	},
	T_GTkO: {
		key: "T_GTkO",
		name: "탱크 내 기상부 온도",
		unit: "K",
		description: "탱크 내 기상부 온도",
		type: "output",
		order: 4,
	},
	T_ITkO: {
		key: "T_ITkO",
		name: "탱크 내 기액 경계면 온도",
		unit: "K",
		description: "탱크 내 기액 경계면 온도",
		type: "output",
		order: 5,
	},
	T_LTkO: {
		key: "T_LTkO",
		name: "탱크 내 액상부 온도",
		unit: "K",
		description: "탱크 내 액상부 온도",
		type: "output",
		order: 6,
	},
	P_GTkO: {
		key: "P_GTkO",
		name: "탱크 내 기상부 압력",
		unit: "MPaa",
		description: "탱크 내 기상부 압력",
		type: "output",
		order: 7,
	},
	P_OpStO_LqTk: {
		key: "P_OpStO_LqTk",
		name: "압력상승 국면 개방 개시 압력",
		unit: "MPa",
		description: "압력상승 국면에서 개방 개시 압력",
		type: "output",
		order: 8,
	},
	P_ReseatO_LqTk: {
		key: "P_ReseatO_LqTk",
		name: "압력강하 국면 폐쇄 개시 압력",
		unit: "MPa",
		description: "압력강하 국면에서 폐쇄 개시 압력",
		type: "output",
		order: 9,
	},
	m_BOGO: {
		key: "m_BOGO",
		name: "BOG 발생 속도",
		unit: "kg/s",
		description: "BOG 발생속도",
		type: "output",
		order: 10,
	},
	m_PSVO_LqTk: {
		key: "m_PSVO_LqTk",
		name: "PSV 방출 유속",
		unit: "kg/s",
		description: "PSV 방출유속",
		type: "output",
		order: 11,
	},
	Q_InGO: {
		key: "Q_InGO",
		name: "탱크 내 기상부 유입 열량",
		unit: "kJ/s",
		description: "탱크 내 기상부로 들어가는 열량",
		type: "output",
		order: 12,
	},
	Q_InLO: {
		key: "Q_InLO",
		name: "탱크 내 액상부 유입 열량",
		unit: "kJ/s",
		description: "탱크 내 액상부로 들어가는 열량",
		type: "output",
		order: 13,
	},
	Q_InGIO: {
		key: "Q_InGIO",
		name: "탱크 내 기상부에서 기액 경계면으로의 유입 열량",
		unit: "kJ/s",
		description: "탱크 내 기상부에서 기액 경계면으로 들어가는 열량",
		type: "output",
		order: 14,
	},
	Q_InILO: {
		key: "Q_InILO",
		name: "탱크 내 기액 경계면에서 액상부로의 유입 열량",
		unit: "kJ/s",
		description: "탱크 내 기액 경계면에서 액상부로 들어가는 열량",
		type: "output",
		order: 15,
	},
	m_Real_LqPp: {
		key: "m_Real_LqPp",
		name: "실제 펌핑량",
		unit: "kg/h",
		description: "실재 펌핑량",
		type: "output",
		order: 16,
	},
	m_LqPpReal: {
		key: "m_LqPpReal",
		name: "기화기 실제 기화량",
		unit: "kg/h",
		description: "Vaporizer 실재 기화량",
		type: "output",
		order: 17,
	},
	P_Source: {
		key: "P_Source",
		name: "Source의 압력",
		unit: "MPa",
		description: "Source(Electrolysis or Pipe)의 압력",
		type: "output",
		order: 18,
	},
	T_SourceC: {
		key: "T_SourceC",
		name: "Source의 온도",
		unit: "℃",
		description: "Source(Electrolysis or Pipe)의 온도",
		type: "output",
		order: 19,
	},
	m_Source: {
		key: "m_Source",
		name: "Source의 유량",
		unit: "kg/h",
		description: "Source(Electrolysis or Pipe)의 유량",
		type: "output",
		order: 20,
	},
	P_Buf1: {
		key: "P_Buf1",
		name: "탱크 압력",
		unit: "MPa",
		description: "Tank 압력",
		type: "output",
		order: 21,
	},
	M_BufSum1: {
		key: "M_BufSum1",
		name: "탱크 내 가스 질량",
		unit: "kg",
		description: "Tank 내 가스 질량",
		type: "output",
		order: 22,
	},
	P_Buf2: {
		key: "P_Buf2",
		name: "탱크 압력",
		unit: "MPa",
		description: "Tank 압력",
		type: "output",
		order: 23,
	},
	M_BufSum2: {
		key: "M_BufSum2",
		name: "탱크 내 가스 질량",
		unit: "kg",
		description: "Tank 내 가스 질량",
		type: "output",
		order: 24,
	},
	P_TT1: {
		key: "P_TT1",
		name: "내부 압력",
		unit: "MPa",
		description: "TT 내부 압력",
		type: "output",
		order: 25,
	},
	T_TT1: {
		key: "T_TT1",
		name: "내부 온도",
		unit: "K",
		description: "TT 내부 온도",
		type: "output",
		order: 26,
	},
	m_TTSum1: {
		key: "m_TTSum1",
		name: "내부 가스 질량",
		unit: "kg",
		description: "TT 내부 가스 질량",
		type: "output",
		order: 27,
	},
	P_TT2: {
		key: "P_TT2",
		name: "내부 압력",
		unit: "MPa",
		description: "TT 내부 압력",
		type: "output",
		order: 28,
	},
	T_TT2: {
		key: "T_TT2",
		name: "내부 온도",
		unit: "K",
		description: "TT 내부 온도",
		type: "output",
		order: 29,
	},
	m_TTSum2: {
		key: "m_TTSum2",
		name: "내부 가스 질량",
		unit: "kg",
		description: "TT 내부 가스 질량",
		type: "output",
		order: 30,
	},
	m_LCp: {
		key: "m_LCp",
		name: "저압 압축기 유량",
		unit: "kg/h",
		description: "저압 압축기 유량",
		type: "output",
		order: 31,
	},
	m_MCp1: {
		key: "m_MCp1",
		name: "압축기 유량",
		unit: "kg/h",
		description: "압축기 유량",
		type: "output",
		order: 32,
	},
	m_MCp2: {
		key: "m_MCp2",
		name: "압축기 유량",
		unit: "kg/h",
		description: "압축기 유량",
		type: "output",
		order: 33,
	},
	m_HCp: {
		key: "m_HCp",
		name: "고압 압축기 유량",
		unit: "kg/h",
		description: "압축기 유량",
		type: "output",
		order: 34,
	},
	P_TkL: {
		key: "P_TkL",
		name: "탱크 내부 압력",
		unit: "MPa",
		description: "Tank 내부 압력",
		type: "output",
		order: 35,
	},
	T_TkL: {
		key: "T_TkL",
		name: "탱크 내부 온도",
		unit: "℃",
		description: "Tank 내부 온도",
		type: "output",
		order: 36,
	},
	m_SumL: {
		key: "m_SumL",
		name: "탱크 내부 가스 질량",
		unit: "kg",
		description: "Tank 내부 가스 질량",
		type: "output",
		order: 37,
	},
	W_ReqL: {
		key: "W_ReqL",
		name: "PSV 필요분출유량",
		unit: "kg/hr",
		description: "PSV 필요분출유량",
		type: "output",
		order: 38,
	},
	AaL: {
		key: "AaL",
		name: "PSV 필요분출면적",
		unit: "mm2",
		description: "PSV 필요분출면적",
		type: "output",
		order: 39,
	},
	SD_1P_MaxL: {
		key: "SD_1P_MaxL",
		name: "1% 농도 도달 거리",
		unit: "m",
		description: "1% 농도 도달 거리(SD: Safety Distance)",
		type: "output",
		order: 40,
	},
	P_TkAccL: {
		key: "P_TkAccL",
		name: "축적압력",
		unit: "MPa",
		description: "축적압력",
		type: "output",
		order: 41,
	},
	P_TkOpFullL: {
		key: "P_TkOpFullL",
		name: "완전개방압력",
		unit: "MPa",
		description: "완전개방압력",
		type: "output",
		order: 42,
	},
	P_TkOpSrartL: {
		key: "P_TkOpSrartL",
		name: "개방개시압력",
		unit: "MPa",
		description: "개방개시압력",
		type: "output",
		order: 43,
	},
	W_Req_kgsL: {
		key: "W_Req_kgsL",
		name: "KGS 코드에 따른 PSV 필요분출용량",
		unit: "kg/hr",
		description: "KGS코드에 따른 PSV  필요분출유량",
		type: "output",
		order: 45,
	},
	W_OpFullL: {
		key: "W_OpFullL",
		name: "완전개방 분출유량",
		unit: "kg/hr",
		description: "완전개방시 분출유량",
		type: "output",
		order: 46,
	},
	W_OutL: {
		key: "W_OutL",
		name: "분출유량",
		unit: "kg/hr",
		description: "분출유량",
		type: "output",
		order: 47,
	},
	SD_1PL: {
		key: "SD_1PL",
		name: "1% 농도 도달 거리",
		unit: "kg/hr",
		description: "1% 농도 도달 거리(SD: Safety Distance)",
		type: "output",
		order: 49,
	},
	P_TkM: {
		key: "P_TkM",
		name: "탱크 내부 압력",
		unit: "MPa",
		description: "Tank 내부 압력",
		type: "output",
		order: 50,
	},
	T_TkM: {
		key: "T_TkM",
		name: "탱크 내부 온도",
		unit: "℃",
		description: "Tank 내부 온도",
		type: "output",
		order: 51,
	},
	m_SumM: {
		key: "m_SumM",
		name: "탱크 내부 가스 질량",
		unit: "kg",
		description: "Tank 내부 가스 질량",
		type: "output",
		order: 52,
	},
	W_ReqM: {
		key: "W_ReqM",
		name: "PSV 필요분량용량",
		unit: "kg/hr",
		description: "PSV 필요분출유량",
		type: "output",
		order: 53,
	},
	AaM: {
		key: "AaM",
		name: "PSV 필요분출면적",
		unit: "mm2",
		description: "PSV 필요분출면적",
		type: "output",
		order: 54,
	},
	SD_1P_MaxM: {
		key: "SD_1P_MaxM",
		name: "1% 농도 도달 거리",
		unit: "m",
		description: "1% 농도 도달 거리(SD: Safety Distance)",
		type: "output",
		order: 55,
	},
	P_TkAccM: {
		key: "P_TkAccM",
		name: "축적압력",
		unit: "MPa",
		description: "축적압력",
		type: "output",
		order: 56,
	},
	P_TkOpFullM: {
		key: "P_TkOpFullM",
		name: "완전개방압력",
		unit: "MPa",
		description: "완전개방압력",
		type: "output",
		order: 57,
	},
	P_TkOpSrartM: {
		key: "P_TkOpSrartM",
		name: "개방개시압력",
		unit: "MPa",
		description: "개방개시압력",
		type: "output",
		order: 58,
	},
	W_Req_kgsM: {
		key: "W_Req_kgsM",
		name: "KGS 코드에 따른 PSV 필요분출용량",
		unit: "kg/hr",
		description: "KGS코드에 따른 PSV  필요분출유량",
		type: "output",
		order: 60,
	},
	W_OpFullM: {
		key: "W_OpFullM",
		name: "완전개방 분출유량",
		unit: "kg/hr",
		description: "완전개방시 분출유량",
		type: "output",
		order: 61,
	},
	W_OutM: {
		key: "W_OutM",
		name: "분출유량",
		unit: "kg/hr",
		description: "분출유량",
		type: "output",
		order: 62,
	},
	SD_1PM: {
		key: "SD_1PM",
		name: "1% 농도 도달 거리",
		unit: "kg/hr",
		description: "1% 농도 도달 거리(SD: Safety Distance)",
		type: "output",
		order: 64,
	},
	P_TkH: {
		key: "P_TkH",
		name: "탱크 내부 압력",
		unit: "MPa",
		description: "Tank 내부 압력",
		type: "output",
		order: 65,
	},
	T_TkH: {
		key: "T_TkH",
		name: "탱크 내부 온도",
		unit: "℃",
		description: "Tank 내부 온도",
		type: "output",
		order: 66,
	},
	m_SumH: {
		key: "m_SumH",
		name: "탱크 내부 가스 질량",
		unit: "kg",
		description: "Tank 내부 가스 질량",
		type: "output",
		order: 67,
	},
	W_ReqH: {
		key: "W_ReqH",
		name: "PSV 필요분출용량",
		unit: "kg/hr",
		description: "PSV 필요분출유량",
		type: "output",
		order: 68,
	},
	AaH: {
		key: "AaH",
		name: "PSV 필요분출면적",
		unit: "mm2",
		description: "PSV 필요분출면적",
		type: "output",
		order: 69,
	},
	SD_1P_MaxH: {
		key: "SD_1P_MaxH",
		name: "1% 농도 도달 거리",
		unit: "m",
		description: "1% 농도 도달 거리(SD: Safety Distance)",
		type: "output",
		order: 70,
	},
	P_TkAccH: {
		key: "P_TkAccH",
		name: "축적압력",
		unit: "MPa",
		description: "축적압력",
		type: "output",
		order: 71,
	},
	P_TkOpFullH: {
		key: "P_TkOpFullH",
		name: "완전개방압력",
		unit: "MPa",
		description: "완전개방압력",
		type: "output",
		order: 72,
	},
	P_TkOpSrartH: {
		key: "P_TkOpSrartH",
		name: "개방개시압력",
		unit: "MPa",
		description: "개방개시압력",
		type: "output",
		order: 73,
	},
	W_Req_kgsH: {
		key: "W_Req_kgsH",
		name: "KGS 코드에 따른 PSV 필요분출용량",
		unit: "kg/hr",
		description: "KGS코드에 따른 PSV  필요분출유량",
		type: "output",
		order: 75,
	},
	W_OpFullH: {
		key: "W_OpFullH",
		name: "완전개방 분출유량",
		unit: "kg/hr",
		description: "완전개방시 분출유량",
		type: "output",
		order: 76,
	},
	W_OutH: {
		key: "W_OutH",
		name: "분출유량",
		unit: "kg/hr",
		description: "분출유량",
		type: "output",
		order: 77,
	},
	SD_1PH: {
		key: "SD_1PH",
		name: "1% 농도 도달 거리",
		unit: "kg/hr",
		description: "1% 농도 도달 거리(SD: Safety Distance)",
		type: "output",
		order: 79,
	},
	m1301: {
		key: "m1301",
		name: "충전라인 통과 유량",
		unit: "kg/h",
		description: "충전라인 통과 유량",
		type: "output",
		order: 80,
	},
	m1401: {
		key: "m1401",
		name: "충전라인 통과 유량",
		unit: "kg/h",
		description: "충전라인 통과 유량",
		type: "output",
		order: 81,
	},
	m1501: {
		key: "m1501",
		name: "충전라인 통과 유량",
		unit: "kg/h",
		description: "충전라인 통과 유량",
		type: "output",
		order: 82,
	},
	m1302: {
		key: "m1302",
		name: "충전라인 통과 유량",
		unit: "kg/h",
		description: "충전라인 통과 유량",
		type: "output",
		order: 83,
	},
	m1402: {
		key: "m1402",
		name: "충전라인 통과 유량",
		unit: "kg/h",
		description: "충전라인 통과 유량",
		type: "output",
		order: 84,
	},
	m1502: {
		key: "m1502",
		name: "충전라인 통과 유량",
		unit: "kg/h",
		description: "충전라인 통과 유량",
		type: "output",
		order: 85,
	},
	mD1: {
		key: "mD1",
		name: "충전라인",
		unit: "kg/h",
		description: "충전유량",
		type: "output",
		order: 86,
	},
	mD2: {
		key: "mD2",
		name: "충전라인",
		unit: "kg/h",
		description: "충전유량",
		type: "output",
		order: 87,
	},
	P_Tk1: {
		key: "P_Tk1",
		name: "탱크 압력",
		unit: "MPa",
		description: "Tank 압력",
		type: "output",
		order: 88,
	},
	T_TkC1: {
		key: "T_TkC1",
		name: "탱크 온도",
		unit: "℃",
		description: "Tank 온도",
		type: "output",
		order: 89,
	},
	M_Sum1: {
		key: "M_Sum1",
		name: "탱크 내 가스 질량",
		unit: "kg",
		description: "Tank 내 가스 질량",
		type: "output",
		order: 90,
	},
	SOC_Tk1: {
		key: "SOC_Tk1",
		name: "탱크 내 가스 SOC",
		unit: "%",
		description: "Tank 내 가스 SOC",
		type: "output",
		order: 91,
	},
	P_Tk2: {
		key: "P_Tk2",
		name: "탱크 압력",
		unit: "MPa",
		description: "Tank 압력",
		type: "output",
		order: 92,
	},
	T_TkC2: {
		key: "T_TkC2",
		name: "탱크 온도",
		unit: "℃",
		description: "Tank 온도",
		type: "output",
		order: 93,
	},
	M_Sum2: {
		key: "M_Sum2",
		name: "탱크 내 가스 질량",
		unit: "kg",
		description: "Tank 내 가스 질량",
		type: "output",
		order: 94,
	},
	SOC_Tk2: {
		key: "SOC_Tk2",
		name: "탱크 내 가스 SOC",
		unit: "%",
		description: "Tank 내 가스 SOC",
		type: "output",
		order: 95,
	},
	m_HFP1: {
		key: "m_HFP1",
		name: "",
		unit: "g/s",
		description: "Dispens1의 충전유량",
		type: "output",
		order: 97,
	},
	APRR1: {
		key: "APRR1",
		name: "",
		unit: "MPa/min",
		description: "분당 압력상승률",
		type: "output",
		order: 98,
	},
	P_Ba1: {
		key: "P_Ba1",
		name: "",
		unit: "MPa",
		description: "공급 가스압력",
		type: "output",
		order: 99,
	},
	T_Ba1: {
		key: "T_Ba1",
		name: "",
		unit: "℃",
		description: "공급 가스온도",
		type: "output",
		order: 100,
	},
	T_Tk1: {
		key: "T_Tk1",
		name: "",
		unit: "℃",
		description: "Tank1 내 가스온도",
		type: "output",
		order: 102,
	},
	T_Amb: {
		key: "T_Amb",
		name: "",
		unit: "℃",
		description: "대기온도",
		type: "output",
		order: 103,
	},
	P_Tk_01: {
		key: "P_Tk_01",
		name: "",
		unit: "MPa",
		description: "Vehicle Tank 초기 온도",
		type: "output",
		order: 105,
	},
	T_TkMax1: {
		key: "T_TkMax1",
		name: "",
		unit: "℃",
		description: "Vehicle Tank 최고온도",
		type: "output",
		order: 106,
	},
	t_ElepS1: {
		key: "t_ElepS1",
		name: "",
		unit: "sec",
		description: "초단위 충전시간",
		type: "output",
		order: 107,
	},
	V_TkTot1: {
		key: "V_TkTot1",
		name: "",
		unit: "m3",
		description: "Vehicle Tank 총 Volume",
		type: "output",
		order: 108,
	},
	PRR_av1: {
		key: "PRR_av1",
		name: "",
		unit: "MPa/min",
		description: "Pressure Ramp Rate 평균값",
		type: "output",
		order: 113,
	},
	CalcIntv_av1: {
		key: "CalcIntv_av1",
		name: "",
		unit: "sec",
		description: "Calculation Interval 평균값",
		type: "output",
		order: 114,
	},
	m_HFPMax1: {
		key: "m_HFPMax1",
		name: "",
		unit: "g/s",
		description: "충전라인 질량유속 최고값",
		type: "output",
		order: 115,
	},
	t_ElepM1: {
		key: "t_ElepM1",
		name: "",
		unit: "min",
		description: "분단위 충전시간",
		type: "output",
		order: 119,
	},
	D1Step: {
		key: "D1Step",
		name: "",
		unit: "-",
		description: "Dispenser1의 충전 Step",
		type: "output",
		order: 126,
	},
	DeFuel1_LBk: {
		key: "DeFuel1_LBk",
		name: "",
		unit: "kg/h",
		description: "Dispenser1의 LBk 연결 충전라인 질량유속",
		type: "output",
		order: 127,
	},
	DeFuel1_MBk: {
		key: "DeFuel1_MBk",
		name: "",
		unit: "kg/h",
		description: "Dispenser1의 MBk 연결 충전라인 질량유속",
		type: "output",
		order: 128,
	},
	DeFuel1_HBk: {
		key: "DeFuel1_HBk",
		name: "",
		unit: "kg/h",
		description: "Dispenser1의 HBk 연결 충전라인 질량유속",
		type: "output",
		order: 129,
	},
	m_HFP2: {
		key: "m_HFP2",
		name: "",
		unit: "g/s",
		description: "Dispenser2의 충전라인 질량유속",
		type: "output",
		order: 132,
	},
	APRR2: {
		key: "APRR2",
		name: "",
		unit: "MPa/min",
		description: "Dispenser2의 Average Pressure Ramp Rate",
		type: "output",
		order: 133,
	},
	P_Ba2: {
		key: "P_Ba2",
		name: "",
		unit: "MPa",
		description: "Dispenser2의 Break Away 입구 인입 압력",
		type: "output",
		order: 134,
	},
	T_Tk2: {
		key: "T_Tk2",
		name: "",
		unit: "℃",
		description: "Dispenser2의 Vehicle Tank의 온도",
		type: "output",
		order: 136,
	},
	D2Step: {
		key: "D2Step",
		name: "",
		unit: "-",
		description: "Dispenser2의 충전 Step",
		type: "output",
		order: 137,
	},
	DeFuel2_LBk: {
		key: "DeFuel2_LBk",
		name: "",
		unit: "kg/h",
		description: "Dispenser2의 LBk 연결 충전라인 질량유속",
		type: "output",
		order: 138,
	},
	DeFuel2_MBk: {
		key: "DeFuel2_MBk",
		name: "",
		unit: "kg/h",
		description: "Dispenser2의 MBk 연결 충전라인 질량유속",
		type: "output",
		order: 139,
	},
	DeFuel2_HBk: {
		key: "DeFuel2_HBk",
		name: "",
		unit: "kg/h",
		description: "Dispenser2의 HBk 연결 충전라인 질량유속",
		type: "output",
		order: 140,
	},
	P_HBk: {
		key: "P_HBk",
		name: "",
		unit: "MPa",
		description: "HBk의 압력",
		type: "output",
		order: 142,
	},
	P_MBk: {
		key: "P_MBk",
		name: "",
		unit: "MPa",
		description: "MBk의 압력",
		type: "output",
		order: 143,
	},
	P_LBk: {
		key: "P_LBk",
		name: "",
		unit: "MPa",
		description: "LBk의 압력",
		type: "output",
		order: 144,
	},
	m_HCpCapa: {
		key: "m_HCpCapa",
		name: "",
		unit: "kg/h",
		description: "고압 압축기 압축용량",
		type: "output",
		order: 148,
	},
	m_HCpReal: {
		key: "m_HCpReal",
		name: "",
		unit: "kg/h",
		description: "고압 압축기 실재 압축유량",
		type: "output",
		order: 149,
	},
	m_MCp1Capa: {
		key: "m_MCp1Capa",
		name: "",
		unit: "kg/h",
		description: "중압 압축기1 압축용량",
		type: "output",
		order: 150,
	},
	m_MCp2Capa: {
		key: "m_MCp2Capa",
		name: "",
		unit: "kg/h",
		description: "중압 압축기2 압축용량",
		type: "output",
		order: 151,
	},
	m_MCpReal: {
		key: "m_MCpReal",
		name: "",
		unit: "kg/h",
		description: "중압 압축기 실재 압축유량",
		type: "output",
		order: 152,
	},
	m_LCpCapa: {
		key: "m_LCpCapa",
		name: "",
		unit: "kg/h",
		description: "저압 압축기 압축용량",
		type: "output",
		order: 153,
	},
	m_LCpReal: {
		key: "m_LCpReal",
		name: "",
		unit: "kg/h",
		description: "저압 압축기 실재 압축유량",
		type: "output",
		order: 154,
	},
};
