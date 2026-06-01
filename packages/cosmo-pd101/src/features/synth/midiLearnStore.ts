import { create } from "zustand";

export type MidiBinding = {
	paramKey: string;
	channel: number;
	cc: number;
};

type MidiLearnStateData = {
	learnMode: boolean;
	bindings: MidiBinding[];
	pendingLearnParam: string | null;
};

type MidiLearnActions = {
	setLearnMode: (on: boolean) => void;
	setPendingLearnParam: (paramKey: string | null) => void;
	removeBinding: (paramKey: string) => void;
	clearBindings: () => void;
	getBindingsForMidi: (channel: number, cc: number) => MidiBinding[];
	getBindingForParam: (paramKey: string) => MidiBinding | undefined;
	getBindingsForParam: (paramKey: string) => MidiBinding[];
	resetPendingLearnParam: () => void;
	initFromEngineState: (state: {
		learnMode: boolean;
		pendingParamKey: string | null;
		bindings: Array<{ paramKey: string; channel: number; cc: number }>;
		version: number;
	}) => void;
};

export type MidiLearnStore = MidiLearnStateData & MidiLearnActions;

const DEFAULT_STATE: MidiLearnStateData = {
	learnMode: false,
	bindings: [],
	pendingLearnParam: null,
};

export const useMidiLearnStore = create<MidiLearnStore>()((set, get) => ({
	...DEFAULT_STATE,

	setLearnMode: (on) => {
		const fn = (window as Record<string, unknown>).__czSetMidiLearnMode as
			| ((on: boolean) => void)
			| undefined;
		fn?.(on);
		set({
			learnMode: on,
			pendingLearnParam: on ? get().pendingLearnParam : null,
		});
	},

	setPendingLearnParam: (paramKey) => {
		const fn = (window as Record<string, unknown>)
			.__czSetPendingMidiLearnParam as
			| ((key: string | null) => void)
			| undefined;
		fn?.(paramKey ?? "");
		set({ pendingLearnParam: paramKey });
	},

	removeBinding: (paramKey) => {
		const fn = (window as Record<string, unknown>).__czRemoveMidiBinding as
			| ((key: string) => void)
			| undefined;
		fn?.(paramKey);
		set((state) => ({
			bindings: state.bindings.filter((b) => b.paramKey !== paramKey),
		}));
	},

	clearBindings: () => {
		const fn = (window as Record<string, unknown>).__czClearMidiLearnBindings as
			| (() => void)
			| undefined;
		fn?.();
		set({ bindings: [], pendingLearnParam: null });
	},

	initFromEngineState: (engineState) => {
		set({
			learnMode: engineState.learnMode,
			pendingLearnParam: engineState.pendingParamKey ?? null,
			bindings: engineState.bindings.map((b) => ({
				paramKey: b.paramKey,
				channel: b.channel,
				cc: b.cc,
			})),
		});
	},

	getBindingsForMidi: (channel, cc) => {
		return get().bindings.filter(
			(binding) => binding.channel === channel && binding.cc === cc,
		);
	},

	getBindingForParam: (paramKey) => {
		return get().bindings.find((b) => b.paramKey === paramKey);
	},

	getBindingsForParam: (paramKey) => {
		const b = get().bindings.find((b) => b.paramKey === paramKey);
		return b ? [b] : [];
	},

	resetPendingLearnParam: () => {
		set({ pendingLearnParam: null });
	},
}));

export function subscribeMidiLearnState(): () => void {
	const handler = (event: Event) => {
		const detail = (event as CustomEvent).detail;
		useMidiLearnStore.getState().initFromEngineState(detail);
	};
	window.addEventListener("cz-midi-learn-state", handler);
	return () => window.removeEventListener("cz-midi-learn-state", handler);
}
