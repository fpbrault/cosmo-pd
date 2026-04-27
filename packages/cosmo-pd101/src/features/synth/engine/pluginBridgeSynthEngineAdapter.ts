import { useCallback, useEffect, useMemo, useRef } from "react";
import {
	type SynthEngineAdapter,
	SynthEngineController,
} from "@/features/synth/engine/synthEngineAdapter";
import { createSynthEngineSnapshot } from "@/features/synth/engine/synthEngineSnapshot";
import { type SynthStore, useSynthStore } from "@/features/synth/synthStore";
import { isWaveformId } from "@/lib/synth/algoRef";
import type {
	Algo,
	AlgoControlValueV1,
	CzWaveform,
	LfoWaveform,
	LineSelect,
	ModMatrix,
	ModMode,
	PolyMode,
	PortamentoMode,
	StepEnvData,
	SynthParams,
} from "@/lib/synth/bindings/synth";

type EnvelopeId =
	| "l1_dco"
	| "l1_dcw"
	| "l1_dca"
	| "l2_dco"
	| "l2_dcw"
	| "l2_dca";

type EnvelopeMap = Partial<Record<EnvelopeId, StepEnvData>>;

type PresetSessionPayload = {
	activePresetId?: string | null;
	activePresetNameBase?: string;
	loadedPresetFingerprint?: string | null;
};

declare global {
	interface Window {
		ipc?: { postMessage: (message: string) => void };
		__czOnParams?: (json: string) => void;
		__czGetEnvelopes?: () => Promise<EnvelopeMap>;
		__czGetAlgoControls?: () => Promise<AlgoControlsSnapshot | null>;
		__czGetModMatrix?: () => Promise<ModMatrix>;
		__czGetFxSlots?: () => Promise<SynthParams["fxSlots"]>;
		__czGetPresetSession?: () => Promise<PresetSessionPayload>;
	}
}

// ---------------------------------------------------------------------------
// Enum ↔ integer maps
// Integers are the plain values Beamer uses for EnumParameter fields.
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
// Each entry maps a Beamer string param ID to a read (snapshot → number) and
// apply (inbound value → React state setter) function.
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
	hydrationGraceMs?: number;
};

type AlgoControlsSnapshot = {
	line1?: { a?: AlgoControlValueV1[]; b?: AlgoControlValueV1[] };
	line2?: { a?: AlgoControlValueV1[]; b?: AlgoControlValueV1[] };
};

type InboundHydrationState = {
	params: boolean;
	envelopes: boolean;
	algoControls: boolean;
	modMatrix: boolean;
	fxSlots: boolean;
	presetSession: boolean;
};

// ---------------------------------------------------------------------------
// Outbound: send plain value via the bridge IPC
// ---------------------------------------------------------------------------

function sendParam(paramId: string, value: number) {
	if (window.ipc) {
		window.ipc.postMessage(JSON.stringify({ param_id: paramId, value }));
	}
}

function sendEnvelope(envId: EnvelopeId, env: StepEnvData) {
	if (window.ipc) {
		window.ipc.postMessage(JSON.stringify({ envelope_id: envId, data: env }));
	}
}

function sendAlgoControls(
	line: 1 | 2,
	bank: "a" | "b",
	controls: AlgoControlValueV1[],
) {
	if (window.ipc) {
		window.ipc.postMessage(
			JSON.stringify({ algo_controls: { line, bank, controls } }),
		);
	}
}

function sendModMatrix(matrix: ModMatrix) {
	if (window.ipc) {
		window.ipc.postMessage(JSON.stringify({ mod_matrix: matrix }));
	}
}

function sendFxSlots(fxSlots: SynthParams["fxSlots"]) {
	if (window.ipc) {
		window.ipc.postMessage(JSON.stringify({ fx_slots: fxSlots }));
	}
}

// ---------------------------------------------------------------------------
// createPluginBridgeSynthEngineAdapter
// Builds a SynthEngineAdapter that syncs a SynthEngineSnapshot to the
// Beamer plugin host over the bridge IPC protocol.
// ---------------------------------------------------------------------------

