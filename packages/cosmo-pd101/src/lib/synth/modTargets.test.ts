import { describe, expect, it } from "vitest";
import {
	getModDestinationGroups,
	getModDestinationLabel,
	isRegisteredModDestination,
	type ModTargetKey,
	resolveTargetFromMetadata,
} from "./modTargets";

describe("modTargets", () => {
	describe("isRegisteredModDestination", () => {
		it("returns true for core targets", () => {
			expect(isRegisteredModDestination("volume")).toBe(true);
			expect(isRegisteredModDestination("pitch")).toBe(true);
			expect(isRegisteredModDestination("line1DcwBase")).toBe(true);
			for (const line of [1, 2]) {
				for (let slot = 1; slot <= 8; slot++) {
					expect(
						isRegisteredModDestination(
							`line${line}AlgoControl${slot}` as Parameters<
								typeof isRegisteredModDestination
							>[0],
						),
					).toBe(true);
				}
			}
		});

		it("returns false for unregistered targets", () => {
			// biome-ignore lint/suspicious/noExplicitAny: testing fallback behavior
			expect(isRegisteredModDestination("unknown" as any)).toBe(false);
		});
	});

	describe("getModDestinationLabel", () => {
		it("returns correct label for registered targets", () => {
			expect(getModDestinationLabel("volume")).toBe("Volume");
			expect(getModDestinationLabel("pitch")).toBe("Pitch");
			expect(getModDestinationLabel("line1AlgoControl1")).toBe(
				"Line 1 Algo Control 1",
			);
		});

		it("returns target ID for unregistered targets", () => {
			// biome-ignore lint/suspicious/noExplicitAny: testing fallback behavior
			expect(getModDestinationLabel("unknown" as any)).toBe("unknown");
		});
	});

	describe("getModDestinationGroups", () => {
		it("returns groups with destinations", () => {
			const groups = getModDestinationGroups();
			expect(groups.length).toBeGreaterThan(0);
			const globalGroup = groups.find((g) => g.label === "Global");
			expect(globalGroup).toBeDefined();
			expect(globalGroup?.destinations.some((d) => d.value === "volume")).toBe(
				true,
			);
		});
	});

	describe("resolveTargetFromMetadata", () => {
		it("resolves line.algoBlend", () => {
			expect(
				resolveTargetFromMetadata("line.algoBlend", { lineIndex: 1 }),
			).toBe("line1AlgoBlend");
			expect(
				resolveTargetFromMetadata("line.algoBlend", { lineIndex: 2 }),
			).toBe("line2AlgoBlend");
			expect(resolveTargetFromMetadata("line.algoBlend")).toBe(
				"line1AlgoBlend",
			);
		});

		it("resolves env.stepLevel", () => {
			expect(
				resolveTargetFromMetadata("env.stepLevel", {
					lineIndex: 1,
					envKind: "dco",
					stepIndex: 1,
				}),
			).toBe("line1DcoEnvStep1Level");

			expect(
				resolveTargetFromMetadata("env.stepLevel", {
					lineIndex: 2,
					envKind: "dcw",
					stepIndex: 8,
				}),
			).toBe("line2DcwEnvStep8Level");
		});

		it("returns undefined for invalid env parameters", () => {
			expect(
				resolveTargetFromMetadata("env.stepLevel", { envKind: "dco" }),
			).toBeUndefined();
			expect(
				resolveTargetFromMetadata("env.stepLevel", {
					envKind: "dco",
					stepIndex: 0,
				}),
			).toBeUndefined();
			expect(
				resolveTargetFromMetadata("env.stepLevel", {
					envKind: "dco",
					stepIndex: 9,
				}),
			).toBeUndefined();
		});

		it("resolves env.stepRate", () => {
			expect(
				resolveTargetFromMetadata("env.stepRate", {
					lineIndex: 1,
					envKind: "dca",
					stepIndex: 3,
				}),
			).toBe("line1DcaEnvStep3Rate");
		});

		it("resolves phaser targets", () => {
			expect(resolveTargetFromMetadata("phaser.rate")).toBe("phaserRate");
			expect(resolveTargetFromMetadata("phaser.depth")).toBe("phaserDepth");
			expect(resolveTargetFromMetadata("phaser.feedback")).toBe(
				"phaserFeedback",
			);
			expect(resolveTargetFromMetadata("phaser.mix")).toBe("phaserMix");
		});

		it("resolves lfo targets", () => {
			expect(resolveTargetFromMetadata("lfo.rate", { lfoIndex: 1 })).toBe(
				"lfo1Rate",
			);
			expect(resolveTargetFromMetadata("lfo.rate", { lfoIndex: 2 })).toBe(
				"lfo2Rate",
			);
			expect(resolveTargetFromMetadata("lfo.rate")).toBe("lfo1Rate");
		});

		it("resolves random.rate", () => {
			expect(resolveTargetFromMetadata("random.rate")).toBe("randomRate");
		});

		it("returns undefined for unknown keys", () => {
			expect(
				resolveTargetFromMetadata("unknown" as unknown as ModTargetKey),
			).toBeUndefined();
		});
	});
});
