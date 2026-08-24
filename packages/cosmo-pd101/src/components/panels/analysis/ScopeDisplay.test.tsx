import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ScopeProvider } from "@/context/ScopeContext";
import { useSynthUiStore } from "@/features/synth/synthUiStore";
import { ScopeMiniDisplay } from "./ScopeDisplay";

function renderWithScope(ui: React.ReactElement) {
	return render(
		<ScopeProvider
			analyserNodeRef={{ current: null }}
			audioCtxRef={{ current: null }}
			effectivePitchHz={220}
		>
			{ui}
		</ScopeProvider>,
	);
}

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
		const { container } = renderWithScope(<ScopeMiniDisplay />);

		const canvas = container.querySelector("canvas");
		if (!canvas) {
			throw new Error("expected scope canvas");
		}

		expect(canvas.className).toContain("h-full");
		expect(canvas.className).toContain("w-full");

		expect(canvas.style.imageRendering).toBe("");
	});

	it("uses automatic waveform locking without a manual trigger control", () => {
		renderWithScope(<ScopeMiniDisplay />);

		expect(screen.getByText("Cycles")).toBeInTheDocument();
		expect(screen.getByText("Zoom")).toBeInTheDocument();
		expect(screen.queryByText("Trig")).not.toBeInTheDocument();
	});

	it("caps backing pixels to the adaptive display ratio", () => {
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

		const { container } = renderWithScope(<ScopeMiniDisplay />);

		const canvas = container.querySelector("canvas");
		if (!canvas) {
			throw new Error("expected scope canvas");
		}

		expect(canvas.width).toBeGreaterThanOrEqual(120);
		expect(canvas.height).toBeGreaterThanOrEqual(48);
	});

	it("selects any scope mode from the shared tabs", () => {
		renderWithScope(<ScopeMiniDisplay />);

		const modeButton = screen.getByRole("tab", {
			name: "Choose visualization: Waveform",
		});
		expect(modeButton).toBeInTheDocument();

		fireEvent.click(modeButton);
		fireEvent.click(screen.getByRole("menuitem", { name: "Orbital" }));
		expect(
			screen.getByRole("tab", { name: "Choose visualization: Orbital" }),
		).toBeInTheDocument();

		fireEvent.click(
			screen.getByRole("tab", { name: "Choose visualization: Orbital" }),
		);
		fireEvent.click(
			screen.getByRole("menuitem", { name: "Spectrum Waterfall" }),
		);
		expect(
			screen.getByRole("tab", {
				name: "Choose visualization: Spectrum Waterfall",
			}),
		).toBeInTheDocument();
	});
});
