import {
  DownloadIcon,
  GearIcon,
  PlayIcon,
  PlusIcon,
  StopIcon,
} from "@radix-ui/react-icons";
import { Button } from "@radix-ui/themes";
import { Download, Folder, Play, Square } from "lucide-react";
import { useState, useRef } from "react";

// custom components
import { AdjustBasicDataModal } from "../ui/specific/AdjustBasicDataModal";

// store
import { useInteractionStore } from "@/store/useInteractionStore";
import { useProjectStore } from "@/store/useProjectStore";
import CircularProgress from "../ui/CircularProgress";

const BaseContentHeader = () => {
  const selectedScenario = useProjectStore((state) => state.selectedScenario);
  const adjustBasicDataOpen = useInteractionStore(
    (state) => state.adjustBasicDataOpen
  );
  const setAdjustBasicDataOpen = useInteractionStore(
    (state) => state.setAdjustBasicDataOpen
  );

  const type = "A";
  const [displayExtraTool] = useState(false);

  const handleCreate = () => {};
  const [progress, setProgress] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const resolveTo100 = useRef(false); // 실행 완료 감지용

  const startProgress = () => {
    setProgress(0);
    resolveTo100.current = false;

    const updateProgress = () => {
      setProgress((prev) => {
        if (resolveTo100.current) {
          return 100;
        }

        if (prev < 90) {
          const next = Math.min(prev + Math.floor(Math.random() * 2 + 1), 90);
          scheduleNextRandom(updateProgress, 200, 600); // 느린 랜덤
          return next;
        } else if (prev >= 90 && prev < 97) {
          setTimeout(updateProgress, 5000); // 5초마다 +1
          return prev + 1;
        } else if (prev >= 97 && prev < 99) {
          setTimeout(updateProgress, 10000); // 10초마다 +1
          return prev + 1;
        } else {
          // 99%에서 멈춤
          return prev;
        }
      });
    };

    updateProgress();
  };

  const scheduleNextRandom = (fn: () => void, min = 600, max = 2000) => {
    if (intervalRef.current) clearTimeout(intervalRef.current); // ✅ 이전 타이머 정리
    const delay = Math.floor(Math.random() * (max - min + 1)) + min;
    intervalRef.current = setTimeout(fn, delay);
  };

  const stopProgress = () => {
    resolveTo100.current = true; // EXE 완료됨을 표시
    setProgress(100);
    if (intervalRef.current) clearTimeout(intervalRef.current);
    setTimeout(() => setRunning(false), 1000); // UI 정리
  };

  const handleRun = async () => {
    setRunning(true);
    startProgress();

    try {
      await window.electronAPI.runExe();
      stopProgress();
    } catch {
      setRunning(false);
    }
  };

  return (
    <>
      <div className="bg-cyan-950 p-2  fixed w-full z-50 flex items-center">
        {selectedScenario && selectedScenario.baseData && (
          <div className="mr-5">
            <Button
              variant="solid"
              radius="none"
              className="!bg-cyan-800 !cursor-pointer"
              onClick={() => setAdjustBasicDataOpen(true)}
            >
              <GearIcon /> 기준정보
            </Button>
            <Button
              variant="solid"
              radius="none"
              className="ml-2"
              onClick={() => handleRun()}
            >
              계산 테스트
            </Button>
          </div>
        )}

        {displayExtraTool && (
          <div>
            {type === "A" ? (
              <ul className="flex space-x-2 cursor-pointer">
                <li>
                  <PlayIcon className="w-4 h-4 text-emerald-500" />
                </li>
                <li>
                  <StopIcon className="w-4 h-4 text-rose-500" />
                </li>
                <li>
                  <PlusIcon className="w-4 h-4" />
                </li>
                <li>
                  <DownloadIcon className="w-4 h-4" />
                </li>
              </ul>
            ) : (
              <ul className="flex space-x-2 cursor-pointer">
                <li>
                  <Play className="w-4 h-4 text-emerald-500" />
                </li>
                <li>
                  <Square className="w-4 h-4 text-rose-500" />
                </li>
                <li>
                  <Folder className="w-4 h-4 text-yellow-600" />
                </li>
                <li>
                  <Download className="w-4 h-4 text-blue-500" />
                </li>
              </ul>
            )}
          </div>
        )}
      </div>
      <div className="mb-10"></div>
      <AdjustBasicDataModal
        isOpen={adjustBasicDataOpen}
        onClose={() => setAdjustBasicDataOpen(false)}
        onCreate={handleCreate}
      />

      {running && <CircularProgress progress={progress} label="실행 중..." />}
    </>
  );
};

export default BaseContentHeader;
