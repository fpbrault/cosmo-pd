import { FX_DEFINITIONS_V1, type FxSlotType } from "@/lib/synth/bindings/synth";
import {
	AUTO_WAH_PRESETS,
	BITCRUSHER_PRESETS,
	CHORUS_PRESETS,
	COMPRESSOR_PRESETS,
	DELAY_PRESETS,
	DISTORTION_PRESETS,
	EQ_PRESETS,
	FLANGER_PRESETS,
	GRAIN_DELAY_PRESETS,
	JUNO_CHORUS_PRESETS,
	LOFI_PRESETS,
	type ModulePresetDefinition,
	type ModulePresetModule,
	type ModulePresetPatch,
	MULTIMODE_FILTER_PRESETS,
	PHASE_MOD_PRESETS,
	PHASER_PRESETS,
	REVERB_PRESETS,
	RING_MOD_PRESETS,
	ROTARY_SPEAKER_PRESETS,
	SHIMMER_VERB_PRESETS,
	STEREO_WIDENER_PRESETS,
	TREMOLO_PRESETS,
	VIBRATO_PRESETS,
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
	order?: number;
	row?: number;
	colSpan?: number;
	colStart?: number;
	hideLabel?: boolean;
	visibleWhen?: {
		param: string;
		equals: number | boolean | string;
	};
	sourceIndex: number;
};

export type ButtonGroupControlDef = {
	kind: "buttonGroup";
	param: string;
	label: string;
	options: { value: number; label: string }[];
	buttonPresentation?: "segmented" | "compactBinaryToggle";
	centered?: boolean;
	order?: number;
	row?: number;
	colSpan?: number;
	colStart?: number;
	hideLabel?: boolean;
	visibleWhen?: {
		param: string;
		equals: number | boolean | string;
	};
	sourceIndex: number;
};

export type ControlDef = KnobControlDef | ButtonGroupControlDef;

export type FxCustomRendererKey =
	| "delayLegacy"
	| "phaseModLegacy"
	| "vibratoLegacy"
	| "tremoloLegacy";

export type FxSlotModuleConfig = {
	type: FxSlotType;
	patchKey: string;
	moduleKey: ModulePresetModule;
	title: string;
	color: string;
	meta?: string;
	columns?: number;
	dynamicColumns?: {
		param: string;
		equals: number | boolean | string;
		columns: number;
		otherwiseColumns?: number;
	};
	customRenderer?: FxCustomRendererKey;
	presets: ModulePresetDefinition<ModulePresetPatch>[];
	presetTitle: string;
	controls: ControlDef[];
};
function pct(v: number) {
	return `${Math.round(v * 100)}%`;
}

type FormatterFn = (v: number) => string;

type ControlLayoutRule = {
	label?: string;
	buttonPresentation?: "segmented" | "compactBinaryToggle";
	centered?: boolean;
	order?: number;
	row?: number;
	colSpan?: number;
	colStart?: number;
	hideLabel?: boolean;
	visibleWhen?: {
		param: string;
		equals: number | boolean | string;
	};
};

