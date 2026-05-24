import { describe, expect, it, vi } from "vitest";
import type { SynthPresetV1 } from "@/lib/synth/bindings/synth";
import { createSynthEngineSnapshot } from "./synthEngineSnapshot";

const MINIMAL_PRESET = {
	schemaVersion: 1,
	params: {
		lineSelect: "L1" as const,
		modMode: "normal" as const,
		octave: 0,
		line1: {
			algo: "saw" as const,
			algo2: null,
			algoBlend: 0,
			window: "off" as const,
			dcaBase: 0,
			dcwBase: 0,
			modulation: 0,
			octave: 0,
			dcoEnv: { steps: [], sustainStep: 0, stepCount: 0, loop: false },
			dcwEnv: { steps: [], sustainStep: 0, stepCount: 0, loop: false },
			dcaEnv: { steps: [], sustainStep: 0, stepCount: 0, loop: false },
			dcwKeyFollow: 0,
			dcaKeyFollow: 0,
			algoControlsA: [{ id: "a", value: 1 }],
			algoControlsB: [{ id: "b", value: 2 }],
		},
		line2: {
			algo: "square" as const,
			algo2: null,
			algoBlend: 0,
			window: "off" as const,
			dcaBase: 0,
			dcwBase: 0,
			modulation: 0,
			octave: 0,
			dcoEnv: { steps: [], sustainStep: 0, stepCount: 0, loop: false },
			dcwEnv: { steps: [], sustainStep: 0, stepCount: 0, loop: false },
			dcaEnv: { steps: [], sustainStep: 0, stepCount: 0, loop: false },
			dcwKeyFollow: 0,
			dcaKeyFollow: 0,
			algoControlsA: [{ id: "c", value: 3 }],
			algoControlsB: [{ id: "d", value: 4 }],
		},
		frequency: 0,
		volume: 0,
		polyMode: "poly8" as const,
		legato: false,
		portamento: { enabled: false, mode: "rate" as const, rate: 0, time: 0 },
		lfo: {
			waveform: "sine" as const,
			rate: 0,
			depth: 0,
			symmetry: 0,
			retrigger: false,
		},
	},
} as unknown as SynthPresetV1;

