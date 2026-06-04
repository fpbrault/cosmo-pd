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

type RuntimeVoiceStatesResponse = string | unknown[];

type RuntimeModSourcesResponse = string | Record<string, number>;
type MidiBindingIdentity = {
	paramKey: string;
	channel: number;
	cc: number;
};

type NativePluginPresetSession = {
	loadedPresetId: string | null;
	activePresetNameBase: string;
	isDirty: boolean;
};

const SCOPE_POLL_INTERVAL_MS = 50;
const RUNTIME_VOICE_STATES_POLL_INTERVAL_MS = 100;
const RUNTIME_MOD_SOURCES_POLL_INTERVAL_MS = 100;
const TRANSPORT_POLL_INTERVAL_MS = 250;
const IPC_TIMEOUT_MS = 250;

declare global {
	interface Window {
		webkit?: {
			messageHandlers?: {
				cosmoPd101?: { postMessage: (payload: unknown) => void };
			};
		};
		__czHostPlatform?: "macos" | "ios";
		ipc?: { postMessage: (msg: string) => void };
		__czOnParams?: (json: string) => void;
		__czOnHostPresetSelected?: (name: string) => void;
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
		__czGetPresetSession?: () => Promise<unknown>;
		__czSetPresetSession?: (
			session: NativePluginPresetSession,
		) => Promise<unknown>;
		__czGetPresetLibrary?: (source?: string) => Promise<unknown>;
		__czLoadPresetData?: (id: string) => Promise<unknown>;
		__czAddPreset?: (
			name: string,
			tags: string[],
			macroLabels?: string[],
		) => Promise<unknown>;
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

let installed = false;
let nextRpcId = 1;
const pendingRpc = new Map<
	number,
	{ resolve: (value: unknown) => void; reject: (reason: unknown) => void }
>();
let currentParamHandler: Window["__czOnParams"];
let currentScopeHandler: Window["__czOnScope"];

function nativeHandler() {
	return window.webkit?.messageHandlers?.cosmoPd101;
}

function invokeAuv3(
	method: string,
	args: unknown[] = [],
	timeoutMs = 0,
): Promise<unknown> {
	return new Promise((resolve, reject) => {
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
				resolve(value);
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
		handler.postMessage({ id, method, args });
	});
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

	window.__czGetParams = async () => {
		const result = await invokeAuv3("getParams", [], 3000);
		if (typeof result !== "string") {
			return result;
		}
		try {
			return JSON.parse(result) as unknown;
		} catch {
			return null;
		}
	};
	window.__czGetParamsVersion = () => invokeAuv3("getParamsVersion", [], 3000);
	window.__czSetParams = (json: string) => {
		void invokeAuv3("setParams", [json]).catch((error) => {
			console.error("[auv3Bridge] setParams error", error);
		});
	};
	window.__czGetTransportInfo = () => invokeAuv3("getTransportInfo", []);
	window.__czGetPresetSession = () => invokeAuv3("getPresetSession", []);
	window.__czSetPresetSession = (session: NativePluginPresetSession) =>
		invokeAuv3("setPresetSession", [session]);

	window.__czGetPresetLibrary = (source?: string) =>
		source
			? invokeAuv3("getPresetLibrary", [{ source }])
			: invokeAuv3("getPresetLibrary", []);
	window.__czLoadPresetData = (id: string) =>
		invokeAuv3("loadPresetData", [{ id }]);
	window.__czAddPreset = (
		name: string,
		tags: string[],
		macroLabels?: string[],
	) => invokeAuv3("addPreset", [{ name, tags, macroLabels }]);
	window.__czSavePreset = (payload) => invokeAuv3("savePreset", [payload]);
	window.__czDeletePreset = (id: string) =>
		invokeAuv3("deletePreset", [{ id }]);
	window.__czRenamePreset = (id: string, newName: string) =>
		invokeAuv3("renamePreset", [{ id, newName }]);
	window.__czSetPresetAuthor = (id: string, author: string) =>
		invokeAuv3("setPresetAuthor", [{ id, author }]);
	window.__czSetPresetTags = (id: string, tags: string[]) =>
		invokeAuv3("setPresetTags", [{ id, tags }]);
	window.__czToggleStarred = (id: string, starred: boolean) =>
		invokeAuv3("toggleStarred", [{ id, starred }]);
	window.__czExportPreset = (id: string) =>
		invokeAuv3("exportPreset", [{ id }]);

	window.__czSetEditorState = (state: string) => {
		void invokeAuv3("setEditorState", [JSON.parse(state)]).catch((error) => {
			console.error("[auv3Bridge] setEditorState error", error);
		});
	};

	window.__czGetEditorState = () => invokeAuv3("getEditorState", []);

	window.__czGetMidiLearnState = () => invokeAuv3("getMidiLearnState", []);

	window.__czSetMidiLearnMode = (on: boolean) => {
		void invokeAuv3("setMidiLearnMode", [on]).catch((error) => {
			console.error("[auv3Bridge] setMidiLearnMode error", error);
		});
	};
	window.__czSetPendingMidiLearnParam = (key: string | null) => {
		void invokeAuv3("setPendingMidiLearnParam", [key]).catch((error) => {
			console.error("[auv3Bridge] setPendingMidiLearnParam error", error);
		});
	};
	window.__czAddMidiBinding = (key: string, ch: number, cc: number) => {
		void invokeAuv3("addMidiBinding", [key, ch, cc]).catch((error) => {
			console.error("[auv3Bridge] addMidiBinding error", error);
		});
	};
	window.__czRemoveMidiBinding = (binding: MidiBindingIdentity) => {
		void invokeAuv3("removeMidiBinding", [binding]).catch((error) => {
			console.error("[auv3Bridge] removeMidiBinding error", error);
		});
	};
	window.__czClearMidiLearnBindings = () => {
		void invokeAuv3("clearMidiLearnBindings").catch((error) => {
			console.error("[auv3Bridge] clearMidiLearnBindings error", error);
		});
	};
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
			await invokeAuv3("getScopeData", [], IPC_TIMEOUT_MS)
				.then((result) => {
					const raw = result as ScopeDataResponse;
					if (raw?.samples.length > 0 && currentScopeHandler) {
						currentScopeHandler(raw.samples, raw.sampleRate, raw.hz);
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

function installRuntimeVoiceStatesPolling() {
	let rafId = 0;
	let lastScheduled = 0;
	let pollInFlight = false;
	let destroyed = false;
	let runtimeVoiceStatesAvailable = true;

	const dispatchRuntimeVoiceStates = (result: RuntimeVoiceStatesResponse) => {
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
			await invokeAuv3("getRuntimeVoiceStates", [], IPC_TIMEOUT_MS)
				.then((result) => {
					dispatchRuntimeVoiceStates(result as RuntimeVoiceStatesResponse);
				})
				.catch(() => {
					runtimeVoiceStatesAvailable = false;
				});
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

function installRuntimeModSourcesPolling() {
	let rafId = 0;
	let lastScheduled = 0;
	let pollInFlight = false;
	let destroyed = false;
	let runtimeModSourcesAvailable = true;

	const dispatchRuntimeModSources = (result: RuntimeModSourcesResponse) => {
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
		if (destroyed || rafId !== 0 || !runtimeModSourcesAvailable) {
			return;
		}
		rafId = requestAnimationFrame(tick);
	};

	const tick = async (now: number) => {
		rafId = 0;
		if (destroyed || !runtimeModSourcesAvailable) {
			return;
		}
		if (
			now - lastScheduled < RUNTIME_MOD_SOURCES_POLL_INTERVAL_MS ||
			pollInFlight
		) {
			scheduleNextFrame();
			return;
		}

		lastScheduled = now;
		pollInFlight = true;
		try {
			await invokeAuv3("getRuntimeModSources", [], IPC_TIMEOUT_MS)
				.then((result) => {
					dispatchRuntimeModSources(result as RuntimeModSourcesResponse);
				})
				.catch(() => {
					runtimeModSourcesAvailable = false;
				});
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

function installTransportPolling() {
	let rafId = 0;
	let lastScheduled = 0;
	let pollInFlight = false;
	let destroyed = false;

	const dispatchTransport = (result: unknown) => {
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
		if (now - lastScheduled < TRANSPORT_POLL_INTERVAL_MS || pollInFlight) {
			scheduleNextFrame();
			return;
		}

		lastScheduled = now;
		pollInFlight = true;
		try {
			const result = await invokeAuv3("getTransportInfo");
			if (result) {
				dispatchTransport(result);
			}
		} catch {
			// Transport is opportunistic; some hosts may not implement it.
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
	installRuntimeVoiceStatesPolling();
	installRuntimeModSourcesPolling();
	installTransportPolling();
	return true;
}
