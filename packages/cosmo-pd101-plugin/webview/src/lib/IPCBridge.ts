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
 *   - RPC invoke:    `{ id: number, method: string, payload?: unknown }`
 */

// ─── Types ───────────────────────────────────────────────────────────────────
import type {
	ScopeDataResponse,
	TransportInfoResponse,
} from "@cosmo/cosmo-pd101";
import { postHostLog } from "./hostLogger";
import type { IpcRpcResponse } from "./ipcTypes";
import { createTypedInvoke } from "./ipcTypes";

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
const listenerCounts = new Map<string, number>();
const listenerCountWatchers = new Map<string, Set<() => void>>();
let demandTrackingInstalled = false;

type IpcPostMessage = (msg: string) => void;
let _routerPostMessage: IpcPostMessage | null = null;

function notifyListenerCountWatchers(eventName: string) {
	listenerCountWatchers.get(eventName)?.forEach((watcher) => {
		watcher();
	});
}

function installDemandTracking() {
	if (demandTrackingInstalled) {
		return;
	}
	demandTrackingInstalled = true;

	const nativeAddEventListener = window.addEventListener.bind(window);
	const nativeRemoveEventListener = window.removeEventListener.bind(window);

	window.addEventListener = ((
		type: string,
		listener: EventListenerOrEventListenerObject | null,
		options?: boolean | AddEventListenerOptions,
	) => {
		if (!listener) {
			return;
		}
		nativeAddEventListener(type, listener, options);
		if (!listenerCountWatchers.has(type)) {
			return;
		}
		listenerCounts.set(type, (listenerCounts.get(type) ?? 0) + 1);
		notifyListenerCountWatchers(type);
	}) as typeof window.addEventListener;

	window.removeEventListener = ((
		type: string,
		listener: EventListenerOrEventListenerObject | null,
		options?: boolean | EventListenerOptions,
	) => {
		if (!listener) {
			return;
		}
		nativeRemoveEventListener(type, listener, options);
		if (!listenerCountWatchers.has(type)) {
			return;
		}
		const nextCount = Math.max(0, (listenerCounts.get(type) ?? 0) - 1);
		listenerCounts.set(type, nextCount);
		notifyListenerCountWatchers(type);
	}) as typeof window.removeEventListener;
}

function hasDemand(eventName: string) {
	return (listenerCounts.get(eventName) ?? 0) > 0;
}

function watchDemand(eventName: string, watcher: () => void) {
	installDemandTracking();
	const watchers =
		listenerCountWatchers.get(eventName) ?? new Set<() => void>();
	watchers.add(watcher);
	listenerCountWatchers.set(eventName, watchers);
	return () => {
		const currentWatchers = listenerCountWatchers.get(eventName);
		if (!currentWatchers) {
			return;
		}
		currentWatchers.delete(watcher);
		if (currentWatchers.size === 0) {
			listenerCountWatchers.delete(eventName);
			listenerCounts.delete(eventName);
		}
	};
}

// ─── RPC helper ──────────────────────────────────────────────────────────────

function invokeRust(method: string, payload?: unknown): Promise<unknown> {
	return new Promise((resolve, reject) => {
		if (!_nativePostMessage) {
			const error = new Error("[IPCBridge] native IPC not available");
			postHostLog("warn", `${method}: ${error.message}`);
			reject(error);
			return;
		}
		const id = nextRpcId++;
		pendingRpc.set(id, { resolve, reject });
		const msg: Record<string, unknown> = { id, method };
		if (payload !== undefined) {
			msg.payload = payload;
		}
		_nativePostMessage(JSON.stringify(msg));
	});
}

