import type { LibraryPreset } from "@/features/synth/types/libraryPreset";
import type { PresetEntry } from "@/features/synth/types/presetEntry";
import { getPresetSourceLabel } from "@/lib/synth/presetSources";
import type { StoredPreset } from "@/lib/synth/presetStorage";
import { inferPresetTags, normalizePresetTags } from "@/lib/synth/presetTags";

const presetNameCollator = new Intl.Collator(undefined, {
	numeric: true,
	sensitivity: "base",
});

function getDefaultBankMetadata(source: LibraryPreset["source"]) {
	if (source === "cosmo-factory") {
		return {
			bankId: "cosmo-factory",
			bankName: "Cosmo Factory Library",
		};
	}

	if (source === "cz-factory") {
		return {
			bankId: "cz-factory",
			bankName: "Temple Of CZ",
		};
	}

	return {
		bankId: null,
		bankName: null,
	};
}

function sortPresetEntries(entries: PresetEntry[]): PresetEntry[] {
	return [...entries].sort((a, b) => {
		const labelCompare = presetNameCollator.compare(a.label, b.label);
		return labelCompare === 0
			? presetNameCollator.compare(a.id, b.id)
			: labelCompare;
	});
}

export function buildAllPresetEntries({
	localPresetEntries,
	libraryPresets,
	favoritePresetIds,
}: {
	localPresetEntries: StoredPreset[];
	libraryPresets: LibraryPreset[];
	favoritePresetIds: string[];
}) {
	const favoriteIds = new Set(favoritePresetIds);

	return [
		...sortPresetEntries(
			localPresetEntries.map((entry) => ({
				id: entry.id,
				label: entry.name,
				type: "local" as const,
				source: entry.source,
				sourceLabel: getPresetSourceLabel(entry.source),
				bankId: null,
				bankName: null,
				author: entry.author,
				starred: entry.starred,
				favorite: favoriteIds.has(entry.id),
				tags: entry.tags,
			})),
		),
		...sortPresetEntries(
			libraryPresets.map((preset) => {
				const defaultBank = getDefaultBankMetadata(preset.source);
				const presetTags = normalizePresetTags(
					preset.tags && preset.tags.length > 0
						? preset.tags
						: inferPresetTags(preset.name),
				);

				return {
					id: preset.id,
					label: preset.name,
					type: "library" as const,
					source: preset.source,
					sourceLabel: getPresetSourceLabel(preset.source),
					bankId: preset.bankId ?? defaultBank.bankId,
					bankName: preset.bankName ?? defaultBank.bankName,
					author: preset.author,
					starred: preset.starred,
					favorite: favoriteIds.has(preset.id),
					tags: presetTags,
					preset,
				};
			}),
		),
	];
}
