import { useTranslation } from "react-i18next";
import CzButton from "@/components/primitives/CzButton";
import { getEnumTooltip } from "@/lib/synth/paramMeta";
import {
	LINE_SELECT_OPTIONS,
	useLineSelectControlModel,
} from "./useLineRoutingControls";

export default function LineSelectControl() {
	const { t } = useTranslation("synth");
	const { value: lineSelect, setValue: setLineSelect } =
		useLineSelectControlModel();

	return (
		<div className="shrink-0">
			<div className="cz-light-blue mb-1">{t("lineSelect.label")}</div>
			<div className="grid grid-cols-4 gap-1">
				{LINE_SELECT_OPTIONS.map((ls) => (
					<CzButton
						key={ls}
						active={lineSelect === ls}
						tooltip={getEnumTooltip("lineSelect", ls)}
						onClick={() => setLineSelect(ls)}
					>
						{ls}
					</CzButton>
				))}
			</div>
		</div>
	);
}
