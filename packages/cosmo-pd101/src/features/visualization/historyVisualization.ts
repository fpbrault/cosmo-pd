import { AutoScopePhaseLock } from "@/components/panels/analysis/scope-visualizations/autoScopePhaseLock";
import { withAlpha } from "@/components/panels/analysis/scope-visualizations/palette";
import type { ScopeThemePalette } from "@/components/panels/analysis/scope-visualizations/types";
import {
	calculateLogFrequencyBands,
	resampleFrequencyBins,
	resampleWaveformWindow,
} from "@/components/performance/audioSpectrum";
import type { VisualizationCanvasTarget } from "@/lib/canvasRenderTarget";
import type { VisualizationMode } from "./visualizationModes";

export type VisualizationAudioFrame = {
	samples: Float32Array | Uint8Array;
	sampleRate: number;
	hz: number;
	frequencyBins?: Uint8Array;
};

export type HistoryProfile = {
	bandCount: number;
	waveformPointCount: number;
	rowCount: number;
	glowBlur: number;
};

export type HistoryRendererState = {
	history: Float32Array[];
	phaseLock: AutoScopePhaseLock;
	mode: VisualizationMode | null;
	lastFrameAt: number;
};

const SCOPE_VERTICAL_SCALE = 6;

export const createHistoryRendererState = (): HistoryRendererState => ({
	history: [],
	phaseLock: new AutoScopePhaseLock(),
	mode: null,
	lastFrameAt: Number.NEGATIVE_INFINITY,
});

export const resetHistoryRendererState = (
	state: HistoryRendererState,
	mode: VisualizationMode,
) => {
	state.history = [];
	state.phaseLock.reset();
	state.mode = mode;
	state.lastFrameAt = Number.NEGATIVE_INFINITY;
};

const shapeScopeValues = (values: Float32Array): Float32Array => {
	const shaped = new Float32Array(values.length);
	for (let index = 0; index < values.length; index++) {
		shaped[index] = Math.tanh((values[index] ?? 0) * SCOPE_VERTICAL_SCALE);
	}
	return shaped;
};

export const buildHistoryValues = ({
	mode,
	frame,
	cycles,
	profile,
	state,
}: {
	mode: "scopeHistory" | "spectrumWaterfall";
	frame: VisualizationAudioFrame;
	cycles: number;
	profile: HistoryProfile;
	state: HistoryRendererState;
}): Float32Array => {
	if (mode === "spectrumWaterfall") {
		return frame.frequencyBins
			? resampleFrequencyBins(
					frame.frequencyBins,
					frame.sampleRate,
					profile.bandCount,
				)
			: calculateLogFrequencyBands(
					frame.samples,
					frame.sampleRate,
					profile.bandCount,
				);
	}

	const locked = state.phaseLock.resolve(
		frame.samples,
		Math.max(1, frame.hz),
		frame.sampleRate,
		cycles,
	);
	const source = locked.heldSamples ?? frame.samples;
	const values = resampleWaveformWindow(
		source,
		locked.heldSamples ? 0 : locked.window.start,
		locked.window.count,
		profile.waveformPointCount,
	);
	return shapeScopeValues(values);
};

const drawGrid = (
	context: CanvasRenderingContext2D,
	width: number,
	height: number,
	palette: ScopeThemePalette,
) => {
	context.fillStyle = palette.background;
	context.fillRect(0, 0, width, height);
	context.strokeStyle = withAlpha(palette.grid, 0.35);
	context.lineWidth = 1;
	for (let column = 0; column <= 12; column++) {
		const x = (column / 12) * width;
		context.beginPath();
		context.moveTo(x, 0);
		context.lineTo(x, height);
		context.stroke();
	}
	for (let row = 0; row <= 6; row++) {
		const y = (row / 6) * height;
		context.beginPath();
		context.moveTo(0, y);
		context.lineTo(width, y);
		context.stroke();
	}
};

const paletteKey = (palette: ScopeThemePalette) =>
	[palette.background, palette.grid, palette.centerLine].join("|");

export const drawHistory = ({
	target,
	history,
	mode,
	cycles,
	zoom,
	palette,
	profile,
	gridCanvasRef,
}: {
	target: VisualizationCanvasTarget;
	history: Float32Array[];
	mode: "scopeHistory" | "spectrumWaterfall";
	cycles: number;
	zoom: number;
	palette: ScopeThemePalette;
	profile: HistoryProfile;
	gridCanvasRef: { current: HTMLCanvasElement | null };
}) => {
	const { context, width, height, pixelWidth, pixelHeight, scaleX, scaleY } =
		target;
	const key = [
		paletteKey(palette),
		width,
		height,
		pixelWidth,
		pixelHeight,
	].join("|");
	let grid = gridCanvasRef.current;
	if (
		!grid ||
		grid.width !== pixelWidth ||
		grid.height !== pixelHeight ||
		grid.dataset.paletteKey !== key
	) {
		grid = grid ?? document.createElement("canvas");
		grid.width = pixelWidth;
		grid.height = pixelHeight;
		grid.dataset.paletteKey = key;
		const gridContext = grid.getContext("2d");
		if (gridContext) {
			gridContext.setTransform(scaleX, 0, 0, scaleY, 0, 0);
			drawGrid(gridContext, width, height, palette);
		}
		gridCanvasRef.current = grid;
	}
	context.drawImage(grid, 0, 0, pixelWidth, pixelHeight, 0, 0, width, height);

	const horizon = height * 0.13;
	const usableHeight = mode === "scopeHistory" ? height * 0.72 : height * 0.78;
	const verticalScale = Math.max(0.25, Math.min(4, zoom));
	const horizontalScale =
		mode === "spectrumWaterfall"
			? Math.max(0.5, Math.min(2, 2 / Math.max(0.5, cycles)))
			: 1;
	const plotWidth = width * horizontalScale;
	const plotStart = (width - plotWidth) / 2;
	for (let row = history.length - 1; row >= 0; row--) {
		const values = history[row];
		if (!values) continue;
		const depth = row / Math.max(1, history.length - 1);
		const baseline = horizon + depth * usableHeight;
		const perspective = 0.45 + depth * 0.55;
		const inset = (1 - perspective) * plotWidth * 0.28;
		context.beginPath();
		for (let point = 0; point < values.length; point++) {
			const x =
				plotStart +
				inset +
				(point / Math.max(1, values.length - 1)) * (plotWidth - inset * 2);
			const scale =
				mode === "scopeHistory" ? 0.03 + depth * 0.085 : 0.05 + depth * 0.23;
			const y =
				baseline - (values[point] ?? 0) * height * scale * verticalScale;
			if (point === 0) context.moveTo(x, y);
			else context.lineTo(x, y);
		}
		const alpha = 0.14 + depth * 0.78;
		context.strokeStyle = withAlpha(
			depth > 0.72 ? palette.accentSoft : palette.accentDim,
			alpha,
		);
		const isLatest = row === history.length - 1;
		context.shadowColor = isLatest ? palette.glow : "transparent";
		context.shadowBlur = isLatest ? profile.glowBlur : 0;
		context.lineWidth = Math.max(1, width / 1000) * (0.8 + depth * 0.8);
		context.stroke();
	}
	context.shadowBlur = 0;
};
