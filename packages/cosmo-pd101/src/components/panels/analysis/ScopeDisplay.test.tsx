import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useSynthUiStore } from "@/features/synth/synthUiStore";
import { ScopeMiniDisplay } from "./ScopeDisplay";

function createMockCanvasContext() {
	return {
		beginPath: vi.fn(),
		arc: vi.fn(),
		clearRect: vi.fn(),
		closePath: vi.fn(),
		createRadialGradient: vi.fn(() => ({ addColorStop: vi.fn() })),
		ellipse: vi.fn(),
		fill: vi.fn(),
		fillRect: vi.fn(),
		fillText: vi.fn(),
		lineTo: vi.fn(),
		moveTo: vi.fn(),
		restore: vi.fn(),
		rotate: vi.fn(),
		save: vi.fn(),
		setTransform: vi.fn(),
		stroke: vi.fn(),
		strokeRect: vi.fn(),
		translate: vi.fn(),
		fillStyle: "",
		globalAlpha: 1,
		globalCompositeOperation: "source-over",
		lineWidth: 1,
		shadowBlur: 0,
		shadowColor: "",
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
		localStorage.clear();
		useSynthUiStore.persist.clearStorage();
		useSynthUiStore.setState({
			scopeVisualizationMode: "waveform",
			scopeColorTheme: "vintage",
		});
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
		const { container } = render(<ScopeMiniDisplay effectivePitchHz={220} />);

		const canvas = container.querySelector("canvas");
		if (!canvas) {
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

		const { container } = render(<ScopeMiniDisplay effectivePitchHz={220} />);

		const canvas = container.querySelector("canvas");
		if (!canvas) {
			throw new Error("expected scope canvas");
		}

		expect(canvas.width).toBeGreaterThanOrEqual(240);
		expect(canvas.height).toBeGreaterThanOrEqual(96);
	});

	it("cycles through scope modes on button click", () => {
		render(<ScopeMiniDisplay effectivePitchHz={220} />);

		const modeButton = screen.getByText("Waveform");
		expect(modeButton).toBeInTheDocument();

		fireEvent.click(modeButton);
		expect(screen.getByText("Orbital")).toBeInTheDocument();

		fireEvent.click(screen.getByText("Orbital"));
		expect(screen.getByText("Spectrogram")).toBeInTheDocument();
	});

	it("shows a placeholder instead of the mini scope while expanded", () => {
		render(<ScopeMiniDisplay effectivePitchHz={220} expanded />);

		expect(
			screen.getByText("Wave drawer is showing the full scope view"),
		).toBeInTheDocument();
	});

	it("renders the 3D waterfall visualization when mode is set to waterfall3d", () => {
		const { container } = render(<ScopeMiniDisplay effectivePitchHz={220} />);

		// Click mode button 3 times to reach waterfall3d (waveform → orbital → spectrogram → waterfall3d)
		fireEvent.click(screen.getByText("Waveform"));
		fireEvent.click(screen.getByText("Orbital"));
		fireEvent.click(screen.getByText("Spectrogram"));

		const canvas = container.querySelector("canvas");
		if (!canvas) {
			throw new Error("expected scope canvas");
		}

		expect(canvas).toBeInTheDocument();
		expect(screen.getByText("Waterfall 3D")).toBeInTheDocument();
		expect(canvas.className).toContain("cursor-pointer");
	});
});
