import { act, fireEvent, render, screen } from "@testing-library/react";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import PerformanceWheels from "./PerformanceWheels";

describe("PerformanceWheels", () => {
	beforeAll(() => {
		Object.defineProperty(HTMLElement.prototype, "setPointerCapture", {
			configurable: true,
			value: vi.fn(),
		});
		Object.defineProperty(HTMLElement.prototype, "hasPointerCapture", {
			configurable: true,
			value: vi.fn(() => true),
		});
		Object.defineProperty(HTMLElement.prototype, "releasePointerCapture", {
			configurable: true,
			value: vi.fn(),
		});
	});

	beforeEach(() => {
		vi.restoreAllMocks();
	});

	function setWheelBounds(wheel: HTMLElement) {
		vi.spyOn(wheel, "getBoundingClientRect").mockReturnValue({
			top: 0,
			bottom: 100,
			height: 100,
			left: 0,
			right: 40,
			width: 40,
			x: 0,
			y: 0,
			toJSON: () => ({}),
		});
	}

	it("maps pointer position to pitch and smoothly returns the engine to center", () => {
		const onPitchBend = vi.fn();
		const frames: FrameRequestCallback[] = [];
		vi.spyOn(performance, "now").mockReturnValue(0);
		vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
			frames.push(callback);
			return frames.length;
		});

		render(
			<PerformanceWheels
				pitchBend={0}
				modWheel={0}
				onPitchBend={onPitchBend}
				onModWheel={vi.fn()}
			/>,
		);
		const pitch = screen.getByRole("slider", { name: "Pitch wheel" });
		setWheelBounds(pitch);

		fireEvent.pointerDown(pitch, { clientY: 0, pointerId: 1 });
		expect(onPitchBend).toHaveBeenLastCalledWith(1);

		fireEvent.pointerUp(pitch, { pointerId: 1 });
		act(() => frames.shift()?.(50));
		expect(onPitchBend).toHaveBeenLastCalledWith(0.5);
		act(() => frames.shift()?.(100));
		expect(onPitchBend).toHaveBeenLastCalledWith(0);
		expect(pitch).toHaveAttribute("aria-valuenow", "0");
	});

	it("retains the modulation position after mouse or touch release", () => {
		const onModWheel = vi.fn();
		render(
			<PerformanceWheels
				pitchBend={0}
				modWheel={0}
				onPitchBend={vi.fn()}
				onModWheel={onModWheel}
			/>,
		);
		const mod = screen.getByRole("slider", { name: "Mod wheel" });
		setWheelBounds(mod);

		fireEvent.pointerDown(mod, {
			clientY: 25,
			pointerId: 7,
			pointerType: "touch",
		});
		fireEvent.pointerUp(mod, { pointerId: 7, pointerType: "touch" });

		expect(onModWheel).toHaveBeenCalledTimes(1);
		expect(onModWheel).toHaveBeenCalledWith(0.75);
		expect(mod).toHaveAttribute("aria-valuenow", "0.75");
	});

	it("finishes a drag when the pointer is released outside the wheel", () => {
		const onModWheel = vi.fn();
		render(
			<PerformanceWheels
				pitchBend={0}
				modWheel={0}
				onPitchBend={vi.fn()}
				onModWheel={onModWheel}
			/>,
		);
		const mod = screen.getByRole("slider", { name: "Mod wheel" });
		setWheelBounds(mod);

		fireEvent.pointerDown(mod, { clientY: 50, pointerId: 9 });
		fireEvent.pointerMove(window, { clientY: -100, pointerId: 9 });
		fireEvent.pointerUp(window, { clientY: -100, pointerId: 9 });
		fireEvent.pointerMove(window, { clientY: 100, pointerId: 9 });

		expect(onModWheel).toHaveBeenLastCalledWith(1);
	});

	it("clamps pointer input and gives an active gesture priority over telemetry", () => {
		const onPitchBend = vi.fn();
		const { rerender } = render(
			<PerformanceWheels
				pitchBend={0}
				modWheel={0}
				onPitchBend={onPitchBend}
				onModWheel={vi.fn()}
			/>,
		);
		const pitch = screen.getByRole("slider", { name: "Pitch wheel" });
		setWheelBounds(pitch);

		fireEvent.pointerDown(pitch, { clientY: -50, pointerId: 2 });
		rerender(
			<PerformanceWheels
				pitchBend={-1}
				modWheel={0}
				onPitchBend={onPitchBend}
				onModWheel={vi.fn()}
			/>,
		);

		expect(onPitchBend).toHaveBeenLastCalledWith(1);
		expect(pitch).toHaveAttribute("aria-valuenow", "1");
	});

	it("supports keyboard adjustment and releases pitch on keyup", () => {
		const onPitchBend = vi.fn();
		vi.spyOn(window, "requestAnimationFrame").mockReturnValue(1);
		render(
			<PerformanceWheels
				pitchBend={0}
				modWheel={0}
				onPitchBend={onPitchBend}
				onModWheel={vi.fn()}
			/>,
		);
		const pitch = screen.getByRole("slider", { name: "Pitch wheel" });

		fireEvent.keyDown(pitch, { key: "ArrowUp" });
		expect(onPitchBend).toHaveBeenLastCalledWith(0.1);
		fireEvent.keyUp(pitch, { key: "ArrowUp" });
		expect(window.requestAnimationFrame).toHaveBeenCalled();
	});
});
