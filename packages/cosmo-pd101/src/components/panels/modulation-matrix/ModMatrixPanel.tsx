import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
	MdPanTool,
	MdShowChart,
	MdShuffle,
	MdSpeed,
	MdTimeline,
	MdTouchApp,
	MdTune,
	MdWaves,
} from "react-icons/md";
import Button from "@/components/controls/Button";
import {
	MOD_SOURCE_META,
	MOD_SOURCE_OPTIONS,
} from "@/components/controls/modulation/modRouteMeta";
import { useModMatrix } from "@/context/ModMatrixContext";
import { useOptionalSynthController } from "@/features/synth/SynthParamController";
import type { ModDestination, ModSource } from "@/lib/synth/bindings/synth";
import {
	MOD_MATRIX_PAGE_COUNT,
	MOD_MATRIX_SLOT_COUNT,
	type ModMatrixLayoutState,
	type ModMatrixPageState,
	normalizeModMatrixLayout,
	syncModMatrixRoutes,
} from "@/lib/synth/modMatrixModel";
import {
	getModDestinationGroups,
	getModDestinationLabel,
	getModDestinationStyle,
} from "@/lib/synth/modTargets";
import ModMatrixAmountCell from "./ModMatrixAmountCell";

const DESTINATION_GROUPS = getModDestinationGroups();
const MATRIX_SLOT_KEYS = Array.from(
	{ length: MOD_MATRIX_SLOT_COUNT },
	(_, index) => String(index + 1),
);
const PAGE_INDICES = [0, 1, 2] as const;
const ACTIVITY_SEGMENT_KEYS = ["a", "b", "c", "d", "e"] as const;
type MatrixPageIndex = (typeof PAGE_INDICES)[number];

type MatrixSelection = {
	pageIndex: MatrixPageIndex;
	rowIndex: number;
	columnIndex: number;
};

type SlotPickerState = {
	kind: "source" | "destination";
	index: number;
};

type LiveSourceValues = Partial<Record<ModSource, number>>;

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
		cells: page.cells.map((row) =>
			row.map((cell) => (cell ? { ...cell } : null)),
		) as ModMatrixPageState["cells"],
	};
}

