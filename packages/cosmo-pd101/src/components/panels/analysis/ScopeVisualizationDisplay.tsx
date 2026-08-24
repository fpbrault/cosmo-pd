import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
	performanceDiagnosticsEnabled,
	recordPerformanceMeasure,
} from "@/components/performance/displayPerformance";
import { useScopeContext } from "@/context/ScopeContext";
import { useSynthUiStore } from "@/features/synth/synthUiStore";
import { AutoScopePhaseLock } from "./scope-visualizations/autoScopePhaseLock";
import { drawScopeBackdrop } from "./scope-visualizations/canvas";
import { isEditableKeyboardTarget } from "./scope-visualizations/keyboard";
import { getScopeThemePalette } from "./scope-visualizations/palette";
import { calculateFrameMean } from "./scope-visualizations/processing";
import {
	renderScopeVisualization,
	type ScopeVisualizationMode,
} from "./scope-visualizations/renderScopeVisualization";
import type {
	ScopeColorTheme,
	SpectrogramState,
} from "./scope-visualizations/types";
import { useWavetableWaterfallPreview } from "./scope-visualizations/useWavetableWaterfallPreview";

type ScopeVisualizationVariant = "mini" | "drawer";

type ScopeVisualizationDisplayProps = {
	variant: ScopeVisualizationVariant;
};

type PendingScopeFrame = {
	samples: Float32Array;
	sampleRate: number;
	hz: number;
};

