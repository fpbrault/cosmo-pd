import { motion } from "motion/react";
import { memo } from "react";
import PresetLibrary from "@/components/preset/PresetLibrary";
import { usePresetManager } from "@/context/PresetManagerContext";
import type { PresetEntry } from "@/features/synth/types/presetEntry";
import { LIBRARY_SLIDE_TRANSITION } from "./drawerHelpers";

const MemoPresetLibrary = memo(PresetLibrary);

type SynthRendererLibraryOverlayProps = {
	isOpen: boolean;
	onVisibleEntriesChange: (entries: PresetEntry[]) => void;
	onClose: () => void;
};

export default memo(function SynthRendererLibraryOverlay({
	isOpen,
	onVisibleEntriesChange,
	onClose,
}: SynthRendererLibraryOverlayProps) {
	const {
		allPresetEntries,
		activePresetId,
		activePresetName,
		handleLoadPresetByName,
		handleLoadLocal,
		handleLoadLibrary,
		handleSavePreset,
		handleDeletePreset,
		handleRenamePreset,
		handleSetPresetAuthor,
		handleSetPresetFavorite,
		handleSetPresetTags,
		handleExportPreset,
		handleExportCurrentState,
		handleImportPreset,
		handleInitPreset,
	} = usePresetManager();

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
				allEntries={allPresetEntries}
				activeEntryId={activePresetId}
				activePresetName={activePresetName}
				onLoadPresetByName={handleLoadPresetByName}
				onLoadLocal={handleLoadLocal}
				onLoadLibrary={handleLoadLibrary}
				onSavePreset={handleSavePreset}
				onDeletePreset={handleDeletePreset}
				onRenamePreset={handleRenamePreset}
				onSetPresetAuthor={handleSetPresetAuthor}
				onSetPresetFavorite={handleSetPresetFavorite}
				onSetPresetTags={handleSetPresetTags}
				onExportPreset={handleExportPreset}
				onExportCurrentState={handleExportCurrentState}
				onImportPreset={handleImportPreset}
				onInitPreset={handleInitPreset}
				onVisibleEntriesChange={onVisibleEntriesChange}
				onClose={onClose}
				isOpen={isOpen}
			/>
		</motion.div>
	);
});
