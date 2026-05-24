import {
	type AutoWahParams,
	type BitcrusherParams,
	type ChorusParams,
	type CompressorParams,
	type DelayParams,
	type DistortionParams,
	type EqParams,
	type FlangerParams,
	type FxSlotType,
	type GrainDelayParams,
	type JunoChorusParams,
	type LfoWaveform,
	type LoFiParams,
	MODULE_PRESET_CATALOG_V1,
	type ModEnvParams,
	type MultimodeFilterParams,
	type PhaseModParams,
	type PhaserParams,
	type ReverbParams,
	type RingModParams,
	type RotarySpeakerParams,
	type ShimmerVerbParams,
	type StereoWidenerParams,
	type TremoloParams,
	type VibratoParams,
	type WavefolderParams,
} from "@/lib/synth/bindings/synth";

export type ModulePresetModule =
	| FxSlotType
	| "lfo1"
	| "lfo2"
	| "modEnv"
	| "random";

export type ModulePresetPatch = Record<string, unknown>;

export type ModulePresetDefinition<TPatch extends ModulePresetPatch> = {
	id: string;
	label: string;
	patch: TPatch;
};

function applyRustPresetCatalog<TPatch extends ModulePresetPatch>(
	module: ModulePresetModule,
	presets: ModulePresetDefinition<TPatch>[],
) {
	const catalogEntry = MODULE_PRESET_CATALOG_V1.find(
		(entry) => entry.module === module,
	);
	if (!catalogEntry) {
		return;
	}

	const presetsById = new Map(presets.map((preset) => [preset.id, preset]));
	const orderedPresets: ModulePresetDefinition<TPatch>[] = [];

	for (const rustPreset of catalogEntry.presets) {
		const matchingPreset = presetsById.get(rustPreset.id);
		if (!matchingPreset) {
			continue;
		}
		orderedPresets.push({ ...matchingPreset, label: rustPreset.label });
		presetsById.delete(rustPreset.id);
	}

	for (const preset of presets) {
		if (presetsById.has(preset.id)) {
			orderedPresets.push(preset);
		}
	}

	if (orderedPresets.length > 0) {
		presets.splice(0, presets.length, ...orderedPresets);
	}
}

export const CHORUS_PRESETS: ModulePresetDefinition<{
	chorus: Required<ChorusParams>;
}>[] = [
	{
		id: "classicWide",
		label: "Classic Wide",
		patch: {
			chorus: { enabled: true, rate: 0.9, depth: 1.2, mix: 0.38 },
		},
	},
	{
		id: "slowShimmer",
		label: "Slow Shimmer",
		patch: {
			chorus: { enabled: true, rate: 0.35, depth: 2.1, mix: 0.44 },
		},
	},
	{
		id: "ensembleThick",
		label: "Ensemble Thick",
		patch: {
			chorus: { enabled: true, rate: 1.8, depth: 2.6, mix: 0.56 },
		},
	},
];

export const DELAY_PRESETS: ModulePresetDefinition<{
	delay: Required<DelayParams>;
}>[] = [
	{
		id: "digitalSlap",
		label: "Digital Slap",
		patch: {
			delay: {
				enabled: true,
				time: 0.11,
				feedback: 0.22,
				mix: 0.27,
				tapeMode: false,
				warmth: 0.2,
				timeMode: "hz",
				syncDivision: "quarter",
			},
		},
	},
	{
		id: "tapeEcho",
		label: "Tape Echo",
		patch: {
			delay: {
				enabled: true,
				time: 0.34,
				feedback: 0.46,
				mix: 0.35,
				tapeMode: true,
				warmth: 0.72,
				timeMode: "hz",
				syncDivision: "quarter",
			},
		},
	},
	{
		id: "dubFeedback",
		label: "Dub Feedback",
		patch: {
			delay: {
				enabled: true,
				time: 0.52,
				feedback: 0.68,
				mix: 0.4,
				tapeMode: true,
				warmth: 0.55,
				timeMode: "hz",
				syncDivision: "half",
			},
		},
	},
];

