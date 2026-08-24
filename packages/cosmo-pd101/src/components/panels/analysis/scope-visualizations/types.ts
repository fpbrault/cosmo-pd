import type { ScopeColorTheme } from "@/features/synth/synthUiStore";
import type { VisualizationMode } from "@/features/visualization/visualizationModes";
import type { VisualizationCanvasTarget } from "@/lib/canvasRenderTarget";

export type { ScopeColorTheme };
export type ScopeVisualizationMode = VisualizationMode;

export type ScopeWindow = {
	start: number;
	count: number;
	samplesPerCycle: number;
};

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

export type ScopeRendererParams = {
	mode: ScopeVisualizationMode;
	target: VisualizationCanvasTarget;
	samples: Uint8Array | Float32Array;
	hz: number;
	sampleRate: number;
	cycles: number;
	triggerLevel: number;
	scopeWindow?: ScopeWindow;
	zoom: number;
	palette: ScopeThemePalette;
	frequencyBins?: Uint8Array<ArrayBufferLike>;
	spectrogramStateRef: SpectrogramStateRef;
	pressedKeys: ReadonlySet<string>;
	intensityMultiplier?: number;
	constrainedPerformance?: boolean;
	spectrogramBins?: number;
	spectrogramFftSize?: number;
};
