import { drawOscilloscope } from "@/lib/synth/drawOscilloscope";
import type { ScopeThemePalette } from "./types";

export function drawWaveformScope(
	canvas: HTMLCanvasElement,
	samples: Uint8Array | Float32Array,
	hz: number,
	sampleRate: number,
	cycles: number,
	triggerLevel: number,
	zoom: number,
	palette: ScopeThemePalette,
) {
	drawOscilloscope(
		canvas,
		samples,
		{
			cycles,
			verticalZoom: zoom,
			triggerLevel,
			triggerMode: "rise",
			color: palette.accent,
			gridColor: palette.grid,
		},
		hz,
		sampleRate,
	);
}
