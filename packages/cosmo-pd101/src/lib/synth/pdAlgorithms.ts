import {
	algoRefKey,
	getAlgoDefinition,
	isAlgoRefEqual,
	isWarpAlgo,
	resolveAlgoRef,
	resolveCzControlsFromEntries,
} from "@/lib/synth/algoRef";
import type {
	Algo,
	AlgoControlValueV1,
	BaseWaveform,
	CzWaveform,
	StepEnvData,
	WindowType,
} from "@/lib/synth/bindings/synth";
import { ALGO_UI_CATALOG_V1 } from "@/lib/synth/bindings/synth";

const N = 1024;
const TAU = Math.PI * 2;

export type PdAlgo = Algo;

type PdAlgoDef = {
	value: PdAlgo;
	label: string;
	waveform: CzWaveform;
	algo: string;
	key: string;
	icon: string;
};

/**
 * Generates an SVG path by sampling a function
 * x: 4 to 20, y: 4 to 20 (center 12)
 */
const generatePath = (fn: (phase: number) => number, res = 64): string => {
	const steps = [];
	for (let i = 0; i <= res; i++) {
		const phase = i / res; // 0 to 1
		const sample = fn(phase);
		const safeSample = Number.isFinite(sample) ? sample : 0;
		const amplitude = Math.max(-1, Math.min(1, safeSample));

		const x = 4 + phase * 16;
		const y = 12 - amplitude * 8;
		steps.push(`${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`);
	}
	return steps.join("");
};

const sampleAlgoFullDcw = (algo: PdAlgo, phase: number): number => {
	const resolved = resolveAlgoRef(algo);
	if (resolved.warpAlgo === "cz101") {
		const raw = czWaveform(resolved.waveform, phase);
		const w = resolved.windowType ? applyWindow(phase, resolved.windowType) : 1;
		return raw * w;
	}

	const direct = sampleDirectAlgoPreview(algo, phase);
	if (direct !== null) return direct;

	return renderAlgoSample(
		algo,
		phase,
		1,
		getAlgoDefinition(algo)?.defaultBaseWaveform ?? "sine",
		undefined,
	);
};

const getAlgoIcon = (algo: PdAlgo): string => {
	return generatePath((phase) => sampleAlgoFullDcw(algo, phase));
};

export const PD_ALGOS: PdAlgoDef[] = [
	...ALGO_UI_CATALOG_V1.filter((entry) => entry.visible).map((entry) => {
		const resolved = resolveAlgoRef(entry.id);
		return {
			value: entry.id,
			label: entry.label,
			waveform: resolved.waveform,
			algo: resolved.warpAlgo,
			key: algoRefKey(entry.id),
			icon: getAlgoIcon(entry.id),
		};
	}),
];

const NON_BASE_WAVE_ALGOS = new Set<PdAlgo>(["karpunk"]);

export function algoUsesBaseWaveform(algo: PdAlgo): boolean {
	return !NON_BASE_WAVE_ALGOS.has(algo);
}

const ALGO_BEHAVIOR_DESCRIPTIONS: Record<PdAlgo, string> = {
	cz101:
		"Classic CZ phase-distortion core. Use DCW and the CZ preset controls to shape the harmonic contour.",
	bend: "Bends phase toward one side, adding asymmetry and a brighter edge as depth increases.",
	sync: "Applies hard-sync style phase resets for harmonic-rich, edgy tones.",
	pinch:
		"Compresses phase around the center, emphasizing mid-cycle detail and nasal character.",
	fold: "Folds the phase path back on itself for wavefold-style harmonics and sharper timbre.",
	skew: "Tilts phase timing earlier vs later to shift harmonic balance and attack character.",
	quantize:
		"Steps the phase into discrete levels for a digitized, stair-stepped texture.",
	twist:
		"Applies sinusoidal phase twisting for animated, swirling harmonic motion.",
	clip: "Limits phase excursion, flattening peaks for a harder, clipped tone.",
	ripple:
		"Adds high-frequency ripple to the phase trajectory for fine, buzzy harmonic detail.",
	mirror:
		"Blends toward an inverted phase path to create mirrored, symmetrical timbres.",
	fof: "Formant-like shaping with windowed resonant emphasis suited to vocal-style colors.",
	karpunk:
		"Plucked/resonant distortion character with decaying inharmonic overtones.",
	sine: "Pure sine phase path with minimal harmonics and smooth tone.",
	// CZ waveform transfer shapes
	saw: "Saw transfer shape with a bright, harmonically rich spectrum.",
	square: "Square transfer shape emphasizing odd harmonics for hollow tone.",
	pulse: "Pulse transfer shape with a narrow-duty harmonic profile.",
	null: "Sparse transfer shape with thin, subdued harmonic content.",
	sinePulse: "Hybrid sine/pulse transfer for mixed smooth and buzzy harmonics.",
	sawPulse: "Hybrid saw/pulse transfer balancing edge and body.",
	multiSine: "Multi-sine resonant transfer emphasizing vocal-like peaks.",
	pulse2: "Dual-pulse style transfer with hollow, comb-like harmonic spacing.",
};

