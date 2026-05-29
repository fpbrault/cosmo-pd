import { drawScopeGrid, setupScopeCanvas } from "./canvas";
import {
	normalizeWindowedSamples,
	resolveScopeWindow,
	sampleAt,
} from "./processing";
import type { ScopeThemePalette } from "./types";

const TRIGGER_HYSTERESIS = 0.02;
const TRIGGER_SEARCH_MARGIN = 4;
const ORBITAL_LAST_TRIGGER = new WeakMap<HTMLCanvasElement, number>();

export function drawOrbitalScope(
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
		triggerEdge,
	);
	let startIndex = window.start;
	const lastIndex = ORBITAL_LAST_TRIGGER.get(canvas);
	if (lastIndex !== undefined) {
		const trigger = (triggerLevel - 128) / 128;
		const searchStart = Math.max(1, lastIndex - TRIGGER_SEARCH_MARGIN);
		const searchEnd = Math.min(
			samples.length - 1,
			lastIndex + TRIGGER_SEARCH_MARGIN,
		);
		for (let i = searchStart; i < searchEnd; i++) {
			const prev = sampleAt(samples, i - 1);
			const curr = sampleAt(samples, i);
			if (
				(triggerEdge === "rise" &&
					prev <= trigger - TRIGGER_HYSTERESIS &&
					curr >= trigger) ||
				(triggerEdge === "fall" &&
					prev >= trigger + TRIGGER_HYSTERESIS &&
					curr <= trigger)
			) {
				startIndex = i;
				break;
			}
		}
	}
	ORBITAL_LAST_TRIGGER.set(canvas, startIndex);
	if (triggerOffsetRef) {
		triggerOffsetRef.current = startIndex;
	}
	if (window.count < 8 || !window.samplesPerCycle) return;
	const normalized = normalizeWindowedSamples(
		samples,
		startIndex,
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
