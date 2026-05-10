import { useCallback, useEffect, useRef } from "react";

import { useSynthStore } from "@/features/synth/synthStore";
import type { SynthPresetV1 } from "@/lib/synth/bindings/synth";

declare global {
	interface Window {
		ipc?: { postMessage: (message: string) => void };
		__czOnParams?: (json: string) => void;
		__czGetParams?: () => Promise<unknown>;
		__czSetParams?: (json: string) => void;
	}
}

// ---------------------------------------------------------------------------
// Enum ↔ integer maps
// Integers are the plain values the plugin uses for EnumParameter fields.
// ---------------------------------------------------------------------------

type EnumToIdMap<T extends string> = Record<T, number>;
type WarpAlgoKey =
	| "cz101"
	| "bend"
	| "sync"
	| "pinch"
	| "fold"
	| "skew"
	| "quantize"
	| "twist"
	| "clip"
	| "ripple"
	| "mirror"
	| "fof"
	| "karpunk"
	| "sine"
	| "terrain"
	| "stutter"
	| "cheby";

const invertMap = <T extends string>(
	input: EnumToIdMap<T>,
): Record<number, T> =>
	Object.fromEntries(
		Object.entries(input).map(([key, value]) => [value, key]),
	) as Record<number, T>;

const LINE_SELECT_IDS: EnumToIdMap<LineSelect> = {
	"L1+L2": 0,
	L1: 1,
	L2: 2,
	"L1+L1'": 3,
	"L1+L2'": 4,
};
const LINE_SELECT_FROM_ID = invertMap(LINE_SELECT_IDS);

const MOD_MODE_IDS: EnumToIdMap<ModMode> = {
	normal: 0,
	ring: 1,
	noise: 2,
};
const MOD_MODE_FROM_ID = invertMap(MOD_MODE_IDS);

const POLY_MODE_IDS: EnumToIdMap<PolyMode> = {
	poly8: 0,
	mono: 1,
};
const POLY_MODE_FROM_ID = invertMap(POLY_MODE_IDS);

const WARP_ALGO_IDS: EnumToIdMap<WarpAlgoKey> = {
	cz101: 0,
	bend: 1,
	sync: 2,
	pinch: 3,
	fold: 4,
	skew: 5,
	quantize: 6,
	twist: 7,
	clip: 8,
	ripple: 9,
	mirror: 10,
	fof: 11,
	karpunk: 12,
	sine: 13,
	terrain: 14,
	stutter: 15,
	cheby: 16,
};
const WARP_ALGO_FROM_ID = invertMap(WARP_ALGO_IDS);

const LFO_WAVE_IDS: EnumToIdMap<LfoWaveform> = {
	sine: 0,
	triangle: 1,
	square: 2,
	saw: 3,
	invertedSaw: 4,
	random: 5,
};
const LFO_WAVE_FROM_ID = invertMap(LFO_WAVE_IDS);

const PORT_MODE_IDS: EnumToIdMap<PortamentoMode> = {
	rate: 0,
	time: 1,
};
const PORT_MODE_FROM_ID = invertMap(PORT_MODE_IDS);

// ---------------------------------------------------------------------------
// Waveform index maps
// ---------------------------------------------------------------------------

const CZ_WAVEFORM_IDX: Readonly<Record<CzWaveform, number>> = {
	saw: 0,
	square: 1,
	pulse: 2,
	null: 3,
	sinePulse: 4,
	sawPulse: 6,
	multiSine: 7,
	pulse2: 8,
};

const IDX_TO_CZ_WAVEFORM: Record<number, CzWaveform> = {
	0: "saw",
	1: "square",
	2: "pulse",
	3: "null",
	4: "sinePulse",
	5: "multiSine",
	6: "sawPulse",
	7: "multiSine",
	8: "pulse2",
};

function algoKeyToId(key: Algo | null): number {
	if (key === null || isWaveformId(key)) return 0;
	return WARP_ALGO_IDS[key as WarpAlgoKey] ?? 0;
}

function algoKeyToWaveform(key: Algo | null, slotWaveform: CzWaveform): number {
	if (key === null) return CZ_WAVEFORM_IDX.saw;
	if (isWaveformId(key)) return CZ_WAVEFORM_IDX[key as CzWaveform] ?? 0;
	if (key === "cz101") return CZ_WAVEFORM_IDX[slotWaveform] ?? 0;
	return 0;
}

// ---------------------------------------------------------------------------
// Descriptor table
// Each entry maps a string param ID to a read and apply function.
// ---------------------------------------------------------------------------

