import { VisualizationDisplay } from "@/features/visualization/VisualizationDisplay";
import type { VisualizationMode } from "@/features/visualization/visualizationModes";
import {
	getPerformanceDisplayProfile as getTierProfile,
	type PerformanceQualityTier,
} from "./displayPerformance";

/** Compatibility wrapper for the Simple workspace's shared visualization surface. */
export default function PerformanceAudioDisplay({
	mode: _legacyMode,
}: {
	mode?: VisualizationMode | "scope" | "waterfall";
}) {
	const modeOverride: VisualizationMode | undefined =
		_legacyMode === "scope"
			? "scopeHistory"
			: _legacyMode === "waterfall"
				? "spectrumWaterfall"
				: _legacyMode;

	return <VisualizationDisplay surface="simple" modeOverride={modeOverride} />;
}

export function getPerformanceDisplayProfile(
	mode?: "standard" | "constrained",
	tier?: PerformanceQualityTier,
) {
	return getTierProfile(tier ?? (mode === "constrained" ? "balanced" : "high"));
}
