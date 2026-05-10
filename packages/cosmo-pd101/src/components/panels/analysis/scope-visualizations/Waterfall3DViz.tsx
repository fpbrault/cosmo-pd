import { drawScopeGrid, setupScopeCanvas } from "./canvas";
import { withAlpha } from "./palette";
import { normalizeWindowedSamples, resolveScopeWindow } from "./processing";
import type { ScopeThemePalette } from "./types";

export function drawWaterfall3DScope(
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

	const traceCount = 20;
	const pointCount = 64;
	const compressed = new Float32Array(pointCount);
	for (let i = 0; i < pointCount; i++) {
		const idx = Math.floor((i / (pointCount - 1)) * (normalized.length - 1));
		compressed[i] = normalized[idx] ?? 0;
	}

	ctx.strokeStyle = palette.accentDim;
	ctx.lineWidth = 1;
	for (let i = 1; i <= traceCount; i++) {
		const y = 8 + (i / traceCount) * (height - 18);
		ctx.beginPath();
		ctx.moveTo(6, y);
		ctx.lineTo(width - 6, y);
		ctx.stroke();
	}

	for (let layer = 0; layer < traceCount; layer++) {
		const depth = layer / (traceCount - 1);
		const lift = depth * (height * 0.63);
		const perspective = 1 - depth * 0.55;
		const alpha = 0.08 + (1 - depth) * 0.8;
		const glow = layer < 3;

		ctx.shadowColor = glow ? palette.glow : withAlpha(palette.glow, 0);
		ctx.shadowBlur = glow ? 8 - layer * 2 : 0;
		ctx.strokeStyle = withAlpha(palette.accent, alpha);
		ctx.lineWidth = glow ? 1.9 : 1.2;
		ctx.beginPath();
		for (let i = 0; i < pointCount; i++) {
			const x =
				width * 0.08 +
				(i / (pointCount - 1)) * width * 0.84 * perspective +
				depth * width * 0.09;
			const y =
				height -
				10 -
				lift +
				compressed[i] * zoom * (height * 0.24) * perspective;
			if (i === 0) {
				ctx.moveTo(x, y);
			} else {
				ctx.lineTo(x, y);
			}
		}
		ctx.stroke();
	}
	ctx.shadowBlur = 0;
}
