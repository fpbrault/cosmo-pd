import type {
	BridgeJsonValue,
	FxModulePresetEntry,
} from "@/lib/synth/bindings/plugin-bridge";
import { getDb } from "@/lib/synth/presetStorage";

export type StoredFxModulePreset = {
	id: string;
	name: string;
	moduleType: string;
	patch: Record<string, unknown>;
	createdAt: number;
};

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

const STORE = "fxModulePresets";

let idCounter = 0;

function createFxModulePresetId(): string {
	idCounter++;
	return `fxmod_${Date.now()}_${idCounter}`;
}

export async function saveFxModulePreset(input: {
	name: string;
	moduleType: string;
	patch: Record<string, unknown>;
}): Promise<StoredFxModulePreset> {
	if (window.__czSaveFxModulePreset) {
		const saved: FxModulePresetEntry = await window.__czSaveFxModulePreset({
			name: input.name.trim(),
			moduleType: input.moduleType,
			patch: input.patch as unknown as BridgeJsonValue,
		});
		return {
			id: saved.id,
			name: saved.name,
			moduleType: saved.moduleType,
			patch: saved.patch as Record<string, unknown>,
			createdAt: saved.updatedAtUnixMs ?? Date.now(),
		};
	}

	const stored: StoredFxModulePreset = {
		id: createFxModulePresetId(),
		name: input.name.trim(),
		moduleType: input.moduleType,
		patch: input.patch,
		createdAt: Date.now(),
	};
	await putInStore(STORE, stored);
	return stored;
}

export async function listFxModulePresets(
	moduleType: string,
): Promise<StoredFxModulePreset[]> {
	if (window.__czListFxModulePresets) {
		const nativePresets = await window.__czListFxModulePresets(moduleType);
		return nativePresets
			.map((preset) => ({
				id: preset.id,
				name: preset.name,
				moduleType: preset.moduleType,
				patch: preset.patch as Record<string, unknown>,
				createdAt: preset.updatedAtUnixMs ?? 0,
			}))
			.sort((a, b) => a.createdAt - b.createdAt);
	}

	const all = await getAllFromStore<StoredFxModulePreset>(STORE);
	return all
		.filter((preset) => preset.moduleType === moduleType)
		.sort((a, b) => a.createdAt - b.createdAt);
}

export async function deleteFxModulePreset(id: string): Promise<void> {
	if (window.__czDeleteFxModulePreset) {
		await window.__czDeleteFxModulePreset(id);
		return;
	}

	return getDb().then(
		(db) =>
			new Promise((resolve, reject) => {
				const tx = db.transaction(STORE, "readwrite");
				tx.objectStore(STORE).delete(id);
				tx.oncomplete = () => resolve();
				tx.onerror = () => reject(tx.error);
			}),
	);
}
