import type { ScopeColorTheme } from "@/features/synth/synthUiStore";
import type { ScopeVisualizationMode } from "./renderScopeVisualization";

export type { ScopeColorTheme };

export type ScopeThemePalette = {
	theme: ScopeColorTheme;
	background: string;
	backgroundOverlay: string;
	grid: string;
	centerLine: string;
	accent: string;
	accentSoft: string;
	accentDim: string;
	glow: string;
	light: string;
	accentSecondary: string;
	warm: string;
	dim: string;
	medium: string;
	bright: string;
	alert: string;
	highlight: string;
	soft: string;
	spectrogramLow: string;
	spectrogramMid: string;
	spectrogramHigh: string;
};

export type SpectrogramState = {
	width: number;
	height: number;
	history: Uint8Array | null;
};

export type SpectrogramStateRef = {
	current: SpectrogramState;
};

export type WaterfallPreviewIndicator = {
	voiceId: number;
	progress: number;
	strength: number;
};

export type WaterfallVoiceProgressState = {
	note: number;
	progress: number;
};

export type WaterfallPreviewData = {
	line1History: number[][];
	line2History: number[][];
	line1Indicators: WaterfallPreviewIndicator[];
	line2Indicators: WaterfallPreviewIndicator[];
};

export type ScopeRendererParams = {
	mode: ScopeVisualizationMode;
	canvas: HTMLCanvasElement;
	samples: Uint8Array | Float32Array;
	hz: number;
	sampleRate: number;
	cycles: number;
	triggerLevel: number;
	zoom: number;
	palette: ScopeThemePalette;
	frequencyBins?: Uint8Array<ArrayBufferLike>;
	spectrogramStateRef: SpectrogramStateRef;
	pressedKeys: ReadonlySet<string>;
	intensityMultiplier?: number;
	waterfallPreview?: WaterfallPreviewData | null;
	waterfallActiveLine?: 1 | 2;
};
