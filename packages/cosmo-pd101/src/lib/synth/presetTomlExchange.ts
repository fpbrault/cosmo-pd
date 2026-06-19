import type { SynthPresetV1 } from "@/lib/synth/bindings/synth";
import { DEFAULT_SYNTH_PARAMS_V1 } from "@/lib/synth/bindings/synth";
import {
	normalizePresetTags,
	type PresetTagOptions,
} from "@/lib/synth/presetTags";
import type { PresetSource } from "./presetSources";

export const COSMO_PRESET_TOML_FORMAT = "cosmo-preset";
export const COSMO_PRESET_TOML_FORMAT_VERSION = 1;
export const COSMO_PRESET_SCHEMA_VERSION = 1;

type TomlPrimitive = string | number | boolean;
type TomlValue =
	| TomlPrimitive
	| TomlValue[]
	| { [key: string]: TomlValue | undefined };

export type ParsedPresetToml = {
	id?: string;
	name: string;
	author: string;
	description: string;
	tags: PresetTagOptions[];
	starred: boolean;
	favorite: boolean;
	data: SynthPresetV1;
};

type PresetTomlExportInput = {
	id?: string;
	name: string;
	author?: string;
	description?: string;
	tags?: PresetTagOptions[];
	starred?: boolean;
	favorite?: boolean;
	data: SynthPresetV1;
};

type StoredPresetExportInput = PresetTomlExportInput & {
	source: PresetSource;
};

type TomlDocument = {
	root: Record<string, TomlValue | undefined>;
	sections: Map<string, Record<string, TomlValue | undefined>>;
};

function clonePreset(preset: SynthPresetV1): SynthPresetV1 {
	return JSON.parse(JSON.stringify(preset)) as SynthPresetV1;
}

const DEFAULT_TOML_BASELINE_PRESET: SynthPresetV1 = {
	schemaVersion: 1,
	params: DEFAULT_SYNTH_PARAMS_V1,
};

function normalizeNewlines(input: string): string {
	return input.replace(/\r\n?/g, "\n");
}

function stripComment(line: string): string {
	let inString = false;
	let escaped = false;
	for (let index = 0; index < line.length; index += 1) {
		const char = line[index];
		if (escaped) {
			escaped = false;
			continue;
		}
		if (char === "\\" && inString) {
			escaped = true;
			continue;
		}
		if (char === '"') {
			inString = !inString;
			continue;
		}
		if (char === "#" && !inString) {
			return line.slice(0, index);
		}
	}
	return line;
}

function splitTopLevel(input: string, separator: string): string[] {
	const parts: string[] = [];
	let current = "";
	let depth = 0;
	let inString = false;
	let escaped = false;

	for (let index = 0; index < input.length; index += 1) {
		const char = input[index];
		if (escaped) {
			current += char;
			escaped = false;
			continue;
		}
		if (char === "\\" && inString) {
			current += char;
			escaped = true;
			continue;
		}
		if (char === '"') {
			inString = !inString;
			current += char;
			continue;
		}
		if (!inString && (char === "[" || char === "{")) {
			depth += 1;
		} else if (!inString && (char === "]" || char === "}")) {
			depth -= 1;
		}
		if (!inString && depth === 0 && char === separator) {
			parts.push(current.trim());
			current = "";
			continue;
		}
		current += char;
	}

	if (current.trim()) {
		parts.push(current.trim());
	}
	return parts;
}

function findTopLevelEquals(input: string): number {
	let depth = 0;
	let inString = false;
	let escaped = false;
	for (let index = 0; index < input.length; index += 1) {
		const char = input[index];
		if (escaped) {
			escaped = false;
			continue;
		}
		if (char === "\\" && inString) {
			escaped = true;
			continue;
		}
		if (char === '"') {
			inString = !inString;
			continue;
		}
		if (!inString && (char === "[" || char === "{")) {
			depth += 1;
		} else if (!inString && (char === "]" || char === "}")) {
			depth -= 1;
		} else if (!inString && depth === 0 && char === "=") {
			return index;
		}
	}
	return -1;
}

function parseTomlString(input: string): string | null {
	if (!input.startsWith('"') || !input.endsWith('"')) {
		return null;
	}
	try {
		return JSON.parse(input) as string;
	} catch {
		return null;
	}
}

