import { renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { attachResumeOnUserGesture, resumeOrDefer, useAudioEngine } from "./useAudioEngine";

type MockContext = {
	state: AudioContextState;
	resume: () => Promise<void>;
};

describe("attachResumeOnUserGesture", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("resumes context and removes listeners after first successful gesture", async () => {
		const ctx: MockContext = {
			state: "suspended",
			resume: vi.fn(async () => {
				ctx.state = "running";
			}),
		};

		attachResumeOnUserGesture(ctx);

		window.dispatchEvent(new Event("pointerdown"));
		await Promise.resolve();

		expect(ctx.resume).toHaveBeenCalledTimes(1);

		window.dispatchEvent(new Event("pointerdown"));
		await Promise.resolve();

		expect(ctx.resume).toHaveBeenCalledTimes(1);
	});

	it("stops listening when cleanup is called", async () => {
		const ctx: MockContext = {
			state: "suspended",
			resume: vi.fn(async () => {
				ctx.state = "running";
			}),
		};

		const cleanup = attachResumeOnUserGesture(ctx);
		cleanup();

		window.dispatchEvent(new Event("pointerdown"));
		await Promise.resolve();

		expect(ctx.resume).not.toHaveBeenCalled();
	});
});

describe("resumeOrDefer", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	// Regression test for the silent autoplay block scenario:
	// browsers (Chrome/Firefox) under autoplay restrictions resolve resume()
	// without throwing, but leave the AudioContext in "suspended" state.
	// The previous fix only attached gesture listeners in the catch block and
	// therefore missed this common browser behaviour entirely.
	it("attaches gesture listeners when resume resolves but context stays suspended (silent autoplay block)", async () => {
		const ctx: MockContext = {
			state: "suspended",
			resume: vi.fn(async () => {
				// resolves without error but does NOT change state — real browser behaviour
			}),
		};

		const addEventListenerSpy = vi.spyOn(window, "addEventListener");

		const cleanup = await resumeOrDefer(ctx);

		expect(ctx.resume).toHaveBeenCalledTimes(1);
		// Gesture listeners must be attached so the engine can recover
		expect(addEventListenerSpy).toHaveBeenCalled();
		expect(cleanup).not.toBeNull();

		cleanup?.();
	});

	it("returns null and does not attach listeners when context resumes successfully", async () => {
		const ctx: MockContext = {
			state: "suspended",
			resume: vi.fn(async () => {
				ctx.state = "running";
			}),
		};

		const addEventListenerSpy = vi.spyOn(window, "addEventListener");

		const cleanup = await resumeOrDefer(ctx);

		expect(cleanup).toBeNull();
		expect(addEventListenerSpy).not.toHaveBeenCalled();
	});

	it("returns null when context is already running", async () => {
		const ctx: MockContext = {
			state: "running",
			resume: vi.fn(),
		};

		const cleanup = await resumeOrDefer(ctx);

		expect(ctx.resume).not.toHaveBeenCalled();
		expect(cleanup).toBeNull();
	});

	it("attaches gesture listeners when resume throws a NotAllowedError (explicit autoplay rejection)", async () => {
		const ctx: MockContext = {
			state: "suspended",
			resume: vi.fn(async () => {
				throw new DOMException("play() failed because the user didn't interact", "NotAllowedError");
			}),
		};

		const addEventListenerSpy = vi.spyOn(window, "addEventListener");

		const cleanup = await resumeOrDefer(ctx);

		expect(cleanup).not.toBeNull();
		expect(addEventListenerSpy).toHaveBeenCalled();

		cleanup?.();
	});

	it("re-throws non-autoplay errors and does not attach listeners", async () => {
		const ctx: MockContext = {
			state: "suspended",
			resume: vi.fn(async () => {
				throw new Error("Hardware failure");
			}),
		};

		const addEventListenerSpy = vi.spyOn(window, "addEventListener");

		await expect(resumeOrDefer(ctx)).rejects.toThrow("Hardware failure");
		expect(addEventListenerSpy).not.toHaveBeenCalled();
	});

	it("resolves suspended context on first gesture after silent block", async () => {
		const ctx: MockContext = {
			state: "suspended",
			// First call: resolves silently (autoplay blocked); second call: succeeds
			resume: vi
				.fn()
				.mockResolvedValueOnce(undefined)
				.mockImplementationOnce(async () => {
					ctx.state = "running";
				}),
		};

		const cleanup = await resumeOrDefer(ctx);
		expect(cleanup).not.toBeNull();

		// Simulate user gesture
		window.dispatchEvent(new Event("pointerdown"));
		await Promise.resolve();
		await Promise.resolve(); // flush the .then() chain

		expect(ctx.resume).toHaveBeenCalledTimes(2);
		expect(ctx.state).toBe("running");
	});
});

