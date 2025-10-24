import { DEFAULT_SCENARIO_VALUES } from "@/constants/defaultValue";
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

const resolveScenarioDefaults = (
	scenario: ScenarioInterface,
): Record<string, number | string | boolean> => {
	const sfc = scenario.sfcName;
	if (!sfc) return {};
	const scenarioKey = `SFC${sfc}` as keyof typeof DEFAULT_SCENARIO_VALUES;
	const entry = DEFAULT_SCENARIO_VALUES[scenarioKey];
	if (!entry) return {};
	const optionKey = scenario.optionKey as keyof typeof entry | undefined;
	if (optionKey) {
		const variant = entry[optionKey];
		if (variant) {
			return variant;
		}
	}
	return entry.type1 ?? {};
};

const applyScenarioDefaults = (
	scenario: ScenarioInterface,
	accumulator: Record<string, string>,
) => {
	const defaults = resolveScenarioDefaults(scenario);
	const addVariant = (key: string | undefined, value: string) => {
		if (!key) return;
		const variants = new Set<string>();
		variants.add(key);
		const trimmed = key.trim();
		if (trimmed && trimmed !== key) variants.add(trimmed);
		const withoutParens = trimmed.replace(/[()]/g, "").trim();
		if (withoutParens) variants.add(withoutParens);
		if (trimmed.startsWith("(") && trimmed.endsWith(")")) {
			variants.add(trimmed.slice(1, -1).trim());
		}
		for (const variant of variants) {
			const existingRaw = accumulator[variant];
			if (!hasValue(existingRaw)) {
				accumulator[variant] = value;
				continue;
			}
			const existing = `${existingRaw}`.trim();
			const incoming = value.trim();
			const existingNumber = Number.parseFloat(existing);
			const incomingNumber = Number.parseFloat(incoming);
			const isExistingNumeric = !Number.isNaN(existingNumber);
			const isIncomingNumeric = !Number.isNaN(incomingNumber);
			const shouldOverride =
				(existing === "0" && incoming !== "0") ||
				(isExistingNumeric &&
					isIncomingNumeric &&
					existingNumber === 0 &&
					incomingNumber !== 0);
			if (shouldOverride) {
				accumulator[variant] = value;
			}
		}
	};

	for (const [key, raw] of Object.entries(defaults)) {
		if (!hasValue(raw)) continue;
		addVariant(key, `${raw}`);
	}
};

const synchronizeAliasValues = (values: Record<string, string>) => {
	const groups = new Map<
		string,
		{ keys: string[]; preferredValue: string | null }
	>();

	for (const [key, rawValue] of Object.entries(values)) {
		const canonical = key.replace(/[()]/g, "").trim() || key;
		let group = groups.get(canonical);
		if (!group) {
			group = { keys: [], preferredValue: null };
			groups.set(canonical, group);
		}
		group.keys.push(key);
		if (hasValue(rawValue)) {
			const trimmedKey = key.trim();
			const isParenthetical =
				trimmedKey.startsWith("(") && trimmedKey.endsWith(")");
			if (isParenthetical) {
				group.preferredValue = `${rawValue}`;
			} else if (group.preferredValue === null) {
				group.preferredValue = `${rawValue}`;
			}
		}
	}

	for (const { keys, preferredValue } of groups.values()) {
		if (!hasValue(preferredValue)) continue;
		for (const key of keys) {
			values[key] = preferredValue as string;
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

	applyScenarioDefaults(scenario, values);
	synchronizeAliasValues(values);

	const sfc = scenario.sfcName ?? scenario.id ?? null;
	if (sfc) {
		values.SFC = sfc;
	}

	return { sfc, values };
};