type FxUiMeta = {
	patchKey: string;
	moduleKey: ModulePresetModule;
	title?: string;
	color: string;
	meta?: string;
	columns?: number;
	dynamicColumns?: {
		param: string;
		equals: number | boolean | string;
		columns: number;
		otherwiseColumns?: number;
	};
	customRenderer?: FxCustomRendererKey;
	presets: ModulePresetDefinition<ModulePresetPatch>[];
	presetTitle: string;
	formatters?: Partial<Record<string, FormatterFn>>;
	controlLayout?: Partial<Record<string, ControlLayoutRule>>;
};
const FX_UI_META = {
	chorus: {
		patchKey: "chorus",
		moduleKey: "chorus",
		color: "#818cf8",
		columns: 3,
		presets: CHORUS_PRESETS,
		presetTitle: "Chorus Presets",
		formatters: {
			rate: (v) => `${v.toFixed(1)}Hz`,
			depth: (v) => `${Math.round(v / 5)}%`,
			mix: pct,
		},
	},
	delay: {
		patchKey: "delay",
		moduleKey: "delay",
		color: "#fbbf24",
		columns: 4,
		customRenderer: "delayLegacy",
		presets: DELAY_PRESETS,
		presetTitle: "Delay Presets",
		formatters: {
			time: (v) => `${Math.round(v * 1000)}ms`,
			feedback: pct,
			mix: pct,
			tapeMode: (v) => (v ? "Tape" : "Digital"),
			warmth: pct,
		},
	},
	phaseMod: {
		patchKey: "phaseMod",
		moduleKey: "phaseMod",
		title: "Phase Mod",
		color: "#f43f5e",
		columns: 3,
		customRenderer: "phaseModLegacy",
		presets: PHASE_MOD_PRESETS,
		presetTitle: "Phase Mod Presets",
		formatters: {
			amount: pct,
			ratio: (v) => `${v.toFixed(2)}x`,
			pmPre: (v) => (v ? "Pre" : "Post"),
		},
	},
	vibrato: {
		patchKey: "vibrato",
		moduleKey: "vibrato",
		title: "Vibrato",
		color: "#f472b6",
		columns: 2,
		customRenderer: "vibratoLegacy",
		presets: VIBRATO_PRESETS,
		presetTitle: "Vibrato Presets",
		formatters: {
			rate: (v) => `${v.toFixed(1)}Hz`,
			depth: (v) => `${Math.round(v)}%`,
			delay: (v) => `${(v).toFixed(0)}ms`,
			waveform: (v) => {
				switch (v) {
					case 0:
						return "Sine";
					case 1:
						return "Triangle";
					case 2:
						return "Square";
					case 3:
						return "Saw";
					case 4:
						return "Inverted Saw";
					case 5:
						return "Random";
					default:
						return "Unknown";
				}
			},
		},
	},

	phaser: {
		patchKey: "phaser",
		moduleKey: "phaser",
		color: "#a78bfa",
		meta: "4-Stage",
		presets: PHASER_PRESETS,
		presetTitle: "Phaser Presets",
		formatters: {
			rate: (v) => `${v.toFixed(1)}Hz`,
			depth: pct,
			feedback: (v) =>
				v >= 0 ? `+${Math.round(v * 100)}%` : `${Math.round(v * 100)}%`,
			mix: pct,
		},
	},
	reverb: {
		patchKey: "reverb",
		moduleKey: "reverb",
		color: "#f97316",
		meta: "FDN",
		columns: 3,
		presets: REVERB_PRESETS,
		presetTitle: "Reverb Presets",
		formatters: {
			mix: pct,
			space: pct,
			predelay: (v) => `${Math.round(v * 1000)}ms`,
			distance: pct,
			character: pct,
		},
	},
	compressor: {
		patchKey: "compressor",
		moduleKey: "compressor",
		title: "Compressor",
		color: "#fb923c",
		columns: 3,
		presets: COMPRESSOR_PRESETS,
		presetTitle: "Compressor Presets",
		formatters: {
			thresholdDb: (v) => `${v.toFixed(0)}dB`,
			ratio: (v) => `${v.toFixed(1)}:1`,
			attackMs: (v) => `${v.toFixed(1)}ms`,
			releaseMs: (v) => `${v.toFixed(0)}ms`,
			makeupDb: (v) => `${v.toFixed(1)}dB`,
			mix: pct,
		},
	},
	eq5Band: {
		patchKey: "eq",
		moduleKey: "eq",
		title: "EQ",
		color: "#34d399",
		columns: 5,
		presets: EQ_PRESETS,
		presetTitle: "EQ Presets",
		formatters: {
			gain80: (v) => `${v > 0 ? "+" : ""}${v.toFixed(1)}`,
			gain240: (v) => `${v > 0 ? "+" : ""}${v.toFixed(1)}`,
			gain750: (v) => `${v > 0 ? "+" : ""}${v.toFixed(1)}`,
			gain2200: (v) => `${v > 0 ? "+" : ""}${v.toFixed(1)}`,
			gain8000: (v) => `${v > 0 ? "+" : ""}${v.toFixed(1)}`,
		},
	},
	grainDelay: {
		patchKey: "grainDelay",
		moduleKey: "grainDelay",
		color: "#a78bfa",
		columns: 4,
		presets: GRAIN_DELAY_PRESETS,
		presetTitle: "Grain Delay Presets",
		formatters: {
			time: (v) => `${(v * 1000).toFixed(0)}ms`,
			feedback: pct,
			scatter: pct,
			density: pct,
			mix: pct,
		},
	},
	bitcrusher: {
		patchKey: "bitcrusher",
		moduleKey: "bitcrusher",
		color: "#f87171",
		columns: 3,
		presets: BITCRUSHER_PRESETS,
		presetTitle: "Bitcrusher Presets",
		formatters: {
			bits: (v) => v.toFixed(1),
			rateReduction: (v) => `÷${v.toFixed(1)}`,
			mix: pct,
		},
	},
	shimmerVerb: {
		patchKey: "shimmerVerb",
		moduleKey: "shimmerVerb",
		title: "Shimmer Verb",
		color: "#60a5fa",
		columns: 3,
		presets: SHIMMER_VERB_PRESETS,
		presetTitle: "Shimmer Verb Presets",
		formatters: {
			shimmer: pct,
			space: pct,
			mix: pct,
		},
	},
	distortion: {
		patchKey: "distortion",
		moduleKey: "distortion",
		color: "#f59e0b",
		columns: 4,
		presets: DISTORTION_PRESETS,
		presetTitle: "Distortion Presets",
		formatters: {
			drive: pct,
			tone: pct,
			mix: pct,
		},
	},
	loFi: {
		patchKey: "loFi",
		moduleKey: "loFi",
		title: "LoFi",
		color: "#38bdf8",
		columns: 4,
		presets: LOFI_PRESETS,
		presetTitle: "LoFi Presets",
		formatters: {
			degrade: pct,
			wowDepth: pct,
			wowRate: (v) => `${v.toFixed(2)}Hz`,
			flutterDepth: pct,
			flutterRate: (v) => `${v.toFixed(1)}Hz`,
			tone: pct,
			mix: pct,
		},
		controlLayout: {
			wowDepth: { label: "WowDepth" },
			wowRate: { label: "WowRate" },
			flutterDepth: { label: "FlutterDepth" },
			flutterRate: { label: "FlutterRate" },
		},
	},
	ringMod: {
		patchKey: "ringMod",
		moduleKey: "ringMod",
		title: "Ring Mod",
		color: "#e879f9",
		columns: 2,
		presets: RING_MOD_PRESETS,
		presetTitle: "Ring Mod Presets",
		formatters: {
			carrierHz: (v) => `${v.toFixed(0)} Hz`,
			mix: pct,
		},
	},
	wavefolder: {
		patchKey: "wavefolder",
		moduleKey: "wavefolder",
		title: "Wavefolder",
		color: "#c084fc",
		columns: 3,
		presets: WAVEFOLDER_PRESETS,
		presetTitle: "Wavefolder Presets",
		formatters: {
			drive: pct,
			folds: pct,
			mix: pct,
		},
	},
	junoChorus: {
		patchKey: "junoChorus",
		moduleKey: "junoChorus",
		title: "Juno Chorus",
		color: "#22d3ee",
		columns: 1,
		presets: JUNO_CHORUS_PRESETS,
		presetTitle: "Juno Chorus Presets",
		formatters: {
			mix: pct,
		},
	},
	tremolo: {
		patchKey: "tremolo",
		moduleKey: "tremolo",
		color: "#4ade80",
		columns: 3,
		customRenderer: "tremoloLegacy",
		presets: TREMOLO_PRESETS,
		presetTitle: "Tremolo Presets",
		formatters: {
			rate: (v) => `${v.toFixed(1)}Hz`,
			depth: pct,
			mix: pct,
		},
	},
	multimodeFilter: {
		patchKey: "multimodeFilter",
		moduleKey: "multimodeFilter",
		title: "Multimode Filter",
		color: "#fca5a5",
		columns: 3,
		presets: MULTIMODE_FILTER_PRESETS,
		presetTitle: "Multimode Filter Presets",
		formatters: {
			cutoffHz: (v) => `${Math.round(v)}Hz`,
			resonance: pct,
			drive: pct,
			mix: pct,
		},
	},
	flanger: {
		patchKey: "flanger",
		moduleKey: "flanger",
		title: "Flanger",
		color: "#67e8f9",
		columns: 3,
		presets: FLANGER_PRESETS,
		presetTitle: "Flanger Presets",
		formatters: {
			rate: (v) => `${v.toFixed(2)}Hz`,
			depth: pct,
			delayMs: (v) => `${v.toFixed(1)}ms`,
			feedback: (v) => `${v >= 0 ? "+" : ""}${Math.round(v * 100)}%`,
			mix: pct,
		},
	},
	rotarySpeaker: {
		patchKey: "rotarySpeaker",
		moduleKey: "rotarySpeaker",
		title: "Rotary Speaker",
		color: "#fde68a",
		columns: 2,
		presets: ROTARY_SPEAKER_PRESETS,
		presetTitle: "Rotary Speaker Presets",
		formatters: {
			speed: (v) => `${v.toFixed(1)}Hz`,
			depth: pct,
			drive: pct,
			mix: pct,
		},
	},
	autoWah: {
		patchKey: "autoWah",
		moduleKey: "autoWah",
		title: "Auto-Wah",
		color: "#86efac",
		columns: 3,
		presets: AUTO_WAH_PRESETS,
		presetTitle: "Auto-Wah Presets",
		formatters: {
			sensitivity: pct,
			cutoffHz: (v) => `${Math.round(v)}Hz`,
			resonance: pct,
			attackMs: (v) => `${v.toFixed(1)}ms`,
			releaseMs: (v) => `${v.toFixed(0)}ms`,
			mix: pct,
		},
	},
	stereoWidener: {
		patchKey: "stereoWidener",
		moduleKey: "stereoWidener",
		title: "Stereo Widener",
		color: "#93c5fd",
		columns: 2,
		presets: STEREO_WIDENER_PRESETS,
		presetTitle: "Stereo Widener Presets",
		formatters: {
			width: pct,
			delayMs: (v) => `${v.toFixed(1)}ms`,
			tone: pct,
			mix: pct,
		},
	},
} satisfies Partial<Record<FxSlotType, FxUiMeta>>;

