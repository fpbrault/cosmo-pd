/**
 * Minimal MIDI file player for testing synth algorithms.
 * Parses Standard MIDI File (SMF) format inline — no external dependency.
 */
import { useCallback, useEffect, useRef, useState } from "react";

// ─── MIDI Parser ──────────────────────────────────────────────────────────────

type MidiNoteEvent = {
	ticks: number;
	type: "noteOn" | "noteOff";
	note: number;
	velocity: number;
};

type ParsedMidi = {
	ticksPerBeat: number;
	tempoUs: number;
	events: MidiNoteEvent[];
};

function readVlq(d: Uint8Array, pos: number): [number, number] {
	let value = 0;
	let bytes = 0;
	let b: number;
	do {
		b = d[pos + bytes];
		value = (value << 7) | (b & 0x7f);
		bytes++;
	} while (b & 0x80);
	return [value, bytes];
}

function readU32(d: Uint8Array, p: number): number {
	return (((d[p] << 24) | (d[p + 1] << 16) | (d[p + 2] << 8) | d[p + 3]) >>>
		0) as number;
}
function readU16(d: Uint8Array, p: number): number {
	return (d[p] << 8) | d[p + 1];
}

function parseMidi(buffer: ArrayBuffer): ParsedMidi {
	const d = new Uint8Array(buffer);
	let pos = 0;

	if (String.fromCharCode(d[0], d[1], d[2], d[3]) !== "MThd") {
		throw new Error("Not a MIDI file");
	}
	pos = 4;

	const headerLen = readU32(d, pos);
	pos += 4;
	pos += 2; // format (skip)
	const numTracks = readU16(d, pos);
	pos += 2;
	const division = readU16(d, pos);
	pos += 2;
	if (headerLen > 6) pos += headerLen - 6;

	if (division & 0x8000) throw new Error("SMPTE time code not supported");
	const ticksPerBeat = division;

	let tempoUs = 500000; // default 120 BPM
	const allEvents: MidiNoteEvent[] = [];

	for (let trackIdx = 0; trackIdx < numTracks; trackIdx++) {
		const chunkType = String.fromCharCode(
			d[pos],
			d[pos + 1],
			d[pos + 2],
			d[pos + 3],
		);
		pos += 4;
		const chunkLen = readU32(d, pos);
		pos += 4;
		const chunkEnd = pos + chunkLen;

		if (chunkType !== "MTrk") {
			pos = chunkEnd;
			continue;
		}

		let tick = 0;
		let lastStatus = 0;

		while (pos < chunkEnd) {
			const [delta, dLen] = readVlq(d, pos);
			pos += dLen;
			tick += delta;

			let status = d[pos];
			if (status & 0x80) {
				// Only channel messages (0x80–0xEF) carry running status.
				// System messages (0xF0+) must never update lastStatus — doing so
				// would corrupt running status for subsequent channel events.
				if (status < 0xf0) lastStatus = status;
				pos++;
			} else {
				status = lastStatus; // running status
			}

			const msgType = status >> 4;

			if (msgType === 0x9) {
				const note = d[pos++];
				const vel = d[pos++];
				if (vel === 0) {
					allEvents.push({ ticks: tick, type: "noteOff", note, velocity: 0 });
				} else {
					allEvents.push({ ticks: tick, type: "noteOn", note, velocity: vel });
				}
			} else if (msgType === 0x8) {
				const note = d[pos++];
				pos++; // skip velocity
				allEvents.push({ ticks: tick, type: "noteOff", note, velocity: 0 });
			} else if (msgType === 0xa) {
				pos += 2; // poly aftertouch
			} else if (msgType === 0xb) {
				pos += 2; // control change
			} else if (msgType === 0xc) {
				pos += 1; // program change
			} else if (msgType === 0xd) {
				pos += 1; // channel aftertouch
			} else if (msgType === 0xe) {
				pos += 2; // pitch bend
			} else if (status === 0xff) {
				// Meta event
				const metaType = d[pos++];
				const [metaLen, mlBytes] = readVlq(d, pos);
				pos += mlBytes;
				if (metaType === 0x51 && metaLen === 3) {
					tempoUs = (d[pos] << 16) | (d[pos + 1] << 8) | d[pos + 2];
				}
				pos += metaLen;
			} else if (status === 0xf0 || status === 0xf7) {
				// SysEx
				const [slen, slBytes] = readVlq(d, pos);
				pos += slBytes + slen;
			}
		}

		pos = chunkEnd;
	}

	allEvents.sort((a, b) => a.ticks - b.ticks);
	return { ticksPerBeat, tempoUs, events: allEvents };
}

// ─── Player Component ─────────────────────────────────────────────────────────

type MidiFilePlayerProps = {
	onNoteOn: (note: number, velocity?: number) => void;
	onNoteOff: (note: number) => void;
};

