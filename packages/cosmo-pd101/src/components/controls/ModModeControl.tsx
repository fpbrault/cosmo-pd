import { useTranslation } from "react-i18next";
import CzButton from "@/components/primitives/CzButton";
import { getEnumTooltip } from "@/lib/synth/paramMeta";
import {
	MOD_MODE_OPTIONS,
	useLineSelectControlModel,
	useModModeControlModel,
} from "./useLineRoutingControls";

export default function ModModeControl() {
	const { t } = useTranslation("synth");
	const { value: lineSelect } = useLineSelectControlModel();
	const {
		value: modMode,
		setValue: setModMode,
		isDisabled,
	} = useModModeControlModel(lineSelect);

	return (
		<div className="shrink-0">
			<div className="cz-light-blue mb-1">{t("modMode.label")}</div>
			<div className="flex gap-1">
				{MOD_MODE_OPTIONS.map((mode) => (
					<CzButton
						key={mode}
						active={modMode === mode}
						disabled={isDisabled(mode)}
						onClick={() => setModMode(mode)}
						tooltip={getEnumTooltip("modMode", mode)}
						className="flex-1"
					>
						{t(`modMode.${mode}`)}
					</CzButton>
				))}
			</div>
		</div>
	);
}
