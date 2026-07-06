import type {
	PluginBridgeWindowCapabilities,
	PluginBridgeWindowFacade,
} from "@cosmo/cosmo-pd101";
import type { PluginIpcInvoke } from "./ipcTypes";

type RequiredPluginBridgeWindowFacade = {
	[K in keyof PluginBridgeWindowFacade]-?: NonNullable<
		PluginBridgeWindowFacade[K]
	>;
};

type PluginBridgeWindowInstallerMap = {
	[K in keyof RequiredPluginBridgeWindowFacade]: (
		invoke: PluginIpcInvoke,
	) => RequiredPluginBridgeWindowFacade[K];
};

/** Per-method capability flags. Defaults to `true` (install everything). */
export type PluginBridgeCapabilities = PluginBridgeWindowCapabilities;

function fireAndForget(label: string, promise: Promise<unknown>) {
	void promise.catch((error) => {
		console.error(`[pluginBridge] ${label} error`, error);
	});
}

const pluginBridgeWindowInstallers = {
	__czGetParams: (invoke) => () => invoke("getParams"),
	__czGetParamsVersion: (invoke) => () => invoke("getParamsVersion"),
	__czGetPendingParamChanges: (invoke) => () =>
		invoke("getPendingParamChanges"),
	__czSetParams: (invoke) => (params) => {
		fireAndForget("setParams", invoke("setParams", params));
	},
	__czGetTransportInfo: (invoke) => () => invoke("getTransportInfo"),
	__czGetPresetName: (invoke) => () => invoke("getPresetName"),
	__czSetPresetName: (invoke) => (name) => {
		fireAndForget("setPresetName", invoke("setPresetName", name));
	},
	__czGetPresetSession: (invoke) => () => invoke("getPresetSession"),
	__czSetPresetSession: (invoke) => (session) =>
		invoke("setPresetSession", session),
	__czGetPresetLibrary: (invoke) => (source) =>
		invoke("getPresetLibrary", { source: source ?? null }),
	__czRetryPresetLibrary: (invoke) => () => invoke("retryPresetLibrary"),
	__czRepairPresetLibrary: (invoke) => () => invoke("repairPresetLibrary"),
	__czRebuildPresetLibrary: (invoke) => () => invoke("rebuildPresetLibrary"),
	__czLoadPreset: (invoke) => (id) => invoke("loadPreset", { presetId: id }),
	__czAddPreset: (invoke) => (payload) => invoke("addPreset", payload),
	__czSavePreset: (invoke) => (payload) => invoke("savePreset", payload),
	__czDeletePreset: (invoke) => (id) => invoke("deletePreset", { id }),
	__czRenamePreset: (invoke) => (id, newName) =>
		invoke("renamePreset", { id, newName }),
	__czToggleStarred: (invoke) => (id, starred) =>
		invoke("toggleStarred", { id, starred }),
	__czSetPresetAuthor: (invoke) => (id, author) =>
		invoke("setPresetAuthor", { id, author }),
	__czSetPresetDescription: (invoke) => (id, description) =>
		invoke("setPresetDescription", { id, description }),
	__czSetPresetTags: (invoke) => (id, tags) =>
		invoke("setPresetTags", { id, tags }),
	__czImportPresetBank: (invoke) => (payload) =>
		invoke("importPresetBank", payload),
	__czExportPreset: (invoke) => (id) => invoke("exportPreset", { id }),
	__czListFxModulePresets: (invoke) => (moduleType) =>
		invoke("listFxModulePresets", { moduleType }),
	__czSaveFxModulePreset: (invoke) => (payload) =>
		invoke("saveFxModulePreset", payload),
	__czDeleteFxModulePreset: (invoke) => (id) =>
		invoke("deleteFxModulePreset", { id }),
	__czSetEditorState: (invoke) => (state) => {
		fireAndForget("setEditorState", invoke("setEditorState", state));
	},
	__czGetEditorState: (invoke) => () => invoke("getEditorState"),
	__czGetVoiceLimit: (invoke) => () => invoke("getVoiceLimit"),
	__czSetVoiceLimit: (invoke) => (limit) => {
		fireAndForget("setVoiceLimit", invoke("setVoiceLimit", limit));
	},
	__czGetMidiLearnState: (invoke) => () => invoke("getMidiLearnState"),
	__czSetMidiLearnMode: (invoke) => (on) => {
		fireAndForget("setMidiLearnMode", invoke("setMidiLearnMode", on));
	},
	__czSetPendingMidiLearnParam: (invoke) => (key) => {
		fireAndForget(
			"setPendingMidiLearnParam",
			invoke("setPendingMidiLearnParam", key),
		);
	},
	__czAddMidiBinding: (invoke) => (key, channel, cc) => {
		fireAndForget(
			"addMidiBinding",
			invoke("addMidiBinding", { paramKey: key, channel, cc }),
		);
	},
	__czRemoveMidiBinding: (invoke) => (binding) => {
		fireAndForget("removeMidiBinding", invoke("removeMidiBinding", binding));
	},
	__czClearMidiLearnBindings: (invoke) => () => {
		fireAndForget("clearMidiLearnBindings", invoke("clearMidiLearnBindings"));
	},
	__czGetScopeData: (invoke) => () => invoke("getScopeData"),
} satisfies PluginBridgeWindowInstallerMap;

export type PluginBridgeWindowOverrides =
	Partial<RequiredPluginBridgeWindowFacade>;

export type InstallPluginIpcWindowBridgeOptions = {
	overrides?: PluginBridgeWindowOverrides;
	/**
	 * Per-method capability flags. Methods whose capability is `false` are NOT
	 * installed on `window`, so consumers must not poll them. Defaults to all
	 * `true` (suitable for the plugin/standalone bridge where native
	 * implements every method).
	 */
	capabilities?: PluginBridgeCapabilities;
};

/**
 * Returns `true` if a capability is supported. Absent flags default to `true`
 * (the plugin/standalone bridge supports everything; AUv3 opts out
 * explicitly).
 */
export function supportsMethod(
	capabilities: PluginBridgeCapabilities | undefined,
	method: keyof PluginBridgeWindowFacade,
): boolean {
	return capabilities?.[method] !== false;
}

export function installPluginIpcWindowBridge(
	invoke: PluginIpcInvoke,
	options:
		| InstallPluginIpcWindowBridgeOptions
		| PluginBridgeWindowOverrides = {},
) {
	const resolved: InstallPluginIpcWindowBridgeOptions =
		"overrides" in options || "capabilities" in options
			? (options as InstallPluginIpcWindowBridgeOptions)
			: { overrides: options as PluginBridgeWindowOverrides };

	const overrides = resolved.overrides ?? {};
	const capabilities: PluginBridgeCapabilities = resolved.capabilities ?? {};

	// Expose the resolved capabilities so consumers (e.g. polling loops) can
	// gate on what native actually supports.
	window.__czBridgeCapabilities = capabilities;

	// Treat window as a record for capability-driven delete of stale methods.
	const windowRecord = window as unknown as Record<string, unknown>;

	for (const key of Object.keys(pluginBridgeWindowInstallers) as Array<
		keyof typeof pluginBridgeWindowInstallers
	>) {
		if (!supportsMethod(capabilities, key)) {
			// Capability disabled: never install the method, and actively remove
			// any stale installation (e.g. from a prior bridge or test) so
			// consumers feature-detect a missing method instead of a dead fn.
			delete windowRecord[key];
			continue;
		}
		const method = overrides[key] ?? pluginBridgeWindowInstallers[key](invoke);
		windowRecord[key] = method;
	}
}
