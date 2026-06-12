export { default as MidiLearnPanel } from "./components/panels/midi/MidiLearnPanel";
export {
	computeRendererFrameLayout,
	type RendererFrameLayout,
	SYNTH_RENDERER_DESIGN_HEIGHT,
	SYNTH_RENDERER_DESIGN_WIDTH,
	SYNTH_RENDERER_MAX_ASPECT_RATIO,
	SYNTH_RENDERER_MIN_ASPECT_RATIO,
} from "./components/renderer/rendererFrameLayout";
export {
	default as SynthRenderer,
	SharedPhaseDistortionVisualizer,
	type SynthRendererProps,
	type SynthRendererProps as SharedPhaseDistortionVisualizerProps,
} from "./components/renderer/SynthRenderer";
export {
	PresetManagerProvider,
	usePresetManager,
} from "./context/PresetManagerContext";
export { createWebPresetManagerRepository } from "./features/synth/createWebPresetManagerRepository";
export {
	type PluginPresetSession,
	usePluginBridgeSynthEngine,
} from "./features/synth/engine/pluginBridgeSynthEngineAdapter";
export { useAudioEngine } from "./features/synth/hooks/useAudioEngine";
export { useMidiLearnBindings } from "./features/synth/hooks/useMidiLearnBindings";
export { useNoteHandling } from "./features/synth/hooks/useNoteHandling";
export { useSynthParamsToWorklet } from "./features/synth/hooks/useSynthParamsToWorklet";
export type { MidiBinding } from "./features/synth/midiLearnStore";
export {
	refreshMidiLearnState,
	subscribeMidiLearnState,
	useMidiLearnStore,
} from "./features/synth/midiLearnStore";
export type {
	ExportedPresetFile,
	PresetActivationResult,
	PresetLibrarySnapshot,
	PresetLibraryStatus,
	PresetManagerRepository,
	PresetManagerSession,
	PresetStateSync,
	SavePresetRequest,
} from "./features/synth/presetManagerRepository";
export type {
	SynthRuntime,
	SynthScopeFrameSubscription,
} from "./features/synth/runtime/synthRuntime";
export type { SynthParamKey } from "./features/synth/SynthParamController";
export { SYNTH_PARAM_SETTERS } from "./features/synth/SynthParamController";
export { useSynthStore } from "./features/synth/synthStore";
export type {
	EnvTab,
	MainPanelMode,
	PhaseLinePanelTab,
	SynthUiStore,
} from "./features/synth/synthUiStore";
export {
	SYNTH_UI_STATE_STORAGE_KEY,
	useSynthUiStore,
} from "./features/synth/synthUiStore";
export type { LibraryPreset } from "./features/synth/types/libraryPreset";
export type { PresetEntry } from "./features/synth/types/presetEntry";
export type {
	PresetEntryId,
	PresetManagerController,
	PresetRef,
} from "./features/synth/useSynthPresetManager";
export { useSynthPresetManager } from "./features/synth/useSynthPresetManager";
export { i18n, initI18n } from "./i18n";
export type {
	DecodedPatch,
	EnvelopeStep,
	ModulationType,
	WaveformConfig,
	WaveformId,
} from "./lib/midi/czSysexDecoder";
export { decodeCzPatch, WF_NAMES } from "./lib/midi/czSysexDecoder";
export type {
	SessionEditorState,
	SessionState,
} from "./lib/sessionState";
export type {
	EditorState,
	LoadPresetPayload,
	MidiLearnBinding,
	MidiLearnState,
	PluginIpcMethods,
	PluginIpcRequest,
	PresetSession,
	ScopeDataResponse,
	SynthParams,
	TransportInfoResponse,
} from "./lib/synth/bindings/plugin-bridge";
export type {
	AlgoControlValueV1,
	FxSlotConfig,
	FxSlotType,
	ModMatrix,
	StepEnvData,
	SynthPresetV1,
} from "./lib/synth/bindings/synth";
export {
	cosmoWorkletUrl,
	synthBindingsUrl,
	synthWasmUrl,
} from "./lib/synth/cosmoWorkletUrl";
export { convertDecodedPatchToSynthPreset } from "./lib/synth/czPresetConverter";
export { FACTORY_PRESETS } from "./lib/synth/factoryCzPresets";
export type { PresetSource } from "./lib/synth/presetSources";
export type { PresetTagOptions } from "./lib/synth/presetTags";
export type {
	EnginePresetV1,
	FrontendPresetV1,
	PresetMetadata,
} from "./lib/synth/presetTypes";
export { noteToFreq } from "./lib/synth/waveformPreview";
