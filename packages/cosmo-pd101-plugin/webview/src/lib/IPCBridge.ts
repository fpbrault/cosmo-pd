/**
 * IPC bridge.
 *
 * Provides a plugin bridge surface for the webview (window.__czOnParams,
 * window.__czGetParams, window.__czSetParams, window.__czOnScope,
 * window.ipc.postMessage) but wired to the wry WebView IPC channel that
 * Rust uses.
 *
 * ## Rust → JS (inbound):
 *   - `window.__czOnParams(jsonString)` — pushed by Rust after param changes
 *   - `window.__czIpcResponse({ id, result })` — RPC replies
 *
 * ## JS → Rust (outbound via window.ipc.postMessage):
 *   - RPC invoke:    `{ id: number, method: string, args: unknown[] }`
 */

// ─── Types ───────────────────────────────────────────────────────────────────
import { postHostLog } from "./hostLogger";

type IpcRpcResponse = {
	id: number;
	result?: unknown;
	error?: string;
};

type ScopeDataResponse = {
	samples: number[];
	sampleRate: number;
	hz: number;
};

type TransportInfoResponse = string | Record<string, number | boolean>;
type MidiBindingIdentity = {
	paramKey: string;
	channel: number;
	cc: number;
};

type PresetSession = {
	activePresetId: string | null;
	loadedPresetId?: string | null;
	activePresetNameBase: string;
	isDirty: boolean;
};

declare global {
	interface Window {
		ipc?: { postMessage: (msg: string) => void };
		__czOnParams?: (json: string) => void;
		__czGetParams?: () => Promise<unknown>;
		__czGetParamsVersion?: () => Promise<unknown>;
		__czSetParams?: (json: string) => void;
		__czGetTransportInfo?: () => Promise<unknown>;
		__czOnScope?: (
			samples: Float32Array | number[],
			sampleRate: number,
			hz: number,
		) => void;
		__czIpcResponse?: (response: IpcRpcResponse) => void;
		__czOnMidiCc?: (channel: number, cc: number, value: number) => void;
		__czSetPresetName?: (name: string) => void;
		__czGetPresetName?: () => Promise<unknown>;
		__czGetPresetSession?: () => Promise<unknown>;
		__czSetPresetSession?: (session: PresetSession) => Promise<unknown>;
		__czGetPresetLibrary?: (source?: string) => Promise<unknown>;
		__czLoadPresetData?: (id: string) => Promise<unknown>;
		__czAddPreset?: (
			name: string,
			tags: string[],
			macroLabels?: string[],
		) => Promise<unknown>;
		__czSavePreset?: (payload: {
			id?: string | null;
			name: string;
			author?: string;
			tags?: string[];
			data?: unknown;
		}) => Promise<unknown>;
		__czDeletePreset?: (id: string) => Promise<unknown>;
		__czRenamePreset?: (id: string, newName: string) => Promise<unknown>;
		__czSetPresetAuthor?: (id: string, author: string) => Promise<unknown>;
		__czSetPresetTags?: (id: string, tags: string[]) => Promise<unknown>;
		__czToggleStarred?: (id: string, starred: boolean) => Promise<unknown>;
		__czExportPreset?: (id: string) => Promise<unknown>;
		__czSetEditorState?: (state: string) => void;
		__czGetEditorState?: () => Promise<unknown>;
		__czOnMidiLearnState?: (json: string) => void;
		__czGetMidiLearnState?: () => Promise<unknown>;
		__czSetMidiLearnMode?: (on: boolean) => void;
		__czSetPendingMidiLearnParam?: (key: string | null) => void;
		__czAddMidiBinding?: (key: string, ch: number, cc: number) => void;
		__czRemoveMidiBinding?: (binding: MidiBindingIdentity) => void;
		__czClearMidiLearnBindings?: () => void;
	}
}

// ─── State ───────────────────────────────────────────────────────────────────

let installed = false;
let nextRpcId = 1;
const pendingRpc = new Map<
	number,
	{ resolve: (value: unknown) => void; reject: (reason: unknown) => void }
>();

let currentParamHandler: ((json: string) => void) | undefined;
let currentScopeHandler:
	| ((samples: Float32Array | number[], sampleRate: number, hz: number) => void)
	| undefined;
let nativeIpcObject: Window["ipc"] | undefined;

type IpcPostMessage = (msg: string) => void;
let _routerPostMessage: IpcPostMessage | null = null;

// ─── RPC helper ──────────────────────────────────────────────────────────────

