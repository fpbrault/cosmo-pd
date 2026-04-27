import { create } from "zustand";
import {
	DEFAULT_ALGO_REF,
	legacyCzAlgoToWaveform,
	normalizeWaveformId,
	toAlgoRefV1,
} from "@/lib/synth/algoRef";
import type {
	Algo,
	AlgoControlValueV1,
	BitcrusherParams,
	ChorusParams,
	CompressorParams,
	CzWaveform,
	DelayParams,
	DistortionParams,
	EqParams,
	FilterType,
	FxSlotType,
	GrainDelayParams,
	JunoChorusParams,
	LfoWaveform,
	LineSelect,
	ModMatrix,
	ModMode,
	PhaserParams,
	PolyMode,
	PortamentoMode,
	ReverbParams,
	RingModParams,
	ShimmerVerbParams,
	StepEnvData,
	SynthPresetV1,
	TremoloParams,
	WavefolderParams,
	WindowType,
} from "@/lib/synth/bindings/synth";
import { ALGO_DEFINITIONS_V1 } from "@/lib/synth/bindings/synth";
import {
	DEFAULT_DCA_ENV,
	DEFAULT_DCO_ENV,
	DEFAULT_DCW_ENV,
} from "@/lib/synth/pdAlgorithms";

// ---------------------------------------------------------------------------
// Helpers (identical to the ones that were in useSynthState)
// ---------------------------------------------------------------------------

type AlgoControlRuntime = {
	id: string;
	kind?: "number" | "select" | "toggle";
	default?: number | null;
	min?: number | null;
};

type AlgoDefinitionRuntime = {
	id: Algo;
	controls: AlgoControlRuntime[];
};