function parseTomlValue(input: string): TomlValue | null {
	const value = input.trim();
	const stringValue = parseTomlString(value);
	if (stringValue !== null) {
		return stringValue;
	}
	if (value === "true") {
		return true;
	}
	if (value === "false") {
		return false;
	}
	if (value.startsWith("[") && value.endsWith("]")) {
		const inner = value.slice(1, -1).trim();
		if (!inner) {
			return [];
		}
		const items = splitTopLevel(inner, ",").map(parseTomlValue);
		if (items.some((item) => item === null)) {
			return null;
		}
		return items as TomlValue[];
	}
	if (value.startsWith("{") && value.endsWith("}")) {
		const inner = value.slice(1, -1).trim();
		const object: Record<string, TomlValue | undefined> = {};
		if (!inner) {
			return object;
		}
		for (const entry of splitTopLevel(inner, ",")) {
			const equalsIndex = findTopLevelEquals(entry);
			if (equalsIndex < 1) {
				return null;
			}
			const key = entry.slice(0, equalsIndex).trim();
			const parsed = parseTomlValue(entry.slice(equalsIndex + 1));
			if (!key || parsed === null) {
				return null;
			}
			object[key] = parsed;
		}
		return object;
	}
	if (/^[+-]?(?:\d+\.?\d*|\.\d+)$/.test(value)) {
		const parsed = Number(value);
		return Number.isFinite(parsed) ? parsed : null;
	}
	return null;
}

function parseTomlDocument(input: string): TomlDocument | null {
	const root: Record<string, TomlValue | undefined> = {};
	const sections = new Map<string, Record<string, TomlValue | undefined>>();
	let current = root;

	for (const rawLine of normalizeNewlines(input).split("\n")) {
		const line = stripComment(rawLine).trim();
		if (!line) {
			continue;
		}
		if (line.startsWith("[") && line.endsWith("]")) {
			const section = line.slice(1, -1).trim();
			if (!section || section.includes("[") || section.includes("]")) {
				return null;
			}
			current = sections.get(section) ?? {};
			sections.set(section, current);
			continue;
		}
		const equalsIndex = findTopLevelEquals(line);
		if (equalsIndex < 1) {
			return null;
		}
		const key = line.slice(0, equalsIndex).trim();
		const parsed = parseTomlValue(line.slice(equalsIndex + 1));
		if (!key || parsed === null) {
			return null;
		}
		current[key] = parsed;
	}

	return { root, sections };
}

function getString(value: TomlValue | undefined): string | null {
	return typeof value === "string" ? value : null;
}

function getBoolean(value: TomlValue | undefined): boolean | null {
	return typeof value === "boolean" ? value : null;
}

function getNumber(value: TomlValue | undefined): number | null {
	return typeof value === "number" ? value : null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}

function setNestedValue(
	target: Record<string, unknown>,
	path: string[],
	key: string,
	value: TomlValue,
) {
	let cursor = target;
	for (const segment of path) {
		const next = cursor[segment];
		if (!isRecord(next)) {
			cursor[segment] = {};
		}
		cursor = cursor[segment] as Record<string, unknown>;
	}
	cursor[key] = value;
}

function normalizeEnvelopeSteps(value: unknown): unknown {
	if (Array.isArray(value)) {
		if (
			value.every(
				(step) =>
					Array.isArray(step) &&
					step.length === 2 &&
					typeof step[0] === "number" &&
					typeof step[1] === "number",
			)
		) {
			return value.map(([level, rate]) => ({ level, rate }));
		}
		return value.map(normalizeEnvelopeSteps);
	}
	if (isRecord(value)) {
		const next: Record<string, unknown> = {};
		for (const [key, entry] of Object.entries(value)) {
			next[key] =
				key === "steps"
					? normalizeEnvelopeSteps(entry)
					: normalizeEnvelopeSteps(entry);
		}
		if (
			Array.isArray(next.steps) &&
			typeof next.stepCount !== "number" &&
			next.steps.every((step) => isRecord(step))
		) {
			next.stepCount = next.steps.length;
		}
		return next;
	}
	return value;
}

function mergePatch(target: unknown, patch: unknown): unknown {
	if (Array.isArray(patch)) {
		return patch;
	}
	if (isRecord(target) && isRecord(patch)) {
		const next: Record<string, unknown> = { ...target };
		for (const [key, value] of Object.entries(patch)) {
			next[key] = mergePatch(next[key], value);
		}
		return next;
	}
	return patch;
}

function isSynthPresetV1(value: unknown): value is SynthPresetV1 {
	if (!isRecord(value)) {
		return false;
	}
	const params = value.params;
	return (
		value.schemaVersion === 1 &&
		isRecord(params) &&
		typeof params.volume === "number" &&
		isRecord(params.line1) &&
		isRecord(params.line2) &&
		Array.isArray(params.fxSlots) &&
		params.fxSlots.length === 6
	);
}

function buildPatch(document: TomlDocument): Record<string, unknown> {
	const patch: Record<string, unknown> = {};
	for (const [section, values] of document.sections) {
		const path = section.split(".");
		for (const [key, value] of Object.entries(values)) {
			if (value !== undefined) {
				setNestedValue(patch, path, key, value);
			}
		}
	}
	return normalizeEnvelopeSteps(patch) as Record<string, unknown>;
}

