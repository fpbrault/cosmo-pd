import { create } from "zustand";
import {
	DEFAULT_ALGO_REF,
	normalizeWaveformId,
	toAlgoRefV1,
} from "@/lib/synth/algoRef";
import type {
	Algo,
	AlgoControlValueV1,
	AlgoDefinitionV1,
	BaseWaveform,
	CzWaveform,
	FxDefinitionV1,
	FxSlotConfig,
	FxSlotType,
	LfoWaveform,
	LineSelect,
	ModMatrix,
	ModMode,
	PolyMode,
	PortamentoMode,
	StepEnvData,
	SynthPresetV1,
	WindowType,
} from "@/lib/synth/bindings/synth";
import {
	ALGO_DEFINITIONS_V1,
	ENGINE_PARAM_UI_META_V1,
	FX_DEFINITIONS_V1,
} from "@/lib/synth/bindings/synth";
import {
	DEFAULT_DCA_ENV,
	DEFAULT_DCO_ENV,
	DEFAULT_DCW_ENV,
} from "@/lib/synth/pdAlgorithms";

// ---------------------------------------------------------------------------
// Helpers (identical to the ones that were in useSynthState)
// ---------------------------------------------------------------------------

function resolveAlgoDefaultBaseWaveform(algo: Algo): BaseWaveform {
	const definitions = ALGO_DEFINITIONS_V1 as AlgoDefinitionV1[];
	const definition = definitions.find((entry) => entry.id === algo);
	return definition?.defaultBaseWaveform ?? "sine";
}

function normalizeAlgoControls(
	algo: Algo,
	values: AlgoControlValueV1[] | null | undefined,
): AlgoControlValueV1[] {
	const definitions = ALGO_DEFINITIONS_V1 as AlgoDefinitionV1[];
	const definition = definitions.find((entry) => entry.id === algo);
	if (!definition) return [];
	const incoming = new Map(
		(values ?? []).map((entry) => [entry.id, entry.value]),
	);
	return definition.controls
		.filter((control) => (control.kind ?? "number") === "number")
		.map((control) => ({
			id: control.id,
			value: incoming.get(control.id) ?? control.default ?? control.min ?? 0,
		}));
}

function inferCzWaveform(
	explicitWaveform: unknown,
	fallback: CzWaveform,
): CzWaveform {
	if (typeof explicitWaveform === "string") {
		return normalizeWaveformId(explicitWaveform);
	}
	return fallback;
}

// ---------------------------------------------------------------------------
// FX slot helpers
// ---------------------------------------------------------------------------

/** Builds an enabled FxSlotConfig from Rust defaults in FX_DEFINITIONS_V1. */
function makeDefaultFxSlotConfig(type: FxSlotType): FxSlotConfig {
	if (type === "empty") return { type: "empty" };
	const def = (FX_DEFINITIONS_V1 as FxDefinitionV1[]).find(
		(d) => d.slotType === type,
	);
	if (!def) return { type: "empty" };
	const params = def.controls.reduce<Record<string, number | boolean>>(
		(acc, c) => {
			const v = c.defaultF32 ?? 0;
			acc[c.id] = c.kind === "toggle" ? v !== 0 : v;
			return acc;
		},
		{ enabled: true },
	);
	return { type, params } as FxSlotConfig;
}

type FxSlotTuple = [
	FxSlotConfig,
	FxSlotConfig,
	FxSlotConfig,
	FxSlotConfig,
	FxSlotConfig,
	FxSlotConfig,
];

const DEFAULT_FX_SLOTS: FxSlotTuple = [
	{ type: "empty" },
	{ type: "empty" },
	{ type: "empty" },
	{ type: "empty" },
	{ type: "empty" },
	{ type: "empty" },
];

const ENGINE_PARAM_DEFAULTS = new Map(
	ENGINE_PARAM_UI_META_V1.map((meta) => [meta.key, meta.paramDefault]),
);

function getEngineParamDefault(key: string, fallback: number): number {
	const value = ENGINE_PARAM_DEFAULTS.get(key);
	return typeof value === "number" ? value : fallback;
}

// ---------------------------------------------------------------------------
// Flat state shape — mirrors the old individual useState fields
// ---------------------------------------------------------------------------

