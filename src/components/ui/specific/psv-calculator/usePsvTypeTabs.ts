import { useCallback, useEffect, useMemo, useState } from "react";

import {
  DEFAULT_SCENARIO_VALUES,
  type ScenarioDefaultValue,
} from "@/constants/defaultValue";
import type { DeviceProperty } from "@/types";

const toStringValue = (value: unknown) => {
  if (value === null || value === undefined) return "";
  if (typeof value === "number") {
    if (!Number.isFinite(value)) return "";
    return `${value}`;
  }
  return `${value}`;
};

const formatTypeLabel = (key: string) => {
  if (key.toLowerCase().startsWith("type")) {
    const suffix = key.slice(4);
    return suffix ? `Type ${suffix}` : "Type";
  }
  return key;
};

export type InputValueMap = Record<string, string>;

interface UsePsvTypeTabsParams {
  sfc: string;
  inputProps: readonly DeviceProperty[];
  inputs: Record<string, string>;
  loadInputs: (values: InputValueMap) => void;
}

interface TypeTab {
  key: string;
  label: string;
}

export const usePsvTypeTabs = ({
  sfc,
  inputProps,
  inputs,
  loadInputs,
}: UsePsvTypeTabsParams) => {
  const scenarioKey = `SFC${sfc}` as keyof typeof DEFAULT_SCENARIO_VALUES;
  const scenarioDefaults = DEFAULT_SCENARIO_VALUES[scenarioKey];

  const typeKeys = useMemo(() => {
    if (!scenarioDefaults) return [] as string[];
    return Object.keys(scenarioDefaults);
  }, [scenarioDefaults]);

  const buildSnapshot = useCallback(
    (typeKey: string) => {
      const defaults = scenarioDefaults?.[
        typeKey as keyof typeof scenarioDefaults
      ] as ScenarioDefaultValue | undefined;
      const snapshot: InputValueMap = {};
      inputProps.forEach((prop) => {
        const key = prop.key;
        if (!key) return;
        if (defaults && Object.prototype.hasOwnProperty.call(defaults, key)) {
          snapshot[key] = toStringValue(defaults[key]);
          return;
        }
        if (typeof prop.value !== "undefined" && prop.value !== null) {
          snapshot[key] = toStringValue(prop.value);
          return;
        }
        snapshot[key] = "";
      });
      return snapshot;
    },
    [inputProps, scenarioDefaults]
  );

  const initialSnapshots = useMemo(() => {
    const initial: Record<string, InputValueMap> = {};
    typeKeys.forEach((key) => {
      initial[key] = buildSnapshot(key);
    });
    return initial;
  }, [buildSnapshot, typeKeys]);

  const [snapshots, setSnapshots] = useState<Record<string, InputValueMap>>(
    initialSnapshots
  );
  const [activeType, setActiveType] = useState<string | null>(
    typeKeys[0] ?? null
  );

  useEffect(() => {
    setSnapshots(initialSnapshots);
    if (typeKeys.length > 0) {
      setActiveType((prev) =>
        prev && typeKeys.includes(prev) ? prev : typeKeys[0]
      );
    } else {
      setActiveType(null);
    }
  }, [initialSnapshots, typeKeys]);

  useEffect(() => {
    if (!activeType) return;
    const snapshot = snapshots[activeType];
    if (snapshot) {
      loadInputs(snapshot);
    }
  }, [activeType, loadInputs, snapshots]);

  const selectType = useCallback(
    (nextType: string) => {
      if (!nextType || nextType === activeType || !typeKeys.includes(nextType)) {
        return;
      }
      setSnapshots((prev) => {
        const nextSnapshots: Record<string, InputValueMap> = { ...prev };
        if (activeType) {
          nextSnapshots[activeType] = { ...inputs };
        }
        if (!nextSnapshots[nextType]) {
          nextSnapshots[nextType] = buildSnapshot(nextType);
        }
        return nextSnapshots;
      });
      setActiveType(nextType);
    },
    [activeType, buildSnapshot, inputs, typeKeys]
  );

  const typeTabs: TypeTab[] = useMemo(() => {
    return typeKeys.map((key) => ({ key, label: formatTypeLabel(key) }));
  }, [typeKeys]);

  return {
    typeTabs,
    activeType,
    selectType,
  };
};

export type UsePsvTypeTabsReturn = ReturnType<typeof usePsvTypeTabs>;
