import { create } from "zustand";
import type { SynthParamKey } from "@/features/synth/synthParamSetters";

export type MidiLearnMapping = {
	cc: number;
	target: SynthParamKey;
};

type MidiLearnStore = {
	enabled: boolean;
	activeTarget: SynthParamKey | null;
	mappings: MidiLearnMapping[];
	setMappings: (mappings: MidiLearnMapping[]) => void;
	setEnabled: (enabled: boolean) => void;
	toggleEnabled: () => void;
	setActiveTarget: (target: SynthParamKey | null) => void;
};

export const useMidiLearnStore = create<MidiLearnStore>((set) => ({
	enabled: false,
	activeTarget: null,
	mappings: [],
	setMappings: (mappings) => set({ mappings }),
	setEnabled: (enabled) =>
		set((state) => ({
			enabled,
			activeTarget: enabled ? state.activeTarget : null,
		})),
	toggleEnabled: () =>
		set((state) => ({
			enabled: !state.enabled,
			activeTarget: state.enabled ? null : state.activeTarget,
		})),
	setActiveTarget: (target) => set({ activeTarget: target }),
}));
