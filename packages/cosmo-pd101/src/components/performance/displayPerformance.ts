export type PerformanceQualityTier = "high" | "balanced" | "low";

export type PerformanceDisplayProfile = {
	bandCount: number;
	waveformPointCount: number;
	rowCount: number;
	historyInterval: number;
	maxPixelRatio: number;
	glowBlur: number;
};

const QUALITY_ORDER: PerformanceQualityTier[] = ["high", "balanced", "low"];

export const PERFORMANCE_DISPLAY_PROFILES: Record<
	PerformanceQualityTier,
	PerformanceDisplayProfile
> = {
	high: {
		bandCount: 64,
		waveformPointCount: 160,
		rowCount: 40,
		historyInterval: 33,
		maxPixelRatio: 2,
		glowBlur: 8,
	},
	balanced: {
		bandCount: 48,
		waveformPointCount: 96,
		rowCount: 24,
		historyInterval: 33,
		maxPixelRatio: 1.5,
		glowBlur: 4,
	},
	low: {
		bandCount: 32,
		waveformPointCount: 64,
		rowCount: 16,
		historyInterval: 33,
		maxPixelRatio: 1,
		glowBlur: 0,
	},
};

const QUALITY_WINDOW_MS = 2_000;
const QUALITY_COOLDOWN_MS = 5_000;
const QUALITY_DOWNSHIFT_WINDOWS = 2;
const QUALITY_UPSHIFT_WINDOWS = 4;
let performanceMeasureId = 0;

function percentile(values: number[], fraction: number): number {
	if (values.length === 0) return 0;
	const sorted = [...values].sort((a, b) => a - b);
	return (
		sorted[Math.min(sorted.length - 1, Math.floor(values.length * fraction))] ??
		0
	);
}

function tierIndex(tier: PerformanceQualityTier): number {
	return QUALITY_ORDER.indexOf(tier);
}

export function getInitialPerformanceTier(
	scopePerformanceMode: "standard" | "constrained" | undefined,
	{
		coarsePointer,
		devicePixelRatio,
	}: {
		coarsePointer: boolean;
		devicePixelRatio: number;
	},
): PerformanceQualityTier {
	if (scopePerformanceMode === "constrained") return "balanced";
	if (coarsePointer || devicePixelRatio > 1.5) return "balanced";
	return "high";
}

export function getPerformanceDisplayProfile(
	tier: PerformanceQualityTier,
): PerformanceDisplayProfile {
	return PERFORMANCE_DISPLAY_PROFILES[tier];
}

export function calculateCanvasBackingSize({
	clientWidth,
	clientHeight,
	visibleWidth,
	visibleHeight,
	devicePixelRatio,
	maxPixelRatio,
}: {
	clientWidth: number;
	clientHeight: number;
	visibleWidth: number;
	visibleHeight: number;
	devicePixelRatio: number;
	maxPixelRatio: number;
}): { width: number; height: number } {
	const ratio = Math.max(1, Math.min(devicePixelRatio, maxPixelRatio));
	const renderedWidth = visibleWidth > 0 ? visibleWidth : clientWidth;
	const renderedHeight = visibleHeight > 0 ? visibleHeight : clientHeight;
	return {
		width: Math.max(1, Math.round(Math.max(1, renderedWidth) * ratio)),
		height: Math.max(1, Math.round(Math.max(1, renderedHeight) * ratio)),
	};
}

export function performanceDiagnosticsEnabled(): boolean {
	return new URLSearchParams(window.location.search).get("perf") === "1";
}

export function recordPerformanceMeasure(
	name: string,
	startTime: number,
	endTime: number,
): void {
	if (!performanceDiagnosticsEnabled()) return;
	const id = performanceMeasureId++;
	const startMark = `${name}-start-${id}`;
	const endMark = `${name}-end-${id}`;
	performance.mark(startMark, { startTime });
	performance.mark(endMark, { startTime: endTime });
	performance.measure(name, startMark, endMark);
	performance.clearMarks(startMark);
	performance.clearMarks(endMark);
}

export type PerformanceQualityObservation = {
	now: number;
	drawMs: number;
	frameGapMs: number;
};

export class AdaptivePerformanceQuality {
	private tier: PerformanceQualityTier;
	private readonly maximumTier: PerformanceQualityTier;
	private windowStartedAt: number | null = null;
	private drawTimes: number[] = [];
	private frameGaps: number[] = [];
	private poorWindows = 0;
	private goodWindows = 0;
	private lastChangeAt = Number.NEGATIVE_INFINITY;

	constructor(
		initialTier: PerformanceQualityTier,
		maximumTier: PerformanceQualityTier = "high",
	) {
		this.tier = initialTier;
		this.maximumTier = maximumTier;
	}

	get currentTier(): PerformanceQualityTier {
		return this.tier;
	}

	observe(
		observation: PerformanceQualityObservation,
	): PerformanceQualityTier | null {
		if (this.windowStartedAt === null) {
			this.windowStartedAt = observation.now;
		}
		this.drawTimes.push(observation.drawMs);
		this.frameGaps.push(observation.frameGapMs);
		if (observation.now - this.windowStartedAt < QUALITY_WINDOW_MS) {
			return null;
		}

		const drawP95 = percentile(this.drawTimes, 0.95);
		const missedFrameRatio =
			this.frameGaps.filter((gap) => gap > 34).length /
			Math.max(1, this.frameGaps.length);
		const poor = drawP95 > 16 || missedFrameRatio > 0.1;
		const good = drawP95 < 8 && missedFrameRatio < 0.02;
		this.drawTimes = [];
		this.frameGaps = [];
		this.windowStartedAt = observation.now;

		if (poor) {
			this.poorWindows++;
			this.goodWindows = 0;
		} else if (good) {
			this.goodWindows++;
			this.poorWindows = 0;
		} else {
			this.poorWindows = 0;
			this.goodWindows = 0;
		}

		if (observation.now - this.lastChangeAt < QUALITY_COOLDOWN_MS) {
			return null;
		}

		if (this.poorWindows >= QUALITY_DOWNSHIFT_WINDOWS) {
			const nextIndex = Math.min(
				QUALITY_ORDER.length - 1,
				tierIndex(this.tier) + 1,
			);
			if (nextIndex !== tierIndex(this.tier)) {
				this.tier = QUALITY_ORDER[nextIndex] ?? this.tier;
				this.lastChangeAt = observation.now;
				this.poorWindows = 0;
				this.goodWindows = 0;
				return this.tier;
			}
		}

		if (this.goodWindows >= QUALITY_UPSHIFT_WINDOWS) {
			const nextIndex = Math.max(0, tierIndex(this.tier) - 1);
			const nextTier = QUALITY_ORDER[nextIndex] ?? this.tier;
			if (
				nextIndex !== tierIndex(this.tier) &&
				tierIndex(nextTier) >= tierIndex(this.maximumTier)
			) {
				this.tier = nextTier;
				this.lastChangeAt = observation.now;
				this.poorWindows = 0;
				this.goodWindows = 0;
				return this.tier;
			}
		}

		return null;
	}
}
