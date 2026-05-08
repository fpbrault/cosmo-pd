import {
	type ReactElement,
	type RefObject,
	useEffect,
	useRef,
	useState,
} from "react";
import ControlKnob from "@/components/controls/ControlKnob";
import type { AsidePanelComponent } from "@/components/layout/AsidePanelSwitcher";
import SynthPanelContainer from "@/components/layout/SynthPanelContainer";
import {
	type ScopeVisualizationMode,
	useSynthUiStore,
} from "@/features/synth/synthUiStore";
import { drawOscilloscope } from "@/lib/synth/drawOscilloscope";

export type ScopeMiniDisplayProps = {
	analyserNodeRef?: RefObject<AnalyserNode | null>;
	audioCtxRef?: RefObject<AudioContext | null>;
	effectivePitchHz: number;
	subscribeScopeFrames?: (
		onFrame: (frame: {
			samples: Float32Array;
			sampleRate: number;
			hz: number;
		}) => void,
	) => () => void;
};

/** @deprecated Use ScopeMiniDisplayProps */
export type ScopePanelProps = ScopeMiniDisplayProps;

const SCOPE_VISUALIZATION_MODES: ScopeVisualizationMode[] = [
	"waveform",
	"phaseBender",
	"phaseXY",
	"orbital",
	"mirrorFold",
	"constellation",
	"ribbon",
	"harmonicBars",
	"spectrogram",
];

const SCOPE_VISUALIZATION_LABELS: Record<ScopeVisualizationMode, string> = {
	waveform: "Wave",
	phaseBender: "Bend",
	phaseXY: "X-Y",
	orbital: "Orb",
	mirrorFold: "Fold",
	constellation: "Star",
	ribbon: "Rib",
	harmonicBars: "Bars",
	spectrogram: "Spec",
};

const SPECTROGRAM_BINS = 56;

type SpectrogramState = {
	width: number;
	height: number;
	history: Uint8Array | null;
};

function drawScopeBackdrop(canvas: HTMLCanvasElement) {
	const ctx = canvas.getContext("2d");
	if (!ctx) return;
	const dpr = Math.max(2, window.devicePixelRatio || 1);
	const drawWidth = Math.max(1, Math.floor(canvas.clientWidth));
	const drawHeight = Math.max(1, Math.floor(canvas.clientHeight));
	const pixelWidth = Math.floor(drawWidth * dpr);
	const pixelHeight = Math.floor(drawHeight * dpr);
	if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
		canvas.width = pixelWidth;
		canvas.height = pixelHeight;
	}
	ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
	ctx.fillStyle = "#051005";
	ctx.fillRect(0, 0, drawWidth, drawHeight);
	ctx.strokeStyle = "rgba(0, 120, 0, 0.35)";
	ctx.lineWidth = 1;
	for (let y = 0.25; y < 1; y += 0.25) {
		ctx.beginPath();
		ctx.moveTo(0, drawHeight * y);
		ctx.lineTo(drawWidth, drawHeight * y);
		ctx.stroke();
	}
	for (let x = 0.1; x < 1; x += 0.1) {
		ctx.beginPath();
		ctx.moveTo(drawWidth * x, 0);
		ctx.lineTo(drawWidth * x, drawHeight);
		ctx.stroke();
	}
	ctx.strokeStyle = "rgba(0, 120, 0, 0.6)";
	ctx.lineWidth = 1.5;
	ctx.beginPath();
	ctx.moveTo(0, drawHeight / 2);
	ctx.lineTo(drawWidth, drawHeight / 2);
	ctx.stroke();
}

function setupScopeCanvas(canvas: HTMLCanvasElement) {
	const ctx = canvas.getContext("2d");
	if (!ctx) return null;
	const dpr = Math.max(2, window.devicePixelRatio || 1);
	const width = Math.max(1, Math.floor(canvas.clientWidth));
	const height = Math.max(1, Math.floor(canvas.clientHeight));
	const pixelWidth = Math.floor(width * dpr);
	const pixelHeight = Math.floor(height * dpr);
	if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
		canvas.width = pixelWidth;
		canvas.height = pixelHeight;
	}
	ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
	return { ctx, width, height };
}

