import { drawAsteroidsScope } from "../visualizations/AsteroidsViz";
import { drawOrbitalScope } from "../visualizations/OrbitalViz";
import { drawSpectrogramFrame } from "../visualizations/SpectrogramViz";
import { drawTransferCurvesScope } from "../visualizations/TransferCurvesViz";
import { drawWaveformScope } from "../visualizations/WaveformViz";
import { drawWavetableWaterfallScope } from "../waterfall/WavetableWaterfallCanvasViz";
import { computeDftBins, SPECTROGRAM_BINS } from "./frequency";
import type { ScopeRendererParams } from "./types";

export type ScopeVisualizationMode =
	| "waveform"
	| "orbital"
	| "spectrogram"
	| "waterfall3d"
	| "transferCurves"
	| "asteroids";

export const SCOPE_VISUALIZATION_MODES: ScopeVisualizationMode[] = [
	"waveform",
	"orbital",
	"spectrogram",
	"waterfall3d",
	"transferCurves",
	"asteroids",
];

export function renderScopeVisualization(params: ScopeRendererParams) {
	const {
		mode,
		canvas,
		samples,
		hz,
		sampleRate,
		cycles,
		triggerLevel,
		zoom,
		palette,
		frequencyBins,
		spectrogramStateRef,
		pressedKeys,
		intensityMultiplier = 1,
		waterfallPreview,
		waterfallActiveLine = 1,
		constrainedPerformance = false,
	} = params as ScopeRendererParams & { mode: ScopeVisualizationMode };

	if (mode === "spectrogram") {
		const bins =
			frequencyBins && frequencyBins.length > 0
				? frequencyBins
				: computeDftBins(
						samples,
						SPECTROGRAM_BINS,
						constrainedPerformance ? 128 : 256,
					);
		drawSpectrogramFrame(canvas, bins, spectrogramStateRef, palette);
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
			);
			return;

		case "waterfall3d":
			drawWavetableWaterfallScope(
				canvas,
				palette,
				waterfallPreview,
				waterfallActiveLine,
				intensityMultiplier,
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
			);
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
			);
	}
}