// ─── Integration regression test ────────────────────────────────────────────
//
// This test exercises useAudioEngine end-to-end with a silently-blocked
// AudioContext (the real browser behaviour under autoplay restrictions).
// It verifies that gesture listeners are attached after init(), something the
// OLD inline try/catch never did because browsers don't throw — they just
// resolve resume() while keeping the context suspended.
//
// To confirm this is a true regression test: replace the `resumeOrDefer` call
// in init() with the old logic and this test will fail.
describe("useAudioEngine — silent autoplay block regression", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("attaches gesture-resume listeners when AudioContext stays suspended after init (silent autoplay block)", async () => {
		// --- Mock AudioContext: resume resolves silently, state stays suspended ---
		const mockResume = vi.fn(async () => {
			/* resolves without changing state */
		});
		const mockClose = vi.fn(async () => {});
		const mockAddModule = vi.fn(async () => {});
		const mockConnect = vi.fn();
		const mockDisconnect = vi.fn();
		const mockPostMessage = vi.fn();

		const mockAudioContext = {
			state: "suspended" as AudioContextState,
			resume: mockResume,
			close: mockClose,
			audioWorklet: { addModule: mockAddModule },
			createGain: vi.fn(() => ({
				gain: { value: 1 },
				connect: mockConnect,
				disconnect: mockDisconnect,
			})),
			destination: {},
		};

		vi.stubGlobal(
			"AudioContext",
			class {
				state = mockAudioContext.state;
				resume = mockAudioContext.resume;
				close = mockAudioContext.close;
				audioWorklet = mockAudioContext.audioWorklet;
				createGain = mockAudioContext.createGain;
				destination = mockAudioContext.destination;
			},
		);

		// Mock AudioWorkletNode — simulate the worklet sending "ready"
		const mockPort = {
			onmessage: null as ((e: MessageEvent) => void) | null,
			postMessage: mockPostMessage,
		};
		vi.stubGlobal(
			"AudioWorkletNode",
			class {
				port = mockPort;
				connect = mockConnect;
				disconnect = mockDisconnect;
			},
		);

		vi.stubGlobal(
			"AnalyserNode",
			class {
				connect = mockConnect;
				disconnect = mockDisconnect;
			},
		);

		// Mock fetch for WASM and bindings
		vi.spyOn(globalThis, "fetch").mockResolvedValue({
			ok: true,
			arrayBuffer: async () => new ArrayBuffer(8),
			text: async () => "",
		} as unknown as Response);

		const consoleErrorSpy = vi
			.spyOn(console, "error")
			.mockImplementation(() => {});
		const addEventListenerSpy = vi.spyOn(window, "addEventListener");

		renderHook(() =>
			useAudioEngine({
				synthWasmUrl: "/fake.wasm",
				synthBindingsUrl: "/fake.js",
				pdVisualizerWorkletUrl: "/fake-worklet.js",
			}),
		);

		// Let init() run through the full async chain
		await vi.waitFor(
			() => {
				const initFailed = consoleErrorSpy.mock.calls.some(([msg]) =>
					String(msg).includes("Audio init failed"),
				);
				if (initFailed) {
					const err = consoleErrorSpy.mock.calls.find(([msg]) =>
						String(msg).includes("Audio init failed"),
					);
					throw new Error(`init() failed: ${String(err?.[1])}`);
				}
				expect(mockResume).toHaveBeenCalled();
			},
			{ timeout: 3000 },
		);
		// Give the post-resume .then() time to run
		await Promise.resolve();
		await Promise.resolve();

		// Gesture listeners MUST be attached — this is the regression assertion.
		// The old code only attached them inside catch(), which browsers never reach.
		const gestureEvents = ["pointerdown", "mousedown", "touchstart", "keydown"];
		const attachedEvents = addEventListenerSpy.mock.calls.map(([event]) => event);
		const gestureListenersAttached = gestureEvents.some((e) =>
			attachedEvents.includes(e),
		);
		expect(
			gestureListenersAttached,
			"Expected gesture-resume listeners to be attached after silent autoplay block",
		).toBe(true);
	});
});
