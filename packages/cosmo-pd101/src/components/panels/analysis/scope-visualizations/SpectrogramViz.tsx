import type { VisualizationCanvasTarget } from "@/lib/canvasRenderTarget";
import {
	downsampleBins,
	SPECTROGRAM_BINS,
	spectrogramColor,
} from "./frequency";
import { withAlpha } from "./palette";
import type { ScopeThemePalette, SpectrogramStateRef } from "./types";

export function drawSpectrogramFrame(
	target: VisualizationCanvasTarget,
	bins: Uint8Array<ArrayBufferLike>,
	spectrogramStateRef: SpectrogramStateRef,
	palette: ScopeThemePalette,
	binCount = SPECTROGRAM_BINS,
	cycles = 2,
	zoom = 1,
) {
	const { context, width, height } = target;

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

	context.fillStyle = palette.background;
	context.fillRect(0, 0, width, height);
	const binHeight = height / binCount;
	for (let x = 0; x < width; x++) {
		const xOffset = x * binCount;
		for (let i = 0; i < binCount; i++) {
			const mag = history[xOffset + i] ?? 0;
			if (mag < 2) continue;
			context.fillStyle = spectrogramColor(mag, palette);
			const y = height - (i + 1) * binHeight;
			context.fillRect(x, y, 1, Math.ceil(binHeight) + 1);
		}
	}

	context.strokeStyle = withAlpha(palette.grid, 0.3);
	context.lineWidth = 1;
	for (let y = 0.2; y < 1; y += 0.2) {
		context.beginPath();
		context.moveTo(0, height * y);
		context.lineTo(width, height * y);
		context.stroke();
	}
}
