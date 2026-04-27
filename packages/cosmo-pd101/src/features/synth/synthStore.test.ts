import { beforeEach, describe, expect, it } from "vitest";
import { useSynthStore } from "@/features/synth/synthStore";

describe("synthStore gatherState", () => {
	beforeEach(() => {
		useSynthStore.setState(useSynthStore.getInitialState());
	});

	it("gatherState includes fxSlots with 6 entries", () => {
		const params = useSynthStore.getState().gatherState().params;
		expect(params.fxSlots).toHaveLength(6);
		if (!params.fxSlots) {
			throw new Error("Expected gatherState params to include fxSlots");
		}
		for (const slot of params.fxSlots) {
			expect(slot).toHaveProperty("type");
		}
	});

	it("default state has all slots empty", () => {
		const { fxSlots } = useSynthStore.getState();
		for (const slot of fxSlots) {
			expect(slot.type).toBe("empty");
		}
	});

	it("setFxSlotType resets slot to enabled default params", () => {
		const store = useSynthStore.getState();
		store.setFxSlotType(1, "compressor");
		const next = useSynthStore.getState();
		const config = next.fxSlots[1];
		expect(config.type).toBe("compressor");
		if (config.type === "compressor") {
			expect(config.params.enabled).toBe(true);
		}
	});

	it("applyPreset restores fxSlots from preset", () => {
		const preset = useSynthStore.getState().gatherState();
		preset.params.fxSlots = [
			{
				type: "compressor",
				params: {
					enabled: true,
					thresholdDb: -9,
					ratio: 6,
					attackMs: 8,
					releaseMs: 120,
					makeupDb: 4,
					mix: 0.9,
				},
			},
			{ type: "empty" },
			{ type: "empty" },
			{ type: "empty" },
			{ type: "empty" },
			{ type: "empty" },
		];

		useSynthStore.getState().applyPreset(preset);

		const next = useSynthStore.getState();
		const config = next.fxSlots[0];
		expect(config.type).toBe("compressor");
		if (config.type === "compressor") {
			expect(config.params.thresholdDb).toBe(-9);
			expect(config.params.ratio).toBe(6);
		}
	});
});
