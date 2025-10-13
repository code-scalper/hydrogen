import { describe, expect, it } from "vitest";

import { buildSimulationAnalysis } from "@/lib/simulationAnalysis";
import type { SimulationFrame } from "@/store/useSimulationStore";

describe("buildSimulationAnalysis", () => {
	it("returns fallback summary when frames are missing", () => {
		const summary = buildSimulationAnalysis({
			status: "EXE completed successfully",
			frames: [],
		});

		expect(summary.totalFrames).toBe(0);
		expect(summary.highlights).toHaveLength(0);
		expect(summary.notes.some((note) => note.includes("출력 데이터"))).toBe(
			true,
		);
	});

	it("summarizes numeric metrics and trends", () => {
		const frames: SimulationFrame[] = [
			{ time: 0, values: { Pressure: "1", Flow: "5" } },
			{ time: 1, values: { Pressure: "2.5", Flow: "10" } },
			{ time: 2, values: { Pressure: "3", Flow: "15" } },
		];

		const summary = buildSimulationAnalysis({ status: "done", frames });

		expect(summary.totalFrames).toBe(3);
		expect(summary.trackedKeys).toBe(2);
		expect(summary.highlights.length).toBeGreaterThan(0);

		const map = Object.fromEntries(
			summary.highlights.map((item) => [item.key, item]),
		);

		expect(map.Flow?.finalValue).toBe("15");
		expect(map.Flow?.changeText).toContain("+10");
		expect(map.Flow?.rangeText).toBe("5 ~ 15");

		expect(map.Pressure?.finalValue).toBe("3");
		expect(map.Pressure?.changeText).toContain("+2");
		expect(map.Pressure?.rangeText).toBe("1 ~ 3");

		expect(summary.notes[0]).toContain("실행 상태");
		expect(summary.notes.some((note) => note.includes("총 3개 프레임"))).toBe(
			true,
		);
	});
});
