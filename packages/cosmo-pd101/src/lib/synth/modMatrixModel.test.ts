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
	syncModMatrixRoutes,
	updateChangedModMatrixCells,
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
	it("creates a deterministic three-page layout from route order", () => {
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
		expect(
			layout.pages[2].destinations.every((destination) => destination === null),
		).toBe(true);
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
				],
			} as unknown,
			routes,
		);

		expect(layout.pages[0].sources[0]).toBe("lfo1");
		expect(layout.pages[0].sources[1]).toBe(null);
		expect(layout.pages[0].destinations[0]).toBe("volume");
		expect(layout.pages[2].sources.every((source) => source === null)).toBe(
			true,
		);
	});

	it("automatically places routes added after an existing layout", () => {
		const initialRoutes = [route("lfo1", "volume")];
		const layout = createDefaultModMatrixLayout(initialRoutes);
		const normalized = normalizeModMatrixLayout(layout, [
			...initialRoutes,
			route("modWheel", "pitch"),
		]);

		expect(normalized.pages[0].sources.slice(0, 2)).toEqual([
			"lfo1",
			"modWheel",
		]);
		expect(normalized.pages[0].destinations.slice(0, 2)).toEqual([
			"volume",
			"pitch",
		]);
	});

	it("pads legacy two-page layouts without displacing explicit assignments", () => {
		const layout = normalizeModMatrixLayout(
			{
				pages: [
					{
						sources: ["modWheel", ...Array(7).fill(null)],
						destinations: ["pitch", ...Array(7).fill(null)],
					},
					{
						sources: Array(8).fill(null),
						destinations: Array(8).fill(null),
					},
				],
			} as unknown,
			[route("modWheel", "pitch")],
		);

		expect(layout.pages[0].sources[0]).toBe("modWheel");
		expect(layout.pages[0].destinations[0]).toBe("pitch");
		expect(layout.pages[2].sources.every((source) => source === null)).toBe(
			true,
		);
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

	it("keeps cell values independent from source and destination labels", () => {
		const original = createDefaultModMatrixLayout([
			route("lfo1", "volume", 0.4),
		]);
		const cleared = {
			pages: original.pages.map((page, pageIndex) =>
				pageIndex === 0
					? {
							...page,
							sources: [null, ...page.sources.slice(1)] as typeof page.sources,
						}
					: page,
			) as typeof original.pages,
		};

		expect(syncModMatrixRoutes(cleared)).toEqual([]);
		cleared.pages[0].sources[0] = "lfo1";
		expect(syncModMatrixRoutes(cleared)).toEqual([
			route("lfo1", "volume", 0.4),
		]);
	});

	it("keeps duplicate source and destination slots as separate cells", () => {
		const layout = createDefaultModMatrixLayout();
		layout.pages[0].sources[0] = "lfo1";
		layout.pages[0].sources[1] = "lfo1";
		layout.pages[0].destinations[0] = "volume";
		layout.pages[0].destinations[1] = "volume";
		layout.pages[0].cells[0][0] = { amount: 0.1, enabled: true };
		layout.pages[0].cells[1][1] = { amount: 0.8, enabled: true };

		expect(syncModMatrixRoutes(layout)).toEqual([
			route("lfo1", "volume", 0.1),
			route("lfo1", "volume", 0.8),
		]);
	});

	it("updates only the changed occurrence of duplicate routes", () => {
		const layout = createDefaultModMatrixLayout();
		layout.pages[0].sources[0] = "lfo1";
		layout.pages[0].sources[1] = "lfo1";
		layout.pages[0].destinations[0] = "volume";
		layout.pages[0].destinations[1] = "volume";
		layout.pages[0].cells[0][0] = { amount: 0.1, enabled: true };
		layout.pages[0].cells[1][1] = { amount: 0.8, enabled: true };

		const updated = updateChangedModMatrixCells(
			[route("lfo1", "volume", 0.1), route("lfo1", "volume", 0.8)],
			[route("lfo1", "volume", 0.1), route("lfo1", "volume", 0.9)],
			layout,
		);

		expect(updated.pages[0].cells[0][0]).toEqual({
			amount: 0.1,
			enabled: true,
		});
		expect(updated.pages[0].cells[1][1]).toEqual({
			amount: 0.9,
			enabled: true,
		});
		expect(syncModMatrixRoutes(updated)).toEqual([
			route("lfo1", "volume", 0.1),
			route("lfo1", "volume", 0.9),
		]);
	});

	it("clears a represented cell when its route is removed externally", () => {
		const routeToRemove = route("lfo1", "volume", 0.5);
		const layout = createDefaultModMatrixLayout([routeToRemove]);

		const updated = updateChangedModMatrixCells([routeToRemove], [], layout);

		expect(updated.pages[0].cells[0][0]).toBeNull();
		expect(syncModMatrixRoutes(updated)).toEqual([]);
	});

	it("treats duplicate cells as assigned occurrences", () => {
		const routes = [
			route("lfo1", "volume", 0.1),
			route("lfo1", "volume", 0.8),
			route("lfo1", "volume", 0.9),
		];
		const layout = createDefaultModMatrixLayout();
		layout.pages[0].sources[0] = "lfo1";
		layout.pages[0].sources[1] = "lfo1";
		layout.pages[0].destinations[0] = "volume";
		layout.pages[0].destinations[1] = "volume";
		layout.pages[0].cells[0][0] = { amount: 0.1, enabled: true };
		layout.pages[0].cells[1][1] = { amount: 0.8, enabled: true };

		expect(getUnassignedRoutes(routes, layout)).toEqual([routes[2]]);
	});
});
