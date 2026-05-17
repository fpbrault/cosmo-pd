import { beforeEach, describe, expect, it, vi } from "vitest";
import {
	DEFAULT_PRESET,
	deletePreset,
	exportPreset,
	getPresetMetadata,
	importPreset,
	listPresets,
	loadCurrentPresetSession,
	loadCurrentState,
	loadPreset,
	loadShowLibraryPresets,
	loadStoredPreset,
	renamePreset,
	saveCurrentPresetSession,
	saveCurrentState,
	savePreset,
	saveShowLibraryPresets,
	updatePresetMetadata,
} from "./presetStorage";

describe("presetStorage", () => {
	beforeEach(() => {
		localStorage.clear();
		vi.clearAllMocks();
	});

	describe("savePreset & loadPreset", () => {
		it("saves and loads a preset", () => {
			const name = "Test Preset";
			const data = {
				...DEFAULT_PRESET,
				params: { ...DEFAULT_PRESET.params, volume: 0.5 },
			};
			const metadata = {
				favorite: true,
				category: "Test",
				tags: ["tag1", "tag2"],
			};

			savePreset(name, data, metadata);
			expect(loadPreset(name)).toEqual(data);
		});

		it("returns null when loading non-existent preset", () => {
			expect(loadPreset("Non Existent")).toBeNull();
		});

		it("merges metadata with existing preset when saving", () => {
			const name = "Test Preset";
			const data1 = DEFAULT_PRESET;
			const metadata1 = { favorite: true, category: "Cat1", tags: ["tag1"] };
			savePreset(name, data1, metadata1);

			const data2 = {
				...DEFAULT_PRESET,
				params: { ...DEFAULT_PRESET.params, volume: 0.2 },
			};
			const metadata2 = { category: "Cat2" };
			savePreset(name, data2, metadata2);

			const stored = loadStoredPreset(name);
			expect(stored?.favorite).toBe(true);
			expect(stored?.category).toBe("Cat2");
			expect(stored?.tags).toEqual(["tag1"]);
		});
	});

	describe("loadStoredPreset & getPresetMetadata", () => {
		it("loads the full stored preset", () => {
			const name = "Test Preset";
			const data = DEFAULT_PRESET;
			const metadata = { favorite: true, category: "Test", tags: ["tag1"] };
			savePreset(name, data, metadata);

			const stored = loadStoredPreset(name);
			expect(stored).toEqual({
				name,
				data,
				favorite: true,
				category: "Test",
				tags: ["tag1"],
			});
		});

		it("returns metadata for a preset", () => {
			const name = "Test Preset";
			savePreset(name, DEFAULT_PRESET, {
				favorite: true,
				category: "Test",
				tags: ["tag1"],
			});
			expect(getPresetMetadata(name)).toEqual({
				favorite: true,
				category: "Test",
				tags: ["tag1"],
			});
		});

		it("returns null metadata for non-existent preset", () => {
			expect(getPresetMetadata("Non Existent")).toBeNull();
		});
	});

	describe("updatePresetMetadata", () => {
		it("updates metadata of an existing preset", () => {
			const name = "Test Preset";
			savePreset(name, DEFAULT_PRESET, {
				favorite: false,
				category: "Old",
				tags: [],
			});

			const success = updatePresetMetadata(name, {
				favorite: true,
				category: "New",
			});
			expect(success).toBe(true);
			expect(getPresetMetadata(name)).toEqual({
				favorite: true,
				category: "New",
				tags: [],
			});
		});

		it("returns false when updating metadata of non-existent preset", () => {
			expect(updatePresetMetadata("Non Existent", { favorite: true })).toBe(
				false,
			);
		});
	});

	describe("listPresets", () => {
		it("lists all saved presets", () => {
			savePreset("Alpha", DEFAULT_PRESET);
			savePreset("Beta", DEFAULT_PRESET);
			savePreset("Gamma", DEFAULT_PRESET);
			expect(listPresets()).toEqual(["Alpha", "Beta", "Gamma"]);
		});

		it("returns empty array when no presets are saved", () => {
			expect(listPresets()).toEqual([]);
		});
	});

	describe("deletePreset", () => {
		it("removes a preset from storage", () => {
			const name = "To Delete";
			savePreset(name, DEFAULT_PRESET);
			expect(loadPreset(name)).not.toBeNull();
			deletePreset(name);
			expect(loadPreset(name)).toBeNull();
		});
	});

	describe("renamePreset", () => {
		it("renames a preset", () => {
			const oldName = "Old Name";
			const newName = "New Name";
			savePreset(oldName, DEFAULT_PRESET, { favorite: true });

			const success = renamePreset(oldName, newName);
			expect(success).toBe(true);
			expect(loadPreset(newName)).not.toBeNull();
			expect(loadPreset(oldName)).toBeNull();
			expect(getPresetMetadata(newName)?.favorite).toBe(true);
		});

		it("returns false when renaming non-existent preset", () => {
			expect(renamePreset("Non Existent", "New Name")).toBe(false);
		});

		it("returns true and does nothing when old name equals new name", () => {
			const name = "Same Name";
			savePreset(name, DEFAULT_PRESET);
			expect(renamePreset(name, name)).toBe(true);
			expect(loadPreset(name)).not.toBeNull();
		});
	});

	describe("exportPreset & importPreset", () => {
		it("exports a preset to JSON string", () => {
			const name = "Export Me";
			savePreset(name, DEFAULT_PRESET, { favorite: true });
			const json = exportPreset(name);
			expect(json).not.toBeNull();
			const parsed = JSON.parse(json as string);
			expect(parsed.name).toBe(name);
			expect(parsed.favorite).toBe(true);
		});

		it("imports a preset from JSON string", () => {
			const data = {
				...DEFAULT_PRESET,
				params: { ...DEFAULT_PRESET.params, volume: 0.1 },
			};
			const stored = {
				name: "Imported",
				data,
				favorite: true,
				category: "Imported Cat",
				tags: ["tag1"],
			};
			const json = JSON.stringify(stored);
			const imported = importPreset(json);
			expect(imported).toEqual(stored);
		});

		it("imports a raw synth preset as a stored preset", () => {
			const data = {
				...DEFAULT_PRESET,
				params: { ...DEFAULT_PRESET.params, volume: 0.2 },
			};
			const json = JSON.stringify(data);
			const imported = importPreset(json);
			expect(imported).toEqual({
				name: "imported",
				data,
				favorite: false,
				category: "",
				tags: [],
			});
		});

		it("returns null for invalid JSON or invalid preset format", () => {
			expect(importPreset("invalid json")).toBeNull();
			expect(importPreset(JSON.stringify({ not: "a preset" }))).toBeNull();
		});
	});

	describe("Current State", () => {
		it("saves and loads current state", () => {
			const state = {
				...DEFAULT_PRESET,
				params: { ...DEFAULT_PRESET.params, volume: 0.4 },
			};
			saveCurrentState(state);
			expect(loadCurrentState()).toEqual(state);
		});

		it("returns null when no current state is saved", () => {
			expect(loadCurrentState()).toBeNull();
		});

		it("removes invalid current state and returns null", () => {
			localStorage.setItem("cz101-current-state", "invalid");
			expect(loadCurrentState()).toBeNull();
			expect(localStorage.getItem("cz101-current-state")).toBeNull();
		});

		it("removes current state if it's not a valid synth preset", () => {
			localStorage.setItem(
				"cz101-current-state",
				JSON.stringify({ not: "a preset" }),
			);
			expect(loadCurrentState()).toBeNull();
			expect(localStorage.getItem("cz101-current-state")).toBeNull();
		});
	});

	describe("Current Preset Session", () => {
		it("saves and loads current preset session", () => {
			const session = {
				activePresetId: "local:My Preset",
				activePresetNameBase: "My Preset",
				loadedPresetFingerprint: "fingerprint123",
			};
			saveCurrentPresetSession(session);
			expect(loadCurrentPresetSession()).toEqual(session);
		});

		it("returns null when no session is saved", () => {
			expect(loadCurrentPresetSession()).toBeNull();
		});

		it("removes invalid session and returns null", () => {
			localStorage.setItem("cz101-current-preset-session", "invalid");
			expect(loadCurrentPresetSession()).toBeNull();
			expect(localStorage.getItem("cz101-current-preset-session")).toBeNull();
		});

		it("removes session if it's not a valid session object", () => {
			localStorage.setItem(
				"cz101-current-preset-session",
				JSON.stringify({ not: "a session" }),
			);
			expect(loadCurrentPresetSession()).toBeNull();
			expect(localStorage.getItem("cz101-current-preset-session")).toBeNull();
		});
	});

	describe("Show Library Presets", () => {
		it("saves and loads show library presets preference", () => {
			saveShowLibraryPresets(false);
			expect(loadShowLibraryPresets()).toBe(false);
			saveShowLibraryPresets(true);
			expect(loadShowLibraryPresets()).toBe(true);
		});

		it("returns true by default", () => {
			expect(loadShowLibraryPresets()).toBe(true);
		});
	});
});