export function ScopeVisualizationDisplay({
	variant,
}: ScopeVisualizationDisplayProps) {
	const { t } = useTranslation("synth");
	const {
		analyserNodeRef,
		audioCtxRef,
		effectivePitchHz,
		scopePerformanceMode,
		subscribeScopeFrames,
	} = useScopeContext();
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const rafIdRef = useRef(0);
	const unsubscribeRef = useRef<(() => void) | null>(null);
	const pendingScopeFrameRef = useRef<PendingScopeFrame | null>(null);
	const scopePhaseLockRef = useRef(new AutoScopePhaseLock());
	const scopePhaseLockModeRef = useRef<ScopeVisualizationMode | null>(null);
	const pressedKeysRef = useRef<Set<string>>(new Set());
	const lastConstrainedSpectrogramDrawRef = useRef(0);
	const drawPerformanceRef = useRef({
		count: 0,
		totalMs: 0,
		startedAt: 0,
	});
	const diagnosticsEnabledRef = useRef(false);
	diagnosticsEnabledRef.current = performanceDiagnosticsEnabled();
	const [waterfallActiveLine, setWaterfallActiveLine] = useState<1 | 2>(1);

	const scopeCycles = useSynthUiStore((s) => s.scopeCycles);
	const scopeVerticalZoom = useSynthUiStore((s) => s.scopeVerticalZoom);
	const scopeVisualizationMode = useSynthUiStore(
		(s) => s.scopeVisualizationMode,
	);
	const scopeColorTheme = useSynthUiStore((s) => s.scopeColorTheme);
	const setScopeVisualizationMode = useSynthUiStore(
		(s) => s.setScopeVisualizationMode,
	);
	const setScopeColorTheme = useSynthUiStore((s) => s.setScopeColorTheme);

	const palette = getScopeThemePalette(scopeColorTheme);
	const waterfallPreview = useWavetableWaterfallPreview(
		scopeVisualizationMode === "waterfall3d",
	);
	const spectrogramStateRef = useRef<SpectrogramState>({
		width: 0,
		height: 0,
		history: null,
	});

	// Keep refs to the latest values so RAF/subscription closures always read
	// current state without needing to restart effects on every settings change.
	const settingsRef = useRef({
		scopeCycles,
		scopeVerticalZoom,
		scopeVisualizationMode,
		scopeColorTheme,
	});
	settingsRef.current = {
		scopeCycles,
		scopeVerticalZoom,
		scopeVisualizationMode,
		scopeColorTheme,
	};

	const propsRef = useRef({ effectivePitchHz, analyserNodeRef, audioCtxRef });
	propsRef.current = { effectivePitchHz, analyserNodeRef, audioCtxRef };

	useEffect(() => {
		const gameKeys = new Set([
			"ArrowLeft",
			"ArrowRight",
			"ArrowUp",
			"ArrowDown",
			"Space",
		]);

		const handleKeyDown = (event: KeyboardEvent) => {
			if (!gameKeys.has(event.code)) {
				return;
			}
			if (settingsRef.current.scopeVisualizationMode !== "asteroids") {
				return;
			}
			if (isEditableKeyboardTarget(event.target)) {
				return;
			}
			pressedKeysRef.current.add(event.code);
			event.preventDefault();
		};

		const handleKeyUp = (event: KeyboardEvent) => {
			if (gameKeys.has(event.code)) {
				pressedKeysRef.current.delete(event.code);
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		window.addEventListener("keyup", handleKeyUp);
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
			window.removeEventListener("keyup", handleKeyUp);
			pressedKeysRef.current.clear();
		};
	}, []);

	// Stable draw function stored in a ref; updated each render so it always
	// reads the current settings/props refs without recreating effects.
	const drawFrameRef = useRef(
		(
			_canvas: HTMLCanvasElement,
			_samples: Uint8Array | Float32Array,
			_hz: number,
			_sampleRate: number,
			_frequencyBins?: Uint8Array<ArrayBufferLike>,
		) => {},
	);
	drawFrameRef.current = (
		canvas: HTMLCanvasElement,
		samples: Uint8Array | Float32Array,
		hz: number,
		sampleRate: number,
		frequencyBins?: Uint8Array<ArrayBufferLike>,
	) => {
		const drawStartedAt = performance.now();
		const mode = settingsRef.current.scopeVisualizationMode;
		if (scopePhaseLockModeRef.current !== mode) {
			scopePhaseLockRef.current.reset();
			scopePhaseLockModeRef.current = mode;
		}
		const usesPhaseLock =
			mode === "waveform" || mode === "orbital" || mode === "transferCurves";
		const lockResult = usesPhaseLock
			? scopePhaseLockRef.current.resolve(
					samples,
					hz,
					sampleRate,
					settingsRef.current.scopeCycles,
				)
			: undefined;
		const scopeWindow = lockResult?.window;
		const renderSamples = lockResult?.heldSamples ?? samples;
		const triggerLevel = calculateFrameMean(samples);

		renderScopeVisualization({
			mode,
			canvas,
			samples: renderSamples,
			hz,
			sampleRate,
			frequencyBins,
			cycles: settingsRef.current.scopeCycles,
			triggerLevel,
			scopeWindow,
			zoom: settingsRef.current.scopeVerticalZoom,
			palette: getScopeThemePalette(settingsRef.current.scopeColorTheme),
			spectrogramStateRef,
			pressedKeys: pressedKeysRef.current,
			intensityMultiplier: variant === "drawer" ? 1.55 : 1,
			waterfallPreview,
			waterfallActiveLine,
			constrainedPerformance: scopePerformanceMode === "constrained",
		});
		if (diagnosticsEnabledRef.current) {
			recordPerformanceMeasure(
				"cz-performance-display-draw-advanced",
				drawStartedAt,
				performance.now(),
			);
		}

		if (import.meta.env.DEV) {
			const now = performance.now();
			const stats = drawPerformanceRef.current;
			if (stats.startedAt === 0) {
				stats.startedAt = now;
			}
			stats.count++;
			stats.totalMs += now - drawStartedAt;
			const elapsedMs = now - stats.startedAt;
			if (elapsedMs >= 5000) {
				console.debug("[scope-perf] canvas draw", {
					framesPerSecond: (stats.count * 1000) / elapsedMs,
					averageDrawMs: stats.totalMs / stats.count,
					mode: settingsRef.current.scopeVisualizationMode,
				});
				drawPerformanceRef.current = {
					count: 0,
					totalMs: 0,
					startedAt: now,
				};
			}
		}
	};

	// Subscribe to external frame push stream (plugin mode).
	useEffect(() => {
		unsubscribeRef.current?.();
		unsubscribeRef.current = null;
		if (!subscribeScopeFrames) return;
		unsubscribeRef.current = subscribeScopeFrames((frame) => {
			if (
				scopePerformanceMode === "constrained" &&
				settingsRef.current.scopeVisualizationMode === "spectrogram"
			) {
				const now = performance.now();
				if (now - lastConstrainedSpectrogramDrawRef.current < 200) {
					return;
				}
				lastConstrainedSpectrogramDrawRef.current = now;
			}
			// The bridge can deliver frames faster than the browser can paint.
			// Keep only the newest frame and let the display RAF consume it once
			// per browser frame instead of drawing synchronously for every payload.
			pendingScopeFrameRef.current = {
				samples: frame.samples,
				sampleRate: frame.sampleRate,
				hz: Math.max(1, frame.hz),
			};
		});
		return () => {
			unsubscribeRef.current?.();
			unsubscribeRef.current = null;
			pendingScopeFrameRef.current = null;
		};
	}, [scopePerformanceMode, subscribeScopeFrames]);

	// RAF loop for AnalyserNode path (web-audio mode).
	useEffect(() => {
		const draw = () => {
			rafIdRef.current = window.requestAnimationFrame(draw);
			const canvas = canvasRef.current;
			if (!canvas) return;
			// External stream takes priority.
			if (unsubscribeRef.current) {
				const frame = pendingScopeFrameRef.current;
				pendingScopeFrameRef.current = null;
				if (frame) {
					drawFrameRef.current(
						canvas,
						frame.samples,
						frame.hz,
						frame.sampleRate,
					);
				}
				return;
			}
			const {
				effectivePitchHz: hz,
				analyserNodeRef: aRef,
				audioCtxRef: ctxRef,
			} = propsRef.current;
			const analyserNode = aRef?.current;
			if (!analyserNode) {
				drawScopeBackdrop(
					canvas,
					getScopeThemePalette(settingsRef.current.scopeColorTheme),
				);
				return;
			}
			const data = new Float32Array(analyserNode.fftSize);
			analyserNode.getFloatTimeDomainData(data);
			let frequencyBins: Uint8Array | undefined;
			if (settingsRef.current.scopeVisualizationMode === "spectrogram") {
				frequencyBins = new Uint8Array(analyserNode.frequencyBinCount);
				analyserNode.getByteFrequencyData(
					frequencyBins as Uint8Array<ArrayBuffer>,
				);
			}
			const sampleRate = ctxRef?.current?.sampleRate ?? 44100;
			drawFrameRef.current(
				canvas,
				data,
				Math.max(1, hz),
				sampleRate,
				frequencyBins,
			);
		};
		draw();
		return () => {
			window.cancelAnimationFrame(rafIdRef.current);
		};
	}, []); // Runs once on mount; reads latest values through refs.

	const isDrawer = variant === "drawer";

	return (
		<div
			className={`relative flex w-full flex-col ${isDrawer ? "h-full min-h-0" : ""}`}
		>
			{/* Mode picker button - positioned at outer level to avoid overflow-hidden clipping */}
			<div className="absolute top-0.5 left-1 z-10">
				<button
					type="button"
					className="rounded border border-transparent px-1.5 py-0.5 font-mono text-4xs tracking-wide transition-colors hover:border-current hover:opacity-80"
					style={{
						color: palette.bright,
						backgroundColor: `${palette.accent}22`,
					}}
					onClick={() =>
						setScopeVisualizationMode(
							(
								{
									waveform: "orbital",
									orbital: "spectrogram",
									spectrogram: "waterfall3d",
									waterfall3d: "transferCurves",
									transferCurves: "asteroids",
									asteroids: "waveform",
								} as const
							)[scopeVisualizationMode] as ScopeVisualizationMode,
						)
					}
				>
					{scopeVisualizationMode === "waveform"
						? t("scope.modeWaveform")
						: scopeVisualizationMode === "orbital"
							? t("scope.modeOrbital")
							: scopeVisualizationMode === "spectrogram"
								? t("scope.modeSpectrogram")
								: scopeVisualizationMode === "waterfall3d"
									? t("scope.modeWaterfall3d")
									: scopeVisualizationMode === "transferCurves"
										? t("scope.modeTransferCurves")
										: t("scope.modeAsteroids")}
				</button>
			</div>
			{/* Color theme button - positioned at outer level to avoid overflow-hidden clipping */}
			<div className="absolute top-0.5 right-1 z-10">
				<button
					type="button"
					className="rounded border border-transparent px-1.5 py-0.5 font-mono text-4xs tracking-wide transition-colors hover:border-current hover:opacity-80"
					style={{
						color: palette.bright,
						backgroundColor: `${palette.accent}22`,
					}}
					onClick={() =>
						setScopeColorTheme(
							(
								{
									vintage: "amber",
									amber: "plasma",
									plasma: "vintage",
								} as const
							)[scopeColorTheme] as ScopeColorTheme,
						)
					}
					aria-label={t("scope.toggleThemeAria")}
				>
					{scopeColorTheme === "vintage"
						? t("scope.themeVintage")
						: scopeColorTheme === "amber"
							? t("scope.themeAmber")
							: t("scope.themePlasma")}
				</button>
			</div>
			<div
				className={`relative w-full overflow-hidden rounded border border-cz-border bg-cz-lcd-bg ${isDrawer ? "min-h-0 flex-1" : ""}`}
			>
				<canvas
					ref={canvasRef}
					className={`${isDrawer ? "h-full min-h-80 w-full" : "h-43 w-full"} ${
						scopeVisualizationMode === "waterfall3d" ? "cursor-pointer" : ""
					}`}
					onClick={() => {
						if (scopeVisualizationMode !== "waterfall3d") {
							return;
						}
						setWaterfallActiveLine((line) => (line === 1 ? 2 : 1));
					}}
				/>
			</div>
		</div>
	);
}
