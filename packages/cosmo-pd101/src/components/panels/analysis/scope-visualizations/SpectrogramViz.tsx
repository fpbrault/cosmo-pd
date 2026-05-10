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
) {
	const setup = setupScopeCanvas(canvas);
	if (!setup) return;
	const { ctx, width, height } = setup;

	if (width <= 0 || height <= 0) return;

	const expectedHistoryLength = width * SPECTROGRAM_BINS;
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

	const effectiveBins = downsampleBins(bins, SPECTROGRAM_BINS);
	const history = spectrogramStateRef.current.history;
	if (!history) return;

	if (width > 1) {
		history.copyWithin(0, SPECTROGRAM_BINS, history.length);
	}
	const columnOffset = (width - 1) * SPECTROGRAM_BINS;
	for (let i = 0; i < SPECTROGRAM_BINS; i++) {
		history[columnOffset + i] = effectiveBins[i] ?? 0;
	}

	ctx.fillStyle = palette.background;
	ctx.fillRect(0, 0, width, height);
	const binHeight = height / SPECTROGRAM_BINS;
	for (let x = 0; x < width; x++) {
		const xOffset = x * SPECTROGRAM_BINS;
		for (let i = 0; i < SPECTROGRAM_BINS; i++) {
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
