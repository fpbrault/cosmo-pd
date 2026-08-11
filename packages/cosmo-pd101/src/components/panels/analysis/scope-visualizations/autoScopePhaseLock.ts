import { sampleAt } from "./processing";
import type { ScopeWindow } from "./types";

export type ScopeLockState = "locked" | "fallback" | "hold";

export type ScopeLockResult = {
	state: ScopeLockState;
	window: ScopeWindow;
	/** A stable, already-windowed frame used when the renderer is holding. */
	heldSamples?: Float32Array;
};

const TEMPLATE_SIZE = 64;
const MIN_PERIOD_SAMPLES = 8;
const MAX_PERIOD_SEARCH_RATIO = 2;
const MIN_PERIOD_SEARCH_RATIO = 0.5;
const MIN_SIGNAL_RANGE = 0.0001;
const MIN_LOCK_SCORE = 0.58;
const MIN_PERIOD_CORRELATION = 0.25;
const HOLD_FRAMES = 3;
const MAX_TEMPLATE_CANDIDATES = 64;

type SignalStats = {
	mean: number;
	range: number;
};

type PeriodEstimate = {
	period: number;
	correlation: number;
};

/**
 * Keeps a rolling oscilloscope display locked to the same landmark in a
 * repeating waveform. The pitch-derived period remains the display period;
 * autocorrelation is only used to decide whether phase locking is reliable.
 */
export class AutoScopePhaseLock {
	private template: Float32Array | null = null;
	private period: number | null = null;
	private missedFrames = 0;
	private lastStableWindow: ScopeWindow | null = null;
	private lastStableSamples: Float32Array | null = null;

	reset(): void {
		this.template = null;
		this.period = null;
		this.missedFrames = 0;
		this.lastStableWindow = null;
		this.lastStableSamples = null;
	}

	resolve(
		samples: Uint8Array | Float32Array,
		hz: number,
		sampleRate: number,
		cycles: number,
	): ScopeLockResult {
		const hintedPeriod = Math.max(
			MIN_PERIOD_SAMPLES,
			sampleRate / Math.max(1, hz),
		);
		const displayWindow = createScopeWindow(
			samples.length,
			hintedPeriod,
			cycles,
		);

		if (samples.length < MIN_PERIOD_SAMPLES + 3) {
			this.reset();
			return fallbackResult(displayWindow);
		}

		const stats = calculateSignalStats(samples);
		if (stats.range < MIN_SIGNAL_RANGE) {
			this.reset();
			return fallbackResult(displayWindow);
		}

		// A lag needs roughly two complete comparisons in the payload. If the
		// true period is longer than that, retain it for rendering and use the
		// non-freezing fallback instead of inventing a shorter period.
		const maxEstimableLag = Math.floor((samples.length - 2) / 2);
		if (hintedPeriod > maxEstimableLag) {
			this.reset();
			return fallbackResult(
				chooseFallbackWindow(samples, stats, displayWindow),
			);
		}

		const estimate = estimateSignalPeriod(samples, stats.mean, hintedPeriod);
		if (!estimate || estimate.correlation < MIN_PERIOD_CORRELATION) {
			this.template = null;
			this.period = hintedPeriod;
			this.missedFrames = 0;
			return fallbackResult(
				chooseFallbackWindow(samples, stats, displayWindow),
			);
		}

		const periodChangedSharply =
			this.period != null &&
			Math.abs(Math.log(estimate.period / this.period)) > Math.log(1.35);
		if (periodChangedSharply) {
			this.template = null;
		}
		this.period =
			this.period == null || periodChangedSharply
				? estimate.period
				: this.period + 0.28 * (estimate.period - this.period);

		const maxTemplateStart = Math.max(
			0,
			Math.min(
				samples.length - Math.ceil(this.period) - 1,
				samples.length - displayWindow.count - 1,
			),
		);
		const candidates = findRisingMeanCrossings(
			samples,
			stats.mean,
			maxTemplateStart,
		);

		if (this.template == null) {
			const start = chooseStrongestLandmark(
				samples,
				stats,
				candidates,
				maxTemplateStart,
				this.period,
			);
			this.template = captureTemplate(samples, start, this.period, stats.mean);
			this.missedFrames = 0;
			return this.lockedResult(samples, { ...displayWindow, start });
		}

		const match = findBestTemplateMatch(
			samples,
			stats.mean,
			this.period,
			this.template,
			limitTemplateCandidates(candidates, this.period),
			maxTemplateStart,
		);
		if (match && match.score >= MIN_LOCK_SCORE) {
			const captured = captureTemplate(
				samples,
				match.start,
				this.period,
				stats.mean,
			);
			blendTemplate(
				this.template,
				captured,
				estimate.correlation > 0.8 ? 0.12 : 0.04,
			);
			this.missedFrames = 0;
			return this.lockedResult(samples, {
				...displayWindow,
				start: match.start,
			});
		}

		this.missedFrames++;
		if (this.missedFrames <= HOLD_FRAMES && this.lastStableSamples) {
			return {
				state: "hold",
				window: {
					start: 0,
					count:
						this.lastStableWindow?.count ?? this.lastStableSamples.length - 2,
					samplesPerCycle:
						this.lastStableWindow?.samplesPerCycle ?? hintedPeriod,
				},
				heldSamples: this.lastStableSamples,
			};
		}

		this.template = null;
		this.period = hintedPeriod;
		this.missedFrames = 0;
		this.lastStableWindow = null;
		this.lastStableSamples = null;
		return fallbackResult(chooseFallbackWindow(samples, stats, displayWindow));
	}

