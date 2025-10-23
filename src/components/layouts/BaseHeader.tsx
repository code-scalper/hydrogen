import clsx from "clsx";
import {
	type ComponentType,
	type ReactNode,
	useEffect,
	useRef,
	useState,
} from "react";
import { Link } from "react-router-dom";

import {
	BookOpenIcon,
	CalculatorIcon,
	CodeBracketSquareIcon,
	PlayCircleIcon,
	PresentationChartLineIcon,
	QuestionMarkCircleIcon,
	ScaleIcon,
	// StopCircleIcon,
	// FolderOpenIcon,
	// ArchiveBoxArrowDownIcon,
} from "@heroicons/react/24/solid";

import { parseExecutionLog } from "@/lib/executionProgress";
import { collectScenarioInputValues } from "@/lib/simulation";
import useExecutionProgressStore from "@/store/useExecutionProgressStore";
import { useInteractionStore } from "@/store/useInteractionStore";
import { useProjectStore } from "@/store/useProjectStore";
import useSimulationAnalysisStore from "@/store/useSimulationAnalysisStore";
import useSimulationOutputStore from "@/store/useSimulationOutputStore";
import useSimulationStore from "@/store/useSimulationStore";
import useWhatIfStore from "@/store/useWhatIfStore";
import ExecutionProgressModal from "../ui/ExecutionProgressModal";
import { PsvModal_4050 } from "../ui/specific/psv-calculator/PsvModal_4050";
import { PsvModal_4110 } from "../ui/specific/psv-calculator/PsvModal_4110";
import { PsvModal_4120 } from "../ui/specific/psv-calculator/PsvModal_4120";
import { PsvModal_4130 } from "../ui/specific/psv-calculator/PsvModal_4130";
import { PsvModal_4500 } from "../ui/specific/psv-calculator/PsvModal_4500";

import { EconomicEvaluationWithGraph } from "../views/economic-evaluation/EconomicEvaluationWithGraph";
import { WhatIf } from "../views/what-if/WhatIf";
import { WhatIfAnalisys } from "../views/what-if/WhatIfAnalisys";
const ICON_SIZE = "h-6 w-6";
const ICON_COLOR = "text-gray-300";

type NavigationChild = {
	name: string;
	key: string;
	component?: ComponentType;
};

type NavigationItem = {
	icon: ReactNode;
	name: string;
	key?: string;
	to?: string;
	children?: NavigationChild[];
};

const NAVI_ITEMS: NavigationItem[] = [
	{
		icon: <PlayCircleIcon className={`${ICON_SIZE} text-emerald-400`} />,
		name: "실행",
		key: "run-simulation",
	},
	{
		icon: <CodeBracketSquareIcon className={`${ICON_SIZE} text-blue-400`} />,
		name: "시뮬레이터",
		to: "/",
	},
	{
		icon: <QuestionMarkCircleIcon className={`${ICON_SIZE} text-purple-500`} />,
		name: "What-IF",
		key: "what-if",
	},
	{
		icon: <ScaleIcon className={`${ICON_SIZE} ${ICON_COLOR}`} />,
		name: "경제성평가",
		key: "economic-evaluation",
		// to: "/economic-evaluation",
	},
	{
		icon: <CalculatorIcon className={`${ICON_SIZE} ${ICON_COLOR}`} />,
		name: "계산",
		children: [
			{
				name: "1회 충전 시 충전기/자동차 용기 ",
				key: "SFC_4050",
				component: PsvModal_4050,
			},
			{ name: "저압 뱅크 안전밸브", key: "SFC_4110", component: PsvModal_4110 },
			{ name: "중압 뱅크 안전밸브", key: "SFC_4120", component: PsvModal_4120 },
			{ name: "고압 뱅크 안전밸브", key: "SFC_4130", component: PsvModal_4130 },
			{ name: "액화수소 탱크 BOG", key: "SFC_4500", component: PsvModal_4500 },
		],
	},
	{
		icon: <BookOpenIcon className={`${ICON_SIZE} ${ICON_COLOR}`} />,
		name: "매뉴얼",
		to: "/manual",
	},
	{
		icon: (
			<PresentationChartLineIcon className={`${ICON_SIZE} ${ICON_COLOR}`} />
		),
		name: "리포트",
		to: "/report",
	},
];

