import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ScopeMiniDisplay } from "./ScopeDisplay";

vi.mock("@react-three/fiber", () => ({
	Canvas: ({
		children,
		className,
	}: {
		children: React.ReactNode;
		className?: string;
	}) => (
		<div className={className} data-testid="mock-three-canvas">
			{children}
		</div>
	),
	useFrame: vi.fn(),
	useThree: () => ({
		camera: {
			position: { set: vi.fn() },
			lookAt: vi.fn(),
			updateProjectionMatrix: vi.fn(),
		},
	}),
}));

vi.mock("@react-three/drei", () => ({
	Line: () => <div data-testid="mock-three-line" />,
}));

vi.mock("three", () => ({
	AdditiveBlending: "AdditiveBlending",
}));

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

		const modeButton = screen.getByLabelText("Toggle scope mode picker");
		const wrapper = modeButton.closest(".flex.w-full.flex-col");
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
			.getByLabelText("Toggle scope mode picker")
			.closest(".flex.w-full.flex-col")
			?.querySelector("canvas");
		if (!(canvas instanceof HTMLCanvasElement)) {
			throw new Error("expected scope canvas");
		}

		expect(canvas.width).toBeGreaterThanOrEqual(240);
		expect(canvas.height).toBeGreaterThanOrEqual(96);
	});

	it("lists Rocket and Asteroids in the mode picker", () => {
		render(<ScopeMiniDisplay effectivePitchHz={220} />);

		fireEvent.click(screen.getByLabelText("Toggle scope mode picker"));

		expect(
			screen.getByLabelText("Select Rocket scope view"),
		).toBeInTheDocument();
		expect(
			screen.getByLabelText("Select Asteroids scope view"),
		).toBeInTheDocument();
	});

	it("shows a placeholder instead of the mini scope while expanded", () => {
		render(<ScopeMiniDisplay effectivePitchHz={220} expanded />);

		expect(
			screen.getByText("Wave drawer is showing the full scope view"),
		).toBeInTheDocument();
		expect(screen.queryByLabelText("Toggle scope mode picker")).toBeNull();
	});

	it("renders the 3D waterfall visualization in the mini scope", () => {
		render(<ScopeMiniDisplay effectivePitchHz={220} />);

		fireEvent.click(screen.getByLabelText("Toggle scope mode picker"));
		fireEvent.click(screen.getByLabelText("Select 3D scope view"));

		expect(screen.getByTestId("mock-three-canvas")).toBeInTheDocument();
		expect(screen.getByText("LINE 1")).toBeInTheDocument();
		expect(
			screen.queryByLabelText("Toggle LINE 1 wavetable line"),
		).toBeInTheDocument();
	});
});