export function parsePresetToml(input: string): ParsedPresetToml | null {
	const document = parseTomlDocument(input);
	if (!document) {
		return null;
	}
	if (getString(document.root.format) !== COSMO_PRESET_TOML_FORMAT) {
		return null;
	}
	if (
		getNumber(document.root.formatVersion) !== COSMO_PRESET_TOML_FORMAT_VERSION
	) {
		return null;
	}
	if (
		getNumber(document.root.presetSchemaVersion) !== COSMO_PRESET_SCHEMA_VERSION
	) {
		return null;
	}
	const name = getString(document.root.name);
	if (!name?.trim()) {
		return null;
	}

	const base = clonePreset(DEFAULT_TOML_BASELINE_PRESET);
	const patch = buildPatch(document);
	const merged = mergePatch(base, patch);
	if (!isSynthPresetV1(merged)) {
		return null;
	}

	return {
		id: getString(document.root.id) ?? undefined,
		name: name.trim(),
		author: getString(document.root.author)?.trim() ?? "",
		description: getString(document.root.description)?.trim() ?? "",
		tags: normalizePresetTags(
			Array.isArray(document.root.tags)
				? document.root.tags.filter(
						(tag): tag is string => typeof tag === "string",
					)
				: [],
		),
		starred: getBoolean(document.root.starred) ?? false,
		favorite: getBoolean(document.root.favorite) ?? false,
		data: merged,
	};
}

function escapeTomlString(value: string): string {
	return JSON.stringify(value);
}

function areEqual(left: unknown, right: unknown): boolean {
	return JSON.stringify(left) === JSON.stringify(right);
}

function toTomlValue(value: unknown, path: string[] = []): string {
	if (typeof value === "string") {
		return escapeTomlString(value);
	}
	if (typeof value === "number") {
		return Number.isFinite(value) ? String(value) : "0";
	}
	if (typeof value === "boolean") {
		return value ? "true" : "false";
	}
	if (Array.isArray(value)) {
		if (
			path.at(-1) === "steps" &&
			value.every(
				(step) =>
					isRecord(step) &&
					typeof step.level === "number" &&
					typeof step.rate === "number",
			)
		) {
			return `[${value.map((step) => `[${step.level}, ${step.rate}]`).join(", ")}]`;
		}
		return `[${value.map((item) => toTomlValue(item, path)).join(", ")}]`;
	}
	if (isRecord(value)) {
		return `{ ${Object.entries(value)
			.map(([key, entry]) => `${key} = ${toTomlValue(entry, [...path, key])}`)
			.join(", ")} }`;
	}
	return '""';
}

function collectDiffSections(
	value: unknown,
	base: unknown,
	path: string[],
	sections: Map<string, string[]>,
) {
	if (isRecord(value) && isRecord(base)) {
		for (const key of Object.keys(value).sort()) {
			collectDiffSections(value[key], base[key], [...path, key], sections);
		}
		return;
	}
	if (areEqual(value, base)) {
		return;
	}
	const key = path.at(-1);
	const section = path.slice(0, -1).join(".");
	if (!key || !section) {
		return;
	}
	const entries = sections.get(section) ?? [];
	entries.push(`${key} = ${toTomlValue(value, path)}`);
	sections.set(section, entries);
}

export function exportPresetToToml(input: PresetTomlExportInput): string {
	const sections = new Map<string, string[]>();
	collectDiffSections(
		input.data.params,
		DEFAULT_TOML_BASELINE_PRESET.params,
		["params"],
		sections,
	);
	const lines = [
		`format = ${escapeTomlString(COSMO_PRESET_TOML_FORMAT)}`,
		`formatVersion = ${COSMO_PRESET_TOML_FORMAT_VERSION}`,
		`presetSchemaVersion = ${COSMO_PRESET_SCHEMA_VERSION}`,
	];
	if (input.id) {
		lines.push(`id = ${escapeTomlString(input.id)}`);
	}
	lines.push(
		`name = ${escapeTomlString(input.name)}`,
		`author = ${escapeTomlString(input.author ?? "")}`,
		`description = ${escapeTomlString(input.description ?? "")}`,
		`tags = ${toTomlValue(input.tags ?? [])}`,
		`starred = ${input.starred ? "true" : "false"}`,
		`favorite = ${input.favorite ? "true" : "false"}`,
	);

	for (const section of Array.from(sections.keys()).sort()) {
		const entries = sections.get(section);
		if (!entries?.length) {
			continue;
		}
		lines.push("", `[${section}]`, ...entries.sort());
	}

	return `${lines.join("\n")}\n`;
}

export function exportStoredPresetToToml(
	preset: StoredPresetExportInput,
	favorite: boolean,
): string {
	return exportPresetToToml({
		id: preset.id,
		name: preset.name,
		author: preset.author,
		description: preset.description,
		tags: preset.tags,
		starred: preset.source === "user" ? false : preset.starred,
		favorite,
		data: preset.data,
	});
}
