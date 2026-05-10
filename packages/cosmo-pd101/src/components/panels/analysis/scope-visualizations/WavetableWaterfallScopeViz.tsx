import type { ScopeThemePalette } from "./types";
import { useWavetablePreview } from "./useWavetablePreview";
import { WavetableWaterfall } from "./WavetableWaterfall";

function toWaterfallPalettes(palette: ScopeThemePalette) {
	return {
		line1: {
			front: palette.accentSoft,
			back: palette.accentDim,
			activeGlow: palette.light,
			haloCurrent: palette.glow,
			haloBack: palette.soft,
			ambient: palette.accentSoft,
			pointA: palette.accent,
			pointB: palette.accentSecondary,
			background: palette.background,
			fog: palette.backgroundOverlay,
			glowOuter: palette.glow,
			glowMid: palette.accentSoft,
			glowCore: palette.light,
		},
		line2: {
			front: palette.highlight,
			back: palette.soft,
			activeGlow: palette.light,
			haloCurrent: palette.accentSecondary,
			haloBack: palette.accentDim,
			ambient: palette.accentSecondary,
			pointA: palette.accentSecondary,
			pointB: palette.accent,
			background: palette.background,
			fog: palette.backgroundOverlay,
			glowOuter: palette.accentSecondary,
			glowMid: palette.highlight,
			glowCore: palette.light,
		},
	};
}

export function WavetableWaterfallScopeViz({
	displayMode = "single",
	palette,
	visualIntensity = 1,
}: {
	displayMode?: "both" | "single";
	palette: ScopeThemePalette;
	visualIntensity?: number;
}) {
	const wavetablePreview = useWavetablePreview();
	const waterfallPalettes = toWaterfallPalettes(palette);

	return (
		<div className="h-full min-h-0 w-full">
			<WavetableWaterfall
				line1WaveHistory={wavetablePreview.line1History}
				line2WaveHistory={wavetablePreview.line2History}
				displayMode={displayMode}
				line1Palette={waterfallPalettes.line1}
				line2Palette={waterfallPalettes.line2}
				labelPosition="bottom-left"
				visualIntensity={visualIntensity}
			/>
		</div>
	);
}
