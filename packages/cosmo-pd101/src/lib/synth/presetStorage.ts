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

const DB_NAME = "cosmo-pd101-preset-storage";
const DB_VERSION = 1;

export type { PresetMetadata };
export type StoredPreset = FrontendPresetV1;

export type CurrentPresetSession = {
	activePresetId: string | null;
	activePresetNameBase: string;
	loadedPresetFingerprint: string | null;
};

type StoredPresetInput = {
	id?: string;
	name: string;
	data: SynthPresetV1;
	source?: PresetSource;
	author?: string;
	starred?: boolean;
	tags?: PresetTagOptions[];
};

let dbPromise: Promise<IDBDatabase> | null = null;

function getDb(): Promise<IDBDatabase> {
	if (!dbPromise) {
		dbPromise = new Promise((resolve, reject) => {
			const request = indexedDB.open(DB_NAME, DB_VERSION);
			request.onupgradeneeded = () => {
				const db = request.result;
				if (!db.objectStoreNames.contains("presets")) {
					db.createObjectStore("presets", { keyPath: "id" });
				}
				if (!db.objectStoreNames.contains("kv")) {
					db.createObjectStore("kv", { keyPath: "key" });
				}
				if (!db.objectStoreNames.contains("favorites")) {
					db.createObjectStore("favorites", { keyPath: "id" });
				}
			};
			request.onsuccess = () => resolve(request.result);
			request.onerror = () => {
				dbPromise = null;
				reject(request.error);
			};
		});
	}
	return dbPromise;
}

function getFromStore<T>(storeName: string, id: string): Promise<T | null> {
	return getDb().then(
		(db) =>
			new Promise((resolve, reject) => {
				const tx = db.transaction(storeName, "readonly");
				const request = tx.objectStore(storeName).get(id);
				request.onsuccess = () => resolve((request.result as T) ?? null);
				request.onerror = () => reject(request.error);
			}),
	);
}

function getAllFromStore<T>(storeName: string): Promise<T[]> {
	return getDb().then(
		(db) =>
			new Promise((resolve, reject) => {
				const tx = db.transaction(storeName, "readonly");
				const request = tx.objectStore(storeName).getAll();
				request.onsuccess = () => resolve(request.result as T[]);
				request.onerror = () => reject(request.error);
			}),
	);
}

function putInStore(storeName: string, value: unknown): Promise<void> {
	return getDb().then(
		(db) =>
			new Promise((resolve, reject) => {
				const tx = db.transaction(storeName, "readwrite");
				tx.objectStore(storeName).put(value);
				tx.oncomplete = () => resolve();
				tx.onerror = () => reject(tx.error);
			}),
	);
}

function deleteFromStore(storeName: string, id: string): Promise<void> {
	return getDb().then(
		(db) =>
			new Promise((resolve, reject) => {
				const tx = db.transaction(storeName, "readwrite");
				tx.objectStore(storeName).delete(id);
				tx.oncomplete = () => resolve();
				tx.onerror = () => reject(tx.error);
			}),
	);
}

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

export async function saveStoredPreset(
	input: StoredPresetInput,
): Promise<StoredPreset> {
	const stored = createStoredPreset(input);
	await putInStore("presets", stored);
	return stored;
}

export async function listStoredPresets(): Promise<StoredPreset[]> {
	const presets = await getAllFromStore<StoredPreset>("presets");
	return presets.sort((left, right) =>
		left.name.localeCompare(right.name, undefined, {
			numeric: true,
			sensitivity: "base",
		}),
	);
}

export async function loadStoredPreset(
	id: string,
): Promise<StoredPreset | null> {
	return getFromStore<StoredPreset>("presets", id);
}

export async function loadPreset(id: string): Promise<SynthPresetV1 | null> {
	const stored = await getFromStore<StoredPreset>("presets", id);
	return stored?.data ?? null;
}

export async function updateStoredPreset(
	id: string,
	updates: Partial<Omit<StoredPreset, "id">>,
): Promise<StoredPreset | null> {
	const current = await getFromStore<StoredPreset>("presets", id);
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
	await putInStore("presets", next);
	return next;
}

export async function updatePresetMetadata(
	id: string,
	metadata: Partial<PresetMetadata>,
): Promise<boolean> {
	const result = await updateStoredPreset(id, metadata);
	return result !== null;
}

export async function renamePreset(
	id: string,
	newName: string,
): Promise<boolean> {
	const result = await updateStoredPreset(id, { name: newName });
	return result !== null;
}

export async function deletePreset(id: string): Promise<void> {
	const db = await getDb();
	await new Promise<void>((resolve, reject) => {
		const tx = db.transaction(["presets", "favorites"], "readwrite");
		tx.objectStore("presets").delete(id);
		tx.objectStore("favorites").delete(id);
		tx.oncomplete = () => resolve();
		tx.onerror = () => reject(tx.error);
	});
}

export async function exportPreset(id: string): Promise<string | null> {
	const preset = await getFromStore<StoredPreset>("presets", id);
	if (!preset) {
		return null;
	}

	return JSON.stringify(preset, null, 2);
}

export async function importPreset(json: string): Promise<StoredPreset | null> {
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

export async function loadPresetFavorite(id: string): Promise<boolean> {
	const entry = await getFromStore<{ id: string }>("favorites", id);
	return entry !== null;
}

export async function setPresetFavorite(
	id: string,
	favorite: boolean,
): Promise<void> {
	if (favorite) {
		await putInStore("favorites", { id });
	} else {
		await deleteFromStore("favorites", id);
	}
}

export async function listPresetFavorites(): Promise<string[]> {
	const entries = await getAllFromStore<{ id: string }>("favorites");
	return entries.map((entry) => entry.id).sort();
}

export async function saveCurrentState(data: SynthPresetV1): Promise<void> {
	await putInStore("kv", { key: "currentState", value: data });
}

export async function loadCurrentState(): Promise<SynthPresetV1 | null> {
	const entry = await getFromStore<{ key: string; value: SynthPresetV1 }>(
		"kv",
		"currentState",
	);
	if (!entry) return null;

	if (isSynthPresetV1(entry.value)) {
		return entry.value;
	}

	await deleteFromStore("kv", "currentState");
	return null;
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

export async function saveCurrentPresetSession(
	session: CurrentPresetSession,
): Promise<void> {
	await putInStore("kv", { key: "currentSession", value: session });
}

export async function loadCurrentPresetSession(): Promise<CurrentPresetSession | null> {
	const entry = await getFromStore<{ key: string; value: unknown }>(
		"kv",
		"currentSession",
	);
	if (!entry) return null;

	if (isCurrentPresetSession(entry.value)) {
		return entry.value;
	}

	await deleteFromStore("kv", "currentSession");
	return null;
}

export async function deleteDatabase(): Promise<void> {
	if (dbPromise) {
		const db = await dbPromise;
		db.close();
		dbPromise = null;
	}
	await new Promise<void>((resolve, reject) => {
		const request = indexedDB.deleteDatabase(DB_NAME);
		request.onsuccess = () => resolve();
		request.onerror = () => reject(request.error);
	});
}
