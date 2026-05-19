import { buildDefaultAlgoControls } from "@/lib/synth/algoRef";
import type { SynthPresetV1 } from "@/lib/synth/bindings/synth";
import {
	DEFAULT_DCA_ENV,
	DEFAULT_DCO_ENV,
	DEFAULT_DCW_ENV,
} from "@/lib/synth/pdAlgorithms";
import { createPresetId } from "@/lib/synth/presetIdentity";
import type { PresetSource } from "@/lib/synth/presetSources";
import {
	normalizePresetTags,
	type PresetTagOptions,
} from "@/lib/synth/presetTags";
import type { FrontendPresetV1, PresetMetadata } from "@/lib/synth/presetTypes";

const STORAGE_PREFIX = "cz101-preset-v2-";
const CURRENT_STATE_KEY = "cz101-current-state-v2";
const CURRENT_PRESET_SESSION_KEY = "cz101-current-preset-session-v2";
const PRESET_FAVORITES_KEY = "cz101-preset-favorites-v1";

export type { PresetMetadata };
export type StoredPreset = FrontendPresetV1;

export type CurrentPresetSession = {
	activePresetId: string | null;
	activePresetNameBase: string;
	loadedPresetFingerprint: string | null;
};

type PresetFavoriteMap = Record<string, true | undefined>;

type StoredPresetInput = {
	id?: string;
	name: string;
	data: SynthPresetV1;
	source?: PresetSource;
	author?: string;
	starred?: boolean;
	tags?: PresetTagOptions[];
};

function isSynthPresetV1(value: unknown): value is SynthPresetV1 {
	if (typeof value !== "object" || value === null) return false;
	const candidate = value as Partial<SynthPresetV1> & {
		schemaVersion?: unknown;
		params?: {
			volume?: unknown;
			line1?: unknown;
			line2?: unknown;
			fxSlots?: unknown;
		};
	};
	if (candidate.schemaVersion !== 1) return false;
	if (typeof candidate.params !== "object" || candidate.params === null) {
		return false;
	}
	if (typeof candidate.params.volume !== "number") return false;
	if (
		typeof candidate.params.line1 !== "object" ||
		candidate.params.line1 === null
	) {
		return false;
	}
	if (
		typeof candidate.params.line2 !== "object" ||
		candidate.params.line2 === null
	) {
		return false;
	}
	if (
		!Array.isArray(candidate.params.fxSlots) ||
		candidate.params.fxSlots.length !== 6
	) {
		return false;
	}
	return true;
}

function normalizeMetadata(metadata?: Partial<PresetMetadata>): PresetMetadata {
	return {
		tags: normalizePresetTags(metadata?.tags ?? []),
	};
}

function isStoredPreset(value: unknown): value is StoredPreset {
	if (typeof value !== "object" || value === null) return false;

	const candidate = value as Partial<StoredPreset>;
	return (
		typeof candidate.id === "string" &&
		typeof candidate.name === "string" &&
		(candidate.source === "cosmo-factory" ||
			candidate.source === "user" ||
			candidate.source === "cz-factory") &&
		typeof candidate.author === "string" &&
		typeof candidate.starred === "boolean" &&
		isSynthPresetV1(candidate.data) &&
		Array.isArray(candidate.tags) &&
		candidate.tags.every((tag) => typeof tag === "string")
	);
}

function createStoredPreset(input: StoredPresetInput): StoredPreset {
	const metadata = normalizeMetadata({
		tags: input.tags,
	});
	const basePreset = {
		name: input.name.trim(),
		source: input.source ?? "user",
		author: input.author?.trim() ?? "",
		starred: input.starred ?? false,
		data: input.data,
		tags: metadata.tags,
	};

	return {
		id: input.id ?? createPresetId(basePreset),
		...basePreset,
	};
}

function readStoredPreset(id: string): StoredPreset | null {
	const raw = localStorage.getItem(STORAGE_PREFIX + id);
	if (!raw) return null;

	try {
		const parsed = JSON.parse(raw);
		return isStoredPreset(parsed) ? parsed : null;
	} catch {
		return null;
	}
}

