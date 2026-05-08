import type { RefObject } from "react";

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

export type ScopeVisualizationVariant = "mini" | "drawer";

export type ScopeMiniDisplayWithStateProps = ScopeMiniDisplayProps & {
	expanded?: boolean;
};
