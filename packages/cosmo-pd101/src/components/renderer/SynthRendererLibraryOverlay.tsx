import { motion } from "motion/react";
import { memo } from "react";
import PresetLibrary from "@/components/preset/PresetLibrary";
import type { LibraryPreset } from "@/features/synth/types/libraryPreset";
import type { PresetEntry } from "@/features/synth/types/presetEntry";
import type { PresetTagOptions } from "@/lib/synth/presetTags";
import { LIBRARY_SLIDE_TRANSITION } from "./drawerHelpers";

const MemoPresetLibrary = memo(PresetLibrary);

type SynthRendererLibraryOverlayProps = {
	isOpen: boolean;
	allEntries: PresetEntry[];
	activeEntryId: string | null;
	activePresetName: string;
	onLoadLocal: (id: string) => void;
	onLoadLibrary: (preset: LibraryPreset) => void;
	onLoadBuiltin: (name: string) => void;
	onSavePreset: (name: string) => void;
	onDeletePreset: (id: string) => void;
	onRenamePreset: (id: string, newName: string) => void;
	onSetPresetAuthor: (id: string, author: string) => void;
	onSetPresetFavorite: (id: string, favorite: boolean) => void;
	onSetPresetTags: (id: string, tags: PresetTagOptions[]) => void;
	onExportPreset: (id: string) => void;
	onExportCurrentState: (name: string) => void;
	onImportPreset: (json: string, filename: string) => void;
	onInitPreset: () => void;
	onVisibleEntriesChange: (entries: PresetEntry[]) => void;
	onClose: () => void;
};

export default memo(function SynthRendererLibraryOverlay({
	isOpen,
	allEntries,
	activeEntryId,
	activePresetName,
	onLoadLocal,
	onLoadLibrary,
	onLoadBuiltin,
	onSavePreset,
	onDeletePreset,
	onRenamePreset,
	onSetPresetAuthor,
	onSetPresetFavorite,
	onSetPresetTags,
	onExportPreset,
	onExportCurrentState,
	onImportPreset,
	onInitPreset,
	onVisibleEntriesChange,
	onClose,
}: SynthRendererLibraryOverlayProps) {
	return (
		<motion.div
			aria-hidden={!isOpen}
			initial={false}
			animate={{ y: isOpen ? 0 : "-120%" }}
			transition={LIBRARY_SLIDE_TRANSITION}
			style={{ transformOrigin: "top center" }}
			className={`absolute inset-x-0 top-18 bottom-10 z-20 flex min-h-0 origin-top flex-col overflow-hidden shadow-black shadow-lg will-change-transform ${
				isOpen ? "pointer-events-auto" : "pointer-events-none"
			}`}
		>
			<MemoPresetLibrary
				allEntries={allEntries}
				activeEntryId={activeEntryId}
				activePresetName={activePresetName}
				onLoadLocal={onLoadLocal}
				onLoadLibrary={onLoadLibrary}
				onLoadBuiltin={onLoadBuiltin}
				onSavePreset={onSavePreset}
				onDeletePreset={onDeletePreset}
				onRenamePreset={onRenamePreset}
				onSetPresetAuthor={onSetPresetAuthor}
				onSetPresetFavorite={onSetPresetFavorite}
				onSetPresetTags={onSetPresetTags}
				onExportPreset={onExportPreset}
				onExportCurrentState={onExportCurrentState}
				onImportPreset={onImportPreset}
				onInitPreset={onInitPreset}
				onVisibleEntriesChange={onVisibleEntriesChange}
				onClose={onClose}
				isOpen={isOpen}
			/>
		</motion.div>
	);
});
