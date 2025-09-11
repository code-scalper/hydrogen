import LOGO_SRC from "@/assets/logo.png";
import { useInteractionStore } from "@/store/useInteractionStore";
import { useProjectStore } from "@/store/useProjectStore";
import { useEffect, useMemo, useRef, useState } from "react";
import FlowInputOverlay from "./FlowInputOverlay";
import FlowOutputOverlay from "./FlowOutputOverlay";

import { useDebouncedCallback } from "@/hooks/useDebouncedCallback";
import type { ScenarioInterface } from "@/types";

import { SCENARIOS } from "@/constants";

import BaseToast from "@/components/ui/BaseToast";

const images = import.meta.glob("@/assets/diagram/*", {
  eager: true,
  as: "url",
});

const BASE_IMAGE_WIDTH = 1920; // 원본 기준 너비
const BASE_IMAGE_HEIGHT = 1500; // 원본 기준 높이
const BASE_INPUT_HEIGHT = 24;

const getFixedWidth = (windowWidth: number) => {
  if (windowWidth < 1100) return 1000;
  if (windowWidth < 1400) return 1250;
  if (windowWidth < 1650) return 1500;
  if (windowWidth < 1850) return 1750;
  return 1920;
};

// const TARGET = SCENARIOS[0];
// console.log(TARGET);