const BaseHeader = () => {
	const [showModal1, setShowModal1] = useState(false);
	const [showModal2, setShowModal2] = useState(false);
	const [showModal3, setShowModal3] = useState(false);

	const setPsvOpen = useInteractionStore((state) => state.setPsvOpen);
	const hasInvalidInputs = useInteractionStore(
		(state) => Object.keys(state.invalidInputKeys).length > 0,
	);
	const skipRunExe = useInteractionStore((state) => state.skipRunExe);
	const setSkipRunExe = useInteractionStore((state) => state.setSkipRunExe);
	const setSelectedPsvKey = useProjectStore((state) => state.setSelectedPsvKey);
	const selectedScenario = useProjectStore((state) => state.selectedScenario);
	const setSimulationFrames = useSimulationStore((state) => state.setFrames);
	const playSimulation = useSimulationStore((state) => state.playFromStart);
	const stopSimulationPlayback = useSimulationStore((state) => state.stop);
	const openAnalysisModal = useSimulationAnalysisStore(
		(state) => state.openWithResult,
	);
	const setOutputData = useSimulationOutputStore((state) => state.setOutput);
	const resetWhatIf = useWhatIfStore((state) => state.reset);
	const clearWhatIfDataset = useWhatIfStore((state) => state.setDataset);
	const startProgress = useExecutionProgressStore((state) => state.start);
	const updateProgress = useExecutionProgressStore(
		(state) => state.updateFromEntries,
	);
	const completeProgress = useExecutionProgressStore((state) => state.complete);
	const failProgress = useExecutionProgressStore((state) => state.fail);
	const resetProgress = useExecutionProgressStore((state) => state.reset);
	const closeProgress = useExecutionProgressStore((state) => state.close);

	const [openIndex, setOpenIndex] = useState<number | null>(null);
	const [ActiveChildComp, setActiveChildComp] = useState<ComponentType | null>(
		null,
	);

	const menuRef = useRef<HTMLDivElement | null>(null);
	const progressIntervalRef = useRef<number | null>(null);
	const progressCloseTimeoutRef = useRef<number | null>(null);
	const progressDateRef = useRef<string | null>(null);

	const stopProgressPolling = () => {
		if (progressIntervalRef.current !== null) {
			window.clearInterval(progressIntervalRef.current);
			progressIntervalRef.current = null;
		}
	};

	const clearProgressTimers = () => {
		stopProgressPolling();
		if (progressCloseTimeoutRef.current !== null) {
			window.clearTimeout(progressCloseTimeoutRef.current);
			progressCloseTimeoutRef.current = null;
		}
	};

	const hasChildren = (
		navi: NavigationItem,
	): navi is NavigationItem & {
		children: NavigationChild[];
	} => Array.isArray(navi.children) && navi.children.length > 0;

	const handleRun = async () => {
		if (hasInvalidInputs) {
			console.warn("유효하지 않은 입력값이 있어 실행을 막았습니다.");
			return;
		}

		const payload = collectScenarioInputValues(selectedScenario);
		if (!payload) {
			console.warn("실행할 시나리오가 선택되지 않았습니다.");
			return;
		}

		const todayKey = new Date().toISOString().slice(0, 10).replace(/-/g, "");
		progressDateRef.current = todayKey;
		clearProgressTimers();
		resetProgress();
		startProgress(todayKey);

		const pollProgressLog = async () => {
			try {
				const dateKey = progressDateRef.current;
				if (!dateKey) {
					return;
				}
				const response = await window.electronAPI.readProgressLog({
					date: dateKey,
				});
				if (!response.exists || !response.raw) {
					return;
				}
				const entries = parseExecutionLog(response.raw);
				if (entries.length > 0) {
					updateProgress(entries);
				}
			} catch (error) {
				console.error("실행 진행률 로그 읽기 실패", error);
			}
		};

		progressIntervalRef.current = window.setInterval(pollProgressLog, 1000);

		try {
			stopSimulationPlayback();
			const result = await window.electronAPI.runExe({
				...payload,
				skipExe: skipRunExe,
			});
			await pollProgressLog();
			if (
				result &&
				typeof result === "object" &&
				Array.isArray(result.frames)
			) {
				setSimulationFrames(result.frames);
				setOutputData(result.frames, {
					sourceDate: result.outputDate ?? null,
				});
				if (result.frames.length > 0) {
					playSimulation();
				}
			}
			openAnalysisModal(result);
			completeProgress();
			stopProgressPolling();
			progressCloseTimeoutRef.current = window.setTimeout(() => {
				closeProgress();
				progressCloseTimeoutRef.current = null;
			}, 1200);
		} catch (error) {
			console.error("실행 실패", error);
			stopProgressPolling();
			failProgress(
				error instanceof Error
					? error.message
					: "실행 도중 알 수 없는 오류가 발생했습니다.",
			);
		} finally {
			progressDateRef.current = null;
		}
	};

	const handleNavigation = (navi: NavigationItem, index: number) => {
		if (!hasChildren(navi)) {
			setOpenIndex(null);
		}
		if (navi.key === "run-simulation") {
			handleRun();
			return;
		}
		if (navi.key === "economic-evaluation") {
			setShowModal1((prev) => !prev);
			return;
		}
		if (navi.key === "what-if") {
			resetWhatIf();
			clearWhatIfDataset(null);
			setShowModal3(false);
			setShowModal2(true);
			return;
		}
		if (hasChildren(navi)) {
			setOpenIndex((prev) => (prev === index ? null : index));
		}
	};

	const handleChildSelect = (child: {
		name: string;
		key: string;
		component?: ComponentType;
	}) => {
		setPsvOpen(true);
		setSelectedPsvKey(child.key);

		if (child.component) {
			setActiveChildComp(() => child.component as ComponentType);
		}
		setOpenIndex(null);
	};

	useEffect(() => {
		function onClickOutside(e: MouseEvent) {
			if (!menuRef.current) return;
			if (!menuRef.current.contains(e.target as Node)) {
				setOpenIndex(null);
			}
		}
		document.addEventListener("mousedown", onClickOutside);
		return () => document.removeEventListener("mousedown", onClickOutside);
	}, []);

	useEffect(() => {
		return () => {
			if (progressIntervalRef.current !== null) {
				window.clearInterval(progressIntervalRef.current);
				progressIntervalRef.current = null;
			}
			if (progressCloseTimeoutRef.current !== null) {
				window.clearTimeout(progressCloseTimeoutRef.current);
				progressCloseTimeoutRef.current = null;
			}
		};
	}, []);

	const handleEvent = (key: string) => {
		if (key === "whatif") {
			setShowModal2(false);
			setShowModal3(true);
			return;
		}
		if (key === "prev") {
			setShowModal3(false);
			setShowModal2(true);
		}
	};

	return (
		<div
			className="flex justify-between items-center border-b border-slate-700"
			ref={menuRef}
		>
			<div className="m-0 px-3">
				<h1 className="flex font-bold text-blue-400 text-xl">
					Hydrogen
					<span className="text-white font-normal ml-1">Simulator</span>
				</h1>
			</div>
			<nav className="relative flex items-center gap-4 justify-end p-3">
				<div className="flex gap-x-1">
					{NAVI_ITEMS.map((navi, index) => {
						const navKey = String(navi.key ?? navi.to ?? navi.name ?? index);
						const isRunSimulation = navi.key === "run-simulation";
						const disabled = isRunSimulation && hasInvalidInputs;
						const hasMenu = hasChildren(navi);
						const baseClasses =
							"relative text-white flex justify-center flex-col items-center w-16 focus:outline-none transition-opacity";
						const commonContent = (
							<>
								{navi.icon}
								<span className="text-slate-400 text-[10px] mt-0.5">
									{navi.name}
								</span>
							</>
						);

						return (
							<div key={navKey} className="relative">
								{navi.to ? (
									<Link to={navi.to} className="no-underline">
										<div className={`${baseClasses} cursor-pointer`}>
											{commonContent}
										</div>
									</Link>
								) : (
									<button
										type="button"
										className={clsx(
											baseClasses,
											disabled
												? "cursor-not-allowed opacity-40"
												: "cursor-pointer",
										)}
										onClick={() => {
											if (disabled) return;
											handleNavigation(navi, index);
										}}
										onKeyDown={(event) => {
											if (event.key === "Escape") {
												setOpenIndex(null);
											}
										}}
										disabled={disabled}
									>
										{commonContent}
									</button>
								)}
								{hasMenu && openIndex === index && (
									<ul className="absolute top-12 left-1/2 -translate-x-1/2 z-[99] w-56 rounded-2xl border border-slate-700 bg-slate-800/95 shadow-xl backdrop-blur p-1">
										{navi.children.map((child) => (
											<li key={child.key}>
												<button
													type="button"
													className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs text-slate-200 hover:bg-slate-700/60 focus:bg-slate-700/60 focus:outline-none"
													onClick={() => handleChildSelect(child)}
												>
													<span className="truncate">{child.name}</span>
												</button>
											</li>
										))}
									</ul>
								)}
							</div>
						);
					})}
				</div>
				<label className="flex items-center gap-2 text-[11px] text-slate-200 cursor-pointer select-none">
					<input
						className="sr-only"
						type="checkbox"
						checked={skipRunExe}
						onChange={(event) => setSkipRunExe(event.target.checked)}
					/>
					<span
						className={clsx(
							"relative inline-flex h-4 w-8 items-center rounded-full transition-colors",
							skipRunExe ? "bg-rose-500" : "bg-emerald-600",
						)}
					>
						<span
							className={clsx(
								"inline-block h-3 w-3 transform rounded-full bg-white transition-transform",
								skipRunExe ? "translate-x-4" : "translate-x-1",
							)}
						/>
					</span>
					<span>{skipRunExe ? "모듈 스킵" : "모듈 실행"}</span>
				</label>
			</nav>

			<WhatIfAnalisys
				handleEvent={handleEvent}
				showModal={showModal3}
				setShowModal={setShowModal3}
			/>

			<WhatIf
				handleEvent={handleEvent}
				showModal={showModal2}
				setShowModal={setShowModal2}
			/>

			<ExecutionProgressModal />

			<EconomicEvaluationWithGraph
				showModal={showModal1}
				setShowModal={setShowModal1}
			/>
			{ActiveChildComp && (
				<div className="absolute bottom-4 right-4 z-[98]">
					<ActiveChildComp />
				</div>
			)}
		</div>
	);
};

export default BaseHeader;