	private lockedResult(
		samples: Uint8Array | Float32Array,
		window: ScopeWindow,
	): ScopeLockResult {
		this.lastStableWindow = window;
		this.lastStableSamples = captureStableSamples(samples, window);
		return { state: "locked", window };
	}
}

function fallbackResult(window: ScopeWindow): ScopeLockResult {
	return { state: "fallback", window };
}

function calculateSignalStats(samples: Uint8Array | Float32Array): SignalStats {
	let sum = 0;
	let min = Number.POSITIVE_INFINITY;
	let max = Number.NEGATIVE_INFINITY;
	for (let index = 0; index < samples.length; index++) {
		const sample = sampleAt(samples, index);
		sum += sample;
		min = Math.min(min, sample);
		max = Math.max(max, sample);
	}
	return { mean: sum / samples.length, range: max - min };
}

function estimateSignalPeriod(
	samples: Uint8Array | Float32Array,
	mean: number,
	hintedPeriod: number,
): PeriodEstimate | null {
	const maxLag = Math.min(
		Math.floor(hintedPeriod * MAX_PERIOD_SEARCH_RATIO),
		Math.floor((samples.length - 2) / 2),
	);
	const minLag = Math.max(
		MIN_PERIOD_SAMPLES,
		Math.floor(hintedPeriod * MIN_PERIOD_SEARCH_RATIO),
	);
	if (minLag > maxLag) return null;

	let bestPeriod = clamp(Math.round(hintedPeriod), minLag, maxLag);
	let bestCorrelation = -1;
	let bestScore = Number.NEGATIVE_INFINITY;
	for (let lag = minLag; lag <= maxLag; lag++) {
		const correlation = calculateLagCorrelation(samples, mean, lag);
		const distancePenalty = Math.abs(Math.log(lag / hintedPeriod)) * 0.055;
		const score = correlation - distancePenalty;
		if (score > bestScore) {
			bestScore = score;
			bestCorrelation = correlation;
			bestPeriod = lag;
		}
	}
	return { period: bestPeriod, correlation: bestCorrelation };
}

function calculateLagCorrelation(
	samples: Uint8Array | Float32Array,
	mean: number,
	lag: number,
): number {
	const available = samples.length - lag;
	const stride = Math.max(1, Math.floor(available / 128));
	let product = 0;
	let energyA = 0;
	let energyB = 0;
	for (let index = 0; index < available; index += stride) {
		const a = sampleAt(samples, index) - mean;
		const b = sampleAt(samples, index + lag) - mean;
		product += a * b;
		energyA += a * a;
		energyB += b * b;
	}
	const denominator = Math.sqrt(energyA * energyB);
	return denominator > 1e-9 ? product / denominator : -1;
}

function createScopeWindow(
	sampleCount: number,
	period: number,
	cycles: number,
): ScopeWindow {
	if (sampleCount <= 2) {
		return {
			start: 0,
			count: Math.max(0, sampleCount),
			samplesPerCycle: period,
		};
	}
	const requested = Math.max(16, Math.round(period * cycles));
	const count = Math.max(8, Math.min(sampleCount - 2, requested));
	return {
		start: Math.max(1, Math.floor((sampleCount - count) / 2)),
		count,
		samplesPerCycle: period,
	};
}

function chooseFallbackWindow(
	samples: Uint8Array | Float32Array,
	stats: SignalStats,
	window: ScopeWindow,
): ScopeWindow {
	const maxStart = Math.max(1, samples.length - window.count - 1);
	const candidates = findRisingMeanCrossings(samples, stats.mean, maxStart);
	if (candidates.length === 0) return window;
	return {
		...window,
		start: chooseStrongestLandmark(
			samples,
			stats,
			candidates,
			maxStart,
			window.samplesPerCycle,
		),
	};
}

function findRisingMeanCrossings(
	samples: Uint8Array | Float32Array,
	mean: number,
	maxStart: number,
): number[] {
	const candidates: number[] = [];
	for (let index = 1; index <= maxStart; index++) {
		if (
			sampleAt(samples, index - 1) < mean &&
			sampleAt(samples, index) >= mean
		) {
			candidates.push(index);
		}
	}
	return candidates;
}

