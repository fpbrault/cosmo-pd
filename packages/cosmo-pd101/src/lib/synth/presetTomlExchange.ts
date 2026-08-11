import { parse } from "smol-toml";
import type {
	FxSlotConfig,
	ModRoute,
	SynthParams,
	SynthPresetV1,
} from "@/lib/synth/bindings/synth";
import { migrateSynthParams } from "@/lib/synth/presetMigration";
import {
	normalizePresetTags,
	type PresetTagOptions,
} from "@/lib/synth/presetTags";
import { normalizeModMatrixLayout } from "./modMatrixModel";
import type { PresetSource } from "./presetSources";

export const COSMO_PRESET_TOML_FORMAT = "cosmo-preset";

type PrimitiveTomlValue = string | number | boolean;
type SerializableTomlValue =
	| PrimitiveTomlValue
	| SerializableTomlValue[]
	| { [key: string]: SerializableTomlValue | null | undefined };

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
	source?: PresetSource;
	sortIndex?: number;
	data: SynthPresetV1;
};

type StoredPresetExportInput = PresetTomlExportInput & {
	source: PresetSource;
};

type Section = {
	path: string;
	values: Record<string, unknown>;
};

const FX_SLOT_COUNT = 6;
const EMPTY_FX_SLOT: FxSlotConfig = { type: "empty" };

const SECTION_ORDER = [
	"params",
	"params.line1",
	"params.line1.engine",
	"params.line1.envelopes",
	"params.line2",
	"params.line2.engine",
	"params.line2.envelopes",
	"params.portamento",
	"params.lfo",
	"params.lfo2",
	"params.random",
	"params.modEnv",
	"params.mod",
	"params.fx",
];

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}

function cloneJson<T>(value: T): T {
	return JSON.parse(JSON.stringify(value)) as T;
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

	if (!isRecord(value)) {
		return value;
	}

	const next: Record<string, unknown> = {};
	for (const [key, entry] of Object.entries(value)) {
		next[key] = normalizeEnvelopeSteps(entry);
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

function normalizeFxSlots(value: unknown): FxSlotConfig[] {
	const slots = Array.from({ length: FX_SLOT_COUNT }, () =>
		cloneJson(EMPTY_FX_SLOT),
	);
	if (!isRecord(value)) {
		return slots;
	}

	for (let index = 0; index < FX_SLOT_COUNT; index += 1) {
		const slot = value[`slot${index + 1}`];
		if (!isRecord(slot) || typeof slot.type !== "string") {
			continue;
		}
		if (slot.type === "empty") {
			slots[index] = cloneJson(EMPTY_FX_SLOT);
			continue;
		}
		slots[index] = {
			type: slot.type,
			params: isRecord(slot.params) ? cloneJson(slot.params) : {},
		} as FxSlotConfig;
	}

	return slots;
}

function normalizeModRoutes(value: unknown): ModRoute[] {
	if (!isRecord(value) || !Array.isArray(value.routes)) {
		return [];
	}
	return value.routes
		.filter(isRecord)
		.map((route) => cloneJson(route) as ModRoute);
}

function normalizeModLayout(value: unknown, routes: ModRoute[]) {
	if (!isRecord(value)) {
		return normalizeModMatrixLayout(undefined, routes);
	}

	const pageValues = [value.page1, value.page2];
	if (value.page3 !== undefined) {
		pageValues.push(value.page3);
	}
	const pages = pageValues.map((page) => {
		if (!isRecord(page)) {
			return null;
		}
		return {
			sources: Array.isArray(page.sources)
				? page.sources.map((entry) => (entry === "none" ? null : entry))
				: page.sources,
			destinations: Array.isArray(page.destinations)
				? page.destinations.map((entry) => (entry === "none" ? null : entry))
				: page.destinations,
			cells: Array.isArray(page.cells)
				? page.cells.map((row) =>
						Array.isArray(row)
							? row.map((entry) => (entry === "none" ? null : entry))
							: row,
					)
				: page.cells,
		};
	});

	return normalizeModMatrixLayout({ pages }, routes);
}

function normalizeParsedParams(value: unknown): SynthParams | null {
	if (!isRecord(value)) {
		return null;
	}

	const params = normalizeEnvelopeSteps(cloneJson(value));
	if (!isRecord(params)) {
		return null;
	}

	const fx = params.fx;
	const mod = params.mod;
	delete params.fx;
	delete params.mod;
	params.fxSlots = normalizeFxSlots(fx);
	const routes = normalizeModRoutes(mod);
	params.modMatrix = {
		routes,
		layout: normalizeModLayout(isRecord(mod) ? mod.layout : undefined, routes),
	};

	return migrateSynthParams(params);
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
		params.fxSlots.length === FX_SLOT_COUNT
	);
}

function getString(value: unknown): string | null {
	return typeof value === "string" ? value : null;
}

function getBoolean(value: unknown): boolean | null {
	return typeof value === "boolean" ? value : null;
}

function getTags(value: unknown): PresetTagOptions[] {
	return normalizePresetTags(
		Array.isArray(value)
			? value.filter((tag): tag is string => typeof tag === "string")
			: [],
	);
}

export function parsePresetToml(input: string): ParsedPresetToml | null {
	let document: unknown;
	try {
		document = parse(input);
	} catch {
		return null;
	}
	if (
		!isRecord(document) ||
		getString(document.format) !== COSMO_PRESET_TOML_FORMAT
	) {
		return null;
	}

	const name = getString(document.name);
	if (!name?.trim()) {
		return null;
	}

	const params = normalizeParsedParams(document.params);
	const data = { schemaVersion: 1, params };
	if (!isSynthPresetV1(data)) {
		return null;
	}

	return {
		id: getString(document.id) ?? undefined,
		name: name.trim(),
		author: getString(document.author)?.trim() ?? "",
		description: getString(document.description)?.trim() ?? "",
		tags: getTags(document.tags),
		starred: getBoolean(document.starred) ?? false,
		favorite: getBoolean(document.favorite) ?? false,
		data,
	};
}

function escapeTomlString(value: string): string {
	return JSON.stringify(value);
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
					Array.isArray(step) &&
					step.length === 2 &&
					typeof step[0] === "number" &&
					typeof step[1] === "number",
			)
		) {
			return `[${value.map(([level, rate]) => `[${level}, ${rate}]`).join(", ")}]`;
		}
		return `[${value.map((item) => toTomlValue(item, path)).join(", ")}]`;
	}
	if (isRecord(value)) {
		const entries = Object.entries(value).filter(
			(([, entry]) => entry !== undefined && entry !== null) as (
				entry: [string, unknown],
			) => entry is [string, SerializableTomlValue],
		);
		return `{ ${entries
			.map(([key, entry]) => `${key} = ${toTomlValue(entry, [...path, key])}`)
			.join(", ")} }`;
	}
	return '""';
}

