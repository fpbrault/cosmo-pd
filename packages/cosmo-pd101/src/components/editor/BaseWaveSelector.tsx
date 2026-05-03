import Card from "@/components/primitives/Card";
import type { BaseWaveform } from "@/lib/synth/bindings/synth";
import { BaseWaveformIcon } from "./BaseWaveformIcon";

const BASE_WAVE_OPTIONS: ReadonlyArray<{ value: BaseWaveform; label: string }> =
	[
		{ value: "cosine", label: "Cos" },
		{ value: "sine", label: "Sin" },
		{ value: "triangle", label: "Tri" },
		{ value: "saw", label: "Saw" },
		{ value: "square", label: "Sqr" },
	];

interface BaseWaveSelectorProps {
	title: string;
	value: BaseWaveform;
	onChange: (v: BaseWaveform) => void;
	disabled?: boolean;
	color?: string;
}

export function BaseWaveSelector({
	title,
	value,
	onChange,
	disabled = false,
	color,
}: BaseWaveSelectorProps) {
	return (
		<Card variant="subtle" className="">
			<div
				className="text-3xs uppercase tracking-[0.24em] text-center"
				style={color ? { color } : undefined}
			>
				{title}
			</div>
			<div className="mt-2 flex flex-wrap justify-center gap-1">
				{BASE_WAVE_OPTIONS.map((option) => (
					<button
						key={option.value}
						type="button"
						onClick={() => {
							if (!disabled) onChange(option.value);
						}}
						disabled={disabled}
						title={option.label}
						className={`flex flex-col items-center gap-0.5 rounded py-1.5 transition-colors select-none focus-visible:outline-2 focus-visible:outline-offset-1 ${
							disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"
						} ${
							value === option.value
								? "text-primary-content"
								: "border border-cz-border text-cz-cream/70 hover:text-cz-cream hover:border-cz-cream/40"
						}`}
						style={
							value === option.value && color
								? { backgroundColor: color }
								: undefined
						}
					>
						<BaseWaveformIcon
							waveform={option.value}
							size={32}
							className={
								value === option.value
									? "text-primary-content "
									: "text-cz-cream/70 group-hover:text-cz-cream"
							}
						/>
						<span className="text-xs leading-none tracking-wide font-bold">
							{option.label}
						</span>
					</button>
				))}
			</div>
		</Card>
	);
}
