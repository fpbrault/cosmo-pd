export type PresetSource = "cosmo-factory" | "user" | "cz-factory" | "addon";

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
