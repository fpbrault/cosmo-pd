import { useHoverInfoHandlers } from "@/components/layout/HoverInfo";
import { PARAM_META } from "@/lib/synth/paramMeta";
import { BaseFxSection, type FxKnobConfig } from "./BaseFxSection";

interface DelaySectionProps {
	time: number;
	setTime: (v: number) => void;
	feedback: number;
	setFeedback: (v: number) => void;
	mix: number;
	setMix: (v: number) => void;
	tapeMode: boolean;
	setTapeMode: (v: boolean) => void;
	warmth: number;
	setWarmth: (v: number) => void;
}

export function DelaySection({
	time,
	setTime,
	feedback,
	setFeedback,
	mix,
	setMix,
	tapeMode,
	setTapeMode,
	warmth,
	setWarmth,
}: DelaySectionProps) {
	const tapeModeHoverHandlers = useHoverInfoHandlers(PARAM_META.delayTapeMode?.tooltip);
	const knobs: FxKnobConfig[] = [
		{
			label: "Time",
			tooltip: PARAM_META.delayTime?.tooltip,
			value: time,
			setValue: setTime,
			min: 0.01,
			max: 1,
			size: 44,
			color: "#7f9de4",
			valueFormatter: (value) => `${Math.round(value * 1000)}ms`,
		},
		{
			label: "Dly Fdbk",
			tooltip: PARAM_META.delayFeedback?.tooltip,
			value: feedback,
			setValue: setFeedback,
			min: 0,
			max: 0.9,
			size: 42,
			color: "#7f9de4",
			valueFormatter: (value) => `${Math.round(value * 100)}%`,
		},
		...(tapeMode
			? ([
					{
						label: "Warmth",
						tooltip: PARAM_META.delayWarmth?.tooltip,
						value: warmth,
						setValue: setWarmth,
						min: 0,
						max: 1,
						size: 42,
						color: "#f59e0b",
						valueFormatter: (value: number) => `${Math.round(value * 100)}%`,
					},
				] satisfies FxKnobConfig[])
			: []),
		{
			label: "Mix",
			tooltip: PARAM_META.delayMix?.tooltip,
			value: mix,
			setValue: setMix,
			min: 0,
			max: 1,
			size: 44,
			color: "#9cb937",
			valueFormatter: (value) => `${Math.round(value * 100)}%`,
		},
	];

	const modeLabel = tapeMode ? "Tape Echo" : "Digital";

	return (
		<div className="space-y-2">
			<BaseFxSection title={`Delay — ${modeLabel}`} knobs={knobs} />
			<div className="flex justify-center">
				<button
					type="button"
					onClick={() => setTapeMode(!tapeMode)}
					data-hover-info={PARAM_META.delayTapeMode?.tooltip}
					{...tapeModeHoverHandlers}
					className={`rounded px-3 py-1 text-xs font-medium tracking-wide border transition-colors ${
						tapeMode
							? "border-amber-500/60 bg-amber-500/20 text-amber-300"
							: "border-cz-border bg-cz-surface text-cz-cream/60 hover:text-cz-cream/90"
					}`}
				>
					{tapeMode ? "● Tape Echo" : "○ Tape Echo"}
				</button>
			</div>
		</div>
	);
}
