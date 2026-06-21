import { renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { registerMidiLearnTarget } from "../midiLearnRegistry";
import { useMidiLearnStore } from "../midiLearnStore";
import { useSynthStore } from "../synthStore";
import { useMidiLearnBindings } from "./useMidiLearnBindings";

describe("useMidiLearnBindings", () => {
	beforeEach(() => {
		useSynthStore.setState(useSynthStore.getInitialState());
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

	it("applies web bindings while learn mode is enabled", () => {
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

	it("uses engine MIDI ranges for unmounted bipolar controls", () => {
		const setLineOctave = vi.spyOn(useSynthStore.getState(), "setLineOctave");
		useMidiLearnStore.setState({
			bindings: [{ paramKey: "lineOctave", channel: -1, cc: 7 }],
		});
		renderHook(() => useMidiLearnBindings());
		window.dispatchEvent(
			new CustomEvent("cz-midi-cc", {
				detail: { channel: 4, cc: 7, rawValue: 0 },
			}),
		);
		expect(setLineOctave).toHaveBeenCalledWith(-2);
	});

	it("prefers a mounted target registration in web mode", () => {
		const apply = vi.fn();
		const cleanup = registerMidiLearnTarget("lineOctave", { apply });
		const setLineOctave = vi.spyOn(useSynthStore.getState(), "setLineOctave");
		useMidiLearnStore.setState({
			bindings: [{ paramKey: "lineOctave", channel: 0, cc: 7 }],
		});
		renderHook(() => useMidiLearnBindings());
		window.dispatchEvent(
			new CustomEvent("cz-midi-cc", {
				detail: { channel: 0, cc: 7, rawValue: 64 },
			}),
		);
		expect(apply).toHaveBeenCalledWith(64);
		expect(setLineOctave).not.toHaveBeenCalled();
		cleanup();
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

	it("defers to native capture in plugin mode without local binding or RPC", () => {
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

		// In plugin mode, native handles capture — no local binding created.
		expect(useMidiLearnStore.getState().bindings).toEqual([]);
		expect(window.__czAddMidiBinding).not.toHaveBeenCalled();
		expect(useMidiLearnStore.getState().learnMode).toBe(true);
	});

	it("does not duplicate native engine-backed mapping in plugin mode", () => {
		window.__czAddMidiBinding = vi.fn();
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
		expect(setVolume).not.toHaveBeenCalled();
	});

	it("quantizes stepped controls like octave in web mode", () => {
		const setLineOctave = vi.spyOn(useSynthStore.getState(), "setLineOctave");
		useMidiLearnStore.setState({
			bindings: [{ paramKey: "lineOctave", channel: -1, cc: 23 }],
		});
		renderHook(() => useMidiLearnBindings());
		// rawValue 76 → normalized 0.598 → mapped -2 + 0.598*4 ≈ 0.394 → quantized to 0
		window.dispatchEvent(
			new CustomEvent("cz-midi-cc", {
				detail: { channel: 4, cc: 23, rawValue: 76 },
			}),
		);
		expect(setLineOctave).toHaveBeenCalledWith(0);
	});

	it("does not quantize continuous controls in web mode", () => {
		const setVolume = vi.spyOn(useSynthStore.getState(), "setVolume");
		useMidiLearnStore.setState({
			bindings: [{ paramKey: "volume", channel: -1, cc: 24 }],
		});
		renderHook(() => useMidiLearnBindings());
		// rawValue 64 → normalized 64/127 ≈ 0.504 → mapped 0.504 → NOT quantized
		window.dispatchEvent(
			new CustomEvent("cz-midi-cc", {
				detail: { channel: 4, cc: 24, rawValue: 64 },
			}),
		);
		const expected = 64 / 127;
		const actual = setVolume.mock.calls[0]?.[0];
		expect(Math.abs(actual - expected)).toBeLessThan(0.001);
	});
});
