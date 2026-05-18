import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { SynthParamKey } from "./SynthParamController";

export type MidiBinding = {
	paramKey: SynthParamKey;
	channel: number;
	cc: number;
};

const MIDI_LEARN_STORAGE_KEY = "cosmo-pd101-midi-learn";

type MidiLearnState = {
	learnMode: boolean;
	bindings: Partial<Record<SynthParamKey, MidiBinding>>;
	lastCapturedCc: { channel: number; cc: number; rawValue: number } | null;
	pendingLearnParam: SynthParamKey | null;
};

type MidiLearnActions = {
	setLearnMode: (on: boolean) => void;
	setPendingLearnParam: (paramKey: SynthParamKey | null) => void;
	captureMidiCc: (channel: number, cc: number, rawValue: number) => void;
	addOrReplaceBinding: (
		channel: number,
		cc: number,
		paramKey: SynthParamKey,
	) => void;
	updateBinding: (
		paramKey: SynthParamKey,
		updates: Partial<Pick<MidiBinding, "channel" | "cc">>,
	) => void;
	removeBinding: (paramKey: SynthParamKey) => void;
	removeBindingsForParam: (paramKey: SynthParamKey) => void;
	getBindingsForMidi: (channel: number, cc: number) => MidiBinding[];
	getBindingForParam: (paramKey: SynthParamKey) => MidiBinding | undefined;
	getBindingsForParam: (paramKey: SynthParamKey) => MidiBinding[];
	clearLastCapturedCc: () => void;
	resetPendingLearnParam: () => void;
};

export type MidiLearnStore = MidiLearnState & MidiLearnActions;

const DEFAULT_STATE: MidiLearnState = {
	learnMode: false,
	bindings: {},
	lastCapturedCc: null,
	pendingLearnParam: null,
};

function normalizePersistedBindings(
	persisted: unknown,
): Partial<Record<SynthParamKey, MidiBinding>> {
	if (!persisted || typeof persisted !== "object") {
		return {};
	}

	const normalized: Partial<Record<SynthParamKey, MidiBinding>> = {};
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
		normalized[maybeBinding.paramKey as SynthParamKey] = {
			paramKey: maybeBinding.paramKey as SynthParamKey,
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
					(binding): binding is MidiBinding =>
						Boolean(binding) &&
						binding.channel === channel &&
						binding.cc === cc,
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
