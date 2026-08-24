import type { VisualizationCanvasTarget } from "@/lib/canvasRenderTarget";
import { drawScopeGrid } from "./canvas";
import { normalizeWindowedSamples, resolveScopeWindow } from "./processing";
import type { ScopeThemePalette, ScopeWindow } from "./types";

export function drawTransferCurvesScope(
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
	const { context, width, height } = target;
	drawScopeGrid(context, width, height, palette);

	const window =
		scopeWindow ??
		resolveScopeWindow(samples, hz, sampleRate, cycles, triggerLevel);
	if (window.count < 16) return;
	const normalized = normalizeWindowedSamples(
		samples,
		window.start,
		window.count,
	);

	context.strokeStyle = palette.accentDim;
	context.lineWidth = 1;
	for (let guideIndex = 1; guideIndex < 4; guideIndex++) {
		const guideX = (width * guideIndex) / 4;
		context.beginPath();
		context.moveTo(guideX, 6);
		context.lineTo(guideX, height - 6);
		context.stroke();
	}

	const drive = Math.max(1.75, zoom * 2.8);
	context.shadowColor = palette.glow;
	context.shadowBlur = 8;
	context.strokeStyle = palette.accentSoft;
	context.lineWidth = 2;
	context.beginPath();
	for (let pointIndex = 0; pointIndex < normalized.length; pointIndex++) {
		const input = Math.max(-1, Math.min(1, normalized[pointIndex] * drive));
		const folded = Math.sin(input * Math.PI * 0.5);
		const curved = Math.tanh((input + folded * 0.35) * drive);
		const pointX = width / 2 + input * (width * 0.44);
		const pointY = height / 2 - curved * (height * 0.48);
		if (pointIndex === 0) {
			context.moveTo(pointX, pointY);
		} else {
			context.lineTo(pointX, pointY);
		}
	}
	context.stroke();
	context.shadowBlur = 0;

	context.fillStyle = palette.light;
	for (let markerIndex = 0; markerIndex <= 8; markerIndex++) {
		const input = markerIndex / 4 - 1;
		const curved = Math.tanh(input * drive);
		const pointX = width / 2 + input * (width * 0.44);
		const pointY = height / 2 - curved * (height * 0.48);
		context.fillRect(pointX - 1, pointY - 1, 2, 2);
	}
}
