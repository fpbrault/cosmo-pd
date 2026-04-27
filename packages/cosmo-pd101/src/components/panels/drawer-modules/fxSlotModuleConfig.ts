import type { FxSlotType } from "@/lib/synth/bindings/synth";
import {
	BITCRUSHER_PRESETS,
	CHORUS_PRESETS,
	COMPRESSOR_PRESETS,
	DISTORTION_PRESETS,
	EQ_PRESETS,
	GRAIN_DELAY_PRESETS,
	JUNO_CHORUS_PRESETS,
	type ModulePresetDefinition,
	type ModulePresetModule,
	type ModulePresetPatch,
	PHASER_PRESETS,
	REVERB_PRESETS,
	RING_MOD_PRESETS,
	SHIMMER_VERB_PRESETS,
	TREMOLO_PRESETS,
	WAVEFOLDER_PRESETS,
} from "@/lib/synth/modulePresets";

export type KnobControlDef = {
	kind: "knob";
	param: string;
	label: string;
	min: number;
	max: number;
	defaultValue: number;
	size?: number;
	formatter: (v: number) => string;
};

export type ButtonGroupControlDef = {
	kind: "buttonGroup";
	param: string;
	label: string;
	options: { value: number; label: string }[];
};

export type ControlDef = KnobControlDef | ButtonGroupControlDef;

export type FxSlotModuleConfig = {
	/** FxSlotType — used for type-guard on rawSlot.type */
	type: FxSlotType;
	/** Key into preset.patch (e.g. "eq" for eq5Band) */
	patchKey: string;
	/** Module key sent to requestApplyModulePreset */
	moduleKey: ModulePresetModule;
	title: string;
	color: string;
	meta?: string;
	columns?: number;
	presets: ModulePresetDefinition<ModulePresetPatch>[];
	presetTitle: string;
	controls: ControlDef[];
};

function pct(v: number) {
	return `${Math.round(v * 100)}%`;
}

export const FX_SLOT_MODULE_CONFIGS: Partial<
	Record<FxSlotType, FxSlotModuleConfig>
