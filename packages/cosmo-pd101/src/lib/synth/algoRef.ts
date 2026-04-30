import {
	ALGO_DEFINITIONS_V1,
	type Algo,
	type AlgoControlV1,
	type AlgoDefinitionV1,
	type CzWaveform,
	type WindowType,
} from "@/lib/synth/bindings/synth";

const ALGO_DEFINITIONS = ALGO_DEFINITIONS_V1 as AlgoDefinitionV1[];

const CZ101_DEF = ALGO_DEFINITIONS.find((d) => d.id === "cz101") as AlgoDefinitionV1;

export const CZ_WAVEFORMS = (CZ101_DEF.controls.find((c) => c.id === "waveform1") as AlgoControlV1)
	.options.map((o) => o.value as CzWaveform);

const WAVEFORMS = CZ_WAVEFORMS;

export const CZ_WINDOWS = (CZ101_DEF.controls.find((c) => c.id === "windowFunction") as AlgoControlV1)
	.options.map((o) => o.value as WindowType);

const ALL_ALGOS = ALGO_DEFINITIONS.map((d) => d.id);

const WARP_ALGOS = ALL_ALGOS.filter(
	(id) => !(WAVEFORMS as string[]).includes(id),
);

type WaveformId = CzWaveform;
type WarpAlgo = Algo;

export const DEFAULT_ALGO_REF: Algo = "cz101";

export function isWarpAlgo(value: unknown): value is WarpAlgo {
	return typeof value === "string" && (WARP_ALGOS as string[]).includes(value);
}

export function isWaveformId(value: unknown): value is WaveformId {
	return typeof value === "string" && (WAVEFORMS as string[]).includes(value);
}

export function normalizeWaveformId(value: unknown): WaveformId {
	if (typeof value === "string" && (WAVEFORMS as string[]).includes(value)) {
		return value as WaveformId;
	}
	return "saw";
}

export function isAlgo(value: unknown): value is Algo {
	return typeof value === "string" && (ALL_ALGOS as string[]).includes(value);
}

export function toAlgoRefV1(
	value: unknown,
	fallback: Algo = DEFAULT_ALGO_REF,
): Algo {
	if (isWaveformId(value)) {
		return "cz101";
	}

	if (isAlgo(value)) {
		return value;
	}

	return fallback;
}

export function resolveAlgoRef(algo: Algo): {
	waveform: WaveformId;
	warpAlgo: Algo;
	windowType: WindowType | null;
	isFrontPanelCzAlgo: boolean;
} {
	// For cz101, waveform comes from CzLineParams (not from algo).
	// Return "saw" as a fallback — callers should use line.cz.slotAWaveform.
	if (algo === "cz101") {
		return {
			waveform: "saw",
			warpAlgo: "cz101",
			windowType: null,
			isFrontPanelCzAlgo: false,
		};
	}

	if (isWaveformId(algo)) {
		return {
			waveform: algo,
			warpAlgo: algo,
			windowType: null,
			isFrontPanelCzAlgo: false,
		};
	}
	return {
		waveform: "saw",
		warpAlgo: algo,
		windowType: null,
		isFrontPanelCzAlgo: false,
	};
}

export function getCzPresetDefaults(algo: Algo): {
	waveform1: CzWaveform;
	waveform2: CzWaveform;
	windowFunction: WindowType;
} | null {
	const definition = ALGO_DEFINITIONS.find((entry) => entry.id === algo);
	if (!definition) {
		return null;
	}

	const waveform1Control = definition.controls.find((c) => c.id === "waveform1");
	const waveform2Control = definition.controls.find((c) => c.id === "waveform2");
	const windowControl = definition.controls.find((c) => c.id === "windowFunction");

	if (!waveform1Control || !waveform2Control || !windowControl) {
		return null;
	}

	return {
		waveform1: waveform1Control.options[Math.round(waveform1Control.default ?? 0)]?.value as CzWaveform ?? "saw",
		waveform2: waveform2Control.options[Math.round(waveform2Control.default ?? 0)]?.value as CzWaveform ?? "saw",
		windowFunction: windowControl.options[Math.round(windowControl.default ?? 0)]?.value as WindowType ?? "off",
	};
}
