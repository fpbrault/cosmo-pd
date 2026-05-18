/**
 * Mock Plugin Bridge — E2E / Unit Test Harness
 *
 * Installs a synthetic plugin IPC/runtime contract for tests, intercepts
 * outbound bridge traffic, and exposes
 * window.__MOCK_BRIDGE__ for Playwright / Vitest assertions.
 *
 * Import and call installMockPluginBridge() BEFORE rendering React.
 * Never imported in production builds (guarded by VITE_TEST_HARNESS=1 in main.tsx).
 *
 * TODO: Remove this guard once CI-stable and promoted to a permanent fixture.
 */

// ---------------------------------------------------------------------------
// Algo order — must match the Algo type union order in synth.ts for index mapping
// ---------------------------------------------------------------------------

const ALGO_ORDER = [
	"saw",
	"square",
	"pulse",
	"null",
	"sinePulse",
	"sawPulse",
	"multiSine",
	"pulse2",
	"cz101",
	"bend",
	"sync",
	"pinch",
	"fold",
	"skew",
	"quantize",
	"twist",
	"clip",
	"ripple",
	"mirror",
	"fof",
	"karpunk",
	"sine",
] as const;

// ---------------------------------------------------------------------------
// Minimal structural type for the full params blob coming through setParams
// ---------------------------------------------------------------------------

type FullParamsBlob = {
	volume?: number;
	line1?: {
		dcwBase?: number;
		algo?: string;
		algoControlsA?: { id: string; value: number }[];
		algoControlsB?: { id: string; value: number }[];
	};
	line2?: {
		dcwBase?: number;
		algo?: string;
		algoControlsA?: { id: string; value: number }[];
		algoControlsB?: { id: string; value: number }[];
	};
	modMatrix?: { routes?: unknown[] };
	[key: string]: unknown;
};

function extractScalarParams(params: FullParamsBlob): Record<string, number> {
	const out: Record<string, number> = {};
	if (typeof params.volume === "number") out.volume = params.volume;
	if (typeof params.line1?.dcwBase === "number")
		out.l1_dcw_base = params.line1.dcwBase;
	if (typeof params.line1?.algo === "string") {
		const idx = ALGO_ORDER.indexOf(
			params.line1.algo as (typeof ALGO_ORDER)[number],
		);
		if (idx >= 0) out.l1_warp_algo = idx;
	}
	if (typeof params.line2?.dcwBase === "number")
		out.l2_dcw_base = params.line2.dcwBase;
	return out;
}

function applyParamToBlob(
	params: FullParamsBlob,
	stringId: string,
	value: number,
): FullParamsBlob {
	switch (stringId) {
		case "volume":
			return { ...params, volume: value };
		case "l1_dcw_base":
			return {
				...params,
				line1: { ...params.line1, dcwBase: value },
			};
		case "l1_warp_algo": {
			const algo = ALGO_ORDER[Math.round(value)] ?? "cz101";
			return {
				...params,
				line1: { ...params.line1, algo },
			};
		}
		case "l2_dcw_base":
			return {
				...params,
				line2: { ...params.line2, dcwBase: value },
			};
		default:
			return params;
	}
}

// ---------------------------------------------------------------------------
// Shared types (structural copies of the private bridge types)
// ---------------------------------------------------------------------------

interface PluginParamInfo {
	id: number;
	stringId: string;
	name: string;
	min: number;
	max: number;
	defaultValue: number;
	value: number; // normalized 0–1
	plainValue: number;
	displayText: string;
	format: string;
	units: string;
	steps: number;
}

type PluginParamUpdate = Record<string, [number, number, string]>;

// ---------------------------------------------------------------------------
// Public types exposed on window.__MOCK_BRIDGE__
// ---------------------------------------------------------------------------

export interface MockBridgeMessage {
	type: "param:set" | "param:begin" | "param:end" | "invoke" | "event";
	[key: string]: unknown;
}