export function getPdAlgoBehaviorDescription(algo: PdAlgo): string {
	return (
		ALGO_BEHAVIOR_DESCRIPTIONS[algo] ??
		"Phase-distortion algorithm with a distinct harmonic shaping profile."
	);
}

export function getPdAlgoDef(algo: PdAlgo): PdAlgoDef | undefined {
	return PD_ALGOS.find((entry) => isAlgoRefEqual(entry.value, algo));
}

export const DEFAULT_DCA_ENV: StepEnvData = {
	steps: [
		{ level: 99, rate: 75 },
		{ level: 79, rate: 80 },
		{ level: 79, rate: 75 },
		{ level: 0, rate: 40 },
		{ level: 0, rate: 50 },
		{ level: 0, rate: 50 },
		{ level: 0, rate: 50 },
		{ level: 0, rate: 50 },
	],
	sustainStep: 2,
	stepCount: 4,
	loop: false,
};

export const DEFAULT_DCW_ENV: StepEnvData = {
	steps: [
		{ level: 99, rate: 75 },
		{ level: 99, rate: 80 },
		{ level: 99, rate: 75 },
		{ level: 0, rate: 40 },
		{ level: 0, rate: 50 },
		{ level: 0, rate: 50 },
		{ level: 0, rate: 50 },
		{ level: 0, rate: 50 },
	],
	sustainStep: 2,
	stepCount: 4,
	loop: false,
};

export const DEFAULT_DCO_ENV: StepEnvData = {
	steps: [
		{ level: 0, rate: 0 },
		{ level: 0, rate: 0 },
		{ level: 0, rate: 0 },
		{ level: 0, rate: 0 },
		{ level: 0, rate: 0 },
		{ level: 0, rate: 0 },
		{ level: 0, rate: 0 },
		{ level: 0, rate: 0 },
	],
	sustainStep: 1,
	stepCount: 2,
	loop: false,
};

export const PC_KEY_TO_NOTE: Record<string, number> = {
	a: 60,
	s: 62,
	d: 64,
	f: 65,
	g: 67,
	h: 69,
	j: 71,
	k: 72,
};

function wrap01(value: number): number {
	const wrapped = value % 1;
	return wrapped < 0 ? wrapped + 1 : wrapped;
}

function clamp(value: number, min: number, max: number): number {
	return Math.max(min, Math.min(max, value));
}

function pdBend(
	phase: number,
	amount: number,
	curve = 0.5,
	bias = 0,
	knee = 0.5,
): number {
	const centered = (phase - 0.5) * (1.25 + bias * 0.75) + 0.5;
	const warpedPhase = clamp(centered, 0, 1);
	const kneeExp = 0.25 + knee * 2.75;
	const kneeShaped =
		warpedPhase < 0.5
			? 0.5 * clamp(warpedPhase * 2, 0, 1) ** kneeExp
			: 0.5 + 0.5 * (1 - clamp((1 - warpedPhase) * 2, 0, 1) ** kneeExp);
	const scale = -10 * (amount * (0.5 + curve * 1.5));
	const numerator = Math.expm1(kneeShaped * scale);
	const denominator = Math.expm1(scale);
	return denominator === 0 ? phase : numerator / denominator;
}

