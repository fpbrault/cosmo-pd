import { beforeEach, describe, expect, it, vi } from "vitest";
import {
	DEFAULT_PRESET,
	deletePreset,
	exportPreset,
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
	beforeEach(() => {
		localStorage.clear();
		vi.clearAllMocks();
	});

	it("saves and loads a stored preset by id", () => {
		const stored = saveStoredPreset({
			name: "Test Preset",
			data: {
				...DEFAULT_PRESET,
				params: { ...DEFAULT_PRESET.params, volume: 0.5 },
			},
			source: "user",
			author: "",
			starred: false,
			tags: ["wind", "synth"],
		});

		expect(loadStoredPreset(stored.id)).toEqual(stored);
		expect(loadPreset(stored.id)).toEqual(stored.data);
	});

	it("keeps ids stable when renaming a stored preset", () => {
		const stored = saveStoredPreset({
			name: "Old Name",
			data: DEFAULT_PRESET,
			source: "user",
			tags: ["synth"],
		});

		expect(renamePreset(stored.id, "New Name")).toBe(true);
		expect(loadStoredPreset(stored.id)?.name).toBe("New Name");
	});

	it("updates local metadata without changing the stored id", () => {
		const stored = saveStoredPreset({
			name: "Meta Preset",
			data: DEFAULT_PRESET,
			source: "user",
		});

		expect(
			updatePresetMetadata(stored.id, {
				tags: ["pad"],
			}),
		).toBe(true);
		expect(loadStoredPreset(stored.id)).toEqual(
			expect.objectContaining({
				id: stored.id,
				tags: ["pad"],
			}),
		);
	});

	it("tracks favorites separately from stored preset payloads", () => {
		const stored = saveStoredPreset({
			name: "Favorite Preset",
			data: DEFAULT_PRESET,
			source: "user",
		});

		setPresetFavorite(stored.id, true);
		expect(loadPresetFavorite(stored.id)).toBe(true);
		expect(listPresetFavorites()).toEqual([stored.id]);

		setPresetFavorite(stored.id, false);
		expect(loadPresetFavorite(stored.id)).toBe(false);
		expect(listPresetFavorites()).toEqual([]);
	});

	it("removes favorite state when deleting a stored preset", () => {
		const stored = saveStoredPreset({
			name: "Delete Me",
			data: DEFAULT_PRESET,
			source: "user",
		});
		setPresetFavorite(stored.id, true);

		deletePreset(stored.id);

		expect(loadStoredPreset(stored.id)).toBeNull();
		expect(loadPresetFavorite(stored.id)).toBe(false);
	});

	it("lists stored presets sorted by name", () => {
		saveStoredPreset({ name: "Zulu", data: DEFAULT_PRESET, source: "user" });
		saveStoredPreset({ name: "Alpha", data: DEFAULT_PRESET, source: "user" });

		expect(listStoredPresets().map((preset) => preset.name)).toEqual([
			"Alpha",
			"Zulu",
		]);
	});

	it("exports and imports full stored presets", () => {
		const stored = saveStoredPreset({
			name: "Export Me",
			data: DEFAULT_PRESET,
			source: "user",
			author: "Me",
			starred: true,
			tags: ["synth", "lead"],
		});

		const json = exportPreset(stored.id);
		expect(json).not.toBeNull();
		expect(importPreset(json as string)).toEqual(stored);
	});

	it("imports raw synth preset payloads", () => {
		const data = {
			...DEFAULT_PRESET,
			params: { ...DEFAULT_PRESET.params, volume: 0.2 },
		};

		expect(importPreset(JSON.stringify(data))).toEqual(
			expect.objectContaining({
				name: "Imported",
				source: "user",
				data,
			}),
		);
	});

	it("updates stored preset fields while preserving the stored id", () => {
		const stored = saveStoredPreset({
			name: "Update Me",
			data: DEFAULT_PRESET,
			source: "user",
		});

		expect(
			updateStoredPreset(stored.id, {
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

	it("saves and loads current state", () => {
		const state = {
			...DEFAULT_PRESET,
			params: { ...DEFAULT_PRESET.params, volume: 0.4 },
		};
		saveCurrentState(state);
		expect(loadCurrentState()).toEqual(state);
	});

	it("removes invalid current state payloads", () => {
		localStorage.setItem("cz101-current-state-v2", "invalid");
		expect(loadCurrentState()).toBeNull();
		expect(localStorage.getItem("cz101-current-state-v2")).toBeNull();
	});

	it("saves and loads current preset sessions", () => {
		const session = {
			activePresetId: "preset-123",
			activePresetNameBase: "My Preset",
			loadedPresetFingerprint: "fingerprint123",
		};
		saveCurrentPresetSession(session);
		expect(loadCurrentPresetSession()).toEqual(session);
	});

	it("removes invalid preset sessions", () => {
		localStorage.setItem("cz101-current-preset-session-v2", "invalid");
		expect(loadCurrentPresetSession()).toBeNull();
		expect(localStorage.getItem("cz101-current-preset-session-v2")).toBeNull();
	});
});
