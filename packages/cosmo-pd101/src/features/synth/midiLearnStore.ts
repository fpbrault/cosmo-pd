import { create } from "zustand";

export type MidiBinding = {
	paramKey: string;
	channel: number;
	cc: number;
};

export type MidiBindingIdentity = Pick<
	MidiBinding,
	"paramKey" | "channel" | "cc"
>;

function bindingMatches(
	binding: MidiBinding,
	identity: MidiBindingIdentity,
): boolean {
	return (
		binding.paramKey === identity.paramKey &&
		binding.channel === identity.channel &&
		binding.cc === identity.cc
	);
}

type MidiLearnStateData = {
	learnMode: boolean;
	bindings: MidiBinding[];
	pendingLearnParam: string | null;
};

type MidiLearnActions = {
	setLearnMode: (on: boolean) => void;
	setPendingLearnParam: (paramKey: string | null) => void;
	addBinding: (paramKey: string, channel: number, cc: number) => void;
	removeBinding: (binding: MidiBindingIdentity) => void;
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
		const fn = (window as unknown as Record<string, unknown>)
			.__czSetMidiLearnMode as ((on: boolean) => void) | undefined;
		fn?.(on);
		set({
			learnMode: on,
			pendingLearnParam: on ? get().pendingLearnParam : null,
		});
	},

	setPendingLearnParam: (paramKey) => {
		const fn = (window as unknown as Record<string, unknown>)
			.__czSetPendingMidiLearnParam as
			| ((key: string | null) => void)
			| undefined;
		fn?.(paramKey);
		set({ pendingLearnParam: paramKey });
	},

	removeBinding: (binding) => {
		const fn = (window as unknown as Record<string, unknown>)
			.__czRemoveMidiBinding as
			| ((binding: MidiBindingIdentity) => void)
			| undefined;
		fn?.(binding);
		set((state) => ({
			bindings: state.bindings.filter(
				(existing) => !bindingMatches(existing, binding),
			),
		}));
	},

	clearBindings: () => {
		const fn = (window as unknown as Record<string, unknown>)
			.__czClearMidiLearnBindings as (() => void) | undefined;
		fn?.();
		set({ bindings: [], pendingLearnParam: null });
	},

	addBinding: (paramKey, channel, cc) => {
		const fn = (window as unknown as Record<string, unknown>)
			.__czAddMidiBinding as
			| ((key: string, ch: number, c: number) => void)
			| undefined;
		fn?.(paramKey, channel, cc);
		set((state) => ({
			bindings: [
				...state.bindings.filter((binding) => binding.paramKey !== paramKey),
				{ paramKey, channel, cc },
			],
		}));
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
		const binding = get().bindings.find((entry) => entry.paramKey === paramKey);
		return binding ? [binding] : [];
	},

	resetPendingLearnParam: () => {
		const fn = (window as unknown as Record<string, unknown>)
			.__czSetPendingMidiLearnParam as
			| ((key: string | null) => void)
			| undefined;
		fn?.(null);
		set({ pendingLearnParam: null });
	},
}));

export async function refreshMidiLearnState(): Promise<void> {
	const fn = (window as unknown as Record<string, unknown>)
		.__czGetMidiLearnState as (() => Promise<unknown>) | undefined;
	if (!fn) {
		return;
	}

	try {
		const detail = await fn();
		if (detail && typeof detail === "object") {
			useMidiLearnStore.getState().initFromEngineState(
				detail as {
					learnMode: boolean;
					pendingParamKey: string | null;
					bindings: Array<{ paramKey: string; channel: number; cc: number }>;
					version: number;
				},
			);
		}
	} catch (error) {
		console.error("[MidiLearn] Failed to refresh state from engine", error);
	}
}

export function subscribeMidiLearnState(): () => void {
	const handler = (event: Event) => {
		const detail = (event as CustomEvent).detail;
		useMidiLearnStore.getState().initFromEngineState(detail);
	};
	window.addEventListener("cz-midi-learn-state", handler);
	void refreshMidiLearnState();
	return () => window.removeEventListener("cz-midi-learn-state", handler);
}