function pdSync(
	phase: number,
	amount: number,
	ratio = 0.5,
	phaseOffset = 0,
	curve = 0.5,
	window = 0.5,
): number {
	const mult = 1 + amount * (4 + ratio * 14);
	const synced = wrap01((phase + phaseOffset) * mult);
	const exponent = 0.35 + curve * 2.4;
	const shaped =
		synced < 0.5
			? 0.5 * clamp(synced * 2, 0, 1) ** exponent
			: 0.5 + 0.5 * (1 - clamp((1 - synced) * 2, 0, 1) ** exponent);
	return phase + (shaped - phase) * (0.25 + window * 0.75);
}

function pdPinch(
	phase: number,
	amount: number,
	focus = 0.5,
	asym = 0,
	curve = 0.5,
	drive = 0.5,
): number {
	const center = 0.3 + focus * 0.4;
	const intensity = 1 + amount * (2 + focus * 5 + drive * 4);
	const shaped =
		phase < center
			? center * clamp(phase / center, 0, 1) ** intensity
			: center +
				(1 - center) *
					(1 - (1 - clamp((phase - center) / (1 - center), 0, 1)) ** intensity);
	const asymShift = asym * (0.1 + drive * 0.1);
	const exponent = 0.35 + curve * 2.4;
	const curved =
		shaped < 0.5
			? 0.5 * clamp(shaped * 2, 0, 1) ** exponent
			: 0.5 + 0.5 * (1 - clamp((1 - shaped) * 2, 0, 1) ** exponent);
	return clamp(curved + asymShift, 0, 1);
}

function foldPass(phase: number, pivot: number, softness: number): number {
	let folded = phase;
	if (folded > pivot) {
		folded = Math.abs(2 * pivot - folded);
	}
	const foldGain = Math.min(1 / pivot, 8);
	const soft = clamp(softness, 0, 1);
	const softenedGain = foldGain * (1 - soft) + soft;
	return folded * softenedGain;
}

function applyFolds(
	phase: number,
	foldCount: number,
	pivot: number,
	softness: number,
): number {
	let folded = phase;
	for (let index = 0; index < foldCount; index += 1) {
		folded = foldPass(folded, pivot, softness);
	}
	return wrap01(folded);
}

function smoothstep01(value: number): number {
	const t = clamp(value, 0, 1);
	return t * t * (3 - 2 * t);
}

function lerpPhase(a: number, b: number, t: number): number {
	let delta = b - a;
	if (delta > 0.5) delta -= 1;
	else if (delta < -0.5) delta += 1;
	return wrap01(a + delta * t);
}

function pdFold(
	phase: number,
	amount: number,
	stages = 0.5,
	tilt = 0,
	symmetry = 0,
	softness = 0,
): number {
	const foldDrive = (0.5 + stages * 5.5) * Math.max(amount, 0.05);
	const foldFloor = Math.max(Math.floor(foldDrive), 0);
	const foldFrac = smoothstep01(foldDrive - foldFloor);
	const baseFolds = 1 + foldFloor;
	const nextFolds = baseFolds + 1;
	const pivot = clamp(0.5 + tilt * 0.3 + symmetry * 0.125, 0.05, 0.95);
	const basePhase = applyFolds(phase, baseFolds, pivot, softness);
	if (foldFrac <= 0) return basePhase;
	const nextPhase = applyFolds(phase, nextFolds, pivot, softness);
	return lerpPhase(basePhase, nextPhase, foldFrac);
}

function pdSkew(
	phase: number,
	amount: number,
	bias = 0.2,
	curve = 0.5,
	spread = 0,
	tilt = 0,
): number {
	const breakpoint = clamp(0.05 + bias * 0.9, 0.05, 0.95);
	const leftSpan = 0.675 + spread * 0.325;
	const rightSpan = 0.675 - spread * 0.325;
	const target =
		phase < breakpoint
			? leftSpan * clamp(phase / breakpoint, 0, 1) ** (0.4 + curve * 2.2)
			: leftSpan +
				rightSpan *
					clamp((phase - breakpoint) / (1 - breakpoint), 0, 1) **
						(0.4 + (1 - curve + tilt * 0.25) * 2.2);
	return phase + (target - phase) * amount;
}

