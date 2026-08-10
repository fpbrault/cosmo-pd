import { beforeEach, describe, expect, it } from "vitest";
import { DEFAULT_ALGO_REF } from "@/lib/synth/algoRef";
import type {
	FxSlotConfig,
	ModDestination,
	SynthPresetV1,
} from "@/lib/synth/bindings/synth";
import { createDefaultModMatrixLayout } from "@/lib/synth/modMatrixModel";
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
		expect(state.line1SynthesisMethod).toBe("pd");
		expect(state.line2SynthesisMethod).toBe("pd");
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

	it("updates multiple algo controls against current state", () => {
		const { updateAlgoControlValue } = useSynthStore.getState();
		act(() => {
			updateAlgoControlValue(1, "A", "depth", 0.25);
			updateAlgoControlValue(1, "A", "feedback", 0.75);
		});

		expect(useSynthStore.getState().line1AlgoControlsA).toEqual(
			expect.arrayContaining([
				{ id: "depth", value: 0.25 },
				{ id: "feedback", value: 0.75 },
			]),
		);
	});

	it("applies scalar and concrete algo-control host UI patches", () => {
		act(() => {
			useSynthStore.getState().applyHostUiParamChanges([
				{ type: "scalar", key: "volume", value: 0.7 },
				{
					type: "algoControl",
					line: 1,
					section: "A",
					controlId: "depth",
					value: 0.72,
				},
			]);
		});

		expect(useSynthStore.getState().volume).toBe(0.7);
		expect(useSynthStore.getState().line1AlgoControlsA).toContainEqual({
			id: "depth",
			value: 0.72,
		});
	});

	it("coalesces repeated algo-control host UI patches in the store", () => {
		act(() => {
			useSynthStore.getState().applyHostUiParamChanges([
				{
					type: "algoControl",
					line: 2,
					section: "B",
					controlId: "feedback",
					value: 0.25,
				},
				{
					type: "algoControl",
					line: 2,
					section: "B",
					controlId: "feedback",
					value: 0.9,
				},
			]);
		});

		const matches = useSynthStore
			.getState()
			.line2AlgoControlsB.filter((entry) => entry.id === "feedback");
		expect(matches).toEqual([{ id: "feedback", value: 0.9 }]);
	});

	it("normalizes legacy algo-param modulation destinations when loading", () => {
		const preset = useSynthStore.getState().gatherState();
		preset.params.modMatrix = {
			routes: [
				{
					source: "lfo1",
					destination: "line1AlgoParam1" as ModDestination,
					amount: 0.5,
					enabled: true,
				},
			],
		};

		act(() => useSynthStore.getState().applyPreset(preset));

		expect(useSynthStore.getState().modMatrix.routes?.[0]?.destination).toBe(
			"line1AlgoControl1",
		);
		expect(
			useSynthStore.getState().gatherState().params.modMatrix?.routes?.[0]
				?.destination,
		).toBe("line1AlgoControl1");
	});

	it("clears a matrix cell when an external route is removed", () => {
		const route = {
			source: "lfo1" as const,
			destination: "volume" as const,
			amount: 0.5,
			enabled: true,
		};
		const layout = createDefaultModMatrixLayout([route]);

		act(() => {
			useSynthStore.getState().setModMatrix({
				routes: [route],
				layout,
			});
		});

		const populated = useSynthStore.getState().modMatrix;
		expect(populated.layout?.pages[0]?.cells?.[0]?.[0]).toEqual({
			amount: 0.5,
			enabled: true,
		});

		act(() => {
			useSynthStore.getState().setModMatrix({
				...populated,
				routes: [],
			});
		});

		const next = useSynthStore.getState().modMatrix;
		expect(next.routes).toEqual([]);
		expect(next.layout?.pages[0]?.cells?.[0]?.[0]).toBeNull();
	});

	it("gathers state into a preset structure", () => {
		const {
			setWarpAAmount,
			setTempoBpm,
			setLfoRateMode,
			setLfoSyncDivision,
			setRandomRateMode,
			setRandomSyncDivision,
			setCzDacEnabled,
			setPortamentoMode,
			setPortamentoRate,
			setPortamentoTime,
			setPitchBendRange,
			setVelocityCurve,
			gatherState,
			gatherPresetState,
		} = useSynthStore.getState();

		act(() => {
			setWarpAAmount(0.75);
			setTempoBpm(132);
			setLfoRateMode("sync");
			setLfoSyncDivision("eighth");
			setRandomRateMode("sync");
			setRandomSyncDivision("sixteenth");
			setCzDacEnabled(true);
			setPortamentoMode("rate");
			setPortamentoRate(42);
			setPortamentoTime(0.85);
			setPitchBendRange(12);
			setVelocityCurve(-0.3);
		});

		const preset = gatherState();
		expect(preset.params.line1.dcwBase).toBe(0.75);
		expect(preset.params.line1.synthesisMethod).toBe("pd");
		expect(preset.params.line2.synthesisMethod).toBe("pd");
		expect(preset.params.tempoBpm).toBe(132);
		expect(preset.params.lfo.rateMode).toBe("sync");
		expect(preset.params.lfo.syncDivision).toBe("eighth");
		expect(preset.params.random?.rateMode).toBe("sync");
		expect(preset.params.random?.syncDivision).toBe("sixteenth");
		expect(preset.params.czDacEnabled).toBe(true);
		expect(preset.params.portamento).toEqual({
			enabled: false,
			mode: "rate",
			rate: 42,
			time: 0.85,
		});
		expect(preset.params.pitchBendRange).toBe(12);
		expect(preset.params.velocityCurve).toBe(-0.3);
		expect(preset.schemaVersion).toBe(1);

		const presetState = gatherPresetState();
		expect(presetState.params.czDacEnabled).toBeUndefined();
		expect(presetState.params.portamento).toEqual(preset.params.portamento);
		expect(presetState.params.pitchBendRange).toBe(12);
		expect(presetState.params.velocityCurve).toBe(-0.3);
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
				random: {
					rate: 4,
					rateMode: "sync",
					syncDivision: "quarterTriplet",
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
		expect(state.randomRateMode).toBe("sync");
		expect(state.randomSyncDivision).toBe("quarterTriplet");
	});

	it("restores preset-specific voice settings when applying different presets", () => {
		const { applyPreset, gatherPresetState } = useSynthStore.getState();
		const basePreset = gatherPresetState();
		const presetA: SynthPresetV1 = {
			...basePreset,
			params: {
				...basePreset.params,
				portamento: {
					enabled: true,
					mode: "rate",
					rate: 12,
					time: 0.2,
				},
				pitchBendRange: 5,
				velocityCurve: -0.4,
			},
		};
		const presetB: SynthPresetV1 = {
			...basePreset,
			params: {
				...basePreset.params,
				portamento: {
					enabled: false,
					mode: "time",
					rate: 80,
					time: 1.5,
				},
				pitchBendRange: 14,
				velocityCurve: 0.65,
			},
		};

		act(() => applyPreset(presetA));
		expect(useSynthStore.getState().portamentoEnabled).toBe(true);
		expect(useSynthStore.getState().portamentoMode).toBe("rate");
		expect(useSynthStore.getState().portamentoRate).toBe(12);
		expect(useSynthStore.getState().portamentoTime).toBe(0.2);
		expect(useSynthStore.getState().pitchBendRange).toBe(5);
		expect(useSynthStore.getState().velocityCurve).toBe(-0.4);

		act(() => applyPreset(presetB));
		expect(useSynthStore.getState().portamentoEnabled).toBe(false);
		expect(useSynthStore.getState().portamentoMode).toBe("time");
		expect(useSynthStore.getState().portamentoRate).toBe(80);
		expect(useSynthStore.getState().portamentoTime).toBe(1.5);
		expect(useSynthStore.getState().pitchBendRange).toBe(14);
		expect(useSynthStore.getState().velocityCurve).toBe(0.65);
	});

	it("defaults missing legacy preset voice fields without crashing", () => {
		const { applyPreset, gatherPresetState } = useSynthStore.getState();
		const legacyPreset = gatherPresetState() as SynthPresetV1;
		delete (legacyPreset.params as Record<string, unknown>).portamento;
		delete (legacyPreset.params as Record<string, unknown>).pitchBendRange;
		delete (legacyPreset.params as Record<string, unknown>).velocityCurve;
		delete (legacyPreset.params.line1 as unknown as Record<string, unknown>)
			.synthesisMethod;
		delete (legacyPreset.params.line2 as unknown as Record<string, unknown>)
			.synthesisMethod;

		act(() => applyPreset(legacyPreset));

		const state = useSynthStore.getState();
		expect(state.portamentoEnabled).toBe(false);
		expect(state.portamentoMode).toBe("time");
		expect(state.portamentoRate).toBe(85);
		expect(state.portamentoTime).toBe(0.10000000149011612);
		expect(state.pitchBendRange).toBe(2);
		expect(state.velocityCurve).toBe(0);
		expect(state.line1SynthesisMethod).toBe("pd");
		expect(state.line2SynthesisMethod).toBe("pd");
		expect(state.gatherState().params.line1.synthesisMethod).toBe("pd");
		expect(state.gatherState().params.line2.synthesisMethod).toBe("pd");
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

	it("clamps all integer-backed setters with min/mid/max coverage", () => {
		const {
			setLineOctave,
			setLine2DetuneOctave,
			setLine2DetuneNote,
			setLine2DetuneFine,
			setLine1DcwKeyFollow,
			setLine1DcaKeyFollow,
			setLine2DcwKeyFollow,
			setLine2DcaKeyFollow,
			setOctave,
		} = useSynthStore.getState();

		act(() => {
			setLineOctave(99);
			setLine2DetuneOctave(-99);
			setLine2DetuneNote(99);
			setLine2DetuneFine(-99);
			setLine1DcwKeyFollow(99);
			setLine1DcaKeyFollow(-99);
			setLine2DcwKeyFollow(4);
			setLine2DcaKeyFollow(5);
			setOctave(99);
		});

		const state = useSynthStore.getState();
		expect(state.lineOctave).toBe(2);
		expect(state.line2DetuneOctave).toBe(-3);
		expect(state.line2DetuneNote).toBe(11);
		expect(state.line2DetuneFine).toBe(-60);
		expect(state.line1DcwKeyFollow).toBe(9);
		expect(state.line1DcaKeyFollow).toBe(0);
		expect(state.line2DcwKeyFollow).toBe(4);
		expect(state.line2DcaKeyFollow).toBe(5);
		expect(state.octave).toBe(2);
	});

	it("preserves ring/noise only on dual-line selections", () => {
		const { setLineSelect, setModMode } = useSynthStore.getState();
		const dualLineSelects = ["L1+L2'", "L1+L1'"] as const;
		const singleLineSelects = ["L1", "L2"] as const;
		const nonNormalModes = ["ring", "noise"] as const;

		for (const lineSelect of dualLineSelects) {
			for (const mode of nonNormalModes) {
				act(() => {
					setLineSelect(lineSelect);
					setModMode(mode);
				});
				expect(useSynthStore.getState().modMode).toBe(mode);
			}
		}

		for (const lineSelect of singleLineSelects) {
			for (const mode of nonNormalModes) {
				act(() => {
					setLineSelect(lineSelect);
					setModMode(mode);
				});
				expect(useSynthStore.getState().modMode).toBe("normal");
			}
		}
	});

	it("zeroes line2 detune in gatherState for single-line mode", () => {
		const {
			setLineSelect,
			setLine2DetuneNote,
			setLine2DetuneFine,
			setLine2DetuneOctave,
			gatherState,
		} = useSynthStore.getState();
		act(() => {
			setLine2DetuneNote(8);
			setLine2DetuneFine(30);
			setLine2DetuneOctave(2);
			setLineSelect("L1");
		});
		const singleLine = gatherState();
		expect(singleLine.params.line2.detuneNote).toBe(0);
		expect(singleLine.params.line2.detuneFine).toBe(0);

		act(() => {
			setLineSelect("L1+L2'");
		});
		const dualLine = gatherState();
		expect(dualLine.params.line2.detuneNote).toBe(8);
		expect(dualLine.params.line2.detuneFine).toBe(30);
	});

	it("updates macro labels by index", () => {
		const { setMacroLabel } = useSynthStore.getState();
		act(() => {
			setMacroLabel(0, "One");
			setMacroLabel(1, "");
			setMacroLabel(2, "Three");
			setMacroLabel(3, "Long Macro Label");
		});
		expect(useSynthStore.getState().macroLabels).toEqual([
			"One",
			"",
			"Three",
			"Long Macro Label",
		]);
	});
});

// Helper to make act work with zustand in tests
function act(fn: () => void) {
	fn();
}
