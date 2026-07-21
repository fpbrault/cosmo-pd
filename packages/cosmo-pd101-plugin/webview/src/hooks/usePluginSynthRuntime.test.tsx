import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { usePluginSynthRuntime } from "./usePluginSynthRuntime";

vi.mock("@cosmo/cosmo-pd101", () => ({
	useNoteHandling: () => ({
		activeNotes: [],
		pitchBend: 0,
		modWheel: 0,
		sendNoteOn: vi.fn(),
		sendNoteOff: vi.fn(),
		sendPitchBend: vi.fn(),
		sendModWheel: vi.fn(),
		sendPolyAftertouch: vi.fn(),
		panic: vi.fn(),
	}),
	useSynthStore: (selector: (state: { velocityCurve: string }) => unknown) =>
		selector({ velocityCurve: "linear" }),
	useSynthUiStore: (selector: (state: { keyboardRange: number }) => unknown) =>
		selector({ keyboardRange: 0 }),
}));

afterEach(() => {
	window.__czOnScope = undefined;
});

describe("usePluginSynthRuntime scope subscriptions", () => {
	it("keeps polling active while the drawer subscription hands off to the mini scope", () => {
		const { result } = renderHook(() =>
			usePluginSynthRuntime({ eventSink: vi.fn() }),
		);
		const drawerOnFrame = vi.fn();
		const miniOnFrame = vi.fn();

		const unsubscribeDrawer =
			result.current.subscribeScopeFrames?.(drawerOnFrame);
		const bridgeHandler = window.__czOnScope;
		const unsubscribeMini = result.current.subscribeScopeFrames?.(miniOnFrame);

		expect(bridgeHandler).toBeTypeOf("function");
		expect(window.__czOnScope).toBe(bridgeHandler);

		unsubscribeDrawer?.();
		expect(window.__czOnScope).toBe(bridgeHandler);

		act(() => {
			window.__czOnScope?.([0.25, -0.5], 48_000, 330);
		});

		expect(drawerOnFrame).not.toHaveBeenCalled();
		expect(miniOnFrame).toHaveBeenCalledWith({
			samples: new Float32Array([0.25, -0.5]),
			sampleRate: 48_000,
			hz: 330,
		});
		expect(result.current.effectivePitchHz).toBe(330);

		unsubscribeMini?.();
		expect(window.__czOnScope).toBeUndefined();
	});
});
