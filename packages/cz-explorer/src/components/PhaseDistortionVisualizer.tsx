import {
	convertDecodedPatchToSynthPreset,
	DEFAULT_SYNTH_PRESETS,
	decodeCzPatch,
	type LibraryPreset,
	noteToFreq,
	pdVisualizerWorkletUrl,
	type StepEnvData,
	SYNTH_UI_STATE_STORAGE_KEY,
	SynthRenderer,
	synthBindingsUrl,
	synthWasmUrl,
	useAudioEngine,
	useLcdControlReadout,
	useNoteHandling,
	useSynthParamsToWorklet,
	useSynthPresetManager,
	useSynthStore,
	useSynthUiStore,
} from "@cosmo/cosmo-pd101";
import { useQuery } from "@tanstack/react-query";
import {
	motion,
	useMotionTemplate,
	useMotionValue,
	useSpring,
	useTransform,
} from "motion/react";
import {
	type CSSProperties,
	type ReactNode,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { useTranslation } from "react-i18next";
import { fetchPresetData, type Preset } from "@/lib/presets/presetManager";

type PhaseDistortionVisualizerProps = {
	frameStyle?: CSSProperties;
	headerExtra?: ReactNode;
};

type PhaseDistortionVisualizerBaseProps = PhaseDistortionVisualizerProps & {
	libraryPresets?: Preset[];
	onAudioLevelChange?: (level: number) => void;
};

const SYNTH_RENDERER_MAX_WIDTH = 1280;
const SYNTH_RENDERER_MAX_HEIGHT = 800;

export function SharedPhaseDistortionVisualizer({
	frameStyle,
	headerExtra,
	libraryPresets = [],
	onAudioLevelChange,
}: PhaseDistortionVisualizerBaseProps = {}) {
	const { t } = useTranslation("synth");
	const line1DcoEnv = useSynthStore((s) => s.line1DcoEnv);
	const setLine1DcoEnv = useSynthStore((s) => s.setLine1DcoEnv);
	const line1DcwEnv = useSynthStore((s) => s.line1DcwEnv);
	const setLine1DcwEnv = useSynthStore((s) => s.setLine1DcwEnv);
	const line1DcaEnv = useSynthStore((s) => s.line1DcaEnv);
	const setLine1DcaEnv = useSynthStore((s) => s.setLine1DcaEnv);
	const line2DcoEnv = useSynthStore((s) => s.line2DcoEnv);
	const setLine2DcoEnv = useSynthStore((s) => s.setLine2DcoEnv);
	const line2DcwEnv = useSynthStore((s) => s.line2DcwEnv);
	const setLine2DcwEnv = useSynthStore((s) => s.setLine2DcwEnv);
	const line2DcaEnv = useSynthStore((s) => s.line2DcaEnv);
	const setLine2DcaEnv = useSynthStore((s) => s.setLine2DcaEnv);
	const velocityCurve = useSynthStore((s) => s.velocityCurve);
	const gatherState = useSynthStore((s) => s.gatherState);
	const applyPreset = useSynthStore((s) => s.applyPreset);
	const presetStateKey = useSynthStore((s) => JSON.stringify(s.gatherState()));

	const [extPmAmount] = useState(0);
	const activeAsidePanel = useSynthUiStore((s) => s.activeAsidePanel);
	const setActiveAsidePanel = useSynthUiStore((s) => s.setActiveAsidePanel);

	useEffect(() => {
		try {
			if (localStorage.getItem(SYNTH_UI_STATE_STORAGE_KEY) !== null) {
				return;
			}
		} catch {
			return;
		}

		setActiveAsidePanel("scope");
	}, [setActiveAsidePanel]);

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

	const { activeNotes, sendNoteOn, sendNoteOff } = useNoteHandling({
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

	const { lcdControlReadout, pushLcdControlReadout, formatEnvReadout } =
		useLcdControlReadout();

	const heldNote =
		activeNotes.length > 0 ? activeNotes[activeNotes.length - 1] : null;
	const currentFreq = heldNote != null ? noteToFreq(heldNote) : 220;

	useSynthParamsToWorklet({
		workletNodeRef,
		paramsRef,
		effectivePitchHz: currentFreq,
		extPmAmount,
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
		allPresetEntries,
		activePresetId,
		activePresetName,
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
		libraryPresets,
		onLoadLibraryPreset: handleLoadLibraryPreset,
		presetStateKey,
	});

	const lastHeldFreqRef = useRef(currentFreq);
	lastHeldFreqRef.current = currentFreq;
	const effectivePitchHz = lastHeldFreqRef.current;

	const handleLine1DcoEnvChange = useCallback(
		(next: StepEnvData) => {
			setLine1DcoEnv(next);
			pushLcdControlReadout("line1DcoEnv", formatEnvReadout(line1DcoEnv, next));
		},
		[formatEnvReadout, line1DcoEnv, pushLcdControlReadout, setLine1DcoEnv],
	);

	const handleLine1DcwEnvChange = useCallback(
		(next: StepEnvData) => {
			setLine1DcwEnv(next);
			pushLcdControlReadout("line1DcwEnv", formatEnvReadout(line1DcwEnv, next));
		},
		[formatEnvReadout, line1DcwEnv, pushLcdControlReadout, setLine1DcwEnv],
	);

	const handleLine1DcaEnvChange = useCallback(
		(next: StepEnvData) => {
			setLine1DcaEnv(next);
			pushLcdControlReadout("line1DcaEnv", formatEnvReadout(line1DcaEnv, next));
		},
		[formatEnvReadout, line1DcaEnv, pushLcdControlReadout, setLine1DcaEnv],
	);

	const handleLine2DcoEnvChange = useCallback(
		(next: StepEnvData) => {
			setLine2DcoEnv(next);
			pushLcdControlReadout("line2DcoEnv", formatEnvReadout(line2DcoEnv, next));
		},
		[formatEnvReadout, line2DcoEnv, pushLcdControlReadout, setLine2DcoEnv],
	);

	const handleLine2DcwEnvChange = useCallback(
		(next: StepEnvData) => {
			setLine2DcwEnv(next);
			pushLcdControlReadout("line2DcwEnv", formatEnvReadout(line2DcwEnv, next));
		},
		[formatEnvReadout, line2DcwEnv, pushLcdControlReadout, setLine2DcwEnv],
	);

	const handleLine2DcaEnvChange = useCallback(
		(next: StepEnvData) => {
			setLine2DcaEnv(next);
			pushLcdControlReadout("line2DcaEnv", formatEnvReadout(line2DcaEnv, next));
		},
		[formatEnvReadout, line2DcaEnv, pushLcdControlReadout, setLine2DcaEnv],
	);

	const lcdPrimaryText = useMemo(() => {
		if (heldNote != null) {
			return t("display.noteWithFreq", {
				note: heldNote,
				freq: effectivePitchHz.toFixed(1),
				defaultValue: `NOTE ${heldNote} ${effectivePitchHz.toFixed(1)}HZ`,
			});
		}
		return t("display.preset", {
			preset: activePresetName.toUpperCase(),
			defaultValue: `PRESET ${activePresetName.toUpperCase()}`,
		});
	}, [heldNote, effectivePitchHz, activePresetName, t]);

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
			frameClassName="h-full min-h-0 min-w-0 bg-cz-panel flex flex-col overflow-hidden w-full"
			frameStyle={frameStyle}
			headerExtra={headerExtra}
			lcdPrimaryText={lcdPrimaryText}
			lcdSecondaryText={""}
			lcdTransientReadout={lcdControlReadout}
			effectivePitchHz={effectivePitchHz}
			analyserNodeRef={analyserNodeRef}
			audioCtxRef={audioCtxRef}
			activeAsidePanel={activeAsidePanel}
			onAsidePanelChange={setActiveAsidePanel}
			onControlReadout={pushLcdControlReadout}
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

export default function PhaseDistortionVisualizer(
	props: PhaseDistortionVisualizerProps = {},
) {
	const frameRef = useRef<HTMLDivElement | null>(null);
	const [frameScale, setFrameScale] = useState(1);
	const mainPanelMode = useSynthUiStore((s) => s.mainPanelMode);
	const libraryModeOpen = useSynthUiStore((s) => s.libraryModeOpen);
	const isOverlayOpen = libraryModeOpen || mainPanelMode !== "phase";
	const cursorTargetX = useMotionValue(50);
	const cursorTargetY = useMotionValue(50);
	const cursorX = useSpring(cursorTargetX, {
		stiffness: 74,
		damping: 24,
		mass: 0.7,
	});
	const cursorY = useSpring(cursorTargetY, {
		stiffness: 74,
		damping: 24,
		mass: 0.7,
	});
	const audioTarget = useMotionValue(0);
	const audioLevel = useSpring(audioTarget, {
		stiffness: 85,
		damping: 24,
		mass: 0.6,
	});
	const cursorXPercent = useTransform(cursorX, (value: number) => `${value}%`);
	const cursorYPercent = useTransform(cursorY, (value: number) => `${value}%`);
	const inverseCursorXPercent = useTransform(
		cursorX,
		(value: number) => `${100 - value}%`,
	);
	const inverseCursorYPercent = useTransform(
		cursorY,
		(value: number) => `${100 - value}%`,
	);
	const blueStartAlpha = useTransform(audioLevel, (value: number) =>
		(0.26 + value * 0.34).toFixed(3),
	);
	const blueMidAlpha = useTransform(audioLevel, (value: number) =>
		(0.16 + value * 0.24).toFixed(3),
	);
	const goldStartAlpha = useTransform(audioLevel, (value: number) =>
		(0.22 + value * 0.3).toFixed(3),
	);
	const goldMidAlpha = useTransform(audioLevel, (value: number) =>
		(0.12 + value * 0.2).toFixed(3),
	);
	const greenStartAlpha = useTransform(audioLevel, (value: number) =>
		(0.12 + value * 0.18).toFixed(3),
	);
	const whiteGlowAlpha = useTransform(audioLevel, (value: number) =>
		(0.12 + value * 0.26).toFixed(3),
	);
	const centerGlowAlpha = useTransform(audioLevel, (value: number) =>
		(0.12 + value * 0.32).toFixed(3),
	);
	const audioGlowOpacity = useTransform(audioLevel, (value: number) =>
		isOverlayOpen ? 0.62 : 0.62 + value * 0.32,
	);
	const audioGlowScale = useTransform(audioLevel, (value: number) =>
		isOverlayOpen ? 1.02 : 1.04 + value * 0.1,
	);
	const noiseOpacity = useTransform(audioLevel, (value: number) =>
		isOverlayOpen ? 0.16 : 0.24 + value * 0.12,
	);
	const brightness = useTransform(audioLevel, (value: number) =>
		(isOverlayOpen ? 1.1 : 1.22 + value * 0.08).toFixed(3),
	);
	const saturation = useTransform(audioLevel, (value: number) =>
		(isOverlayOpen ? 1.08 : 1.14 + value * 0.65).toFixed(3),
	);
	const reactiveBackground = useMotionTemplate`radial-gradient(58rem 58rem at ${cursorXPercent} ${cursorYPercent}, rgba(141, 173, 248, ${blueStartAlpha}) 0%, rgba(141, 173, 248, ${blueMidAlpha}) 30%, rgba(141, 173, 248, 0) 74%), radial-gradient(48rem 48rem at ${inverseCursorXPercent} ${inverseCursorYPercent}, rgba(214, 204, 75, ${goldStartAlpha}) 0%, rgba(214, 204, 75, ${goldMidAlpha}) 32%, rgba(214, 204, 75, 0) 75%), radial-gradient(42rem 42rem at 50% 8%, rgba(102, 255, 130, ${greenStartAlpha}) 0%, rgba(102, 255, 130, 0) 76%)`;
	const reactiveFilter = useMotionTemplate`brightness(${brightness}) saturate(${saturation})`;
	const audioBackground = useMotionTemplate`radial-gradient(44rem 44rem at ${cursorXPercent} ${cursorYPercent}, rgba(255, 255, 255, ${whiteGlowAlpha}), transparent 72%), radial-gradient(36rem 36rem at 50% 50%, rgba(121, 151, 255, ${centerGlowAlpha}), transparent 75%)`;

	const handlePointerMove = useCallback(
		(event: React.PointerEvent<HTMLDivElement>) => {
			const bounds = event.currentTarget.getBoundingClientRect();
			if (bounds.width <= 0 || bounds.height <= 0) {
				return;
			}

			const x = ((event.clientX - bounds.left) / bounds.width) * 100;
			const y = ((event.clientY - bounds.top) / bounds.height) * 100;
			cursorTargetX.set(Math.min(100, Math.max(0, x)));
			cursorTargetY.set(Math.min(100, Math.max(0, y)));
		},
		[cursorTargetX, cursorTargetY],
	);

	const handlePointerLeave = useCallback(() => {
		cursorTargetX.set(50);
		cursorTargetY.set(50);
	}, [cursorTargetX, cursorTargetY]);

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
				1,
			);

			setFrameScale((current) => {
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

	const { data } = useQuery({
		queryKey: ["presets"],
		queryFn: () =>
			fetchPresetData(0, -1, [], "", [], "inclusive", false, false, 0),
		staleTime: 1000 * 60 * 5,
	});
	const libraryPresets = data?.presets ?? [];
	const scaledWidth = SYNTH_RENDERER_MAX_WIDTH * frameScale;
	const scaledHeight = SYNTH_RENDERER_MAX_HEIGHT * frameScale;

	const handleAudioLevelChange = useCallback(
		(level: number) => {
			audioTarget.set(isOverlayOpen ? level * 0.45 : level);
		},
		[audioTarget, isOverlayOpen],
	);

	return (
		<div
			ref={frameRef}
			className="relative flex items-center justify-center w-full h-full overflow-hidden bg-black"
			data-ui-overlay-open={isOverlayOpen ? "true" : "false"}
			onPointerMove={handlePointerMove}
			onPointerLeave={handlePointerLeave}
		>
			{/* Reactive background layers: cursor gradient, grain, and audio glow */}
			<motion.div
				aria-hidden="true"
				className="cz-reactive-bg pointer-events-none absolute inset-0"
				style={{ background: reactiveBackground, filter: reactiveFilter }}
			/>
			<motion.div
				aria-hidden="true"
				className="cz-reactive-bg-audio pointer-events-none absolute inset-0"
				style={{
					background: audioBackground,
					opacity: audioGlowOpacity,
					scale: audioGlowScale,
				}}
			/>
			<motion.div
				aria-hidden="true"
				className="cz-reactive-bg-noise pointer-events-none absolute inset-0"
				animate={
					isOverlayOpen
						? { x: 0, y: 0 }
						: { x: [0, -1, 2, -2, 1, 0], y: [0, 2, -1, -2, 1, 0] }
				}
				transition={{ duration: 0.68, repeat: Infinity, ease: "linear" }}
				style={{ opacity: noiseOpacity }}
			/>
			{/* Radial vignette to focus on the panel */}
			<div
				aria-hidden="true"
				className="cz-vignette pointer-events-none absolute inset-0"
			/>
			{/* Synth panel */}
			<div
				className="relative shrink-0 overflow-visible"
				style={{
					width: scaledWidth,
					height: scaledHeight,
				}}
			>
				<div
					className="absolute left-0 top-0"
					style={{
						width: SYNTH_RENDERER_MAX_WIDTH,
						height: SYNTH_RENDERER_MAX_HEIGHT,
						transform: `scale(${frameScale})`,
						transformOrigin: "top left",
					}}
				>
					<SharedPhaseDistortionVisualizer
						{...props}
						libraryPresets={libraryPresets}
						onAudioLevelChange={handleAudioLevelChange}
					/>
				</div>
			</div>
		</div>
	);
}
