import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const VOICE_LIMIT_STORAGE_KEY = "cosmo-pd:voiceLimit";

export const MIN_VOICE_LIMIT = 1;
export const DEFAULT_VOICE_LIMIT = 8;
export const MAX_VOICE_LIMIT = 16;

type GlobalSynthSettingsState = {
	voiceLimit: number;
};

type GlobalSynthSettingsActions = {
	setVoiceLimit: (limit: number) => void;
};

export type GlobalSynthSettingsStore = GlobalSynthSettingsState &
	GlobalSynthSettingsActions;

const clampVoiceLimit = (v: number): number =>
	Math.max(MIN_VOICE_LIMIT, Math.min(MAX_VOICE_LIMIT, Math.round(v)));

export const useGlobalSynthSettings = create<GlobalSynthSettingsStore>()(
	persist(
		(set) => ({
			voiceLimit: DEFAULT_VOICE_LIMIT,
			setVoiceLimit: (limit) => set({ voiceLimit: clampVoiceLimit(limit) }),
		}),
		{
			name: VOICE_LIMIT_STORAGE_KEY,
			storage: createJSONStorage(() => localStorage),
		},
	),
);

export const useVoiceLimit = () => useGlobalSynthSettings((s) => s.voiceLimit);
