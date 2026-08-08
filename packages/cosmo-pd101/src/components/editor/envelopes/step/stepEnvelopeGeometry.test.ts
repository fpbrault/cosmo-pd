import { describe, expect, it, vi } from "vitest";
import type { StepEnvData } from "@/lib/synth/bindings/synth";
import {
	buildEnvelopePoints,
	CHART_PADDING_X,
	CHART_PADDING_Y,
	clamp,
	drawEnvPreview,
	editorStepDuration,
	findClosestPoint,
	getMarkerX,
	getStepAllowedXRange,
	normalizeEnvelope,
} from "./stepEnvelopeGeometry";

describe("clamp", () => {
	it("returns value within range", () => {
		expect(clamp(5, 0, 10)).toBe(5);
	});

	it("clamps below minimum", () => {
		expect(clamp(-5, 0, 10)).toBe(0);
	});

	it("clamps above maximum", () => {
		expect(clamp(15, 0, 10)).toBe(10);
	});

	it("handles edge values exactly", () => {
		expect(clamp(0, 0, 10)).toBe(0);
		expect(clamp(10, 0, 10)).toBe(10);
	});

	it("handles fractional values", () => {
		expect(clamp(3.7, 0, 10)).toBe(3.7);
		expect(clamp(-0.1, 0, 10)).toBe(0);
	});

	it("handles inverted min/max", () => {
		expect(clamp(5, 10, 0)).toBe(10);
	});
});

describe("editorStepDuration", () => {
	it("returns 1 for rate 0", () => {
		expect(editorStepDuration(0)).toBe(1);
	});

	it("returns ~0.001 for rate 99 (exponential decay)", () => {
		expect(editorStepDuration(99)).toBeCloseTo(0.001, 3);
	});

	it("returns ~0.933 for rate 1", () => {
		expect(editorStepDuration(1)).toBeCloseTo(0.933, 3);
	});

	it("clamps negative rate", () => {
		expect(editorStepDuration(-10)).toBe(1);
	});

	it("clamps rate above 99", () => {
		expect(editorStepDuration(150)).toBeCloseTo(0.001, 3);
	});

	it("handles fractional rate by rounding", () => {
		expect(editorStepDuration(Math.round(50.7))).toBeCloseTo(
			editorStepDuration(50.7),
			5,
		);
	});
});

describe("normalizeEnvelope", () => {
	const makeEnv = (overrides: Partial<StepEnvData> = {}): StepEnvData => ({
		steps: [
			{ level: 50, rate: 30 },
			{ level: 70, rate: 40 },
			{ level: 99, rate: 50 },
		],
		stepCount: 3,
		sustainStep: 0,
		loop: false,
		...overrides,
	});

	it("normalizes a valid envelope", () => {
		const env = makeEnv();
		const result = normalizeEnvelope(env);
		expect(result.stepCount).toBe(3);
		expect(result.steps).toHaveLength(8);
	});

	it("pads steps to 8 with defaults", () => {
		const env = makeEnv({ stepCount: 3 });
		const result = normalizeEnvelope(env);
		expect(result.steps).toHaveLength(8);
		for (let i = 3; i < 8; i++) {
			expect(result.steps[i]).toEqual({ level: 0, rate: 50 });
		}
	});

	it("forces last step level to 0", () => {
		const env = makeEnv({ stepCount: 4 });
		env.steps[3] = { level: 99, rate: 50 };
		const result = normalizeEnvelope(env);
		expect(result.steps[3]?.level).toBe(0);
	});

	it("clamps sustainStep to stepCount - 1", () => {
		const env = makeEnv({ stepCount: 2, sustainStep: 10 });
		const result = normalizeEnvelope(env);
		expect(result.sustainStep).toBe(1);
	});

	it("clamps sustainStep to 0 when negative", () => {
		const env = makeEnv({ stepCount: 3, sustainStep: -5 });
		const result = normalizeEnvelope(env);
		expect(result.sustainStep).toBe(0);
	});

	it("handles stepCount of 0", () => {
		const env = makeEnv({ stepCount: 0 });
		const result = normalizeEnvelope(env);
		expect(result.stepCount).toBe(1);
	});

	it("handles stepCount above 8", () => {
		const env = makeEnv({ stepCount: 20 });
		const result = normalizeEnvelope(env);
		expect(result.stepCount).toBe(8);
	});

	it("preserves existing properties like loop", () => {
		const env = makeEnv({ loop: true });
		const result = normalizeEnvelope(env);
		expect(result.loop).toBe(true);
	});
});

