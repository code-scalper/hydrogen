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

import { collectScenarioInputValues } from "@/lib/simulation";
import { useInteractionStore } from "@/store/useInteractionStore";
import { useProjectStore } from "@/store/useProjectStore";
import useSimulationStore from "@/store/useSimulationStore";
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
	const setSelectedPsvKey = useProjectStore((state) => state.setSelectedPsvKey);
	const selectedScenario = useProjectStore((state) => state.selectedScenario);
	const setSimulationFrames = useSimulationStore((state) => state.setFrames);
	const playSimulation = useSimulationStore((state) => state.playFromStart);
	const stopSimulationPlayback = useSimulationStore((state) => state.stop);

	const [openIndex, setOpenIndex] = useState<number | null>(null);
	const [ActiveChildComp, setActiveChildComp] = useState<ComponentType | null>(
		null,
	);

	const menuRef = useRef<HTMLDivElement | null>(null);

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

		try {
			stopSimulationPlayback();
			const result = await window.electronAPI.runExe(payload);
			if (
				result &&
				typeof result === "object" &&
				Array.isArray(result.frames)
			) {
				setSimulationFrames(result.frames);
				if (result.frames.length > 0) {
					playSimulation();
				}
			}
		} catch (error) {
			console.error("실행 실패", error);
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
			setShowModal2((prev) => !prev);
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

	const handleEvent = (key: string) => {
		if (key === "whatif") {
			setShowModal2(false);
			setShowModal3(true);
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
			<nav className="relative flex gap-x-1 justify-end p-3">
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
