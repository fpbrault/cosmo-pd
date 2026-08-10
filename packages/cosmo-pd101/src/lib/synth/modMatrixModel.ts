import { MOD_SOURCE_OPTIONS } from "@/components/controls/modulation/modRouteMeta";
import type {
	ModDestination,
	ModMatrix,
	ModMatrixLayout,
	ModMatrixPage,
	ModRoute,
	ModSource,
} from "@/lib/synth/bindings/synth";
import {
	getModDestinationGroups,
	isRegisteredModDestination,
} from "@/lib/synth/modTargets";

export const MOD_MATRIX_PAGE_COUNT = 2;
export const MOD_MATRIX_SLOT_COUNT = 8;

export type ModMatrixSourceSlot = ModSource | null;
export type ModMatrixDestinationSlot = ModDestination | null;

export type ModMatrixPageState = {
	sources: [
		ModMatrixSourceSlot,
		ModMatrixSourceSlot,
		ModMatrixSourceSlot,
		ModMatrixSourceSlot,
		ModMatrixSourceSlot,
		ModMatrixSourceSlot,
		ModMatrixSourceSlot,
		ModMatrixSourceSlot,
	];
	destinations: [
		ModMatrixDestinationSlot,
		ModMatrixDestinationSlot,
		ModMatrixDestinationSlot,
		ModMatrixDestinationSlot,
		ModMatrixDestinationSlot,
		ModMatrixDestinationSlot,
		ModMatrixDestinationSlot,
		ModMatrixDestinationSlot,
	];
};

export type ModMatrixLayoutState = {
	pages: [ModMatrixPageState, ModMatrixPageState];
};

const SOURCE_VALUES = new Set<ModSource>(
	MOD_SOURCE_OPTIONS.map((option) => option.value),
);
const DESTINATION_VALUES = new Set<ModDestination>(
	getModDestinationGroups().flatMap((group) =>
		group.destinations.map((destination) => destination.value),
	),
);

function emptyPage(): ModMatrixPageState {
	return {
		sources: [null, null, null, null, null, null, null, null],
		destinations: [null, null, null, null, null, null, null, null],
	};
}

function uniqueValues<T>(values: T[]): T[] {
	return [...new Set(values)];
}

function isModSource(value: unknown): value is ModSource {
	return typeof value === "string" && SOURCE_VALUES.has(value as ModSource);
}

function isModDestination(value: unknown): value is ModDestination {
	return (
		typeof value === "string" &&
		(isRegisteredModDestination(value as ModDestination) ||
			DESTINATION_VALUES.has(value as ModDestination))
	);
}

function normalizeSlots<T>(
	value: unknown,
	guard: (entry: unknown) => entry is T,
): T[] {
	if (!Array.isArray(value) || value.length !== MOD_MATRIX_SLOT_COUNT) {
		return Array.from({ length: MOD_MATRIX_SLOT_COUNT }, () => null) as T[];
	}

	return value.map((entry) =>
		entry === null || guard(entry) ? entry : null,
	) as T[];
}

function toPageState(value: unknown): ModMatrixPageState | null {
	if (typeof value !== "object" || value === null) {
		return null;
	}

	const candidate = value as Partial<ModMatrixPage>;
	const sources = normalizeSlots<ModSource>(candidate.sources, isModSource);
	const destinations = normalizeSlots<ModDestination>(
		candidate.destinations,
		isModDestination,
	);

	return {
		sources: sources as ModMatrixPageState["sources"],
		destinations: destinations as ModMatrixPageState["destinations"],
	};
}

function routesInOrder(routes: ModRoute[]): {
	sources: ModSource[];
	destinations: ModDestination[];
} {
	return {
		sources: uniqueValues(routes.map((route) => route.source)),
		destinations: uniqueValues(
			routes
				.map((route) => route.destination)
				.filter((destination) => isModDestination(destination)),
		),
	};
}

function fillSlots<T>(values: T[], pageIndex: number): (T | null)[] {
	const pageValues = values.slice(
		pageIndex * MOD_MATRIX_SLOT_COUNT,
		(pageIndex + 1) * MOD_MATRIX_SLOT_COUNT,
	);
	return [
		...pageValues,
		...Array.from(
			{
				length: MOD_MATRIX_SLOT_COUNT - pageValues.length,
			},
			() => null,
		),
	];
}

export function createDefaultModMatrixLayout(
	routes: ModRoute[] = [],
): ModMatrixLayoutState {
	const values = routesInOrder(routes);
	const pages = Array.from(
		{ length: MOD_MATRIX_PAGE_COUNT },
		(_, pageIndex) => {
			const page = emptyPage();
			page.sources = fillSlots(
				values.sources,
				pageIndex,
			) as ModMatrixPageState["sources"];
			page.destinations = fillSlots(
				values.destinations,
				pageIndex,
			) as ModMatrixPageState["destinations"];
			return page;
		},
	) as [ModMatrixPageState, ModMatrixPageState];

	return { pages };
}

