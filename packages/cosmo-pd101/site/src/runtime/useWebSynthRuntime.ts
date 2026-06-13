import { useMemo } from "react";
import { useGlobalSynthSettings } from "../../../src/features/synth/globalSynthSettingsStore";
import { useAudioEngine } from "../../../src/features/synth/hooks/useAudioEngine";
import { useMidiLearnBindings } from "../../../src/features/synth/hooks/useMidiLearnBindings";
import { useNoteHandling } from "../../../src/features/synth/hooks/useNoteHandling";
import { useSynthParamsToWorklet } from "../../../src/features/synth/hooks/useSynthParamsToWorklet";
import type { SynthRuntime } from "../../../src/features/synth/runtime/synthRuntime";
import { useSynthStore } from "../../../src/features/synth/synthStore";
import { useSynthUiStore } from "../../../src/features/synth/synthUiStore";
import {
	cosmoWorkletUrl,
	synthBindingsUrl,
	synthWasmUrl,
} from "../../../src/lib/synth/cosmoWorkletUrl";
import { noteToFreq } from "../../../src/lib/synth/waveformPreview";

export function useWebSynthRuntime(): SynthRuntime {
	const gatherState = useSynthStore((s) => s.gatherState);
	const velocityCurve = useSynthStore((s) => s.velocityCurve);
	const keyboardRange = useSynthUiStore((s) => s.keyboardRange);
	const voiceLimit = useGlobalSynthSettings((s) => s.voiceLimit);

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
		pcKeyboardBaseNote: 36 + keyboardRange * 12,
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
		voiceLimit,
	});

	useMidiLearnBindings({ applyBindings: true });

	return useMemo(
		() => ({
			activeNotes: noteHandling.activeNotes,
			pitchBend: noteHandling.pitchBend,
			modWheel: noteHandling.modWheel,
			sendNoteOn: noteHandling.sendNoteOn,
			sendNoteOff: noteHandling.sendNoteOff,
			sendPitchBend: noteHandling.sendPitchBend,
			sendModWheel: noteHandling.sendModWheel,
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
			noteHandling.pitchBend,
			noteHandling.modWheel,
			noteHandling.sendNoteOn,
			noteHandling.sendNoteOff,
			noteHandling.sendPitchBend,
			noteHandling.sendModWheel,
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
