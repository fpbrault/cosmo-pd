import type { SynthesisMethod } from "@/lib/synth/bindings/synth";

type SynthesisMethodSelectorProps = {
	value: SynthesisMethod;
	onChange: (value: SynthesisMethod) => void;
	color: "red" | "blue";
};

export function SynthesisMethodSelector({
	value,
	onChange,
	color,
}: SynthesisMethodSelectorProps) {
	const stroke = color === "blue" ? "#7f9de4" : "#c45c5c";

	return (
		<div
			className="flex flex-col items-center gap-1"
			data-testid="synthesis-method-selector"
		>
			<svg
				aria-hidden="true"
				viewBox="0 0 48 22"
				className="h-5 w-10"
				fill="none"
				stroke={stroke}
				strokeWidth="2"
			>
				{value === "karpunk" ? (
					<path d="M3 16 C11 1 17 21 25 7 S37 20 45 5" />
				) : (
					<path d="M3 17 C11 17 13 4 22 4 S32 17 45 17" />
				)}
			</svg>
			<select
				aria-label="Synthesis method"
				className="select select-xs h-6 min-h-0 w-full rounded border-cz-border bg-cz-inset px-1 font-mono text-[0.5rem] text-cz-cream uppercase"
				value={value}
				onChange={(event) => onChange(event.target.value as SynthesisMethod)}
			>
				<option value="pd">PD / WARP</option>
				<option value="karpunk">KARPUNK</option>
			</select>
		</div>
	);
}
