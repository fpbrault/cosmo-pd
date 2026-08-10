import { MOD_SOURCE_OPTIONS } from "@/components/controls/modulation/modRouteMeta";
import type {
	ModDestination,
	ModMatrix,
	ModMatrixCell,
	ModMatrixPage,
	ModRoute,
	ModSource,
} from "@/lib/synth/bindings/synth";
import {
	getModDestinationGroups,
	isRegisteredModDestination,
} from "@/lib/synth/modTargets";

export const MOD_MATRIX_PAGE_COUNT = 3;
export const MOD_MATRIX_SLOT_COUNT = 8;

export type ModMatrixSourceSlot = ModSource | null;
export type ModMatrixDestinationSlot = ModDestination | null;
export type ModMatrixCellState = ModMatrixCell;

type ModMatrixCellRow = [
	ModMatrixCellState | null,
	ModMatrixCellState | null,
	ModMatrixCellState | null,
	ModMatrixCellState | null,
	ModMatrixCellState | null,
	ModMatrixCellState | null,
	ModMatrixCellState | null,
	ModMatrixCellState | null,
];

export type ModMatrixCellGrid = [
	ModMatrixCellRow,
	ModMatrixCellRow,
	ModMatrixCellRow,
	ModMatrixCellRow,
	ModMatrixCellRow,
	ModMatrixCellRow,
	ModMatrixCellRow,
	ModMatrixCellRow,
];

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
	cells: ModMatrixCellGrid;
};

export type ModMatrixPagesState = [
	ModMatrixPageState,
	ModMatrixPageState,
	ModMatrixPageState,
];

export type ModMatrixLayoutState = {
	pages: ModMatrixPagesState;
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
		cells: emptyCellGrid(),
	};
}

function emptyCellGrid(): ModMatrixCellGrid {
	return Array.from({ length: MOD_MATRIX_SLOT_COUNT }, () =>
		Array.from({ length: MOD_MATRIX_SLOT_COUNT }, () => null),
	) as ModMatrixCellGrid;
}

function cloneCellGrid(cells: ModMatrixCellGrid): ModMatrixCellGrid {
	return cells.map((row) =>
		row.map((cell) => (cell ? { ...cell } : null)),
	) as ModMatrixCellGrid;
}