function normalizeAlgoControls(
	algo: Algo,
	values: AlgoControlValueV1[] | null | undefined,
): AlgoControlValueV1[] {
	const definitions = ALGO_DEFINITIONS_V1 as unknown as AlgoDefinitionRuntime[];
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
	algoValue: unknown,
	explicitWaveform: unknown,
	fallback: CzWaveform,
): CzWaveform {
	if (typeof explicitWaveform === "string") {
		return normalizeWaveformId(explicitWaveform);
	}
	if (typeof algoValue === "string") {
		const legacyWaveform = legacyCzAlgoToWaveform(algoValue);
		if (legacyWaveform) return legacyWaveform;
		return normalizeWaveformId(algoValue);
	}
	return fallback;
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

	intPmAmount: number;
	intPmRatio: number;
	pmPre: boolean;
	phaseModEnabled: boolean;

	windowType: WindowType;
	volume: number;

	line1Level: number;
	line1Octave: number;
	line1Detune: number;
	line1DcwKeyFollow: number;
	line1DcaKeyFollow: number;
	line1DcoEnv: StepEnvData;
	line1DcwEnv: StepEnvData;
	line1DcaEnv: StepEnvData;
	line1CzSlotAWaveform: CzWaveform;
	line1CzSlotBWaveform: CzWaveform;
	line1CzWindow: WindowType;
	line1AlgoControlsA: AlgoControlValueV1[];
	line1AlgoControlsB: AlgoControlValueV1[];

	line2Level: number;
	line2Octave: number;
	line2Detune: number;
	line2DcwKeyFollow: number;
	line2DcaKeyFollow: number;
	line2DcoEnv: StepEnvData;
	line2DcwEnv: StepEnvData;
	line2DcaEnv: StepEnvData;
	line2CzSlotAWaveform: CzWaveform;
	line2CzSlotBWaveform: CzWaveform;
	line2CzWindow: WindowType;
	line2AlgoControlsA: AlgoControlValueV1[];
	line2AlgoControlsB: AlgoControlValueV1[];

	lineSelect: LineSelect;
	modMode: ModMode;

	polyMode: PolyMode;
	legato: boolean;
	velocityCurve: number;

	chorusEnabled: boolean;
	chorusRate: number;
	chorusDepth: number;
	chorusMix: number;

	delayEnabled: boolean;
	delayTime: number;
	delayFeedback: number;
	delayMix: number;
	delayTapeMode: boolean;
	delayWarmth: number;

	reverbEnabled: boolean;
	reverbMix: number;
	reverbSpace: number;
	reverbPredelay: number;
	reverbDistance: number;
	reverbCharacter: number;

	phaserEnabled: boolean;
	phaserRate: number;
	phaserDepth: number;
	phaserMix: number;
	phaserFeedback: number;

	vibratoEnabled: boolean;
	vibratoWave: number;
	vibratoRate: number;
	vibratoDepth: number;
	vibratoDelay: number;

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

	filterEnabled: boolean;
	filterType: FilterType;
	filterCutoff: number;
	filterResonance: number;
	filterEnvAmount: number;

	pitchBendRange: number;
	modWheelVibratoDepth: number;
	octave: number;
	modMatrix: ModMatrix;
	fxSlotTypes: [
		FxSlotType,
		FxSlotType,
		FxSlotType,
		FxSlotType,
		FxSlotType,
		FxSlotType,
	];
	fxSlotChoruses: [
		ChorusParams,
		ChorusParams,
		ChorusParams,
		ChorusParams,
		ChorusParams,
		ChorusParams,
	];
	fxSlotDelays: [
		DelayParams,
		DelayParams,
		DelayParams,
		DelayParams,
		DelayParams,
		DelayParams,
	];
	fxSlotReverbs: [
		ReverbParams,
		ReverbParams,
		ReverbParams,
		ReverbParams,
		ReverbParams,
		ReverbParams,
	];
	fxSlotPhasers: [
		PhaserParams,
		PhaserParams,
		PhaserParams,
		PhaserParams,
		PhaserParams,
		PhaserParams,
	];
	fxSlotCompressors: [CompressorParams, CompressorParams, CompressorParams, CompressorParams, CompressorParams, CompressorParams];
	fxSlotEqs: [EqParams, EqParams, EqParams, EqParams, EqParams, EqParams];
	fxSlotGrainDelays: [GrainDelayParams, GrainDelayParams, GrainDelayParams, GrainDelayParams, GrainDelayParams, GrainDelayParams];
	fxSlotBitcrushers: [BitcrusherParams, BitcrusherParams, BitcrusherParams, BitcrusherParams, BitcrusherParams, BitcrusherParams];
	fxSlotShimmerVerbs: [ShimmerVerbParams, ShimmerVerbParams, ShimmerVerbParams, ShimmerVerbParams, ShimmerVerbParams, ShimmerVerbParams];
	fxSlotDistortions: [DistortionParams, DistortionParams, DistortionParams, DistortionParams, DistortionParams, DistortionParams];
	fxSlotJunoChoruses: [JunoChorusParams, JunoChorusParams, JunoChorusParams, JunoChorusParams, JunoChorusParams, JunoChorusParams];
	fxSlotRingMods: [RingModParams, RingModParams, RingModParams, RingModParams, RingModParams, RingModParams];
	fxSlotTremolos: [TremoloParams, TremoloParams, TremoloParams, TremoloParams, TremoloParams, TremoloParams];
	fxSlotWavefolders: [WavefolderParams, WavefolderParams, WavefolderParams, WavefolderParams, WavefolderParams, WavefolderParams];
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

	setIntPmAmount: (v: number) => void;
	setIntPmRatio: (v: number) => void;
	setPmPre: (v: boolean) => void;
	setPhaseModEnabled: (v: boolean) => void;

	setWindowType: (v: WindowType) => void;
	setVolume: (v: number) => void;

	setLine1Level: (v: number) => void;
	setLine1Octave: (v: number) => void;
	setLine1Detune: (v: number) => void;
	setLine1DcwKeyFollow: (v: number) => void;
	setLine1DcaKeyFollow: (v: number) => void;
	setLine1DcoEnv: (v: StepEnvData) => void;
	setLine1DcwEnv: (v: StepEnvData) => void;
	setLine1DcaEnv: (v: StepEnvData) => void;
	setLine1CzSlotAWaveform: (v: CzWaveform) => void;
	setLine1CzSlotBWaveform: (v: CzWaveform) => void;
	setLine1CzWindow: (v: WindowType) => void;
	setLine1AlgoControlsA: (v: AlgoControlValueV1[]) => void;
	setLine1AlgoControlsB: (v: AlgoControlValueV1[]) => void;

	setLine2Level: (v: number) => void;
	setLine2Octave: (v: number) => void;
	setLine2Detune: (v: number) => void;
	setLine2DcwKeyFollow: (v: number) => void;
	setLine2DcaKeyFollow: (v: number) => void;
	setLine2DcoEnv: (v: StepEnvData) => void;
	setLine2DcwEnv: (v: StepEnvData) => void;
	setLine2DcaEnv: (v: StepEnvData) => void;
	setLine2CzSlotAWaveform: (v: CzWaveform) => void;
	setLine2CzSlotBWaveform: (v: CzWaveform) => void;
	setLine2CzWindow: (v: WindowType) => void;
	setLine2AlgoControlsA: (v: AlgoControlValueV1[]) => void;
	setLine2AlgoControlsB: (v: AlgoControlValueV1[]) => void;

	setLineSelect: (v: LineSelect) => void;
	setModMode: (v: ModMode) => void;

	setPolyMode: (v: PolyMode) => void;
	setLegato: (v: boolean) => void;
	setVelocityCurve: (v: number) => void;

	setChorusEnabled: (v: boolean) => void;
	setChorusRate: (v: number) => void;
	setChorusDepth: (v: number) => void;
	setChorusMix: (v: number) => void;

	setDelayEnabled: (v: boolean) => void;
	setDelayTime: (v: number) => void;
	setDelayFeedback: (v: number) => void;
	setDelayMix: (v: number) => void;
	setDelayTapeMode: (v: boolean) => void;
	setDelayWarmth: (v: number) => void;

	setReverbEnabled: (v: boolean) => void;
	setReverbMix: (v: number) => void;
	setReverbSpace: (v: number) => void;
	setReverbPredelay: (v: number) => void;
	setReverbDistance: (v: number) => void;
	setReverbCharacter: (v: number) => void;

	setPhaserEnabled: (v: boolean) => void;
	setPhaserRate: (v: number) => void;
	setPhaserDepth: (v: number) => void;
	setPhaserMix: (v: number) => void;
	setPhaserFeedback: (v: number) => void;

	setVibratoEnabled: (v: boolean) => void;
	setVibratoWave: (v: number) => void;
	setVibratoRate: (v: number) => void;
	setVibratoDepth: (v: number) => void;
	setVibratoDelay: (v: number) => void;

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

	setFilterEnabled: (v: boolean) => void;
	setFilterType: (v: FilterType) => void;
	setFilterCutoff: (v: number) => void;
	setFilterResonance: (v: number) => void;
	setFilterEnvAmount: (v: number) => void;

	setPitchBendRange: (v: number) => void;
	setModWheelVibratoDepth: (v: number) => void;
	setOctave: (v: number) => void;
	setModMatrix: (v: ModMatrix) => void;
	setFxSlotArrayValue: <K extends FxSlotArrayKey>(
		key: K,
		slot: number,
		value: SynthState[K][number],
	) => void;
	setFxSlotType: (slot: number, type: FxSlotType) => void;
	setFxSlotChorus: (slot: number, v: ChorusParams) => void;
	setFxSlotDelay: (slot: number, v: DelayParams) => void;
	setFxSlotReverb: (slot: number, v: ReverbParams) => void;
	setFxSlotPhaser: (slot: number, v: PhaserParams) => void;
	setFxSlotCompressor: (slot: number, v: CompressorParams) => void;
	setFxSlotEq: (slot: number, v: EqParams) => void;
	setFxSlotGrainDelay: (slot: number, v: GrainDelayParams) => void;
	setFxSlotBitcrusher: (slot: number, v: BitcrusherParams) => void;
	setFxSlotShimmerVerb: (slot: number, v: ShimmerVerbParams) => void;
	setFxSlotDistortion: (slot: number, v: DistortionParams) => void;
	setFxSlotJunoChorus: (slot: number, v: JunoChorusParams) => void;
	setFxSlotRingMod: (slot: number, v: RingModParams) => void;
	setFxSlotTremolo: (slot: number, v: TremoloParams) => void;
	setFxSlotWavefolder: (slot: number, v: WavefolderParams) => void;
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

	intPmAmount: 0,
	intPmRatio: 1,
	pmPre: true,
	phaseModEnabled: false,

	windowType: "off",
	volume: 1,

	line1Level: 1,
	line1Octave: 0,
	line1Detune: 0,
	line1DcwKeyFollow: 0,
	line1DcaKeyFollow: 0,
	line1DcoEnv: DEFAULT_DCO_ENV,
	line1DcwEnv: DEFAULT_DCW_ENV,
	line1DcaEnv: DEFAULT_DCA_ENV,
	line1CzSlotAWaveform: "saw",
	line1CzSlotBWaveform: "saw",
	line1CzWindow: "off",
	line1AlgoControlsA: [],
	line1AlgoControlsB: [],

	line2Level: 1,
	line2Octave: 0,
	line2Detune: 0,
	line2DcwKeyFollow: 0,
	line2DcaKeyFollow: 0,
	line2DcoEnv: DEFAULT_DCO_ENV,
	line2DcwEnv: DEFAULT_DCW_ENV,
	line2DcaEnv: DEFAULT_DCA_ENV,
	line2CzSlotAWaveform: "saw",
	line2CzSlotBWaveform: "saw",
	line2CzWindow: "off",
	line2AlgoControlsA: [],
	line2AlgoControlsB: [],

	lineSelect: "L1+L2",
	modMode: "normal",

	polyMode: "poly8",
	legato: false,
	velocityCurve: 0,

	chorusEnabled: false,
	chorusRate: 0.8,
	chorusDepth: 3,
	chorusMix: 0,

	delayEnabled: false,
	delayTime: 0.3,
	delayFeedback: 0.35,
	delayMix: 0,
	delayTapeMode: false,
	delayWarmth: 0.5,

	reverbEnabled: false,
	reverbMix: 0,
	reverbSpace: 0.5,
	reverbPredelay: 0,
	reverbDistance: 0.3,
	reverbCharacter: 0.65,

	phaserEnabled: false,
	phaserRate: 0.5,
	phaserDepth: 1,
	phaserMix: 0,
	phaserFeedback: 0.5,

	vibratoEnabled: false,
	vibratoWave: 1,
	vibratoRate: 55,
	vibratoDepth: 8,
	vibratoDelay: 120,

	portamentoEnabled: false,
	portamentoMode: "rate",
	portamentoRate: 50,
	portamentoTime: 0.5,

	lfoWaveform: "sine",
	lfoRate: 5,
	lfoDepth: 0.2,
	lfoSymmetry: 0.5,
	lfoRetrigger: false,
	lfoOffset: 0,
	lfo2Waveform: "sine",
	lfo2Rate: 5,
	lfo2Depth: 0.2,
	lfo2Symmetry: 0.5,
	lfo2Retrigger: false,
	lfo2Offset: 0,

	randomRate: 2,

	modEnvAttack: 0.01,
	modEnvDecay: 0.1,
	modEnvSustain: 0.5,
	modEnvRelease: 0.2,

	filterEnabled: false,
	filterType: "lp",
	filterCutoff: 5000,
	filterResonance: 0,
	filterEnvAmount: 0,

	pitchBendRange: 2,
	modWheelVibratoDepth: 0,
	octave: 0,
	modMatrix: { routes: [] },
	fxSlotTypes: ["chorus", "delay", "reverb", "vibrato", "phaseMod", "phaser"],
	fxSlotChoruses: [
		{ enabled: false, rate: 0.8, depth: 3, mix: 0 },
		{ enabled: false, rate: 0.8, depth: 3, mix: 0 },
		{ enabled: false, rate: 0.8, depth: 3, mix: 0 },
		{ enabled: false, rate: 0.8, depth: 3, mix: 0 },
		{ enabled: false, rate: 0.8, depth: 3, mix: 0 },
		{ enabled: false, rate: 0.8, depth: 3, mix: 0 },
	],
	fxSlotDelays: [
		{
			enabled: false,
			time: 0.3,
			feedback: 0.35,
			mix: 0,
			tapeMode: false,
			warmth: 0.5,
		},
		{
			enabled: false,
			time: 0.3,
			feedback: 0.35,
			mix: 0,
			tapeMode: false,
			warmth: 0.5,
		},
		{
			enabled: false,
			time: 0.3,
			feedback: 0.35,
			mix: 0,
			tapeMode: false,
			warmth: 0.5,
		},
		{
			enabled: false,
			time: 0.3,
			feedback: 0.35,
			mix: 0,
			tapeMode: false,
			warmth: 0.5,
		},
		{
			enabled: false,
			time: 0.3,
			feedback: 0.35,
			mix: 0,
			tapeMode: false,
			warmth: 0.5,
		},
		{
			enabled: false,
			time: 0.3,
			feedback: 0.35,
			mix: 0,
			tapeMode: false,
			warmth: 0.5,
		},
	],
	fxSlotReverbs: [
		{
			enabled: false,
			mix: 0,
			space: 0.5,
			predelay: 0,
			distance: 0.3,
			character: 0.65,
		},
		{
			enabled: false,
			mix: 0,
			space: 0.5,
			predelay: 0,
			distance: 0.3,
			character: 0.65,
		},
		{
			enabled: false,
			mix: 0,
			space: 0.5,
			predelay: 0,
			distance: 0.3,
			character: 0.65,
		},
		{
			enabled: false,
			mix: 0,
			space: 0.5,
			predelay: 0,
			distance: 0.3,
			character: 0.65,
		},
		{
			enabled: false,
			mix: 0,
			space: 0.5,
			predelay: 0,
			distance: 0.3,
			character: 0.65,
		},
		{
			enabled: false,
			mix: 0,
			space: 0.5,
			predelay: 0,
			distance: 0.3,
			character: 0.65,
		},
	],
	fxSlotPhasers: [
		{ enabled: false, rate: 0.5, depth: 1, mix: 0, feedback: 0.5 },
		{ enabled: false, rate: 0.5, depth: 1, mix: 0, feedback: 0.5 },
		{ enabled: false, rate: 0.5, depth: 1, mix: 0, feedback: 0.5 },
		{ enabled: false, rate: 0.5, depth: 1, mix: 0, feedback: 0.5 },
		{ enabled: false, rate: 0.5, depth: 1, mix: 0, feedback: 0.5 },
		{ enabled: false, rate: 0.5, depth: 1, mix: 0, feedback: 0.5 },
	],
	fxSlotCompressors: [
		{ enabled: false, thresholdDb: -12, ratio: 4, attackMs: 5, releaseMs: 100, makeupDb: 6, mix: 1 },
		{ enabled: false, thresholdDb: -12, ratio: 4, attackMs: 5, releaseMs: 100, makeupDb: 6, mix: 1 },
		{ enabled: false, thresholdDb: -12, ratio: 4, attackMs: 5, releaseMs: 100, makeupDb: 6, mix: 1 },
		{ enabled: false, thresholdDb: -12, ratio: 4, attackMs: 5, releaseMs: 100, makeupDb: 6, mix: 1 },
		{ enabled: false, thresholdDb: -12, ratio: 4, attackMs: 5, releaseMs: 100, makeupDb: 6, mix: 1 },
		{ enabled: false, thresholdDb: -12, ratio: 4, attackMs: 5, releaseMs: 100, makeupDb: 6, mix: 1 },
	],
	fxSlotEqs: [
		{ enabled: false, gain80: 0, gain240: 0, gain750: 0, gain2200: 0, gain8000: 0 },
		{ enabled: false, gain80: 0, gain240: 0, gain750: 0, gain2200: 0, gain8000: 0 },
		{ enabled: false, gain80: 0, gain240: 0, gain750: 0, gain2200: 0, gain8000: 0 },
		{ enabled: false, gain80: 0, gain240: 0, gain750: 0, gain2200: 0, gain8000: 0 },
		{ enabled: false, gain80: 0, gain240: 0, gain750: 0, gain2200: 0, gain8000: 0 },
		{ enabled: false, gain80: 0, gain240: 0, gain750: 0, gain2200: 0, gain8000: 0 },
	],
	fxSlotGrainDelays: [
		{ enabled: false, time: 0.25, scatter: 0, density: 0.5, mix: 0 },
		{ enabled: false, time: 0.25, scatter: 0, density: 0.5, mix: 0 },
		{ enabled: false, time: 0.25, scatter: 0, density: 0.5, mix: 0 },
		{ enabled: false, time: 0.25, scatter: 0, density: 0.5, mix: 0 },
		{ enabled: false, time: 0.25, scatter: 0, density: 0.5, mix: 0 },
		{ enabled: false, time: 0.25, scatter: 0, density: 0.5, mix: 0 },
	],
	fxSlotBitcrushers: [
		{ enabled: false, bits: 8, rateReduction: 1, mix: 1 },
		{ enabled: false, bits: 8, rateReduction: 1, mix: 1 },
		{ enabled: false, bits: 8, rateReduction: 1, mix: 1 },
		{ enabled: false, bits: 8, rateReduction: 1, mix: 1 },
		{ enabled: false, bits: 8, rateReduction: 1, mix: 1 },
		{ enabled: false, bits: 8, rateReduction: 1, mix: 1 },
	],
	fxSlotShimmerVerbs: [
		{ enabled: false, shimmer: 0.4, space: 0.7, mix: 0 },
		{ enabled: false, shimmer: 0.4, space: 0.7, mix: 0 },
		{ enabled: false, shimmer: 0.4, space: 0.7, mix: 0 },
		{ enabled: false, shimmer: 0.4, space: 0.7, mix: 0 },
		{ enabled: false, shimmer: 0.4, space: 0.7, mix: 0 },
		{ enabled: false, shimmer: 0.4, space: 0.7, mix: 0 },
	],
	fxSlotDistortions: [
		{ enabled: false, drive: 0.5, tone: 0.5, mix: 1 },
		{ enabled: false, drive: 0.5, tone: 0.5, mix: 1 },
		{ enabled: false, drive: 0.5, tone: 0.5, mix: 1 },
		{ enabled: false, drive: 0.5, tone: 0.5, mix: 1 },
		{ enabled: false, drive: 0.5, tone: 0.5, mix: 1 },
		{ enabled: false, drive: 0.5, tone: 0.5, mix: 1 },
	],
	fxSlotJunoChoruses: [
		{ enabled: false, mode: 0, mix: 0.5 },
		{ enabled: false, mode: 0, mix: 0.5 },
		{ enabled: false, mode: 0, mix: 0.5 },
		{ enabled: false, mode: 0, mix: 0.5 },
		{ enabled: false, mode: 0, mix: 0.5 },
		{ enabled: false, mode: 0, mix: 0.5 },
	],
	fxSlotRingMods: [
		{ enabled: false, carrierHz: 440, mix: 1 },
		{ enabled: false, carrierHz: 440, mix: 1 },
		{ enabled: false, carrierHz: 440, mix: 1 },
		{ enabled: false, carrierHz: 440, mix: 1 },
		{ enabled: false, carrierHz: 440, mix: 1 },
		{ enabled: false, carrierHz: 440, mix: 1 },
	],
	fxSlotTremolos: [
		{ enabled: false, rate: 4, depth: 0.5, waveform: 0, mix: 1 },
		{ enabled: false, rate: 4, depth: 0.5, waveform: 0, mix: 1 },
		{ enabled: false, rate: 4, depth: 0.5, waveform: 0, mix: 1 },
		{ enabled: false, rate: 4, depth: 0.5, waveform: 0, mix: 1 },
		{ enabled: false, rate: 4, depth: 0.5, waveform: 0, mix: 1 },
		{ enabled: false, rate: 4, depth: 0.5, waveform: 0, mix: 1 },
	],
	fxSlotWavefolders: [
		{ enabled: false, drive: 0.5, folds: 0.5, mix: 1 },
		{ enabled: false, drive: 0.5, folds: 0.5, mix: 1 },
		{ enabled: false, drive: 0.5, folds: 0.5, mix: 1 },
		{ enabled: false, drive: 0.5, folds: 0.5, mix: 1 },
		{ enabled: false, drive: 0.5, folds: 0.5, mix: 1 },
		{ enabled: false, drive: 0.5, folds: 0.5, mix: 1 },
	],
};

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

