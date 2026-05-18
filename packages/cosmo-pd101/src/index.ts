export type { AsidePanelTab } from "./components/layout/AsidePanelSwitcher";
export { WavetableWaterfall } from "./components/panels/analysis/scope-visualizations/WavetableWaterfall";
export { default as MacroKnobsPanel } from "./components/panels/macro/MacroKnobsPanel";
export {
	type PerformanceMetrics,
	PerformanceMonitor,
} from "./components/performance/PerformanceMonitor";
export { default as SynthRenderer } from "./components/renderer/SynthRenderer";
export type { SharedPhaseDistortionVisualizerProps } from "./components/SharedPhaseDistortionVisualizer";
export { SharedPhaseDistortionVisualizer } from "./components/SharedPhaseDistortionVisualizer";
export { usePluginBridgeSynthEngine } from "./features/synth/engine/pluginBridgeSynthEngineAdapter";
export { useAudioEngine } from "./features/synth/hooks/useAudioEngine";
export {
	EMPTY_HOST_TRANSPORT,
	type HostTransportInfo,
	useHostTransport,
} from "./features/synth/hooks/useHostTransport";
export { useNoteHandling } from "./features/synth/hooks/useNoteHandling";
export { useSynthParamsToWorklet } from "./features/synth/hooks/useSynthParamsToWorklet";
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
export { convertDecodedPatchToSynthPreset } from "./lib/synth/czPresetConverter";
export { DEFAULT_SYNTH_PRESETS } from "./lib/synth/defaultPresets";
export { noteToFreq } from "./lib/synth/pdAlgorithms";
export {
	pdVisualizerWorkletUrl,
	synthBindingsUrl,
	synthWasmUrl,
} from "./lib/synth/pdVisualizerWorkletUrl";
export type {
	EnginePresetV1,
	FrontendPresetV1,
	PresetMetadata,
} from "./lib/synth/presetTypes";
