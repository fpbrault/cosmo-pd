import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { AutoScopePhaseLock } from "@/components/panels/analysis/scope-visualizations/autoScopePhaseLock";
import { drawScopeBackdrop } from "@/components/panels/analysis/scope-visualizations/canvas";
import { isEditableKeyboardTarget } from "@/components/panels/analysis/scope-visualizations/keyboard";
import { getScopeThemePalette } from "@/components/panels/analysis/scope-visualizations/palette";
import { calculateFrameMean } from "@/components/panels/analysis/scope-visualizations/processing";
import { renderScopeVisualization } from "@/components/panels/analysis/scope-visualizations/renderScopeVisualization";
import type { SpectrogramState } from "@/components/panels/analysis/scope-visualizations/types";
import {
	AdaptivePerformanceQuality,
	getInitialPerformanceTier,
	getPerformanceDisplayProfile,
	performanceDiagnosticsEnabled,
	recordPerformanceMeasure,
} from "@/components/performance/displayPerformance";
import { useScopeContext } from "@/context/ScopeContext";
import { useSynthUiStore } from "@/features/synth/synthUiStore";
import { prepareVisualizationCanvas } from "@/lib/canvasRenderTarget";
import {
	buildHistoryValues,
	createHistoryRendererState,
	drawHistory,
	resetHistoryRendererState,
	type VisualizationAudioFrame,
} from "./historyVisualization";
import { VisualizationModeTabs } from "./VisualizationModeTabs";
import {
	VISUALIZATION_MODE_DEFINITIONS,
	type VisualizationMode,
	type VisualizationSurface,
} from "./visualizationModes";

type Props = {
	surface: VisualizationSurface;
	modeOverride?: VisualizationMode;
};

type PendingFrame = VisualizationAudioFrame;

type QualityProfile = ReturnType<typeof getPerformanceDisplayProfile> & {
	frameInterval: number;
	spectrogramBins: number;
	spectrogramFftSize: number;
};

const QUALITY_PROFILES: Record<"high" | "balanced" | "low", QualityProfile> = {
	high: {
		...getPerformanceDisplayProfile("high"),
		frameInterval: 16,
		spectrogramBins: 56,
		spectrogramFftSize: 256,
	},
	balanced: {
		...getPerformanceDisplayProfile("balanced"),
		frameInterval: 33,
		spectrogramBins: 40,
		spectrogramFftSize: 128,
	},
	low: {
		...getPerformanceDisplayProfile("low"),
		frameInterval: 50,
		spectrogramBins: 28,
		spectrogramFftSize: 64,
	},
};

const getProfile = (tier: keyof typeof QUALITY_PROFILES) =>
	QUALITY_PROFILES[tier];

const getModeFrameInterval = (
	mode: VisualizationMode,
	profile: QualityProfile,
): number =>
	mode === "scopeHistory" || mode === "spectrumWaterfall"
		? Math.max(33, profile.frameInterval)
		: profile.frameInterval;

