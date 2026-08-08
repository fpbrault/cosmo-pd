import type { StepEnvData } from "@/lib/synth/bindings/synth";

export type StepEnvelopeVoiceMarker = {
	id: string | number;
	step: number;
	progress?: number;
	releasing?: boolean;
	color?: string;
};

export type EnvPoint = {
	index: number;
	x: number;
	y: number;
};

export const CHART_PADDING_Y = 8;
export const CHART_PADDING_X = 12;

export function clamp(value: number, min: number, max: number) {
	return Math.max(min, Math.min(max, value));
}

export { normalizeEnvelope } from "@/lib/synth/envelopeData";

export function editorStepDuration(rate: number): number {
	const clampedRate = clamp(Math.round(rate), 0, 99);
	return 2 ** (-clampedRate / 10);
}

export function getStepAllowedXRange(
	stepIndex: number,
	activeStepCount: number,
	canvasWidth: number,
	steps: { rate?: number | null; level?: number | null }[],
) {
	const drawWidth = canvasWidth - CHART_PADDING_X * 2;
	const activeSteps = steps.slice(0, activeStepCount);
	if (activeSteps.length === 0) {
		return { minX: CHART_PADDING_X, maxX: canvasWidth - CHART_PADDING_X };
	}

	let totalTime = 0;
	for (const step of activeSteps)
		totalTime += editorStepDuration(step.rate ?? 0);
	if (totalTime <= 0) totalTime = 1;

	let prevX = CHART_PADDING_X;
	const pointXs: number[] = [];
	for (let i = 0; i < activeSteps.length; i++) {
		const duration = editorStepDuration(activeSteps[i].rate ?? 0);
		const dx = (duration / totalTime) * drawWidth;
		const x = prevX + dx;
		pointXs.push(x);
		prevX = x;
	}

	const minX = stepIndex === 0 ? CHART_PADDING_X : pointXs[stepIndex - 1];
	const maxX =
		stepIndex >= pointXs.length - 1
			? canvasWidth - CHART_PADDING_X
			: pointXs[stepIndex + 1];

	return { minX, maxX };
}

export function buildEnvelopePoints(
	env: StepEnvData,
	width: number,
	height: number,
): EnvPoint[] {
	const activeSteps = env.steps.slice(0, env.stepCount);
	if (activeSteps.length === 0) return [];

	const drawWidth = width - CHART_PADDING_X * 2;
	const drawHeight = height - CHART_PADDING_Y * 2;

	let totalTime = 0;
	for (const step of activeSteps)
		totalTime += editorStepDuration(step.rate ?? 0);
	if (totalTime <= 0) totalTime = 1;

	const points: EnvPoint[] = [];
	let x = CHART_PADDING_X;

	for (let i = 0; i < activeSteps.length; i++) {
		const step = activeSteps[i];
		const isLastStep = i === activeSteps.length - 1;
		const effectiveLevel = isLastStep ? 0 : (step.level ?? 0);
		const duration = editorStepDuration(step.rate ?? 0);
		const dx = (duration / totalTime) * drawWidth;
		x += dx;
		points.push({
			index: i,
			x,
			y: CHART_PADDING_Y + (1 - effectiveLevel / 99) * drawHeight,
		});
	}

	return points;
}

export function getMarkerX(
	points: EnvPoint[],
	marker: StepEnvelopeVoiceMarker,
): number | null {
	if (points.length === 0) return null;
	const stepIndex = clamp(Math.round(marker.step), 0, points.length - 1);
	const point = points[stepIndex];
	if (!point) return null;

	if (marker.progress === undefined) return point.x;

	const fromX = stepIndex === 0 ? CHART_PADDING_X : points[stepIndex - 1].x;
	const progress = clamp(marker.progress, 0, 1);
	return fromX + (point.x - fromX) * progress;
}

