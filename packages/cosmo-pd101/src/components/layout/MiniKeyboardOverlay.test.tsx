import { fireEvent, render } from "@testing-library/react";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import MiniKeyboardOverlay from "./MiniKeyboardOverlay";

const uiState = {
	keyboardOctaves: 3,
	keyboardRange: 0,
	keyboardHeight: 128,
	keyboardInputMode: "velocity" as const,
	pcKeyboardOverlayVisible: true,
};

let polyModeValue: "poly8" | "mono" = "poly8";

vi.mock("@/features/synth/synthUiStore", () => ({
	useSynthUiStore: vi.fn((selector: (state: typeof uiState) => unknown) =>
		selector(uiState),
	),
}));

vi.mock("@/features/synth/synthStore", () => ({
	useSynthStore: vi.fn(
		(selector?: (state: { polyMode: "poly8" | "mono" }) => unknown) => {
			const state = { polyMode: polyModeValue };
			return typeof selector === "function" ? selector(state) : state;
		},
	),
}));

describe("MiniKeyboardOverlay", () => {
	beforeAll(() => {
		Object.defineProperty(HTMLElement.prototype, "setPointerCapture", {
			configurable: true,
			value: vi.fn(),
		});
	});

	beforeEach(() => {
		polyModeValue = "poly8";
		vi.restoreAllMocks();
	});

	function renderOverlay() {
		const onNoteOn = vi.fn();
		const onNoteOff = vi.fn();
		const onPolyAftertouch = vi.fn();

		const result = render(
			<MiniKeyboardOverlay
				activeNotes={[]}
				onNoteOn={onNoteOn}
				onNoteOff={onNoteOff}
				onPolyAftertouch={onPolyAftertouch}
			/>,
		);

		return { ...result, onNoteOn, onNoteOff, onPolyAftertouch };
	}

	function getKey(container: HTMLElement, note: number) {
		const key = container.querySelector<HTMLElement>(
			`[data-mini-note="${note}"]`,
		);
		expect(key).not.toBeNull();
		return key as HTMLElement;
	}

	function startPointer(key: HTMLElement, pointerId = 1) {
		fireEvent.pointerDown(key, {
			buttons: 1,
			clientX: 10,
			clientY: 20,
			pointerId,
			pointerType: "mouse",
		});
	}

	function movePointerTo(target: HTMLElement, pointerId = 1) {
		vi.spyOn(document, "elementFromPoint").mockReturnValue(target);
		fireEvent.pointerMove(window, {
			buttons: 1,
			clientX: 30,
			clientY: 40,
			pointerId,
			pointerType: "mouse",
		});
	}

	function releasePointer(pointerId = 1) {
		fireEvent.pointerUp(window, {
			clientX: 30,
			clientY: 40,
			pointerId,
			pointerType: "mouse",
		});
	}

	it("slides in poly mode with noteOff before the next noteOn", () => {
		const { container, onNoteOn, onNoteOff } = renderOverlay();
		const firstKey = getKey(container, 48);
		const secondKey = getKey(container, 50);

		startPointer(firstKey);
		movePointerTo(secondKey);

		expect(onNoteOn).toHaveBeenNthCalledWith(1, 48, expect.any(Number));
		expect(onNoteOff).toHaveBeenCalledTimes(1);
		expect(onNoteOff).toHaveBeenCalledWith(48);
		expect(onNoteOn).toHaveBeenNthCalledWith(2, 50, 100);
		expect(onNoteOff.mock.invocationCallOrder[0]).toBeLessThan(
			onNoteOn.mock.invocationCallOrder[1],
		);
	});

	it("slides in mono mode with noteOn before noteOff for a seamless handoff", () => {
		polyModeValue = "mono";
		const { container, onNoteOn, onNoteOff } = renderOverlay();
		const firstKey = getKey(container, 48);
		const secondKey = getKey(container, 50);

		startPointer(firstKey);
		movePointerTo(secondKey);

		expect(onNoteOn).toHaveBeenNthCalledWith(1, 48, expect.any(Number));
		expect(onNoteOn).toHaveBeenNthCalledWith(2, 50, 100);
		expect(onNoteOff).toHaveBeenCalledTimes(1);
		expect(onNoteOff).toHaveBeenCalledWith(48);
		expect(onNoteOn.mock.invocationCallOrder[1]).toBeLessThan(
			onNoteOff.mock.invocationCallOrder[0],
		);
	});

	it("releases only the current note after a mono slide", () => {
		polyModeValue = "mono";
		const { container, onNoteOff, onPolyAftertouch } = renderOverlay();
		const firstKey = getKey(container, 48);
		const secondKey = getKey(container, 50);

		startPointer(firstKey);
		movePointerTo(secondKey);
		releasePointer();

		expect(onPolyAftertouch).toHaveBeenCalledWith(50, 0);
		expect(onNoteOff).toHaveBeenCalledTimes(2);
		expect(onNoteOff).toHaveBeenCalledWith(48);
		expect(onNoteOff).toHaveBeenCalledWith(50);
	});

	it("renders octave markers separately from PC key labels", () => {
		const { container } = renderOverlay();
		const c3Key = getKey(container, 48);
		const c4Key = getKey(container, 60);

		expect(
			c3Key.querySelector('[data-mini-note-label="48"]')?.textContent,
		).toBe("C3");
		expect(c3Key.querySelector('[data-mini-pc-label="48"]')?.textContent).toBe(
			"Z",
		);
		expect(
			c4Key.querySelector('[data-mini-note-label="60"]')?.textContent,
		).toBe("C4");
		expect(c4Key.querySelector('[data-mini-pc-label="60"]')?.textContent).toBe(
			",",
		);
	});
});