export const REVERB_PRESETS: ModulePresetDefinition<{
	reverb: Required<ReverbParams>;
}>[] = [
	{
		id: "smallRoom",
		label: "Small Room",
		patch: {
			reverb: {
				enabled: true,
				mix: 0.22,
				space: 0.32,
				predelay: 0.006,
				distance: 0.28,
				character: 0.45,
			},
		},
	},
	{
		id: "plateAir",
		label: "Plate Air",
		patch: {
			reverb: {
				enabled: true,
				mix: 0.31,
				space: 0.58,
				predelay: 0.012,
				distance: 0.4,
				character: 0.74,
			},
		},
	},
	{
		id: "cathedral",
		label: "Cathedral",
		patch: {
			reverb: {
				enabled: true,
				mix: 0.47,
				space: 0.9,
				predelay: 0.03,
				distance: 0.68,
				character: 0.66,
			},
		},
	},
];

export const PHASER_PRESETS: ModulePresetDefinition<{
	phaser: Required<PhaserParams>;
}>[] = [
	{
		id: "gentleSweep",
		label: "Gentle Sweep",
		patch: {
			phaser: {
				enabled: true,
				rate: 0.35,
				depth: 0.45,
				feedback: 0.2,
				mix: 0.25,
			},
		},
	},
	{
		id: "jetWash",
		label: "Jet Wash",
		patch: {
			phaser: {
				enabled: true,
				rate: 0.9,
				depth: 0.78,
				feedback: 0.55,
				mix: 0.43,
			},
		},
	},
	{
		id: "wideNotch",
		label: "Wide Notch",
		patch: {
			phaser: {
				enabled: true,
				rate: 0.18,
				depth: 1,
				feedback: 0.72,
				mix: 0.52,
			},
		},
	},
];

export const VIBRATO_PRESETS: ModulePresetDefinition<{
	vibrato: Required<VibratoParams>;
}>[] = [
	{
		id: "subtle",
		label: "Subtle",
		patch: {
			vibrato: {
				enabled: true,
				waveform: 1,
				rate: 20,
				depth: 6,
				delay: 160,
				rate_mode: "hz",
				sync_division: "quarter",
			},
		},
	},
	{
		id: "chorused",
		label: "Chorused",
		patch: {
			vibrato: {
				enabled: true,
				waveform: 2,
				rate: 38,
				depth: 14,
				delay: 80,
				rate_mode: "hz",
				sync_division: "quarter",
			},
		},
	},
	{
		id: "warble",
		label: "Warble",
		patch: {
			vibrato: {
				enabled: true,
				waveform: 4,
				rate: 62,
				depth: 26,
				delay: 20,
				rate_mode: "hz",
				sync_division: "quarter",
			},
		},
	},
];

export const PHASE_MOD_PRESETS: ModulePresetDefinition<{
	phaseMod: Required<PhaseModParams>;
}>[] = [
	{
		id: "glassBell",
		label: "Glass Bell",
		patch: {
			phaseMod: { enabled: true, amount: 0.06, ratio: 2.0, pmPre: true },
		},
	},
	{
		id: "metalFold",
		label: "Metal Fold",
		patch: {
			phaseMod: { enabled: true, amount: 0.11, ratio: 2.7, pmPre: true },
		},
	},
	{
		id: "aggressiveSync",
		label: "Aggressive Sync",
		patch: {
			phaseMod: { enabled: true, amount: 0.18, ratio: 3.4, pmPre: false },
		},
	},
];

export const LFO_PRESETS: ModulePresetDefinition<{
	waveform: LfoWaveform;
	rate: number;
	depth: number;
	symmetry: number;
	retrigger: boolean;
	offset: number;
}>[] = [
	{
		id: "slowSine",
		label: "Slow Sine",
		patch: {
			waveform: "sine",
			rate: 0.6,
			depth: 0.23,
			symmetry: 0.5,
			retrigger: false,
			offset: 0,
		},
	},
	{
		id: "tempoTri",
		label: "Tempo Tri",
		patch: {
			waveform: "triangle",
			rate: 2.25,
			depth: 0.48,
			symmetry: 0.5,
			retrigger: true,
			offset: 0,
		},
	},
	{
		id: "fastSquare",
		label: "Fast Square",
		patch: {
			waveform: "square",
			rate: 4.0,
			depth: 0.35,
			symmetry: 0.5,
			retrigger: false,
			offset: 0,
		},
	},
];

