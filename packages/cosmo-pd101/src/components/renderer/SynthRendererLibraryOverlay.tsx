import { motion } from "motion/react";
import { memo } from "react";
import PresetLibrary from "@/components/preset/PresetLibrary";
import { usePresetManager } from "@/context/PresetManagerContext";
import type { ExportedPresetFile } from "@/features/synth/presetManagerRepository";
import { LIBRARY_SLIDE_TRANSITION } from "./drawerHelpers";

const MemoPresetLibrary = memo(PresetLibrary);

function downloadPresetFile(file: ExportedPresetFile) {
	const blob = new Blob([file.json], { type: "application/json" });
	const url = URL.createObjectURL(blob);
	const anchor = document.createElement("a");
	anchor.href = url;
	anchor.download = file.filename;
	anchor.click();
	URL.revokeObjectURL(url);
}

type SynthRendererLibraryOverlayProps = {
	isOpen: boolean;
	onNavigationEntriesChange: (entryIds: string[]) => void;
	onClose: () => void;
};

export default memo(function SynthRendererLibraryOverlay({
	isOpen,
	onNavigationEntriesChange,
	onClose,
}: SynthRendererLibraryOverlayProps) {
	const {
		allPresetEntries,
		activePresetId,
		activePresetName,
		activatePreset,
		savePreset,
		deletePreset,
		renamePreset,
		setPresetAuthor,
		setPresetFavorite,
		setPresetTags,
		exportPreset,
		exportCurrentState,
		importPreset,
		initPreset,
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
				onActivatePreset={(ref) => {
					void activatePreset(ref);
				}}
				onSavePreset={(name) => {
					void savePreset(name);
				}}
				onDeletePreset={(id) => {
					void deletePreset(id);
				}}
				onRenamePreset={(id, newName) => {
					void renamePreset(id, newName);
				}}
				onSetPresetAuthor={(id, author) => {
					void setPresetAuthor(id, author);
				}}
				onSetPresetFavorite={(id, favorite) => {
					void setPresetFavorite(id, favorite);
				}}
				onSetPresetTags={(id, tags) => {
					void setPresetTags(id, tags);
				}}
				onExportPreset={(id) => {
					void exportPreset(id).then((file) => {
						if (file) {
							downloadPresetFile(file);
						}
					});
				}}
				onExportCurrentState={(name) => {
					void exportCurrentState(name).then(downloadPresetFile);
				}}
				onImportPreset={(json, filename) => {
					void importPreset(json, filename);
				}}
				onInitPreset={() => {
					void initPreset();
				}}
				onNavigationEntriesChange={onNavigationEntriesChange}
				onClose={onClose}
				isOpen={isOpen}
			/>
		</motion.div>
	);
});