export interface MockBridgeHandle {
	/** All recorded outbound messages (UI → host). */
	getMessages(): MockBridgeMessage[];
	/** Last recorded outbound message or undefined when empty. */
	getLastMessage(): MockBridgeMessage | undefined;
	/** Remove all recorded messages. */
	clearMessages(): void;

	/**
	 * Push an inbound param update (simulates Rust → UI) via __czOnParams.
	 * @param idOrStringId  Numeric legacy param ID (0 = volume, 102, 202, etc.) or string param ID (e.g. "volume", "cho_mix")
	 * @param value     Plain (un-normalized) value
	 */
	pushParamUpdate(idOrStringId: string | number, value: number): void;

	/**
	 * Push an inbound full param update through the mock host path.
	 * @param update  Map of numeric-or-string param ID → [normalized, plain, displayText]
	 */
	pushPluginParamUpdate(update: PluginParamUpdate): void;

	/**
	 * Send an outbound param set through window.ipc (if installed), testing the
	 * full UI → bridge → runtime.params.set chain.
	 * @param idOrStringId  Numeric legacy param ID (0, 102, 202, etc.) or string ID ("volume", "cho_mix")
	 * @param value     Plain (un-normalized) value
	 */
	setParameter(idOrStringId: string | number, value: number): void;

	/** Return a snapshot of the virtual DSP param state (normalized 0–1 by string ID). */
	getState(): Record<string, number>;

	/** Subscribe to outbound message events. Returns an unsubscribe function. */
	onMessage(cb: (msg: MockBridgeMessage) => void): () => void;

	/** Simulate a successful invoke result for the next pending unresolved invoke. */
	resolveNextInvoke(result: unknown): void;

	/** Simulate a failed invoke for the next pending unresolved invoke. */
	rejectNextInvoke(error: string): void;

	/** Reset recorded messages and pending listeners. Does NOT reinstall the runtime. */
	reset(): void;
}

declare global {
	interface Window {
		__MOCK_BRIDGE__?: MockBridgeHandle;
		__czIpcResponse?: (response: {
			id: number;
			result?: unknown;
			error?: string;
		}) => void;
	}
}

// ---------------------------------------------------------------------------
// Default parameter set
// Provides the params used by the E2E spec and a representative global set.
// Other params return undefined from info(), which the bridge skips.
// ---------------------------------------------------------------------------

/** Legacy numeric ID → PluginParamInfo lookup used to build the mock runtime. */
const DEFAULT_PARAMS: PluginParamInfo[] = [
	// Global
	{
		id: 0,
		stringId: "volume",
		name: "Volume",
		min: 0,
		max: 1,
		defaultValue: 0.8,
		value: 0.8,
		plainValue: 0.8,
		displayText: "80%",
		format: "{:.0f}%",
		units: "",
		steps: 0,
	},
	// Line 1/2 DCW base (warp amount)
	{
		id: 102,
		stringId: "l1_dcw_base",
		name: "L1 DCW Base",
		min: 0,
		max: 1,
		defaultValue: 0.5,
		value: 0.5,
		plainValue: 0.5,
		displayText: "0.50",
		format: "{:.2f}",
		units: "",
		steps: 0,
	},
	{
		id: 101,
		stringId: "l1_warp_algo",
		name: "L1 Warp Algo",
		min: 0,
		max: 12,
		defaultValue: 0,
		value: 0,
		plainValue: 0,
		displayText: "CZ101",
		format: "{:.0f}",
		units: "",
		steps: 0,
	},
	{
		id: 202,
		stringId: "l2_dcw_base",
		name: "L2 DCW Base",
		min: 0,
		max: 1,
		defaultValue: 0.5,
		value: 0.5,
		plainValue: 0.5,
		displayText: "0.50",
		format: "{:.2f}",
		units: "",
		steps: 0,
	},
	// Chorus
	{
		id: 400,
		stringId: "cho_mix",
		name: "Chorus Mix",
		min: 0,
		max: 1,
		defaultValue: 0.5,
		value: 0.5,
		plainValue: 0.5,
		displayText: "50%",
		format: "{:.0f}%",
		units: "",
		steps: 0,
	},
	{
		id: 401,
		stringId: "cho_rate",
		name: "Chorus Rate",
		min: 0.1,
		max: 5,
		defaultValue: 1,
		value: (1 - 0.1) / (5 - 0.1),
		plainValue: 1,
		displayText: "1.0",
		format: "{:.1f}",
		units: "Hz",
		steps: 0,
	},
	{
		id: 402,
		stringId: "cho_depth",
		name: "Chorus Depth",
		min: 0,
		max: 3,
		defaultValue: 0.5,
		value: 0.5 / 3,
		plainValue: 0.5,
		displayText: "17%",
		format: "{:.0f}%",
		units: "",
		steps: 0,
	},
	// Filter (needed for panel-enabled state)
	{
		id: 800,
		stringId: "fil_enabled",
		name: "Filter Enabled",
		min: 0,
		max: 1,
		defaultValue: 0,
		value: 0,
		plainValue: 0,
		displayText: "Off",
		format: "{}",
		units: "",
		steps: 2,
	},
	{
		id: 801,
		stringId: "fil_cutoff",
		name: "Filter Cutoff",
		min: 20,
		max: 20000,
		defaultValue: 2000,
		value: (2000 - 20) / (20000 - 20),
		plainValue: 2000,
		displayText: "2000",
		format: "{:.0f}",
		units: "Hz",
		steps: 0,
	},
];

