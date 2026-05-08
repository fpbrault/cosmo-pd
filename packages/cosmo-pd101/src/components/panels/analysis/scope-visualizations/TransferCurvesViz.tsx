import { drawScopeGrid, setupScopeCanvas } from "./canvas";
import { normalizeWindowedSamples, resolveScopeWindow } from "./processing";
import type { ScopeThemePalette } from "./types";

export function drawTransferCurvesScope(
	canvas: HTMLCanvasElement,
	samples: Uint8Array | Float32Array,
	hz: number,
	sampleRate: number,
	cycles: number,
	triggerLevel: number,
	zoom: number,
	palette: ScopeThemePalette,
) {
	const setup = setupScopeCanvas(canvas);
	if (!setup) return;
	const { ctx, width, height } = setup;
	drawScopeGrid(ctx, width, height, palette);

	const window = resolveScopeWindow(
		samples,
		hz,
		sampleRate,
		cycles,
		triggerLevel,
	);
	if (window.count < 16) return;
	const normalized = normalizeWindowedSamples(
		samples,
		window.start,
		window.count,
	);

	ctx.strokeStyle = palette.accentDim;
	ctx.lineWidth = 1;
	for (let guideIndex = 1; guideIndex < 4; guideIndex++) {
		const guideX = (width * guideIndex) / 4;
		ctx.beginPath();
		ctx.moveTo(guideX, 6);
		ctx.lineTo(guideX, height - 6);
		ctx.stroke();
	}

	const drive = Math.max(1.75, zoom * 2.8);
	ctx.shadowColor = palette.glow;
	ctx.shadowBlur = 8;
	ctx.strokeStyle = palette.accentSoft;
	ctx.lineWidth = 2;
	ctx.beginPath();
	for (let pointIndex = 0; pointIndex < normalized.length; pointIndex++) {
		const input = Math.max(-1, Math.min(1, normalized[pointIndex] * drive));
		const folded = Math.sin(input * Math.PI * 0.5);
		const curved = Math.tanh((input + folded * 0.35) * drive);
		const pointX = width / 2 + input * (width * 0.44);
		const pointY = height / 2 - curved * (height * 0.48);
		if (pointIndex === 0) {
			ctx.moveTo(pointX, pointY);
		} else {
			ctx.lineTo(pointX, pointY);
		}
	}
	ctx.stroke();
	ctx.shadowBlur = 0;

	ctx.fillStyle = palette.light;
	for (let markerIndex = 0; markerIndex <= 8; markerIndex++) {
		const input = markerIndex / 4 - 1;
		const curved = Math.tanh(input * drive);
		const pointX = width / 2 + input * (width * 0.44);
		const pointY = height / 2 - curved * (height * 0.48);
		ctx.fillRect(pointX - 1, pointY - 1, 2, 2);
	}
}
