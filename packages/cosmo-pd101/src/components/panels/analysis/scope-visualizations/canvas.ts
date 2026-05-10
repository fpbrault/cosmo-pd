import { getScopeThemePalette, withAlpha } from "./palette";
import type { ScopeThemePalette } from "./types";

export function drawScopeBackdrop(
	canvas: HTMLCanvasElement,
	palette: ScopeThemePalette = getScopeThemePalette("vintage"),
) {
	const ctx = canvas.getContext("2d");
	if (!ctx) return;
	const dpr = Math.max(2, window.devicePixelRatio || 1);
	const drawWidth = Math.max(1, Math.floor(canvas.clientWidth));
	const drawHeight = Math.max(1, Math.floor(canvas.clientHeight));
	const pixelWidth = Math.floor(drawWidth * dpr);
	const pixelHeight = Math.floor(drawHeight * dpr);
	if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
		canvas.width = pixelWidth;
		canvas.height = pixelHeight;
	}
	ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
	ctx.fillStyle = palette.background;
	ctx.fillRect(0, 0, drawWidth, drawHeight);
	ctx.strokeStyle = withAlpha(palette.grid, 0.35);
	ctx.lineWidth = 1;
	for (let y = 0.25; y < 1; y += 0.25) {
		ctx.beginPath();
		ctx.moveTo(0, drawHeight * y);
		ctx.lineTo(drawWidth, drawHeight * y);
		ctx.stroke();
	}
	for (let x = 0.1; x < 1; x += 0.1) {
		ctx.beginPath();
		ctx.moveTo(drawWidth * x, 0);
		ctx.lineTo(drawWidth * x, drawHeight);
		ctx.stroke();
	}
	ctx.strokeStyle = withAlpha(palette.centerLine, 0.6);
	ctx.lineWidth = 1.5;
	ctx.beginPath();
	ctx.moveTo(0, drawHeight / 2);
	ctx.lineTo(drawWidth, drawHeight / 2);
	ctx.stroke();
}

export function setupScopeCanvas(canvas: HTMLCanvasElement) {
	const ctx = canvas.getContext("2d");
	if (!ctx) return null;
	const dpr = Math.max(2, window.devicePixelRatio || 1);
	const width = Math.max(1, Math.floor(canvas.clientWidth));
	const height = Math.max(1, Math.floor(canvas.clientHeight));
	const pixelWidth = Math.floor(width * dpr);
	const pixelHeight = Math.floor(height * dpr);
	if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
		canvas.width = pixelWidth;
		canvas.height = pixelHeight;
	}
	ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
	return { ctx, width, height };
}

export function drawScopeGrid(
	ctx: CanvasRenderingContext2D,
	width: number,
	height: number,
	palette: ScopeThemePalette = getScopeThemePalette("vintage"),
) {
	ctx.fillStyle = palette.background;
	ctx.fillRect(0, 0, width, height);
	ctx.strokeStyle = withAlpha(palette.grid, 0.35);
	ctx.lineWidth = 1;
	for (let y = 0.25; y < 1; y += 0.25) {
		ctx.beginPath();
		ctx.moveTo(0, height * y);
		ctx.lineTo(width, height * y);
		ctx.stroke();
	}
	for (let x = 0.1; x < 1; x += 0.1) {
		ctx.beginPath();
		ctx.moveTo(width * x, 0);
		ctx.lineTo(width * x, height);
		ctx.stroke();
	}
	ctx.strokeStyle = withAlpha(palette.centerLine, 0.6);
	ctx.lineWidth = 1.5;
	ctx.beginPath();
	ctx.moveTo(0, height / 2);
	ctx.lineTo(width, height / 2);
	ctx.stroke();
}
