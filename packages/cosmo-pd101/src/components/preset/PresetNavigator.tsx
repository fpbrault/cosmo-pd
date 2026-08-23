import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { BiLibrary } from "react-icons/bi";
import { MdSave } from "react-icons/md";
import Button from "@/components/controls/Button";
import MidiLearnOverlay from "@/components/controls/MidiLearnOverlay";
import { useHoverInfoHandlers } from "@/components/layout/HoverInfo";
import { useMidiLearnTarget } from "@/features/synth/hooks/useMidiLearnTarget";
import type { PresetEntry } from "@/features/synth/types/presetEntry";
import PresetQuickSelect from "./PresetQuickSelect";
import PresetSaveAsDialog from "./PresetSaveAsDialog";

export type PresetNavigatorProps = {
	presetCount: number;
	entries: PresetEntry[];
	activeEntry: PresetEntry | null;
	activePresetName: string;
	activePresetNameBase: string;
	isPresetDirty: boolean;
	persistenceDisabled: boolean;
	onStepPreset: (direction: -1 | 1) => void;
	onActivatePreset: (entryId: string) => Promise<void>;
	onNavigationEntriesChange: (entryIds: string[]) => void;
	onSetPresetFavorite: (id: string, favorite: boolean) => Promise<void>;
	onSavePreset: (name: string) => Promise<void>;
	onSavePresetAs: (name: string) => Promise<void>;
	isLibraryModeOpen?: boolean;
	onLibraryModeChange?: (open: boolean) => void;
};

function ArrowIcon({ direction }: { direction: "left" | "right" }) {
	return (
		<svg
			viewBox="0 -960 960 960"
			className={`h-10 w-10 fill-cz-cream ${direction === "right" ? "rotate-180" : ""}`}
			xmlns="http://www.w3.org/2000/svg"
			aria-hidden="true"
		>
			<path d="M640-197 200-477l440-280v560Zm-60-280Zm0 171v-342L311-477l269 171Z" />
		</svg>
	);
}

