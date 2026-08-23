import { drawOscilloscope } from "@/lib/synth/drawOscilloscope";
import type { ScopeThemePalette, ScopeWindow } from "./types";

export function drawWaveformScope(
	canvas: HTMLCanvasElement,
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
		canvas,
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
