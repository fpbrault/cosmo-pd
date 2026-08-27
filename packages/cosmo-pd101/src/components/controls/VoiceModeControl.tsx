import { useTranslation } from "react-i18next";
import CzButton from "@/components/primitives/CzButton";
import { useVoiceModeControlModel } from "./useVoiceControls";

export default function VoiceModeControl() {
	const { t } = useTranslation("synth");
	const { polyMode, portamentoEnabled, toggleMono, togglePortamento } =
		useVoiceModeControlModel();

	return (
		<div className="shrink-0">
			<div className="cz-light-blue mb-1">{t("voiceMode.label")}</div>
			<div className="grid grid-cols-2 gap-1">
				<CzButton
					ariaLabel={t("voiceMode.mono")}
					ariaPressed={polyMode === "mono"}
					active={polyMode === "mono"}
					onClick={toggleMono}
					tooltip={t("voiceMode.tooltip")}
				>
					{t("voiceMode.mono")}
				</CzButton>
				<CzButton
					active={Boolean(portamentoEnabled)}
					onClick={togglePortamento}
					tooltip={t("voiceMode.portamentoTooltip")}
				>
					{t("voiceMode.portamento")}
				</CzButton>
			</div>
		</div>
	);
}
