import LOGO_SRC from "@/assets/logo.png";
import {
  DEFAULT_SCENARIO_VALUES,
  type ScenarioDefaultValue,
} from "@/constants/defaultValue";
import { useInteractionStore } from "@/store/useInteractionStore";
import { useProjectStore } from "@/store/useProjectStore";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import FlowInputOverlay from "./FlowInputOverlay";
import FlowOutputOverlay from "./FlowOutputOverlay";

import type { DeviceProperty, ScenarioInterface } from "@/types";

import BaseToast from "@/components/ui/BaseToast";

const images = import.meta.glob("@/assets/diagram/*", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

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

const clampWithPadding = (value: number, maxSize: number, padding: number) => {
  if (padding <= 0) return value;
  const maxAllowed = Math.max(padding, maxSize - padding);
  return Math.min(Math.max(value, padding), maxAllowed);
};

const Monitor = () => {
  // store
  const setSelectedDevice = useProjectStore((state) => state.setSelectedDevice);
  const setDeviceOpen = useInteractionStore((state) => state.setDeviceOpen);
  const updateInputValue = useProjectStore((state) => state.updateInputValue);
  const setInputValidity = useInteractionStore(
    (state) => state.setInputValidity
  );
  const selectedScenario = useProjectStore(
    (state) => state.selectedScenario
  ) as ScenarioInterface | null;

  const handleValidityChange = useCallback(
    (inputId: string, isValid: boolean) => {
      setInputValidity(inputId, isValid);
    },
    [setInputValidity]
  );

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
  const inputWidth = getInputWidth(fixedWidth);

  const imageUrl = useMemo(() => {
    return selectedScenario
      ? images[`/src/assets/diagram/${selectedScenario.src}`]
      : images["/src/assets/diagram/SFC_1022.jpg"];
  }, [selectedScenario]);

  // const inputPoints = useMemo(() => {
  //   console.log(selectedScenario, "selectedScenario");
  //   if (!selectedScenario?.children) return [];
  //   return selectedScenario.children.flatMap((child) =>
  //     child.props.filter((prop) => prop.displayOnDiagram)
  //   );
  // }, [selectedScenario]);

  type DiagramPoints = {
    inputs: DeviceProperty[];
    outputs: DeviceProperty[];
  };

  const points: DiagramPoints = useMemo(() => {
    if (!selectedScenario?.children) {
      return { inputs: [], outputs: [] };
    }

    const scenarioDefaults: ScenarioDefaultValue | undefined = (() => {
      if (!selectedScenario.sfcName) return undefined;
      const scenarioKey =
        `SFC${selectedScenario.sfcName}` as keyof typeof DEFAULT_SCENARIO_VALUES;
      if (!(scenarioKey in DEFAULT_SCENARIO_VALUES)) {
        return undefined;
      }
      const entry = DEFAULT_SCENARIO_VALUES[scenarioKey];
      const optionKey = selectedScenario.optionKey;
      if (optionKey && Object.prototype.hasOwnProperty.call(entry, optionKey)) {
        return entry[optionKey as keyof typeof entry];
      }
      return entry.type1;
    })();

    const normalizeKey = (key?: string, fallbackName?: string) => {
      const raw = key ?? fallbackName ?? "";
      return raw.trim();
    };
    const getDefaultValue = (key?: string, name?: string) => {
      const map = scenarioDefaults;

      if (!map) return "0";
      const normalized = normalizeKey(key, name);

      if (!normalized) return "0";
      const raw = map[normalized];
      if (raw === undefined || raw === null) {
        return "0";
      }
      if (typeof raw === "boolean") {
        return raw ? "true" : "false";
      }
      return `${raw}`;
    };

    const ensureValue = (prop: DeviceProperty): DeviceProperty => {
      const existing = prop.value;

      if (
        existing !== undefined &&
        existing !== "0" &&
        `${existing}`.trim() !== ""
      ) {
        return prop;
      }
      return {
        ...prop,
        value: getDefaultValue(prop.key, prop.name),
      };
    };

    const inputs = selectedScenario.children
      .flatMap((child) =>
        (child.props ?? []).filter((prop) => prop.displayOnDiagram)
      )
      .map(ensureValue);
    const outputs = selectedScenario.children
      .flatMap((child) =>
        (child.outputProps ?? []).filter((prop) => prop.displayOnDiagram)
      )
      .map(ensureValue);

    return { inputs, outputs };
  }, [selectedScenario]);

  const diagramInputs = points.inputs;
  const diagramOutputs = points.outputs;

  const labelForPoint = useCallback(
    (point: DeviceProperty, fallbackId: string) => {
      const candidates = [point.key, point.name, fallbackId];
      for (const candidate of candidates) {
        if (!candidate) continue;
        const trimmed = `${candidate}`.trim();
        if (trimmed.length > 0) {
          return trimmed;
        }
      }
      return fallbackId;
    },
    []
  );

  const inputOverlays = useMemo(() => {
    const shouldPadEdges = fixedWidth >= BASE_IMAGE_WIDTH;

    console.log(BASE_IMAGE_WIDTH, fixedWidth, shouldPadEdges);
    const horizontalPadding = shouldPadEdges ? 12 : 0;
    const counts = new Map<string, number>();
    return diagramInputs.map((point, index) => {
      const base = labelForPoint(point, `input-${index}`);
      const seen = counts.get(base) ?? 0;
      counts.set(base, seen + 1);
      const renderKey = seen === 0 ? base : `${base}-${seen}`;
      const rawLeft = (point.x || 0) * fixedWidth;

      const left = shouldPadEdges
        ? clampWithPadding(rawLeft, fixedWidth, horizontalPadding)
        : rawLeft;
      const top = (point.y || 0) * fixedHeight;
      const overlayStyle: CSSProperties = {
        position: "absolute",
        left: `${left}px`,
        top: `${top}px`,
        transform: "translateY(-50%)",
      };
      return {
        point,
        renderKey,
        overlayStyle,
        label: base,
      };
    });
  }, [diagramInputs, fixedHeight, fixedWidth, labelForPoint]);

  const outputOverlays = useMemo(() => {
    const counts = new Map<string, number>();
    return diagramOutputs.map((point, index) => {
      const base = labelForPoint(point, `output-${index}`);
      const seen = counts.get(base) ?? 0;
      counts.set(base, seen + 1);
      const renderKey = seen === 0 ? base : `${base}-${seen}`;
      const left =
        fixedWidth === 1920
          ? (point.x || 0) * fixedWidth + 30
          : (point.x || 0) * fixedWidth;
      const top = (point.y || 0) * fixedHeight;
      const overlayStyle: CSSProperties = {
        position: "absolute",
        left: `${left}px`,
        top: `${top}px`,
        transform: "translateX(-100%) translateY(-50%)",
      };
      return {
        point,
        renderKey,
        overlayStyle,
        label: base,
      };
    });
  }, [diagramOutputs, fixedHeight, fixedWidth, labelForPoint]);

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
          <p className="text-white/30 absolute top-0 z-50 p-2">
            {selectedScenario.sfcName ?? selectedScenario.templateId}
            {selectedScenario.sfcName
              ? ` · SFC${selectedScenario.sfcName}`
              : ""}
            {selectedScenario.optionLabel
              ? ` #${selectedScenario.optionLabel}`
              : ""}
          </p>
          <img
            ref={imageRef}
            src={imageUrl}
            alt="scenario"
            className="absolute inset-0 w-full h-full object-contain"
          />

          {inputOverlays.map(({ point, renderKey, overlayStyle, label }) => (
            <FlowInputOverlay
              key={renderKey}
              point={point}
              scenarioId={selectedScenario.id}
              onChange={updateInputValue}
              onValidityChange={handleValidityChange}
              status="normal"
              label={label}
              scale={scale}
              inputHeight={inputHeight}
              overlayStyle={overlayStyle}
              fixedInputWidth={inputWidth}
            />
          ))}

          {outputOverlays.map(({ point, renderKey, overlayStyle, label }) => (
            <FlowOutputOverlay
              key={renderKey}
              point={point}
              scenarioId={selectedScenario.id}
              status="normal"
              label={label}
              scale={scale}
              inputHeight={inputHeight}
              overlayStyle={overlayStyle}
              fixedInputWidth={inputWidth}
            />
          ))}

          {/* 디바이스 아이콘 */}
          {selectedScenario?.children?.map((device, index) => {
            const left = device.x * fixedWidth;
            const top = device.y * fixedHeight;

            // console.log(left, top, device.x, device.y, device.id);
            if (!device.displayOnDiagram) {
              return null;
            }

            return (
              <button
                type="button"
                data-device={device.id}
                key={device.id ?? index}
                className="absolute z-50 bg-blue-600/0 text-white text-xs px-2 py-1 rounded cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500"
                style={{
                  left: `${left}px`,
                  top: `${top}px`,
                  transform: "translateY(-50%)",
                  fontSize: `${Math.max(10, Math.min(12 * scale, 18))}px`,
                  width: `${Math.max(16, Math.min(device.size * scale, 64))}px`,
                  height: `${Math.max(
                    16,
                    Math.min(device.size * scale, 64)
                  )}px`,
                }}
                onClick={() => {
                  setDeviceOpen(true);
                  setSelectedDevice(device);
                }}
              />
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