function pdQuantize(
	phase: number,
	amount: number,
	steps = 0.5,
	skew = 0.5,
): number {
	const levels = 2 + Math.floor(steps * 30);
	const warpedPhase = clamp(phase, 0, 1) ** (0.4 + skew * 2.2);
	const target = Math.round(warpedPhase * levels) / levels;
	return phase + (target - phase) * amount;
}

function pdTwist(
	phase: number,
	amount: number,
	harmonics = 0.5,
	depth = 0.5,
	phaseOffset = 0,
	shape = 0.5,
): number {
	const partials = 1 + harmonics * 11;
	const depthScale = 0.03 + depth * 0.25;
	const driver = Math.sin(TAU * (phase + phaseOffset) * partials);
	const shaped =
		driver >= 0
			? driver ** (0.35 + shape * 2.2)
			: -((-driver) ** (0.35 + shape * 2.2));
	return wrap01(phase + amount * depthScale * shaped);
}

function pdClip(
	phase: number,
	amount: number,
	drive = 0.5,
	shape = 0.5,
	bias = 0,
	soft = 0,
): number {
	const gain = 1 + amount * (2 + drive * 8);
	const clip = 0.15 + (1 - shape) * 0.35;
	const shifted = (phase - 0.5 + bias * 0.25) * gain;
	const hard = clamp(shifted, -clip, clip);
	const softMix = clamp(soft, 0, 1);
	const softened = Math.tanh(shifted / Math.max(clip, 0.001)) * clip;
	const mixed = hard * (1 - softMix) + softened * softMix;
	return mixed / (clip * 2) + 0.5;
}

function pdRipple(
	phase: number,
	amount: number,
	rippleFreq = 0.5,
	rippleDepth = 0.5,
	phaseOffset = 0,
	shape = 0.5,
): number {
	const cycles = 2 + rippleFreq * 22;
	const depth = 0.01 + rippleDepth * 0.12;
	const ripple = Math.sin(TAU * (phase + phaseOffset) * cycles);
	const shaped =
		ripple >= 0
			? ripple ** (0.35 + shape * 2.4)
			: -((-ripple) ** (0.35 + shape * 2.4));
	return wrap01(phase + amount * depth * shaped);
}

function pdMirror(
	phase: number,
	amount: number,
	center = 0.5,
	blend = 0.5,
	clip = 0,
	skew = 0,
): number {
	const pivot = clamp(center, 0.01, 0.99);
	const mirrored = clamp(pivot + (pivot - phase) * (1 + skew * 0.5), 0, 1);
	const clipped =
		clip > 0
			? (() => {
					const clipAmount = 0.5 - clip * 0.45;
					return (
						clamp(mirrored - 0.5, -clipAmount, clipAmount) / (clipAmount * 2) +
						0.5
					);
				})()
			: mirrored;
	return phase + (clipped - phase) * (amount * (0.2 + blend * 0.8));
}

function sampleDirectAlgoPreview(algo: PdAlgo, _phase: number): number | null {
	switch (algo) {
		default:
			return null;
	}
}

function sampleBaseWave(baseWaveform: BaseWaveform, phase: number): number {
	const wrappedPhase = wrap01(phase);
	switch (baseWaveform) {
		case "cosine":
			return -Math.cos(TAU * wrappedPhase);
		case "sine":
			return Math.sin(TAU * wrappedPhase);
		case "triangle":
			return 1 - 4 * Math.abs(wrappedPhase - 0.5);
		case "saw":
			return wrappedPhase * 2 - 1;
		case "square":
			return wrappedPhase < 0.5 ? 1 : -1;
		default:
			return Math.sin(TAU * wrappedPhase);
	}
}

