import type { PerformanceMetrics } from "@/features/synth/runtime/synthRuntime";
import type { DisplayQualityOverride } from "@/features/synth/synthUiStore";

export type PerformanceDiagnosticsSnapshot = {
	uiFps: number;
	uiP95GapMs: number;
	uiMissedPercent: number;
	uiLongTaskCount: number;
	uiLongTaskMs: number;
	displayFps: number;
	displayP95GapMs: number;
	displayMissedPercent: number;
	displayDrawFps: number;
	displayDrawP95Ms: number;
	displayInputFps: number;
	displayCanvasWidth: number;
	displayCanvasHeight: number;
	displayQuality: "high" | "balanced" | "low";
	displaySource: string;
	audio: PerformanceMetrics | null;
};

type TimingSample = {
	time: number;
	durationMs: number;
};

type DisplayRecord = {
	frames: TimingSample[];
	draws: TimingSample[];
	inputs: number[];
	lastSeenAt: number;
	canvasWidth: number;
	canvasHeight: number;
	quality: "high" | "balanced" | "low";
};

const WINDOW_MS = 2_000;
const RETENTION_MS = 10_000;
const MAX_SAMPLES = 1_500;

function now(): number {
	return typeof performance === "undefined" ? Date.now() : performance.now();
}

function percentile(values: number[], fraction: number): number {
	if (values.length === 0) return 0;
	const sorted = [...values].sort((a, b) => a - b);
	return (
		sorted[Math.min(sorted.length - 1, Math.floor(values.length * fraction))] ??
		0
	);
}

function pruneSamples(
	samples: TimingSample[] | number[],
	cutoff: number,
): void {
	let removeCount = 0;
	while (
		removeCount < samples.length &&
		(typeof samples[removeCount] === "number"
			? (samples[removeCount] as number)
			: (samples[removeCount] as TimingSample).time) < cutoff
	) {
		removeCount++;
	}
	if (removeCount > 0) samples.splice(0, removeCount);
	if (samples.length > MAX_SAMPLES) {
		samples.splice(0, samples.length - MAX_SAMPLES);
	}
}

function summariseTimings(samples: TimingSample[], timestamp: number) {
	const recent = samples.filter(
		(sample) => sample.time >= timestamp - WINDOW_MS,
	);
	const gaps = recent
		.slice(1)
		.map((sample, index) => sample.time - (recent[index]?.time ?? sample.time));
	const missed = gaps.filter((gap) => gap > 34).length;
	return {
		fps: (recent.length * 1000) / WINDOW_MS,
		p95GapMs: percentile(gaps, 0.95),
		missedPercent: gaps.length > 0 ? (missed / gaps.length) * 100 : 0,
	};
}

function summariseDraws(samples: TimingSample[], timestamp: number) {
	const recent = samples.filter(
		(sample) => sample.time >= timestamp - WINDOW_MS,
	);
	return {
		fps: (recent.length * 1000) / WINDOW_MS,
		p95Ms: percentile(
			recent.map((sample) => sample.durationMs),
			0.95,
		),
	};
}

class PerformanceDiagnosticsRegistry {
	private readonly uiFrames: TimingSample[] = [];
	private readonly displays = new Map<string, DisplayRecord>();
	private readonly longTasks: TimingSample[] = [];
	private audio: PerformanceMetrics | null = null;
	private readonly listeners = new Set<() => void>();
	private lastNotifyAt = Number.NEGATIVE_INFINITY;

	recordUiFrame(timestamp = now()): void {
		this.uiFrames.push({ time: timestamp, durationMs: 0 });
		pruneSamples(this.uiFrames, timestamp - RETENTION_MS);
		this.notify(timestamp);
	}

	recordLongTask(durationMs: number, timestamp = now()): void {
		this.longTasks.push({
			time: timestamp,
			durationMs: Math.max(0, durationMs),
		});
		pruneSamples(this.longTasks, timestamp - RETENTION_MS);
		this.notify(timestamp);
	}

	recordDisplayInput(key: string, timestamp = now()): void {
		const display = this.getDisplay(key, timestamp);
		display.inputs.push(timestamp);
		pruneSamples(display.inputs, timestamp - RETENTION_MS);
	}

