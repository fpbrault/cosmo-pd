import { beforeEach, describe, expect, it, vi } from "vitest";
import { resolveAlgoRef } from "@/lib/synth/algoRef";
import type { SynthParams } from "@/lib/synth/bindings/synth";
import type { SynthEngineSnapshot } from "./synthEngineSnapshot";
import { createWorkletSynthEngineAdapter } from "./workletSynthEngineAdapter";

vi.mock("@/lib/synth/algoRef", () => ({
	resolveAlgoRef: vi.fn(),
}));

function createSnapshot(overrides?: Partial<SynthParams>): SynthEngineSnapshot {
	return {
		params: {
			lineSelect: "L1",
			modMode: "normal",
			octave: 3,
			line1: {
				synthesisMethod: "pd",
				algo: "saw",
				algo2: null,
				algoBlend: 0,
				window: "off",
				dcaBase: 0.5,
				dcwBase: 0.5,
				modulation: 0,
				octave: 3,
				dcoEnv: {
					steps: [{ level: 127, rate: 0 }],
					sustainStep: 0,
					stepCount: 1,
					loop: false,
				},
				dcwEnv: {
					steps: [{ level: 127, rate: 0 }],
					sustainStep: 0,
					stepCount: 1,
					loop: false,
				},
				dcaEnv: {
					steps: [{ level: 127, rate: 0 }],
					sustainStep: 0,
					stepCount: 1,
					loop: false,
				},
				dcwKeyFollow: 0,
				dcaKeyFollow: 0,
				algoControlsA: [],
				algoControlsB: [],
			},
			line2: {
				synthesisMethod: "pd",
				algo: "square",
				algo2: null,
				algoBlend: 0,
				window: "off",
				dcaBase: 0.5,
				dcwBase: 0.5,
				modulation: 0,
				octave: 3,
				dcoEnv: {
					steps: [{ level: 127, rate: 0 }],
					sustainStep: 0,
					stepCount: 1,
					loop: false,
				},
				dcwEnv: {
					steps: [{ level: 127, rate: 0 }],
					sustainStep: 0,
					stepCount: 1,
					loop: false,
				},
				dcaEnv: {
					steps: [{ level: 127, rate: 0 }],
					sustainStep: 0,
					stepCount: 1,
					loop: false,
				},
				dcwKeyFollow: 0,
				dcaKeyFollow: 0,
				algoControlsA: [],
				algoControlsB: [],
			},
			frequency: 440,
			volume: 0.7,
			polyMode: "poly8",
			legato: false,
			portamento: { enabled: false, mode: "rate", rate: 0, time: 0 },
			lfo: {
				waveform: "sine",
				rate: 0.5,
				depth: 0,
				symmetry: 0,
				retrigger: true,
			},
			modMatrix: { routes: [] },
			...overrides,
		} as SynthParams,
	};
}

describe("createWorkletSynthEngineAdapter", () => {
	type AdapterArgs = Parameters<typeof createWorkletSynthEngineAdapter>[0];
	let workletNodeRef: {
		current: { port: { postMessage: ReturnType<typeof vi.fn> } } | null;
	};
	let paramsRef: { current: SynthParams };
	let postMessage: ReturnType<typeof vi.fn>;

	beforeEach(() => {
		vi.clearAllMocks();
		postMessage = vi.fn();
		workletNodeRef = { current: { port: { postMessage } } };
		paramsRef = { current: {} as SynthParams };
		vi.mocked(resolveAlgoRef).mockReturnValue({
			waveform: "saw",
			warpAlgo: "saw",
			windowType: null,
			isFrontPanelCzAlgo: false,
		});
	});

	it("creates an adapter with expected shape", () => {
		const adapter = createWorkletSynthEngineAdapter({
			workletNodeRef: workletNodeRef as AdapterArgs["workletNodeRef"],
			paramsRef,
		});
		expect(adapter).toHaveProperty("sync");
		expect(typeof adapter.sync).toBe("function");
	});

	it("sync updates paramsRef.current", () => {
		const adapter = createWorkletSynthEngineAdapter({
			workletNodeRef: workletNodeRef as AdapterArgs["workletNodeRef"],
			paramsRef,
		});
		const snapshot = createSnapshot();
		adapter.sync(snapshot);
		expect(paramsRef.current).toBeDefined();
		expect(paramsRef.current.line1.algo).toBe("saw");
		expect(paramsRef.current.line2.algo).toBe("square");
		expect(paramsRef.current.line1.synthesisMethod).toBe("pd");
		expect(paramsRef.current.line2.synthesisMethod).toBe("pd");
	});

	it("sync does NOT postMessage if workletNodeRef.current is null", () => {
		workletNodeRef.current = null;
		const adapter = createWorkletSynthEngineAdapter({
			workletNodeRef: workletNodeRef as AdapterArgs["workletNodeRef"],
			paramsRef,
		});
		adapter.sync(createSnapshot());
		expect(paramsRef.current.line1.algo).toBe("saw");
	});

	it("sync postsMessage with correct type and params when workletNode is available", () => {
		const adapter = createWorkletSynthEngineAdapter({
			workletNodeRef: workletNodeRef as AdapterArgs["workletNodeRef"],
			paramsRef,
		});
		const snapshot = createSnapshot();
		adapter.sync(snapshot);
		expect(postMessage).toHaveBeenCalledTimes(1);
		expect(postMessage).toHaveBeenCalledWith({
			type: "setParams",
			params: expect.objectContaining({
				line1: expect.objectContaining({
					algo: "saw",
					synthesisMethod: "pd",
				}),
				line2: expect.objectContaining({
					algo: "square",
					synthesisMethod: "pd",
				}),
			}),
		});
	});

	it("sync deduplicates: calling with same params does not postMessage again", () => {
		const adapter = createWorkletSynthEngineAdapter({
			workletNodeRef: workletNodeRef as AdapterArgs["workletNodeRef"],
			paramsRef,
		});
		const snapshot = createSnapshot();
		adapter.sync(snapshot);
		adapter.sync(snapshot);
		expect(postMessage).toHaveBeenCalledTimes(1);
	});

	it("sync postsMessage again when params change", () => {
		const adapter = createWorkletSynthEngineAdapter({
			workletNodeRef: workletNodeRef as AdapterArgs["workletNodeRef"],
			paramsRef,
		});
		const snapshot1 = createSnapshot({ volume: 0.5 });
		const snapshot2 = createSnapshot({ volume: 0.8 });
		adapter.sync(snapshot1);
		adapter.sync(snapshot2);
		expect(postMessage).toHaveBeenCalledTimes(2);
	});

	it("uses resolveAlgoRef windowType when available, overriding line window", () => {
		vi.mocked(resolveAlgoRef)
			.mockReset()
			.mockReturnValueOnce({
				waveform: "saw",
				warpAlgo: "saw",
				windowType: "triangle",
				isFrontPanelCzAlgo: false,
			})
			.mockReturnValueOnce({
				waveform: "square",
				warpAlgo: "saw",
				windowType: "pulse",
				isFrontPanelCzAlgo: false,
			});

		const adapter = createWorkletSynthEngineAdapter({
			workletNodeRef: workletNodeRef as AdapterArgs["workletNodeRef"],
			paramsRef,
		});
		adapter.sync(createSnapshot());
		expect(paramsRef.current.line1.window).toBe("triangle");
		expect(paramsRef.current.line2.window).toBe("pulse");
	});
});
