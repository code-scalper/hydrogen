import { Link } from "react-router-dom";

import {
  // FolderOpenIcon,
  // ArchiveBoxArrowDownIcon,
  // PlayCircleIcon,
  // StopCircleIcon,
  CodeBracketSquareIcon,
  QuestionMarkCircleIcon,
  CalculatorIcon,
  PresentationChartLineIcon,
  BookOpenIcon,
} from "@heroicons/react/24/solid";

const ICON_SIZE = "h-6 w-6";
const ICON_COLOR = "text-gray-300";
const NAVI_ITEMS = [
  // {
  //   icon: <ArchiveBoxArrowDownIcon className={`${ICON_SIZE} ${ICON_COLOR}`} />,
  //   name: "저장",
  //   to: "/",
  // },
  // {
  //   icon: <FolderOpenIcon className={`${ICON_SIZE} ${ICON_COLOR}`} />,
  //   name: "불러오기",
  //   to: "/",
  // },
  // {
  //   icon: <PlayCircleIcon className={`${ICON_SIZE} text-green-500`} />,
  //   name: "실행",
  //   to: "/",
  // },
  // {
  //   icon: <StopCircleIcon className={`${ICON_SIZE} text-red-500`} />,
  //   name: "중지",
  //   to: "/",
  // },
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
    icon: <CalculatorIcon className={`${ICON_SIZE} ${ICON_COLOR}`} />,
    name: "경제성평가",
    to: "/economic-evaluation",
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
  return (
    <div className="flex justify-between items-center border-b border-slate-700">
      <div className="m-0 px-3">
        <h1 className="flex  font-bold text-blue-400 text-xl">
          Hydrogen
          <span className="text-white font-normal ml-1">Simulator</span>
        </h1>
      </div>
      <nav className="flex gap-x-1 justify-end p-3 cursor-pointer ">
        {NAVI_ITEMS.map((navi, index) => (
          <Link to={navi.to} key={index}>
            <span className="text-white flex justify-center flex-col items-center cursor-pointer w-14">
              {navi.icon}
              <span className="text-slate-400 text-[10px]">{navi.name}</span>
            </span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default BaseHeader;
