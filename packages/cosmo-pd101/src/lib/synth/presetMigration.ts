import type { SynthParams, SynthPresetV1 } from "@/lib/synth/bindings/synth";
import {
	DEFAULT_DCA_ENV,
	DEFAULT_DCO_ENV,
	DEFAULT_DCW_ENV,
} from "./defaultEnvelopes";

type JsonObject = Record<string, unknown>;

const PD_ENGINE_KEYS = [
	"algo",
	"algo2",
	"algoBlend",
	"baseWaveformA",
	"baseWaveformB",
	"window",
	"dcaBase",
	"dcwBase",
	"modulation",
	"dcwKeyFollow",
	"dcaKeyFollow",
	"algoControlsA",
	"algoControlsB",
] as const;

function isRecord(value: unknown): value is JsonObject {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}

function cloneJson<T>(value: T): T {
	return JSON.parse(JSON.stringify(value)) as T;
}

function stepEnvelopeProgram(value: unknown, fallback: unknown): JsonObject {
	if (isRecord(value) && typeof value.type === "string") {
		return cloneJson(value);
	}

	return {
		type: "step",
		params: cloneJson(value ?? fallback),
	};
}

function migrateLineParams(value: unknown): JsonObject | null {
	if (!isRecord(value)) {
		return null;
	}

	const line = cloneJson(value);
	const legacyEnvelopes = {
		pitch: line.dcoEnv,
		timbre: line.dcwEnv,
		amplitude: line.dcaEnv,
	};
	const envelopes = isRecord(line.envelopes) ? line.envelopes : {};

	line.envelopes = {
		pitch: stepEnvelopeProgram(
			envelopes.pitch ?? legacyEnvelopes.pitch,
			DEFAULT_DCO_ENV,
		),
		timbre: stepEnvelopeProgram(
			envelopes.timbre ?? legacyEnvelopes.timbre,
			DEFAULT_DCW_ENV,
		),
		amplitude: stepEnvelopeProgram(
			envelopes.amplitude ?? legacyEnvelopes.amplitude,
			DEFAULT_DCA_ENV,
		),
	};

	const existingEngine = isRecord(line.engine) ? line.engine : null;
	let engineParams: JsonObject;
	if (existingEngine && isRecord(existingEngine.params)) {
		engineParams = cloneJson(existingEngine.params);
	} else if (existingEngine) {
		engineParams = cloneJson(existingEngine);
		delete engineParams.type;
	} else if (isRecord(line.pd)) {
		engineParams = cloneJson(line.pd);
	} else {
		engineParams = {};
		for (const key of PD_ENGINE_KEYS) {
			if (line[key] !== undefined) {
				engineParams[key] = line[key];
			}
		}
	}

	if (engineParams.algo2 === undefined) {
		engineParams.algo2 = null;
	}

	line.engine = {
		type: "pd",
		params: engineParams,
	};

	for (const key of [
		"synthesisMethod",
		"dcoEnv",
		"dcwEnv",
		"dcaEnv",
		"pd",
		...PD_ENGINE_KEYS,
	]) {
		delete line[key];
	}

	return line;
}

/** Convert all supported pre-tagged PD preset shapes to the current wire shape. */
export function migrateSynthParams(value: unknown): SynthParams | null {
	if (!isRecord(value)) {
		return null;
	}

	const params = cloneJson(value);
	for (const lineKey of ["line1", "line2"]) {
		const line = migrateLineParams(params[lineKey]);
		if (!line) {
			return null;
		}
		params[lineKey] = line;
	}

	return params as SynthParams;
}

/** Convert a persisted preset while retaining its schema version. */
export function migrateSynthPreset(value: unknown): SynthPresetV1 | null {
	if (!isRecord(value) || value.schemaVersion !== 1) {
		return null;
	}

	const params = migrateSynthParams(value.params);
	return params ? { schemaVersion: 1, params } : null;
}