export default function MidiFilePlayer({
	onNoteOn,
	onNoteOff,
}: MidiFilePlayerProps) {
	const [parsed, setParsed] = useState<ParsedMidi | null>(null);
	const [fileName, setFileName] = useState<string | null>(null);
	const [playing, setPlaying] = useState(false);
	const [loop, setLoop] = useState(false);
	const [tempoMult, setTempoMult] = useState(1.0);

	const playingRef = useRef(false);
	const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
	const activeNotesRef = useRef<Set<number>>(new Set());
	const loopRef = useRef(false);
	const tempoMultRef = useRef(1.0);
	const onNoteOnRef = useRef(onNoteOn);
	const onNoteOffRef = useRef(onNoteOff);

	loopRef.current = loop;
	tempoMultRef.current = tempoMult;
	onNoteOnRef.current = onNoteOn;
	onNoteOffRef.current = onNoteOff;

	const stop = useCallback(() => {
		playingRef.current = false;
		setPlaying(false);
		for (const t of timeoutsRef.current) clearTimeout(t);
		timeoutsRef.current = [];
		for (const note of activeNotesRef.current) onNoteOffRef.current(note);
		activeNotesRef.current.clear();
	}, []);

	const play = useCallback(
		(midi: ParsedMidi) => {
			stop();
			if (midi.events.length === 0) return;

			playingRef.current = true;
			setPlaying(true);

			const usPerBeat = midi.tempoUs / tempoMultRef.current;
			const tickMs = usPerBeat / midi.ticksPerBeat / 1000;
			const timeouts: ReturnType<typeof setTimeout>[] = [];

			for (const evt of midi.events) {
				const ms = evt.ticks * tickMs;
				const t = setTimeout(() => {
					if (!playingRef.current) return;
					if (evt.type === "noteOn") {
						activeNotesRef.current.add(evt.note);
						onNoteOnRef.current(evt.note, evt.velocity);
					} else {
						activeNotesRef.current.delete(evt.note);
						onNoteOffRef.current(evt.note);
					}
				}, ms);
				timeouts.push(t);
			}

			const lastTick = midi.events[midi.events.length - 1]?.ticks ?? 0;
			const endTimer = setTimeout(
				() => {
					if (!playingRef.current) return;
					if (loopRef.current) {
						play(midi);
					} else {
						playingRef.current = false;
						setPlaying(false);
					}
				},
				lastTick * tickMs + 200,
			);
			timeouts.push(endTimer);
			timeoutsRef.current = timeouts;
		},
		[stop],
	);

	// Cleanup on unmount
	useEffect(() => () => stop(), [stop]);

	const handleFile = useCallback(
		(file: File) => {
			file.arrayBuffer().then((buf) => {
				try {
					const midi = parseMidi(buf);
					setParsed(midi);
					setFileName(file.name);
					stop();
				} catch {
					// Not a valid MIDI file — silently ignore
				}
			});
		},
		[stop],
	);

	const handleFileInput = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const file = e.target.files?.[0];
			if (file) handleFile(file);
		},
		[handleFile],
	);

	const handleDrop = useCallback(
		(e: React.DragEvent) => {
			e.preventDefault();
			const file = e.dataTransfer.files[0];
			if (file) handleFile(file);
		},
		[handleFile],
	);

	const displayName = fileName
		? fileName.replace(/\.(mid|midi)$/i, "").slice(0, 18)
		: "DROP MIDI";

	const btnBase =
		"btn btn-xs px-1.5 py-0.5 text-[0.54rem] uppercase tracking-[0.2em] border";
	const btnIdle =
		"border-cz-border bg-transparent text-cz-cream/70 hover:text-cz-cream";

	return (
		<div className="flex items-center gap-1.5">
			<label
				className="cursor-pointer"
				title="Load MIDI file (or drag & drop)"
				onDragOver={(e) => e.preventDefault()}
				onDrop={handleDrop}
			>
				<input
					type="file"
					accept=".mid,.midi"
					className="sr-only"
					onChange={handleFileInput}
				/>
				<span
					className={`${btnBase} ${btnIdle} max-w-36 truncate block`}
					title={fileName ?? undefined}
				>
					{displayName}
				</span>
			</label>

			<button
				type="button"
				disabled={!parsed}
				onClick={() => (playing ? stop() : parsed && play(parsed))}
				className={`${btnBase} ${
					playing ? "border-cz-gold bg-cz-gold/10 text-cz-gold" : btnIdle
				} disabled:opacity-30 disabled:cursor-not-allowed`}
			>
				{playing ? "■ STOP" : "▶ PLAY"}
			</button>

			<button
				type="button"
				onClick={() => setLoop((l) => !l)}
				className={`${btnBase} ${
					loop
						? "border-cz-light-blue/60 bg-cz-light-blue/10 text-cz-light-blue"
						: "border-cz-border/50 bg-transparent text-cz-cream/40 hover:text-cz-cream/70"
				}`}
				title="Loop playback"
			>
				↺ LOOP
			</button>

			<div className="flex items-center gap-0.5 text-[0.54rem] uppercase tracking-[0.18em]">
				<button
					type="button"
					onClick={() =>
						setTempoMult((t) =>
							Math.max(0.25, parseFloat((t - 0.25).toFixed(2))),
						)
					}
					className={`${btnBase} ${btnIdle} w-5 px-0 text-center`}
					title="Slow down"
				>
					−
				</button>
				<span className="min-w-[2.8rem] text-center text-cz-cream/60 tabular-nums">
					{tempoMult.toFixed(2)}×
				</span>
				<button
					type="button"
					onClick={() =>
						setTempoMult((t) =>
							Math.min(4.0, parseFloat((t + 0.25).toFixed(2))),
						)
					}
					className={`${btnBase} ${btnIdle} w-5 px-0 text-center`}
					title="Speed up"
				>
					+
				</button>
			</div>
		</div>
	);
}
