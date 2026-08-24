import { useEffect, useRef } from "react";
import { AutoScopePhaseLock } from "@/components/panels/analysis/scope-visualizations/autoScopePhaseLock";
import {
	getScopeThemePalette,
	withAlpha,
} from "@/components/panels/analysis/scope-visualizations/palette";
import type { ScopeThemePalette } from "@/components/panels/analysis/scope-visualizations/types";
import { useScopeContext } from "@/context/ScopeContext";
import {
	type PerformanceDisplayMode,
	useSynthUiStore,
} from "@/features/synth/synthUiStore";
import {
	calculateLogFrequencyBands,
	resampleFrequencyBins,
	resampleWaveformWindow,
} from "./audioSpectrum";
import {
	AdaptivePerformanceQuality,
	calculateCanvasBackingSize,
	getInitialPerformanceTier,
	getPerformanceDisplayProfile as getTierProfile,
	type PerformanceQualityTier,
	performanceDiagnosticsEnabled,
	recordPerformanceMeasure,
} from "./displayPerformance";
import { PerformanceBadge } from "./PerformanceDiagnosticsOverlay";
import {
	getEffectiveDisplayQuality,
	performanceDiagnosticsRegistry,
} from "./performanceDiagnostics";

type AudioFrame = {
	samples: Float32Array | Uint8Array;
	sampleRate: number;
	hz: number;
	frequencyBins?: Uint8Array;
};

const SCOPE_CYCLES = 2;
const SCOPE_VERTICAL_SCALE = 6;

export function getPerformanceDisplayProfile(
	mode?: "standard" | "constrained",
	tier?: PerformanceQualityTier,
) {
	return getTierProfile(tier ?? (mode === "constrained" ? "balanced" : "high"));
}

function prepareCanvas(canvas: HTMLCanvasElement, maxPixelRatio: number) {
	const clientWidth = Math.max(1, canvas.clientWidth);
	const clientHeight = Math.max(1, canvas.clientHeight);
	const bounds = canvas.getBoundingClientRect();
	const { width, height } = calculateCanvasBackingSize({
		clientWidth,
		clientHeight,
		visibleWidth: bounds.width,
		visibleHeight: bounds.height,
		devicePixelRatio: window.devicePixelRatio || 1,
		maxPixelRatio,
	});
	const resized = canvas.width !== width || canvas.height !== height;
	if (canvas.width !== width || canvas.height !== height) {
		canvas.width = width;
		canvas.height = height;
	}
	return { width, height, resized };
}

function drawGrid(
	context: CanvasRenderingContext2D,
	width: number,
	height: number,
	palette: ScopeThemePalette,
) {
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
}

function getPaletteKey(palette: ScopeThemePalette): string {
	return [palette.background, palette.grid, palette.centerLine].join("|");
}

function prepareGridCanvas(
	gridCanvasRef: { current: HTMLCanvasElement | null },
	width: number,
	height: number,
	palette: ScopeThemePalette,
) {
	const paletteKey = getPaletteKey(palette);
	const current = gridCanvasRef.current;
	if (
		current &&
		current.width === width &&
		current.height === height &&
		current.dataset.paletteKey === paletteKey
	) {
		return current;
	}

	const gridCanvas = current ?? document.createElement("canvas");
	gridCanvas.width = width;
	gridCanvas.height = height;
	gridCanvas.dataset.paletteKey = paletteKey;
	const gridContext = gridCanvas.getContext("2d");
	if (gridContext) {
		drawGrid(gridContext, width, height, palette);
	}
	gridCanvasRef.current = gridCanvas;
	return gridCanvas;
}

function drawCachedGrid(
	context: CanvasRenderingContext2D,
	gridCanvas: HTMLCanvasElement,
) {
	context.drawImage(gridCanvas, 0, 0);
}

