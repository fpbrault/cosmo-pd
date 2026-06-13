import { sampleAt } from "./processing";
import type { ScopeThemePalette } from "./types";

export const SPECTROGRAM_BINS = 56;

type Rgb = { r: number; g: number; b: number };

function parseHexColor(color: string): Rgb {
	const hex = color.startsWith("#") ? color.slice(1) : color;
	if (hex.length === 3) {
		return {
			r: Number.parseInt(hex[0] + hex[0], 16),
			g: Number.parseInt(hex[1] + hex[1], 16),
			b: Number.parseInt(hex[2] + hex[2], 16),
		};
	}
	if (hex.length >= 6) {
		return {
			r: Number.parseInt(hex.slice(0, 2), 16),
			g: Number.parseInt(hex.slice(2, 4), 16),
			b: Number.parseInt(hex.slice(4, 6), 16),
		};
	}
	return { r: 0, g: 0, b: 0 };
}

function mixChannel(a: number, b: number, t: number): number {
	return Math.round(a + (b - a) * t);
}

function mixColorWithAlpha(
	from: string,
	to: string,
	t: number,
	alpha: number,
): string {
	const a = parseHexColor(from);
	const b = parseHexColor(to);
	return `rgba(${mixChannel(a.r, b.r, t)}, ${mixChannel(a.g, b.g, t)}, ${mixChannel(a.b, b.b, t)}, ${Math.max(0, Math.min(1, alpha))})`;
}

export function downsampleBins(
	source: Uint8Array<ArrayBufferLike>,
	targetBins: number,
) {
	if (source.length === targetBins) return source;
	const out = new Uint8Array(targetBins);
	for (let i = 0; i < targetBins; i++) {
		const start = Math.floor((i / targetBins) * source.length);
		const end = Math.floor(((i + 1) / targetBins) * source.length);
		let sum = 0;
		let count = 0;
		for (let j = start; j < Math.max(start + 1, end); j++) {
			sum += source[j] ?? 0;
			count++;
		}
		out[i] = Math.round(sum / Math.max(1, count));
	}
	return out;
}

export function computeDftBins(
	samples: Uint8Array | Float32Array,
	binCount: number,
	maxFftSize = 256,
): Uint8Array {
	const fftSize = Math.min(maxFftSize, samples.length);
	if (fftSize <= 0) return new Uint8Array(binCount);
	const windowed = new Float32Array(fftSize);
	const start = Math.max(0, samples.length - fftSize);
	for (let i = 0; i < fftSize; i++) {
		const hann = 0.5 - 0.5 * Math.cos((2 * Math.PI * i) / (fftSize - 1));
		windowed[i] = sampleAt(samples, start + i) * hann;
	}
	const minNorm = 1 / fftSize;
	const maxNorm = 0.5;
	const normRatio = maxNorm / minNorm;
	const out = new Uint8Array(binCount);
	for (let bin = 0; bin < binCount; bin++) {
		const t = binCount <= 1 ? 0 : bin / (binCount - 1);
		const normFreq = minNorm * normRatio ** t;
		const k = Math.max(
			1,
			Math.min(fftSize / 2 - 1, Math.round(normFreq * fftSize)),
		);
		let real = 0;
		let imag = 0;
		for (let n = 0; n < fftSize; n++) {
			const sample = windowed[n];
			const phase = (2 * Math.PI * k * n) / fftSize;
			real += sample * Math.cos(phase);
			imag -= sample * Math.sin(phase);
		}
		const magnitude =
			Math.sqrt(real * real + imag * imag) / Math.max(1, fftSize);
		const db = 20 * Math.log10(Math.max(1e-6, magnitude));
		const normalized = (db + 72) / 72;
		out[bin] = Math.max(0, Math.min(255, Math.round(normalized * 255)));
	}
	return out;
}

export function spectrogramColor(
	value: number,
	palette: ScopeThemePalette,
): string {
	const v = Math.max(0, Math.min(255, value));
	const t = v / 255;
	const eased = t * t * (3 - 2 * t);

	if (eased <= 0.5) {
		const localT = eased / 0.5;
		return mixColorWithAlpha(
			palette.spectrogramLow,
			palette.spectrogramMid,
			localT,
			0.46 + localT * 0.3,
		);
	}

	const localT = (eased - 0.5) / 0.5;
	return mixColorWithAlpha(
		palette.spectrogramMid,
		palette.spectrogramHigh,
		localT,
		0.76 + localT * 0.18,
	);
}
