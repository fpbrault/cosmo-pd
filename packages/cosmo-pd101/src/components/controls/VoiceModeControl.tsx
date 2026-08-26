import { useTranslation } from "react-i18next";
import CzButton from "@/components/primitives/CzButton";
import { useSynthParam } from "@/features/synth/SynthParamController";

export default function VoiceModeControl() {
	const { t } = useTranslation("synth");
	const { value: polyMode, setValue: setPolyMode } = useSynthParam("polyMode");
	const { value: portamentoEnabled, setValue: setPortamentoEnabled } =
		useSynthParam("portamentoEnabled");

	return (
		<div className="shrink-0">
			<div className="cz-light-blue mb-1">{t("voiceMode.label")}</div>
			<div className="grid grid-cols-2 gap-1">
				<CzButton
					ariaLabel={t("voiceMode.mono")}
					ariaPressed={polyMode === "mono"}
					active={polyMode === "mono"}
					onClick={() => setPolyMode(polyMode === "poly8" ? "mono" : "poly8")}
					tooltip={t("voiceMode.tooltip")}
				>
					{t("voiceMode.mono")}
				</CzButton>
				<CzButton
					active={Boolean(portamentoEnabled)}
					onClick={() => setPortamentoEnabled(!portamentoEnabled)}
					tooltip={t("voiceMode.portamentoTooltip")}
				>
					{t("voiceMode.portamento")}
				</CzButton>
			</div>
		</div>
	);
}
