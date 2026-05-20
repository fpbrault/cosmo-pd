import { useEffect, useRef } from "react";
import { useSynthUiStore } from "@/features/synth/synthUiStore";
import type {
	ScopeMiniDisplayProps,
	ScopeVisualizationVariant,
} from "./ScopeDisplay.types";
import { drawScopeBackdrop } from "./scope-visualizations/canvas";
import { isEditableKeyboardTarget } from "./scope-visualizations/keyboard";
import { getScopeThemePalette } from "./scope-visualizations/palette";
import { calculateFrameMean } from "./scope-visualizations/processing";
import { renderScopeVisualization, ScopeVisualizationMode } from "./scope-visualizations/renderScopeVisualization";
import type {
	ScopeColorTheme,
	SpectrogramState,
} from "./scope-visualizations/types";
import { WavetableWaterfallScopeViz } from "./scope-visualizations/WavetableWaterfallScopeViz";

type ScopeVisualizationDisplayProps = ScopeMiniDisplayProps & {
	variant: ScopeVisualizationVariant;
};

export function ScopeVisualizationDisplay({
	analyserNodeRef,
	audioCtxRef,
	effectivePitchHz,
	subscribeScopeFrames,
	variant,
}: ScopeVisualizationDisplayProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const rafIdRef = useRef(0);
	const unsubscribeRef = useRef<(() => void) | null>(null);
	const smoothedTriggerRef = useRef<number | null>(null);
	const pressedKeysRef = useRef<Set<string>>(new Set());

	const scopeCycles = useSynthUiStore((s) => s.scopeCycles);
	const scopeVerticalZoom = useSynthUiStore((s) => s.scopeVerticalZoom);
	const scopeTriggerLevel = useSynthUiStore((s) => s.scopeTriggerLevel);
	const scopeVisualizationMode = useSynthUiStore(
		(s) => s.scopeVisualizationMode,
	);
	const scopeColorTheme = useSynthUiStore((s) => s.scopeColorTheme);
	const setScopeVisualizationMode = useSynthUiStore(
		(s) => s.setScopeVisualizationMode,
	);
	const setScopeColorTheme = useSynthUiStore((s) => s.setScopeColorTheme);

	const palette = getScopeThemePalette(scopeColorTheme);
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
		scopeTriggerLevel,
		scopeVisualizationMode,
		scopeColorTheme,
	});
	settingsRef.current = {
		scopeCycles,
		scopeVerticalZoom,
		scopeTriggerLevel,
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
		const mean = calculateFrameMean(samples);
		if (smoothedTriggerRef.current == null) {
			smoothedTriggerRef.current = mean;
		} else {
			smoothedTriggerRef.current += 0.18 * (mean - smoothedTriggerRef.current);
		}
		const bias = settingsRef.current.scopeTriggerLevel - 128;
		const triggerLevel = Math.max(
			0,
			Math.min(255, smoothedTriggerRef.current + bias),
		);

		renderScopeVisualization({
			mode: settingsRef.current.scopeVisualizationMode,
			canvas,
			samples,
			hz,
			sampleRate,
			frequencyBins,
			cycles: settingsRef.current.scopeCycles,
			triggerLevel,
			zoom: settingsRef.current.scopeVerticalZoom,
			palette: getScopeThemePalette(settingsRef.current.scopeColorTheme),
			spectrogramStateRef,
			pressedKeys: pressedKeysRef.current,
			intensityMultiplier: variant === "drawer" ? 1.55 : 1,
		});
	};

	// Subscribe to external frame push stream (plugin mode).
	useEffect(() => {
		unsubscribeRef.current?.();
		unsubscribeRef.current = null;
		if (!subscribeScopeFrames) return;
		unsubscribeRef.current = subscribeScopeFrames((frame) => {
			const canvas = canvasRef.current;
			if (!canvas) return;
			drawFrameRef.current(
				canvas,
				frame.samples,
				Math.max(1, frame.hz),
				frame.sampleRate,
			);
		});
		return () => {
			unsubscribeRef.current?.();
			unsubscribeRef.current = null;
		};
	}, [subscribeScopeFrames]);

	// RAF loop for AnalyserNode path (web-audio mode).
	useEffect(() => {
		const draw = () => {
			rafIdRef.current = window.requestAnimationFrame(draw);
			const canvas = canvasRef.current;
			if (!canvas) return;
			// External stream takes priority.
			if (unsubscribeRef.current) return;
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
	const isWaterfall3D = scopeVisualizationMode === "waterfall3d";

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
						? "Waveform"
						: scopeVisualizationMode === "orbital"
							? "Orbital"
							: scopeVisualizationMode === "spectrogram"
								? "Spectrogram"
								: scopeVisualizationMode === "waterfall3d"
									? "Waterfall 3D"
									: scopeVisualizationMode === "transferCurves"
										? "Transfer Curves"
										: "Asteroids"}
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
					aria-label="Toggle scope color theme"
				>
					{scopeColorTheme === "vintage"
						? "Vintage"
						: scopeColorTheme === "amber"
							? "Amber"
							: "Plasma"}
				</button>
			</div>
			<div
				className={`relative w-full overflow-hidden rounded border border-cz-border bg-cz-lcd-bg ${isDrawer ? "min-h-0 flex-1" : ""}`}
			>
				{isWaterfall3D ? (
					<div className={isDrawer ? "h-full min-h-80 w-full" : "h-43 w-full"}>
						<WavetableWaterfallScopeViz
							displayMode="single"
							palette={palette}
							visualIntensity={isDrawer ? 1 : 0.65}
						/>
					</div>
				) : (
					<canvas
						ref={canvasRef}
						className={isDrawer ? "h-full min-h-80 w-full" : "h-43 w-full"}
					/>
				)}
			</div>
		</div>
	);
}
