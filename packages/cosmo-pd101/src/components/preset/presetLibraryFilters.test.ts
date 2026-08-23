import { describe, expect, it } from "vitest";
import type { PresetEntry } from "@/features/synth/types/presetEntry";
import {
	applyPresetLibraryFilters,
	countActivePresetFilters,
	getPresetFilterOptions,
} from "./presetLibraryFilters";
import { sortPresetLibraryEntries } from "./presetLibrarySort";

const entries: PresetEntry[] = [
	{
		id: "factory-pad",
		label: "Cloud Pad",
		type: "library",
		source: "cosmo-factory",
		sourceLabel: "Cosmo Factory Library",
		bankName: "Factory",
		author: "Purr Audio",
		description: "Soft and wide",
		starred: true,
		favorite: false,
		tags: ["pad", "synth"],
	},
	{
		id: "user-pad",
		label: "My Pad",
		type: "local",
		source: "user",
		sourceLabel: "User",
		bankName: null,
		author: "User",
		description: "Personal patch",
		starred: false,
		favorite: true,
		tags: ["pad"],
	},
	{
		id: "temple-bass",
		label: "Solid Bass",
		type: "library",
		source: "cz-factory",
		sourceLabel: "Temple Of CZ",
		bankName: "Temple Of CZ",
		author: "Casio",
		description: "",
		starred: false,
		favorite: false,
		tags: ["bass", "synth"],
	},
];

describe("preset library filters", () => {
	it("applies synchronized search, bank, author, and AND tag filters", () => {
		expect(
			applyPresetLibraryFilters(entries, {
				search: "soft",
				bankFilter: "Factory",
				authorFilter: "Purr Audio",
				tagFilters: ["pad", "synth"],
			}).map((entry) => entry.id),
		).toEqual(["factory-pad"]);
	});

	it("disables filter options that cannot extend the current result", () => {
		const options = getPresetFilterOptions(entries, {
			search: "",
			bankFilter: null,
			authorFilter: null,
			tagFilters: ["pad"],
		});

		expect(options.bankOptions).toContainEqual({
			value: "Temple Of CZ",
			disabled: true,
		});
		expect(options.tagOptions).toContainEqual({
			value: "bass",
			disabled: true,
		});
	});

	it("counts each active constraint and selected tag", () => {
		expect(
			countActivePresetFilters({
				search: "pad",
				bankFilter: "Factory",
				authorFilter: "Purr Audio",
				tagFilters: ["pad", "synth"],
			}),
		).toBe(5);
	});

	it("applies the shared library sort order", () => {
		expect(
			sortPresetLibraryEntries(entries, {
				key: "name",
				direction: "desc",
			}).map((entry) => entry.label),
		).toEqual(["Solid Bass", "My Pad", "Cloud Pad"]);
	});
});
