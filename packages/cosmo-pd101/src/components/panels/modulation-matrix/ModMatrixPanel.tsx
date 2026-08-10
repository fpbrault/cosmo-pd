import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import Button from "@/components/controls/Button";
import {
	MOD_SOURCE_META,
	MOD_SOURCE_OPTIONS,
} from "@/components/controls/modulation/modRouteMeta";
import { useModMatrix } from "@/context/ModMatrixContext";
import { useOptionalSynthController } from "@/features/synth/SynthParamController";
import type {
	ModDestination,
	ModRoute,
	ModSource,
} from "@/lib/synth/bindings/synth";
import {
	findRoute,
	getUnassignedRoutes,
	type ModMatrixLayoutState,
	type ModMatrixPageState,
	normalizeModMatrixLayout,
	rebindDestinationSlot,
	rebindSourceSlot,
	removeRoute,
	updateRoute,
	upsertRoute,
} from "@/lib/synth/modMatrixModel";
import {
	getModDestinationGroups,
	getModDestinationLabel,
} from "@/lib/synth/modTargets";

const DESTINATION_GROUPS = getModDestinationGroups();
const MATRIX_SLOT_KEYS = ["1", "2", "3", "4", "5", "6", "7", "8"] as const;

type MatrixSelection = {
	pageIndex: 0 | 1;
	rowIndex: number;
	columnIndex: number;
};

type SlotPickerState = {
	kind: "source" | "destination";
	index: number;
};

type LiveSourceValues = Partial<Record<ModSource, number>>;

function formatAmount(amount: number): string {
	return `${amount >= 0 ? "+" : ""}${Math.round(amount * 100)}%`;
}

function sourceLabel(source: ModSource | null): string {
	return source ? MOD_SOURCE_META[source].label : "None";
}

function destinationLabel(destination: ModDestination | null): string {
	return destination ? getModDestinationLabel(destination) : "None";
}

function clonePage(page: ModMatrixPageState): ModMatrixPageState {
	return {
		sources: [...page.sources] as ModMatrixPageState["sources"],
		destinations: [...page.destinations] as ModMatrixPageState["destinations"],
	};
}

function withPage(
	layout: ModMatrixLayoutState,
	pageIndex: 0 | 1,
	page: ModMatrixPageState,
): ModMatrixLayoutState {
	return {
		pages: layout.pages.map((currentPage, index) =>
			index === pageIndex ? page : currentPage,
		) as [ModMatrixPageState, ModMatrixPageState],
	};
}

