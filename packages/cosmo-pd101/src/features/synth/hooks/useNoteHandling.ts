import { useCallback, useEffect, useRef, useState } from "react";
import { useMidiLearnStore } from "@/features/synth/midiLearnStore";
import type { ModSource } from "@/lib/synth/bindings/synth";
import { noteToFreq, PC_KEY_TO_NOTE } from "@/lib/synth/pdAlgorithms";

type UseNoteHandlingParams = {
	workletNodeRef?: React.MutableRefObject<AudioWorkletNode | null> | null;
	eventSink?: (type: string, payload: Record<string, unknown>) => void;
	/**
	 * Deprecated: velocity curve is now applied in the engine.
	 * Kept for call-site compatibility during migration.
	 */
	velocityCurve?: number;
	/**
	 * When enabled, mapped PC keyboard keys are not preventDefault()'d so the
	 * host can still receive them (used in plugin mode).
	 */
	keyboardPassthrough?: boolean;
};

export type NoteHandlingApi = {
	activeNotes: number[];
	sendNoteOn: (note: number, velocity?: number) => void;
	sendNoteOff: (note: number) => void;
	setSustain: (on: boolean) => void;
	sendPitchBend: (value: number) => void;
	sendModWheel: (value: number) => void;
	sendAftertouch: (value: number) => void;
};