describe("getStepAllowedXRange", () => {
	const fourEqualSteps = [
		{ level: 50, rate: 50 },
		{ level: 50, rate: 50 },
		{ level: 50, rate: 50 },
		{ level: 50, rate: 50 },
	];

	it("returns range bounded by neighbors for first step", () => {
		const range = getStepAllowedXRange(0, 4, 400, fourEqualSteps);
		expect(range.minX).toBe(CHART_PADDING_X);
		expect(range.maxX).toBe(CHART_PADDING_X + 188);
	});

	it("returns range bounded by neighbors for middle step", () => {
		const range = getStepAllowedXRange(2, 4, 400, fourEqualSteps);
		expect(range.minX).toBe(CHART_PADDING_X + 2 * 94);
		expect(range.maxX).toBe(CHART_PADDING_X + 4 * 94);
	});

	it("handles single step", () => {
		const range = getStepAllowedXRange(0, 1, 200, [{ level: 0, rate: 50 }]);
		expect(range.minX).toBe(CHART_PADDING_X);
		expect(range.maxX).toBe(188);
	});

	it("uses neighbor positions for non-uniform rates", () => {
		const threeSteps = [
			{ level: 50, rate: 0 },
			{ level: 50, rate: 50 },
			{ level: 0, rate: 99 },
		];
		const range = getStepAllowedXRange(1, 3, 400, threeSteps);
		expect(range.minX).toBeGreaterThan(CHART_PADDING_X);
		expect(range.maxX).toBeGreaterThan(range.minX);
	});

	it("handles minimum width canvas (equal to padding)", () => {
		const range = getStepAllowedXRange(
			0,
			4,
			CHART_PADDING_X * 2,
			fourEqualSteps,
		);
		expect(range.minX).toBe(CHART_PADDING_X);
		expect(range.maxX).toBe(CHART_PADDING_X);
	});

	it("handles zero activeStepCount", () => {
		const range = getStepAllowedXRange(0, 0, 400, []);
		expect(range.minX).toBe(CHART_PADDING_X);
		expect(range.maxX).toBe(388);
	});
});

describe("buildEnvelopePoints", () => {
	const WIDTH = 400;
	const HEIGHT = 200;

	const makeEnv = (overrides: Partial<StepEnvData> = {}): StepEnvData => ({
		steps: [
			{ level: 0, rate: 50 },
			{ level: 50, rate: 50 },
			{ level: 99, rate: 50 },
		],
		stepCount: 3,
		sustainStep: 0,
		loop: false,
		...overrides,
	});

	it("builds correct number of points", () => {
		const env = makeEnv();
		const points = buildEnvelopePoints(env, WIDTH, HEIGHT);
		expect(points).toHaveLength(3);
	});

	it("sets last step y to bottom of chart (level 0)", () => {
		const env = makeEnv({ stepCount: 3 });
		const points = buildEnvelopePoints(env, WIDTH, HEIGHT);
		const last = points[points.length - 1];
		expect(last.y).toBe(CHART_PADDING_Y + (HEIGHT - CHART_PADDING_Y * 2));
	});

	it("returns empty array for no steps", () => {
		const env = makeEnv({ steps: [], stepCount: 0 });
		const points = buildEnvelopePoints(env, WIDTH, HEIGHT);
		expect(points).toEqual([]);
	});

	it("positions points in ascending x order", () => {
		const env = makeEnv();
		const points = buildEnvelopePoints(env, WIDTH, HEIGHT);
		for (let i = 1; i < points.length; i++) {
			expect(points[i].x).toBeGreaterThan(points[i - 1].x);
		}
	});

	it("assigns correct index to each point", () => {
		const env = makeEnv();
		const points = buildEnvelopePoints(env, WIDTH, HEIGHT);
		points.forEach((point, index) => {
			expect(point.index).toBe(index);
		});
	});
});

describe("getMarkerX", () => {
	const points = [
		{ index: 0, x: 20, y: 100 },
		{ index: 1, x: 100, y: 50 },
		{ index: 2, x: 180, y: 150 },
	];

	it("returns point x when marker has no progress", () => {
		const x = getMarkerX(points, { id: "v1", step: 1 });
		expect(x).toBe(100);
	});

	it("returns interpolated x when marker has progress", () => {
		const x = getMarkerX(points, { id: "v1", step: 1, progress: 0.5 });
		expect(x).toBe(60);
	});

	it("returns 0-progress x as start of step range", () => {
		const x = getMarkerX(points, { id: "v1", step: 1, progress: 0 });
		expect(x).toBe(20);
	});

	it("returns 1-progress x as point x", () => {
		const x = getMarkerX(points, { id: "v1", step: 1, progress: 1 });
		expect(x).toBe(100);
	});

	it("clamps progress to valid range", () => {
		const x = getMarkerX(points, { id: "v1", step: 1, progress: -0.5 });
		expect(x).toBe(20);
		const x2 = getMarkerX(points, { id: "v1", step: 1, progress: 1.5 });
		expect(x2).toBe(100);
	});

	it("clamps step to valid range", () => {
		const x = getMarkerX(points, { id: "v1", step: -1 });
		expect(x).toBe(20);
		const x2 = getMarkerX(points, { id: "v1", step: 10 });
		expect(x2).toBe(180);
	});

	it("returns null for empty points", () => {
		const x = getMarkerX([], { id: "v1", step: 0 });
		expect(x).toBeNull();
	});

	it("works for step 0 with progress", () => {
		const x = getMarkerX(points, { id: "v1", step: 0, progress: 0.3 });
		const fromX = CHART_PADDING_X;
		const expected = fromX + (20 - fromX) * 0.3;
		expect(x).toBeCloseTo(expected, 5);
	});
});

