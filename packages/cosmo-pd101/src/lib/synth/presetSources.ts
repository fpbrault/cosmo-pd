export type PresetSource = "cosmo-factory" | "user" | "cz-factory" | "addon";

export const DEFAULT_USER_PRESET_AUTHOR = "User";

export function normalizePresetAuthor(
	author: string | null | undefined,
	source: PresetSource,
): string {
	const normalized = author?.trim() ?? "";
	return source === "user" && normalized.length === 0
		? DEFAULT_USER_PRESET_AUTHOR
		: normalized;
}

export function getPresetSourceLabel(source: PresetSource): string {
	if (source === "cosmo-factory") {
		return "Cosmo Factory Library";
	}

	if (source === "cz-factory") {
		return "Temple Of CZ";
	}

	if (source === "addon") {
		return "Add-On Bank";
	}

	return "User";
}
