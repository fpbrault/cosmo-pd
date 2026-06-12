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
		__czGetParams?: () => Promise<unknown>;
		__czGetParamsVersion?: () => Promise<unknown>;
		__czSetParams?: (json: string) => void;

		// Transport
		__czGetTransportInfo?: () => Promise<TransportInfoResponse>;

		// Preset session
		__czGetPresetSession?: () => Promise<unknown>;
		__czSetPresetSession?: (session: PresetSession) => Promise<unknown>;

		// Preset library
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
			description?: string;
			tags?: string[];
			data?: unknown;
		}) => Promise<unknown>;
		__czDeletePreset?: (id: string) => Promise<unknown>;
		__czRenamePreset?: (id: string, newName: string) => Promise<unknown>;
		__czSetPresetAuthor?: (id: string, author: string) => Promise<unknown>;
		__czSetPresetDescription?: (
			id: string,
			description: string,
		) => Promise<unknown>;
		__czSetPresetTags?: (id: string, tags: string[]) => Promise<unknown>;
		__czToggleStarred?: (id: string, starred: boolean) => Promise<unknown>;
		__czExportPreset?: (id: string) => Promise<unknown>;
		__czImportPresetBank?: (payload: unknown) => Promise<unknown>;
		__czListFxModulePresets?: (moduleType: string) => Promise<unknown>;
		__czSaveFxModulePreset?: (payload: {
			name: string;
			moduleType: string;
			patch: Record<string, unknown>;
		}) => Promise<unknown>;
		__czDeleteFxModulePreset?: (id: string) => Promise<unknown>;

		// Editor
		__czSetEditorState?: (state: EditorState) => void;
		__czGetEditorState?: () => Promise<EditorState | null>;

		// MIDI Learn
		__czGetMidiLearnState?: () => Promise<unknown>;
		__czSetMidiLearnMode?: (on: boolean) => void;
		__czSetPendingMidiLearnParam?: (key: string | null) => void;
		__czAddMidiBinding?: (key: string, ch: number, cc: number) => void;
		__czRemoveMidiBinding?: (binding: MidiLearnBinding) => void;
		__czClearMidiLearnBindings?: () => void;

		// VST3/CLAP-specific
		__czSetPresetName?: (name: string) => void;
		__czGetPresetName?: () => Promise<unknown>;
		__czRetryPresetLibrary?: () => Promise<unknown>;
		__czRepairPresetLibrary?: () => Promise<unknown>;
		__czRebuildPresetLibrary?: () => Promise<unknown>;
	}
}

/**
 * Typed invoke wrapper factory — constrains method name to PluginIpcMethods keys
 * and returns the correct response type without changing the wire format.
 */
export function createTypedInvoke(
	invoke: (method: string, ...args: unknown[]) => Promise<unknown>,
) {
	return <T extends keyof PluginIpcMethods>(
		method: T,
		...args: unknown[]
	): Promise<PluginIpcMethods[T]["response"]> => {
		return invoke(method as string, ...args) as Promise<
			PluginIpcMethods[T]["response"]
		>;
	};
}
