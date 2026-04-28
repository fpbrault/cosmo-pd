import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useSynthStore } from "@/features/synth/synthStore";
import { usePluginBridgeSynthEngine } from "./pluginBridgeSynthEngineAdapter";

type IpcMessage =
	| { param_id: string; value: number }
	| { envelope_id: string; data: unknown }
	| { algo_controls: unknown }
	| { mod_matrix: unknown };

describe("usePluginBridgeSynthEngine", () => {
	beforeEach(() => {
		useSynthStore.setState(useSynthStore.getInitialState());
		window.ipc = undefined as unknown as typeof window.ipc;
		delete window.__czOnParams;
		window.__czGetEnvelopes = undefined;
		window.__czGetAlgoControls = undefined;
		window.__czGetModMatrix = undefined;
	});

	afterEach(() => {
		vi.useRealTimers();
		window.ipc = undefined as unknown as typeof window.ipc;
		delete window.__czOnParams;
		window.__czGetEnvelopes = undefined;
		window.__czGetAlgoControls = undefined;
		window.__czGetModMatrix = undefined;
	});

	it("does not push default params before host replay on mount", async () => {
		const hostVolume = 0.31;
		let currentHandler: ((json: string) => void) | undefined;
		Object.defineProperty(window, "__czOnParams", {
			configurable: true,
			get: () => currentHandler,
			set: (handler: ((json: string) => void) | undefined) => {
				currentHandler = handler;
			},
		});

		const outbound: IpcMessage[] = [];
		window.ipc = {
			postMessage(message: string) {
				outbound.push(JSON.parse(message) as IpcMessage);
			},
		};

		const { unmount } = renderHook(() => usePluginBridgeSynthEngine());

		await waitFor(() => {
			expect(typeof currentHandler).toBe("function");
		});

		act(() => {
			currentHandler?.(JSON.stringify({ volume: hostVolume }));
		});

		await waitFor(() => {
			expect(useSynthStore.getState().volume).toBeCloseTo(hostVolume, 6);
		});

		const volumeSends = outbound.filter(
			(message): message is { param_id: string; value: number } =>
				"param_id" in message && message.param_id === "volume",
		);
		expect(volumeSends.some((message) => message.value === 1)).toBe(false);
		if (volumeSends.length > 0) {
			expect(volumeSends[0]?.value).toBeCloseTo(hostVolume, 6);
		}

		unmount();
	});

	it("blocks outbound sync until inbound params are applied", async () => {
		vi.useFakeTimers();

		const hostVolume = 0.27;
		let currentHandler: ((json: string) => void) | undefined;
		Object.defineProperty(window, "__czOnParams", {
			configurable: true,
			get: () => currentHandler,
			set: (handler: ((json: string) => void) | undefined) => {
				currentHandler = handler;
			},
		});

		const outbound: IpcMessage[] = [];
		window.ipc = {
			postMessage(message: string) {
				outbound.push(JSON.parse(message) as IpcMessage);
			},
		};

		const { unmount } = renderHook(() =>
			usePluginBridgeSynthEngine({ hydrationGraceMs: 5_000 }),
		);

		act(() => {
			vi.advanceTimersByTime(0);
		});

		expect(typeof currentHandler).toBe("function");

		act(() => {
			useSynthStore.getState().setVolume(0.91);
		});

		expect(
			outbound.some(
				(message) => "param_id" in message && message.param_id === "volume",
			),
		).toBe(false);

		act(() => {
			currentHandler?.(JSON.stringify({ volume: hostVolume }));
		});

		expect(useSynthStore.getState().volume).toBeCloseTo(hostVolume, 6);

		const postHydrationVolume = 0.63;
		act(() => {
			useSynthStore.getState().setVolume(postHydrationVolume);
		});

		expect(
			outbound.some(
				(message) =>
					"param_id" in message &&
					message.param_id === "volume" &&
					Math.abs(message.value - postHydrationVolume) < 1e-6,
			),
		).toBe(true);

		expect(
			outbound.some(
				(message) =>
					"param_id" in message &&
					message.param_id === "volume" &&
					Math.abs(message.value - 0.91) < 1e-6,
			),
		).toBe(false);

		unmount();
	});

	it("waits for envelope hydration before outbound sync", async () => {
		const hostVolume = 0.41;
		const hostEnv = structuredClone(useSynthStore.getState().line1DcoEnv);

		let resolveEnvelopes: ((value: unknown) => void) | null = null;
		window.__czGetEnvelopes = () =>
			new Promise((resolve) => {
				resolveEnvelopes = resolve;
			});
		window.__czGetAlgoControls = async () => ({
			line1: { a: [], b: [] },
			line2: { a: [], b: [] },
		});
		window.__czGetModMatrix = async () => ({ routes: [] });

		let currentHandler: ((json: string) => void) | undefined;
		Object.defineProperty(window, "__czOnParams", {
			configurable: true,
			get: () => currentHandler,
			set: (handler: ((json: string) => void) | undefined) => {
				currentHandler = handler;
			},
		});

		const outbound: IpcMessage[] = [];
		window.ipc = {
			postMessage(message: string) {
				outbound.push(JSON.parse(message) as IpcMessage);
			},
		};

		const { unmount } = renderHook(() => usePluginBridgeSynthEngine());

		await waitFor(() => {
			expect(typeof currentHandler).toBe("function");
		});

		act(() => {
			currentHandler?.(JSON.stringify({ volume: hostVolume }));
		});

		expect(outbound.some((message) => "envelope_id" in message)).toBe(false);

		resolveEnvelopes?.({ l1_dco: hostEnv });

		await waitFor(() => {
			expect(
				outbound.some(
					(message) =>
						"envelope_id" in message && message.envelope_id === "l1_dco",
				),
			).toBe(true);
		});

		const firstL1DcoSend = outbound.find(
			(message): message is { envelope_id: string; data: unknown } =>
				"envelope_id" in message && message.envelope_id === "l1_dco",
		);
		expect(firstL1DcoSend?.data).toEqual(hostEnv);

		unmount();
	});

	it("still performs an initial outbound sync when host has no replay", async () => {
		vi.useFakeTimers();
		window.__czOnParams = undefined;
		const outbound: IpcMessage[] = [];
		window.ipc = {
			postMessage(message: string) {
				outbound.push(JSON.parse(message) as IpcMessage);
			},
		};

		const { unmount } = renderHook(() =>
			usePluginBridgeSynthEngine({ hydrationGraceMs: 10 }),
		);

		act(() => {
			vi.advanceTimersByTime(11);
		});

		expect(
			outbound.some(
				(message) => "param_id" in message && message.param_id === "volume",
			),
		).toBe(true);

		unmount();
	});
});
