import { useMemo, useEffect } from "react";
import LOGO_SRC from "@/assets/logo.png";

// component
import FlowInputOverlay from "./FlowInputOverlay";

// store
import { useProjectStore } from "@/store/useProjectStore";
import { ScenarioInterface } from "@/types"; // ✅ 정확한 타입 사용

// hooks

import { useDebouncedCallback } from "@/hooks/useDebouncedCallback";

const images = import.meta.glob("@/assets/diagram/*", {
  eager: true,
  as: "url",
});

const Monitor = () => {
  const folders = useProjectStore((state) => state.folderList);
  const updateInputValue = useProjectStore((state) => state.updateInputValue);

  const selectedScenario = useProjectStore(
    (state) => state.selectedScenario
  ) as ScenarioInterface | null; // ✅ 명확한 타입 단언

  const imageUrl = useMemo(() => {
    return selectedScenario
      ? images[`/src/assets/diagram/${selectedScenario.src}`]
      : images[`/src/assets/diagram/diagram3.png`];
  }, [selectedScenario]);

  const getStatusFromValue = (
    value: string
  ): "normal" | "warning" | "error" => {
    const num = parseFloat(value);
    if (isNaN(num)) return "error";
    if (num > 20) return "warning";
    return "normal";
  };

  const debouncedUpdate = useDebouncedCallback(
    (id: string, value: string) => {
      if (selectedScenario?.id) {
        updateInputValue(id, value);
      }
    },
    500 // 밀리초 단위 딜레이 (0.5초 후 실행)
  );

  useEffect(() => {
    console.log(selectedScenario, "selectedScenario", folders);
  }, [selectedScenario]);

  return (
    <div className="flex-1 flex justify-center items-center">
      {selectedScenario ? (
        <div
          className="
            relative
            w-full
            max-w-[calc(100vw-220px)]
            min-w-[800px]
            aspect-[5/3]
            rounded-lg
            shadow-inner
          "
        >
          {/* 도면 이미지 */}
          <img
            src={imageUrl}
            alt="scenario"
            className="absolute inset-0 w-full h-full object-contain"
          />

          {/* input overlay */}
          {selectedScenario?.inputPoints?.map((point) => {
            const status = getStatusFromValue(point.value);

            return (
              <FlowInputOverlay
                key={point.id}
                point={point}
                scenarioId={selectedScenario.id}
                onChange={(id, value) => debouncedUpdate(id, value)} // 👈 변경된 부분
                status={point.status}
                label={point.label}
              />
            );
          })}
        </div>
      ) : (
        <div className="flex-1 h-[600px] flex items-center justify-center">
          <img src={LOGO_SRC} width={200} alt="logo" />
        </div>
      )}
    </div>
  );
};

export default Monitor;