export const MOD_ENV_PRESETS: ModulePresetDefinition<{
	modEnv: Required<ModEnvParams>;
}>[] = [
	{
		id: "pluck",
		label: "Pluck",
		patch: {
			modEnv: { attack: 0.005, decay: 0.16, sustain: 0.08, release: 0.14 },
		},
	},
	{
		id: "pad",
		label: "Pad",
		patch: {
			modEnv: { attack: 0.7, decay: 1.2, sustain: 0.75, release: 1.5 },
		},
	},
	{
		id: "reverseSwell",
		label: "Reverse Swell",
		patch: {
			modEnv: { attack: 1.8, decay: 0.28, sustain: 0.66, release: 0.95 },
		},
	},
];

export const COMPRESSOR_PRESETS: ModulePresetDefinition<{
	compressor: Required<CompressorParams>;
}>[] = [
	{
		id: "gentle",
		label: "Gentle",
		patch: {
			compressor: {
				enabled: true,
				thresholdDb: -18,
				ratio: 2,
				attackMs: 10,
				releaseMs: 150,
				makeupDb: 3,
				mix: 1,
			},
		},
	},
	{
		id: "punchy",
		label: "Punchy",
		patch: {
			compressor: {
				enabled: true,
				thresholdDb: -12,
				ratio: 4,
				attackMs: 5,
				releaseMs: 80,
				makeupDb: 6,
				mix: 1,
			},
		},
	},
	{
		id: "limiter",
		label: "Limiter",
		patch: {
			compressor: {
				enabled: true,
				thresholdDb: -6,
				ratio: 20,
				attackMs: 1,
				releaseMs: 200,
				makeupDb: 2,
				mix: 1,
			},
		},
	},
];

export const EQ_PRESETS: ModulePresetDefinition<{
	eq: Required<EqParams>;
}>[] = [
	{
		id: "bassBoost",
		label: "Bass Boost",
		patch: {
			eq: {
				enabled: true,
				gain80: 6,
				gain240: 3,
				gain750: 0,
				gain2200: -1,
				gain8000: -2,
			},
		},
	},
	{
		id: "presence",
		label: "Presence",
		patch: {
			eq: {
				enabled: true,
				gain80: 0,
				gain240: -2,
				gain750: 0,
				gain2200: 5,
				gain8000: 3,
			},
		},
	},
	{
		id: "warmth",
		label: "Warmth",
		patch: {
			eq: {
				enabled: true,
				gain80: 3,
				gain240: 4,
				gain750: 1,
				gain2200: -3,
				gain8000: -5,
			},
		},
	},
];

export const GRAIN_DELAY_PRESETS: ModulePresetDefinition<{
	grainDelay: Required<GrainDelayParams>;
}>[] = [
	{
		id: "cloudEcho",
		label: "Cloud Echo",
		patch: {
			grainDelay: {
				enabled: true,
				time: 0.645,
				feedback: 0.6,
				scatter: 0.52,
				density: 0.58,
				mix: 0.4,
				timeMode: "hz",
				syncDivision: "quarter",
				pitchSemitones: 0,
			},
		},
	},
	{
		id: "glitchDelay",
		label: "Glitch Delay",
		patch: {
			grainDelay: {
				enabled: true,
				time: 0.12,
				feedback: 0.18,
				scatter: 0.42,
				density: 0.7,
				mix: 0.5,
				timeMode: "hz",
				syncDivision: "quarter",
				pitchSemitones: 24,
			},
		},
	},
	{
		id: "shimmerEcho",
		label: "Shimmer Echo",
		patch: {
			grainDelay: {
				enabled: true,
				time: 0.5,
				feedback: 0.36,
				scatter: 0.24,
				density: 0.5,
				mix: 0.35,
				timeMode: "hz",
				syncDivision: "quarter",
				pitchSemitones: 12,
			},
		},
	},
];

export const BITCRUSHER_PRESETS: ModulePresetDefinition<{
	bitcrusher: Required<BitcrusherParams>;
}>[] = [
	{
		id: "retroGame",
		label: "Retro Game",
		patch: { bitcrusher: { enabled: true, bits: 8, rateReduction: 4, mix: 1 } },
	},
	{
		id: "grunge",
		label: "Grunge",
		patch: {
			bitcrusher: { enabled: true, bits: 4, rateReduction: 2, mix: 1 },
		},
	},
	{
		id: "subtle",
		label: "Subtle",
		patch: {
			bitcrusher: { enabled: true, bits: 12, rateReduction: 1.5, mix: 0.6 },
		},
	},
];