function drawScopeGrid(
	ctx: CanvasRenderingContext2D,
	width: number,
	height: number,
) {
	ctx.fillStyle = "#051005";
	ctx.fillRect(0, 0, width, height);
	ctx.strokeStyle = "rgba(0, 120, 0, 0.35)";
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
	ctx.strokeStyle = "rgba(0, 120, 0, 0.6)";
	ctx.lineWidth = 1.5;
	ctx.beginPath();
	ctx.moveTo(0, height / 2);
	ctx.lineTo(width, height / 2);
	ctx.stroke();
}

function sampleAt(samples: Uint8Array | Float32Array, index: number): number {
	const sample = samples[index] ?? 0;
	if (samples instanceof Uint8Array) {
		return (sample - 128) / 128;
	}
	return sample;
}

function resolveScopeWindow(
	samples: Uint8Array | Float32Array,
	hz: number,
	sampleRate: number,
	cycles: number,
	triggerLevel: number,
) {
	const samplesPerCycle = Math.max(8, Math.round(sampleRate / Math.max(1, hz)));
	const requested = Math.max(16, Math.round(samplesPerCycle * cycles));
	const windowSamples = Math.max(8, Math.min(samples.length - 2, requested));
	if (windowSamples <= 2) {
		return { start: 0, count: Math.max(0, samples.length) };
	}
	let start = Math.max(1, Math.floor((samples.length - windowSamples) / 2));
	const trigger = (triggerLevel - 128) / 128;
	for (let i = 1; i < samples.length - windowSamples - 1; i++) {
		const prev = sampleAt(samples, i - 1);
		const curr = sampleAt(samples, i);
		if (prev < trigger && curr >= trigger) {
			start = i;
			break;
		}
	}
	return { start, count: windowSamples, samplesPerCycle };
}

function normalizeWindowedSamples(
	samples: Uint8Array | Float32Array,
	start: number,
	count: number,
) {
	const out = new Float32Array(Math.max(0, count));
	if (count <= 0) return out;
	let mean = 0;
	for (let i = 0; i < count; i++) {
		const value = sampleAt(samples, start + i);
		out[i] = value;
		mean += value;
	}
	mean /= count;
	for (let i = 0; i < count; i++) {
		out[i] -= mean;
	}
	return out;
}

function drawPhaseBenderScope(
	canvas: HTMLCanvasElement,
	samples: Uint8Array | Float32Array,
	hz: number,
	sampleRate: number,
	cycles: number,
	triggerLevel: number,
	zoom: number,
) {
	const setup = setupScopeCanvas(canvas);
	if (!setup) return;
	const { ctx, width, height } = setup;
	drawScopeGrid(ctx, width, height);

	const { start, count } = resolveScopeWindow(
		samples,
		hz,
		sampleRate,
		cycles,
		triggerLevel,
	);
	if (count < 8) return;
	const normalized = normalizeWindowedSamples(samples, start, count);

	const cumulative = new Float32Array(count);
	let total = 0;
	cumulative[0] = 0;
	for (let i = 1; i < count; i++) {
		total += Math.abs(normalized[i] - normalized[i - 1]) + 0.00015;
		cumulative[i] = total;
	}
	const denom = Math.max(total, 1e-6);

	ctx.strokeStyle = "rgba(255, 105, 105, 0.88)";
	ctx.lineWidth = 1.4;
	ctx.beginPath();
	ctx.moveTo(0, height - 8);
	ctx.lineTo(width, 8);
	ctx.stroke();

	ctx.strokeStyle = "rgba(122, 255, 122, 0.9)";
	ctx.lineWidth = 1.8;
	ctx.beginPath();
	for (let i = 0; i < count; i++) {
		const x = (i / (count - 1)) * width;
		const warped = cumulative[i] / denom;
		const y = height - 8 - warped * (height - 16);
		if (i === 0) {
			ctx.moveTo(x, y);
		} else {
			ctx.lineTo(x, y);
		}
	}
	ctx.stroke();

	ctx.shadowColor = "#5dff5d";
	ctx.shadowBlur = 7;
	ctx.strokeStyle = "#5dff5d";
	ctx.lineWidth = 2;
	ctx.beginPath();
	for (let i = 0; i < count; i++) {
		const x = (i / (count - 1)) * width;
		const y =
			height / 2 -
			normalized[i] * zoom * (height / 2 - 10) * Math.max(1, cycles);
		if (i === 0) {
			ctx.moveTo(x, y);
		} else {
			ctx.lineTo(x, y);
		}
	}
	ctx.stroke();
	ctx.shadowBlur = 0;
}