function readFavoriteMap(): PresetFavoriteMap {
	const raw = localStorage.getItem(PRESET_FAVORITES_KEY);
	if (!raw) {
		return {};
	}

	try {
		const parsed = JSON.parse(raw) as Record<string, unknown>;
		return Object.fromEntries(
			Object.entries(parsed).filter(([, value]) => value === true),
		) as PresetFavoriteMap;
	} catch {
		return {};
	}
}

function writeFavoriteMap(favorites: PresetFavoriteMap): void {
	localStorage.setItem(PRESET_FAVORITES_KEY, JSON.stringify(favorites));
}

export const DEFAULT_PRESET: SynthPresetV1 = {
	schemaVersion: 1,
	params: {
		lineSelect: "L1+L2'",
		modMode: "normal",
		octave: 0,
		line1: {
			algo: "cz101",
			algo2: null,
			algoControlsA: buildDefaultAlgoControls("cz101"),
			algoControlsB: buildDefaultAlgoControls("cz101"),
			algoBlend: 0,
			window: "off",
			dcaBase: 1,
			dcwBase: 1,
			modulation: 0,
			detuneNote: 0,
			detuneFine: 0,
			octave: 0,
			dcoEnv: DEFAULT_DCO_ENV,
			dcwEnv: DEFAULT_DCW_ENV,
			dcaEnv: DEFAULT_DCA_ENV,
			keyFollow: 0,
		},
		line2: {
			algo: "cz101",
			algo2: null,
			algoControlsA: buildDefaultAlgoControls("cz101"),
			algoControlsB: buildDefaultAlgoControls("cz101"),
			algoBlend: 0,
			window: "off",
			dcaBase: 1,
			dcwBase: 1,
			modulation: 0,
			detuneNote: 0,
			detuneFine: 0,
			octave: 0,
			dcoEnv: DEFAULT_DCO_ENV,
			dcwEnv: DEFAULT_DCW_ENV,
			dcaEnv: DEFAULT_DCA_ENV,
			keyFollow: 0,
		},
		frequency: 440,
		volume: 1,
		polyMode: "poly8",
		legato: false,
		portamento: {
			enabled: false,
			mode: "time",
			rate: 50,
			time: 0.1,
		},
		lfo: {
			waveform: "sine",
			rate: 5,
			depth: 0,
			symmetry: 0.5,
			retrigger: false,
			offset: 0,
		},
		lfo2: {
			waveform: "sine",
			rate: 5,
			depth: 0,
			symmetry: 0.5,
			retrigger: false,
			offset: 0,
		},
		pitchBendRange: 2,
		modMatrix: { routes: [] },
		fxSlots: [
			{ type: "empty" },
			{ type: "empty" },
			{ type: "empty" },
			{ type: "empty" },
			{ type: "empty" },
			{ type: "empty" },
		],
	},
};

export function saveStoredPreset(input: StoredPresetInput): StoredPreset {
	const stored = createStoredPreset(input);
	localStorage.setItem(STORAGE_PREFIX + stored.id, JSON.stringify(stored));
	return stored;
}

export function listStoredPresets(): StoredPreset[] {
	const presets: StoredPreset[] = [];

	for (let index = 0; index < localStorage.length; index++) {
		const key = localStorage.key(index);
		if (!key?.startsWith(STORAGE_PREFIX)) {
			continue;
		}

		const preset = readStoredPreset(key.slice(STORAGE_PREFIX.length));
		if (preset) {
			presets.push(preset);
		}
	}

	return presets.sort((left, right) =>
		left.name.localeCompare(right.name, undefined, {
			numeric: true,
			sensitivity: "base",
		}),
	);
}

export function loadStoredPreset(id: string): StoredPreset | null {
	return readStoredPreset(id);
}

export function loadPreset(id: string): SynthPresetV1 | null {
	return readStoredPreset(id)?.data ?? null;
}

