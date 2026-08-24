import { describe, expect, it } from "vitest";
import type { RuntimeVoiceDebugState } from "@/features/synth/hooks/useAudioEngine";
import { useSynthStore } from "@/features/synth/synthStore";
import {
	buildWaterfallPreviewData,
	buildWaterfallPreviewHistories,
} from "./waterfallPreview";

describe("waterfallPreview", () => {
	it("builds fixed-size line histories for the waterfall preview", () => {
		const state = useSynthStore.getState();
		const phaseModSlot = state.fxSlots[4];
		const phaseModParams =
			phaseModSlot.type === "phaseMod" ? phaseModSlot.params : null;
		const histories = buildWaterfallPreviewHistories({
			line1DcwAmount: state.line1DcwAmount,
			line2DcwAmount: state.line2DcwAmount,
			warpAAlgo: state.warpAAlgo,
			warpBAlgo: state.warpBAlgo,
			algo2A: state.algo2A,
			algo2B: state.algo2B,
			algoBlendA: state.algoBlendA,
			algoBlendB: state.algoBlendB,
			windowType: state.windowType,
			line1Level: state.line1Level,
			line2Level: state.line2Level,
			line1DcwEnv: state.line1DcwEnv,
			line2DcwEnv: state.line2DcwEnv,
			line1DcaEnv: state.line1DcaEnv,
			line2DcaEnv: state.line2DcaEnv,
			line1BaseWaveformA: state.line1BaseWaveformA,
			line1BaseWaveformB: state.line1BaseWaveformB,
			line2BaseWaveformA: state.line2BaseWaveformA,
			line2BaseWaveformB: state.line2BaseWaveformB,
			line1AlgoControlsA: state.line1AlgoControlsA,
			line1AlgoControlsB: state.line1AlgoControlsB,
			line2AlgoControlsA: state.line2AlgoControlsA,
			line2AlgoControlsB: state.line2AlgoControlsB,
			intPmAmount: phaseModParams?.enabled ? (phaseModParams.amount ?? 0) : 0,
			intPmRatio: phaseModParams?.ratio ?? 1,
			pmPre: phaseModParams?.pmPre ?? true,
		});

		expect(histories.line1History).toHaveLength(42);
		expect(histories.line2History).toHaveLength(42);
		expect(histories.line1History[0]).toHaveLength(128);
		expect(histories.line2History[0]).toHaveLength(128);
	});

	it("maps runtime voices to active indicators and carries progress forward", () => {
		const state = useSynthStore.getState();
		const histories = {
			line1History: [new Array(8).fill(0), new Array(8).fill(0.25)],
			line2History: [new Array(8).fill(0), new Array(8).fill(0.5)],
		};
		const voices: RuntimeVoiceDebugState[] = [
			{
				index: 7,
				active: true,
				isReleasing: false,
				sustained: false,
				note: 60,
				envNote: 60,
				velocity: 100,
				modEnv: {
					value: 0,
					phase: "idle",
					releasing: false,
					releaseStart: 0,
				},
				line1: {
					dco: {
						value: 0,
						step: 0,
						releasing: false,
						stepPos: 0,
						prevLevel: 0,
					},
					dcw: {
						value: 0.5,
						step: 1,
						releasing: false,
						stepPos: 0,
						prevLevel: 0.2,
					},
					dca: {
						value: 0.8,
						step: 0,
						releasing: false,
						stepPos: 0,
						prevLevel: 0,
					},
				},
				line2: {
					dco: {
						value: 0,
						step: 0,
						releasing: false,
						stepPos: 0,
						prevLevel: 0,
					},
					dcw: {
						value: 0.35,
						step: 1,
						releasing: false,
						stepPos: 0,
						prevLevel: 0.1,
					},
					dca: {
						value: 0.7,
						step: 0,
						releasing: false,
						stepPos: 0,
						prevLevel: 0,
					},
				},
			},
		];

		const first = buildWaterfallPreviewData({
			histories,
			voices,
			line1DcwEnv: state.line1DcwEnv,
			line1Level: state.line1Level,
			line2DcwEnv: state.line2DcwEnv,
			line2Level: state.line2Level,
			line1ProgressByVoice: new Map(),
			line2ProgressByVoice: new Map(),
		});
		const second = buildWaterfallPreviewData({
			histories,
			voices: [
				{
					...voices[0],
					line1: {
						...voices[0].line1,
						dcw: { ...voices[0].line1.dcw, value: 0.25 },
					},
				},
			],
			line1DcwEnv: state.line1DcwEnv,
			line1Level: state.line1Level,
			line2DcwEnv: state.line2DcwEnv,
			line2Level: state.line2Level,
			line1ProgressByVoice: first.nextLine1ProgressByVoice,
			line2ProgressByVoice: first.nextLine2ProgressByVoice,
		});

		expect(first.preview.line1Indicators).toHaveLength(1);
		expect(first.preview.line2Indicators).toHaveLength(1);
		expect(first.preview.line1Indicators[0]?.progress).toBeGreaterThanOrEqual(
			0,
		);
		expect(first.preview.line1Indicators[0]?.strength).toBeGreaterThan(0);
		expect(second.preview.line1Indicators[0]?.progress).toBeGreaterThanOrEqual(
			first.preview.line1Indicators[0]?.progress ?? 0,
		);
	});

	it("returns no active indicators when histories are empty or no voices are active", () => {
		const state = useSynthStore.getState();
		const result = buildWaterfallPreviewData({
			histories: {
				line1History: [],
				line2History: [],
			},
			voices: [],
			line1DcwEnv: state.line1DcwEnv,
			line1Level: state.line1Level,
			line2DcwEnv: state.line2DcwEnv,
			line2Level: state.line2Level,
			line1ProgressByVoice: new Map(),
			line2ProgressByVoice: new Map(),
		});

		expect(result.preview.line1Indicators).toEqual([]);
		expect(result.preview.line2Indicators).toEqual([]);
		expect(result.nextLine1ProgressByVoice.size).toBe(0);
		expect(result.nextLine2ProgressByVoice.size).toBe(0);
	});
});