export type SynthState = {
	warpAAmount: number;
	warpAAlgo: Algo;
	algo2A: Algo | null;
	algoBlendA: number;

	warpBAmount: number;
	warpBAlgo: Algo;
	algo2B: Algo | null;
	algoBlendB: number;

	windowType: WindowType;
	volume: number;

	line1Level: number;
	line1Octave: number;
	line1Detune: number;
	line1DcwKeyFollow: number;
	line1DcoEnv: StepEnvData;
	line1DcwEnv: StepEnvData;
	line1DcaEnv: StepEnvData;
	line1CzSlotAWaveform: CzWaveform;
	line1CzSlotBWaveform: CzWaveform;
	line1CzWindow: WindowType;
	line1AlgoControlsA: AlgoControlValueV1[];
	line1AlgoControlsB: AlgoControlValueV1[];
	line1BaseWaveformA: BaseWaveform;
	line1BaseWaveformB: BaseWaveform;

	line2Level: number;
	line2Octave: number;
	line2Detune: number;
	line2DcwKeyFollow: number;
	line2DcoEnv: StepEnvData;
	line2DcwEnv: StepEnvData;
	line2DcaEnv: StepEnvData;
	line2CzSlotAWaveform: CzWaveform;
	line2CzSlotBWaveform: CzWaveform;
	line2CzWindow: WindowType;
	line2AlgoControlsA: AlgoControlValueV1[];
	line2AlgoControlsB: AlgoControlValueV1[];
	line2BaseWaveformA: BaseWaveform;
	line2BaseWaveformB: BaseWaveform;

	lineSelect: LineSelect;
	modMode: ModMode;

	polyMode: PolyMode;
	legato: boolean;
	velocityCurve: number;

	portamentoEnabled: boolean;
	portamentoMode: PortamentoMode;
	portamentoRate: number;
	portamentoTime: number;

	lfoWaveform: LfoWaveform;
	lfoRate: number;
	lfoDepth: number;
	lfoSymmetry: number;
	lfoRetrigger: boolean;
	lfoOffset: number;
	lfo2Waveform: LfoWaveform;
	lfo2Rate: number;
	lfo2Depth: number;
	lfo2Symmetry: number;
	lfo2Retrigger: boolean;
	lfo2Offset: number;

	randomRate: number;

	modEnvAttack: number;
	modEnvDecay: number;
	modEnvSustain: number;
	modEnvRelease: number;

	pitchBendRange: number;
	octave: number;
	modMatrix: ModMatrix;
	/** Unified per-slot FX configuration — all 6 slots. */
	fxSlots: FxSlotTuple;
};

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------

