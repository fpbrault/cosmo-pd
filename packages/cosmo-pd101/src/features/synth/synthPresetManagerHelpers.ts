import type { LibraryPreset } from "@/features/synth/types/libraryPreset";
import type { PresetEntry } from "@/features/synth/types/presetEntry";
import { getPresetSourceLabel } from "@/lib/synth/presetSources";
import type { StoredPreset } from "@/lib/synth/presetStorage";
import { inferPresetTags, normalizePresetTags } from "@/lib/synth/presetTags";
import type { EnginePresetV1, FrontendPresetV1 } from "@/lib/synth/presetTypes";

export type PendingPresetDiffEntry = {
	path: string;
	previous: string;
	next: string;
};

type JsonLike = null | boolean | number | string | JsonLike[] | JsonLikeObject;

type JsonLikeObject = {
	[key: string]: JsonLike | undefined;
};

const presetNameCollator = new Intl.Collator(undefined, {
	numeric: true,
	sensitivity: "base",
});

export function sortPresetEntries(entries: PresetEntry[]): PresetEntry[] {
	return [...entries].sort((a, b) => {
		const labelCompare = presetNameCollator.compare(a.label, b.label);
		return labelCompare === 0
			? presetNameCollator.compare(a.id, b.id)
			: labelCompare;
	});
}

export function buildAllPresetEntries({
	builtinPresets,
	localPresetEntries,
	libraryPresets,
	favoritePresetIds,
}: {
	builtinPresets: Record<string, FrontendPresetV1>;
	localPresetEntries: StoredPreset[];
	libraryPresets: LibraryPreset[];
	favoritePresetIds: string[];
}) {
	const favoriteIds = new Set(favoritePresetIds);

	return [
		...sortPresetEntries(
			Object.values(builtinPresets).map((preset) => {
				const inferredTags = inferPresetTags(preset.name);
				const builtinTags = normalizePresetTags(
					preset.tags.length > 0 ? preset.tags : inferredTags,
				);

				return {
					id: preset.id,
					label: preset.name,
					type: "builtin" as const,
					source: preset.source,
					sourceLabel: getPresetSourceLabel(preset.source),
					author: preset.author,
					starred: preset.starred,
					favorite: favoriteIds.has(preset.id),
					tags: builtinTags,
				};
			}),
		),
		...sortPresetEntries(
			localPresetEntries.map((entry) => ({
				id: entry.id,
				label: entry.name,
				type: "local" as const,
				source: entry.source,
				sourceLabel: getPresetSourceLabel(entry.source),
				author: entry.author,
				starred: entry.starred,
				favorite: favoriteIds.has(entry.id),
				tags: entry.tags,
			})),
		),
		...sortPresetEntries(
			libraryPresets.map((preset) => {
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

export function getPresetFingerprint(preset: EnginePresetV1): string {
	return JSON.stringify(preset);
}

function parsePresetFingerprint(fingerprint: string | null): JsonLike | null {
	if (!fingerprint) {
		return null;
	}

	try {
		return JSON.parse(fingerprint) as JsonLike;
	} catch {
		return null;
	}
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}

function roundNumber(value: number): number {
	return Math.round(value * 1e6) / 1e6;
}

function formatDiffValue(value: unknown): string {
	if (typeof value === "string") return `"${value}"`;
	if (typeof value === "number") return String(roundNumber(value));
	if (typeof value === "boolean" || value === null) {
		return String(value);
	}
	if (Array.isArray(value)) return `[${value.length} items]`;
	if (isPlainObject(value)) return "{...}";
	if (typeof value === "undefined") return "undefined";
	return String(value);
}

function collectPresetDiffs(
	previousValue: unknown,
	nextValue: unknown,
	out: PendingPresetDiffEntry[],
	path = "",
	maxEntries = 200,
): void {
	const normalizedPrev =
		typeof previousValue === "number"
			? roundNumber(previousValue)
			: previousValue;
	const normalizedNext =
		typeof nextValue === "number" ? roundNumber(nextValue) : nextValue;
	if (out.length >= maxEntries || Object.is(normalizedPrev, normalizedNext)) {
		return;
	}

	if (Array.isArray(previousValue) && Array.isArray(nextValue)) {
		if (previousValue.length !== nextValue.length) {
			out.push({
				path: path ? `${path}.length` : "length",
				previous: String(previousValue.length),
				next: String(nextValue.length),
			});
			if (out.length >= maxEntries) return;
		}

		for (
			let index = 0;
			index < Math.max(previousValue.length, nextValue.length);
			index++
		) {
			collectPresetDiffs(
				previousValue[index],
				nextValue[index],
				out,
				`${path}[${index}]`,
				maxEntries,
			);
			if (out.length >= maxEntries) return;
		}
		return;
	}

	if (isPlainObject(previousValue) && isPlainObject(nextValue)) {
		const keys = Array.from(
			new Set([...Object.keys(previousValue), ...Object.keys(nextValue)]),
		).sort();
		for (const key of keys) {
			const nextPath = path ? `${path}.${key}` : key;
			collectPresetDiffs(
				previousValue[key],
				nextValue[key],
				out,
				nextPath,
				maxEntries,
			);
			if (out.length >= maxEntries) return;
		}
		return;
	}

	out.push({
		path: path || "(root)",
		previous: formatDiffValue(previousValue),
		next: formatDiffValue(nextValue),
	});
}

export function buildPendingPresetDiffs({
	loadedPresetFingerprint,
	currentPresetFingerprint,
	hasUnsavedChanges,
}: {
	loadedPresetFingerprint: string | null;
	currentPresetFingerprint: string;
	hasUnsavedChanges: boolean;
}) {
	const changes: PendingPresetDiffEntry[] = [];
	const previousPreset = parsePresetFingerprint(loadedPresetFingerprint);
	const currentPreset = parsePresetFingerprint(currentPresetFingerprint);

	if (previousPreset !== null && currentPreset !== null) {
		collectPresetDiffs(previousPreset, currentPreset, changes);
	}

	if (changes.length === 0 && hasUnsavedChanges) {
		changes.push({
			path: "(preset)",
			previous: "saved preset",
			next: "current state",
		});
	}

	return changes;
}
