import { describe, expect, it } from "vitest";
import type {
	ModDestination,
	ModRoute,
	ModSource,
} from "@/lib/synth/bindings/synth";
import {
	createDefaultModMatrixLayout,
	findRoute,
	getUnassignedRoutes,
	normalizeModMatrixLayout,
	rebindDestinationSlot,
	rebindSourceSlot,
	removeRoute,
	updateRoute,
	upsertRoute,
} from "./modMatrixModel";

function route(
	source: ModSource,
	destination: ModDestination,
	amount = 0.25,
): ModRoute {
	return { source, destination, amount, enabled: true };
}

describe("modMatrixModel", () => {
	it("creates a deterministic two-page layout from route order", () => {
		const routes = [
			route("lfo2", "pitch"),
			route("lfo1", "volume"),
			route("lfo2", "filterCutoff"),
		];

		const layout = createDefaultModMatrixLayout(routes);

		expect(layout.pages[0].sources.slice(0, 2)).toEqual(["lfo2", "lfo1"]);
		expect(layout.pages[0].destinations.slice(0, 3)).toEqual([
			"pitch",
			"volume",
			"filterCutoff",
		]);
		expect(layout.pages[1].sources.every((source) => source === null)).toBe(
			true,
		);
	});

	it("falls back safely when persisted pages are malformed", () => {
		const routes = [route("lfo1", "volume")];
		const layout = normalizeModMatrixLayout(
			{
				pages: [
					{
						sources: ["lfo1", "not-a-source", ...Array(6).fill(null)],
						destinations: Array(8).fill(null),
					},
					{
						sources: Array(8).fill(null),
						destinations: Array(8).fill(null),
					},
				],
			} as unknown,
			routes,
		);

		expect(layout.pages[0].sources[0]).toBe("lfo1");
		expect(layout.pages[0].sources[1]).toBe(null);
		expect(
			layout.pages[0].destinations.every((destination) => destination === null),
		).toBe(true);
	});

	it("upserts the canonical route for a source and destination pair", () => {
		const initial = [route("lfo1", "volume", 0.1)];
		const next = upsertRoute(initial, route("lfo1", "volume", 0.8));

		expect(next).toEqual([route("lfo1", "volume", 0.8)]);
		expect(initial).toEqual([route("lfo1", "volume", 0.1)]);
		expect(findRoute(next, "lfo1", "pitch")).toBeUndefined();
	});

	it("merges a populated source-slot collision into the existing canonical route", () => {
		const layout = createDefaultModMatrixLayout([
			route("lfo1", "volume"),
			route("lfo2", "volume"),
		]);
		const routes = [route("lfo1", "volume", 0.2), route("lfo2", "volume", 0.8)];

		const next = rebindSourceSlot(routes, layout.pages[0], 0, "lfo2");

		expect(next).toEqual([route("lfo2", "volume", 0.8)]);
	});

	it("rebinds destination slots and preserves unrelated routes", () => {
		const layout = createDefaultModMatrixLayout([
			route("lfo1", "volume"),
			route("lfo2", "volume"),
			route("lfo1", "pitch"),
		]);
		const routes = [
			route("lfo1", "volume", 0.2),
			route("lfo2", "volume", 0.8),
			route("lfo1", "pitch", 0.4),
		];

		const next = rebindDestinationSlot(routes, layout.pages[0], 0, "pitch");

		expect(next).toEqual([
			route("lfo2", "pitch", 0.8),
			route("lfo1", "pitch", 0.4),
		]);
	});

	it("tracks routes that are not represented on a page", () => {
		const routes = [route("lfo1", "volume"), route("modWheel", "pitch")];
		const layout = createDefaultModMatrixLayout([routes[0]]);

		expect(getUnassignedRoutes(routes, layout)).toEqual([routes[1]]);
		expect(removeRoute(routes, routes[0])).toEqual([routes[1]]);
		expect(updateRoute(routes, routes[0], { amount: -0.5 })[0]?.amount).toBe(
			-0.5,
		);
	});
});