type PluginParamDescriptor = {
	id: string;
	read: (params: SynthParams) => number;
	apply: (value: number, synthState: SynthStore) => void;
};

const PLUGIN_PARAM_DESCRIPTORS: PluginParamDescriptor[] = [
	{
		id: "volume",
		read: (params) => params.volume,
		apply: (value, s) => s.setVolume(value),
	},
	{
		id: "octave",
		read: (params) => params.octave,
		apply: (value, s) => s.setOctave(value),
	},
	{
		id: "line_select",
		read: (params) => LINE_SELECT_IDS[params.lineSelect as LineSelect] ?? 0,
		apply: (value, s) =>
			s.setLineSelect((LINE_SELECT_FROM_ID[value] ?? "L1+L2") as LineSelect),
	},
	{
		id: "mod_mode",
		read: (params) => MOD_MODE_IDS[params.modMode as ModMode] ?? 0,
		apply: (value, s) =>
			s.setModMode((MOD_MODE_FROM_ID[value] ?? "normal") as ModMode),
	},
	{
		id: "poly_mode",
		read: (params) => POLY_MODE_IDS[params.polyMode] ?? 0,
		apply: (value, s) =>
			s.setPolyMode((POLY_MODE_FROM_ID[value] ?? "poly8") as PolyMode),
	},
	{
		id: "legato",
		read: (params) => (params.legato ? 1 : 0),
		apply: (value, s) => s.setLegato(value >= 0.5),
	},
	{
		id: "int_pm_enabled",
		read: (params) => (params.intPmEnabled ? 1 : 0),
		apply: (value, s) => s.setPhaseModEnabled(value >= 0.5),
	},
	{
		id: "int_pm_amount",
		read: (params) => params.intPmAmount,
		apply: (value, s) => s.setIntPmAmount(value),
	},
	{
		id: "int_pm_ratio",
		read: (params) => params.intPmRatio,
		apply: (value, s) => s.setIntPmRatio(value),
	},
	{
		id: "pm_pre",
		read: (params) => (params.pmPre ? 1 : 0),
		apply: (value, s) => s.setPmPre(value >= 0.5),
	},
	{
		id: "l1_waveform",
		read: (params) =>
			algoKeyToWaveform(
				params.line1.algo,
				params.line1.cz?.slotAWaveform ?? "saw",
			),
		apply: (value, s) => {
			const waveform = IDX_TO_CZ_WAVEFORM[Math.round(value)];
			if (!waveform) return;
			s.setLine1CzSlotAWaveform(waveform);
			s.setLine1CzSlotBWaveform(waveform);
		},
	},
	{
		id: "l1_warp_algo",
		read: (params) => algoKeyToId(params.line1.algo),
		apply: (value, s) => {
			const algoName = (WARP_ALGO_FROM_ID[Math.round(value)] ??
				"cz101") as Algo;
			s.setWarpAAlgo(algoName);
		},
	},
	{
		id: "l1_dcw_base",
		read: (params) => params.line1.dcwBase,
		apply: (value, s) => s.setWarpAAmount(value),
	},
	{
		id: "l1_dca_base",
		read: (params) => params.line1.dcaBase,
		apply: (value, s) => s.setLine1Level(value),
	},
	{
		id: "l1_octave",
		read: (params) => params.line1.octave,
		apply: (value, s) => s.setLine1Octave(value),
	},
	{
		id: "l1_detune",
		read: (params) => params.line1.detuneCents,
		apply: (value, s) => s.setLine1Detune(value),
	},
	{
		id: "l1_key_follow",
		read: (params) => params.line1.keyFollow,
		apply: (value, s) => s.setLine1DcwKeyFollow(value),
	},
	{
		id: "l1_algo_blend",
		read: (params) => params.line1.algoBlend,
		apply: (value, s) => s.setAlgoBlendA(value),
	},
	{
		id: "l1_warp_algo2",
		read: (params) =>
			params.line1.algo2 === null ? -1 : algoKeyToId(params.line1.algo2),
		apply: (value, s) => {
			if (value < 0) {
				s.setAlgo2A(null);
				return;
			}
			const algoName = (WARP_ALGO_FROM_ID[Math.round(value)] ??
				"cz101") as Algo;
			s.setAlgo2A(algoName);
		},
	},
	{
		id: "l2_waveform",
		read: (params) =>
			algoKeyToWaveform(
				params.line2.algo,
				params.line2.cz?.slotAWaveform ?? "saw",
			),
		apply: (value, s) => {
			const waveform = IDX_TO_CZ_WAVEFORM[Math.round(value)];
			if (!waveform) return;
			s.setLine2CzSlotAWaveform(waveform);
			s.setLine2CzSlotBWaveform(waveform);
		},
	},
	{
		id: "l2_warp_algo",
		read: (params) => algoKeyToId(params.line2.algo),
		apply: (value, s) => {
			const algoName = (WARP_ALGO_FROM_ID[Math.round(value)] ??
				"cz101") as Algo;
			s.setWarpBAlgo(algoName);
		},
	},
	{
		id: "l2_dcw_base",
		read: (params) => params.line2.dcwBase,
		apply: (value, s) => s.setWarpBAmount(value),
	},
	{
		id: "l2_dca_base",
		read: (params) => params.line2.dcaBase,
		apply: (value, s) => s.setLine2Level(value),
	},
	{
		id: "l2_octave",
		read: (params) => params.line2.octave,
		apply: (value, s) => s.setLine2Octave(value),
	},
	{
		id: "l2_detune",
		read: (params) => params.line2.detuneCents,
		apply: (value, s) => s.setLine2Detune(value),
	},
	{
		id: "l2_key_follow",
		read: (params) => params.line2.keyFollow,
		apply: (value, s) => s.setLine2DcwKeyFollow(value),
	},
	{
		id: "l2_algo_blend",
		read: (params) => params.line2.algoBlend,
		apply: (value, s) => s.setAlgoBlendB(value),
	},
	{
		id: "l2_warp_algo2",
		read: (params) =>
			params.line2.algo2 === null ? -1 : algoKeyToId(params.line2.algo2),
		apply: (value, s) => {
			if (value < 0) {
				s.setAlgo2B(null);
				return;
			}
			const algoName = (WARP_ALGO_FROM_ID[Math.round(value)] ??
				"cz101") as Algo;
			s.setAlgo2B(algoName);
		},
	},
	{
		id: "vib_enabled",
		read: (params) => (params.vibrato.enabled ? 1 : 0),
		apply: (value, s) => s.setVibratoEnabled(value >= 0.5),
	},
	{
		id: "vib_waveform",
		read: (params) => params.vibrato.waveform,
		apply: (value, s) => s.setVibratoWave(Math.round(value)),
	},
	{
		id: "vib_rate",
		read: (params) => params.vibrato.rate,
		apply: (value, s) => s.setVibratoRate(value),
	},
	{
		id: "vib_depth",
		read: (params) => params.vibrato.depth,
		apply: (value, s) => s.setVibratoDepth(value),
	},
	{
		id: "vib_delay",
		read: (params) => params.vibrato.delay,
		apply: (value, s) => s.setVibratoDelay(value),
	},
	{
		id: "cho_enabled",
		read: (params) => (params.chorus.enabled ? 1 : 0),
		apply: (value, s) => s.setChorusEnabled(value >= 0.5),
	},
	{
		id: "cho_mix",
		read: (params) => params.chorus.mix,
		apply: (value, s) => s.setChorusMix(value),
	},
	{
		id: "cho_rate",
		read: (params) => params.chorus.rate,
		apply: (value, s) => s.setChorusRate(value),
	},
	{
		id: "cho_depth",
		read: (params) => params.chorus.depth,
		apply: (value, s) => s.setChorusDepth(value),
	},
	{
		id: "del_enabled",
		read: (params) => (params.delay.enabled ? 1 : 0),
		apply: (value, s) => s.setDelayEnabled(value >= 0.5),
	},
	{
		id: "del_mix",
		read: (params) => params.delay.mix,
		apply: (value, s) => s.setDelayMix(value),
	},
	{
		id: "del_time",
		read: (params) => params.delay.time,
		apply: (value, s) => s.setDelayTime(value),
	},
	{
		id: "del_feedback",
		read: (params) => params.delay.feedback,
		apply: (value, s) => s.setDelayFeedback(value),
	},
	{
		id: "rev_enabled",
		read: (params) => (params.reverb.enabled ? 1 : 0),
		apply: (value, s) => s.setReverbEnabled(value >= 0.5),
	},
	{
		id: "rev_mix",
		read: (params) => params.reverb.mix ?? 0,
		apply: (value, s) => s.setReverbMix(value),
	},
	{
		id: "rev_space",
		read: (params) => params.reverb.space ?? 0.5,
		apply: (value, s) => s.setReverbSpace(value),
	},
	{
		id: "rev_predelay",
		read: (params) => params.reverb.predelay ?? 0,
		apply: (value, s) => s.setReverbPredelay(value),
	},
	{
		id: "rev_distance",
		read: (params) => params.reverb.distance ?? 0.3,
		apply: (value, s) => s.setReverbDistance(value),
	},
	{
		id: "rev_character",
		read: (params) => params.reverb.character ?? 0.65,
		apply: (value, s) => s.setReverbCharacter(value),
	},
	{
		id: "lfo_waveform",
		read: (params) => LFO_WAVE_IDS[params.lfo.waveform as LfoWaveform] ?? 0,
		apply: (value, s) =>
			s.setLfoWaveform(
				(LFO_WAVE_FROM_ID[Math.round(value)] ?? "sine") as LfoWaveform,
			),
	},
	{
		id: "lfo_rate",
		read: (params) => params.lfo.rate,
		apply: (value, s) => s.setLfoRate(value),
	},
	{
		id: "lfo_depth",
		read: (params) => params.lfo.depth,
		apply: (value, s) => s.setLfoDepth(value),
	},

	{
		id: "port_enabled",
		read: (params) => (params.portamento.enabled ? 1 : 0),
		apply: (value, s) => s.setPortamentoEnabled(value >= 0.5),
	},
	{
		id: "port_mode",
		read: (params) =>
			PORT_MODE_IDS[params.portamento.mode as PortamentoMode] ?? 0,
		apply: (value, s) =>
			s.setPortamentoMode(
				(PORT_MODE_FROM_ID[Math.round(value)] ?? "rate") as PortamentoMode,
			),
	},
	{
		id: "port_time",
		read: (params) => params.portamento.time,
		apply: (value, s) => s.setPortamentoTime(value),
	},
];

