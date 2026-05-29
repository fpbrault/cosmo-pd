import {
	AUTO_WAH_PRESET_DATA,
	BITCRUSHER_PRESET_DATA,
	CHORUS_PRESET_DATA,
	COMPRESSOR_PRESET_DATA,
	DELAY_PRESET_DATA,
	DISTORTION_PRESET_DATA,
	EQ_PRESET_DATA,
	FLANGER_PRESET_DATA,
	FX_DEFINITIONS_V1,
	type FxSlotType,
	GRAIN_DELAY_PRESET_DATA,
	JUNO_CHORUS_PRESET_DATA,
	LOFI_PRESET_DATA,
	MULTIMODE_FILTER_PRESET_DATA,
	PHASE_MOD_PRESET_DATA,
	PHASER_PRESET_DATA,
	REVERB_PRESET_DATA,
	RING_MOD_PRESET_DATA,
	ROTARY_SPEAKER_PRESET_DATA,
	SHIMMER_VERB_PRESET_DATA,
	STEREO_WIDENER_PRESET_DATA,
	TREMOLO_PRESET_DATA,
	VIBRATO_PRESET_DATA,
	WAVEFOLDER_PRESET_DATA,
} from "@/lib/synth/bindings/synth";

type BuiltinPresetEntry = {
	id: string;
	label: string;
	params: Record<string, unknown>;
};
type SynthModuleType =
	| FxSlotType
	| "eq"
	| "lfo1"
	| "lfo2"
	| "modEnv"
	| "random";
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
type ControlDef = KnobControlDef | ButtonGroupControlDef;
type FxCustomRendererKey =
	| "delayModuleRenderer"
	| "eq8BandModuleRenderer"
	| "grainDelayModuleRenderer"
	| "phaseModModuleRenderer"
	| "vibratoModuleRenderer"
	| "tremoloModuleRenderer";