/** Helper to build flat setters for every key in SynthState. */
function makeSetter<K extends keyof SynthState>(
	set: (partial: Partial<SynthState>) => void,
	key: K,
) {
	return (v: SynthState[K]) => set({ [key]: v });
}

type FxSlotArrayKey =
	| "fxSlotChoruses"
	| "fxSlotDelays"
	| "fxSlotReverbs"
	| "fxSlotPhasers"
	| "fxSlotCompressors"
	| "fxSlotEqs"
	| "fxSlotGrainDelays"
	| "fxSlotBitcrushers"
	| "fxSlotShimmerVerbs"
	| "fxSlotDistortions"
	| "fxSlotJunoChoruses"
	| "fxSlotRingMods"
	| "fxSlotTremolos"
	| "fxSlotWavefolders";

const FX_SLOT_ARRAY_KEYS: FxSlotArrayKey[] = [
	"fxSlotChoruses",
	"fxSlotDelays",
	"fxSlotReverbs",
	"fxSlotPhasers",
	"fxSlotCompressors",
	"fxSlotEqs",
	"fxSlotGrainDelays",
	"fxSlotBitcrushers",
	"fxSlotShimmerVerbs",
	"fxSlotDistortions",
	"fxSlotJunoChoruses",
	"fxSlotRingMods",
	"fxSlotTremolos",
	"fxSlotWavefolders",
];