export default function PresetNavigator({
	presetCount,
	entries,
	activeEntry,
	activePresetName,
	activePresetNameBase,
	isPresetDirty,
	persistenceDisabled,
	onStepPreset,
	onActivatePreset,
	onNavigationEntriesChange,
	onSetPresetFavorite,
	onSavePreset,
	onSavePresetAs,
	isLibraryModeOpen = false,
	onLibraryModeChange,
}: PresetNavigatorProps) {
	const { t } = useTranslation("synth");
	const screenTriggerRef = useRef<HTMLButtonElement>(null);
	const [quickSelectOpen, setQuickSelectOpen] = useState(false);
	const [openedWithTouch, setOpenedWithTouch] = useState(false);
	const [favoriteSaving, setFavoriteSaving] = useState(false);
	const [saving, setSaving] = useState(false);
	const [saveAsOpen, setSaveAsOpen] = useState(false);
	const [saveAsName, setSaveAsName] = useState("");

	const previousTooltip = t("tooltips.presetNavigator.previous");
	const nextTooltip = t("tooltips.presetNavigator.next");
	const libraryTooltip = isLibraryModeOpen
		? t("tooltips.presetNavigator.closeLibrary")
		: t("tooltips.presetNavigator.openLibrary");
	const quickSelectTooltip = t("tooltips.presetNavigator.quickSelect");
	const favoriteTooltip = activeEntry?.favorite
		? t("tooltips.presetNavigator.removeFavorite")
		: t("tooltips.presetNavigator.addFavorite");
	const saveTooltip =
		activeEntry?.type === "local"
			? isPresetDirty
				? t("tooltips.presetNavigator.save")
				: t("tooltips.presetNavigator.saved")
			: t("tooltips.presetNavigator.saveAs");

	const previousHoverHandlers = useHoverInfoHandlers(previousTooltip);
	const nextHoverHandlers = useHoverInfoHandlers(nextTooltip);
	const libraryHoverHandlers = useHoverInfoHandlers(libraryTooltip);
	const quickSelectHoverHandlers = useHoverInfoHandlers(quickSelectTooltip);
	const favoriteHoverHandlers = useHoverInfoHandlers(favoriteTooltip);
	const saveHoverHandlers = useHoverInfoHandlers(saveTooltip);

	const previousMidiLearn = useMidiLearnTarget({
		targetKey: "presetPrevious",
		label: t("presetNavigator.previousPresetMidi"),
		mode: "edge-trigger",
		threshold: 64,
		apply: () => onStepPreset(-1),
	});
	const nextMidiLearn = useMidiLearnTarget({
		targetKey: "presetNext",
		label: t("presetNavigator.nextPresetMidi"),
		mode: "edge-trigger",
		threshold: 64,
		apply: () => onStepPreset(1),
	});

	const metadata = activeEntry
		? `${activeEntry.bankName ?? activeEntry.sourceLabel} · ${activeEntry.author.trim() || t("synthHeader.unknownAuthor")}`
		: t("synthHeader.currentState");
	const saveDisabled =
		persistenceDisabled ||
		saving ||
		(activeEntry?.type === "local" && !isPresetDirty);

	const toggleLibrary = () => {
		setQuickSelectOpen(false);
		onLibraryModeChange?.(!isLibraryModeOpen);
	};

	const toggleQuickSelect = () => {
		if (isLibraryModeOpen) {
			onLibraryModeChange?.(false);
		}
		setQuickSelectOpen((open) => !open);
	};

	const toggleFavorite = async () => {
		if (!activeEntry || persistenceDisabled || favoriteSaving) return;
		setFavoriteSaving(true);
		try {
			await onSetPresetFavorite(activeEntry.id, !activeEntry.favorite);
		} finally {
			setFavoriteSaving(false);
		}
	};

	const save = async () => {
		if (saveDisabled) return;
		if (activeEntry?.type !== "local") {
			setSaveAsName(activePresetNameBase);
			setSaveAsOpen(true);
			return;
		}

		setSaving(true);
		try {
			await onSavePreset(activeEntry.label);
		} finally {
			setSaving(false);
		}
	};

	const commitSaveAs = async () => {
		const name = saveAsName.trim();
		if (!name || saving) return;
		setSaving(true);
		try {
			await onSavePresetAs(name);
			setSaveAsOpen(false);
			setSaveAsName("");
		} finally {
			setSaving(false);
		}
	};

	return (
		<div className="relative w-full max-w-3xl">
			<div className="flex items-center gap-1">
				<Button
					type="button"
					className={`cz-btn-arrow shrink-0 text-cz-cream-dim hover:text-cz-cream ${isLibraryModeOpen ? "ring-1 ring-cz-gold" : ""}`}
					onClick={toggleLibrary}
					aria-expanded={isLibraryModeOpen}
					aria-label={
						isLibraryModeOpen
							? t("presetNavigator.closeLibrary")
							: t("presetNavigator.openLibrary")
					}
					title={libraryTooltip}
					data-hover-info={libraryTooltip}
					{...libraryHoverHandlers}
				>
					<BiLibrary
						className="!h-6 !w-6 !fill-current !stroke-none"
						aria-hidden="true"
					/>
				</Button>

				<MidiLearnOverlay
					midiLearnState={previousMidiLearn.midiLearnState}
					className="rounded-sm"
					wrapperClassName="inline-flex shrink-0"
				>
					<Button
						type="button"
						className="cz-btn-arrow"
						onClick={() => {
							if (previousMidiLearn.learnMode) {
								previousMidiLearn.onClick();
								return;
							}
							onStepPreset(-1);
						}}
						onContextMenu={previousMidiLearn.onContextMenu}
						disabled={presetCount === 0}
						aria-label={t("presetNavigator.previousPreset")}
						title={previousTooltip}
						data-hover-info={previousTooltip}
						{...previousHoverHandlers}
					>
						<ArrowIcon direction="left" />
					</Button>
				</MidiLearnOverlay>

				<div className="relative isolate flex min-w-0 flex-1 items-stretch overflow-hidden rounded-lg border border-[#818d93] bg-[linear-gradient(180deg,#c2cdd0_0%,#b8c3c7_52%,#aeb8bc_100%)] text-[#5d6d74] shadow-[inset_0_0_0_1px_rgba(84,99,107,0.45),inset_0_1px_0_rgba(226,232,235,0.22)]">
					<div
						aria-hidden="true"
						className="pointer-events-none absolute inset-0 bg-[radial-gradient(130%_180%_at_50%_0%,rgba(235,241,244,0.2)_0%,rgba(210,220,225,0.08)_44%,rgba(0,0,0,0)_78%)]"
					/>
					<div
						aria-hidden="true"
						className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(94,111,118,0.11)_0px,rgba(94,111,118,0.11)_1px,transparent_1px,transparent_3px)] opacity-26"
					/>
					<div
						aria-hidden="true"
						className="pointer-events-none absolute inset-px rounded-md border border-[#6b7c83]/42"
					/>

					<button
						type="button"
						className="relative z-1 flex min-h-12 min-w-11 touch-manipulation items-center justify-center text-xl transition-colors hover:text-[#3f5057] disabled:text-[#6d7c82]/45"
						onClick={() => void toggleFavorite()}
						disabled={!activeEntry || persistenceDisabled || favoriteSaving}
						aria-label={
							activeEntry?.favorite
								? t("presetNavigator.removeFavorite", {
										name: activeEntry.label,
									})
								: t("presetNavigator.addFavorite", {
										name: activeEntry?.label ?? activePresetNameBase,
									})
						}
						title={favoriteTooltip}
						data-hover-info={favoriteTooltip}
						{...favoriteHoverHandlers}
					>
						<span
							className={activeEntry?.favorite ? "text-[#5d6d74]" : ""}
							aria-hidden="true"
						>
							{activeEntry?.favorite ? "♥" : "♡"}
						</span>
					</button>

					<button
						ref={screenTriggerRef}
						type="button"
						className="relative z-1 flex min-h-12 min-w-0 flex-1 touch-manipulation flex-col items-center justify-center px-2 text-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#607178] focus-visible:-outline-offset-2"
						onPointerDown={(event) =>
							setOpenedWithTouch(event.pointerType === "touch")
						}
						onKeyDown={(event) => {
							if (event.key === "Enter" || event.key === " ") {
								setOpenedWithTouch(false);
							}
						}}
						onClick={toggleQuickSelect}
						aria-haspopup="dialog"
						aria-expanded={quickSelectOpen}
						aria-label={t("presetNavigator.openQuickSelect", {
							name: activePresetName,
						})}
						title={quickSelectTooltip}
						data-hover-info={quickSelectTooltip}
						{...quickSelectHoverHandlers}
					>
						<span className="w-full truncate font-['IBM_Plex_Mono','SFMono-Regular','Consolas','Liberation_Mono','Menlo',monospace] font-semibold text-[#54666e] text-[1.05rem] uppercase leading-[1.05] tracking-[0.08em] [text-shadow:0_1px_0_rgba(235,242,245,0.24)]">
							{activePresetName}
						</span>
						<span className="mt-1 w-full truncate font-['IBM_Plex_Mono','SFMono-Regular','Consolas','Liberation_Mono','Menlo',monospace] text-[#6d7c82] text-[0.58rem] uppercase leading-none tracking-[0.16em]">
							{metadata}
						</span>
					</button>

					<span
						className={`relative z-1 flex min-h-12 min-w-11 items-center justify-center text-lg ${activeEntry?.starred ? "text-[#5d6d74]" : "text-[#6d7c82]/45"}`}
						role="img"
						aria-label={
							activeEntry?.starred
								? t("presetNavigator.featuredPreset")
								: t("presetNavigator.notFeaturedPreset")
						}
						title={
							activeEntry?.starred
								? t("presetNavigator.featuredPreset")
								: t("presetNavigator.notFeaturedPreset")
						}
					>
						{activeEntry?.starred ? "★" : "☆"}
					</span>
				</div>

				<MidiLearnOverlay
					midiLearnState={nextMidiLearn.midiLearnState}
					className="rounded-sm"
					wrapperClassName="inline-flex shrink-0"
				>
					<Button
						type="button"
						className="cz-btn-arrow"
						onClick={() => {
							if (nextMidiLearn.learnMode) {
								nextMidiLearn.onClick();
								return;
							}
							onStepPreset(1);
						}}
						onContextMenu={nextMidiLearn.onContextMenu}
						disabled={presetCount === 0}
						aria-label={t("presetNavigator.nextPreset")}
						title={nextTooltip}
						data-hover-info={nextTooltip}
						{...nextHoverHandlers}
					>
						<ArrowIcon direction="right" />
					</Button>
				</MidiLearnOverlay>

				<Button
					type="button"
					className="cz-btn-arrow shrink-0 text-cz-cream-dim hover:text-cz-cream"
					onClick={() => void save()}
					disabled={saveDisabled}
					aria-label={
						activeEntry?.type === "local"
							? t("presetNavigator.savePreset")
							: t("presetNavigator.savePresetAs")
					}
					title={saveTooltip}
					data-hover-info={saveTooltip}
					{...saveHoverHandlers}
				>
					<MdSave
						className="!h-6 !w-6 !fill-current !stroke-none"
						aria-hidden="true"
					/>
				</Button>
			</div>

			<PresetQuickSelect
				open={quickSelectOpen}
				openedWithTouch={openedWithTouch}
				triggerRef={screenTriggerRef}
				entries={entries}
				activeEntryId={activeEntry?.id ?? null}
				onActivatePreset={onActivatePreset}
				onNavigationEntriesChange={onNavigationEntriesChange}
				onClose={() => setQuickSelectOpen(false)}
			/>

			<PresetSaveAsDialog
				open={saveAsOpen}
				name={saveAsName}
				onNameChange={setSaveAsName}
				onConfirm={() => void commitSaveAs()}
				onCancel={() => {
					setSaveAsOpen(false);
					setSaveAsName("");
				}}
			/>
		</div>
	);
}
