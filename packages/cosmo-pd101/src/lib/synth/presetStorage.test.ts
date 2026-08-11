import { beforeEach, describe, expect, it, vi } from "vitest";
import {
	DEFAULT_DCA_ENV,
	DEFAULT_DCO_ENV,
	DEFAULT_DCW_ENV,
} from "./defaultEnvelopes";
import {
	DEFAULT_PRESET,
	deleteDatabase,
	deletePreset,
	exportPreset,
	getDb,
	importPreset,
	listPresetFavorites,
	listStoredPresets,
	loadCurrentPresetSession,
	loadCurrentState,
	loadPreset,
	loadPresetFavorite,
	loadStoredPreset,
	renamePreset,
	saveCurrentPresetSession,
	saveCurrentState,
	saveStoredPreset,
	setPresetFavorite,
	updatePresetMetadata,
	updateStoredPreset,
} from "./presetStorage";

describe("presetStorage", () => {
	beforeEach(async () => {
		await deleteDatabase();
		vi.clearAllMocks();
	});

	it("saves and loads a stored preset by id", async () => {
		const stored = await saveStoredPreset({
			name: "Test Preset",
			data: {
				...DEFAULT_PRESET,
				params: { ...DEFAULT_PRESET.params, volume: 0.5 },
			},
			source: "user",
			author: "",
			description: "A test preset.",
			starred: false,
			tags: ["wind", "synth"],
		});

		expect(await loadStoredPreset(stored.id)).toEqual(stored);
		expect(await loadPreset(stored.id)).toEqual(stored.data);
	});

	it("ships default presets without the legacy keyFollow field", () => {
		expect("keyFollow" in DEFAULT_PRESET.params.line1).toBe(false);
		expect("keyFollow" in DEFAULT_PRESET.params.line2).toBe(false);
	});

	it("keeps ids stable when renaming a stored preset", async () => {
		const stored = await saveStoredPreset({
			name: "Old Name",
			data: DEFAULT_PRESET,
			source: "user",
			tags: ["synth"],
		});

		expect(await renamePreset(stored.id, "New Name")).toBe(true);
		expect((await loadStoredPreset(stored.id))?.name).toBe("New Name");
	});

	it("updates local metadata without changing the stored id", async () => {
		const stored = await saveStoredPreset({
			name: "Meta Preset",
			data: DEFAULT_PRESET,
			source: "user",
		});

		expect(
			await updatePresetMetadata(stored.id, {
				description: "Wide and atmospheric.",
				tags: ["pad"],
			}),
		).toBe(true);
		expect(await loadStoredPreset(stored.id)).toEqual(
			expect.objectContaining({
				id: stored.id,
				description: "Wide and atmospheric.",
				tags: ["pad"],
			}),
		);
	});

	it("tracks favorites separately from stored preset payloads", async () => {
		const stored = await saveStoredPreset({
			name: "Favorite Preset",
			data: DEFAULT_PRESET,
			source: "user",
		});

		await setPresetFavorite(stored.id, true);
		expect(await loadPresetFavorite(stored.id)).toBe(true);
		expect(await listPresetFavorites()).toEqual([stored.id]);

		await setPresetFavorite(stored.id, false);
		expect(await loadPresetFavorite(stored.id)).toBe(false);
		expect(await listPresetFavorites()).toEqual([]);
	});

	it("removes favorite state when deleting a stored preset", async () => {
		const stored = await saveStoredPreset({
			name: "Delete Me",
			data: DEFAULT_PRESET,
			source: "user",
		});
		await setPresetFavorite(stored.id, true);

		await deletePreset(stored.id);

		expect(await loadStoredPreset(stored.id)).toBeNull();
		expect(await loadPresetFavorite(stored.id)).toBe(false);
	});

	it("lists stored presets sorted by name", async () => {
		await saveStoredPreset({
			name: "Zulu",
			data: DEFAULT_PRESET,
			source: "user",
		});
		await saveStoredPreset({
			name: "Alpha",
			data: DEFAULT_PRESET,
			source: "user",
		});

		expect((await listStoredPresets()).map((preset) => preset.name)).toEqual([
			"Alpha",
			"Zulu",
		]);
	});

	it("exports and imports TOML stored presets with favorite state", async () => {
		const stored = await saveStoredPreset({
			name: "Export Me",
			data: {
				...DEFAULT_PRESET,
				params: { ...DEFAULT_PRESET.params, volume: 0.42 },
			},
			source: "user",
			author: "Me",
			description: "Exported with metadata.",
			starred: true,
			tags: ["synth", "lead"],
		});
		await setPresetFavorite(stored.id, true);

		const toml = await exportPreset(stored.id);
		expect(toml).toContain('format = "cosmo-preset"');
		expect(toml).toContain("favorite = true");
		expect(await importPreset(toml as string)).toEqual(
			expect.objectContaining({
				id: stored.id,
				name: stored.name,
				author: "Me",
				description: "Exported with metadata.",
				starred: false,
				favorite: true,
				tags: ["synth", "lead"],
				data: expect.objectContaining({
					params: expect.objectContaining({
						volume: 0.42,
						modMatrix: expect.objectContaining({
							routes: [],
							layout: expect.objectContaining({
								pages: expect.any(Array),
							}),
						}),
					}),
				}),
			}),
		);
	});

	it("normalizes missing legacy descriptions to an empty string", async () => {
		const json = JSON.stringify({
			id: "legacy",
			name: "Legacy",
			source: "user",
			author: "Me",
			starred: false,
			tags: [],
			data: DEFAULT_PRESET,
		});

		expect(await importPreset(json)).toEqual(
			expect.objectContaining({ description: "" }),
		);
	});

	it("normalizes legacy IndexedDB rows when reading them", async () => {
		const db = await getDb();
		await new Promise<void>((resolve, reject) => {
			const tx = db.transaction("presets", "readwrite");
			tx.objectStore("presets").put({
				id: "legacy-row",
				name: "Legacy Row",
				source: "user",
				author: "Me",
				starred: false,
				tags: [],
				data: DEFAULT_PRESET,
			});
			tx.oncomplete = () => resolve();
			tx.onerror = () => reject(tx.error);
		});

		expect(await loadStoredPreset("legacy-row")).toEqual(
			expect.objectContaining({ description: "" }),
		);
		expect(await listStoredPresets()).toEqual([
			expect.objectContaining({ id: "legacy-row", description: "" }),
		]);
	});

	it("migrates legacy flat PD preset rows before applying them", async () => {
		const legacyLine = (
			line: typeof DEFAULT_PRESET.params.line1,
			dcoEnv: typeof DEFAULT_DCO_ENV,
			dcwEnv: typeof DEFAULT_DCW_ENV,
			dcaEnv: typeof DEFAULT_DCA_ENV,
		) => ({
			...line.engine.params,
			synthesisMethod: "pd",
			dcoEnv,
			dcwEnv,
			dcaEnv,
			detuneNote: line.detuneNote,
			detuneFine: line.detuneFine,
			octave: line.octave,
		});
		const legacyData = {
			...DEFAULT_PRESET,
			params: {
				...DEFAULT_PRESET.params,
				line1: legacyLine(
					DEFAULT_PRESET.params.line1,
					DEFAULT_DCO_ENV,
					DEFAULT_DCW_ENV,
					DEFAULT_DCA_ENV,
				),
				line2: legacyLine(
					DEFAULT_PRESET.params.line2,
					DEFAULT_DCO_ENV,
					DEFAULT_DCW_ENV,
					DEFAULT_DCA_ENV,
				),
			},
		};

		const db = await getDb();
		await new Promise<void>((resolve, reject) => {
			const tx = db.transaction("presets", "readwrite");
			tx.objectStore("presets").put({
				id: "legacy-flat-pd",
				name: "Legacy Flat PD",
				source: "user",
				author: "Me",
				starred: false,
				tags: [],
				data: legacyData,
			});
			tx.oncomplete = () => resolve();
			tx.onerror = () => reject(tx.error);
		});

		const migrated = await loadStoredPreset("legacy-flat-pd");
		expect(migrated?.data.params.line1.engine).toEqual(
			expect.objectContaining({
				type: "pd",
				params: expect.objectContaining({ algo: "saw" }),
			}),
		);
		expect(migrated?.data.params.line1.envelopes.pitch).toEqual({
			type: "step",
			params: DEFAULT_DCO_ENV,
		});
	});

	it("imports raw synth preset payloads", async () => {
		const data = {
			...DEFAULT_PRESET,
			params: { ...DEFAULT_PRESET.params, volume: 0.2 },
		};

		expect(await importPreset(JSON.stringify(data))).toEqual(
			expect.objectContaining({
				name: "Imported",
				source: "user",
				data,
			}),
		);
	});

	it("updates stored preset fields while preserving the stored id", async () => {
		const stored = await saveStoredPreset({
			name: "Update Me",
			data: DEFAULT_PRESET,
			source: "user",
		});

		expect(
			await updateStoredPreset(stored.id, {
				author: "Updated",
				starred: true,
			}),
		).toEqual(
			expect.objectContaining({
				id: stored.id,
				author: "Updated",
				starred: true,
			}),
		);
	});

	it("creates distinct ids for identical new user presets", async () => {
		const first = await saveStoredPreset({
			name: "Duplicate",
			data: DEFAULT_PRESET,
			source: "user",
		});
		const second = await saveStoredPreset({
			name: "Duplicate",
			data: DEFAULT_PRESET,
			source: "user",
		});

		expect(first.id).not.toBe(second.id);
		expect((await listStoredPresets()).map((preset) => preset.id)).toEqual(
			expect.arrayContaining([first.id, second.id]),
		);
	});

	it("saves and loads current state", async () => {
		const state = {
			...DEFAULT_PRESET,
			params: { ...DEFAULT_PRESET.params, volume: 0.4 },
		};
		await saveCurrentState(state);
		expect(await loadCurrentState()).toEqual(state);
	});

	it("removes invalid current state payloads", async () => {
		await seedKv("currentState", "invalid");
		expect(await loadCurrentState()).toBeNull();
	});

	it("saves and loads current preset sessions", async () => {
		const session = {
			activePresetId: "preset-123",
			activePresetNameBase: "My Preset",
			isDirty: true,
		};
		await saveCurrentPresetSession(session);
		expect(await loadCurrentPresetSession()).toEqual(session);
	});

	it("removes invalid preset sessions", async () => {
		await seedKv("currentSession", "invalid");
		expect(await loadCurrentPresetSession()).toBeNull();
	});
});

async function seedKv(key: string, value: unknown): Promise<void> {
	await deleteDatabase();
	const db = await new Promise<IDBDatabase>((resolve, reject) => {
		const request = indexedDB.open("cosmo-pd101-preset-storage", 2);
		request.onupgradeneeded = () => {
			const d = request.result;
			if (!d.objectStoreNames.contains("kv")) {
				d.createObjectStore("kv", { keyPath: "key" });
			}
		};
		request.onsuccess = () => resolve(request.result);
		request.onerror = () => reject(request.error);
	});
	await new Promise<void>((resolve, reject) => {
		const tx = db.transaction("kv", "readwrite");
		tx.objectStore("kv").put({ key, value });
		tx.oncomplete = () => resolve();
		tx.onerror = () => reject(tx.error);
	});
	db.close();
}