function invokeRust(method: string, ...args: unknown[]): Promise<unknown> {
	return new Promise((resolve, reject) => {
		if (!_nativePostMessage) {
			const error = new Error("[IPCBridge] native IPC not available");
			postHostLog("warn", `${method}: ${error.message}`);
			reject(error);
			return;
		}
		const id = nextRpcId++;
		pendingRpc.set(id, { resolve, reject });
		_nativePostMessage(JSON.stringify({ id, method, args }));
	});
}

// ─── Param property ──────────────────────────────────────────────────────────

function installParamProperty() {
	const descriptor = Object.getOwnPropertyDescriptor(window, "__czOnParams");
	if (descriptor && descriptor.configurable === false) {
		currentParamHandler =
			typeof window.__czOnParams === "function"
				? window.__czOnParams
				: undefined;
		return;
	}
	if (descriptor?.get || descriptor?.set) {
		return;
	}

	Object.defineProperty(window, "__czOnParams", {
		configurable: true,
		get() {
			return currentParamHandler;
		},
		set(handler: ((json: string) => void) | undefined) {
			currentParamHandler = handler;
		},
	});
}

// ─── RPC response handler ─────────────────────────────────────────────────────

function installIpcResponseHandler() {
	const handler = (response: IpcRpcResponse) => {
		const pending = pendingRpc.get(response.id);
		if (!pending) {
			return;
		}
		pendingRpc.delete(response.id);
		if (response.error !== undefined) {
			postHostLog(
				"error",
				`IPCBridge response error id=${response.id}: ${response.error}`,
			);
			pending.reject(new Error(response.error));
		} else {
			pending.resolve(response.result);
		}
	};

	const descriptor = Object.getOwnPropertyDescriptor(window, "__czIpcResponse");
	const isReadonlyDescriptor = Boolean(
		descriptor &&
			descriptor.configurable === false &&
			(("writable" in descriptor && descriptor.writable === false) ||
				(!("writable" in descriptor) && !descriptor.set)),
	);
	if (isReadonlyDescriptor) {
		// Host owns this callback as readonly; do not reassign and avoid crashing.
		return;
	}

	try {
		Object.defineProperty(window, "__czIpcResponse", {
			configurable: true,
			writable: true,
			value: handler,
		});
	} catch {
		// Some hosts expose this symbol as immutable/non-configurable.
	}
}

function routeOutgoingMessage(message: string) {
	// All outbound messages are RPC envelopes — pass through directly.
	_nativePostMessage(message);
}

// ─── window.ipc router ────────────────────────────────────────────────────────

/**
 * Install the `window.ipc.postMessage` handler that routes outbound messages
 * from the synth UI components to the Rust backend.
 *
 * The UI sends:
 *   - `{ param_id, value }` — plain param value change
 *   - `{ envelope_id, data }` — envelope update (RPC)
 *   - `{ algo_controls }` — algo controls update (RPC)
 *   - `{ mod_matrix }` — mod matrix update (RPC)
 */
