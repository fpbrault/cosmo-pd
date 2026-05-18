import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { SynthParamKey } from "./SynthParamController";

export type MidiBinding = {
	paramKey: SynthParamKey;
	channel: number;
	cc: number;
};

const MIDI_LEARN_STORAGE_KEY = "cosmo-pd101-midi-learn";
const ALL_CHANNELS = 16;

function bindingKey(channel: number, cc: number): string {
	return `${channel}:${cc}`;
}

type MidiLearnState = {
	learnMode: boolean;
	bindings: Record<string, MidiBinding>;
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
	removeBinding: (channel: number, cc: number) => void;
	removeBindingsForParam: (paramKey: SynthParamKey) => void;
	getBindingForMidi: (channel: number, cc: number) => MidiBinding | undefined;
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

export const useMidiLearnStore = create<MidiLearnStore>()(
	persist(
		(set, get) => ({
			...DEFAULT_STATE,

			setLearnMode: (on) => {
				set({
					learnMode: on,
					lastCapturedCc: null,
					pendingLearnParam: null,
				});
			},

			setPendingLearnParam: (paramKey) => {
				set({ pendingLearnParam: paramKey });
				const lastCc = get().lastCapturedCc;
				if (paramKey !== null && lastCc !== null) {
					const key = bindingKey(lastCc.channel, lastCc.cc);
					set((state) => ({
						bindings: {
							...state.bindings,
							[key]: {
								paramKey,
								channel: lastCc.channel,
								cc: lastCc.cc,
							},
						},
						pendingLearnParam: null,
						lastCapturedCc: null,
					}));
				}
			},

			captureMidiCc: (channel, cc, rawValue) => {
				const state = get();
				if (!state.learnMode) return;

				const pendingKey = state.pendingLearnParam;
				if (pendingKey) {
					const key = bindingKey(channel, cc);
					set((s) => ({
						bindings: {
							...s.bindings,
							[key]: {
								paramKey: pendingKey,
								channel,
								cc,
							},
						},
						pendingLearnParam: null,
						lastCapturedCc: null,
					}));
				} else {
					set({ lastCapturedCc: { channel, cc, rawValue } });
				}
			},

			addOrReplaceBinding: (channel, cc, paramKey) => {
				const key = bindingKey(channel, cc);
				set((state) => ({
					bindings: {
						...state.bindings,
						[key]: { paramKey, channel, cc },
					},
				}));
			},

			removeBinding: (channel, cc) => {
				const key = bindingKey(channel, cc);
				set((state) => {
					const { [key]: _, ...rest } = state.bindings;
					return { bindings: rest };
				});
			},

			removeBindingsForParam: (paramKey) => {
				set((state) => {
					const updated = { ...state.bindings };
					for (const [key, binding] of Object.entries(updated)) {
						if (binding.paramKey === paramKey) {
							delete updated[key];
						}
					}
					return { bindings: updated };
				});
			},

			getBindingForMidi: (channel, cc) => {
				const bindings = get().bindings;
				const exact = bindings[bindingKey(channel, cc)];
				if (exact) return exact;
				return bindings[bindingKey(ALL_CHANNELS, cc)];
			},

			getBindingsForParam: (paramKey) => {
				const bindings = get().bindings;
				return Object.values(bindings).filter((b) => b.paramKey === paramKey);
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
							bindings: (persisted as { bindings: Record<string, MidiBinding> })
								.bindings,
						}
					: {}),
			}),
		},
	),
);