function pdTransfer(waveformId: CzWaveform, phi: number): number {
	switch (waveformId) {
		case "saw":
			return phi;
		case "square":
			return phi < 0.5 ? 0 : 1;
		case "pulse":
			return phi >= 0.25 && phi < 0.75 ? 1 : 0;
		case "null":
			return phi < 0.01 ? phi / 0.01 : 0;
		case "sinePulse":
			return phi < 0.15 ? phi / 0.15 : 0;
		case "sawPulse":
			return phi < 0.15 ? phi / 0.15 : phi;
		case "multiSine":
			return phi + 3 * Math.sin(TAU * phi) * Math.sin(Math.PI * phi);
		case "pulse2":
			return phi < 0.15 || (phi >= 0.5 && phi < 0.65) ? 1 : 0;
		default:
			return phi;
	}
}

function czWaveform(waveformId: CzWaveform, phi: number): number {
	const p = pdTransfer(waveformId, phi);
	switch (waveformId) {
		case "saw":
			return 2 * p - 1;
		case "square":
			return p === 1 ? 1 : -1;
		case "pulse":
			return p === 1 ? 1 : -1;
		case "null":
			return p * 2 - 1;
		case "sinePulse":
			return p * 2 - 1;
		case "sawPulse":
			return 2 * p - 1;
		case "multiSine":
			return Math.sin(TAU * p);
		case "pulse2":
			return p === 1 ? 1 : -1;
		default:
			return 2 * phi - 1;
	}
}

function pdCz101(phase: number, amount: number): number {
	if (amount === 0) return phase;
	const t = amount;
	if (t < 0.5) {
		return phase < t * 2
			? (phase / (t * 2)) * 0.5
			: 0.5 + ((phase - t * 2) / (2 - t * 2)) * 0.5;
	} else {
		return 0.5 - 0.5 * Math.cos(Math.PI * phase * (1 + (t - 0.5) * 2));
	}
}

function applyPdAlgo(
	phase: number,
	amount: number,
	algo: PdAlgo,
	_waveformId: CzWaveform,
	algoControls?: AlgoControlValueV1[] | null,
): number {
	const controlValue = (id: string, fallback: number) => {
		const value = algoControls?.find((entry) => entry.id === id)?.value;
		return typeof value === "number" ? value : fallback;
	};

	switch (isWarpAlgo(algo) ? algo : "cz101") {
		case "bend":
			return pdBend(
				phase,
				amount,
				controlValue("bendCurve", 0.5),
				controlValue("bendBias", 0),
				controlValue("bendKnee", 0.5),
			);
		case "sync":
			return pdSync(
				phase,
				amount,
				controlValue("syncRatio", 0.5),
				controlValue("syncPhase", 0),
				controlValue("syncCurve", 0.5),
				controlValue("syncWindow", 0.5),
			);
		case "pinch":
			return pdPinch(
				phase,
				amount,
				controlValue("pinchFocus", 0.5),
				controlValue("pinchAsym", 0),
				controlValue("pinchCurve", 0.5),
				controlValue("pinchDrive", 0.5),
			);
		case "fold":
			return pdFold(
				phase,
				amount,
				controlValue("foldStages", 0.5),
				controlValue("foldTilt", 0),
				controlValue("foldSymmetry", 0),
				controlValue("foldSoftness", 0),
			);
		case "cz101":
			return pdCz101(phase, amount);
		case "skew":
			return pdSkew(
				phase,
				amount,
				controlValue("skewBias", 0.2),
				controlValue("skewCurve", 0.5),
				controlValue("skewSpread", 0),
				controlValue("skewTilt", 0),
			);
		case "quantize":
			return pdQuantize(
				phase,
				controlValue("quantizeAmount", amount),
				controlValue("quantizeSteps", 0.5),
				controlValue("quantizeSkew", 0.5),
			);
		case "twist":
			return pdTwist(
				phase,
				amount,
				controlValue("twistHarmonics", 0.5),
				controlValue("twistDepth", 0.5),
				controlValue("twistPhase", 0),
				controlValue("twistShape", 0.5),
			);
		case "clip":
			return pdClip(
				phase,
				amount,
				controlValue("clipDrive", 0.5),
				controlValue("clipShape", 0.5),
				controlValue("clipBias", 0),
				controlValue("clipSoft", 0),
			);
		case "ripple":
			return pdRipple(
				phase,
				amount,
				controlValue("rippleFreq", 0.5),
				controlValue("rippleDepth", 0.5),
				controlValue("ripplePhase", 0),
				controlValue("rippleShape", 0.5),
			);
		case "mirror":
			return pdMirror(
				phase,
				amount,
				controlValue("mirrorCenter", 0.5),
				controlValue("mirrorBlend", 0.5),
				controlValue("mirrorClip", 0),
				controlValue("mirrorSkew", 0),
			);
		case "karpunk":
			// Stateless approximation: decaying resonant phase distortion
			return wrap01(
				phase + amount * Math.sin(TAU * phase * 3) * Math.exp(-phase * 2.5),
			);
		case "fof":
			return clamp(
				wrap01(
					(phase + controlValue("fofOffset", 0) * 0.25) *
						(2 + controlValue("fofRatio", 0.5) * 8),
				) *
					(1 - amount) +
					wrap01(
						(phase + controlValue("fofOffset", 0) * 0.25) *
							(2 + controlValue("fofRatio", 0.5) * 8),
					) *
						Math.exp(
							-(8 + controlValue("fofTightness", 0.5) * 36) *
								(phase - (0.5 + controlValue("fofSkew", 0) * 0.25)) ** 2,
						) *
						amount,
				0,
				1,
			);
		case "sine":
			return phase;
		default:
			return phase;
	}
}

