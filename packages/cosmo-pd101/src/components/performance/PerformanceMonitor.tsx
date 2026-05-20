import { useEffect, useMemo, useState } from "react";

export type PerformanceMetrics = {
	enabled: boolean;
	blockCount: number;
	lastMs: number;
	avgMs: number;
	maxMs: number;
	blockBudgetMs: number;
	lastRtPercent: number;
	avgRtPercent: number;
	maxRtPercent: number;
	blockSamples: number;
	sampleRate: number;
	activeVoices: number;
	uiQueueDepth?: number;
	paramsApplyCount?: number;
};

type PerformanceHistoryPoint = PerformanceMetrics & {
	capturedAt: number;
};

type PerformanceMonitorProps = {
	enabled: boolean;
	metrics: PerformanceMetrics | null;
	modeLabel: string;
	onToggle: () => void;
};

function formatMs(value: number): string {
	return Number.isFinite(value) ? value.toFixed(2) : "0.00";
}

function formatPercent(value: number): string {
	return Number.isFinite(value) ? value.toFixed(0) : "0";
}

function formatNumber(value: number): string {
	return Number.isFinite(value) ? value.toLocaleString() : "0";
}

function formatHz(value: number): string {
	if (!Number.isFinite(value) || value <= 0) return "0 Hz";
	return value >= 1000 ? `${(value / 1000).toFixed(1)} kHz` : `${value} Hz`;
}

function metricStatus(metrics: PerformanceMetrics | null): {
	label: string;
	className: string;
} {
	const rtPercent = metrics?.lastRtPercent ?? 0;
	if (rtPercent >= 100) {
		return { label: "Over budget", className: "text-red-300" };
	}
	if (rtPercent >= 75) {
		return { label: "Close", className: "text-amber-200" };
	}
	return { label: "Headroom", className: "text-emerald-300" };
}

function buildGraphPoints(
	history: PerformanceHistoryPoint[],
	readValue: (point: PerformanceHistoryPoint) => number,
): string {
	if (history.length === 0) {
		return "";
	}

	const maxValue = Math.max(
		100,
		...history.map((point) => Math.max(0, readValue(point))),
	);
	const width = 360;
	const height = 112;
	const lastIndex = Math.max(1, history.length - 1);

	return history
		.map((point, index) => {
			const x = (index / lastIndex) * width;
			const y = height - (Math.max(0, readValue(point)) / maxValue) * height;
			return `${x.toFixed(1)},${y.toFixed(1)}`;
		})
		.join(" ");
}

function graphBudgetY(history: PerformanceHistoryPoint[]): string {
	if (history.length === 0) {
		return "0";
	}
	const maxValue = Math.max(
		100,
		...history.map((point) => Math.max(0, point.maxRtPercent)),
	);
	return (112 - (100 / maxValue) * 112).toFixed(1);
}

function Stat({ label, value }: { label: string; value: string }) {
	return (
		<div className="min-w-0 rounded-sm border border-cz-border/55 bg-black/20 px-2 py-1">
			<div className="text-[0.48rem] text-cz-cream/40 tracking-[0.18em]">
				{label}
			</div>
			<div className="truncate text-[0.66rem] text-cz-cream tracking-[0.08em]">
				{value}
			</div>
		</div>
	);
}

