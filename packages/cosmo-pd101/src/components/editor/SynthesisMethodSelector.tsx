import type { SynthesisMethod } from "@/lib/synth/bindings/synth";
import { SYNTHESIS_ENGINE_UI_DEFINITIONS } from "@/lib/synth/synthesisEngineRegistry";

type SynthesisMethodSelectorProps = {
	value: SynthesisMethod;
	onChange: (value: SynthesisMethod) => void;
	color: "red" | "blue";
};

const METHODS = Object.keys(
	SYNTHESIS_ENGINE_UI_DEFINITIONS,
) as SynthesisMethod[];

export function SynthesisMethodSelector({
	value,
	onChange,
	color,
}: SynthesisMethodSelectorProps) {
	const accent = color === "blue" ? "#7f9de4" : "#c45c5c";

	return (
		<select
			aria-label="Synthesis method"
			data-testid="synthesis-method-selector"
			className="select select-xs h-6 min-h-0 w-full rounded border-cz-border bg-cz-inset px-1 font-mono text-[0.55rem] text-cz-cream uppercase"
			style={{ borderColor: accent }}
			value={value}
			onChange={(event) => onChange(event.target.value as SynthesisMethod)}
		>
			{METHODS.map((method) => (
				<option key={method} value={method}>
					{SYNTHESIS_ENGINE_UI_DEFINITIONS[method].name}
				</option>
			))}
		</select>
	);
}