function installIpcRouter() {
	_routerPostMessage = routeOutgoingMessage;

	window.__czGetParams = async () => invokeRust("getParams");
	window.__czGetParamsVersion = async () => invokeRust("getParamsVersion");

	window.__czSetParams = (json: string) => {
		void invokeRust("setParams", json).catch((error) => {
			console.error("[IPCBridge] setParams error", error);
		});
	};

	window.__czGetTransportInfo = () => invokeRust("getTransportInfo");

	window.__czGetPresetName = () => invokeRust("getPresetName");
	window.__czSetPresetName = (name: string) => {
		void invokeRust("setPresetName", name).catch((error) => {
			console.error("[IPCBridge] setPresetName error", error);
		});
	};
	window.__czGetPresetSession = () => invokeRust("getPresetSession");
	window.__czSetPresetSession = (session: PresetSession) =>
		invokeRust("setPresetSession", session);

	window.__czGetPresetLibrary = (source?: string) =>
		source
			? invokeRust("getPresetLibrary", { source })
			: invokeRust("getPresetLibrary");
	window.__czLoadPresetData = (id: string) =>
		invokeRust("loadPresetData", { id });
	window.__czAddPreset = (
		name: string,
		tags: string[],
		macroLabels?: string[],
	) => invokeRust("addPreset", { name, tags, macroLabels });
	window.__czSavePreset = (payload) => invokeRust("savePreset", payload);
	window.__czDeletePreset = (id: string) => invokeRust("deletePreset", { id });
	window.__czRenamePreset = (id: string, newName: string) =>
		invokeRust("renamePreset", { id, newName });
	window.__czSetPresetAuthor = (id: string, author: string) =>
		invokeRust("setPresetAuthor", { id, author });
	window.__czSetPresetTags = (id: string, tags: string[]) =>
		invokeRust("setPresetTags", { id, tags });
	window.__czToggleStarred = (id: string, starred: boolean) =>
		invokeRust("toggleStarred", { id, starred });
	window.__czExportPreset = (id: string) => invokeRust("exportPreset", { id });

	window.__czSetEditorState = (state: string) => {
		void invokeRust("setEditorState", JSON.parse(state)).catch((error) => {
			console.error("[IPCBridge] setEditorState error", error);
		});
	};

	window.__czGetEditorState = () => invokeRust("getEditorState");

	window.__czGetMidiLearnState = () => invokeRust("getMidiLearnState");

	window.__czSetMidiLearnMode = (on: boolean) => {
		void invokeRust("setMidiLearnMode", on).catch((error) => {
			console.error("[IPCBridge] setMidiLearnMode error", error);
		});
	};
	window.__czSetPendingMidiLearnParam = (key: string | null) => {
		void invokeRust("setPendingMidiLearnParam", key).catch((error) => {
			console.error("[IPCBridge] setPendingMidiLearnParam error", error);
		});
	};
	window.__czAddMidiBinding = (key: string, ch: number, cc: number) => {
		void invokeRust("addMidiBinding", key, ch, cc).catch((error) => {
			console.error("[IPCBridge] addMidiBinding error", error);
		});
	};
	window.__czRemoveMidiBinding = (binding: MidiBindingIdentity) => {
		void invokeRust("removeMidiBinding", binding).catch((error) => {
			console.error("[IPCBridge] removeMidiBinding error", error);
		});
	};
	window.__czClearMidiLearnBindings = () => {
		void invokeRust("clearMidiLearnBindings").catch((error) => {
			console.error("[IPCBridge] clearMidiLearnBindings error", error);
		});
	};
}

// ─── Native IPC passthrough ───────────────────────────────────────────────────

// wry's native IPC endpoint: the original window.ipc before we override it.
// We capture it once before installing our router.
let _nativePostMessage: (msg: string) => void = (msg) => {
	console.warn("[IPCBridge] native IPC not available yet, dropped:", msg);
};

// ─── MIDI CC handler ──────────────────────────────────────────────────────────

function installMidiCcHandler() {
	try {
		Object.defineProperty(window, "__czOnMidiCc", {
			configurable: true,
			writable: true,
			value: (channel: number, cc: number, value: number) => {
				window.dispatchEvent(
					new CustomEvent("cz-midi-cc", {
						detail: { channel, cc, rawValue: value },
					}),
				);
			},
		});
	} catch {
		// Host may prevent definition; MIDI Learn will fall back to Web MIDI API.
	}
}

// ─── MIDI learn state handler ──────────────────────────────────────────────────

function installMidiLearnStateHandler() {
	try {
		Object.defineProperty(window, "__czOnMidiLearnState", {
			configurable: true,
			writable: true,
			value: (json: string) => {
				try {
					const state = JSON.parse(json);
					window.dispatchEvent(
						new CustomEvent("cz-midi-learn-state", { detail: state }),
					);
				} catch {
					console.error("[IPCBridge] Invalid MidiLearnState JSON");
				}
			},
		});
	} catch {
		// Host may prevent definition; will fall back gracefully.
	}
}

// ─── Scope polling ────────────────────────────────────────────────────────────

function installScopeProperty(onActiveChange: (active: boolean) => void) {
	const descriptor = Object.getOwnPropertyDescriptor(window, "__czOnScope");
	if (descriptor && descriptor.configurable === false) {
		currentScopeHandler =
			typeof window.__czOnScope === "function" ? window.__czOnScope : undefined;
		onActiveChange(currentScopeHandler !== undefined);
		return;
	}
	if (descriptor?.get || descriptor?.set) {
		currentScopeHandler =
			typeof window.__czOnScope === "function" ? window.__czOnScope : undefined;
		onActiveChange(currentScopeHandler !== undefined);
		return;
	}

	currentScopeHandler =
		typeof window.__czOnScope === "function" ? window.__czOnScope : undefined;

	Object.defineProperty(window, "__czOnScope", {
		configurable: true,
		get() {
			return currentScopeHandler;
		},
		set(handler: Window["__czOnScope"]) {
			currentScopeHandler = typeof handler === "function" ? handler : undefined;
			onActiveChange(currentScopeHandler !== undefined);
		},
	});

	onActiveChange(currentScopeHandler !== undefined);
}

