import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { MidiLearnTargetKey } from "./midiLearnRegistry";

export type MidiBinding = {
	paramKey: MidiLearnTargetKey;
	channel: number;
	cc: number;
};

const MIDI_LEARN_STORAGE_KEY = "cosmo-pd101-midi-learn-v2";
const DEFAULT_BINDINGS: Partial<Record<MidiLearnTargetKey, MidiBinding>> = {
	macro1: { paramKey: "macro1", channel: 0, cc: 8 },
	macro2: { paramKey: "macro2", channel: 0, cc: 41 },
	macro3: { paramKey: "macro3", channel: 0, cc: 42 },
	macro4: { paramKey: "macro4", channel: 0, cc: 43 },
};

type MidiLearnState = {
	learnMode: boolean;
	bindings: Partial<Record<MidiLearnTargetKey, MidiBinding>>;
	lastCapturedCc: { channel: number; cc: number; rawValue: number } | null;
	pendingLearnParam: MidiLearnTargetKey | null;
};

type MidiLearnActions = {
	setLearnMode: (on: boolean) => void;
	setPendingLearnParam: (paramKey: MidiLearnTargetKey | null) => void;
	captureMidiCc: (channel: number, cc: number, rawValue: number) => void;
	addOrReplaceBinding: (
		channel: number,
		cc: number,
		paramKey: MidiLearnTargetKey,
	) => void;
	updateBinding: (
		paramKey: MidiLearnTargetKey,
		updates: Partial<Pick<MidiBinding, "channel" | "cc">>,
	) => void;
	removeBinding: (paramKey: MidiLearnTargetKey) => void;
	removeBindingsForParam: (paramKey: MidiLearnTargetKey) => void;
	getBindingsForMidi: (channel: number, cc: number) => MidiBinding[];
	getBindingForParam: (paramKey: MidiLearnTargetKey) => MidiBinding | undefined;
	getBindingsForParam: (paramKey: MidiLearnTargetKey) => MidiBinding[];
	clearLastCapturedCc: () => void;
	resetPendingLearnParam: () => void;
};

export type MidiLearnStore = MidiLearnState & MidiLearnActions;

const DEFAULT_STATE: MidiLearnState = {
	learnMode: false,
	bindings: DEFAULT_BINDINGS,
	lastCapturedCc: null,
	pendingLearnParam: null,
};

function normalizePersistedBindings(
	persisted: unknown,
): Partial<Record<MidiLearnTargetKey, MidiBinding>> {
	if (!persisted || typeof persisted !== "object") {
		return {};
	}

	const normalized: Partial<Record<MidiLearnTargetKey, MidiBinding>> = {};
	for (const candidate of Object.values(persisted)) {
		if (!candidate || typeof candidate !== "object") {
			continue;
		}
		const maybeBinding = candidate as {
			paramKey?: unknown;
			channel?: unknown;
			cc?: unknown;
		};
		if (typeof maybeBinding.paramKey !== "string") {
			continue;
		}
		if (typeof maybeBinding.channel !== "number") {
			continue;
		}
		if (typeof maybeBinding.cc !== "number") {
			continue;
		}
		normalized[maybeBinding.paramKey as MidiLearnTargetKey] = {
			paramKey: maybeBinding.paramKey as MidiLearnTargetKey,
			channel: maybeBinding.channel,
			cc: maybeBinding.cc,
		};
	}
	return normalized;
}

export const useMidiLearnStore = create<MidiLearnStore>()(
	persist(
		(set, get) => ({
			...DEFAULT_STATE,

			setLearnMode: (on) => {
				set({
					learnMode: on,
					lastCapturedCc: null,
					pendingLearnParam: on ? get().pendingLearnParam : null,
				});
			},

			setPendingLearnParam: (paramKey) => {
				set({ pendingLearnParam: paramKey });
			},

			captureMidiCc: (channel, cc, rawValue) => {
				const state = get();
				if (!state.learnMode) return;

				const pendingKey = state.pendingLearnParam;
				if (pendingKey) {
					set((s) => ({
						bindings: {
							...s.bindings,
							[pendingKey]: {
								paramKey: pendingKey,
								channel,
								cc,
							},
						},
						lastCapturedCc: { channel, cc, rawValue },
					}));
				} else {
					set({ lastCapturedCc: { channel, cc, rawValue } });
				}
			},

			addOrReplaceBinding: (channel, cc, paramKey) => {
				set((state) => ({
					bindings: {
						...state.bindings,
						[paramKey]: { paramKey, channel, cc },
					},
				}));
			},

			updateBinding: (paramKey, updates) => {
				set((state) => {
					const current = state.bindings[paramKey];
					if (!current) {
						return state;
					}
					return {
						bindings: {
							...state.bindings,
							[paramKey]: {
								...current,
								...updates,
							},
						},
					};
				});
			},

			removeBinding: (paramKey) => {
				set((state) => {
					const { [paramKey]: _, ...rest } = state.bindings;
					return { bindings: rest };
				});
			},

			removeBindingsForParam: (paramKey) => {
				get().removeBinding(paramKey);
			},

			getBindingsForMidi: (channel, cc) => {
				const bindings = get().bindings;
				return Object.values(bindings).filter(
					(binding): binding is MidiBinding => {
						if (!binding) {
							return false;
						}

						return binding.channel === channel && binding.cc === cc;
					},
				);
			},

			getBindingForParam: (paramKey) => {
				return get().bindings[paramKey];
			},

			getBindingsForParam: (paramKey) => {
				const binding = get().bindings[paramKey];
				return binding ? [binding] : [];
			},

			clearLastCapturedCc: () => {
				set({ lastCapturedCc: null });
			},

			resetPendingLearnParam: () => {
				set({ pendingLearnParam: null });
			},
		}),
		{
			name: MIDI_LEARN_STORAGE_KEY,
			storage: createJSONStorage(() => localStorage),
			partialize: (state) => ({
				bindings: state.bindings,
			}),
			merge: (persisted, current) => ({
				...current,
				...DEFAULT_STATE,
				...(typeof persisted === "object" &&
				persisted !== null &&
				"bindings" in persisted
					? {
							bindings: normalizePersistedBindings(
								(persisted as { bindings: unknown }).bindings,
							),
						}
					: {}),
			}),
		},
	),
);
