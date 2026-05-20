import { useEffect } from "react";
import {
	loadCurrentPresetSession,
	loadCurrentState,
	saveCurrentPresetSession,
	saveCurrentState,
} from "@/lib/synth/presetStorage";

type UsePresetManagerPersistenceOptions = {
	applyPreset: (data: unknown) => void;
	builtinPresets: Record<string, unknown>;
	loadBuiltinPreset: (name: string) => void;
	refreshFavoritePresetIds: () => Promise<void>;
	refreshLocalPresetEntries: () => Promise<void>;
	shouldHydratePersistedState: boolean;
	gatherState: () => unknown;
	activePresetId: string | null;
	activePresetNameBase: string;
	loadedPresetFingerprint: string | null;
	setActivePresetId: (value: string | null) => void;
	setActivePresetNameBase: (value: string) => void;
	setLoadedPresetFingerprint: (value: string | null) => void;
};

export function usePresetManagerPersistence({
	applyPreset,
	builtinPresets,
	loadBuiltinPreset,
	refreshFavoritePresetIds,
	refreshLocalPresetEntries,
	shouldHydratePersistedState,
	gatherState,
	activePresetId,
	activePresetNameBase,
	loadedPresetFingerprint,
	setActivePresetId,
	setActivePresetNameBase,
	setLoadedPresetFingerprint,
}: UsePresetManagerPersistenceOptions) {
	useEffect(() => {
		const init = async () => {
			await Promise.all([
				refreshLocalPresetEntries(),
				refreshFavoritePresetIds(),
			]);

			if (!shouldHydratePersistedState) return;

			const session = await loadCurrentPresetSession();
			if (session) {
				setActivePresetId(session.activePresetId);
				setActivePresetNameBase(session.activePresetNameBase);
				setLoadedPresetFingerprint(session.loadedPresetFingerprint);
				const saved = await loadCurrentState();
				if (saved) applyPreset(saved);
				return;
			}

			const isTestMode = import.meta.env.VITE_TEST_HARNESS === "1";
			if (!isTestMode) {
				const firstPresetName = Object.keys(builtinPresets)[0];
				if (firstPresetName) {
					loadBuiltinPreset(firstPresetName);
					return;
				}
			}

			const saved = await loadCurrentState();
			if (saved) applyPreset(saved);
		};

		init();
	}, [
		applyPreset,
		builtinPresets,
		loadBuiltinPreset,
		refreshFavoritePresetIds,
		refreshLocalPresetEntries,
		setActivePresetId,
		setActivePresetNameBase,
		setLoadedPresetFingerprint,
		shouldHydratePersistedState,
	]);

	useEffect(() => {
		const timer = setTimeout(() => {
			saveCurrentState(gatherState());
			saveCurrentPresetSession({
				activePresetId,
				activePresetNameBase,
				loadedPresetFingerprint,
			});
		}, 500);
		return () => clearTimeout(timer);
	}, [
		activePresetId,
		activePresetNameBase,
		gatherState,
		loadedPresetFingerprint,
	]);
}
