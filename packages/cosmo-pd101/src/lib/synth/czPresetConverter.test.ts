import { describe, expect, it } from "vitest";
import type { DecodedPatch } from "@/lib/midi/czSysexDecoder";
import { convertDecodedPatchToSynthPreset } from "@/lib/synth/czPresetConverter";

function getControlValue(
	controls: Array<{ id: string; value: number }> | null | undefined,
	id: string,
) {
	return controls?.find((entry) => entry.id === id)?.value;
}

const basePatch: DecodedPatch = {
	lineSelect: "L1",
	octave: 1,
	detuneDirection: "+",
	detuneFine: 10,
	detuneOctave: 1,
	detuneNote: 5,
	vibratoWave: 2,
	vibratoDelay: 12,
	vibratoRate: 34,
	vibratoDepth: 56,
	dco1: {
		firstWaveform: 6,
		secondWaveform: 2,
		modulation: "ring",
	},
	dco2: {
		firstWaveform: 8,
		secondWaveform: 3,
		modulation: "noise",
	},
	dca1KeyFollow: 1,
	dcw1KeyFollow: 2,
	dca2KeyFollow: 3,
	dcw2KeyFollow: 4,
	dca1: {
		steps: [{ rate: 50, level: 99, falling: false }],
		endStep: 1,
	},
	dcw1: {
		steps: [{ rate: 51, level: 88, falling: false, sustain: true }],
		endStep: 1,
	},
	dco1Env: {
		steps: [{ rate: 52, level: 77, falling: false }],
		endStep: 1,
	},
	dca2: {
		steps: [{ rate: 53, level: 66, falling: false }],
		endStep: 1,
	},
	dcw2: {
		steps: [{ rate: 54, level: 55, falling: false }],
		endStep: 1,
	},
	dco2Env: {
		steps: [{ rate: 55, level: 44, falling: false }],
		endStep: 1,
	},
};

describe("convertDecodedPatchToSynthPreset", () => {
	it("maps CZ waveforms onto the visualizer algorithms", () => {
		const preset = convertDecodedPatchToSynthPreset(basePatch);

		expect(preset.params.line1.algo).toBe("cz101");
		expect(preset.params.line1.algo2).toBe("cz101");
		expect(
			getControlValue(preset.params.line1.algoControlsA, "waveform1"),
		).toBe(5);
		expect(
			getControlValue(preset.params.line1.algoControlsA, "waveform2"),
		).toBe(1);
		expect(preset.params.modMode).toBe("ring");
		expect(
			getControlValue(preset.params.line2.algoControlsA, "waveform1"),
		).toBe(7);
		expect(preset.params.fxSlots?.[3]).toEqual({
			type: "vibrato",
			params: {
				enabled: true,
				waveform: 2,
				rate: 34,
				depth: 56,
				delay: 12,
			},
		});
		expect(preset.params.fxSlots?.[4].type).toBe("empty");
	});

	it("maps dual-line CZ modes into visualizer line modes and preserves line 2", () => {
		const preset = convertDecodedPatchToSynthPreset({
			...basePatch,
			lineSelect: "L1+2'",
		});

		expect(preset.params.lineSelect).toBe("L1+L2'");
		expect(preset.params.line1.algo).toBe("cz101");
		expect(preset.params.line2.algo).toBe("cz101");
		expect(preset.params.line2.algo2).toBe("cz101");
		expect(
			getControlValue(preset.params.line2.algoControlsA, "waveform1"),
		).toBe(7);
		expect(
			getControlValue(preset.params.line2.algoControlsA, "waveform2"),
		).toBe(2);
		expect(preset.params.modMode).toBe("ring");
		expect(preset.params.line2.detuneCents).toBe(1720);
		expect(preset.params.line2.octave).toBe(1);
		expect(preset.params.line2.keyFollow).toBe(4);
	});
});