export function normalizeModMatrixLayout(
	value: unknown,
	routes: ModRoute[] = [],
): ModMatrixLayoutState {
	if (typeof value !== "object" || value === null) {
		return createDefaultModMatrixLayout(routes);
	}

	const candidate = value as Partial<ModMatrixLayout>;
	if (!Array.isArray(candidate.pages) || candidate.pages.length !== 2) {
		return createDefaultModMatrixLayout(routes);
	}

	const pages = candidate.pages.map(toPageState);
	if (!pages[0] || !pages[1]) {
		return createDefaultModMatrixLayout(routes);
	}

	return {
		pages: [pages[0], pages[1]],
	};
}

export function normalizeModMatrix(
	matrix: ModMatrix | null | undefined,
): ModMatrix {
	const routes = Array.isArray(matrix?.routes) ? matrix.routes : [];
	return {
		routes,
		layout: normalizeModMatrixLayout(matrix?.layout, routes),
	};
}

export function routeKey(
	source: ModSource,
	destination: ModDestination,
): string {
	return `${source}::${destination}`;
}

export function findRoute(
	routes: ModRoute[],
	source: ModSource | null,
	destination: ModDestination | null,
): ModRoute | undefined {
	if (!source || !destination) {
		return undefined;
	}
	return routes.find(
		(route) => route.source === source && route.destination === destination,
	);
}

export function upsertRoute(routes: ModRoute[], route: ModRoute): ModRoute[] {
	const existingIndex = routes.findIndex(
		(candidate) =>
			candidate.source === route.source &&
			candidate.destination === route.destination,
	);
	if (existingIndex < 0) {
		return [...routes, route];
	}

	return routes.map((candidate, index) =>
		index === existingIndex ? { ...candidate, ...route } : candidate,
	);
}

export function updateRoute(
	routes: ModRoute[],
	selected: ModRoute,
	update: Partial<ModRoute>,
): ModRoute[] {
	const index = routes.findIndex(
		(route) =>
			route.source === selected.source &&
			route.destination === selected.destination,
	);
	if (index < 0) {
		return routes;
	}
	return routes.map((route, routeIndex) =>
		routeIndex === index ? { ...route, ...update } : route,
	);
}

export function removeRoute(
	routes: ModRoute[],
	selected: ModRoute,
): ModRoute[] {
	return routes.filter(
		(route) =>
			route.source !== selected.source ||
			route.destination !== selected.destination,
	);
}

function rebindRoute(
	routes: ModRoute[],
	oldSource: ModSource,
	oldDestination: ModDestination,
	nextSource: ModSource,
	nextDestination: ModDestination,
): ModRoute[] {
	const oldIndex = routes.findIndex(
		(route) =>
			route.source === oldSource && route.destination === oldDestination,
	);
	if (oldIndex < 0) {
		return routes;
	}

	const existingIndex = routes.findIndex(
		(route) =>
			route.source === nextSource && route.destination === nextDestination,
	);
	if (existingIndex >= 0 && existingIndex !== oldIndex) {
		return routes.filter((_, index) => index !== oldIndex);
	}

	return routes.map((route, index) =>
		index === oldIndex
			? { ...route, source: nextSource, destination: nextDestination }
			: route,
	);
}

export function rebindSourceSlot(
	routes: ModRoute[],
	page: ModMatrixPageState,
	rowIndex: number,
	nextSource: ModSource | null,
): ModRoute[] {
	const currentSource = page.sources[rowIndex];
	if (!currentSource || !nextSource || currentSource === nextSource) {
		return routes;
	}

	let nextRoutes = routes;
	for (const destination of page.destinations) {
		if (!destination) {
			continue;
		}
		nextRoutes = rebindRoute(
			nextRoutes,
			currentSource,
			destination,
			nextSource,
			destination,
		);
	}
	return nextRoutes;
}

export function rebindDestinationSlot(
	routes: ModRoute[],
	page: ModMatrixPageState,
	columnIndex: number,
	nextDestination: ModDestination | null,
): ModRoute[] {
	const currentDestination = page.destinations[columnIndex];
	if (
		!currentDestination ||
		!nextDestination ||
		currentDestination === nextDestination
	) {
		return routes;
	}

	let nextRoutes = routes;
	for (const source of page.sources) {
		if (!source) {
			continue;
		}
		nextRoutes = rebindRoute(
			nextRoutes,
			source,
			currentDestination,
			source,
			nextDestination,
		);
	}
	return nextRoutes;
}

export function isRoutePlaced(
	route: ModRoute,
	layout: ModMatrixLayoutState,
): boolean {
	return layout.pages.some(
		(page) =>
			page.sources.includes(route.source) &&
			page.destinations.includes(route.destination),
	);
}

export function getUnassignedRoutes(
	routes: ModRoute[],
	layout: ModMatrixLayoutState,
): ModRoute[] {
	return routes.filter((route) => !isRoutePlaced(route, layout));
}