function drawPhaseXYScope(
	canvas: HTMLCanvasElement,
	samples: Uint8Array | Float32Array,
	hz: number,
	sampleRate: number,
	cycles: number,
	triggerLevel: number,
	zoom: number,
) {
	const setup = setupScopeCanvas(canvas);
	if (!setup) return;
	const { ctx, width, height } = setup;
	drawScopeGrid(ctx, width, height);

	const window = resolveScopeWindow(
		samples,
		hz,
		sampleRate,
		cycles,
		triggerLevel,
	);
	if (window.count < 8 || !window.samplesPerCycle) return;
	const normalized = normalizeWindowedSamples(
		samples,
		window.start,
		window.count,
	);

	ctx.shadowColor = "#63ff63";
	ctx.shadowBlur = 7;
	ctx.strokeStyle = "rgba(129, 255, 129, 0.9)";
	ctx.lineWidth = 1.75;
	ctx.beginPath();
	for (let i = 0; i < window.count; i++) {
		const phase = (i % window.samplesPerCycle) / window.samplesPerCycle;
		const x = phase * width;
		const y = height / 2 - normalized[i] * zoom * (height / 2 - 8);
		if (i === 0) {
			ctx.moveTo(x, y);
		} else {
			ctx.lineTo(x, y);
		}
	}
	ctx.stroke();
	ctx.shadowBlur = 0;
}

function drawOrbitalScope(
	canvas: HTMLCanvasElement,
	samples: Uint8Array | Float32Array,
	hz: number,
	sampleRate: number,
	cycles: number,
	triggerLevel: number,
	zoom: number,
) {
	const setup = setupScopeCanvas(canvas);
	if (!setup) return;
	const { ctx, width, height } = setup;
	drawScopeGrid(ctx, width, height);

	const window = resolveScopeWindow(
		samples,
		hz,
		sampleRate,
		cycles,
		triggerLevel,
	);
	if (window.count < 8 || !window.samplesPerCycle) return;
	const normalized = normalizeWindowedSamples(
		samples,
		window.start,
		window.count,
	);

	const cx = width / 2;
	const cy = height / 2;
	const radiusBase = Math.min(width, height) * 0.23;
	const radiusScale = Math.min(width, height) * 0.19 * zoom;

	ctx.strokeStyle = "rgba(70, 150, 120, 0.45)";
	ctx.lineWidth = 1;
	ctx.beginPath();
	ctx.arc(cx, cy, radiusBase, 0, Math.PI * 2);
	ctx.stroke();
	ctx.beginPath();
	ctx.arc(cx, cy, radiusBase + radiusScale * 0.65, 0, Math.PI * 2);
	ctx.stroke();

	ctx.shadowColor = "#7cff7c";
	ctx.shadowBlur = 9;
	ctx.strokeStyle = "#7cff7c";
	ctx.lineWidth = 1.8;
	ctx.beginPath();
	for (let i = 0; i < window.count; i++) {
		const phase = (i % window.samplesPerCycle) / window.samplesPerCycle;
		const angle = phase * Math.PI * 2;
		const radius = radiusBase + normalized[i] * radiusScale;
		const x = cx + Math.cos(angle) * radius;
		const y = cy + Math.sin(angle) * radius;
		if (i === 0) {
			ctx.moveTo(x, y);
		} else {
			ctx.lineTo(x, y);
		}
	}
	ctx.stroke();
	ctx.shadowBlur = 0;
}

