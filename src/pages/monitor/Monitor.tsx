import { useMemo, useEffect, useState, useRef, useCallback } from "react";
import LOGO_SRC from "@/assets/logo.png";
import FlowInputOverlay from "./FlowInputOverlay";
import { useProjectStore } from "@/store/useProjectStore";
import { useInteractionStore } from "@/store/useInteractionStore";

import { ScenarioInterface } from "@/types";
import { useDebouncedCallback } from "@/hooks/useDebouncedCallback";

import BaseToast from "@/components/ui/BaseToast";

const images = import.meta.glob("@/assets/diagram/*", {
  eager: true,
  as: "url",
});

const BASE_IMAGE_WIDTH = 1200; // 기준 도면 너비
const BASE_INPUT_HEIGHT = 24; // 기준 인풋 높이

const Monitor = () => {
  // store
  const setSelectedDevice = useProjectStore((state) => state.setSelectedDevice);
  const setDeviceOpen = useInteractionStore((state) => state.setDeviceOpen);

  const [open, setOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const showToast = (message: string) => {
    setToastMessage(message);
    setOpen(false); // 이전 Toast 닫기
    setTimeout(() => setOpen(true), 10); // 새 Toast 열기 (React state refresh 대응)
    setTimeout(() => setOpen(false), 2000); // 새 Toast 열기 (React state refresh 대응)
  };
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [imageBox, setImageBox] = useState({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
  });

  const updateImageBox = useCallback(() => {
    if (imageRef.current) {
      const rect = imageRef.current.getBoundingClientRect();
      if (rect.width && rect.height) {
        setImageBox({
          left: rect.left,
          top: rect.top,
          width: rect.width,
          height: rect.height,
        });
      }
    }
  }, []);

  useEffect(() => {
    // 이미지가 로드되기 전에도 최소 한 번 시도
    const timeout = setTimeout(updateImageBox, 100);
    window.addEventListener("resize", updateImageBox);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener("resize", updateImageBox);
    };
  }, [updateImageBox]);

  const updateInputValue = useProjectStore((state) => state.updateInputValue);
  const selectedScenario = useProjectStore(
    (state) => state.selectedScenario
  ) as ScenarioInterface | null;

  const imageUrl = useMemo(() => {
    return selectedScenario
      ? images[`/src/assets/diagram/${selectedScenario.src}`]
      : images[`/src/assets/diagram/diagram3.png`];
  }, [selectedScenario]);

  const scale = useMemo(() => imageBox.width / BASE_IMAGE_WIDTH, [imageBox]);
  const inputHeight = useMemo(() => BASE_INPUT_HEIGHT * scale, [scale]);

  const debouncedUpdate = useDebouncedCallback((id: string, value: string) => {
    if (selectedScenario?.id) {
      updateInputValue(id, value);
    }
  }, 500);

  const inputPoints = useMemo(() => {
    if (!selectedScenario?.children) return [];
    const propsToDisplay = selectedScenario.children.flatMap((child) =>
      child.props.filter((prop) => prop.displayOnDiagram)
    );
    return propsToDisplay;
  }, [selectedScenario]);

  // const inputPoints = useMemo(() => {
  //   if (!SCENARIOS || !SCENARIOS[0]?.children) return [];

  //   const propsToDisplay = SCENARIOS[0].children.flatMap((child) =>
  //     child.props.filter((prop) => prop.displayOnDiagram)
  //   );

  //   return propsToDisplay;
  // }, [SCENARIOS, INPUT_PROPERTIES]);

  useEffect(() => {
    console.log(selectedScenario, "selected scenario");
  }, [selectedScenario]);

  return (
    <div className="flex-1 flex justify-center items-center">
      {selectedScenario ? (
        <div
          ref={containerRef}
          className="relative w-full max-w-[calc(100vw-220px)] min-w-[800px] aspect-[5/3] rounded-lg shadow-inner"
        >
          <img
            ref={imageRef}
            src={imageUrl}
            alt="scenario"
            className="absolute inset-0 w-full h-full object-contain"
            onLoad={updateImageBox} // ✅ 이미지 로드 시 정확한 위치 계산
          />

          {inputPoints?.map((point) => {
            const left = (point.x || 0) * imageBox.width;
            const top = (point.y || 0) * imageBox.height;

            return (
              <FlowInputOverlay
                key={point.key}
                point={point}
                scenarioId={selectedScenario.id}
                onChange={debouncedUpdate}
                status={"normal"}
                label={point.name}
                scale={scale}
                inputHeight={inputHeight}
                overlayStyle={{
                  position: "absolute",
                  left: `${left}px`,
                  top: `${top}px`,
                  transform: "translate(-50%, -50%)",
                }}
              />
            );
          })}

          {selectedScenario?.children?.map((device) => {
            const left = device.x * imageBox.width;
            const top = device.y * imageBox.height;

            return (
              <div
                key={device.id}
                className="absolute  text-white transition text-xs px-2 py-1 rounded cursor-pointer hover:bg-blue-600/30 bg-blue-600/10"
                style={{
                  left: `${left}px`,
                  top: `${top}px`,
                  transform: "translate(-50%, -50%)",
                  position: "absolute",
                  fontSize: `${12 * scale}px`,
                  width: `${device.size}px`,
                  height: `${device.size}px`,
                }}
                onClick={() => {
                  console.log("Clicked device:", device.name, device.id);
                  setDeviceOpen(true);
                  setSelectedDevice(device);

                  // 또는 handleDeviceClick(device);
                }}
              >
                {/* {device.name} */}
              </div>
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
