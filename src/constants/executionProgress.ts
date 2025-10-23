export interface ExecutionProgressStep {
	code: string;
	label: string;
	description: string;
	solutionKo: string;
	solutionEn: string;
}

export const EXECUTION_PROGRESS_STEPS: ExecutionProgressStep[] = [
	{
		code: "PRG0101",
		label: "초기화 시작",
		description: "초기화를 시작합니다.",
		solutionKo: "초기화를 시작합니다.",
		solutionEn: "Initialization starting.",
	},
	{
		code: "INF0150",
		label: "패스워드 검증 통과",
		description: "패스워드 검증을 통과했습니다.",
		solutionKo: "패스워드 검증을 통과했습니다.",
		solutionEn: "Input password verified.",
	},
	{
		code: "PRG0201",
		label: "입력 로드 시작",
		description: "입력 데이터를 불러오는 중입니다.",
		solutionKo: "입력 데이터를 불러오는 중입니다.",
		solutionEn: "Loading inputs.",
	},
	{
		code: "INF0290",
		label: "입력 로드 완료",
		description: "입력 로드를 완료했습니다.",
		solutionKo: "입력 로드를 완료했습니다.",
		solutionEn: "Inputs loaded.",
	},
	{
		code: "PRG0401",
		label: "실행 준비",
		description: "실행 준비(파라미터 설정).",
		solutionKo: "실행 준비 중입니다.",
		solutionEn: "Configuring run.",
	},
	{
		code: "INF0490",
		label: "실행 준비 완료",
		description: "실행을 준비했습니다.",
		solutionKo: "실행을 준비했습니다.",
		solutionEn: "Pre-run configured.",
	},
	{
		code: "PRG0501",
		label: "시뮬레이션 실행 시작",
		description: "시뮬레이션을 시작합니다.",
		solutionKo: "시뮬레이션을 시작합니다.",
		solutionEn: "Simulation starting.",
	},
	{
		code: "PRG0601",
		label: "입력 검증 시작",
		description: "입력값을 검증 중입니다.",
		solutionKo: "검증 중입니다.",
		solutionEn: "Validating inputs.",
	},
	{
		code: "INF0690",
		label: "검증 통과",
		description: "입력 검증이 완료되었습니다.",
		solutionKo: "입력 검증이 완료되었습니다.",
		solutionEn: "Validation passed.",
	},
];

export const EXECUTION_PROGRESS_CODE_SET = new Set(
	EXECUTION_PROGRESS_STEPS.map((step) => step.code),
);

export type ExecutionProgressCode =
	(typeof EXECUTION_PROGRESS_STEPS)[number]["code"];
