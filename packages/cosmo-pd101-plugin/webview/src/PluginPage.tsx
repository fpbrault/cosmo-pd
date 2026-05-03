import {
	DEFAULT_SYNTH_PRESETS,
	SynthRenderer,
	useLcdControlReadout,
	useNoteHandling,
	useSynthPresetManager,
	useSynthStore,
	useSynthUiStore,
} from "@cosmo/cosmo-pd101";
import {
	type ReactNode,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { usePluginParamBridge } from "./hooks/usePluginParamBridge";

type PluginPageProps = {
	utilityExtra?: ReactNode;
};

export default function PluginPage({ utilityExtra }: PluginPageProps = {}) {
	const gatherState = useSynthStore((s) => s.gatherState);
	const applyPreset = useSynthStore((s) => s.applyPreset);
	const velocityCurve = useSynthStore((s) => s.velocityCurve);
	const presetStateKey = useSynthStore((s) => JSON.stringify(s.gatherState()));
	const [scopeActiveHz, setScopeActiveHz] = useState(220);
	const analyserNodeRef = useRef<AnalyserNode | null>(null);
	const audioCtxRef = useRef<AudioContext | null>(null);
	const activeAsidePanel = useSynthUiStore((s) => s.activeAsidePanel);
	const setActiveAsidePanel = useSynthUiStore((s) => s.setActiveAsidePanel);
	const { lcdControlReadout, pushLcdControlReadout } = useLcdControlReadout();
	const { activeNotes, sendNoteOn, sendNoteOff, panic } = useNoteHandling({
		velocityCurve,
		eventSink: (type, payload) => {
			window.__BEAMER__?.emit?.(type, payload);
		},
	});

	usePluginParamBridge();

	const subscribeScopeFrames = useCallback(
		(
			onFrame: (frame: {
				samples: Float32Array;
				sampleRate: number;
				hz: number;
			}) => void,
		) => {
			window.__czOnScope = (
				samples: number[],
				sampleRate: number,
				hz: number,
			) => {
				onFrame({
					samples: new Float32Array(samples),
					sampleRate,
					hz,
				});
				setScopeActiveHz(Math.round(hz * 10) / 10);
			};

			return () => {
				window.__czOnScope = undefined;
			};
		},
		[],
	);

	const {
		allPresetEntries,
		activePresetId,
		activePresetNameBase,
		activePresetName,
		loadedPresetFingerprint,
		pendingPresetChange,
		handleLoadLocal,
		handleLoadBuiltin,
		handleLoadLibrary,
		handleStepPreset,
		handleSavePreset,
		handleDeletePreset,
		handleRenamePreset,
		handleInitPreset,
		handleExportPreset,
		handleImportPreset,
		handleExportCurrentState,
		handleSavePendingPresetChange,
		handleDiscardPendingPresetChange,
		handleCancelPendingPresetChange,
	} = useSynthPresetManager({
		builtinPresets: DEFAULT_SYNTH_PRESETS,
		gatherState,
		applyPreset,
		onBeforeApplyPreset: panic,
		shouldLoadCurrentState: () => true,
		presetStateKey,
	});

	// Sync preset session to plugin host whenever it changes
	useEffect(() => {
		if (window.ipc) {
			window.ipc.postMessage(
				JSON.stringify({
					preset_session: {
						activePresetId,
						activePresetNameBase,
						loadedPresetFingerprint,
					},
				}),
			);
		}
	}, [activePresetId, activePresetNameBase, loadedPresetFingerprint]);

	const lcdPrimaryText = useMemo(
		() => `PRESET ${activePresetName.toUpperCase()}`,
		[activePresetName],
	);

	return (
		<SynthRenderer
			headerProps={{
				allEntries: allPresetEntries,
				activeEntryId: activePresetId,
				activePresetName,
				pendingPresetChange,
				onLoadLocal: handleLoadLocal,
				onLoadLibrary: handleLoadLibrary,
				onLoadBuiltin: handleLoadBuiltin,
				onStepPreset: handleStepPreset,
				onSavePreset: handleSavePreset,
				onDeletePreset: handleDeletePreset,
				onRenamePreset: handleRenamePreset,
				onInitPreset: handleInitPreset,
				onExportPreset: handleExportPreset,
				onExportCurrentState: handleExportCurrentState,
				onImportPreset: handleImportPreset,
				onSavePendingPresetChange: handleSavePendingPresetChange,
				onDiscardPendingPresetChange: handleDiscardPendingPresetChange,
				onCancelPendingPresetChange: handleCancelPendingPresetChange,
			}}
			frameClassName="h-full bg-cz-panel flex flex-col overflow-hidden w-full"
			bottomBarExtra={utilityExtra}
			lcdPrimaryText={lcdPrimaryText}
			lcdSecondaryText={""}
			lcdTransientReadout={lcdControlReadout}
			effectivePitchHz={scopeActiveHz}
			analyserNodeRef={analyserNodeRef}
			audioCtxRef={audioCtxRef}
			subscribeScopeFrames={subscribeScopeFrames}
			activeAsidePanel={activeAsidePanel}
			onAsidePanelChange={setActiveAsidePanel}
			onControlReadout={pushLcdControlReadout}
			miniKeyboard={{
				activeNotes,
				onNoteOn: sendNoteOn,
				onNoteOff: sendNoteOff,
			}}
		/>
	);
}