function drawMirrorFoldScope(
	canvas: HTMLCanvasElement,
	samples: Uint8Array | Float32Array,
	hz: number,
	sampleRate: number,
	cycles: number,
	triggerLevel: number,
	zoom: number,
) {
	const setup = setupScopeCanvas(canvas);
	if (!setup) return;
	const { ctx, width, height } = setup;
	drawScopeGrid(ctx, width, height);

	const window = resolveScopeWindow(
		samples,
		hz,
		sampleRate,
		cycles,
		triggerLevel,
	);
	if (window.count < 8) return;
	const normalized = normalizeWindowedSamples(
		samples,
		window.start,
		window.count,
	);

	ctx.strokeStyle = "rgba(61, 255, 61, 0.38)";
	ctx.lineWidth = 1;
	ctx.beginPath();
	ctx.moveTo(width / 2, 0);
	ctx.lineTo(width / 2, height);
	ctx.stroke();

	ctx.shadowColor = "#7dff7d";
	ctx.shadowBlur = 7;
	ctx.strokeStyle = "#7dff7d";
	ctx.lineWidth = 1.8;
	ctx.beginPath();
	for (let i = 0; i < window.count; i++) {
		const phase = i / (window.count - 1);
		const amp = normalized[i] * zoom;
		const fold = Math.abs(phase * 2 - 1);
		const x = width / 2 + amp * (width / 2 - 10) * (1 - fold * 0.25);
		const y = phase * height;
		if (i === 0) {
			ctx.moveTo(x, y);
		} else {
			ctx.lineTo(x, y);
		}
	}
	ctx.stroke();
	ctx.shadowBlur = 0;
}

function drawConstellationScope(
	canvas: HTMLCanvasElement,
	samples: Uint8Array | Float32Array,
	hz: number,
	sampleRate: number,
	cycles: number,
	triggerLevel: number,
	zoom: number,
) {
	const setup = setupScopeCanvas(canvas);
	if (!setup) return;
	const { ctx, width, height } = setup;
	drawScopeGrid(ctx, width, height);

	const window = resolveScopeWindow(
		samples,
		hz,
		sampleRate,
		cycles,
		triggerLevel,
	);
	if (window.count < 16 || !window.samplesPerCycle) return;
	const normalized = normalizeWindowedSamples(
		samples,
		window.start,
		window.count,
	);

	ctx.strokeStyle = "rgba(125, 255, 125, 0.35)";
	ctx.lineWidth = 1;
	ctx.beginPath();
	for (let i = 0; i < window.count; i += 2) {
		const phase = (i % window.samplesPerCycle) / window.samplesPerCycle;
		const angle = phase * Math.PI * 2;
		const radius =
			(0.25 + Math.abs(normalized[i]) * 0.65 * zoom) *
			Math.min(width, height) *
			0.45;
		const x = width / 2 + Math.cos(angle) * radius;
		const y = height / 2 + Math.sin(angle) * radius;
		if (i === 0) {
			ctx.moveTo(x, y);
		} else {
			ctx.lineTo(x, y);
		}
	}
	ctx.stroke();

	ctx.fillStyle = "#98ff98";
	for (
		let i = 0;
		i < window.count;
		i += Math.max(2, Math.floor(window.samplesPerCycle / 12))
	) {
		const phase = (i % window.samplesPerCycle) / window.samplesPerCycle;
		const angle = phase * Math.PI * 2;
		const radius =
			(0.25 + Math.abs(normalized[i]) * 0.65 * zoom) *
			Math.min(width, height) *
			0.45;
		const x = width / 2 + Math.cos(angle) * radius;
		const y = height / 2 + Math.sin(angle) * radius;
		ctx.fillRect(x - 1, y - 1, 2, 2);
	}
}

