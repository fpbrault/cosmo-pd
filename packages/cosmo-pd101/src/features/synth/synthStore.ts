import { create } from "zustand";
import type { MacroAssignment } from "@/features/synth/types/macro";
import {
	buildDefaultAlgoControls,
	DEFAULT_ALGO_REF,
	toAlgoRefV1,
} from "@/lib/synth/algoRef";
import type {
	Algo,
	AlgoControlValueV1,
	AlgoDefinitionV1,
	BaseWaveform,
	FxDefinitionV1,
	FxSlotConfig,
	FxSlotType,
	LfoRateMode,
	LfoSyncDivision,
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
	FX_DEFINITIONS_V1,
} from "@/lib/synth/bindings/synth";
import { requireEngineParamDefault } from "@/lib/synth/paramMeta";
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
	return definition.controls.map((control) => ({
		id: control.id,
		value: incoming.get(control.id) ?? control.default ?? control.min ?? 0,
	}));
}

function toIntegerInRange(value: number, min: number, max: number): number {
	return Math.max(min, Math.min(max, Math.round(value)));
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
	/** Shared OCT knob — sets octave for both lines. */
	lineOctave: number;
	line2DetuneOctave: number;
	line2DetuneNote: number;
	line2DetuneFine: number;
	line1DcwKeyFollow: number;
	line1DcoEnv: StepEnvData;
	line1DcwEnv: StepEnvData;
	line1DcaEnv: StepEnvData;
	line1AlgoControlsA: AlgoControlValueV1[];
	line1AlgoControlsB: AlgoControlValueV1[];
	line1BaseWaveformA: BaseWaveform;
	line1BaseWaveformB: BaseWaveform;

	line2Level: number;
	line2DcwKeyFollow: number;
	line2DcoEnv: StepEnvData;
	line2DcwEnv: StepEnvData;
	line2DcaEnv: StepEnvData;
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
	tempoBpm: number;

	lfoWaveform: LfoWaveform;
	lfoRate: number;
	lfoRateMode: LfoRateMode;
	lfoSyncDivision: LfoSyncDivision;
	lfoDepth: number;
	lfoSymmetry: number;
	lfoRetrigger: boolean;
	lfoOffset: number;
	lfo2Waveform: LfoWaveform;
	lfo2Rate: number;
	lfo2RateMode: LfoRateMode;
	lfo2SyncDivision: LfoSyncDivision;
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

	macro1: number;
	macro2: number;
	macro3: number;
	macro4: number;
	macroAssignments: MacroAssignment[];
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
	setLineOctave: (v: number) => void;
	setLine2DetuneOctave: (v: number) => void;
	setLine2DetuneNote: (v: number) => void;
	setLine2DetuneFine: (v: number) => void;
	setLine1DcwKeyFollow: (v: number) => void;
	setLine1DcoEnv: (v: StepEnvData) => void;
	setLine1DcwEnv: (v: StepEnvData) => void;
	setLine1DcaEnv: (v: StepEnvData) => void;
	setLine1AlgoControlsA: (v: AlgoControlValueV1[]) => void;
	setLine1AlgoControlsB: (v: AlgoControlValueV1[]) => void;
	setLine1BaseWaveformA: (v: BaseWaveform) => void;
	setLine1BaseWaveformB: (v: BaseWaveform) => void;

	setLine2Level: (v: number) => void;
	setLine2DcwKeyFollow: (v: number) => void;
	setLine2DcoEnv: (v: StepEnvData) => void;
	setLine2DcwEnv: (v: StepEnvData) => void;
	setLine2DcaEnv: (v: StepEnvData) => void;
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
	setTempoBpm: (v: number) => void;

	setLfoWaveform: (v: LfoWaveform) => void;
	setLfoRate: (v: number) => void;
	setLfoRateMode: (v: LfoRateMode) => void;
	setLfoSyncDivision: (v: LfoSyncDivision) => void;
	setLfoDepth: (v: number) => void;
	setLfoSymmetry: (v: number) => void;
	setLfoRetrigger: (v: boolean) => void;
	setLfoOffset: (v: number) => void;
	setLfo2Waveform: (v: LfoWaveform) => void;
	setLfo2Rate: (v: number) => void;
	setLfo2RateMode: (v: LfoRateMode) => void;
	setLfo2SyncDivision: (v: LfoSyncDivision) => void;
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

	setMacro1: (v: number) => void;
	setMacro2: (v: number) => void;
	setMacro3: (v: number) => void;
	setMacro4: (v: number) => void;
	setMacroAssignments: (v: MacroAssignment[]) => void;

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
	lineOctave: 0,
	line2DetuneOctave: 0,
	line2DetuneNote: 0,
	line2DetuneFine: 0,
	line1DcwKeyFollow: 0,
	line1DcoEnv: DEFAULT_DCO_ENV,
	line1DcwEnv: DEFAULT_DCW_ENV,
	line1DcaEnv: DEFAULT_DCA_ENV,
	line1AlgoControlsA: buildDefaultAlgoControls("cz101"),
	line1AlgoControlsB: [],
	line1BaseWaveformA: "cosine",
	line1BaseWaveformB: "cosine",

	line2Level: 1,
	line2DcwKeyFollow: 0,
	line2DcoEnv: DEFAULT_DCO_ENV,
	line2DcwEnv: DEFAULT_DCW_ENV,
	line2DcaEnv: DEFAULT_DCA_ENV,
	line2AlgoControlsA: buildDefaultAlgoControls("cz101"),
	line2AlgoControlsB: [],
	line2BaseWaveformA: "cosine",
	line2BaseWaveformB: "cosine",

	lineSelect: "L1+L2'",
	modMode: "normal",

	polyMode: "poly8",
	legato: false,
	velocityCurve: requireEngineParamDefault("velocityCurve"),

	portamentoEnabled: false,
	portamentoMode: "time",
	portamentoRate: requireEngineParamDefault("portamentoRate"),
	portamentoTime: requireEngineParamDefault("portamentoTime"),
	tempoBpm: requireEngineParamDefault("tempoBpm"),

	lfoWaveform: "sine",
	lfoRate: requireEngineParamDefault("lfoRate"),
	lfoRateMode: "hz",
	lfoSyncDivision: "quarter",
	lfoDepth: requireEngineParamDefault("lfoDepth"),
	lfoSymmetry: 0.5,
	lfoRetrigger: false,
	lfoOffset: requireEngineParamDefault("lfoOffset"),
	lfo2Waveform: "sine",
	lfo2Rate: requireEngineParamDefault("lfo2Rate"),
	lfo2RateMode: "hz",
	lfo2SyncDivision: "quarter",
	lfo2Depth: requireEngineParamDefault("lfo2Depth"),
	lfo2Symmetry: 0.5,
	lfo2Retrigger: false,
	lfo2Offset: requireEngineParamDefault("lfo2Offset"),

	randomRate: requireEngineParamDefault("randomRate"),

	modEnvAttack: requireEngineParamDefault("modEnvAttack"),
	modEnvDecay: requireEngineParamDefault("modEnvDecay"),
	modEnvSustain: requireEngineParamDefault("modEnvSustain"),
	modEnvRelease: requireEngineParamDefault("modEnvRelease"),

	pitchBendRange: requireEngineParamDefault("pitchBendRange"),
	octave: 0,
	modMatrix: { routes: [] },
	fxSlots: DEFAULT_FX_SLOTS,

	macro1: 0,
	macro2: 0,
	macro3: 0,
	macro4: 0,
	macroAssignments: [],
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
	setLineOctave: (v) => set({ lineOctave: toIntegerInRange(v, -2, 2) }),
	setLine2DetuneOctave: (v) =>
		set({ line2DetuneOctave: toIntegerInRange(v, -3, 3) }),
	setLine2DetuneNote: (v) =>
		set({ line2DetuneNote: toIntegerInRange(v, -11, 11) }),
	setLine2DetuneFine: (v) =>
		set({ line2DetuneFine: toIntegerInRange(v, -60, 60) }),
	setLine1DcwKeyFollow: (v) => set({ line1DcwKeyFollow: v }),
	setLine1DcoEnv: (v) => set({ line1DcoEnv: v }),
	setLine1DcwEnv: (v) => set({ line1DcwEnv: v }),
	setLine1DcaEnv: (v) => set({ line1DcaEnv: v }),
	setLine1AlgoControlsA: (v) => set({ line1AlgoControlsA: v }),
	setLine1AlgoControlsB: (v) => set({ line1AlgoControlsB: v }),
	setLine1BaseWaveformA: (v) => set({ line1BaseWaveformA: v }),
	setLine1BaseWaveformB: (v) => set({ line1BaseWaveformB: v }),

	setLine2Level: (v) => set({ line2Level: v }),
	setLine2DcwKeyFollow: (v) => set({ line2DcwKeyFollow: v }),
	setLine2DcoEnv: (v) => set({ line2DcoEnv: v }),
	setLine2DcwEnv: (v) => set({ line2DcwEnv: v }),
	setLine2DcaEnv: (v) => set({ line2DcaEnv: v }),
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
	setTempoBpm: (v) => set({ tempoBpm: v }),

	setLfoWaveform: (v) => set({ lfoWaveform: v }),
	setLfoRate: (v) => set({ lfoRate: v }),
	setLfoRateMode: (v) => set({ lfoRateMode: v }),
	setLfoSyncDivision: (v) => set({ lfoSyncDivision: v }),
	setLfoDepth: (v) => set({ lfoDepth: v }),
	setLfoSymmetry: (v) => set({ lfoSymmetry: v }),
	setLfoRetrigger: (v) => set({ lfoRetrigger: v }),
	setLfoOffset: (v) => set({ lfoOffset: v }),
	setLfo2Waveform: (v) => set({ lfo2Waveform: v }),
	setLfo2Rate: (v) => set({ lfo2Rate: v }),
	setLfo2RateMode: (v) => set({ lfo2RateMode: v }),
	setLfo2SyncDivision: (v) => set({ lfo2SyncDivision: v }),
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
	setOctave: (v) => set({ octave: toIntegerInRange(v, -2, 2) }),
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

	setMacro1: (v) => set({ macro1: v }),
	setMacro2: (v) => set({ macro2: v }),
	setMacro3: (v) => set({ macro3: v }),
	setMacro4: (v) => set({ macro4: v }),
	setMacroAssignments: (v) => set({ macroAssignments: v }),

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
		const line2DetuneEnabled = s.lineSelect !== "L1" && s.lineSelect !== "L2";

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
				detuneNote: 0,
				detuneFine: 0,
				octave: s.lineOctave,
				dcoEnv: s.line1DcoEnv,
				dcwEnv: s.line1DcwEnv,
				dcaEnv: s.line1DcaEnv,
				keyFollow: s.line1DcwKeyFollow,
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
				detuneNote: line2DetuneEnabled ? s.line2DetuneNote : 0,
				detuneFine: line2DetuneEnabled ? s.line2DetuneFine : 0,
				octave: s.lineOctave + (line2DetuneEnabled ? s.line2DetuneOctave : 0),
				dcoEnv: s.line2DcoEnv,
				dcwEnv: s.line2DcwEnv,
				dcaEnv: s.line2DcaEnv,
				keyFollow: s.line2DcwKeyFollow,
				algoControlsA: line2NormalizedAlgoControlsA,
				algoControlsB: line2NormalizedAlgoControlsB,
			},
			frequency: 440,
			volume: s.volume,
			tempoBpm: s.tempoBpm,
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
				rateMode: s.lfoRateMode,
				syncDivision: s.lfoSyncDivision,
				depth: s.lfoDepth,
				symmetry: s.lfoSymmetry,
				retrigger: s.lfoRetrigger,
				offset: s.lfoOffset,
			},
			lfo2: {
				waveform: s.lfo2Waveform,
				rate: s.lfo2Rate,
				rateMode: s.lfo2RateMode,
				syncDivision: s.lfo2SyncDivision,
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
			macro1: s.macro1,
			macro2: s.macro2,
			macro3: s.macro3,
			macro4: s.macro4,
			macroAssignments: s.macroAssignments,
		} as SynthPresetV1["params"];

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
			lineOctave: safe(p.line1?.octave, 0),
			line2DetuneOctave: safe(p.line2?.octave, 0) - safe(p.line1?.octave, 0),
			line2DetuneNote: safe(p.line2?.detuneNote, 0),
			line2DetuneFine: safe(
				p.line2?.detuneFine ??
					Math.round(
						(((p.line2 as unknown as Record<string, number> | undefined)
							?.detuneCents ?? 0) *
							60) /
							100,
					),
				0,
			),
			line1DcoEnv: p.line1?.dcoEnv ?? DEFAULT_DCO_ENV,
			line1DcwEnv: p.line1?.dcwEnv ?? DEFAULT_DCW_ENV,
			line1DcaEnv: p.line1?.dcaEnv ?? DEFAULT_DCA_ENV,
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
			lineSelect: (p.lineSelect as LineSelect) ?? "L1+L2'",
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
				requireEngineParamDefault("portamentoRate"),
			),
			portamentoTime: safe(
				p.portamento?.time,
				requireEngineParamDefault("portamentoTime"),
			),
			tempoBpm: safe(p.tempoBpm, requireEngineParamDefault("tempoBpm")),
			lfoWaveform: (p.lfo?.waveform as LfoWaveform) ?? "sine",
			lfoRate: safe(p.lfo?.rate, requireEngineParamDefault("lfoRate")),
			lfoRateMode: (p.lfo?.rateMode as LfoRateMode) ?? "hz",
			lfoSyncDivision: (p.lfo?.syncDivision as LfoSyncDivision) ?? "quarter",
			lfoDepth: safe(p.lfo?.depth, requireEngineParamDefault("lfoDepth")),
			lfoSymmetry: safe(p.lfo?.symmetry, 0.5),
			lfoRetrigger: p.lfo?.retrigger ?? false,
			lfoOffset: safe(p.lfo?.offset, requireEngineParamDefault("lfoOffset")),
			lfo2Waveform: (p.lfo2?.waveform as LfoWaveform) ?? "sine",
			lfo2Rate: safe(p.lfo2?.rate, requireEngineParamDefault("lfo2Rate")),
			lfo2RateMode: (p.lfo2?.rateMode as LfoRateMode) ?? "hz",
			lfo2SyncDivision: (p.lfo2?.syncDivision as LfoSyncDivision) ?? "quarter",
			lfo2Depth: safe(p.lfo2?.depth, requireEngineParamDefault("lfo2Depth")),
			lfo2Symmetry: safe(p.lfo2?.symmetry, 0.5),
			lfo2Retrigger: p.lfo2?.retrigger ?? false,
			lfo2Offset: safe(p.lfo2?.offset, requireEngineParamDefault("lfo2Offset")),
			randomRate: safe(p.random?.rate, requireEngineParamDefault("randomRate")),
			modEnvAttack: safe(
				p.modEnv?.attack,
				requireEngineParamDefault("modEnvAttack"),
			),
			modEnvDecay: safe(
				p.modEnv?.decay,
				requireEngineParamDefault("modEnvDecay"),
			),
			modEnvSustain: safe(
				p.modEnv?.sustain,
				requireEngineParamDefault("modEnvSustain"),
			),
			modEnvRelease: safe(
				p.modEnv?.release,
				requireEngineParamDefault("modEnvRelease"),
			),
			pitchBendRange: safe(
				p.pitchBendRange,
				requireEngineParamDefault("pitchBendRange"),
			),
			velocityCurve: safe(
				p.velocityCurve,
				requireEngineParamDefault("velocityCurve"),
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
			macro1: safe((p as Record<string, unknown>).macro1 as number, 0),
			macro2: safe((p as Record<string, unknown>).macro2 as number, 0),
			macro3: safe((p as Record<string, unknown>).macro3 as number, 0),
			macro4: safe((p as Record<string, unknown>).macro4 as number, 0),
			macroAssignments: Array.isArray(
				(p as Record<string, unknown>).macroAssignments,
			)
				? ((p as Record<string, unknown>).macroAssignments as MacroAssignment[])
				: [],
		});
	},
}));
