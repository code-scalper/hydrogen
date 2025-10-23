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
	const collectProps = (props?: DeviceProperty[]) => {
		if (!props) return;
		for (const prop of props) {
			if (!prop?.key) continue;
			const rawValue = prop.value;
			if (hasValue(rawValue)) {
				accumulator[prop.key] = `${rawValue}`;
			}
		}
	};

	collectProps(device.props);
	collectProps(device.outputProps);

	if (Array.isArray(device.children)) {
		for (const child of device.children) {
			if (!child) continue;
			extractDeviceValues(child as DeviceInterface, accumulator);
		}
	}
};

const extractScenarioBaseValues = (
	scenario: ScenarioInterface,
	accumulator: Record<string, string>,
) => {
	if (!scenario.baseData) return;

	const addValue = (
		key: string | undefined,
		value: string | number | boolean,
	) => {
		if (!key) return;
		if (!hasValue(value)) return;
		accumulator[key] = `${value}`;
	};

	for (const item of scenario.baseData) {
		const normalizedAltName = item.altName?.replace(/[()]/g, "").trim();
		const rawAltName = item.altName?.trim();
		const rawKey = item.key?.trim();
		const value = item.value;

		addValue(normalizedAltName, value);
		if (rawAltName && rawAltName !== normalizedAltName) {
			addValue(rawAltName, value);
		}
		addValue(rawKey, value);
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