function installScopePolling() {
	const INTERVAL_MS = 33; // ~30 fps
	let rafId = 0;
	let lastScheduled = 0;
	let pollInFlight = false;
	let destroyed = false;
	let binaryScopeSupported = true;

	const scheduleNextFrame = () => {
		if (destroyed || rafId !== 0 || !currentScopeHandler) {
			return;
		}
		rafId = requestAnimationFrame(tick);
	};

	const stopPolling = () => {
		if (rafId !== 0) {
			cancelAnimationFrame(rafId);
			rafId = 0;
		}
		lastScheduled = 0;
	};

	const tick = async (now: number) => {
		rafId = 0;
		if (destroyed || !currentScopeHandler) {
			return;
		}
		if (now - lastScheduled < INTERVAL_MS || pollInFlight) {
			scheduleNextFrame();
			return;
		}
		lastScheduled = now;
		pollInFlight = true;

		try {
			if (binaryScopeSupported) {
				const response = await fetch(`${window.location.origin}/__scope__`);
				if (!response.ok) {
					throw new Error(`scope fetch: ${response.status}`);
				}
				const buffer = await response.arrayBuffer();
				if (buffer.byteLength < 8 || !currentScopeHandler) {
					return;
				}
				const view = new DataView(buffer);
				const sampleRate = view.getFloat32(0, true);
				const hz = view.getFloat32(4, true);
				const sampleCount = (buffer.byteLength - 8) / 4;
				if (sampleCount > 0 && hz > 0) {
					const samples = new Float32Array(buffer, 8, sampleCount);
					currentScopeHandler(samples, sampleRate, hz);
				}
			} else {
				throw new Error("binary scope disabled");
			}
		} catch {
			// Fallback: use RPC invoke (for dev harness / AUv3 / fallback)
			binaryScopeSupported = false;
			try {
				const raw = (await invokeRust("getScopeData")) as ScopeDataResponse;
				if (raw?.samples.length > 0 && currentScopeHandler) {
					currentScopeHandler(raw.samples, raw.sampleRate, raw.hz);
				}
			} catch {
				// Plugin may not be producing audio yet.
			}
		} finally {
			pollInFlight = false;
			scheduleNextFrame();
		}
	};

	installScopeProperty((active) => {
		if (active) {
			scheduleNextFrame();
		} else {
			stopPolling();
		}
	});

	window.addEventListener("pagehide", () => {
		destroyed = true;
		stopPolling();
	});
}

function installRuntimeModSourcesPolling() {
	const INTERVAL_MS = 16; // ~60 fps
	let rafId = 0;
	let lastScheduled = 0;
	let pollInFlight = false;
	let destroyed = false;

	const dispatchRuntimeModSources = (
		result: string | Record<string, number>,
	) => {
		const sources =
			typeof result === "string"
				? (JSON.parse(result) as Record<string, number>)
				: result;
		if (typeof sources !== "object" || sources === null) {
			return;
		}
		window.dispatchEvent(
			new CustomEvent("cz-runtime-mod-sources", { detail: sources }),
		);
	};

	const scheduleNextFrame = () => {
		if (destroyed || rafId !== 0) {
			return;
		}
		rafId = requestAnimationFrame(tick);
	};

	const tick = async (now: number) => {
		rafId = 0;
		if (destroyed) {
			return;
		}
		if (now - lastScheduled < INTERVAL_MS || pollInFlight) {
			scheduleNextFrame();
			return;
		}

		lastScheduled = now;
		pollInFlight = true;
		try {
			const result = await invokeRust("getRuntimeModSources");
			if (result) {
				dispatchRuntimeModSources(result as string | Record<string, number>);
			}
		} catch {
			// Plugin not yet producing audio — skip this frame.
		} finally {
			pollInFlight = false;
			scheduleNextFrame();
		}
	};

	scheduleNextFrame();
	window.addEventListener("pagehide", () => {
		destroyed = true;
		if (rafId !== 0) {
			cancelAnimationFrame(rafId);
			rafId = 0;
		}
	});
}

