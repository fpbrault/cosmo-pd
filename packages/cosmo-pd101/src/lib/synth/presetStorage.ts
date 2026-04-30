import { buildDefaultAlgoControls } from "@/lib/synth/algoRef";
import type { SynthPresetV1 } from "@/lib/synth/bindings/synth";
import {
	DEFAULT_DCA_ENV,
	DEFAULT_DCO_ENV,
	DEFAULT_DCW_ENV,
} from "@/lib/synth/pdAlgorithms";

const STORAGE_PREFIX = "cz101-preset-";
const CURRENT_STATE_KEY = "cz101-current-state";
const CURRENT_PRESET_SESSION_KEY = "cz101-current-preset-session";

export type CurrentPresetSession = {
	activePresetId: string | null;
	activePresetNameBase: string;
	loadedPresetFingerprint: string | null;
};

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

export const DEFAULT_PRESET: SynthPresetV1 = {
	schemaVersion: 1,
	params: {
		lineSelect: "L1+L2",
		modMode: "normal",
		octave: 0,
		line1: {
			algo: "cz101",
			algo2: null,
			algoControlsA: buildDefaultAlgoControls("cz101"),
			algoBlend: 0,
			window: "off",
			dcaBase: 1,
			dcwBase: 1,
			modulation: 0,
			detuneCents: 0,
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
			algoBlend: 0,
			window: "off",
			dcaBase: 1,
			dcwBase: 1,
			modulation: 0,
			detuneCents: 0,
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

export function savePreset(name: string, data: SynthPresetV1): void {
	localStorage.setItem(STORAGE_PREFIX + name, JSON.stringify(data));
}

export function loadPreset(name: string): SynthPresetV1 | null {
	const raw = localStorage.getItem(STORAGE_PREFIX + name);
	if (!raw) return null;
	try {
		const parsed = JSON.parse(raw);
		return isSynthPresetV1(parsed) ? parsed : null;
	} catch {
		return null;
	}
}

export function listPresets(): string[] {
	const names: string[] = [];
	for (let i = 0; i < localStorage.length; i++) {
		const key = localStorage.key(i);
		if (key?.startsWith(STORAGE_PREFIX)) {
			names.push(key.slice(STORAGE_PREFIX.length));
		}
	}
	return names.sort();
}

export function deletePreset(name: string): void {
	localStorage.removeItem(STORAGE_PREFIX + name);
}

export function renamePreset(oldName: string, newName: string): boolean {
	const data = loadPreset(oldName);
	if (!data) return false;
	if (oldName === newName) return true;
	savePreset(newName, data);
	deletePreset(oldName);
	return true;
}

export function exportPreset(name: string): string | null {
	const data = loadPreset(name);
	if (!data) return null;
	return JSON.stringify(data, null, 2);
}

export function importPreset(json: string): SynthPresetV1 | null {
	try {
		const parsed = JSON.parse(json);
		return isSynthPresetV1(parsed) ? parsed : null;
	} catch {
		return null;
	}
}

export function saveCurrentState(data: SynthPresetV1): void {
	localStorage.setItem(CURRENT_STATE_KEY, JSON.stringify(data));
}

export function loadCurrentState(): SynthPresetV1 | null {
	const raw = localStorage.getItem(CURRENT_STATE_KEY);
	if (!raw) return null;
	try {
		const parsed = JSON.parse(raw);
		if (isSynthPresetV1(parsed)) {
			return parsed;
		}
		localStorage.removeItem(CURRENT_STATE_KEY);
		return null;
	} catch {
		localStorage.removeItem(CURRENT_STATE_KEY);
		return null;
	}
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

export function saveCurrentPresetSession(session: CurrentPresetSession): void {
	localStorage.setItem(CURRENT_PRESET_SESSION_KEY, JSON.stringify(session));
}

export function loadCurrentPresetSession(): CurrentPresetSession | null {
	const raw = localStorage.getItem(CURRENT_PRESET_SESSION_KEY);
	if (!raw) return null;
	try {
		const parsed = JSON.parse(raw);
		if (isCurrentPresetSession(parsed)) {
			return parsed;
		}
		localStorage.removeItem(CURRENT_PRESET_SESSION_KEY);
		return null;
	} catch {
		localStorage.removeItem(CURRENT_PRESET_SESSION_KEY);
		return null;
	}
}
