import { useCallback, useEffect, useRef } from "react";
import {
	applyRegisteredMidiLearnTarget,
	getMidiLearnTargetRegistration,
} from "@/features/synth/midiLearnRegistry";
import {
	ensureMidiLearnStateHydrated,
	useMidiLearnStore,
} from "@/features/synth/midiLearnStore";
import { SYNTH_PARAM_SETTERS } from "@/features/synth/SynthParamController";
import { useSynthStore } from "@/features/synth/synthStore";
import { ENGINE_PARAM_UI_META_BY_KEY } from "@/lib/synth/paramMeta";

type UseMidiLearnBindingsOptions = {
	applyBindings?: boolean;
};

export function useMidiLearnBindings({
	applyBindings = true,
}: UseMidiLearnBindingsOptions = {}) {
	const edgeTriggeredStates = useRef<Record<string, boolean>>({});
	const learnBindingFromWebMidi = useCallback((channel: number, cc: number) => {
		const bridgeAddBinding = (
			window as Window & {
				__czAddMidiBinding?: (
					key: string,
					ch: number,
					controller: number,
				) => void;
			}
		).__czAddMidiBinding;
		if (typeof bridgeAddBinding === "function") {
			return false;
		}

		const store = useMidiLearnStore.getState();
		if (!store.learnMode || !store.pendingLearnParam) {
			return false;
		}

		store.addBinding(store.pendingLearnParam, channel, cc);
		return true;
	}, []);

	const applyBinding = useCallback(
		(channel: number, cc: number, rawValue: number) => {
			const bindings = useMidiLearnStore
				.getState()
				.getBindingsForMidi(channel, cc);
			if (bindings.length === 0) return;

			for (const binding of bindings) {
				const meta =
					ENGINE_PARAM_UI_META_BY_KEY[
						binding.paramKey as keyof typeof ENGINE_PARAM_UI_META_BY_KEY
					];
				const min = meta?.min ?? 0;
				const max = meta?.max ?? 1;
				const range = max - min;
				const normalizedValue = rawValue / 127;
				const mappedValue = min + normalizedValue * range;

				const setterName =
					SYNTH_PARAM_SETTERS[
						binding.paramKey as keyof typeof SYNTH_PARAM_SETTERS
					];
				if (!setterName) {
					const registration = getMidiLearnTargetRegistration(binding.paramKey);
					if (registration?.mode === "edge-trigger") {
						const threshold = registration.threshold ?? 64;
						const isHigh = rawValue >= threshold;
						const wasHigh =
							edgeTriggeredStates.current[binding.paramKey] === true;
						edgeTriggeredStates.current[binding.paramKey] = isHigh;
						if (!isHigh || wasHigh) {
							continue;
						}
					}
					applyRegisteredMidiLearnTarget(binding.paramKey, rawValue);
					continue;
				}

				const store = useSynthStore.getState() as unknown as Record<
					string,
					(value: number) => void
				>;
				const setter = store[setterName];
				if (typeof setter === "function") {
					setter(mappedValue);
				}
			}
		},
		[],
	);

	const onMidiCc = useCallback(
		(event: Event) => {
			const detail = (event as CustomEvent).detail as {
				channel: number;
				cc: number;
				rawValue: number;
			};
			if (!detail) return;

			const { channel, cc, rawValue } = detail;
			if (learnBindingFromWebMidi(channel, cc)) {
				return;
			}
			if (applyBindings) {
				applyBinding(channel, cc, rawValue);
			}
		},
		[applyBinding, applyBindings, learnBindingFromWebMidi],
	);

	useEffect(() => {
		ensureMidiLearnStateHydrated();
		window.addEventListener("cz-midi-cc", onMidiCc);
		return () => window.removeEventListener("cz-midi-cc", onMidiCc);
	}, [onMidiCc]);
}