function drawRibbonScope(
	canvas: HTMLCanvasElement,
	samples: Uint8Array | Float32Array,
	hz: number,
	sampleRate: number,
	cycles: number,
	triggerLevel: number,
	zoom: number,
) {
	const setup = setupScopeCanvas(canvas);
	if (!setup) return;
	const { ctx, width, height } = setup;
	drawScopeGrid(ctx, width, height);

	const window = resolveScopeWindow(
		samples,
		hz,
		sampleRate,
		cycles,
		triggerLevel,
	);
	if (window.count < 8) return;
	const normalized = normalizeWindowedSamples(
		samples,
		window.start,
		window.count,
	);

	const layers = [
		{ offset: -8, alpha: 0.22 },
		{ offset: -4, alpha: 0.35 },
		{ offset: 0, alpha: 0.9 },
		{ offset: 4, alpha: 0.35 },
		{ offset: 8, alpha: 0.22 },
	];

	for (const layer of layers) {
		ctx.shadowColor = layer.offset === 0 ? "#7bff7b" : "transparent";
		ctx.shadowBlur = layer.offset === 0 ? 8 : 0;
		ctx.strokeStyle = `rgba(123, 255, 123, ${layer.alpha})`;
		ctx.lineWidth = layer.offset === 0 ? 2 : 1.2;
		ctx.beginPath();
		for (let i = 0; i < window.count; i++) {
			const x = (i / (window.count - 1)) * width;
			const y =
				height / 2 - normalized[i] * zoom * (height / 2 - 12) + layer.offset;
			if (i === 0) {
				ctx.moveTo(x, y);
			} else {
				ctx.lineTo(x, y);
			}
		}
		ctx.stroke();
	}
	ctx.shadowBlur = 0;
}

function drawHarmonicBarsScope(
	canvas: HTMLCanvasElement,
	bins: Uint8Array<ArrayBufferLike>,
) {
	const setup = setupScopeCanvas(canvas);
	if (!setup) return;
	const { ctx, width, height } = setup;
	drawScopeGrid(ctx, width, height);

	const barCount = Math.max(12, Math.min(64, Math.floor(width / 6)));
	const barBins = downsampleBins(bins, barCount);
	const barWidth = width / barCount;

	for (let i = 0; i < barCount; i++) {
		const magnitude = (barBins[i] ?? 0) / 255;
		const barHeight = Math.max(2, magnitude * (height - 14));
		const x = i * barWidth + 0.6;
		const y = height - barHeight - 2;
		ctx.fillStyle = `rgba(126, 255, 126, ${0.18 + magnitude * 0.72})`;
		ctx.fillRect(x, y, Math.max(1, barWidth - 1.2), barHeight);
	}
}

function downsampleBins(
	source: Uint8Array<ArrayBufferLike>,
	targetBins: number,
) {
	if (source.length === targetBins) return source;
	const out = new Uint8Array(targetBins);
	for (let i = 0; i < targetBins; i++) {
		const start = Math.floor((i / targetBins) * source.length);
		const end = Math.floor(((i + 1) / targetBins) * source.length);
		let sum = 0;
		let count = 0;
		for (let j = start; j < Math.max(start + 1, end); j++) {
			sum += source[j] ?? 0;
			count++;
		}
		out[i] = Math.round(sum / Math.max(1, count));
	}
	return out;
}

