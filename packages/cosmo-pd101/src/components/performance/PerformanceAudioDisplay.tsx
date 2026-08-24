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
) {
	const constrained = mode === "constrained";
	return {
		bandCount: constrained ? 48 : 64,
		waveformPointCount: constrained ? 96 : 160,
		rowCount: constrained ? 24 : 40,
		historyInterval: constrained ? 66 : 50,
		maxPixelRatio: constrained ? 1.5 : 2,
		glowBlur: constrained ? 4 : 8,
	};
}

function prepareCanvas(canvas: HTMLCanvasElement, maxPixelRatio: number) {
	const ratio = Math.min(window.devicePixelRatio || 1, maxPixelRatio);
	const width = Math.max(1, Math.round(canvas.clientWidth * ratio));
	const height = Math.max(1, Math.round(canvas.clientHeight * ratio));
	if (canvas.width !== width || canvas.height !== height) {
		canvas.width = width;
		canvas.height = height;
	}
	return { width, height };
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

function drawWaterfall(
	context: CanvasRenderingContext2D,
	width: number,
	height: number,
	history: Float32Array[],
	palette: ScopeThemePalette,
	glowBlur: number,
) {
	drawGrid(context, width, height, palette);
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
		context.shadowColor = depth > 0.72 ? palette.glow : "transparent";
		context.shadowBlur = depth > 0.72 ? glowBlur : 0;
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
) {
	drawGrid(context, width, height, palette);
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
			const displayValue = Math.tanh(
				(values[point] ?? 0) * SCOPE_VERTICAL_SCALE,
			);
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
		context.shadowColor = depth > 0.72 ? palette.glow : "transparent";
		context.shadowBlur = depth > 0.72 ? glowBlur : 0;
		context.stroke();
	}
	context.shadowBlur = 0;
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
	const frameVersionRef = useRef(0);
	const rafRef = useRef(0);
	const phaseLockRef = useRef(new AutoScopePhaseLock());
	const effectivePitchHzRef = useRef(1);
	const scopeColorTheme = useSynthUiStore((state) => state.scopeColorTheme);
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
			frameRef.current = { ...frame, hz: Math.max(1, frame.hz) };
			frameVersionRef.current++;
		});
	}, [subscribeScopeFrames]);

	useEffect(() => {
		const palette = getScopeThemePalette(scopeColorTheme);
		const profile = getPerformanceDisplayProfile(scopePerformanceMode);
		historyRef.current = [];
		lastHistoryUpdateRef.current = 0;
		phaseLockRef.current.reset();
		let lastConsumedFrameVersion = -1;
		let hasDrawn = false;
		const draw = (now: number) => {
			rafRef.current = window.requestAnimationFrame(draw);
			const canvas = canvasRef.current;
			if (!canvas) return;
			const usesExternalFrames = Boolean(subscribeScopeFrames);
			const frameVersion = frameVersionRef.current;
			if (
				usesExternalFrames &&
				hasDrawn &&
				frameVersion === lastConsumedFrameVersion
			) {
				return;
			}
			if (
				historyRef.current.length > 0 &&
				now - lastHistoryUpdateRef.current < profile.historyInterval
			) {
				return;
			}
			let frame = frameRef.current;
			const analyser = analyserNodeRef.current;
			if (!subscribeScopeFrames && analyser) {
				const samples = new Float32Array(analyser.fftSize);
				analyser.getFloatTimeDomainData(samples);
				let frequencyBins: Uint8Array | undefined;
				if (mode === "waterfall") {
					frequencyBins = new Uint8Array(analyser.frequencyBinCount);
					analyser.getByteFrequencyData(
						frequencyBins as Uint8Array<ArrayBuffer>,
					);
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
			const { width, height } = prepareCanvas(canvas, profile.maxPixelRatio);
			if (!frame) {
				drawGrid(context, width, height, palette);
				hasDrawn = true;
				lastConsumedFrameVersion = frameVersion;
				return;
			}
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
			if (historyRef.current.length >= profile.rowCount) {
				historyRef.current.shift();
			}
			historyRef.current.push(values);
			lastHistoryUpdateRef.current = now;
			lastConsumedFrameVersion = frameVersion;
			hasDrawn = true;
			if (mode === "scope") {
				drawScopeWaterfall(
					context,
					width,
					height,
					historyRef.current,
					palette,
					profile.glowBlur,
				);
			} else {
				drawWaterfall(
					context,
					width,
					height,
					historyRef.current,
					palette,
					profile.glowBlur,
				);
			}
		};
		rafRef.current = window.requestAnimationFrame(draw);
		return () => window.cancelAnimationFrame(rafRef.current);
	}, [
		analyserNodeRef,
		audioCtxRef,
		mode,
		scopeColorTheme,
		scopePerformanceMode,
		subscribeScopeFrames,
	]);

	return (
		<canvas
			ref={canvasRef}
			className="h-full min-h-0 w-full"
			aria-label={`${mode} audio display`}
		/>
	);
}
