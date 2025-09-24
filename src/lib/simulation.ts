import type {
	DeviceInterface,
	DeviceProperty,
	ScenarioInterface,
} from "@/types";

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
		if (!props) return;
		for (const prop of props) {
			if (!prop?.key) continue;
			const value = prop.value;
			if (hasValue(value)) {
				accumulator[prop.key] = `${value}`;
			}
		}
	};

	collect(device.props);
	collect(device.outputProps);
};

const extractScenarioBaseValues = (
	scenario: ScenarioInterface,
	accumulator: Record<string, string>,
) => {
	if (!scenario.baseData) return;
	for (const item of scenario.baseData) {
		const key = item.altName?.replace(/[()]/g, "").trim() || item.key;
		if (!key) continue;
		if (hasValue(item.value)) {
			accumulator[key] = `${item.value}`;
		}
	}
};

export const collectScenarioInputValues = (
	scenario: ScenarioInterface | null,
): { sfc: string | null; values: Record<string, string> } | null => {
	if (!scenario) return null;

	const values: Record<string, string> = {};
	extractScenarioBaseValues(scenario, values);
	if (scenario.children) {
		for (const device of scenario.children) {
			if (!device) continue;
			extractDeviceValues(device, values);
		}
	}

	const sfc = scenario.sfcName ?? scenario.id ?? null;
	if (sfc) {
		values.SFC = sfc;
	}

	return { sfc, values };
};
