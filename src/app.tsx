// import Map from "@/assets/image14.png";
// import { useState } from "react";
// import { Routes, Route, Link } from "react-router-dom";

// custom components
// import Monitor from "./pages/monitor/Monitor";
import BaseHeader from "./components/layouts/BaseHeader";
import BaseSideBar from "./components/layouts/BaseSidebar";
import BaseFooter from "./components/layouts/BaseFooter";
import BaseContentHeader from "./components/layouts/BaseContentHeader";
import MainRouter from "./router/MainRouter";
export default function App() {
  // const introductionPhrases = [
  //   "Build modern apps with Electron and React!",
  //   "Create high-quality desktop apps fast.",
  //   "Boost your productivity with modern web tools.",
  // ];

  // const [phrase, setPhrase] = useState(introductionPhrases[0]);

  // const changePhrase = () => {
  //   const currentPhraseIndex = introductionPhrases.indexOf(phrase);
  //   const nextPhraseIndex =
  //     currentPhraseIndex >= introductionPhrases.length - 1
  //       ? 0
  //       : currentPhraseIndex + 1;
  //   setPhrase(introductionPhrases[nextPhraseIndex]);
  // };

  return (
    <div className="bg-gray-950 w-screen h-screen flex flex-col">
      <BaseHeader />
      {/* 본문: 남은 공간을 flex-grow로 차지 */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar: 고정 너비, 세로로 전체 높이 (헤더 제외한 부분) */}
        <div className="w-[210px] bg-gray-800 overflow-y-auto">
          <BaseSideBar />
        </div>

        {/* 나머지 본문이 들어올 영역 (선택사항) */}
        <div className="flex-1  overflow-auto text-white relative">
          <BaseContentHeader />
          <div className="flex-1 p-4 overflow-auto text-white">
            <div className="h-full w-full border border-gray-800 px-10 bg-zinc-800">
              <MainRouter />
              {/* <img src={Map} alt="map" /> */}
              {/* <Text>제작중!!!!</Text> */}
              {/* <Text>Hello from Radix Themes :)</Text>
            <Button>Let's go</Button> */}
            </div>
          </div>
        </div>
      </div>
      <BaseFooter />
    </div>
  );
}