describe("createSynthEngineSnapshot", () => {
	it("sets frequency to effectivePitchHz and spreads params", () => {
		const gatherState = vi.fn(() => MINIMAL_PRESET);
		const result = createSynthEngineSnapshot({
			gatherState,
			effectivePitchHz: 440,
		});

		expect(gatherState).toHaveBeenCalledOnce();
		expect(result.params.frequency).toBe(440);
		expect(result.params.volume).toBe(0);
		expect(result.params.octave).toBe(0);
		expect("keyFollow" in result.params.line1).toBe(false);
		expect("keyFollow" in result.params.line2).toBe(false);
	});

	it("normalizes phaseMod slot params: intPmAmount → amount, intPmRatio → ratio", () => {
		const preset = {
			...MINIMAL_PRESET,
			params: {
				...MINIMAL_PRESET.params,
				fxSlots: [
					{
						type: "phaseMod",
						params: {
							intPmAmount: 0.75,
							intPmRatio: 3.0,
							enabled: true,
							pmPre: false,
						},
					} as const,
					{
						type: "phaseMod",
						params: {
							intPmAmount: null,
							intPmRatio: null,
							enabled: false,
							pmPre: null,
						},
					} as const,
					{
						type: "phaseMod",
						params: {
							amount: 0.5,
							ratio: 4.0,
							enabled: true,
							pmPre: true,
						},
					} as const,
				] as unknown as SynthPresetV1["params"]["fxSlots"],
			},
		} as unknown as SynthPresetV1;

		const gatherState = vi.fn(() => preset);
		const result = createSynthEngineSnapshot({
			gatherState,
			effectivePitchHz: 440,
		});

		const slots = result.params.fxSlots;
		expect(slots).toBeDefined();
		if (!slots) {
			throw new Error("Expected fxSlots to be defined");
		}
		expect(slots).toHaveLength(3);

		const s0 = slots[0];
		if (s0.type === "phaseMod") {
			expect(s0.params.amount).toBe(0.75);
			expect(s0.params.ratio).toBe(3.0);
			expect(s0.params.enabled).toBe(true);
			expect(s0.params.pmPre).toBe(false);
		}

		const s1 = slots[1];
		if (s1.type === "phaseMod") {
			expect(s1.params.amount).toBe(0);
			expect(s1.params.ratio).toBe(2.0);
			expect(s1.params.enabled).toBe(false);
			expect(s1.params.pmPre).toBe(true);
		}

		const s2 = slots[2];
		if (s2.type === "phaseMod") {
			expect(s2.params.amount).toBe(0.5);
			expect(s2.params.ratio).toBe(4.0);
		}
	});

	it("sanitizes non-phaseMod slots into engine-safe payloads", () => {
		const fxSlot = {
			type: "delay",
			params: {
				enabled: true,
				time: 200,
				feedback: 0.3,
				mix: 0.5,
				tapeMode: 1,
				timeMode: "sync",
				syncDivision: "eighth",
			},
		} as const;
		const preset = {
			...MINIMAL_PRESET,
			params: {
				...MINIMAL_PRESET.params,
				fxSlots: [fxSlot] as unknown as SynthPresetV1["params"]["fxSlots"],
			},
		} as unknown as SynthPresetV1;

		const gatherState = vi.fn(() => preset);
		const result = createSynthEngineSnapshot({
			gatherState,
			effectivePitchHz: 440,
		});

		expect(result.params.fxSlots).toHaveLength(1);
		expect(result.params.fxSlots?.[0]).toEqual({
			type: "delay",
			params: {
				enabled: true,
				time: 200,
				feedback: 0.3,
				mix: 0.5,
				tapeMode: true,
				warmth: 0.5,
				timeMode: "sync",
				syncDivision: "eighth",
			},
		});
	});

	it("passes null/undefined fxSlots through", () => {
		const preset1 = {
			...MINIMAL_PRESET,
			params: { ...MINIMAL_PRESET.params, fxSlots: undefined },
		} as unknown as SynthPresetV1;

		const gather1 = vi.fn(() => preset1);
		const result1 = createSynthEngineSnapshot({
			gatherState: gather1,
			effectivePitchHz: 440,
		});
		expect(result1.params.fxSlots).toBeUndefined();

		const preset2 = {
			...MINIMAL_PRESET,
			params: { ...MINIMAL_PRESET.params, fxSlots: null },
		} as unknown as SynthPresetV1;

		const gather2 = vi.fn(() => preset2);
		const result2 = createSynthEngineSnapshot({
			gatherState: gather2,
			effectivePitchHz: 440,
		});
		expect(result2.params.fxSlots).toBeNull();
	});

	it("defaults missing algoControls to empty arrays", () => {
		const preset = {
			...MINIMAL_PRESET,
			params: {
				...MINIMAL_PRESET.params,
				line1: {
					...MINIMAL_PRESET.params.line1,
					algoControlsA: null,
					algoControlsB: undefined,
				},
				line2: {
					...MINIMAL_PRESET.params.line2,
					algoControlsA: undefined,
					algoControlsB: null,
				},
			},
		} as unknown as SynthPresetV1;

		const gatherState = vi.fn(() => preset);
		const result = createSynthEngineSnapshot({
			gatherState,
			effectivePitchHz: 440,
		});

		expect(result.params.line1.algoControlsA).toEqual([]);
		expect(result.params.line1.algoControlsB).toEqual([]);
		expect(result.params.line2.algoControlsA).toEqual([]);
		expect(result.params.line2.algoControlsB).toEqual([]);
	});

	it("defaults null modMatrix routes to empty array", () => {
		const preset1 = {
			...MINIMAL_PRESET,
			params: { ...MINIMAL_PRESET.params, modMatrix: undefined },
		} as unknown as SynthPresetV1;

		const gather1 = vi.fn(() => preset1);
		const result1 = createSynthEngineSnapshot({
			gatherState: gather1,
			effectivePitchHz: 440,
		});
		expect(result1.params.modMatrix?.routes).toEqual([]);

		const preset2 = {
			...MINIMAL_PRESET,
			params: {
				...MINIMAL_PRESET.params,
				modMatrix: { routes: undefined },
			},
		} as unknown as SynthPresetV1;

		const gather2 = vi.fn(() => preset2);
		const result2 = createSynthEngineSnapshot({
			gatherState: gather2,
			effectivePitchHz: 440,
		});
		expect(result2.params.modMatrix?.routes).toEqual([]);

		const route = {
			source: "lfo1" as const,
			destination: "volume" as const,
			amount: 1,
			enabled: true,
		};
		const preset3 = {
			...MINIMAL_PRESET,
			params: {
				...MINIMAL_PRESET.params,
				modMatrix: { routes: [route] },
			},
		} as unknown as SynthPresetV1;

		const gather3 = vi.fn(() => preset3);
		const result3 = createSynthEngineSnapshot({
			gatherState: gather3,
			effectivePitchHz: 440,
		});
		expect(result3.params.modMatrix?.routes).toEqual([route]);
	});
});
