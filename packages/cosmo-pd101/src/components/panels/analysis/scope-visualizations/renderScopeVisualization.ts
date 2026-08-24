import { drawAsteroidsScope } from "./AsteroidsViz";
import { computeDftBins, SPECTROGRAM_BINS } from "./frequency";
import { drawOrbitalScope } from "./OrbitalViz";
import { drawSpectrogramFrame } from "./SpectrogramViz";
import { drawTransferCurvesScope } from "./TransferCurvesViz";
import type { ScopeRendererParams } from "./types";
import { drawWaveformScope } from "./WaveformViz";
import { drawWavetableWaterfallScope } from "./WavetableWaterfallCanvasViz";

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
		scopeWindow,
		zoom,
		palette,
		frequencyBins,
		spectrogramStateRef,
		pressedKeys,
		intensityMultiplier = 1,
		waterfallPreview,
		waterfallActiveLine = 1,
		constrainedPerformance = false,
		maxPixelRatio,
		spectrogramBins = SPECTROGRAM_BINS,
		spectrogramFftSize,
	} = params as ScopeRendererParams & { mode: ScopeVisualizationMode };
	if (maxPixelRatio !== undefined) {
		canvas.dataset.maxPixelRatio = String(maxPixelRatio);
	}

	if (mode === "spectrogram") {
		const bins =
			frequencyBins && frequencyBins.length > 0
				? frequencyBins
				: computeDftBins(
						samples,
						spectrogramBins,
						spectrogramFftSize ?? (constrainedPerformance ? 128 : 256),
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
				scopeWindow,
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
				scopeWindow,
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
				scopeWindow,
			);
	}
}