export const SHIMMER_VERB_PRESETS: ModulePresetDefinition<{
	shimmerVerb: Required<ShimmerVerbParams>;
}>[] = [
	{
		id: "crystalHall",
		label: "Crystal Hall",
		patch: {
			shimmerVerb: { enabled: true, shimmer: 0.6, space: 0.8, mix: 0.4 },
		},
	},
	{
		id: "ethereal",
		label: "Ethereal",
		patch: {
			shimmerVerb: { enabled: true, shimmer: 0.85, space: 0.95, mix: 0.55 },
		},
	},
	{
		id: "subtleShimmer",
		label: "Subtle Shimmer",
		patch: {
			shimmerVerb: { enabled: true, shimmer: 0.25, space: 0.6, mix: 0.3 },
		},
	},
];

export const DISTORTION_PRESETS: ModulePresetDefinition<{
	distortion: Required<DistortionParams>;
}>[] = [
	{
		id: "warmOverdrive",
		label: "Warm Overdrive",
		patch: {
			distortion: { enabled: true, mode: 0, drive: 0.48, tone: 0.34, mix: 0.9 },
		},
	},
	{
		id: "grittyFuzz",
		label: "Gritty Fuzz",
		patch: {
			distortion: { enabled: true, mode: 2, drive: 0.72, tone: 0.48, mix: 1 },
		},
	},
	{
		id: "bitingClip",
		label: "Biting Clip",
		patch: {
			distortion: { enabled: true, mode: 1, drive: 0.88, tone: 0.78, mix: 1 },
		},
	},
];

export const JUNO_CHORUS_PRESETS: ModulePresetDefinition<{
	junoChorus: Required<JunoChorusParams>;
}>[] = [
	{
		id: "junoI",
		label: "Juno I",
		patch: { junoChorus: { enabled: true, mode: 0, mix: 0.5 } },
	},
	{
		id: "junoII",
		label: "Juno II",
		patch: { junoChorus: { enabled: true, mode: 1, mix: 0.55 } },
	},
	{
		id: "junoFull",
		label: "Juno Full",
		patch: { junoChorus: { enabled: true, mode: 2, mix: 0.6 } },
	},
];

export const RING_MOD_PRESETS: ModulePresetDefinition<{
	ringMod: Required<RingModParams>;
}>[] = [
	{
		id: "metallic",
		label: "Metallic",
		patch: { ringMod: { enabled: true, carrierHz: 220, mix: 0.7 } },
	},
	{
		id: "bell",
		label: "Bell",
		patch: { ringMod: { enabled: true, carrierHz: 523, mix: 0.5 } },
	},
	{
		id: "alien",
		label: "Alien",
		patch: { ringMod: { enabled: true, carrierHz: 1337, mix: 0.85 } },
	},
];

export const TREMOLO_PRESETS: ModulePresetDefinition<{
	tremolo: Required<TremoloParams>;
}>[] = [
	{
		id: "slowWave",
		label: "Slow Wave",
		patch: {
			tremolo: {
				enabled: true,
				rate: 2,
				depth: 0.5,
				waveform: 0,
				mix: 1,
				rateMode: "hz",
				syncDivision: "quarter",
			},
		},
	},
	{
		id: "fastChop",
		label: "Fast Chop",
		patch: {
			tremolo: {
				enabled: true,
				rate: 8,
				depth: 0.75,
				waveform: 2,
				mix: 1,
				rateMode: "hz",
				syncDivision: "quarter",
			},
		},
	},
	{
		id: "triPulse",
		label: "Tri Pulse",
		patch: {
			tremolo: {
				enabled: true,
				rate: 5,
				depth: 0.6,
				waveform: 1,
				mix: 1,
				rateMode: "hz",
				syncDivision: "quarter",
			},
		},
	},
];

export const WAVEFOLDER_PRESETS: ModulePresetDefinition<{
	wavefolder: Required<WavefolderParams>;
}>[] = [
	{
		id: "gentle",
		label: "Gentle",
		patch: { wavefolder: { enabled: true, drive: 0.3, folds: 0.3, mix: 0.8 } },
	},
	{
		id: "aggressive",
		label: "Aggressive",
		patch: { wavefolder: { enabled: true, drive: 0.75, folds: 0.7, mix: 1 } },
	},
	{
		id: "harmonic",
		label: "Harmonic",
		patch: {
			wavefolder: { enabled: true, drive: 0.5, folds: 0.5, mix: 0.9 },
		},
	},
];