export function useNoteHandling({
	workletNodeRef,
	eventSink,
	velocityCurve: _velocityCurve,
	keyboardPassthrough = false,
}: UseNoteHandlingParams): NoteHandlingApi {
	const dispatchEngineEvent = useCallback(
		(type: string, payload: Record<string, unknown>) => {
			if (eventSink) {
				eventSink(type, payload);
				return;
			}
			workletNodeRef?.current?.port.postMessage({ type, ...payload });
		},
		[eventSink, workletNodeRef],
	);

	const emitModSourceValue = useCallback((source: ModSource, value: number) => {
		window.dispatchEvent(
			new CustomEvent("cz-mod-source", {
				detail: {
					source,
					value: Math.max(0, Math.min(1, value)),
				},
			}),
		);
	}, []);

	const activeNotesRef = useRef<Set<number>>(new Set());
	const sustainedButReleasedRef = useRef<Set<number>>(new Set());
	const sustainRef = useRef(false);
	const [activeNotes, setActiveNotes] = useState<number[]>([]);
	const midiLearnEnabled = useMidiLearnStore((state) => state.enabled);
	const midiLearnActiveTarget = useMidiLearnStore(
		(state) => state.activeTarget,
	);

	const sendNoteOn = useCallback(
		(note: number, velocity = 100) => {
			if (activeNotesRef.current.has(note)) return;
			activeNotesRef.current.add(note);
			setActiveNotes((prev) => (prev.includes(note) ? prev : [...prev, note]));
			const normalizedVelocity = velocity / 127;
			dispatchEngineEvent("noteOn", {
				note,
				frequency: noteToFreq(note),
				velocity: normalizedVelocity,
			});
			emitModSourceValue("velocity", normalizedVelocity);
		},
		[dispatchEngineEvent, emitModSourceValue],
	);

	const sendNoteOff = useCallback(
		(note: number) => {
			activeNotesRef.current.delete(note);
			setActiveNotes((prev) => prev.filter((n) => n !== note));
			if (sustainRef.current) {
				sustainedButReleasedRef.current.add(note);
			} else {
				dispatchEngineEvent("noteOff", { note });
			}
		},
		[dispatchEngineEvent],
	);

	const setSustain = useCallback(
		(on: boolean) => {
			sustainRef.current = on;
			dispatchEngineEvent("sustain", { on });
			if (!on) {
				for (const note of sustainedButReleasedRef.current) {
					if (!activeNotesRef.current.has(note)) {
						dispatchEngineEvent("noteOff", { note });
					}
				}
				sustainedButReleasedRef.current.clear();
			}
		},
		[dispatchEngineEvent],
	);

	const sendPitchBend = useCallback(
		(value: number) => {
			dispatchEngineEvent("pitchBend", { value });
		},
		[dispatchEngineEvent],
	);

	const sendModWheel = useCallback(
		(value: number) => {
			dispatchEngineEvent("modWheel", { value });
			emitModSourceValue("modWheel", value);
		},
		[dispatchEngineEvent, emitModSourceValue],
	);

	const sendAftertouch = useCallback(
		(value: number) => {
			dispatchEngineEvent("aftertouch", { value });
			emitModSourceValue("aftertouch", value);
		},
		[dispatchEngineEvent, emitModSourceValue],
	);

	useEffect(() => {
		dispatchEngineEvent("midiLearnEnabled", {
			enabled: midiLearnEnabled,
		});
	}, [dispatchEngineEvent, midiLearnEnabled]);

	useEffect(() => {
		if (!midiLearnEnabled || !midiLearnActiveTarget) {
			return;
		}

		dispatchEngineEvent("midiLearnTarget", {
			target: midiLearnActiveTarget,
			min: 0,
			max: 1,
			curve: "linear",
		});
	}, [dispatchEngineEvent, midiLearnActiveTarget, midiLearnEnabled]);

	// Keyboard input
	useEffect(() => {
		const beamerRuntime = (
			window as Window & {
				__BEAMER__?: { emit?: (event: string, data?: unknown) => void };
			}
		).__BEAMER__;
		const isPluginRuntime = typeof beamerRuntime?.emit === "function";

		if (isPluginRuntime) {
			return;
		}

		const isTypingTarget = (e: KeyboardEvent) => {
			const target = e.target as HTMLElement | null;
			if (!target) return false;
			if (
				target.isContentEditable ||
				target.closest("[contenteditable='true']")
			) {
				return true;
			}
			if (target.tagName === "TEXTAREA" || target.tagName === "SELECT") {
				return true;
			}
			if (target.tagName !== "INPUT") {
				return false;
			}
			const input = target as HTMLInputElement;
			return !(
				input.type === "range" ||
				input.type === "checkbox" ||
				input.type === "radio" ||
				input.type === "button"
			);
		};

		const keyDown = (event: KeyboardEvent) => {
			if (!document.hasFocus()) return;
			if (isTypingTarget(event)) return;
			if (event.key === " ") {
				if (!keyboardPassthrough) {
					event.preventDefault();
				}
				if (!sustainRef.current) setSustain(true);
				return;
			}
			const key = event.key.toLowerCase();
			const note = PC_KEY_TO_NOTE[key];
			if (note == null) return;
			if (!keyboardPassthrough) {
				event.preventDefault();
			}
			if (activeNotesRef.current.has(note)) return;
			sendNoteOn(note);
		};

		const keyUp = (event: KeyboardEvent) => {
			if (!document.hasFocus()) return;
			if (isTypingTarget(event)) return;
			if (event.key === " ") {
				setSustain(false);
				return;
			}
			const key = event.key.toLowerCase();
			const note = PC_KEY_TO_NOTE[key];
			if (note == null) return;
			sendNoteOff(note);
		};

		window.addEventListener("keydown", keyDown);
		window.addEventListener("keyup", keyUp);
		return () => {
			window.removeEventListener("keydown", keyDown);
			window.removeEventListener("keyup", keyUp);
		};
	}, [keyboardPassthrough, sendNoteOn, sendNoteOff, setSustain]);

	// MIDI input
	useEffect(() => {
		if (!("requestMIDIAccess" in navigator) || !navigator.requestMIDIAccess)
			return;

		let disposed = false;
		const cleanupHandlers: Array<() => void> = [];

		navigator
			.requestMIDIAccess()
			.then((access) => {
				if (disposed) return;

				const bindInputs = () => {
					for (const input of access.inputs.values()) {
						const handler = (event: MIDIMessageEvent) => {
							const data = event.data;
							if (data == null || data.length < 2) return;

							const status = data[0] & 0xf0;

							if (status === 0xb0) {
								const cc = data[1];
								const ccValue = data[2];
								dispatchEngineEvent("midiCc", {
									channel: data[0] & 0x0f,
									controller: cc,
									value: ccValue,
								});
								return;
							}

							if (status === 0xe0 && data.length >= 3) {
								const raw = (data[2] << 7) | data[1];
								sendPitchBend((raw - 8192) / 8192);
								return;
							}

							if (status === 0xd0) {
								sendAftertouch(data[1] / 127);
								return;
							}

							if (status === 0xa0 && data.length >= 3) {
								sendAftertouch(data[2] / 127);
								return;
							}

							if (status === 0x90 && data[2] > 0) {
								sendNoteOn(data[1], data[2]);
							} else if (
								status === 0x80 ||
								(status === 0x90 && data[2] === 0)
							) {
								sendNoteOff(data[1]);
							}
						};

						input.onmidimessage = handler;
						cleanupHandlers.push(() => {
							input.onmidimessage = null;
						});
					}
				};

				bindInputs();

				access.onstatechange = () => {
					if (disposed) return;
					bindInputs();
				};
			})
			.catch((err) => {
				console.warn("[MIDI] Failed to access MIDI inputs:", err);
			});

		return () => {
			disposed = true;
			for (const fn of cleanupHandlers) {
				fn();
			}
		};
	}, [
		dispatchEngineEvent,
		sendPitchBend,
		sendAftertouch,
		sendNoteOn,
		sendNoteOff,
	]);

	return {
		activeNotes,
		sendNoteOn,
		sendNoteOff,
		setSustain,
		sendPitchBend,
		sendModWheel,
		sendAftertouch,
	};
}
