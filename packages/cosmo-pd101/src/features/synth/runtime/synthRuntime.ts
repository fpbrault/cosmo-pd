import type { RefObject } from "react";

export type SynthScopeFrameSubscription = (
	onFrame: (frame: {
		samples: Float32Array;
		sampleRate: number;
		hz: number;
	}) => void,
) => () => void;

export type SynthRuntime = {
	activeNotes: number[];
	pitchBend: number;
	modWheel: number;
	sendNoteOn: (note: number, velocity?: number) => void;
	sendNoteOff: (note: number) => void;
	sendPitchBend: (value: number) => void;
	sendModWheel: (value: number) => void;
	sendPolyAftertouch: (note: number, pressure: number) => void;
	panic: () => void;
	audioContextState: "suspended" | "running" | "closed" | null;
	resumeAudio: () => void;
	effectivePitchHz: number;
	scopePerformanceMode?: "standard" | "constrained";
	analyserNodeRef: RefObject<AnalyserNode | null>;
	audioCtxRef: RefObject<AudioContext | null>;
	subscribeScopeFrames?: SynthScopeFrameSubscription;
};
