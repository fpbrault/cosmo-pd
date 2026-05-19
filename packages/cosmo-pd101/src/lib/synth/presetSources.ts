export type PresetSource = "cosmo-factory" | "user" | "cz-factory";

export function getPresetSourceLabel(source: PresetSource): string {
	if (source === "cosmo-factory") {
		return "Cosmo Library";
	}

	if (source === "cz-factory") {
		return "Temple Of CZ";
	}

	return "User";
}
