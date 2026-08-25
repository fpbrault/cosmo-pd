import type { PresetEntry } from "@/features/synth/types/presetEntry";
import { PRESET_TAG_OPTIONS } from "@/lib/synth/presetTags";
import { getEntrySearchText } from "./presetLibraryShared";

export type PresetLibraryFilters = {
	search: string;
	authorFilter: string | null;
	bankFilter: string | null;
	tagFilters: string[];
};

export type FilterOptions = Array<{ value: string; disabled: boolean }>;

export function applyPresetLibraryFilters(
	entries: PresetEntry[],
	filters: PresetLibraryFilters,
): PresetEntry[] {
	let result = entries;
	const normalizedSearch = filters.search.trim().toLowerCase();
	if (normalizedSearch) {
		result = result.filter((entry) =>
			getEntrySearchText(entry).includes(normalizedSearch),
		);
	}
	if (filters.authorFilter) {
		result = result.filter((entry) => entry.author === filters.authorFilter);
	}
	if (filters.bankFilter) {
		result = result.filter((entry) => entry.bankName === filters.bankFilter);
	}
	if (filters.tagFilters.length > 0) {
		result = result.filter((entry) =>
			filters.tagFilters.every((tag) => entry.tags.includes(tag)),
		);
	}
	return result;
}

export function getPresetFilterOptions(
	entries: PresetEntry[],
	filters: PresetLibraryFilters,
): {
	bankOptions: FilterOptions;
	authorOptions: FilterOptions;
	tagOptions: FilterOptions;
} {
	const availableBanks = Array.from(
		new Set(
			entries
				.map((entry) => entry.bankName?.trim())
				.filter((bankName): bankName is string => Boolean(bankName)),
		),
	).sort((left, right) =>
		left.localeCompare(right, undefined, { sensitivity: "base" }),
	);
	const availableAuthors = Array.from(
		new Set(
			entries
				.map((entry) => entry.author.trim())
				.filter((author) => author.length > 0),
		),
	).sort((left, right) =>
		left.localeCompare(right, undefined, { sensitivity: "base" }),
	);

	return {
		bankOptions: availableBanks.map((bank) => ({
			value: bank,
			disabled:
				bank !== filters.bankFilter &&
				applyPresetLibraryFilters(entries, {
					...filters,
					bankFilter: bank,
				}).length === 0,
		})),
		authorOptions: availableAuthors.map((author) => ({
			value: author,
			disabled:
				author !== filters.authorFilter &&
				applyPresetLibraryFilters(entries, {
					...filters,
					authorFilter: author,
				}).length === 0,
		})),
		tagOptions: PRESET_TAG_OPTIONS.map((tag) => ({
			value: tag,
			disabled:
				!filters.tagFilters.includes(tag) &&
				applyPresetLibraryFilters(entries, {
					...filters,
					tagFilters: [...filters.tagFilters, tag],
				}).length === 0,
		})),
	};
}

export function countActivePresetFilters(
	filters: PresetLibraryFilters,
): number {
	return (
		Number(filters.search.trim().length > 0) +
		Number(filters.authorFilter !== null) +
		Number(filters.bankFilter !== null) +
		filters.tagFilters.length
	);
}
