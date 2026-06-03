export { default as UpdateNotification } from "./components/layout/UpdateNotification";
export { default as MidiLearnPanel } from "./components/panels/midi/MidiLearnPanel";
export {
	type PerformanceMetrics,
	PerformanceMonitor,
} from "./components/performance/PerformanceMonitor";
export {
	computeRendererFrameLayout,
	computeSidebarMinWidthRem,
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
export { usePluginBridgeSynthEngine } from "./features/synth/engine/pluginBridgeSynthEngineAdapter";
export { useAudioEngine } from "./features/synth/hooks/useAudioEngine";
export { useMidiLearnBindings } from "./features/synth/hooks/useMidiLearnBindings";
export { useNoteHandling } from "./features/synth/hooks/useNoteHandling";
export { useSynthParamsToWorklet } from "./features/synth/hooks/useSynthParamsToWorklet";
export type { MidiBinding } from "./features/synth/midiLearnStore";
export { useMidiLearnStore } from "./features/synth/midiLearnStore";
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
	BenchmarkApi,
	BenchmarkCaseResult,
	BenchmarkMode,
	BenchmarkReport,
	BenchmarkScenarioDefinition,
} from "./lib/performance/benchmarkHarness";
export { installBenchmarkApi } from "./lib/performance/benchmarkHarness";
export type {
	AlgoControlValueV1,
	FxSlotConfig,
	FxSlotType,
	ModMatrix,
	StepEnvData,
} from "./lib/synth/bindings/synth";
export {
	cosmoWorkletUrl,
	synthBindingsUrl,
	synthWasmUrl,
} from "./lib/synth/cosmoWorkletUrl";
export { convertDecodedPatchToSynthPreset } from "./lib/synth/czPresetConverter";
export { DEFAULT_SYNTH_PRESETS } from "./lib/synth/defaultPresets";
export { FACTORY_PRESETS } from "./lib/synth/factoryCzPresets";
export { noteToFreq } from "./lib/synth/pdAlgorithms";
export type {
	EnginePresetV1,
	FrontendPresetV1,
	PresetMetadata,
} from "./lib/synth/presetTypes";
export type { ReleaseInfo } from "./lib/update/checkRelease";
export { checkLatestRelease } from "./lib/update/checkRelease";
