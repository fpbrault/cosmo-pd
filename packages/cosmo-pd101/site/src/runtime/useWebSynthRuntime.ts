import { useMemo } from "react";
import { useAudioEngine } from "../../../src/features/synth/hooks/useAudioEngine";
import { useMidiLearnBindings } from "../../../src/features/synth/hooks/useMidiLearnBindings";
import { useNoteHandling } from "../../../src/features/synth/hooks/useNoteHandling";
import { useSynthParamsToWorklet } from "../../../src/features/synth/hooks/useSynthParamsToWorklet";
import type { SynthRuntime } from "../../../src/features/synth/runtime/synthRuntime";
import { useSynthStore } from "../../../src/features/synth/synthStore";
import {
	cosmoWorkletUrl,
	synthBindingsUrl,
	synthWasmUrl,
} from "../../../src/lib/synth/cosmoWorkletUrl";
import { noteToFreq } from "../../../src/lib/synth/pdAlgorithms";

export function useWebSynthRuntime(): SynthRuntime {
	const gatherState = useSynthStore((s) => s.gatherState);
	const velocityCurve = useSynthStore((s) => s.velocityCurve);

	const {
		audioCtxRef,
		analyserNodeRef,
		workletNodeRef,
		paramsRef,
		audioContextState,
		resumeAudio,
	} = useAudioEngine({
		synthWasmUrl,
		synthBindingsUrl,
		cosmoWorkletUrl,
	});

	const noteHandling = useNoteHandling({
		workletNodeRef,
		velocityCurve,
		midiInputEnabled: true,
	});

	const heldNote =
		noteHandling.activeNotes.length > 0
			? noteHandling.activeNotes[noteHandling.activeNotes.length - 1]
			: null;
	const effectivePitchHz = heldNote != null ? noteToFreq(heldNote) : 220;

	useSynthParamsToWorklet({
		workletNodeRef,
		paramsRef,
		effectivePitchHz,
		gatherState,
	});

	useMidiLearnBindings({ applyBindings: true });

	return useMemo(
		() => ({
			activeNotes: noteHandling.activeNotes,
			sendNoteOn: noteHandling.sendNoteOn,
			sendNoteOff: noteHandling.sendNoteOff,
			sendPolyAftertouch: noteHandling.sendPolyAftertouch,
			panic: noteHandling.panic,
			audioContextState,
			resumeAudio,
			effectivePitchHz,
			analyserNodeRef,
			audioCtxRef,
		}),
		[
			noteHandling.activeNotes,
			noteHandling.sendNoteOn,
			noteHandling.sendNoteOff,
			noteHandling.sendPolyAftertouch,
			noteHandling.panic,
			audioContextState,
			resumeAudio,
			effectivePitchHz,
			analyserNodeRef,
			audioCtxRef,
		],
	);
}
