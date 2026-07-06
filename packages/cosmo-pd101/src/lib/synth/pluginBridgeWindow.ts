import type {
	PluginIpcMethods,
	UiParamChange,
} from "@/lib/synth/bindings/plugin-bridge";

export type PluginBridgeWindowFacade = {
	__czGetParams?: () => Promise<PluginIpcMethods["getParams"]["response"]>;
	__czGetParamsVersion?: () => Promise<
		PluginIpcMethods["getParamsVersion"]["response"]
	>;
	__czGetPendingParamChanges?: () => Promise<
		PluginIpcMethods["getPendingParamChanges"]["response"]
	>;
	__czSetParams?: (params: PluginIpcMethods["setParams"]["request"]) => void;
	__czGetTransportInfo?: () => Promise<
		PluginIpcMethods["getTransportInfo"]["response"]
	>;
	__czGetPresetName?: () => Promise<
		PluginIpcMethods["getPresetName"]["response"]
	>;
	__czSetPresetName?: (
		name: PluginIpcMethods["setPresetName"]["request"],
	) => void;
	__czGetPresetSession?: () => Promise<
		PluginIpcMethods["getPresetSession"]["response"]
	>;
	__czSetPresetSession?: (
		session: PluginIpcMethods["setPresetSession"]["request"],
	) => Promise<PluginIpcMethods["setPresetSession"]["response"]>;
	__czGetPresetLibrary?: (
		source?: string,
	) => Promise<PluginIpcMethods["getPresetLibrary"]["response"]>;
	__czRetryPresetLibrary?: () => Promise<
		PluginIpcMethods["retryPresetLibrary"]["response"]
	>;
	__czRepairPresetLibrary?: () => Promise<
		PluginIpcMethods["repairPresetLibrary"]["response"]
	>;
	__czRebuildPresetLibrary?: () => Promise<
		PluginIpcMethods["rebuildPresetLibrary"]["response"]
	>;
	__czLoadPreset?: (
		id: PluginIpcMethods["loadPreset"]["request"]["presetId"],
	) => Promise<PluginIpcMethods["loadPreset"]["response"]>;
	__czAddPreset?: (
		payload: PluginIpcMethods["addPreset"]["request"],
	) => Promise<PluginIpcMethods["addPreset"]["response"]>;
	__czSavePreset?: (
		payload: PluginIpcMethods["savePreset"]["request"],
	) => Promise<PluginIpcMethods["savePreset"]["response"]>;
	__czDeletePreset?: (
		id: PluginIpcMethods["deletePreset"]["request"]["id"],
	) => Promise<PluginIpcMethods["deletePreset"]["response"]>;
	__czRenamePreset?: (
		id: PluginIpcMethods["renamePreset"]["request"]["id"],
		newName: PluginIpcMethods["renamePreset"]["request"]["newName"],
	) => Promise<PluginIpcMethods["renamePreset"]["response"]>;
	__czToggleStarred?: (
		id: PluginIpcMethods["toggleStarred"]["request"]["id"],
		starred: PluginIpcMethods["toggleStarred"]["request"]["starred"],
	) => Promise<PluginIpcMethods["toggleStarred"]["response"]>;
	__czSetPresetAuthor?: (
		id: PluginIpcMethods["setPresetAuthor"]["request"]["id"],
		author: PluginIpcMethods["setPresetAuthor"]["request"]["author"],
	) => Promise<PluginIpcMethods["setPresetAuthor"]["response"]>;
	__czSetPresetDescription?: (
		id: PluginIpcMethods["setPresetDescription"]["request"]["id"],
		description: PluginIpcMethods["setPresetDescription"]["request"]["description"],
	) => Promise<PluginIpcMethods["setPresetDescription"]["response"]>;
	__czSetPresetTags?: (
		id: PluginIpcMethods["setPresetTags"]["request"]["id"],
		tags: PluginIpcMethods["setPresetTags"]["request"]["tags"],
	) => Promise<PluginIpcMethods["setPresetTags"]["response"]>;
	__czImportPresetBank?: (
		payload: PluginIpcMethods["importPresetBank"]["request"],
	) => Promise<PluginIpcMethods["importPresetBank"]["response"]>;
	__czExportPreset?: (
		id: PluginIpcMethods["exportPreset"]["request"]["id"],
	) => Promise<PluginIpcMethods["exportPreset"]["response"]>;
	__czListFxModulePresets?: (
		moduleType: PluginIpcMethods["listFxModulePresets"]["request"]["moduleType"],
	) => Promise<PluginIpcMethods["listFxModulePresets"]["response"]>;
	__czSaveFxModulePreset?: (
		payload: PluginIpcMethods["saveFxModulePreset"]["request"],
	) => Promise<PluginIpcMethods["saveFxModulePreset"]["response"]>;
	__czDeleteFxModulePreset?: (
		id: PluginIpcMethods["deleteFxModulePreset"]["request"]["id"],
	) => Promise<PluginIpcMethods["deleteFxModulePreset"]["response"]>;
	__czSetEditorState?: (
		state: PluginIpcMethods["setEditorState"]["request"],
	) => void;
	__czGetEditorState?: () => Promise<
		PluginIpcMethods["getEditorState"]["response"]
	>;
	__czGetVoiceLimit?: () => Promise<
		PluginIpcMethods["getVoiceLimit"]["response"]
	>;
	__czSetVoiceLimit?: (
		limit: PluginIpcMethods["setVoiceLimit"]["request"],
	) => void;
	__czGetMidiLearnState?: () => Promise<
		PluginIpcMethods["getMidiLearnState"]["response"]
	>;
	__czSetMidiLearnMode?: (
		on: PluginIpcMethods["setMidiLearnMode"]["request"],
	) => void;
	__czSetPendingMidiLearnParam?: (
		key: PluginIpcMethods["setPendingMidiLearnParam"]["request"],
	) => void;
	__czAddMidiBinding?: (
		key: PluginIpcMethods["addMidiBinding"]["request"]["paramKey"],
		channel: PluginIpcMethods["addMidiBinding"]["request"]["channel"],
		cc: PluginIpcMethods["addMidiBinding"]["request"]["cc"],
	) => void;
	__czRemoveMidiBinding?: (
		binding: PluginIpcMethods["removeMidiBinding"]["request"],
	) => void;
	__czClearMidiLearnBindings?: () => void;
	__czGetScopeData?: () => Promise<
		PluginIpcMethods["getScopeData"]["response"]
	>;
};

declare global {
	interface Window extends PluginBridgeWindowFacade {
		__czRuntimeMode?: "auv3-hosted" | "plugin" | "standalone";
		ipc?: { postMessage: (message: string) => void };
		__czOnParams?: (json: string) => void;
		__czOnScope?: (
			samples: Float32Array | number[],
			sampleRate: number,
			hz: number,
		) => void;
		__czOnMidiCc?: (channel: number, cc: number, value: number) => void;
		__czOnMidiCcBatch?: (events: Array<[number, number, number]>) => void;
		__czOnMidiLearnState?: (json: string) => void;
		__czOnParamChanges?: (changes: UiParamChange[]) => void;
		/**
		 * Per-method capability flags set by the installed bridge. Methods whose
		 * capability is `false` are NOT installed on `window`. Absent flags
		 * default to `true` (plugin/standalone supports everything). AUv3 opts
		 * out of unsupported methods (e.g. `getPendingParamChanges`).
		 */
		__czBridgeCapabilities?: PluginBridgeWindowCapabilities;
	}
}

/** Capability flags mirroring `PluginBridgeWindowFacade` method names. */
export type PluginBridgeWindowCapabilities = Partial<
	Record<keyof PluginBridgeWindowFacade, boolean>
>;
