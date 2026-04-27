import { beforeEach, describe, expect, it } from "vitest";
import { useSynthStore } from "@/features/synth/synthStore";

describe("synthStore gatherState", () => {
	beforeEach(() => {
		useSynthStore.setState(useSynthStore.getInitialState());
	});

	it("includes required top-level FX blocks for engine params", () => {
		const params = useSynthStore.getState().gatherState().params;

		expect(params).toHaveProperty("compressor");
		expect(params).toHaveProperty("eq");
		expect(params).toHaveProperty("grainDelay");
		expect(params).toHaveProperty("bitcrusher");
		expect(params).toHaveProperty("shimmerVerb");
		expect(params).toHaveProperty("distortion");
		expect(params).toHaveProperty("junoChorus");
		expect(params).toHaveProperty("ringMod");
		expect(params).toHaveProperty("tremolo");
		expect(params).toHaveProperty("wavefolder");
	});

	it("mirrors legacy top-level FX blocks from slot zero", () => {
		const params = useSynthStore.getState().gatherState().params;

		expect(params.compressor).toEqual(params.fxSlotCompressors?.[0]);
		expect(params.eq).toEqual(params.fxSlotEqs?.[0]);
		expect(params.grainDelay).toEqual(params.fxSlotGrainDelays?.[0]);
		expect(params.bitcrusher).toEqual(params.fxSlotBitcrushers?.[0]);
		expect(params.shimmerVerb).toEqual(params.fxSlotShimmerVerbs?.[0]);
		expect(params.distortion).toEqual(params.fxSlotDistortions?.[0]);
		expect(params.junoChorus).toEqual(params.fxSlotJunoChoruses?.[0]);
		expect(params.ringMod).toEqual(params.fxSlotRingMods?.[0]);
		expect(params.tremolo).toEqual(params.fxSlotTremolos?.[0]);
		expect(params.wavefolder).toEqual(params.fxSlotWavefolders?.[0]);
	});

	it("resets selected slot params to defaults when user changes slot type", () => {
		const store = useSynthStore.getState();

		store.setFxSlotCompressor(1, {
			enabled: true,
			thresholdDb: -3,
			ratio: 12,
			attackMs: 1,
			releaseMs: 20,
			makeupDb: 9,
			mix: 0.2,
		});

		store.setFxSlotType(1, "delay");
		store.setFxSlotType(1, "compressor");

		const next = useSynthStore.getState();
		expect(next.fxSlotTypes[1]).toBe("compressor");
		expect(next.fxSlotCompressors[1]).toEqual(
			useSynthStore.getInitialState().fxSlotCompressors[1],
		);
	});

	it("keeps preset/restored slot params as provided", () => {
		const preset = useSynthStore.getState().gatherState();
		const existingCompressors =
			preset.params.fxSlotCompressors ??
			useSynthStore.getInitialState().fxSlotCompressors;
		preset.params.fxSlots = ["compressor", "delay", "reverb", "empty", "empty", "empty"];
		preset.params.fxSlotCompressors = [
			{ enabled: true, thresholdDb: -9, ratio: 6, attackMs: 8, releaseMs: 120, makeupDb: 4, mix: 0.9 },
			...existingCompressors.slice(1),
		] as typeof preset.params.fxSlotCompressors;

		useSynthStore.getState().applyPreset(preset);

		const next = useSynthStore.getState();
		expect(next.fxSlotTypes[0]).toBe("compressor");
		expect(next.fxSlotCompressors[0]).toMatchObject({
			enabled: true,
			thresholdDb: -9,
			ratio: 6,
			attackMs: 8,
			releaseMs: 120,
			makeupDb: 4,
			mix: 0.9,
		});
	});
});