type SynthActions = {
	setWarpAAmount: (v: number) => void;
	setWarpAAlgo: (v: Algo) => void;
	setAlgo2A: (v: Algo | null) => void;
	setAlgoBlendA: (v: number) => void;

	setWarpBAmount: (v: number) => void;
	setWarpBAlgo: (v: Algo) => void;
	setAlgo2B: (v: Algo | null) => void;
	setAlgoBlendB: (v: number) => void;

	setWindowType: (v: WindowType) => void;
	setVolume: (v: number) => void;

	setLine1Level: (v: number) => void;
	setLine1Octave: (v: number) => void;
	setLine1Detune: (v: number) => void;
	setLine1DcwKeyFollow: (v: number) => void;
	setLine1DcoEnv: (v: StepEnvData) => void;
	setLine1DcwEnv: (v: StepEnvData) => void;
	setLine1DcaEnv: (v: StepEnvData) => void;
	setLine1CzSlotAWaveform: (v: CzWaveform) => void;
	setLine1CzSlotBWaveform: (v: CzWaveform) => void;
	setLine1CzWindow: (v: WindowType) => void;
	setLine1AlgoControlsA: (v: AlgoControlValueV1[]) => void;
	setLine1AlgoControlsB: (v: AlgoControlValueV1[]) => void;
	setLine1BaseWaveformA: (v: BaseWaveform) => void;
	setLine1BaseWaveformB: (v: BaseWaveform) => void;

	setLine2Level: (v: number) => void;
	setLine2Octave: (v: number) => void;
	setLine2Detune: (v: number) => void;
	setLine2DcwKeyFollow: (v: number) => void;
	setLine2DcoEnv: (v: StepEnvData) => void;
	setLine2DcwEnv: (v: StepEnvData) => void;
	setLine2DcaEnv: (v: StepEnvData) => void;
	setLine2CzSlotAWaveform: (v: CzWaveform) => void;
	setLine2CzSlotBWaveform: (v: CzWaveform) => void;
	setLine2CzWindow: (v: WindowType) => void;
	setLine2AlgoControlsA: (v: AlgoControlValueV1[]) => void;
	setLine2AlgoControlsB: (v: AlgoControlValueV1[]) => void;
	setLine2BaseWaveformA: (v: BaseWaveform) => void;
	setLine2BaseWaveformB: (v: BaseWaveform) => void;

	setLineSelect: (v: LineSelect) => void;
	setModMode: (v: ModMode) => void;

	setPolyMode: (v: PolyMode) => void;
	setLegato: (v: boolean) => void;
	setVelocityCurve: (v: number) => void;

	setPortamentoEnabled: (v: boolean) => void;
	setPortamentoMode: (v: PortamentoMode) => void;
	setPortamentoRate: (v: number) => void;
	setPortamentoTime: (v: number) => void;

	setLfoWaveform: (v: LfoWaveform) => void;
	setLfoRate: (v: number) => void;
	setLfoDepth: (v: number) => void;
	setLfoSymmetry: (v: number) => void;
	setLfoRetrigger: (v: boolean) => void;
	setLfoOffset: (v: number) => void;
	setLfo2Waveform: (v: LfoWaveform) => void;
	setLfo2Rate: (v: number) => void;
	setLfo2Depth: (v: number) => void;
	setLfo2Symmetry: (v: number) => void;
	setLfo2Retrigger: (v: boolean) => void;
	setLfo2Offset: (v: number) => void;

	setRandomRate: (v: number) => void;

	setModEnvAttack: (v: number) => void;
	setModEnvDecay: (v: number) => void;
	setModEnvSustain: (v: number) => void;
	setModEnvRelease: (v: number) => void;

	setPitchBendRange: (v: number) => void;
	setOctave: (v: number) => void;
	setModMatrix: (v: ModMatrix) => void;
	/** Replace the effect type in a slot (resets params to enabled defaults). */
	setFxSlotType: (slot: number, type: FxSlotType) => void;
	/** Toggle the enabled flag on a slot that has params. */
	setFxSlotEnabled: (slot: number, enabled: boolean) => void;
	/** Shallow-merge `patch` into the params of an effect slot. */
	setFxSlotParams: (
		slot: number,
		patch: Partial<Record<string, unknown>>,
	) => void;
	reorderFxSlots: (fromSlot: number, toSlot: number) => void;

	gatherState: () => SynthPresetV1;
	applyPreset: (preset: SynthPresetV1) => void;
};

export type SynthStore = SynthState & SynthActions;

// ---------------------------------------------------------------------------
// Default state
// ---------------------------------------------------------------------------

