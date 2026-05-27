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
	const all = await getAllFromStore<StoredFxModulePreset>(STORE);
	return all
		.filter((preset) => preset.moduleType === moduleType)
		.sort((a, b) => a.createdAt - b.createdAt);
}

export async function deleteFxModulePreset(id: string): Promise<void> {
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