export const LOFI_PRESETS: ModulePresetDefinition<{
	loFi: Required<LoFiParams>;
}>[] = [
	{
		id: "warpedCassette",
		label: "Warped Cassette",
		patch: {
			loFi: {
				enabled: true,
				degrade: 0.32,
				wowDepth: 0.65,
				wowRate: 0.32,
				flutterDepth: 0.28,
				flutterRate: 7.4,
				tone: 0.38,
				mix: 1,
			},
		},
	},
	{
		id: "dustyKeys",
		label: "Dusty Keys",
		patch: {
			loFi: {
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
	},
	{
		id: "cheapSpeaker",
		label: "Cheap Speaker",
		patch: {
			loFi: {
				enabled: true,
				degrade: 0.55,
				wowDepth: 0.18,
				wowRate: 0.78,
				flutterDepth: 0.22,
				flutterRate: 9.2,
				tone: 0.12,
				mix: 1,
			},
		},
	},
];

export const MULTIMODE_FILTER_PRESETS: ModulePresetDefinition<{
	multimodeFilter: Required<MultimodeFilterParams>;
}>[] = [
	{
		id: "warmLowPass",
		label: "Warm LP",
		patch: {
			multimodeFilter: {
				enabled: true,
				mode: 0,
				fourPole: true,
				cutoffHz: 1400,
				resonance: 0.28,
				drive: 0.22,
				mix: 1,
			},
		},
	},
	{
		id: "tightHighPass",
		label: "Tight HP",
		patch: {
			multimodeFilter: {
				enabled: true,
				mode: 1,
				fourPole: false,
				cutoffHz: 380,
				resonance: 0.18,
				drive: 0.08,
				mix: 0.9,
			},
		},
	},
	{
		id: "vocalBandPass",
		label: "Vocal BP",
		patch: {
			multimodeFilter: {
				enabled: true,
				mode: 2,
				fourPole: true,
				cutoffHz: 1150,
				resonance: 0.62,
				drive: 0.18,
				mix: 0.95,
			},
		},
	},
];

export const FLANGER_PRESETS: ModulePresetDefinition<{
	flanger: Required<FlangerParams>;
}>[] = [
	{
		id: "softSweep",
		label: "Soft Sweep",
		patch: {
			flanger: {
				enabled: true,
				rate: 0.2,
				depth: 0.35,
				delayMs: 2.8,
				feedback: 0.18,
				throughZero: false,
				mix: 0.42,
			},
		},
	},
	{
		id: "jetPlane",
		label: "Jet Plane",
		patch: {
			flanger: {
				enabled: true,
				rate: 0.45,
				depth: 0.78,
				delayMs: 1.2,
				feedback: 0.62,
				throughZero: false,
				mix: 0.55,
			},
		},
	},
	{
		id: "throughZero",
		label: "Through-Zero",
		patch: {
			flanger: {
				enabled: true,
				rate: 0.33,
				depth: 0.7,
				delayMs: 0.8,
				feedback: 0.36,
				throughZero: true,
				mix: 0.58,
			},
		},
	},
];

export const ROTARY_SPEAKER_PRESETS: ModulePresetDefinition<{
	rotarySpeaker: Required<RotarySpeakerParams>;
}>[] = [
	{
		id: "classicSpin",
		label: "Classic Spin",
		patch: {
			rotarySpeaker: {
				enabled: true,
				speed: 0.9,
				depth: 0.62,
				drive: 0.08,
				mix: 0.58,
			},
		},
	},
	{
		id: "fastHorn",
		label: "Fast Horn",
		patch: {
			rotarySpeaker: {
				enabled: true,
				speed: 4.2,
				depth: 0.84,
				drive: 0.12,
				mix: 0.66,
			},
		},
	},
	{
		id: "dirtyCab",
		label: "Dirty Cab",
		patch: {
			rotarySpeaker: {
				enabled: true,
				speed: 1.8,
				depth: 0.72,
				drive: 0.48,
				mix: 0.74,
			},
		},
	},
];

export const AUTO_WAH_PRESETS: ModulePresetDefinition<{
	autoWah: Required<AutoWahParams>;
}>[] = [
	{
		id: "vowelQuack",
		label: "Vowel Quack",
		patch: {
			autoWah: {
				enabled: true,
				mode: 2,
				sensitivity: 0.75,
				cutoffHz: 520,
				resonance: 0.78,
				attackMs: 6,
				releaseMs: 95,
				mix: 0.84,
			},
		},
	},
	{
		id: "funkSweep",
		label: "Funk Sweep",
		patch: {
			autoWah: {
				enabled: true,
				mode: 1,
				sensitivity: 0.62,
				cutoffHz: 280,
				resonance: 0.58,
				attackMs: 12,
				releaseMs: 170,
				mix: 0.76,
			},
		},
	},
	{
		id: "softTouch",
		label: "Soft Touch",
		patch: {
			autoWah: {
				enabled: true,
				mode: 0,
				sensitivity: 0.34,
				cutoffHz: 700,
				resonance: 0.32,
				attackMs: 24,
				releaseMs: 240,
				mix: 0.66,
			},
		},
	},
];

export const STEREO_WIDENER_PRESETS: ModulePresetDefinition<{
	stereoWidener: Required<StereoWidenerParams>;
}>[] = [
	{
		id: "subtleSpread",
		label: "Subtle Spread",
		patch: {
			stereoWidener: {
				enabled: true,
				width: 0.35,
				delayMs: 9,
				tone: 0.45,
				mix: 0.45,
			},
		},
	},
	{
		id: "widePad",
		label: "Wide Pad",
		patch: {
			stereoWidener: {
				enabled: true,
				width: 0.72,
				delayMs: 14,
				tone: 0.62,
				mix: 0.62,
			},
		},
	},
	{
		id: "haasPush",
		label: "Haas Push",
		patch: {
			stereoWidener: {
				enabled: true,
				width: 0.9,
				delayMs: 22,
				tone: 0.72,
				mix: 0.7,
			},
		},
	},
];

// TODO: Remove these local patch payload definitions once the engine exports
// full module preset parameter payloads and the frontend no longer mirrors them.
applyRustPresetCatalog("chorus", CHORUS_PRESETS);
applyRustPresetCatalog("delay", DELAY_PRESETS);
applyRustPresetCatalog("reverb", REVERB_PRESETS);
applyRustPresetCatalog("phaser", PHASER_PRESETS);
applyRustPresetCatalog("vibrato", VIBRATO_PRESETS);
applyRustPresetCatalog("phaseMod", PHASE_MOD_PRESETS);
applyRustPresetCatalog("lfo1", LFO_PRESETS);
applyRustPresetCatalog("lfo2", LFO_PRESETS);
applyRustPresetCatalog("modEnv", MOD_ENV_PRESETS);
applyRustPresetCatalog("compressor", COMPRESSOR_PRESETS);
applyRustPresetCatalog("eq5Band", EQ_PRESETS);
applyRustPresetCatalog("grainDelay", GRAIN_DELAY_PRESETS);
applyRustPresetCatalog("bitcrusher", BITCRUSHER_PRESETS);
applyRustPresetCatalog("shimmerVerb", SHIMMER_VERB_PRESETS);
applyRustPresetCatalog("distortion", DISTORTION_PRESETS);
applyRustPresetCatalog("junoChorus", JUNO_CHORUS_PRESETS);
applyRustPresetCatalog("ringMod", RING_MOD_PRESETS);
applyRustPresetCatalog("tremolo", TREMOLO_PRESETS);
applyRustPresetCatalog("wavefolder", WAVEFOLDER_PRESETS);
applyRustPresetCatalog("loFi", LOFI_PRESETS);
applyRustPresetCatalog("multimodeFilter", MULTIMODE_FILTER_PRESETS);
applyRustPresetCatalog("flanger", FLANGER_PRESETS);
applyRustPresetCatalog("rotarySpeaker", ROTARY_SPEAKER_PRESETS);
applyRustPresetCatalog("autoWah", AUTO_WAH_PRESETS);
applyRustPresetCatalog("stereoWidener", STEREO_WIDENER_PRESETS);

export function getLfoModulePatch(id: 1 | 2, patch: Record<string, unknown>) {
	return id === 1 ? { lfo: patch } : { lfo2: patch };
}
