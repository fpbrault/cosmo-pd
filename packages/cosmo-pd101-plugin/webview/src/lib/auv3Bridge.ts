import type { ScopeDataResponse, SynthParams } from "@cosmo/cosmo-pd101";
import type { IpcRpcResponse } from "./ipcTypes";
import { createTypedInvoke } from "./ipcTypes";

/** AUv3-specific Window methods (webkit bridge, host platform, subscriptions). */
declare global {
	interface Window {
		webkit?: {
			messageHandlers?: {
				cosmoPd101?: { postMessage: (payload: unknown) => void };
			};
		};
		__czHostPlatform?: "macos" | "ios";
		__czOnHostPresetSelected?: (name: string) => void;
		__czOnRuntimeVoiceStates?: (json: string) => void;
		__czOnRuntimeModSources?: (json: string) => void;
		__czOnTransport?: (json: string) => void;
	}
}

const SCOPE_POLL_INTERVAL_MS = 50;
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

function invokeAuv3<T = unknown>(
	method: string,
	payload?: unknown,
	timeoutMs = 0,
): Promise<T> {
	return new Promise<T>((resolve, reject) => {
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
				reject(new Error(`[auv3Bridge] ${method} timed out`));
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

	window.__czGetParams = async () => {
		const result = await invokeAuv3<SynthParams | string>(
			"getParams",
			undefined,
			3000,
		);
		if (typeof result !== "string") {
			return result;
		}
		return JSON.parse(result) as SynthParams;
	};
	window.__czGetParamsVersion = () =>
		invokeAuv3<number>("getParamsVersion", undefined, 3000);
	window.__czSetParams = (params) =>
		invoke("setParams", params).catch((error) => {
			console.error("[auv3Bridge] setParams error", error);
			return null;
		});
	window.__czGetTransportInfo = () => invoke("getTransportInfo");
	window.__czGetPresetSession = () => invoke("getPresetSession");
	window.__czSetPresetSession = (session) =>
		invoke("setPresetSession", session);

	window.__czGetPresetLibrary = (payload) =>
		invoke("getPresetLibrary", payload);
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
			console.error("[auv3Bridge] setEditorState error", error);
			return null;
		});

	window.__czGetEditorState = () => invoke("getEditorState");

	window.__czGetVoiceLimit = () => invoke("getVoiceLimit");
	window.__czSetVoiceLimit = (limit) =>
		invoke("setVoiceLimit", limit).catch((error) => {
			console.error("[auv3Bridge] setVoiceLimit error", error);
			return null;
		});

	window.__czGetMidiLearnState = () => invoke("getMidiLearnState");

	window.__czSetMidiLearnMode = (on) =>
		invoke("setMidiLearnMode", on).catch((error) => {
			console.error("[auv3Bridge] setMidiLearnMode error", error);
			return null;
		});
	window.__czSetPendingMidiLearnParam = (key) =>
		invoke("setPendingMidiLearnParam", key).catch((error) => {
			console.error("[auv3Bridge] setPendingMidiLearnParam error", error);
			return null;
		});
	window.__czAddMidiBinding = (binding) =>
		invoke("addMidiBinding", binding).catch((error) => {
			console.error("[auv3Bridge] addMidiBinding error", error);
			return null;
		});
	window.__czRemoveMidiBinding = (binding) =>
		invoke("removeMidiBinding", binding).catch((error) => {
			console.error("[auv3Bridge] removeMidiBinding error", error);
			return null;
		});
	window.__czClearMidiLearnBindings = () =>
		invoke("clearMidiLearnBindings").catch((error) => {
			console.error("[auv3Bridge] clearMidiLearnBindings error", error);
			return null;
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
	let rafId = 0;
	let lastScheduled = 0;
	let pollInFlight = false;
	let destroyed = false;

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
		if (now - lastScheduled < SCOPE_POLL_INTERVAL_MS || pollInFlight) {
			scheduleNextFrame();
			return;
		}

		lastScheduled = now;
		pollInFlight = true;
		try {
			await invokeAuv3("getScopeData", undefined, IPC_TIMEOUT_MS)
				.then((result) => {
					const raw = result as ScopeDataResponse;
					if (raw?.samples.length > 0 && currentScopeHandler) {
						currentScopeHandler(
							raw.samples.filter((sample): sample is number => sample !== null),
							raw.sampleRate ?? 0,
							raw.hz ?? 0,
						);
					}
				})
				.catch(() => {
					// Scope data is opportunistic; audio may not be active yet.
				});
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
	window.addEventListener("pagehide", () => {
		destroyed = true;
		unwatchDemand();
		if (subscriptionState === "subscribed") {
			void invokeAuv3(unsubscribeMethod, undefined, IPC_TIMEOUT_MS).catch(
				() => {
					// Host teardown races are safe to ignore here.
				},
			);
		}
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

export function ensureAuv3Bridge(): boolean {
	if (installed) {
		return true;
	}
	if (!nativeHandler()) {
		return false;
	}

	installed = true;
	installParamProperty();
	installIpcResponseHandler();
	installMidiCcHandler();
	installMidiLearnStateHandler();
	installIpcRouter();
	installScopePolling();
	installRuntimeVoiceStatesSubscription();
	installRuntimeModSourcesSubscription();
	installTransportSubscription();
	return true;
}
