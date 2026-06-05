import type { Algo } from "@/lib/synth/bindings/synth";

const TAU = Math.PI * 2;

export type PdAlgo = Algo;

function wrap01(value: number): number {
	const wrapped = value % 1;
	return wrapped < 0 ? wrapped + 1 : wrapped;
}

function clamp(value: number, min: number, max: number): number {
	return Math.max(min, Math.min(max, value));
}

function lerp(a: number, b: number, t: number): number {
	return a + (b - a) * t;
}

export function pdBend(
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

export function pdSync(
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

export function pdPinch(
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

export function pdFold(
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

export function pdSkew(
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

export function pdTwist(
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

export function pdClip(
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

export function pdRipple(
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

export function pdMirror(
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

export function pdTerrain(
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

export function pdStutter(
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

export function pdCheby(
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

export function pdCz101(phase: number, amount: number): number {
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