function MatrixSlotPicker({
	kind,
	page,
	index,
	onSelect,
	onClose,
}: {
	kind: "source" | "destination";
	page: ModMatrixPageState;
	index: number;
	onSelect: (value: ModSource | ModDestination | null) => void;
	onClose: () => void;
}) {
	const { t } = useTranslation("synth");
	const [query, setQuery] = useState("");
	const currentValue =
		kind === "source" ? page.sources[index] : page.destinations[index];
	const normalizedQuery = query.trim().toLowerCase();

	const sourceOptions = MOD_SOURCE_OPTIONS.filter((option) =>
		option.label.toLowerCase().includes(normalizedQuery),
	);
	const destinationGroups = DESTINATION_GROUPS.map((group) => ({
		...group,
		destinations: group.destinations.filter((option) =>
			option.label.toLowerCase().includes(normalizedQuery),
		),
	})).filter((group) => group.destinations.length > 0);

	const isUsedInPage = (value: ModSource | ModDestination) =>
		kind === "source"
			? page.sources.some(
					(entry, entryIndex) => entry === value && entryIndex !== index,
				)
			: page.destinations.some(
					(entry, entryIndex) => entry === value && entryIndex !== index,
				);

	return (
		<div className="absolute inset-3 z-30 flex min-h-0 flex-col overflow-hidden rounded-xl border border-cz-light-blue/60 bg-cz-panel shadow-2xl shadow-black/50">
			<div className="flex shrink-0 items-center justify-between border-cz-border/60 border-b bg-cz-surface px-3 py-2">
				<div>
					<div className="font-bold font-mono text-cz-light-blue text-xs uppercase tracking-[0.2em]">
						{t(
							kind === "source"
								? "modMatrix.sourcePickerTitle"
								: "modMatrix.destinationPickerTitle",
						)}
					</div>
					<div className="font-mono text-[0.5rem] text-cz-cream-dim/60 uppercase tracking-[0.16em]">
						{t("modMatrix.slotLabel", { slot: index + 1 })}
					</div>
				</div>
				<Button
					type="button"
					onClick={onClose}
					className="btn btn-ghost btn-square btn-xs text-cz-cream-dim hover:text-cz-cream"
					aria-label={t("modMatrix.closePicker")}
				>
					×
				</Button>
			</div>
			<div className="shrink-0 border-cz-border/50 border-b p-2">
				<input
					type="search"
					value={query}
					onChange={(event) => setQuery(event.target.value)}
					placeholder={t("modMatrix.searchPlaceholder")}
					aria-label={t("modMatrix.searchPlaceholder")}
					className="input input-sm w-full border-cz-border bg-cz-inset font-mono text-cz-cream text-xs placeholder:text-cz-cream-dim/40"
				/>
			</div>
			<div className="scrollbar-thin min-h-0 flex-1 overflow-y-auto p-2">
				<Button
					type="button"
					onClick={() => onSelect(null)}
					className={`btn btn-sm mb-2 w-full justify-start border font-mono text-[0.58rem] uppercase tracking-[0.15em] ${currentValue === null ? "border-cz-light-blue/70 bg-cz-light-blue/20 text-cz-light-blue" : "border-cz-border bg-cz-inset text-cz-cream-dim"}`}
				>
					{t("modMatrix.none")}
				</Button>
				{kind === "source" ? (
					<div className="grid grid-cols-2 gap-1">
						{sourceOptions.map((option) => {
							const selected = option.value === currentValue;
							const used = isUsedInPage(option.value);
							return (
								<Button
									key={option.value}
									type="button"
									disabled={used}
									onClick={() => onSelect(option.value)}
									className={`btn btn-sm h-auto min-h-9 justify-start border px-2 text-left font-mono text-[0.56rem] uppercase tracking-[0.1em] ${MOD_SOURCE_META[option.value].colorClass} ${selected ? "border-current bg-current/25" : "border-current/25 bg-current/10"}`}
								>
									{option.label}
								</Button>
							);
						})}
					</div>
				) : (
					<div className="space-y-2">
						{destinationGroups.map((group) => (
							<div key={group.label}>
								<div className="mb-1 px-1 font-mono text-[0.48rem] text-cz-light-blue/70 uppercase tracking-[0.2em]">
									{group.label}
								</div>
								<div className="grid grid-cols-2 gap-1">
									{group.destinations.map((option) => {
										const selected = option.value === currentValue;
										const used = isUsedInPage(option.value);
										return (
											<Button
												key={option.value}
												type="button"
												disabled={used}
												onClick={() => onSelect(option.value)}
												className={`btn btn-sm h-auto min-h-9 justify-start border px-2 text-left font-mono text-[0.53rem] uppercase leading-tight tracking-[0.08em] ${selected ? "border-cz-light-blue/80 bg-cz-light-blue/20 text-cz-cream" : "border-cz-border bg-cz-inset text-cz-cream-dim hover:border-cz-light-blue/50"}`}
											>
												{option.label}
											</Button>
										);
									})}
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}

function RouteInspector({
	selection,
	page,
	route,
	onOpenSlotPicker,
	onAmountChange,
	onToggleEnabled,
	onRemove,
	onClose,
}: {
	selection: MatrixSelection | null;
	page: ModMatrixPageState;
	route: ModRoute | undefined;
	onOpenSlotPicker: (kind: "source" | "destination", index: number) => void;
	onAmountChange: (amount: number) => void;
	onToggleEnabled: () => void;
	onRemove: () => void;
	onClose: () => void;
}) {
	const { t } = useTranslation("synth");
	const source = selection ? page.sources[selection.rowIndex] : null;
	const destination = selection
		? page.destinations[selection.columnIndex]
		: null;
	const amount = route?.amount ?? 0;

	return (
		<aside className="flex min-h-0 min-w-[12rem] flex-1 flex-col overflow-hidden rounded-xl border border-cz-border/70 bg-cz-inset/70">
			<div className="flex shrink-0 items-center justify-between border-cz-border/60 border-b px-3 py-2">
				<div className="font-bold font-mono text-[0.58rem] text-cz-light-blue uppercase tracking-[0.2em]">
					{t("modMatrix.inspectorTitle")}
				</div>
				{selection ? (
					<Button
						type="button"
						onClick={onClose}
						className="btn btn-ghost btn-square btn-xs text-cz-cream-dim hover:text-cz-cream"
						aria-label={t("modMatrix.closeInspector")}
					>
						×
					</Button>
				) : null}
			</div>
			{selection && source && destination ? (
				<div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-3">
					<div className="space-y-2">
						<div className="font-mono text-[0.48rem] text-cz-cream-dim/60 uppercase tracking-[0.18em]">
							{t("modMatrix.sourceHeading")}
						</div>
						<Button
							type="button"
							onClick={() => onOpenSlotPicker("source", selection.rowIndex)}
							className="btn btn-sm w-full justify-between border border-cz-light-blue/35 bg-cz-surface font-mono text-[0.58rem] text-cz-cream uppercase tracking-[0.12em]"
						>
							<span>{sourceLabel(source)}</span>
							<span className="text-cz-light-blue">↗</span>
						</Button>
					</div>
					<div className="space-y-2">
						<div className="font-mono text-[0.48rem] text-cz-cream-dim/60 uppercase tracking-[0.18em]">
							{t("modMatrix.destinationHeading")}
						</div>
						<Button
							type="button"
							onClick={() =>
								onOpenSlotPicker("destination", selection.columnIndex)
							}
							className="btn btn-sm w-full justify-between border border-cz-light-blue/35 bg-cz-surface font-mono text-[0.54rem] text-cz-cream uppercase tracking-[0.08em]"
						>
							<span className="truncate">{destinationLabel(destination)}</span>
							<span className="text-cz-light-blue">↗</span>
						</Button>
					</div>
					<div className="space-y-2 rounded-lg border border-cz-border/60 bg-cz-surface p-2">
						<div className="flex items-center justify-between font-mono text-[0.48rem] text-cz-cream-dim/60 uppercase tracking-[0.18em]">
							<span>{t("modMatrix.depthLabel")}</span>
							<strong className="text-cz-cream">{formatAmount(amount)}</strong>
						</div>
						<input
							type="range"
							min={-1}
							max={1}
							step={0.01}
							value={amount}
							onChange={(event) => onAmountChange(Number(event.target.value))}
							aria-label={t("modMatrix.depthLabel")}
							className="range range-sm w-full"
						/>
						<input
							type="number"
							min={-100}
							max={100}
							step={1}
							value={Math.round(amount * 100)}
							onChange={(event) =>
								onAmountChange(
									Math.max(-1, Math.min(1, Number(event.target.value) / 100)),
								)
							}
							aria-label={t("modMatrix.depthPercentAria")}
							className="input input-xs w-full border-cz-border bg-cz-inset text-center font-mono text-cz-cream"
						/>
					</div>
					<label className="flex items-center justify-between rounded-lg border border-cz-border/50 bg-cz-surface px-2 py-2 font-mono text-[0.5rem] text-cz-cream-dim uppercase tracking-[0.14em]">
						<span>{t("modMatrix.enabled")}</span>
						<input
							type="checkbox"
							className="toggle toggle-secondary toggle-sm"
							checked={route?.enabled ?? true}
							onChange={onToggleEnabled}
							aria-label={t("modMatrix.enabled")}
						/>
					</label>
					<Button
						type="button"
						onClick={onRemove}
						className="btn btn-sm w-full border border-error/40 bg-error/10 font-mono text-[0.52rem] text-error uppercase tracking-[0.16em] hover:bg-error/20"
					>
						{t("modMatrix.removeRoute")}
					</Button>
				</div>
			) : (
				<div className="flex min-h-0 flex-1 items-center justify-center p-4 text-center font-mono text-[0.53rem] text-cz-cream-dim/55 uppercase leading-relaxed tracking-[0.15em]">
					{t("modMatrix.inspectorEmpty")}
				</div>
			)}
		</aside>
	);
}

export default function ModMatrixPanel() {
	const { t } = useTranslation("synth");
	const { modMatrix, setModMatrix } = useModMatrix();
	const controller = useOptionalSynthController();
	const routes = modMatrix.routes ?? [];
	const layout = useMemo(
		() => normalizeModMatrixLayout(modMatrix.layout, routes),
		[modMatrix.layout, routes],
	);
	const [activePage, setActivePage] = useState<0 | 1>(0);
	const [selection, setSelection] = useState<MatrixSelection | null>(null);
	const [picker, setPicker] = useState<SlotPickerState | null>(null);
	const [liveSources, setLiveSources] = useState<LiveSourceValues>({});

	useEffect(() => {
		if (!controller) {
			return;
		}
		const release = controller.registerLiveModSourcesConsumer();
		setLiveSources(controller.getLiveSources());
		const onLiveSources = (event: Event) => {
			const detail = (event as CustomEvent<LiveSourceValues | undefined>)
				.detail;
			if (detail) {
				setLiveSources(detail);
			}
		};
		window.addEventListener("cz-runtime-mod-sources", onLiveSources);
		return () => {
			release();
			window.removeEventListener("cz-runtime-mod-sources", onLiveSources);
		};
	}, [controller]);

	const page = layout.pages[activePage];
	const selectedPage = selection ? layout.pages[selection.pageIndex] : page;
	const selectedSource = selection
		? selectedPage.sources[selection.rowIndex]
		: null;
	const selectedDestination = selection
		? selectedPage.destinations[selection.columnIndex]
		: null;
	const selectedRoute = findRoute(routes, selectedSource, selectedDestination);
	const unassignedRoutes = getUnassignedRoutes(routes, layout);

	const commit = (
		nextRoutes: ModRoute[] = routes,
		nextLayout: ModMatrixLayoutState = layout,
	) => {
		setModMatrix({ ...modMatrix, routes: nextRoutes, layout: nextLayout });
	};

	const handleSlotSelect = (
		kind: "source" | "destination",
		index: number,
		value: ModSource | ModDestination | null,
	) => {
		const currentPage = layout.pages[activePage];
		const nextPage = clonePage(currentPage);
		let nextRoutes = routes;
		if (kind === "source") {
			nextRoutes = rebindSourceSlot(
				routes,
				currentPage,
				index,
				value as ModSource | null,
			);
			nextPage.sources[index] = value as ModSource | null;
		} else {
			nextRoutes = rebindDestinationSlot(
				routes,
				currentPage,
				index,
				value as ModDestination | null,
			);
			nextPage.destinations[index] = value as ModDestination | null;
		}
		commit(nextRoutes, withPage(layout, activePage, nextPage));
		setPicker(null);
	};

	const handleCellClick = (rowIndex: number, columnIndex: number) => {
		const source = page.sources[rowIndex];
		const destination = page.destinations[columnIndex];
		if (!source) {
			setPicker({ kind: "source", index: rowIndex });
			return;
		}
		if (!destination) {
			setPicker({ kind: "destination", index: columnIndex });
			return;
		}

		const route = findRoute(routes, source, destination);
		if (!route) {
			commit(
				upsertRoute(routes, {
					source,
					destination,
					amount: 0,
					enabled: true,
				}),
				layout,
			);
		}
		setSelection({ pageIndex: activePage, rowIndex, columnIndex });
	};

	const handlePlaceRoute = (route: ModRoute) => {
		for (const [pageIndex, candidatePage] of layout.pages.entries()) {
			const sourceIndex = candidatePage.sources.indexOf(route.source);
			const destinationIndex = candidatePage.destinations.indexOf(
				route.destination,
			);
			const nextSourceIndex =
				sourceIndex >= 0 ? sourceIndex : candidatePage.sources.indexOf(null);
			const nextDestinationIndex =
				destinationIndex >= 0
					? destinationIndex
					: candidatePage.destinations.indexOf(null);
			if (nextSourceIndex < 0 || nextDestinationIndex < 0) {
				continue;
			}

			const nextPage = clonePage(candidatePage);
			nextPage.sources[nextSourceIndex] = route.source;
			nextPage.destinations[nextDestinationIndex] = route.destination;
			const nextLayout = withPage(layout, pageIndex as 0 | 1, nextPage);
			commit(routes, nextLayout);
			setActivePage(pageIndex as 0 | 1);
			setSelection({
				pageIndex: pageIndex as 0 | 1,
				rowIndex: nextSourceIndex,
				columnIndex: nextDestinationIndex,
			});
			return;
		}
	};

	const handleAmountChange = (amount: number) => {
		if (!selectedRoute) {
			return;
		}
		commit(updateRoute(routes, selectedRoute, { amount }));
	};

	const handleToggleEnabled = () => {
		if (!selectedRoute) {
			return;
		}
		commit(
			updateRoute(routes, selectedRoute, { enabled: !selectedRoute.enabled }),
		);
	};

	const handleRemove = () => {
		if (!selectedRoute) {
			return;
		}
		commit(removeRoute(routes, selectedRoute));
		setSelection(null);
	};

	return (
		<section className="relative flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-cz-border bg-cz-surface p-2 shadow-lg">
			<div className="flex shrink-0 items-center justify-between gap-2 border-cz-border/60 border-b px-1 pb-2">
				<div className="flex items-center gap-2">
					<span className="font-bold font-mono text-cz-light-blue text-sm uppercase tracking-[0.24em]">
						{t("modMatrix.title")}
					</span>
					<span className="rounded-full border border-cz-light-blue/40 bg-cz-light-blue/15 px-1.5 font-bold font-mono text-[0.48rem] text-cz-light-blue">
						{routes.length}
					</span>
					{unassignedRoutes.length > 0 ? (
						<span className="rounded-full border border-amber-400/40 bg-amber-400/10 px-1.5 font-bold font-mono text-[0.48rem] text-amber-300">
							{t("modMatrix.unassignedCount", {
								count: unassignedRoutes.length,
							})}
						</span>
					) : null}
				</div>
				<div className="flex gap-1">
					{([0, 1] as const).map((pageIndex) => (
						<Button
							key={pageIndex}
							type="button"
							onClick={() => {
								setActivePage(pageIndex);
								setSelection(null);
							}}
							className={`btn btn-xs min-h-7 border px-3 font-bold font-mono text-[0.52rem] uppercase tracking-[0.16em] ${activePage === pageIndex ? "border-cz-light-blue/70 bg-cz-light-blue/20 text-cz-cream" : "border-cz-border bg-cz-inset text-cz-cream-dim"}`}
							aria-label={t("modMatrix.pageAria", { page: pageIndex + 1 })}
						>
							{pageIndex === 0 ? "1–8" : "9–16"}
						</Button>
					))}
				</div>
			</div>

			<div className="relative min-h-0 flex-1 overflow-hidden pt-2">
				<div className="@container/matrix flex h-full min-h-0 flex-col gap-2 overflow-hidden [container-type:inline-size]">
					<div className="min-h-0 flex-[1.7] overflow-auto rounded-xl border border-cz-border/60 bg-cz-inset/70 p-1">
						<div className="grid min-w-[37rem] grid-cols-[5.5rem_repeat(8,minmax(3.25rem,1fr))] gap-px rounded-lg bg-cz-border/40 p-px">
							<div className="rounded-tl-md bg-cz-surface p-2 font-mono text-[0.46rem] text-cz-cream-dim/50 uppercase tracking-[0.16em]">
								{t("modMatrix.sourcesHeading")}
							</div>
							{MATRIX_SLOT_KEYS.map((slotKey, columnIndex) => {
								const destination = page.destinations[columnIndex];
								return (
									<button
										key={`destination-${slotKey}`}
										type="button"
										onClick={() =>
											setPicker({ kind: "destination", index: columnIndex })
										}
										className={`min-h-14 rounded-t-md bg-cz-surface px-1 py-2 text-center font-mono text-[0.48rem] uppercase leading-tight tracking-[0.06em] transition-colors hover:bg-cz-light-blue/15 ${destination ? "text-cz-cream" : "text-cz-cream-dim/40"}`}
										aria-label={t("modMatrix.destinationSlotAria", {
											slot: columnIndex + 1,
										})}
									>
										<span className="line-clamp-3">
											{destinationLabel(destination)}
										</span>
										<span className="mt-1 block text-cz-light-blue/70">⌄</span>
									</button>
								);
							})}

							{MATRIX_SLOT_KEYS.map((rowSlotKey, rowIndex) => {
								const source = page.sources[rowIndex];
								return (
									<div key={`row-${rowSlotKey}`} className="contents">
										<button
											type="button"
											onClick={() =>
												setPicker({ kind: "source", index: rowIndex })
											}
											className={`flex min-h-12 flex-col justify-center rounded-l-md bg-cz-surface px-2 text-left font-mono text-[0.52rem] uppercase tracking-[0.08em] transition-colors hover:bg-cz-light-blue/15 ${source ? MOD_SOURCE_META[source].colorClass : "text-cz-cream-dim/40"}`}
											aria-label={t("modMatrix.sourceSlotAria", {
												slot: rowIndex + 1,
											})}
										>
											<span className="truncate">{sourceLabel(source)}</span>
											<progress
												className="progress progress-info mt-1 h-1 w-full bg-cz-border/60"
												max={1}
												value={
													source
														? Math.min(1, Math.abs(liveSources[source] ?? 0))
														: 0
												}
												aria-label={t("modMatrix.sourceActivityAria", {
													source: sourceLabel(source),
												})}
											/>
										</button>
										{MATRIX_SLOT_KEYS.map((columnSlotKey, columnIndex) => {
											const destination = page.destinations[columnIndex];
											const route = findRoute(routes, source, destination);
											const isSelected =
												selection?.pageIndex === activePage &&
												selection.rowIndex === rowIndex &&
												selection.columnIndex === columnIndex;
											const liveValue = source
												? Math.abs(liveSources[source] ?? 0)
												: 0;
											const activity = route?.enabled
												? Math.min(1, Math.abs(route.amount ?? 0) * liveValue)
												: 0;
											const activityClass =
												activity > 0.66
													? "opacity-70"
													: activity > 0.2
														? "opacity-40"
														: "opacity-20";
											return (
												<button
													key={`cell-${rowSlotKey}-${columnSlotKey}`}
													type="button"
													onClick={() => handleCellClick(rowIndex, columnIndex)}
													className={`relative min-h-12 rounded-md border px-1 font-mono text-[0.58rem] transition-all duration-100 ${
														isSelected
															? "border-cz-cream bg-cz-light-blue/35 text-cz-cream shadow-[0_0_0_1px_rgba(255,255,255,0.2)]"
															: route?.enabled
																? "border-cz-light-blue/45 bg-cz-light-blue/20 text-cz-cream hover:bg-cz-light-blue/30"
																: route
																	? "border-cz-border/60 bg-cz-border/20 text-cz-cream-dim/45"
																	: "border-cz-border/45 bg-cz-panel/70 text-cz-cream-dim/25 hover:border-cz-light-blue/50 hover:bg-cz-light-blue/10"
													}`}
													aria-label={t("modMatrix.cellAria", {
														source: sourceLabel(source),
														destination: destinationLabel(destination),
													})}
												>
													{route ? formatAmount(route.amount ?? 0) : "·"}
													{activity > 0 ? (
														<span
															className={`pointer-events-none absolute inset-0 rounded-md bg-cz-light-blue/30 ${activityClass}`}
														/>
													) : null}
												</button>
											);
										})}
									</div>
								);
							})}
						</div>
					</div>

					<div className="flex min-h-48 flex-1 @lg/matrix:flex-row flex-col">
						<RouteInspector
							selection={selection}
							page={selectedPage}
							route={selectedRoute}
							onOpenSlotPicker={(kind, index) => setPicker({ kind, index })}
							onAmountChange={handleAmountChange}
							onToggleEnabled={handleToggleEnabled}
							onRemove={handleRemove}
							onClose={() => setSelection(null)}
						/>
						{unassignedRoutes.length > 0 ? (
							<div className="@lg/matrix:mt-0 mt-2 @lg/matrix:ml-2 min-h-0 flex-1 overflow-y-auto rounded-xl border border-amber-400/30 bg-amber-400/5 p-2">
								<div className="mb-2 flex items-center justify-between font-mono text-[0.48rem] text-amber-300 uppercase tracking-[0.18em]">
									<span>{t("modMatrix.unassignedTitle")}</span>
									<span>{unassignedRoutes.length}</span>
								</div>
								<div className="space-y-1">
									{unassignedRoutes.map((route) => (
										<div
											key={`${route.source}-${route.destination}`}
											className="flex items-center justify-between gap-2 rounded-md border border-amber-400/20 bg-cz-inset/60 px-2 py-1.5"
										>
											<div className="min-w-0 font-mono text-[0.48rem] text-cz-cream-dim uppercase tracking-[0.08em]">
												<div className="truncate">
													{sourceLabel(route.source)}
												</div>
												<div className="truncate text-cz-cream-dim/60">
													→ {destinationLabel(route.destination)}
												</div>
											</div>
											<Button
												type="button"
												onClick={() => handlePlaceRoute(route)}
												className="btn btn-xs border-amber-400/40 bg-amber-400/10 font-mono text-[0.48rem] text-amber-300 uppercase"
											>
												{t("modMatrix.placeRoute")}
											</Button>
										</div>
									))}
								</div>
							</div>
						) : null}
					</div>
				</div>
				{picker ? (
					<MatrixSlotPicker
						kind={picker.kind}
						page={page}
						index={picker.index}
						onSelect={(value) =>
							handleSlotSelect(picker.kind, picker.index, value)
						}
						onClose={() => setPicker(null)}
					/>
				) : null}
			</div>
		</section>
	);
}