function chooseStrongestLandmark(
	samples: Uint8Array | Float32Array,
	stats: SignalStats,
	candidates: number[],
	maxStart: number,
	period: number,
): number {
	if (candidates.length === 0) return Math.max(1, Math.floor(maxStart / 2));
	const slopeSpan = Math.max(1, Math.min(8, Math.round(period / 24)));
	let bestStart = candidates[0] ?? 1;
	let bestScore = Number.NEGATIVE_INFINITY;
	for (const candidate of candidates) {
		const before = sampleAt(samples, Math.max(0, candidate - slopeSpan));
		const after = sampleAt(
			samples,
			Math.min(samples.length - 1, candidate + slopeSpan),
		);
		const slope = (after - before) / Math.max(stats.range, MIN_SIGNAL_RANGE);
		const centerPreference =
			1 - Math.abs(candidate - maxStart / 2) / Math.max(1, maxStart / 2);
		const score = slope + centerPreference * 0.015;
		if (score > bestScore) {
			bestScore = score;
			bestStart = candidate;
		}
	}
	return bestStart;
}

function findBestTemplateMatch(
	samples: Uint8Array | Float32Array,
	mean: number,
	period: number,
	template: Float32Array,
	candidates: number[],
	maxStart: number,
): { start: number; score: number } | null {
	const starts =
		candidates.length > 0
			? candidates
			: createCoarseCandidateStarts(maxStart, period);
	let best: { start: number; score: number } | null = null;
	for (const start of starts) {
		const candidate = captureTemplate(samples, start, period, mean);
		const score = calculateTemplateCorrelation(template, candidate);
		if (!best || score > best.score) best = { start, score };
	}
	return best;
}

function limitTemplateCandidates(
	candidates: number[],
	period: number,
): number[] {
	if (candidates.length <= MAX_TEMPLATE_CANDIDATES) return candidates;

	// Keep crossings that represent distinct phase neighborhoods before
	// evenly sampling the remainder. This preserves lock quality while
	// preventing dense chord spectra from multiplying template work.
	const minimumSpacing = Math.max(1, Math.round(period / 8));
	const spaced: number[] = [];
	for (const candidate of candidates) {
		if (
			spaced.length === 0 ||
			candidate - (spaced[spaced.length - 1] ?? candidate) >= minimumSpacing
		) {
			spaced.push(candidate);
		}
	}
	if (spaced.length <= MAX_TEMPLATE_CANDIDATES) return spaced;

	const limited: number[] = [];
	for (let index = 0; index < MAX_TEMPLATE_CANDIDATES; index++) {
		const sourceIndex = Math.round(
			(index * (spaced.length - 1)) / (MAX_TEMPLATE_CANDIDATES - 1),
		);
		const candidate = spaced[sourceIndex];
		if (candidate !== undefined && candidate !== limited[limited.length - 1]) {
			limited.push(candidate);
		}
	}
	return limited;
}

function createCoarseCandidateStarts(
	maxStart: number,
	period: number,
): number[] {
	const starts: number[] = [];
	const stride = Math.max(1, Math.round(period / 24));
	for (let start = 1; start <= maxStart; start += stride) starts.push(start);
	return starts;
}

function captureTemplate(
	samples: Uint8Array | Float32Array,
	start: number,
	period: number,
	mean: number,
): Float32Array {
	const template = new Float32Array(TEMPLATE_SIZE);
	for (let index = 0; index < TEMPLATE_SIZE; index++) {
		const sampleIndex = start + (index / TEMPLATE_SIZE) * period;
		template[index] = interpolateSample(samples, sampleIndex) - mean;
	}
	return template;
}

function captureStableSamples(
	samples: Uint8Array | Float32Array,
	window: ScopeWindow,
): Float32Array {
	const count = Math.min(samples.length - window.start, window.count + 2);
	const stable = new Float32Array(Math.max(0, count));
	for (let index = 0; index < stable.length; index++) {
		stable[index] = sampleAt(samples, window.start + index);
	}
	return stable;
}

function interpolateSample(
	samples: Uint8Array | Float32Array,
	index: number,
): number {
	const lowerIndex = Math.max(
		0,
		Math.min(samples.length - 1, Math.floor(index)),
	);
	const upperIndex = Math.min(samples.length - 1, lowerIndex + 1);
	const fraction = index - lowerIndex;
	const lower = sampleAt(samples, lowerIndex);
	return lower + (sampleAt(samples, upperIndex) - lower) * fraction;
}

function calculateTemplateCorrelation(
	a: Float32Array,
	b: Float32Array,
): number {
	let product = 0;
	let energyA = 0;
	let energyB = 0;
	for (let index = 0; index < a.length; index++) {
		product += a[index] * b[index];
		energyA += a[index] * a[index];
		energyB += b[index] * b[index];
	}
	const denominator = Math.sqrt(energyA * energyB);
	return denominator > 1e-9 ? product / denominator : -1;
}

function blendTemplate(
	template: Float32Array,
	next: Float32Array,
	amount: number,
): void {
	for (let index = 0; index < template.length; index++) {
		template[index] += (next[index] - template[index]) * amount;
	}
}

function clamp(value: number, min: number, max: number): number {
	return Math.max(min, Math.min(max, value));
}