function withPage(
	layout: ModMatrixLayoutState,
	pageIndex: MatrixPageIndex,
	page: ModMatrixPageState,
): ModMatrixLayoutState {
	return {
		pages: layout.pages.map((currentPage, index) =>
			index === pageIndex ? page : currentPage,
		) as ModMatrixLayoutState["pages"],
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
	type DestinationView =
		| { kind: "groups" }
		| { kind: "group"; groupLabel: string }
		| { kind: "envelopeBranches" }
		| { kind: "envelopeBranch"; branchLabel: string };

	const { t } = useTranslation("synth");
	const [query, setQuery] = useState("");
	const [destinationView, setDestinationView] = useState<DestinationView>({
		kind: "groups",
	});
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

	const envelopeGroup = DESTINATION_GROUPS.find(
		(group) => group.label === "Envelopes",
	);
	const envelopeBranches = useMemo(() => {
		const branches = new Map<
			string,
			{ value: ModDestination; label: string }[]
		>();
		for (const option of envelopeGroup?.destinations ?? []) {
			const branchLabel =
				option.label.match(/^(L[12] (?:DCO|DCW|DCA))/)?.[1] ?? "Envelope";
			const branch = branches.get(branchLabel) ?? [];
			branch.push(option);
			branches.set(branchLabel, branch);
		}
		return Array.from(branches.entries()).map(([label, destinations]) => ({
			label,
			destinations,
		}));
	}, [envelopeGroup]);

	const selectedInGroup = (destinations: { value: ModDestination }[]) =>
		typeof currentValue === "string" &&
		destinations.some((option) => option.value === currentValue);

	const sourceIcon = (source: ModSource) => {
		switch (source) {
			case "lfo1":
			case "lfo2":
				return <MdWaves aria-hidden="true" />;
			case "random":
				return <MdShuffle aria-hidden="true" />;
			case "modEnv":
				return <MdTimeline aria-hidden="true" />;
			case "velocity":
				return <MdSpeed aria-hidden="true" />;
			case "modWheel":
				return <MdPanTool aria-hidden="true" />;
			case "aftertouch":
				return <MdTouchApp aria-hidden="true" />;
			default:
				return <MdTune aria-hidden="true" />;
		}
	};

	const destinationIcon = (label: string) => {
		if (label === "Global") {
			return <MdShowChart aria-hidden="true" />;
		}
		if (label === "Envelopes") {
			return <MdTimeline aria-hidden="true" />;
		}
		if (label === "Modulation") {
			return <MdWaves aria-hidden="true" />;
		}
		return <MdTune aria-hidden="true" />;
	};

	const renderDestinationOption = (
		option: { value: ModDestination; label: string },
		compact = false,
	) => {
		const style = getModDestinationStyle(option.value);
		return (
			<Button
				key={option.value}
				type="button"
				onClick={() => onSelect(option.value)}
				className={`btn btn-sm h-auto min-h-9 justify-start border px-2 text-left font-mono text-[0.5rem] uppercase leading-tight tracking-[0.06em] ${currentValue === option.value ? "border-cz-cream bg-cz-light-blue/30 text-cz-cream" : `${style.borderClass} ${style.bgClass} ${style.textClass} hover:brightness-125`} ${compact ? "min-h-8" : ""}`}
			>
				{option.label}
			</Button>
		);
	};

	return (
		<div className="absolute inset-0 z-30 flex min-h-0 flex-col overflow-hidden rounded-xl border border-cz-light-blue/70 bg-[#06151a] shadow-2xl shadow-black/70">
			<div className="flex shrink-0 items-center justify-between border-cz-light-blue/25 border-b bg-cz-surface/95 px-3 py-2.5">
				<div className="flex min-w-0 items-center gap-2">
					{kind === "destination" && destinationView.kind !== "groups" ? (
						<Button
							type="button"
							onClick={() =>
								setDestinationView(
									destinationView.kind === "envelopeBranch"
										? { kind: "envelopeBranches" }
										: { kind: "groups" },
								)
							}
							className="btn btn-ghost btn-square btn-xs text-cz-light-blue"
							aria-label="Back to destination groups"
						>
							←
						</Button>
					) : null}
					<div className="min-w-0">
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
				</div>
				<Button
					type="button"
					onClick={onClose}
					className="btn btn-ghost btn-square btn-sm text-cz-light-blue hover:bg-cz-light-blue/10 hover:text-cz-cream"
					aria-label={t("modMatrix.closePicker")}
				>
					×
				</Button>
			</div>
			<div className="shrink-0 border-cz-light-blue/20 border-b bg-cz-surface/60 p-2">
				<input
					type="search"
					value={query}
					onChange={(event) => setQuery(event.target.value)}
					placeholder={t("modMatrix.searchPlaceholder")}
					aria-label={t("modMatrix.searchPlaceholder")}
					className="input input-sm w-full border-cz-light-blue/25 bg-cz-inset font-mono text-cz-cream text-xs placeholder:text-cz-cream-dim/40"
				/>
			</div>
			<div className="shrink-0 border-cz-light-blue/20 border-b bg-cz-surface/60 p-2">
				<Button
					type="button"
					onClick={() => onSelect(null)}
					className={`btn btn-sm mb-2 min-h-10 w-full justify-start border font-mono text-[0.58rem] uppercase tracking-[0.15em] ${currentValue === null ? "border-cz-light-blue/80 bg-cz-light-blue/25 text-cz-cream" : "border-cz-border bg-cz-inset text-cz-cream-dim"}`}
				>
					{t("modMatrix.none")}
				</Button>
			</div>
			<div
				className={`min-h-0 flex-1 touch-pan-y overscroll-contain p-2 ${kind === "destination" && (normalizedQuery || destinationView.kind === "group" || destinationView.kind === "envelopeBranch") ? "scrollbar-thin overflow-y-auto" : "overflow-hidden"}`}
			>
				{kind === "source" ? (
					<div className="grid @sm/matrix:grid-cols-4 grid-cols-3 gap-1">
						{sourceOptions.map((option) => {
							const selected = option.value === currentValue;
							return (
								<Button
									key={option.value}
									type="button"
									className={`btn btn-sm h-auto min-h-12 flex-col justify-center gap-0.5 border px-1 text-center font-mono text-[0.48rem] uppercase leading-tight tracking-[0.04em] ${MOD_SOURCE_META[option.value].colorClass} ${selected ? "border-current bg-current/30" : "border-current/25 bg-current/10"}`}
									onClick={() => onSelect(option.value)}
								>
									<span className="text-base leading-none">
										{sourceIcon(option.value)}
									</span>
									{option.label}
								</Button>
							);
						})}
					</div>
				) : normalizedQuery ? (
					<div className="space-y-2">
						{destinationGroups.map((group) => (
							<div key={group.label}>
								<div className="mb-1 px-1 font-mono text-[0.45rem] text-cz-light-blue/75 uppercase tracking-[0.16em]">
									{group.label}
								</div>
								<div className="grid @sm/matrix:grid-cols-3 grid-cols-2 gap-1">
									{group.destinations.map((option) =>
										renderDestinationOption(option, true),
									)}
								</div>
							</div>
						))}
					</div>
				) : destinationView.kind === "groups" ? (
					<div className="grid @sm/matrix:grid-cols-3 grid-cols-2 gap-1.5">
						{DESTINATION_GROUPS.map((group) => {
							const groupStyle = getModDestinationStyle(
								group.destinations[0]?.value ?? "volume",
							);
							return (
								<Button
									key={group.label}
									type="button"
									onClick={() =>
										setDestinationView(
											group.label === "Envelopes"
												? { kind: "envelopeBranches" }
												: { kind: "group", groupLabel: group.label },
										)
									}
									className={`btn btn-sm h-auto min-h-14 flex-col justify-center gap-1 border px-1 font-mono text-[0.5rem] uppercase tracking-[0.08em] ${selectedInGroup(group.destinations) ? "border-cz-cream bg-cz-light-blue/25 text-cz-cream" : `${groupStyle.borderClass} ${groupStyle.bgClass} ${groupStyle.textClass} hover:brightness-125`}`}
								>
									<span className="text-base leading-none">
										{destinationIcon(group.label)}
									</span>
									<span>{group.label}</span>
									<span className="text-[0.42rem] text-cz-cream-dim/55">
										{group.destinations.length}
									</span>
								</Button>
							);
						})}
					</div>
				) : destinationView.kind === "envelopeBranches" ? (
					<div className="grid @sm/matrix:grid-cols-3 grid-cols-2 gap-1.5">
						{envelopeBranches.map((branch) => {
							const branchStyle = getModDestinationStyle(
								branch.destinations[0]?.value ?? "line1DcwBase",
							);
							return (
								<Button
									key={branch.label}
									type="button"
									onClick={() =>
										setDestinationView({
											kind: "envelopeBranch",
											branchLabel: branch.label,
										})
									}
									className={`btn btn-sm min-h-12 border px-1 font-mono text-[0.48rem] uppercase tracking-[0.05em] ${selectedInGroup(branch.destinations) ? "border-cz-cream bg-cz-light-blue/25 text-cz-cream" : `${branchStyle.borderClass} ${branchStyle.bgClass} ${branchStyle.textClass} hover:brightness-125`}`}
								>
									{branch.label}
								</Button>
							);
						})}
					</div>
				) : destinationView.kind === "envelopeBranch" ? (
					<div className="grid @sm/matrix:grid-cols-3 grid-cols-2 gap-1">
						{envelopeBranches
							.find((branch) => branch.label === destinationView.branchLabel)
							?.destinations.map((option) =>
								renderDestinationOption(
									{
										...option,
										label: option.label.replace(/^.*Step /, "Step "),
									},
									true,
								),
							)}
					</div>
				) : (
					<div className="grid @sm/matrix:grid-cols-3 grid-cols-2 gap-1">
						{DESTINATION_GROUPS.find(
							(group) => group.label === destinationView.groupLabel,
						)?.destinations.map((option) =>
							renderDestinationOption(option, true),
						)}
					</div>
				)}
			</div>
		</div>
	);
}

export default function ModMatrixPanel() {
	const { t } = useTranslation("synth");
	const { modMatrix, setModMatrix } = useModMatrix();
	const controller = useOptionalSynthController();
	const routes = modMatrix.routes ?? [];
	const layout = useMemo(
		() =>
			normalizeModMatrixLayout(modMatrix.layout, routes, {
				autoPlaceRoutes: [],
			}),
		[modMatrix.layout, routes],
	);
	const [activePage, setActivePage] = useState<MatrixPageIndex>(0);
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

	const commit = (nextLayout: ModMatrixLayoutState = layout) => {
		const normalizedLayout = normalizeModMatrixLayout(nextLayout, [], {
			autoPlaceRoutes: [],
		});
		setModMatrix({
			...modMatrix,
			routes: syncModMatrixRoutes(normalizedLayout),
			layout: normalizedLayout,
		});
	};

	const handleSlotSelect = (
		kind: "source" | "destination",
		index: number,
		value: ModSource | ModDestination | null,
	) => {
		const currentPage = layout.pages[activePage];
		const nextPage = clonePage(currentPage);
		if (kind === "source") {
			nextPage.sources[index] = value as ModSource | null;
		} else {
			nextPage.destinations[index] = value as ModDestination | null;
		}
		commit(withPage(layout, activePage, nextPage));
		setPicker(null);
	};

	const handleCellActivate = (rowIndex: number, columnIndex: number) => {
		const nextPage = clonePage(page);
		if (!nextPage.cells[rowIndex][columnIndex]) {
			nextPage.cells[rowIndex][columnIndex] = {
				amount: 0,
				enabled: true,
			};
			commit(withPage(layout, activePage, nextPage));
		}
		setSelection({ pageIndex: activePage, rowIndex, columnIndex });
	};

	const handleCellChange = (
		rowIndex: number,
		columnIndex: number,
		amount: number,
	) => {
		const nextPage = clonePage(page);
		nextPage.cells[rowIndex][columnIndex] = {
			amount,
			enabled: nextPage.cells[rowIndex][columnIndex]?.enabled ?? true,
		};
		commit(withPage(layout, activePage, nextPage));
		setSelection({ pageIndex: activePage, rowIndex, columnIndex });
	};

	const handleCellClear = (rowIndex: number, columnIndex: number) => {
		const nextPage = clonePage(page);
		nextPage.cells[rowIndex][columnIndex] = null;
		commit(withPage(layout, activePage, nextPage));
		setSelection(null);
	};

	return (
		<section className="relative flex h-full min-h-0 min-w-0 flex-col overflow-hidden rounded-xl border border-cz-border bg-cz-surface p-1.5 shadow-lg">
			<div className="flex shrink-0 items-center justify-between gap-2 border-cz-light-blue/45 border-b px-1 pb-1.5">
				<div className="flex min-w-0 items-center gap-1.5">
					<span className="truncate font-bold font-mono text-cz-light-blue text-xs uppercase tracking-[0.2em]">
						{t("modMatrix.title")}
					</span>
					<span className="rounded-full border border-cz-light-blue/40 bg-cz-light-blue/15 px-1.5 font-bold font-mono text-[0.46rem] text-cz-light-blue">
						{routes.length}
					</span>
				</div>
			</div>

			<div className="grid shrink-0 grid-cols-3 gap-px border-cz-light-blue/45 border-b bg-cz-light-blue/20 pt-1">
				{PAGE_INDICES.slice(0, MOD_MATRIX_PAGE_COUNT).map((pageIndex) => (
					<Button
						key={pageIndex}
						type="button"
						onClick={() => {
							setActivePage(pageIndex);
							setSelection(null);
						}}
						className={`btn btn-sm min-h-8 rounded-none border-0 px-2 font-bold font-mono text-[0.55rem] uppercase tracking-[0.16em] ${activePage === pageIndex ? "bg-cz-light-blue/25 text-cz-cream" : "bg-cz-inset text-cz-cream-dim hover:bg-cz-light-blue/10"}`}
						aria-label={t("modMatrix.pageAria", { page: pageIndex + 1 })}
					>
						{`${pageIndex * MOD_MATRIX_SLOT_COUNT + 1}–${(pageIndex + 1) * MOD_MATRIX_SLOT_COUNT}`}
					</Button>
				))}
			</div>

			<div className="relative min-h-0 min-w-0 flex-1 overflow-hidden pt-1.5">
				<div className="@container/matrix relative h-full min-h-0 min-w-0 touch-pan-x touch-pan-y overflow-auto overscroll-contain rounded-lg border border-cz-border/60 bg-cz-inset/70 p-1 [container-type:inline-size]">
					<div className="grid min-w-0 grid-cols-[clamp(3.25rem,20%,4.5rem)_repeat(8,minmax(0,1fr))] gap-px rounded-md bg-cz-border/45 p-px">
						<div className="rounded-tl-md bg-cz-surface p-1.5 font-mono text-[0.44rem] text-cz-cream-dim/55 uppercase tracking-[0.14em]">
							{t("modMatrix.sourcesHeading")}
						</div>
						{MATRIX_SLOT_KEYS.map((slotKey, columnIndex) => {
							const destination = page.destinations[columnIndex];
							const destinationStyle = destination
								? getModDestinationStyle(destination)
								: undefined;
							return (
								<button
									key={`destination-${slotKey}`}
									type="button"
									onClick={() =>
										setPicker({ kind: "destination", index: columnIndex })
									}
									className={`min-h-14 rounded-t-md px-0.5 py-1.5 text-center font-mono text-[0.48rem] uppercase leading-tight tracking-[0.04em] transition-colors hover:brightness-125 ${destination ? `${destinationStyle?.bgClass} ${destinationStyle?.borderClass} ${destinationStyle?.textClass}` : "bg-cz-surface text-cz-cream-dim/35"}`}
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
							const liveValue = source
								? Math.min(1, Math.abs(liveSources[source] ?? 0))
								: 0;
							return (
								<div key={`row-${rowSlotKey}`} className="contents">
									<button
										type="button"
										onClick={() =>
											setPicker({ kind: "source", index: rowIndex })
										}
										className={`flex h-full min-h-0 flex-col justify-center rounded-l-md bg-cz-surface px-1 text-left font-mono text-[0.45rem] uppercase tracking-[0.04em] transition-colors hover:bg-cz-light-blue/15 ${source ? MOD_SOURCE_META[source].colorClass : "text-cz-cream-dim/35"}`}
										aria-label={t("modMatrix.sourceSlotAria", {
											slot: rowIndex + 1,
										})}
									>
										<span className="truncate">{sourceLabel(source)}</span>
										<span className="mt-1 flex gap-px" aria-hidden="true">
											{ACTIVITY_SEGMENT_KEYS.map((segmentKey, index) => (
												<span
													key={segmentKey}
													className={`h-1 flex-1 rounded-[1px] ${
														index < Math.round(liveValue * 5)
															? "bg-cz-light-blue"
															: "bg-cz-border/60"
													}`}
												/>
											))}
										</span>
									</button>
									{MATRIX_SLOT_KEYS.map((columnSlotKey, columnIndex) => {
										const destination = page.destinations[columnIndex];
										const cell = page.cells[rowIndex][columnIndex];
										const route =
											source && destination && cell
												? {
														source,
														destination,
														amount: cell.amount,
														enabled: cell.enabled,
													}
												: undefined;
										const isSelected =
											selection?.pageIndex === activePage &&
											selection.rowIndex === rowIndex &&
											selection.columnIndex === columnIndex;
										const activity = route?.enabled
											? Math.min(1, Math.abs(route.amount ?? 0) * liveValue)
											: 0;
										return (
											<ModMatrixAmountCell
												key={`cell-${rowSlotKey}-${columnSlotKey}`}
												route={route}
												cell={cell}
												source={source}
												destination={destination}
												selected={isSelected}
												activity={activity}
												clearHint={t("modMatrix.cellClearHint")}
												ariaLabel={t("modMatrix.cellAria", {
													source: sourceLabel(source),
													destination: destinationLabel(destination),
												})}
												onActivate={() =>
													handleCellActivate(rowIndex, columnIndex)
												}
												onChange={(amount) =>
													handleCellChange(rowIndex, columnIndex, amount)
												}
												onClear={() => handleCellClear(rowIndex, columnIndex)}
											/>
										);
									})}
								</div>
							);
						})}
					</div>
				</div>
				{picker ? (
					<MatrixSlotPicker
						key={`${picker.kind}-${picker.index}`}
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
