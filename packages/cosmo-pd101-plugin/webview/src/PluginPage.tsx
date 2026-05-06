import {
	DEFAULT_SYNTH_PRESETS,
	noteToFreq,
	SynthRenderer,
	useLcdControlReadout,
	useNoteHandling,
	useSynthPresetManager,
	useSynthStore,
	useSynthUiStore,
} from "@cosmo/cosmo-pd101";
import {
	type CSSProperties,
	type ReactNode,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { usePluginParamBridge } from "./hooks/usePluginParamBridge";

const SYNTH_RENDERER_MAX_WIDTH = 1280;
const SYNTH_RENDERER_MAX_HEIGHT = 800;

type PluginPageProps = {
	utilityExtra?: ReactNode;
};

export default function PluginPage({ utilityExtra }: PluginPageProps = {}) {
	const gatherState = useSynthStore((s) => s.gatherState);
	const applyPreset = useSynthStore((s) => s.applyPreset);
	const velocityCurve = useSynthStore((s) => s.velocityCurve);
	const presetStateKey = useSynthStore((s) => JSON.stringify(s.gatherState()));

	const frameRef = useRef<HTMLDivElement | null>(null);
	const [fitScale, setFitScale] = useState(1);
	const [scopeActiveHz, setScopeActiveHz] = useState(220);
	const analyserNodeRef = useRef<AnalyserNode | null>(null);
	const audioCtxRef = useRef<AudioContext | null>(null);
	const activeAsidePanel = useSynthUiStore((s) => s.activeAsidePanel);
	const setActiveAsidePanel = useSynthUiStore((s) => s.setActiveAsidePanel);
	const { lcdControlReadout, pushLcdControlReadout } = useLcdControlReadout();
	const { activeNotes, sendNoteOn, sendNoteOff } = useNoteHandling({
		velocityCurve,
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

	useEffect(() => {
		const element = frameRef.current;
		if (!element) {
			return;
		}

		const updateFrameSize = () => {
			const bounds = element.getBoundingClientRect();
			if (bounds.width <= 0 || bounds.height <= 0) {
				return;
			}

			const nextScale = Math.min(
				bounds.width / SYNTH_RENDERER_MAX_WIDTH,
				bounds.height / SYNTH_RENDERER_MAX_HEIGHT,
			);

			setFitScale((current) => {
				if (Math.abs(current - nextScale) < 0.001) {
					return current;
				}
				return nextScale;
			});
		};

		updateFrameSize();

		const resizeObserver = new ResizeObserver(updateFrameSize);
		resizeObserver.observe(element);

		return () => {
			resizeObserver.disconnect();
		};
	}, []);

	const shouldLoadCurrentState = useCallback(() => !window.ipc, []);

	const {
		allPresetEntries,
		showLibraryPresets,
		activePresetId,
		activePresetName,
		pendingPresetChange,
		handleLoadLocal,
		handleLoadBuiltin,
		handleLoadLibrary,
		handleStepPreset,
		handleToggleLibraryPresets,
		handleSavePreset,
		handleDeletePreset,
		handleRenamePreset,
		handleSetPresetFavorite,
		handleSetPresetCategory,
		handleSetPresetTags,
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
		shouldLoadCurrentState,
		presetStateKey,
	});

	const heldNote =
		activeNotes.length > 0 ? activeNotes[activeNotes.length - 1] : null;
	const currentFreq =
		heldNote != null
			? noteToFreq(heldNote)
			: scopeActiveHz > 0
				? scopeActiveHz
				: 220;
	const lastFreqRef = useRef(currentFreq);
	if (currentFreq > 0) {
		lastFreqRef.current = currentFreq;
	}
	const effectivePitchHz = lastFreqRef.current;

	const lcdPrimaryText = useMemo(() => {
		if (heldNote != null) {
			return `NOTE ${heldNote} ${effectivePitchHz.toFixed(1)}HZ`;
		}
		return `PRESET ${activePresetName.toUpperCase()}`;
	}, [heldNote, effectivePitchHz, activePresetName]);

	const combinedScale = fitScale;
	const scaledWidth = SYNTH_RENDERER_MAX_WIDTH * combinedScale;
	const scaledHeight = SYNTH_RENDERER_MAX_HEIGHT * combinedScale;

	const zoomStyle: CSSProperties = {
		width: SYNTH_RENDERER_MAX_WIDTH,
		height: SYNTH_RENDERER_MAX_HEIGHT,
		zoom: combinedScale,
	};

	return (
		<div
			ref={frameRef}
			className="relative flex h-full w-full items-center justify-center overflow-hidden bg-cz-panel"
		>
			<div
				className="relative shrink-0 overflow-hidden"
				style={{
					width: scaledWidth,
					height: scaledHeight,
				}}
			>
				<div className="absolute left-0 top-0" style={zoomStyle}>
					<SynthRenderer
						headerProps={{
							allEntries: allPresetEntries,
							showLibraryPresets,
							onToggleLibraryPresets: handleToggleLibraryPresets,
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
							onSetPresetFavorite: handleSetPresetFavorite,
							onSetPresetCategory: handleSetPresetCategory,
							onSetPresetTags: handleSetPresetTags,
							onInitPreset: handleInitPreset,
							onExportPreset: handleExportPreset,
							onExportCurrentState: handleExportCurrentState,
							onImportPreset: handleImportPreset,
							onSavePendingPresetChange: handleSavePendingPresetChange,
							onDiscardPendingPresetChange: handleDiscardPendingPresetChange,
							onCancelPendingPresetChange: handleCancelPendingPresetChange,
						}}
						frameClassName="h-full min-h-0 min-w-0 w-full bg-cz-panel flex flex-col overflow-hidden"
						bottomBarExtra={utilityExtra}
						lcdPrimaryText={lcdPrimaryText}
						lcdSecondaryText={""}
						lcdTransientReadout={lcdControlReadout}
						effectivePitchHz={effectivePitchHz}
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
				</div>
			</div>
		</div>
	);
}
