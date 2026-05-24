import { beforeEach, describe, expect, it } from "vitest";
import { DEFAULT_ALGO_REF } from "@/lib/synth/algoRef";
import type { FxSlotConfig, SynthPresetV1 } from "@/lib/synth/bindings/synth";
import { useSynthStore } from "./synthStore";

describe("useSynthStore", () => {
	beforeEach(() => {
		useSynthStore.setState(useSynthStore.getInitialState());
	});

	it("initializes with default state", () => {
		const state = useSynthStore.getState();
		expect(state.warpAAmount).toBe(0);
		expect(state.warpAAlgo).toBe(DEFAULT_ALGO_REF);
		expect(state.volume).toBe(1);
		expect(state.czDacEnabled).toBe(false);
	});

	it("updates state via setters", () => {
		const {
			setWarpAAmount,
			setVolume,
			setLineOctave,
			setLfoRate,
			setCzDacEnabled,
		} = useSynthStore.getState();

		act(() => {
			setWarpAAmount(0.5);
			setVolume(0.8);
			setLineOctave(1);
			setLfoRate(2.5);
			setCzDacEnabled(true);
		});

		const state = useSynthStore.getState();
		expect(state.warpAAmount).toBe(0.5);
		expect(state.volume).toBe(0.8);
		expect(state.lineOctave).toBe(1);
		expect(state.lfoRate).toBe(2.5);
		expect(state.czDacEnabled).toBe(true);
	});

	it("clamps integer values using toIntegerInRange", () => {
		const { setLineOctave } = useSynthStore.getState();

		act(() => {
			setLineOctave(1);
		});
		expect(useSynthStore.getState().lineOctave).toBe(1);

		act(() => {
			setLineOctave(5); // Max 2
		});
		expect(useSynthStore.getState().lineOctave).toBe(2);

		act(() => {
			setLineOctave(-5); // Min -2
		});
		expect(useSynthStore.getState().lineOctave).toBe(-2);
	});

	it("gathers state into a preset structure", () => {
		const {
			setWarpAAmount,
			setTempoBpm,
			setLfoRateMode,
			setLfoSyncDivision,
			setCzDacEnabled,
			gatherState,
			gatherPresetState,
		} = useSynthStore.getState();

		act(() => {
			setWarpAAmount(0.75);
			setTempoBpm(132);
			setLfoRateMode("sync");
			setLfoSyncDivision("eighth");
			setCzDacEnabled(true);
		});

		const preset = gatherState();
		expect(preset.params.line1.dcwBase).toBe(0.75);
		expect(preset.params.tempoBpm).toBe(132);
		expect(preset.params.lfo.rateMode).toBe("sync");
		expect(preset.params.lfo.syncDivision).toBe("eighth");
		expect(preset.params.czDacEnabled).toBe(true);
		expect(preset.schemaVersion).toBe(1);

		const presetState = gatherPresetState();
		expect(presetState.params.czDacEnabled).toBeUndefined();
	});

	it("applies a preset to the state", () => {
		const { applyPreset } = useSynthStore.getState();

		const mockPreset = {
			schemaVersion: 1,
			params: {
				volume: 0.5,
				tempoBpm: 96,
				line1: {
					dcwBase: 0.2,
					algo: DEFAULT_ALGO_REF,
				},
				line2: {
					dcwBase: 0.4,
					algo: DEFAULT_ALGO_REF,
				},
				lfo: {
					waveform: "sine",
					rate: 2,
					rateMode: "sync",
					syncDivision: "quarter",
					depth: 1,
					symmetry: 0.5,
					retrigger: false,
					offset: 0,
				},
			},
		} as unknown as SynthPresetV1;

		act(() => {
			useSynthStore.getState().setCzDacEnabled(true);
			applyPreset(mockPreset);
		});

		const state = useSynthStore.getState();
		expect(state.volume).toBe(0.5);
		expect(state.czDacEnabled).toBe(true);
		expect(state.tempoBpm).toBe(96);
		expect(state.warpAAmount).toBe(0.2);
		expect(state.warpBAmount).toBe(0.4);
		expect(state.lfoRateMode).toBe("sync");
		expect(state.lfoSyncDivision).toBe("quarter");
	});

	it("handles invalid presets gracefully in applyPreset", () => {
		const { applyPreset } = useSynthStore.getState();
		const prevState = { ...useSynthStore.getState() };

		act(() => {
			applyPreset({} as unknown as SynthPresetV1);
		});

		expect(useSynthStore.getState()).toEqual(prevState);
	});

	it("manages FX slots", () => {
		const { setFxSlotType, setFxSlotEnabled, setFxSlotParams, reorderFxSlots } =
			useSynthStore.getState();

		act(() => {
			setFxSlotType(0, "delay");
		});
		expect(useSynthStore.getState().fxSlots[0].type).toBe("delay");
		const manualDelaySlot = useSynthStore.getState().fxSlots[0] as Extract<
			FxSlotConfig,
			{ type: "delay" }
		>;
		expect(manualDelaySlot.params.timeMode).toBe("hz");
		expect(manualDelaySlot.params.syncDivision).toBe("quarter");

		act(() => {
			setFxSlotEnabled(0, false);
		});
		const delaySlot0 = useSynthStore.getState().fxSlots[0] as Extract<
			FxSlotConfig,
			{ type: "delay" }
		>;
		expect(delaySlot0.params.enabled).toBe(false);

		act(() => {
			setFxSlotParams(0, { feedback: 0.5 });
		});
		const delaySlot1 = useSynthStore.getState().fxSlots[0] as Extract<
			FxSlotConfig,
			{ type: "delay" }
		>;
		expect(delaySlot1.params.feedback).toBe(0.5);

		act(() => {
			// Test setFxSlotEnabled on empty slot (should do nothing)
			setFxSlotEnabled(1, true);
		});
		expect(useSynthStore.getState().fxSlots[1].type).toBe("empty");

		act(() => {
			setFxSlotType(1, "reverb");
			reorderFxSlots(1, 0);
		});
		expect(useSynthStore.getState().fxSlots[0].type).toBe("reverb");
		expect(useSynthStore.getState().fxSlots[1].type).toBe("delay");

		act(() => {
			setFxSlotType(2, "grainDelay");
		});
		const manualGrainDelaySlot = useSynthStore.getState().fxSlots[2] as Extract<
			FxSlotConfig,
			{ type: "grainDelay" }
		>;
		expect(manualGrainDelaySlot.params.timeMode).toBe("hz");
		expect(manualGrainDelaySlot.params.syncDivision).toBe("quarter");
	});

	it("coerces modulation mode to normal when switching to a single line", () => {
		const { setLineSelect, setModMode } = useSynthStore.getState();

		act(() => {
			setLineSelect("L1+L2'");
			setModMode("noise");
			setLineSelect("L1");
		});

		const state = useSynthStore.getState();
		expect(state.lineSelect).toBe("L1");
		expect(state.modMode).toBe("normal");
	});

	it("rejects incompatible modulation modes on single-line selections", () => {
		const { setLineSelect, setModMode } = useSynthStore.getState();

		act(() => {
			setLineSelect("L2");
			setModMode("ring");
		});
		expect(useSynthStore.getState().modMode).toBe("normal");

		act(() => {
			setLineSelect("L1+L1'");
			setModMode("noise");
		});
		expect(useSynthStore.getState().modMode).toBe("noise");
	});

	it("normalizes incompatible modulation modes when applying presets", () => {
		const { applyPreset } = useSynthStore.getState();

		act(() => {
			applyPreset({
				schemaVersion: 1,
				params: {
					lineSelect: "L1",
					modMode: "noise",
					line1: {
						dcwBase: 0.2,
						algo: DEFAULT_ALGO_REF,
					},
					line2: {
						dcwBase: 0.4,
						algo: DEFAULT_ALGO_REF,
					},
					lfo: {
						waveform: "sine",
						rate: 2,
						rateMode: "sync",
						syncDivision: "quarter",
						depth: 1,
						symmetry: 0.5,
						retrigger: false,
						offset: 0,
					},
				},
			} as SynthPresetV1);
		});

		const state = useSynthStore.getState();
		expect(state.lineSelect).toBe("L1");
		expect(state.modMode).toBe("normal");
	});
});

// Helper to make act work with zustand in tests
function act(fn: () => void) {
	fn();
}
