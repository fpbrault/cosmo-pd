const MOD_ENV_TIME_MAX_S = 20;
const MOD_ENV_TIME_EXPONENT = 3.91073;
export const MOD_ENV_PREVIEW_WIDTH = 220;
export const MOD_ENV_PREVIEW_HEIGHT = 64;
const MOD_ENV_X0 = 6;
export const MOD_ENV_X_MAX = MOD_ENV_PREVIEW_WIDTH - 6;
const MOD_ENV_TOP = 8;
const MOD_ENV_BOTTOM = 56;
const MOD_ENV_SUSTAIN_SPAN = (MOD_ENV_BOTTOM - MOD_ENV_TOP) * 0.78;

export const ATTACK_WIDTH_SCALE = 84;
export const DECAY_WIDTH_SCALE = 66;
export const RELEASE_WIDTH_SCALE = 92;

export type EnvelopeHandle = "attack" | "decaySustain" | "release";

export function clamp01(value: number): number {
	return Math.max(0, Math.min(1, value));
}

export function normToEnvSeconds(norm: number): number {
	return MOD_ENV_TIME_MAX_S * clamp01(norm) ** MOD_ENV_TIME_EXPONENT;
}

export function envSecondsToNorm(seconds: number): number {
	if (seconds <= 0) {
		return 0;
	}
	return clamp01((seconds / MOD_ENV_TIME_MAX_S) ** (1 / MOD_ENV_TIME_EXPONENT));
}

function formatCompactValue(value: number): string {
	if (!Number.isFinite(value) || value <= 0) {
		return "0";
	}
	if (value >= 100) {
		return value.toFixed(0);
	}
	if (value >= 10) {
		return value.toFixed(1);
	}
	if (value >= 1) {
		return value.toFixed(2);
	}
	return value.toFixed(3);
}

export function formatEnvTime(seconds: number): string {
	if (seconds < 1) {
		return `${Math.round(seconds * 1000)}ms`;
	}
	return `${formatCompactValue(seconds)}s`;
}

export function buildAdsrGeometry(
	attack: number,
	decay: number,
	sustain: number,
	release: number,
) {
	const top = MOD_ENV_TOP;
	const bottom = MOD_ENV_BOTTOM;
	const x0 = MOD_ENV_X0;
	const xMax = MOD_ENV_X_MAX;
	const aW = Math.max(0, Math.log10(attack + 1) * ATTACK_WIDTH_SCALE);
	const dW = Math.max(12, Math.log10(decay + 1) * DECAY_WIDTH_SCALE);
	const rW = Math.max(0, Math.log10(release + 1) * RELEASE_WIDTH_SCALE);

	const x1 = x0 + aW;
	const x2 = x1 + dW;
	const x3 = x2;
	const x4 = Math.min(xMax, x3 + rW);

	const ySustain = bottom - clamp01(sustain) * MOD_ENV_SUSTAIN_SPAN;

	return { x0, x1, x2, x3, x4, top, bottom, ySustain };
}

export function adsrPreviewPath(
	attack: number,
	decay: number,
	sustain: number,
	release: number,
): string {
	const { x0, x1, x2, x3, x4, top, bottom, ySustain } = buildAdsrGeometry(
		attack,
		decay,
		sustain,
		release,
	);

	return [
		`M ${x0.toFixed(2)} ${bottom.toFixed(2)}`,
		`L ${x1.toFixed(2)} ${top.toFixed(2)}`,
		`L ${x2.toFixed(2)} ${ySustain.toFixed(2)}`,
		`L ${x3.toFixed(2)} ${ySustain.toFixed(2)}`,
		`L ${x4.toFixed(2)} ${bottom.toFixed(2)}`,
	].join(" ");
}

export function widthToSeconds(width: number, scale: number): number {
	if (width <= 0) {
		return 0;
	}
	return Math.min(MOD_ENV_TIME_MAX_S, Math.max(0, 10 ** (width / scale) - 1));
}

export function clientToSvgPoint(event: PointerEvent, svg: SVGSVGElement) {
	const rect = svg.getBoundingClientRect();
	const x = ((event.clientX - rect.left) / rect.width) * MOD_ENV_PREVIEW_WIDTH;
	const y = ((event.clientY - rect.top) / rect.height) * MOD_ENV_PREVIEW_HEIGHT;
	return { x, y };
}

function interpolateY(
	x: number,
	x0: number,
	y0: number,
	x1: number,
	y1: number,
) {
	if (Math.abs(x1 - x0) < 1e-6) {
		return y1;
	}
	const t = (x - x0) / (x1 - x0);
	return y0 + (y1 - y0) * t;
}

function envelopeYAtX(geo: ReturnType<typeof buildAdsrGeometry>, x: number) {
	const clampedX = Math.max(geo.x0, Math.min(geo.x4, x));

	if (clampedX <= geo.x1) {
		return interpolateY(clampedX, geo.x0, geo.bottom, geo.x1, geo.top);
	}

	if (clampedX <= geo.x2) {
		return interpolateY(clampedX, geo.x1, geo.top, geo.x2, geo.ySustain);
	}

	if (clampedX <= geo.x3) {
		return geo.ySustain;
	}

	return interpolateY(clampedX, geo.x3, geo.ySustain, geo.x4, geo.bottom);
}

export function estimateEnvelopeMarker(
	geo: ReturnType<typeof buildAdsrGeometry>,
	value: number,
	prevValue: number,
	sustain: number,
	prevMarkerX: number | null,
) {
	const envValue = clamp01(value);
	const prev = clamp01(prevValue);
	const delta = envValue - prev;
	const slopeEpsilon = 0.00001;

	const attackX = geo.x0 + (geo.x1 - geo.x0) * envValue;
	const decayX =
		geo.x1 +
		(geo.x2 - geo.x1) * clamp01((1 - envValue) / Math.max(0.001, 1 - sustain));
	const releaseX =
		geo.x3 +
		(geo.x4 - geo.x3) *
			clamp01((sustain - envValue) / Math.max(0.001, sustain));

	let x = geo.x0;
	if (envValue <= 0.001) {
		x = geo.x0;
	} else if (delta > slopeEpsilon) {
		x = attackX;
	} else if (delta < -slopeEpsilon) {
		x = envValue > sustain + 0.02 ? decayX : releaseX;
	} else if (Math.abs(envValue - sustain) <= 0.03) {
		x = geo.x3;
	} else {
		const candidates = [attackX, decayX, geo.x3, releaseX].filter((candidate) =>
			Number.isFinite(candidate),
		);
		if (prevMarkerX == null || candidates.length === 0) {
			x = geo.x3;
		} else {
			x = candidates.reduce((closest, candidate) => {
				return Math.abs(candidate - prevMarkerX) <
					Math.abs(closest - prevMarkerX)
					? candidate
					: closest;
			});
		}
	}

	const y = envelopeYAtX(geo, x);
	return { x, y };
}