const DEFAULT_STATE: SynthState = {
	warpAAmount: 0,
	warpAAlgo: DEFAULT_ALGO_REF,
	algo2A: null,
	algoBlendA: 0,

	warpBAmount: 0,
	warpBAlgo: DEFAULT_ALGO_REF,
	algo2B: null,
	algoBlendB: 0,

	windowType: "off",
	volume: 1,

	line1Level: 1,
	line1Octave: 0,
	line1Detune: 0,
	line1DcwKeyFollow: 0,
	line1DcoEnv: DEFAULT_DCO_ENV,
	line1DcwEnv: DEFAULT_DCW_ENV,
	line1DcaEnv: DEFAULT_DCA_ENV,
	line1CzSlotAWaveform: "saw",
	line1CzSlotBWaveform: "saw",
	line1CzWindow: "off",
	line1AlgoControlsA: [],
	line1AlgoControlsB: [],
	line1BaseWaveformA: "cosine",
	line1BaseWaveformB: "cosine",

	line2Level: 1,
	line2Octave: 0,
	line2Detune: 0,
	line2DcwKeyFollow: 0,
	line2DcoEnv: DEFAULT_DCO_ENV,
	line2DcwEnv: DEFAULT_DCW_ENV,
	line2DcaEnv: DEFAULT_DCA_ENV,
	line2CzSlotAWaveform: "saw",
	line2CzSlotBWaveform: "saw",
	line2CzWindow: "off",
	line2AlgoControlsA: [],
	line2AlgoControlsB: [],
	line2BaseWaveformA: "cosine",
	line2BaseWaveformB: "cosine",

	lineSelect: "L1+L2",
	modMode: "normal",

	polyMode: "poly8",
	legato: false,
	velocityCurve: getEngineParamDefault("velocityCurve", 0),

	portamentoEnabled: false,
	portamentoMode: "rate",
	portamentoRate: getEngineParamDefault("portamentoRate", 50),
	portamentoTime: getEngineParamDefault("portamentoTime", 0.5),

	lfoWaveform: "sine",
	lfoRate: getEngineParamDefault("lfoRate", 5),
	lfoDepth: getEngineParamDefault("lfoDepth", 0.2),
	lfoSymmetry: 0.5,
	lfoRetrigger: false,
	lfoOffset: getEngineParamDefault("lfoOffset", 0),
	lfo2Waveform: "sine",
	lfo2Rate: getEngineParamDefault("lfo2Rate", 5),
	lfo2Depth: getEngineParamDefault("lfo2Depth", 0.2),
	lfo2Symmetry: 0.5,
	lfo2Retrigger: false,
	lfo2Offset: getEngineParamDefault("lfo2Offset", 0),

	randomRate: 2,

	modEnvAttack: getEngineParamDefault("modEnvAttack", 0.01),
	modEnvDecay: getEngineParamDefault("modEnvDecay", 0.1),
	modEnvSustain: getEngineParamDefault("modEnvSustain", 0.5),
	modEnvRelease: getEngineParamDefault("modEnvRelease", 0.2),

	pitchBendRange: 2,
	octave: 0,
	modMatrix: { routes: [] },
	fxSlots: DEFAULT_FX_SLOTS,
};

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useSynthStore = create<SynthStore>((set, get) => ({
	...DEFAULT_STATE,

	// --- Setters (generated per field) ---
	setWarpAAmount: (v) => set({ warpAAmount: v }),
	setWarpAAlgo: (v) => set({ warpAAlgo: v }),
	setAlgo2A: (v) => set({ algo2A: v }),
	setAlgoBlendA: (v) => set({ algoBlendA: v }),

	setWarpBAmount: (v) => set({ warpBAmount: v }),
	setWarpBAlgo: (v) => set({ warpBAlgo: v }),
	setAlgo2B: (v) => set({ algo2B: v }),
	setAlgoBlendB: (v) => set({ algoBlendB: v }),

	setWindowType: (v) => set({ windowType: v }),
	setVolume: (v) => set({ volume: v }),

	setLine1Level: (v) => set({ line1Level: v }),
	setLine1Octave: (v) => set({ line1Octave: v }),
	setLine1Detune: (v) => set({ line1Detune: v }),
	setLine1DcwKeyFollow: (v) => set({ line1DcwKeyFollow: v }),
	setLine1DcoEnv: (v) => set({ line1DcoEnv: v }),
	setLine1DcwEnv: (v) => set({ line1DcwEnv: v }),
	setLine1DcaEnv: (v) => set({ line1DcaEnv: v }),
	setLine1CzSlotAWaveform: (v) => set({ line1CzSlotAWaveform: v }),
	setLine1CzSlotBWaveform: (v) => set({ line1CzSlotBWaveform: v }),
	setLine1CzWindow: (v) => set({ line1CzWindow: v }),
	setLine1AlgoControlsA: (v) => set({ line1AlgoControlsA: v }),
	setLine1AlgoControlsB: (v) => set({ line1AlgoControlsB: v }),
	setLine1BaseWaveformA: (v) => set({ line1BaseWaveformA: v }),
	setLine1BaseWaveformB: (v) => set({ line1BaseWaveformB: v }),

	setLine2Level: (v) => set({ line2Level: v }),
	setLine2Octave: (v) => set({ line2Octave: v }),
	setLine2Detune: (v) => set({ line2Detune: v }),
	setLine2DcwKeyFollow: (v) => set({ line2DcwKeyFollow: v }),
	setLine2DcoEnv: (v) => set({ line2DcoEnv: v }),
	setLine2DcwEnv: (v) => set({ line2DcwEnv: v }),
	setLine2DcaEnv: (v) => set({ line2DcaEnv: v }),
	setLine2CzSlotAWaveform: (v) => set({ line2CzSlotAWaveform: v }),
	setLine2CzSlotBWaveform: (v) => set({ line2CzSlotBWaveform: v }),
	setLine2CzWindow: (v) => set({ line2CzWindow: v }),
	setLine2AlgoControlsA: (v) => set({ line2AlgoControlsA: v }),
	setLine2AlgoControlsB: (v) => set({ line2AlgoControlsB: v }),
	setLine2BaseWaveformA: (v) => set({ line2BaseWaveformA: v }),
	setLine2BaseWaveformB: (v) => set({ line2BaseWaveformB: v }),

	setLineSelect: (v) => set({ lineSelect: v }),
	setModMode: (v) => set({ modMode: v }),

	setPolyMode: (v) => set({ polyMode: v }),
	setLegato: (v) => set({ legato: v }),
	setVelocityCurve: (v) => set({ velocityCurve: v }),

	setPortamentoEnabled: (v) => set({ portamentoEnabled: v }),
	setPortamentoMode: (v) => set({ portamentoMode: v }),
	setPortamentoRate: (v) => set({ portamentoRate: v }),
	setPortamentoTime: (v) => set({ portamentoTime: v }),

	setLfoWaveform: (v) => set({ lfoWaveform: v }),
	setLfoRate: (v) => set({ lfoRate: v }),
	setLfoDepth: (v) => set({ lfoDepth: v }),
	setLfoSymmetry: (v) => set({ lfoSymmetry: v }),
	setLfoRetrigger: (v) => set({ lfoRetrigger: v }),
	setLfoOffset: (v) => set({ lfoOffset: v }),
	setLfo2Waveform: (v) => set({ lfo2Waveform: v }),
	setLfo2Rate: (v) => set({ lfo2Rate: v }),
	setLfo2Depth: (v) => set({ lfo2Depth: v }),
	setLfo2Symmetry: (v) => set({ lfo2Symmetry: v }),
	setLfo2Retrigger: (v) => set({ lfo2Retrigger: v }),
	setLfo2Offset: (v) => set({ lfo2Offset: v }),

	setRandomRate: (v) => set({ randomRate: v }),

	setModEnvAttack: (v) => set({ modEnvAttack: v }),
	setModEnvDecay: (v) => set({ modEnvDecay: v }),
	setModEnvSustain: (v) => set({ modEnvSustain: v }),
	setModEnvRelease: (v) => set({ modEnvRelease: v }),

	setPitchBendRange: (v) => set({ pitchBendRange: v }),
	setOctave: (v) => set({ octave: v }),
	setModMatrix: (v) => set({ modMatrix: v }),
	setFxSlotType: (slot, type) => {
		if (slot < 0 || slot > 5) return;
		set((s) => {
			const slots = [...s.fxSlots] as FxSlotTuple;
			slots[slot] = makeDefaultFxSlotConfig(type);
			return { fxSlots: slots };
		});
	},
	setFxSlotEnabled: (slot, enabled) => {
		set((s) => {
			const config = s.fxSlots[slot];
			if (!config || config.type === "empty") return {};
			const slots = [...s.fxSlots] as FxSlotTuple;
			slots[slot] = {
				...config,
				params: {
					...(config as { params: Record<string, unknown> }).params,
					enabled,
				},
			} as FxSlotConfig;
			return { fxSlots: slots };
		});
	},
	setFxSlotParams: (slot, patch) => {
		set((s) => {
			const config = s.fxSlots[slot];
			if (!config || config.type === "empty") return {};
			const slots = [...s.fxSlots] as FxSlotTuple;
			slots[slot] = {
				...config,
				params: {
					...(config as { params: Record<string, unknown> }).params,
					...patch,
				},
			} as FxSlotConfig;
			return { fxSlots: slots };
		});
	},
	reorderFxSlots: (fromSlot, toSlot) =>
		set((s) => {
			if (
				fromSlot < 0 ||
				fromSlot > 5 ||
				toSlot < 0 ||
				toSlot > 5 ||
				fromSlot === toSlot
			) {
				return {};
			}
			const slots = [...s.fxSlots];
			const [moved] = slots.splice(fromSlot, 1);
			slots.splice(toSlot, 0, moved);
			return { fxSlots: slots as FxSlotTuple };
		}),

	// --- gatherState ---
	gatherState(): SynthPresetV1 {
		const s = get();
		const line1NormalizedAlgoControlsA = normalizeAlgoControls(
			s.warpAAlgo,
			s.line1AlgoControlsA,
		);
		const line1NormalizedAlgoControlsB = s.algo2A
			? normalizeAlgoControls(s.algo2A, s.line1AlgoControlsB)
			: [];
		const line2NormalizedAlgoControlsA = normalizeAlgoControls(
			s.warpBAlgo,
			s.line2AlgoControlsA,
		);
		const line2NormalizedAlgoControlsB = s.algo2B
			? normalizeAlgoControls(s.algo2B, s.line2AlgoControlsB)
			: [];

		const params = {
			lineSelect: s.lineSelect,
			modMode: s.modMode,
			octave: s.octave,
			line1: {
				algo: s.warpAAlgo,
				algo2: s.algo2A,
				algoBlend: s.algoBlendA,
				baseWaveformA: s.line1BaseWaveformA,
				baseWaveformB: s.line1BaseWaveformB,
				window: s.windowType,
				dcaBase: s.line1Level,
				dcwBase: s.warpAAmount,
				modulation: 0,
				detuneCents: s.line1Detune,
				octave: s.line1Octave,
				dcoEnv: s.line1DcoEnv,
				dcwEnv: s.line1DcwEnv,
				dcaEnv: s.line1DcaEnv,
				keyFollow: s.line1DcwKeyFollow,
				cz: {
					slotAWaveform: s.line1CzSlotAWaveform,
					slotBWaveform: s.line1CzSlotBWaveform,
					window: s.line1CzWindow,
				},
				algoControlsA: line1NormalizedAlgoControlsA,
				algoControlsB: line1NormalizedAlgoControlsB,
			},
			line2: {
				algo: s.warpBAlgo,
				algo2: s.algo2B,
				algoBlend: s.algoBlendB,
				baseWaveformA: s.line2BaseWaveformA,
				baseWaveformB: s.line2BaseWaveformB,
				window: s.windowType,
				dcaBase: s.line2Level,
				dcwBase: s.warpBAmount,
				modulation: 0,
				detuneCents: s.line2Detune,
				octave: s.line2Octave,
				dcoEnv: s.line2DcoEnv,
				dcwEnv: s.line2DcwEnv,
				dcaEnv: s.line2DcaEnv,
				keyFollow: s.line2DcwKeyFollow,
				cz: {
					slotAWaveform: s.line2CzSlotAWaveform,
					slotBWaveform: s.line2CzSlotBWaveform,
					window: s.line2CzWindow,
				},
				algoControlsA: line2NormalizedAlgoControlsA,
				algoControlsB: line2NormalizedAlgoControlsB,
			},
			frequency: 440,
			volume: s.volume,
			polyMode: s.polyMode,
			legato: s.legato,
			velocityCurve: s.velocityCurve,

			portamento: {
				enabled: s.portamentoEnabled,
				mode: s.portamentoMode,
				rate: s.portamentoRate,
				time: s.portamentoTime,
			},
			lfo: {
				waveform: s.lfoWaveform,
				rate: s.lfoRate,
				depth: s.lfoDepth,
				symmetry: s.lfoSymmetry,
				retrigger: s.lfoRetrigger,
				offset: s.lfoOffset,
			},
			lfo2: {
				waveform: s.lfo2Waveform,
				rate: s.lfo2Rate,
				depth: s.lfo2Depth,
				symmetry: s.lfo2Symmetry,
				retrigger: s.lfo2Retrigger,
				offset: s.lfo2Offset,
			},
			random: {
				rate: s.randomRate,
			},
			modEnv: {
				attack: s.modEnvAttack,
				decay: s.modEnvDecay,
				sustain: s.modEnvSustain,
				release: s.modEnvRelease,
			},
			pitchBendRange: s.pitchBendRange,
			modMatrix: s.modMatrix,
			fxSlots: s.fxSlots,
		} satisfies SynthPresetV1["params"];

		return {
			schemaVersion: 1,
			params,
		};
	},

	// --- applyPreset ---
	applyPreset(preset: SynthPresetV1) {
		if (
			typeof preset !== "object" ||
			preset === null ||
			preset.schemaVersion !== 1 ||
			typeof preset.params !== "object" ||
			preset.params === null ||
			typeof preset.params.line1 !== "object" ||
			preset.params.line1 === null ||
			typeof preset.params.line2 !== "object" ||
			preset.params.line2 === null
		) {
			return;
		}
		const p = preset.params;
		const safe = (v: unknown, fallback: number) =>
			typeof v === "number" && !Number.isNaN(v) ? v : fallback;

		const line1PrimaryAlgo = toAlgoRefV1(
			p.line1?.algo ?? DEFAULT_ALGO_REF,
			DEFAULT_ALGO_REF,
		);
		const line2PrimaryAlgo = toAlgoRefV1(
			p.line2?.algo ?? DEFAULT_ALGO_REF,
			DEFAULT_ALGO_REF,
		);
		const line1SecondaryAlgo =
			p.line1?.algo2 == null
				? null
				: toAlgoRefV1(p.line1.algo2, DEFAULT_ALGO_REF);
		const line2SecondaryAlgo =
			p.line2?.algo2 == null
				? null
				: toAlgoRefV1(p.line2.algo2, DEFAULT_ALGO_REF);

		set({
			warpAAmount: safe(p.line1?.dcwBase, 0),
			warpBAmount: safe(p.line2?.dcwBase, 0),
			warpAAlgo: line1PrimaryAlgo,
			warpBAlgo: line2PrimaryAlgo,
			algo2A: line1SecondaryAlgo,
			algo2B: line2SecondaryAlgo,
			algoBlendA: safe(p.line1?.algoBlend, 0),
			algoBlendB: safe(p.line2?.algoBlend, 0),
			windowType: (p.line1?.window as WindowType) ?? "off",
			volume: safe(p.volume, 1),
			line1Level: safe(p.line1?.dcaBase, 1),
			line2Level: safe(p.line2?.dcaBase, 1),
			line1Octave: safe(p.line1?.octave, 0),
			line2Octave: safe(p.line2?.octave, 0),
			line1Detune: safe(p.line1?.detuneCents, 0),
			line2Detune: safe(p.line2?.detuneCents, 0),
			line1DcoEnv: p.line1?.dcoEnv ?? DEFAULT_DCO_ENV,
			line1DcwEnv: p.line1?.dcwEnv ?? DEFAULT_DCW_ENV,
			line1DcaEnv: p.line1?.dcaEnv ?? DEFAULT_DCA_ENV,
			line1CzSlotAWaveform: inferCzWaveform(p.line1?.cz?.slotAWaveform, "saw"),
			line1CzSlotBWaveform: inferCzWaveform(p.line1?.cz?.slotBWaveform, "saw"),
			line1CzWindow: (p.line1?.cz?.window as WindowType) ?? "off",
			line1AlgoControlsA: normalizeAlgoControls(
				line1PrimaryAlgo,
				p.line1?.algoControlsA ?? [],
			),
			line1AlgoControlsB: line1SecondaryAlgo
				? normalizeAlgoControls(
						line1SecondaryAlgo,
						p.line1?.algoControlsB ?? [],
					)
				: [],
			line2DcoEnv: p.line2?.dcoEnv ?? DEFAULT_DCO_ENV,
			line2DcwEnv: p.line2?.dcwEnv ?? DEFAULT_DCW_ENV,
			line2DcaEnv: p.line2?.dcaEnv ?? DEFAULT_DCA_ENV,
			line2CzSlotAWaveform: inferCzWaveform(p.line2?.cz?.slotAWaveform, "saw"),
			line2CzSlotBWaveform: inferCzWaveform(p.line2?.cz?.slotBWaveform, "saw"),
			line2CzWindow: (p.line2?.cz?.window as WindowType) ?? "off",
			line2AlgoControlsA: normalizeAlgoControls(
				line2PrimaryAlgo,
				p.line2?.algoControlsA ?? [],
			),
			line2AlgoControlsB: line2SecondaryAlgo
				? normalizeAlgoControls(
						line2SecondaryAlgo,
						p.line2?.algoControlsB ?? [],
					)
				: [],
			polyMode: (p.polyMode as PolyMode) ?? "poly8",
			legato: p.legato ?? false,
			lineSelect: (p.lineSelect as LineSelect) ?? "L1+L2",
			modMode: (p.modMode as ModMode) ?? "normal",
			line1BaseWaveformA:
				(p.line1?.baseWaveformA as BaseWaveform) ??
				resolveAlgoDefaultBaseWaveform(line1PrimaryAlgo),
			line1BaseWaveformB:
				(p.line1?.baseWaveformB as BaseWaveform) ??
				resolveAlgoDefaultBaseWaveform(line1SecondaryAlgo ?? line1PrimaryAlgo),
			line2BaseWaveformA:
				(p.line2?.baseWaveformA as BaseWaveform) ??
				resolveAlgoDefaultBaseWaveform(line2PrimaryAlgo),
			line2BaseWaveformB:
				(p.line2?.baseWaveformB as BaseWaveform) ??
				resolveAlgoDefaultBaseWaveform(line2SecondaryAlgo ?? line2PrimaryAlgo),
			line1DcwKeyFollow: safe(p.line1?.keyFollow, 0),
			line2DcwKeyFollow: safe(p.line2?.keyFollow, 0),
			portamentoEnabled: p.portamento?.enabled ?? false,
			portamentoMode: (p.portamento?.mode as PortamentoMode) ?? "rate",
			portamentoRate: safe(
				p.portamento?.rate,
				getEngineParamDefault("portamentoRate", 50),
			),
			portamentoTime: safe(
				p.portamento?.time,
				getEngineParamDefault("portamentoTime", 0.5),
			),
			lfoWaveform: (p.lfo?.waveform as LfoWaveform) ?? "sine",
			lfoRate: safe(p.lfo?.rate, getEngineParamDefault("lfoRate", 5)),
			lfoDepth: safe(p.lfo?.depth, getEngineParamDefault("lfoDepth", 0.2)),
			lfoSymmetry: safe(p.lfo?.symmetry, 0.5),
			lfoRetrigger: p.lfo?.retrigger ?? false,
			lfoOffset: safe(p.lfo?.offset, getEngineParamDefault("lfoOffset", 0)),
			lfo2Waveform: (p.lfo2?.waveform as LfoWaveform) ?? "sine",
			lfo2Rate: safe(p.lfo2?.rate, getEngineParamDefault("lfo2Rate", 5)),
			lfo2Depth: safe(p.lfo2?.depth, getEngineParamDefault("lfo2Depth", 0.2)),
			lfo2Symmetry: safe(p.lfo2?.symmetry, 0.5),
			lfo2Retrigger: p.lfo2?.retrigger ?? false,
			lfo2Offset: safe(p.lfo2?.offset, getEngineParamDefault("lfo2Offset", 0)),
			randomRate: safe(p.random?.rate, 2),
			modEnvAttack: safe(
				p.modEnv?.attack,
				getEngineParamDefault("modEnvAttack", 0.01),
			),
			modEnvDecay: safe(
				p.modEnv?.decay,
				getEngineParamDefault("modEnvDecay", 0.1),
			),
			modEnvSustain: safe(
				p.modEnv?.sustain,
				getEngineParamDefault("modEnvSustain", 0.5),
			),
			modEnvRelease: safe(
				p.modEnv?.release,
				getEngineParamDefault("modEnvRelease", 0.2),
			),
			pitchBendRange: safe(p.pitchBendRange, 2),
			velocityCurve: safe(
				p.velocityCurve,
				getEngineParamDefault("velocityCurve", 0),
			),
			octave: safe(p.octave, 0),
			modMatrix:
				p.modMatrix && typeof p.modMatrix === "object"
					? (p.modMatrix as ModMatrix)
					: { routes: [] },
			fxSlots:
				Array.isArray(p.fxSlots) && p.fxSlots.length === 6
					? (p.fxSlots as FxSlotTuple)
					: DEFAULT_FX_SLOTS,
		});
	},
}));