export const PLUGIN_PARAM_DESCRIPTOR_BY_ID = new Map(
	PLUGIN_PARAM_DESCRIPTORS.map((d) => [d.id, d]),
);

type UsePluginBridgeSynthEngineOptions = {
	enabled?: boolean;
};

type EnvelopeKind = "dco" | "dcw" | "dca";

type StepEnv = SynthPresetV1["params"]["line1"]["dcoEnv"];

function clampRounded(value: number, min: number, max: number): number {
	return Math.max(min, Math.min(max, Math.round(value)));
}

function rawRateToHuman(kind: EnvelopeKind, raw: number): number {
	const b = clampRounded(raw, 0, 127);
	switch (kind) {
		case "dco":
			if (b === 0) return 0;
			if (b === 127) return 99;
			return Math.floor((b * 99) / 127) + 1;
		case "dcw":
			if (b <= 8) return 0;
			if (b >= 127) return 99;
			return Math.floor(((b - 8) * 99) / 119) + 1;
		case "dca":
			if (b === 0) return 0;
			if (b >= 119) return 99;
			return Math.floor((b * 99) / 119) + 1;
	}
}

function rawLevelToHuman(kind: EnvelopeKind, raw: number): number {
	const b = clampRounded(raw, 0, 127);
	switch (kind) {
		case "dco":
			return b > 63 ? b - 4 : b;
		case "dcw":
			if (b === 0) return 0;
			if (b === 127) return 99;
			return Math.floor((b * 99) / 127) + 1;
		case "dca":
			return b === 0 ? 0 : Math.max(0, b - 28);
	}
}

