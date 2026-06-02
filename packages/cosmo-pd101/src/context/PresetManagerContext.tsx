import { createContext, type ReactNode, useContext } from "react";
import type { LibraryPreset } from "@/features/synth/types/libraryPreset";
import type { PresetEntry } from "@/features/synth/types/presetEntry";
import type { PresetTagOptions } from "@/lib/synth/presetTags";

interface PresetManagerContextValue {
	visiblePresetEntries: PresetEntry[];
	activePresetId: string | null;
	activePresetName: string;
	handleLoadPresetByName: (name: string) => void;
	handleLoadLocal: (id: string) => void;
	handleLoadLibrary: (preset: LibraryPreset) => void;
	handleSavePreset: (name: string) => void;
	handleDeletePreset: (id: string) => void;
	handleRenamePreset: (id: string, newName: string) => void;
	handleSetPresetAuthor: (id: string, author: string) => void;
	handleSetPresetFavorite: (id: string, favorite: boolean) => void;
	handleSetPresetTags: (id: string, tags: PresetTagOptions[]) => void;
	handleInitPreset: () => void;
	handleExportPreset: (id: string) => void;
	handleImportPreset: (json: string, filename: string) => void;
	handleExportCurrentState: (name: string) => void;
}

const PresetManagerContext = createContext<
	PresetManagerContextValue | undefined
>(undefined);

export const PresetManagerProvider = ({
	children,
	value,
}: {
	children: ReactNode;
	value: PresetManagerContextValue;
}) => {
	return (
		<PresetManagerContext.Provider value={value}>
			{children}
		</PresetManagerContext.Provider>
	);
};

export const usePresetManager = () => {
	const context = useContext(PresetManagerContext);
	if (!context) {
		throw new Error(
			"usePresetManager must be used within a PresetManagerProvider",
		);
	}
	return context;
};