export function updateStoredPreset(
	id: string,
	updates: Partial<Omit<StoredPreset, "id">>,
): StoredPreset | null {
	const current = readStoredPreset(id);
	if (!current) {
		return null;
	}

	const next = createStoredPreset({
		id: current.id,
		name: updates.name ?? current.name,
		source: updates.source ?? current.source,
		author: updates.author ?? current.author,
		starred: updates.starred ?? current.starred,
		data: updates.data ?? current.data,
		tags: updates.tags ?? current.tags,
	});
	localStorage.setItem(STORAGE_PREFIX + next.id, JSON.stringify(next));
	return next;
}

export function updatePresetMetadata(
	id: string,
	metadata: Partial<PresetMetadata>,
): boolean {
	return updateStoredPreset(id, metadata) !== null;
}

export function renamePreset(id: string, newName: string): boolean {
	return updateStoredPreset(id, { name: newName }) !== null;
}

export function deletePreset(id: string): void {
	localStorage.removeItem(STORAGE_PREFIX + id);

	const favorites = readFavoriteMap();
	if (!favorites[id]) {
		return;
	}

	const { [id]: _, ...rest } = favorites;
	writeFavoriteMap(rest);
}

export function exportPreset(id: string): string | null {
	const preset = readStoredPreset(id);
	if (!preset) {
		return null;
	}

	return JSON.stringify(preset, null, 2);
}

export function importPreset(json: string): StoredPreset | null {
	try {
		const parsed = JSON.parse(json) as Record<string, unknown>;
		if (isStoredPreset(parsed)) {
			return createStoredPreset(parsed);
		}

		if (isSynthPresetV1(parsed)) {
			return createStoredPreset({
				name: "Imported",
				data: parsed,
			});
		}

		if (
			typeof parsed._name === "string" &&
			isSynthPresetV1({
				schemaVersion: parsed.schemaVersion,
				params: parsed.params,
			})
		) {
			return createStoredPreset({
				name: parsed._name,
				data: {
					schemaVersion: parsed.schemaVersion as number,
					params: parsed.params as SynthPresetV1["params"],
				},
			});
		}

		return null;
	} catch {
		return null;
	}
}

export function loadPresetFavorite(id: string): boolean {
	return readFavoriteMap()[id] === true;
}

export function setPresetFavorite(id: string, favorite: boolean): void {
	const favorites = readFavoriteMap();

	if (favorite) {
		favorites[id] = true;
	} else {
		delete favorites[id];
	}

	writeFavoriteMap(favorites);
}

export function listPresetFavorites(): string[] {
	return Object.keys(readFavoriteMap()).sort();
}

export function saveCurrentState(data: SynthPresetV1): void {
	localStorage.setItem(CURRENT_STATE_KEY, JSON.stringify(data));
}

export function loadCurrentState(): SynthPresetV1 | null {
	const raw = localStorage.getItem(CURRENT_STATE_KEY);
	if (!raw) return null;
	try {
		const parsed = JSON.parse(raw);
		if (isSynthPresetV1(parsed)) {
			return parsed;
		}
		localStorage.removeItem(CURRENT_STATE_KEY);
		return null;
	} catch {
		localStorage.removeItem(CURRENT_STATE_KEY);
		return null;
	}
}

function isCurrentPresetSession(value: unknown): value is CurrentPresetSession {
	if (typeof value !== "object" || value === null) return false;
	const candidate = value as Partial<CurrentPresetSession>;
	return (
		(typeof candidate.activePresetId === "string" ||
			candidate.activePresetId === null) &&
		typeof candidate.activePresetNameBase === "string" &&
		(typeof candidate.loadedPresetFingerprint === "string" ||
			candidate.loadedPresetFingerprint === null)
	);
}

export function saveCurrentPresetSession(session: CurrentPresetSession): void {
	localStorage.setItem(CURRENT_PRESET_SESSION_KEY, JSON.stringify(session));
}

export function loadCurrentPresetSession(): CurrentPresetSession | null {
	const raw = localStorage.getItem(CURRENT_PRESET_SESSION_KEY);
	if (!raw) return null;
	try {
		const parsed = JSON.parse(raw);
		if (isCurrentPresetSession(parsed)) {
			return parsed;
		}
		localStorage.removeItem(CURRENT_PRESET_SESSION_KEY);
		return null;
	} catch {
		localStorage.removeItem(CURRENT_PRESET_SESSION_KEY);
		return null;
	}
}