function computeDftBins(
	samples: Uint8Array | Float32Array,
	binCount: number,
): Uint8Array {
	const fftSize = Math.min(256, samples.length);
	if (fftSize <= 0) return new Uint8Array(binCount);
	const windowed = new Float32Array(fftSize);
	const start = Math.max(0, samples.length - fftSize);
	for (let i = 0; i < fftSize; i++) {
		const hann = 0.5 - 0.5 * Math.cos((2 * Math.PI * i) / (fftSize - 1));
		windowed[i] = sampleAt(samples, start + i) * hann;
	}
	const minNorm = 1 / fftSize;
	const maxNorm = 0.5;
	const normRatio = maxNorm / minNorm;
	const out = new Uint8Array(binCount);
	for (let bin = 0; bin < binCount; bin++) {
		const t = binCount <= 1 ? 0 : bin / (binCount - 1);
		const normFreq = minNorm * normRatio ** t;
		const k = Math.max(
			1,
			Math.min(fftSize / 2 - 1, Math.round(normFreq * fftSize)),
		);
		let real = 0;
		let imag = 0;
		for (let n = 0; n < fftSize; n++) {
			const sample = windowed[n];
			const phase = (2 * Math.PI * k * n) / fftSize;
			real += sample * Math.cos(phase);
			imag -= sample * Math.sin(phase);
		}
		const magnitude =
			Math.sqrt(real * real + imag * imag) / Math.max(1, fftSize);
		const db = 20 * Math.log10(Math.max(1e-6, magnitude));
		const normalized = (db + 72) / 72;
		out[bin] = Math.max(0, Math.min(255, Math.round(normalized * 255)));
	}
	return out;
}

function spectrogramColor(value: number) {
	const v = Math.max(0, Math.min(255, value));
	const r = Math.max(0, Math.min(255, Math.round((v - 130) * 2.1)));
	const g = Math.max(0, Math.min(255, Math.round((v - 45) * 2.0)));
	const b = Math.max(0, Math.min(255, Math.round(30 + v * 1.35)));
	return `rgb(${r}, ${g}, ${b})`;
}

function drawSpectrogramFrame(
	canvas: HTMLCanvasElement,
	bins: Uint8Array<ArrayBufferLike>,
	spectrogramStateRef: { current: SpectrogramState },
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

	ctx.fillStyle = "#051005";
	ctx.fillRect(0, 0, width, height);
	const binHeight = height / SPECTROGRAM_BINS;
	for (let x = 0; x < width; x++) {
		const xOffset = x * SPECTROGRAM_BINS;
		for (let i = 0; i < SPECTROGRAM_BINS; i++) {
			const mag = history[xOffset + i] ?? 0;
			if (mag < 2) continue;
			ctx.fillStyle = spectrogramColor(mag);
			const y = height - (i + 1) * binHeight;
			ctx.fillRect(x, y, 1, Math.ceil(binHeight) + 1);
		}
	}

	ctx.strokeStyle = "rgba(0, 120, 0, 0.3)";
	ctx.lineWidth = 1;
	for (let y = 0.2; y < 1; y += 0.2) {
		ctx.beginPath();
		ctx.moveTo(0, height * y);
		ctx.lineTo(width, height * y);
		ctx.stroke();
	}
}

function calculateFrameMean(samples: Uint8Array | Float32Array): number {
	if (samples.length === 0) return 128;
	let sum = 0;
	if (samples instanceof Uint8Array) {
		for (let i = 0; i < samples.length; i++) sum += samples[i];
		return sum / samples.length;
	}
	for (let i = 0; i < samples.length; i++) sum += samples[i];
	const meanFloat = sum / samples.length;
	return Math.max(0, Math.min(255, meanFloat * 128 + 128));
}

/**
 * Compact oscilloscope canvas placed next to the single-cycle display in the
 * main toolbar.  Scope settings (cycles, zoom, trigger) are read from
 * useSynthUiStore so they stay in sync with the ScopePanel controls.
 */
