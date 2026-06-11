import { useTranslation } from "react-i18next";
import ControlKnob from "@/components/controls/ControlKnob";
import { useSynthUiStore } from "@/features/synth/synthUiStore";

export function ScopeControls() {
	const { t } = useTranslation("synth");
	const scopeCycles = useSynthUiStore((s) => s.scopeCycles);
	const scopeVerticalZoom = useSynthUiStore((s) => s.scopeVerticalZoom);
	const scopeTriggerLevel = useSynthUiStore((s) => s.scopeTriggerLevel);
	const setScopeCycles = useSynthUiStore((s) => s.setScopeCycles);
	const setScopeVerticalZoom = useSynthUiStore((s) => s.setScopeVerticalZoom);
	const setScopeTriggerLevel = useSynthUiStore((s) => s.setScopeTriggerLevel);

	return (
		<div className="mt-2 flex shrink-0 justify-center gap-2">
			<ControlKnob
				value={scopeCycles}
				onChange={setScopeCycles}
				min={0.5}
				max={8}
				size={40}
				defaultValue={2}
				color="#3dff3d"
				label={t("scope.cycles")}
				tooltip={t("scope.cyclesTooltip")}
				valueFormatter={(value) => value.toFixed(1)}
			/>
			<ControlKnob
				value={scopeVerticalZoom}
				onChange={setScopeVerticalZoom}
				min={0.25}
				max={4}
				size={40}
				defaultValue={1}
				color="#9cb937"
				label={t("scope.zoom")}
				tooltip={t("scope.zoomTooltip")}
				valueFormatter={(value) => `${value.toFixed(1)}x`}
			/>
			<ControlKnob
				value={scopeTriggerLevel}
				onChange={(value) => setScopeTriggerLevel(Math.round(value))}
				min={0}
				max={255}
				size={40}
				defaultValue={128}
				color="#7f9de4"
				label={t("scope.trig")}
				tooltip={t("scope.trigTooltip")}
				valueFormatter={(value) => `${Math.round(value)}`}
			/>
		</div>
	);
}
