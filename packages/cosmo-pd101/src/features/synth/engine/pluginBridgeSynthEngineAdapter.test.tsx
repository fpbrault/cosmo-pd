import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useSynthStore } from "@/features/synth/synthStore";
import type { SynthPresetV1 } from "@/lib/synth/bindings/synth";
import { usePluginBridgeSynthEngine } from "./pluginBridgeSynthEngineAdapter";

/** Build a minimal valid SynthPresetV1 params shape with optional volume override. */
function makeParams(volume = 1.0) {
	const params = useSynthStore.getState().gatherState().params;
	return { ...params, volume } satisfies SynthPresetV1["params"];
}

function captureSetParams(outboundJsons: string[]) {
	window.__czSetParams = async (params) => {
		outboundJsons.push(JSON.stringify(params));
		return null;
	};
}

describe("usePluginBridgeSynthEngine", () => {
	beforeEach(() => {
		useSynthStore.setState(useSynthStore.getInitialState());
		window.__czOnParams = undefined;
		window.__czGetParams = undefined;
		window.__czGetParamsVersion = undefined;
		window.__czSetParams = undefined;
	});

	afterEach(() => {
		vi.useRealTimers();
		window.__czOnParams = undefined;
		window.__czGetParams = undefined;
		window.__czGetParamsVersion = undefined;
		window.__czSetParams = undefined;
	});

	it("does not push default params before hydration completes", async () => {
		let currentHandler: ((json: string) => void) | undefined;
		Object.defineProperty(window, "__czOnParams", {
			configurable: true,
			get: () => currentHandler,
			set: (handler: ((json: string) => void) | undefined) => {
				currentHandler = handler;
			},
		});

		const outboundJsons: string[] = [];
		captureSetParams(outboundJsons);

		const { unmount } = renderHook(() => usePluginBridgeSynthEngine());

		await waitFor(() => {
			expect(typeof currentHandler).toBe("function");
		});

		// No outbound before hydration
		expect(outboundJsons).toHaveLength(0);

		// Hydrate
		act(() => {
			currentHandler?.(JSON.stringify(makeParams(0.31)));
		});

		await waitFor(() => {
			expect(useSynthStore.getState().volume).toBeCloseTo(0.31, 6);
		});

		unmount();
	});

	it("sends full params JSON outbound after hydration via __czOnParams", async () => {
		let currentHandler: ((json: string) => void) | undefined;
		Object.defineProperty(window, "__czOnParams", {
			configurable: true,
			get: () => currentHandler,
			set: (handler: ((json: string) => void) | undefined) => {
				currentHandler = handler;
			},
		});

		const outboundJsons: string[] = [];
		captureSetParams(outboundJsons);

		const { unmount } = renderHook(() => usePluginBridgeSynthEngine());

		await waitFor(() => {
			expect(typeof currentHandler).toBe("function");
		});

		// Hydrate via __czOnParams
		act(() => {
			currentHandler?.(JSON.stringify(makeParams(0.55)));
		});

		await waitFor(() => {
			expect(useSynthStore.getState().volume).toBeCloseTo(0.55, 6);
		});

		// Next store change should trigger an outbound send
		act(() => {
			useSynthStore.setState({ volume: 0.7 });
		});

		await waitFor(() => {
			expect(outboundJsons.length).toBeGreaterThan(0);
		});

		const lastJson = outboundJsons[outboundJsons.length - 1] ?? "{}";
		const last = JSON.parse(lastJson) as Record<string, unknown>;
		expect(last).toHaveProperty("volume");

		unmount();
	});

	it("hydrates from __czGetParams on mount", async () => {
		const validParams = makeParams(0.88);
		window.__czGetParams = vi.fn().mockResolvedValue(validParams);

		const outboundJsons: string[] = [];
		captureSetParams(outboundJsons);

		const { unmount } = renderHook(() => usePluginBridgeSynthEngine());

		await waitFor(() => {
			expect(useSynthStore.getState().volume).toBeCloseTo(0.88, 6);
		});

		expect(window.__czGetParams).toHaveBeenCalledOnce();

		unmount();
	});

	it("hydrates pushed host-side param changes without polling or echoing outbound", async () => {
		const hostParams = makeParams(0.42);
		window.__czGetParams = vi.fn(async () => hostParams);
		const onExternalParamChange = vi.fn();

		const outboundJsons: string[] = [];
		captureSetParams(outboundJsons);

		const { unmount } = renderHook(() =>
			usePluginBridgeSynthEngine({ onExternalParamChange }),
		);

		await waitFor(() => {
			expect(useSynthStore.getState().volume).toBeCloseTo(0.42, 6);
		});
		expect(outboundJsons).toHaveLength(0);

		act(() => {
			window.__czOnParams?.(JSON.stringify(makeParams(0.73)));
		});

		await waitFor(() => {
			expect(useSynthStore.getState().volume).toBeCloseTo(0.73, 6);
		});
		expect(outboundJsons).toHaveLength(0);
		expect(window.__czGetParamsVersion).toBeUndefined();
		expect(onExternalParamChange).toHaveBeenCalledOnce();

		unmount();
	});

	it("converts host raw envelope values to UI range only", async () => {
		const rawParams = makeParams(0.62);
		rawParams.line1.dcoEnv.steps[0] = {
			...rawParams.line1.dcoEnv.steps[0],
			rate: 127,
		};
		rawParams.line1.dcaEnv.steps[0] = {
			...rawParams.line1.dcaEnv.steps[0],
			level: 127,
		};

		window.__czGetParams = vi.fn().mockResolvedValue(rawParams);

		const outboundJsons: string[] = [];
		captureSetParams(outboundJsons);

		const { unmount } = renderHook(() => usePluginBridgeSynthEngine());

		await waitFor(() => {
			expect(useSynthStore.getState().line1DcoEnv.steps[0]?.rate).toBe(99);
			expect(useSynthStore.getState().line1DcaEnv.steps[0]?.level).toBe(99);
		});

		await waitFor(() => {
			expect(outboundJsons.length).toBeGreaterThan(0);
		});

		const firstOutbound = JSON.parse(outboundJsons[0] ?? "{}") as {
			line1?: {
				dcoEnv?: { steps?: Array<{ rate?: number }> };
				dcaEnv?: { steps?: Array<{ level?: number }> };
			};
		};

		expect(firstOutbound.line1?.dcoEnv?.steps?.[0]?.rate).toBe(99);
		expect(firstOutbound.line1?.dcaEnv?.steps?.[0]?.level).toBe(99);

		unmount();
	});

	it("enables outbound immediately when __czGetParams is absent", async () => {
		window.__czGetParams = undefined;

		const outboundJsons: string[] = [];
		captureSetParams(outboundJsons);

		renderHook(() => usePluginBridgeSynthEngine());

		// Trigger a store change
		act(() => {
			useSynthStore.setState({ volume: 0.3 });
		});

		await waitFor(() => {
			expect(outboundJsons.length).toBeGreaterThan(0);
		});
	});

	it("sanitizes delay FX params before outbound setParams", async () => {
		window.__czGetParams = undefined;

		const outboundJsons: string[] = [];
		captureSetParams(outboundJsons);

		renderHook(() => usePluginBridgeSynthEngine());

		act(() => {
			const store = useSynthStore.getState();
			store.setFxSlotType(0, "delay");
			store.setFxSlotParams(0, {
				tapeMode: 1,
				timeMode: "sync",
				syncDivision: "eighthTriplet",
			});
		});

		await waitFor(() => {
			expect(outboundJsons.length).toBeGreaterThan(0);
		});

		const lastOutbound = JSON.parse(outboundJsons.at(-1) ?? "{}") as {
			fxSlots?: Array<{ type: string; params: Record<string, unknown> }>;
		};
		const delaySlot = lastOutbound.fxSlots?.[0];
		expect(delaySlot?.type).toBe("delay");
		expect(delaySlot?.params.tapeMode).toBe(true);
		expect(typeof delaySlot?.params.tapeMode).toBe("boolean");
		expect(delaySlot?.params.timeMode).toBe("sync");
		expect(delaySlot?.params.syncDivision).toBe("eighthTriplet");
	});

	it("does nothing when disabled", async () => {
		let registered = false;
		Object.defineProperty(window, "__czOnParams", {
			configurable: true,
			set: () => {
				registered = true;
			},
		});

		const called: string[] = [];
		captureSetParams(called);
		window.__czGetParams = vi.fn().mockResolvedValue({});

		renderHook(() => usePluginBridgeSynthEngine({ enabled: false }));

		// Give effects time to run
		await new Promise((r) => setTimeout(r, 20));

		expect(registered).toBe(false);
		expect(window.__czGetParams).not.toHaveBeenCalled();
		expect(called).toHaveLength(0);
	});

	it("maps native loadedPresetId into activePresetId and writes it back on persist", async () => {
		window.__czGetPresetSession = vi.fn().mockResolvedValue({
			loadedPresetId: "preset-42",
			activePresetNameBase: "Bliss",
			isDirty: false,
		});
		window.__czSetPresetSession = vi.fn().mockResolvedValue(undefined);

		const { result } = renderHook(() => usePluginBridgeSynthEngine());

		await expect(result.current.getPresetSession()).resolves.toEqual({
			activePresetId: "preset-42",
			loadedPresetId: "preset-42",
			activePresetNameBase: "Bliss",
			isDirty: false,
		});

		await result.current.setPresetSession({
			activePresetId: "preset-99",
			activePresetNameBase: "Restored",
			isDirty: true,
		});

		expect(window.__czSetPresetSession).toHaveBeenCalledWith({
			loadedPresetId: "preset-99",
			activePresetNameBase: "Restored",
			isDirty: true,
		});
	});
});
