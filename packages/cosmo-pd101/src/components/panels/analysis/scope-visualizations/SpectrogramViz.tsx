import { setupScopeCanvas } from "./canvas";
import {
	downsampleBins,
	SPECTROGRAM_BINS,
	spectrogramColor,
} from "./frequency";
import { withAlpha } from "./palette";
import type { ScopeThemePalette, SpectrogramStateRef } from "./types";

export function drawSpectrogramFrame(
	canvas: HTMLCanvasElement,
	bins: Uint8Array<ArrayBufferLike>,
	spectrogramStateRef: SpectrogramStateRef,
	palette: ScopeThemePalette,
	maxPixelRatio = 2,
	binCount = SPECTROGRAM_BINS,
	cycles = 2,
	zoom = 1,
) {
	const setup = setupScopeCanvas(canvas, maxPixelRatio);
	if (!setup) return;
	const { ctx, width, height } = setup;

	if (width <= 0 || height <= 0) return;

	const expectedHistoryLength = width * binCount;
	if (
		spectrogramStateRef.current.width !== width ||
		spectrogramStateRef.current.height !== height ||
		spectrogramStateRef.current.history == null ||
		spectrogramStateRef.current.history.length !== expectedHistoryLength
	) {
		spectrogramStateRef.current = {
			width,
			height,
			history: new Uint8Array(expectedHistoryLength),
		};
	}

	const effectiveBins = downsampleBins(bins, binCount);
	const history = spectrogramStateRef.current.history;
	if (!history) return;

	const timeScale = Math.max(0.5, Math.min(2, cycles / 2));
	const columnWidth = Math.max(1, Math.round(timeScale));
	if (width > columnWidth) {
		history.copyWithin(0, columnWidth * binCount, history.length);
	}
	const magnitudeScale = Math.max(0.25, Math.min(4, zoom));
	const firstColumn = Math.max(0, width - columnWidth);
	for (let column = firstColumn; column < width; column++) {
		const columnOffset = column * binCount;
		for (let i = 0; i < binCount; i++) {
			history[columnOffset + i] = Math.min(
				255,
				Math.round((effectiveBins[i] ?? 0) * magnitudeScale),
			);
		}
	}

	ctx.fillStyle = palette.background;
	ctx.fillRect(0, 0, width, height);
	const binHeight = height / binCount;
	for (let x = 0; x < width; x++) {
		const xOffset = x * binCount;
		for (let i = 0; i < binCount; i++) {
			const mag = history[xOffset + i] ?? 0;
			if (mag < 2) continue;
			ctx.fillStyle = spectrogramColor(mag, palette);
			const y = height - (i + 1) * binHeight;
			ctx.fillRect(x, y, 1, Math.ceil(binHeight) + 1);
		}
	}

	ctx.strokeStyle = withAlpha(palette.grid, 0.3);
	ctx.lineWidth = 1;
	for (let y = 0.2; y < 1; y += 0.2) {
		ctx.beginPath();
		ctx.moveTo(0, height * y);
		ctx.lineTo(width, height * y);
		ctx.stroke();
	}
}