function renderAlgoSample(
	algo: PdAlgo,
	phase: number,
	dcw: number,
	baseWaveform: BaseWaveform,
	algoControls?: AlgoControlValueV1[] | null,
): number {
	if (algo === "karpunk") {
		return Math.sin(TAU * applyPdAlgo(phase, dcw, algo, "saw", algoControls));
	}
	const direct = sampleDirectAlgoPreview(algo, phase);
	if (direct !== null) return direct;
	const warpedPhase = applyPdAlgo(phase, dcw, algo, "saw", algoControls);
	return sampleBaseWave(baseWaveform, warpedPhase);
}

function applyWindow(phase: number, type: WindowType): number {
	if (type === "off") return 1;
	if (type === "saw") return phase;
	if (type === "triangle") return 1 - Math.abs(phase * 2 - 1);
	if (type === "trapezoid") return phase < 0.5 ? 1 : 2 * (1 - phase);
	if (type === "pulse") return phase < 0.5 ? 1 : 0;
	if (type === "doubleSaw") return 1 - Math.abs(2 * ((phase * 2) % 1) - 1);
	return 1;
}

function lerp(a: number, b: number, t: number): number {
	return a + (b - a) * t;
}

export function noteToFreq(note: number): number {
	return 440 * 2 ** ((note - 69) / 12);
}

interface WaveformData {
	out1: Float32Array;
	out2: Float32Array;
	phase: Float32Array;
}

