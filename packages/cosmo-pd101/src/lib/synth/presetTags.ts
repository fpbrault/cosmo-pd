export const PRESET_TAG_OPTIONS = [
	"bass",
	"bell",
	"brass",
	"drum",
	"effect",
	"guitar",
	"keys",
	"lead",
	"organ",
	"pad",
	"piano",
	"pluck",
	"string",
	"synth",
	"voice",
	"wind",
] as const;

export type PresetTagOptions =
	| "bass"
	| "bell"
	| "brass"
	| "drum"
	| "effect"
	| "guitar"
	| "keys"
	| "lead"
	| "organ"
	| "pad"
	| "piano"
	| "pluck"
	| "string"
	| "synth"
	| "voice"
	| "wind";

export type PresetTag = (typeof PRESET_TAG_OPTIONS)[number];

const PRESET_TAG_SET = new Set<string>(PRESET_TAG_OPTIONS);

const PRESET_TAG_KEYWORDS: Record<PresetTag, string[]> = {
	bass: ["bass", "jaco", "fretless", "slap", "p-bass", "j-bass", "bassline"],
	bell: ["bell", "chime", "mallet"],
	brass: ["brass", "horn", "trumpet", "trombone", "sax", "flugel"],
	drum: [
		"drum",
		"kick",
		"snare",
		"hihat",
		"cymbal",
		"tom",
		"perc",
		"conga",
		"bongo",
		"tabla",
	],
	effect: ["effect", "fx"],
	guitar: ["guitar", "gtr", "guit", "koto"],
	keys: ["keys", "key"],
	lead: ["lead", "solo"],
	organ: ["organ"],
	pad: ["pad", "str", "string", "swell", "warm", "ambient"],
	piano: ["pian", "ep", "rhodes", "clav", "harpsi"],
	pluck: ["pluck", "plucki", "pick", "harp", "kalim"],
	string: ["string", "violin", "cello", "viola", "string"],
	synth: ["synth"],
	voice: ["vox", "voice", "choir", "vocal"],
	wind: ["flute", "oboe", "clarinet", "wind", "whistle"],
};

export function normalizePresetTags(tags: string[]): PresetTag[] {
	return Array.from(
		new Set(
			tags
				.map((tag) => tag.trim().toLowerCase())
				.filter((tag): tag is PresetTag => PRESET_TAG_SET.has(tag)),
		),
	);
}

export function inferPresetTags(name: string): PresetTag[] {
	const normalizedName = name.toLowerCase();
	const inferred: PresetTag[] = [];

	for (const tag of PRESET_TAG_OPTIONS) {
		const keywords = PRESET_TAG_KEYWORDS[tag];
		if (keywords.some((keyword) => normalizedName.includes(keyword))) {
			inferred.push(tag);
		}
	}

	return normalizePresetTags(inferred);
}
