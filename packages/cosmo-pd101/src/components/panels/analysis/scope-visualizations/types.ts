import type {
	ScopeColorTheme,
} from "@/features/synth/synthUiStore";
import { ScopeVisualizationMode } from "./renderScopeVisualization";

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
};
