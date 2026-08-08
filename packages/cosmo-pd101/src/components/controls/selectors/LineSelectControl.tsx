import { useTranslation } from "react-i18next";
import CzButton from "@/components/primitives/buttons/CzButton";
import { useSynthParam } from "@/features/synth/SynthParamController";
import { LINE_SELECT_TOOLTIPS } from "@/lib/synth/paramMeta";

export default function LineSelectControl() {
	const { t } = useTranslation("synth");
	const { value: lineSelect, setValue: setLineSelect } =
		useSynthParam("lineSelect");

	return (
		<div className="shrink-0">
			<div className="cz-light-blue mb-1">{t("lineSelect.label")}</div>
			<div className="grid grid-cols-4 gap-1">
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
