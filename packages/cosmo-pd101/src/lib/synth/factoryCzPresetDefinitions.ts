import type { SynthPresetV1 } from "@/lib/synth/bindings/synth";
import type { PresetTagOptions } from "./presetTags";

type FactoryPresetDefinition = {
	name: string;
	data: SynthPresetV1;
	tags?: PresetTagOptions[];
};

export const FACTORY_CZ_PRESET_DEFINITIONS: FactoryPresetDefinition[] = [
	{
		name: "2L PLUCK+BRSS",
		tags: ["brass"],
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
								level: 90,
								rate: 99,
							},
							{
								level: 50,
								rate: 75,
							},
							{
								level: 58,
								rate: 37,
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
						],
						sustainStep: 2,
						stepCount: 4,
						loop: false,
					},
					dcaEnv: {
						steps: [
							{
								level: 99,
								rate: 97,
							},
							{
								level: 99,
								rate: 77,
							},
							{
								level: 95,
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
							{
								level: 0,
								rate: 50,
							},
						],
						sustainStep: 2,
						stepCount: 3,
						loop: false,
					},
					keyFollow: 3,
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
					detuneFine: 5,
					octave: 1,
					dcoEnv: {
						steps: [
							{
								level: 63,
								rate: 88,
							},
							{
								level: 6,
								rate: 75,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
								level: 61,
								rate: 43,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
								rate: 70,
							},
							{
								level: 13,
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
							{
								level: 0,
								rate: 50,
							},
						],
						sustainStep: 1,
						stepCount: 2,
						loop: false,
					},
					keyFollow: 1,
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
				volume: 0.8,
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
							rate: 50,
							depth: 26,
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
	},
	{
		name: "2LINE W/REVERB",
		tags: ["synth", "lead"],
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
								level: 99,
								rate: 75,
							},
							{
								level: 84,
								rate: 75,
							},
							{
								level: 28,
								rate: 49,
							},
							{
								level: 75,
								rate: 49,
							},
							{
								level: 0,
								rate: 49,
							},
							{
								level: 70,
								rate: 49,
							},
							{
								level: 0,
								rate: 39,
							},
							{
								level: 0,
								rate: 50,
							},
						],
						sustainStep: 1,
						stepCount: 8,
						loop: false,
					},
					keyFollow: 9,
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
								level: 12,
								rate: 99,
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
								rate: 95,
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
					keyFollow: 1,
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
					algoControlsB: [],
				},
				frequency: 440,
				volume: 0.8,
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
							enabled: false,
							waveform: 1,
							rate: 55,
							depth: 0,
							delay: 33,
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
	},
	{
		name: "2X ATTACK 8V",
		tags: ["synth", "keys"],
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
								level: 66,
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
								level: 46,
								rate: 40,
							},
							{
								level: 60,
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
						],
						sustainStep: 1,
						stepCount: 3,
						loop: false,
					},
					dcaEnv: {
						steps: [
							{
								level: 96,
								rate: 99,
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
							id: "preset",
							value: 0,
						},
						{
							id: "waveform1",
							value: 4,
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
					detuneFine: 6,
					octave: 0,
					dcoEnv: {
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
						stepCount: 1,
						loop: false,
					},
					dcwEnv: {
						steps: [
							{
								level: 50,
								rate: 82,
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
								level: 39,
								rate: 80,
							},
							{
								level: 99,
								rate: 78,
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
						],
						sustainStep: 0,
						stepCount: 4,
						loop: false,
					},
					keyFollow: 9,
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
					algoControlsB: [],
				},
				frequency: 440,
				volume: 0.8,
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
							rate: 43,
							depth: 6,
							delay: 26,
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
	},
	{
		name: "8-NOTE PIANO",
		tags: ["piano"],
		data: {
			schemaVersion: 1,
			params: {
				lineSelect: "L1",
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
								level: 74,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
								level: 78,
								rate: 99,
							},
							{
								level: 68,
								rate: 48,
							},
							{
								level: 64,
								rate: 48,
							},
							{
								level: 48,
								rate: 48,
							},
							{
								level: 45,
								rate: 48,
							},
							{
								level: 41,
								rate: 50,
							},
							{
								level: 34,
								rate: 50,
							},
							{
								level: 0,
								rate: 24,
							},
						],
						sustainStep: 7,
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
								level: 74,
								rate: 33,
							},
							{
								level: 82,
								rate: 36,
							},
							{
								level: 24,
								rate: 33,
							},
							{
								level: 24,
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
						],
						sustainStep: 4,
						stepCount: 5,
						loop: false,
					},
					keyFollow: 9,
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
					algoControlsB: [],
				},
				frequency: 440,
				volume: 0.8,
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
							rate: 51,
							depth: 5,
							delay: 53,
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
	},
	{
		name: "12 STRING 1",
		tags: ["guitar"],
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
						sustainStep: 0,
						stepCount: 1,
						loop: false,
					},
					dcwEnv: {
						steps: [
							{
								level: 99,
								rate: 89,
							},
							{
								level: 62,
								rate: 42,
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
						],
						sustainStep: 2,
						stepCount: 3,
						loop: false,
					},
					dcaEnv: {
						steps: [
							{
								level: 89,
								rate: 79,
							},
							{
								level: 0,
								rate: 22,
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
							{
								level: 0,
								rate: 50,
							},
						],
						sustainStep: 2,
						stepCount: 3,
						loop: false,
					},
					keyFollow: 4,
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
					detuneFine: 4,
					octave: 1,
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
								level: 67,
								rate: 43,
							},
							{
								level: 67,
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
						],
						sustainStep: 2,
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
								level: 81,
								rate: 84,
							},
							{
								level: 0,
								rate: 35,
							},
							{
								level: 0,
								rate: 68,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
					keyFollow: 6,
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
				volume: 0.8,
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
							enabled: false,
							waveform: 1,
							rate: 52,
							depth: 0,
							delay: 49,
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
	},
	{
		name: "ABRACADABRA",
		tags: ["synth", "lead"],
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
								level: 99,
								rate: 99,
							},
							{
								level: 96,
								rate: 83,
							},
							{
								level: 83,
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
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
								level: 99,
								rate: 99,
							},
							{
								level: 96,
								rate: 83,
							},
							{
								level: 83,
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
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
				frequency: 440,
				volume: 0.8,
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
							delay: 7,
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
	},
	{
		name: "ACC PIANO",
		tags: ["piano"],
		data: {
			schemaVersion: 1,
			params: {
				lineSelect: "L1+L2'",
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
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
								level: 76,
								rate: 99,
							},
							{
								level: 44,
								rate: 19,
							},
							{
								level: 0,
								rate: 37,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
					dcaEnv: {
						steps: [
							{
								level: 99,
								rate: 93,
							},
							{
								level: 80,
								rate: 30,
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
						],
						sustainStep: 2,
						stepCount: 4,
						loop: false,
					},
					keyFollow: 9,
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
					detuneFine: -1,
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
						stepCount: 1,
						loop: false,
					},
					dcwEnv: {
						steps: [
							{
								level: 80,
								rate: 99,
							},
							{
								level: 44,
								rate: 18,
							},
							{
								level: 0,
								rate: 37,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
								rate: 94,
							},
							{
								level: 50,
								rate: 30,
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
						],
						sustainStep: 2,
						stepCount: 4,
						loop: false,
					},
					keyFollow: 9,
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
				frequency: 440,
				volume: 0.8,
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
							enabled: false,
							waveform: 1,
							rate: 0,
							depth: 0,
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
	},
	{
		name: "ACCORDIAN",
		tags: ["wind"],
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
					dcaBase: 1,
					dcwBase: 1,
					modulation: 0,
					detuneNote: 0,
					detuneFine: 0,
					octave: 0,
					dcoEnv: {
						steps: [
							{
								level: 33,
								rate: 99,
							},
							{
								level: 0,
								rate: 68,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
								level: 88,
								rate: 73,
							},
							{
								level: 96,
								rate: 47,
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
								level: 85,
								rate: 82,
							},
							{
								level: 64,
								rate: 33,
							},
							{
								level: 37,
								rate: 62,
							},
							{
								level: 0,
								rate: 62,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
					algo2: "cz101",
					algoBlend: 0,
					baseWaveformA: "cosine",
					baseWaveformB: "cosine",
					window: "off",
					dcaBase: 1,
					dcwBase: 1,
					modulation: 0,
					detuneNote: 0,
					detuneFine: 8,
					octave: 1,
					dcoEnv: {
						steps: [
							{
								level: 33,
								rate: 99,
							},
							{
								level: 0,
								rate: 68,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
								level: 88,
								rate: 73,
							},
							{
								level: 96,
								rate: 47,
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
								level: 85,
								rate: 82,
							},
							{
								level: 64,
								rate: 33,
							},
							{
								level: 37,
								rate: 62,
							},
							{
								level: 0,
								rate: 62,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
				volume: 0.8,
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
							depth: 4,
							delay: 38,
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
	},
	{
		name: "ACCOUSTICBASS",
		tags: ["bass"],
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
					dcaBase: 1,
					dcwBase: 1,
					modulation: 0,
					detuneNote: 0,
					detuneFine: 0,
					octave: -1,
					dcoEnv: {
						steps: [
							{
								level: 12,
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
						sustainStep: 1,
						stepCount: 2,
						loop: false,
					},
					dcwEnv: {
						steps: [
							{
								level: 78,
								rate: 99,
							},
							{
								level: 12,
								rate: 50,
							},
							{
								level: 50,
								rate: 50,
							},
							{
								level: 12,
								rate: 50,
							},
							{
								level: 50,
								rate: 50,
							},
							{
								level: 12,
								rate: 50,
							},
							{
								level: 50,
								rate: 50,
							},
							{
								level: 0,
								rate: 24,
							},
						],
						sustainStep: 6,
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
								level: 74,
								rate: 37,
							},
							{
								level: 87,
								rate: 36,
							},
							{
								level: 29,
								rate: 33,
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
						],
						sustainStep: 4,
						stepCount: 5,
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
							value: 4,
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
					detuneFine: 1,
					octave: -1,
					dcoEnv: {
						steps: [
							{
								level: 74,
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
						sustainStep: 1,
						stepCount: 2,
						loop: false,
					},
					dcwEnv: {
						steps: [
							{
								level: 75,
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
								level: 0,
								rate: 54,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
							value: 6,
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
							value: 2,
						},
					],
					algoControlsB: [],
				},
				frequency: 440,
				volume: 0.8,
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
							rate: 51,
							depth: 5,
							delay: 53,
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
	},
	{
		name: "AFRICAN DRUM",
		tags: ["drum"],
		data: {
			schemaVersion: 1,
			params: {
				lineSelect: "L1+L2'",
				modMode: "ring",
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
								level: 99,
								rate: 94,
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
								level: 96,
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
								level: 0,
								rate: 45,
							},
							{
								level: 93,
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
						],
						sustainStep: 1,
						stepCount: 3,
						loop: false,
					},
					keyFollow: 0,
					algoControlsA: [
						{
							id: "preset",
							value: 7,
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
							value: 3,
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
					detuneNote: 9,
					detuneFine: 55,
					octave: -1,
					dcoEnv: {
						steps: [
							{
								level: 99,
								rate: 99,
							},
							{
								level: 53,
								rate: 99,
							},
							{
								level: 0,
								rate: 13,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
								level: 99,
								rate: 99,
							},
							{
								level: 96,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
								level: 35,
								rate: 53,
							},
							{
								level: 93,
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
					keyFollow: 8,
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
				frequency: 440,
				volume: 0.8,
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
							enabled: false,
							waveform: 3,
							rate: 55,
							depth: 0,
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
	},
	{
		name: "AFRO-PERC. 2",
		tags: ["drum"],
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
								level: 49,
								rate: 99,
							},
							{
								level: 15,
								rate: 99,
							},
							{
								level: 0,
								rate: 99,
							},
							{
								level: 45,
								rate: 99,
							},
							{
								level: 0,
								rate: 99,
							},
							{
								level: 71,
								rate: 99,
							},
							{
								level: 0,
								rate: 99,
							},
						],
						sustainStep: 7,
						stepCount: 8,
						loop: false,
					},
					dcaEnv: {
						steps: [
							{
								level: 99,
								rate: 94,
							},
							{
								level: 0,
								rate: 45,
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
						],
						sustainStep: 1,
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
							value: 6,
						},
						{
							id: "waveform2",
							value: 5,
						},
						{
							id: "windowFunction",
							value: 3,
						},
					],
					algoControlsB: [],
				},
				frequency: 440,
				volume: 0.8,
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
							enabled: false,
							waveform: 1,
							rate: 53,
							depth: 0,
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
	},
	{
		name: "ALIEN 1",
		tags: ["effect"],
		data: {
			schemaVersion: 1,
			params: {
				lineSelect: "L1+L2'",
				modMode: "ring",
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
					octave: 1,
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
								level: 84,
								rate: 76,
							},
							{
								level: 0,
								rate: 37,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
								rate: 27,
							},
							{
								level: 80,
								rate: 46,
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
					detuneNote: 1,
					detuneFine: 39,
					octave: 1,
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
								level: 42,
								rate: 76,
							},
							{
								level: 0,
								rate: 89,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
								rate: 33,
							},
							{
								level: 81,
								rate: 23,
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
				frequency: 440,
				volume: 0.8,
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
							rate: 60,
							depth: 99,
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
	},
	{
		name: "ALL TOO MUCH",
		tags: ["organ"],
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
							value: 6,
						},
						{
							id: "waveform2",
							value: 2,
						},
						{
							id: "windowFunction",
							value: 3,
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
								rate: 34,
							},
						],
						sustainStep: 7,
						stepCount: 8,
						loop: false,
					},
					dcwEnv: {
						steps: [
							{
								level: 80,
								rate: 92,
							},
							{
								level: 62,
								rate: 42,
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
					dcaEnv: {
						steps: [
							{
								level: 99,
								rate: 90,
							},
							{
								level: 0,
								rate: 22,
							},
							{
								level: 0,
								rate: 86,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
							value: 1,
						},
						{
							id: "windowFunction",
							value: 0,
						},
					],
					algoControlsB: [
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
				},
				frequency: 440,
				volume: 0.8,
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
							rate: 52,
							depth: 4,
							delay: 51,
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
	},
	{
		name: "ANALG SUBBASS",
		tags: ["bass"],
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
					octave: -1,
					dcoEnv: {
						steps: [
							{
								level: 14,
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
						sustainStep: 1,
						stepCount: 2,
						loop: false,
					},
					dcwEnv: {
						steps: [
							{
								level: 96,
								rate: 81,
							},
							{
								level: 11,
								rate: 35,
							},
							{
								level: 75,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
								level: 86,
								rate: 99,
							},
							{
								level: 12,
								rate: 21,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
					keyFollow: 4,
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
					algo2: "cz101",
					algoBlend: 0,
					baseWaveformA: "cosine",
					baseWaveformB: "cosine",
					window: "off",
					dcaBase: 1,
					dcwBase: 1,
					modulation: 0,
					detuneNote: 0,
					detuneFine: 8,
					octave: -1,
					dcoEnv: {
						steps: [
							{
								level: 42,
								rate: 62,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
								level: 96,
								rate: 81,
							},
							{
								level: 11,
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
								level: 86,
								rate: 99,
							},
							{
								level: 12,
								rate: 21,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
					keyFollow: 4,
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
				volume: 0.8,
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
							rate: 61,
							depth: 23,
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
	},
	{
		name: "ANALOG 2",
		tags: ["synth", "lead"],
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
								level: 99,
								rate: 66,
							},
							{
								level: 65,
								rate: 53,
							},
							{
								level: 22,
								rate: 21,
							},
							{
								level: 29,
								rate: 20,
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
						],
						sustainStep: 1,
						stepCount: 5,
						loop: false,
					},
					dcaEnv: {
						steps: [
							{
								level: 99,
								rate: 80,
							},
							{
								level: 99,
								rate: 55,
							},
							{
								level: 76,
								rate: 31,
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
					detuneFine: 8,
					octave: 1,
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
				volume: 0.8,
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
							depth: 11,
							delay: 6,
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
	},
	{
		name: "ANALOG 3",
		tags: ["synth", "lead"],
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
					dcaBase: 1,
					dcwBase: 1,
					modulation: 0,
					detuneNote: 0,
					detuneFine: 0,
					octave: 0,
					dcoEnv: {
						steps: [
							{
								level: 58,
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
								rate: 92,
							},
							{
								level: 62,
								rate: 42,
							},
							{
								level: 0,
								rate: 43,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
								rate: 99,
							},
							{
								level: 71,
								rate: 8,
							},
							{
								level: 0,
								rate: 86,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
					octave: 1,
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
				volume: 0.8,
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
							rate: 51,
							depth: 7,
							delay: 51,
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
	},
	{
		name: "ANALOG 5",
		tags: ["synth", "lead"],
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
								level: 41,
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
								level: 57,
								rate: 99,
							},
							{
								level: 14,
								rate: 78,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
							value: 2,
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
					detuneFine: 8,
					octave: 0,
					dcoEnv: {
						steps: [
							{
								level: 4,
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
								level: 83,
								rate: 99,
							},
							{
								level: 61,
								rate: 89,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
								level: 77,
								rate: 38,
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
							id: "preset",
							value: 0,
						},
						{
							id: "waveform1",
							value: 2,
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
				frequency: 440,
				volume: 0.8,
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
							rate: 49,
							depth: 16,
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
	},
	{
		name: "ANALOG 6",
		tags: ["synth", "lead"],
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
								level: 58,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
								level: 77,
								rate: 99,
							},
							{
								level: 79,
								rate: 12,
							},
							{
								level: 8,
								rate: 30,
							},
							{
								level: 0,
								rate: 15,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
					dcaEnv: {
						steps: [
							{
								level: 99,
								rate: 99,
							},
							{
								level: 86,
								rate: 19,
							},
							{
								level: 65,
								rate: 23,
							},
							{
								level: 39,
								rate: 50,
							},
							{
								level: 0,
								rate: 23,
							},
							{
								level: 0,
								rate: 50,
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
					keyFollow: 0,
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
					detuneFine: 8,
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
								level: 99,
								rate: 92,
							},
							{
								level: 62,
								rate: 42,
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
						],
						sustainStep: 2,
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
								level: 12,
								rate: 22,
							},
							{
								level: 0,
								rate: 86,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
					algoControlsB: [],
				},
				frequency: 440,
				volume: 0.8,
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
							rate: 44,
							depth: 7,
							delay: 51,
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
	},
	{
		name: "ANALOG PLUCK",
		tags: ["pluck", "synth", "lead"],
		data: {
			schemaVersion: 1,
			params: {
				lineSelect: "L1+L2'",
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
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
								level: 83,
								rate: 44,
							},
							{
								level: 0,
								rate: 13,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
								rate: 53,
							},
							{
								level: 99,
								rate: 84,
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
						],
						sustainStep: 1,
						stepCount: 3,
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
					algo2: "cz101",
					algoBlend: 0,
					baseWaveformA: "cosine",
					baseWaveformB: "cosine",
					window: "off",
					dcaBase: 1,
					dcwBase: 1,
					modulation: 0,
					detuneNote: 0,
					detuneFine: 6,
					octave: 0,
					dcoEnv: {
						steps: [
							{
								level: 76,
								rate: 99,
							},
							{
								level: 0,
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
								level: 23,
								rate: 64,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
					dcaEnv: {
						steps: [
							{
								level: 99,
								rate: 99,
							},
							{
								level: 99,
								rate: 84,
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
						sustainStep: 1,
						stepCount: 3,
						loop: false,
					},
					keyFollow: 5,
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
				frequency: 440,
				volume: 0.8,
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
							rate: 44,
							depth: 8,
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
	},
	{
		name: "ANALOG STRNGS",
		tags: ["string", "synth", "lead"],
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
					octave: 1,
					dcoEnv: {
						steps: [
							{
								level: 33,
								rate: 99,
							},
							{
								level: 0,
								rate: 57,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
								level: 90,
								rate: 60,
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
								level: 75,
								rate: 74,
							},
							{
								level: 99,
								rate: 55,
							},
							{
								level: 0,
								rate: 42,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
					keyFollow: 6,
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
					detuneFine: 8,
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
						stepCount: 1,
						loop: false,
					},
					dcaEnv: {
						steps: [
							{
								level: 75,
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
				volume: 0.8,
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
							depth: 5,
							delay: 43,
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
	},
	{
		name: "ANALOG SYNTH 1",
		tags: ["synth", "lead"],
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
					dcaBase: 1,
					dcwBase: 1,
					modulation: 0,
					detuneNote: 0,
					detuneFine: 0,
					octave: 0,
					dcoEnv: {
						steps: [
							{
								level: 33,
								rate: 99,
							},
							{
								level: 0,
								rate: 68,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
								rate: 36,
							},
							{
								level: 96,
								rate: 47,
							},
							{
								level: 48,
								rate: 37,
							},
							{
								level: 27,
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
						sustainStep: 3,
						stepCount: 5,
						loop: false,
					},
					dcaEnv: {
						steps: [
							{
								level: 99,
								rate: 80,
							},
							{
								level: 91,
								rate: 36,
							},
							{
								level: 51,
								rate: 79,
							},
							{
								level: 0,
								rate: 21,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
					keyFollow: 2,
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
					detuneFine: 7,
					octave: 0,
					dcoEnv: {
						steps: [
							{
								level: 33,
								rate: 99,
							},
							{
								level: 0,
								rate: 68,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
								rate: 67,
							},
							{
								level: 96,
								rate: 47,
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
								rate: 82,
							},
							{
								level: 91,
								rate: 36,
							},
							{
								level: 51,
								rate: 79,
							},
							{
								level: 0,
								rate: 55,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
					keyFollow: 2,
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
				volume: 0.8,
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
							enabled: false,
							waveform: 1,
							rate: 0,
							depth: 0,
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
	},
	{
		name: "BALINESE BELL",
		tags: ["bell"],
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
					octave: 0,
					dcoEnv: {
						steps: [
							{
								level: 99,
								rate: 94,
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
								level: 99,
								rate: 99,
							},
							{
								level: 0,
								rate: 44,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 62,
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
						],
						sustainStep: 7,
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
							value: 5,
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
					algo: "cz101",
					algo2: "cz101",
					algoBlend: 0,
					baseWaveformA: "cosine",
					baseWaveformB: "cosine",
					window: "off",
					dcaBase: 1,
					dcwBase: 1,
					modulation: 0,
					detuneNote: 10,
					detuneFine: 26,
					octave: 1,
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
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
					dcaEnv: {
						steps: [
							{
								level: 99,
								rate: 99,
							},
							{
								level: 0,
								rate: 55,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
							value: 5,
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
					algoControlsB: [
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
				},
				frequency: 440,
				volume: 0.8,
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
							enabled: false,
							waveform: 1,
							rate: 0,
							depth: 0,
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
	},
	{
		name: "BANJO TREMOLO",
		tags: ["guitar"],
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
					dcaEnv: {
						steps: [
							{
								level: 99,
								rate: 99,
							},
							{
								level: 89,
								rate: 55,
							},
							{
								level: 55,
								rate: 31,
							},
							{
								level: 0,
								rate: 31,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
							value: 6,
						},
						{
							id: "waveform2",
							value: 4,
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
							value: 4,
						},
						{
							id: "waveform2",
							value: 4,
						},
						{
							id: "windowFunction",
							value: 3,
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
					detuneFine: 10,
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
					dcaEnv: {
						steps: [
							{
								level: 99,
								rate: 99,
							},
							{
								level: 89,
								rate: 55,
							},
							{
								level: 55,
								rate: 31,
							},
							{
								level: 0,
								rate: 31,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
				frequency: 440,
				volume: 0.8,
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
							depth: 21,
							delay: 49,
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
	},
	{
		name: "BASS3",
		tags: ["bass"],
		data: {
			schemaVersion: 1,
			params: {
				lineSelect: "L1+L2'",
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
								level: 99,
								rate: 99,
							},
							{
								level: 61,
								rate: 58,
							},
							{
								level: 74,
								rate: 44,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
							value: 4,
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
				volume: 0.8,
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
							rate: 55,
							depth: 23,
							delay: 33,
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
	},
	{
		name: "BELL-PIANO",
		tags: ["bell", "piano"],
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
						sustainStep: 7,
						stepCount: 8,
						loop: false,
					},
					dcwEnv: {
						steps: [
							{
								level: 54,
								rate: 97,
							},
							{
								level: 79,
								rate: 34,
							},
							{
								level: 47,
								rate: 29,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
					dcaEnv: {
						steps: [
							{
								level: 99,
								rate: 99,
							},
							{
								level: 89,
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
					keyFollow: 9,
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
					octave: 3,
					dcoEnv: {
						steps: [
							{
								level: 80,
								rate: 99,
							},
							{
								level: 0,
								rate: 43,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
								level: 18,
								rate: 99,
							},
							{
								level: 30,
								rate: 95,
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
					dcaEnv: {
						steps: [
							{
								level: 99,
								rate: 99,
							},
							{
								level: 99,
								rate: 29,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
					keyFollow: 7,
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
				volume: 0.8,
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
							rate: 50,
							depth: 6,
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
	},
	{
		name: "BELLFLUTE/VERB",
		tags: ["bell", "wind"],
		data: {
			schemaVersion: 1,
			params: {
				lineSelect: "L1+L2'",
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
					octave: 1,
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
						stepCount: 1,
						loop: false,
					},
					dcwEnv: {
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
					dcaEnv: {
						steps: [
							{
								level: 70,
								rate: 99,
							},
							{
								level: 95,
								rate: 99,
							},
							{
								level: 48,
								rate: 73,
							},
							{
								level: 82,
								rate: 49,
							},
							{
								level: 16,
								rate: 49,
							},
							{
								level: 77,
								rate: 49,
							},
							{
								level: 0,
								rate: 39,
							},
							{
								level: 0,
								rate: 50,
							},
						],
						sustainStep: 1,
						stepCount: 7,
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
					detuneNote: 11,
					detuneFine: 0,
					octave: 3,
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
						stepCount: 1,
						loop: false,
					},
					dcwEnv: {
						steps: [
							{
								level: 27,
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
					algoControlsB: [],
				},
				frequency: 440,
				volume: 0.8,
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
							enabled: false,
							waveform: 1,
							rate: 0,
							depth: 0,
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
	},
	{
		name: "BELLS",
		tags: ["bell"],
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
								level: 0,
								rate: 99,
							},
							{
								level: 0,
								rate: 58,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
							value: 1,
						},
						{
							id: "windowFunction",
							value: 0,
						},
					],
					algoControlsB: [
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
					detuneFine: 3,
					octave: 4,
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
								level: 0,
								rate: 99,
							},
							{
								level: 0,
								rate: 59,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
				volume: 0.8,
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
							rate: 51,
							depth: 4,
							delay: 19,
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
	},
	{
		name: "BESTCLAVICHORD",
		tags: ["piano"],
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
								level: 62,
								rate: 99,
							},
							{
								level: 0,
								rate: 76,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
								level: 83,
								rate: 99,
							},
							{
								level: 22,
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
						sustainStep: 1,
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
								level: 0,
								rate: 25,
							},
							{
								level: 0,
								rate: 80,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
							id: "preset",
							value: 0,
						},
						{
							id: "waveform1",
							value: 2,
						},
						{
							id: "waveform2",
							value: 6,
						},
						{
							id: "windowFunction",
							value: 3,
						},
					],
					algoControlsB: [
						{
							id: "preset",
							value: 7,
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
							value: 3,
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
					octave: 3,
					dcoEnv: {
						steps: [
							{
								level: 50,
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
								level: 83,
								rate: 99,
							},
							{
								level: 61,
								rate: 89,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
				frequency: 440,
				volume: 0.8,
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
							enabled: false,
							waveform: 1,
							rate: 35,
							depth: 0,
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
	},
	{
		name: "BIG BRASS",
		tags: ["brass"],
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
					dcaBase: 1,
					dcwBase: 1,
					modulation: 0,
					detuneNote: 0,
					detuneFine: 0,
					octave: 0,
					dcoEnv: {
						steps: [
							{
								level: 33,
								rate: 99,
							},
							{
								level: 0,
								rate: 68,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
								rate: 76,
							},
							{
								level: 96,
								rate: 47,
							},
							{
								level: 95,
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
								level: 61,
								rate: 99,
							},
							{
								level: 99,
								rate: 77,
							},
							{
								level: 99,
								rate: 74,
							},
							{
								level: 59,
								rate: 79,
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
						],
						sustainStep: 2,
						stepCount: 5,
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
					detuneFine: 6,
					octave: 0,
					dcoEnv: {
						steps: [
							{
								level: 99,
								rate: 99,
							},
							{
								level: 0,
								rate: 90,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
								rate: 76,
							},
							{
								level: 96,
								rate: 47,
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
								level: 61,
								rate: 99,
							},
							{
								level: 99,
								rate: 77,
							},
							{
								level: 91,
								rate: 67,
							},
							{
								level: 0,
								rate: 70,
							},
							{
								level: 99,
								rate: 99,
							},
							{
								level: 59,
								rate: 79,
							},
							{
								level: 0,
								rate: 33,
							},
							{
								level: 0,
								rate: 50,
							},
						],
						sustainStep: 4,
						stepCount: 7,
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
				volume: 0.8,
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
							enabled: false,
							waveform: 1,
							rate: 0,
							depth: 0,
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
	},
	{
		name: "BIGBASS",
		tags: ["bass"],
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
					octave: -1,
					dcoEnv: {
						steps: [
							{
								level: 58,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
								level: 89,
								rate: 97,
							},
							{
								level: 79,
								rate: 34,
							},
							{
								level: 47,
								rate: 29,
							},
							{
								level: 0,
								rate: 15,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
					dcaEnv: {
						steps: [
							{
								level: 99,
								rate: 99,
							},
							{
								level: 86,
								rate: 19,
							},
							{
								level: 65,
								rate: 61,
							},
							{
								level: 39,
								rate: 50,
							},
							{
								level: 0,
								rate: 23,
							},
							{
								level: 0,
								rate: 50,
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
					keyFollow: 0,
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
					detuneFine: 4,
					octave: -1,
					dcoEnv: {
						steps: [
							{
								level: 33,
								rate: 99,
							},
							{
								level: 0,
								rate: 68,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
								level: 90,
								rate: 80,
							},
							{
								level: 98,
								rate: 81,
							},
							{
								level: 57,
								rate: 37,
							},
							{
								level: 0,
								rate: 10,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
								level: 97,
								rate: 99,
							},
							{
								level: 99,
								rate: 77,
							},
							{
								level: 90,
								rate: 38,
							},
							{
								level: 50,
								rate: 79,
							},
							{
								level: 0,
								rate: 55,
							},
							{
								level: 0,
								rate: 50,
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
						stepCount: 5,
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
				volume: 0.8,
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
							rate: 47,
							depth: 15,
							delay: 13,
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
	},
	{
		name: "BRAIN DAMAGE1",
		tags: ["effect"],
		data: {
			schemaVersion: 1,
			params: {
				lineSelect: "L1+L2'",
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
								level: 79,
								rate: 42,
							},
							{
								level: 41,
								rate: 50,
							},
							{
								level: 50,
								rate: 17,
							},
							{
								level: 99,
								rate: 68,
							},
							{
								level: 32,
								rate: 89,
							},
							{
								level: 52,
								rate: 14,
							},
							{
								level: 99,
								rate: 26,
							},
							{
								level: 0,
								rate: 12,
							},
						],
						sustainStep: 7,
						stepCount: 8,
						loop: false,
					},
					dcwEnv: {
						steps: [
							{
								level: 76,
								rate: 77,
							},
							{
								level: 52,
								rate: 75,
							},
							{
								level: 71,
								rate: 71,
							},
							{
								level: 51,
								rate: 75,
							},
							{
								level: 71,
								rate: 86,
							},
							{
								level: 50,
								rate: 72,
							},
							{
								level: 88,
								rate: 49,
							},
							{
								level: 0,
								rate: 23,
							},
						],
						sustainStep: 6,
						stepCount: 8,
						loop: false,
					},
					dcaEnv: {
						steps: [
							{
								level: 99,
								rate: 71,
							},
							{
								level: 56,
								rate: 83,
							},
							{
								level: 92,
								rate: 80,
							},
							{
								level: 49,
								rate: 72,
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
						],
						sustainStep: 2,
						stepCount: 5,
						loop: false,
					},
					keyFollow: 6,
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
					algo2: "cz101",
					algoBlend: 0,
					baseWaveformA: "cosine",
					baseWaveformB: "cosine",
					window: "off",
					dcaBase: 1,
					dcwBase: 1,
					modulation: 0,
					detuneNote: 7,
					detuneFine: 60,
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
								level: 99,
								rate: 52,
							},
							{
								level: 52,
								rate: 22,
							},
							{
								level: 99,
								rate: 54,
							},
							{
								level: 99,
								rate: 61,
							},
							{
								level: 99,
								rate: 23,
							},
							{
								level: 99,
								rate: 99,
							},
							{
								level: 68,
								rate: 4,
							},
							{
								level: 0,
								rate: 99,
							},
						],
						sustainStep: 6,
						stepCount: 8,
						loop: false,
					},
					dcaEnv: {
						steps: [
							{
								level: 99,
								rate: 71,
							},
							{
								level: 56,
								rate: 83,
							},
							{
								level: 92,
								rate: 80,
							},
							{
								level: 49,
								rate: 72,
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
						],
						sustainStep: 2,
						stepCount: 5,
						loop: false,
					},
					keyFollow: 6,
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
							value: 5,
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
							value: 5,
						},
						{
							id: "waveform2",
							value: 5,
						},
						{
							id: "windowFunction",
							value: 3,
						},
					],
				},
				frequency: 440,
				volume: 0.8,
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
							rate: 54,
							depth: 8,
							delay: 49,
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
	},
	{
		name: "BRASS 5THS",
		tags: ["brass"],
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
								level: 76,
								rate: 99,
							},
							{
								level: 52,
								rate: 75,
							},
							{
								level: 71,
								rate: 71,
							},
							{
								level: 51,
								rate: 75,
							},
							{
								level: 71,
								rate: 86,
							},
							{
								level: 50,
								rate: 72,
							},
							{
								level: 88,
								rate: 49,
							},
							{
								level: 0,
								rate: 23,
							},
						],
						sustainStep: 6,
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
								level: 56,
								rate: 83,
							},
							{
								level: 92,
								rate: 80,
							},
							{
								level: 49,
								rate: 72,
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
						],
						sustainStep: 2,
						stepCount: 5,
						loop: false,
					},
					keyFollow: 6,
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
					detuneNote: 7,
					detuneFine: 8,
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
								level: 76,
								rate: 99,
							},
							{
								level: 52,
								rate: 75,
							},
							{
								level: 71,
								rate: 71,
							},
							{
								level: 51,
								rate: 75,
							},
							{
								level: 71,
								rate: 86,
							},
							{
								level: 50,
								rate: 72,
							},
							{
								level: 88,
								rate: 49,
							},
							{
								level: 0,
								rate: 23,
							},
						],
						sustainStep: 6,
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
								level: 56,
								rate: 83,
							},
							{
								level: 92,
								rate: 80,
							},
							{
								level: 49,
								rate: 72,
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
						],
						sustainStep: 2,
						stepCount: 5,
						loop: false,
					},
					keyFollow: 6,
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
				volume: 0.8,
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
							rate: 54,
							depth: 8,
							delay: 49,
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
	},
	{
		name: "BRIAN'S PIANO",
		tags: ["piano"],
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
								level: 11,
								rate: 52,
							},
							{
								level: 0,
								rate: 87,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
								level: 66,
								rate: 99,
							},
							{
								level: 0,
								rate: 12,
							},
							{
								level: 0,
								rate: 32,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
								rate: 88,
							},
							{
								level: 0,
								rate: 33,
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
						],
						sustainStep: 1,
						stepCount: 3,
						loop: false,
					},
					keyFollow: 9,
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
					algo2: "cz101",
					algoBlend: 0,
					baseWaveformA: "cosine",
					baseWaveformB: "cosine",
					window: "off",
					dcaBase: 1,
					dcwBase: 1,
					modulation: 0,
					detuneNote: 0,
					detuneFine: -1,
					octave: 1,
					dcoEnv: {
						steps: [
							{
								level: 0,
								rate: 52,
							},
							{
								level: 1,
								rate: 14,
							},
							{
								level: 0,
								rate: 7,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
								level: 62,
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
								level: 96,
								rate: 99,
							},
							{
								level: 0,
								rate: 32,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
					keyFollow: 1,
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
				frequency: 440,
				volume: 0.8,
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
							enabled: false,
							waveform: 1,
							rate: 0,
							depth: 0,
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
	},
	{
		name: "BRSS W/TRAILS",
		tags: ["brass"],
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
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
								level: 99,
								rate: 77,
							},
							{
								level: 99,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 99,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 99,
								rate: 50,
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
					dcaEnv: {
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
						],
						sustainStep: 2,
						stepCount: 3,
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
						sustainStep: 2,
						stepCount: 3,
						loop: false,
					},
					dcwEnv: {
						steps: [
							{
								level: 99,
								rate: 50,
							},
							{
								level: 99,
								rate: 99,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 99,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 99,
								rate: 50,
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
					dcaEnv: {
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
						],
						sustainStep: 2,
						stepCount: 3,
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
				volume: 0.8,
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
							enabled: false,
							waveform: 1,
							rate: 50,
							depth: 0,
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
	},
	{
		name: "BRTH FLTE 1",
		tags: ["wind"],
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
					dcaBase: 1,
					dcwBase: 1,
					modulation: 0,
					detuneNote: 0,
					detuneFine: 0,
					octave: 1,
					dcoEnv: {
						steps: [
							{
								level: 66,
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
							{
								level: 0,
								rate: 50,
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
								level: 56,
								rate: 62,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
						stepCount: 8,
						loop: false,
					},
					dcaEnv: {
						steps: [
							{
								level: 99,
								rate: 71,
							},
							{
								level: 99,
								rate: 23,
							},
							{
								level: 0,
								rate: 59,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
					keyFollow: 9,
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
								level: 72,
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
								level: 0,
								rate: 53,
							},
							{
								level: 0,
								rate: 46,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
							id: "preset",
							value: 0,
						},
						{
							id: "waveform1",
							value: 0,
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
				frequency: 440,
				volume: 0.8,
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
							rate: 54,
							depth: 7,
							delay: 10,
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
	},
	{
		name: "CELLO 1",
		tags: ["string"],
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
					octave: 0,
					dcoEnv: {
						steps: [
							{
								level: 66,
								rate: 99,
							},
							{
								level: 66,
								rate: 43,
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
								level: 86,
								rate: 83,
							},
							{
								level: 50,
								rate: 59,
							},
							{
								level: 48,
								rate: 31,
							},
							{
								level: 0,
								rate: 85,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
								level: 81,
								rate: 62,
							},
							{
								level: 94,
								rate: 34,
							},
							{
								level: 85,
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
						],
						sustainStep: 2,
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
						sustainStep: 0,
						stepCount: 1,
						loop: false,
					},
					dcwEnv: {
						steps: [
							{
								level: 65,
								rate: 98,
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
								rate: 95,
							},
							{
								level: 0,
								rate: 23,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
					keyFollow: 1,
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
				frequency: 440,
				volume: 0.8,
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
							rate: 50,
							depth: 8,
							delay: 32,
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
	},
	{
		name: "CHERYLWHINESTN",
		tags: ["wind"],
		data: {
			schemaVersion: 1,
			params: {
				lineSelect: "L1+L2'",
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
								level: 2,
								rate: 28,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
								level: 30,
								rate: 91,
							},
							{
								level: 49,
								rate: 5,
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
					dcaEnv: {
						steps: [
							{
								level: 96,
								rate: 63,
							},
							{
								level: 64,
								rate: 20,
							},
							{
								level: 90,
								rate: 70,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
					keyFollow: 1,
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
								level: 12,
								rate: 62,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
								level: 37,
								rate: 80,
							},
							{
								level: 20,
								rate: 10,
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
					dcaEnv: {
						steps: [
							{
								level: 40,
								rate: 38,
							},
							{
								level: 0,
								rate: 2,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
							value: 6,
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
							value: 2,
						},
					],
					algoControlsB: [],
				},
				frequency: 440,
				volume: 0.8,
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
							rate: 41,
							depth: 5,
							delay: 12,
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
	},
	{
		name: "CHIMEW/FOOTSTP",
		tags: ["bell", "effect"],
		data: {
			schemaVersion: 1,
			params: {
				lineSelect: "L1+L2'",
				modMode: "noise",
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
								level: 82,
								rate: 99,
							},
							{
								level: 0,
								rate: 2,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
								rate: 28,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
								rate: 99,
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
					dcaEnv: {
						steps: [
							{
								level: 99,
								rate: 99,
							},
							{
								level: 0,
								rate: 58,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
					algoControlsB: [],
				},
				frequency: 440,
				volume: 0.8,
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
							enabled: false,
							waveform: 1,
							rate: 0,
							depth: 0,
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
	},
	{
		name: "CHIRP",
		tags: ["pluck"],
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
					octave: 1,
					dcoEnv: {
						steps: [
							{
								level: 62,
								rate: 99,
							},
							{
								level: 0,
								rate: 76,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
								level: 90,
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
								level: 96,
								rate: 99,
							},
							{
								level: 81,
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
					keyFollow: 5,
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
					algo2: "cz101",
					algoBlend: 0,
					baseWaveformA: "cosine",
					baseWaveformB: "cosine",
					window: "off",
					dcaBase: 1,
					dcwBase: 1,
					modulation: 0,
					detuneNote: 7,
					detuneFine: 8,
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
								level: 13,
								rate: 37,
							},
							{
								level: 85,
								rate: 62,
							},
							{
								level: 45,
								rate: 30,
							},
							{
								level: 59,
								rate: 41,
							},
							{
								level: 0,
								rate: 11,
							},
							{
								level: 0,
								rate: 50,
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
						stepCount: 5,
						loop: false,
					},
					dcaEnv: {
						steps: [
							{
								level: 99,
								rate: 46,
							},
							{
								level: 84,
								rate: 46,
							},
							{
								level: 28,
								rate: 20,
							},
							{
								level: 75,
								rate: 42,
							},
							{
								level: 0,
								rate: 42,
							},
							{
								level: 0,
								rate: 50,
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
						stepCount: 5,
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
							value: 0,
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
				volume: 0.8,
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
							rate: 0,
							depth: 95,
							delay: 95,
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
	},
	{
		name: "CLARINET",
		tags: ["wind"],
		data: {
			schemaVersion: 1,
			params: {
				lineSelect: "L1+L2'",
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
								level: 57,
								rate: 99,
							},
							{
								level: 57,
								rate: 44,
							},
							{
								level: 75,
								rate: 44,
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
						],
						sustainStep: 2,
						stepCount: 4,
						loop: false,
					},
					dcaEnv: {
						steps: [
							{
								level: 61,
								rate: 99,
							},
							{
								level: 81,
								rate: 75,
							},
							{
								level: 99,
								rate: 47,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
								level: 68,
								rate: 98,
							},
							{
								level: 68,
								rate: 46,
							},
							{
								level: 90,
								rate: 46,
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
								level: 54,
								rate: 97,
							},
							{
								level: 70,
								rate: 73,
							},
							{
								level: 85,
								rate: 45,
							},
							{
								level: 0,
								rate: 48,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
				volume: 0.8,
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
							enabled: false,
							waveform: 4,
							rate: 0,
							depth: 0,
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
	},
	{
		name: "COOL VIBES",
		tags: ["pluck"],
		data: {
			schemaVersion: 1,
			params: {
				lineSelect: "L1+L2'",
				modMode: "ring",
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
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
								level: 14,
								rate: 99,
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
								rate: 98,
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
					keyFollow: 9,
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
					octave: 3,
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
						stepCount: 1,
						loop: false,
					},
					dcwEnv: {
						steps: [
							{
								level: 44,
								rate: 99,
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
								level: 71,
								rate: 99,
							},
							{
								level: 0,
								rate: 49,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
					keyFollow: 9,
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
					algoControlsB: [],
				},
				frequency: 440,
				volume: 0.8,
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
							enabled: false,
							waveform: 1,
							rate: 50,
							depth: 0,
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
	},
	{
		name: "CRYSTAL 3",
		tags: ["pluck", "keys"],
		data: {
			schemaVersion: 1,
			params: {
				lineSelect: "L1+L2'",
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
								level: 99,
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
								level: 65,
								rate: 98,
							},
							{
								level: 47,
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
					dcaEnv: {
						steps: [
							{
								level: 98,
								rate: 95,
							},
							{
								level: 99,
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
					keyFollow: 1,
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
					detuneNote: 11,
					detuneFine: 60,
					octave: 2,
					dcoEnv: {
						steps: [
							{
								level: 23,
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
								level: 96,
								rate: 98,
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
							{
								level: 0,
								rate: 50,
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
								level: 98,
								rate: 95,
							},
							{
								level: 99,
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
					keyFollow: 1,
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
				frequency: 440,
				volume: 0.8,
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
							rate: 51,
							depth: 15,
							delay: 47,
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
	},
	{
		name: "DARK SQ-SEQ",
		tags: ["pluck", "bass"],
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
					octave: -1,
					dcoEnv: {
						steps: [
							{
								level: 0,
								rate: 99,
							},
							{
								level: 0,
								rate: 57,
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
								level: 42,
								rate: 99,
							},
							{
								level: 43,
								rate: 54,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
					dcaEnv: {
						steps: [
							{
								level: 99,
								rate: 85,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
					algo2: "cz101",
					algoBlend: 0,
					baseWaveformA: "cosine",
					baseWaveformB: "cosine",
					window: "off",
					dcaBase: 1,
					dcwBase: 1,
					modulation: 0,
					detuneNote: 0,
					detuneFine: 5,
					octave: -1,
					dcoEnv: {
						steps: [
							{
								level: 49,
								rate: 99,
							},
							{
								level: 0,
								rate: 70,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
								level: 0,
								rate: 55,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
				volume: 0.8,
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
							enabled: false,
							waveform: 1,
							rate: 50,
							depth: 0,
							delay: 27,
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
	},
	{
		name: "DBL REED",
		tags: ["organ"],
		data: {
			schemaVersion: 1,
			params: {
				lineSelect: "L1+L1'",
				modMode: "ring",
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
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
								level: 31,
								rate: 94,
							},
							{
								level: 50,
								rate: 99,
							},
							{
								level: 0,
								rate: 28,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
								rate: 91,
							},
							{
								level: 0,
								rate: 25,
							},
							{
								level: 0,
								rate: 72,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
					keyFollow: 3,
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
					detuneNote: 7,
					detuneFine: 1,
					octave: 1,
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
						sustainStep: 7,
						stepCount: 8,
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
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
				volume: 0.8,
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
							rate: 54,
							depth: 5,
							delay: 69,
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
	},
	{
		name: "DEMIBANJO",
		tags: ["guitar"],
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
								level: 0,
								rate: 18,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
								level: 46,
								rate: 91,
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
						sustainStep: 1,
						stepCount: 2,
						loop: false,
					},
					dcaEnv: {
						steps: [
							{
								level: 96,
								rate: 98,
							},
							{
								level: 4,
								rate: 38,
							},
							{
								level: 0,
								rate: 31,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
					keyFollow: 2,
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
					algo: "cz101",
					algo2: "cz101",
					algoBlend: 0,
					baseWaveformA: "cosine",
					baseWaveformB: "cosine",
					window: "off",
					dcaBase: 1,
					dcwBase: 1,
					modulation: 0,
					detuneNote: 11,
					detuneFine: 1,
					octave: 2,
					dcoEnv: {
						steps: [
							{
								level: 2,
								rate: 45,
							},
							{
								level: 0,
								rate: 8,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
								level: 67,
								rate: 91,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
								level: 56,
								rate: 12,
							},
							{
								level: 0,
								rate: 1,
							},
							{
								level: 83,
								rate: 40,
							},
							{
								level: 54,
								rate: 83,
							},
							{
								level: 0,
								rate: 84,
							},
							{
								level: 0,
								rate: 50,
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
						stepCount: 5,
						loop: false,
					},
					keyFollow: 2,
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
				frequency: 440,
				volume: 0.8,
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
							enabled: false,
							waveform: 1,
							rate: 3,
							depth: 0,
							delay: 21,
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
	},
	{
		name: "DISTORTEDGUITR",
		tags: ["guitar"],
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
					octave: 0,
					dcoEnv: {
						steps: [
							{
								level: 66,
								rate: 93,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
								level: 70,
								rate: 99,
							},
							{
								level: 99,
								rate: 82,
							},
							{
								level: 70,
								rate: 99,
							},
							{
								level: 37,
								rate: 82,
							},
							{
								level: 85,
								rate: 99,
							},
							{
								level: 0,
								rate: 23,
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
						sustainStep: 6,
						stepCount: 7,
						loop: false,
					},
					dcaEnv: {
						steps: [
							{
								level: 71,
								rate: 99,
							},
							{
								level: 99,
								rate: 95,
							},
							{
								level: 82,
								rate: 99,
							},
							{
								level: 99,
								rate: 80,
							},
							{
								level: 75,
								rate: 20,
							},
							{
								level: 27,
								rate: 58,
							},
							{
								level: 0,
								rate: 65,
							},
							{
								level: 0,
								rate: 50,
							},
						],
						sustainStep: 4,
						stepCount: 7,
						loop: false,
					},
					keyFollow: 6,
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
					algo2: null,
					algoBlend: 0,
					baseWaveformA: "cosine",
					baseWaveformB: "cosine",
					window: "off",
					dcaBase: 1,
					dcwBase: 1,
					modulation: 0,
					detuneNote: 7,
					detuneFine: 4,
					octave: 1,
					dcoEnv: {
						steps: [
							{
								level: 2,
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
								level: 80,
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
					dcaEnv: {
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
				volume: 0.8,
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
							rate: 23,
							depth: 6,
							delay: 33,
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
	},
	{
		name: "DIVA HARMONIC",
		tags: ["pad"],
		data: {
			schemaVersion: 1,
			params: {
				lineSelect: "L1+L2'",
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
								level: 33,
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
								level: 5,
								rate: 53,
							},
							{
								level: 99,
								rate: 37,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
								rate: 38,
							},
							{
								level: 99,
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
					detuneNote: 7,
					detuneFine: 0,
					octave: 1,
					dcoEnv: {
						steps: [
							{
								level: 57,
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
								level: 5,
								rate: 32,
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
						sustainStep: 1,
						stepCount: 2,
						loop: false,
					},
					dcaEnv: {
						steps: [
							{
								level: 99,
								rate: 32,
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
				volume: 0.8,
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
							enabled: false,
							waveform: 1,
							rate: 0,
							depth: 0,
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
	},
	{
		name: "DOUBLE REED",
		tags: ["organ"],
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
								level: 29,
								rate: 99,
							},
							{
								level: 0,
								rate: 87,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
								level: 93,
								rate: 74,
							},
							{
								level: 86,
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
						sustainStep: 1,
						stepCount: 8,
						loop: false,
					},
					dcaEnv: {
						steps: [
							{
								level: 99,
								rate: 83,
							},
							{
								level: 91,
								rate: 64,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
							id: "preset",
							value: 0,
						},
						{
							id: "waveform1",
							value: 2,
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
					detuneFine: 0,
					octave: 1,
					dcoEnv: {
						steps: [
							{
								level: 66,
								rate: 99,
							},
							{
								level: 13,
								rate: 73,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
								level: 89,
								rate: 74,
							},
							{
								level: 20,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
								rate: 83,
							},
							{
								level: 0,
								rate: 65,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
							value: 2,
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
				frequency: 440,
				volume: 0.8,
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
							depth: 5,
							delay: 50,
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
	},
	{
		name: "DUKEY",
		tags: ["lead"],
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
					octave: -1,
					dcoEnv: {
						steps: [
							{
								level: 60,
								rate: 99,
							},
							{
								level: 66,
								rate: 58,
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
								level: 92,
								rate: 87,
							},
							{
								level: 84,
								rate: 83,
							},
							{
								level: 0,
								rate: 32,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
								level: 71,
								rate: 99,
							},
							{
								level: 95,
								rate: 62,
							},
							{
								level: 0,
								rate: 56,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
							id: "preset",
							value: 7,
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
							value: 3,
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
					octave: -4,
					dcoEnv: {
						steps: [
							{
								level: 60,
								rate: 99,
							},
							{
								level: 66,
								rate: 58,
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
								level: 92,
								rate: 87,
							},
							{
								level: 84,
								rate: 83,
							},
							{
								level: 0,
								rate: 32,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
								level: 71,
								rate: 99,
							},
							{
								level: 95,
								rate: 62,
							},
							{
								level: 0,
								rate: 56,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
							id: "preset",
							value: 0,
						},
						{
							id: "waveform1",
							value: 0,
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
				volume: 0.8,
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
							rate: 55,
							depth: 12,
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
	},
	{
		name: "DXLEAD1SYNPRO",
		tags: ["lead"],
		data: {
			schemaVersion: 1,
			params: {
				lineSelect: "L1+L1'",
				modMode: "ring",
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
					octave: 1,
					dcoEnv: {
						steps: [
							{
								level: 58,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
								level: 36,
								rate: 99,
							},
							{
								level: 17,
								rate: 68,
							},
							{
								level: 79,
								rate: 99,
							},
							{
								level: 27,
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
						sustainStep: 3,
						stepCount: 5,
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
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
					detuneNote: 7,
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
								level: 80,
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
				volume: 0.8,
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
							rate: 50,
							depth: 9,
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
	},
	{
		name: "ECHO FANTASY",
		tags: ["brass"],
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
					dcaBase: 1,
					dcwBase: 1,
					modulation: 0,
					detuneNote: 0,
					detuneFine: 0,
					octave: 0,
					dcoEnv: {
						steps: [
							{
								level: 87,
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
								level: 66,
								rate: 83,
							},
							{
								level: 26,
								rate: 48,
							},
							{
								level: 68,
								rate: 50,
							},
							{
								level: 41,
								rate: 50,
							},
							{
								level: 59,
								rate: 50,
							},
							{
								level: 31,
								rate: 50,
							},
							{
								level: 0,
								rate: 29,
							},
							{
								level: 0,
								rate: 50,
							},
						],
						sustainStep: 1,
						stepCount: 7,
						loop: false,
					},
					dcaEnv: {
						steps: [
							{
								level: 99,
								rate: 75,
							},
							{
								level: 84,
								rate: 75,
							},
							{
								level: 30,
								rate: 50,
							},
							{
								level: 89,
								rate: 50,
							},
							{
								level: 15,
								rate: 50,
							},
							{
								level: 77,
								rate: 51,
							},
							{
								level: 9,
								rate: 50,
							},
							{
								level: 0,
								rate: 32,
							},
						],
						sustainStep: 1,
						stepCount: 8,
						loop: false,
					},
					keyFollow: 6,
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
					algo2: null,
					algoBlend: 0,
					baseWaveformA: "cosine",
					baseWaveformB: "cosine",
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
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
								level: 57,
								rate: 99,
							},
							{
								level: 0,
								rate: 56,
							},
							{
								level: 0,
								rate: 38,
							},
							{
								level: 0,
								rate: 46,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
				volume: 0.8,
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
							rate: 51,
							depth: 3,
							delay: 53,
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
	},
	{
		name: "ELEC. BASS A",
		tags: ["bass"],
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
						sustainStep: 1,
						stepCount: 2,
						loop: false,
					},
					dcwEnv: {
						steps: [
							{
								level: 80,
								rate: 99,
							},
							{
								level: 45,
								rate: 45,
							},
							{
								level: 30,
								rate: 40,
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
								level: 92,
								rate: 93,
							},
							{
								level: 73,
								rate: 25,
							},
							{
								level: 49,
								rate: 35,
							},
							{
								level: 0,
								rate: 82,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
								level: 40,
								rate: 99,
							},
							{
								level: 96,
								rate: 78,
							},
							{
								level: 99,
								rate: 11,
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
							value: 6,
						},
						{
							id: "windowFunction",
							value: 2,
						},
					],
					algoControlsB: [
						{
							id: "preset",
							value: 6,
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
							value: 2,
						},
					],
				},
				frequency: 440,
				volume: 0.8,
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
							waveform: 3,
							rate: 20,
							depth: 1,
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
	},
	{
		name: "ELEC. BASS C",
		tags: ["bass"],
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
						stepCount: 1,
						loop: false,
					},
					dcwEnv: {
						steps: [
							{
								level: 92,
								rate: 97,
							},
							{
								level: 74,
								rate: 45,
							},
							{
								level: 64,
								rate: 37,
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
					detuneFine: 4,
					octave: -1,
					dcoEnv: {
						steps: [
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
								level: 67,
								rate: 99,
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
					dcaEnv: {
						steps: [
							{
								level: 66,
								rate: 84,
							},
							{
								level: 0,
								rate: 59,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
					keyFollow: 4,
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
				frequency: 440,
				volume: 0.8,
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
							enabled: false,
							waveform: 1,
							rate: 55,
							depth: 0,
							delay: 33,
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
	},
	{
		name: "ELEC.BASS 2",
		tags: ["bass"],
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
					octave: -1,
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
				volume: 0.8,
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
							rate: 55,
							depth: 23,
							delay: 33,
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
	},
	{
		name: "ELEC.BASS 3",
		tags: ["bass"],
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
					octave: -1,
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
					keyFollow: 3,
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
					keyFollow: 8,
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
							value: 6,
						},
						{
							id: "windowFunction",
							value: 3,
						},
					],
					algoControlsB: [
						{
							id: "preset",
							value: 7,
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
							value: 3,
						},
					],
				},
				frequency: 440,
				volume: 0.8,
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
							rate: 55,
							depth: 23,
							delay: 33,
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
	},
	{
		name: "ELEC.DRUM",
		tags: ["drum"],
		data: {
			schemaVersion: 1,
			params: {
				lineSelect: "L1+L2'",
				modMode: "noise",
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
					octave: -1,
					dcoEnv: {
						steps: [
							{
								level: 59,
								rate: 99,
							},
							{
								level: 8,
								rate: 57,
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
								level: 94,
								rate: 99,
							},
							{
								level: 0,
								rate: 7,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
								level: 0,
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
							value: 2,
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
					algoControlsB: [
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
					detuneNote: 11,
					detuneFine: 60,
					octave: 2,
					dcoEnv: {
						steps: [
							{
								level: 49,
								rate: 99,
							},
							{
								level: 0,
								rate: 70,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
								level: 0,
								rate: 55,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
					keyFollow: 8,
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
				volume: 0.8,
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
							enabled: false,
							waveform: 1,
							rate: 61,
							depth: 0,
							delay: 27,
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
	},
	{
		name: "ELECTRONIC-4",
		tags: ["effect"],
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
					dcaBase: 1,
					dcwBase: 1,
					modulation: 0,
					detuneNote: 0,
					detuneFine: 0,
					octave: 1,
					dcoEnv: {
						steps: [
							{
								level: 81,
								rate: 11,
							},
							{
								level: 40,
								rate: 1,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
								level: 65,
								rate: 22,
							},
							{
								level: 45,
								rate: 38,
							},
							{
								level: 53,
								rate: 0,
							},
							{
								level: 40,
								rate: 0,
							},
							{
								level: 37,
								rate: 0,
							},
							{
								level: 25,
								rate: 0,
							},
							{
								level: 28,
								rate: 0,
							},
							{
								level: 0,
								rate: 0,
							},
						],
						sustainStep: 6,
						stepCount: 8,
						loop: false,
					},
					dcaEnv: {
						steps: [
							{
								level: 80,
								rate: 70,
							},
							{
								level: 99,
								rate: 99,
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
							{
								level: 0,
								rate: 50,
							},
						],
						sustainStep: 1,
						stepCount: 3,
						loop: false,
					},
					keyFollow: 6,
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
					detuneFine: -2,
					octave: 1,
					dcoEnv: {
						steps: [
							{
								level: 37,
								rate: 62,
							},
							{
								level: 0,
								rate: 88,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
								level: 87,
								rate: 95,
							},
							{
								level: 5,
								rate: 27,
							},
							{
								level: 0,
								rate: 37,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
								rate: 86,
							},
							{
								level: 99,
								rate: 38,
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
						sustainStep: 1,
						stepCount: 3,
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
					algoControlsB: [],
				},
				frequency: 440,
				volume: 0.8,
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
							rate: 99,
							depth: 71,
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
	},
	{
		name: "ELECTRONIC-5",
		tags: ["effect"],
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
								level: 66,
								rate: 72,
							},
							{
								level: 66,
								rate: 56,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
								level: 65,
								rate: 22,
							},
							{
								level: 45,
								rate: 38,
							},
							{
								level: 53,
								rate: 0,
							},
							{
								level: 40,
								rate: 0,
							},
							{
								level: 37,
								rate: 0,
							},
							{
								level: 25,
								rate: 0,
							},
							{
								level: 28,
								rate: 0,
							},
							{
								level: 0,
								rate: 0,
							},
						],
						sustainStep: 6,
						stepCount: 8,
						loop: false,
					},
					dcaEnv: {
						steps: [
							{
								level: 80,
								rate: 99,
							},
							{
								level: 99,
								rate: 99,
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
						sustainStep: 1,
						stepCount: 3,
						loop: false,
					},
					keyFollow: 6,
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
					detuneNote: -4,
					detuneFine: -8,
					octave: -1,
					dcoEnv: {
						steps: [
							{
								level: 66,
								rate: 72,
							},
							{
								level: 66,
								rate: 56,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
								level: 65,
								rate: 22,
							},
							{
								level: 45,
								rate: 38,
							},
							{
								level: 53,
								rate: 0,
							},
							{
								level: 40,
								rate: 0,
							},
							{
								level: 37,
								rate: 0,
							},
							{
								level: 25,
								rate: 0,
							},
							{
								level: 28,
								rate: 0,
							},
							{
								level: 0,
								rate: 0,
							},
						],
						sustainStep: 6,
						stepCount: 8,
						loop: false,
					},
					dcaEnv: {
						steps: [
							{
								level: 80,
								rate: 99,
							},
							{
								level: 99,
								rate: 99,
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
						sustainStep: 1,
						stepCount: 3,
						loop: false,
					},
					keyFollow: 6,
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
							value: 5,
						},
						{
							id: "windowFunction",
							value: 1,
						},
					],
					algoControlsB: [
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
							value: 5,
						},
						{
							id: "windowFunction",
							value: 1,
						},
					],
				},
				frequency: 440,
				volume: 0.8,
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
							rate: 43,
							depth: 99,
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
	},
	{
		name: "ELECTRONIC-8",
		tags: ["effect"],
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
					octave: -1,
					dcoEnv: {
						steps: [
							{
								level: 85,
								rate: 72,
							},
							{
								level: 66,
								rate: 35,
							},
							{
								level: 0,
								rate: 35,
							},
							{
								level: 89,
								rate: 35,
							},
							{
								level: 0,
								rate: 35,
							},
							{
								level: 89,
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
						],
						sustainStep: 7,
						stepCount: 8,
						loop: false,
					},
					dcwEnv: {
						steps: [
							{
								level: 65,
								rate: 22,
							},
							{
								level: 45,
								rate: 38,
							},
							{
								level: 53,
								rate: 0,
							},
							{
								level: 40,
								rate: 0,
							},
							{
								level: 37,
								rate: 0,
							},
							{
								level: 25,
								rate: 0,
							},
							{
								level: 28,
								rate: 0,
							},
							{
								level: 0,
								rate: 0,
							},
						],
						sustainStep: 7,
						stepCount: 8,
						loop: false,
					},
					dcaEnv: {
						steps: [
							{
								level: 80,
								rate: 99,
							},
							{
								level: 99,
								rate: 99,
							},
							{
								level: 0,
								rate: 0,
							},
							{
								level: 99,
								rate: 99,
							},
							{
								level: 0,
								rate: 0,
							},
							{
								level: 92,
								rate: 90,
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
						sustainStep: 7,
						stepCount: 8,
						loop: false,
					},
					keyFollow: 7,
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
					detuneFine: -12,
					octave: -1,
					dcoEnv: {
						steps: [
							{
								level: 37,
								rate: 62,
							},
							{
								level: 0,
								rate: 88,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 90,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 90,
								rate: 50,
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
						sustainStep: 6,
						stepCount: 7,
						loop: false,
					},
					dcwEnv: {
						steps: [
							{
								level: 87,
								rate: 9,
							},
							{
								level: 5,
								rate: 7,
							},
							{
								level: 99,
								rate: 7,
							},
							{
								level: 0,
								rate: 4,
							},
							{
								level: 99,
								rate: 0,
							},
							{
								level: 0,
								rate: 0,
							},
							{
								level: 99,
								rate: 0,
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
					dcaEnv: {
						steps: [
							{
								level: 99,
								rate: 86,
							},
							{
								level: 9,
								rate: 38,
							},
							{
								level: 92,
								rate: 99,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 92,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 92,
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
					keyFollow: 7,
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
				frequency: 440,
				volume: 0.8,
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
							waveform: 2,
							rate: 99,
							depth: 94,
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
	},
	{
		name: "ELECTRONIC-12",
		tags: ["effect"],
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
								level: 66,
								rate: 72,
							},
							{
								level: 66,
								rate: 56,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
								level: 65,
								rate: 22,
							},
							{
								level: 99,
								rate: 38,
							},
							{
								level: 53,
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
							{
								level: 0,
								rate: 50,
							},
						],
						sustainStep: 2,
						stepCount: 3,
						loop: false,
					},
					dcaEnv: {
						steps: [
							{
								level: 80,
								rate: 99,
							},
							{
								level: 99,
								rate: 99,
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
						sustainStep: 1,
						stepCount: 3,
						loop: false,
					},
					keyFollow: 6,
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
							value: 2,
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
							value: 2,
						},
						{
							id: "waveform2",
							value: 2,
						},
						{
							id: "windowFunction",
							value: 3,
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
					detuneNote: -4,
					detuneFine: -8,
					octave: -1,
					dcoEnv: {
						steps: [
							{
								level: 66,
								rate: 72,
							},
							{
								level: 66,
								rate: 56,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
								level: 65,
								rate: 22,
							},
							{
								level: 45,
								rate: 38,
							},
							{
								level: 53,
								rate: 0,
							},
							{
								level: 40,
								rate: 0,
							},
							{
								level: 37,
								rate: 0,
							},
							{
								level: 25,
								rate: 0,
							},
							{
								level: 28,
								rate: 0,
							},
							{
								level: 0,
								rate: 0,
							},
						],
						sustainStep: 6,
						stepCount: 8,
						loop: false,
					},
					dcaEnv: {
						steps: [
							{
								level: 80,
								rate: 99,
							},
							{
								level: 99,
								rate: 99,
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
						sustainStep: 1,
						stepCount: 3,
						loop: false,
					},
					keyFollow: 6,
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
							value: 5,
						},
						{
							id: "windowFunction",
							value: 1,
						},
					],
					algoControlsB: [
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
							value: 5,
						},
						{
							id: "windowFunction",
							value: 1,
						},
					],
				},
				frequency: 440,
				volume: 0.8,
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
							waveform: 3,
							rate: 77,
							depth: 99,
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
	},
	{
		name: "ELEPHANTBRASS",
		tags: ["brass"],
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
					octave: -1,
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
								level: 76,
								rate: 77,
							},
							{
								level: 52,
								rate: 75,
							},
							{
								level: 71,
								rate: 71,
							},
							{
								level: 51,
								rate: 75,
							},
							{
								level: 71,
								rate: 86,
							},
							{
								level: 50,
								rate: 72,
							},
							{
								level: 88,
								rate: 49,
							},
							{
								level: 0,
								rate: 23,
							},
						],
						sustainStep: 6,
						stepCount: 8,
						loop: false,
					},
					dcaEnv: {
						steps: [
							{
								level: 99,
								rate: 71,
							},
							{
								level: 56,
								rate: 83,
							},
							{
								level: 92,
								rate: 80,
							},
							{
								level: 49,
								rate: 72,
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
						],
						sustainStep: 2,
						stepCount: 5,
						loop: false,
					},
					keyFollow: 6,
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
					algo2: null,
					algoBlend: 0,
					baseWaveformA: "cosine",
					baseWaveformB: "cosine",
					window: "off",
					dcaBase: 1,
					dcwBase: 1,
					modulation: 0,
					detuneNote: 7,
					detuneFine: 8,
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
								level: 76,
								rate: 77,
							},
							{
								level: 52,
								rate: 75,
							},
							{
								level: 71,
								rate: 71,
							},
							{
								level: 51,
								rate: 75,
							},
							{
								level: 71,
								rate: 86,
							},
							{
								level: 50,
								rate: 72,
							},
							{
								level: 88,
								rate: 49,
							},
							{
								level: 0,
								rate: 23,
							},
						],
						sustainStep: 6,
						stepCount: 8,
						loop: false,
					},
					dcaEnv: {
						steps: [
							{
								level: 99,
								rate: 71,
							},
							{
								level: 56,
								rate: 83,
							},
							{
								level: 92,
								rate: 80,
							},
							{
								level: 49,
								rate: 72,
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
						],
						sustainStep: 2,
						stepCount: 5,
						loop: false,
					},
					keyFollow: 6,
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
				volume: 0.8,
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
							rate: 54,
							depth: 8,
							delay: 49,
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
	},
	{
		name: "ELP FULL SYNTH",
		tags: ["pluck", "piano"],
		data: {
			schemaVersion: 1,
			params: {
				lineSelect: "L1+L2'",
				modMode: "ring",
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
								level: 66,
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
								level: 12,
								rate: 99,
							},
							{
								level: 1,
								rate: 55,
							},
							{
								level: 0,
								rate: 46,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
								level: 74,
								rate: 55,
							},
							{
								level: 0,
								rate: 34,
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
					keyFollow: 1,
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
					detuneNote: 5,
					detuneFine: 0,
					octave: 3,
					dcoEnv: {
						steps: [
							{
								level: 66,
								rate: 99,
							},
							{
								level: 0,
								rate: 1,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
								level: 47,
								rate: 99,
							},
							{
								level: 42,
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
						],
						sustainStep: 1,
						stepCount: 4,
						loop: false,
					},
					dcaEnv: {
						steps: [
							{
								level: 75,
								rate: 92,
							},
							{
								level: 85,
								rate: 86,
							},
							{
								level: 34,
								rate: 57,
							},
							{
								level: 0,
								rate: 31,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
				volume: 0.8,
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
							rate: 50,
							depth: 5,
							delay: 36,
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
	},
	{
		name: "ENVFLTRFATORGN",
		tags: ["organ"],
		data: {
			schemaVersion: 1,
			params: {
				lineSelect: "L1+L2'",
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
								rate: 82,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
					dcaEnv: {
						steps: [
							{
								level: 99,
								rate: 94,
							},
							{
								level: 99,
								rate: 55,
							},
							{
								level: 0,
								rate: 21,
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
						sustainStep: 2,
						stepCount: 4,
						loop: false,
					},
					keyFollow: 9,
					algoControlsA: [
						{
							id: "preset",
							value: 7,
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
							value: 3,
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
								level: 57,
								rate: 99,
							},
							{
								level: 0,
								rate: 56,
							},
							{
								level: 98,
								rate: 55,
							},
							{
								level: 0,
								rate: 46,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
					algoControlsB: [],
				},
				frequency: 440,
				volume: 0.8,
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
							rate: 52,
							depth: 5,
							delay: 51,
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
	},
	{
		name: "FADE BRASS",
		tags: ["brass"],
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
								level: 9,
								rate: 88,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
								rate: 60,
							},
							{
								level: 88,
								rate: 56,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
					keyFollow: 8,
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
					detuneFine: 4,
					octave: 0,
					dcoEnv: {
						steps: [
							{
								level: 12,
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
								level: 75,
								rate: 94,
							},
							{
								level: 88,
								rate: 35,
							},
							{
								level: 64,
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
						],
						sustainStep: 2,
						stepCount: 3,
						loop: false,
					},
					dcaEnv: {
						steps: [
							{
								level: 91,
								rate: 95,
							},
							{
								level: 44,
								rate: 55,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
					keyFollow: 6,
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
				frequency: 440,
				volume: 0.8,
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
							rate: 54,
							depth: 16,
							delay: 6,
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
	},
	{
		name: "FASST CHORDS",
		tags: ["keys"],
		data: {
			schemaVersion: 1,
			params: {
				lineSelect: "L1+L2'",
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
								level: 64,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
								rate: 28,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
								level: 34,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
					detuneFine: 10,
					octave: 1,
					dcoEnv: {
						steps: [
							{
								level: 64,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
								level: 34,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
					algoControlsB: [],
				},
				frequency: 440,
				volume: 0.8,
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
							rate: 4,
							depth: 5,
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
	},
	{
		name: "FAT2",
		tags: ["brass"],
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
						stepCount: 1,
						loop: false,
					},
					dcwEnv: {
						steps: [
							{
								level: 90,
								rate: 92,
							},
							{
								level: 65,
								rate: 34,
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
								level: 0,
								rate: 21,
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
						sustainStep: 2,
						stepCount: 3,
						loop: false,
					},
					keyFollow: 9,
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
					detuneFine: -10,
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
						stepCount: 1,
						loop: false,
					},
					dcwEnv: {
						steps: [
							{
								level: 83,
								rate: 99,
							},
							{
								level: 72,
								rate: 43,
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
								rate: 27,
							},
							{
								level: 0,
								rate: 46,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
					keyFollow: 9,
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
					algoControlsB: [],
				},
				frequency: 440,
				volume: 0.8,
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
							enabled: false,
							waveform: 1,
							rate: 52,
							depth: 0,
							delay: 49,
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
	},
	{
		name: "FILSWEEP5T",
		tags: ["synth", "pad"],
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
								level: 76,
								rate: 34,
							},
							{
								level: 58,
								rate: 71,
							},
							{
								level: 77,
								rate: 91,
							},
							{
								level: 37,
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
						sustainStep: 2,
						stepCount: 4,
						loop: false,
					},
					dcaEnv: {
						steps: [
							{
								level: 99,
								rate: 71,
							},
							{
								level: 56,
								rate: 83,
							},
							{
								level: 92,
								rate: 80,
							},
							{
								level: 49,
								rate: 72,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
							id: "preset",
							value: 0,
						},
						{
							id: "waveform1",
							value: 6,
						},
						{
							id: "waveform2",
							value: 5,
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
							value: 5,
						},
						{
							id: "waveform2",
							value: 5,
						},
						{
							id: "windowFunction",
							value: 3,
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
					detuneNote: -7,
					detuneFine: -8,
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
								level: 76,
								rate: 77,
							},
							{
								level: 52,
								rate: 75,
							},
							{
								level: 71,
								rate: 71,
							},
							{
								level: 51,
								rate: 75,
							},
							{
								level: 71,
								rate: 86,
							},
							{
								level: 50,
								rate: 72,
							},
							{
								level: 88,
								rate: 49,
							},
							{
								level: 0,
								rate: 23,
							},
						],
						sustainStep: 6,
						stepCount: 8,
						loop: false,
					},
					dcaEnv: {
						steps: [
							{
								level: 99,
								rate: 71,
							},
							{
								level: 56,
								rate: 83,
							},
							{
								level: 92,
								rate: 80,
							},
							{
								level: 49,
								rate: 72,
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
						],
						sustainStep: 2,
						stepCount: 5,
						loop: false,
					},
					keyFollow: 6,
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
							value: 6,
						},
						{
							id: "windowFunction",
							value: 2,
						},
					],
					algoControlsB: [
						{
							id: "preset",
							value: 6,
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
							value: 2,
						},
					],
				},
				frequency: 440,
				volume: 0.8,
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
							rate: 54,
							depth: 28,
							delay: 49,
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
	},
	{
		name: "FILT SWEEP",
		tags: ["synth", "pad"],
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
					dcaBase: 1,
					dcwBase: 1,
					modulation: 0,
					detuneNote: 0,
					detuneFine: 0,
					octave: 1,
					dcoEnv: {
						steps: [
							{
								level: 26,
								rate: 82,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
								rate: 84,
							},
							{
								level: 81,
								rate: 40,
							},
							{
								level: 62,
								rate: 35,
							},
							{
								level: 40,
								rate: 33,
							},
							{
								level: 23,
								rate: 28,
							},
							{
								level: 10,
								rate: 20,
							},
							{
								level: 4,
								rate: 22,
							},
							{
								level: 0,
								rate: 50,
							},
						],
						sustainStep: 5,
						stepCount: 7,
						loop: false,
					},
					dcaEnv: {
						steps: [
							{
								level: 37,
								rate: 45,
							},
							{
								level: 68,
								rate: 42,
							},
							{
								level: 82,
								rate: 35,
							},
							{
								level: 92,
								rate: 25,
							},
							{
								level: 78,
								rate: 8,
							},
							{
								level: 37,
								rate: 25,
							},
							{
								level: 0,
								rate: 30,
							},
							{
								level: 0,
								rate: 25,
							},
						],
						sustainStep: 6,
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
							value: 5,
						},
						{
							id: "waveform2",
							value: 6,
						},
						{
							id: "windowFunction",
							value: 3,
						},
					],
					algoControlsB: [
						{
							id: "preset",
							value: 7,
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
							value: 3,
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
					detuneFine: 3,
					octave: 1,
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
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
					keyFollow: 4,
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
				volume: 0.8,
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
							enabled: false,
							waveform: 1,
							rate: 0,
							depth: 0,
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
	},
	{
		name: "FLTR-SWP/REED",
		tags: ["synth", "pad"],
		data: {
			schemaVersion: 1,
			params: {
				lineSelect: "L1+L2'",
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
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
								level: 83,
								rate: 44,
							},
							{
								level: 0,
								rate: 13,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
								rate: 53,
							},
							{
								level: 99,
								rate: 84,
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
						],
						sustainStep: 1,
						stepCount: 3,
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
					algo2: "cz101",
					algoBlend: 0,
					baseWaveformA: "cosine",
					baseWaveformB: "cosine",
					window: "off",
					dcaBase: 1,
					dcwBase: 1,
					modulation: 0,
					detuneNote: 0,
					detuneFine: 6,
					octave: 0,
					dcoEnv: {
						steps: [
							{
								level: 76,
								rate: 99,
							},
							{
								level: 0,
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
								level: 23,
								rate: 64,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
					dcaEnv: {
						steps: [
							{
								level: 99,
								rate: 99,
							},
							{
								level: 99,
								rate: 84,
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
						sustainStep: 1,
						stepCount: 3,
						loop: false,
					},
					keyFollow: 5,
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
				frequency: 440,
				volume: 0.8,
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
							rate: 44,
							depth: 8,
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
	},
	{
		name: "FOLKGUITARSYN",
		tags: ["guitar"],
		data: {
			schemaVersion: 1,
			params: {
				lineSelect: "L1+L2'",
				modMode: "ring",
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
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
					dcaEnv: {
						steps: [
							{
								level: 99,
								rate: 94,
							},
							{
								level: 1,
								rate: 32,
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
						sustainStep: 1,
						stepCount: 3,
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
					detuneNote: 7,
					detuneFine: 0,
					octave: 1,
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
								level: 83,
								rate: 77,
							},
							{
								level: 33,
								rate: 43,
							},
							{
								level: 1,
								rate: 6,
							},
							{
								level: 0,
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
						],
						sustainStep: 3,
						stepCount: 5,
						loop: false,
					},
					dcaEnv: {
						steps: [
							{
								level: 90,
								rate: 94,
							},
							{
								level: 0,
								rate: 37,
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
						sustainStep: 1,
						stepCount: 3,
						loop: false,
					},
					keyFollow: 1,
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
					algoControlsB: [],
				},
				frequency: 440,
				volume: 0.8,
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
							rate: 48,
							depth: 2,
							delay: 55,
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
	},
	{
		name: "FRCH HORN",
		tags: ["wind"],
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
								level: 70,
								rate: 67,
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
						sustainStep: 1,
						stepCount: 2,
						loop: false,
					},
					dcaEnv: {
						steps: [
							{
								level: 93,
								rate: 70,
							},
							{
								level: 61,
								rate: 70,
							},
							{
								level: 97,
								rate: 70,
							},
							{
								level: 75,
								rate: 70,
							},
							{
								level: 99,
								rate: 70,
							},
							{
								level: 0,
								rate: 78,
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
						sustainStep: 4,
						stepCount: 6,
						loop: false,
					},
					keyFollow: 4,
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
								level: 79,
								rate: 72,
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
						sustainStep: 1,
						stepCount: 2,
						loop: false,
					},
					dcaEnv: {
						steps: [
							{
								level: 93,
								rate: 83,
							},
							{
								level: 61,
								rate: 70,
							},
							{
								level: 98,
								rate: 70,
							},
							{
								level: 76,
								rate: 70,
							},
							{
								level: 91,
								rate: 70,
							},
							{
								level: 0,
								rate: 79,
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
						sustainStep: 4,
						stepCount: 6,
						loop: false,
					},
					keyFollow: 4,
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
				volume: 0.8,
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
							rate: 49,
							depth: 3,
							delay: 32,
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
	},
	{
		name: "FROGGY",
		tags: ["keys"],
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
					octave: 0,
					dcoEnv: {
						steps: [
							{
								level: 65,
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
								level: 91,
								rate: 65,
							},
							{
								level: 99,
								rate: 46,
							},
							{
								level: 75,
								rate: 31,
							},
							{
								level: 0,
								rate: 49,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
					keyFollow: 4,
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
					detuneNote: 7,
					detuneFine: 18,
					octave: 1,
					dcoEnv: {
						steps: [
							{
								level: 65,
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
								level: 91,
								rate: 69,
							},
							{
								level: 99,
								rate: 46,
							},
							{
								level: 75,
								rate: 31,
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
						sustainStep: 2,
						stepCount: 4,
						loop: false,
					},
					keyFollow: 4,
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
							value: 6,
						},
						{
							id: "windowFunction",
							value: 3,
						},
					],
					algoControlsB: [
						{
							id: "preset",
							value: 7,
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
							value: 3,
						},
					],
				},
				frequency: 440,
				volume: 0.8,
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
							rate: 54,
							depth: 27,
							delay: 24,
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
	},
	{
		name: "GOOD HUMAN",
		tags: ["voice", "pad"],
		data: {
			schemaVersion: 1,
			params: {
				lineSelect: "L1+L1'",
				modMode: "ring",
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
								level: 65,
								rate: 99,
							},
							{
								level: 66,
								rate: 40,
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
					dcaEnv: {
						steps: [
							{
								level: 91,
								rate: 69,
							},
							{
								level: 99,
								rate: 23,
							},
							{
								level: 77,
								rate: 31,
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
					detuneFine: 8,
					octave: -1,
					dcoEnv: {
						steps: [
							{
								level: 65,
								rate: 99,
							},
							{
								level: 66,
								rate: 40,
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
					dcaEnv: {
						steps: [
							{
								level: 91,
								rate: 69,
							},
							{
								level: 99,
								rate: 23,
							},
							{
								level: 77,
								rate: 31,
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
				frequency: 440,
				volume: 0.8,
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
							rate: 54,
							depth: 27,
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
	},
	{
		name: "GUITAR",
		tags: ["guitar"],
		data: {
			schemaVersion: 1,
			params: {
				lineSelect: "L1+L1'",
				modMode: "ring",
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
								level: 74,
								rate: 99,
							},
							{
								level: 0,
								rate: 85,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
								rate: 95,
							},
							{
								level: 25,
								rate: 99,
							},
							{
								level: 50,
								rate: 99,
							},
							{
								level: 0,
								rate: 28,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
								rate: 90,
							},
							{
								level: 0,
								rate: 25,
							},
							{
								level: 0,
								rate: 72,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
					keyFollow: 3,
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
					detuneNote: 7,
					detuneFine: 1,
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
						stepCount: 1,
						loop: false,
					},
					dcwEnv: {
						steps: [
							{
								level: 65,
								rate: 98,
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
								rate: 95,
							},
							{
								level: 0,
								rate: 23,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
					keyFollow: 1,
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
				frequency: 440,
				volume: 0.8,
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
							rate: 54,
							depth: 5,
							delay: 69,
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
	},
	{
		name: "HA HA HA",
		tags: ["brass"],
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
								level: 33,
								rate: 64,
							},
							{
								level: 66,
								rate: 46,
							},
							{
								level: 66,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
								level: 24,
								rate: 99,
							},
							{
								level: 24,
								rate: 14,
							},
							{
								level: 66,
								rate: 22,
							},
							{
								level: 42,
								rate: 33,
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
						sustainStep: 7,
						stepCount: 8,
						loop: false,
					},
					dcaEnv: {
						steps: [
							{
								level: 41,
								rate: 74,
							},
							{
								level: 87,
								rate: 62,
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
						sustainStep: 3,
						stepCount: 5,
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
							value: 4,
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
				volume: 0.8,
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
							rate: 50,
							depth: 9,
							delay: 38,
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
	},
	{
		name: "HARPSICHORDTH",
		tags: ["piano", "keys"],
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
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
								level: 80,
								rate: 99,
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
					dcaEnv: {
						steps: [
							{
								level: 92,
								rate: 75,
							},
							{
								level: 92,
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
					detuneFine: 6,
					octave: 2,
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
						sustainStep: 7,
						stepCount: 8,
						loop: false,
					},
					dcwEnv: {
						steps: [
							{
								level: 85,
								rate: 99,
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
					dcaEnv: {
						steps: [
							{
								level: 99,
								rate: 99,
							},
							{
								level: 60,
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
				volume: 0.8,
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
							rate: 52,
							depth: 10,
							delay: 53,
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
	},
	{
		name: "INTERNAL_1",
		tags: ["synth"],
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
								level: 95,
								rate: 99,
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
					dcaEnv: {
						steps: [
							{
								level: 94,
								rate: 72,
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
							{
								level: 0,
								rate: 50,
							},
						],
						sustainStep: 0,
						stepCount: 2,
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
					algo2: "cz101",
					algoBlend: 0,
					baseWaveformA: "cosine",
					baseWaveformB: "cosine",
					window: "off",
					dcaBase: 1,
					dcwBase: 1,
					modulation: 0,
					detuneNote: 0,
					detuneFine: -7,
					octave: -1,
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
								level: 90,
								rate: 99,
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
					dcaEnv: {
						steps: [
							{
								level: 94,
								rate: 72,
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
				frequency: 440,
				volume: 0.8,
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
							rate: 8,
							depth: 4,
							delay: 11,
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
	},
	{
		name: "INTERNAL_2",
		tags: ["synth"],
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
					octave: 0,
					dcoEnv: {
						steps: [
							{
								level: 10,
								rate: 62,
							},
							{
								level: 66,
								rate: 76,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
								level: 65,
								rate: 85,
							},
							{
								level: 58,
								rate: 54,
							},
							{
								level: 46,
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
						],
						sustainStep: 2,
						stepCount: 4,
						loop: false,
					},
					dcaEnv: {
						steps: [
							{
								level: 99,
								rate: 91,
							},
							{
								level: 0,
								rate: 21,
							},
							{
								level: 61,
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
							{
								level: 0,
								rate: 50,
							},
						],
						sustainStep: 1,
						stepCount: 4,
						loop: false,
					},
					keyFollow: 9,
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
							value: 4,
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
							value: 4,
						},
						{
							id: "waveform2",
							value: 4,
						},
						{
							id: "windowFunction",
							value: 3,
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
								level: 59,
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
								level: 50,
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
						],
						sustainStep: 1,
						stepCount: 3,
						loop: false,
					},
					dcaEnv: {
						steps: [
							{
								level: 57,
								rate: 99,
							},
							{
								level: 0,
								rate: 36,
							},
							{
								level: 0,
								rate: 36,
							},
							{
								level: 0,
								rate: 24,
							},
							{
								level: 0,
								rate: 46,
							},
							{
								level: 0,
								rate: 50,
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
						stepCount: 5,
						loop: false,
					},
					keyFollow: 9,
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
					algoControlsB: [
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
				},
				frequency: 440,
				volume: 0.8,
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
							rate: 14,
							depth: 5,
							delay: 5,
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
	},
	{
		name: "INTERNAL_3",
		tags: ["synth"],
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
					octave: -1,
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
								level: 31,
								rate: 99,
							},
							{
								level: 20,
								rate: 53,
							},
							{
								level: 20,
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
								rate: 84,
							},
							{
								level: 99,
								rate: 42,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
							value: 7,
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
							value: 3,
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
					detuneFine: 7,
					octave: -1,
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
								level: 90,
								rate: 86,
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
								rate: 90,
							},
							{
								level: 98,
								rate: 31,
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
						sustainStep: 0,
						stepCount: 8,
						loop: false,
					},
					keyFollow: 2,
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
				volume: 0.8,
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
							rate: 51,
							depth: 18,
							delay: 11,
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
	},
	{
		name: "INTERNAL_4",
		tags: ["synth"],
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
								rate: 76,
							},
							{
								level: 85,
								rate: 72,
							},
							{
								level: 63,
								rate: 20,
							},
							{
								level: 0,
								rate: 32,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
								rate: 73,
							},
							{
								level: 99,
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
							value: 4,
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
					algo2: "cz101",
					algoBlend: 0,
					baseWaveformA: "cosine",
					baseWaveformB: "cosine",
					window: "off",
					dcaBase: 1,
					dcwBase: 1,
					modulation: 0,
					detuneNote: 0,
					detuneFine: -11,
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
								level: 77,
								rate: 68,
							},
							{
								level: 53,
								rate: 55,
							},
							{
								level: 41,
								rate: 15,
							},
							{
								level: 0,
								rate: 32,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
								rate: 73,
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
					keyFollow: 11,
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
							value: 0,
						},
						{
							id: "windowFunction",
							value: 1,
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
							value: 1,
						},
					],
				},
				frequency: 440,
				volume: 0.8,
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
							rate: 47,
							depth: 7,
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
	},
	{
		name: "INTERNAL_5",
		tags: ["synth"],
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
					octave: -1,
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
								level: 98,
								rate: 28,
							},
							{
								level: 34,
								rate: 63,
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
						],
						sustainStep: 2,
						stepCount: 4,
						loop: false,
					},
					dcaEnv: {
						steps: [
							{
								level: 99,
								rate: 78,
							},
							{
								level: 98,
								rate: 16,
							},
							{
								level: 0,
								rate: 46,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
					keyFollow: 2,
					algoControlsA: [
						{
							id: "preset",
							value: 5,
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
					detuneFine: -7,
					octave: -1,
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
								level: 90,
								rate: 86,
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
								rate: 90,
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
							value: 0,
						},
						{
							id: "waveform1",
							value: 4,
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
				volume: 0.8,
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
							rate: 51,
							depth: 18,
							delay: 11,
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
	},
	{
		name: "INTERNAL_6",
		tags: ["synth"],
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
					octave: -1,
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
								level: 64,
								rate: 78,
							},
							{
								level: 63,
								rate: 41,
							},
							{
								level: 20,
								rate: 56,
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
						],
						sustainStep: 2,
						stepCount: 4,
						loop: false,
					},
					dcaEnv: {
						steps: [
							{
								level: 99,
								rate: 84,
							},
							{
								level: 98,
								rate: 31,
							},
							{
								level: 0,
								rate: 56,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
							value: 7,
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
							value: 3,
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
					detuneFine: 7,
					octave: -1,
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
								level: 90,
								rate: 86,
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
								rate: 90,
							},
							{
								level: 98,
								rate: 31,
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
						sustainStep: 0,
						stepCount: 8,
						loop: false,
					},
					keyFollow: 2,
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
				volume: 0.8,
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
							rate: 51,
							depth: 18,
							delay: 11,
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
	},
	{
		name: "INTERNAL_7",
		tags: ["synth"],
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
								level: 90,
								rate: 78,
							},
							{
								level: 15,
								rate: 29,
							},
							{
								level: 90,
								rate: 29,
							},
							{
								level: 15,
								rate: 29,
							},
							{
								level: 90,
								rate: 29,
							},
							{
								level: 15,
								rate: 29,
							},
							{
								level: 90,
								rate: 29,
							},
							{
								level: 0,
								rate: 29,
							},
						],
						sustainStep: 7,
						stepCount: 8,
						loop: false,
					},
					dcaEnv: {
						steps: [
							{
								level: 94,
								rate: 84,
							},
							{
								level: 80,
								rate: 56,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
							value: 6,
						},
						{
							id: "waveform2",
							value: 4,
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
							value: 4,
						},
						{
							id: "waveform2",
							value: 4,
						},
						{
							id: "windowFunction",
							value: 3,
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
								level: 90,
								rate: 86,
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
								rate: 90,
							},
							{
								level: 98,
								rate: 31,
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
						sustainStep: 0,
						stepCount: 8,
						loop: false,
					},
					keyFollow: 2,
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
				volume: 0.8,
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
							rate: 51,
							depth: 18,
							delay: 11,
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
	},
	{
		name: "INTERNAL_8",
		tags: ["synth"],
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
								level: 99,
								rate: 99,
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
								level: 83,
								rate: 64,
							},
							{
								level: 99,
								rate: 56,
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
						],
						sustainStep: 2,
						stepCount: 4,
						loop: false,
					},
					keyFollow: 2,
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
								level: 99,
								rate: 99,
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
								level: 83,
								rate: 64,
							},
							{
								level: 99,
								rate: 56,
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
						],
						sustainStep: 2,
						stepCount: 4,
						loop: false,
					},
					keyFollow: 2,
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
				volume: 0.8,
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
							rate: 51,
							depth: 18,
							delay: 11,
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
	},
	{
		name: "INTERNAL_9",
		tags: ["synth"],
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
					octave: -1,
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
								level: 50,
								rate: 25,
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
								rate: 74,
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
					detuneFine: 21,
					octave: -1,
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
								level: 94,
								rate: 72,
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
				volume: 0.8,
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
							rate: 51,
							depth: 18,
							delay: 11,
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
	},
	{
		name: "INTERNAL_10",
		tags: ["synth"],
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
					octave: -1,
					dcoEnv: {
						steps: [
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
								level: 17,
								rate: 70,
							},
							{
								level: 99,
								rate: 17,
							},
							{
								level: 74,
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
						sustainStep: 1,
						stepCount: 3,
						loop: false,
					},
					dcaEnv: {
						steps: [
							{
								level: 99,
								rate: 70,
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
						stepCount: 8,
						loop: false,
					},
					keyFollow: 0,
					algoControlsA: [
						{
							id: "preset",
							value: 5,
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
					detuneFine: 7,
					octave: -1,
					dcoEnv: {
						steps: [
							{
								level: 66,
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
							{
								level: 0,
								rate: 50,
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
								rate: 40,
							},
							{
								level: 74,
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
					dcaEnv: {
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
					keyFollow: 5,
					algoControlsA: [
						{
							id: "preset",
							value: 5,
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
					algoControlsB: [],
				},
				frequency: 440,
				volume: 0.8,
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
							enabled: false,
							waveform: 1,
							rate: 0,
							depth: 0,
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
	},
	{
		name: "INTERNAL_11",
		tags: ["synth"],
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
								level: 87,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
								level: 88,
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
								rate: 42,
							},
							{
								level: 87,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
								level: 88,
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
							value: 2,
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
				frequency: 440,
				volume: 0.8,
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
							rate: 23,
							depth: 6,
							delay: 33,
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
	},
	{
		name: "INTERNAL_12",
		tags: ["synth"],
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
					octave: -1,
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
								level: 90,
								rate: 78,
							},
							{
								level: 15,
								rate: 29,
							},
							{
								level: 90,
								rate: 29,
							},
							{
								level: 15,
								rate: 29,
							},
							{
								level: 90,
								rate: 29,
							},
							{
								level: 15,
								rate: 29,
							},
							{
								level: 90,
								rate: 29,
							},
							{
								level: 0,
								rate: 29,
							},
						],
						sustainStep: 7,
						stepCount: 8,
						loop: false,
					},
					dcaEnv: {
						steps: [
							{
								level: 94,
								rate: 84,
							},
							{
								level: 80,
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
								level: 90,
								rate: 86,
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
								rate: 90,
							},
							{
								level: 98,
								rate: 31,
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
								rate: 38,
							},
						],
						sustainStep: 0,
						stepCount: 8,
						loop: false,
					},
					keyFollow: 2,
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
							value: 6,
						},
						{
							id: "windowFunction",
							value: 3,
						},
					],
					algoControlsB: [
						{
							id: "preset",
							value: 7,
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
							value: 3,
						},
					],
				},
				frequency: 440,
				volume: 0.8,
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
							rate: 51,
							depth: 18,
							delay: 11,
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
	},
	{
		name: "INTERNAL_13",
		tags: ["synth"],
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
								level: 90,
								rate: 74,
							},
							{
								level: 0,
								rate: 37,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
								rate: 78,
							},
							{
								level: 0,
								rate: 46,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
							value: 0,
						},
						{
							id: "waveform1",
							value: 0,
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
					algo2: "cz101",
					algoBlend: 0,
					baseWaveformA: "cosine",
					baseWaveformB: "cosine",
					window: "off",
					dcaBase: 1,
					dcwBase: 1,
					modulation: 0,
					detuneNote: 0,
					detuneFine: -10,
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
								level: 90,
								rate: 86,
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
								rate: 90,
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
							value: 0,
						},
						{
							id: "waveform1",
							value: 4,
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
				volume: 0.8,
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
							rate: 51,
							depth: 18,
							delay: 11,
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
	},
	{
		name: "INTERNAL_14",
		tags: ["synth"],
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
								level: 55,
								rate: 50,
							},
							{
								level: 33,
								rate: 38,
							},
							{
								level: 90,
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
								rate: 84,
							},
							{
								level: 80,
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
							value: 6,
						},
						{
							id: "waveform2",
							value: 4,
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
							value: 4,
						},
						{
							id: "waveform2",
							value: 4,
						},
						{
							id: "windowFunction",
							value: 3,
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
					octave: 0,
					dcoEnv: {
						steps: [
							{
								level: 3,
								rate: 70,
							},
							{
								level: 0,
								rate: 1,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
								level: 55,
								rate: 50,
							},
							{
								level: 33,
								rate: 38,
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
								rate: 84,
							},
							{
								level: 99,
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
				frequency: 440,
				volume: 0.8,
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
							rate: 45,
							depth: 14,
							delay: 11,
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
	},
	{
		name: "INTERNAL_15",
		tags: ["synth"],
		data: {
			schemaVersion: 1,
			params: {
				lineSelect: "L1+L2'",
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
								level: 95,
								rate: 99,
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
					dcaEnv: {
						steps: [
							{
								level: 94,
								rate: 72,
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
							{
								level: 0,
								rate: 50,
							},
						],
						sustainStep: 0,
						stepCount: 2,
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
								level: 90,
								rate: 99,
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
					dcaEnv: {
						steps: [
							{
								level: 94,
								rate: 72,
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
				frequency: 440,
				volume: 0.8,
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
							rate: 8,
							depth: 4,
							delay: 11,
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
	},
	{
		name: "INTERNAL_16",
		tags: ["synth"],
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
								rate: 78,
							},
							{
								level: 65,
								rate: 22,
							},
							{
								level: 99,
								rate: 22,
							},
							{
								level: 65,
								rate: 22,
							},
							{
								level: 99,
								rate: 22,
							},
							{
								level: 65,
								rate: 22,
							},
							{
								level: 99,
								rate: 22,
							},
							{
								level: 0,
								rate: 22,
							},
						],
						sustainStep: 7,
						stepCount: 8,
						loop: false,
					},
					dcaEnv: {
						steps: [
							{
								level: 99,
								rate: 84,
							},
							{
								level: 80,
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
								level: 90,
								rate: 86,
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
								rate: 90,
							},
							{
								level: 98,
								rate: 31,
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
						sustainStep: 0,
						stepCount: 8,
						loop: false,
					},
					keyFollow: 2,
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
				volume: 0.8,
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
							rate: 51,
							depth: 18,
							delay: 11,
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
	},
	{
		name: "JUMP I",
		tags: ["synth", "brass"],
		data: {
			schemaVersion: 1,
			params: {
				lineSelect: "L1+L2'",
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
								level: 99,
								rate: 99,
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
								rate: 78,
							},
							{
								level: 0,
								rate: 57,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
					detuneFine: 10,
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
								level: 99,
								rate: 99,
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
								level: 94,
								rate: 78,
							},
							{
								level: 0,
								rate: 57,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
				frequency: 440,
				volume: 0.8,
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
							enabled: false,
							waveform: 1,
							rate: 0,
							depth: 0,
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
	},
	{
		name: "METALKEY1",
		tags: ["pluck"],
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
								level: 62,
								rate: 99,
							},
							{
								level: 0,
								rate: 76,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
								level: 83,
								rate: 99,
							},
							{
								level: 13,
								rate: 95,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
								rate: 99,
							},
							{
								level: 0,
								rate: 30,
							},
							{
								level: 0,
								rate: 55,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
							id: "preset",
							value: 0,
						},
						{
							id: "waveform1",
							value: 5,
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
					octave: 3,
					dcoEnv: {
						steps: [
							{
								level: 50,
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
								level: 92,
								rate: 89,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
						stepCount: 8,
						loop: false,
					},
					dcaEnv: {
						steps: [
							{
								level: 99,
								rate: 95,
							},
							{
								level: 0,
								rate: 55,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
				frequency: 440,
				volume: 0.8,
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
							rate: 38,
							depth: 5,
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
	},
	{
		name: "MOOGIII",
		tags: ["synth", "bass"],
		data: {
			schemaVersion: 1,
			params: {
				lineSelect: "L1+L2'",
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
						sustainStep: 0,
						stepCount: 1,
						loop: false,
					},
					dcwEnv: {
						steps: [
							{
								level: 90,
								rate: 92,
							},
							{
								level: 58,
								rate: 34,
							},
							{
								level: 0,
								rate: 21,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
								level: 93,
								rate: 90,
							},
							{
								level: 75,
								rate: 42,
							},
							{
								level: 0,
								rate: 43,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
					keyFollow: 1,
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
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
								level: 95,
								rate: 99,
							},
							{
								level: 61,
								rate: 42,
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
						],
						sustainStep: 1,
						stepCount: 4,
						loop: false,
					},
					dcaEnv: {
						steps: [
							{
								level: 99,
								rate: 90,
							},
							{
								level: 0,
								rate: 23,
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
							{
								level: 0,
								rate: 50,
							},
						],
						sustainStep: 2,
						stepCount: 3,
						loop: false,
					},
					keyFollow: 6,
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
				frequency: 440,
				volume: 0.8,
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
							rate: 52,
							depth: 10,
							delay: 31,
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
	},
	{
		name: "NEW AGE PLUCK",
		tags: ["synth", "effect", "pluck"],
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
					dcaBase: 1,
					dcwBase: 1,
					modulation: 0,
					detuneNote: 0,
					detuneFine: 0,
					octave: -1,
					dcoEnv: {
						steps: [
							{
								level: 41,
								rate: 29,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
								level: 95,
								rate: 95,
							},
							{
								level: 88,
								rate: 37,
							},
							{
								level: 75,
								rate: 46,
							},
							{
								level: 0,
								rate: 42,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
								level: 89,
								rate: 95,
							},
							{
								level: 74,
								rate: 27,
							},
							{
								level: 88,
								rate: 37,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
							id: "preset",
							value: 0,
						},
						{
							id: "waveform1",
							value: 2,
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
					algoControlsB: [
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
					detuneNote: 7,
					detuneFine: 3,
					octave: 0,
					dcoEnv: {
						steps: [
							{
								level: 44,
								rate: 62,
							},
							{
								level: 0,
								rate: 15,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
								level: 95,
								rate: 95,
							},
							{
								level: 88,
								rate: 37,
							},
							{
								level: 75,
								rate: 46,
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
								rate: 4,
							},
							{
								level: 6,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
					keyFollow: 7,
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
				volume: 0.8,
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
							rate: 51,
							depth: 3,
							delay: 11,
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
	},
	{
		name: "OBERHEIM MOAN",
		tags: ["synth", "pad"],
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
					dcaBase: 1,
					dcwBase: 1,
					modulation: 0,
					detuneNote: 0,
					detuneFine: 0,
					octave: 0,
					dcoEnv: {
						steps: [
							{
								level: 66,
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
						sustainStep: 1,
						stepCount: 2,
						loop: false,
					},
					dcwEnv: {
						steps: [
							{
								level: 67,
								rate: 91,
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
					dcaEnv: {
						steps: [
							{
								level: 69,
								rate: 77,
							},
							{
								level: 75,
								rate: 48,
							},
							{
								level: 99,
								rate: 39,
							},
							{
								level: 99,
								rate: 68,
							},
							{
								level: 0,
								rate: 32,
							},
							{
								level: 0,
								rate: 50,
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
						stepCount: 5,
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
							value: 4,
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
					detuneFine: 10,
					octave: 1,
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
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
				volume: 0.8,
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
							rate: 49,
							depth: 21,
							delay: 28,
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
	},
	{
		name: "PB8_9",
		tags: ["synth", "effect"],
		data: {
			schemaVersion: 1,
			params: {
				lineSelect: "L1+L1'",
				modMode: "ring",
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
								level: 69,
								rate: 74,
							},
							{
								level: 71,
								rate: 36,
							},
							{
								level: 69,
								rate: 99,
							},
							{
								level: 72,
								rate: 43,
							},
							{
								level: 69,
								rate: 99,
							},
							{
								level: 70,
								rate: 34,
							},
							{
								level: 69,
								rate: 53,
							},
							{
								level: 0,
								rate: 0,
							},
						],
						sustainStep: 7,
						stepCount: 8,
						loop: false,
					},
					dcwEnv: {
						steps: [
							{
								level: 21,
								rate: 67,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
								level: 99,
								rate: 84,
							},
							{
								level: 0,
								rate: 32,
							},
							{
								level: 0,
								rate: 44,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
					detuneNote: 3,
					detuneFine: 38,
					octave: 0,
					dcoEnv: {
						steps: [
							{
								level: 49,
								rate: 99,
							},
							{
								level: 64,
								rate: 46,
							},
							{
								level: 45,
								rate: 44,
							},
							{
								level: 64,
								rate: 57,
							},
							{
								level: 45,
								rate: 62,
							},
							{
								level: 66,
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
						],
						sustainStep: 6,
						stepCount: 7,
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
						stepCount: 1,
						loop: false,
					},
					dcaEnv: {
						steps: [
							{
								level: 99,
								rate: 79,
							},
							{
								level: 0,
								rate: 32,
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
							{
								level: 0,
								rate: 50,
							},
						],
						sustainStep: 2,
						stepCount: 3,
						loop: false,
					},
					keyFollow: 0,
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
				volume: 0.8,
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
							waveform: 3,
							rate: 78,
							depth: 44,
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
	},
	{
		name: "PIANO III",
		tags: ["piano"],
		data: {
			schemaVersion: 1,
			params: {
				lineSelect: "L1+L2'",
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
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
								level: 90,
								rate: 92,
							},
							{
								level: 65,
								rate: 34,
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
								level: 0,
								rate: 21,
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
						sustainStep: 2,
						stepCount: 3,
						loop: false,
					},
					keyFollow: 9,
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
					detuneFine: -5,
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
						stepCount: 1,
						loop: false,
					},
					dcwEnv: {
						steps: [
							{
								level: 83,
								rate: 99,
							},
							{
								level: 72,
								rate: 43,
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
								rate: 27,
							},
							{
								level: 0,
								rate: 46,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
					keyFollow: 9,
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
					algoControlsB: [],
				},
				frequency: 440,
				volume: 0.8,
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
							enabled: false,
							waveform: 1,
							rate: 52,
							depth: 0,
							delay: 49,
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
	},
	{
		name: "PIANO PHASE",
		tags: ["piano"],
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
								level: 66,
								rate: 99,
							},
							{
								level: 0,
								rate: 3,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
								rate: 99,
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
						sustainStep: 0,
						stepCount: 2,
						loop: false,
					},
					dcaEnv: {
						steps: [
							{
								level: 71,
								rate: 99,
							},
							{
								level: 23,
								rate: 60,
							},
							{
								level: 0,
								rate: 49,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
					keyFollow: 1,
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
						sustainStep: 0,
						stepCount: 1,
						loop: false,
					},
					dcwEnv: {
						steps: [
							{
								level: 83,
								rate: 99,
							},
							{
								level: 72,
								rate: 43,
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
								rate: 99,
							},
							{
								level: 59,
								rate: 28,
							},
							{
								level: 0,
								rate: 31,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
				frequency: 440,
				volume: 0.8,
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
							enabled: false,
							waveform: 1,
							rate: 45,
							depth: 0,
							delay: 26,
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
	},
	{
		name: "PIZSTRINGS",
		tags: ["string"],
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
								level: 89,
								rate: 99,
							},
							{
								level: 0,
								rate: 71,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
								level: 89,
								rate: 55,
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
							{
								level: 0,
								rate: 50,
							},
						],
						sustainStep: 2,
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
								level: 99,
								rate: 99,
							},
							{
								level: 0,
								rate: 62,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
								level: 84,
								rate: 99,
							},
							{
								level: 0,
								rate: 49,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
				frequency: 440,
				volume: 0.8,
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
							rate: 50,
							depth: 14,
							delay: 52,
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
	},
	{
		name: "PUNCH BASS",
		tags: ["bass"],
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
								level: 14,
								rate: 47,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
								level: 92,
								rate: 98,
							},
							{
								level: 72,
								rate: 47,
							},
							{
								level: 74,
								rate: 95,
							},
							{
								level: 0,
								rate: 68,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
								level: 45,
								rate: 21,
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
						],
						sustainStep: 1,
						stepCount: 3,
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
					algo2: "cz101",
					algoBlend: 0,
					baseWaveformA: "cosine",
					baseWaveformB: "cosine",
					window: "off",
					dcaBase: 1,
					dcwBase: 1,
					modulation: 0,
					detuneNote: 0,
					detuneFine: 5,
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
								level: 85,
								rate: 98,
							},
							{
								level: 79,
								rate: 43,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
								level: 0,
								rate: 21,
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
				frequency: 440,
				volume: 0.8,
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
							depth: 6,
							delay: 36,
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
	},
	{
		name: "SB.SYNTHBASS 3",
		tags: ["bass"],
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
						stepCount: 1,
						loop: false,
					},
					dcwEnv: {
						steps: [
							{
								level: 95,
								rate: 99,
							},
							{
								level: 30,
								rate: 50,
							},
							{
								level: 99,
								rate: 0,
							},
							{
								level: 0,
								rate: 72,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 60,
							},
						],
						sustainStep: 0,
						stepCount: 8,
						loop: false,
					},
					keyFollow: 9,
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
								level: 85,
								rate: 82,
							},
							{
								level: 60,
								rate: 46,
							},
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
								rate: 50,
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
						stepCount: 5,
						loop: false,
					},
					dcaEnv: {
						steps: [
							{
								level: 99,
								rate: 99,
							},
							{
								level: 70,
								rate: 89,
							},
							{
								level: 85,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
					algoControlsB: [],
				},
				frequency: 440,
				volume: 0.8,
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
							rate: 52,
							depth: 5,
							delay: 51,
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
	},
	{
		name: "SYNTH BASS #2",
		tags: ["bass"],
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
						sustainStep: 7,
						stepCount: 8,
						loop: false,
					},
					dcwEnv: {
						steps: [
							{
								level: 99,
								rate: 99,
							},
							{
								level: 62,
								rate: 55,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
							value: 0,
						},
						{
							id: "waveform1",
							value: 0,
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
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
								rate: 90,
							},
							{
								level: 38,
								rate: 70,
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
								level: 89,
								rate: 90,
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
							value: 0,
						},
						{
							id: "waveform1",
							value: 0,
						},
						{
							id: "waveform2",
							value: 6,
						},
						{
							id: "windowFunction",
							value: 3,
						},
					],
					algoControlsB: [
						{
							id: "preset",
							value: 7,
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
							value: 3,
						},
					],
				},
				frequency: 440,
				volume: 0.8,
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
							rate: 54,
							depth: 25,
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
	},
	{
		name: "UPRIGHT BASS",
		tags: ["bass"],
		data: {
			schemaVersion: 1,
			params: {
				lineSelect: "L1+L2'",
				modMode: "ring",
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
								level: 58,
								rate: 66,
							},
							{
								level: 0,
								rate: 72,
							},
							{
								level: 5,
								rate: 43,
							},
							{
								level: 0,
								rate: 65,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
					dcwEnv: {
						steps: [
							{
								level: 90,
								rate: 99,
							},
							{
								level: 63,
								rate: 54,
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
					dcaEnv: {
						steps: [
							{
								level: 99,
								rate: 99,
							},
							{
								level: 0,
								rate: 28,
							},
							{
								level: 0,
								rate: 56,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
					keyFollow: 9,
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
					detuneFine: -12,
					octave: -2,
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
								level: 80,
								rate: 92,
							},
							{
								level: 62,
								rate: 44,
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
					dcaEnv: {
						steps: [
							{
								level: 99,
								rate: 90,
							},
							{
								level: 0,
								rate: 33,
							},
							{
								level: 0,
								rate: 86,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
					keyFollow: 7,
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
				frequency: 440,
				volume: 0.8,
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
							rate: 49,
							depth: 12,
							delay: 54,
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
	},
	{
		name: "WOOD BASS",
		tags: ["bass"],
		data: {
			schemaVersion: 1,
			params: {
				lineSelect: "L1+L2'",
				modMode: "ring",
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
								level: 29,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
								level: 80,
								rate: 92,
							},
							{
								level: 62,
								rate: 44,
							},
							{
								level: 48,
								rate: 47,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
								level: 77,
								rate: 42,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
					octave: -2,
					dcoEnv: {
						steps: [
							{
								level: 2,
								rate: 0,
							},
							{
								level: 13,
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
						sustainStep: 1,
						stepCount: 2,
						loop: false,
					},
					dcwEnv: {
						steps: [
							{
								level: 80,
								rate: 92,
							},
							{
								level: 62,
								rate: 44,
							},
							{
								level: 0,
								rate: 44,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
								level: 92,
								rate: 86,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
							},
							{
								level: 0,
								rate: 50,
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
				volume: 0.8,
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
							rate: 50,
							depth: 29,
							delay: 31,
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
	},
];
