import { useCallback, useEffect } from "react";
import { useMidiLearnStore } from "@/features/synth/midiLearnStore";
import { SYNTH_PARAM_SETTERS } from "@/features/synth/SynthParamController";
import { useSynthStore } from "@/features/synth/synthStore";
import { ENGINE_PARAM_UI_META_BY_KEY } from "@/lib/synth/paramMeta";

export function useMidiLearnBindings() {
	const applyBinding = useCallback(
		(channel: number, cc: number, rawValue: number) => {
			const binding = useMidiLearnStore
				.getState()
				.getBindingForMidi(channel, cc);
			if (!binding) return;

			const meta = ENGINE_PARAM_UI_META_BY_KEY[binding.paramKey];
			const min = meta?.min ?? 0;
			const max = meta?.max ?? 1;
			const range = max - min;
			const normalizedValue = rawValue / 127;
			const mappedValue = min + normalizedValue * range;

			const setterName =
				SYNTH_PARAM_SETTERS[
					binding.paramKey as keyof typeof SYNTH_PARAM_SETTERS
				];
			if (!setterName) return;

			const store = useSynthStore.getState() as Record<
				string,
				(value: number) => void
			>;
			const setter = store[setterName];
			if (typeof setter === "function") {
				setter(mappedValue);
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
			const store = useMidiLearnStore.getState();

			if (store.learnMode) {
				store.captureMidiCc(channel, cc, rawValue);
			} else {
				applyBinding(channel, cc, rawValue);
			}
		},
		[applyBinding],
	);

	useEffect(() => {
		window.addEventListener("cz-midi-cc", onMidiCc);
		return () => window.removeEventListener("cz-midi-cc", onMidiCc);
	}, [onMidiCc]);
}
