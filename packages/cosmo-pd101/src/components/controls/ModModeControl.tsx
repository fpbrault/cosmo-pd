import CzButton from "@/components/primitives/CzButton";
import { useSynthParam } from "@/features/synth/SynthParamController";
import { MOD_MODE_TOOLTIPS } from "@/lib/synth/paramMeta";

export default function ModModeControl() {
	const { value: modMode, setValue: setModMode } = useSynthParam("modMode");
	const { value: lineSelect } = useSynthParam("lineSelect");
	const dualLineMode = lineSelect === "L1+L1'" || lineSelect === "L1+L2'";

	return (
		<div className="shrink-0">
			<div className="cz-light-blue mb-1">Modulation</div>
			<div className="flex gap-1">
				{(
					[
						["normal", "Normal"],
						["ring", "Ring"],
						["noise", "Noise"],
					] as const
				).map(([mode, label]) => (
					<CzButton
						key={mode}
						active={modMode === mode}
						disabled={mode !== "normal" && !dualLineMode}
						onClick={() => setModMode(mode)}
						tooltip={MOD_MODE_TOOLTIPS[mode]}
						className="flex-1"
					>
						{label}
					</CzButton>
				))}
			</div>
		</div>
	);
}
