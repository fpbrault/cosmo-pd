import type {
	EditorState,
	MidiLearnBinding,
	PluginIpcMethods,
	PresetSession,
	ScopeDataResponse,
} from "@/lib/synth/bindings/plugin-bridge";

declare global {
	interface Window {
		ipc?: { postMessage: (message: string) => void };
		__czOnParams?: (json: string) => void;
		__czOnScope?: (
			samples: Float32Array | number[],
			sampleRate: number,
			hz: number,
		) => void;
		__czOnMidiCc?: (channel: number, cc: number, value: number) => void;
		__czOnMidiLearnState?: (json: string) => void;

		__czGetParams?: () => Promise<PluginIpcMethods["getParams"]["response"]>;
		__czGetParamsVersion?: () => Promise<
			PluginIpcMethods["getParamsVersion"]["response"]
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
			session: PresetSession,
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
			id: string,
		) => Promise<PluginIpcMethods["loadPreset"]["response"]>;
		__czAddPreset?: (
			payload: PluginIpcMethods["addPreset"]["request"],
		) => Promise<PluginIpcMethods["addPreset"]["response"]>;
		__czSavePreset?: (
			payload: PluginIpcMethods["savePreset"]["request"],
		) => Promise<PluginIpcMethods["savePreset"]["response"]>;
		__czDeletePreset?: (
			id: string,
		) => Promise<PluginIpcMethods["deletePreset"]["response"]>;
		__czRenamePreset?: (
			id: string,
			newName: string,
		) => Promise<PluginIpcMethods["renamePreset"]["response"]>;
		__czToggleStarred?: (
			id: string,
			starred: boolean,
		) => Promise<PluginIpcMethods["toggleStarred"]["response"]>;
		__czSetPresetAuthor?: (
			id: string,
			author: string,
		) => Promise<PluginIpcMethods["setPresetAuthor"]["response"]>;
		__czSetPresetDescription?: (
			id: string,
			description: string,
		) => Promise<PluginIpcMethods["setPresetDescription"]["response"]>;
		__czSetPresetTags?: (
			id: string,
			tags: string[],
		) => Promise<PluginIpcMethods["setPresetTags"]["response"]>;
		__czImportPresetBank?: (
			payload: PluginIpcMethods["importPresetBank"]["request"],
		) => Promise<PluginIpcMethods["importPresetBank"]["response"]>;
		__czExportPreset?: (
			id: string,
		) => Promise<PluginIpcMethods["exportPreset"]["response"]>;
		__czListFxModulePresets?: (
			moduleType: string,
		) => Promise<PluginIpcMethods["listFxModulePresets"]["response"]>;
		__czSaveFxModulePreset?: (
			payload: PluginIpcMethods["saveFxModulePreset"]["request"],
		) => Promise<PluginIpcMethods["saveFxModulePreset"]["response"]>;
		__czDeleteFxModulePreset?: (
			id: string,
		) => Promise<PluginIpcMethods["deleteFxModulePreset"]["response"]>;

		__czSetEditorState?: (state: EditorState) => void;
		__czGetEditorState?: () => Promise<EditorState | null>;
		__czGetMidiLearnState?: () => Promise<
			PluginIpcMethods["getMidiLearnState"]["response"]
		>;
		__czSetMidiLearnMode?: (on: boolean) => void;
		__czSetPendingMidiLearnParam?: (key: string | null) => void;
		__czAddMidiBinding?: (key: string, channel: number, cc: number) => void;
		__czRemoveMidiBinding?: (binding: MidiLearnBinding) => void;
		__czClearMidiLearnBindings?: () => void;
		__czGetVoiceLimit?: () => Promise<
			PluginIpcMethods["getVoiceLimit"]["response"]
		>;
		__czSetVoiceLimit?: (
			limit: PluginIpcMethods["setVoiceLimit"]["request"],
		) => void;
		__czGetScopeData?: () => Promise<ScopeDataResponse>;
	}
}
