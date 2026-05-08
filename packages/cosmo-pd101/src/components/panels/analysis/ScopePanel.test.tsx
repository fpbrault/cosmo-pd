import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ScopeMiniDisplay } from "./ScopePanel";

function createMockCanvasContext() {
	return {
		beginPath: vi.fn(),
		clearRect: vi.fn(),
		fillRect: vi.fn(),
		lineTo: vi.fn(),
		moveTo: vi.fn(),
		setTransform: vi.fn(),
		stroke: vi.fn(),
		fillStyle: "",
		lineWidth: 1,
		strokeStyle: "",
	} as unknown as CanvasRenderingContext2D;
}

describe("ScopeMiniDisplay", () => {
	const originalClientWidth = Object.getOwnPropertyDescriptor(
		HTMLCanvasElement.prototype,
		"clientWidth",
	);
	const originalClientHeight = Object.getOwnPropertyDescriptor(
		HTMLCanvasElement.prototype,
		"clientHeight",
	);

	beforeEach(() => {
		vi.restoreAllMocks();
	});

	afterEach(() => {
		if (originalClientWidth) {
			Object.defineProperty(
				HTMLCanvasElement.prototype,
				"clientWidth",
				originalClientWidth,
			);
		} else {
			delete (HTMLCanvasElement.prototype as { clientWidth?: number })
				.clientWidth;
		}
		if (originalClientHeight) {
			Object.defineProperty(
				HTMLCanvasElement.prototype,
				"clientHeight",
				originalClientHeight,
			);
		} else {
			delete (HTMLCanvasElement.prototype as { clientHeight?: number })
				.clientHeight;
		}
	});

	it("renders a larger scope canvas without forced pixelated scaling", () => {
		render(<ScopeMiniDisplay effectivePitchHz={220} />);

		const scopeLabel = screen.getByText(/Scope/);
		const wrapper = scopeLabel.parentElement;
		if (!(wrapper instanceof HTMLElement)) {
			throw new Error("expected scope wrapper element");
		}

		const canvas = wrapper.querySelector("canvas");
		if (!(canvas instanceof HTMLCanvasElement)) {
			throw new Error("expected scope canvas");
		}

		expect(canvas.className).toContain("h-43");
		expect(canvas.className).toContain("w-full");

		expect(canvas.style.imageRendering).toBe("");
	});

	it("uses at least 2x backing pixels for the scope backdrop", () => {
		const context = createMockCanvasContext();
		vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(
			context,
		);
		vi.spyOn(window, "requestAnimationFrame").mockReturnValue(1);
		vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => {});
		Object.defineProperty(HTMLCanvasElement.prototype, "clientWidth", {
			configurable: true,
			get: () => 120,
		});
		Object.defineProperty(HTMLCanvasElement.prototype, "clientHeight", {
			configurable: true,
			get: () => 48,
		});

		render(<ScopeMiniDisplay effectivePitchHz={220} />);

		const canvas = screen
			.getByText(/Scope/)
			.parentElement?.querySelector("canvas");
		if (!(canvas instanceof HTMLCanvasElement)) {
			throw new Error("expected scope canvas");
		}

		expect(canvas.width).toBeGreaterThanOrEqual(240);
		expect(canvas.height).toBeGreaterThanOrEqual(96);
	});
});