export function ScopeMiniDisplay({
	analyserNodeRef,
	audioCtxRef,
	effectivePitchHz,
	subscribeScopeFrames,
}: ScopeMiniDisplayProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const rafIdRef = useRef(0);
	const unsubscribeRef = useRef<(() => void) | null>(null);
	const smoothedTriggerRef = useRef<number | null>(null);

	const scopeCycles = useSynthUiStore((s) => s.scopeCycles);
	const scopeVerticalZoom = useSynthUiStore((s) => s.scopeVerticalZoom);
	const scopeTriggerLevel = useSynthUiStore((s) => s.scopeTriggerLevel);
	const scopeVisualizationMode = useSynthUiStore(
		(s) => s.scopeVisualizationMode,
	);
	const setScopeVisualizationMode = useSynthUiStore(
		(s) => s.setScopeVisualizationMode,
	);
	const [modePickerOpen, setModePickerOpen] = useState(false);
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
	});
	settingsRef.current = {
		scopeCycles,
		scopeVerticalZoom,
		scopeTriggerLevel,
		scopeVisualizationMode,
	};

	const propsRef = useRef({ effectivePitchHz, analyserNodeRef, audioCtxRef });
	propsRef.current = { effectivePitchHz, analyserNodeRef, audioCtxRef };

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
		const mode = settingsRef.current.scopeVisualizationMode;
		if (mode === "spectrogram") {
			const bins =
				frequencyBins && frequencyBins.length > 0
					? frequencyBins
					: computeDftBins(samples, SPECTROGRAM_BINS);
			drawSpectrogramFrame(canvas, bins, spectrogramStateRef);
			return;
		}

		if (mode === "harmonicBars") {
			const bins =
				frequencyBins && frequencyBins.length > 0
					? frequencyBins
					: computeDftBins(samples, SPECTROGRAM_BINS);
			drawHarmonicBarsScope(canvas, bins);
			return;
		}

		spectrogramStateRef.current = { width: 0, height: 0, history: null };

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

		if (mode === "phaseBender") {
			drawPhaseBenderScope(
				canvas,
				samples,
				hz,
				sampleRate,
				settingsRef.current.scopeCycles,
				triggerLevel,
				settingsRef.current.scopeVerticalZoom,
			);
			return;
		}

		if (mode === "phaseXY") {
			drawPhaseXYScope(
				canvas,
				samples,
				hz,
				sampleRate,
				settingsRef.current.scopeCycles,
				triggerLevel,
				settingsRef.current.scopeVerticalZoom,
			);
			return;
		}

		if (mode === "orbital") {
			drawOrbitalScope(
				canvas,
				samples,
				hz,
				sampleRate,
				settingsRef.current.scopeCycles,
				triggerLevel,
				settingsRef.current.scopeVerticalZoom,
			);
			return;
		}

		if (mode === "mirrorFold") {
			drawMirrorFoldScope(
				canvas,
				samples,
				hz,
				sampleRate,
				settingsRef.current.scopeCycles,
				triggerLevel,
				settingsRef.current.scopeVerticalZoom,
			);
			return;
		}

		if (mode === "constellation") {
			drawConstellationScope(
				canvas,
				samples,
				hz,
				sampleRate,
				settingsRef.current.scopeCycles,
				triggerLevel,
				settingsRef.current.scopeVerticalZoom,
			);
			return;
		}

		if (mode === "ribbon") {
			drawRibbonScope(
				canvas,
				samples,
				hz,
				sampleRate,
				settingsRef.current.scopeCycles,
				triggerLevel,
				settingsRef.current.scopeVerticalZoom,
			);
			return;
		}

		drawOscilloscope(
			canvas,
			samples,
			{
				cycles: settingsRef.current.scopeCycles,
				verticalZoom: settingsRef.current.scopeVerticalZoom,
				triggerLevel,
				triggerMode: "rise",
			},
			hz,
			sampleRate,
		);
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
				drawScopeBackdrop(canvas);
				return;
			}
			const data = new Float32Array(analyserNode.fftSize);
			analyserNode.getFloatTimeDomainData(data);
			let frequencyBins: Uint8Array | undefined;
			if (
				settingsRef.current.scopeVisualizationMode === "spectrogram" ||
				settingsRef.current.scopeVisualizationMode === "harmonicBars"
			) {
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

	return (
		<div className="flex w-full flex-col">
			<span className="mb-1 self-center text-3xs text-base-content/55 uppercase tracking-[0.24em]">
				Scope {SCOPE_VISUALIZATION_LABELS[scopeVisualizationMode]}
			</span>
			<div className="relative w-full overflow-hidden rounded border border-cz-border bg-cz-lcd-bg">
				<div className="absolute top-0.5 left-1 font-mono text-5xs text-cz-lcd-fg/60">
					CH1
				</div>
				<div className="absolute top-0.5 right-1 z-10">
					<button
						type="button"
						className="rounded border border-cz-lcd-fg/45 bg-black/55 px-1.5 py-0.5 font-mono text-4xs text-[#8dff8d] tracking-wide hover:bg-black/70 hover:text-[#b8ffb8]"
						onClick={() => setModePickerOpen((open) => !open)}
						aria-expanded={modePickerOpen}
						aria-label="Toggle scope mode picker"
					>
						Mode: {SCOPE_VISUALIZATION_LABELS[scopeVisualizationMode]}
					</button>
					{modePickerOpen && (
						<div className="mt-1 flex min-w-22 flex-col rounded border border-cz-lcd-fg/45 bg-black/80 p-0.5">
							{SCOPE_VISUALIZATION_MODES.map((mode) => {
								const isActive = mode === scopeVisualizationMode;
								return (
									<button
										key={mode}
										type="button"
										className={`rounded px-1.5 py-0.5 text-left font-mono text-4xs tracking-wide transition-colors ${
											isActive
												? "bg-cz-lcd-fg/20 text-[#b8ffb8]"
												: "text-[#8dff8d]/85 hover:bg-cz-lcd-fg/12 hover:text-[#b8ffb8]"
										}`}
										onClick={() => {
											setScopeVisualizationMode(mode);
											setModePickerOpen(false);
										}}
										aria-label={`Select ${SCOPE_VISUALIZATION_LABELS[mode]} scope view`}
									>
										{SCOPE_VISUALIZATION_LABELS[mode]}
									</button>
								);
							})}
						</div>
					)}
				</div>
				<canvas ref={canvasRef} className="h-43 w-full" />
			</div>
		</div>
	);
}