function drawWaterfall(
	context: CanvasRenderingContext2D,
	width: number,
	height: number,
	history: Float32Array[],
	palette: ScopeThemePalette,
	glowBlur: number,
	gridCanvas: HTMLCanvasElement,
) {
	drawCachedGrid(context, gridCanvas);
	const horizon = height * 0.13;
	const usableHeight = height * 0.78;
	for (let row = history.length - 1; row >= 0; row--) {
		const values = history[row];
		if (!values) continue;
		const depth = row / Math.max(1, history.length - 1);
		const baseline = horizon + depth * usableHeight;
		const perspective = 0.45 + depth * 0.55;
		const inset = (1 - perspective) * width * 0.28;
		context.beginPath();
		for (let band = 0; band < values.length; band++) {
			const x =
				inset + (band / Math.max(1, values.length - 1)) * (width - inset * 2);
			const y = baseline - (values[band] ?? 0) * height * (0.05 + depth * 0.23);
			if (band === 0) context.moveTo(x, y);
			else context.lineTo(x, y);
		}
		const alpha = 0.14 + depth * 0.78;
		context.strokeStyle = withAlpha(
			depth > 0.72 ? palette.accentSoft : palette.accentDim,
			alpha,
		);
		const isLatest = row === history.length - 1;
		context.shadowColor =
			isLatest && glowBlur > 0 ? palette.glow : "transparent";
		context.shadowBlur = isLatest ? glowBlur : 0;
		context.lineWidth = Math.max(1, width / 1000) * (0.8 + depth * 0.8);
		context.stroke();
	}
	context.shadowBlur = 0;
}

function drawScopeWaterfall(
	context: CanvasRenderingContext2D,
	width: number,
	height: number,
	history: Float32Array[],
	palette: ScopeThemePalette,
	glowBlur: number,
	gridCanvas: HTMLCanvasElement,
) {
	drawCachedGrid(context, gridCanvas);
	const horizon = height * 0.13;
	const usableHeight = height * 0.72;
	for (let row = history.length - 1; row >= 0; row--) {
		const values = history[row];
		if (!values) continue;
		const depth = row / Math.max(1, history.length - 1);
		const baseline = horizon + depth * usableHeight;
		const perspective = 0.45 + depth * 0.55;
		const inset = (1 - perspective) * width * 0.28;
		context.beginPath();
		for (let point = 0; point < values.length; point++) {
			const x =
				inset + (point / Math.max(1, values.length - 1)) * (width - inset * 2);
			const displayValue = values[point] ?? 0;
			const y = baseline - displayValue * height * (0.03 + depth * 0.085);
			if (point === 0) context.moveTo(x, y);
			else context.lineTo(x, y);
		}
		const alpha = 0.14 + depth * 0.78;
		context.strokeStyle = withAlpha(
			depth > 0.72 ? palette.accentSoft : palette.accentDim,
			alpha,
		);
		context.lineWidth = Math.max(1, width / 1000) * (0.8 + depth * 0.8);
		const isLatest = row === history.length - 1;
		context.shadowColor =
			isLatest && glowBlur > 0 ? palette.glow : "transparent";
		context.shadowBlur = isLatest ? glowBlur : 0;
		context.stroke();
	}
	context.shadowBlur = 0;
}

function shapeScopeValues(
	values: Float32Array<ArrayBufferLike>,
): Float32Array<ArrayBuffer> {
	const shaped = new Float32Array(values.length);
	for (let index = 0; index < values.length; index++) {
		shaped[index] = Math.tanh((values[index] ?? 0) * SCOPE_VERTICAL_SCALE);
	}
	return shaped;
}

