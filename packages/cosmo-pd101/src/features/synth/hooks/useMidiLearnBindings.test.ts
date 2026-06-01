import { renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { registerMidiLearnTarget } from "../midiLearnRegistry";
import { useMidiLearnStore } from "../midiLearnStore";
import { useSynthStore } from "../synthStore";
import { useMidiLearnBindings } from "./useMidiLearnBindings";

describe("useMidiLearnBindings", () => {
	beforeEach(() => {
		useMidiLearnStore.setState({
			learnMode: false,
			bindings: [],
			pendingLearnParam: null,
		});
		(
			window as Window & {
				__czAddMidiBinding?: (key: string, channel: number, cc: number) => void;
			}
		).__czAddMidiBinding = undefined;
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("subscribes/unsubscribes midi cc event listener", () => {
		const addSpy = vi.spyOn(window, "addEventListener");
		const removeSpy = vi.spyOn(window, "removeEventListener");
		const { unmount } = renderHook(() => useMidiLearnBindings());
		expect(addSpy).toHaveBeenCalledWith("cz-midi-cc", expect.any(Function));
		unmount();
		expect(removeSpy).toHaveBeenCalledWith("cz-midi-cc", expect.any(Function));
	});

	it("applies bindings when learn mode is enabled (routing delegated to Rust)", () => {
		useMidiLearnStore.getState().setLearnMode(true);
		useMidiLearnStore.setState({
			bindings: [{ paramKey: "volume", channel: 1, cc: 12 }],
		});
		const setVolume = vi.spyOn(useSynthStore.getState(), "setVolume");
		renderHook(() => useMidiLearnBindings());
		window.dispatchEvent(
			new CustomEvent("cz-midi-cc", {
				detail: { channel: 1, cc: 12, rawValue: 99 },
			}),
		);
		expect(setVolume).toHaveBeenCalled();
	});

	it("applies synth param bindings via store setter", () => {
		const setVolume = vi.spyOn(useSynthStore.getState(), "setVolume");
		useMidiLearnStore.setState({
			bindings: [{ paramKey: "volume", channel: 0, cc: 7 }],
		});
		renderHook(() => useMidiLearnBindings());
		window.dispatchEvent(
			new CustomEvent("cz-midi-cc", {
				detail: { channel: 0, cc: 7, rawValue: 127 },
			}),
		);
		expect(setVolume).toHaveBeenCalled();
	});

	it("supports edge-trigger custom targets", () => {
		const apply = vi.fn();
		const cleanup = registerMidiLearnTarget("edge-k", {
			apply,
			mode: "edge-trigger",
			threshold: 64,
		});
		useMidiLearnStore.setState({
			bindings: [{ paramKey: "edge-k", channel: 0, cc: 21 }],
		});
		renderHook(() => useMidiLearnBindings());
		window.dispatchEvent(
			new CustomEvent("cz-midi-cc", {
				detail: { channel: 0, cc: 21, rawValue: 40 },
			}),
		);
		window.dispatchEvent(
			new CustomEvent("cz-midi-cc", {
				detail: { channel: 0, cc: 21, rawValue: 80 },
			}),
		);
		window.dispatchEvent(
			new CustomEvent("cz-midi-cc", {
				detail: { channel: 0, cc: 21, rawValue: 90 },
			}),
		);
		expect(apply).toHaveBeenCalledTimes(1);
		cleanup();
	});

	it("learns new bindings directly in web mode when no plugin bridge is present", () => {
		useMidiLearnStore.setState({
			learnMode: true,
			pendingLearnParam: "volume",
		});

		renderHook(() => useMidiLearnBindings());
		window.dispatchEvent(
			new CustomEvent("cz-midi-cc", {
				detail: { channel: 4, cc: 91, rawValue: 64 },
			}),
		);

		expect(useMidiLearnStore.getState()).toMatchObject({
			learnMode: true,
			pendingLearnParam: "volume",
			bindings: [{ paramKey: "volume", channel: 4, cc: 91 }],
		});
	});

	it("does not use the web fallback learner when the plugin bridge is present", () => {
		(
			window as Window & {
				__czAddMidiBinding?: (key: string, channel: number, cc: number) => void;
			}
		).__czAddMidiBinding = vi.fn();
		useMidiLearnStore.setState({
			learnMode: true,
			pendingLearnParam: "line1AlgoAControlsyncRatio",
		});

		renderHook(() => useMidiLearnBindings());
		window.dispatchEvent(
			new CustomEvent("cz-midi-cc", {
				detail: { channel: 2, cc: 14, rawValue: 100 },
			}),
		);

		expect(useMidiLearnStore.getState().bindings).toEqual([]);
	});
});