function isEmptyFxSlot(slot: FxSlotConfig | undefined): boolean {
	return !slot || slot.type === "empty";
}

function encodeEnvelopeSteps(value: unknown): unknown {
	if (Array.isArray(value)) {
		if (
			value.every(
				(step) =>
					isRecord(step) &&
					typeof step.level === "number" &&
					typeof step.rate === "number",
			)
		) {
			return value.map((step) => [step.level, step.rate]);
		}
		return value.map(encodeEnvelopeSteps);
	}
	if (!isRecord(value)) {
		return value;
	}
	const next: Record<string, unknown> = {};
	for (const [key, entry] of Object.entries(value)) {
		if (entry !== undefined && entry !== null) {
			next[key] = encodeEnvelopeSteps(entry);
		}
	}
	return next;
}

function encodeFxSlots(
	fxSlots: SynthParams["fxSlots"],
): Record<string, unknown> {
	const fx: Record<string, unknown> = {};
	for (const [index, slot] of (fxSlots ?? []).entries()) {
		if (index >= FX_SLOT_COUNT || isEmptyFxSlot(slot)) {
			continue;
		}
		fx[`slot${index + 1}`] = encodeEnvelopeSteps(slot);
	}
	return fx;
}

function encodeParams(params: SynthParams): Record<string, unknown> {
	const encoded = encodeEnvelopeSteps(cloneJson(params));
	if (!isRecord(encoded)) {
		return {};
	}

	const fxSlots = params.fxSlots;
	const routes = params.modMatrix?.routes ?? [];
	const layout = params.modMatrix?.layout;
	delete encoded.fxSlots;
	delete encoded.modMatrix;

	const fx = encodeFxSlots(fxSlots);
	if (Object.keys(fx).length > 0) {
		encoded.fx = fx;
	}
	encoded.mod = {
		routes: routes.map((route) => encodeEnvelopeSteps(route)),
		layout: layout
			? {
					page1: layout.pages?.[0],
					page2: layout.pages?.[1],
					page3: layout.pages?.[2],
				}
			: undefined,
	};

	return encoded;
}

function sectionRank(path: string): number {
	const index = SECTION_ORDER.indexOf(path);
	return index === -1 ? SECTION_ORDER.length : index;
}

