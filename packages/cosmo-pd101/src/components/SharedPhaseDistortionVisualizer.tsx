import {
	type CSSProperties,
	type ReactNode,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
import type { PerformanceMetrics } from "@/components/performance/PerformanceMonitor";
import SynthRenderer from "@/components/renderer/SynthRenderer";
import { useAudioEngine } from "@/features/synth/hooks/useAudioEngine";
import { useNoteHandling } from "@/features/synth/hooks/useNoteHandling";
import { useSynthParamsToWorklet } from "@/features/synth/hooks/useSynthParamsToWorklet";
import { useSynthStore } from "@/features/synth/synthStore";
import type { LibraryPreset } from "@/features/synth/types/libraryPreset";
import { useSynthPresetManager } from "@/features/synth/useSynthPresetManager";
import { decodeCzPatch } from "@/lib/midi/czSysexDecoder";
import { installBenchmarkApi } from "@/lib/performance/benchmarkHarness";
import type { StepEnvData } from "@/lib/synth/bindings/synth";
import { convertDecodedPatchToSynthPreset } from "@/lib/synth/czPresetConverter";
import { DEFAULT_SYNTH_PRESETS } from "@/lib/synth/defaultPresets";
import { noteToFreq } from "@/lib/synth/pdAlgorithms";
import {
	pdVisualizerWorkletUrl,
	synthBindingsUrl,
	synthWasmUrl,
} from "@/lib/synth/pdVisualizerWorkletUrl";

export type SharedPhaseDistortionVisualizerProps = {
	frameStyle?: CSSProperties;
	headerExtra?: ReactNode;
	bottomBarExtra?: ReactNode;
	libraryPresets?: LibraryPreset[];
	onAudioLevelChange?: (level: number) => void;
};

export function SharedPhaseDistortionVisualizer({
	frameStyle,
	headerExtra,
	libraryPresets = [],
	onAudioLevelChange,
}: SharedPhaseDistortionVisualizerProps = {}) {
	const setLine1DcoEnv = useSynthStore((s) => s.setLine1DcoEnv);
	const setLine1DcwEnv = useSynthStore((s) => s.setLine1DcwEnv);
	const setLine1DcaEnv = useSynthStore((s) => s.setLine1DcaEnv);
	const setLine2DcoEnv = useSynthStore((s) => s.setLine2DcoEnv);
	const setLine2DcwEnv = useSynthStore((s) => s.setLine2DcwEnv);
	const setLine2DcaEnv = useSynthStore((s) => s.setLine2DcaEnv);
	const velocityCurve = useSynthStore((s) => s.velocityCurve);
	const gatherState = useSynthStore((s) => s.gatherState);
	const applyPreset = useSynthStore((s) => s.applyPreset);
	const presetStateKey = useSynthStore((s) => JSON.stringify(s.gatherState()));

	const [performanceMonitorEnabled, setPerformanceMonitorEnabled] =
		useState(false);
	const [performanceMetrics, setPerformanceMetrics] =
		useState<PerformanceMetrics | null>(null);
	const performanceMetricsRef = useRef<PerformanceMetrics | null>(null);
	const {
		audioCtxRef,
		analyserNodeRef,
		workletNodeRef,
		paramsRef,
		audioContextState,
		resumeAudio,
	} = useAudioEngine({
		synthWasmUrl,
		synthBindingsUrl,
		pdVisualizerWorkletUrl,
	});

	useEffect(() => {
		performanceMetricsRef.current = performanceMetrics;
	}, [performanceMetrics]);

	useEffect(() => {
		const workletNode = workletNodeRef.current;
		workletNode?.port.postMessage({
			type: "setPerformanceMonitorEnabled",
			enabled: performanceMonitorEnabled,
		});
		if (!performanceMonitorEnabled) {
			setPerformanceMetrics(null);
		}
	}, [performanceMonitorEnabled, workletNodeRef]);

	useEffect(() => {
		if (!performanceMonitorEnabled) {
			return;
		}

		const handleMetrics = (event: Event) => {
			const detail = (event as CustomEvent<PerformanceMetrics | undefined>)
				.detail;
			if (detail) {
				setPerformanceMetrics(detail);
			}
		};

		const requestMetrics = () => {
			workletNodeRef.current?.port.postMessage({
				type: "setPerformanceMonitorEnabled",
				enabled: true,
			});
			workletNodeRef.current?.port.postMessage({
				type: "getPerformanceMetrics",
			});
		};

		window.addEventListener("cz-performance-metrics", handleMetrics);
		requestMetrics();
		const intervalId = window.setInterval(requestMetrics, 250);

		return () => {
			window.removeEventListener("cz-performance-metrics", handleMetrics);
			window.clearInterval(intervalId);
		};
	}, [performanceMonitorEnabled, workletNodeRef]);

	const { activeNotes, sendNoteOn, sendNoteOff, panic } = useNoteHandling({
		workletNodeRef,
		velocityCurve,
	});

	useEffect(() => {
		if (!onAudioLevelChange) {
			return;
		}

		let rafId = 0;
		let smoothLevel = 0;
		let lastSampleTime = 0;
		let lastPublishedLevel = -1;
		let sampleBuffer = new Float32Array(2048);

		const updateAudioLevel = (now: number) => {
			const analyserNode = analyserNodeRef.current;
			if (now - lastSampleTime < 40) {
				rafId = window.requestAnimationFrame(updateAudioLevel);
				return;
			}
			lastSampleTime = now;

			if (!analyserNode) {
				smoothLevel *= 0.9;
				if (
					lastPublishedLevel < 0 ||
					Math.abs(lastPublishedLevel - smoothLevel) > 0.01
				) {
					onAudioLevelChange(smoothLevel);
					lastPublishedLevel = smoothLevel;
				}
				rafId = window.requestAnimationFrame(updateAudioLevel);
				return;
			}

			if (sampleBuffer.length !== analyserNode.fftSize) {
				sampleBuffer = new Float32Array(analyserNode.fftSize);
			}
			analyserNode.getFloatTimeDomainData(sampleBuffer);

			let sumSquares = 0;
			for (const sample of sampleBuffer) {
				sumSquares += sample * sample;
			}

			const rms = Math.sqrt(sumSquares / sampleBuffer.length);
			const normalized = Math.min(1, rms * 7.5);
			smoothLevel = smoothLevel * 0.82 + normalized * 0.18;

			if (
				lastPublishedLevel < 0 ||
				Math.abs(lastPublishedLevel - smoothLevel) > 0.01
			) {
				onAudioLevelChange(smoothLevel);
				lastPublishedLevel = smoothLevel;
			}

			rafId = window.requestAnimationFrame(updateAudioLevel);
		};

		rafId = window.requestAnimationFrame(updateAudioLevel);

		return () => {
			window.cancelAnimationFrame(rafId);
		};
	}, [analyserNodeRef, onAudioLevelChange]);

	const heldNote =
		activeNotes.length > 0 ? activeNotes[activeNotes.length - 1] : null;
	const currentFreq = heldNote != null ? noteToFreq(heldNote) : 220;

	useSynthParamsToWorklet({
		workletNodeRef,
		paramsRef,
		effectivePitchHz: currentFreq,
		gatherState,
	});

	const handleLoadLibraryPreset = useCallback(
		(preset: LibraryPreset) => {
			if (preset.sysexData) {
				const decoded = decodeCzPatch(preset.sysexData);
				if (decoded) {
					const synthPreset = convertDecodedPatchToSynthPreset(decoded);
					applyPreset(synthPreset);
				}
			}
		},
		[applyPreset],
	);

	const {
		visiblePresetEntries,
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
		onBeforeApplyPreset: panic,
		libraryPresets,
		onLoadLibraryPreset: handleLoadLibraryPreset,
		presetStateKey,
	});

	useEffect(() => {
		return installBenchmarkApi({
			mode: "web",
			listBuiltinPresets: () => Object.keys(DEFAULT_SYNTH_PRESETS),
			loadBuiltinPreset: (name: string) => {
				handleLoadBuiltin(name);
			},
			setPerformanceMonitorEnabled: (enabled: boolean) => {
				setPerformanceMonitorEnabled(enabled);
				if (enabled) {
					workletNodeRef.current?.port.postMessage({
						type: "setPerformanceMonitorEnabled",
						enabled: true,
					});
				}
			},
			getPerformanceMetrics: () => performanceMetricsRef.current,
			noteOn: (note: number, velocity?: number) => sendNoteOn(note, velocity),
			noteOff: (note: number) => sendNoteOff(note),
			panic,
			ensureReady: async () => {
				resumeAudio();
				const deadline = performance.now() + 5000;
				while (
					performance.now() < deadline &&
					audioCtxRef.current?.state !== "running"
				) {
					await new Promise((resolve) => window.setTimeout(resolve, 50));
				}
				if (audioCtxRef.current?.state !== "running") {
					throw new Error("Audio context failed to enter running state");
				}
			},
		});
	}, [
		audioCtxRef,
		handleLoadBuiltin,
		panic,
		resumeAudio,
		sendNoteOff,
		sendNoteOn,
		workletNodeRef,
	]);

	const lastHeldFreqRef = useRef(currentFreq);
	lastHeldFreqRef.current = currentFreq;
	const effectivePitchHz = lastHeldFreqRef.current;

	const handleLine1DcoEnvChange = useCallback(
		(next: StepEnvData) => {
			setLine1DcoEnv(next);
		},
		[setLine1DcoEnv],
	);

	const handleLine1DcwEnvChange = useCallback(
		(next: StepEnvData) => {
			setLine1DcwEnv(next);
		},
		[setLine1DcwEnv],
	);

	const handleLine1DcaEnvChange = useCallback(
		(next: StepEnvData) => {
			setLine1DcaEnv(next);
		},
		[setLine1DcaEnv],
	);

	const handleLine2DcoEnvChange = useCallback(
		(next: StepEnvData) => {
			setLine2DcoEnv(next);
		},
		[setLine2DcoEnv],
	);

	const handleLine2DcwEnvChange = useCallback(
		(next: StepEnvData) => {
			setLine2DcwEnv(next);
		},
		[setLine2DcwEnv],
	);

	const handleLine2DcaEnvChange = useCallback(
		(next: StepEnvData) => {
			setLine2DcaEnv(next);
		},
		[setLine2DcaEnv],
	);

	return (
		<SynthRenderer
			headerProps={{
				allEntries: visiblePresetEntries,
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
			frameClassName="h-full min-h-0 min-w-0 bg-cz-panel flex flex-col overflow-hidden w-full"
			frameStyle={frameStyle}
			headerExtra={headerExtra}
			effectivePitchHz={effectivePitchHz}
			analyserNodeRef={analyserNodeRef}
			audioCtxRef={audioCtxRef}
			envOverrideHandlers={{
				onLine1DcoEnvChange: handleLine1DcoEnvChange,
				onLine1DcwEnvChange: handleLine1DcwEnvChange,
				onLine1DcaEnvChange: handleLine1DcaEnvChange,
				onLine2DcoEnvChange: handleLine2DcoEnvChange,
				onLine2DcwEnvChange: handleLine2DcwEnvChange,
				onLine2DcaEnvChange: handleLine2DcaEnvChange,
			}}
			miniKeyboard={{
				activeNotes,
				onNoteOn: sendNoteOn,
				onNoteOff: sendNoteOff,
			}}
			audioGate={{
				ready: audioContextState === "running",
				onResume: resumeAudio,
			}}
		/>
	);
}
