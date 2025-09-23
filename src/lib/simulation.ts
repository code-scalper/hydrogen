import type { DeviceInterface, DeviceProperty, ScenarioInterface } from "@/types";

const hasValue = (value: unknown): boolean => {
  if (value === undefined || value === null) return false;
  if (typeof value === "string") {
    return value.trim().length > 0;
  }
  return true;
};

const extractDeviceValues = (
  device: DeviceInterface,
  accumulator: Record<string, string>,
) => {
  const collect = (props?: DeviceProperty[]) => {
    props?.forEach((prop) => {
      if (!prop?.key) return;
      const value = prop.value;
      if (hasValue(value)) {
        accumulator[prop.key] = `${value}`;
      }
    });
  };

  collect(device.props);
  collect(device.outputProps);
};

const extractScenarioBaseValues = (
  scenario: ScenarioInterface,
  accumulator: Record<string, string>,
) => {
  scenario.baseData?.forEach((item) => {
    const key = item.altName?.replace(/[()]/g, "").trim() || item.key;
    if (!key) return;
    if (hasValue(item.value)) {
      accumulator[key] = `${item.value}`;
    }
  });
};

export const collectScenarioInputValues = (
  scenario: ScenarioInterface | null,
): { sfc: string | null; values: Record<string, string> } | null => {
  if (!scenario) return null;

  const values: Record<string, string> = {};
  extractScenarioBaseValues(scenario, values);
  scenario.children?.forEach((device) => {
    if (!device) return;
    extractDeviceValues(device, values);
  });

  const sfc = scenario.sfcName ?? scenario.id ?? null;
  if (sfc) {
    values.SFC = sfc;
  }

  return { sfc, values };
};
