import type { VisualizationCanvasTarget } from "@/lib/canvasRenderTarget";
import { drawOscilloscope } from "@/lib/synth/drawOscilloscope";
import type { ScopeThemePalette, ScopeWindow } from "./types";

export function drawWaveformScope(
	target: VisualizationCanvasTarget,
	samples: Uint8Array | Float32Array,
	hz: number,
	sampleRate: number,
	cycles: number,
	triggerLevel: number,
	zoom: number,
	palette: ScopeThemePalette,
	scopeWindow?: ScopeWindow,
) {
	drawOscilloscope(
		target,
		samples,
		{
			cycles,
			verticalZoom: zoom,
			triggerLevel,
			triggerMode: scopeWindow ? "off" : "rise",
			fixedWindowSamples: scopeWindow?.count,
			startIndex: scopeWindow?.start,
			color: palette.accent,
			gridColor: palette.grid,
		},
		hz,
		sampleRate,
	);
}
