import { create } from "zustand";
import type {
	MidiLearnBinding,
	MidiLearnState,
} from "@/lib/synth/bindings/plugin-bridge";

export type MidiBinding = MidiLearnBinding;

type PersistedMidiLearnBindings = {
	bindings: MidiBinding[];
};

export type MidiBindingIdentity = Pick<
	MidiBinding,
	"paramKey" | "channel" | "cc"
>;

export const DEFAULT_MIDI_BINDINGS: MidiBinding[] = [
	{ paramKey: "macro1", channel: 0, cc: 8 },
	{ paramKey: "macro2", channel: 0, cc: 41 },
	{ paramKey: "macro3", channel: 0, cc: 42 },
	{ paramKey: "macro4", channel: 0, cc: 43 },
];

export const MIDI_LEARN_STORAGE_KEY = "cosmo-pd101-midi-bindings";

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
	initFromEngineState: (state: MidiLearnState) => void;
};

export type MidiLearnStore = MidiLearnStateData & MidiLearnActions;

const DEFAULT_STATE: MidiLearnStateData = {
	learnMode: false,
	bindings: [],
	pendingLearnParam: null,
};

let webMidiLearnHydrated = false;

function canUseLocalStorage(): boolean {
	return typeof window !== "undefined" && "localStorage" in window;
}

function isPluginBackedMidiLearnEnvironment(): boolean {
	if (typeof window === "undefined") {
		return false;
	}

	const webkitWindow = window as Window & {
		webkit?: {
			messageHandlers?: {
				cosmoPd101?: unknown;
			};
		};
	};

	return Boolean(
		window.ipc ||
			webkitWindow.webkit?.messageHandlers?.cosmoPd101 ||
			(window.location.search &&
				new URLSearchParams(window.location.search).get("standalone") === "1"),
	);
}

function normalizeBindings(value: unknown): MidiBinding[] | null {
	if (!Array.isArray(value)) {
		return null;
	}

	const bindings = value
		.map((entry) => {
			if (!entry || typeof entry !== "object") {
				return null;
			}

			const candidate = entry as Partial<MidiBinding>;
			if (
				typeof candidate.paramKey !== "string" ||
				typeof candidate.channel !== "number" ||
				typeof candidate.cc !== "number"
			) {
				return null;
			}

			return {
				paramKey: candidate.paramKey,
				channel: candidate.channel,
				cc: candidate.cc,
			};
		})
		.filter((binding): binding is MidiBinding => binding !== null);

	return bindings;
}

function persistWebMidiBindings(bindings: MidiBinding[]): void {
	if (!canUseLocalStorage() || isPluginBackedMidiLearnEnvironment()) {
		return;
	}

	window.localStorage.setItem(
		MIDI_LEARN_STORAGE_KEY,
		JSON.stringify({
			bindings,
		} satisfies PersistedMidiLearnBindings),
	);
}

function hydrateWebMidiBindings(): MidiBinding[] {
	if (!canUseLocalStorage()) {
		return DEFAULT_MIDI_BINDINGS;
	}

	const raw = window.localStorage.getItem(MIDI_LEARN_STORAGE_KEY);
	if (!raw) {
		persistWebMidiBindings(DEFAULT_MIDI_BINDINGS);
		return DEFAULT_MIDI_BINDINGS;
	}

	try {
		const parsed = JSON.parse(raw) as Partial<PersistedMidiLearnBindings>;
		const bindings = normalizeBindings(parsed.bindings);
		if (bindings) {
			return bindings;
		}
	} catch (error) {
		console.error("[MidiLearn] Failed to parse persisted bindings", error);
	}

	persistWebMidiBindings(DEFAULT_MIDI_BINDINGS);
	return DEFAULT_MIDI_BINDINGS;
}

export function ensureMidiLearnStateHydrated(): void {
	if (webMidiLearnHydrated || isPluginBackedMidiLearnEnvironment()) {
		return;
	}

	webMidiLearnHydrated = true;
	useMidiLearnStore.setState({
		learnMode: false,
		pendingLearnParam: null,
		bindings: hydrateWebMidiBindings(),
	});
}

export function resetMidiLearnPersistenceForTests(): void {
	webMidiLearnHydrated = false;
}

export const useMidiLearnStore = create<MidiLearnStore>()((set, get) => ({
	...DEFAULT_STATE,

	setLearnMode: (on) => {
		window.__czSetMidiLearnMode?.(on);
		set({
			learnMode: on,
			pendingLearnParam: on ? get().pendingLearnParam : null,
		});
	},

	setPendingLearnParam: (paramKey) => {
		window.__czSetPendingMidiLearnParam?.(paramKey);
		set({ pendingLearnParam: paramKey });
	},

	removeBinding: (binding) => {
		window.__czRemoveMidiBinding?.(binding);
		set((state) => {
			const bindings = state.bindings.filter(
				(existing) => !bindingMatches(existing, binding),
			);
			persistWebMidiBindings(bindings);
			return { bindings };
		});
	},

	clearBindings: () => {
		window.__czClearMidiLearnBindings?.();
		persistWebMidiBindings([]);
		set({ bindings: [], pendingLearnParam: null });
	},

	addBinding: (paramKey, channel, cc) => {
		window.__czAddMidiBinding?.(paramKey, channel, cc);
		set((state) => {
			const bindings = [
				...state.bindings.filter((binding) => binding.paramKey !== paramKey),
				{ paramKey, channel, cc },
			];
			persistWebMidiBindings(bindings);
			return { bindings };
		});
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
		window.__czSetPendingMidiLearnParam?.(null);
		set({ pendingLearnParam: null });
	},
}));

export async function refreshMidiLearnState(): Promise<void> {
	ensureMidiLearnStateHydrated();
	const fn = window.__czGetMidiLearnState;
	if (!fn) {
		return;
	}

	try {
		const detail = await fn();
		useMidiLearnStore.getState().initFromEngineState(detail);
	} catch (error) {
		console.error("[MidiLearn] Failed to refresh state from engine", error);
	}
}

export function subscribeMidiLearnState(): () => void {
	ensureMidiLearnStateHydrated();
	const handler = (event: Event) => {
		const detail = (event as CustomEvent).detail;
		useMidiLearnStore.getState().initFromEngineState(detail);
	};
	window.addEventListener("cz-midi-learn-state", handler);
	void refreshMidiLearnState();
	return () => window.removeEventListener("cz-midi-learn-state", handler);
}
