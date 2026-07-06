import type { ScopeDataResponse, SynthParams } from "@cosmo/cosmo-pd101";
import { installPluginIpcWindowBridge } from "./installPluginIpcWindowBridge";
import type { IpcRpcResponse } from "./ipcTypes";
import { createTypedInvoke } from "./ipcTypes";
import {
	getAuv3ScopePollIntervalMs,
	recordAuv3ScopeRpc,
} from "./scopePerformance";

export const AUV3_SCOPE_BINARY_URL = "cosmo-ext://bundle/__scope__";

type BinaryScopeFrame = {
	samples: Float32Array;
	sampleRate: number;
	hz: number;
};

/** AUv3-specific Window methods (webkit bridge, host platform, subscriptions). */
declare global {
	interface Window {
		webkit?: {
			messageHandlers?: {
				cosmoPd101?: { postMessage: (payload: unknown) => void };
			};
		};
		__czHostPlatform?: "macos" | "ios";
		__czRuntimeMode?: "auv3-hosted" | "plugin" | "standalone";
		__czSupportsStandaloneAppSettings?: boolean;
		__czAuv3HostActive?: boolean;
		__czOnHostPresetSelected?: (name: string) => void;
		__czOnRuntimeVoiceStates?: (json: string) => void;
		__czOnRuntimeModSources?: (json: string) => void;
		__czOnTransport?: (json: string) => void;
		__czGetStandaloneAppSettings?: () => Promise<StandaloneAppSettings>;
		__czSetStandaloneAppSettings?: (
			settings: StandaloneAppSettings,
		) => Promise<StandaloneAppSettings>;
	}
}

export type StandaloneAppSettings = {
	midiChannel: number;
	keepRunningInBackground: boolean;
	bufferSize: number;
};

const IPC_TIMEOUT_MS = 250;

let installed = false;
let nextRpcId = 1;
const pendingRpc = new Map<
	number,
	{ resolve: (value: unknown) => void; reject: (reason: unknown) => void }
>();
let currentParamHandler: Window["__czOnParams"];
let currentScopeHandler: Window["__czOnScope"];
const listenerCounts = new Map<string, number>();
const listenerCountWatchers = new Map<string, Set<() => void>>();
let demandTrackingInstalled = false;
const inactiveSuppressedMethods = new Set([
	"getScopeData",
	"getPendingParamChanges",
	"getParamsVersion",
	"getRuntimeVoiceStates",
	"getRuntimeModSources",
	"getTransportInfo",
	"subscribeRuntimeVoiceStates",
	"subscribeRuntimeModSources",
	"subscribeTransport",
	"unsubscribeRuntimeVoiceStates",
	"unsubscribeRuntimeModSources",
	"unsubscribeTransport",
]);

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

function nativeHandler() {
	return window.webkit?.messageHandlers?.cosmoPd101;
}

function isAuv3HostActive() {
	return window.__czAuv3HostActive !== false;
}

export function publishAuv3HostActiveFromWeb(active: boolean) {
	if (window.__czAuv3HostActive === active) {
		return;
	}
	window.__czAuv3HostActive = active;
	window.dispatchEvent(
		new Event(active ? "cz-auv3-host-active" : "cz-auv3-host-inactive"),
	);
}

function rejectPendingRpc(message: string) {
	for (const id of [...pendingRpc.keys()]) {
		const pending = pendingRpc.get(id);
		if (!pending) {
			continue;
		}
		pendingRpc.delete(id);
		pending.reject(new Error(message));
	}
}

function installAuv3VisibilityLifecycle() {
	// Native host lifecycle is authoritative in AUv3. Native dispatches
	// cz-auv3-host-active / cz-auv3-host-inactive (after a settle window), which
	// drive the authoritative `__czAuv3HostActive` flag and gate polling.
	//
	// `document.hidden`/pagehide are NOT used to publish host-state: doing so
	// would race WebKit's own suspend/resume and bounce native state, producing
	// the black/visible/black loop. Native's settle gate (in WebViewScriptDispatcher)
	// is the single authority that re-enables evaluateJavaScript after resume.
	window.addEventListener("pagehide", () => {
		// pagehide during teardown: cancel pending RPCs so they don't hang on a
		// dead handler. Do NOT publish host-inactive — native is authoritative.
		rejectPendingRpc("[auv3Bridge] pagehide — cancelling pending RPCs");
	});
	// If native never publishes (beyond first paint), seed the flag true. Native
	// will override via cz-auv3-host-active/inactive when it speaks.
	if (window.__czAuv3HostActive === undefined) {
		window.__czAuv3HostActive = !document.hidden;
	}
}

