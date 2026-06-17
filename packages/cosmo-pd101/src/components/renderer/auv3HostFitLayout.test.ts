import { describe, expect, it } from "vitest";
import {
	AUV3_FALLBACK_ASPECT_RATIO,
	AUV3_RENDERER_NATURAL_HEIGHT,
	computeAuv3HostFitLayout,
} from "./auv3HostFitLayout";

function requireLayout(layout: ReturnType<typeof computeAuv3HostFitLayout>) {
	expect(layout).not.toBeNull();
	if (!layout) {
		throw new Error("expected AUv3 layout");
	}
	return layout;
}

function expectFits(
	layout: NonNullable<ReturnType<typeof computeAuv3HostFitLayout>>,
	hostWidth: number,
	hostHeight: number,
) {
	expect(layout.scaledWidth).toBeLessThanOrEqual(hostWidth + 0.001);
	expect(layout.scaledHeight).toBeLessThanOrEqual(hostHeight + 0.001);
}

describe("computeAuv3HostFitLayout", () => {
	it("fits the design-height canvas into the minimum host size", () => {
		const layout = computeAuv3HostFitLayout({
			hostWidth: 640,
			hostHeight: 480,
			deviceLandscapeAspectRatio: 4 / 3,
		});

		const actual = requireLayout(layout);
		expect(actual.naturalHeight).toBe(AUV3_RENDERER_NATURAL_HEIGHT);
		expect(actual.naturalWidth).toBeCloseTo(1216, 5);
		expect(actual.scale).toBeCloseTo(640 / 1216, 5);
		expectFits(actual, 640, 480);
	});

	it("fits a portrait host while preserving the device landscape ratio", () => {
		const layout = computeAuv3HostFitLayout({
			hostWidth: 480,
			hostHeight: 640,
			deviceLandscapeAspectRatio: 4 / 3,
		});

		const actual = requireLayout(layout);
		expect(actual.scaledWidth / actual.scaledHeight).toBeCloseTo(4 / 3, 5);
		expectFits(actual, 480, 640);
	});

	it("preserves a wide device ratio", () => {
		const layout = computeAuv3HostFitLayout({
			hostWidth: 800,
			hostHeight: 600,
			deviceLandscapeAspectRatio: 16 / 11,
		});

		const actual = requireLayout(layout);
		expect(actual.aspectRatio).toBeCloseTo(16 / 11, 5);
		expect(actual.scaledWidth / actual.scaledHeight).toBeCloseTo(16 / 11, 5);
		expectFits(actual, 800, 600);
	});

	it("fits when height is constrained", () => {
		const layout = computeAuv3HostFitLayout({
			hostWidth: 1200,
			hostHeight: 500,
			deviceLandscapeAspectRatio: 4 / 3,
		});

		const actual = requireLayout(layout);
		expect(actual.scaledHeight).toBeCloseTo(500, 5);
		expectFits(actual, 1200, 500);
	});

	it("fits when width is constrained", () => {
		const layout = computeAuv3HostFitLayout({
			hostWidth: 500,
			hostHeight: 1200,
			deviceLandscapeAspectRatio: 4 / 3,
		});

		const actual = requireLayout(layout);
		expect(actual.scaledWidth).toBeCloseTo(500, 5);
		expectFits(actual, 500, 1200);
	});

	it("does not upscale above maxScale", () => {
		const layout = computeAuv3HostFitLayout({
			hostWidth: 3000,
			hostHeight: 3000,
			deviceLandscapeAspectRatio: 4 / 3,
			maxScale: 1,
		});

		expect(layout?.scale).toBe(1);
	});

	it("upscales to fill larger AUv3 hosts by default", () => {
		const layout = computeAuv3HostFitLayout({
			hostWidth: 3000,
			hostHeight: 3000,
			deviceLandscapeAspectRatio: 4 / 3,
		});

		const actual = requireLayout(layout);
		expect(actual.scale).toBeGreaterThan(1);
		expect(actual.scaledWidth).toBeCloseTo(3000, 5);
		expectFits(actual, 3000, 3000);
	});

	it("falls back for invalid ratios", () => {
		const layout = computeAuv3HostFitLayout({
			hostWidth: 640,
			hostHeight: 480,
			deviceLandscapeAspectRatio: Number.NaN,
		});

		expect(layout?.aspectRatio).toBe(AUV3_FALLBACK_ASPECT_RATIO);
	});
});