function defaultKnobFormatter(v: number) {
	return v.toFixed(2);
}

function resolveKnobFormatter(
	param: string,
	meta: FxUiMeta,
): (v: number) => string {
	return meta.formatters?.[param] ?? defaultKnobFormatter;
}

function buildControls(type: FxSlotType, meta: FxUiMeta): ControlDef[] {
	const def = FX_DEFINITIONS_V1.find((entry) => entry.slotType === type);
	if (!def) {
		return [];
	}

	return def.controls.flatMap((ctrl): ControlDef[] => {
		const layout = meta.controlLayout?.[ctrl.id];
		if (ctrl.kind === "toggle") {
			return [];
		}

		if (ctrl.kind === "buttonGroup") {
			return [
				{
					kind: "buttonGroup",
					param: ctrl.id,
					label: layout?.label ?? ctrl.id,
					options: ctrl.options.map((opt) => ({
						value: opt.value,
						label: String(opt.value),
					})),
					buttonPresentation: layout?.buttonPresentation,
					centered: layout?.centered,
					order: layout?.order,
					row: layout?.row,
					colSpan: layout?.colSpan,
					colStart: layout?.colStart,
					hideLabel: layout?.hideLabel,
					visibleWhen: layout?.visibleWhen,
					sourceIndex: def.controls.indexOf(ctrl),
				},
			];
		}

		const min = ctrl.min ?? 0;
		const max = ctrl.max ?? 1;
		const defaultValue = ctrl.defaultF32 ?? min;
		return [
			{
				kind: "knob",
				param: ctrl.id,
				label: layout?.label ?? ctrl.id,
				min,
				max,
				defaultValue,
				formatter: resolveKnobFormatter(ctrl.id, meta),
				order: layout?.order,
				row: layout?.row,
				colSpan: layout?.colSpan,
				colStart: layout?.colStart,
				hideLabel: layout?.hideLabel,
				visibleWhen: layout?.visibleWhen,
				sourceIndex: def.controls.indexOf(ctrl),
			},
		];
	});
}

function buildConfig(type: FxSlotType, meta: FxUiMeta): FxSlotModuleConfig {
	return {
		type,
		patchKey: meta.patchKey,
		moduleKey: meta.moduleKey,
		title: meta.title ?? type,
		color: meta.color,
		meta: meta.meta,
		columns: meta.columns,
		dynamicColumns: meta.dynamicColumns,
		customRenderer: meta.customRenderer,
		presets: meta.presets,
		presetTitle: meta.presetTitle,
		controls: buildControls(type, meta),
	};
}

export const FX_SLOT_MODULE_CONFIGS: Partial<
	Record<FxSlotType, FxSlotModuleConfig>
> = Object.fromEntries(
	(Object.entries(FX_UI_META) as [FxSlotType, FxUiMeta][]).map(
		([type, meta]) => [type, buildConfig(type, meta)],
	),
);
