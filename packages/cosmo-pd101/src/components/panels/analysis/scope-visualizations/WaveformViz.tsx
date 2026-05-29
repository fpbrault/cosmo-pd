import { drawOscilloscope } from "@/lib/synth/drawOscilloscope";
import type { ScopeThemePalette } from "./types";

export function drawWaveformScope(
	canvas: HTMLCanvasElement,
	samples: Uint8Array | Float32Array,
	hz: number,
	sampleRate: number,
	cycles: number,
	triggerLevel: number,
	triggerEdge: "rise" | "fall",
	zoom: number,
	palette: ScopeThemePalette,
	triggerOffsetRef?: { current: number | undefined },
) {
	drawOscilloscope(
		canvas,
		samples,
		{
			cycles,
			verticalZoom: zoom,
			triggerLevel,
			triggerMode: triggerEdge,
			lastTriggerIndex: triggerOffsetRef?.current,
			triggerOffsetRef,
			color: palette.accent,
			gridColor: palette.grid,
		},
		hz,
		sampleRate,
	);
}
