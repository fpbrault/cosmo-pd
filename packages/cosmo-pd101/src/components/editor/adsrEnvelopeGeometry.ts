import type { AdsrData, CurveShape } from "@/lib/synth/bindings/synth";

export type AdsrVoiceMarker = {
	id: string | number;
	phase: number;
	releasing?: boolean;
	color?: string;
};

export const CHART_PADDING_Y = 8;
export const CHART_PADDING_X = 12;

const SAMPLES = 120;

function curveInterpolate(t: number, shape: CurveShape): number {
	switch (shape) {
		case "linear":
			return t;
		case "exp":
			return t * t;
		case "log":
			return 1 - (1 - t) * (1 - t);
	}
}

export function sampleAdsr(data: AdsrData, samples: number): number[] {
	const totalTime =
		data.attackTimeSecs + data.decayTimeSecs + data.releaseTimeSecs;
	const sustainStart = data.attackTimeSecs + data.decayTimeSecs;
	const releaseStart = sustainStart;
	const endTime = totalTime;

	const result: number[] = [];
	for (let i = 0; i < samples; i++) {
		const t = (i / samples) * endTime;
		if (t < data.attackTimeSecs) {
			const p = t / data.attackTimeSecs;
			result.push(curveInterpolate(p, data.attackCurve));
		} else if (t < sustainStart) {
			const p = (t - data.attackTimeSecs) / data.decayTimeSecs;
			const decayed =
				1 - (1 - data.sustainLevel) * curveInterpolate(p, data.decayCurve);
			result.push(decayed);
		} else if (t < releaseStart + data.releaseTimeSecs) {
			const p = (t - releaseStart) / data.releaseTimeSecs;
			const released =
				data.sustainLevel * (1 - curveInterpolate(p, data.releaseCurve));
			result.push(released);
		} else {
			result.push(0);
		}
	}
	return result;
}

export type AdsrPoint = {
	x: number;
	y: number;
};

export function buildAdsrPoints(
	data: AdsrData,
	width: number,
	height: number,
): AdsrPoint[] {
	const drawWidth = width - CHART_PADDING_X * 2;
	const drawHeight = height - CHART_PADDING_Y * 2;

	const samples = sampleAdsr(data, SAMPLES);
	if (samples.length === 0) return [];

	const totalTime =
		data.attackTimeSecs + data.decayTimeSecs + data.releaseTimeSecs;
	if (totalTime <= 0) return [];

	return samples.map((value, i) => ({
		x: CHART_PADDING_X + (i / (samples.length - 1)) * drawWidth,
		y: CHART_PADDING_Y + (1 - Math.max(0, Math.min(1, value))) * drawHeight,
	}));
}

export function getAdsrMarkerX(
	points: AdsrPoint[],
	marker: AdsrVoiceMarker,
): number | null {
	if (points.length === 0) return null;
	const index = Math.round(
		Math.max(0, Math.min(1, marker.phase)) * (points.length - 1),
	);
	const point = points[index];
	if (!point) return points[points.length - 1]?.x ?? null;
	return point.x;
}

export function drawAdsrPreview(
	canvas: HTMLCanvasElement,
	data: AdsrData,
	color: string,
	voiceMarkers: AdsrVoiceMarker[] = [],
	preview = false,
) {
	const ctx = canvas.getContext("2d");
	if (!ctx) return;

	const dpr = window.devicePixelRatio || 1;
	const w = canvas.clientWidth || canvas.width;
	const h = canvas.clientHeight || canvas.height;
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

	const points = buildAdsrPoints(data, w, h);
	if (points.length === 0) return;

	ctx.strokeStyle = color;
	ctx.lineWidth = preview ? 1.5 : 2;
	ctx.beginPath();
	ctx.moveTo(CHART_PADDING_X, CHART_PADDING_Y + drawHeight);
	for (const p of points) {
		ctx.lineTo(p.x, p.y);
	}
	ctx.stroke();

	for (const marker of voiceMarkers) {
		const x = getAdsrMarkerX(points, marker);
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

	const lastIndex = points.length - 1;
	for (let i = 0; i <= lastIndex; i++) {
		const p = points[i];
		if (
			i === 0 ||
			i === lastIndex ||
			i === Math.round(lastIndex * 0.33) ||
			i === Math.round(lastIndex * 0.66)
		) {
			ctx.fillStyle = color;
			ctx.beginPath();
			ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
			ctx.fill();
		}
	}
}
