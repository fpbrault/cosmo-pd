import { describe, expect, it } from "vitest";
import {
	inferPresetTags,
	normalizePresetTags,
	type PRESET_TAG_OPTIONS,
} from "./presetTags";

describe("presetTags", () => {
	it("normalizes, deduplicates, and filters tags", () => {
		expect(
			normalizePresetTags(["  BASS ", "bass", "unknown", " pad ", "PAD"]),
		).toEqual(["bass", "pad"]);
	});

	it("infers expected tags from keywords", () => {
		expect(inferPresetTags("Warm Ambient String Pad")).toEqual(
			expect.arrayContaining(["pad", "string"]),
		);
		expect(inferPresetTags("Jaco Bass Lead")).toEqual(
			expect.arrayContaining(["bass", "lead"]),
		);
	});

	it("supports all categories through representative names", () => {
		const namesByTag: Record<(typeof PRESET_TAG_OPTIONS)[number], string> = {
			bass: "Jaco Bass",
			bell: "Crystal Bell",
			brass: "Vintage Brass Horn",
			drum: "Kick Drum",
			effect: "FX Sweep",
			guitar: "Electric Guitar",
			keys: "House Keys",
			lead: "Solo Lead",
			organ: "Church Organ",
			pad: "Warm Pad",
			piano: "Grand Piano",
			pluck: "Harp Pluck",
			string: "String Ensemble",
			synth: "Analog Synth",
			voice: "Choir Voice",
			wind: "Woodwind Flute",
		};

		for (const [tag, name] of Object.entries(namesByTag)) {
			expect(inferPresetTags(name)).toContain(tag);
		}
	});

	it("returns empty for no matches and is case-insensitive", () => {
		expect(inferPresetTags("Completely Neutral Name")).toEqual([]);
		expect(inferPresetTags("WARM PAD")).toContain("pad");
	});
});
