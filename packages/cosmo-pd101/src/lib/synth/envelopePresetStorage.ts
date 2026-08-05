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

function isFiniteNumberOrNull(value: unknown): value is number | null {
	return (
		value === null || (typeof value === "number" && Number.isFinite(value))
	);
}

function parseEnvelopePatch(
	patch: Record<string, unknown>,
): EnvelopePresetPatch | null {
	const rawEnvelope = patch.envelope;
	if (!isRecord(rawEnvelope) || !Array.isArray(rawEnvelope.steps)) {
		return null;
	}
	if (rawEnvelope.steps.length !== 8) {
		return null;
	}

	const steps = rawEnvelope.steps.map((rawStep) => {
		if (!isRecord(rawStep)) return null;
		if (
			!isFiniteNumberOrNull(rawStep.level) ||
			!isFiniteNumberOrNull(rawStep.rate)
		) {
			return null;
		}
		return { level: rawStep.level, rate: rawStep.rate };
	});
	if (steps.some((step) => step === null)) {
		return null;
	}
	const validSteps = steps.filter(
		(step): step is { level: number | null; rate: number | null } =>
			step !== null,
	);
	if (
		typeof rawEnvelope.sustainStep !== "number" ||
		typeof rawEnvelope.stepCount !== "number" ||
		typeof rawEnvelope.loop !== "boolean"
	) {
		return null;
	}

	return {
		envelope: normalizeEnvelope({
			steps: validSteps,
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