export default function PerformanceAudioDisplay({
	mode,
}: {
	mode: PerformanceDisplayMode;
}) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const frameRef = useRef<AudioFrame | null>(null);
	const historyRef = useRef<Float32Array[]>([]);
	const lastHistoryUpdateRef = useRef(0);
	const lastDrawAtRef = useRef<number | null>(null);
	const lastRenderAtRef = useRef<number | null>(null);
	const rafRef = useRef(0);
	const phaseLockRef = useRef(new AutoScopePhaseLock());
	const effectivePitchHzRef = useRef(1);
	const analyserSamplesRef = useRef<Float32Array<ArrayBuffer> | null>(null);
	const analyserFrequencyBinsRef = useRef<Uint8Array | null>(null);
	const gridCanvasRef = useRef<HTMLCanvasElement | null>(null);
	const historyCanvasRef = useRef<HTMLCanvasElement | null>(null);
	const scopeColorTheme = useSynthUiStore((state) => state.scopeColorTheme);
	const debugEnabled = useSynthUiStore((state) => state.debugEnabled);
	const displayQualityOverride = useSynthUiStore(
		(state) => state.displayQualityOverride,
	);
	const {
		analyserNodeRef,
		audioCtxRef,
		effectivePitchHz,
		scopePerformanceMode,
		subscribeScopeFrames,
	} = useScopeContext();

	useEffect(() => {
		effectivePitchHzRef.current = Math.max(1, effectivePitchHz);
	}, [effectivePitchHz]);

	useEffect(() => {
		if (!subscribeScopeFrames) return;
		return subscribeScopeFrames((frame) => {
			performanceDiagnosticsRegistry.recordDisplayInput(`simple-${mode}`);
			frameRef.current = { ...frame, hz: Math.max(1, frame.hz) };
		});
	}, [mode, subscribeScopeFrames]);

	useEffect(() => {
		const palette = getScopeThemePalette(scopeColorTheme);
		const initialTier = getInitialPerformanceTier(scopePerformanceMode, {
			coarsePointer:
				typeof window.matchMedia === "function" &&
				window.matchMedia("(pointer: coarse)").matches,
			devicePixelRatio: window.devicePixelRatio || 1,
		});
		const effectiveOverride = debugEnabled ? displayQualityOverride : "auto";
		const selectedTier = getEffectiveDisplayQuality(
			debugEnabled,
			displayQualityOverride,
			initialTier,
		);
		const quality = new AdaptivePerformanceQuality(
			selectedTier,
			effectiveOverride === "auto"
				? scopePerformanceMode === "constrained"
					? "balanced"
					: "high"
				: selectedTier,
		);
		let profile = getTierProfile(selectedTier);
		historyRef.current = [];
		lastHistoryUpdateRef.current = 0;
		lastDrawAtRef.current = null;
		lastRenderAtRef.current = null;
		gridCanvasRef.current = null;
		historyCanvasRef.current = null;
		phaseLockRef.current.reset();
		const diagnosticsEnabled = performanceDiagnosticsEnabled();
		const draw = (now: number) => {
			rafRef.current = window.requestAnimationFrame(draw);
			const canvas = canvasRef.current;
			if (!canvas) return;
			if (
				lastRenderAtRef.current !== null &&
				now - lastRenderAtRef.current < profile.renderInterval
			) {
				return;
			}
			lastRenderAtRef.current = now;
			let frame = frameRef.current;
			const analyser = analyserNodeRef.current;
			if (!subscribeScopeFrames && analyser) {
				if (analyserSamplesRef.current?.length !== analyser.fftSize) {
					analyserSamplesRef.current = new Float32Array(analyser.fftSize);
				}
				const samples = analyserSamplesRef.current;
				if (!samples) return;
				analyser.getFloatTimeDomainData(samples);
				let frequencyBins: Uint8Array | undefined;
				if (mode === "waterfall") {
					if (
						analyserFrequencyBinsRef.current?.length !==
						analyser.frequencyBinCount
					) {
						analyserFrequencyBinsRef.current = new Uint8Array(
							analyser.frequencyBinCount,
						);
					}
					frequencyBins = analyserFrequencyBinsRef.current ?? undefined;
					if (frequencyBins) {
						analyser.getByteFrequencyData(
							frequencyBins as Uint8Array<ArrayBuffer>,
						);
					}
				}
				frame = {
					samples,
					sampleRate: audioCtxRef.current?.sampleRate ?? 44_100,
					hz: effectivePitchHzRef.current,
					frequencyBins,
				};
			}
			const context = canvas.getContext("2d");
			if (!context) return;
			const drawStartedAt = performance.now();
			const { width, height } = prepareCanvas(canvas, profile.maxPixelRatio);
			const gridCanvas = prepareGridCanvas(
				gridCanvasRef,
				width,
				height,
				palette,
			);
			canvas.dataset.performanceTier = quality.currentTier;
			if (!frame && historyRef.current.length === 0) {
				drawCachedGrid(context, gridCanvas);
				return;
			}
			const shouldUpdateHistory =
				frame !== null &&
				(historyRef.current.length === 0 ||
					now - lastHistoryUpdateRef.current >= profile.historyInterval);
			if (frame && shouldUpdateHistory) {
				let values: Float32Array;
				if (mode === "scope") {
					const locked = phaseLockRef.current.resolve(
						frame.samples,
						Math.max(1, frame.hz),
						frame.sampleRate,
						SCOPE_CYCLES,
					);
					const source = locked.heldSamples ?? frame.samples;
					values = resampleWaveformWindow(
						source,
						locked.heldSamples ? 0 : locked.window.start,
						locked.window.count,
						profile.waveformPointCount,
					);
					values = shapeScopeValues(values);
				} else {
					values = frame.frequencyBins
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
				while (historyRef.current.length >= profile.rowCount) {
					historyRef.current.shift();
				}
				historyRef.current.push(values);
				lastHistoryUpdateRef.current = now;
			}
			let historyCanvas = historyCanvasRef.current;
			let historyCanvasNeedsRender = false;
			if (
				!historyCanvas ||
				historyCanvas.width !== width ||
				historyCanvas.height !== height
			) {
				historyCanvas = document.createElement("canvas");
				historyCanvas.width = width;
				historyCanvas.height = height;
				historyCanvasRef.current = historyCanvas;
				historyCanvasNeedsRender = true;
			}
			if (shouldUpdateHistory || historyCanvasNeedsRender) {
				const historyContext = historyCanvas.getContext("2d");
				if (historyContext) {
					if (mode === "scope") {
						drawScopeWaterfall(
							historyContext,
							width,
							height,
							historyRef.current,
							palette,
							profile.glowBlur,
							gridCanvas,
						);
					} else {
						drawWaterfall(
							historyContext,
							width,
							height,
							historyRef.current,
							palette,
							profile.glowBlur,
							gridCanvas,
						);
					}
				}
			}
			context.drawImage(historyCanvas, 0, 0);
			const drawFinishedAt = performance.now();
			performanceDiagnosticsRegistry.recordDisplayFrame(`simple-${mode}`, {
				timestamp: now,
				drawMs: drawFinishedAt - drawStartedAt,
				canvasWidth: width,
				canvasHeight: height,
				quality: quality.currentTier,
			});
			const frameGapMs =
				lastDrawAtRef.current === null ? 0 : now - lastDrawAtRef.current;
			lastDrawAtRef.current = now;
			const nextTier =
				effectiveOverride === "auto"
					? quality.observe({
							now,
							drawMs: drawFinishedAt - drawStartedAt,
							frameGapMs,
						})
					: null;
			if (nextTier) {
				profile = getTierProfile(nextTier);
				historyCanvasRef.current = null;
				canvas.dataset.performanceTier = nextTier;
				if (diagnosticsEnabled) {
					performance.mark(`cz-performance-tier-${nextTier}`);
				}
			}
			if (diagnosticsEnabled) {
				recordPerformanceMeasure(
					`cz-performance-display-draw-${mode}`,
					drawStartedAt,
					drawFinishedAt,
				);
			}
		};
		rafRef.current = window.requestAnimationFrame(draw);
		return () => window.cancelAnimationFrame(rafRef.current);
	}, [
		analyserNodeRef,
		audioCtxRef,
		mode,
		debugEnabled,
		displayQualityOverride,
		scopeColorTheme,
		scopePerformanceMode,
		subscribeScopeFrames,
	]);

	return (
		<div className="relative h-full min-h-0 w-full">
			<canvas
				ref={canvasRef}
				className="h-full min-h-0 w-full"
				aria-label={`${mode} audio display`}
			/>
			<PerformanceBadge />
		</div>
	);
}
