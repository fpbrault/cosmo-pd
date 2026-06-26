import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useAudioEngine } from "./useAudioEngine";

function createGainNodeMock() {
	return {
		gain: { value: 1 },
		connect: vi.fn(),
		disconnect: vi.fn(),
	};
}

function createAnalyserNodeMock() {
	return {
		connect: vi.fn(),
		disconnect: vi.fn(),
	};
}

type MockWorkletNode = {
	port: {
		postMessage: ReturnType<typeof vi.fn>;
		onmessage: ((e: { data: Record<string, unknown> }) => void) | null;
	};
	connect: ReturnType<typeof vi.fn>;
	disconnect: ReturnType<typeof vi.fn>;
};

describe("useAudioEngine", () => {
	let mocks: {
		mockCtx: {
			state: string;
			audioWorklet: { addModule: ReturnType<typeof vi.fn> };
			createGain: ReturnType<typeof vi.fn>;
			close: ReturnType<typeof vi.fn>;
			resume: ReturnType<typeof vi.fn>;
			addEventListener: ReturnType<typeof vi.fn>;
			destination: Record<string, never>;
		};
		mockWorkletNode: MockWorkletNode;
		AudioContextMock: ReturnType<typeof vi.fn>;
		AudioWorkletNodeMock: ReturnType<typeof vi.fn>;
		AnalyserNodeMock: ReturnType<typeof vi.fn>;
		fetchMock: ReturnType<typeof vi.fn>;
		stateChangeHandler: (() => void) | null;
		setIntervalSpy: ReturnType<typeof vi.spyOn>;
		clearIntervalSpy: ReturnType<typeof vi.spyOn>;
		consoleErrorSpy: ReturnType<typeof vi.spyOn>;
	};

	function setupMocks() {
		const mockCtx = {
			state: "suspended",
			audioWorklet: { addModule: vi.fn().mockResolvedValue(undefined) },
			createGain: vi.fn().mockReturnValue(createGainNodeMock()),
			close: vi.fn().mockResolvedValue(undefined),
			resume: vi.fn().mockResolvedValue(undefined),
			addEventListener: vi.fn((_event: string, handler: () => void) => {
				if (_event === "statechange") {
					mocks.stateChangeHandler = handler;
				}
			}),
			destination: {},
		};

		const mockWorkletNode: MockWorkletNode = {
			port: {
				postMessage: vi.fn(),
				onmessage: null,
			},
			connect: vi.fn(),
			disconnect: vi.fn(),
		};

		// biome-ignore lint/complexity/useArrowFunction: Mock must be `new`-constructable.
		const AudioContextMock = vi.fn().mockImplementation(function () {
			return mockCtx;
		});
		// biome-ignore lint/complexity/useArrowFunction: Mock must be `new`-constructable.
		const AudioWorkletNodeMock = vi.fn().mockImplementation(function () {
			return mockWorkletNode;
		});
		// biome-ignore lint/complexity/useArrowFunction: Mock must be `new`-constructable.
		const AnalyserNodeMock = vi.fn().mockImplementation(function () {
			return createAnalyserNodeMock();
		});
		const fetchMock = vi.fn().mockImplementation(() =>
			Promise.resolve({
				ok: true,
				status: 200,
				arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
				text: () => Promise.resolve(""),
			}),
		);

		vi.stubGlobal("AudioContext", AudioContextMock);
		vi.stubGlobal("AudioWorkletNode", AudioWorkletNodeMock);
		vi.stubGlobal("AnalyserNode", AnalyserNodeMock);
		vi.stubGlobal("fetch", fetchMock);

		const setIntervalSpy = vi.spyOn(window, "setInterval").mockReturnValue(42);
		const clearIntervalSpy = vi.spyOn(window, "clearInterval");
		const consoleErrorSpy = vi.spyOn(console, "error");

		return {
			mockCtx,
			mockWorkletNode,
			AudioContextMock,
			AudioWorkletNodeMock,
			AnalyserNodeMock,
			fetchMock,
			stateChangeHandler: null as (() => void) | null,
			setIntervalSpy,
			clearIntervalSpy,
			consoleErrorSpy,
		};
	}

	beforeEach(() => {
		mocks = setupMocks();
	});

	afterEach(() => {
		vi.restoreAllMocks();
		vi.unstubAllGlobals();
	});

	const defaultProps = {
		synthWasmUrl: "/wasm/synth.wasm",
		synthBindingsUrl: "/wasm/synth.js",
		cosmoWorkletUrl: "/worklet/processor.js",
	};

	function renderUseAudioEngine() {
		return renderHook(() => useAudioEngine(defaultProps), {
			reactStrictMode: false,
		});
	}

	async function startAudio(
		result: ReturnType<typeof renderUseAudioEngine>["result"],
	) {
		act(() => {
			result.current.resumeAudio();
		});

		await waitFor(() => {
			expect(mocks.AudioContextMock).toHaveBeenCalled();
		});
	}

	async function waitForWorkletInit() {
		await waitFor(
			() => {
				expect(mocks.AudioWorkletNodeMock).toHaveBeenCalled();
			},
			{ timeout: 5000 },
		);
	}

	describe("initial render", () => {
		it("returns expected API shape", () => {
			const { result } = renderUseAudioEngine();

			expect(result.current).toHaveProperty("audioCtxRef");
			expect(result.current).toHaveProperty("gainNodeRef");
			expect(result.current).toHaveProperty("analyserNodeRef");
			expect(result.current).toHaveProperty("workletNodeRef");
			expect(result.current).toHaveProperty("paramsRef");
			expect(result.current).toHaveProperty("audioContextState");
			expect(result.current).toHaveProperty("resumeAudio");
		});

		it("initializes refs appropriately", async () => {
			const { result } = renderUseAudioEngine();

			expect(result.current.audioCtxRef.current).toBeNull();
			expect(result.current.gainNodeRef.current).toBeNull();
			expect(result.current.analyserNodeRef.current).toBeNull();
			expect(result.current.workletNodeRef.current).toBeNull();
		});

		it("initializes paramsRef with default synth params", () => {
			const { result } = renderUseAudioEngine();

			expect(result.current.paramsRef.current).toBeDefined();
			expect(result.current.paramsRef.current.frequency).toBe(220);
			expect(result.current.paramsRef.current.volume).toBe(1);
		});

		it("sets audioContextState to null initially", () => {
			const { result } = renderUseAudioEngine();

			expect(result.current.audioContextState).toBeNull();
		});

		it("resumeAudio is a function", () => {
			const { result } = renderUseAudioEngine();

			expect(typeof result.current.resumeAudio).toBe("function");
		});
	});

	describe("audio initialization", () => {
		it("does not create AudioContext on mount", () => {
			renderUseAudioEngine();

			expect(mocks.AudioContextMock).not.toHaveBeenCalled();
		});

		it("creates and resumes AudioContext from resumeAudio", async () => {
			const { result } = renderUseAudioEngine();

			await startAudio(result);

			expect(mocks.AudioContextMock).toHaveBeenCalledTimes(1);
			expect(mocks.mockCtx.resume).toHaveBeenCalledTimes(1);
		});

		it("fetches WASM and bindings", async () => {
			const { result } = renderUseAudioEngine();

			await startAudio(result);

			await waitFor(() => {
				expect(mocks.fetchMock).toHaveBeenCalledWith(defaultProps.synthWasmUrl);
			});
			expect(mocks.fetchMock).toHaveBeenCalledWith(
				defaultProps.synthBindingsUrl,
			);
		});

		it("loads the AudioWorklet module", async () => {
			const { result } = renderUseAudioEngine();

			await startAudio(result);

			await waitFor(() => {
				expect(mocks.mockCtx.audioWorklet.addModule).toHaveBeenCalledWith(
					defaultProps.cosmoWorkletUrl,
				);
			});
		});

		it("creates AudioWorkletNode after module loads", async () => {
			const { result } = renderUseAudioEngine();

			await startAudio(result);

			await waitFor(() => {
				expect(mocks.AudioWorkletNodeMock).toHaveBeenCalledWith(
					mocks.mockCtx,
					"cosmo-processor",
				);
			});
		});

		it("creates gain and analyser nodes and connects audio graph", async () => {
			const { result } = renderUseAudioEngine();

			await startAudio(result);

			await waitFor(() => {
				expect(mocks.mockCtx.createGain).toHaveBeenCalledTimes(1);
				expect(mocks.AnalyserNodeMock).toHaveBeenCalledWith(mocks.mockCtx, {
					fftSize: 2048,
				});
			});
		});

		it("adds statechange listener on AudioContext", async () => {
			const { result } = renderUseAudioEngine();

			await startAudio(result);

			await waitFor(() => {
				expect(mocks.mockCtx.addEventListener).toHaveBeenCalledWith(
					"statechange",
					expect.any(Function),
				);
			});
		});

		it("only initializes once even with re-renders", async () => {
			const { result, rerender } = renderUseAudioEngine();

			await startAudio(result);

			rerender(defaultProps);

			expect(mocks.AudioContextMock).toHaveBeenCalledTimes(1);
		});
	});

	describe("message handling", () => {
		it("handles 'ready' message: starts telemetry and sends params", async () => {
			const { result } = renderUseAudioEngine();

			await startAudio(result);
			await waitForWorkletInit();

			act(() => {
				mocks.mockWorkletNode.port.onmessage?.({
					data: { type: "ready" },
				});
			});

			expect(mocks.setIntervalSpy).toHaveBeenCalledWith(
				expect.any(Function),
				33,
			);
			expect(mocks.mockWorkletNode.port.postMessage).toHaveBeenCalledWith({
				type: "setParams",
				params: expect.objectContaining({
					frequency: 220,
					volume: 1,
				}),
			});
		});

		it("handles 'error' message: logs worklet error", async () => {
			const { result } = renderUseAudioEngine();

			await startAudio(result);
			await waitForWorkletInit();

			act(() => {
				mocks.mockWorkletNode.port.onmessage?.({
					data: { type: "error", message: "WASM init failed" },
				});
			});

			expect(mocks.consoleErrorSpy).toHaveBeenCalledWith(
				"[CZ Synth WASM] Worklet error:",
				"WASM init failed",
			);
		});

		it("handles 'runtimeModSources' message: dispatches custom event", async () => {
			const dispatchSpy = vi.spyOn(window, "dispatchEvent");

			const { result } = renderUseAudioEngine();

			await startAudio(result);
			await waitForWorkletInit();

			const sources = {
				lfo1: 0.5,
				lfo2: 0.3,
				random: 0,
				modEnv: 0,
				velocity: 0.8,
				modWheel: 0,
				aftertouch: 0,
			};

			act(() => {
				mocks.mockWorkletNode.port.onmessage?.({
					data: { type: "runtimeModSources", sources },
				});
			});

			const event = dispatchSpy.mock.calls[0]?.[0] as CustomEvent | undefined;
			expect(event?.type).toBe("cz-runtime-mod-sources");
			expect(event?.detail).toEqual({
				...sources,
				macro1: 0,
				macro2: 0,
				macro3: 0,
				macro4: 0,
				pitchBend: 0,
			});
		});

		it("handles 'runtimeVoiceStates' message: dispatches custom event", async () => {
			const dispatchSpy = vi.spyOn(window, "dispatchEvent");

			const { result } = renderUseAudioEngine();

			await startAudio(result);
			await waitForWorkletInit();

			const voices = [
				{
					index: 0,
					active: true,
					isReleasing: false,
					sustained: false,
					note: 60,
					envNote: 60,
					velocity: 100,
					modEnv: {
						value: 0.4,
						phase: "release",
						releasing: true,
						releaseStart: 0.5,
					},
					line1: {
						dco: {
							value: 0.5,
							step: 0,
							releasing: false,
							stepPos: 0,
							prevLevel: 0,
						},
						dcw: {
							value: 0,
							step: 0,
							releasing: false,
							stepPos: 0,
							prevLevel: 0,
						},
						dca: {
							value: 0,
							step: 0,
							releasing: false,
							stepPos: 0,
							prevLevel: 0,
						},
					},
					line2: {
						dco: {
							value: 0,
							step: 0,
							releasing: false,
							stepPos: 0,
							prevLevel: 0,
						},
						dcw: {
							value: 0,
							step: 0,
							releasing: false,
							stepPos: 0,
							prevLevel: 0,
						},
						dca: {
							value: 0,
							step: 0,
							releasing: false,
							stepPos: 0,
							prevLevel: 0,
						},
					},
				},
			];

			act(() => {
				mocks.mockWorkletNode.port.onmessage?.({
					data: { type: "runtimeVoiceStates", voices },
				});
			});

			expect(dispatchSpy).toHaveBeenCalledWith(
				expect.objectContaining({
					type: "cz-runtime-voice-states",
					detail: voices,
				}),
			);
		});

		it("normalizes missing mod env telemetry on runtime voice states", async () => {
			const dispatchSpy = vi.spyOn(window, "dispatchEvent");

			const { result } = renderUseAudioEngine();

			await startAudio(result);
			await waitForWorkletInit();

			act(() => {
				mocks.mockWorkletNode.port.onmessage?.({
					data: {
						type: "runtimeVoiceStates",
						voices: [
							{
								index: 0,
								active: true,
								isReleasing: false,
								sustained: false,
								note: 60,
								envNote: 60,
								velocity: 1,
								line1: {},
								line2: {},
							},
						],
					},
				});
			});

			const event = dispatchSpy.mock.calls.find(
				([arg]) => (arg as CustomEvent).type === "cz-runtime-voice-states",
			)?.[0] as CustomEvent | undefined;
			expect(event?.detail[0].modEnv).toEqual({
				value: 0,
				phase: "idle",
				releasing: false,
				releaseStart: 0,
			});
		});

		it("handles 'performanceMetrics' message: dispatches custom event", async () => {
			const dispatchSpy = vi.spyOn(window, "dispatchEvent");

			const { result } = renderUseAudioEngine();

			await startAudio(result);
			await waitForWorkletInit();

			const metrics = {
				enabled: true,
				blockCount: 100,
				lastMs: 2.5,
				avgMs: 1.8,
				maxMs: 5.0,
				blockBudgetMs: 5.8,
				lastRtPercent: 43,
				avgRtPercent: 31,
				maxRtPercent: 86,
				blockSamples: 128,
				sampleRate: 48000,
				activeVoices: 4,
			};

			act(() => {
				mocks.mockWorkletNode.port.onmessage?.({
					data: { type: "performanceMetrics", metrics },
				});
			});

			expect(dispatchSpy).toHaveBeenCalledWith(
				expect.objectContaining({
					type: "cz-performance-metrics",
					detail: metrics,
				}),
			);
		});

		it("ignores messages with unknown type", async () => {
			const dispatchSpy = vi.spyOn(window, "dispatchEvent");

			const { result } = renderUseAudioEngine();

			await startAudio(result);
			await waitForWorkletInit();

			act(() => {
				mocks.mockWorkletNode.port.onmessage?.({
					data: { type: "unknown" },
				});
			});

			expect(dispatchSpy).not.toHaveBeenCalled();
		});
	});

	describe("cleanup on unmount", () => {
		it("closes AudioContext and disconnects nodes", async () => {
			const { result, unmount } = renderUseAudioEngine();

			await startAudio(result);

			unmount();

			await waitFor(() => {
				expect(mocks.mockCtx.close).toHaveBeenCalled();
			});
		});

		it("stops telemetry polling on unmount", async () => {
			const { result, unmount } = renderUseAudioEngine();

			await startAudio(result);

			act(() => {
				mocks.mockWorkletNode.port.onmessage?.({
					data: { type: "ready" },
				});
			});

			unmount();

			expect(mocks.clearIntervalSpy).toHaveBeenCalledWith(42);
		});

		it("resets audioInitRef on unmount", async () => {
			const { result, unmount } = renderUseAudioEngine();

			await startAudio(result);

			unmount();

			const { result: nextResult } = renderUseAudioEngine();
			await startAudio(nextResult);

			expect(mocks.AudioContextMock).toHaveBeenCalledTimes(2);
		});
	});

	describe("resumeAudio", () => {
		it("starts initialization when context has not been created", async () => {
			const { result } = renderUseAudioEngine();

			await startAudio(result);

			expect(result.current.audioCtxRef.current).toBe(mocks.mockCtx);
			expect(mocks.mockCtx.resume).toHaveBeenCalledTimes(1);
		});

		it("calls ctx.resume when existing context is suspended", async () => {
			const { result } = renderUseAudioEngine();

			await startAudio(result);
			mocks.mockCtx.resume.mockClear();

			act(() => {
				result.current.resumeAudio();
			});

			expect(mocks.mockCtx.resume).toHaveBeenCalledTimes(1);
		});

		it("syncs React state when context is already running", async () => {
			const { result } = renderUseAudioEngine();

			await startAudio(result);
			mocks.mockCtx.resume.mockClear();

			mocks.mockCtx.state = "running";

			act(() => {
				result.current.resumeAudio();
			});

			expect(mocks.mockCtx.resume).not.toHaveBeenCalled();

			await waitFor(() => {
				expect(result.current.audioContextState).toBe("running");
			});
		});

		it("starts initialization when audioCtxRef is null", async () => {
			const { result } = renderUseAudioEngine();

			await startAudio(result);

			expect(mocks.mockCtx.resume).toHaveBeenCalledTimes(1);
		});

		it("does nothing when existing context is closed", async () => {
			const { result } = renderUseAudioEngine();

			await startAudio(result);
			mocks.mockCtx.resume.mockClear();
			mocks.mockCtx.state = "closed";

			act(() => {
				result.current.resumeAudio();
			});

			expect(mocks.mockCtx.resume).not.toHaveBeenCalled();
		});
	});

	describe("audio context state changes", () => {
		it("updates audioContextState on statechange event", async () => {
			const { result } = renderUseAudioEngine();

			await startAudio(result);

			mocks.mockCtx.state = "running";
			act(() => {
				mocks.stateChangeHandler?.();
			});

			await waitFor(() => {
				expect(result.current.audioContextState).toBe("running");
			});
		});

		it("updates audioContextState to suspended on statechange", async () => {
			const { result } = renderUseAudioEngine();

			await startAudio(result);

			mocks.mockCtx.state = "suspended";
			act(() => {
				mocks.stateChangeHandler?.();
			});

			await waitFor(() => {
				expect(result.current.audioContextState).toBe("suspended");
			});
		});
	});

	describe("error handling", () => {
		it("handles AudioContext creation failure gracefully", async () => {
			// biome-ignore lint/complexity/useArrowFunction: Mock must be `new`-constructable.
			const FailingAudioContext = vi.fn().mockImplementation(function () {
				throw new Error("AudioContext not supported");
			});
			Object.defineProperty(globalThis, "AudioContext", {
				value: FailingAudioContext,
				writable: true,
				configurable: true,
			});

			const { result } = renderUseAudioEngine();

			await act(async () => {
				result.current.resumeAudio();
				await Promise.resolve();
			});

			expect(mocks.consoleErrorSpy).toHaveBeenCalledWith(
				"[Cosmo Engine] Audio init failed:",
				expect.objectContaining({
					message: "AudioContext not supported",
				}),
			);

			expect(result.current.audioCtxRef.current).toBeNull();
			expect(result.current.audioContextState).toBeNull();
		});

		it("handles fetch failure gracefully", async () => {
			const fetchFail = vi.fn().mockResolvedValue({
				ok: false,
				status: 404,
			});
			Object.defineProperty(globalThis, "fetch", {
				value: fetchFail,
				writable: true,
				configurable: true,
			});

			const { result } = renderUseAudioEngine();

			await startAudio(result);

			await waitFor(
				() => {
					expect(mocks.consoleErrorSpy).toHaveBeenCalledWith(
						"[Cosmo Engine] Audio init failed:",
						expect.any(Error),
					);
				},
				{ timeout: 5000 },
			);

			expect(mocks.mockCtx.close).toHaveBeenCalled();
		});

		it("handles AudioWorklet module loading failure gracefully", async () => {
			mocks.mockCtx.audioWorklet.addModule = vi
				.fn()
				.mockRejectedValue(new Error("Module not found"));

			const { result } = renderUseAudioEngine();

			await startAudio(result);

			await waitFor(
				() => {
					expect(mocks.consoleErrorSpy).toHaveBeenCalledWith(
						"[Cosmo Engine] Audio init failed:",
						expect.any(Error),
					);
				},
				{ timeout: 5000 },
			);

			expect(mocks.mockCtx.close).toHaveBeenCalled();
		});

		it("handles fetch rejection gracefully", async () => {
			const fetchReject = vi.fn().mockRejectedValue(new Error("Network error"));
			Object.defineProperty(globalThis, "fetch", {
				value: fetchReject,
				writable: true,
				configurable: true,
			});

			const { result } = renderUseAudioEngine();

			await startAudio(result);

			await waitFor(
				() => {
					expect(mocks.consoleErrorSpy).toHaveBeenCalledWith(
						"[Cosmo Engine] Audio init failed:",
						expect.any(Error),
					);
				},
				{ timeout: 5000 },
			);
		});
	});

	describe("disposal during init", () => {
		it("aborts init when unmounted before fetch completes", async () => {
			let resolveFetch: ((value: unknown) => void) | undefined;
			const fetchPromise = new Promise((resolve) => {
				resolveFetch = resolve;
			});
			const slowFetch = vi.fn().mockReturnValue(fetchPromise);
			Object.defineProperty(globalThis, "fetch", {
				value: slowFetch,
				writable: true,
				configurable: true,
			});

			const { result, unmount } = renderUseAudioEngine();

			await startAudio(result);
			unmount();

			if (!resolveFetch) {
				throw new Error("Expected resolveFetch to be assigned");
			}
			resolveFetch({
				ok: true,
				arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
				text: () => Promise.resolve(""),
			});

			await act(async () => {
				await fetchPromise;
			});

			expect(mocks.AudioWorkletNodeMock).not.toHaveBeenCalled();
		});

		it("aborts init when disposed after context creation but before worklet", async () => {
			let resolveModule: ((value: unknown) => void) | undefined;
			const modulePromise = new Promise((resolve) => {
				resolveModule = resolve;
			});
			mocks.mockCtx.audioWorklet.addModule = vi
				.fn()
				.mockReturnValue(modulePromise);

			const { result, unmount } = renderUseAudioEngine();

			await startAudio(result);

			await waitFor(() => {
				expect(mocks.fetchMock).toHaveBeenCalled();
			});

			unmount();
			if (!resolveModule) {
				throw new Error("Expected resolveModule to be assigned");
			}
			resolveModule(undefined);

			await act(async () => {
				await modulePromise;
			});

			expect(mocks.mockWorkletNode.disconnect).not.toHaveBeenCalled();
		});
	});
});