export function findClosestPoint(
	points: EnvPoint[],
	x: number,
	y: number,
): { point: EnvPoint; distanceSquared: number } | null {
	if (points.length === 0) return null;

	let closest = points[0];
	let bestDist = Number.POSITIVE_INFINITY;

	for (const point of points) {
		const dx = point.x - x;
		const dy = point.y - y;
		const dist = dx * dx + dy * dy;
		if (dist < bestDist) {
			bestDist = dist;
			closest = point;
		}
	}

	return { point: closest, distanceSquared: bestDist };
}

export function drawEnvPreview(
	canvas: HTMLCanvasElement,
	env: StepEnvData,
	color: string,
	highlightStep: number | null,
	voiceMarkers: StepEnvelopeVoiceMarker[] = [],
	preview = false,
) {
	const dpr = window.devicePixelRatio || 1;
	const w = canvas.clientWidth;
	const h = canvas.clientHeight;
	if (w <= 0 || h <= 0) return;

	const ctx = canvas.getContext("2d");
	if (!ctx) return;
	const targetW = Math.round(w * dpr);
	const targetH = Math.round(h * dpr);
	if (canvas.width !== targetW || canvas.height !== targetH) {
		canvas.width = targetW;
		canvas.height = targetH;
	}
	ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
	const drawHeight = h - CHART_PADDING_Y * 2;
	ctx.clearRect(0, 0, w, h);

	ctx.fillStyle = "rgba(0,0,0,0.3)";
	ctx.fillRect(0, 0, w, h);

	ctx.strokeStyle = preview
		? "rgba(100,100,100,0.18)"
		: "rgba(100,100,100,0.3)";
	ctx.lineWidth = 1;
	for (let y = 0.25; y < 1; y += 0.25) {
		ctx.beginPath();
		ctx.moveTo(CHART_PADDING_X, h * (1 - y));
		ctx.lineTo(w - CHART_PADDING_X, h * (1 - y));
		ctx.stroke();
	}
	const points = buildEnvelopePoints(env, w, h);

	ctx.strokeStyle = color;
	ctx.lineWidth = preview ? 1.5 : 2;
	ctx.beginPath();
	ctx.moveTo(CHART_PADDING_X, CHART_PADDING_Y + drawHeight);
	for (let i = 0; i < points.length; i++) {
		ctx.lineTo(points[i].x, points[i].y);
	}
	ctx.stroke();

	const susStep = Math.min(env.sustainStep, env.stepCount - 1);
	if (susStep >= 0 && susStep < points.length) {
		const sp = points[susStep];
		ctx.strokeStyle = preview ? "rgba(255,200,0,0.45)" : "rgba(255,200,0,0.6)";
		ctx.lineWidth = preview ? 0.8 : 1;
		ctx.setLineDash([3, 3]);
		ctx.beginPath();
		ctx.moveTo(sp.x, CHART_PADDING_Y);
		ctx.lineTo(sp.x, h - CHART_PADDING_Y);
		ctx.stroke();
		ctx.setLineDash([]);
	}

	for (const marker of voiceMarkers) {
		const x = getMarkerX(points, marker);
		if (x === null) continue;

		ctx.strokeStyle =
			marker.color ?? (marker.releasing ? "#f59e0b" : "#f8fafc");
		ctx.lineWidth = marker.releasing ? 1 : 1.5;
		ctx.globalAlpha = marker.releasing ? 0.65 : 0.9;
		ctx.beginPath();
		ctx.moveTo(x, CHART_PADDING_Y);
		ctx.lineTo(x, h - CHART_PADDING_Y);
		ctx.stroke();
		ctx.globalAlpha = 1;
	}

	if (preview) return;

	for (let i = 0; i < points.length; i++) {
		const p = points[i];
		const isHighlighted = highlightStep === p.index;
		if (isHighlighted) {
			ctx.strokeStyle = "rgba(255,255,255,0.8)";
			ctx.lineWidth = 2;
			ctx.beginPath();
			ctx.arc(p.x, p.y, 11, 0, Math.PI * 2);
			ctx.stroke();
		}

		ctx.fillStyle = p.index === susStep ? "#fbbf24" : color;
		ctx.beginPath();
		ctx.arc(p.x, p.y, 8, 0, Math.PI * 2);
		ctx.fill();
	}
}
