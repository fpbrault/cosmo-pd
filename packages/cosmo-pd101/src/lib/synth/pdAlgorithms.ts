import { i18n } from "@/i18n";
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

type AlgoIconPreviewOverride = {
	dcw?: number;
	controls?: AlgoControlValueV1[];
};

const ALGO_ICON_PREVIEW_OVERRIDES: Partial<
	Record<PdAlgo, AlgoIconPreviewOverride>
> = {
	sync: {
		dcw: 0.5,
		controls: [
			{ id: "syncRatio", value: 0.0 },
			{ id: "syncPhase", value: 0 },
			{ id: "syncCurve", value: 0.35 },
			{ id: "syncWindow", value: 0.9 },
		],
	},
	fold: {
		dcw: 0,
		controls: [
			{ id: "foldStages", value: 0 },
			{ id: "foldTilt", value: 0 },
			{ id: "foldSymmetry", value: 0 },
			{ id: "foldSoftness", value: 0.0 },
		],
	},
	twist: {
		dcw: 1,
		controls: [
			{ id: "twistHarmonics", value: 0.2 },
			{ id: "twistDepth", value: 0.5 },
			{ id: "twistPhase", value: 0 },
			{ id: "twistShape", value: 0.5 },
		],
	},
};

const CZ_MONOGRAM_ICON =
	"M10.8 7.8C8.6 7.8 7.2 9.3 7.2 12C7.2 14.7 8.6 16.2 10.8 16.2M13.6 8H18.2L13.9 12H18.2L13.6 16H18.2";

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

const sampleAlgoForIcon = (algo: PdAlgo, phase: number): number => {
	const previewOverride = ALGO_ICON_PREVIEW_OVERRIDES[algo];
	const iconDcw = previewOverride?.dcw ?? 1;
	const iconControls = previewOverride?.controls;

	const resolved = resolveAlgoRef(algo);
	if (resolved.warpAlgo === "cz101") {
		const warpedPhase = pdCz101(phase, 0.72);
		const raw = czWaveform(resolved.waveform, warpedPhase);
		const window = 0.35 + 0.65 * applyWindow(phase, "triangle");
		const accent =
			0.14 * Math.sin(TAU * phase * 2) * (1 - Math.abs(phase - 0.5));
		return clamp(raw * window + accent, -1, 1);
	}

	const direct = sampleDirectAlgoPreview(algo, phase);
	if (direct !== null) return direct;

	return renderAlgoSample(
		algo,
		phase,
		iconDcw,
		getAlgoDefinition(algo)?.defaultBaseWaveform ?? "sine",
		iconControls,
	);
};