> = {
	chorus: {
		type: "chorus",
		patchKey: "chorus",
		moduleKey: "chorus",
		title: "Chorus",
		color: "#818cf8",
		columns: 3,
		presets: CHORUS_PRESETS,
		presetTitle: "Chorus Presets",
		controls: [
			{
				kind: "knob",
				param: "rate",
				label: "Rate",
				min: 0.1,
				max: 5,
				defaultValue: 1.0,
				formatter: (v) => v.toFixed(1),
			},
			{
				kind: "knob",
				param: "depth",
				label: "Depth",
				min: 0,
				max: 3,
				defaultValue: 1.5,
				formatter: (v) => `${Math.round((v / 3) * 100)}%`,
			},
			{
				kind: "knob",
				param: "mix",
				label: "Mix",
				min: 0,
				max: 1,
				defaultValue: 0.5,
				formatter: pct,
			},
		],
	},

	phaser: {
		type: "phaser",
		patchKey: "phaser",
		moduleKey: "phaser",
		title: "Phaser",
		color: "#a78bfa",
		meta: "4-Stage",
		presets: PHASER_PRESETS,
		presetTitle: "Phaser Presets",
		controls: [
			{
				kind: "knob",
				param: "rate",
				label: "Rate",
				min: 0.1,
				max: 10,
				defaultValue: 0.5,
				formatter: (v) => `${v.toFixed(1)}Hz`,
			},
			{
				kind: "knob",
				param: "depth",
				label: "Depth",
				min: 0,
				max: 1,
				defaultValue: 1.0,
				formatter: pct,
			},
			{
				kind: "knob",
				param: "feedback",
				label: "Fdbk",
				min: -0.9,
				max: 0.9,
				defaultValue: 0.5,
				formatter: (v) =>
					v >= 0 ? `+${Math.round(v * 100)}%` : `${Math.round(v * 100)}%`,
			},
			{
				kind: "knob",
				param: "mix",
				label: "Mix",
				min: 0,
				max: 1,
				defaultValue: 0.5,
				formatter: pct,
			},
		],
	},

	reverb: {
		type: "reverb",
		patchKey: "reverb",
		moduleKey: "reverb",
		title: "Reverb",
		color: "#f97316",
		meta: "FDN",
		columns: 3,
		presets: REVERB_PRESETS,
		presetTitle: "Reverb Presets",
		controls: [
			{
				kind: "knob",
				param: "space",
				label: "Space",
				min: 0,
				max: 1,
				defaultValue: 0.5,
				formatter: pct,
			},
			{
				kind: "knob",
				param: "predelay",
				label: "Pre-Dly",
				min: 0,
				max: 0.1,
				defaultValue: 0,
				formatter: (v) => `${Math.round(v * 1000)}ms`,
			},
			{
				kind: "knob",
				param: "distance",
				label: "Dist",
				min: 0,
				max: 1,
				defaultValue: 0.3,
				formatter: pct,
			},
			{
				kind: "knob",
				param: "character",
				label: "Character",
				min: 0,
				max: 1,
				defaultValue: 0.65,
				formatter: pct,
			},
			{
				kind: "knob",
				param: "mix",
				label: "Mix",
				min: 0,
				max: 1,
				defaultValue: 0.3,
				formatter: pct,
			},
		],
	},

	compressor: {
		type: "compressor",
		patchKey: "compressor",
		moduleKey: "compressor",
		title: "Compressor",
		color: "#fb923c",
		columns: 3,
		presets: COMPRESSOR_PRESETS,
		presetTitle: "Compressor Presets",
		controls: [
			{
				kind: "knob",
				param: "thresholdDb",
				label: "Thresh",
				min: -60,
				max: 0,
				defaultValue: -12,
				formatter: (v) => `${v.toFixed(0)}dB`,
			},
			{
				kind: "knob",
				param: "ratio",
				label: "Ratio",
				min: 1,
				max: 20,
				defaultValue: 4,
				formatter: (v) => `${v.toFixed(1)}:1`,
			},
			{
				kind: "knob",
				param: "attackMs",
				label: "Attack",
				min: 0.1,
				max: 100,
				defaultValue: 5,
				formatter: (v) => `${v.toFixed(1)}ms`,
			},
			{
				kind: "knob",
				param: "releaseMs",
				label: "Release",
				min: 10,
				max: 1000,
				defaultValue: 100,
				formatter: (v) => `${v.toFixed(0)}ms`,
			},
			{
				kind: "knob",
				param: "makeupDb",
				label: "Makeup",
				min: 0,
				max: 24,
				defaultValue: 6,
				formatter: (v) => `${v.toFixed(1)}dB`,
			},
			{
				kind: "knob",
				param: "mix",
				label: "Mix",
				min: 0,
				max: 1,
				defaultValue: 1,
				formatter: pct,
			},
		],
	},

	eq5Band: {
		type: "eq5Band",
		patchKey: "eq",
		moduleKey: "eq",
		title: "EQ",
		color: "#34d399",
		columns: 5,
		presets: EQ_PRESETS,
		presetTitle: "EQ Presets",
		controls: [
			{
				kind: "knob",
				param: "gain80",
				label: "80Hz",
				min: -12,
				max: 12,
				defaultValue: 0,
				formatter: (v) => `${v > 0 ? "+" : ""}${v.toFixed(1)}`,
			},
			{
				kind: "knob",
				param: "gain240",
				label: "240Hz",
				min: -12,
				max: 12,
				defaultValue: 0,
				formatter: (v) => `${v > 0 ? "+" : ""}${v.toFixed(1)}`,
			},
			{
				kind: "knob",
				param: "gain750",
				label: "750Hz",
				min: -12,
				max: 12,
				defaultValue: 0,
				formatter: (v) => `${v > 0 ? "+" : ""}${v.toFixed(1)}`,
			},
			{
				kind: "knob",
				param: "gain2200",
				label: "2.2kHz",
				min: -12,
				max: 12,
				defaultValue: 0,
				formatter: (v) => `${v > 0 ? "+" : ""}${v.toFixed(1)}`,
			},
			{
				kind: "knob",
				param: "gain8000",
				label: "8kHz",
				min: -12,
				max: 12,
				defaultValue: 0,
				formatter: (v) => `${v > 0 ? "+" : ""}${v.toFixed(1)}`,
			},
		],
	},

	grainDelay: {
		type: "grainDelay",
		patchKey: "grainDelay",
		moduleKey: "grainDelay",
		title: "Grain Delay",
		color: "#a78bfa",
		columns: 4,
		presets: GRAIN_DELAY_PRESETS,
		presetTitle: "Grain Delay Presets",
		controls: [
			{
				kind: "knob",
				param: "time",
				label: "Time",
				min: 0.01,
				max: 1,
				defaultValue: 0.25,
				formatter: (v) => `${(v * 1000).toFixed(0)}ms`,
			},
			{
				kind: "knob",
				param: "scatter",
				label: "Scatter",
				min: 0,
				max: 1,
				defaultValue: 0,
				formatter: pct,
			},
			{
				kind: "knob",
				param: "density",
				label: "Density",
				min: 0,
				max: 1,
				defaultValue: 0.5,
				formatter: pct,
			},
			{
				kind: "knob",
				param: "mix",
				label: "Mix",
				min: 0,
				max: 1,
				defaultValue: 0,
				formatter: pct,
			},
		],
	},

	bitcrusher: {
		type: "bitcrusher",
		patchKey: "bitcrusher",
		moduleKey: "bitcrusher",
		title: "Bitcrusher",
		color: "#f87171",
		columns: 3,
		presets: BITCRUSHER_PRESETS,
		presetTitle: "Bitcrusher Presets",
		controls: [
			{
				kind: "knob",
				param: "bits",
				label: "Bits",
				min: 2,
				max: 16,
				defaultValue: 8,
				formatter: (v) => v.toFixed(1),
			},
			{
				kind: "knob",
				param: "rateReduction",
				label: "Rate",
				min: 1,
				max: 16,
				defaultValue: 1,
				formatter: (v) => `÷${v.toFixed(1)}`,
			},
			{
				kind: "knob",
				param: "mix",
				label: "Mix",
				min: 0,
				max: 1,
				defaultValue: 1,
				formatter: pct,
			},
		],
	},

	shimmerVerb: {
		type: "shimmerVerb",
		patchKey: "shimmerVerb",
		moduleKey: "shimmerVerb",
		title: "Shimmer Verb",
		color: "#60a5fa",
		columns: 3,
		presets: SHIMMER_VERB_PRESETS,
		presetTitle: "Shimmer Verb Presets",
		controls: [
			{
				kind: "knob",
				param: "shimmer",
				label: "Shimmer",
				min: 0,
				max: 1,
				defaultValue: 0.4,
				formatter: pct,
			},
			{
				kind: "knob",
				param: "space",
				label: "Space",
				min: 0,
				max: 1,
				defaultValue: 0.7,
				formatter: pct,
			},
			{
				kind: "knob",
				param: "mix",
				label: "Mix",
				min: 0,
				max: 1,
				defaultValue: 0,
				formatter: pct,
			},
		],
	},

	distortion: {
		type: "distortion",
		patchKey: "distortion",
		moduleKey: "distortion",
		title: "Distortion",
		color: "#f59e0b",
		columns: 3,
		presets: DISTORTION_PRESETS,
		presetTitle: "Distortion Presets",
		controls: [
			{
				kind: "knob",
				param: "drive",
				label: "Drive",
				min: 0,
				max: 1,
				defaultValue: 0.5,
				formatter: pct,
			},
			{
				kind: "knob",
				param: "tone",
				label: "Tone",
				min: 0,
				max: 1,
				defaultValue: 0.5,
				formatter: pct,
			},
			{
				kind: "knob",
				param: "mix",
				label: "Mix",
				min: 0,
				max: 1,
				defaultValue: 1,
				formatter: pct,
			},
		],
	},

	ringMod: {
		type: "ringMod",
		patchKey: "ringMod",
		moduleKey: "ringMod",
		title: "Ring Mod",
		color: "#e879f9",
		columns: 2,
		presets: RING_MOD_PRESETS,
		presetTitle: "Ring Mod Presets",
		controls: [
			{
				kind: "knob",
				param: "carrierHz",
				label: "Carrier",
				min: 20,
				max: 2000,
				defaultValue: 440,
				formatter: (v) => `${v.toFixed(0)} Hz`,
			},
			{
				kind: "knob",
				param: "mix",
				label: "Mix",
				min: 0,
				max: 1,
				defaultValue: 1,
				formatter: pct,
			},
		],
	},

	wavefolder: {
		type: "wavefolder",
		patchKey: "wavefolder",
		moduleKey: "wavefolder",
		title: "Wavefolder",
		color: "#c084fc",
		columns: 3,
		presets: WAVEFOLDER_PRESETS,
		presetTitle: "Wavefolder Presets",
		controls: [
			{
				kind: "knob",
				param: "drive",
				label: "Drive",
				min: 0,
				max: 1,
				defaultValue: 0.5,
				formatter: pct,
			},
			{
				kind: "knob",
				param: "folds",
				label: "Folds",
				min: 0,
				max: 1,
				defaultValue: 0.5,
				formatter: pct,
			},
			{
				kind: "knob",
				param: "mix",
				label: "Mix",
				min: 0,
				max: 1,
				defaultValue: 1,
				formatter: pct,
			},
		],
	},

	junoChorus: {
		type: "junoChorus",
		patchKey: "junoChorus",
		moduleKey: "junoChorus",
		title: "Juno Chorus",
		color: "#22d3ee",
		columns: 2,
		presets: JUNO_CHORUS_PRESETS,
		presetTitle: "Juno Chorus Presets",
		controls: [
			{
				kind: "buttonGroup",
				param: "mode",
				label: "Mode",
				options: [
					{ value: 0, label: "I" },
					{ value: 1, label: "II" },
					{ value: 2, label: "I+II" },
				],
			},
			{
				kind: "knob",
				param: "mix",
				label: "Mix",
				min: 0,
				max: 1,
				defaultValue: 0.5,
				formatter: pct,
			},
		],
	},

	tremolo: {
		type: "tremolo",
		patchKey: "tremolo",
		moduleKey: "tremolo",
		title: "Tremolo",
		color: "#4ade80",
		columns: 2,
		presets: TREMOLO_PRESETS,
		presetTitle: "Tremolo Presets",
		controls: [
			{
				kind: "knob",
				param: "rate",
				label: "Rate",
				min: 0.1,
				max: 20,
				defaultValue: 4,
				formatter: (v) => `${v.toFixed(1)}Hz`,
			},
			{
				kind: "knob",
				param: "depth",
				label: "Depth",
				min: 0,
				max: 1,
				defaultValue: 0.5,
				formatter: pct,
			},
			{
				kind: "buttonGroup",
				param: "waveform",
				label: "Wave",
				options: [
					{ value: 0, label: "Sine" },
					{ value: 1, label: "Tri" },
					{ value: 2, label: "Sqr" },
				],
			},
			{
				kind: "knob",
				param: "mix",
				label: "Mix",
				min: 0,
				max: 1,
				defaultValue: 1,
				formatter: pct,
			},
		],
	},
};
