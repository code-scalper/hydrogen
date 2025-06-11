import { useEffect, useState } from "react";
import ProgressBar from "../ui/ProgressBar";
import BaseAvatar from "../ui/BaseAvatar";
import FooterTools from "./FooterTools";
import BaseSeparator from "../ui/BaseSeperator";
const formatTime = (seconds: number) => {
  const hrs = String(Math.floor(seconds / 3600)).padStart(2, "0");
  const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const secs = String(seconds % 60).padStart(2, "0");
  return `${hrs}:${mins}:${secs}`;
};
const BaseFooter = () => {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer); // 컴포넌트 언마운트 시 정리
  }, []);
  return (
    <div className="bg-slate-700/90 flex justify-between p-2 px-4">
      <div>
        <BaseAvatar />
      </div>

      <div className="flex items-center ">
        <div className="text-slate-400 text-xs w-[100px] text-right mr-4">
          {formatTime(elapsedSeconds)}
        </div>
        <ProgressBar />

        <div className="flex items-center">
          <BaseSeparator />
          <FooterTools />
        </div>
      </div>
    </div>
  );
};

export default BaseFooter;
