import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import {
  BookOpenIcon,
  CalculatorIcon,
  // FolderOpenIcon,
  // ArchiveBoxArrowDownIcon,
  // PlayCircleIcon,
  // StopCircleIcon,
  ScaleIcon,
  CodeBracketSquareIcon,
  PresentationChartLineIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/solid";

import { useInteractionStore } from "@/store/useInteractionStore";
import { useProjectStore } from "@/store/useProjectStore";
import { PsvModal_4050 } from "../ui/specific/psv-calculator/PsvModal_4050";
import { PsvModal_4110 } from "../ui/specific/psv-calculator/PsvModal_4110";
import { PsvModal_4120 } from "../ui/specific/psv-calculator/PsvModal_4120";
import { PsvModal_4130 } from "../ui/specific/psv-calculator/PsvModal_4130";
import { PsvModal_4500 } from "../ui/specific/psv-calculator/PsvModal_4500";

const ICON_SIZE = "h-6 w-6";
const ICON_COLOR = "text-gray-300";

const NAVI_ITEMS = [
  {
    icon: <CodeBracketSquareIcon className={`${ICON_SIZE} text-blue-400`} />,
    name: "시뮬레이터",
    to: "/",
  },
  {
    icon: <QuestionMarkCircleIcon className={`${ICON_SIZE} text-purple-500`} />,
    name: "What-IF",
    to: "/what-if",
  },
  {
    icon: <ScaleIcon className={`${ICON_SIZE} ${ICON_COLOR}`} />,
    name: "경제성평가",
    to: "/economic-evaluation",
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
  const setPsvOpen = useInteractionStore((state) => state.setPsvOpen);
  const setSelectedPsvKey = useProjectStore((state) => state.setSelectedPsvKey);

  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [ActiveChildComp, setActiveChildComp] =
    useState<React.ComponentType | null>(null);

  const menuRef = useRef<HTMLDivElement | null>(null);

  const hasChildren = (navi: any) =>
    Array.isArray(navi?.children) && navi.children.length > 0;

  const handleClick = (navi: any, index: number) => {
    if (hasChildren(navi)) {
      setOpenIndex((prev) => (prev === index ? null : index));
      return;
    }
  };

  const handleChildSelect = (child: {
    name: string;
    key: string;
    component?: React.ComponentType;
  }) => {
    setPsvOpen(true);
    setSelectedPsvKey(child.key);
    console.log(child, "child");
    if (child.component) {
      setActiveChildComp(() => child.component as React.ComponentType);
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
          const item = (
            <span
              key={index}
              className="relative text-white flex justify-center flex-col items-center cursor-pointer w-16 focus:outline-none"
              onClick={() => handleClick(navi, index)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleClick(navi, index);
                }
                if (e.key === "Escape") setOpenIndex(null);
              }}
              role="button"
              tabIndex={0}
              aria-haspopup={hasChildren(navi) ? "menu" : undefined}
              aria-expanded={openIndex === index}
            >
              {navi.icon}
              <span className="text-slate-400 text-[10px] mt-0.5">
                {navi.name}
              </span>

              {hasChildren(navi) &&
                navi.children !== undefined &&
                openIndex === index && (
                  <div
                    className="absolute top-12 left-1/2 -translate-x-1/2 z-[99] w-56 rounded-2xl border border-slate-700 bg-slate-800/95 shadow-xl backdrop-blur p-1"
                    role="menu"
                  >
                    {navi.children.map(
                      (
                        child: {
                          name: string;
                          key: string;
                          component?: React.ComponentType;
                        },
                        cIdx: number
                      ) => (
                        <button
                          key={child.key ?? cIdx}
                          className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs text-slate-200 hover:bg-slate-700/60 focus:bg-slate-700/60 focus:outline-none"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleChildSelect(child);
                          }}
                        >
                          <span className="truncate">{child.name}</span>
                        </button>
                      )
                    )}
                  </div>
                )}
            </span>
          );

          return navi.to !== undefined ? (
            <Link to={navi.to} key={index} className="no-underline">
              {item}
            </Link>
          ) : (
            item
          );
        })}
      </nav>

      {ActiveChildComp && (
        <div className="absolute bottom-4 right-4 z-[98]">
          <ActiveChildComp />
        </div>
      )}
    </div>
  );
};

export default BaseHeader;