const FX_SLOT_TYPE_TO_ARRAY_KEY: Partial<Record<FxSlotType, FxSlotArrayKey>> = {
	chorus: "fxSlotChoruses",
	delay: "fxSlotDelays",
	reverb: "fxSlotReverbs",
	phaser: "fxSlotPhasers",
	compressor: "fxSlotCompressors",
	eq5Band: "fxSlotEqs",
	grainDelay: "fxSlotGrainDelays",
	bitcrusher: "fxSlotBitcrushers",
	shimmerVerb: "fxSlotShimmerVerbs",
	distortion: "fxSlotDistortions",
	junoChorus: "fxSlotJunoChoruses",
	ringMod: "fxSlotRingMods",
	tremolo: "fxSlotTremolos",
	wavefolder: "fxSlotWavefolders",
};

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

	setIntPmAmount: (v) => set({ intPmAmount: v }),
	setIntPmRatio: (v) => set({ intPmRatio: v }),
	setPmPre: (v) => set({ pmPre: v }),
	setPhaseModEnabled: (v) => set({ phaseModEnabled: v }),

	setWindowType: (v) => set({ windowType: v }),
	setVolume: (v) => set({ volume: v }),

	setLine1Level: (v) => set({ line1Level: v }),
	setLine1Octave: (v) => set({ line1Octave: v }),
	setLine1Detune: (v) => set({ line1Detune: v }),
	setLine1DcwKeyFollow: (v) => set({ line1DcwKeyFollow: v }),
	setLine1DcaKeyFollow: (v) => set({ line1DcaKeyFollow: v }),
	setLine1DcoEnv: (v) => set({ line1DcoEnv: v }),
	setLine1DcwEnv: (v) => set({ line1DcwEnv: v }),
	setLine1DcaEnv: (v) => set({ line1DcaEnv: v }),
	setLine1CzSlotAWaveform: (v) => set({ line1CzSlotAWaveform: v }),
	setLine1CzSlotBWaveform: (v) => set({ line1CzSlotBWaveform: v }),
	setLine1CzWindow: (v) => set({ line1CzWindow: v }),
	setLine1AlgoControlsA: (v) => set({ line1AlgoControlsA: v }),
	setLine1AlgoControlsB: (v) => set({ line1AlgoControlsB: v }),

	setLine2Level: (v) => set({ line2Level: v }),
	setLine2Octave: (v) => set({ line2Octave: v }),
	setLine2Detune: (v) => set({ line2Detune: v }),
	setLine2DcwKeyFollow: (v) => set({ line2DcwKeyFollow: v }),
	setLine2DcaKeyFollow: (v) => set({ line2DcaKeyFollow: v }),
	setLine2DcoEnv: (v) => set({ line2DcoEnv: v }),
	setLine2DcwEnv: (v) => set({ line2DcwEnv: v }),
	setLine2DcaEnv: (v) => set({ line2DcaEnv: v }),
	setLine2CzSlotAWaveform: (v) => set({ line2CzSlotAWaveform: v }),
	setLine2CzSlotBWaveform: (v) => set({ line2CzSlotBWaveform: v }),
	setLine2CzWindow: (v) => set({ line2CzWindow: v }),
	setLine2AlgoControlsA: (v) => set({ line2AlgoControlsA: v }),
	setLine2AlgoControlsB: (v) => set({ line2AlgoControlsB: v }),

	setLineSelect: (v) => set({ lineSelect: v }),
	setModMode: (v) => set({ modMode: v }),

	setPolyMode: (v) => set({ polyMode: v }),
	setLegato: (v) => set({ legato: v }),
	setVelocityCurve: (v) => set({ velocityCurve: v }),

	setChorusEnabled: (v) => set({ chorusEnabled: v }),
	setChorusRate: (v) => set({ chorusRate: v }),
	setChorusDepth: (v) => set({ chorusDepth: v }),
	setChorusMix: (v) => set({ chorusMix: v }),

	setDelayEnabled: (v) => set({ delayEnabled: v }),
	setDelayTime: (v) => set({ delayTime: v }),
	setDelayFeedback: (v) => set({ delayFeedback: v }),
	setDelayMix: (v) => set({ delayMix: v }),
	setDelayTapeMode: (v) => set({ delayTapeMode: v }),
	setDelayWarmth: (v) => set({ delayWarmth: v }),

	setReverbEnabled: (v) => set({ reverbEnabled: v }),
	setReverbMix: (v) => set({ reverbMix: v }),
	setReverbSpace: (v) => set({ reverbSpace: v }),
	setReverbPredelay: (v) => set({ reverbPredelay: v }),
	setReverbDistance: (v) => set({ reverbDistance: v }),
	setReverbCharacter: (v) => set({ reverbCharacter: v }),

	setPhaserEnabled: (v) => set({ phaserEnabled: v }),
	setPhaserRate: (v) => set({ phaserRate: v }),
	setPhaserDepth: (v) => set({ phaserDepth: v }),
	setPhaserMix: (v) => set({ phaserMix: v }),
	setPhaserFeedback: (v) => set({ phaserFeedback: v }),

	setVibratoEnabled: (v) => set({ vibratoEnabled: v }),
	setVibratoWave: (v) => set({ vibratoWave: v }),
	setVibratoRate: (v) => set({ vibratoRate: v }),
	setVibratoDepth: (v) => set({ vibratoDepth: v }),
	setVibratoDelay: (v) => set({ vibratoDelay: v }),

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

	setFilterEnabled: (v) => set({ filterEnabled: v }),
	setFilterType: (v) => set({ filterType: v }),
	setFilterCutoff: (v) => set({ filterCutoff: v }),
	setFilterResonance: (v) => set({ filterResonance: v }),
	setFilterEnvAmount: (v) => set({ filterEnvAmount: v }),

	setPitchBendRange: (v) => set({ pitchBendRange: v }),
	setModWheelVibratoDepth: (v) => set({ modWheelVibratoDepth: v }),
	setOctave: (v) => set({ octave: v }),
	setModMatrix: (v) => set({ modMatrix: v }),
	setFxSlotArrayValue: ((key: FxSlotArrayKey, slot: number, value: unknown) => {
		set((s) => {
			const arr = [...s[key]] as SynthState[typeof key];
			arr[slot] = value as SynthState[typeof key][number];
			return { [key]: arr } as Partial<SynthState>;
		});
	}) as <K extends FxSlotArrayKey>(
		key: K,
		slot: number,
		value: SynthState[K][number],
	) => void,
	setFxSlotType: (slot, type) => {
		set((s) => {
			if (slot < 0 || slot > 5) return {};

			const slots = [...s.fxSlotTypes] as typeof s.fxSlotTypes;
			slots[slot] = type;

			const next: Partial<SynthState> = { fxSlotTypes: slots };
			const slotArrayKey = FX_SLOT_TYPE_TO_ARRAY_KEY[type];
			if (slotArrayKey) {
				const defaults = DEFAULT_STATE[slotArrayKey] as SynthState[typeof slotArrayKey];
				const arr = [...s[slotArrayKey]] as SynthState[typeof slotArrayKey];
				arr[slot] = { ...defaults[slot] } as SynthState[typeof slotArrayKey][number];
				(next as Record<string, unknown>)[slotArrayKey] = arr;
			}

			return next;
		});
	},
	setFxSlotChorus: (slot, v) =>
		get().setFxSlotArrayValue("fxSlotChoruses", slot, v),
	setFxSlotDelay: (slot, v) =>
		get().setFxSlotArrayValue("fxSlotDelays", slot, v),
	setFxSlotReverb: (slot, v) =>
		get().setFxSlotArrayValue("fxSlotReverbs", slot, v),
	setFxSlotPhaser: (slot, v) =>
		get().setFxSlotArrayValue("fxSlotPhasers", slot, v),
	setFxSlotCompressor: (slot, v) =>
		get().setFxSlotArrayValue("fxSlotCompressors", slot, v),
	setFxSlotEq: (slot, v) =>
		get().setFxSlotArrayValue("fxSlotEqs", slot, v),
	setFxSlotGrainDelay: (slot, v) =>
		get().setFxSlotArrayValue("fxSlotGrainDelays", slot, v),
	setFxSlotBitcrusher: (slot, v) =>
		get().setFxSlotArrayValue("fxSlotBitcrushers", slot, v),
	setFxSlotShimmerVerb: (slot, v) =>
		get().setFxSlotArrayValue("fxSlotShimmerVerbs", slot, v),
	setFxSlotDistortion: (slot, v) =>
		get().setFxSlotArrayValue("fxSlotDistortions", slot, v),
	setFxSlotJunoChorus: (slot, v) =>
		get().setFxSlotArrayValue("fxSlotJunoChoruses", slot, v),
	setFxSlotRingMod: (slot, v) =>
		get().setFxSlotArrayValue("fxSlotRingMods", slot, v),
	setFxSlotTremolo: (slot, v) =>
		get().setFxSlotArrayValue("fxSlotTremolos", slot, v),
	setFxSlotWavefolder: (slot, v) =>
		get().setFxSlotArrayValue("fxSlotWavefolders", slot, v),
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

			const move = (items: readonly unknown[]): unknown[] => {
				const next = [...items];
				const [moved] = next.splice(fromSlot, 1);
				next.splice(toSlot, 0, moved);
				return next;
			};

			const next: Partial<SynthState> = {
				fxSlotTypes: move(s.fxSlotTypes) as typeof s.fxSlotTypes,
			};

			for (const key of FX_SLOT_ARRAY_KEYS) {
				(next as Record<string, unknown>)[key] = move(s[key]);
			}

			return next;
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
				intPmAmount: s.intPmAmount,
				intPmEnabled: s.phaseModEnabled,
				intPmRatio: s.intPmRatio,
				extPmAmount: 0,
				pmPre: s.pmPre,
				frequency: 440,
				volume: s.volume,
				polyMode: s.polyMode,
				legato: s.legato,
				chorus: {
					enabled: s.chorusEnabled,
					rate: s.chorusRate,
					depth: s.chorusDepth,
					mix: s.chorusMix,
				},
				delay: {
					enabled: s.delayEnabled,
					time: s.delayTime,
					feedback: s.delayFeedback,
					mix: s.delayMix,
					tapeMode: s.delayTapeMode,
					warmth: s.delayWarmth,
				},
				reverb: {
					enabled: s.reverbEnabled,
					mix: s.reverbMix,
					space: s.reverbSpace,
					predelay: s.reverbPredelay,
					distance: s.reverbDistance,
					character: s.reverbCharacter,
				},
				phaser: {
					enabled: s.phaserEnabled,
					rate: s.phaserRate,
					depth: s.phaserDepth,
					mix: s.phaserMix,
					feedback: s.phaserFeedback,
				},
				vibrato: {
					enabled: s.vibratoEnabled,
					waveform: s.vibratoWave,
					rate: s.vibratoRate,
					depth: s.vibratoDepth,
					delay: s.vibratoDelay,
				},
				compressor: s.fxSlotCompressors[0],
				eq: s.fxSlotEqs[0],
				grainDelay: s.fxSlotGrainDelays[0],
				bitcrusher: s.fxSlotBitcrushers[0],
				shimmerVerb: s.fxSlotShimmerVerbs[0],
				distortion: s.fxSlotDistortions[0],
				junoChorus: s.fxSlotJunoChoruses[0],
				ringMod: s.fxSlotRingMods[0],
				tremolo: s.fxSlotTremolos[0],
				wavefolder: s.fxSlotWavefolders[0],
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
				filter: {
					enabled: s.filterEnabled,
					type: s.filterType,
					cutoff: s.filterCutoff,
					resonance: s.filterResonance,
					envAmount: s.filterEnvAmount,
				},
				pitchBendRange: s.pitchBendRange,
				modWheelVibratoDepth: s.modWheelVibratoDepth,
				modMatrix: s.modMatrix,
				fxSlots: s.fxSlotTypes,
				fxSlotChoruses: s.fxSlotChoruses,
				fxSlotDelays: s.fxSlotDelays,
				fxSlotReverbs: s.fxSlotReverbs,
				fxSlotPhasers: s.fxSlotPhasers,
				fxSlotCompressors: s.fxSlotCompressors,
				fxSlotEqs: s.fxSlotEqs,
				fxSlotGrainDelays: s.fxSlotGrainDelays,
				fxSlotBitcrushers: s.fxSlotBitcrushers,
				fxSlotShimmerVerbs: s.fxSlotShimmerVerbs,
				fxSlotDistortions: s.fxSlotDistortions,
				fxSlotJunoChoruses: s.fxSlotJunoChoruses,
				fxSlotRingMods: s.fxSlotRingMods,
				fxSlotTremolos: s.fxSlotTremolos,
				fxSlotWavefolders: s.fxSlotWavefolders,
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
		const legacyReverb = p.reverb as
			| (typeof p.reverb & { brightness?: number; highCut?: number })
			| undefined;
		const hasLegacyReverbTone =
			legacyReverb?.brightness != null || legacyReverb?.highCut != null;
		const reverbCharacter = hasLegacyReverbTone
			? Math.min(
					1,
					Math.max(
						0,
						(safe(legacyReverb?.brightness, 0.7) -
							safe(legacyReverb?.highCut, 0) * 0.4) *
							0.85 +
							safe(legacyReverb?.character, 0.3) * 0.15,
					),
				)
			: safe(p.reverb?.character, 0.65);

		set({
			warpAAmount: safe(p.line1?.dcwBase, 0),
			warpBAmount: safe(p.line2?.dcwBase, 0),
			warpAAlgo: line1PrimaryAlgo,
			warpBAlgo: line2PrimaryAlgo,
			algo2A: line1SecondaryAlgo,
			algo2B: line2SecondaryAlgo,
			algoBlendA: safe(p.line1?.algoBlend, 0),
			algoBlendB: safe(p.line2?.algoBlend, 0),
			intPmAmount: safe(p.intPmAmount, 0),
			intPmRatio: safe(p.intPmRatio, 1),
			phaseModEnabled: p.intPmEnabled ?? safe(p.intPmAmount, 0) > 0,
			pmPre: p.pmPre ?? true,
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
			line1CzSlotAWaveform: inferCzWaveform(
				p.line1?.algo,
				p.line1?.cz?.slotAWaveform,
				"saw",
			),
			line1CzSlotBWaveform: inferCzWaveform(
				p.line1?.algo2,
				p.line1?.cz?.slotBWaveform,
				"saw",
			),
			line1CzWindow: (p.line1?.cz?.window as WindowType) ?? "off",
			line1AlgoControlsA: normalizeAlgoControls(
				line1PrimaryAlgo,
				p.line1?.algoControlsA ??
					(p.line1 as { algoControls?: AlgoControlValueV1[] })?.algoControls ??
					[],
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
			line2CzSlotAWaveform: inferCzWaveform(
				p.line2?.algo,
				p.line2?.cz?.slotAWaveform,
				"saw",
			),
			line2CzSlotBWaveform: inferCzWaveform(
				p.line2?.algo2,
				p.line2?.cz?.slotBWaveform,
				"saw",
			),
			line2CzWindow: (p.line2?.cz?.window as WindowType) ?? "off",
			line2AlgoControlsA: normalizeAlgoControls(
				line2PrimaryAlgo,
				p.line2?.algoControlsA ??
					(p.line2 as { algoControls?: AlgoControlValueV1[] })?.algoControls ??
					[],
			),
			line2AlgoControlsB: line2SecondaryAlgo
				? normalizeAlgoControls(
						line2SecondaryAlgo,
						p.line2?.algoControlsB ?? [],
					)
				: [],
			polyMode: (p.polyMode as PolyMode) ?? "poly8",
			legato: p.legato ?? false,
			chorusRate: safe(p.chorus?.rate, 0.8),
			chorusDepth: safe(p.chorus?.depth, 3),
			chorusMix: safe(p.chorus?.mix, 0),
			chorusEnabled: p.chorus?.enabled ?? safe(p.chorus?.mix, 0) > 0,
			delayTime: safe(p.delay?.time, 0.3),
			delayFeedback: safe(p.delay?.feedback, 0.35),
			delayMix: safe(p.delay?.mix, 0),
			delayEnabled: p.delay?.enabled ?? safe(p.delay?.mix, 0) > 0,
			reverbMix: safe(p.reverb?.mix, 0),
			reverbEnabled: p.reverb?.enabled ?? safe(p.reverb?.mix, 0) > 0,
			reverbSpace: safe(p.reverb?.space, 0.5),
			reverbPredelay: safe(p.reverb?.predelay, 0),
			reverbDistance: safe(p.reverb?.distance, 0.3),
			reverbCharacter,
			delayTapeMode: p.delay?.tapeMode ?? false,
			delayWarmth: safe(p.delay?.warmth, 0.5),
			phaserEnabled: p.phaser?.enabled ?? false,
			phaserRate: safe(p.phaser?.rate, 0.5),
			phaserDepth: safe(p.phaser?.depth, 1),
			phaserMix: safe(p.phaser?.mix, 0),
			phaserFeedback: safe(p.phaser?.feedback, 0.5),
			lineSelect: (p.lineSelect as LineSelect) ?? "L1+L2",
			modMode: (p.modMode as ModMode) ?? "normal",
			line1DcwKeyFollow: safe(p.line1?.keyFollow, 0),
			line1DcaKeyFollow: 0,
			line2DcwKeyFollow: safe(p.line2?.keyFollow, 0),
			line2DcaKeyFollow: 0,
			vibratoEnabled: p.vibrato?.enabled ?? false,
			vibratoWave: safe(p.vibrato?.waveform, 1),
			vibratoRate: safe(p.vibrato?.rate, 30),
			vibratoDepth: safe(p.vibrato?.depth, 30),
			vibratoDelay: safe(p.vibrato?.delay, 0),
			portamentoEnabled: p.portamento?.enabled ?? false,
			portamentoMode: (p.portamento?.mode as PortamentoMode) ?? "rate",
			portamentoRate: safe(p.portamento?.rate, 50),
			portamentoTime: safe(p.portamento?.time, 0.5),
			lfoWaveform: (p.lfo?.waveform as LfoWaveform) ?? "sine",
			lfoRate: safe(p.lfo?.rate, 5),
			lfoDepth: safe(p.lfo?.depth, 0),
			lfoSymmetry: safe(p.lfo?.symmetry, 0.5),
			lfoRetrigger: p.lfo?.retrigger ?? false,
			lfoOffset: safe(p.lfo?.offset, 0),
			lfo2Waveform: (p.lfo2?.waveform as LfoWaveform) ?? "sine",
			lfo2Rate: safe(p.lfo2?.rate, 5),
			lfo2Depth: safe(p.lfo2?.depth, 0),
			lfo2Symmetry: safe(p.lfo2?.symmetry, 0.5),
			lfo2Retrigger: p.lfo2?.retrigger ?? false,
			lfo2Offset: safe(p.lfo2?.offset, 0),
			randomRate: safe(p.random?.rate, 2),
			modEnvAttack: safe(p.modEnv?.attack, 0.01),
			modEnvDecay: safe(p.modEnv?.decay, 0.1),
			modEnvSustain: safe(p.modEnv?.sustain, 0.5),
			modEnvRelease: safe(p.modEnv?.release, 0.2),
			filterEnabled: p.filter?.enabled ?? false,
			filterType: (p.filter?.type as FilterType) ?? "lp",
			filterCutoff: safe(p.filter?.cutoff, 5000),
			filterResonance: safe(p.filter?.resonance, 0),
			filterEnvAmount: safe(p.filter?.envAmount, 0),
			pitchBendRange: safe(p.pitchBendRange, 2),
			modWheelVibratoDepth: safe(p.modWheelVibratoDepth, 0),
			octave: safe(p.octave, 0),
			modMatrix:
				p.modMatrix && typeof p.modMatrix === "object"
					? (p.modMatrix as ModMatrix)
					: { routes: [] },
			fxSlotTypes:
				Array.isArray(p.fxSlots) && p.fxSlots.length === 6
					? (p.fxSlots as [
							FxSlotType,
							FxSlotType,
							FxSlotType,
							FxSlotType,
							FxSlotType,
							FxSlotType,
						])
					: ["chorus", "delay", "reverb", "vibrato", "phaseMod", "phaser"],
			fxSlotChoruses: Array.isArray((p as { fxSlotChoruses?: ChorusParams[] }).fxSlotChoruses) &&
				(p as { fxSlotChoruses?: ChorusParams[] }).fxSlotChoruses?.length === 6
				? ((p as { fxSlotChoruses: ChorusParams[] }).fxSlotChoruses as typeof DEFAULT_STATE.fxSlotChoruses)
				: ([0, 1, 2, 3, 4, 5].map(() => ({
					enabled: p.chorus?.enabled ?? safe(p.chorus?.mix, 0) > 0,
					rate: safe(p.chorus?.rate, 0.8),
					depth: safe(p.chorus?.depth, 3),
					mix: safe(p.chorus?.mix, 0),
				})) as typeof DEFAULT_STATE.fxSlotChoruses),
			fxSlotDelays: Array.isArray((p as { fxSlotDelays?: DelayParams[] }).fxSlotDelays) &&
				(p as { fxSlotDelays?: DelayParams[] }).fxSlotDelays?.length === 6
				? ((p as { fxSlotDelays: DelayParams[] }).fxSlotDelays as typeof DEFAULT_STATE.fxSlotDelays)
				: ([0, 1, 2, 3, 4, 5].map(() => ({
					enabled: p.delay?.enabled ?? safe(p.delay?.mix, 0) > 0,
					time: safe(p.delay?.time, 0.3),
					feedback: safe(p.delay?.feedback, 0.35),
					mix: safe(p.delay?.mix, 0),
					tapeMode: p.delay?.tapeMode ?? false,
					warmth: safe(p.delay?.warmth, 0.5),
				})) as typeof DEFAULT_STATE.fxSlotDelays),
			fxSlotReverbs: Array.isArray((p as { fxSlotReverbs?: ReverbParams[] }).fxSlotReverbs) &&
				(p as { fxSlotReverbs?: ReverbParams[] }).fxSlotReverbs?.length === 6
				? ((p as { fxSlotReverbs: ReverbParams[] }).fxSlotReverbs as typeof DEFAULT_STATE.fxSlotReverbs)
				: ([0, 1, 2, 3, 4, 5].map(() => ({
					enabled: p.reverb?.enabled ?? safe(p.reverb?.mix, 0) > 0,
					mix: safe(p.reverb?.mix, 0),
					space: safe(p.reverb?.space, 0.5),
					predelay: safe(p.reverb?.predelay, 0),
					distance: safe(p.reverb?.distance, 0.3),
					character: reverbCharacter,
				})) as typeof DEFAULT_STATE.fxSlotReverbs),
			fxSlotPhasers: Array.isArray((p as { fxSlotPhasers?: PhaserParams[] }).fxSlotPhasers) &&
				(p as { fxSlotPhasers?: PhaserParams[] }).fxSlotPhasers?.length === 6
				? ((p as { fxSlotPhasers: PhaserParams[] }).fxSlotPhasers as typeof DEFAULT_STATE.fxSlotPhasers)
				: ([0, 1, 2, 3, 4, 5].map(() => ({
					enabled: p.phaser?.enabled ?? false,
					rate: safe(p.phaser?.rate, 0.5),
					depth: safe(p.phaser?.depth, 1),
					mix: safe(p.phaser?.mix, 0),
					feedback: safe(p.phaser?.feedback, 0.5),
				})) as typeof DEFAULT_STATE.fxSlotPhasers),
			fxSlotCompressors: Array.isArray(p.fxSlotCompressors) && p.fxSlotCompressors.length === 6
				? (p.fxSlotCompressors as typeof DEFAULT_STATE.fxSlotCompressors)
				: DEFAULT_STATE.fxSlotCompressors,
			fxSlotEqs: Array.isArray(p.fxSlotEqs) && p.fxSlotEqs.length === 6
				? (p.fxSlotEqs as typeof DEFAULT_STATE.fxSlotEqs)
				: DEFAULT_STATE.fxSlotEqs,
			fxSlotGrainDelays: Array.isArray(p.fxSlotGrainDelays) && p.fxSlotGrainDelays.length === 6
				? (p.fxSlotGrainDelays as typeof DEFAULT_STATE.fxSlotGrainDelays)
				: DEFAULT_STATE.fxSlotGrainDelays,
			fxSlotBitcrushers: Array.isArray(p.fxSlotBitcrushers) && p.fxSlotBitcrushers.length === 6
				? (p.fxSlotBitcrushers as typeof DEFAULT_STATE.fxSlotBitcrushers)
				: DEFAULT_STATE.fxSlotBitcrushers,
			fxSlotShimmerVerbs: Array.isArray(p.fxSlotShimmerVerbs) && p.fxSlotShimmerVerbs.length === 6
				? (p.fxSlotShimmerVerbs as typeof DEFAULT_STATE.fxSlotShimmerVerbs)
				: DEFAULT_STATE.fxSlotShimmerVerbs,
			fxSlotDistortions: Array.isArray(p.fxSlotDistortions) && p.fxSlotDistortions.length === 6
				? (p.fxSlotDistortions as typeof DEFAULT_STATE.fxSlotDistortions)
				: DEFAULT_STATE.fxSlotDistortions,
			fxSlotJunoChoruses: Array.isArray(p.fxSlotJunoChoruses) && p.fxSlotJunoChoruses.length === 6
				? (p.fxSlotJunoChoruses as typeof DEFAULT_STATE.fxSlotJunoChoruses)
				: DEFAULT_STATE.fxSlotJunoChoruses,
			fxSlotRingMods: Array.isArray(p.fxSlotRingMods) && p.fxSlotRingMods.length === 6
				? (p.fxSlotRingMods as typeof DEFAULT_STATE.fxSlotRingMods)
				: DEFAULT_STATE.fxSlotRingMods,
			fxSlotTremolos: Array.isArray(p.fxSlotTremolos) && p.fxSlotTremolos.length === 6
				? (p.fxSlotTremolos as typeof DEFAULT_STATE.fxSlotTremolos)
				: DEFAULT_STATE.fxSlotTremolos,
			fxSlotWavefolders: Array.isArray(p.fxSlotWavefolders) && p.fxSlotWavefolders.length === 6
				? (p.fxSlotWavefolders as typeof DEFAULT_STATE.fxSlotWavefolders)
				: DEFAULT_STATE.fxSlotWavefolders,
		});
	},
}));

// Suppress the unused variable warning for makeSetter (it's kept for reference)
void makeSetter;