function installRuntimeVoiceStatesPolling() {
	const RUNTIME_VOICE_STATES_POLL_INTERVAL_MS = 16;
	let rafId = 0;
	let lastScheduled = 0;
	let pollInFlight = false;
	let destroyed = false;
	let runtimeVoiceStatesAvailable = true;

	const dispatchRuntimeVoiceStates = (result: unknown) => {
		const states =
			typeof result === "string" ? (JSON.parse(result) as unknown) : result;
		if (!Array.isArray(states)) {
			return;
		}
		window.dispatchEvent(
			new CustomEvent("cz-runtime-voice-states", { detail: states }),
		);
	};

	const scheduleNextFrame = () => {
		if (destroyed || rafId !== 0 || !runtimeVoiceStatesAvailable) {
			return;
		}
		rafId = requestAnimationFrame(tick);
	};

	const tick = async (now: number) => {
		rafId = 0;
		if (destroyed || !runtimeVoiceStatesAvailable) {
			return;
		}
		if (
			now - lastScheduled < RUNTIME_VOICE_STATES_POLL_INTERVAL_MS ||
			pollInFlight
		) {
			scheduleNextFrame();
			return;
		}

		lastScheduled = now;
		pollInFlight = true;
		try {
			const result = await invokeRust("getRuntimeVoiceStates");
			if (result) {
				dispatchRuntimeVoiceStates(result);
			}
		} catch {
			runtimeVoiceStatesAvailable = false;
		} finally {
			pollInFlight = false;
			scheduleNextFrame();
		}
	};

	scheduleNextFrame();
	window.addEventListener("pagehide", () => {
		destroyed = true;
		if (rafId !== 0) {
			cancelAnimationFrame(rafId);
			rafId = 0;
		}
	});
}

function installTransportPolling() {
	const INTERVAL_MS = 100;
	let rafId = 0;
	let lastScheduled = 0;
	let pollInFlight = false;
	let destroyed = false;

	const dispatchTransport = (result: TransportInfoResponse) => {
		const transport =
			typeof result === "string"
				? (JSON.parse(result) as Record<string, number | boolean>)
				: result;
		if (typeof transport !== "object" || transport === null) {
			return;
		}
		window.dispatchEvent(
			new CustomEvent("cz-host-transport", { detail: transport }),
		);
	};

	const scheduleNextFrame = () => {
		if (destroyed || rafId !== 0) {
			return;
		}
		rafId = requestAnimationFrame(tick);
	};

	const tick = async (now: number) => {
		rafId = 0;
		if (destroyed) {
			return;
		}
		if (now - lastScheduled < INTERVAL_MS || pollInFlight) {
			scheduleNextFrame();
			return;
		}

		lastScheduled = now;
		pollInFlight = true;
		try {
			const result = await invokeRust("getTransportInfo");
			if (result) {
				dispatchTransport(result as TransportInfoResponse);
			}
		} catch {
			// Transport is opportunistic; some harnesses may not implement it.
		} finally {
			pollInFlight = false;
			scheduleNextFrame();
		}
	};

	scheduleNextFrame();
	window.addEventListener("pagehide", () => {
		destroyed = true;
		if (rafId !== 0) {
			cancelAnimationFrame(rafId);
			rafId = 0;
		}
	});
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Installs the IPC bridge.  Call this from `usePluginParamBridge`;
 * it is safe to call multiple times — subsequent calls are no-ops.
 *
 * Returns `true` if the native `window.ipc` endpoint is present (i.e. we're
 * running inside the plugin WebView), `false` otherwise (e.g. in the browser
 * dev harness).
 */
export function ensureIPCBridge(): boolean {
	if (installed) {
		return true;
	}

	if (!window.ipc) {
		return false;
	}

	// Capture the native IPC endpoint before we patch postMessage routing.
	nativeIpcObject = window.ipc;
	_nativePostMessage = window.ipc.postMessage.bind(window.ipc);

	installed = true;

	installParamProperty();
	installIpcResponseHandler();
	installMidiCcHandler();
	installMidiLearnStateHandler();
	installIpcRouter();
	installScopePolling();
	installRuntimeModSourcesPolling();
	installRuntimeVoiceStatesPolling();
	installTransportPolling();

	// Fallback: if host prevented method patching, route via a getter/setter
	// shim on window.ipc that preserves the native object identity.
	if (nativeIpcObject?.postMessage !== routeOutgoingMessage) {
		const descriptor = Object.getOwnPropertyDescriptor(window, "ipc");
		if (!descriptor || descriptor.configurable) {
			try {
				Object.defineProperty(window, "ipc", {
					configurable: true,
					get() {
						if (!nativeIpcObject) {
							return undefined;
						}
						return {
							postMessage(message: string) {
								if (_routerPostMessage) {
									_routerPostMessage(message);
									return;
								}
								nativeIpcObject?.postMessage(message);
							},
						};
					},
					set(value) {
						nativeIpcObject = value;
						_nativePostMessage = value
							? value.postMessage.bind(value)
							: (msg: string) => {
									console.warn(
										"[IPCBridge] native IPC unavailable after reassignment, dropped:",
										msg,
									);
								};
					},
				});
			} catch {
				// Some hosts lock down window.ipc; keep native endpoint untouched.
			}
		}
	}

	return true;
}