const Monitor = () => {
  // store
  const setSelectedDevice = useProjectStore((state) => state.setSelectedDevice);
  const setDeviceOpen = useInteractionStore((state) => state.setDeviceOpen);
  const updateInputValue = useProjectStore((state) => state.updateInputValue);
  const selectedScenario = useProjectStore(
    (state) => state.selectedScenario
  ) as ScenarioInterface | null;

  // const selectedScenario = useMemo(() => {
  //   return TARGET;
  // }, [SCENARIOS]);

  // useEffect(() => {
  //   const filtered = selectedScenario?.children?.filter((f) => {
  //     return f.x === 0.1 && f.displayOnDiagram;
  //   });
  //   // console.log(filtered, "filtered");
  // }, [selectedScenario]);

  // toast
  const [open, setOpen] = useState(false);
  const [toastMessage, _] = useState("");

  // refs
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 이미지 크기 고정 단계
  const [fixedWidth, setFixedWidth] = useState(
    getFixedWidth(window.innerWidth)
  );
  useEffect(() => {
    const handleResize = () => {
      setFixedWidth(getFixedWidth(window.innerWidth));
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ✅ min/max 제한 적용
  const boundedWidth = useMemo(() => {
    return Math.min(Math.max(fixedWidth, 1000), 1920);
    // 최소 1000px, 최대 1920px
  }, [fixedWidth]);

  const boundedHeight = useMemo(() => {
    return (boundedWidth * BASE_IMAGE_HEIGHT) / BASE_IMAGE_WIDTH;
  }, [boundedWidth]);

  // 비율 유지
  const fixedHeight = useMemo(
    () => (fixedWidth * BASE_IMAGE_HEIGHT) / BASE_IMAGE_WIDTH,
    [fixedWidth]
  );

  const scale = useMemo(() => boundedWidth / BASE_IMAGE_WIDTH, [boundedWidth]);
  const inputHeight = useMemo(() => BASE_INPUT_HEIGHT * scale, [scale]);
  const getInputWidth = (fixedWidth: number) => {
    if (fixedWidth <= 1000) return 30;
    if (fixedWidth <= 1250) return 40;
    if (fixedWidth <= 1500) return 60;
    if (fixedWidth <= 1750) return 70;
    return 110;
  };
  const inputWidth = useMemo(() => getInputWidth(fixedWidth), [fixedWidth]);

  const debouncedUpdate = useDebouncedCallback((id: string, value: string) => {
    if (selectedScenario?.id) {
      updateInputValue(id, value);
    }
  }, 500);

  const imageUrl = useMemo(() => {
    console.log(selectedScenario, "selectedScenario");

    return selectedScenario
      ? images[`/src/assets/diagram/${selectedScenario.src}`]
      : images[`/src/assets/diagram/SFC_1022.jpg`];
  }, [selectedScenario]);

  // const inputPoints = useMemo(() => {
  //   console.log(selectedScenario, "selectedScenario");
  //   if (!selectedScenario?.children) return [];
  //   return selectedScenario.children.flatMap((child) =>
  //     child.props.filter((prop) => prop.displayOnDiagram)
  //   );
  // }, [selectedScenario]);

  const points: any = useMemo(() => {
    if (!selectedScenario?.children) return [];

    const inputs = selectedScenario.children.flatMap((child) =>
      child.props.filter((prop) => prop.displayOnDiagram)
    );
    const outputs = selectedScenario.children.flatMap((child) =>
      (child?.outputProps ?? []).filter((prop) => prop.displayOnDiagram)
    );

    // console.log(selectedScenario, "selected scenario");

    return { inputs, outputs };
  }, [selectedScenario]);

  return (
    <div className="flex-1 flex justify-start items-center">
      {selectedScenario ? (
        <div
          ref={containerRef}
          className="relative rounded-lg shadow-inner"
          style={{
            width: boundedWidth,
            height: boundedHeight,
            minWidth: "1000px", // 하한
            maxWidth: "1920px", // 상한
            minHeight: `${(1000 * BASE_IMAGE_HEIGHT) / BASE_IMAGE_WIDTH}px`,
            maxHeight: `${(1920 * BASE_IMAGE_HEIGHT) / BASE_IMAGE_WIDTH}px`,
          }}
        >
          <p className="text-white/30 absolute top-0 z-50 p-2 ">
            {selectedScenario.id}
          </p>
          <img
            ref={imageRef}
            src={imageUrl}
            alt="scenario"
            className="absolute inset-0 w-full h-full object-contain"
          />

          {/* 인풋 포인트 */}
          {points.inputs?.map((point: any, index: number) => {
            const left = (point.x || 0) * fixedWidth;
            const top = (point.y || 0) * fixedHeight;

            return (
              <FlowInputOverlay
                key={`${point.key}${index}`}
                point={point}
                scenarioId={selectedScenario.id}
                onChange={debouncedUpdate}
                status={"normal"}
                label={point.key}
                scale={scale}
                inputHeight={inputHeight}
                overlayStyle={{
                  position: "absolute",
                  left: `${left}px`,
                  top: `${top}px`,
                  transform: "translateY(-50%)", // 👈 수정
                }}
                fixedInputWidth={inputWidth} // 👈 추가
              />
            );
          })}

          {/* 아웃풋 포인트 */}
          {points.outputs?.map((point: any, index: number) => {
            const left = (point.x || 0) * fixedWidth;
            const top = (point.y || 0) * fixedHeight;

            return (
              <FlowOutputOverlay
                key={`${point.key}${index}`}
                point={point}
                scenarioId={selectedScenario.id}
                onChange={debouncedUpdate}
                status="normal"
                label={point.key}
                scale={scale}
                inputHeight={inputHeight}
                overlayStyle={{
                  position: "absolute",
                  left: `${(point.x || 0) * fixedWidth}px`, // 👈 x = 인풋 오른쪽 끝
                  top: `${(point.y || 0) * fixedHeight}px`,
                  transform: "translateX(-100%) translateY(-50%)",
                  // 👆 X축은 100% 만큼 왼쪽으로 밀어줘서, 기준 좌표가 인풋 오른쪽 끝이 되게 함
                }}
                fixedInputWidth={inputWidth}
              />
            );
          })}

          {/* 디바이스 아이콘 */}
          {selectedScenario?.children?.map((device, index) => {
            const left = device.x * fixedWidth;
            const top = device.y * fixedHeight;

            // console.log(left, top, device.x, device.y, device.id);
            return device.displayOnDiagram ? (
              <div
                datatype={device.id}
                key={`${device.id}${index}`}
                className="absolute text-white transition text-xs px-2 py-1 rounded cursor-pointer hover:bg-blue-600/0 bg-blue-600/0 z-50"
                style={{
                  left: `${left}px`,
                  top: `${top}px`,
                  transform: "translateY(-50%)",
                  fontSize: `${Math.max(10, Math.min(12 * scale, 18))}px`,
                  width: `${Math.max(16, Math.min(device.size * scale, 48))}px`,
                  height: `${Math.max(
                    16,
                    Math.min(device.size * scale, 48)
                  )}px`,
                }}
                onClick={() => {
                  setDeviceOpen(true);
                  setSelectedDevice(device);
                }}
              ></div>
            ) : (
              <></>
            );
          })}
        </div>
      ) : (
        <div className="flex-1 h-[600px] flex items-center justify-center">
          <img src={LOGO_SRC} width={200} alt="logo" />
        </div>
      )}
      <BaseToast open={open} setOpen={setOpen} toastMessage={toastMessage} />
    </div>
  );
};

export default Monitor;