function shouldSuppressWhileHostInactive(method: string) {
	return inactiveSuppressedMethods.has(method);
}

function invokeAuv3<T = unknown>(
	method: string,
	payload?: unknown,
	timeoutMs = 5000,
): Promise<T> {
	return new Promise<T>((resolve, reject) => {
		if (!isAuv3HostActive() && shouldSuppressWhileHostInactive(method)) {
			reject(
				new Error(`[auv3Bridge] ${method} suppressed while host inactive`),
			);
			return;
		}

		const handler = nativeHandler();
		if (!handler) {
			reject(new Error("[auv3Bridge] native message handler not available"));
			return;
		}

		const id = nextRpcId++;
		let timeoutId = 0;
		pendingRpc.set(id, {
			resolve(value) {
				window.clearTimeout(timeoutId);
				resolve(value as T);
			},
			reject(reason) {
				window.clearTimeout(timeoutId);
				reject(reason);
			},
		});
		if (timeoutMs > 0) {
			timeoutId = window.setTimeout(() => {
				if (!pendingRpc.delete(id)) {
					return;
				}
				reject(new Error(`[auv3Bridge] ${method} timed out (id=${id})`));
			}, timeoutMs);
		}
		const msg: Record<string, unknown> = { id, method };
		if (payload !== undefined) {
			msg.payload = payload;
		}
		handler.postMessage(msg);
	});
}

const invoke = createTypedInvoke((method: string, payload?: unknown) =>
	invokeAuv3<unknown>(method, payload),
);

export function decodeAuv3BinaryScopeFrame(
	buffer: ArrayBuffer,
): BinaryScopeFrame | null {
	if (buffer.byteLength < 8 || (buffer.byteLength - 8) % 4 !== 0) {
		return null;
	}

	const view = new DataView(buffer);
	const sampleRate = view.getFloat32(0, true);
	const hz = view.getFloat32(4, true);
	const sampleCount = (buffer.byteLength - 8) / 4;
	return {
		samples: new Float32Array(buffer, 8, sampleCount),
		sampleRate,
		hz,
	};
}

function normalizeLegacyScopeFrame(result: unknown): BinaryScopeFrame | null {
	const raw = result as Omit<ScopeDataResponse, "samples"> & {
		samples?: Array<number | null>;
	};
	if (!raw?.samples) {
		return null;
	}

	return {
		samples: Float32Array.from(
			raw.samples.filter(
				(sample): sample is number => typeof sample === "number",
			),
		),
		sampleRate: raw.sampleRate ?? 0,
		hz: raw.hz ?? 0,
	};
}

export async function fetchAuv3BinaryScopeFrame(
	fetchScope: typeof fetch = window.fetch.bind(window),
): Promise<BinaryScopeFrame | null> {
	const response = await fetchScope(AUV3_SCOPE_BINARY_URL);
	if (!response.ok) {
		throw new Error(`scope fetch: ${response.status}`);
	}
	return decodeAuv3BinaryScopeFrame(await response.arrayBuffer());
}

export async function readAuv3ScopeFrame(
	fetchScope: typeof fetch,
	invokeScope: () => Promise<unknown>,
): Promise<BinaryScopeFrame | null> {
	try {
		return await fetchAuv3BinaryScopeFrame(fetchScope);
	} catch {
		return normalizeLegacyScopeFrame(await invokeScope());
	}
}