function sortKeys(keys: string[]): string[] {
	return [...keys].sort((left, right) => left.localeCompare(right));
}

function collectSections(
	path: string,
	value: Record<string, unknown>,
	sections: Section[],
) {
	const scalars: Record<string, unknown> = {};
	const children: Array<[string, Record<string, unknown>]> = [];

	for (const key of sortKeys(Object.keys(value))) {
		const entry = value[key];
		if (entry === undefined || entry === null) {
			continue;
		}
		if (isRecord(entry)) {
			children.push([key, entry]);
			continue;
		}
		scalars[key] = entry;
	}

	if (Object.keys(scalars).length > 0) {
		sections.push({ path, values: scalars });
	}

	for (const [key, child] of children) {
		collectSections(`${path}.${key}`, child, sections);
	}
}

function compareSections(left: Section, right: Section): number {
	return (
		sectionRank(left.path) - sectionRank(right.path) ||
		left.path.localeCompare(right.path, undefined, { numeric: true })
	);
}

function writeSection(section: Section): string[] {
	const lines = [`[${section.path}]`];
	for (const key of sortKeys(Object.keys(section.values))) {
		const value = section.values[key];
		if (value !== undefined && value !== null) {
			lines.push(
				`${key} = ${toTomlValue(value, section.path.split(".").concat(key))}`,
			);
		}
	}
	return lines;
}

function writeModRoutes(routes: unknown): string[] {
	if (!Array.isArray(routes) || routes.length === 0) {
		return [];
	}

	const lines: string[] = [];
	for (const route of routes) {
		if (!isRecord(route)) {
			continue;
		}
		lines.push("[[params.mod.routes]]");
		for (const key of ["source", "destination", "amount", "enabled"]) {
			const value = route[key];
			if (value !== undefined && value !== null) {
				lines.push(
					`${key} = ${toTomlValue(value, ["params", "mod", "routes", key])}`,
				);
			}
		}
		lines.push("");
	}
	if (lines.at(-1) === "") {
		lines.pop();
	}
	return lines;
}

function writeModLayout(layout: unknown): string[] {
	if (!isRecord(layout)) {
		return [];
	}

	const lines: string[] = [];
	for (const [index, key] of ["page1", "page2", "page3"].entries()) {
		const page = layout[key];
		if (!isRecord(page)) {
			continue;
		}

		const sources = Array.isArray(page.sources)
			? page.sources.map((entry) => entry ?? "none")
			: [];
		const destinations = Array.isArray(page.destinations)
			? page.destinations.map((entry) => entry ?? "none")
			: [];
		const cells = Array.isArray(page.cells)
			? page.cells.map((row) =>
					Array.isArray(row) ? row.map((cell) => cell ?? "none") : row,
				)
			: [];
		if (sources.length !== 8 || destinations.length !== 8) {
			continue;
		}

		lines.push(
			`[params.mod.layout.page${index + 1}]`,
			`sources = ${toTomlValue(sources)}`,
			`destinations = ${toTomlValue(destinations)}`,
			...(cells.length === 8 ? [`cells = ${toTomlValue(cells)}`] : []),
			"",
		);
	}
	if (lines.at(-1) === "") {
		lines.pop();
	}
	return lines;
}

export function exportPresetToToml(input: PresetTomlExportInput): string {
	const lines = [`format = ${escapeTomlString(COSMO_PRESET_TOML_FORMAT)}`];
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
	if (input.source) {
		lines.push(`source = ${escapeTomlString(input.source)}`);
	}
	if (typeof input.sortIndex === "number") {
		lines.push(`sortIndex = ${toTomlValue(input.sortIndex)}`);
	}

	const params = encodeParams(input.data.params);
	const modRoutes = isRecord(params.mod) ? params.mod.routes : undefined;
	const modLayout = isRecord(params.mod) ? params.mod.layout : undefined;
	if (isRecord(params.mod)) {
		delete params.mod.routes;
		delete params.mod.layout;
		if (Object.keys(params.mod).length === 0) {
			delete params.mod;
		}
	}

	const sections: Section[] = [];
	collectSections("params", params, sections);
	for (const section of sections.sort(compareSections)) {
		lines.push("", ...writeSection(section));
	}

	const layoutLines = writeModLayout(modLayout);
	if (layoutLines.length > 0) {
		lines.push("", ...layoutLines);
	}

	const routeLines = writeModRoutes(modRoutes);
	if (routeLines.length > 0) {
		lines.push("", ...routeLines);
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
		source: preset.source,
		data: preset.data,
	});
}