const invoke = createTypedInvoke(invokeRust);

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

	window.__czGetParams = async () => invoke("getParams");
	window.__czGetParamsVersion = async () => invoke("getParamsVersion");

	window.__czSetParams = (params) =>
		invoke("setParams", params).catch((error) => {
			console.error("[IPCBridge] setParams error", error);
			return null;
		});

	window.__czGetTransportInfo = () => invoke("getTransportInfo");

	window.__czGetPresetName = () => invoke("getPresetName");
	window.__czSetPresetName = (name) =>
		invoke("setPresetName", name).catch((error) => {
			console.error("[IPCBridge] setPresetName error", error);
			return null;
		});
	window.__czGetPresetSession = () => invoke("getPresetSession");
	window.__czSetPresetSession = (session) =>
		invoke("setPresetSession", session);

	window.__czGetPresetLibrary = (payload) =>
		invoke("getPresetLibrary", payload);
	window.__czRetryPresetLibrary = () => invoke("retryPresetLibrary");
	window.__czRepairPresetLibrary = () => invoke("repairPresetLibrary");
	window.__czRebuildPresetLibrary = () => invoke("rebuildPresetLibrary");
	window.__czLoadPreset = (payload) => invoke("loadPreset", payload);
	window.__czAddPreset = (payload) => invoke("addPreset", payload);
	window.__czSavePreset = (payload) => invoke("savePreset", payload);
	window.__czDeletePreset = (payload) => invoke("deletePreset", payload);
	window.__czRenamePreset = (payload) => invoke("renamePreset", payload);
	window.__czSetPresetAuthor = (payload) => invoke("setPresetAuthor", payload);
	window.__czSetPresetDescription = (payload) =>
		invoke("setPresetDescription", payload);
	window.__czSetPresetTags = (payload) => invoke("setPresetTags", payload);
	window.__czToggleStarred = (payload) => invoke("toggleStarred", payload);
	window.__czExportPreset = (payload) => invoke("exportPreset", payload);
	window.__czImportPresetBank = (payload) =>
		invoke("importPresetBank", payload);
	window.__czListFxModulePresets = (payload) =>
		invoke("listFxModulePresets", payload);
	window.__czSaveFxModulePreset = (payload) =>
		invoke("saveFxModulePreset", payload);
	window.__czDeleteFxModulePreset = (payload) =>
		invoke("deleteFxModulePreset", payload);

	window.__czSetEditorState = (state) =>
		invoke("setEditorState", state).catch((error) => {
			console.error("[IPCBridge] setEditorState error", error);
			return null;
		});

	window.__czGetEditorState = () => invoke("getEditorState");

	window.__czGetVoiceLimit = () => invoke("getVoiceLimit");
	window.__czSetVoiceLimit = (limit) =>
		invoke("setVoiceLimit", limit).catch((error) => {
			console.error("[IPCBridge] setVoiceLimit error", error);
			return null;
		});

	window.__czGetVoiceLimit = () => invoke("getVoiceLimit");
	window.__czSetVoiceLimit = (limit: number) => {
		void invoke("setVoiceLimit", limit).catch((error) => {
			console.error("[IPCBridge] setVoiceLimit error", error);
		});
	};

	window.__czGetMidiLearnState = () => invoke("getMidiLearnState");

	window.__czSetMidiLearnMode = (on) =>
		invoke("setMidiLearnMode", on).catch((error) => {
			console.error("[IPCBridge] setMidiLearnMode error", error);
			return null;
		});
	window.__czSetPendingMidiLearnParam = (key) =>
		invoke("setPendingMidiLearnParam", key).catch((error) => {
			console.error("[IPCBridge] setPendingMidiLearnParam error", error);
			return null;
		});
	window.__czAddMidiBinding = (binding) =>
		invoke("addMidiBinding", binding).catch((error) => {
			console.error("[IPCBridge] addMidiBinding error", error);
			return null;
		});
	window.__czRemoveMidiBinding = (binding) =>
		invoke("removeMidiBinding", binding).catch((error) => {
			console.error("[IPCBridge] removeMidiBinding error", error);
			return null;
		});
	window.__czClearMidiLearnBindings = () =>
		invoke("clearMidiLearnBindings").catch((error) => {
			console.error("[IPCBridge] clearMidiLearnBindings error", error);
			return null;
		});
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
	const INTERVAL_MS = 50; // ~20 fps
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
				const raw = (await invoke("getScopeData")) as ScopeDataResponse;
				if (raw?.samples.length > 0 && currentScopeHandler) {
					currentScopeHandler(
						raw.samples.filter((sample): sample is number => sample !== null),
						raw.sampleRate ?? 0,
						raw.hz ?? 0,
					);
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
	const eventName = "cz-runtime-mod-sources";
	const INTERVAL_MS = 100; // ~10 fps
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
		if (destroyed || rafId !== 0 || !hasDemand(eventName)) {
			return;
		}
		rafId = requestAnimationFrame(tick);
	};

	const stopPolling = () => {
		if (rafId !== 0) {
			cancelAnimationFrame(rafId);
			rafId = 0;
		}
	};

	const tick = async (now: number) => {
		rafId = 0;
		if (destroyed) {
			return;
		}
		if (!hasDemand(eventName)) {
			stopPolling();
			return;
		}
		if (now - lastScheduled < INTERVAL_MS || pollInFlight) {
			scheduleNextFrame();
			return;
		}

		lastScheduled = now;
		pollInFlight = true;
		try {
			const result = await invoke("getRuntimeModSources");
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

	const unwatchDemand = watchDemand(eventName, () => {
		if (hasDemand(eventName)) {
			scheduleNextFrame();
		} else {
			stopPolling();
		}
	});
	window.addEventListener("pagehide", () => {
		destroyed = true;
		stopPolling();
		unwatchDemand();
	});
}

function installRuntimeVoiceStatesPolling() {
	const eventName = "cz-runtime-voice-states";
	const RUNTIME_VOICE_STATES_POLL_INTERVAL_MS = 100;
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
		if (
			destroyed ||
			rafId !== 0 ||
			!runtimeVoiceStatesAvailable ||
			!hasDemand(eventName)
		) {
			return;
		}
		rafId = requestAnimationFrame(tick);
	};

	const stopPolling = () => {
		if (rafId !== 0) {
			cancelAnimationFrame(rafId);
			rafId = 0;
		}
	};

	const tick = async (now: number) => {
		rafId = 0;
		if (destroyed || !runtimeVoiceStatesAvailable) {
			return;
		}
		if (!hasDemand(eventName)) {
			stopPolling();
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
			const result = await invoke("getRuntimeVoiceStates");
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

	const unwatchDemand = watchDemand(eventName, () => {
		if (hasDemand(eventName)) {
			scheduleNextFrame();
		} else {
			stopPolling();
		}
	});
	window.addEventListener("pagehide", () => {
		destroyed = true;
		stopPolling();
		unwatchDemand();
	});
}

function installTransportPolling() {
	const eventName = "cz-host-transport";
	const INTERVAL_MS = 250;
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
		if (destroyed || rafId !== 0 || !hasDemand(eventName)) {
			return;
		}
		rafId = requestAnimationFrame(tick);
	};

	const stopPolling = () => {
		if (rafId !== 0) {
			cancelAnimationFrame(rafId);
			rafId = 0;
		}
	};

	const tick = async (now: number) => {
		rafId = 0;
		if (destroyed) {
			return;
		}
		if (!hasDemand(eventName)) {
			stopPolling();
			return;
		}
		if (now - lastScheduled < INTERVAL_MS || pollInFlight) {
			scheduleNextFrame();
			return;
		}

		lastScheduled = now;
		pollInFlight = true;
		try {
			const result = await invoke("getTransportInfo");
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

	const unwatchDemand = watchDemand(eventName, () => {
		if (hasDemand(eventName)) {
			scheduleNextFrame();
		} else {
			stopPolling();
		}
	});
	window.addEventListener("pagehide", () => {
		destroyed = true;
		stopPolling();
		unwatchDemand();
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
