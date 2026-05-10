import {
	type LfoWaveform,
	MODULE_PRESET_CATALOG_V1,
} from "@/lib/synth/bindings/synth";

export type ModulePresetModule =
	| "chorus"
	| "delay"
	| "reverb"
	| "phaser"
	| "vibrato"
	| "phaseMod"
	| "lfo1"
	| "lfo2"
	| "modEnv"
	| "compressor"
	| "eq"
	| "grainDelay"
	| "bitcrusher"
	| "shimmerVerb"
	| "distortion"
	| "junoChorus"
	| "ringMod"
	| "tremolo"
	| "wavefolder"
	| "loFi";

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
	chorus: { enabled: boolean; rate: number; depth: number; mix: number };
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
	delay: {
		enabled: boolean;
		time: number;
		feedback: number;
		mix: number;
		tapeMode: boolean;
		warmth: number;
	};
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
			},
		},
	},
];

export const REVERB_PRESETS: ModulePresetDefinition<{
	reverb: {
		enabled: boolean;
		mix: number;
		space: number;
		predelay: number;
		distance: number;
		character: number;
	};
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
	phaser: {
		enabled: boolean;
		rate: number;
		depth: number;
		feedback: number;
		mix: number;
	};
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
	vibrato: {
		enabled: boolean;
		waveform: number;
		rate: number;
		depth: number;
		delay: number;
	};
}>[] = [
	{
		id: "subtle",
		label: "Subtle",
		patch: {
			vibrato: { enabled: true, waveform: 1, rate: 20, depth: 6, delay: 160 },
		},
	},
	{
		id: "chorused",
		label: "Chorused",
		patch: {
			vibrato: { enabled: true, waveform: 2, rate: 38, depth: 14, delay: 80 },
		},
	},
	{
		id: "warble",
		label: "Warble",
		patch: {
			vibrato: { enabled: true, waveform: 4, rate: 62, depth: 26, delay: 20 },
		},
	},
];

export const PHASE_MOD_PRESETS: ModulePresetDefinition<{
	phaseMod: { enabled: boolean; amount: number; ratio: number; pmPre: boolean };
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
];

export const MOD_ENV_PRESETS: ModulePresetDefinition<{
	modEnv: { attack: number; decay: number; sustain: number; release: number };
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
	compressor: {
		enabled: boolean;
		thresholdDb: number;
		ratio: number;
		attackMs: number;
		releaseMs: number;
		makeupDb: number;
		mix: number;
	};
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
	eq: {
		enabled: boolean;
		gain80: number;
		gain240: number;
		gain750: number;
		gain2200: number;
		gain8000: number;
	};
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
	grainDelay: {
		enabled: boolean;
		time: number;
		feedback: number;
		scatter: number;
		density: number;
		mix: number;
	};
}>[] = [
	{
		id: "cloudEcho",
		label: "Cloud Echo",
		patch: {
			grainDelay: {
				enabled: true,
				time: 0.35,
				feedback: 0.22,
				scatter: 0.32,
				density: 0.58,
				mix: 0.4,
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
			},
		},
	},
];

export const BITCRUSHER_PRESETS: ModulePresetDefinition<{
	bitcrusher: {
		enabled: boolean;
		bits: number;
		rateReduction: number;
		mix: number;
	};
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
	shimmerVerb: {
		enabled: boolean;
		shimmer: number;
		space: number;
		mix: number;
	};
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
	distortion: {
		enabled: boolean;
		mode: number;
		drive: number;
		tone: number;
		mix: number;
	};
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
	junoChorus: { enabled: boolean; mode: number; mix: number };
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
	ringMod: { enabled: boolean; carrierHz: number; mix: number };
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
	tremolo: {
		enabled: boolean;
		rate: number;
		depth: number;
		waveform: number;
		mix: number;
	};
}>[] = [
	{
		id: "slowWave",
		label: "Slow Wave",
		patch: {
			tremolo: { enabled: true, rate: 2, depth: 0.5, waveform: 0, mix: 1 },
		},
	},
	{
		id: "fastChop",
		label: "Fast Chop",
		patch: {
			tremolo: { enabled: true, rate: 8, depth: 0.75, waveform: 2, mix: 1 },
		},
	},
	{
		id: "triPulse",
		label: "Tri Pulse",
		patch: {
			tremolo: { enabled: true, rate: 5, depth: 0.6, waveform: 1, mix: 1 },
		},
	},
];

export const WAVEFOLDER_PRESETS: ModulePresetDefinition<{
	wavefolder: { enabled: boolean; drive: number; folds: number; mix: number };
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
	loFi: {
		enabled: boolean;
		degrade: number;
		wowDepth: number;
		wowRate: number;
		flutterDepth: number;
		flutterRate: number;
		tone: number;
		mix: number;
	};
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
applyRustPresetCatalog("eq", EQ_PRESETS);
applyRustPresetCatalog("grainDelay", GRAIN_DELAY_PRESETS);
applyRustPresetCatalog("bitcrusher", BITCRUSHER_PRESETS);
applyRustPresetCatalog("shimmerVerb", SHIMMER_VERB_PRESETS);
applyRustPresetCatalog("distortion", DISTORTION_PRESETS);
applyRustPresetCatalog("junoChorus", JUNO_CHORUS_PRESETS);
applyRustPresetCatalog("ringMod", RING_MOD_PRESETS);
applyRustPresetCatalog("tremolo", TREMOLO_PRESETS);
applyRustPresetCatalog("wavefolder", WAVEFOLDER_PRESETS);
applyRustPresetCatalog("loFi", LOFI_PRESETS);

export function getLfoModulePatch(id: 1 | 2, patch: Record<string, unknown>) {
	return id === 1 ? { lfo: patch } : { lfo2: patch };
}
