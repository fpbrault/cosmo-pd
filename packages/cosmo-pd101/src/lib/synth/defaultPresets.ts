import type { FrontendPresetV1 } from "@/lib/synth/presetTypes";

/**
 * Built-in factory presets for the CZ-101 PD synthesizer lab.
 * Converted to canonical SynthPresetV1 format.
 */
export const DEFAULT_SYNTH_PRESETS = {
	Bliss: {
		name: "Bliss",
		data: {
			schemaVersion: 1,
			params: {
				lineSelect: "L1",
				modMode: "normal",
				octave: 0,
				line1: {
					algo: "cz101",
					algo2: "cz101",
					algoBlend: 0,
					baseWaveformA: "cosine",
					baseWaveformB: "sine",
					window: "off",
					dcaBase: 1,
					dcwBase: 1,
					modulation: 0,
					detuneNote: 0,
					detuneFine: 4,
					octave: 0,
					dcoEnv: {
						steps: [
							{
								level: 0,
								rate: 99,
							},
							{
								level: 0,
								rate: 99,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
						],
						sustainStep: 0,
						stepCount: 2,
						loop: false,
					},
					dcwEnv: {
						steps: [
							{
								level: 99,
								rate: 71.56609348024641,
							},
							{
								level: 0,
								rate: 43.08371174676078,
							},
							{
								level: 60,
								rate: 36,
							},
							{
								level: 36,
								rate: 54,
							},
							{
								level: 73.53456436627125,
								rate: 40,
							},
							{
								level: 0,
								rate: 25.136015144501414,
							},
							{
								level: 99,
								rate: 99,
							},
							{
								level: 0,
								rate: 60,
							},
						],
						sustainStep: 0,
						stepCount: 2,
						loop: false,
					},
					dcaEnv: {
						steps: [
							{
								level: 99,
								rate: 73.72992729429083,
							},
							{
								level: 0,
								rate: 57.77175673137821,
							},
							{
								level: 0,
								rate: 1,
							},
							{
								level: 0,
								rate: 1,
							},
							{
								level: 99,
								rate: 99,
							},
							{
								level: 99,
								rate: 99,
							},
							{
								level: 99,
								rate: 99,
							},
							{
								level: 0,
								rate: 60,
							},
						],
						sustainStep: 0,
						stepCount: 2,
						loop: false,
					},
					keyFollow: 0,
					algoControlsA: [
						{
							id: "preset",
							value: 0,
						},
						{
							id: "waveform1",
							value: 0,
						},
						{
							id: "waveform2",
							value: 0,
						},
						{
							id: "windowFunction",
							value: 0,
						},
					],
					algoControlsB: [
						{
							id: "preset",
							value: 0,
						},
						{
							id: "waveform1",
							value: 0,
						},
						{
							id: "waveform2",
							value: 0,
						},
						{
							id: "windowFunction",
							value: 0,
						},
					],
				},
				line2: {
					algo: "pinch",
					algo2: "cz101",
					algoBlend: 0,
					baseWaveformA: "sine",
					baseWaveformB: "cosine",
					window: "off",
					dcaBase: 1,
					dcwBase: 0.7401758030482701,
					modulation: 0,
					detuneNote: 0,
					detuneFine: -2,
					octave: -1,
					dcoEnv: {
						steps: [
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
						],
						sustainStep: 0,
						stepCount: 8,
						loop: false,
					},
					dcwEnv: {
						steps: [
							{
								level: 99,
								rate: 79.70222689547708,
							},
							{
								level: 0,
								rate: 99,
							},
							{
								level: 0,
								rate: 99,
							},
							{
								level: 99,
								rate: 99,
							},
							{
								level: 99,
								rate: 99,
							},
							{
								level: 99,
								rate: 99,
							},
							{
								level: 99,
								rate: 99,
							},
							{
								level: 0,
								rate: 60,
							},
						],
						sustainStep: 0,
						stepCount: 2,
						loop: false,
					},
					dcaEnv: {
						steps: [
							{
								level: 99,
								rate: 91.8601169683252,
							},
							{
								level: 0,
								rate: 99,
							},
							{
								level: 99,
								rate: 99,
							},
							{
								level: 99,
								rate: 99,
							},
							{
								level: 99,
								rate: 99,
							},
							{
								level: 99,
								rate: 99,
							},
							{
								level: 99,
								rate: 99,
							},
							{
								level: 0,
								rate: 60,
							},
						],
						sustainStep: 0,
						stepCount: 2,
						loop: false,
					},
					keyFollow: 0,
					algoControlsA: [
						{
							id: "pinchFocus",
							value: 0.5,
						},
						{
							id: "pinchAsym",
							value: 0,
						},
						{
							id: "pinchCurve",
							value: 0.5,
						},
						{
							id: "pinchDrive",
							value: 0.5,
						},
					],
					algoControlsB: [
						{
							id: "preset",
							value: 0,
						},
						{
							id: "waveform1",
							value: 0,
						},
						{
							id: "waveform2",
							value: 0,
						},
						{
							id: "windowFunction",
							value: 0,
						},
					],
				},
				frequency: 440,
				volume: 1,
				polyMode: "poly8",
				legato: false,
				velocityCurve: 0,
				portamento: {
					enabled: false,
					mode: "rate",
					rate: 50,
					time: 0.5,
				},
				lfo: {
					waveform: "sine",
					rate: 5,
					depth: 0,
					symmetry: 0,
					retrigger: false,
					offset: 0,
				},
				lfo2: {
					waveform: "sine",
					rate: 5,
					depth: 0,
					symmetry: 0.5,
					retrigger: false,
					offset: 0,
				},
				random: {
					rate: 2,
				},
				modEnv: {
					attack: 0.01,
					decay: 0.1,
					sustain: 0.5,
					release: 0.2,
				},
				pitchBendRange: 2,
				modMatrix: {
					routes: [
						{
							source: "aftertouch",
							destination: "line2DcwBase",
							amount: 0.16921875,
							enabled: true,
						},
						{
							source: "modWheel",
							destination: "line2DcwBase",
							amount: 0.25101562499999996,
							enabled: true,
						},
						{
							source: "aftertouch",
							destination: "line1AlgoParam1",
							amount: 0.5,
							enabled: true,
						},
						{
							source: "modWheel",
							destination: "line1AlgoParam1",
							amount: 0.5,
							enabled: true,
						},
						{
							source: "modWheel",
							destination: "vibratoDepth",
							amount: 0.5,
							enabled: true,
						},
					],
				},
				fxSlots: [
					{
						type: "vibrato",
						params: {
							enabled: true,
							waveform: 1,
							rate: 63.58072225161961,
							depth: 0,
							delay: 0,
						},
					},
					{
						type: "chorus",
						params: {
							enabled: true,
							rate: 1.4,
							depth: 1,
							mix: 0.56,
						},
					},
					{
						type: "delay",
						params: {
							enabled: false,
							time: 0.11,
							feedback: 0.22,
							mix: 0.14310545785086495,
							tapeMode: false,
							warmth: 0.2,
						},
					},
					{
						type: "shimmerVerb",
						params: {
							enabled: false,
							shimmer: 0.4,
							space: 0.6546679530824934,
							mix: 0.3501562322889056,
						},
					},
					{
						type: "empty",
					},
					{
						type: "empty",
					},
				],
			},
		},
		favorite: false,
		category: "",
		tags: ["brass"],
	},
	Rise: {
		name: "Rise",
		data: {
			schemaVersion: 1,
			params: {
				lineSelect: "L1",
				modMode: "normal",
				octave: 0,
				line1: {
					algo: "pinch",
					algo2: "bend",
					algoBlend: 0.02,
					baseWaveformA: "sine",
					window: "off",
					dcaBase: 1,
					dcwBase: 0.48,
					modulation: 0,
					detuneNote: 0,
					detuneFine: 2,
					octave: 0,
					dcoEnv: {
						steps: [
							{
								level: 65.88556284963197,
								rate: 55.46804589714323,
							},
							{
								level: 99,
								rate: 52.93406211222921,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
						],
						sustainStep: 0,
						stepCount: 2,
						loop: false,
					},
					dcwEnv: {
						steps: [
							{
								level: 82.24705386560642,
								rate: 96,
							},
							{
								level: 35,
								rate: 31.613632171835228,
							},
							{
								level: 60,
								rate: 60.29947235277721,
							},
							{
								level: 36,
								rate: 67.9180079473768,
							},
							{
								level: 56,
								rate: 73.74490295701794,
							},
							{
								level: 0,
								rate: 52.49443305424282,
							},
							{
								level: 99,
								rate: 99,
							},
							{
								level: 0,
								rate: 60,
							},
						],
						sustainStep: 1,
						stepCount: 2,
						loop: false,
					},
					dcaEnv: {
						steps: [
							{
								level: 99,
								rate: 80.83521000745344,
							},
							{
								level: 0,
								rate: 33.92088296203741,
							},
							{
								level: 0,
								rate: 1,
							},
							{
								level: 0,
								rate: 1,
							},
							{
								level: 99,
								rate: 99,
							},
							{
								level: 99,
								rate: 99,
							},
							{
								level: 99,
								rate: 99,
							},
							{
								level: 0,
								rate: 60,
							},
						],
						sustainStep: 0,
						stepCount: 2,
						loop: false,
					},
					keyFollow: 0,
					algoControlsA: [
						{
							id: "pinchFocus",
							value: 0.5805859375,
						},
						{
							id: "pinchAsym",
							value: 0,
						},
						{
							id: "pinchCurve",
							value: 0.5,
						},
						{
							id: "pinchDrive",
							value: 0.5,
						},
					],
					algoControlsB: [
						{
							id: "bendCurve",
							value: 0.7766015625,
						},
						{
							id: "bendBias",
							value: 0,
						},
						{
							id: "bendKnee",
							value: 0.5,
						},
					],
				},
				line2: {
					algo: "cz101",
					algo2: null,
					algoBlend: 0,
					window: "off",
					dcaBase: 1,
					dcwBase: 0.46,
					modulation: 0,
					detuneNote: 0,
					detuneFine: 7,
					octave: -1,
					dcoEnv: {
						steps: [
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
						],
						sustainStep: 0,
						stepCount: 8,
						loop: false,
					},
					dcwEnv: {
						steps: [
							{
								level: 99,
								rate: 80,
							},
							{
								level: 99,
								rate: 99,
							},
							{
								level: 99,
								rate: 99,
							},
							{
								level: 99,
								rate: 99,
							},
							{
								level: 99,
								rate: 99,
							},
							{
								level: 99,
								rate: 99,
							},
							{
								level: 99,
								rate: 99,
							},
							{
								level: 0,
								rate: 60,
							},
						],
						sustainStep: 1,
						stepCount: 8,
						loop: false,
					},
					dcaEnv: {
						steps: [
							{
								level: 99,
								rate: 90,
							},
							{
								level: 99,
								rate: 99,
							},
							{
								level: 99,
								rate: 99,
							},
							{
								level: 99,
								rate: 99,
							},
							{
								level: 99,
								rate: 99,
							},
							{
								level: 99,
								rate: 99,
							},
							{
								level: 99,
								rate: 99,
							},
							{
								level: 0,
								rate: 60,
							},
						],
						sustainStep: 1,
						stepCount: 8,
						loop: false,
					},
					keyFollow: 0,
					algoControlsA: [],
					algoControlsB: [],
				},
				frequency: 440,
				volume: 1,
				polyMode: "poly8",
				legato: false,
				portamento: {
					enabled: false,
					mode: "time",
					rate: 50,
					time: 0.07835937500000001,
				},
				lfo: {
					waveform: "sine",
					rate: 0.2960938928382742,
					depth: 0.5879858062286132,
					symmetry: 0,
					retrigger: false,
					offset: 0,
				},
				lfo2: {
					waveform: "sine",
					rate: 5,
					depth: 0,
					symmetry: 0.5,
					retrigger: false,
					offset: 0,
				},
				random: {
					rate: 2,
				},
				modEnv: {
					attack: 0.01,
					decay: 0.1,
					sustain: 0.5,
					release: 0.2,
				},
				pitchBendRange: 2,
				modMatrix: {
					routes: [
						{
							source: "lfo1",
							destination: "line1DcwEnvStep1Level",
							amount: 0.31542968749999994,
							enabled: true,
						},
						{
							source: "modWheel",
							destination: "line1DcwBase",
							amount: 0.47890625,
							enabled: true,
						},
					],
				},
				fxSlots: [
					{
						type: "loFi",
						params: {
							enabled: false,
							degrade: 0.19531248637608117,
							wowDepth: 0.04247656685965401,
							wowRate: 0.78,
							flutterDepth: 0.009545559599014757,
							flutterRate: 9.2,
							tone: 0.4242187554495675,
							mix: 1,
						},
					},
					{
						type: "grainDelay",
						params: {
							enabled: true,
							time: 0.5968093669073922,
							feedback: 0.5377412213597978,
							scatter: 0.30899538104951113,
							density: 0.5996484313692365,
							mix: 0.2806640625,
						},
					},
					{
						type: "reverb",
						params: {
							enabled: true,
							mix: 0.47,
							space: 0.9,
							predelay: 0.03,
							distance: 0.68,
							character: 0.66,
						},
					},
					{
						type: "empty",
					},
					{
						type: "empty",
					},
					{
						type: "empty",
					},
				],
			},
		},
		favorite: false,
		category: "",
		tags: [],
	},

	Chops: {
		name: "Chops",
		data: {
			schemaVersion: 1,
			params: {
				lineSelect: "L1",
				modMode: "normal",
				octave: 0,
				line1: {
					algo: "pinch",
					algo2: "clip",
					algoBlend: 0.01,
					baseWaveformA: "sine",
					window: "off",
					dcaBase: 1,
					dcwBase: 0.72,
					modulation: 0,
					detuneNote: 0,
					detuneFine: 0,
					octave: 0,
					dcoEnv: {
						steps: [
							{
								level: 0,
								rate: 0,
							},
							{
								level: 0,
								rate: 0,
							},
							{
								level: 0,
								rate: 0,
							},
							{
								level: 0,
								rate: 0,
							},
							{
								level: 0,
								rate: 0,
							},
							{
								level: 0,
								rate: 0,
							},
							{
								level: 0,
								rate: 0,
							},
							{
								level: 0,
								rate: 0,
							},
						],
						sustainStep: 1,
						stepCount: 2,
						loop: false,
					},
					dcwEnv: {
						steps: [
							{
								level: 99,
								rate: 70,
							},
							{
								level: 0,
								rate: 93,
							},
							{
								level: 99,
								rate: 75,
							},
							{
								level: 0,
								rate: 43.50560852665987,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
						],
						sustainStep: 2,
						stepCount: 4,
						loop: true,
					},
					dcaEnv: {
						steps: [
							{
								level: 99,
								rate: 75,
							},
							{
								level: 79,
								rate: 80,
							},
							{
								level: 96.32340910418979,
								rate: 75,
							},
							{
								level: 0,
								rate: 40,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
						],
						sustainStep: 2,
						stepCount: 4,
						loop: false,
					},
					keyFollow: 0,
					algoControlsA: [
						{
							id: "pinchFocus",
							value: 0.5,
						},
						{
							id: "pinchAsym",
							value: 0,
						},
						{
							id: "pinchCurve",
							value: 0.5,
						},
						{
							id: "pinchDrive",
							value: 0.5,
						},
					],
					algoControlsB: [
						{
							id: "clipDrive",
							value: 0.5,
						},
						{
							id: "clipShape",
							value: 0.5,
						},
						{
							id: "clipBias",
							value: 0,
						},
						{
							id: "clipSoft",
							value: 0,
						},
					],
				},
				line2: {
					algo: "cz101",
					algo2: null,
					algoBlend: 0,
					window: "off",
					dcaBase: 1,
					dcwBase: 1,
					modulation: 0,
					detuneNote: 0,
					detuneFine: 0,
					octave: 0,
					dcoEnv: {
						steps: [
							{
								level: 0,
								rate: 0,
							},
							{
								level: 0,
								rate: 0,
							},
							{
								level: 0,
								rate: 0,
							},
							{
								level: 0,
								rate: 0,
							},
							{
								level: 0,
								rate: 0,
							},
							{
								level: 0,
								rate: 0,
							},
							{
								level: 0,
								rate: 0,
							},
							{
								level: 0,
								rate: 0,
							},
						],
						sustainStep: 1,
						stepCount: 2,
						loop: false,
					},
					dcwEnv: {
						steps: [
							{
								level: 99,
								rate: 75,
							},
							{
								level: 99,
								rate: 80,
							},
							{
								level: 99,
								rate: 75,
							},
							{
								level: 0,
								rate: 40,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
						],
						sustainStep: 2,
						stepCount: 4,
						loop: false,
					},
					dcaEnv: {
						steps: [
							{
								level: 99,
								rate: 75,
							},
							{
								level: 79,
								rate: 80,
							},
							{
								level: 79,
								rate: 75,
							},
							{
								level: 0,
								rate: 40,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
						],
						sustainStep: 2,
						stepCount: 4,
						loop: false,
					},
					keyFollow: 0,
					algoControlsA: [],
					algoControlsB: [],
				},
				frequency: 440,
				volume: 1,
				polyMode: "poly8",
				legato: false,
				portamento: {
					enabled: false,
					mode: "time",
					rate: 50,
					time: 0.1,
				},
				lfo: {
					waveform: "sine",
					rate: 0.0842864172799247,
					depth: 0.6907139641898019,
					symmetry: 0.5,
					retrigger: true,
					offset: 0.059453230265841456,
				},
				lfo2: {
					waveform: "sine",
					rate: 5,
					depth: 0,
					symmetry: 0.5,
					retrigger: false,
					offset: 0,
				},
				random: {
					rate: 2,
				},
				modEnv: {
					attack: 1.1107421193804057,
					decay: 2.215937523841858,
					sustain: 0.903105457850865,
					release: 2.761523483480726,
				},
				pitchBendRange: 2,
				modMatrix: {
					routes: [
						{
							source: "velocity",
							destination: "line1DcwBase",
							amount: 0.4791015625000001,
							enabled: true,
						},
						{
							source: "lfo1",
							destination: "line1DcwEnvStep4Rate",
							amount: 0.23492187500000003,
							enabled: true,
						},
					],
				},
				fxSlots: [
					{
						type: "chorus",
						params: {
							enabled: true,
							rate: 1.8,
							depth: 2.6,
							mix: 0.25855467932564874,
						},
					},
					{
						type: "phaser",
						params: {
							enabled: true,
							rate: 0.35,
							depth: 0.45,
							mix: 0.25,
							feedback: 0.2,
						},
					},
					{
						type: "empty",
					},
					{
						type: "delay",
						params: {
							enabled: true,
							time: 0.34,
							feedback: 0.46,
							mix: 0.35,
							tapeMode: true,
							warmth: 0.72,
						},
					},
					{
						type: "reverb",
						params: {
							enabled: true,
							mix: 0.47,
							space: 0.8229687554495675,
							predelay: 0.03,
							distance: 0.68,
							character: 0.2902343913487026,
						},
					},
					{
						type: "compressor",
						params: {
							enabled: false,
							thresholdDb: -12,
							ratio: 4,
							attackMs: 5,
							releaseMs: 100,
							makeupDb: 6,
							mix: 1,
						},
					},
				],
			},
		},
		favorite: false,
		category: "",
		tags: ["pad"],
	},

	Organ: {
		name: "Organ",
		data: {
			schemaVersion: 1,
			params: {
				lineSelect: "L1+L2'",
				modMode: "normal",
				octave: 0,
				line1: {
					algo: "fold",
					algo2: null,
					algoBlend: 0,
					baseWaveformA: "cosine",
					window: "off",
					dcaBase: 1,
					dcwBase: 0.75,
					modulation: 0,
					detuneNote: 0,
					detuneFine: 0,
					octave: 0,
					dcoEnv: {
						steps: [
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
						],
						sustainStep: 1,
						stepCount: 4,
						loop: false,
					},
					dcwEnv: {
						steps: [
							{
								level: 99,
								rate: 99,
							},
							{
								level: 99,
								rate: 99,
							},
							{
								level: 99,
								rate: 99,
							},
							{
								level: 99,
								rate: 99,
							},
							{
								level: 99,
								rate: 99,
							},
							{
								level: 99,
								rate: 99,
							},
							{
								level: 99,
								rate: 99,
							},
							{
								level: 22,
								rate: 60,
							},
						],
						sustainStep: 1,
						stepCount: 3,
						loop: false,
					},
					dcaEnv: {
						steps: [
							{
								level: 99,
								rate: 90,
							},
							{
								level: 99,
								rate: 99,
							},
							{
								level: 99,
								rate: 79,
							},
							{
								level: 99,
								rate: 99,
							},
							{
								level: 99,
								rate: 99,
							},
							{
								level: 99,
								rate: 99,
							},
							{
								level: 99,
								rate: 99,
							},
							{
								level: 0,
								rate: 71,
							},
						],
						sustainStep: 1,
						stepCount: 3,
						loop: false,
					},
					keyFollow: 0,
					algoControlsA: [
						{
							id: "foldStages",
							value: 0.10796875,
						},
						{
							id: "foldTilt",
							value: -0.0414453125,
						},
						{
							id: "foldSymmetry",
							value: 0,
						},
						{
							id: "foldSoftness",
							value: 0,
						},
					],
					algoControlsB: [],
				},
				line2: {
					algo: "cz101",
					algo2: null,
					algoBlend: 0,
					window: "off",
					dcaBase: 1,
					dcwBase: 1,
					modulation: 0,
					detuneNote: 0,
					detuneFine: 0,
					octave: 0,
					dcoEnv: {
						steps: [
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
						],
						sustainStep: 1,
						stepCount: 4,
						loop: false,
					},
					dcwEnv: {
						steps: [
							{
								level: 99,
								rate: 99,
							},
							{
								level: 99,
								rate: 99,
							},
							{
								level: 99,
								rate: 99,
							},
							{
								level: 99,
								rate: 99,
							},
							{
								level: 99,
								rate: 99,
							},
							{
								level: 99,
								rate: 99,
							},
							{
								level: 99,
								rate: 99,
							},
							{
								level: 22,
								rate: 60,
							},
						],
						sustainStep: 1,
						stepCount: 3,
						loop: false,
					},
					dcaEnv: {
						steps: [
							{
								level: 99,
								rate: 90,
							},
							{
								level: 99,
								rate: 99,
							},
							{
								level: 99,
								rate: 79,
							},
							{
								level: 99,
								rate: 99,
							},
							{
								level: 99,
								rate: 99,
							},
							{
								level: 99,
								rate: 99,
							},
							{
								level: 99,
								rate: 99,
							},
							{
								level: 0,
								rate: 71,
							},
						],
						sustainStep: 1,
						stepCount: 3,
						loop: false,
					},
					keyFollow: 0,
					algoControlsA: [],
					algoControlsB: [],
				},
				frequency: 440,
				volume: 1,
				polyMode: "poly8",
				legato: false,
				portamento: {
					enabled: false,
					mode: "rate",
					rate: 50,
					time: 0.5,
				},
				lfo: {
					waveform: "sine",
					rate: 0,
					depth: 0.6303515570504326,
					symmetry: 0,
					retrigger: false,
					offset: 0,
				},
				lfo2: {
					waveform: "sine",
					rate: 5,
					depth: 0,
					symmetry: 0.5,
					retrigger: false,
					offset: 0,
				},
				random: {
					rate: 2,
				},
				modEnv: {
					attack: 0.01,
					decay: 0.1,
					sustain: 0.5,
					release: 0.2,
				},
				pitchBendRange: 2,
				modMatrix: {
					routes: [
						{
							source: "lfo1",
							destination: "line1AlgoParam2",
							amount: 0.5,
							enabled: true,
						},
					],
				},
				fxSlots: [
					{
						type: "chorus",
						params: {
							rate: 0.35,
							depth: 2.1,
							mix: 0.44,
							enabled: false,
						},
					},
					{
						type: "loFi",
						params: {
							enabled: true,
							degrade: 0.11404295733996804,
							wowDepth: 0.09126952716282438,
							wowRate: 0.35452518437589914,
							flutterDepth: 0.03783202852521624,
							flutterRate: 1.271337699890136,
							tone: 0.30539062363760816,
							mix: 1,
						},
					},
					{
						type: "delay",
						params: {
							time: 0.34,
							feedback: 0.46,
							mix: 0.07347656726837153,
							enabled: true,
							tapeMode: true,
							warmth: 0.72,
						},
					},
					{
						type: "empty",
					},
					{
						type: "shimmerVerb",
						params: {
							enabled: true,
							shimmer: 0.9263281277247838,
							space: 0.8459179741995675,
							mix: 0.18874998092651363,
						},
					},
					{
						type: "empty",
					},
				],
			},
		},
		favorite: false,
		category: "",
		tags: [],
	},

	Wow: {
		name: "Wow",
		data: {
			schemaVersion: 1,
			params: {
				lineSelect: "L1+L2'",
				modMode: "normal",
				octave: 0,
				line1: {
					algo: "sync",
					algo2: "cz101",
					algoBlend: 0.015,
					baseWaveformA: "sine",
					window: "off",
					dcaBase: 1,
					dcwBase: 0.89,
					modulation: 0,
					detuneNote: 0,
					detuneFine: 2,
					octave: -1,
					dcoEnv: {
						steps: [
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
						],
						sustainStep: 0,
						stepCount: 2,
						loop: false,
					},
					dcwEnv: {
						steps: [
							{
								level: 74,
								rate: 63.842206963811606,
							},
							{
								level: 31.5436719424384,
								rate: 50.0181642142364,
							},
							{
								level: 34.4707422886576,
								rate: 27.053632812500002,
							},
							{
								level: 0,
								rate: 14,
							},
							{
								level: 99,
								rate: 99,
							},
							{
								level: 74,
								rate: 99,
							},
							{
								level: 99,
								rate: 99,
							},
							{
								level: 0,
								rate: 60,
							},
						],
						sustainStep: 1,
						stepCount: 3,
						loop: false,
					},
					dcaEnv: {
						steps: [
							{
								level: 99,
								rate: 70.6149802664348,
							},
							{
								level: 99,
								rate: 48,
							},
							{
								level: 99,
								rate: 24,
							},
							{
								level: 0,
								rate: 59.82193096365246,
							},
							{
								level: 99,
								rate: 99,
							},
							{
								level: 99,
								rate: 99,
							},
							{
								level: 99,
								rate: 99,
							},
							{
								level: 0,
								rate: 60,
							},
						],
						sustainStep: 2,
						stepCount: 4,
						loop: false,
					},
					keyFollow: 0,
					algoControlsA: [
						{
							id: "syncRatio",
							value: 0.5,
						},
						{
							id: "syncPhase",
							value: 0,
						},
						{
							id: "syncCurve",
							value: 0.5,
						},
						{
							id: "syncWindow",
							value: 0.5,
						},
					],
					algoControlsB: [],
				},
				line2: {
					algo: "cz101",
					algo2: "cz101",
					algoBlend: 0,
					window: "off",
					dcaBase: 0.78,
					dcwBase: 1,
					modulation: 0,
					detuneNote: 0,
					detuneFine: 0,
					octave: -1,
					dcoEnv: {
						steps: [
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
						],
						sustainStep: 0,
						stepCount: 2,
						loop: false,
					},
					dcwEnv: {
						steps: [
							{
								level: 74.79544790510138,
								rate: 99,
							},
							{
								level: 32,
								rate: 29,
							},
							{
								level: 25,
								rate: 8,
							},
							{
								level: 0,
								rate: 14,
							},
							{
								level: 99,
								rate: 99,
							},
							{
								level: 74,
								rate: 99,
							},
							{
								level: 99,
								rate: 99,
							},
							{
								level: 0,
								rate: 60,
							},
						],
						sustainStep: 0,
						stepCount: 2,
						loop: false,
					},
					dcaEnv: {
						steps: [
							{
								level: 99,
								rate: 99,
							},
							{
								level: 99,
								rate: 48,
							},
							{
								level: 99,
								rate: 24,
							},
							{
								level: 0,
								rate: 42,
							},
							{
								level: 99,
								rate: 99,
							},
							{
								level: 99,
								rate: 99,
							},
							{
								level: 99,
								rate: 99,
							},
							{
								level: 0,
								rate: 60,
							},
						],
						sustainStep: 0,
						stepCount: 2,
						loop: false,
					},
					keyFollow: 0,
					algoControlsA: [],
					algoControlsB: [],
				},
				frequency: 440,
				volume: 1,
				polyMode: "poly8",
				legato: false,
				portamento: {
					enabled: false,
					mode: "time",
					rate: 50,
					time: 0.07703125,
				},
				lfo: {
					waveform: "sine",
					rate: 5,
					depth: 0,
					symmetry: 0,
					retrigger: false,
					offset: 0,
				},
				lfo2: {
					waveform: "sine",
					rate: 5,
					depth: 0,
					symmetry: 0.5,
					retrigger: false,
					offset: 0,
				},
				random: {
					rate: 2,
				},
				modEnv: {
					attack: 0.01,
					decay: 0.1,
					sustain: 0.5,
					release: 0.2,
				},
				pitchBendRange: 2,
				modMatrix: {
					routes: [],
				},
				fxSlots: [
					{
						type: "phaseMod",
						params: {
							enabled: false,
							amount: 0.06,
							ratio: 2,
							pmPre: true,
						},
					},
					{
						type: "wavefolder",
						params: {
							enabled: false,
							drive: 0.3,
							folds: 0.3,
							mix: 0.8,
						},
					},
					{
						type: "bitcrusher",
						params: {
							enabled: false,
							bits: 5.8501951694488525,
							rateReduction: 7.623811336988834,
							mix: 1,
						},
					},
					{
						type: "delay",
						params: {
							enabled: false,
							time: 0.34,
							feedback: 0.46,
							mix: 0.35,
							tapeMode: true,
							warmth: 0.72,
						},
					},
					{
						type: "compressor",
						params: {
							enabled: false,
							thresholdDb: -27.676170894077845,
							ratio: 4,
							attackMs: 5,
							releaseMs: 100,
							makeupDb: 6,
							mix: 1,
						},
					},
					{
						type: "empty",
					},
				],
			},
		},
		favorite: false,
		category: "",
		tags: [],
	},

	"Solo Lead": {
		name: "Solo Lead",
		data: {
			schemaVersion: 1,
			params: {
				lineSelect: "L1",
				modMode: "normal",
				octave: 0,
				line1: {
					algo: "cz101",
					algo2: "skew",
					algoBlend: 0,
					baseWaveformA: "cosine",
					baseWaveformB: "sine",
					window: "off",
					dcaBase: 1,
					dcwBase: 1,
					modulation: 0,
					detuneNote: 0,
					detuneFine: 0,
					octave: 0,
					dcoEnv: {
						steps: [
							{
								level: 0,
								rate: 99,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
						],
						sustainStep: 0,
						stepCount: 1,
						loop: false,
					},
					dcwEnv: {
						steps: [
							{
								level: 81.47138659568323,
								rate: 99,
							},
							{
								level: 0,
								rate: 99,
							},
							{
								level: 48,
								rate: 19,
							},
							{
								level: 42,
								rate: 50,
							},
							{
								level: 0,
								rate: 22,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
						],
						sustainStep: 0,
						stepCount: 2,
						loop: false,
					},
					dcaEnv: {
						steps: [
							{
								level: 99,
								rate: 99,
							},
							{
								level: 0,
								rate: 99,
							},
							{
								level: 88,
								rate: 34,
							},
							{
								level: 89,
								rate: 17,
							},
							{
								level: 0,
								rate: 66,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
						],
						sustainStep: 0,
						stepCount: 2,
						loop: false,
					},
					keyFollow: 8,
					algoControlsA: [
						{
							id: "preset",
							value: 0,
						},
						{
							id: "waveform1",
							value: 3,
						},
						{
							id: "waveform2",
							value: 0,
						},
						{
							id: "windowFunction",
							value: 0,
						},
					],
					algoControlsB: [
						{
							id: "skewBias",
							value: 0.37171875,
						},
						{
							id: "skewCurve",
							value: 0.5,
						},
						{
							id: "skewSpread",
							value: 0,
						},
						{
							id: "skewTilt",
							value: 0,
						},
					],
				},
				line2: {
					algo: "cz101",
					algo2: "cz101",
					algoBlend: 0,
					baseWaveformA: "cosine",
					baseWaveformB: "cosine",
					window: "off",
					dcaBase: 1,
					dcwBase: 1,
					modulation: 0,
					detuneNote: 0,
					detuneFine: 0,
					octave: 0,
					dcoEnv: {
						steps: [
							{
								level: 49,
								rate: 99,
							},
							{
								level: 2,
								rate: 99,
							},
							{
								level: 12,
								rate: 92,
							},
							{
								level: 0,
								rate: 99,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
						],
						sustainStep: 7,
						stepCount: 8,
						loop: false,
					},
					dcwEnv: {
						steps: [
							{
								level: 49,
								rate: 40,
							},
							{
								level: 0,
								rate: 12,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
						],
						sustainStep: 1,
						stepCount: 2,
						loop: false,
					},
					dcaEnv: {
						steps: [
							{
								level: 99,
								rate: 99,
							},
							{
								level: 53,
								rate: 27,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
						],
						sustainStep: 1,
						stepCount: 2,
						loop: false,
					},
					keyFollow: 0,
					algoControlsA: [
						{
							id: "preset",
							value: 0,
						},
						{
							id: "waveform1",
							value: 0,
						},
						{
							id: "waveform2",
							value: 0,
						},
						{
							id: "windowFunction",
							value: 0,
						},
					],
					algoControlsB: [
						{
							id: "preset",
							value: 0,
						},
						{
							id: "waveform1",
							value: 0,
						},
						{
							id: "waveform2",
							value: 0,
						},
						{
							id: "windowFunction",
							value: 0,
						},
					],
				},
				frequency: 440,
				volume: 1,
				polyMode: "mono",
				legato: false,
				velocityCurve: 0,
				portamento: {
					enabled: true,
					mode: "time",
					rate: 0,
					time: 0.06121093205043249,
				},
				lfo: {
					waveform: "sine",
					rate: 5,
					depth: 0.9863473661174851,
					symmetry: 0.5,
					retrigger: false,
					offset: 0,
				},
				lfo2: {
					waveform: "sine",
					rate: 5,
					depth: 0,
					symmetry: 0.5,
					retrigger: false,
					offset: 0,
				},
				random: {
					rate: 2,
				},
				modEnv: {
					attack: 0.009999999776482582,
					decay: 0.10000000149011612,
					sustain: 0.5,
					release: 0.20000000298023224,
				},
				pitchBendRange: 2,
				modMatrix: {
					routes: [
						{
							source: "modWheel",
							destination: "vibratoDepth",
							amount: 0.29500000817435135,
							enabled: true,
						},
						{
							source: "aftertouch",
							destination: "vibratoDepth",
							amount: 0.15902344839913507,
							enabled: true,
						},
					],
				},
				fxSlots: [
					{
						type: "vibrato",
						params: {
							enabled: true,
							waveform: 1,
							rate: 50,
							depth: 0,
							delay: 38,
						},
					},
					{
						type: "empty",
					},
					{
						type: "empty",
					},
					{
						type: "empty",
					},
					{
						type: "empty",
					},
					{
						type: "empty",
					},
				],
			},
		},
		favorite: false,
		category: "",
		tags: [],
	},

	"Soft Piano": {
		name: "Soft Piano",
		data: {
			schemaVersion: 1,
			params: {
				lineSelect: "L1",
				modMode: "normal",
				octave: 0,
				line1: {
					algo: "bend",
					algo2: null,
					algoBlend: 0,
					baseWaveformA: "sine",
					baseWaveformB: "sine",
					window: "off",
					dcaBase: 1,
					dcwBase: 1,
					modulation: 0,
					detuneNote: 0,
					detuneFine: 4,
					octave: -1,
					dcoEnv: {
						steps: [
							{
								level: 66,
								rate: 66.58999432787647,
							},
							{
								level: 0,
								rate: 0,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
						],
						sustainStep: 0,
						stepCount: 2,
						loop: false,
					},
					dcwEnv: {
						steps: [
							{
								level: 39.686217780115726,
								rate: 46.352693693978445,
							},
							{
								level: 6.961862177801157,
								rate: 39.36474609374999,
							},
							{
								level: 31.61178327196212,
								rate: 22.141931257400913,
							},
							{
								level: 15.770647027880063,
								rate: 35.00730387823922,
							},
							{
								level: 37.40121349830703,
								rate: 54.60285102299281,
							},
							{
								level: 0,
								rate: 18.418708298972675,
							},
							{
								level: 99,
								rate: 99,
							},
							{
								level: 0,
								rate: 60,
							},
						],
						sustainStep: 4,
						stepCount: 6,
						loop: false,
					},
					dcaEnv: {
						steps: [
							{
								level: 99,
								rate: 71.95722740547998,
							},
							{
								level: 0,
								rate: 45.029375267646145,
							},
							{
								level: 0,
								rate: 1,
							},
							{
								level: 0,
								rate: 1,
							},
							{
								level: 99,
								rate: 99,
							},
							{
								level: 99,
								rate: 99,
							},
							{
								level: 99,
								rate: 99,
							},
							{
								level: 0,
								rate: 60,
							},
						],
						sustainStep: 0,
						stepCount: 2,
						loop: false,
					},
					keyFollow: 0,
					algoControlsA: [
						{
							id: "bendCurve",
							value: 0.5,
						},
						{
							id: "bendBias",
							value: 0,
						},
						{
							id: "bendKnee",
							value: 0.5,
						},
					],
					algoControlsB: [],
				},
				line2: {
					algo: "cz101",
					algo2: null,
					algoBlend: 0,
					baseWaveformA: "cosine",
					baseWaveformB: "cosine",
					window: "off",
					dcaBase: 1,
					dcwBase: 0.6900000000000001,
					modulation: 0,
					detuneNote: 0,
					detuneFine: -2,
					octave: -1,
					dcoEnv: {
						steps: [
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
						],
						sustainStep: 0,
						stepCount: 8,
						loop: false,
					},
					dcwEnv: {
						steps: [
							{
								level: 99,
								rate: 88.6122268954771,
							},
							{
								level: 99,
								rate: 99,
							},
							{
								level: 99,
								rate: 99,
							},
							{
								level: 99,
								rate: 99,
							},
							{
								level: 99,
								rate: 99,
							},
							{
								level: 99,
								rate: 99,
							},
							{
								level: 99,
								rate: 99,
							},
							{
								level: 0,
								rate: 60,
							},
						],
						sustainStep: 1,
						stepCount: 8,
						loop: false,
					},
					dcaEnv: {
						steps: [
							{
								level: 99,
								rate: 91.8601169683252,
							},
							{
								level: 99,
								rate: 99,
							},
							{
								level: 99,
								rate: 99,
							},
							{
								level: 99,
								rate: 99,
							},
							{
								level: 99,
								rate: 99,
							},
							{
								level: 99,
								rate: 99,
							},
							{
								level: 99,
								rate: 99,
							},
							{
								level: 0,
								rate: 60,
							},
						],
						sustainStep: 1,
						stepCount: 8,
						loop: false,
					},
					keyFollow: 0,
					algoControlsA: [
						{
							id: "preset",
							value: 0,
						},
						{
							id: "waveform1",
							value: 0,
						},
						{
							id: "waveform2",
							value: 0,
						},
						{
							id: "windowFunction",
							value: 0,
						},
					],
					algoControlsB: [],
				},
				frequency: 440,
				volume: 1,
				polyMode: "poly8",
				legato: false,
				velocityCurve: 0,
				portamento: {
					enabled: false,
					mode: "rate",
					rate: 50,
					time: 0.5,
				},
				lfo: {
					waveform: "sine",
					rate: 5,
					depth: 0,
					symmetry: 0,
					retrigger: false,
					offset: 0,
				},
				lfo2: {
					waveform: "sine",
					rate: 5,
					depth: 0,
					symmetry: 0.5,
					retrigger: false,
					offset: 0,
				},
				random: {
					rate: 2,
				},
				modEnv: {
					attack: 0.01,
					decay: 0.1,
					sustain: 0.5,
					release: 0.2,
				},
				pitchBendRange: 2,
				modMatrix: {
					routes: [
						{
							source: "aftertouch",
							destination: "line2DcwBase",
							amount: 0.16921875,
							enabled: true,
						},
						{
							source: "modWheel",
							destination: "line2DcwBase",
							amount: 0.25101562499999996,
							enabled: true,
						},
						{
							source: "aftertouch",
							destination: "line1AlgoParam1",
							amount: 0.5,
							enabled: true,
						},
						{
							source: "modWheel",
							destination: "line1AlgoParam1",
							amount: 0.5,
							enabled: true,
						},
						{
							source: "modWheel",
							destination: "vibratoDepth",
							amount: 0.5,
							enabled: true,
						},
					],
				},
				fxSlots: [
					{
						type: "junoChorus",
						params: {
							enabled: true,
							mode: 0,
							mix: 0.5159961019243513,
						},
					},
					{
						type: "vibrato",
						params: {
							enabled: true,
							waveform: 1,
							rate: 63.58072225161961,
							depth: 0,
							delay: 0,
						},
					},
					{
						type: "delay",
						params: {
							enabled: true,
							time: 0.48704979153701233,
							feedback: 0.46,
							mix: 0.13208983148847306,
							tapeMode: true,
							warmth: 0.3037695503234863,
						},
					},
					{
						type: "shimmerVerb",
						params: {
							enabled: true,
							shimmer: 0.4,
							space: 0.3778320040021623,
							mix: 0.1837890352521624,
						},
					},
					{
						type: "empty",
					},
					{
						type: "empty",
					},
				],
			},
		},
		favorite: false,
		category: "",
		tags: [],
	},

	Plucking: {
		name: "Plucking",
		data: {
			schemaVersion: 1,
			params: {
				lineSelect: "L2",
				modMode: "normal",
				octave: 0,
				line1: {
					algo: "bend",
					algo2: null,
					algoBlend: 0,
					baseWaveformA: "sine",
					window: "off",
					dcaBase: 1,
					dcwBase: 1,
					modulation: 0,
					detuneNote: 0,
					detuneFine: 2,
					octave: -1,
					dcoEnv: {
						steps: [
							{
								level: 99,
								rate: 66,
							},
							{
								level: 99,
								rate: 45,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
						],
						sustainStep: 0,
						stepCount: 2,
						loop: false,
					},
					dcwEnv: {
						steps: [
							{
								level: 99,
								rate: 58,
							},
							{
								level: 35,
								rate: 68,
							},
							{
								level: 60,
								rate: 36,
							},
							{
								level: 36,
								rate: 54,
							},
							{
								level: 56,
								rate: 22,
							},
							{
								level: 17,
								rate: 26,
							},
							{
								level: 99,
								rate: 99,
							},
							{
								level: 0,
								rate: 60,
							},
						],
						sustainStep: 4,
						stepCount: 6,
						loop: false,
					},
					dcaEnv: {
						steps: [
							{
								level: 99,
								rate: 78.93185641288757,
							},
							{
								level: 0,
								rate: 32,
							},
							{
								level: 0,
								rate: 1,
							},
							{
								level: 0,
								rate: 1,
							},
							{
								level: 99,
								rate: 99,
							},
							{
								level: 99,
								rate: 99,
							},
							{
								level: 99,
								rate: 99,
							},
							{
								level: 0,
								rate: 60,
							},
						],
						sustainStep: 0,
						stepCount: 2,
						loop: false,
					},
					keyFollow: 0,
					algoControlsA: [
						{
							id: "bendCurve",
							value: 0.5,
						},
						{
							id: "bendBias",
							value: 0,
						},
						{
							id: "bendKnee",
							value: 0.5,
						},
					],
					algoControlsB: [],
				},
				line2: {
					algo: "pinch",
					algo2: "fold",
					algoBlend: 0.51,
					window: "off",
					dcaBase: 1,
					dcwBase: 1,
					modulation: 0,
					detuneNote: 0,
					detuneFine: 7,
					octave: 0,
					dcoEnv: {
						steps: [
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
						],
						sustainStep: 0,
						stepCount: 8,
						loop: false,
					},
					dcwEnv: {
						steps: [
							{
								level: 90.29830629378068,
								rate: 92.11834018094198,
							},
							{
								level: 16.18022863215627,
								rate: 71.54490326681308,
							},
							{
								level: 29,
								rate: 86.88091736180442,
							},
							{
								level: 99,
								rate: 99,
							},
							{
								level: 99,
								rate: 99,
							},
							{
								level: 99,
								rate: 99,
							},
							{
								level: 99,
								rate: 99,
							},
							{
								level: 44,
								rate: 60,
							},
						],
						sustainStep: 1,
						stepCount: 3,
						loop: false,
					},
					dcaEnv: {
						steps: [
							{
								level: 99,
								rate: 99,
							},
							{
								level: 87,
								rate: 55.823535223688395,
							},
							{
								level: 0,
								rate: 23,
							},
							{
								level: 99,
								rate: 99,
							},
							{
								level: 99,
								rate: 99,
							},
							{
								level: 99,
								rate: 99,
							},
							{
								level: 99,
								rate: 99,
							},
							{
								level: 0,
								rate: 60,
							},
						],
						sustainStep: 0,
						stepCount: 2,
						loop: false,
					},
					keyFollow: 0,
					algoControlsA: [
						{
							id: "pinchFocus",
							value: 0.30029296875,
						},
						{
							id: "pinchAsym",
							value: 0.3230078125,
						},
						{
							id: "pinchCurve",
							value: 0.63693359375,
						},
						{
							id: "pinchDrive",
							value: 0.68103515625,
						},
					],
					algoControlsB: [
						{
							id: "foldStages",
							value: 0.5,
						},
						{
							id: "foldTilt",
							value: 0,
						},
						{
							id: "foldSymmetry",
							value: -0.070390625,
						},
						{
							id: "foldSoftness",
							value: 0.304453125,
						},
					],
				},
				frequency: 440,
				volume: 1,
				polyMode: "poly8",
				legato: false,
				portamento: {
					enabled: false,
					mode: "rate",
					rate: 50,
					time: 0.5,
				},
				lfo: {
					waveform: "triangle",
					rate: 0.5260120738636367,
					depth: 0.8219549005681819,
					symmetry: 0,
					retrigger: false,
					offset: 0,
				},
				lfo2: {
					waveform: "sine",
					rate: 5,
					depth: 0,
					symmetry: 0.5,
					retrigger: false,
					offset: 0,
				},
				random: {
					rate: 2,
				},
				modEnv: {
					attack: 0.01,
					decay: 0.1,
					sustain: 0.5,
					release: 0.2,
				},
				pitchBendRange: 2,
				modMatrix: {
					routes: [
						{
							source: "modWheel",
							destination: "vibratoDepth",
							amount: 0.5,
							enabled: true,
						},
					],
				},
				fxSlots: [
					{
						type: "vibrato",
						params: {
							enabled: true,
							waveform: 1,
							rate: 61.60513708966119,
							depth: 0,
							delay: 160,
						},
					},
					{
						type: "chorus",
						params: {
							enabled: false,
							rate: 1.8,
							depth: 2.6,
							mix: 0.56,
						},
					},
					{
						type: "delay",
						params: {
							enabled: false,
							time: 0.11,
							feedback: 0.22,
							mix: 0.15787109647478376,
							tapeMode: false,
							warmth: 0.2,
						},
					},
					{
						type: "reverb",
						params: {
							enabled: true,
							mix: 0.31,
							space: 0.58,
							predelay: 0.012,
							distance: 0.4,
							character: 0.74,
						},
					},
					{
						type: "empty",
					},
					{
						type: "empty",
					},
				],
			},
		},
		favorite: false,
		category: "",
		tags: ["strings", "piano"],
	},

	Clav: {
		name: "Clav",
		data: {
			schemaVersion: 1,
			params: {
				lineSelect: "L1",
				modMode: "normal",
				octave: 0,
				line1: {
					algo: "cz101",
					algo2: null,
					algoBlend: 0,
					baseWaveformA: "cosine",
					baseWaveformB: "cosine",
					window: "off",
					dcaBase: 1,
					dcwBase: 0.71,
					modulation: 0,
					detuneNote: 0,
					detuneFine: 0,
					octave: 0,
					dcoEnv: {
						steps: [
							{
								level: 0,
								rate: 99,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
						],
						sustainStep: 0,
						stepCount: 1,
						loop: false,
					},
					dcwEnv: {
						steps: [
							{
								level: 99,
								rate: 99,
							},
							{
								level: 0,
								rate: 62.94154259783881,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
						],
						sustainStep: 0,
						stepCount: 2,
						loop: false,
					},
					dcaEnv: {
						steps: [
							{
								level: 97.80541109098348,
								rate: 99,
							},
							{
								level: 99,
								rate: 54.54716837338039,
							},
							{
								level: 0,
								rate: 33,
							},
							{
								level: 0,
								rate: 60,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
						],
						sustainStep: 0,
						stepCount: 2,
						loop: false,
					},
					keyFollow: 9,
					algoControlsA: [],
					algoControlsB: [],
				},
				line2: {
					algo: "twist",
					algo2: "cz101",
					algoBlend: 0,
					window: "off",
					dcaBase: 1,
					dcwBase: 1,
					modulation: 0,
					detuneNote: 0,
					detuneFine: 0,
					octave: -1,
					dcoEnv: {
						steps: [
							{
								level: 0,
								rate: 99,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
						],
						sustainStep: 0,
						stepCount: 1,
						loop: false,
					},
					dcwEnv: {
						steps: [
							{
								level: 40,
								rate: 99,
							},
							{
								level: 0,
								rate: 99,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
						],
						sustainStep: 0,
						stepCount: 2,
						loop: false,
					},
					dcaEnv: {
						steps: [
							{
								level: 99,
								rate: 99,
							},
							{
								level: 76,
								rate: 99,
							},
							{
								level: 0,
								rate: 38,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
						],
						sustainStep: 0,
						stepCount: 2,
						loop: false,
					},
					keyFollow: 9,
					algoControlsA: [
						{
							id: "twistHarmonics",
							value: 0.5,
						},
						{
							id: "twistDepth",
							value: 0.5,
						},
						{
							id: "twistPhase",
							value: 0,
						},
						{
							id: "twistShape",
							value: 0.5,
						},
					],
					algoControlsB: [],
				},
				frequency: 440,
				volume: 1,
				polyMode: "poly8",
				legato: false,
				portamento: {
					enabled: false,
					mode: "rate",
					rate: 50,
					time: 0.5,
				},
				lfo: {
					waveform: "sine",
					rate: 5,
					depth: 0,
					symmetry: 0,
					retrigger: false,
					offset: 0,
				},
				lfo2: {
					waveform: "sine",
					rate: 5,
					depth: 0,
					symmetry: 0.5,
					retrigger: false,
					offset: 0,
				},
				random: {
					rate: 2,
				},
				modEnv: {
					attack: 0.01,
					decay: 0.1,
					sustain: 0.5,
					release: 0.2,
				},
				pitchBendRange: 2,
				modMatrix: {
					routes: [
						{
							source: "velocity",
							destination: "line1DcwBase",
							amount: 0.2666015625,
							enabled: true,
						},
					],
				},
				fxSlots: [
					{
						type: "phaser",
						params: {
							enabled: true,
							rate: 0.5,
							depth: 1,
							mix: 0.5,
							feedback: 0.5,
						},
					},
					{
						type: "tremolo",
						params: {
							enabled: true,
							rate: 5,
							depth: 0.6,
							waveform: 1,
							mix: 1,
						},
					},
					{
						type: "compressor",
						params: {
							enabled: true,
							thresholdDb: -23.66249983651297,
							ratio: 4,
							attackMs: 5,
							releaseMs: 100,
							makeupDb: 6,
							mix: 1,
						},
					},
					{
						type: "empty",
					},
					{
						type: "empty",
					},
					{
						type: "empty",
					},
				],
			},
		},
		favorite: false,
		category: "",
		tags: ["piano"],
	},

	Chants: {
		name: "Chants",
		data: {
			schemaVersion: 1,
			params: {
				lineSelect: "L1+L2'",
				modMode: "normal",
				octave: 0,
				line1: {
					algo: "pinch",
					algo2: "cz101",
					algoBlend: 0,
					baseWaveformA: "triangle",
					baseWaveformB: "cosine",
					window: "off",
					dcaBase: 1,
					dcwBase: 0.96,
					modulation: 0,
					detuneNote: 0,
					detuneFine: 0,
					octave: -1,
					dcoEnv: {
						steps: [
							{
								level: 66,
								rate: 71.19031217966761,
							},
							{
								level: 0,
								rate: 68.67300895895276,
							},
							{
								level: 0,
								rate: 51,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
						],
						sustainStep: 0,
						stepCount: 3,
						loop: false,
					},
					dcwEnv: {
						steps: [
							{
								level: 99,
								rate: 55.64109415463039,
							},
							{
								level: 99,
								rate: 99,
							},
							{
								level: 99,
								rate: 99,
							},
							{
								level: 99,
								rate: 99,
							},
							{
								level: 99,
								rate: 99,
							},
							{
								level: 99,
								rate: 99,
							},
							{
								level: 99,
								rate: 99,
							},
							{
								level: 0,
								rate: 60,
							},
						],
						sustainStep: 0,
						stepCount: 2,
						loop: false,
					},
					dcaEnv: {
						steps: [
							{
								level: 70,
								rate: 90,
							},
							{
								level: 99,
								rate: 99,
							},
							{
								level: 99,
								rate: 99,
							},
							{
								level: 99,
								rate: 99,
							},
							{
								level: 99,
								rate: 99,
							},
							{
								level: 99,
								rate: 99,
							},
							{
								level: 99,
								rate: 99,
							},
							{
								level: 0,
								rate: 60,
							},
						],
						sustainStep: 1,
						stepCount: 3,
						loop: false,
					},
					keyFollow: 0,
					algoControlsA: [
						{
							id: "pinchFocus",
							value: 0.34845703124999994,
						},
						{
							id: "pinchAsym",
							value: -0.0677343749999999,
						},
						{
							id: "pinchCurve",
							value: 0.4052343749999999,
						},
						{
							id: "pinchDrive",
							value: 0.58357421875,
						},
					],
					algoControlsB: [
						{
							id: "preset",
							value: 0,
						},
						{
							id: "waveform1",
							value: 0,
						},
						{
							id: "waveform2",
							value: 0,
						},
						{
							id: "windowFunction",
							value: 0,
						},
					],
				},
				line2: {
					algo: "pinch",
					algo2: "cz101",
					algoBlend: 0,
					baseWaveformA: "sine",
					baseWaveformB: "cosine",
					window: "off",
					dcaBase: 1,
					dcwBase: 1,
					modulation: 0,
					detuneNote: 0,
					detuneFine: 4,
					octave: -1,
					dcoEnv: {
						steps: [
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
						],
						sustainStep: 0,
						stepCount: 8,
						loop: false,
					},
					dcwEnv: {
						steps: [
							{
								level: 99,
								rate: 60.78638725825718,
							},
							{
								level: 99,
								rate: 20.641115607874738,
							},
							{
								level: 99,
								rate: 26.13058656130518,
							},
							{
								level: 99,
								rate: 99,
							},
							{
								level: 99,
								rate: 99,
							},
							{
								level: 99,
								rate: 99,
							},
							{
								level: 99,
								rate: 99,
							},
							{
								level: 0,
								rate: 60,
							},
						],
						sustainStep: 0,
						stepCount: 2,
						loop: false,
					},
					dcaEnv: {
						steps: [
							{
								level: 99,
								rate: 90,
							},
							{
								level: 90.78222609043122,
								rate: 49.09781306690404,
							},
							{
								level: 99,
								rate: 99,
							},
							{
								level: 99,
								rate: 99,
							},
							{
								level: 99,
								rate: 99,
							},
							{
								level: 99,
								rate: 99,
							},
							{
								level: 99,
								rate: 99,
							},
							{
								level: 0,
								rate: 60,
							},
						],
						sustainStep: 0,
						stepCount: 2,
						loop: false,
					},
					keyFollow: 0,
					algoControlsA: [
						{
							id: "pinchFocus",
							value: 0.5,
						},
						{
							id: "pinchAsym",
							value: 0,
						},
						{
							id: "pinchCurve",
							value: 0.5,
						},
						{
							id: "pinchDrive",
							value: 0.5,
						},
					],
					algoControlsB: [
						{
							id: "preset",
							value: 0,
						},
						{
							id: "waveform1",
							value: 0,
						},
						{
							id: "waveform2",
							value: 0,
						},
						{
							id: "windowFunction",
							value: 0,
						},
					],
				},
				frequency: 440,
				volume: 1,
				polyMode: "poly8",
				legato: false,
				velocityCurve: 0,
				portamento: {
					enabled: false,
					mode: "rate",
					rate: 50,
					time: 0.5,
				},
				lfo: {
					waveform: "sine",
					rate: 0.12460306874216127,
					depth: 0.7686718561819622,
					symmetry: 0,
					retrigger: false,
					offset: 0,
				},
				lfo2: {
					waveform: "sine",
					rate: 5,
					depth: 0,
					symmetry: 0.5,
					retrigger: false,
					offset: 0,
				},
				random: {
					rate: 2,
				},
				modEnv: {
					attack: 0.01,
					decay: 0.1,
					sustain: 0.5,
					release: 0.2,
				},
				pitchBendRange: 2,
				modMatrix: {
					routes: [
						{
							source: "lfo1",
							destination: "line1AlgoParam3",
							amount: 0.21906247820172986,
							enabled: true,
						},
						{
							source: "lfo1",
							destination: "line1AlgoParam2",
							amount: 0.5,
							enabled: true,
						},
					],
				},
				fxSlots: [
					{
						type: "chorus",
						params: {
							enabled: true,
							rate: 0.9,
							depth: 1.2,
							mix: 0.38,
						},
					},
					{
						type: "delay",
						params: {
							enabled: true,
							time: 0.11,
							feedback: 0.4798222628853151,
							mix: 0.13208983148847298,
							tapeMode: false,
							warmth: 0.2,
						},
					},
					{
						type: "vibrato",
						params: {
							enabled: false,
							waveform: 1,
							rate: 30,
							depth: 30,
							delay: 0,
						},
					},
					{
						type: "empty",
					},
					{
						type: "empty",
					},
					{
						type: "empty",
					},
				],
			},
		},
		favorite: false,
		category: "",
		tags: ["brass"],
	},

	"Bright Changes": {
		name: "Bright Changes",
		data: {
			schemaVersion: 1,
			params: {
				lineSelect: "L1+L2'",
				modMode: "normal",
				octave: 0,
				line1: {
					algo: "twist",
					algo2: "bend",
					algoBlend: 0.55732421875,
					baseWaveformA: "sine",
					window: "off",
					dcaBase: 1,
					dcwBase: 1,
					modulation: 0,
					detuneNote: 0,
					detuneFine: 0,
					octave: -1,
					dcoEnv: {
						steps: [
							{
								level: 0,
								rate: 99,
							},
							{
								level: 86,
								rate: 27,
							},
							{
								level: 0,
								rate: 99,
							},
							{
								level: 0,
								rate: 21,
							},
							{
								level: 99,
								rate: 99,
							},
							{
								level: 71,
								rate: 15,
							},
							{
								level: 0,
								rate: 99,
							},
							{
								level: 0,
								rate: 17,
							},
						],
						sustainStep: 7,
						stepCount: 1,
						loop: false,
					},
					dcwEnv: {
						steps: [
							{
								level: 99,
								rate: 59.895293710572375,
							},
							{
								level: 21,
								rate: 50.44029249668121,
							},
							{
								level: 82,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 56,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
						],
						sustainStep: 0,
						stepCount: 4,
						loop: false,
					},
					dcaEnv: {
						steps: [
							{
								level: 99,
								rate: 87.09269527878081,
							},
							{
								level: 79,
								rate: 80,
							},
							{
								level: 99,
								rate: 79,
							},
							{
								level: 0,
								rate: 35,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
						],
						sustainStep: 2,
						stepCount: 4,
						loop: false,
					},
					keyFollow: 8,
					algoControlsA: [
						{
							id: "twistHarmonics",
							value: 0.64541015625,
						},
						{
							id: "twistDepth",
							value: 0.5,
						},
						{
							id: "twistPhase",
							value: 0,
						},
						{
							id: "twistShape",
							value: 0.5,
						},
					],
					algoControlsB: [
						{
							id: "bendCurve",
							value: 0.5,
						},
						{
							id: "bendBias",
							value: 0,
						},
						{
							id: "bendKnee",
							value: 0.5,
						},
					],
				},
				line2: {
					algo: "fold",
					algo2: "skew",
					algoBlend: 0.55732421875,
					window: "off",
					dcaBase: 1,
					dcwBase: 1,
					modulation: 0,
					detuneNote: 0,
					detuneFine: 3,
					octave: 0,
					dcoEnv: {
						steps: [
							{
								level: 0,
								rate: 99,
							},
							{
								level: 86,
								rate: 27,
							},
							{
								level: 0,
								rate: 99,
							},
							{
								level: 0,
								rate: 21,
							},
							{
								level: 99,
								rate: 99,
							},
							{
								level: 71,
								rate: 15,
							},
							{
								level: 0,
								rate: 99,
							},
							{
								level: 0,
								rate: 17,
							},
						],
						sustainStep: 7,
						stepCount: 1,
						loop: false,
					},
					dcwEnv: {
						steps: [
							{
								level: 99,
								rate: 60,
							},
							{
								level: 21,
								rate: 50,
							},
							{
								level: 82,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 56,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
						],
						sustainStep: 0,
						stepCount: 4,
						loop: false,
					},
					dcaEnv: {
						steps: [
							{
								level: 99,
								rate: 75,
							},
							{
								level: 79,
								rate: 80,
							},
							{
								level: 99,
								rate: 76,
							},
							{
								level: 0,
								rate: 39.68896504606519,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
						],
						sustainStep: 2,
						stepCount: 4,
						loop: false,
					},
					keyFollow: 9,
					algoControlsA: [
						{
							id: "foldStages",
							value: 0.5,
						},
						{
							id: "foldTilt",
							value: 0,
						},
						{
							id: "foldSymmetry",
							value: 0,
						},
						{
							id: "foldSoftness",
							value: 0,
						},
					],
					algoControlsB: [
						{
							id: "skewBias",
							value: 0.2,
						},
						{
							id: "skewCurve",
							value: 0.5,
						},
						{
							id: "skewSpread",
							value: 0,
						},
						{
							id: "skewTilt",
							value: 0,
						},
					],
				},
				frequency: 440,
				volume: 1,
				polyMode: "poly8",
				legato: false,
				portamento: {
					enabled: false,
					mode: "rate",
					rate: 50,
					time: 0.5,
				},
				lfo: {
					waveform: "sine",
					rate: 5,
					depth: 0,
					symmetry: 0,
					retrigger: false,
					offset: 0,
				},
				lfo2: {
					waveform: "sine",
					rate: 5,
					depth: 0,
					symmetry: 0.5,
					retrigger: false,
					offset: 0,
				},
				random: {
					rate: 2,
				},
				modEnv: {
					attack: 0.01,
					decay: 0.1,
					sustain: 0.5,
					release: 0.2,
				},
				pitchBendRange: 2,
				modMatrix: {
					routes: [
						{
							source: "modWheel",
							destination: "vibratoDepth",
							amount: 0.5,
							enabled: true,
						},
					],
				},
				fxSlots: [
					{
						type: "vibrato",
						params: {
							enabled: true,
							waveform: 1,
							rate: 64.35500038777079,
							depth: 0,
							delay: 0,
						},
					},
					{
						type: "chorus",
						params: {
							enabled: false,
							rate: 1.1257715511322022,
							depth: 2.2394140686307633,
							mix: 0.56,
						},
					},
					{
						type: "delay",
						params: {
							enabled: false,
							time: 0.11,
							feedback: 0.22,
							mix: 0.27,
							tapeMode: false,
							warmth: 0.2,
						},
					},
					{
						type: "empty",
					},
					{
						type: "empty",
					},
					{
						type: "empty",
					},
				],
			},
		},
		favorite: false,
		category: "",
		tags: ["pad"],
	},

	"Thick Bass": {
		name: "Thick Bass",
		data: {
			schemaVersion: 1,
			params: {
				lineSelect: "L1+L1'",
				modMode: "normal",
				octave: 0,
				line1: {
					algo: "cz101",
					algo2: "cz101",
					algoBlend: 0,
					baseWaveformA: "saw",
					baseWaveformB: "cosine",
					window: "off",
					dcaBase: 1,
					dcwBase: 1,
					modulation: 0,
					detuneNote: 0,
					detuneFine: 0,
					octave: -2,
					dcoEnv: {
						steps: [
							{
								level: 0,
								rate: 99,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
						],
						sustainStep: 0,
						stepCount: 1,
						loop: false,
					},
					dcwEnv: {
						steps: [
							{
								level: 99,
								rate: 99,
							},
							{
								level: 0,
								rate: 82.29181586674282,
							},
							{
								level: 42.416096791162545,
								rate: 53,
							},
							{
								level: 0,
								rate: 52,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
						],
						sustainStep: 2,
						stepCount: 4,
						loop: false,
					},
					dcaEnv: {
						steps: [
							{
								level: 99,
								rate: 99,
							},
							{
								level: 0,
								rate: 21,
							},
							{
								level: 0,
								rate: 61,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
						],
						sustainStep: 1,
						stepCount: 3,
						loop: false,
					},
					keyFollow: 7,
					algoControlsA: [
						{
							id: "preset",
							value: 0,
						},
						{
							id: "waveform1",
							value: 1,
						},
						{
							id: "waveform2",
							value: 2,
						},
						{
							id: "windowFunction",
							value: 0,
						},
					],
					algoControlsB: [
						{
							id: "preset",
							value: 0,
						},
						{
							id: "waveform1",
							value: 2,
						},
						{
							id: "waveform2",
							value: 0,
						},
						{
							id: "windowFunction",
							value: 0,
						},
					],
				},
				line2: {
					algo: "cz101",
					algo2: "cz101",
					algoBlend: 0,
					baseWaveformA: "cosine",
					baseWaveformB: "cosine",
					window: "off",
					dcaBase: 1,
					dcwBase: 1,
					modulation: 0,
					detuneNote: 0,
					detuneFine: 0,
					octave: -1,
					dcoEnv: {
						steps: [
							{
								level: 0,
								rate: 99,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
						],
						sustainStep: 0,
						stepCount: 1,
						loop: false,
					},
					dcwEnv: {
						steps: [
							{
								level: 99,
								rate: 97,
							},
							{
								level: 79,
								rate: 43,
							},
							{
								level: 74,
								rate: 50,
							},
							{
								level: 0,
								rate: 52,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
						],
						sustainStep: 2,
						stepCount: 4,
						loop: false,
					},
					dcaEnv: {
						steps: [
							{
								level: 99,
								rate: 99,
							},
							{
								level: 0,
								rate: 21,
							},
							{
								level: 0,
								rate: 61,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
						],
						sustainStep: 1,
						stepCount: 3,
						loop: false,
					},
					keyFollow: 7,
					algoControlsA: [
						{
							id: "preset",
							value: 0,
						},
						{
							id: "waveform1",
							value: 1,
						},
						{
							id: "waveform2",
							value: 2,
						},
						{
							id: "windowFunction",
							value: 0,
						},
					],
					algoControlsB: [
						{
							id: "preset",
							value: 0,
						},
						{
							id: "waveform1",
							value: 2,
						},
						{
							id: "waveform2",
							value: 0,
						},
						{
							id: "windowFunction",
							value: 0,
						},
					],
				},
				frequency: 440,
				volume: 1,
				polyMode: "mono",
				legato: false,
				velocityCurve: 0,
				portamento: {
					enabled: true,
					mode: "time",
					rate: 0,
					time: 0.10404297964913502,
				},
				lfo: {
					waveform: "sine",
					rate: 5,
					depth: 1,
					symmetry: 0.5,
					retrigger: false,
					offset: 0,
				},
				lfo2: {
					waveform: "sine",
					rate: 5,
					depth: 0,
					symmetry: 0.5,
					retrigger: false,
					offset: 0,
				},
				random: {
					rate: 2,
				},
				modEnv: {
					attack: 0.009999999776482582,
					decay: 0.10000000149011612,
					sustain: 0.5,
					release: 0.20000000298023224,
				},
				pitchBendRange: 2,
				modMatrix: {
					routes: [],
				},
				fxSlots: [
					{
						type: "empty",
					},
					{
						type: "empty",
					},
					{
						type: "empty",
					},
					{
						type: "vibrato",
						params: {
							enabled: true,
							waveform: 1,
							rate: 46,
							depth: 16,
							delay: 60,
						},
					},
					{
						type: "empty",
					},
					{
						type: "empty",
					},
				],
			},
		},
		favorite: false,
		category: "",
		tags: [],
	},

	"Synth Bass": {
		name: "Synth Bass",
		data: {
			schemaVersion: 1,
			params: {
				lineSelect: "L1+L1'",
				modMode: "ring",
				octave: 0,
				line1: {
					algo: "cz101",
					algo2: "cz101",
					algoBlend: 0,
					baseWaveformA: "cosine",
					baseWaveformB: "cosine",
					window: "off",
					dcaBase: 1,
					dcwBase: 1,
					modulation: 0,
					detuneNote: 0,
					detuneFine: 0,
					octave: -2,
					dcoEnv: {
						steps: [
							{
								level: 0,
								rate: 99,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
						],
						sustainStep: 0,
						stepCount: 1,
						loop: false,
					},
					dcwEnv: {
						steps: [
							{
								level: 99,
								rate: 99,
							},
							{
								level: 79,
								rate: 45,
							},
							{
								level: 15,
								rate: 50,
							},
							{
								level: 0,
								rate: 52,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
						],
						sustainStep: 2,
						stepCount: 4,
						loop: false,
					},
					dcaEnv: {
						steps: [
							{
								level: 99,
								rate: 99,
							},
							{
								level: 0,
								rate: 21,
							},
							{
								level: 0,
								rate: 61,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
						],
						sustainStep: 1,
						stepCount: 3,
						loop: false,
					},
					keyFollow: 7,
					algoControlsA: [
						{
							id: "preset",
							value: 0,
						},
						{
							id: "waveform1",
							value: 5,
						},
						{
							id: "waveform2",
							value: 2,
						},
						{
							id: "windowFunction",
							value: 0,
						},
					],
					algoControlsB: [
						{
							id: "preset",
							value: 0,
						},
						{
							id: "waveform1",
							value: 2,
						},
						{
							id: "waveform2",
							value: 0,
						},
						{
							id: "windowFunction",
							value: 0,
						},
					],
				},
				line2: {
					algo: "cz101",
					algo2: "cz101",
					algoBlend: 0,
					baseWaveformA: "cosine",
					baseWaveformB: "cosine",
					window: "off",
					dcaBase: 1,
					dcwBase: 1,
					modulation: 0,
					detuneNote: 0,
					detuneFine: 0,
					octave: -1,
					dcoEnv: {
						steps: [
							{
								level: 0,
								rate: 99,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
						],
						sustainStep: 0,
						stepCount: 1,
						loop: false,
					},
					dcwEnv: {
						steps: [
							{
								level: 99,
								rate: 97,
							},
							{
								level: 79,
								rate: 43,
							},
							{
								level: 74,
								rate: 50,
							},
							{
								level: 0,
								rate: 52,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
						],
						sustainStep: 2,
						stepCount: 4,
						loop: false,
					},
					dcaEnv: {
						steps: [
							{
								level: 99,
								rate: 99,
							},
							{
								level: 0,
								rate: 21,
							},
							{
								level: 0,
								rate: 61,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
						],
						sustainStep: 1,
						stepCount: 3,
						loop: false,
					},
					keyFollow: 7,
					algoControlsA: [
						{
							id: "preset",
							value: 0,
						},
						{
							id: "waveform1",
							value: 1,
						},
						{
							id: "waveform2",
							value: 2,
						},
						{
							id: "windowFunction",
							value: 0,
						},
					],
					algoControlsB: [
						{
							id: "preset",
							value: 0,
						},
						{
							id: "waveform1",
							value: 2,
						},
						{
							id: "waveform2",
							value: 0,
						},
						{
							id: "windowFunction",
							value: 0,
						},
					],
				},
				frequency: 440,
				volume: 1,
				polyMode: "poly8",
				legato: false,
				velocityCurve: 0,
				portamento: {
					enabled: false,
					mode: "rate",
					rate: 0,
					time: 0.5,
				},
				lfo: {
					waveform: "sine",
					rate: 5,
					depth: 1,
					symmetry: 0.5,
					retrigger: false,
					offset: 0,
				},
				lfo2: {
					waveform: "sine",
					rate: 5,
					depth: 0,
					symmetry: 0.5,
					retrigger: false,
					offset: 0,
				},
				random: {
					rate: 2,
				},
				modEnv: {
					attack: 0.009999999776482582,
					decay: 0.10000000149011612,
					sustain: 0.5,
					release: 0.20000000298023224,
				},
				pitchBendRange: 2,
				modMatrix: {
					routes: [],
				},
				fxSlots: [
					{
						type: "empty",
					},
					{
						type: "empty",
					},
					{
						type: "empty",
					},
					{
						type: "vibrato",
						params: {
							enabled: true,
							waveform: 1,
							rate: 46,
							depth: 16,
							delay: 60,
						},
					},
					{
						type: "empty",
					},
					{
						type: "empty",
					},
				],
			},
		},
		favorite: false,
		category: "",
		tags: [],
	},
	"Waxy Pad": {
		name: "Waxy Pad",
		data: {
			schemaVersion: 1,
			params: {
				lineSelect: "L1+L2'",
				modMode: "ring",
				octave: 0,
				line1: {
					algo: "cz101",
					algo2: "cz101",
					algoBlend: 0,
					baseWaveformA: "cosine",
					baseWaveformB: "cosine",
					window: "off",
					dcaBase: 1,
					dcwBase: 1,
					modulation: 0,
					detuneNote: 0,
					detuneFine: 0,
					octave: 0,
					dcoEnv: {
						steps: [
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
						],
						sustainStep: 1,
						stepCount: 2,
						loop: false,
					},
					dcwEnv: {
						steps: [
							{
								level: 84,
								rate: 99,
							},
							{
								level: 0,
								rate: 24,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
						],
						sustainStep: 0,
						stepCount: 2,
						loop: false,
					},
					dcaEnv: {
						steps: [
							{
								level: 99,
								rate: 99,
							},
							{
								level: 0,
								rate: 33,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
						],
						sustainStep: 0,
						stepCount: 8,
						loop: false,
					},
					keyFollow: 0,
					algoControlsA: [
						{
							id: "preset",
							value: 0,
						},
						{
							id: "waveform1",
							value: 2,
						},
						{
							id: "waveform2",
							value: 5,
						},
						{
							id: "windowFunction",
							value: 0,
						},
					],
					algoControlsB: [
						{
							id: "preset",
							value: 4,
						},
						{
							id: "waveform1",
							value: 5,
						},
						{
							id: "waveform2",
							value: 5,
						},
						{
							id: "windowFunction",
							value: 0,
						},
					],
				},
				line2: {
					algo: "cz101",
					algo2: null,
					algoBlend: 0,
					baseWaveformA: "cosine",
					baseWaveformB: "cosine",
					window: "off",
					dcaBase: 1,
					dcwBase: 1,
					modulation: 0,
					detuneNote: 0,
					detuneFine: 0,
					octave: 0,
					dcoEnv: {
						steps: [
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
						],
						sustainStep: 1,
						stepCount: 2,
						loop: false,
					},
					dcwEnv: {
						steps: [
							{
								level: 84,
								rate: 99,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
						],
						sustainStep: 0,
						stepCount: 2,
						loop: false,
					},
					dcaEnv: {
						steps: [
							{
								level: 99,
								rate: 99,
							},
							{
								level: 0,
								rate: 33,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
						],
						sustainStep: 0,
						stepCount: 8,
						loop: false,
					},
					keyFollow: 0,
					algoControlsA: [
						{
							id: "preset",
							value: 0,
						},
						{
							id: "waveform1",
							value: 0,
						},
						{
							id: "waveform2",
							value: 0,
						},
						{
							id: "windowFunction",
							value: 0,
						},
					],
					algoControlsB: [],
				},
				frequency: 440,
				volume: 1,
				polyMode: "poly8",
				legato: false,
				velocityCurve: 0,
				portamento: {
					enabled: false,
					mode: "rate",
					rate: 0,
					time: 0.5,
				},
				lfo: {
					waveform: "sine",
					rate: 5,
					depth: 1,
					symmetry: 0.5,
					retrigger: false,
					offset: 0,
				},
				lfo2: {
					waveform: "sine",
					rate: 5,
					depth: 0,
					symmetry: 0.5,
					retrigger: false,
					offset: 0,
				},
				random: {
					rate: 2,
				},
				modEnv: {
					attack: 0.009999999776482582,
					decay: 0.10000000149011612,
					sustain: 0.5,
					release: 0.20000000298023224,
				},
				pitchBendRange: 2,
				modMatrix: {
					routes: [],
				},
				fxSlots: [
					{
						type: "junoChorus",
						params: {
							enabled: true,
							mode: 0,
							mix: 0.22361328125000002,
						},
					},
					{
						type: "empty",
					},
					{
						type: "empty",
					},
					{
						type: "vibrato",
						params: {
							enabled: true,
							waveform: 1,
							rate: 20,
							depth: 3.6777342387608116,
							delay: 160,
						},
					},
					{
						type: "empty",
					},
					{
						type: "empty",
					},
				],
			},
		},
		favorite: false,
		category: "",
		tags: [],
	},
	Flute: {
		name: "Flute",
		data: {
			schemaVersion: 1,
			params: {
				lineSelect: "L2",
				modMode: "normal",
				octave: 0,
				line1: {
					algo: "cz101",
					algo2: null,
					algoBlend: 0,
					baseWaveformA: "cosine",
					baseWaveformB: "cosine",
					window: "off",
					dcaBase: 1,
					dcwBase: 1,
					modulation: 0,
					detuneNote: 0,
					detuneFine: 0,
					octave: 0,
					dcoEnv: {
						steps: [
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 0,
							},
							{
								level: 0,
								rate: 0,
							},
							{
								level: 0,
								rate: 0,
							},
							{
								level: 0,
								rate: 0,
							},
							{
								level: 0,
								rate: 0,
							},
							{
								level: 0,
								rate: 0,
							},
							{
								level: 0,
								rate: 0,
							},
						],
						sustainStep: 1,
						stepCount: 2,
						loop: false,
					},
					dcwEnv: {
						steps: [
							{
								level: 99,
								rate: 75,
							},
							{
								level: 99,
								rate: 80,
							},
							{
								level: 99,
								rate: 75,
							},
							{
								level: 0,
								rate: 40,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
						],
						sustainStep: 2,
						stepCount: 4,
						loop: false,
					},
					dcaEnv: {
						steps: [
							{
								level: 99,
								rate: 75,
							},
							{
								level: 79,
								rate: 80,
							},
							{
								level: 79,
								rate: 75,
							},
							{
								level: 0,
								rate: 40,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
						],
						sustainStep: 2,
						stepCount: 4,
						loop: false,
					},
					keyFollow: 0,
					algoControlsA: [
						{
							id: "preset",
							value: 4,
						},
						{
							id: "waveform1",
							value: 5,
						},
						{
							id: "waveform2",
							value: 5,
						},
						{
							id: "windowFunction",
							value: 0,
						},
					],
					algoControlsB: [],
				},
				line2: {
					algo: "cz101",
					algo2: null,
					algoBlend: 0,
					baseWaveformA: "cosine",
					baseWaveformB: "cosine",
					window: "off",
					dcaBase: 1,
					dcwBase: 1,
					modulation: 0,
					detuneNote: 0,
					detuneFine: 0,
					octave: 0,
					dcoEnv: {
						steps: [
							{
								level: 0,
								rate: 0,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
						],
						sustainStep: 0,
						stepCount: 1,
						loop: false,
					},
					dcwEnv: {
						steps: [
							{
								level: 50,
								rate: 30,
							},
							{
								level: 0,
								rate: 25,
							},
							{
								level: 70,
								rate: 25,
							},
							{
								level: 0,
								rate: 25,
							},
							{
								level: 60,
								rate: 40,
							},
							{
								level: 0,
								rate: 20,
							},
							{
								level: 80,
								rate: 40,
							},
							{
								level: 0,
								rate: 25,
							},
						],
						sustainStep: 0,
						stepCount: 8,
						loop: false,
					},
					dcaEnv: {
						steps: [
							{
								level: 99,
								rate: 60,
							},
							{
								level: 46,
								rate: 30,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
						],
						sustainStep: 0,
						stepCount: 2,
						loop: false,
					},
					keyFollow: 2,
					algoControlsA: [
						{
							id: "preset",
							value: 2,
						},
						{
							id: "waveform1",
							value: 2,
						},
						{
							id: "waveform2",
							value: 2,
						},
						{
							id: "windowFunction",
							value: 0,
						},
					],
					algoControlsB: [],
				},
				frequency: 440,
				volume: 1,
				polyMode: "poly8",
				legato: false,
				velocityCurve: 0,
				portamento: {
					enabled: false,
					mode: "rate",
					rate: 0,
					time: 0.5,
				},
				lfo: {
					waveform: "sine",
					rate: 5,
					depth: 1,
					symmetry: 0.5,
					retrigger: false,
					offset: 0,
				},
				lfo2: {
					waveform: "sine",
					rate: 5,
					depth: 0,
					symmetry: 0.5,
					retrigger: false,
					offset: 0,
				},
				random: {
					rate: 2,
				},
				modEnv: {
					attack: 0.009999999776482582,
					decay: 0.10000000149011612,
					sustain: 0.5,
					release: 0.20000000298023224,
				},
				pitchBendRange: 2,
				modMatrix: {
					routes: [],
				},
				fxSlots: [
					{
						type: "empty",
					},
					{
						type: "empty",
					},
					{
						type: "empty",
					},
					{
						type: "vibrato",
						params: {
							enabled: true,
							waveform: 1,
							rate: 40,
							depth: 4,
							delay: 600,
						},
					},
					{
						type: "empty",
					},
					{
						type: "empty",
					},
				],
			},
		},
		favorite: false,
		category: "",
		tags: ["winds"],
	},
	"Fun Bass": {
		name: "Fun Bass",
		data: {
			schemaVersion: 1,
			params: {
				lineSelect: "L1",
				modMode: "normal",
				octave: 0,
				line1: {
					algo: "cz101",
					algo2: null,
					algoBlend: 0,
					baseWaveformA: "cosine",
					baseWaveformB: "cosine",
					window: "off",
					dcaBase: 1,
					dcwBase: 1,
					modulation: 0,
					detuneNote: 0,
					detuneFine: 0,
					octave: -1,
					dcoEnv: {
						steps: [
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
						],
						sustainStep: 1,
						stepCount: 2,
						loop: false,
					},
					dcwEnv: {
						steps: [
							{
								level: 72,
								rate: 78,
							},
							{
								level: 99,
								rate: 64,
							},
							{
								level: 52,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
						],
						sustainStep: 3,
						stepCount: 4,
						loop: false,
					},
					dcaEnv: {
						steps: [
							{
								level: 99,
								rate: 99,
							},
							{
								level: 0,
								rate: 99,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
						],
						sustainStep: 0,
						stepCount: 2,
						loop: false,
					},
					keyFollow: 0,
					algoControlsA: [
						{
							id: "preset",
							value: 1,
						},
						{
							id: "waveform1",
							value: 1,
						},
						{
							id: "waveform2",
							value: 1,
						},
						{
							id: "windowFunction",
							value: 0,
						},
					],
					algoControlsB: [],
				},
				line2: {
					algo: "cz101",
					algo2: null,
					algoBlend: 0,
					baseWaveformA: "cosine",
					baseWaveformB: "cosine",
					window: "off",
					dcaBase: 1,
					dcwBase: 1,
					modulation: 0,
					detuneNote: 0,
					detuneFine: 0,
					octave: -1,
					dcoEnv: {
						steps: [
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 0,
							},
							{
								level: 0,
								rate: 0,
							},
							{
								level: 0,
								rate: 0,
							},
							{
								level: 0,
								rate: 0,
							},
							{
								level: 0,
								rate: 0,
							},
							{
								level: 0,
								rate: 0,
							},
							{
								level: 0,
								rate: 0,
							},
						],
						sustainStep: 1,
						stepCount: 2,
						loop: false,
					},
					dcwEnv: {
						steps: [
							{
								level: 99,
								rate: 75,
							},
							{
								level: 99,
								rate: 80,
							},
							{
								level: 99,
								rate: 75,
							},
							{
								level: 0,
								rate: 40,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
						],
						sustainStep: 2,
						stepCount: 4,
						loop: false,
					},
					dcaEnv: {
						steps: [
							{
								level: 99,
								rate: 75,
							},
							{
								level: 79,
								rate: 80,
							},
							{
								level: 79,
								rate: 75,
							},
							{
								level: 0,
								rate: 40,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
						],
						sustainStep: 2,
						stepCount: 4,
						loop: false,
					},
					keyFollow: 0,
					algoControlsA: [
						{
							id: "preset",
							value: 0,
						},
						{
							id: "waveform1",
							value: 1,
						},
						{
							id: "waveform2",
							value: 4,
						},
						{
							id: "windowFunction",
							value: 0,
						},
					],
					algoControlsB: [],
				},
				frequency: 440,
				volume: 1,
				polyMode: "poly8",
				legato: false,
				velocityCurve: 0,
				portamento: {
					enabled: false,
					mode: "rate",
					rate: 0,
					time: 0.5,
				},
				lfo: {
					waveform: "sine",
					rate: 5,
					depth: 1,
					symmetry: 0.5,
					retrigger: false,
					offset: 0,
				},
				lfo2: {
					waveform: "sine",
					rate: 5,
					depth: 0,
					symmetry: 0.5,
					retrigger: false,
					offset: 0,
				},
				random: {
					rate: 2,
				},
				modEnv: {
					attack: 0.009999999776482582,
					decay: 0.10000000149011612,
					sustain: 0.5,
					release: 0.20000000298023224,
				},
				pitchBendRange: 2,
				modMatrix: {
					routes: [],
				},
				fxSlots: [
					{
						type: "empty",
					},
					{
						type: "empty",
					},
					{
						type: "empty",
					},
					{
						type: "vibrato",
						params: {
							enabled: true,
							waveform: 1,
							rate: 60,
							depth: 8,
							delay: 34,
						},
					},
					{
						type: "empty",
					},
					{
						type: "empty",
					},
				],
			},
		},
		favorite: false,
		category: "",
		tags: [],
	},
	"Fuzz Lead": {
		name: "Fuzz Lead",
		data: {
			schemaVersion: 1,
			params: {
				lineSelect: "L2",
				modMode: "normal",
				octave: 0,
				line1: {
					algo: "cz101",
					algo2: null,
					algoBlend: 0,
					baseWaveformA: "cosine",
					baseWaveformB: "cosine",
					window: "off",
					dcaBase: 1,
					dcwBase: 1,
					modulation: 0,
					detuneNote: 0,
					detuneFine: 0,
					octave: 0,
					dcoEnv: {
						steps: [
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 0,
							},
							{
								level: 0,
								rate: 0,
							},
							{
								level: 0,
								rate: 0,
							},
							{
								level: 0,
								rate: 0,
							},
							{
								level: 0,
								rate: 0,
							},
							{
								level: 0,
								rate: 0,
							},
							{
								level: 0,
								rate: 0,
							},
						],
						sustainStep: 1,
						stepCount: 2,
						loop: false,
					},
					dcwEnv: {
						steps: [
							{
								level: 99,
								rate: 75,
							},
							{
								level: 99,
								rate: 80,
							},
							{
								level: 99,
								rate: 75,
							},
							{
								level: 0,
								rate: 40,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
						],
						sustainStep: 2,
						stepCount: 4,
						loop: false,
					},
					dcaEnv: {
						steps: [
							{
								level: 99,
								rate: 75,
							},
							{
								level: 79,
								rate: 80,
							},
							{
								level: 79,
								rate: 75,
							},
							{
								level: 0,
								rate: 40,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
						],
						sustainStep: 2,
						stepCount: 4,
						loop: false,
					},
					keyFollow: 0,
					algoControlsA: [
						{
							id: "preset",
							value: 0,
						},
						{
							id: "waveform1",
							value: 1,
						},
						{
							id: "waveform2",
							value: 0,
						},
						{
							id: "windowFunction",
							value: 0,
						},
					],
					algoControlsB: [],
				},
				line2: {
					algo: "cz101",
					algo2: "cz101",
					algoBlend: 0,
					baseWaveformA: "cosine",
					baseWaveformB: "cosine",
					window: "off",
					dcaBase: 1,
					dcwBase: 1,
					modulation: 0,
					detuneNote: 0,
					detuneFine: 0,
					octave: 0,
					dcoEnv: {
						steps: [
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
						],
						sustainStep: 1,
						stepCount: 2,
						loop: false,
					},
					dcwEnv: {
						steps: [
							{
								level: 97,
								rate: 99,
							},
							{
								level: 0,
								rate: 25,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
						],
						sustainStep: 0,
						stepCount: 2,
						loop: false,
					},
					dcaEnv: {
						steps: [
							{
								level: 99,
								rate: 99,
							},
							{
								level: 0,
								rate: 45.585371903010774,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
						],
						sustainStep: 0,
						stepCount: 2,
						loop: false,
					},
					keyFollow: 0,
					algoControlsA: [
						{
							id: "preset",
							value: 0,
						},
						{
							id: "waveform1",
							value: 5,
						},
						{
							id: "waveform2",
							value: 2,
						},
						{
							id: "windowFunction",
							value: 0,
						},
					],
					algoControlsB: [
						{
							id: "preset",
							value: 2,
						},
						{
							id: "waveform1",
							value: 2,
						},
						{
							id: "waveform2",
							value: 2,
						},
						{
							id: "windowFunction",
							value: 0,
						},
					],
				},
				frequency: 440,
				volume: 1,
				polyMode: "mono",
				legato: false,
				velocityCurve: 0,
				portamento: {
					enabled: true,
					mode: "time",
					rate: 0,
					time: 0.07287109919956747,
				},
				lfo: {
					waveform: "sine",
					rate: 5,
					depth: 1,
					symmetry: 0.5,
					retrigger: false,
					offset: 0,
				},
				lfo2: {
					waveform: "sine",
					rate: 5,
					depth: 0,
					symmetry: 0.5,
					retrigger: false,
					offset: 0,
				},
				random: {
					rate: 2,
				},
				modEnv: {
					attack: 0.009999999776482582,
					decay: 0.10000000149011612,
					sustain: 0.5,
					release: 0.20000000298023224,
				},
				pitchBendRange: 2,
				modMatrix: {
					routes: [],
				},
				fxSlots: [
					{
						type: "empty",
					},
					{
						type: "empty",
					},
					{
						type: "empty",
					},
					{
						type: "vibrato",
						params: {
							enabled: true,
							waveform: 1,
							rate: 55,
							depth: 14,
							delay: 0,
						},
					},
					{
						type: "empty",
					},
					{
						type: "empty",
					},
				],
			},
		},
		favorite: false,
		category: "",
		tags: [],
	},
	"Infinite Wobble": {
		name: "Infinite Wobble",
		data: {
			schemaVersion: 1,
			params: {
				lineSelect: "L1+L1'",
				modMode: "normal",
				octave: 0,
				line1: {
					algo: "cz101",
					algo2: null,
					algoBlend: 0,
					baseWaveformA: "cosine",
					baseWaveformB: "cosine",
					window: "off",
					dcaBase: 1,
					dcwBase: 1,
					modulation: 0,
					detuneNote: 0,
					detuneFine: 0,
					octave: 0,
					dcoEnv: {
						steps: [
							{
								level: 55,
								rate: 99,
							},
							{
								level: 0,
								rate: 90,
							},
							{
								level: 0,
								rate: 0,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
						],
						sustainStep: 2,
						stepCount: 3,
						loop: false,
					},
					dcwEnv: {
						steps: [
							{
								level: 30,
								rate: 95,
							},
							{
								level: 70,
								rate: 90,
							},
							{
								level: 0,
								rate: 20,
							},
							{
								level: 70,
								rate: 35,
							},
							{
								level: 0,
								rate: 30,
							},
							{
								level: 80,
								rate: 35,
							},
							{
								level: 0,
								rate: 40,
							},
							{
								level: 0,
								rate: 50,
							},
						],
						sustainStep: 0,
						stepCount: 8,
						loop: false,
					},
					dcaEnv: {
						steps: [
							{
								level: 99,
								rate: 99,
							},
							{
								level: 80,
								rate: 90,
							},
							{
								level: 60,
								rate: 0,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
						],
						sustainStep: 0,
						stepCount: 3,
						loop: false,
					},
					keyFollow: 0,
					algoControlsA: [
						{
							id: "preset",
							value: 4,
						},
						{
							id: "waveform1",
							value: 5,
						},
						{
							id: "waveform2",
							value: 5,
						},
						{
							id: "windowFunction",
							value: 0,
						},
					],
					algoControlsB: [],
				},
				line2: {
					algo: "cz101",
					algo2: null,
					algoBlend: 0,
					baseWaveformA: "cosine",
					baseWaveformB: "cosine",
					window: "off",
					dcaBase: 1,
					dcwBase: 1,
					modulation: 0,
					detuneNote: 0,
					detuneFine: 0,
					octave: 1,
					dcoEnv: {
						steps: [
							{
								level: 0,
								rate: 0,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
						],
						sustainStep: 0,
						stepCount: 1,
						loop: false,
					},
					dcwEnv: {
						steps: [
							{
								level: 0,
								rate: 0,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
						],
						sustainStep: 0,
						stepCount: 1,
						loop: false,
					},
					dcaEnv: {
						steps: [
							{
								level: 0,
								rate: 0,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
						],
						sustainStep: 0,
						stepCount: 1,
						loop: false,
					},
					keyFollow: 0,
					algoControlsA: [
						{
							id: "preset",
							value: 0,
						},
						{
							id: "waveform1",
							value: 1,
						},
						{
							id: "waveform2",
							value: 1,
						},
						{
							id: "windowFunction",
							value: 1,
						},
					],
					algoControlsB: [],
				},
				frequency: 440,
				volume: 1,
				polyMode: "poly8",
				legato: false,
				velocityCurve: 0,
				portamento: {
					enabled: false,
					mode: "rate",
					rate: 0,
					time: 0.5,
				},
				lfo: {
					waveform: "sine",
					rate: 5,
					depth: 1,
					symmetry: 0.5,
					retrigger: false,
					offset: 0,
				},
				lfo2: {
					waveform: "sine",
					rate: 5,
					depth: 0,
					symmetry: 0.5,
					retrigger: false,
					offset: 0,
				},
				random: {
					rate: 2,
				},
				modEnv: {
					attack: 0.009999999776482582,
					decay: 0.10000000149011612,
					sustain: 0.5,
					release: 0.20000000298023224,
				},
				pitchBendRange: 2,
				modMatrix: {
					routes: [],
				},
				fxSlots: [
					{
						type: "empty",
					},
					{
						type: "empty",
					},
					{
						type: "empty",
					},
					{
						type: "vibrato",
						params: {
							enabled: true,
							waveform: 1,
							rate: 25,
							depth: 6,
							delay: 960,
						},
					},
					{
						type: "empty",
					},
					{
						type: "empty",
					},
				],
			},
		},
		favorite: false,
		category: "",
		tags: ["pad"],
	},
	"Hot Lead": {
		name: "Hot Lead",
		data: {
			schemaVersion: 1,
			params: {
				lineSelect: "L2",
				modMode: "normal",
				octave: 0,
				line1: {
					algo: "cz101",
					algo2: null,
					algoBlend: 0,
					baseWaveformA: "cosine",
					baseWaveformB: "cosine",
					window: "off",
					dcaBase: 1,
					dcwBase: 1,
					modulation: 0,
					detuneNote: 0,
					detuneFine: 0,
					octave: 0,
					dcoEnv: {
						steps: [
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 0,
							},
							{
								level: 0,
								rate: 0,
							},
							{
								level: 0,
								rate: 0,
							},
							{
								level: 0,
								rate: 0,
							},
							{
								level: 0,
								rate: 0,
							},
							{
								level: 0,
								rate: 0,
							},
							{
								level: 0,
								rate: 0,
							},
						],
						sustainStep: 1,
						stepCount: 2,
						loop: false,
					},
					dcwEnv: {
						steps: [
							{
								level: 99,
								rate: 75,
							},
							{
								level: 99,
								rate: 80,
							},
							{
								level: 99,
								rate: 75,
							},
							{
								level: 0,
								rate: 40,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
						],
						sustainStep: 2,
						stepCount: 4,
						loop: false,
					},
					dcaEnv: {
						steps: [
							{
								level: 99,
								rate: 75,
							},
							{
								level: 79,
								rate: 80,
							},
							{
								level: 79,
								rate: 75,
							},
							{
								level: 0,
								rate: 40,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
						],
						sustainStep: 2,
						stepCount: 4,
						loop: false,
					},
					keyFollow: 0,
					algoControlsA: [
						{
							id: "preset",
							value: 0,
						},
						{
							id: "waveform1",
							value: 1,
						},
						{
							id: "waveform2",
							value: 0,
						},
						{
							id: "windowFunction",
							value: 0,
						},
					],
					algoControlsB: [],
				},
				line2: {
					algo: "cz101",
					algo2: null,
					algoBlend: 0,
					baseWaveformA: "cosine",
					baseWaveformB: "cosine",
					window: "off",
					dcaBase: 1,
					dcwBase: 1,
					modulation: 0,
					detuneNote: 0,
					detuneFine: 0,
					octave: 0,
					dcoEnv: {
						steps: [
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
						],
						sustainStep: 1,
						stepCount: 2,
						loop: false,
					},
					dcwEnv: {
						steps: [
							{
								level: 99,
								rate: 99,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
						],
						sustainStep: 0,
						stepCount: 2,
						loop: false,
					},
					dcaEnv: {
						steps: [
							{
								level: 99,
								rate: 99,
							},
							{
								level: 0,
								rate: 55.10871039799282,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
						],
						sustainStep: 0,
						stepCount: 2,
						loop: false,
					},
					keyFollow: 0,
					algoControlsA: [
						{
							id: "preset",
							value: 0,
						},
						{
							id: "waveform1",
							value: 0,
						},
						{
							id: "waveform2",
							value: 0,
						},
						{
							id: "windowFunction",
							value: 0,
						},
					],
					algoControlsB: [],
				},
				frequency: 440,
				volume: 1,
				polyMode: "mono",
				legato: false,
				velocityCurve: 0,
				portamento: {
					enabled: true,
					mode: "time",
					rate: 0,
					time: 0.10011720657348633,
				},
				lfo: {
					waveform: "sine",
					rate: 5,
					depth: 1,
					symmetry: 0.5,
					retrigger: false,
					offset: 0,
				},
				lfo2: {
					waveform: "sine",
					rate: 5,
					depth: 0,
					symmetry: 0.5,
					retrigger: false,
					offset: 0,
				},
				random: {
					rate: 2,
				},
				modEnv: {
					attack: 0.009999999776482582,
					decay: 0.10000000149011612,
					sustain: 0.5,
					release: 0.20000000298023224,
				},
				pitchBendRange: 2,
				modMatrix: {
					routes: [],
				},
				fxSlots: [
					{
						type: "empty",
					},
					{
						type: "empty",
					},
					{
						type: "empty",
					},
					{
						type: "vibrato",
						params: {
							enabled: true,
							waveform: 1,
							rate: 55,
							depth: 14,
							delay: 0,
						},
					},
					{
						type: "empty",
					},
					{
						type: "empty",
					},
				],
			},
		},
		favorite: false,
		category: "",
		tags: [],
	},
	"Majestic Pad": {
		name: "Majestic Pad",
		data: {
			schemaVersion: 1,
			params: {
				lineSelect: "L1+L1'",
				modMode: "normal",
				octave: 0,
				line1: {
					algo: "fold",
					algo2: "clip",
					algoBlend: 0,
					baseWaveformA: "sine",
					baseWaveformB: "sine",
					window: "off",
					dcaBase: 1,
					dcwBase: 1,
					modulation: 0,
					detuneNote: 0,
					detuneFine: 0,
					octave: 0,
					dcoEnv: {
						steps: [
							{
								level: 0,
								rate: 0,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
						],
						sustainStep: 0,
						stepCount: 1,
						loop: false,
					},
					dcwEnv: {
						steps: [
							{
								level: 85.49965005602155,
								rate: 41.08888617924282,
							},
							{
								level: 55,
								rate: 35,
							},
							{
								level: 0,
								rate: 39,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
						],
						sustainStep: 1,
						stepCount: 3,
						loop: false,
					},
					dcaEnv: {
						steps: [
							{
								level: 99,
								rate: 65,
							},
							{
								level: 99,
								rate: 61,
							},
							{
								level: 90,
								rate: 35,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
						],
						sustainStep: 1,
						stepCount: 3,
						loop: false,
					},
					keyFollow: 0,
					algoControlsA: [
						{
							id: "foldStages",
							value: 0.27640624999999996,
						},
						{
							id: "foldTilt",
							value: 0,
						},
						{
							id: "foldSymmetry",
							value: 0,
						},
						{
							id: "foldSoftness",
							value: 0.8834765624999998,
						},
					],
					algoControlsB: [
						{
							id: "clipDrive",
							value: 0.5,
						},
						{
							id: "clipShape",
							value: 0.5,
						},
						{
							id: "clipBias",
							value: 0,
						},
						{
							id: "clipSoft",
							value: 0,
						},
					],
				},
				line2: {
					algo: "cz101",
					algo2: "cz101",
					algoBlend: 0,
					baseWaveformA: "cosine",
					baseWaveformB: "cosine",
					window: "off",
					dcaBase: 1,
					dcwBase: 1,
					modulation: 0,
					detuneNote: 0,
					detuneFine: 7,
					octave: -1,
					dcoEnv: {
						steps: [
							{
								level: 49,
								rate: 99,
							},
							{
								level: 2,
								rate: 83,
							},
							{
								level: 12,
								rate: 92,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
						],
						sustainStep: 7,
						stepCount: 8,
						loop: false,
					},
					dcwEnv: {
						steps: [
							{
								level: 99,
								rate: 40,
							},
							{
								level: 0,
								rate: 12,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
						],
						sustainStep: 1,
						stepCount: 2,
						loop: false,
					},
					dcaEnv: {
						steps: [
							{
								level: 99,
								rate: 99,
							},
							{
								level: 53,
								rate: 27,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
						],
						sustainStep: 1,
						stepCount: 2,
						loop: false,
					},
					keyFollow: 0,
					algoControlsA: [
						{
							id: "preset",
							value: 0,
						},
						{
							id: "waveform1",
							value: 0,
						},
						{
							id: "waveform2",
							value: 0,
						},
						{
							id: "windowFunction",
							value: 0,
						},
					],
					algoControlsB: [
						{
							id: "preset",
							value: 0,
						},
						{
							id: "waveform1",
							value: 0,
						},
						{
							id: "waveform2",
							value: 0,
						},
						{
							id: "windowFunction",
							value: 0,
						},
					],
				},
				frequency: 440,
				volume: 1,
				polyMode: "poly8",
				legato: false,
				velocityCurve: 0,
				portamento: {
					enabled: false,
					mode: "rate",
					rate: 0,
					time: 0.5,
				},
				lfo: {
					waveform: "sine",
					rate: 5,
					depth: 1,
					symmetry: 0.5,
					retrigger: false,
					offset: 0,
				},
				lfo2: {
					waveform: "sine",
					rate: 5,
					depth: 0,
					symmetry: 0.5,
					retrigger: false,
					offset: 0,
				},
				random: {
					rate: 2,
				},
				modEnv: {
					attack: 0.009999999776482582,
					decay: 0.10000000149011612,
					sustain: 0.5,
					release: 0.20000000298023224,
				},
				pitchBendRange: 2,
				modMatrix: {
					routes: [
						{
							source: "modWheel",
							destination: "line1AlgoParam4",
							amount: -0.6846874918256489,
							enabled: true,
						},
					],
				},
				fxSlots: [
					{
						type: "vibrato",
						params: {
							enabled: true,
							waveform: 1,
							rate: 58,
							depth: 8,
							delay: 624,
						},
					},
					{
						type: "tremolo",
						params: {
							enabled: true,
							rate: 5.149091959544591,
							depth: 0.326347656931196,
							waveform: 0,
							mix: 1,
						},
					},
					{
						type: "delay",
						params: {
							enabled: true,
							time: 0.34,
							feedback: 0.46,
							mix: 0.21566405841282432,
							tapeMode: true,
							warmth: 0.72,
						},
					},
					{
						type: "shimmerVerb",
						params: {
							enabled: true,
							shimmer: 0.4,
							space: 0.7,
							mix: 0,
						},
					},
					{
						type: "grainDelay",
						params: {
							enabled: true,
							time: 0.5,
							feedback: 0.36,
							scatter: 0.24,
							density: 0.5,
							mix: 0.35,
						},
					},
					{
						type: "empty",
					},
				],
			},
		},
		favorite: true,
		category: "",
		tags: [],
	},
	"Red Velvet": {
		name: "Red Velvet",
		data: {
			schemaVersion: 1,
			params: {
				lineSelect: "L1+L1'",
				modMode: "normal",
				octave: 0,
				line1: {
					algo: "cz101",
					algo2: null,
					algoBlend: 0,
					baseWaveformA: "cosine",
					baseWaveformB: "cosine",
					window: "off",
					dcaBase: 1,
					dcwBase: 1,
					modulation: 0,
					detuneNote: 0,
					detuneFine: 0,
					octave: 0,
					dcoEnv: {
						steps: [
							{
								level: 0,
								rate: 0,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
						],
						sustainStep: 0,
						stepCount: 1,
						loop: false,
					},
					dcwEnv: {
						steps: [
							{
								level: 55.22994064727159,
								rate: 99,
							},
							{
								level: 21.218043135192005,
								rate: 46,
							},
							{
								level: 72.61421915463039,
								rate: 65,
							},
							{
								level: 0,
								rate: 20,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
						],
						sustainStep: 1,
						stepCount: 4,
						loop: false,
					},
					dcaEnv: {
						steps: [
							{
								level: 99,
								rate: 99,
							},
							{
								level: 0,
								rate: 20,
							},
							{
								level: 71.5686326776232,
								rate: 75,
							},
							{
								level: 0,
								rate: 35.26224636350359,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
						],
						sustainStep: 1,
						stepCount: 4,
						loop: false,
					},
					keyFollow: 0,
					algoControlsA: [
						{
							id: "preset",
							value: 4,
						},
						{
							id: "waveform1",
							value: 5,
						},
						{
							id: "waveform2",
							value: 5,
						},
						{
							id: "windowFunction",
							value: 0,
						},
					],
					algoControlsB: [],
				},
				line2: {
					algo: "cz101",
					algo2: null,
					algoBlend: 0,
					baseWaveformA: "cosine",
					baseWaveformB: "cosine",
					window: "off",
					dcaBase: 1,
					dcwBase: 1,
					modulation: 0,
					detuneNote: -5,
					detuneFine: 0,
					octave: 0,
					dcoEnv: {
						steps: [
							{
								level: 0,
								rate: 0,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
						],
						sustainStep: 0,
						stepCount: 1,
						loop: false,
					},
					dcwEnv: {
						steps: [
							{
								level: 0,
								rate: 0,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
						],
						sustainStep: 0,
						stepCount: 1,
						loop: false,
					},
					dcaEnv: {
						steps: [
							{
								level: 0,
								rate: 0,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
						],
						sustainStep: 0,
						stepCount: 1,
						loop: false,
					},
					keyFollow: 0,
					algoControlsA: [
						{
							id: "preset",
							value: 0,
						},
						{
							id: "waveform1",
							value: 1,
						},
						{
							id: "waveform2",
							value: 1,
						},
						{
							id: "windowFunction",
							value: 1,
						},
					],
					algoControlsB: [],
				},
				frequency: 440,
				volume: 1,
				polyMode: "poly8",
				legato: false,
				velocityCurve: 0,
				portamento: {
					enabled: false,
					mode: "rate",
					rate: 0,
					time: 0.5,
				},
				lfo: {
					waveform: "sine",
					rate: 5,
					depth: 1,
					symmetry: 0.5,
					retrigger: false,
					offset: 0,
				},
				lfo2: {
					waveform: "sine",
					rate: 5,
					depth: 0,
					symmetry: 0.5,
					retrigger: false,
					offset: 0,
				},
				random: {
					rate: 2,
				},
				modEnv: {
					attack: 0.009999999776482582,
					decay: 0.10000000149011612,
					sustain: 0.5,
					release: 0.20000000298023224,
				},
				pitchBendRange: 2,
				modMatrix: {
					routes: [],
				},
				fxSlots: [
					{
						type: "empty",
					},
					{
						type: "empty",
					},
					{
						type: "empty",
					},
					{
						type: "vibrato",
						params: {
							enabled: true,
							waveform: 1,
							rate: 35,
							depth: 10,
							delay: 960,
						},
					},
					{
						type: "empty",
					},
					{
						type: "empty",
					},
				],
			},
		},
		favorite: false,
		category: "",
		tags: ["piano"],
	},
	"Starship 1": {
		name: "Starship 1",
		data: {
			schemaVersion: 1,
			params: {
				lineSelect: "L1+L2'",
				modMode: "normal",
				octave: 0,
				line1: {
					algo: "cz101",
					algo2: "cz101",
					algoBlend: 0,
					baseWaveformA: "cosine",
					baseWaveformB: "cosine",
					window: "off",
					dcaBase: 1,
					dcwBase: 1,
					modulation: 0,
					detuneNote: 0,
					detuneFine: 0,
					octave: 0,
					dcoEnv: {
						steps: [
							{
								level: 10,
								rate: 0,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
						],
						sustainStep: 0,
						stepCount: 1,
						loop: false,
					},
					dcwEnv: {
						steps: [
							{
								level: 99,
								rate: 99,
							},
							{
								level: 96,
								rate: 83,
							},
							{
								level: 60,
								rate: 37,
							},
							{
								level: 0,
								rate: 41,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
						],
						sustainStep: 2,
						stepCount: 4,
						loop: false,
					},
					dcaEnv: {
						steps: [
							{
								level: 90,
								rate: 93,
							},
							{
								level: 0,
								rate: 30,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
						],
						sustainStep: 0,
						stepCount: 2,
						loop: false,
					},
					keyFollow: 0,
					algoControlsA: [
						{
							id: "preset",
							value: 3,
						},
						{
							id: "waveform1",
							value: 4,
						},
						{
							id: "waveform2",
							value: 4,
						},
						{
							id: "windowFunction",
							value: 0,
						},
					],
					algoControlsB: [
						{
							id: "preset",
							value: 3,
						},
						{
							id: "waveform1",
							value: 4,
						},
						{
							id: "waveform2",
							value: 4,
						},
						{
							id: "windowFunction",
							value: 0,
						},
					],
				},
				line2: {
					algo: "cz101",
					algo2: "cz101",
					algoBlend: 0,
					baseWaveformA: "cosine",
					baseWaveformB: "cosine",
					window: "off",
					dcaBase: 1,
					dcwBase: 1,
					modulation: 0,
					detuneNote: 0,
					detuneFine: 10,
					octave: 2,
					dcoEnv: {
						steps: [
							{
								level: 0,
								rate: 0,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
						],
						sustainStep: 0,
						stepCount: 1,
						loop: false,
					},
					dcwEnv: {
						steps: [
							{
								level: 99,
								rate: 99,
							},
							{
								level: 96,
								rate: 83,
							},
							{
								level: 44,
								rate: 46,
							},
							{
								level: 0,
								rate: 34,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
						],
						sustainStep: 2,
						stepCount: 4,
						loop: false,
					},
					dcaEnv: {
						steps: [
							{
								level: 90,
								rate: 93,
							},
							{
								level: 0,
								rate: 30,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
						],
						sustainStep: 1,
						stepCount: 2,
						loop: false,
					},
					keyFollow: 0,
					algoControlsA: [
						{
							id: "preset",
							value: 0,
						},
						{
							id: "waveform1",
							value: 6,
						},
						{
							id: "waveform2",
							value: 1,
						},
						{
							id: "windowFunction",
							value: 3,
						},
					],
					algoControlsB: [
						{
							id: "preset",
							value: 0,
						},
						{
							id: "waveform1",
							value: 1,
						},
						{
							id: "waveform2",
							value: 1,
						},
						{
							id: "windowFunction",
							value: 3,
						},
					],
				},
				frequency: 440,
				volume: 1,
				polyMode: "poly8",
				legato: false,
				velocityCurve: 0,
				portamento: {
					enabled: false,
					mode: "rate",
					rate: 0,
					time: 0.5,
				},
				lfo: {
					waveform: "sine",
					rate: 5,
					depth: 1,
					symmetry: 0.5,
					retrigger: false,
					offset: 0,
				},
				lfo2: {
					waveform: "sine",
					rate: 5,
					depth: 0,
					symmetry: 0.5,
					retrigger: false,
					offset: 0,
				},
				random: {
					rate: 2,
				},
				modEnv: {
					attack: 0.009999999776482582,
					decay: 0.10000000149011612,
					sustain: 0.5,
					release: 0.20000000298023224,
				},
				pitchBendRange: 2,
				modMatrix: {
					routes: [],
				},
				fxSlots: [
					{
						type: "empty",
					},
					{
						type: "empty",
					},
					{
						type: "empty",
					},
					{
						type: "vibrato",
						params: {
							enabled: true,
							waveform: 1,
							rate: 53,
							depth: 18,
							delay: 0,
						},
					},
					{
						type: "empty",
					},
					{
						type: "empty",
					},
				],
			},
		},
		favorite: false,
		category: "",
		tags: ["bell"],
	},
	Tweed: {
		name: "Tweed",
		data: {
			schemaVersion: 1,
			params: {
				lineSelect: "L1+L2'",
				modMode: "normal",
				octave: 0,
				line1: {
					algo: "cz101",
					algo2: "cz101",
					algoBlend: 0,
					baseWaveformA: "cosine",
					baseWaveformB: "cosine",
					window: "off",
					dcaBase: 1,
					dcwBase: 1,
					modulation: 0,
					detuneNote: 0,
					detuneFine: 0,
					octave: 1,
					dcoEnv: {
						steps: [
							{
								level: 32,
								rate: 71,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 99,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
						],
						sustainStep: 2,
						stepCount: 3,
						loop: false,
					},
					dcwEnv: {
						steps: [
							{
								level: 88,
								rate: 74,
							},
							{
								level: 75,
								rate: 56,
							},
							{
								level: 52,
								rate: 37,
							},
							{
								level: 0,
								rate: 26,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
						],
						sustainStep: 2,
						stepCount: 4,
						loop: false,
					},
					dcaEnv: {
						steps: [
							{
								level: 99,
								rate: 99,
							},
							{
								level: 0,
								rate: 45,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
						],
						sustainStep: 0,
						stepCount: 2,
						loop: false,
					},
					keyFollow: 0,
					algoControlsA: [
						{
							id: "preset",
							value: 0,
						},
						{
							id: "waveform1",
							value: 1,
						},
						{
							id: "waveform2",
							value: 2,
						},
						{
							id: "windowFunction",
							value: 0,
						},
					],
					algoControlsB: [
						{
							id: "preset",
							value: 2,
						},
						{
							id: "waveform1",
							value: 2,
						},
						{
							id: "waveform2",
							value: 2,
						},
						{
							id: "windowFunction",
							value: 0,
						},
					],
				},
				line2: {
					algo: "cz101",
					algo2: null,
					algoBlend: 0,
					baseWaveformA: "cosine",
					baseWaveformB: "cosine",
					window: "off",
					dcaBase: 1,
					dcwBase: 1,
					modulation: 0,
					detuneNote: 0,
					detuneFine: 5,
					octave: 1,
					dcoEnv: {
						steps: [
							{
								level: 27,
								rate: 87,
							},
							{
								level: 0,
								rate: 62,
							},
							{
								level: 0,
								rate: 99,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
						],
						sustainStep: 2,
						stepCount: 3,
						loop: false,
					},
					dcwEnv: {
						steps: [
							{
								level: 88,
								rate: 99,
							},
							{
								level: 96,
								rate: 83,
							},
							{
								level: 52,
								rate: 2,
							},
							{
								level: 0,
								rate: 26,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
						],
						sustainStep: 2,
						stepCount: 4,
						loop: false,
					},
					dcaEnv: {
						steps: [
							{
								level: 99,
								rate: 99,
							},
							{
								level: 0,
								rate: 36,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
						],
						sustainStep: 0,
						stepCount: 2,
						loop: false,
					},
					keyFollow: 0,
					algoControlsA: [
						{
							id: "preset",
							value: 0,
						},
						{
							id: "waveform1",
							value: 0,
						},
						{
							id: "waveform2",
							value: 0,
						},
						{
							id: "windowFunction",
							value: 0,
						},
					],
					algoControlsB: [],
				},
				frequency: 440,
				volume: 1,
				polyMode: "poly8",
				legato: false,
				velocityCurve: 0,
				portamento: {
					enabled: false,
					mode: "rate",
					rate: 0,
					time: 0.5,
				},
				lfo: {
					waveform: "sine",
					rate: 5,
					depth: 1,
					symmetry: 0.5,
					retrigger: false,
					offset: 0,
				},
				lfo2: {
					waveform: "sine",
					rate: 5,
					depth: 0,
					symmetry: 0.5,
					retrigger: false,
					offset: 0,
				},
				random: {
					rate: 2,
				},
				modEnv: {
					attack: 0.009999999776482582,
					decay: 0.10000000149011612,
					sustain: 0.5,
					release: 0.20000000298023224,
				},
				pitchBendRange: 2,
				modMatrix: {
					routes: [],
				},
				fxSlots: [
					{
						type: "empty",
					},
					{
						type: "empty",
					},
					{
						type: "empty",
					},
					{
						type: "vibrato",
						params: {
							enabled: true,
							waveform: 4,
							rate: 55,
							depth: 13,
							delay: 1440,
						},
					},
					{
						type: "empty",
					},
					{
						type: "empty",
					},
				],
			},
		},
		favorite: false,
		category: "",
		tags: [],
	},
} satisfies Record<string, FrontendPresetV1>;