function mapEnvelope(env: StepEnv, kind: EnvelopeKind): StepEnv {
	return {
		...env,
		steps: env.steps.map((step) => ({
			...step,
			level: rawLevelToHuman(kind, step.level),
			rate: rawRateToHuman(kind, step.rate),
		})),
	};
}

function hasRawEnvelopeValues(params: SynthPresetV1["params"]): boolean {
	const envelopes = [
		params.line1.dcoEnv,
		params.line1.dcwEnv,
		params.line1.dcaEnv,
		params.line2.dcoEnv,
		params.line2.dcwEnv,
		params.line2.dcaEnv,
	];

	for (const envelope of envelopes) {
		for (const step of envelope.steps) {
			if (step.level > 99 || step.rate > 99) {
				return true;
			}
		}
	}

	return false;
}

function normalizeHostParamsIfRaw(
	params: SynthPresetV1["params"],
): SynthPresetV1["params"] {
	if (!hasRawEnvelopeValues(params)) {
		return params;
	}

	return {
		...params,
		line1: {
			...params.line1,
			dcoEnv: mapEnvelope(params.line1.dcoEnv, "dco"),
			dcwEnv: mapEnvelope(params.line1.dcwEnv, "dcw"),
			dcaEnv: mapEnvelope(params.line1.dcaEnv, "dca"),
		},
		line2: {
			...params.line2,
			dcoEnv: mapEnvelope(params.line2.dcoEnv, "dco"),
			dcwEnv: mapEnvelope(params.line2.dcwEnv, "dcw"),
			dcaEnv: mapEnvelope(params.line2.dcaEnv, "dca"),
		},
	};
}