	recordDisplayFrame(
		key: string,
		{
			timestamp = now(),
			drawMs,
			canvasWidth,
			canvasHeight,
			quality,
		}: {
			timestamp?: number;
			drawMs: number;
			canvasWidth: number;
			canvasHeight: number;
			quality: "high" | "balanced" | "low";
		},
	): void {
		const display = this.getDisplay(key, timestamp);
		display.frames.push({ time: timestamp, durationMs: 0 });
		display.draws.push({ time: timestamp, durationMs: Math.max(0, drawMs) });
		display.canvasWidth = canvasWidth;
		display.canvasHeight = canvasHeight;
		display.quality = quality;
		pruneSamples(display.frames, timestamp - RETENTION_MS);
		pruneSamples(display.draws, timestamp - RETENTION_MS);
		this.notify(timestamp);
	}

	setAudioMetrics(metrics: PerformanceMetrics | null): void {
		this.audio = metrics;
		this.notify();
	}

	subscribe(listener: () => void): () => void {
		this.listeners.add(listener);
		return () => this.listeners.delete(listener);
	}

	getSnapshot(timestamp = now()): PerformanceDiagnosticsSnapshot {
		const ui = summariseTimings(this.uiFrames, timestamp);
		pruneSamples(this.longTasks, timestamp - RETENTION_MS);
		const recentLongTasks = this.longTasks.filter(
			(sample) => sample.time >= timestamp - RETENTION_MS,
		);
		const longTaskCount = recentLongTasks.length;
		const longTaskMs = recentLongTasks.reduce(
			(total, sample) => total + sample.durationMs,
			0,
		);
		const display = [...this.displays.values()].sort(
			(a, b) => b.lastSeenAt - a.lastSeenAt,
		)[0];
		if (!display) {
			return {
				uiFps: ui.fps,
				uiP95GapMs: ui.p95GapMs,
				uiMissedPercent: ui.missedPercent,
				uiLongTaskCount: longTaskCount,
				uiLongTaskMs: longTaskMs,
				displayFps: 0,
				displayP95GapMs: 0,
				displayMissedPercent: 0,
				displayDrawFps: 0,
				displayDrawP95Ms: 0,
				displayInputFps: 0,
				displayCanvasWidth: 0,
				displayCanvasHeight: 0,
				displayQuality: "balanced",
				displaySource: "—",
				audio: this.audio,
			};
		}
		const frameSummary = summariseTimings(display.frames, timestamp);
		const drawSummary = summariseDraws(display.draws, timestamp);
		const inputCount = display.inputs.filter(
			(input) => input >= timestamp - WINDOW_MS,
		).length;
		return {
			uiFps: ui.fps,
			uiP95GapMs: ui.p95GapMs,
			uiMissedPercent: ui.missedPercent,
			uiLongTaskCount: longTaskCount,
			uiLongTaskMs: longTaskMs,
			displayFps: frameSummary.fps,
			displayP95GapMs: frameSummary.p95GapMs,
			displayMissedPercent: frameSummary.missedPercent,
			displayDrawFps: drawSummary.fps,
			displayDrawP95Ms: drawSummary.p95Ms,
			displayInputFps: (inputCount * 1000) / WINDOW_MS,
			displayCanvasWidth: display.canvasWidth,
			displayCanvasHeight: display.canvasHeight,
			displayQuality: display.quality,
			displaySource:
				[...this.displays.entries()].find(
					([, value]) => value === display,
				)?.[0] ?? "—",
			audio: this.audio,
		};
	}

	private getDisplay(key: string, timestamp: number): DisplayRecord {
		const existing = this.displays.get(key);
		if (existing) {
			existing.lastSeenAt = timestamp;
			return existing;
		}
		const created: DisplayRecord = {
			frames: [],
			draws: [],
			inputs: [],
			lastSeenAt: timestamp,
			canvasWidth: 0,
			canvasHeight: 0,
			quality: "balanced",
		};
		this.displays.set(key, created);
		return created;
	}

	private notify(timestamp = now()): void {
		if (timestamp - this.lastNotifyAt < 100) return;
		this.lastNotifyAt = timestamp;
		for (const listener of this.listeners) listener();
	}
}

export const performanceDiagnosticsRegistry =
	new PerformanceDiagnosticsRegistry();

export function getEffectiveDisplayQuality(
	debugEnabled: boolean,
	override: DisplayQualityOverride,
	autoTier: "high" | "balanced" | "low",
): "high" | "balanced" | "low" {
	return debugEnabled && override !== "auto" ? override : autoTier;
}
