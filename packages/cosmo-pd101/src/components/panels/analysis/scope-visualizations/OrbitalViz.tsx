import { drawScopeGrid, setupScopeCanvas } from "./canvas";
import { normalizeWindowedSamples, resolveScopeWindow } from "./processing";
import type { ScopeThemePalette } from "./types";

export function drawOrbitalScope(
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
	if (window.count < 8 || !window.samplesPerCycle) return;
	const normalized = normalizeWindowedSamples(
		samples,
		window.start,
		window.count,
	);

	const cx = width / 2;
	const cy = height / 2;
	const radiusBase = Math.min(width, height) * 0.23;
	const radiusScale = Math.min(width, height) * 0.27 * zoom;

	ctx.strokeStyle = palette.accentDim;
	ctx.lineWidth = 1;
	ctx.beginPath();
	ctx.arc(cx, cy, radiusBase, 0, Math.PI * 2);
	ctx.stroke();
	ctx.beginPath();
	ctx.arc(cx, cy, radiusBase + radiusScale * 0.65, 0, Math.PI * 2);
	ctx.stroke();

	ctx.shadowColor = palette.glow;
	ctx.shadowBlur = 9;
	ctx.strokeStyle = palette.accent;
	ctx.lineWidth = 1.8;
	ctx.beginPath();
	for (let i = 0; i < window.count; i++) {
		const phase = (i % window.samplesPerCycle) / window.samplesPerCycle;
		const angle = phase * Math.PI * 2;
		const radius = radiusBase + normalized[i] * radiusScale;
		const x = cx + Math.cos(angle) * radius;
		const y = cy + Math.sin(angle) * radius;
		if (i === 0) {
			ctx.moveTo(x, y);
		} else {
			ctx.lineTo(x, y);
		}
	}
	ctx.stroke();
	ctx.shadowBlur = 0;
}
