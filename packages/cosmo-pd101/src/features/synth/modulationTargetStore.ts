import { create } from "zustand";
import type { ModDestination } from "@/lib/synth/bindings/synth";

type ModulationTargetState = {
	modMode: boolean;
	pendingDestination: ModDestination | null;
};

type ModulationTargetActions = {
	setModMode: (on: boolean) => void;
	setPendingDestination: (destination: ModDestination | null) => void;
	clearPendingDestination: () => void;
};

export type ModulationTargetStore = ModulationTargetState &
	ModulationTargetActions;

export const useModulationTargetStore = create<ModulationTargetStore>()(
	(set) => ({
		modMode: false,
		pendingDestination: null,

		setModMode: (on) => {
			set({
				modMode: on,
				pendingDestination: on ? null : null,
			});
		},

		setPendingDestination: (destination) => {
			set({ pendingDestination: destination });
		},

		clearPendingDestination: () => {
			set({ pendingDestination: null });
		},
	}),
);