export type FxSlotModuleConfig = {
	type: FxSlotType;
	moduleKey: SynthModuleType;
	title: string;
	shortTitle: string;
	color: string;
	columns?: number;
	dynamicColumns?: {
		param: string;
		equals: number | boolean | string;
		columns: number;
		otherwiseColumns?: number;
	};
	customRenderer?: FxCustomRendererKey;
	presets: BuiltinPresetEntry[];
	formatters?: Partial<Record<string, FormatterFn>>;
	controlLayout?: Partial<Record<string, ControlLayoutRule>>;
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
export const FX_UI_META = {
	empty: {
		moduleKey: "empty",
		shortTitle: "—",
		color: "#3b3b3b",
		presets: [],
		title: "Empty",
	},
	chorus: {
		moduleKey: "chorus",
		title: "Chorus",
		shortTitle: "Chrs",
		color: "#818cf8",
		columns: 3,
		presets: CHORUS_PRESET_DATA,
		formatters: {
			rate: (v) => `${v.toFixed(1)}Hz`,
			depth: (v) => `${Math.round(v / 5)}%`,
			mix: pct,
		},
	},
	delay: {
		moduleKey: "delay",
		title: "Delay",
		shortTitle: "Dly",
		color: "#fbbf24",
		columns: 4,
		customRenderer: "delayModuleRenderer",
		presets: DELAY_PRESET_DATA,
		formatters: {
			time: (v) => `${Math.round(v * 1000)}ms`,
			feedback: pct,
			mix: pct,
			tapeMode: (v) => (v ? "Tape" : "Digital"),
			warmth: pct,
		},
	},
	phaseMod: {
		moduleKey: "phaseMod",
		title: "Phase Mod",
		shortTitle: "PhMd",
		color: "#f43f5e",
		columns: 3,
		customRenderer: "phaseModModuleRenderer",
		presets: PHASE_MOD_PRESET_DATA,
		formatters: {
			amount: pct,
			ratio: (v) => `${v.toFixed(2)}x`,
			pmPre: (v) => (v ? "Pre" : "Post"),
		},
	},
	vibrato: {
		moduleKey: "vibrato",
		title: "Vibrato",
		shortTitle: "Vib",
		color: "#f472b6",
		columns: 2,
		customRenderer: "vibratoModuleRenderer",
		presets: VIBRATO_PRESET_DATA,
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
		moduleKey: "phaser",
		title: "Phaser",
		shortTitle: "Phsr",
		color: "#a78bfa",
		presets: PHASER_PRESET_DATA,
		formatters: {
			rate: (v) => `${v.toFixed(1)}Hz`,
			depth: pct,
			feedback: (v) =>
				v >= 0 ? `+${Math.round(v * 100)}%` : `${Math.round(v * 100)}%`,
			mix: pct,
		},
	},
	reverb: {
		moduleKey: "reverb",
		title: "Reverb",
		shortTitle: "Rvb",
		color: "#f97316",
		columns: 3,
		presets: REVERB_PRESET_DATA,
		formatters: {
			mix: pct,
			space: pct,
			predelay: (v) => `${Math.round(v * 1000)}ms`,
			distance: pct,
			character: pct,
		},
	},
	compressor: {
		moduleKey: "compressor",
		title: "Compressor",
		shortTitle: "Comp",
		color: "#fb923c",
		columns: 3,
		presets: COMPRESSOR_PRESET_DATA,
		formatters: {
			thresholdDb: (v) => `${v.toFixed(0)}dB`,
			ratio: (v) => `${v.toFixed(1)}:1`,
			attackMs: (v) => `${v.toFixed(1)}ms`,
			releaseMs: (v) => `${v.toFixed(0)}ms`,
			makeupDb: (v) => `${v.toFixed(1)}dB`,
			mix: pct,
		},
	},
	eq8Band: {
		moduleKey: "eq8Band",
		title: "EQ",
		shortTitle: "EQ",
		color: "#34d399",
		columns: 8,
		customRenderer: "eq8BandModuleRenderer",
		presets: EQ_PRESET_DATA,
		formatters: {
			gainBand1: (v) => `${v > 0 ? "+" : ""}${v.toFixed(1)}`,
			gainBand2: (v) => `${v > 0 ? "+" : ""}${v.toFixed(1)}`,
			gainBand3: (v) => `${v > 0 ? "+" : ""}${v.toFixed(1)}`,
			gainBand4: (v) => `${v > 0 ? "+" : ""}${v.toFixed(1)}`,
			gainBand5: (v) => `${v > 0 ? "+" : ""}${v.toFixed(1)}`,
			gainBand6: (v) => `${v > 0 ? "+" : ""}${v.toFixed(1)}`,
			gainBand7: (v) => `${v > 0 ? "+" : ""}${v.toFixed(1)}`,
			gainBand8: (v) => `${v > 0 ? "+" : ""}${v.toFixed(1)}`,
		},
	},
	grainDelay: {
		moduleKey: "grainDelay",
		title: "Grain Delay",
		shortTitle: "GrDl",
		color: "#a78bfa",
		columns: 4,
		customRenderer: "grainDelayModuleRenderer",
		presets: GRAIN_DELAY_PRESET_DATA,
		formatters: {
			time: (v) => `${(v * 1000).toFixed(0)}ms`,
			feedback: pct,
			scatter: pct,
			density: pct,
			mix: pct,
		},
	},
	bitcrusher: {
		moduleKey: "bitcrusher",
		title: "Bitcrusher",
		shortTitle: "Bit",
		color: "#f87171",
		columns: 3,
		presets: BITCRUSHER_PRESET_DATA,
		formatters: {
			bits: (v) => v.toFixed(1),
			rateReduction: (v) => `÷${v.toFixed(1)}`,
			mix: pct,
		},
	},
	shimmerVerb: {
		moduleKey: "shimmerVerb",
		title: "Shimmer Verb",
		shortTitle: "Shim",
		color: "#60a5fa",
		columns: 3,
		presets: SHIMMER_VERB_PRESET_DATA,
		formatters: {
			shimmer: pct,
			space: pct,
			mix: pct,
		},
	},
	distortion: {
		moduleKey: "distortion",
		title: "Distortion",
		shortTitle: "Dist",
		color: "#f59e0b",
		columns: 4,
		presets: DISTORTION_PRESET_DATA,
		formatters: {
			drive: pct,
			tone: pct,
			mix: pct,
		},
	},
	loFi: {
		moduleKey: "loFi",
		title: "LoFi",
		shortTitle: "LoFi",
		color: "#38bdf8",
		columns: 4,
		presets: LOFI_PRESET_DATA,
		formatters: {
			degrade: pct,
			wow: pct,
			flutter: pct,
			filter: pct,
			crackle: pct,
			noise: pct,
			saturation: pct,
			mix: pct,
		},
	},
	ringMod: {
		moduleKey: "ringMod",
		title: "Ring Mod",
		shortTitle: "Ring",
		color: "#e879f9",
		columns: 2,
		presets: RING_MOD_PRESET_DATA,
		formatters: {
			carrierHz: (v) => `${v.toFixed(0)} Hz`,
			mix: pct,
		},
	},
	wavefolder: {
		moduleKey: "wavefolder",
		title: "Wavefolder",
		shortTitle: "Wave",
		color: "#c084fc",
		columns: 3,
		presets: WAVEFOLDER_PRESET_DATA,
		formatters: {
			drive: pct,
			folds: pct,
			mix: pct,
		},
	},
	junoChorus: {
		moduleKey: "junoChorus",
		title: "Juno Chorus",
		shortTitle: "Juno",
		color: "#22d3ee",
		columns: 1,
		presets: JUNO_CHORUS_PRESET_DATA,
		formatters: {
			mix: pct,
		},
	},
	tremolo: {
		moduleKey: "tremolo",
		title: "Tremolo",
		shortTitle: "Trem",
		color: "#4ade80",
		columns: 3,
		customRenderer: "tremoloModuleRenderer",
		presets: TREMOLO_PRESET_DATA,
		formatters: {
			rate: (v) => `${v.toFixed(1)}Hz`,
			depth: pct,
			mix: pct,
		},
	},
	multimodeFilter: {
		moduleKey: "multimodeFilter",
		title: "Multimode Filter",
		shortTitle: "MMF",
		color: "#fca5a5",
		columns: 3,
		presets: MULTIMODE_FILTER_PRESET_DATA,
		formatters: {
			cutoffHz: (v) => `${Math.round(v)}Hz`,
			resonance: pct,
			drive: pct,
			mix: pct,
		},
	},
	flanger: {
		moduleKey: "flanger",
		title: "Flanger",
		shortTitle: "Flng",
		color: "#67e8f9",
		columns: 3,
		presets: FLANGER_PRESET_DATA,
		formatters: {
			rate: (v) => `${v.toFixed(2)}Hz`,
			depth: pct,
			delayMs: (v) => `${v.toFixed(1)}ms`,
			feedback: (v) => `${v >= 0 ? "+" : ""}${Math.round(v * 100)}%`,
			mix: pct,
		},
	},
	rotarySpeaker: {
		moduleKey: "rotarySpeaker",
		title: "Rotary Speaker",
		shortTitle: "Rot",
		color: "#fde68a",
		columns: 2,
		presets: ROTARY_SPEAKER_PRESET_DATA,
		formatters: {
			speed: (v) => `${v.toFixed(1)}Hz`,
			depth: pct,
			drive: pct,
			mix: pct,
		},
	},
	autoWah: {
		moduleKey: "autoWah",
		title: "Auto-Wah",
		shortTitle: "AWah",
		color: "#86efac",
		columns: 3,
		presets: AUTO_WAH_PRESET_DATA,
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
		moduleKey: "stereoWidener",
		title: "Stereo Widener",
		shortTitle: "SWid",
		color: "#93c5fd",
		columns: 2,
		presets: STEREO_WIDENER_PRESET_DATA,
		formatters: {
			width: pct,
			delayMs: (v) => `${v.toFixed(1)}ms`,
			tone: pct,
			mix: pct,
		},
	},
} satisfies Partial<
	Record<FxSlotType, Omit<FxSlotModuleConfig, "type" | "controls">>
>;
function defaultKnobFormatter(v: number) {
	return v.toFixed(2);
}
function resolveKnobFormatter(
	param: string,
	meta: Omit<FxSlotModuleConfig, "type" | "controls">,
): (v: number) => string {
	return meta.formatters?.[param] ?? defaultKnobFormatter;
}
function buildControls(
	type: FxSlotType,
	meta: Omit<FxSlotModuleConfig, "type" | "controls">,
): ControlDef[] {
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
function buildConfig(
	type: FxSlotType,
	meta: Omit<FxSlotModuleConfig, "type" | "controls">,
): FxSlotModuleConfig {
	return {
		type,
		...meta,
		controls: buildControls(type, meta),
	};
}
export const FX_SLOT_MODULE_CONFIGS: Partial<
	Record<FxSlotType, FxSlotModuleConfig>
> = Object.fromEntries(
	(
		Object.entries(FX_UI_META) as [
			FxSlotType,
			Omit<FxSlotModuleConfig, "type" | "controls">,
		][]
	).map(([type, meta]) => [type, buildConfig(type, meta)]),
);