/**
 * Aside-panel component containing only the scope adjustment controls.
 * The oscilloscope canvas itself lives in ScopeMiniDisplay (toolbar).
 */
function ScopePanel() {
	const scopeCycles = useSynthUiStore((s) => s.scopeCycles);
	const scopeVerticalZoom = useSynthUiStore((s) => s.scopeVerticalZoom);
	const scopeTriggerLevel = useSynthUiStore((s) => s.scopeTriggerLevel);
	const setScopeCycles = useSynthUiStore((s) => s.setScopeCycles);
	const setScopeVerticalZoom = useSynthUiStore((s) => s.setScopeVerticalZoom);
	const setScopeTriggerLevel = useSynthUiStore((s) => s.setScopeTriggerLevel);

	return (
		<SynthPanelContainer>
			<div className="flex justify-center gap-2">
				<ControlKnob
					value={scopeCycles}
					onChange={setScopeCycles}
					min={0.5}
					max={8}
					defaultValue={2}
					color="#3dff3d"
					label="Cycles"
					tooltip="Sets how many waveform cycles are shown in scope view."
					valueFormatter={(value) => value.toFixed(1)}
				/>
				<ControlKnob
					value={scopeVerticalZoom}
					onChange={setScopeVerticalZoom}
					min={0.25}
					max={4}
					defaultValue={1}
					color="#9cb937"
					label="Zoom"
					tooltip="Sets vertical waveform magnification."
					valueFormatter={(value) => `${value.toFixed(1)}x`}
				/>
				<ControlKnob
					value={scopeTriggerLevel}
					onChange={(value) => setScopeTriggerLevel(Math.round(value))}
					min={0}
					max={255}
					defaultValue={128}
					color="#7f9de4"
					label="Trig"
					tooltip="Sets trigger threshold used to stabilize waveform display."
					valueFormatter={(value) => `${Math.round(value)}`}
				/>
			</div>
		</SynthPanelContainer>
	);
}

ScopePanel.panelId = "scope" as const;
ScopePanel.panelTab = { topLabel: "Scope", bottomLabel: "Ctrl" } as const;

export default ScopePanel as unknown as (() => ReactElement) &
	AsidePanelComponent<"scope">;
