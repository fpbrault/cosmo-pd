import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { IconType } from "react-icons";
import {
	LuActivity,
	LuAudioWaveform,
	LuChartNoAxesColumnIncreasing,
	LuChartSpline,
	LuOrbit,
	LuRocket,
	LuSpline,
} from "react-icons/lu";
import { useSynthUiStore } from "@/features/synth/synthUiStore";
import {
	VISUALIZATION_MODES,
	type VisualizationMode,
} from "./visualizationModes";

const getModeLabel = (
	mode: VisualizationMode,
	t: (key: string) => string,
): string => {
	const keys: Record<VisualizationMode, string> = {
		scopeHistory: "scope.modeScopeHistory",
		spectrumWaterfall: "scope.modeSpectrumWaterfall",
		waveform: "scope.modeWaveform",
		orbital: "scope.modeOrbital",
		spectrogram: "scope.modeSpectrogram",
		transferCurves: "scope.modeTransferCurves",
		asteroids: "scope.modeAsteroids",
	};
	return t(keys[mode]);
};

const MODE_ICONS: Record<VisualizationMode, IconType> = {
	scopeHistory: LuActivity,
	spectrumWaterfall: LuChartNoAxesColumnIncreasing,
	waveform: LuAudioWaveform,
	orbital: LuOrbit,
	spectrogram: LuChartSpline,
	transferCurves: LuSpline,
	asteroids: LuRocket,
};

export function VisualizationModeTabs({
	compact = false,
}: {
	compact?: boolean;
}) {
	const { t } = useTranslation("synth");
	const activeMode = useSynthUiStore((state) => state.scopeVisualizationMode);
	const setMode = useSynthUiStore((state) => state.setScopeVisualizationMode);
	const [pickerOpen, setPickerOpen] = useState(false);
	const activeLabel = getModeLabel(activeMode, t);
	const ActiveIcon = MODE_ICONS[activeMode];

	if (compact) {
		return (
			<div className="relative">
				<button
					type="button"
					role="tab"
					aria-selected="true"
					aria-expanded={pickerOpen}
					aria-label={`${t("scope.visualizationModesAria")}: ${activeLabel}`}
					title={activeLabel}
					className="btn btn-square btn-sm h-8 min-h-0 w-9 border border-cz-cream/60 bg-cz-body text-base text-cz-cream shadow-lg ring-1 ring-black/80"
					onClick={() => setPickerOpen((open) => !open)}
				>
					<ActiveIcon aria-hidden="true" />
				</button>
				{pickerOpen ? (
					<div
						className="absolute top-full left-0 z-30 mt-1 grid w-40 max-w-none grid-cols-4 gap-0.5 rounded-md border border-cz-cream/40 bg-cz-body/95 p-1 shadow-xl"
						role="menu"
						aria-label={t("scope.visualizationModesAria")}
					>
						{VISUALIZATION_MODES.map((mode) => {
							const label = getModeLabel(mode, t);
							const Icon = MODE_ICONS[mode];
							return (
								<button
									key={mode}
									type="button"
									role="menuitem"
									aria-label={label}
									title={label}
									className={`btn btn-square btn-sm h-8 min-h-0 w-9 text-base ${activeMode === mode ? "bg-cz-tab-blue text-white" : "bg-cz-body text-cz-cream/70"}`}
									onClick={() => {
										setMode(mode);
										setPickerOpen(false);
									}}
								>
									<Icon aria-hidden="true" />
								</button>
							);
						})}
					</div>
				) : null}
			</div>
		);
	}

	return (
		<div
			className="scrollbar-none pointer-events-auto flex max-w-full shrink-0 gap-0.5 overflow-x-auto rounded-md border border-cz-border bg-cz-body/90 p-0.5 shadow-lg"
			role="tablist"
			aria-label={t("scope.visualizationModesAria")}
		>
			{VISUALIZATION_MODES.map((mode) => {
				const label = getModeLabel(mode, t);
				const Icon = MODE_ICONS[mode];
				return (
					<button
						key={mode}
						type="button"
						role="tab"
						aria-selected={activeMode === mode}
						aria-label={label}
						title={label}
						className={`btn btn-square btn-sm h-8 min-h-0 w-9 shrink-0 text-base ${activeMode === mode ? "bg-cz-tab-blue text-white" : "bg-cz-body text-cz-cream/70"}`}
						onClick={() => setMode(mode)}
					>
						<Icon aria-hidden="true" />
					</button>
				);
			})}
		</div>
	);
}