// ---------------------------------------------------------------------------
// installMockPluginBridge
// ---------------------------------------------------------------------------

export function installMockPluginBridge(): void {
	const messages: MockBridgeMessage[] = [];
	const messageListeners: Array<(msg: MockBridgeMessage) => void> = [];
	let pendingInvokeResolve: ((result: unknown) => void) | null = null;
	let pendingInvokeReject: ((error: string) => void) | null = null;
	let virtualModMatrix: { routes: unknown[] } = { routes: [] };

	// Full params blob received from the last setParams IPC call (nih-plug bridge).
	// Used by pushParamUpdate/pushPluginParamUpdate to build valid full-param updates.
	let virtualFullParams: FullParamsBlob | null = null;
	// Scalar param snapshot from last setParams — used for change detection.
	let prevExtractedScalars: Record<string, number> = {};

	// Virtual param state: string ID → normalized value
	const virtualParamState: Record<string, number> = {};
	const paramsByStringId: Record<string, PluginParamInfo> = {};
	const paramsById: Record<number, PluginParamInfo> = {};

	for (const p of DEFAULT_PARAMS) {
		const entry = { ...p };
		paramsByStringId[p.stringId] = entry;
		paramsById[p.id] = entry;
		virtualParamState[p.stringId] = p.value;
	}

	function recordMessage(msg: MockBridgeMessage): void {
		messages.push(msg);
		for (const listener of messageListeners) {
			try {
				listener(msg);
			} catch {
				// listeners must not break the bridge
			}
		}
	}

	function respondIpc(
		id: unknown,
		payload: { result?: unknown; error?: string },
	) {
		queueMicrotask(() => {
			if (typeof window.__czIpcResponse === "function") {
				window.__czIpcResponse({
					id: typeof id === "number" ? id : 0,
					...payload,
				});
			}
		});
	}

	window.ipc = {
		postMessage: (message: string) => {
			let parsed: unknown;
			try {
				parsed = JSON.parse(message) as unknown;
			} catch {
				return;
			}

			if (typeof parsed !== "object" || parsed === null) {
				return;
			}

			const msg = parsed as Record<string, unknown>;

			if (typeof msg.param_id === "string" && typeof msg.value === "number") {
				const param = paramsByStringId[msg.param_id];
				if (!param) {
					return;
				}
				param.plainValue = msg.value;
				param.value =
					param.max === param.min
						? param.defaultValue
						: (msg.value - param.min) / (param.max - param.min);
				virtualParamState[param.stringId] = param.value;
				recordMessage({
					type: "param:set",
					id: param.id,
					stringId: param.stringId,
					value: param.value,
				});
				return;
			}

			if (typeof msg.method !== "string") {
				return;
			}

			const method = msg.method;
			const id = msg.id;
			const args = Array.isArray(msg.args) ? msg.args : [];
			recordMessage({ type: "invoke", method, args });

			if (method === "getEnvelopes") {
				respondIpc(id, { result: {} });
				return;
			}
			if (method === "getParams") {
				// Resolve with null so the adapter enables outbound sync and calls syncRef,
				// which triggers the initial setParams call that seeds virtualFullParams.
				respondIpc(id, { result: null });
				return;
			}
			if (method === "getTransportInfo") {
				respondIpc(id, {
					result: {
						playing: true,
						recording: false,
						tempo: 120,
						timeSigNum: 4,
						timeSigDen: 4,
						positionSamples: 0,
						positionSeconds: 0,
						positionBeats: 0,
						barStartBeats: 0,
						loopActive: false,
						loopStartBeats: 0,
						loopEndBeats: 0,
					},
				});
				return;
			}
			if (method === "setParams") {
				const paramsJson = typeof args[0] === "string" ? args[0] : null;
				if (paramsJson) {
					try {
						const params = JSON.parse(paramsJson) as FullParamsBlob;
						const newScalars = extractScalarParams(params);

						// Emit param:begin / param:set / param:end for each changed scalar param.
						for (const [stringId, newVal] of Object.entries(newScalars)) {
							if (prevExtractedScalars[stringId] !== newVal) {
								const paramInfo = paramsByStringId[stringId];
								recordMessage({
									type: "param:begin",
									id: paramInfo?.id,
									stringId,
								});
								recordMessage({
									type: "param:set",
									id: paramInfo?.id,
									stringId,
									value: newVal,
								});
								recordMessage({
									type: "param:end",
									id: paramInfo?.id,
									stringId,
								});
								virtualParamState[stringId] = newVal;
							}
						}
						prevExtractedScalars = newScalars;

						// Emit setAlgoControls for each non-empty line/slot.
						const l1 = params.line1;
						const l2 = params.line2;
						if (
							Array.isArray(l1?.algoControlsA) &&
							l1.algoControlsA.length > 0
						) {
							recordMessage({
								type: "invoke",
								method: "setAlgoControls",
								args: [1, "a", l1.algoControlsA],
							});
						}
						if (
							Array.isArray(l1?.algoControlsB) &&
							l1.algoControlsB.length > 0
						) {
							recordMessage({
								type: "invoke",
								method: "setAlgoControls",
								args: [1, "b", l1.algoControlsB],
							});
						}
						if (
							Array.isArray(l2?.algoControlsA) &&
							l2.algoControlsA.length > 0
						) {
							recordMessage({
								type: "invoke",
								method: "setAlgoControls",
								args: [2, "a", l2.algoControlsA],
							});
						}
						if (
							Array.isArray(l2?.algoControlsB) &&
							l2.algoControlsB.length > 0
						) {
							recordMessage({
								type: "invoke",
								method: "setAlgoControls",
								args: [2, "b", l2.algoControlsB],
							});
						}

						// Emit setModMatrix when there are routes.
						const mm = params.modMatrix;
						if (Array.isArray(mm?.routes) && mm.routes.length > 0) {
							recordMessage({
								type: "invoke",
								method: "setModMatrix",
								args: [{ routes: mm.routes }],
							});
						}

						virtualFullParams = params;
					} catch {
						// ignore malformed JSON
					}
				}
				respondIpc(id, { result: null });
				return;
			}
			if (method === "setEnvelope") {
				respondIpc(id, { result: null });
				return;
			}
			if (method === "setAlgoControls") {
				respondIpc(id, { result: null });
				return;
			}
			if (method === "getAlgoControls") {
				respondIpc(id, {
					result: {
						line1: { a: [], b: [] },
						line2: { a: [], b: [] },
					},
				});
				return;
			}
			if (method === "setModMatrix") {
				const next = (args[0] ?? { routes: [] }) as {
					routes?: unknown[];
				};
				virtualModMatrix = { routes: [...(next.routes ?? [])] };
				respondIpc(id, { result: null });
				return;
			}
			if (method === "getModMatrix") {
				respondIpc(id, { result: { routes: [...virtualModMatrix.routes] } });
				return;
			}
			if (method === "getScopeData") {
				respondIpc(id, {
					result: { samples: [], sampleRate: 44100, hz: 220 },
				});
				return;
			}
			if (method === "clientLog") {
				respondIpc(id, { result: null });
				return;
			}

			pendingInvokeResolve = (result) => respondIpc(id, { result });
			pendingInvokeReject = (error) => respondIpc(id, { error });
		},
	};

	// ---------------------------------------------------------------------------
	// Public test handle — window.__MOCK_BRIDGE__
	// ---------------------------------------------------------------------------

	const handle: MockBridgeHandle = {
		getMessages: () => [...messages],

		getLastMessage: () => messages[messages.length - 1],

		clearMessages: () => {
			messages.length = 0;
		},

		pushParamUpdate(idOrStringId: string | number, value: number): void {
			const stringId =
				typeof idOrStringId === "number"
					? (paramsById[idOrStringId]?.stringId ?? String(idOrStringId))
					: idOrStringId;

			if (!window.__czOnParams) return;

			if (virtualFullParams !== null) {
				const updated = applyParamToBlob(virtualFullParams, stringId, value);
				virtualFullParams = updated;
				window.__czOnParams(JSON.stringify(updated));
			} else {
				// Fallback before first setParams — sends partial JSON (may log an error)
				window.__czOnParams(JSON.stringify({ [stringId]: value }));
			}
		},

		pushPluginParamUpdate(update: PluginParamUpdate): void {
			if (!window.__czOnParams || virtualFullParams === null) {
				return;
			}

			let params: FullParamsBlob = { ...virtualFullParams };
			for (const [key, [_normalized, plain]] of Object.entries(update)) {
				const numericId = Number.parseInt(key, 10);
				const stringId = Number.isNaN(numericId)
					? key
					: (paramsById[numericId]?.stringId ?? key);
				params = applyParamToBlob(params, stringId, plain);
			}
			virtualFullParams = params;
			window.__czOnParams(JSON.stringify(params));
		},

		setParameter(idOrStringId: string | number, value: number): void {
			const stringId =
				typeof idOrStringId === "number"
					? (paramsById[idOrStringId]?.stringId ?? String(idOrStringId))
					: idOrStringId;

			if (window.ipc) {
				// Full path: UI → installBridgeIpc → runtime.params.set.
				window.ipc.postMessage(JSON.stringify({ param_id: stringId, value }));
			} else {
				// Bridge not yet installed — fall back to direct push.
				this.pushParamUpdate(stringId, value);
			}
		},

		getState: () => ({ ...virtualParamState }),

		onMessage(cb: (msg: MockBridgeMessage) => void): () => void {
			messageListeners.push(cb);
			return () => {
				const idx = messageListeners.indexOf(cb);
				if (idx >= 0) messageListeners.splice(idx, 1);
			};
		},

		resolveNextInvoke(result: unknown): void {
			pendingInvokeResolve?.(result);
			pendingInvokeResolve = null;
		},

		rejectNextInvoke(error: string): void {
			pendingInvokeReject?.(error);
			pendingInvokeReject = null;
		},

		reset(): void {
			messages.length = 0;
			messageListeners.length = 0;
			pendingInvokeResolve = null;
			pendingInvokeReject = null;
		},
	};

	window.__MOCK_BRIDGE__ = handle;
}