export function computeWaveform(params: {
	warpAAmount: number;
	warpBAmount: number;
	warpAAlgo: PdAlgo;
	warpBAlgo: PdAlgo;
	algo2A: PdAlgo | null;
	algo2B: PdAlgo | null;
	algoBlendA: number;
	algoBlendB: number;
	intPmAmount: number;
	intPmRatio: number;
	extPmAmount: number;
	pmPre: boolean;
	windowType: WindowType;
	line1Level: number;
	line2Level: number;
	line1BaseWaveformA?: BaseWaveform;
	line1BaseWaveformB?: BaseWaveform;
	line2BaseWaveformA?: BaseWaveform;
	line2BaseWaveformB?: BaseWaveform;
	line1AlgoControlsA?: AlgoControlValueV1[];
	line1AlgoControlsB?: AlgoControlValueV1[];
	line2AlgoControlsA?: AlgoControlValueV1[];
	line2AlgoControlsB?: AlgoControlValueV1[];
}): WaveformData {
	const phasor = new Float32Array(N);
	for (let i = 0; i < N; ++i) phasor[i] = i / N;

	const pm = new Float32Array(N);
	for (let i = 0; i < N; ++i) {
		pm[i] =
			params.intPmAmount * Math.sin(TAU * params.intPmRatio * phasor[i]) +
			params.extPmAmount * Math.sin(TAU * 1.5 * phasor[i]);
	}

	if (params.pmPre) {
		for (let i = 0; i < N; ++i) phasor[i] = (phasor[i] + pm[i]) % 1;
	}

	const algoA = resolveAlgoRef(params.warpAAlgo);
	const algoB = resolveAlgoRef(params.warpBAlgo);
	const algo2AResolved = params.algo2A ? resolveAlgoRef(params.algo2A) : null;
	const algo2BResolved = params.algo2B ? resolveAlgoRef(params.algo2B) : null;
	const line1CzA = resolveCzControlsFromEntries(params.line1AlgoControlsA);
	const line1CzB = resolveCzControlsFromEntries(params.line1AlgoControlsB);
	const line2CzA = resolveCzControlsFromEntries(params.line2AlgoControlsA);
	const line2CzB = resolveCzControlsFromEntries(params.line2AlgoControlsB);

	const algoAWaveform: CzWaveform =
		algoA.warpAlgo === "cz101" ? line1CzA.waveform1 : algoA.waveform;
	const algo2AWaveform: CzWaveform =
		algo2AResolved?.warpAlgo === "cz101"
			? line1CzB.waveform1
			: (algo2AResolved?.waveform ?? "saw");
	const algoBWaveform: CzWaveform =
		algoB.warpAlgo === "cz101" ? line2CzA.waveform1 : algoB.waveform;
	const algo2BWaveform: CzWaveform =
		algo2BResolved?.warpAlgo === "cz101"
			? line2CzB.waveform1
			: (algo2BResolved?.waveform ?? "saw");

	const line1Window =
		algoA.warpAlgo === "cz101" && line1CzA.windowFunction !== "off"
			? line1CzA.windowFunction
			: (algoA.windowType ?? params.windowType);
	const line2Window =
		algoB.warpAlgo === "cz101" && line2CzA.windowFunction !== "off"
			? line2CzA.windowFunction
			: (algoB.windowType ?? params.windowType);

	// Aliases for backward compat within this function
	const algo2A = algo2AResolved;
	const algo2B = algo2BResolved;

	if (!params.pmPre) {
		for (let i = 0; i < N; ++i) phasor[i] = (phasor[i] + pm[i]) % 1;
	}

	const phaseA = new Float32Array(N);
	const phaseB = new Float32Array(N);
	const out1 = new Float32Array(N);
	const out2 = new Float32Array(N);
	for (let i = 0; i < N; ++i) {
		phaseA[i] = applyPdAlgo(
			phasor[i],
			params.warpAAmount,
			params.warpAAlgo,
			algoAWaveform,
			params.line1AlgoControlsA,
		);
		phaseB[i] = applyPdAlgo(
			phasor[i],
			params.warpBAmount,
			params.warpBAlgo,
			algoBWaveform,
			params.line2AlgoControlsA,
		);
	}

	for (let i = 0; i < N; ++i) {
		const w1 = applyWindow(phasor[i], line1Window);
		const w2 = applyWindow(phasor[i], line2Window);
		const line1PrimaryCarrier = sampleBaseWave(
			params.line1BaseWaveformA ?? "sine",
			phasor[i],
		);
		const line1SecondaryCarrier = sampleBaseWave(
			params.line1BaseWaveformB ?? "sine",
			phasor[i],
		);
		const line2PrimaryCarrier = sampleBaseWave(
			params.line2BaseWaveformA ?? "sine",
			phasor[i],
		);
		const line2SecondaryCarrier = sampleBaseWave(
			params.line2BaseWaveformB ?? "sine",
			phasor[i],
		);

		if (algo2A && algoA.warpAlgo === "cz101" && algo2A.warpAlgo === "cz101") {
			const cyclePhase = (phasor[i] * 2) % 1;
			const useSecondary = phasor[i] >= 0.5;
			const activeWaveform = useSecondary ? algo2AWaveform : algoAWaveform;
			const activeCarrier = useSecondary
				? sampleBaseWave(params.line1BaseWaveformB ?? "sine", cyclePhase)
				: sampleBaseWave(params.line1BaseWaveformA ?? "sine", cyclePhase);
			out1[i] =
				lerp(
					activeCarrier,
					czWaveform(activeWaveform, cyclePhase),
					params.warpAAmount,
				) *
				w1 *
				params.line1Level;
		} else if (algo2A) {
			const blendA = params.algoBlendA;
			const dcw1eff = params.warpAAmount * (1 - blendA);
			const dcw2A = params.warpAAmount * blendA;
			const sigA1 =
				algoA.warpAlgo === "cz101"
					? lerp(
							line1PrimaryCarrier,
							czWaveform(algoAWaveform, phasor[i]),
							dcw1eff,
						)
					: renderAlgoSample(
							params.warpAAlgo,
							phasor[i],
							dcw1eff,
							params.line1BaseWaveformA ?? "sine",
							params.line1AlgoControlsA,
						);
			const sigA2 =
				algo2A.warpAlgo === "cz101"
					? lerp(
							line1SecondaryCarrier,
							czWaveform(algo2AWaveform, phasor[i]),
							dcw2A,
						)
					: renderAlgoSample(
							params.algo2A as PdAlgo,
							phasor[i],
							dcw2A,
							params.line1BaseWaveformB ?? "sine",
							params.line1AlgoControlsB,
						);
			out1[i] = lerp(sigA1, sigA2, blendA) * w1 * params.line1Level;
		} else if (algoA.warpAlgo === "cz101") {
			out1[i] =
				lerp(
					line1PrimaryCarrier,
					czWaveform(algoAWaveform, phasor[i]),
					params.warpAAmount,
				) *
				w1 *
				params.line1Level;
		} else {
			out1[i] =
				renderAlgoSample(
					params.warpAAlgo,
					phasor[i],
					params.warpAAmount,
					params.line1BaseWaveformA ?? "sine",
					params.line1AlgoControlsA,
				) *
				w1 *
				params.line1Level;
		}

		if (algo2B && algoB.warpAlgo === "cz101" && algo2B.warpAlgo === "cz101") {
			const cyclePhase = (phasor[i] * 2) % 1;
			const useSecondary = phasor[i] >= 0.5;
			const activeWaveform = useSecondary ? algo2BWaveform : algoBWaveform;
			const activeCarrier = useSecondary
				? sampleBaseWave(params.line2BaseWaveformB ?? "sine", cyclePhase)
				: sampleBaseWave(params.line2BaseWaveformA ?? "sine", cyclePhase);
			out2[i] =
				lerp(
					activeCarrier,
					czWaveform(activeWaveform, cyclePhase),
					params.warpBAmount,
				) *
				w2 *
				params.line2Level;
		} else if (algo2B) {
			const blendB = params.algoBlendB;
			const dcw1effB = params.warpBAmount * (1 - blendB);
			const dcw2B = params.warpBAmount * blendB;
			const sigB1 =
				algoB.warpAlgo === "cz101"
					? lerp(
							line2PrimaryCarrier,
							czWaveform(algoBWaveform, phasor[i]),
							dcw1effB,
						)
					: renderAlgoSample(
							params.warpBAlgo,
							phasor[i],
							dcw1effB,
							params.line2BaseWaveformA ?? "sine",
							params.line2AlgoControlsA,
						);
			const sigB2 =
				algo2B.warpAlgo === "cz101"
					? lerp(
							line2SecondaryCarrier,
							czWaveform(algo2BWaveform, phasor[i]),
							dcw2B,
						)
					: renderAlgoSample(
							params.algo2B as PdAlgo,
							phasor[i],
							dcw2B,
							params.line2BaseWaveformB ?? "sine",
							params.line2AlgoControlsB,
						);
			out2[i] = lerp(sigB1, sigB2, blendB) * w2 * params.line2Level;
		} else if (algoB.warpAlgo === "cz101") {
			out2[i] =
				lerp(
					line2PrimaryCarrier,
					czWaveform(algoBWaveform, phasor[i]),
					params.warpBAmount,
				) *
				w2 *
				params.line2Level;
		} else {
			out2[i] =
				renderAlgoSample(
					params.warpBAlgo,
					phasor[i],
					params.warpBAmount,
					params.line2BaseWaveformA ?? "sine",
					params.line2AlgoControlsA,
				) *
				w2 *
				params.line2Level;
		}
	}

	return { out1, out2, phase: phaseA };
}