const getAlgoIcon = (algo: PdAlgo): string => {
	if (algo === "cz101") return CZ_MONOGRAM_ICON;
	return generatePath((phase) => sampleAlgoForIcon(algo, phase));
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

export function getPdAlgoBehaviorDescription(algo: PdAlgo): string {
	const translated = i18n.t(`algos.${algo}.behavior`, { defaultValue: "" });
	return (
		translated ||
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
		{ level: 0, rate: 50 },
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

function pdTerrain(
	phase: number,
	amount: number,
	ratio = 2,
	depth = 0.5,
	fmPhase = 0,
	shape = 0,
): number {
	const displacementScale = amount * depth * 0.35;
	if (displacementScale === 0) return phase;

	const fmX = ratio * phase + fmPhase;
	const shapeClamped = clamp(shape, 0, 1);
	const sawX = fmX - Math.floor(fmX);
	const sawMod = 2 * sawX - 1;

	const modulator =
		shapeClamped <= 0
			? Math.sin(TAU * fmX)
			: shapeClamped >= 1
				? sawMod
				: lerp(Math.sin(TAU * fmX), sawMod, shapeClamped);

	return wrap01(phase + displacementScale * modulator);
}

function pdStutter(
	phase: number,
	amount: number,
	segs = 0.25,
	reverse = 1,
	slip = 0,
	spacing = 0,
): number {
	if (amount === 0) return phase;

	const n = clamp(2 + Math.round(segs * 6), 2, 8);
	const invN = 1 / n;
	const scaled = phase * n;
	const seg = Math.floor(scaled);
	const local = scaled - seg;

	const period = 2 + clamp(Math.round(spacing * 2), 0, 2);
	const shouldReverse = seg % period === 1;
	const revBlend = shouldReverse ? reverse : 0;
	const localWarped = local + (1 - 2 * local) * revBlend;

	const slipOffset = slip * seg * invN * 0.5;
	const warped = wrap01(seg * invN + localWarped * invN + slipOffset);
	return lerp(phase, warped, amount);
}

function pdCheby(
	phase: number,
	amount: number,
	order = 0.2,
	tilt = 0,
	warp = 0,
	mix = 1,
): number {
	const mixAmt = mix * amount;
	if (mixAmt === 0) return phase;

	const n = 1 + order * 5;
	const prePhase = warp === 0 ? phase : wrap01(phase + warp * 0.25);
	const innerTheta = n * TAU * prePhase + tilt * TAU;
	const poly = Math.acos(Math.cos(innerTheta)) / Math.PI;
	return phase + (poly - phase) * mixAmt;
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
		case "terrain":
			return pdTerrain(
				phase,
				amount,
				controlValue("terrainRatio", 2),
				controlValue("terrainDepth", 0.5),
				controlValue("terrainFmPhase", 0),
				controlValue("terrainShape", 0),
			);
		case "stutter":
			return pdStutter(
				phase,
				amount,
				controlValue("stutterSegs", 0.25),
				controlValue("stutterReverse", 1),
				controlValue("stutterSlip", 0),
				controlValue("stutterSpacing", 0),
			);
		case "cheby":
			return pdCheby(
				phase,
				amount,
				controlValue("chebyOrder", 0.2),
				controlValue("chebyTilt", 0),
				controlValue("chebyWarp", 0),
				controlValue("chebyMix", 1),
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
	pmPostMod = 0,
): number {
	if (algo === "karpunk") {
		return Math.sin(TAU * applyPdAlgo(phase, dcw, algo, "saw", algoControls));
	}
	const direct = sampleDirectAlgoPreview(algo, phase);
	if (direct !== null) return direct;
	const warpedPhase = applyPdAlgo(phase, dcw, algo, "saw", algoControls);
	return sampleBaseWave(baseWaveform, warpedPhase + pmPostMod);
}

function warpPhaseForCzWaveform(
	waveformId: CzWaveform,
	phase: number,
	dcw: number,
): number {
	const amount = clamp(dcw, 0, 0.999);
	switch (waveformId) {
		case "saw": {
			const peak = lerp(0.5, 0.01, amount);
			return phase < peak
				? (phase / peak) * 0.5
				: 0.5 + ((phase - peak) / (1 - peak)) * 0.5;
		}
		case "square": {
			const peak = lerp(0.5, 0.01, amount);
			const fall = lerp(1, 0.51, amount);
			if (phase < peak) return (phase / peak) * 0.5;
			if (phase < 0.5) return 0.5;
			if (phase < fall) return 0.5 + ((phase - 0.5) / (fall - 0.5)) * 0.5;
			return 1;
		}
		case "pulse": {
			const peak = lerp(0.5, 0.01, amount);
			const hold = lerp(0.5, 0.03, amount);
			const fall = lerp(1, 0.04, amount);
			if (phase < peak) return (phase / peak) * 0.5;
			if (phase < hold) return 0.5;
			if (phase < fall) return 0.5 + ((phase - hold) / (fall - hold)) * 0.5;
			return 1;
		}
		case "null": {
			const peak = lerp(0.5, 0.01, amount);
			return phase < peak ? (phase / peak) * 0.5 : 1;
		}
		case "sinePulse": {
			const end = lerp(1, 0.5, amount);
			if (end >= 0.999) return phase;
			return phase < end ? phase / end : (phase - end) / (1 - end);
		}
		case "sawPulse": {
			const peak = lerp(0.5, 0.01, amount);
			const end = lerp(1, 0.5, amount);
			if (phase < peak) return (phase / peak) * 0.5;
			if (phase < end) return 0.5 + ((phase - peak) / (end - peak)) * 0.5;
			return 1;
		}
		case "multiSine":
			return wrap01(phase * lerp(1, 15, amount));
		case "pulse2": {
			const p = wrap01(phase * 2);
			const peak = lerp(0.5, 0.01, amount);
			const hold = lerp(0.5, 0.01, amount);
			const fall = lerp(1, 0.01, amount);
			if (p < peak) return (p / peak) * 0.5;
			if (p < hold) return 0.5;
			if (p < fall) return 0.5 + ((p - hold) / (fall - hold)) * 0.5;
			return 1;
		}
		default:
			return phase;
	}
}

type ResolvedAlgoRef = ReturnType<typeof resolveAlgoRef>;
type ResolvedCzControls = ReturnType<typeof resolveCzControlsFromEntries>;

function resolvedAlgoUsesCzCyclePair(
	resolved: ResolvedAlgoRef | null,
	czControls: ResolvedCzControls,
): boolean {
	return (
		resolved?.warpAlgo === "cz101" &&
		czControls.waveform1 !== czControls.waveform2
	);
}

function resolvePreviewWindow(
	resolved: ResolvedAlgoRef,
	czControls: ResolvedCzControls,
	fallback: WindowType,
): WindowType {
	return resolved.warpAlgo === "cz101"
		? czControls.windowFunction
		: (resolved.windowType ?? fallback);
}

function renderResolvedAlgoSample({
	algo,
	resolved,
	czControls,
	phase,
	dcw,
	baseWaveform,
	algoControls,
	cycleIndex,
	pmPostMod = 0,
}: {
	algo: PdAlgo;
	resolved: ResolvedAlgoRef;
	czControls: ResolvedCzControls;
	phase: number;
	dcw: number;
	baseWaveform: BaseWaveform;
	algoControls?: AlgoControlValueV1[];
	cycleIndex: number;
	pmPostMod?: number;
}): number {
	if (resolved.warpAlgo === "cz101") {
		const waveform =
			cycleIndex % 2 === 0 ? czControls.waveform1 : czControls.waveform2;
		return sampleBaseWave(
			baseWaveform,
			warpPhaseForCzWaveform(waveform, phase, dcw) + pmPostMod,
		);
	}

	if (!isWarpAlgo(resolved.warpAlgo)) {
		return sampleBaseWave(
			baseWaveform,
			warpPhaseForCzWaveform(resolved.waveform, phase, dcw) + pmPostMod,
		);
	}

	return renderAlgoSample(
		algo,
		phase,
		dcw,
		baseWaveform,
		algoControls,
		pmPostMod,
	);
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
	sampleCount?: number;
}): WaveformData {
	const sampleCount = Number.isFinite(params.sampleCount)
		? Math.max(64, Math.floor(params.sampleCount as number))
		: N;

	const phasor = new Float32Array(sampleCount);
	for (let i = 0; i < sampleCount; ++i) phasor[i] = i / sampleCount;

	const pm = new Float32Array(sampleCount);
	for (let i = 0; i < sampleCount; ++i) {
		pm[i] =
			params.intPmAmount * Math.sin(TAU * params.intPmRatio * phasor[i]) +
			params.extPmAmount * Math.sin(TAU * 1.5 * phasor[i]);
	}

	if (params.pmPre) {
		for (let i = 0; i < sampleCount; ++i) phasor[i] = (phasor[i] + pm[i]) % 1;
	}

	const algoA = resolveAlgoRef(params.warpAAlgo);
	const algoB = resolveAlgoRef(params.warpBAlgo);
	const algo2AResolved = params.algo2A ? resolveAlgoRef(params.algo2A) : null;
	const algo2BResolved = params.algo2B ? resolveAlgoRef(params.algo2B) : null;
	const line1CzA = resolveCzControlsFromEntries(params.line1AlgoControlsA);
	const line1CzB = resolveCzControlsFromEntries(params.line1AlgoControlsB);
	const line2CzA = resolveCzControlsFromEntries(params.line2AlgoControlsA);
	const line2CzB = resolveCzControlsFromEntries(params.line2AlgoControlsB);
	const line1PrimaryWindow = resolvePreviewWindow(
		algoA,
		line1CzA,
		params.windowType,
	);
	const line1SecondaryWindow = algo2AResolved
		? resolvePreviewWindow(algo2AResolved, line1CzB, params.windowType)
		: line1PrimaryWindow;
	const line2PrimaryWindow = resolvePreviewWindow(
		algoB,
		line2CzA,
		params.windowType,
	);
	const line2SecondaryWindow = algo2BResolved
		? resolvePreviewWindow(algo2BResolved, line2CzB, params.windowType)
		: line2PrimaryWindow;
	const line1UsesCzCyclePair =
		resolvedAlgoUsesCzCyclePair(algoA, line1CzA) ||
		resolvedAlgoUsesCzCyclePair(algo2AResolved, line1CzB);
	const line2UsesCzCyclePair =
		resolvedAlgoUsesCzCyclePair(algoB, line2CzA) ||
		resolvedAlgoUsesCzCyclePair(algo2BResolved, line2CzB);

	// Aliases for backward compat within this function
	const algo2A = algo2AResolved;
	const algo2B = algo2BResolved;

	const phaseA = new Float32Array(sampleCount);
	const out1 = new Float32Array(sampleCount);
	const out2 = new Float32Array(sampleCount);
	for (let i = 0; i < sampleCount; ++i) {
		const line1Phase = line1UsesCzCyclePair ? wrap01(phasor[i] * 2) : phasor[i];
		const line1Cycle = line1UsesCzCyclePair && phasor[i] >= 0.5 ? 1 : 0;
		const line2Phase = line2UsesCzCyclePair ? wrap01(phasor[i] * 2) : phasor[i];
		const line2Cycle = line2UsesCzCyclePair && phasor[i] >= 0.5 ? 1 : 0;
		const pmPostMod = params.pmPre ? 0 : pm[i];

		phaseA[i] = line1Phase;

		if (algo2A) {
			const blendA = params.algoBlendA;
			const primary =
				renderResolvedAlgoSample({
					algo: params.warpAAlgo,
					resolved: algoA,
					czControls: line1CzA,
					phase: line1Phase,
					dcw: params.warpAAmount * (1 - blendA),
					baseWaveform: params.line1BaseWaveformA ?? "sine",
					algoControls: params.line1AlgoControlsA,
					cycleIndex: line1Cycle,
					pmPostMod,
				}) * applyWindow(line1Phase, line1PrimaryWindow);
			const secondary =
				renderResolvedAlgoSample({
					algo: params.algo2A as PdAlgo,
					resolved: algo2A,
					czControls: line1CzB,
					phase: line1Phase,
					dcw: params.warpAAmount * blendA,
					baseWaveform: params.line1BaseWaveformB ?? "sine",
					algoControls: params.line1AlgoControlsB,
					cycleIndex: line1Cycle,
					pmPostMod,
				}) * applyWindow(line1Phase, line1SecondaryWindow);
			out1[i] = lerp(primary, secondary, blendA) * params.line1Level;
		} else {
			out1[i] =
				renderResolvedAlgoSample({
					algo: params.warpAAlgo,
					resolved: algoA,
					czControls: line1CzA,
					phase: line1Phase,
					dcw: params.warpAAmount,
					baseWaveform: params.line1BaseWaveformA ?? "sine",
					algoControls: params.line1AlgoControlsA,
					cycleIndex: line1Cycle,
					pmPostMod,
				}) *
				applyWindow(line1Phase, line1PrimaryWindow) *
				params.line1Level;
		}

		if (algo2B) {
			const blendB = params.algoBlendB;
			const primary =
				renderResolvedAlgoSample({
					algo: params.warpBAlgo,
					resolved: algoB,
					czControls: line2CzA,
					phase: line2Phase,
					dcw: params.warpBAmount * (1 - blendB),
					baseWaveform: params.line2BaseWaveformA ?? "sine",
					algoControls: params.line2AlgoControlsA,
					cycleIndex: line2Cycle,
					pmPostMod,
				}) * applyWindow(line2Phase, line2PrimaryWindow);
			const secondary =
				renderResolvedAlgoSample({
					algo: params.algo2B as PdAlgo,
					resolved: algo2B,
					czControls: line2CzB,
					phase: line2Phase,
					dcw: params.warpBAmount * blendB,
					baseWaveform: params.line2BaseWaveformB ?? "sine",
					algoControls: params.line2AlgoControlsB,
					cycleIndex: line2Cycle,
					pmPostMod,
				}) * applyWindow(line2Phase, line2SecondaryWindow);
			out2[i] = lerp(primary, secondary, blendB) * params.line2Level;
		} else {
			out2[i] =
				renderResolvedAlgoSample({
					algo: params.warpBAlgo,
					resolved: algoB,
					czControls: line2CzA,
					phase: line2Phase,
					dcw: params.warpBAmount,
					baseWaveform: params.line2BaseWaveformA ?? "sine",
					algoControls: params.line2AlgoControlsA,
					cycleIndex: line2Cycle,
					pmPostMod,
				}) *
				applyWindow(line2Phase, line2PrimaryWindow) *
				params.line2Level;
		}
	}

	return { out1, out2, phase: phaseA };
}