function installIpcResponseHandler() {
	window.__czIpcResponse = (response: IpcRpcResponse) => {
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
}

function installParamProperty() {
	currentParamHandler = window.__czOnParams;
	Object.defineProperty(window, "__czOnParams", {
		configurable: true,
		get() {
			return currentParamHandler;
		},
		set(handler: Window["__czOnParams"]) {
			currentParamHandler = handler;
		},
	});
}

function installIpcRouter() {
	window.ipc = {
		postMessage(message: string) {
			let payload: unknown;
			try {
				payload = JSON.parse(message);
			} catch {
				console.warn("[auv3Bridge] dropped non-JSON IPC message", message);
				return;
			}
			nativeHandler()?.postMessage(payload);
		},
	};

	installPluginIpcWindowBridge(invoke, {
		// AUv3 native does not implement these methods. Disabling them here
		// prevents continuous failing IPC (esp. polled getPendingParamChanges)
		// and ensures consumers feature-detect via __czBridgeCapabilities.
		capabilities: {
			__czGetPendingParamChanges: false,
			__czGetPresetName: false,
			__czSetPresetName: false,
		},
		overrides: {
			__czGetParams: async () => {
				const result = await invokeAuv3<SynthParams | string>(
					"getParams",
					undefined,
					3000,
				);
				return typeof result === "string"
					? (JSON.parse(result) as SynthParams)
					: result;
			},
			__czGetParamsVersion: () =>
				invokeAuv3<number>("getParamsVersion", undefined, 3000),
		},
	});
}

function installScopeProperty(onActiveChange: (active: boolean) => void) {
	currentScopeHandler = window.__czOnScope;
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
	const pollIntervalMs = getAuv3ScopePollIntervalMs(window.__czHostPlatform);
	let rafId = 0;
	let lastScheduled = 0;
	let pollInFlight = false;
	let destroyed = false;
	let binaryScopeSupported = true;

	const scheduleNextFrame = () => {
		if (
			destroyed ||
			rafId !== 0 ||
			!currentScopeHandler ||
			!isAuv3HostActive()
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
		lastScheduled = 0;
	};

	const tick = async (now: number) => {
		rafId = 0;
		if (destroyed || !currentScopeHandler || !isAuv3HostActive()) {
			return;
		}
		if (now - lastScheduled < pollIntervalMs || pollInFlight) {
			scheduleNextFrame();
			return;
		}

		lastScheduled = now;
		pollInFlight = true;
		try {
			let frame: BinaryScopeFrame | null;
			if (binaryScopeSupported) {
				try {
					frame = await fetchAuv3BinaryScopeFrame();
				} catch {
					binaryScopeSupported = false;
					frame = normalizeLegacyScopeFrame(
						await invokeAuv3("getScopeData", undefined, IPC_TIMEOUT_MS),
					);
				}
			} else {
				frame = normalizeLegacyScopeFrame(
					await invokeAuv3("getScopeData", undefined, IPC_TIMEOUT_MS),
				);
			}

			if (frame?.samples.length && currentScopeHandler) {
				recordAuv3ScopeRpc(frame.samples.length);
				currentScopeHandler(frame.samples, frame.sampleRate, frame.hz);
			}
		} catch {
			// Scope data is opportunistic; audio may not be active yet.
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
	window.addEventListener("cz-auv3-host-inactive", stopPolling);
	window.addEventListener("cz-auv3-host-active", scheduleNextFrame);
}

type Auv3SubscriptionState =
	| "unsubscribed"
	| "subscribing"
	| "subscribed"
	| "unsubscribing";

type Auv3DemandSubscriptionOptions<TDetail> = {
	eventName: string;
	handlerName:
		| "__czOnRuntimeVoiceStates"
		| "__czOnRuntimeModSources"
		| "__czOnTransport";
	subscribeMethod: string;
	unsubscribeMethod: string;
	parse: (json: string) => TDetail | null;
};

function installAuv3DemandSubscription<TDetail>(
	options: Auv3DemandSubscriptionOptions<TDetail>,
) {
	const { eventName, handlerName, subscribeMethod, unsubscribeMethod, parse } =
		options;
	let destroyed = false;
	let subscriptionState: Auv3SubscriptionState = "unsubscribed";

	try {
		Object.defineProperty(window, handlerName, {
			configurable: true,
			writable: true,
			value: (json: string) => {
				const detail = parse(json);
				if (detail === null) {
					return;
				}
				window.dispatchEvent(new CustomEvent(eventName, { detail }));
			},
		});
	} catch {
		return;
	}

	const syncDemand = () => {
		if (destroyed) {
			return;
		}

		if (!isAuv3HostActive()) {
			return;
		}

		if (hasDemand(eventName)) {
			if (subscriptionState !== "unsubscribed") {
				return;
			}
			subscriptionState = "subscribing";
			void invokeAuv3(subscribeMethod, undefined, IPC_TIMEOUT_MS)
				.then(() => {
					if (destroyed) {
						subscriptionState = "unsubscribed";
						return;
					}
					subscriptionState = "subscribed";
					syncDemand();
				})
				.catch(() => {
					subscriptionState = "unsubscribed";
				});
			return;
		}

		if (subscriptionState !== "subscribed") {
			return;
		}
		subscriptionState = "unsubscribing";
		void invokeAuv3(unsubscribeMethod, undefined, IPC_TIMEOUT_MS)
			.catch(() => {
				// The host may have torn down while the page is unloading.
			})
			.finally(() => {
				subscriptionState = "unsubscribed";
				if (!destroyed) {
					syncDemand();
				}
			});
	};

	const unwatchDemand = watchDemand(eventName, syncDemand);
	syncDemand();
	window.addEventListener("cz-auv3-host-active", syncDemand);
	window.addEventListener("pagehide", () => {
		destroyed = true;
		unwatchDemand();
		subscriptionState = "unsubscribed";
	});
}

function installRuntimeVoiceStatesSubscription() {
	installAuv3DemandSubscription({
		eventName: "cz-runtime-voice-states",
		handlerName: "__czOnRuntimeVoiceStates",
		subscribeMethod: "subscribeRuntimeVoiceStates",
		unsubscribeMethod: "unsubscribeRuntimeVoiceStates",
		parse: (json) => {
			try {
				const states = JSON.parse(json) as unknown;
				return Array.isArray(states) ? states : null;
			} catch {
				return null;
			}
		},
	});
}

function installRuntimeModSourcesSubscription() {
	installAuv3DemandSubscription({
		eventName: "cz-runtime-mod-sources",
		handlerName: "__czOnRuntimeModSources",
		subscribeMethod: "subscribeRuntimeModSources",
		unsubscribeMethod: "unsubscribeRuntimeModSources",
		parse: (json) => {
			try {
				const sources = JSON.parse(json) as unknown;
				return typeof sources === "object" && sources !== null
					? (sources as Record<string, number>)
					: null;
			} catch {
				return null;
			}
		},
	});
}

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
					console.error("[auv3Bridge] Invalid MidiLearnState JSON");
				}
			},
		});
	} catch {
		// Host may prevent definition; will fall back gracefully.
	}
}

