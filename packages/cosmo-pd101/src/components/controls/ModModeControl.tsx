import { useTranslation } from "react-i18next";
import CzButton from "@/components/primitives/CzButton";
import { useSynthParam } from "@/features/synth/SynthParamController";
import { getEnumTooltip } from "@/lib/synth/paramMeta";

export default function ModModeControl() {
	const { t } = useTranslation("synth");
	const { value: modMode, setValue: setModMode } = useSynthParam("modMode");
	const { value: lineSelect } = useSynthParam("lineSelect");
	const dualLineMode = lineSelect === "L1+L1'" || lineSelect === "L1+L2'";

	return (
		<div className="shrink-0">
			<div className="cz-light-blue mb-1">{t("modMode.label")}</div>
			<div className="flex gap-1">
				{(
					[
						["normal", "Normal"],
						["ring", "Ring"],
						["noise", "Noise"],
					] as const
				).map(([mode, _label]) => (
					<CzButton
						key={mode}
						active={modMode === mode}
						disabled={mode !== "normal" && !dualLineMode}
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
