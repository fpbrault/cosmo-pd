import { useTranslation } from "react-i18next";
import SynthParamKnob from "@/components/controls/SynthParamKnob";
import ModuleFrame from "@/components/primitives/ModuleFrame";

export default function RandomModule() {
	const { t } = useTranslation("synth");
	return (
		<ModuleFrame
			title={t("randomModule.title")}
			color="#c2571a"
			enabled
			hideToggle
			columns={1}
			presetValue=""
			presetOptions={[]}
			onPresetChange={() => {}}
			presetDisabled
		>
			<SynthParamKnob
				paramKey="randomRate"
				color="#c2571a"
				label={t("randomModule.rate")}
			/>
		</ModuleFrame>
	);
}
