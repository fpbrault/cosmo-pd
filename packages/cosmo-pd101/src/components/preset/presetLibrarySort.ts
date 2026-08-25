import type { PresetEntry } from "@/features/synth/types/presetEntry";
import type { SortDirection, SortKey } from "./presetLibraryShared";

export type PresetLibrarySortState = {
	key: SortKey;
	direction: SortDirection;
};

const compareNames = (left: PresetEntry, right: PresetEntry) =>
	left.label.localeCompare(right.label, undefined, {
		numeric: true,
		sensitivity: "base",
	});

export function sortPresetLibraryEntries(
	entries: PresetEntry[],
	sortState: PresetLibrarySortState,
): PresetEntry[] {
	return [...entries].sort((left, right) => {
		if (sortState.key === "star") {
			if (left.starred && right.starred) {
				const leftIndex = left.preset?.sortIndex ?? Infinity;
				const rightIndex = right.preset?.sortIndex ?? Infinity;
				if (leftIndex !== rightIndex) return leftIndex - rightIndex;
			} else if (left.starred !== right.starred) {
				return sortState.direction === "asc"
					? Number(left.starred) - Number(right.starred)
					: Number(right.starred) - Number(left.starred);
			}
			return compareNames(left, right);
		}

		if (sortState.key === "favorite") {
			const comparison = Number(left.favorite) - Number(right.favorite);
			if (comparison === 0) return compareNames(left, right);
			return sortState.direction === "asc" ? comparison : -comparison;
		}

		let comparison = 0;
		if (sortState.key === "author") {
			comparison = left.author.localeCompare(right.author, undefined, {
				sensitivity: "base",
			});
		} else if (sortState.key === "bank") {
			comparison = (left.bankName ?? left.sourceLabel).localeCompare(
				right.bankName ?? right.sourceLabel,
				undefined,
				{ sensitivity: "base" },
			);
		} else if (sortState.key === "tags") {
			comparison = left.tags
				.join(", ")
				.localeCompare(right.tags.join(", "), undefined, {
					sensitivity: "base",
				});
		} else {
			comparison = compareNames(left, right);
		}

		if (comparison === 0 && sortState.key !== "name") {
			comparison = compareNames(left, right);
		}
		return sortState.direction === "asc" ? comparison : -comparison;
	});
}
