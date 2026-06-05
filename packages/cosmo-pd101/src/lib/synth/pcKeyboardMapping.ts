export const PC_KEYBOARD_DEFAULT_BASE = 48;

export const PC_KEY_TO_NOTE: Record<string, number> = {
	// Row 1 (bottom alpha): white + black keys in chromatic order
	z: 0, // C
	s: 1, // C#
	x: 2, // D
	d: 3, // D#
	c: 4, // E
	v: 5, // F
	g: 6, // F#
	b: 7, // G
	h: 8, // G#
	n: 9, // A
	j: 10, // A#
	m: 11, // B
	",": 12, // C
	l: 13, // C#
	".": 14, // D
	";": 15, // D#
	"/": 16, // E

	// Upper half (rows 3+4): top alpha = white keys, number row = black keys only
	// White keys on Q-P + [, ], \
	q: 17, // F
	w: 19, // G
	e: 21, // A
	r: 23, // B
	t: 24, // C
	y: 26, // D
	u: 28, // E
	i: 29, // F
	o: 31, // G
	p: 33, // A
	"[": 35, // B
	"]": 36, // C
	"\\": 38, // D

	// Black keys (number row) - only where a semitone gap exists
	"2": 18, // F#  (between Q/F and W/G)
	"3": 20, // G#  (between W/G and E/A)
	"4": 22, // A#  (between E/A and R/B)
	"6": 25, // C#  (between T/C and Y/D)
	"7": 27, // D#  (between Y/D and U/E)
	"9": 30, // F#  (between I/F and O/G)
	"0": 32, // G#  (between O/G and P/A)
	"-": 34, // A#  (between P/A and [/B)
};

export const NOTE_TO_PC_KEY: Record<number, string> = {};
for (const [key, offset] of Object.entries(PC_KEY_TO_NOTE)) {
	NOTE_TO_PC_KEY[offset] = key;
}