export function usePluginBridgeSynthEngine(
	options: UsePluginBridgeSynthEngineOptions = {},
): void {
	const gatherState = useSynthStore((s) => s.gatherState);
	const enabled = options.enabled ?? true;
	const hydrationGraceMs = options.hydrationGraceMs ?? 1000;

	const sentParamsRef = useRef<Map<string, number>>(new Map());
	const pendingLocalParamsRef = useRef<
		Map<string, { value: number; sentAt: number }>
	>(new Map());
	const sentEnvelopesRef = useRef<Map<EnvelopeId, string>>(new Map());
	const sentAlgoControlsRef = useRef<Map<string, string>>(new Map());
	const sentModMatrixRef = useRef("");
	const sentFxSlotsRef = useRef("");
	const outboundSyncEnabledRef = useRef(false);
	const inboundHydrationRef = useRef<InboundHydrationState>({
		params: false,
		envelopes: false,
		algoControls: false,
		modMatrix: false,
		fxSlots: false,
		presetSession: false,
	});
	const syncRef = useRef<(() => void) | null>(null);
	const PENDING_PARAM_TTL_MS = 250;
	const PARAM_EPSILON = 1e-6;

	const queueParam = useCallback((id: string, value: number) => {
		const prev = sentParamsRef.current.get(id);
		if (prev === value) return;
		sentParamsRef.current.set(id, value);
		pendingLocalParamsRef.current.set(id, {
			value,
			sentAt:
				typeof performance !== "undefined" ? performance.now() : Date.now(),
		});
		sendParam(id, value);
	}, []);

	const queueEnvelope = useCallback((envId: EnvelopeId, env: StepEnvData) => {
		const serialized = JSON.stringify(env);
		if (sentEnvelopesRef.current.get(envId) === serialized) return;
		sentEnvelopesRef.current.set(envId, serialized);
		sendEnvelope(envId, env);
	}, []);

	const queueAlgoControls = useCallback(
		(line: 1 | 2, bank: "a" | "b", controls: AlgoControlValueV1[]) => {
			const serialized = JSON.stringify(controls);
			const cacheKey = `${line}:${bank}`;
			if (sentAlgoControlsRef.current.get(cacheKey) === serialized) return;
			sentAlgoControlsRef.current.set(cacheKey, serialized);
			sendAlgoControls(line, bank, controls);
		},
		[],
	);

	const queueModMatrix = useCallback((matrix: ModMatrix) => {
		const serialized = JSON.stringify(matrix ?? { routes: [] });
		if (sentModMatrixRef.current === serialized) return;
		sentModMatrixRef.current = serialized;
		sendModMatrix(matrix);
	}, []);

	const queueFxSlots = useCallback((fxSlots: SynthParams["fxSlots"]) => {
		const serialized = JSON.stringify(fxSlots ?? []);
		if (sentFxSlotsRef.current === serialized) return;
		sentFxSlotsRef.current = serialized;
		sendFxSlots(fxSlots);
	}, []);

	const tryEnableOutboundSync = useCallback(() => {
		const hydration = inboundHydrationRef.current;
		if (
			hydration.params &&
			hydration.envelopes &&
			hydration.algoControls &&
			hydration.modMatrix &&
			hydration.fxSlots &&
			hydration.presetSession
		) {
			outboundSyncEnabledRef.current = true;
			syncRef.current?.();
		}
	}, []);

	const enableOutboundSyncAfterParamReplay = useCallback(() => {
		if (!inboundHydrationRef.current.params) {
			return;
		}
		outboundSyncEnabledRef.current = true;
		syncRef.current?.();
	}, []);

	const markHydrated = useCallback(
		(key: keyof InboundHydrationState) => {
			if (inboundHydrationRef.current[key]) {
				return;
			}
			inboundHydrationRef.current[key] = true;
			tryEnableOutboundSync();
		},
		[tryEnableOutboundSync],
	);

	const adapter = useMemo<SynthEngineAdapter>(
		() => ({
			sync(snapshot) {
				const params = snapshot.params;
				for (const descriptor of PLUGIN_PARAM_DESCRIPTORS) {
					queueParam(descriptor.id, descriptor.read(params));
				}
				queueEnvelope("l1_dco", params.line1.dcoEnv);
				queueEnvelope("l1_dcw", params.line1.dcwEnv);
				queueEnvelope("l1_dca", params.line1.dcaEnv);
				queueEnvelope("l2_dco", params.line2.dcoEnv);
				queueEnvelope("l2_dcw", params.line2.dcwEnv);
				queueEnvelope("l2_dca", params.line2.dcaEnv);
				queueAlgoControls(1, "a", params.line1.algoControlsA ?? []);
				queueAlgoControls(1, "b", params.line1.algoControlsB ?? []);
				queueAlgoControls(2, "a", params.line2.algoControlsA ?? []);
				queueAlgoControls(2, "b", params.line2.algoControlsB ?? []);
				queueModMatrix(params.modMatrix ?? { routes: [] });
				queueFxSlots(
					(params.fxSlots ??
						useSynthStore.getState().fxSlots) as SynthParams["fxSlots"],
				);
			},
		}),
		[
			queueParam,
			queueEnvelope,
			queueAlgoControls,
			queueModMatrix,
			queueFxSlots,
		],
	);

	// Lifecycle: connect / dispose
	useEffect(() => {
		if (!enabled) {
			return;
		}
		const controller = new SynthEngineController(adapter);
		controller.connect();
		return () => controller.dispose();
	}, [adapter, enabled]);

	// Mark non-parameter hydration stages as complete when bridge helpers
	// are unavailable (e.g. lightweight harnesses).
	useEffect(() => {
		if (!enabled) {
			return;
		}
		if (!window.__czGetEnvelopes) {
			markHydrated("envelopes");
		}
		if (!window.__czGetAlgoControls) {
			markHydrated("algoControls");
		}
		if (!window.__czGetModMatrix) {
			markHydrated("modMatrix");
		}
		if (!window.__czGetFxSlots) {
			markHydrated("fxSlots");
		}
		if (!window.__czGetPresetSession) {
			markHydrated("presetSession");
		}
	}, [enabled, markHydrated]);

	// Inbound: Rust → React state via __czOnParams (string ID → plain value)
	useEffect(() => {
		if (!enabled) {
			return;
		}
		window.__czOnParams = (json: string) => {
			try {
				const params = JSON.parse(json) as Record<string, number>;
				const hasParams = Object.keys(params).length > 0;
				const now =
					typeof performance !== "undefined" ? performance.now() : Date.now();
				for (const [id, value] of Object.entries(params)) {
					const pendingLocal = pendingLocalParamsRef.current.get(id);
					if (pendingLocal) {
						const ageMs = now - pendingLocal.sentAt;
						if (Math.abs(pendingLocal.value - value) <= PARAM_EPSILON) {
							pendingLocalParamsRef.current.delete(id);
							continue;
						}
						if (ageMs < PENDING_PARAM_TTL_MS) {
							continue;
						}
						pendingLocalParamsRef.current.delete(id);
					}

					sentParamsRef.current.set(id, value);

					PLUGIN_PARAM_DESCRIPTOR_BY_ID.get(id)?.apply(
						value,
						useSynthStore.getState(),
					);
				}
				if (hasParams) {
					markHydrated("params");
				}
			} catch (e) {
				console.error("[PluginPage] Failed to parse params from Rust:", e);
			}
		};
		return () => {
			window.__czOnParams = undefined;
		};
	}, [enabled, markHydrated]);

	// Outbound sync: subscribe directly to Zustand so every state change
	// flows to the host without causing component re-renders.
	// Outbound sync: subscribe directly to Zustand so every state change
	// flows to the host without causing component re-renders.
	useEffect(() => {
		if (!enabled) {
			return;
		}
		const sync = () => {
			if (!outboundSyncEnabledRef.current) {
				return;
			}
			const snapshot = createSynthEngineSnapshot({
				gatherState,
				effectivePitchHz: 220,
				extPmAmount: 0,
			});
			adapter.sync(snapshot);
		};

		syncRef.current = sync;
		const unsubscribe = useSynthStore.subscribe(sync);

		// In environments that do not expose host hydration helpers, allow a
		// fallback initial sync so local-only harnesses keep working.
		const shouldAllowFallbackSync =
			!window.__czGetEnvelopes &&
			!window.__czGetAlgoControls &&
			!window.__czGetModMatrix &&
			!window.__czGetFxSlots &&
			!window.__czGetPresetSession;
		const timeoutId = window.setTimeout(() => {
			if (shouldAllowFallbackSync) {
				outboundSyncEnabledRef.current = true;
				sync();
				return;
			}

			enableOutboundSyncAfterParamReplay();
		}, hydrationGraceMs);

		return () => {
			syncRef.current = null;
			if (timeoutId !== null) {
				window.clearTimeout(timeoutId);
			}
			unsubscribe();
		};
	}, [
		adapter,
		enableOutboundSyncAfterParamReplay,
		enabled,
		gatherState,
		hydrationGraceMs,
	]);

	// Inbound: initial envelope state from Rust
	useEffect(() => {
		if (!enabled) {
			return;
		}
		if (!window.__czGetEnvelopes) {
			return;
		}
		let cancelled = false;
		void window
			.__czGetEnvelopes()
			.then((envelopes) => {
				if (cancelled) return;
				if (envelopes) {
					const s = useSynthStore.getState();
					if (envelopes.l1_dco) s.setLine1DcoEnv(envelopes.l1_dco);
					if (envelopes.l1_dcw) s.setLine1DcwEnv(envelopes.l1_dcw);
					if (envelopes.l1_dca) s.setLine1DcaEnv(envelopes.l1_dca);
					if (envelopes.l2_dco) s.setLine2DcoEnv(envelopes.l2_dco);
					if (envelopes.l2_dcw) s.setLine2DcwEnv(envelopes.l2_dcw);
					if (envelopes.l2_dca) s.setLine2DcaEnv(envelopes.l2_dca);
				}
				markHydrated("envelopes");
			})
			.catch((error) => {
				console.error("[PluginPage] Failed to load envelope state:", error);
			});
		return () => {
			cancelled = true;
		};
	}, [enabled, markHydrated]);

	// Inbound: initial fx-slot state from Rust
	useEffect(() => {
		if (!enabled) {
			return;
		}
		if (!window.__czGetFxSlots) {
			return;
		}
		let cancelled = false;
		void window
			.__czGetFxSlots()
			.then((fxSlots) => {
				if (cancelled) return;
				if (Array.isArray(fxSlots) && fxSlots.length === 6) {
					useSynthStore.setState({
						fxSlots: fxSlots as SynthStore["fxSlots"],
					});
				}
				markHydrated("fxSlots");
			})
			.catch((error) => {
				console.error("[PluginPage] Failed to load fx slots:", error);
				markHydrated("fxSlots");
			});
		return () => {
			cancelled = true;
		};
	}, [enabled, markHydrated]);

	// Inbound: initial algo-controls state from Rust
	useEffect(() => {
		if (!enabled) {
			return;
		}
		if (!window.__czGetAlgoControls) {
			return;
		}
		let cancelled = false;
		void window
			.__czGetAlgoControls()
			.then((snapshot) => {
				if (cancelled || !snapshot || typeof snapshot !== "object") return;
				const typedSnapshot = snapshot as AlgoControlsSnapshot;
				const s = useSynthStore.getState();
				s.setLine1AlgoControlsA(typedSnapshot.line1?.a ?? []);
				s.setLine1AlgoControlsB(typedSnapshot.line1?.b ?? []);
				s.setLine2AlgoControlsA(typedSnapshot.line2?.a ?? []);
				s.setLine2AlgoControlsB(typedSnapshot.line2?.b ?? []);
				markHydrated("algoControls");
			})
			.catch((error) => {
				console.error("[PluginPage] Failed to load algo controls:", error);
			});
		return () => {
			cancelled = true;
		};
	}, [enabled, markHydrated]);

	// Inbound: initial mod matrix state from Rust
	useEffect(() => {
		if (!enabled) {
			return;
		}
		if (!window.__czGetModMatrix) {
			return;
		}
		let cancelled = false;
		void window
			.__czGetModMatrix()
			.then((matrix) => {
				if (cancelled) return;
				if (matrix && typeof matrix === "object") {
					useSynthStore.getState().setModMatrix(matrix);
				}
				markHydrated("modMatrix");
			})
			.catch((error) => {
				console.error("[PluginPage] Failed to load mod matrix state:", error);
			});
		return () => {
			cancelled = true;
		};
	}, [enabled, markHydrated]);

	// Inbound: initial preset session metadata from Rust
	useEffect(() => {
		if (!enabled) {
			return;
		}
		if (!window.__czGetPresetSession) {
			markHydrated("presetSession");
			return;
		}
		let cancelled = false;
		void window
			.__czGetPresetSession()
			.then((session) => {
				if (cancelled) return;
				if (session && typeof session === "object") {
					// Restore preset session to localStorage so that useSynthPresetManager
					// picks it up when it loads the initial state
					const presetSessionData = {
						activePresetId: session.activePresetId ?? null,
						activePresetNameBase:
							session.activePresetNameBase ?? "Current State",
						loadedPresetFingerprint: session.loadedPresetFingerprint ?? null,
					};
					localStorage.setItem(
						"cz101-current-preset-session",
						JSON.stringify(presetSessionData),
					);
				}
				markHydrated("presetSession");
			})
			.catch((error) => {
				console.error("[PluginPage] Failed to load preset session:", error);
				markHydrated("presetSession");
			});
		return () => {
			cancelled = true;
		};
	}, [enabled, markHydrated]);
}
