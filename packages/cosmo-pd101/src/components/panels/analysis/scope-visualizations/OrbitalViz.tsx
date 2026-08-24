import type { VisualizationCanvasTarget } from "@/lib/canvasRenderTarget";
import { drawScopeGrid } from "./canvas";
import { normalizeWindowedSamples, resolveScopeWindow } from "./processing";
import type { ScopeThemePalette, ScopeWindow } from "./types";

export function drawOrbitalScope(
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

	context.strokeStyle = palette.accentDim;
	context.lineWidth = 1;
	context.beginPath();
	context.arc(cx, cy, radiusBase, 0, Math.PI * 2);
	context.stroke();
	context.beginPath();
	context.arc(cx, cy, radiusBase + radiusScale * 0.65, 0, Math.PI * 2);
	context.stroke();

	context.shadowColor = palette.glow;
	context.shadowBlur = 9;
	context.strokeStyle = palette.accent;
	context.lineWidth = 1.8;
	context.beginPath();
	for (let i = 0; i < window.count; i++) {
		const phase = (i % window.samplesPerCycle) / window.samplesPerCycle;
		const angle = phase * Math.PI * 2;
		const radius = radiusBase + normalized[i] * radiusScale;
		const x = cx + Math.cos(angle) * radius;
		const y = cy + Math.sin(angle) * radius;
		if (i === 0) {
			context.moveTo(x, y);
		} else {
			context.lineTo(x, y);
		}
	}
	context.stroke();
	context.shadowBlur = 0;
}
