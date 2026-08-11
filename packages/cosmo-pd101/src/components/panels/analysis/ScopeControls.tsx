import { useTranslation } from "react-i18next";
import ControlKnob from "@/components/controls/ControlKnob";
import { useSynthUiStore } from "@/features/synth/synthUiStore";

export function ScopeControls() {
	const { t } = useTranslation("synth");
	const scopeCycles = useSynthUiStore((s) => s.scopeCycles);
	const scopeVerticalZoom = useSynthUiStore((s) => s.scopeVerticalZoom);
	const setScopeCycles = useSynthUiStore((s) => s.setScopeCycles);
	const setScopeVerticalZoom = useSynthUiStore((s) => s.setScopeVerticalZoom);

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
		</div>
	);
}
