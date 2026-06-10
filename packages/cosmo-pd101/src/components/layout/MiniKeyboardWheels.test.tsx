import { fireEvent, render } from "@testing-library/react";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import MiniKeyboardWheels from "./MiniKeyboardWheels";

function mockBoundingRect(el: HTMLElement, height: number, top = 0, left = 0) {
	vi.spyOn(el, "getBoundingClientRect").mockReturnValue({
		top,
		left,
		right: left + 30,
		bottom: top + height,
		width: 30,
		height,
		x: left,
		y: top,
		toJSON: () => ({}),
	});
}

function findTrack(container: HTMLElement, label: string): HTMLElement {
	const wheels = container.querySelectorAll<HTMLElement>(
		"[class*='flex flex-col items-center']",
	);
	for (const w of wheels) {
		if (w.querySelector("span")?.textContent === label) {
			const track = w.querySelector<HTMLElement>("[class*='cursor-pointer']");
			if (track) return track;
		}
	}
	throw new Error(`Track for "${label}" not found`);
}

beforeAll(() => {
	Object.defineProperty(HTMLElement.prototype, "setPointerCapture", {
		configurable: true,
		value: vi.fn(function (this: HTMLElement, pointerId: number) {
			(this as unknown as Record<string, unknown>).__capturedPointer =
				pointerId;
		}),
	});
	Object.defineProperty(HTMLElement.prototype, "hasPointerCapture", {
		configurable: true,
		value: vi.fn(function (this: HTMLElement, pointerId: number) {
			return (
				(this as unknown as Record<string, unknown>).__capturedPointer ===
				pointerId
			);
		}),
	});
	Object.defineProperty(HTMLElement.prototype, "releasePointerCapture", {
		configurable: true,
		value: vi.fn(function (this: HTMLElement) {
			(this as unknown as Record<string, unknown>).__capturedPointer =
				undefined;
		}),
	});
});

describe("MiniKeyboardWheels", () => {
	beforeEach(() => {
		vi.restoreAllMocks();
	});

	describe("Mod wheel", () => {
		function renderModWheel() {
			const onModWheelChange = vi.fn();
			const result = render(
				<MiniKeyboardWheels onModWheelChange={onModWheelChange} />,
			);
			const track = findTrack(result.container, "Mod");
			return { ...result, onModWheelChange, track };
		}

		it("calls onModWheelChange with ~1 when clicked at top", () => {
			const { track, onModWheelChange } = renderModWheel();
			mockBoundingRect(track, 200);

			fireEvent.pointerDown(track, {
				buttons: 1,
				clientX: 15,
				clientY: 0,
				pointerId: 1,
				pointerType: "mouse",
			});

			expect(onModWheelChange).toHaveBeenCalledWith(1);
		});

		it("calls onModWheelChange with ~0 when clicked at bottom", () => {
			const { track, onModWheelChange } = renderModWheel();
			mockBoundingRect(track, 200);

			fireEvent.pointerDown(track, {
				buttons: 1,
				clientX: 15,
				clientY: 200,
				pointerId: 1,
				pointerType: "mouse",
			});

			expect(onModWheelChange).toHaveBeenCalledWith(0);
		});

		it("calls onModWheelChange with ~0.5 when clicked at middle", () => {
			const { track, onModWheelChange } = renderModWheel();
			mockBoundingRect(track, 200);

			fireEvent.pointerDown(track, {
				buttons: 1,
				clientX: 15,
				clientY: 100,
				pointerId: 1,
				pointerType: "mouse",
			});

			expect(onModWheelChange).toHaveBeenCalledWith(0.5);
		});

		it("updates value on drag", () => {
			const { track, onModWheelChange } = renderModWheel();
			mockBoundingRect(track, 200);

			fireEvent.pointerDown(track, {
				buttons: 1,
				clientX: 15,
				clientY: 100,
				pointerId: 1,
				pointerType: "mouse",
			});
			onModWheelChange.mockClear();

			vi.spyOn(track, "hasPointerCapture").mockReturnValue(true);

			fireEvent.pointerMove(track, {
				buttons: 1,
				clientX: 15,
				clientY: 40,
				pointerId: 1,
				pointerType: "mouse",
			});

			expect(onModWheelChange).toHaveBeenCalledWith(0.8);
		});
	});

	describe("Pitch wheel", () => {
		function renderPitchWheel() {
			const onPitchBendChange = vi.fn();
			const result = render(
				<MiniKeyboardWheels onPitchBendChange={onPitchBendChange} />,
			);
			const track = findTrack(result.container, "Pitch");
			return { ...result, onPitchBendChange, track };
		}

		it("calls onPitchBendChange with 0 when clicked at center", () => {
			const { track, onPitchBendChange } = renderPitchWheel();
			mockBoundingRect(track, 200);

			fireEvent.pointerDown(track, {
				buttons: 1,
				clientX: 15,
				clientY: 100,
				pointerId: 1,
				pointerType: "mouse",
			});

			expect(onPitchBendChange).toHaveBeenCalledWith(0);
		});

		it("calls onPitchBendChange with 1 when clicked at top", () => {
			const { track, onPitchBendChange } = renderPitchWheel();
			mockBoundingRect(track, 200);

			fireEvent.pointerDown(track, {
				buttons: 1,
				clientX: 15,
				clientY: 0,
				pointerId: 1,
				pointerType: "mouse",
			});

			expect(onPitchBendChange).toHaveBeenCalledWith(1);
		});

		it("calls onPitchBendChange with -1 when clicked at bottom", () => {
			const { track, onPitchBendChange } = renderPitchWheel();
			mockBoundingRect(track, 200);

			fireEvent.pointerDown(track, {
				buttons: 1,
				clientX: 15,
				clientY: 200,
				pointerId: 1,
				pointerType: "mouse",
			});

			expect(onPitchBendChange).toHaveBeenCalledWith(-1);
		});
	});
});