export function PerformanceMonitor({
	enabled,
	metrics,
	modeLabel,
	onToggle,
}: PerformanceMonitorProps) {
	const [history, setHistory] = useState<PerformanceHistoryPoint[]>([]);
	const status = metricStatus(metrics);

	useEffect(() => {
		if (!enabled) {
			setHistory([]);
			return;
		}
		if (!metrics) {
			return;
		}

		setHistory((current) => {
			const last = current.at(-1);
			if (last?.blockCount === metrics.blockCount) {
				return current;
			}
			return [...current.slice(-119), { ...metrics, capturedAt: Date.now() }];
		});
	}, [enabled, metrics]);

	const graph = useMemo(
		() => ({
			rtPoints: buildGraphPoints(history, (point) => point.lastRtPercent),
			avgPoints: buildGraphPoints(history, (point) => point.avgRtPercent),
			maxPoints: buildGraphPoints(history, (point) => point.maxRtPercent),
			budgetY: graphBudgetY(history),
		}),
		[history],
	);
	const firstHistoryPoint = history[0];
	const lastHistoryPoint = history.at(-1);
	const historyWindowSeconds =
		firstHistoryPoint && lastHistoryPoint
			? Math.round(
					(lastHistoryPoint.capturedAt - firstHistoryPoint.capturedAt) / 1000,
				)
			: 0;

	const buttonClassName = enabled
		? "border-cz-gold bg-cz-gold/10 text-cz-gold"
		: "border-cz-border bg-black/25 text-cz-cream/70 hover:text-cz-cream";

	return (
		<div className="flex items-center gap-2">
			<button
				type="button"
				onClick={onToggle}
				aria-pressed={enabled}
				title="Toggle performance monitor"
				className={`rounded-sm border px-1.5 py-0.5 font-mono text-[0.54rem] tracking-[0.14em] transition-colors ${buttonClassName}`}
			>
				Perf
			</button>
			{enabled ? (
				<div className="flex items-center gap-2 text-cz-cream/70">
					<span className="text-cz-light-blue/75">{modeLabel}</span>
					<span className={status.className}>
						RT {formatPercent(metrics?.lastRtPercent ?? 0)}%
					</span>
					<div className="fixed right-4 bottom-11 z-60 w-[min(44rem,calc(100vw-2rem))] rounded-md border border-cz-border/80 bg-cz-panel/97 p-3 font-mono text-cz-cream shadow-2xl backdrop-blur-sm">
						<div className="flex items-start justify-between gap-3 border-cz-border/60 border-b pb-2">
							<div>
								<div className="text-[0.66rem] text-cz-light-blue tracking-[0.22em]">
									Performance Monitor
								</div>
								<div className="mt-1 text-[0.52rem] text-cz-cream/55 tracking-[0.12em]">
									{modeLabel} AUDIO ENGINE
								</div>
							</div>
							<div
								className={`text-[0.64rem] tracking-[0.16em] ${status.className}`}
							>
								{status.label}
							</div>
						</div>

						<div className="mt-3 rounded-sm border border-cz-border/60 bg-black/20 p-2">
							<svg
								viewBox="0 0 360 112"
								role="img"
								aria-label="Realtime CPU percentage history"
								className="h-32 w-full overflow-visible"
							>
								<line
									x1="0"
									y1="56"
									x2="360"
									y2="56"
									className="stroke-cz-border/55"
									strokeDasharray="4 6"
								/>
								<line
									x1="0"
									y1={graph.budgetY}
									x2="360"
									y2={graph.budgetY}
									className="stroke-red-300/45"
									strokeDasharray="4 6"
								/>
								{graph.maxPoints ? (
									<polyline
										points={graph.maxPoints}
										fill="none"
										className="stroke-red-300/65"
										strokeWidth="1.5"
									/>
								) : null}
								{graph.avgPoints ? (
									<polyline
										points={graph.avgPoints}
										fill="none"
										className="stroke-cz-gold/75"
										strokeWidth="1.5"
									/>
								) : null}
								{graph.rtPoints ? (
									<polyline
										points={graph.rtPoints}
										fill="none"
										className="stroke-cz-light-blue"
										strokeWidth="2.25"
									/>
								) : null}
							</svg>
							<div className="mt-1 flex items-center justify-between text-5xs text-cz-cream/45 tracking-[0.14em]">
								<span>0%</span>
								<span className="text-cz-light-blue/75">LAST</span>
								<span className="text-cz-gold/75">AVG</span>
								<span className="text-red-300/75">MAX</span>
								<span>100% BUDGET</span>
							</div>
						</div>

						<div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
							<Stat
								label="RT LAST"
								value={`${formatPercent(metrics?.lastRtPercent ?? 0)}%`}
							/>
							<Stat
								label="RT AVG"
								value={`${formatPercent(metrics?.avgRtPercent ?? 0)}%`}
							/>
							<Stat
								label="RT MAX"
								value={`${formatPercent(metrics?.maxRtPercent ?? 0)}%`}
							/>
							<Stat
								label="HEADROOM"
								value={`${formatPercent(Math.max(0, 100 - (metrics?.lastRtPercent ?? 0)))}%`}
							/>
							<Stat label="LAST MS" value={formatMs(metrics?.lastMs ?? 0)} />
							<Stat label="AVG MS" value={formatMs(metrics?.avgMs ?? 0)} />
							<Stat label="MAX MS" value={formatMs(metrics?.maxMs ?? 0)} />
							<Stat
								label="BUDGET MS"
								value={formatMs(metrics?.blockBudgetMs ?? 0)}
							/>
							<Stat
								label="BLOCKS"
								value={formatNumber(metrics?.blockCount ?? 0)}
							/>
							<Stat
								label="BLOCK SIZE"
								value={`${metrics?.blockSamples ?? 0}`}
							/>
							<Stat
								label="SAMPLE RATE"
								value={formatHz(metrics?.sampleRate ?? 0)}
							/>
							<Stat label="VOICES" value={`${metrics?.activeVoices ?? 0}`} />
							<Stat label="UI QUEUE" value={`${metrics?.uiQueueDepth ?? 0}`} />
							<Stat
								label="PARAM APPLIES"
								value={formatNumber(metrics?.paramsApplyCount ?? 0)}
							/>
							<Stat label="SAMPLES" value={`${history.length}`} />
							<Stat
								label="WINDOW"
								value={history.length > 1 ? `${historyWindowSeconds}s` : "0s"}
							/>
						</div>
					</div>
				</div>
			) : null}
		</div>
	);
}
