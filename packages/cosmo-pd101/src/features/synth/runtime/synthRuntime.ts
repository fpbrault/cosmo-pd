import type { RefObject } from "react";
import type { PerformanceMetrics } from "@/components/performance/PerformanceMonitor";

export type SynthScopeFrameSubscription = (
	onFrame: (frame: {
		samples: Float32Array;
		sampleRate: number;
		hz: number;
	}) => void,
) => () => void;

export type SynthBenchmarkRuntime = {
	mode: "web" | "plugin";
	setPerformanceMonitorEnabled: (enabled: boolean) => void | Promise<void>;
	getPerformanceMetrics: () =>
		| PerformanceMetrics
		| null
		| Promise<PerformanceMetrics | null>;
	ensureReady?: () => Promise<void>;
};

export type SynthRuntime = {
	activeNotes: number[];
	sendNoteOn: (note: number, velocity?: number) => void;
	sendNoteOff: (note: number) => void;
	sendPolyAftertouch: (note: number, pressure: number) => void;
	panic: () => void;
	audioContextState: "suspended" | "running" | "closed" | null;
	resumeAudio: () => void;
	effectivePitchHz: number;
	analyserNodeRef: RefObject<AnalyserNode | null>;
	audioCtxRef: RefObject<AudioContext | null>;
	subscribeScopeFrames?: SynthScopeFrameSubscription;
	benchmark: SynthBenchmarkRuntime;
};
