import type { SynthPresetV1 } from "@/lib/synth/bindings/synth";
import type { PresetSource } from "@/lib/synth/presetSources";

type CanonicalJson =
	| null
	| boolean
	| number
	| string
	| CanonicalJson[]
	| { [key: string]: CanonicalJson };

export type PresetIdentityFields = {
	id?: string;
	name: string;
	source: PresetSource;
	author: string;
	description: string;
	starred: boolean;
	tags: string[];
	data: SynthPresetV1;
};

function normalizeCanonicalValue(value: unknown): CanonicalJson {
	if (
		value === null ||
		typeof value === "boolean" ||
		typeof value === "string"
	) {
		return value;
	}

	if (typeof value === "number") {
		if (!Number.isFinite(value)) {
			return 0;
		}

		return Object.is(value, -0) ? 0 : value;
	}

	if (Array.isArray(value)) {
		return value.map((entry) => normalizeCanonicalValue(entry));
	}

	if (value && typeof value === "object") {
		const entries = Object.entries(value as Record<string, unknown>)
			.filter(([key]) => key !== "id")
			.sort(([left], [right]) => left.localeCompare(right))
			.map(([key, entry]) => [key, normalizeCanonicalValue(entry)] as const);

		return Object.fromEntries(entries);
	}

	return String(value);
}

function fnv1a64(input: string): string {
	let hash = 0xcbf29ce484222325n;

	for (let index = 0; index < input.length; index++) {
		hash ^= BigInt(input.charCodeAt(index));
		hash = BigInt.asUintN(64, hash * 0x100000001b3n);
	}

	return hash.toString(16).padStart(16, "0");
}

function getPresetIdentityInput(preset: PresetIdentityFields): CanonicalJson {
	return normalizeCanonicalValue({
		name: preset.name,
		source: preset.source,
		author: preset.author,
		description: preset.description,
		starred: preset.starred,
		tags: preset.tags,
		data: preset.data,
	});
}

export function createPresetId(preset: PresetIdentityFields): string {
	const canonical = JSON.stringify(getPresetIdentityInput(preset));
	return `preset_${fnv1a64(canonical)}`;
}
