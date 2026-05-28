import { useEffect } from "react";

type UsePresetLibraryRefreshOptions = {
	refreshFavoritePresetIds: () => Promise<void>;
	refreshLocalPresetEntries: () => Promise<void>;
};

export function usePresetManagerPersistence({
	refreshFavoritePresetIds,
	refreshLocalPresetEntries,
}: UsePresetLibraryRefreshOptions) {
	useEffect(() => {
		void Promise.all([refreshLocalPresetEntries(), refreshFavoritePresetIds()]);
	}, [refreshFavoritePresetIds, refreshLocalPresetEntries]);
}
