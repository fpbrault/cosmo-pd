import { memo, useCallback, useEffect, useRef, useState } from "react";
import type { StepEnvData } from "@/lib/synth/bindings/synth";
import type { EnvKind } from "@/lib/synth/modTargets";
import StepEnvelopeStepCard from "./StepEnvelopeStepCard";
import type { StepEnvelopeVoiceMarker } from "./stepEnvelopeGeometry";
import { drawEnvPreview, normalizeEnvelope } from "./stepEnvelopeGeometry";
import { useStepEnvelopeCanvasInteraction } from "./useStepEnvelopeCanvasInteraction";

const STEP_KEYS = ["s0", "s1", "s2", "s3", "s4", "s5", "s6", "s7"] as const;

interface StepEnvelopeEditorProps {
	title: string;
	env: StepEnvData;
	onChange: (env: StepEnvData) => void;
	color?: string;
	levelKnobColor?: string;
	lineIndex?: 1 | 2;
	envKind?: EnvKind;
	voiceMarkers?: StepEnvelopeVoiceMarker[];
}

export type { StepEnvelopeVoiceMarker };

const StepEnvelopeEditor = memo(function StepEnvelopeEditor({
	title,
	env,
	onChange,
	color = "#60a5fa",
	levelKnobColor = color,
	lineIndex = 1,
	envKind = "dco",
	voiceMarkers = [],
}: StepEnvelopeEditorProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const commitEnvelope = useCallback(
		(nextEnv: StepEnvData) => {
			onChange(normalizeEnvelope(nextEnv));
		},
		[onChange],
	);

	const {
		hoverStep,
		dragState,
		normalizedEnv,
		handleCanvasPointerDown,
		handleCanvasPointerMove,
		handleCanvasPointerUp,
		handleCanvasPointerLeave,
	} = useStepEnvelopeCanvasInteraction({
		env,
		canvasRef,
		voiceMarkers,
		onCommitEnvelope: commitEnvelope,
	});

	const [resizeTick, setResizeTick] = useState(0);
	const steps = normalizedEnv.steps;
	const activeStepCount = normalizedEnv.stepCount;
	const sustainStep = normalizedEnv.sustainStep;

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas || typeof ResizeObserver === "undefined") {
			return;
		}

		const observer = new ResizeObserver(() => {
			setResizeTick((tick) => tick + 1);
		});

		observer.observe(canvas);
		return () => {
			observer.disconnect();
		};
	}, []);

	useEffect(() => {
		void resizeTick;
		if (canvasRef.current) {
			drawEnvPreview(
				canvasRef.current,
				normalizedEnv,
				color,
				dragState?.stepIndex ?? hoverStep,
				voiceMarkers,
			);
		}
	}, [normalizedEnv, color, hoverStep, dragState, voiceMarkers, resizeTick]);

	const updateStep = useCallback(
		(index: number, field: "level" | "rate", value: number) => {
			const newSteps = steps.map((step, i) =>
				i === index ? { ...step, [field]: value } : step,
			);
			commitEnvelope({ ...normalizedEnv, steps: newSteps });
		},
		[commitEnvelope, normalizedEnv, steps],
	);

	const setSustainStepForIndex = useCallback(
		(index: number) => {
			if (index < 0 || index >= activeStepCount) {
				return;
			}

			commitEnvelope({
				...normalizedEnv,
				sustainStep: index,
			});
		},
		[activeStepCount, commitEnvelope, normalizedEnv],
	);

	const setEndStepForIndex = useCallback(
		(index: number) => {
			commitEnvelope({
				...normalizedEnv,
				stepCount: index + 1,
			});
		},
		[commitEnvelope, normalizedEnv],
	);

	return (
		<div className="flex h-full min-h-0 flex-col space-y-3">
			<div className="flex items-center justify-between">
				<span className="font-semibold text-2xs text-base-content/70 uppercase tracking-[0.24em]">
					{title}
				</span>
				<div className="flex items-center gap-2">
					<label className="flex items-center gap-1 text-xs">
						<input
							type="checkbox"
							checked={normalizedEnv.loop}
							onChange={(event) =>
								commitEnvelope({
									...normalizedEnv,
									loop: event.target.checked,
								})
							}
							className="checkbox checkbox-xs"
						/>
						Loop
					</label>
				</div>
			</div>

			<div className="relative min-h-0 flex-1 overflow-hidden rounded-xl border border-base-300/60 bg-base-300/30">
				<canvas
					ref={canvasRef}
					className="absolute inset-0 h-full w-full cursor-crosshair touch-none"
					style={{ imageRendering: "auto" }}
					onPointerDown={handleCanvasPointerDown}
					onPointerMove={handleCanvasPointerMove}
					onPointerUp={handleCanvasPointerUp}
					onPointerCancel={handleCanvasPointerUp}
					onPointerLeave={handleCanvasPointerLeave}
				/>
			</div>

			<div className="grid grid-cols-8 gap-2">
				{steps.map((step, index) => (
					<StepEnvelopeStepCard
						key={STEP_KEYS[index]}
						step={step}
						stepIndex={index}
						activeStepCount={activeStepCount}
						sustainStep={sustainStep}
						levelKnobColor={levelKnobColor}
						lineIndex={lineIndex}
						envKind={envKind}
						onLevelChange={(value) => updateStep(index, "level", value)}
						onRateChange={(value) => updateStep(index, "rate", value)}
						onSetSustain={() => setSustainStepForIndex(index)}
						onSetEnd={() => setEndStepForIndex(index)}
					/>
				))}
			</div>
		</div>
	);
});

export default StepEnvelopeEditor;
