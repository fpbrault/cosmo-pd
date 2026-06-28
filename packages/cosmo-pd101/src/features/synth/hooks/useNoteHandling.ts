import { useCallback, useEffect, useRef, useState } from "react";
import type { ModSource } from "@/lib/synth/bindings/synth";
import {
	PC_KEY_TO_NOTE,
	PC_KEYBOARD_DEFAULT_BASE,
} from "@/lib/synth/pcKeyboardMapping";
import { noteToFreq } from "@/lib/synth/waveformPreview";

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
	keyboardInputEnabled?: boolean;
	pcKeyboardBaseNote?: number;
	midiInputEnabled?: boolean;
};

export type NoteHandlingApi = {
	activeNotes: number[];
	pitchBend: number;
	modWheel: number;
	sendNoteOn: (note: number, velocity?: number) => void;
	sendNoteOff: (note: number) => void;
	panic: () => void;
	setSustain: (on: boolean) => void;
	sendPitchBend: (value: number) => void;
	sendModWheel: (value: number) => void;
	sendAftertouch: (value: number) => void;
	sendPolyAftertouch: (note: number, value: number) => void;
	sendMacro: (index: number, value: number) => void;
};

export function useNoteHandling({
	workletNodeRef,
	eventSink,
	velocityCurve: _velocityCurve,
	keyboardPassthrough = false,
	keyboardInputEnabled = true,
	pcKeyboardBaseNote = PC_KEYBOARD_DEFAULT_BASE,
	midiInputEnabled = true,
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
	const [pitchBend, setPitchBend] = useState(0);
	const [modWheel, setModWheel] = useState(0);

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
			const clamped = Math.max(-1, Math.min(1, value));
			setPitchBend(clamped);
			dispatchEngineEvent("pitchBend", { value: clamped });
		},
		[dispatchEngineEvent],
	);

	const sendModWheel = useCallback(
		(value: number) => {
			const clamped = Math.max(0, Math.min(1, value));
			setModWheel(clamped);
			dispatchEngineEvent("modWheel", { value: clamped });
			emitModSourceValue("modWheel", clamped);
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

	const sendPolyAftertouch = useCallback(
		(note: number, value: number) => {
			dispatchEngineEvent("polyAftertouch", { note, value });
			emitModSourceValue("aftertouch", value);
		},
		[dispatchEngineEvent, emitModSourceValue],
	);

	const sendMacro = useCallback(
		(index: number, value: number) => {
			dispatchEngineEvent("macroValue", { index, value });
			const sourceName = `macro${index + 1}` as ModSource;
			emitModSourceValue(sourceName, value);
		},
		[dispatchEngineEvent, emitModSourceValue],
	);

	const panic = useCallback(() => {
		activeNotesRef.current.clear();
		sustainedButReleasedRef.current.clear();
		sustainRef.current = false;
		setActiveNotes([]);
		setPitchBend(0);
		dispatchEngineEvent("panic", {});
	}, [dispatchEngineEvent]);

	useEffect(() => {
		const onRuntimeModSources = (event: Event) => {
			const detail = (
				event as CustomEvent<{ pitchBend?: number; modWheel?: number }>
			).detail;
			if (typeof detail?.pitchBend === "number") {
				setPitchBend(Math.max(-1, Math.min(1, detail.pitchBend)));
			}
			if (typeof detail?.modWheel === "number") {
				setModWheel(Math.max(0, Math.min(1, detail.modWheel)));
			}
		};
		window.addEventListener("cz-runtime-mod-sources", onRuntimeModSources);
		return () =>
			window.removeEventListener("cz-runtime-mod-sources", onRuntimeModSources);
	}, []);

	// Listen for macro value changes from MacroKnobsPanel
	useEffect(() => {
		const handler = (e: Event) => {
			const detail = (e as CustomEvent<{ index: number; value: number }>)
				.detail;
			if (detail && typeof detail.index === "number") {
				dispatchEngineEvent("macroValue", {
					index: detail.index,
					value: detail.value,
				});
			}
		};
		window.addEventListener("cz-macro-value", handler);
		return () => window.removeEventListener("cz-macro-value", handler);
	}, [dispatchEngineEvent]);

	// Keyboard input
	useEffect(() => {
		if (!keyboardInputEnabled) {
			return;
		}

		const pluginBridgeRuntime = window.__czSetParams;
		const isPluginRuntime = typeof pluginBridgeRuntime === "function";

		// Standalone mode uses the same truce.audio bridge, but we still want
		// PC keyboard note entry (REAPER-style Z/S/X/D/C/... + space sustain)
		// since there's no host DAW to handle keys.
		const isStandalone =
			typeof window !== "undefined" &&
			new URLSearchParams(window.location.search).get("standalone") === "1";

		// In plugin runtime, keep keyboard ownership with the host and disable
		// the in-webview PC keyboard note mapping (A/S/D... + space sustain).
		if (isPluginRuntime && !isStandalone) {
			return;
		}

		const isTypingTarget = (e: KeyboardEvent) => {
			const target = e.target as HTMLElement | null;
			if (!target) return false;
			if (
				target.isContentEditable ||
				(target instanceof Element &&
					target.closest("[contenteditable='true']"))
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
			// Keep note-entry active while focused on sliders and non-text controls.
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
			const offset = PC_KEY_TO_NOTE[key];
			if (offset == null) return;
			if (!keyboardPassthrough) {
				event.preventDefault();
			}
			const note = pcKeyboardBaseNote + offset;
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
			const offset = PC_KEY_TO_NOTE[key];
			if (offset == null) return;
			sendNoteOff(pcKeyboardBaseNote + offset);
		};

		window.addEventListener("keydown", keyDown);
		window.addEventListener("keyup", keyUp);
		return () => {
			window.removeEventListener("keydown", keyDown);
			window.removeEventListener("keyup", keyUp);
		};
	}, [
		keyboardInputEnabled,
		keyboardPassthrough,
		pcKeyboardBaseNote,
		sendNoteOn,
		sendNoteOff,
		setSustain,
	]);

	// MIDI input
	useEffect(() => {
		if (!midiInputEnabled) return;
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

							// CC messages
							if (status === 0xb0) {
								window.dispatchEvent(
									new CustomEvent("cz-midi-cc", {
										detail: {
											channel: data[0] & 0x0f,
											cc: data[1],
											rawValue: data[2],
										},
									}),
								);
								if (data[1] === 1) {
									sendModWheel(data[2] / 127);
								} else if (data[1] === 64) {
									setSustain(data[2] >= 64);
								}
								return;
							}

							// Program change (status 0xC0, program in data1)
							if (status === 0xc0) {
								window.dispatchEvent(
									new CustomEvent("cz-program-change", {
										detail: { program: data[1] },
									}),
								);
								return;
							}

							// Pitch bend
							if (status === 0xe0 && data.length >= 3) {
								const raw = (data[2] << 7) | data[1];
								sendPitchBend((raw - 8192) / 8192);
								return;
							}

							// Channel pressure / aftertouch (status 0xD0, value in data1)
							if (status === 0xd0) {
								sendAftertouch(data[1] / 127);
								return;
							}

							// Poly pressure (status 0xA0, per-note pressure in data2)
							if (status === 0xa0 && data.length >= 3) {
								sendPolyAftertouch(data[1], data[2] / 127);
								return;
							}

							// Note on/off
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
		midiInputEnabled,
		sendModWheel,
		sendPitchBend,
		sendAftertouch,
		sendPolyAftertouch,
		sendNoteOn,
		sendNoteOff,
		setSustain,
	]);

	return {
		activeNotes,
		pitchBend,
		modWheel,
		sendNoteOn,
		sendNoteOff,
		panic,
		setSustain,
		sendPitchBend,
		sendModWheel,
		sendAftertouch,
		sendPolyAftertouch,
		sendMacro,
	};
}
