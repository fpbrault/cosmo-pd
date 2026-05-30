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

declare global {
	interface Window {
		ipc?: { postMessage: (msg: string) => void };
		__czOnParams?: (json: string) => void;
		__czGetParams?: () => Promise<unknown>;
		__czSetParams?: (json: string) => void;
		__czSetPerformanceMonitorEnabled?: (enabled: boolean) => Promise<unknown>;
		__czGetPerformanceMetrics?: () => Promise<unknown>;
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
			reject(new Error("[IPCBridge] native IPC not available"));
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

	window.__czSetParams = (json: string) => {
		void invokeRust("setParams", json).catch((error) => {
			console.error("[IPCBridge] setParams error", error);
		});
	};

	window.__czSetPerformanceMonitorEnabled = (enabled: boolean) =>
		invokeRust("setPerformanceMonitorEnabled", enabled);

	window.__czGetPerformanceMetrics = () => invokeRust("getPerformanceMetrics");
	window.__czGetTransportInfo = () => invokeRust("getTransportInfo");

	window.__czGetPresetName = () => invokeRust("getPresetName");
	window.__czSetPresetName = (name: string) => {
		void invokeRust("setPresetName", name).catch((error) => {
			console.error("[IPCBridge] setPresetName error", error);
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
