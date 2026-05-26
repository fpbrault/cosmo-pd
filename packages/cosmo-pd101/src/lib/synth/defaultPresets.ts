import { createPresetId } from "@/lib/synth/presetIdentity";
import type { FrontendPresetV1 } from "@/lib/synth/presetTypes";

const BUILTIN_PRESET_STARRED_BY_NAME: Record<string, boolean> = {
	Bliss: true,
	Rise: true,
	Chops: true,
	Organ: true,
	Wow: true,
	Plucking: true,
	Clav: true,
	Chants: true,
	Flute: true,
	Tweed: true,
};

const BUILTIN_PRESET_DEFINITIONS: Record<
	string,
	Omit<FrontendPresetV1, "id" | "source" | "author" | "starred"> & {
		favorite?: boolean;
	}
> = {
	Bliss: {
		name: "Bliss",
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
					baseWaveformA: "cosine",
					baseWaveformB: "cosine",
					window: "off",
					dcaBase: 1.0,
					dcwBase: 0.81119873046875,
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
								rate: 99,
							},
							{
								level: 0,
								rate: 34.512714843750004,
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
					dcwKeyFollow: 0,
					dcaKeyFollow: 0,
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
							value: 6,
						},
						{
							id: "waveform2",
							value: 6,
						},
						{
							id: "windowFunction",
							value: 1,
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
					dcwKeyFollow: 0,
					dcaKeyFollow: 0,
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
				tempoBpm: 120,
				polyMode: "poly8",
				legato: false,
				velocityCurve: 0,
				portamento: {
					enabled: false,
					mode: "time",
					rate: 85,
					time: 0.1,
				},
				lfo: {
					waveform: "sine",
					rate: 2.000000000000001,
					rateMode: "hz",
					syncDivision: "quarter",
					depth: 1,
					symmetry: 0.5,
					retrigger: false,
					offset: 0,
				},
				lfo2: {
					waveform: "sine",
					rate: 5,
					rateMode: "hz",
					syncDivision: "quarter",
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
							source: "macro1",
							destination: "line1AlgoParam1",
							amount: 0.5,
							enabled: true,
						},
						{
							source: "macro1",
							destination: "line1DcwBase",
							amount: 0.28,
							enabled: true,
						},
						{
							source: "macro3",
							destination: "line1DcaEnvStep2Rate",
							amount: -0.21,
							enabled: true,
						},
						{
							source: "macro3",
							destination: "line1DcwEnvStep1Rate",
							amount: -0.23,
							enabled: true,
						},
						{
							source: "modWheel",
							destination: "vibratoDepth",
							amount: 0.5,
							enabled: true,
						},
						{
							source: "macro2",
							destination: "line2DetuneFine",
							amount: 0.19,
							enabled: true,
						},
						{
							source: "macro4",
							destination: "delayMix",
							amount: 0.5,
							enabled: true,
						},
						{
							source: "macro4",
							destination: "shimmerVerbMix",
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
							enabled: true,
							time: 0.34,
							feedback: 0.46,
							mix: 0,
							tapeMode: true,
							warmth: 0.72,
						},
					},
					{
						type: "shimmerVerb",
						params: {
							enabled: true,
							shimmer: 0.638798828125,
							space: 0.6546679530824934,
							mix: 0,
						},
					},
					{
						type: "empty",
					},
					{
						type: "empty",
					},
				],
				macro1: 0.6000276436392716,
				macro2: 0,
				macro3: 0,
				macro4: 0,
				macroLabels: ["Brightness", "Detune", "Time", "FX"],
			},
		},
		favorite: false,
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
					algo: "fold",
					algo2: "bend",
					algoBlend: 0.02,
					baseWaveformA: "sine",
					baseWaveformB: "sine",
					window: "off",
					dcaBase: 1,
					dcwBase: 0.48,
					modulation: 0,
					detuneNote: 0,
					detuneFine: 0,
					octave: -1,
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
								rate: 84.24280644300032,
							},
							{
								level: 0,
								rate: 42.00076699524053,
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
					dcwKeyFollow: 0,
					dcaKeyFollow: 0,
					algoControlsA: [
						{
							id: "foldStages",
							value: 0.5803859560830252,
						},
						{
							id: "foldTilt",
							value: 0.0010312380109513963,
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
					baseWaveformA: "cosine",
					baseWaveformB: "cosine",
					window: "off",
					dcaBase: 1,
					dcwBase: 0.46,
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
					dcwKeyFollow: 0,
					dcaKeyFollow: 0,
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
					mode: "time",
					rate: 85,
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
							enabled: true,
							degrade: 0.22,
							wowDepth: 0.28,
							wowRate: 0.5,
							flutterDepth: 0.16,
							flutterRate: 5.9,
							tone: 0.42,
							mix: 1,
						},
					},
					{
						type: "grainDelay",
						params: {
							enabled: true,
							time: 0.5011327311652046,
							feedback: 0.5377412213597978,
							scatter: 0.30899538104951113,
							density: 0.5996484313692365,
							mix: 0.15453613281249998,
						},
					},
					{
						type: "reverb",
						params: {
							enabled: true,
							mix: 0.21814086914062497,
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
		tags: ["keys"],
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
					algoBlend: 0.0,
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
					dcwKeyFollow: 0,
					dcaKeyFollow: 0,
					algoControlsA: [
						{
							id: "pinchFocus",
							value: 0.1,
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
					dcwKeyFollow: 0,
					dcaKeyFollow: 0,
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
					rate: 85,
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
						{
							source: "macro1",
							destination: "line1AlgoParam1",
							amount: 1.0,
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
				macroLabels: ["Brightness", "MACRO 2", "MACRO 3", "MACRO 4"],
			},
		},
		favorite: false,
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
					dcwKeyFollow: 0,
					dcaKeyFollow: 0,
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
					dcwKeyFollow: 0,
					dcaKeyFollow: 0,
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
					rate: 85,
					time: 0.1,
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
		tags: ["organ"],
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
					dcwKeyFollow: 0,
					dcaKeyFollow: 0,
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
					dcwKeyFollow: 0,
					dcaKeyFollow: 0,
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
					rate: 85,
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
		tags: ["lead", "synth"],
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
					dcwKeyFollow: 8,
					dcaKeyFollow: 8,
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
					dcwKeyFollow: 0,
					dcaKeyFollow: 0,
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
					rate: 85,
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
		tags: ["synth", "lead"],
	},
	"Soft Brass": {
		name: "Soft Brass",
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
					detuneFine: 0,
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
					dcwKeyFollow: 0,
					dcaKeyFollow: 0,
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
					dcwKeyFollow: 0,
					dcaKeyFollow: 0,
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
					mode: "time",
					rate: 85,
					time: 0.1,
				},
				lfo: {
					waveform: "sine",
					rate: 2.000000000000001,
					depth: 1,
					symmetry: 0.5,
					retrigger: false,
					offset: 0,
				},
				lfo2: {
					waveform: "sine",
					rate: 2.000000000000001,
					depth: 1,
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
		tags: ["brass"],
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
					baseWaveformB: "sine",
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
					dcwKeyFollow: 0,
					dcaKeyFollow: 0,
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
					baseWaveformA: "sine",
					baseWaveformB: "sine",
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
					dcwKeyFollow: 0,
					dcaKeyFollow: 0,
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
				velocityCurve: 0,
				portamento: {
					enabled: false,
					mode: "time",
					rate: 85,
					time: 0.1,
				},
				lfo: {
					waveform: "triangle",
					rate: 2.000000000000001,
					depth: 1,
					symmetry: 0.5,
					retrigger: false,
					offset: 0,
				},
				lfo2: {
					waveform: "sine",
					rate: 2.000000000000001,
					depth: 1,
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
		tags: ["keys", "pluck"],
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
					dcwKeyFollow: 9,
					dcaKeyFollow: 9,
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
					dcwKeyFollow: 9,
					dcaKeyFollow: 9,
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
					mode: "time",
					rate: 85,
					time: 0.1,
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
		tags: ["piano", "keys"],
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
					octave: 0,
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
					dcwKeyFollow: 0,
					dcaKeyFollow: 0,
					algoControlsA: [
						{
							id: "pinchFocus",
							value: 0.20136642183576306,
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
					dcwKeyFollow: 0,
					dcaKeyFollow: 0,
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
					mode: "time",
					rate: 85,
					time: 0.1,
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
						type: "phaseMod",
						params: {
							enabled: true,
							pmPre: true,
							amount: 0.08300231933593749,
							ratio: 2.0046417236328127,
						},
					},
					{
						type: "junoChorus",
						params: {
							enabled: true,
							mode: 0,
							mix: 0.12263183593749996,
						},
					},
					{
						type: "eq8Band",
						params: {
							enabled: true,
							gainBand1: 3,
							gainBand2: 4,
							gainBand3: 3,
							gainBand4: 1,
							gainBand5: 0,
							gainBand6: -2,
							gainBand7: -4,
							gainBand8: -6,
						},
					},
					{
						type: "compressor",
						params: {
							enabled: false,
							thresholdDb: -21.2406005859375,
							ratio: 4,
							attackMs: 5,
							releaseMs: 80,
							makeupDb: 1.78318359375,
							mix: 1,
						},
					},
					{
						type: "empty",
					},
					{
						type: "delay",
						params: {
							enabled: true,
							time: 0.11,
							feedback: 0.22,
							mix: 0.13525512695312503,
							tapeMode: false,
							warmth: 0.2,
						},
					},
				],
			},
		},
		favorite: false,
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
					algoBlend: 0.4749960817609515,
					baseWaveformA: "sine",
					baseWaveformB: "sine",
					window: "off",
					dcaBase: 1,
					dcwBase: 0.513468017578125,
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
								rate: 54.615011728150506,
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
					dcwKeyFollow: 8,
					dcaKeyFollow: 8,
					algoControlsA: [
						{
							id: "twistHarmonics",
							value: 0.6020153172509924,
						},
						{
							id: "twistDepth",
							value: 0.47964999880109516,
						},
						{
							id: "twistPhase",
							value: 0,
						},
						{
							id: "twistShape",
							value: 0.5320704664457991,
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
					baseWaveformA: "sine",
					baseWaveformB: "sine",
					window: "off",
					dcaBase: 1,
					dcwBase: 0.49362854172590814,
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
								rate: 50.06628295898438,
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
								rate: 40.30952779020582,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
					dcwKeyFollow: 9,
					dcaKeyFollow: 9,
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
				tempoBpm: 120,
				polyMode: "poly8",
				legato: false,
				velocityCurve: 0,
				portamento: {
					enabled: false,
					mode: "time",
					rate: 85,
					time: 0.1,
				},
				lfo: {
					waveform: "sine",
					rate: 2.000000000000001,
					rateMode: "hz",
					syncDivision: "quarter",
					depth: 1,
					symmetry: 0.5,
					retrigger: false,
					offset: 0,
				},
				lfo2: {
					waveform: "sine",
					rate: 2.000000000000001,
					rateMode: "hz",
					syncDivision: "quarter",
					depth: 1,
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
						{
							source: "macro1",
							destination: "line1DcwBase",
							amount: 0.5,
							enabled: true,
						},
						{
							source: "macro1",
							destination: "line2DcwBase",
							amount: 1,
							enabled: true,
						},
						{
							source: "macro2",
							destination: "line2AlgoParam2",
							amount: -0.5,
							enabled: true,
						},
						{
							source: "macro2",
							destination: "line1AlgoParam1",
							amount: 0.5,
							enabled: true,
						},
						{
							source: "macro3",
							destination: "line2DcaEnvStep4Rate",
							amount: -0.1,
							enabled: true,
						},
						{
							source: "macro3",
							destination: "line2DcwEnvStep4Rate",
							amount: -0.32,
							enabled: true,
						},
						{
							source: "macro3",
							destination: "line1DcwEnvStep4Rate",
							amount: -0.42,
							enabled: true,
						},
						{
							source: "macro3",
							destination: "line1DcaEnvStep4Rate",
							amount: -0.1,
							enabled: true,
						},
						{
							source: "macro4",
							destination: "tremoloDepth",
							amount: 1,
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
						type: "tremolo",
						params: {
							enabled: true,
							rate: 6.742607525008064,
							depth: 0.0244873046875,
							waveform: 2,
							mix: 1,
						},
					},
					{
						type: "chorus",
						params: {
							enabled: false,
							rate: 0.35,
							depth: 3.3994445800781254,
							mix: 0.44,
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
				],
				macro1: 0.5039370078740157,
				macro2: 0,
				macro3: 0,
				macro4: 0,
				macroLabels: ["Brightness", "Timbre", "Time", "Movement"],
			},
		},
		favorite: false,
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
					dcwKeyFollow: 7,
					dcaKeyFollow: 7,
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
					dcwKeyFollow: 7,
					dcaKeyFollow: 7,
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
					rate: 85,
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
		tags: ["bass"],
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
					dcwKeyFollow: 7,
					dcaKeyFollow: 7,
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
					dcwKeyFollow: 7,
					dcaKeyFollow: 7,
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
					mode: "time",
					rate: 85,
					time: 0.1,
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
						type: "phaseMod",
						params: {
							enabled: false,
							pmPre: false,
							amount: 0.01379699707031249,
							ratio: 2,
						},
					},
					{
						type: "ringMod",
						params: {
							enabled: false,
							carrierHz: 1163.6280517578125,
							mix: 0.47427124023437495,
						},
					},
					{
						type: "empty",
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
						type: "compressor",
						params: {
							enabled: true,
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
		tags: ["bass"],
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
					dcwKeyFollow: 0,
					dcaKeyFollow: 0,
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
					dcwKeyFollow: 0,
					dcaKeyFollow: 0,
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
					mode: "time",
					rate: 85,
					time: 0.1,
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
		tags: ["pad"],
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
					dcwKeyFollow: 0,
					dcaKeyFollow: 0,
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
								level: 49.351158447265625,
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
					dcwKeyFollow: 2,
					dcaKeyFollow: 2,
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
					enabled: true,
					mode: "time",
					rate: 85,
					time: 0.1,
				},
				lfo: {
					waveform: "sine",
					rate: 2.000000000000001,
					depth: 1,
					symmetry: 0.5,
					retrigger: false,
					offset: 0,
				},
				lfo2: {
					waveform: "sine",
					rate: 2.000000000000001,
					depth: 1,
					symmetry: 0.5,
					retrigger: false,
					offset: 0,
				},
				random: {
					rate: 2,
				},
				modEnv: {
					attack: 0.010000000000000007,
					decay: 0.10000000149011612,
					sustain: 0.5,
					release: 0.20000000298023224,
				},
				pitchBendRange: 2,
				modMatrix: {
					routes: [
						{
							source: "aftertouch",
							destination: "line2DcwEnvStep1Level",
							amount: 0.41596539837973445,
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
							rate: 40,
							depth: 5.89589878490993,
							delay: 600,
						},
					},
					{
						type: "phaser",
						params: {
							enabled: false,
							rate: 0.35,
							depth: 0.45,
							feedback: 0.2,
							mix: 0.25,
						},
					},
					{
						type: "empty",
					},
					{
						type: "empty",
					},
					{
						type: "delay",
						params: {
							enabled: true,
							time: 0.5151404052734375,
							feedback: 0.46,
							mix: 0.344969482421875,
							tapeMode: true,
							warmth: 0.72,
						},
					},
					{
						type: "shimmerVerb",
						params: {
							enabled: true,
							shimmer: 0.85,
							space: 0.95,
							mix: 0.11443969726562503,
						},
					},
				],
			},
		},
		favorite: false,
		tags: ["wind"],
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
					dcwKeyFollow: 0,
					dcaKeyFollow: 0,
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
					dcwKeyFollow: 0,
					dcaKeyFollow: 0,
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
					mode: "time",
					rate: 85,
					time: 0.1,
				},
				lfo: {
					waveform: "sine",
					rate: 2.000000000000001,
					depth: 1,
					symmetry: 0.5,
					retrigger: false,
					offset: 0,
				},
				lfo2: {
					waveform: "sine",
					rate: 2.000000000000001,
					depth: 1,
					symmetry: 0.5,
					retrigger: false,
					offset: 0,
				},
				random: {
					rate: 2,
				},
				modEnv: {
					attack: 0.010000000000000007,
					decay: 0.20000000000000015,
					sustain: 0.5,
					release: 0.4000000000000003,
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
						type: "distortion",
						params: {
							enabled: false,
							mode: 2,
							drive: 0.35327392578125,
							tone: 0.59924560546875,
							mix: 0.35631591796874995,
						},
					},
					{
						type: "compressor",
						params: {
							enabled: false,
							thresholdDb: -26.302734375000007,
							ratio: 2,
							attackMs: 10,
							releaseMs: 150,
							makeupDb: 3,
							mix: 1,
						},
					},
				],
			},
		},
		favorite: false,
		tags: ["bass"],
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
					dcwKeyFollow: 0,
					dcaKeyFollow: 0,
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
					dcwKeyFollow: 0,
					dcaKeyFollow: 0,
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
					rate: 85,
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
		tags: ["synth", "lead"],
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
								level: 0,
								rate: 30.78208740234374,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
					dcwKeyFollow: 0,
					dcaKeyFollow: 0,
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
					dcwKeyFollow: 0,
					dcaKeyFollow: 0,
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
					mode: "time",
					rate: 85,
					time: 0.1,
				},
				lfo: {
					waveform: "sine",
					rate: 2.000000000000001,
					depth: 1,
					symmetry: 0.5,
					retrigger: false,
					offset: 0,
				},
				lfo2: {
					waveform: "sine",
					rate: 2.000000000000001,
					depth: 1,
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
							destination: "line1DcaEnvStep3Rate",
							amount: -0.227151186806815,
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
							rate: 25,
							depth: 6,
							delay: 960,
						},
					},
					{
						type: "phaseMod",
						params: {
							enabled: false,
							pmPre: false,
							amount: 0.04171875,
							ratio: 1,
						},
					},
					{
						type: "phaser",
						params: {
							enabled: false,
							rate: 0.9,
							depth: 0.78,
							feedback: 0.55,
							mix: 0.43,
						},
					},
					{
						type: "grainDelay",
						params: {
							enabled: true,
							time: 0.35,
							feedback: 0.22,
							scatter: 0.32,
							density: 0.58,
							mix: 0.4,
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
					dcwKeyFollow: 0,
					dcaKeyFollow: 0,
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
					dcwKeyFollow: 0,
					dcaKeyFollow: 0,
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
					rate: 85,
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
		tags: ["lead"],
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
					dcwKeyFollow: 0,
					dcaKeyFollow: 0,
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
					dcwKeyFollow: 0,
					dcaKeyFollow: 0,
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
					mode: "time",
					rate: 85,
					time: 0.1,
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
		tags: ["pad"],
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
					dcwKeyFollow: 0,
					dcaKeyFollow: 0,
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
					dcwKeyFollow: 0,
					dcaKeyFollow: 0,
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
					mode: "time",
					rate: 85,
					time: 0.1,
				},
				lfo: {
					waveform: "sine",
					rate: 2.000000000000001,
					depth: 1,
					symmetry: 0.5,
					retrigger: false,
					offset: 0,
				},
				lfo2: {
					waveform: "sine",
					rate: 2.000000000000001,
					depth: 1,
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
						type: "phaser",
						params: {
							enabled: false,
							rate: 0.35,
							depth: 0.45,
							feedback: 0.2,
							mix: 0.25,
						},
					},
					{
						type: "delay",
						params: {
							enabled: true,
							time: 0.4012959838867187,
							feedback: 0.7510517822265625,
							mix: 0.11745361328125001,
							tapeMode: true,
							warmth: 0.681231689453125,
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
		tags: ["pad"],
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
								rate: 47.634979248046875,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
					dcwKeyFollow: 0,
					dcaKeyFollow: 0,
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
								rate: 31.597752685546883,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
					dcwKeyFollow: 0,
					dcaKeyFollow: 0,
					algoControlsA: [
						{
							id: "preset",
							value: 0,
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
					mode: "time",
					rate: 85,
					time: 0.1,
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
						type: "junoChorus",
						params: {
							enabled: true,
							mode: 1,
							mix: 0.1607016530309301,
						},
					},
					{
						type: "empty",
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
		tags: ["synth", "lead"],
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
					dcwKeyFollow: 0,
					dcaKeyFollow: 0,
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
					dcwKeyFollow: 0,
					dcaKeyFollow: 0,
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
					mode: "time",
					rate: 85,
					time: 0.1,
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
		tags: ["synth"],
	},
};

export const DEFAULT_SYNTH_PRESETS: Record<string, FrontendPresetV1> =
	Object.fromEntries(
		Object.entries(BUILTIN_PRESET_DEFINITIONS).map(([name, preset]) => {
			const starred = BUILTIN_PRESET_STARRED_BY_NAME[name] ?? false;
			const { favorite: _favorite, ...presetFields } = preset;
			const builtInPreset: FrontendPresetV1 = {
				...presetFields,
				id: createPresetId({
					name: preset.name,
					source: "cosmo-factory",
					author: "Purr Audio",
					starred,
					tags: preset.tags,
					data: preset.data,
				}),
				source: "cosmo-factory",
				author: "Purr Audio",
				starred,
			};

			return [name, builtInPreset];
		}),
	);
