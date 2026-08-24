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
		target,
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
		spectrogramBins = SPECTROGRAM_BINS,
		spectrogramFftSize = constrainedPerformance ? 128 : 256,
	} = params as ScopeRendererParams & { mode: ScopeVisualizationMode };

	if (mode === "spectrogram") {
		const bins =
			frequencyBins && frequencyBins.length > 0
				? frequencyBins
				: computeDftBins(samples, spectrogramBins, spectrogramFftSize);
		drawSpectrogramFrame(
			target,
			bins,
			spectrogramStateRef,
			palette,
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
				target,
				samples,
				hz,
				sampleRate,
				cycles,
				triggerLevel,
				zoom,
				palette,
				scopeWindow,
			);
			return;

		case "transferCurves":
			drawTransferCurvesScope(
				target,
				samples,
				hz,
				sampleRate,
				cycles,
				triggerLevel,
				zoom,
				palette,
				scopeWindow,
			);
			return;
		case "asteroids":
			drawAsteroidsScope(
				target,
				samples,
				hz,
				sampleRate,
				cycles,
				triggerLevel,
				zoom,
				palette,
				pressedKeys,
				intensityMultiplier,
			);
			return;

		case "scopeHistory":
		case "spectrumWaterfall":
			return;

		default:
			drawWaveformScope(
				target,
				samples,
				hz,
				sampleRate,
				cycles,
				triggerLevel,
				zoom,
				palette,
				scopeWindow,
			);
	}
}
