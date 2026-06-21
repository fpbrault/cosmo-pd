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
import { ENGINE_MIDI_PARAM_RANGES_BY_KEY } from "@/lib/synth/paramMeta";

type UseMidiLearnBindingsOptions = {
	applyBindings?: boolean;
};

export function useMidiLearnBindings({
	applyBindings = true,
}: UseMidiLearnBindingsOptions = {}) {
	const edgeTriggeredStates = useRef<Record<string, boolean>>({});
	const learnBindingFromWebMidi = useCallback((channel: number, cc: number) => {
		const bridgeAddBinding = window.__czAddMidiBinding;
		const store = useMidiLearnStore.getState();
		if (!store.learnMode || !store.pendingLearnParam) {
			return false;
		}

		if (typeof bridgeAddBinding === "function") {
			// Plugin mode: native/plugin host path captures MIDI learn.
			// Do NOT create local authoritative binding — native owns it.
			return true;
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
			const pluginBacked = typeof window.__czAddMidiBinding === "function";

			for (const binding of bindings) {
				const nativeRange = ENGINE_MIDI_PARAM_RANGES_BY_KEY.get(
					binding.paramKey,
				);
				if (pluginBacked && nativeRange) {
					continue;
				}

				const registration = getMidiLearnTargetRegistration(binding.paramKey);
				if (registration) {
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

				if (!nativeRange) {
					continue;
				}
				const normalizedValue = rawValue / 127;
				let mappedValue =
					nativeRange.min +
					normalizedValue * (nativeRange.max - nativeRange.min);
				if (nativeRange.step != null && nativeRange.step > 0) {
					mappedValue =
						Math.round(mappedValue / nativeRange.step) * nativeRange.step;
				}
				const setterName =
					SYNTH_PARAM_SETTERS[
						binding.paramKey as keyof typeof SYNTH_PARAM_SETTERS
					];
				if (!setterName) {
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