export function usePluginBridgeSynthEngine(
	options: UsePluginBridgeSynthEngineOptions = {},
): void {
	const gatherState = useSynthStore((s) => s.gatherState);
	const applyPreset = useSynthStore((s) => s.applyPreset);
	const enabled = options.enabled ?? true;
	const outboundEnabledRef = useRef(false);
	const sentParamsRef = useRef("");
	const syncRef = useRef<(() => void) | null>(null);

	const send = useCallback((params: SynthPresetV1["params"]) => {
		const json = JSON.stringify(params);
		if (sentParamsRef.current === json) return;
		sentParamsRef.current = json;
		window.__czSetParams?.(json);
	}, []);

	// Inbound: Rust → React state
	useEffect(() => {
		if (!enabled) return;
		window.__czOnParams = (json: string) => {
			try {
				const params = JSON.parse(json) as SynthPresetV1["params"];
				const uiParams = normalizeHostParamsIfRaw(params);
				applyPreset({ schemaVersion: 1, params: uiParams });
			} catch (e) {
				console.error("[PluginBridge] Failed to parse params from Rust:", e);
			}
			outboundEnabledRef.current = true;
			syncRef.current?.();
		};
		return () => {
			window.__czOnParams = undefined;
		};
	}, [enabled, applyPreset]);

	// Outbound: React state → Rust
	useEffect(() => {
		if (!enabled) return;
		const sync = () => {
			if (!outboundEnabledRef.current) return;
			send(gatherState().params);
		};
		syncRef.current = sync;
		const unsubscribe = useSynthStore.subscribe(sync);
		return () => {
			syncRef.current = null;
			unsubscribe();
		};
	}, [enabled, gatherState, send]);

	// Hydration: getParams from Rust once on mount
	useEffect(() => {
		if (!enabled) return;
		if (!window.__czGetParams) {
			// Running in WASM/standalone mode — outbound sync can start immediately.
			outboundEnabledRef.current = true;
			return;
		}
		let cancelled = false;
		let retryCount = 0;
		const MAX_RETRIES = 10;
		const RETRY_DELAY_MS = 500;
		let retryId = 0;
		let fallbackId = 0;

		const applyResult = (result: unknown) => {
			if (result && typeof result === "object") {
				try {
					const uiParams = normalizeHostParamsIfRaw(
						result as SynthPresetV1["params"],
					);
					applyPreset({
						schemaVersion: 1,
						params: uiParams,
					});
				} catch {
					// Partial/empty params — ignore, keep current UI state.
				}
			}
			outboundEnabledRef.current = true;
			syncRef.current?.();
		};

		const tryGetParams = () => {
			if (cancelled) return;
			const getParams = window.__czGetParams;
			if (!getParams) return;
			void getParams()
				.then((result) => {
					window.clearTimeout(fallbackId);
					if (cancelled) return;
					applyResult(result);
				})
				.catch((error) => {
					if (cancelled) return;
					retryCount++;
					if (retryCount <= MAX_RETRIES) {
						console.warn(
							`[PluginBridge] getParams failed (attempt ${retryCount}/${MAX_RETRIES}):`,
							error,
						);
						// Open the gate so controls work immediately while we retry.
						if (!outboundEnabledRef.current) {
							outboundEnabledRef.current = true;
							syncRef.current?.();
						}
						retryId = window.setTimeout(tryGetParams, RETRY_DELAY_MS);
					} else {
						window.clearTimeout(fallbackId);
						console.error(
							"[PluginBridge] getParams failed after all retries:",
							error,
						);
						if (!outboundEnabledRef.current) {
							outboundEnabledRef.current = true;
							syncRef.current?.();
						}
					}
				});
		};

		// Safety fallback: open the outbound gate after 10 s no matter what.
		fallbackId = window.setTimeout(() => {
			if (!cancelled && !outboundEnabledRef.current) {
				console.warn(
					"[PluginBridge] getParams timed out — opening outbound gate anyway",
				);
				outboundEnabledRef.current = true;
				syncRef.current?.();
			}
		}, 10000);

		tryGetParams();

		return () => {
			cancelled = true;
			window.clearTimeout(retryId);
			window.clearTimeout(fallbackId);
		};
	}, [enabled, applyPreset]);
}
