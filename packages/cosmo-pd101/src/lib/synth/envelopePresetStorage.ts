import type { StepEnvData } from "@/lib/synth/bindings/synth";
import { normalizeEnvelope } from "@/lib/synth/envelopeData";
import {
	deleteFxModulePreset,
	listFxModulePresets,
	type StoredFxModulePreset,
	saveFxModulePreset,
} from "@/lib/synth/fxModulePresetStorage";

export const ENVELOPE_PRESET_MODULE_TYPE = "envelope" as const;

export type EnvelopePresetPatch = {
	envelope: StepEnvData;
};

export type StoredEnvelopePreset = Omit<
	StoredFxModulePreset,
	"moduleType" | "patch"
> & {
	moduleType: typeof ENVELOPE_PRESET_MODULE_TYPE;
	patch: EnvelopePresetPatch;
};

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null;
}

function isFiniteNumber(value: unknown): value is number {
	return typeof value === "number" && Number.isFinite(value);
}

function parseEnvelopePatch(patch: unknown): EnvelopePresetPatch | null {
	if (!isRecord(patch)) {
		return null;
	}
	const rawEnvelope = patch.envelope;
	if (!isRecord(rawEnvelope) || !Array.isArray(rawEnvelope.steps)) {
		return null;
	}
	if (rawEnvelope.steps.length !== 8) {
		return null;
	}

	const steps: { level: number; rate: number }[] = [];
	for (const rawStep of rawEnvelope.steps) {
		if (
			!isRecord(rawStep) ||
			!isFiniteNumber(rawStep.level) ||
			!isFiniteNumber(rawStep.rate)
		) {
			return null;
		}
		steps.push({ level: rawStep.level, rate: rawStep.rate });
	}
	if (
		!isFiniteNumber(rawEnvelope.sustainStep) ||
		!isFiniteNumber(rawEnvelope.stepCount) ||
		typeof rawEnvelope.loop !== "boolean"
	) {
		return null;
	}

	return {
		envelope: normalizeEnvelope({
			steps,
			sustainStep: rawEnvelope.sustainStep,
			stepCount: rawEnvelope.stepCount,
			loop: rawEnvelope.loop,
		}),
	};
}

function toStoredEnvelopePreset(
	preset: StoredFxModulePreset,
): StoredEnvelopePreset | null {
	if (preset.moduleType !== ENVELOPE_PRESET_MODULE_TYPE) {
		return null;
	}
	const patch = parseEnvelopePatch(preset.patch);
	if (!patch) {
		return null;
	}
	return {
		id: preset.id,
		name: preset.name,
		moduleType: ENVELOPE_PRESET_MODULE_TYPE,
		patch,
		createdAt: preset.createdAt,
	};
}

export async function saveEnvelopePreset(input: {
	name: string;
	envelope: StepEnvData;
}): Promise<StoredEnvelopePreset> {
	const saved = await saveFxModulePreset({
		name: input.name,
		moduleType: ENVELOPE_PRESET_MODULE_TYPE,
		patch: {
			envelope: normalizeEnvelope(input.envelope),
		},
	});
	const parsed = toStoredEnvelopePreset(saved);
	if (!parsed) {
		throw new Error("Saved envelope preset returned an invalid patch");
	}
	return parsed;
}

export async function listEnvelopePresets(): Promise<StoredEnvelopePreset[]> {
	const presets = await listFxModulePresets(ENVELOPE_PRESET_MODULE_TYPE);
	return presets.flatMap((preset) => {
		const parsed = toStoredEnvelopePreset(preset);
		return parsed ? [parsed] : [];
	});
}

export function getEnvelopePresetEnvelope(
	preset: StoredEnvelopePreset,
): StepEnvData {
	return normalizeEnvelope({
		...preset.patch.envelope,
		steps: preset.patch.envelope.steps.map((step) => ({ ...step })),
	});
}

export async function deleteEnvelopePreset(id: string): Promise<void> {
	await deleteFxModulePreset(id);
}