function installTransportSubscription() {
	installAuv3DemandSubscription({
		eventName: "cz-host-transport",
		handlerName: "__czOnTransport",
		subscribeMethod: "subscribeTransport",
		unsubscribeMethod: "unsubscribeTransport",
		parse: (json) => {
			try {
				const transport = JSON.parse(json) as unknown;
				return typeof transport === "object" && transport !== null
					? (transport as Record<string, number | boolean>)
					: null;
			} catch {
				return null;
			}
		},
	});
}

function installStandaloneAppSettingsBridge() {
	window.__czGetStandaloneAppSettings = () =>
		invokeAuv3<StandaloneAppSettings>("getStandaloneAppSettings");
	window.__czSetStandaloneAppSettings = (settings) =>
		invokeAuv3<StandaloneAppSettings>("setStandaloneAppSettings", settings);
}

export function ensureAuv3Bridge(): boolean {
	if (installed) {
		return true;
	}
	if (!nativeHandler()) {
		return false;
	}

	installed = true;
	installAuv3VisibilityLifecycle();
	installParamProperty();
	installIpcResponseHandler();
	installMidiCcHandler();
	installMidiLearnStateHandler();
	installIpcRouter();
	installScopePolling();
	installRuntimeVoiceStatesSubscription();
	installRuntimeModSourcesSubscription();
	installTransportSubscription();
	installStandaloneAppSettingsBridge();
	return true;
}
