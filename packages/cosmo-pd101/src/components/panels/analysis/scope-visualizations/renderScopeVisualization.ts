import {
	VISUALIZATION_MODES,
	type VisualizationMode,
} from "@/features/visualization/visualizationModes";
import { drawAsteroidsScope } from "./AsteroidsViz";
import { computeDftBins, SPECTROGRAM_BINS } from "./frequency";
import { drawOrbitalScope } from "./OrbitalViz";
import { drawSpectrogramFrame } from "./SpectrogramViz";
import { drawTransferCurvesScope } from "./TransferCurvesViz";
import type { ScopeRendererParams } from "./types";
import { drawWaveformScope } from "./WaveformViz";

export type ScopeVisualizationMode = VisualizationMode;

export const SCOPE_VISUALIZATION_MODES = VISUALIZATION_MODES;

export function renderScopeVisualization(params: ScopeRendererParams) {
	const {
		mode,
		canvas,
		samples,
		hz,
		sampleRate,
		cycles,
		triggerLevel,
		scopeWindow,
		zoom,
		palette,
		frequencyBins,
		spectrogramStateRef,
		pressedKeys,
		intensityMultiplier = 1,
		constrainedPerformance = false,
		maxPixelRatio = 2,
		spectrogramBins = SPECTROGRAM_BINS,
		spectrogramFftSize = constrainedPerformance ? 128 : 256,
	} = params as ScopeRendererParams & { mode: ScopeVisualizationMode };

	if (mode === "spectrogram") {
		const bins =
			frequencyBins && frequencyBins.length > 0
				? frequencyBins
				: computeDftBins(samples, spectrogramBins, spectrogramFftSize);
		drawSpectrogramFrame(
			canvas,
			bins,
			spectrogramStateRef,
			palette,
			maxPixelRatio,
			spectrogramBins,
			cycles,
			zoom,
		);
		return;
	}

	spectrogramStateRef.current = { width: 0, height: 0, history: null };

	switch (mode) {
		case "orbital":
			drawOrbitalScope(
				canvas,
				samples,
				hz,
				sampleRate,
				cycles,
				triggerLevel,
				zoom,
				palette,
				scopeWindow,
				maxPixelRatio,
			);
			return;

		case "transferCurves":
			drawTransferCurvesScope(
				canvas,
				samples,
				hz,
				sampleRate,
				cycles,
				triggerLevel,
				zoom,
				palette,
				scopeWindow,
				maxPixelRatio,
			);
			return;
		case "asteroids":
			drawAsteroidsScope(
				canvas,
				samples,
				hz,
				sampleRate,
				cycles,
				triggerLevel,
				zoom,
				palette,
				pressedKeys,
				intensityMultiplier,
				maxPixelRatio,
			);
			return;

		case "scopeHistory":
		case "spectrumWaterfall":
			return;

		default:
			drawWaveformScope(
				canvas,
				samples,
				hz,
				sampleRate,
				cycles,
				triggerLevel,
				zoom,
				palette,
				scopeWindow,
				maxPixelRatio,
			);
	}
}