function clonePage(page: ModMatrixPageState): ModMatrixPageState {
	return {
		sources: [...page.sources] as ModMatrixPageState["sources"],
		destinations: [...page.destinations] as ModMatrixPageState["destinations"],
		cells: cloneCellGrid(page.cells),
	};
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

function normalizeCellGrid(value: unknown): ModMatrixCellGrid {
	if (!Array.isArray(value) || value.length !== MOD_MATRIX_SLOT_COUNT) {
		return emptyCellGrid();
	}

	return value.map((row) => {
		if (!Array.isArray(row) || row.length !== MOD_MATRIX_SLOT_COUNT) {
			return Array.from({ length: MOD_MATRIX_SLOT_COUNT }, () => null);
		}
		return row.map((cell) => {
			if (
				typeof cell !== "object" ||
				cell === null ||
				typeof cell.amount !== "number" ||
				!Number.isFinite(cell.amount) ||
				typeof cell.enabled !== "boolean"
			) {
				return null;
			}
			return {
				amount: Math.max(-1, Math.min(1, cell.amount)),
				enabled: cell.enabled,
			};
		});
	}) as ModMatrixCellGrid;
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
	const cells = normalizeCellGrid(candidate.cells);

	return {
		sources: sources as ModMatrixPageState["sources"],
		destinations: destinations as ModMatrixPageState["destinations"],
		cells,
	};
}

export function createDefaultModMatrixLayout(
	routes: ModRoute[] = [],
): ModMatrixLayoutState {
	const pages = Array.from({ length: MOD_MATRIX_PAGE_COUNT }, () =>
		emptyPage(),
	) as ModMatrixPagesState;

	return autoPlaceRoutes(routes, { pages });
}

function hydrateRoutesIntoCells(
	routes: ModRoute[],
	layout: ModMatrixLayoutState,
): ModMatrixLayoutState {
	const pages = layout.pages.map(clonePage) as ModMatrixPagesState;
	const cursors = new Map<string, number>();

	for (const route of routes) {
		const key = routeKey(route.source, route.destination);
		const positions: Array<{
			pageIndex: number;
			rowIndex: number;
			columnIndex: number;
		}> = [];
		for (const [pageIndex, page] of pages.entries()) {
			for (let rowIndex = 0; rowIndex < MOD_MATRIX_SLOT_COUNT; rowIndex += 1) {
				if (page.sources[rowIndex] !== route.source) {
					continue;
				}
				for (
					let columnIndex = 0;
					columnIndex < MOD_MATRIX_SLOT_COUNT;
					columnIndex += 1
				) {
					if (page.destinations[columnIndex] === route.destination) {
						positions.push({ pageIndex, rowIndex, columnIndex });
					}
				}
			}
		}

		const cursor = cursors.get(key) ?? 0;
		const position = positions[cursor] ?? positions[0];
		if (!position) {
			continue;
		}
		cursors.set(key, cursor + 1);
		if (
			pages[position.pageIndex].cells[position.rowIndex][
				position.columnIndex
			] === null
		) {
			pages[position.pageIndex].cells[position.rowIndex][position.columnIndex] =
				{
					amount: Math.max(-1, Math.min(1, route.amount ?? 0)),
					enabled: route.enabled,
				};
		}
	}

	return { pages };
}

export type NormalizeModMatrixLayoutOptions = {
	/** Routes that were newly introduced and should receive visible slots. */
	autoPlaceRoutes?: ModRoute[];
};

export function normalizeModMatrixLayout(
	value: unknown,
	routes: ModRoute[] = [],
	options: NormalizeModMatrixLayoutOptions = {},
): ModMatrixLayoutState {
	if (typeof value !== "object" || value === null) {
		return createDefaultModMatrixLayout(routes);
	}

	const candidate = value as { pages?: unknown };
	if (
		!Array.isArray(candidate.pages) ||
		(candidate.pages.length !== 2 &&
			candidate.pages.length !== MOD_MATRIX_PAGE_COUNT)
	) {
		return createDefaultModMatrixLayout(routes);
	}

	const pages = candidate.pages.map(toPageState);
	if (pages.some((page): page is null => page === null)) {
		return createDefaultModMatrixLayout(routes);
	}

	const normalizedPages = [
		...pages,
		...(pages.length === 2 ? [emptyPage()] : []),
	] as ModMatrixPagesState;

	const hydrated = hydrateRoutesIntoCells(routes, { pages: normalizedPages });
	return autoPlaceRoutes(options.autoPlaceRoutes ?? routes, hydrated);
}

/**
 * Ensure every route that fits in the editor has a visible source/destination
 * pair without changing the user's existing slot order or assignments.
 */
export function autoPlaceRoutes(
	routes: ModRoute[],
	layout: ModMatrixLayoutState,
): ModMatrixLayoutState {
	const pages = layout.pages.map(clonePage) as ModMatrixPagesState;

	for (const route of routes) {
		if (hasRouteCell(route, { pages })) {
			continue;
		}

		let best:
			| {
					pageIndex: number;
					sourceIndex: number;
					destinationIndex: number;
					score: number;
			  }
			| undefined;

		for (const [pageIndex, page] of pages.entries()) {
			const sourceIndex = page.sources.indexOf(route.source);
			const destinationIndex = page.destinations.indexOf(route.destination);
			const availableSourceIndex = page.sources.indexOf(null);
			const availableDestinationIndex = page.destinations.indexOf(null);

			let score = -1;
			if (sourceIndex >= 0 && destinationIndex >= 0) {
				score = 0;
			} else if (sourceIndex >= 0 && availableDestinationIndex >= 0) {
				score = 1;
			} else if (destinationIndex >= 0 && availableSourceIndex >= 0) {
				score = 2;
			} else if (availableSourceIndex >= 0 && availableDestinationIndex >= 0) {
				score = 3;
			}

			if (
				score >= 0 &&
				(!best ||
					score < best.score ||
					(score === best.score && pageIndex < best.pageIndex))
			) {
				best = {
					pageIndex,
					sourceIndex: sourceIndex >= 0 ? sourceIndex : availableSourceIndex,
					destinationIndex:
						destinationIndex >= 0
							? destinationIndex
							: availableDestinationIndex,
					score,
				};
			}
		}

		if (!best || best.sourceIndex < 0 || best.destinationIndex < 0) {
			continue;
		}

		pages[best.pageIndex].sources[best.sourceIndex] = route.source;
		pages[best.pageIndex].destinations[best.destinationIndex] =
			route.destination;
		pages[best.pageIndex].cells[best.sourceIndex][best.destinationIndex] = {
			amount: Math.max(-1, Math.min(1, route.amount ?? 0)),
			enabled: route.enabled,
		};
	}

	return { pages };
}

/** Apply route edits originating outside the matrix to their existing cells. */
export function updateChangedModMatrixCells(
	previousRoutes: ModRoute[],
	nextRoutes: ModRoute[],
	layout: ModMatrixLayoutState,
): ModMatrixLayoutState {
	const pages = layout.pages.map(clonePage) as ModMatrixPagesState;
	const remaining = [...previousRoutes];

	for (const route of nextRoutes) {
		const previousIndex = remaining.findIndex(
			(candidate) =>
				candidate.source === route.source &&
				candidate.destination === route.destination,
		);
		if (previousIndex < 0) {
			continue;
		}
		const previous = remaining.splice(previousIndex, 1)[0];
		if (
			previous.amount === route.amount &&
			previous.enabled === route.enabled
		) {
			continue;
		}
		for (const page of pages) {
			for (let rowIndex = 0; rowIndex < MOD_MATRIX_SLOT_COUNT; rowIndex += 1) {
				if (page.sources[rowIndex] !== route.source) {
					continue;
				}
				for (
					let columnIndex = 0;
					columnIndex < MOD_MATRIX_SLOT_COUNT;
					columnIndex += 1
				) {
					if (
						page.destinations[columnIndex] === route.destination &&
						page.cells[rowIndex][columnIndex]
					) {
						page.cells[rowIndex][columnIndex] = {
							amount: Math.max(-1, Math.min(1, route.amount ?? 0)),
							enabled: route.enabled,
						};
					}
				}
			}
		}
	}

	return { pages };
}

function hasRouteCell(route: ModRoute, layout: ModMatrixLayoutState): boolean {
	return layout.pages.some((page) =>
		page.sources.some(
			(source, rowIndex) =>
				source === route.source &&
				page.destinations.some(
					(destination, columnIndex) =>
						destination === route.destination &&
						page.cells[rowIndex][columnIndex] !== null,
				),
		),
	);
}

/** Build the audio-facing route collection from the active cell values. */
export function syncModMatrixRoutes(
	layout: ModMatrixLayoutState,
	fallbackRoutes: ModRoute[] = [],
): ModRoute[] {
	const routes: ModRoute[] = [];
	const representedPairs = new Map<string, number>();

	for (const page of layout.pages) {
		for (let rowIndex = 0; rowIndex < MOD_MATRIX_SLOT_COUNT; rowIndex += 1) {
			const source = page.sources[rowIndex];
			if (!source) {
				continue;
			}
			for (
				let columnIndex = 0;
				columnIndex < MOD_MATRIX_SLOT_COUNT;
				columnIndex += 1
			) {
				const destination = page.destinations[columnIndex];
				const cell = page.cells[rowIndex][columnIndex];
				if (!destination || !cell) {
					continue;
				}
				const key = routeKey(source, destination);
				representedPairs.set(key, (representedPairs.get(key) ?? 0) + 1);
				routes.push({
					source,
					destination,
					amount: cell.amount,
					enabled: cell.enabled,
				});
			}
		}
	}

	const fallbackPairUsage = new Map<string, number>();
	for (const route of fallbackRoutes) {
		const key = routeKey(route.source, route.destination);
		const used = fallbackPairUsage.get(key) ?? 0;
		if (used < (representedPairs.get(key) ?? 0)) {
			fallbackPairUsage.set(key, used + 1);
			continue;
		}
		routes.push(route);
	}

	return routes;
}

export function normalizeModMatrix(
	matrix: ModMatrix | null | undefined,
): ModMatrix {
	const routes = Array.isArray(matrix?.routes) ? matrix.routes : [];
	const layout = normalizeModMatrixLayout(matrix?.layout, routes);
	return {
		routes: syncModMatrixRoutes(layout, routes),
		layout,
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
