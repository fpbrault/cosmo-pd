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

	it("defers to native capture for native-backed params in plugin mode", () => {
		(
			window as Window & {
				__czAddMidiBinding?: (key: string, channel: number, cc: number) => void;
			}
		).__czAddMidiBinding = vi.fn();
		useMidiLearnStore.setState({
			learnMode: true,
			pendingLearnParam: "volume",
		});

		renderHook(() => useMidiLearnBindings());
		window.dispatchEvent(
			new CustomEvent("cz-midi-cc", {
				detail: { channel: 2, cc: 14, rawValue: 100 },
			}),
		);

		expect(useMidiLearnStore.getState().bindings).toEqual([]);
		expect(window.__czAddMidiBinding).not.toHaveBeenCalled();
		expect(useMidiLearnStore.getState().learnMode).toBe(true);
	});

	it("defers generic algo-control capture to native plugin mode", () => {
		(
			window as Window & {
				__czAddMidiBinding?: (key: string, channel: number, cc: number) => void;
			}
		).__czAddMidiBinding = vi.fn();
		useMidiLearnStore.setState({
			learnMode: true,
			pendingLearnParam: "line1AlgoControl1",
		});

		renderHook(() => useMidiLearnBindings());
		window.dispatchEvent(
			new CustomEvent("cz-midi-cc", {
				detail: { channel: 2, cc: 14, rawValue: 100 },
			}),
		);

		expect(useMidiLearnStore.getState().bindings).toEqual([]);
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

	it("does not duplicate native algo-control mapping in plugin mode", () => {
		window.__czAddMidiBinding = vi.fn();
		const apply = vi.fn();
		const cleanup = registerMidiLearnTarget("line1AlgoControl1", { apply });
		useMidiLearnStore.setState({
			bindings: [{ paramKey: "line1AlgoControl1", channel: 0, cc: 7 }],
		});
		renderHook(() => useMidiLearnBindings());
		window.dispatchEvent(
			new CustomEvent("cz-midi-cc", {
				detail: { channel: 0, cc: 7, rawValue: 127 },
			}),
		);
		expect(apply).not.toHaveBeenCalled();
		cleanup();
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

	it("edge-trigger fires once on rising edge above threshold", () => {
		const apply = vi.fn();
		const cleanup = registerMidiLearnTarget("presetNext", {
			apply,
			mode: "edge-trigger",
			threshold: 64,
		});
		useMidiLearnStore.setState({
			bindings: [{ paramKey: "presetNext", channel: 0, cc: 12 }],
		});
		renderHook(() => useMidiLearnBindings());
		// Rising edge from below to above threshold → fire
		window.dispatchEvent(
			new CustomEvent("cz-midi-cc", {
				detail: { channel: 0, cc: 12, rawValue: 40 },
			}),
		);
		window.dispatchEvent(
			new CustomEvent("cz-midi-cc", {
				detail: { channel: 0, cc: 12, rawValue: 80 },
			}),
		);
		expect(apply).toHaveBeenCalledTimes(1);
		cleanup();
	});

	it("edge-trigger does not fire while holding above threshold", () => {
		const apply = vi.fn();
		const cleanup = registerMidiLearnTarget("presetNext", {
			apply,
			mode: "edge-trigger",
			threshold: 64,
		});
		useMidiLearnStore.setState({
			bindings: [{ paramKey: "presetNext", channel: 0, cc: 12 }],
		});
		renderHook(() => useMidiLearnBindings());
		// First above-threshold → fire
		window.dispatchEvent(
			new CustomEvent("cz-midi-cc", {
				detail: { channel: 0, cc: 12, rawValue: 100 },
			}),
		);
		// Same above-threshold again → should NOT fire
		window.dispatchEvent(
			new CustomEvent("cz-midi-cc", {
				detail: { channel: 0, cc: 12, rawValue: 127 },
			}),
		);
		// Higher value, still above → should NOT fire
		window.dispatchEvent(
			new CustomEvent("cz-midi-cc", {
				detail: { channel: 0, cc: 12, rawValue: 127 },
			}),
		);
		expect(apply).toHaveBeenCalledTimes(1);
		cleanup();
	});

	it("edge-trigger does not fire on falling edge below threshold", () => {
		const apply = vi.fn();
		const cleanup = registerMidiLearnTarget("presetNext", {
			apply,
			mode: "edge-trigger",
			threshold: 64,
		});
		useMidiLearnStore.setState({
			bindings: [{ paramKey: "presetNext", channel: 0, cc: 12 }],
		});
		renderHook(() => useMidiLearnBindings());
		// Above threshold → fire
		window.dispatchEvent(
			new CustomEvent("cz-midi-cc", {
				detail: { channel: 0, cc: 12, rawValue: 100 },
			}),
		);
		// Below threshold → should NOT fire
		window.dispatchEvent(
			new CustomEvent("cz-midi-cc", {
				detail: { channel: 0, cc: 12, rawValue: 0 },
			}),
		);
		expect(apply).toHaveBeenCalledTimes(1);
		cleanup();
	});

	it("edge-trigger fires again on next rising edge after falling below threshold", () => {
		const apply = vi.fn();
		const cleanup = registerMidiLearnTarget("presetPrevious", {
			apply,
			mode: "edge-trigger",
			threshold: 64,
		});
		useMidiLearnStore.setState({
			bindings: [{ paramKey: "presetPrevious", channel: 0, cc: 13 }],
		});
		renderHook(() => useMidiLearnBindings());
		// Above → fire (1st)
		window.dispatchEvent(
			new CustomEvent("cz-midi-cc", {
				detail: { channel: 0, cc: 13, rawValue: 100 },
			}),
		);
		// Below
		window.dispatchEvent(
			new CustomEvent("cz-midi-cc", {
				detail: { channel: 0, cc: 13, rawValue: 0 },
			}),
		);
		// Above again → fire (2nd)
		window.dispatchEvent(
			new CustomEvent("cz-midi-cc", {
				detail: { channel: 0, cc: 13, rawValue: 100 },
			}),
		);
		expect(apply).toHaveBeenCalledTimes(2);
		cleanup();
	});

	it("edge-trigger debounce suppresses rapid re-trigger (button bounce)", () => {
		const apply = vi.fn();
		const cleanup = registerMidiLearnTarget("presetNext", {
			apply,
			mode: "edge-trigger",
			threshold: 64,
		});
		useMidiLearnStore.setState({
			bindings: [{ paramKey: "presetNext", channel: 0, cc: 12 }],
		});
		renderHook(() => useMidiLearnBindings());
		// First rising edge → fire
		window.dispatchEvent(
			new CustomEvent("cz-midi-cc", {
				detail: { channel: 0, cc: 12, rawValue: 100 },
			}),
		);
		// Bounce dip below threshold
		window.dispatchEvent(
			new CustomEvent("cz-midi-cc", {
				detail: { channel: 0, cc: 12, rawValue: 0 },
			}),
		);
		// Second rising edge within cooldown → should NOT fire
		window.dispatchEvent(
			new CustomEvent("cz-midi-cc", {
				detail: { channel: 0, cc: 12, rawValue: 100 },
			}),
		);
		expect(apply).toHaveBeenCalledTimes(1);
		cleanup();
	});

	it("edge-trigger with default threshold 64 fires at 64 and above", () => {
		const apply = vi.fn();
		const cleanup = registerMidiLearnTarget("presetNext", {
			apply,
			mode: "edge-trigger",
		});
		useMidiLearnStore.setState({
			bindings: [{ paramKey: "presetNext", channel: -1, cc: 14 }],
		});
		renderHook(() => useMidiLearnBindings());
		// 63 → below default threshold (64) → no fire
		window.dispatchEvent(
			new CustomEvent("cz-midi-cc", {
				detail: { channel: 3, cc: 14, rawValue: 63 },
			}),
		);
		// 64 → at threshold → fire
		window.dispatchEvent(
			new CustomEvent("cz-midi-cc", {
				detail: { channel: 3, cc: 14, rawValue: 64 },
			}),
		);
		expect(apply).toHaveBeenCalledTimes(1);
		cleanup();
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