describe("findClosestPoint", () => {
	const points = [
		{ index: 0, x: 20, y: 100 },
		{ index: 1, x: 100, y: 50 },
		{ index: 2, x: 180, y: 150 },
	];

	it("finds closest point by distance", () => {
		const result = findClosestPoint(points, 25, 95);
		expect(result).not.toBeNull();
		expect(result?.point.index).toBe(0);
	});

	it("finds a different closest point", () => {
		const result = findClosestPoint(points, 105, 45);
		expect(result).not.toBeNull();
		expect(result?.point.index).toBe(1);
	});

	it("returns correct distance", () => {
		const result = findClosestPoint(points, 20, 100);
		expect(result).not.toBeNull();
		if (result === null) {
			throw new Error("Expected a closest point");
		}
		const { point, distanceSquared } = result;
		expect(point.index).toBe(0);
		expect(distanceSquared).toBe(0);
	});

	it("returns null for empty array", () => {
		const result = findClosestPoint([], 50, 50);
		expect(result).toBeNull();
	});

	it("handles single point", () => {
		const result = findClosestPoint([points[0]], 999, 999);
		expect(result).not.toBeNull();
		expect(result?.point.index).toBe(0);
	});
});

describe("drawEnvPreview", () => {
	const WIDTH = 400;
	const HEIGHT = 200;

	function createMockCanvas(): HTMLCanvasElement {
		return {
			width: WIDTH,
			height: HEIGHT,
			clientWidth: WIDTH,
			clientHeight: HEIGHT,
			getContext: () =>
				({
					beginPath: () => {},
					moveTo: () => {},
					lineTo: () => {},
					stroke: () => {},
					fill: () => {},
					arc: () => {},
					clearRect: () => {},
					fillRect: () => {},
					setLineDash: () => {},
					setTransform: () => {},
					fillStyle: "",
					globalAlpha: 1,
					lineWidth: 1,
					strokeStyle: "",
				}) as unknown as CanvasRenderingContext2D,
		} as unknown as HTMLCanvasElement;
	}

	function createEnv(overrides: Partial<StepEnvData> = {}): StepEnvData {
		return {
			steps: [
				{ level: 0, rate: 50 },
				{ level: 50, rate: 50 },
				{ level: 99, rate: 50 },
			],
			stepCount: 3,
			sustainStep: 0,
			loop: false,
			...overrides,
		};
	}

	it("renders without throwing", () => {
		const canvas = createMockCanvas();
		const env = createEnv();
		expect(() =>
			drawEnvPreview(canvas, env, "#ff0000", null, [], false),
		).not.toThrow();
	});

	it("renders preview mode without throwing", () => {
		const canvas = createMockCanvas();
		const env = createEnv();
		expect(() =>
			drawEnvPreview(canvas, env, "#ff0000", null, [], true),
		).not.toThrow();
	});

	it("renders with voice markers without throwing", () => {
		const canvas = createMockCanvas();
		const env = createEnv();
		expect(() =>
			drawEnvPreview(canvas, env, "#ff0000", null, [
				{ id: "v1", step: 1, progress: 0.5 },
				{ id: "v2", step: 2, color: "#00ff00" },
			]),
		).not.toThrow();
	});

	it("handles null canvas context gracefully", () => {
		const canvas = {
			width: WIDTH,
			height: HEIGHT,
			clientWidth: WIDTH,
			clientHeight: HEIGHT,
			getContext: () => null,
		} as unknown as HTMLCanvasElement;
		const env = createEnv();
		expect(() => drawEnvPreview(canvas, env, "#ff0000", null)).not.toThrow();
	});

	it("does not resize or draw a CSS-hidden canvas", () => {
		const getContext = vi.fn();
		const canvas = {
			width: WIDTH,
			height: HEIGHT,
			clientWidth: 0,
			clientHeight: 0,
			getContext,
		} as unknown as HTMLCanvasElement;

		drawEnvPreview(canvas, createEnv(), "#ff0000", null, [], true);

		expect(getContext).not.toHaveBeenCalled();
		expect(canvas.width).toBe(WIDTH);
		expect(canvas.height).toBe(HEIGHT);
	});

	it("handles empty env", () => {
		const canvas = createMockCanvas();
		const env = createEnv({ steps: [], stepCount: 0 });
		expect(() => drawEnvPreview(canvas, env, "#ff0000", null)).not.toThrow();
	});

	it("handles highlighted step without throwing", () => {
		const canvas = createMockCanvas();
		const env = createEnv();
		expect(() =>
			drawEnvPreview(canvas, env, "#ff0000", 1, [], false),
		).not.toThrow();
	});
});
