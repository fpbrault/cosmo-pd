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
				workletNodeRef: mockWorkletNodeRef as unknown as React.RefObject<AudioWorkletNode>,
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
				workletNodeRef: mockWorkletNodeRef as unknown as React.RefObject<AudioWorkletNode>,
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
				workletNodeRef: mockWorkletNodeRef as unknown as React.RefObject<AudioWorkletNode>,
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
				workletNodeRef: mockWorkletNodeRef as unknown as React.RefObject<AudioWorkletNode>,
				eventSink: mockEventSink,
			}),
		);

		act(() => {
			result.current.sendNoteOn(60);
			result.current.panic();
		});

		expect(mockEventSink).toHaveBeenCalledWith("panic", {});
		expect(result.current.activeNotes).toEqual([]);
	});

	it("sends pitch bend, mod wheel, and aftertouch", () => {
		const { result } = renderHook(() =>
			useNoteHandling({
				workletNodeRef: mockWorkletNodeRef as unknown as React.RefObject<AudioWorkletNode>,
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
	});

	it("handles keyboard input", () => {
		// Mock PC_KEY_TO_NOTE for 'a'
		const _aNote = 60;
		// Since we can't easily change the imported constant,
		// we rely on the actual PC_KEY_TO_NOTE mapping if we know it.
		// In this project, 'a' is usually 60.

		const { result } = renderHook(() =>
			useNoteHandling({
				workletNodeRef: mockWorkletNodeRef as unknown as React.RefObject<AudioWorkletNode>,
				eventSink: mockEventSink,
			}),
		);

		act(() => {
			window.dispatchEvent(new KeyboardEvent("keydown", { key: "a" }));
		});

		expect(result.current.activeNotes).toContain(60);
		expect(mockEventSink).toHaveBeenCalledWith(
			"noteOn",
			expect.objectContaining({ note: 60 }),
		);

		act(() => {
			window.dispatchEvent(new KeyboardEvent("keyup", { key: "a" }));
		});

		expect(result.current.activeNotes).not.toContain(60);
		expect(mockEventSink).toHaveBeenCalledWith("noteOff", { note: 60 });
	});

	it("prevents default on keyboard input when not in passthrough", () => {
		const preventDefaultSpy = vi.fn();
		renderHook(() =>
			useNoteHandling({
				workletNodeRef: mockWorkletNodeRef as unknown as React.RefObject<AudioWorkletNode>,
				eventSink: mockEventSink,
				keyboardPassthrough: false,
			}),
		);

		const event = new KeyboardEvent("keydown", { key: "a", cancelable: true });
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
				workletNodeRef: mockWorkletNodeRef as unknown as React.RefObject<AudioWorkletNode>,
				eventSink: mockEventSink,
				keyboardPassthrough: true,
			}),
		);

		const event = new KeyboardEvent("keydown", { key: "a", cancelable: true });
		Object.defineProperty(event, "preventDefault", {
			value: preventDefaultSpy,
		});

		act(() => {
			window.dispatchEvent(event);
		});

		expect(preventDefaultSpy).not.toHaveBeenCalled();
	});
});
