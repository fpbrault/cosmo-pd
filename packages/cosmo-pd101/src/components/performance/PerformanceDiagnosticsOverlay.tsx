import { useState } from "react";
import {
	MdKeyboardArrowDown,
	MdKeyboardArrowUp,
	MdSpeed,
} from "react-icons/md";
import { usePerformanceDiagnostics } from "./PerformanceDiagnosticsProvider";

function metric(value: number, digits = 0): string {
	if (!Number.isFinite(value) || value <= 0) return "—";
	return value.toFixed(digits);
}

function percent(value: number): string {
	return value <= 0 || !Number.isFinite(value) ? "—" : `${value.toFixed(1)}%`;
}

export function PerformanceBadge() {
	const { debugEnabled, snapshot } = usePerformanceDiagnostics();
	if (!debugEnabled) return null;
	return (
		<div className="pointer-events-none absolute bottom-1 left-1 z-10 rounded border border-cz-green/40 bg-cz-body/90 px-1.5 py-0.5 font-mono text-[0.52rem] text-cz-green shadow-sm backdrop-blur-sm">
			DRAW {metric(snapshot.displayDrawFps, 1)} FPS ·{" "}
			{snapshot.displayQuality.toUpperCase()}
		</div>
	);
}

export default function PerformanceDiagnosticsOverlay() {
	const { debugEnabled, snapshot } = usePerformanceDiagnostics();
	const [expanded, setExpanded] = useState(false);
	if (!debugEnabled) return null;

	const audio = snapshot.audio;
	return (
		<div className="pointer-events-auto absolute right-2 bottom-9 z-40 w-[min(31rem,calc(100%-1rem))] font-mono text-[0.58rem] uppercase tracking-[0.12em]">
			{expanded ? (
				<div className="rounded-lg border border-cz-light-blue bg-cz-body/95 p-3 text-cz-cream shadow-[0_0_18px_rgba(91,146,255,0.22)] backdrop-blur">
					<div className="mb-2 flex items-center justify-between border-cz-border border-b pb-2">
						<span className="text-cz-cream">Performance Diagnostics</span>
						<button
							type="button"
							className="rounded p-0.5 text-cz-cream/70 hover:bg-cz-inset hover:text-cz-cream"
							onClick={() => setExpanded(false)}
							aria-label="Collapse performance diagnostics"
						>
							<MdKeyboardArrowDown className="h-4 w-4" />
						</button>
					</div>
					<div className="grid grid-cols-3 divide-x divide-cz-border">
						<MetricColumn
							title="UI"
							rows={[
								["FPS", metric(snapshot.uiFps, 1)],
								["P95 GAP", `${metric(snapshot.uiP95GapMs, 1)} ms`],
								["MISSED", percent(snapshot.uiMissedPercent)],
								[
									"LONG TASKS",
									`${snapshot.uiLongTaskCount} / ${metric(snapshot.uiLongTaskMs, 0)} ms`,
								],
							]}
						/>
						<MetricColumn
							title="DISPLAY"
							rows={[
								["INPUT", `${metric(snapshot.displayInputFps, 1)} FPS`],
								["DRAW", `${metric(snapshot.displayDrawFps, 1)} FPS`],
								["DRAW P95", `${metric(snapshot.displayDrawP95Ms, 1)} ms`],
								["QUALITY", snapshot.displayQuality],
								[
									"CANVAS",
									snapshot.displayCanvasWidth > 0
										? `${snapshot.displayCanvasWidth} × ${snapshot.displayCanvasHeight}`
										: "—",
								],
							]}
						/>
						<MetricColumn
							title="AUDIO ENGINE"
							rows={[
								["RT LOAD", audio ? percent(audio.lastRtPercent) : "—"],
								[
									"AVG / MAX",
									audio
										? `${percent(audio.avgRtPercent)} / ${percent(audio.maxRtPercent)}`
										: "—",
								],
								[
									"BLOCK",
									audio
										? `${audio.blockSamples} / ${Math.round(audio.sampleRate / 1000)} kHz`
										: "—",
								],
								["VOICES", audio ? `${audio.activeVoices}` : "—"],
								["OVER BUDGET", audio ? `${audio.overBudgetBlocks ?? 0}` : "—"],
							]}
						/>
					</div>
				</div>
			) : (
				<button
					type="button"
					className="flex w-full items-center justify-between rounded border border-cz-border bg-cz-body/95 px-2 py-1.5 text-left text-cz-cream shadow backdrop-blur hover:border-cz-light-blue"
					onClick={() => setExpanded(true)}
					aria-label="Expand performance diagnostics"
				>
					<span className="flex items-center gap-2">
						<MdSpeed className="h-3.5 w-3.5 text-cz-light-blue" />
						UI {metric(snapshot.uiFps, 0)} FPS&nbsp;&nbsp; DISPLAY{" "}
						{metric(snapshot.displayDrawFps, 0)} FPS / {snapshot.displayQuality}
						&nbsp;&nbsp; DSP {audio ? percent(audio.avgRtPercent) : "—"}
					</span>
					<MdKeyboardArrowUp className="h-4 w-4 text-cz-cream/70" />
				</button>
			)}
		</div>
	);
}

function MetricColumn({
	title,
	rows,
}: {
	title: string;
	rows: Array<[string, string]>;
}) {
	return (
		<div className="space-y-2 px-2 first:pl-0 last:pr-0">
			<p className="text-cz-light-blue">{title}</p>
			{rows.map(([label, value]) => (
				<div key={label} className="flex items-baseline justify-between gap-2">
					<span className="text-cz-cream/65">{label}</span>
					<span className="text-right text-cz-cream">{value}</span>
				</div>
			))}
		</div>
	);
}
