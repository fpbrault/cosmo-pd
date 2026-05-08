import CzButton from "@/components/primitives/CzButton";
import { useSynthParam } from "@/features/synth/SynthParamController";
import { LINE_SELECT_TOOLTIPS } from "@/lib/synth/paramMeta";

export default function LineSelectControl() {
	const { value: lineSelect, setValue: setLineSelect } =
		useSynthParam("lineSelect");

	return (
		<div className="shrink-0">
			<div className="cz-light-blue mb-1">Line Select</div>
			<div className="grid grid-cols-5 gap-1">
				{(["L1", "L2", "L1+L1'", "L1+L2'"] as const).map((ls) => (
					<CzButton
						key={ls}
						active={lineSelect === ls}
						tooltip={LINE_SELECT_TOOLTIPS[ls]}
						onClick={() => setLineSelect(ls)}
					>
						{ls}
					</CzButton>
				))}
			</div>
		</div>
	);
}
