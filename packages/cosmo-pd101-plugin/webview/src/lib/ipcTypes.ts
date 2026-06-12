import type {
	PresetSession as BridgePresetSession,
	EditorState,
	MidiLearnBinding,
	PluginIpcMethods,
	TransportInfoResponse,
} from "@cosmo/cosmo-pd101";

/** RPC response envelope shared by all native bridges. */
export type IpcRpcResponse = {
	id: number;
	result?: unknown;
	error?: string;
};

/**
 * Webview-internal preset session — wraps the canonical bridge type.
 * `activePresetId` is managed locally in the webview, not persisted on the native side.
 */
export type PresetSession = BridgePresetSession & {
	activePresetId: string | null;
};

/** All Window IPC methods declared in one place. Each bridge installs its own subset. */
declare global {
	interface Window {
		ipc?: { postMessage: (msg: string) => void };
		__czOnParams?: (json: string) => void;
		__czIpcResponse?: (response: IpcRpcResponse) => void;
		__czOnScope?: (
			samples: Float32Array | number[],
			sampleRate: number,
			hz: number,
		) => void;
		__czOnMidiCc?: (channel: number, cc: number, value: number) => void;
		__czOnMidiLearnState?: (json: string) => void;

		// Synth params
		__czGetParams?: () => Promise<PluginIpcMethods["getParams"]["response"]>;
		__czGetParamsVersion?: () => Promise<
			PluginIpcMethods["getParamsVersion"]["response"]
		>;
		__czSetParams?: (params: PluginIpcMethods["setParams"]["request"]) => void;

		// Transport
		__czGetTransportInfo?: () => Promise<TransportInfoResponse>;

		// Preset session
		__czGetPresetSession?: () => Promise<
			PluginIpcMethods["getPresetSession"]["response"]
		>;
		__czSetPresetSession?: (
			session: PresetSession,
		) => Promise<PluginIpcMethods["setPresetSession"]["response"]>;

		// Preset library
		__czGetPresetLibrary?: (
			source?: string,
		) => Promise<PluginIpcMethods["getPresetLibrary"]["response"]>;
		__czLoadPresetData?: (
			id: string,
		) => Promise<PluginIpcMethods["loadPresetData"]["response"]>;
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
		__czToggleStarred?: (
			id: string,
			starred: boolean,
		) => Promise<PluginIpcMethods["toggleStarred"]["response"]>;
		__czExportPreset?: (
			id: string,
		) => Promise<PluginIpcMethods["exportPreset"]["response"]>;
		__czImportPresetBank?: (
			payload: PluginIpcMethods["importPresetBank"]["request"],
		) => Promise<PluginIpcMethods["importPresetBank"]["response"]>;
		__czListFxModulePresets?: (
			moduleType: string,
		) => Promise<PluginIpcMethods["listFxModulePresets"]["response"]>;
		__czSaveFxModulePreset?: (
			payload: PluginIpcMethods["saveFxModulePreset"]["request"],
		) => Promise<PluginIpcMethods["saveFxModulePreset"]["response"]>;
		__czDeleteFxModulePreset?: (
			id: string,
		) => Promise<PluginIpcMethods["deleteFxModulePreset"]["response"]>;

		// Editor
		__czSetEditorState?: (state: EditorState) => void;
		__czGetEditorState?: () => Promise<EditorState | null>;

		// MIDI Learn
		__czGetMidiLearnState?: () => Promise<
			PluginIpcMethods["getMidiLearnState"]["response"]
		>;
		__czSetMidiLearnMode?: (on: boolean) => void;
		__czSetPendingMidiLearnParam?: (key: string | null) => void;
		__czAddMidiBinding?: (key: string, ch: number, cc: number) => void;
		__czRemoveMidiBinding?: (binding: MidiLearnBinding) => void;
		__czClearMidiLearnBindings?: () => void;

		// VST3/CLAP-specific
		__czSetPresetName?: (name: string) => void;
		__czGetPresetName?: () => Promise<
			PluginIpcMethods["getPresetName"]["response"]
		>;
		__czRetryPresetLibrary?: () => Promise<
			PluginIpcMethods["retryPresetLibrary"]["response"]
		>;
		__czRepairPresetLibrary?: () => Promise<
			PluginIpcMethods["repairPresetLibrary"]["response"]
		>;
		__czRebuildPresetLibrary?: () => Promise<
			PluginIpcMethods["rebuildPresetLibrary"]["response"]
		>;
	}
}

/** Typed invoke wrapper factory — enforces request payload type per method. */
export function createTypedInvoke(
	invoke: (method: string, payload?: unknown) => Promise<unknown>,
) {
	return <T extends keyof PluginIpcMethods>(
		method: T,
		payload?: PluginIpcMethods[T]["request"],
	): Promise<PluginIpcMethods[T]["response"]> => {
		return invoke(method as string, payload) as Promise<
			PluginIpcMethods[T]["response"]
		>;
	};
}
