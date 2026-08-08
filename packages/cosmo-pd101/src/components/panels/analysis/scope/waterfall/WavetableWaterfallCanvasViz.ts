import { drawScopeGrid, setupScopeCanvas } from "../rendering/canvas";
import { withAlpha } from "../rendering/palette";
import type {
	ScopeThemePalette,
	WaterfallPreviewData,
	WaterfallPreviewIndicator,
} from "../rendering/types";
import { lineInfluence } from "./waterfallPreview";

type WaterfallPalette = {
	front: string;
	back: string;
	activeGlow: string;
	haloCurrent: string;
	haloBack: string;
	glowOuter: string;
	glowMid: string;
	glowCore: string;
	label: string;
};

type WaterfallLayout = {
	frontBaseY: number;
	depthTravel: number;
	amplitude: number;
	xStart: number;
	xSpan: number;
	xDrift: number;
};

function clamp(value: number, min: number, max: number): number {
	return Math.max(min, Math.min(max, value));
}

function toHexPair(value: number): string {
	return value.toString(16).padStart(2, "0");
}

function parseHexChannel(hex: string, start: number): number {
	return Number.parseInt(hex.slice(start, start + 2), 16);
}

function lerpHexColor(from: string, to: string, t: number): string {
	const clamped = clamp(t, 0, 1);
	const fromR = parseHexChannel(from, 1);
	const fromG = parseHexChannel(from, 3);
	const fromB = parseHexChannel(from, 5);
	const toR = parseHexChannel(to, 1);
	const toG = parseHexChannel(to, 3);
	const toB = parseHexChannel(to, 5);

	const r = Math.round(fromR + (toR - fromR) * clamped);
	const g = Math.round(fromG + (toG - fromG) * clamped);
	const b = Math.round(fromB + (toB - fromB) * clamped);

	return `#${toHexPair(r)}${toHexPair(g)}${toHexPair(b)}`;
}

function toWaterfallPalette(
	palette: ScopeThemePalette,
	activeLine: 1 | 2,
): WaterfallPalette {
	if (activeLine === 1) {
		return {
			front: palette.accentSoft,
			back: palette.accentDim,
			activeGlow: palette.light,
			haloCurrent: palette.glow,
			haloBack: palette.soft,
			glowOuter: palette.glow,
			glowMid: palette.accentSoft,
			glowCore: palette.light,
			label: "LINE 1",
		};
	}

	return {
		front: palette.highlight,
		back: palette.soft,
		activeGlow: palette.light,
		haloCurrent: palette.accentSecondary,
		haloBack: palette.accentDim,
		glowOuter: palette.accentSecondary,
		glowMid: palette.highlight,
		glowCore: palette.light,
		label: "LINE 2",
	};
}

function drawLabel(
	ctx: CanvasRenderingContext2D,
	_width: number,
	height: number,
	palette: WaterfallPalette,
) {
	ctx.save();
	ctx.font = "10px monospace";
	ctx.textBaseline = "bottom";
	ctx.textAlign = "left";
	ctx.fillStyle = withAlpha(palette.glowCore, 0.9);
	ctx.fillText(palette.label, 10, height - 8);
	ctx.restore();
}

function getWaterfallLayout(width: number, height: number): WaterfallLayout {
	const heightBias = clamp((height - 170) / 520, 0, 1);
	const miniLift = height < 220 ? (220 - height) * 0.64 : 0;

	return {
		frontBaseY: height * (0.83 - heightBias * 0.11) - miniLift,
		depthTravel: height * (0.31 + heightBias * 0.15),
		amplitude: height * (0.15 + heightBias * -0.05),
		xStart: width * 0.14,
		xSpan: width * 0.74,
		xDrift: width * 0.27,
	};
}

function drawGlowTrace(
	ctx: CanvasRenderingContext2D,
	points: number[],
	layout: WaterfallLayout,
	depth: number,
	strokeStyle: string,
	lineWidth: number,
	alpha: number,
) {
	const perspective = 1 - depth * 0.55;
	const lift = depth * layout.depthTravel;
	const xOffset = depth * layout.xDrift;
	const amplitude = layout.amplitude * perspective;
	const baseY = layout.frontBaseY - lift;

	ctx.beginPath();
	for (let index = 0; index < points.length; index++) {
		const x =
			layout.xStart +
			(index / Math.max(1, points.length - 1)) * layout.xSpan * perspective +
			xOffset;
		const y = baseY + points[index] * amplitude;
		if (index === 0) {
			ctx.moveTo(x, y);
		} else {
			ctx.lineTo(x, y);
		}
	}
	ctx.strokeStyle = strokeStyle;
	ctx.lineWidth = lineWidth;
	ctx.globalAlpha = alpha;
	ctx.stroke();
}

function interpolateWave(
	history: number[][],
	progress: number,
): number[] | null {
	if (!history.length) {
		return null;
	}

	const clampedProgress = clamp(progress, 0, history.length - 1);
	const leftIndex = Math.floor(clampedProgress);
	const rightIndex = Math.min(history.length - 1, leftIndex + 1);
	const mix = clampedProgress - leftIndex;
	const left = history[leftIndex];
	const right = history[rightIndex] ?? left;
	if (!left || !right || left.length !== right.length) {
		return left ?? null;
	}

	return left.map(
		(sample, pointIndex) =>
			sample + ((right[pointIndex] ?? sample) - sample) * mix,
	);
}

