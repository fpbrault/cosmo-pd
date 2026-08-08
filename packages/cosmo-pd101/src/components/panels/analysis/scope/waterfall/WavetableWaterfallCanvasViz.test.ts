import { describe, expect, it, vi } from "vitest";
import { getScopeThemePalette } from "../rendering/palette";
import { drawWavetableWaterfallScope } from "./WavetableWaterfallCanvasViz";

function createMockCanvasContext() {
	return {
		beginPath: vi.fn(),
		clearRect: vi.fn(),
		fill: vi.fn(),
		fillRect: vi.fn(),
		fillText: vi.fn(),
		lineTo: vi.fn(),
		moveTo: vi.fn(),
		restore: vi.fn(),
		save: vi.fn(),
		setTransform: vi.fn(),
		stroke: vi.fn(),
		fillStyle: "",
		font: "",
		globalAlpha: 1,
		lineWidth: 1,
		shadowBlur: 0,
		shadowColor: "",
		strokeStyle: "",
		textAlign: "left" as CanvasTextAlign,
		textBaseline: "alphabetic" as CanvasTextBaseline,
	} as unknown as CanvasRenderingContext2D;
}

function createCanvas(context: CanvasRenderingContext2D): HTMLCanvasElement {
	const canvas = document.createElement("canvas");
	Object.defineProperty(canvas, "clientWidth", {
		configurable: true,
		get: () => 160,
	});
	Object.defineProperty(canvas, "clientHeight", {
		configurable: true,
		get: () => 96,
	});
	vi.spyOn(canvas, "getContext").mockReturnValue(context);
	return canvas;
}

describe("drawWavetableWaterfallScope", () => {
	it("renders a waterfall frame with valid preview data", () => {
		const context = createMockCanvasContext();
		const canvas = createCanvas(context);

		expect(() =>
			drawWavetableWaterfallScope(
				canvas,
				getScopeThemePalette("vintage"),
				{
					line1History: [
						[-0.5, 0, 0.5],
						[-0.25, 0.25, 0.4],
					],
					line2History: [
						[-0.4, 0.1, 0.35],
						[-0.2, 0.2, 0.3],
					],
					line1Indicators: [{ voiceId: 1, progress: 0.6, strength: 0.8 }],
					line2Indicators: [],
				},
				1,
				1.2,
			),
		).not.toThrow();

		expect(context.fillText).toHaveBeenCalledWith(
			"LINE 1",
			10,
			expect.any(Number),
		);
		expect(context.stroke).toHaveBeenCalled();
	});

	it("no-ops safely when preview data is missing", () => {
		const context = createMockCanvasContext();
		const canvas = createCanvas(context);

		expect(() =>
			drawWavetableWaterfallScope(
				canvas,
				getScopeThemePalette("amber"),
				null,
				2,
				1,
			),
		).not.toThrow();

		expect(context.fillText).toHaveBeenCalledWith(
			"LINE 2",
			10,
			expect.any(Number),
		);
	});
});
