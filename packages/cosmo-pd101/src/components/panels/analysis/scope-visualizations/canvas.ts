import type { VisualizationCanvasTarget } from "@/lib/canvasRenderTarget";
import { getScopeThemePalette, withAlpha } from "./palette";
import type { ScopeThemePalette } from "./types";

export function drawScopeBackdrop(
	target: VisualizationCanvasTarget,
	palette: ScopeThemePalette = getScopeThemePalette("vintage"),
) {
	drawScopeGrid(target.context, target.width, target.height, palette);
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