function drawIndicatorGlow(
	ctx: CanvasRenderingContext2D,
	indicator: WaterfallPreviewIndicator,
	history: number[][],
	layout: WaterfallLayout,
	palette: WaterfallPalette,
	intensityMultiplier: number,
) {
	const points = interpolateWave(history, indicator.progress);
	if (!points || points.length < 2) {
		return;
	}

	const normalizedStrength =
		clamp(indicator.strength, 0, 1) * intensityMultiplier;
	const depth = clamp(
		Math.max(0, indicator.progress) / Math.max(1, history.length - 1),
		0,
		1,
	);

	ctx.save();
	ctx.shadowBlur = 0;
	drawGlowTrace(
		ctx,
		points,
		layout,
		depth,
		withAlpha(palette.glowOuter, 0.95),
		12 + normalizedStrength * 5,
		0.05 + normalizedStrength * 0.06,
	);
	drawGlowTrace(
		ctx,
		points,
		layout,
		depth,
		withAlpha(palette.glowMid, 0.98),
		7 + normalizedStrength * 3,
		0.11 + normalizedStrength * 0.12,
	);
	drawGlowTrace(
		ctx,
		points,
		layout,
		depth,
		withAlpha(palette.glowCore, 1),
		3 + normalizedStrength * 1.5,
		0.28 + normalizedStrength * 0.22,
	);
	ctx.restore();
}

export function drawWavetableWaterfallScope(
	canvas: HTMLCanvasElement,
	palette: ScopeThemePalette,
	preview: WaterfallPreviewData | null | undefined,
	activeLine: 1 | 2,
	intensityMultiplier = 1,
) {
	const setup = setupScopeCanvas(canvas);
	if (!setup) {
		return;
	}

	const { ctx, width, height } = setup;
	drawScopeGrid(ctx, width, height, palette);
	const layout = getWaterfallLayout(width, height);

	const waterfallPalette = toWaterfallPalette(palette, activeLine);
	const history =
		activeLine === 1
			? (preview?.line1History ?? [])
			: (preview?.line2History ?? []);
	const indicators =
		activeLine === 1
			? (preview?.line1Indicators ?? [])
			: (preview?.line2Indicators ?? []);

	drawLabel(ctx, width, height, waterfallPalette);
	if (!history.length) {
		return;
	}

	ctx.save();
	ctx.strokeStyle = withAlpha(palette.accentDim, 0.32);
	ctx.lineWidth = 1;
	for (let index = 1; index <= 20; index++) {
		const y = 8 + (index / 20) * (height - 22);
		ctx.beginPath();
		ctx.moveTo(8, y);
		ctx.lineTo(width - 8, y);
		ctx.stroke();
	}

	for (let layer = history.length - 1; layer >= 0; layer--) {
		const wave = history[layer];
		if (!wave || wave.length < 2) {
			continue;
		}

		const depth = history.length > 1 ? layer / (history.length - 1) : 0;
		const perspective = 1 - depth * 0.55;
		const lift = depth * layout.depthTravel;
		const xOffset = depth * layout.xDrift;
		const amplitude = layout.amplitude * perspective;
		const baseY = layout.frontBaseY - lift;
		const isCurrent = layer === 0;
		const glowMix = indicators.reduce(
			(max, indicator) =>
				Math.max(
					max,
					lineInfluence(layer, indicator.progress) * indicator.strength,
				),
			0,
		);
		const strokeColor = lerpHexColor(
			lerpHexColor(waterfallPalette.front, waterfallPalette.back, depth),
			waterfallPalette.activeGlow,
			glowMix,
		);

		ctx.beginPath();
		for (let pointIndex = 0; pointIndex < wave.length; pointIndex++) {
			const x =
				layout.xStart +
				(pointIndex / Math.max(1, wave.length - 1)) *
					layout.xSpan *
					perspective +
				xOffset;
			const y = baseY + wave[pointIndex] * amplitude;
			if (pointIndex === 0) {
				ctx.moveTo(x, y);
			} else {
				ctx.lineTo(x, y);
			}
		}

		if (isCurrent) {
			ctx.shadowColor = withAlpha(waterfallPalette.haloCurrent, 0.75);
			ctx.shadowBlur = 10;
		} else {
			ctx.shadowColor = withAlpha(waterfallPalette.haloBack, 0.35);
			ctx.shadowBlur = 4;
		}
		ctx.strokeStyle = withAlpha(strokeColor, 0.3 + (1 - depth) * 0.65);
		ctx.lineWidth =
			((isCurrent ? 2.5 : 1.15) + glowMix * 1.25) * intensityMultiplier;
		ctx.globalAlpha = Math.min(
			0.96,
			((isCurrent ? 0.9 : 0.22 + (1 - depth) * 0.58) + glowMix * 0.18) *
				intensityMultiplier,
		);
		ctx.stroke();
	}

	ctx.restore();

	for (const indicator of indicators) {
		drawIndicatorGlow(
			ctx,
			indicator,
			history,
			layout,
			waterfallPalette,
			intensityMultiplier,
		);
	}

	ctx.globalAlpha = 1;
	ctx.shadowBlur = 0;
}