export function VisualizationDisplay({ surface, modeOverride }: Props) {
	const { t } = useTranslation("synth");
	const {
		analyserNodeRef,
		audioCtxRef,
		effectivePitchHz,
		scopePerformanceMode,
		subscribeScopeFrames,
	} = useScopeContext();
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const frameRef = useRef<PendingFrame | null>(null);
	const frameVersionRef = useRef(0);
	const consumedFrameVersionRef = useRef(-1);
	const rafRef = useRef(0);
	const analyserSamplesRef = useRef<Float32Array<ArrayBuffer> | null>(null);
	const analyserFrequencyBinsRef = useRef<Uint8Array<ArrayBuffer> | null>(null);
	const pendingFrameRef = useRef<PendingFrame | null>(null);
	const phaseLockRef = useRef(new AutoScopePhaseLock());
	const historyStateRef = useRef(createHistoryRendererState());
	const spectrogramStateRef = useRef<SpectrogramState>({
		width: 0,
		height: 0,
		history: null,
	});
	const gridCanvasRef = useRef<HTMLCanvasElement | null>(null);
	const pressedKeysRef = useRef<Set<string>>(new Set());
	const lastDrawAtRef = useRef(Number.NEGATIVE_INFINITY);
	const invalidationVersionRef = useRef(0);
	const consumedInvalidationRef = useRef(-1);

	const storedMode = useSynthUiStore((state) => state.scopeVisualizationMode);
	const mode = modeOverride ?? storedMode;
	const theme = useSynthUiStore((state) => state.scopeColorTheme);
	const cycles = useSynthUiStore((state) => state.scopeCycles);
	const zoom = useSynthUiStore((state) => state.scopeVerticalZoom);
	const runtimeRefs = useRef({
		analyserNodeRef,
		audioCtxRef,
		effectivePitchHz,
	});
	runtimeRefs.current = { analyserNodeRef, audioCtxRef, effectivePitchHz };

	const settingsRef = useRef({
		mode,
		theme,
		cycles,
		zoom,
	});
	settingsRef.current = {
		mode,
		theme,
		cycles,
		zoom,
	};

	useEffect(() => {
		// Keep invalidation in the same mailbox as audio frames so mode changes
		// repaint the most recent frame even when the source is currently quiet.
		settingsRef.current.mode = mode;
		settingsRef.current.theme = theme;
		settingsRef.current.cycles = cycles;
		settingsRef.current.zoom = zoom;
		invalidationVersionRef.current++;
	}, [cycles, mode, theme, zoom]);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const invalidateSize = () => {
			invalidationVersionRef.current++;
		};
		const resizeObserver =
			typeof ResizeObserver === "undefined"
				? null
				: new ResizeObserver(invalidateSize);
		resizeObserver?.observe(canvas);
		window.addEventListener("resize", invalidateSize);
		window.visualViewport?.addEventListener("resize", invalidateSize);
		return () => {
			resizeObserver?.disconnect();
			window.removeEventListener("resize", invalidateSize);
			window.visualViewport?.removeEventListener("resize", invalidateSize);
		};
	}, []);

	useEffect(() => {
		const gameKeys = new Set([
			"ArrowLeft",
			"ArrowRight",
			"ArrowUp",
			"ArrowDown",
			"Space",
		]);
		const handleKeyDown = (event: KeyboardEvent) => {
			if (
				!gameKeys.has(event.code) ||
				settingsRef.current.mode !== "asteroids" ||
				isEditableKeyboardTarget(event.target)
			) {
				return;
			}
			pressedKeysRef.current.add(event.code);
			event.preventDefault();
		};
		const handleKeyUp = (event: KeyboardEvent) => {
			if (gameKeys.has(event.code)) pressedKeysRef.current.delete(event.code);
		};
		window.addEventListener("keydown", handleKeyDown);
		window.addEventListener("keyup", handleKeyUp);
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
			window.removeEventListener("keyup", handleKeyUp);
			pressedKeysRef.current.clear();
		};
	}, []);

	useEffect(() => {
		const definition = VISUALIZATION_MODE_DEFINITIONS[mode];
		if (definition.framePolicy === "invalidation") return;
		if (!subscribeScopeFrames) return;
		return subscribeScopeFrames((frame) => {
			const nextFrame = {
				samples: frame.samples,
				sampleRate: frame.sampleRate,
				hz: Math.max(1, frame.hz),
			};
			frameRef.current = nextFrame;
			pendingFrameRef.current = nextFrame;
			frameVersionRef.current++;
		});
	}, [mode, subscribeScopeFrames]);

	useEffect(() => {
		const initialTier = getInitialPerformanceTier(scopePerformanceMode, {
			coarsePointer:
				typeof window.matchMedia === "function" &&
				window.matchMedia("(pointer: coarse)").matches,
			devicePixelRatio: window.devicePixelRatio || 1,
		});
		const selectedTier = initialTier;
		const quality = new AdaptivePerformanceQuality(
			selectedTier,
			scopePerformanceMode === "constrained" ? "balanced" : "high",
		);
		const diagnosticsEnabled = performanceDiagnosticsEnabled();
		historyStateRef.current = createHistoryRendererState();
		phaseLockRef.current.reset();
		gridCanvasRef.current = null;
		lastDrawAtRef.current = Number.NEGATIVE_INFINITY;
		consumedFrameVersionRef.current = -1;
		consumedInvalidationRef.current = -1;
		let tier = selectedTier;
		let profile = getProfile(tier);
		let cancelled = false;

		const draw = (now: number) => {
			if (cancelled) return;
			rafRef.current = window.requestAnimationFrame(draw);
			const canvas = canvasRef.current;
			if (!canvas) return;
			const currentMode = settingsRef.current.mode;
			const definition = VISUALIZATION_MODE_DEFINITIONS[currentMode];
			const framePolicy = definition.framePolicy;
			const hasNewFrame =
				frameVersionRef.current !== consumedFrameVersionRef.current;
			const hasInvalidation =
				invalidationVersionRef.current !== consumedInvalidationRef.current;
			const hasAnalyser =
				!subscribeScopeFrames &&
				Boolean(runtimeRefs.current.analyserNodeRef.current);
			if (
				framePolicy === "audio" &&
				!hasNewFrame &&
				!hasInvalidation &&
				!hasAnalyser
			)
				return;
			if (framePolicy === "invalidation" && !hasInvalidation) return;
			if (
				lastDrawAtRef.current !== Number.NEGATIVE_INFINITY &&
				now - lastDrawAtRef.current < getModeFrameInterval(currentMode, profile)
			) {
				return;
			}

			const target = prepareVisualizationCanvas(canvas, profile.maxPixelRatio);
			if (!target) return;
			const drawStartedAt = performance.now();
			const previousDrawAt = lastDrawAtRef.current;
			let frame = pendingFrameRef.current ?? frameRef.current;
			const {
				analyserNodeRef: analyserRef,
				audioCtxRef: audioRef,
				effectivePitchHz: pitchHz,
			} = runtimeRefs.current;
			const analyser = analyserRef.current;
			if (!subscribeScopeFrames && analyser && framePolicy !== "invalidation") {
				if (analyserSamplesRef.current?.length !== analyser.fftSize) {
					analyserSamplesRef.current = new Float32Array(analyser.fftSize);
				}
				const samples = analyserSamplesRef.current;
				if (!samples) return;
				analyser.getFloatTimeDomainData(samples);
				let frequencyBins: Uint8Array<ArrayBuffer> | undefined;
				if (definition.needsFrequencyBins) {
					if (
						analyserFrequencyBinsRef.current?.length !==
						analyser.frequencyBinCount
					) {
						analyserFrequencyBinsRef.current = new Uint8Array(
							analyser.frequencyBinCount,
						);
					}
					frequencyBins = analyserFrequencyBinsRef.current ?? undefined;
					if (frequencyBins) analyser.getByteFrequencyData(frequencyBins);
				}
				frame = {
					samples,
					sampleRate: audioRef.current?.sampleRate ?? 44_100,
					hz: Math.max(1, pitchHz),
					frequencyBins,
				};
			}

			const currentSettings = settingsRef.current;
			const palette = getScopeThemePalette(currentSettings.theme);
			if (historyStateRef.current.mode !== currentMode) {
				resetHistoryRendererState(historyStateRef.current, currentMode);
				phaseLockRef.current.reset();
			}
			if (
				currentMode === "scopeHistory" ||
				currentMode === "spectrumWaterfall"
			) {
				if (!frame) {
					drawHistory({
						target,
						history: historyStateRef.current.history,
						mode: currentMode,
						cycles: currentSettings.cycles,
						zoom: currentSettings.zoom,
						palette,
						profile,
						gridCanvasRef,
					});
				} else {
					const values = buildHistoryValues({
						mode: currentMode,
						frame,
						cycles: currentSettings.cycles,
						profile,
						state: historyStateRef.current,
					});
					while (historyStateRef.current.history.length >= profile.rowCount) {
						historyStateRef.current.history.shift();
					}
					historyStateRef.current.history.push(values);
					drawHistory({
						target,
						history: historyStateRef.current.history,
						mode: currentMode,
						cycles: currentSettings.cycles,
						zoom: currentSettings.zoom,
						palette,
						profile,
						gridCanvasRef,
					});
				}
			} else {
				if (!frame) {
					drawScopeBackdrop(target, palette);
					consumedFrameVersionRef.current = frameVersionRef.current;
					consumedInvalidationRef.current = invalidationVersionRef.current;
					lastDrawAtRef.current = now;
					return;
				}
				const lockResult = definition.usesPhaseLock
					? phaseLockRef.current.resolve(
							frame.samples,
							frame.hz,
							frame.sampleRate,
							currentSettings.cycles,
						)
					: undefined;
				const renderSamples = lockResult?.heldSamples ?? frame.samples;
				renderScopeVisualization({
					mode: currentMode,
					target,
					samples: renderSamples,
					hz: frame.hz,
					sampleRate: frame.sampleRate,
					frequencyBins: frame.frequencyBins,
					cycles: currentSettings.cycles,
					triggerLevel: calculateFrameMean(frame.samples),
					scopeWindow: lockResult?.window,
					zoom: currentSettings.zoom,
					palette,
					spectrogramStateRef,
					pressedKeys: pressedKeysRef.current,
					intensityMultiplier: surface === "drawer" ? 1.55 : 1,
					constrainedPerformance: scopePerformanceMode === "constrained",
					spectrogramBins: profile.spectrogramBins,
					spectrogramFftSize: profile.spectrogramFftSize,
				});
			}

			lastDrawAtRef.current = now;
			consumedFrameVersionRef.current = frameVersionRef.current;
			consumedInvalidationRef.current = invalidationVersionRef.current;
			pendingFrameRef.current = null;
			const drawFinishedAt = performance.now();
			const nextTier = quality.observe({
				now,
				drawMs: drawFinishedAt - drawStartedAt,
				frameGapMs:
					previousDrawAt === Number.NEGATIVE_INFINITY
						? 0
						: now - previousDrawAt,
			});
			if (nextTier) {
				tier = nextTier;
				profile = getProfile(tier);
				canvas.dataset.performanceTier = tier;
			}
			canvas.dataset.performanceTier = tier;
			if (diagnosticsEnabled) {
				recordPerformanceMeasure(
					`cz-performance-display-draw-${surface}`,
					drawStartedAt,
					drawFinishedAt,
				);
			}
		};

		// Paint the backdrop synchronously so the canvas is sized before the
		// first browser frame; subsequent frames use the browser timestamp.
		draw(0);
		return () => {
			cancelled = true;
			window.cancelAnimationFrame(rafRef.current);
		};
	}, [scopePerformanceMode, surface, subscribeScopeFrames]);

	const isDrawer = surface === "drawer";
	const isMini = surface === "mini";
	const toolbarAtBottom = surface === "simple";
	const nextTheme =
		theme === "vintage" ? "amber" : theme === "amber" ? "plasma" : "vintage";
	const setTheme = useSynthUiStore((state) => state.setScopeColorTheme);
	const palette = getScopeThemePalette(theme);
	const modeControl = (
		<div className="pointer-events-auto w-max min-w-0 max-w-full">
			<VisualizationModeTabs compact={!toolbarAtBottom} />
		</div>
	);
	const themeControl = (
		<button
			type="button"
			className="pointer-events-auto rounded border border-cz-cream/40 bg-cz-body/95 px-1.5 py-0.5 font-mono text-4xs text-cz-cream tracking-wide shadow-lg transition-colors hover:border-cz-cream"
			style={{ color: palette.bright }}
			onClick={() => setTheme(nextTheme)}
			aria-label={t("scope.toggleThemeAria")}
		>
			{t(`scope.theme${theme[0].toUpperCase()}${theme.slice(1)}`)}
		</button>
	);

	return (
		<div
			className={`relative flex w-full flex-col ${isDrawer || isMini || toolbarAtBottom ? "h-full min-h-0" : ""}`}
		>
			{toolbarAtBottom ? (
				<>
					<div className="pointer-events-none absolute inset-x-2 top-2 z-20 flex justify-end">
						{modeControl}
					</div>
					<div className="pointer-events-none absolute right-2 bottom-2 z-20">
						{themeControl}
					</div>
				</>
			) : (
				<div className="pointer-events-none absolute inset-x-1 top-1 z-20 flex justify-between">
					{modeControl}
					{themeControl}
				</div>
			)}
			<div
				className={`relative min-h-0 w-full overflow-hidden rounded border border-cz-border bg-cz-lcd-bg ${toolbarAtBottom || isDrawer || isMini ? "order-1 min-h-0 flex-1" : "order-2"}`}
			>
				<canvas
					ref={canvasRef}
					aria-label={t("scope.audioDisplayAria")}
					className={`${isDrawer ? "h-full min-h-80 w-full" : surface === "simple" || isMini ? "h-full min-h-0 w-full" : "h-43 w-full"}`}
				/>
			</div>
		</div>
	);
}
