import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useNoteHandling } from "./useNoteHandling";

describe("useNoteHandling", () => {
	const mockEventSink = vi.fn();
	const mockWorkletNode = {
		port: {
			postMessage: vi.fn(),
		},
	};
	const mockWorkletNodeRef = {
		current: mockWorkletNode,
	};

	beforeEach(() => {
		vi.clearAllMocks();
		vi.restoreAllMocks();
	});

	it("sends noteOn event", () => {
		const { result } = renderHook(() =>
			useNoteHandling({
				workletNodeRef:
					mockWorkletNodeRef as unknown as React.RefObject<AudioWorkletNode>,
				eventSink: mockEventSink,
			}),
		);

		act(() => {
			result.current.sendNoteOn(60, 100);
		});

		expect(mockEventSink).toHaveBeenCalledWith(
			"noteOn",
			expect.objectContaining({
				note: 60,
				velocity: 100 / 127,
			}),
		);
	});

	it("sends noteOff event", () => {
		const { result } = renderHook(() =>
			useNoteHandling({
				workletNodeRef:
					mockWorkletNodeRef as unknown as React.RefObject<AudioWorkletNode>,
				eventSink: mockEventSink,
			}),
		);

		act(() => {
			result.current.sendNoteOn(60);
			result.current.sendNoteOff(60);
		});

		expect(mockEventSink).toHaveBeenCalledWith("noteOff", { note: 60 });
	});

	it("handles sustain correctly", () => {
		const { result } = renderHook(() =>
			useNoteHandling({
				workletNodeRef:
					mockWorkletNodeRef as unknown as React.RefObject<AudioWorkletNode>,
				eventSink: mockEventSink,
			}),
		);

		act(() => {
			result.current.setSustain(true);
			result.current.sendNoteOn(60);
			result.current.sendNoteOff(60);
		});

		// NoteOff should not be sent to engine while sustain is on
		expect(mockEventSink).not.toHaveBeenCalledWith("noteOff", { note: 60 });

		act(() => {
			result.current.setSustain(false);
		});

		// NoteOff should now be sent for the released note
		expect(mockEventSink).toHaveBeenCalledWith("noteOff", { note: 60 });
	});

	it("handles panic", () => {
		const { result } = renderHook(() =>
			useNoteHandling({
				workletNodeRef:
					mockWorkletNodeRef as unknown as React.RefObject<AudioWorkletNode>,
				eventSink: mockEventSink,
			}),
		);

		act(() => {
			result.current.sendNoteOn(60);
			result.current.sendPitchBend(0.8);
			result.current.sendModWheel(0.6);
			result.current.panic();
		});

		expect(mockEventSink).toHaveBeenCalledWith("panic", {});
		expect(result.current.activeNotes).toEqual([]);
		expect(result.current.pitchBend).toBe(0);
		expect(result.current.modWheel).toBe(0.6);
	});

	it("sends pitch bend, mod wheel, and aftertouch", () => {
		const { result } = renderHook(() =>
			useNoteHandling({
				workletNodeRef:
					mockWorkletNodeRef as unknown as React.RefObject<AudioWorkletNode>,
				eventSink: mockEventSink,
			}),
		);

		act(() => {
			result.current.sendPitchBend(0.5);
			result.current.sendModWheel(0.7);
			result.current.sendAftertouch(0.3);
		});

		expect(mockEventSink).toHaveBeenCalledWith("pitchBend", { value: 0.5 });
		expect(mockEventSink).toHaveBeenCalledWith("modWheel", { value: 0.7 });
		expect(mockEventSink).toHaveBeenCalledWith("aftertouch", { value: 0.3 });
		expect(result.current.pitchBend).toBe(0.5);
		expect(result.current.modWheel).toBe(0.7);
	});

	it("clamps performance controls and reflects external MIDI telemetry", () => {
		const { result } = renderHook(() =>
			useNoteHandling({
				workletNodeRef:
					mockWorkletNodeRef as unknown as React.RefObject<AudioWorkletNode>,
				eventSink: mockEventSink,
			}),
		);

		act(() => {
			result.current.sendPitchBend(2);
			result.current.sendModWheel(-1);
		});
		expect(mockEventSink).toHaveBeenCalledWith("pitchBend", { value: 1 });
		expect(mockEventSink).toHaveBeenCalledWith("modWheel", { value: 0 });

		act(() => {
			window.dispatchEvent(
				new CustomEvent("cz-runtime-mod-sources", {
					detail: { pitchBend: -0.4, modWheel: 0.9 },
				}),
			);
		});
		expect(result.current.pitchBend).toBe(-0.4);
		expect(result.current.modWheel).toBe(0.9);
	});

	it("handles keyboard input — maps z to base note (C3, MIDI 48)", () => {
		const { result } = renderHook(() =>
			useNoteHandling({
				workletNodeRef:
					mockWorkletNodeRef as unknown as React.RefObject<AudioWorkletNode>,
				eventSink: mockEventSink,
			}),
		);

		act(() => {
			window.dispatchEvent(new KeyboardEvent("keydown", { key: "z" }));
		});

		expect(result.current.activeNotes).toContain(48);
		expect(mockEventSink).toHaveBeenCalledWith(
			"noteOn",
			expect.objectContaining({ note: 48 }),
		);

		act(() => {
			window.dispatchEvent(new KeyboardEvent("keyup", { key: "z" }));
		});

		expect(result.current.activeNotes).not.toContain(48);
		expect(mockEventSink).toHaveBeenCalledWith("noteOff", { note: 48 });
	});

	it("supports chromatic PC keyboard sequence (z=48, s=49, x=50)", () => {
		const { result } = renderHook(() =>
			useNoteHandling({
				workletNodeRef:
					mockWorkletNodeRef as unknown as React.RefObject<AudioWorkletNode>,
				eventSink: mockEventSink,
			}),
		);

		act(() => {
			window.dispatchEvent(new KeyboardEvent("keydown", { key: "z" }));
			window.dispatchEvent(new KeyboardEvent("keydown", { key: "s" }));
			window.dispatchEvent(new KeyboardEvent("keydown", { key: "x" }));
		});

		expect(result.current.activeNotes).toEqual([48, 49, 50]);
	});

	it("respects pcKeyboardBaseNote offset", () => {
		const { result } = renderHook(() =>
			useNoteHandling({
				workletNodeRef:
					mockWorkletNodeRef as unknown as React.RefObject<AudioWorkletNode>,
				eventSink: mockEventSink,
				pcKeyboardBaseNote: 60,
			}),
		);

		act(() => {
			window.dispatchEvent(new KeyboardEvent("keydown", { key: "z" }));
		});

		expect(result.current.activeNotes).toContain(60);
	});

	it("prevents default on keyboard input when not in passthrough", () => {
		const preventDefaultSpy = vi.fn();
		renderHook(() =>
			useNoteHandling({
				workletNodeRef:
					mockWorkletNodeRef as unknown as React.RefObject<AudioWorkletNode>,
				eventSink: mockEventSink,
				keyboardPassthrough: false,
			}),
		);

		const event = new KeyboardEvent("keydown", { key: "z", cancelable: true });
		Object.defineProperty(event, "preventDefault", {
			value: preventDefaultSpy,
		});

		act(() => {
			window.dispatchEvent(event);
		});

		expect(preventDefaultSpy).toHaveBeenCalled();
	});

	it("does not prevent default when keyboard passthrough is enabled", () => {
		const preventDefaultSpy = vi.fn();
		renderHook(() =>
			useNoteHandling({
				workletNodeRef:
					mockWorkletNodeRef as unknown as React.RefObject<AudioWorkletNode>,
				eventSink: mockEventSink,
				keyboardPassthrough: true,
			}),
		);

		const event = new KeyboardEvent("keydown", { key: "z", cancelable: true });
		Object.defineProperty(event, "preventDefault", {
			value: preventDefaultSpy,
		});

		act(() => {
			window.dispatchEvent(event);
		});

		expect(preventDefaultSpy).not.toHaveBeenCalled();
	});
});
