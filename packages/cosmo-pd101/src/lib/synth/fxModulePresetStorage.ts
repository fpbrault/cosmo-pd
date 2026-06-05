import { db } from "@/lib/db/db";

export type StoredFxModulePreset = {
	id: string;
	name: string;
	moduleType: string;
	patch: Record<string, unknown>;
	createdAt: number;
};

type NativeFxModulePresetResponse = {
	id: string;
	name: string;
	moduleType: string;
	patch: Record<string, unknown>;
	createdAt: number;
};

type NativeFxModulePresetListResponse = {
	entries: NativeFxModulePresetResponse[];
};

declare global {
	interface Window {
		__czSaveFxModulePreset?: (payload: {
			name: string;
			moduleType: string;
			patch: Record<string, unknown>;
		}) => Promise<NativeFxModulePresetResponse>;
		__czListFxModulePresets?: (
			moduleType: string,
		) => Promise<NativeFxModulePresetListResponse>;
		__czDeleteFxModulePreset?: (id: string) => Promise<void>;
	}
}

function mapNativeToStored(
	native: NativeFxModulePresetResponse,
): StoredFxModulePreset {
	return {
		id: native.id,
		name: native.name,
		moduleType: native.moduleType,
		patch: native.patch,
		createdAt: native.createdAt,
	};
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
		const result = await window.__czSaveFxModulePreset({
			name: input.name.trim(),
			moduleType: input.moduleType,
			patch: input.patch,
		});
		return mapNativeToStored(result);
	}

	const stored: StoredFxModulePreset = {
		id: createFxModulePresetId(),
		name: input.name.trim(),
		moduleType: input.moduleType,
		patch: input.patch,
		createdAt: Date.now(),
	};
	await db.put(STORE, stored);
	return stored;
}

export async function listFxModulePresets(
	moduleType: string,
): Promise<StoredFxModulePreset[]> {
	if (window.__czListFxModulePresets) {
		const result = await window.__czListFxModulePresets(moduleType);
		return (result.entries ?? []).map(mapNativeToStored);
	}

	const all = await db.getAll<StoredFxModulePreset>(STORE);
	return all
		.filter((preset) => preset.moduleType === moduleType)
		.sort((a, b) => a.createdAt - b.createdAt);
}

export async function deleteFxModulePreset(id: string): Promise<void> {
	if (window.__czDeleteFxModulePreset) {
		await window.__czDeleteFxModulePreset(id);
		return;
	}

	await db.delete(STORE, id);
}
