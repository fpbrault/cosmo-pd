export type VisualizationMode =
	| "scopeHistory"
	| "spectrumWaterfall"
	| "waveform"
	| "orbital"
	| "spectrogram"
	| "transferCurves"
	| "asteroids";

export const VISUALIZATION_MODES: VisualizationMode[] = [
	"scopeHistory",
	"spectrumWaterfall",
	"waveform",
	"orbital",
	"spectrogram",
	"transferCurves",
	"asteroids",
];

export type VisualizationSurface = "simple" | "mini" | "drawer";

export type VisualizationFramePolicy = "audio" | "animation" | "invalidation";

export type VisualizationModeDefinition = {
	mode: VisualizationMode;
	framePolicy: VisualizationFramePolicy;
	needsFrequencyBins?: boolean;
	usesPhaseLock?: boolean;
};

export const VISUALIZATION_MODE_DEFINITIONS: Record<
	VisualizationMode,
	VisualizationModeDefinition
> = {
	scopeHistory: {
		mode: "scopeHistory",
		framePolicy: "audio",
		usesPhaseLock: true,
	},
	spectrumWaterfall: {
		mode: "spectrumWaterfall",
		framePolicy: "audio",
		needsFrequencyBins: true,
	},
	waveform: {
		mode: "waveform",
		framePolicy: "audio",
		usesPhaseLock: true,
	},
	orbital: {
		mode: "orbital",
		framePolicy: "audio",
		usesPhaseLock: true,
	},
	spectrogram: {
		mode: "spectrogram",
		framePolicy: "audio",
		needsFrequencyBins: true,
	},
	transferCurves: {
		mode: "transferCurves",
		framePolicy: "audio",
		usesPhaseLock: true,
	},
	asteroids: {
		mode: "asteroids",
		framePolicy: "animation",
	},
};

export const isVisualizationMode = (
	value: unknown,
): value is VisualizationMode =>
	typeof value === "string" &&
	(VISUALIZATION_MODES as string[]).includes(value);

export const migrateLegacyVisualizationMode = (
	value: unknown,
): VisualizationMode | null => {
	if (isVisualizationMode(value)) return value;
	if (value === "scope") return "scopeHistory";
	if (value === "waterfall") return "spectrumWaterfall";
	return null;
};
