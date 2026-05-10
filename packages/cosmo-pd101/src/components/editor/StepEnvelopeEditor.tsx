import { memo, useCallback, useEffect, useRef, useState } from "react";
import ControlKnob from "@/components/controls/ControlKnob";

import type { StepEnvData } from "@/lib/synth/bindings/synth";
import type { EnvKind } from "@/lib/synth/modTargets";
import { resolveTargetFromMetadata } from "@/lib/synth/modTargets";
import type { StepEnvelopeVoiceMarker } from "./stepEnvelopeGeometry";
import {
	buildEnvelopePoints,
	CHART_PADDING_X,
	clamp,
	drawEnvPreview,
	editorStepDuration,
	findClosestPoint,
	getStepAllowedXRange,
	normalizeEnvelope,
} from "./stepEnvelopeGeometry";

export { StepEnvelopePreview } from "./StepEnvelopePreview";

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

const HOVER_RADIUS_PX = 22;

export type { StepEnvelopeVoiceMarker };

export const StepEnvelopeEditor = memo(function StepEnvelopeEditor({
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
	const [hoverStep, setHoverStep] = useState<number | null>(null);
	const normalizedEnv = normalizeEnvelope(env);
	const steps = normalizedEnv.steps;
	const activeStepCount = normalizedEnv.stepCount;
	const sustainStep = normalizedEnv.sustainStep;
	const [dragState, setDragState] = useState<{
		pointerId: number;
		stepIndex: number;
		startClientX: number;
		startClientY: number;
		startLevel: number;
		startRate: number;
	} | null>(null);

	useEffect(() => {
		if (canvasRef.current) {
			drawEnvPreview(
				canvasRef.current,
				normalizedEnv,
				color,
				dragState?.stepIndex ?? hoverStep,
				voiceMarkers,
			);
		}
	}, [normalizedEnv, color, hoverStep, dragState, voiceMarkers]);

	const commitEnvelope = useCallback(
		(nextEnv: StepEnvData) => {
			onChange(normalizeEnvelope(nextEnv));
		},
		[onChange],
	);

	const updateStep = useCallback(
		(index: number, field: "level" | "rate", value: number) => {
			const newSteps = steps.map((s, i) =>
				i === index ? { ...s, [field]: value } : s,
			);
			commitEnvelope({ ...normalizedEnv, steps: newSteps });
		},
		[commitEnvelope, normalizedEnv, steps],
	);

	const updateStepValues = useCallback(
		(index: number, level: number, rate: number) => {
			const newSteps = steps.map((step, i) =>
				i === index ? { ...step, level, rate } : step,
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

	const getRateForPointerX = useCallback(
		(stepIndex: number, pointerX: number, canvasWidth: number) => {
			const activeSteps = steps.slice(0, activeStepCount);
			const visibleStepCount = activeSteps.length;
			if (stepIndex < 0 || stepIndex >= activeSteps.length) {
				return steps[stepIndex]?.rate ?? 0;
			}
			const allowed = getStepAllowedXRange(
				stepIndex,
				visibleStepCount,
				canvasWidth,
			);
			const clampedPointerX = clamp(pointerX, allowed.minX, allowed.maxX);

			const drawWidth = canvasWidth - CHART_PADDING_X * 2;
			let bestRate = activeSteps[stepIndex]?.rate ?? 0;
			let bestDistance = Number.POSITIVE_INFINITY;

			for (let candidateRate = 0; candidateRate <= 99; candidateRate++) {
				let totalTime = 0;
				let cumulative = 0;

				for (let i = 0; i < activeSteps.length; i++) {
					const rate = i === stepIndex ? candidateRate : activeSteps[i].rate;
					const duration = editorStepDuration(rate);
					totalTime += duration;
					if (i <= stepIndex) cumulative += duration;
				}

				if (totalTime <= 0) continue;
				const pointX = CHART_PADDING_X + (cumulative / totalTime) * drawWidth;
				const distance = Math.abs(pointX - clampedPointerX);

				if (distance < bestDistance) {
					bestDistance = distance;
					bestRate = candidateRate;
				}
			}

			return bestRate;
		},
		[activeStepCount, steps],
	);

	const getRelativePointerPosition = useCallback(
		(clientX: number, clientY: number) => {
			const canvas = canvasRef.current;
			if (!canvas) return null;

			const rect = canvas.getBoundingClientRect();
			const scaleX = canvas.clientWidth / Math.max(1, rect.width);
			const scaleY = canvas.clientHeight / Math.max(1, rect.height);
			const x = (clientX - rect.left) * scaleX;
			const y = (clientY - rect.top) * scaleY;
			return { x, y, rect };
		},
		[],
	);

	const getClosestStepAtPointer = useCallback(
		(clientX: number, clientY: number) => {
			const pos = getRelativePointerPosition(clientX, clientY);
			if (!pos) return null;

			const canvas = canvasRef.current;
			if (!canvas) return null;
			const points = buildEnvelopePoints(
				normalizedEnv,
				canvas.clientWidth,
				canvas.clientHeight,
			);
			const closest = findClosestPoint(points, pos.x, pos.y);
			if (!closest) return null;

			return {
				stepIndex: closest.point.index,
				distanceSquared: closest.distanceSquared,
			};
		},
		[getRelativePointerPosition, normalizedEnv],
	);

	const handleCanvasPointerDown = useCallback(
		(e: React.PointerEvent<HTMLCanvasElement>) => {
			const canvas = canvasRef.current;
			if (!canvas) return;
			const closest = getClosestStepAtPointer(e.clientX, e.clientY);
			if (!closest) return;

			const step = steps[closest.stepIndex];
			if (!step) return;

			canvas.setPointerCapture(e.pointerId);
			setHoverStep(closest.stepIndex);
			setDragState({
				pointerId: e.pointerId,
				stepIndex: closest.stepIndex,
				startClientX: e.clientX,
				startClientY: e.clientY,
				startLevel: step.level,
				startRate: step.rate,
			});
		},
		[getClosestStepAtPointer, steps],
	);

	const handleCanvasPointerMove = useCallback(
		(e: React.PointerEvent<HTMLCanvasElement>) => {
			if (dragState && dragState.pointerId === e.pointerId) {
				const pos = getRelativePointerPosition(e.clientX, e.clientY);
				if (!pos) return;

				const levelDelta =
					(dragState.startClientY - e.clientY) / pos.rect.height;
				const level = clamp(dragState.startLevel + levelDelta * 99, 0, 99);
				const isLastActiveStep = dragState.stepIndex === activeStepCount - 1;
				const canvasW = canvasRef.current?.clientWidth ?? 1200;
				const allowed = getStepAllowedXRange(
					dragState.stepIndex,
					activeStepCount,
					canvasW,
				);
				const clampedX = clamp(pos.x, allowed.minX, allowed.maxX);
				const rate = isLastActiveStep
					? clamp(
							Math.round(
								((allowed.maxX - clampedX) /
									Math.max(1, allowed.maxX - allowed.minX)) *
									99,
							),
							0,
							99,
						)
					: getRateForPointerX(dragState.stepIndex, clampedX, canvasW);
				updateStepValues(dragState.stepIndex, level, rate);
				setHoverStep(dragState.stepIndex);
				return;
			}

			const closest = getClosestStepAtPointer(e.clientX, e.clientY);
			if (!closest) {
				setHoverStep(null);
				return;
			}

			if (closest.distanceSquared <= HOVER_RADIUS_PX * HOVER_RADIUS_PX) {
				setHoverStep(closest.stepIndex);
			} else {
				setHoverStep(null);
			}
		},
		[
			dragState,
			activeStepCount,
			getClosestStepAtPointer,
			getRateForPointerX,
			getRelativePointerPosition,
			updateStepValues,
		],
	);

	const handleCanvasPointerUp = useCallback(
		(e: React.PointerEvent<HTMLCanvasElement>) => {
			if (dragState?.pointerId !== e.pointerId) return;
			setDragState(null);
		},
		[dragState],
	);

	const handleCanvasPointerLeave = useCallback(() => {
		if (!dragState) setHoverStep(null);
	}, [dragState]);

	return (
		<div className="flex h-full flex-col space-y-3">
			<div className="flex items-center justify-between">
				<span className="font-semibold text-2xs text-base-content/70 uppercase tracking-[0.24em]">
					{title}
				</span>
				<div className="flex items-center gap-2">
					<label className="flex items-center gap-1 text-xs">
						<input
							type="checkbox"
							checked={normalizedEnv.loop}
							onChange={(e) =>
								commitEnvelope({
									...normalizedEnv,
									loop: e.target.checked,
								})
							}
							className="checkbox checkbox-xs"
						/>
						Loop
					</label>
				</div>
			</div>

			<canvas
				ref={canvasRef}
				width={1200}
				height={200}
				className="max-w-full cursor-crosshair touch-none rounded-xl border border-base-300/60 bg-base-300/30"
				style={{ imageRendering: "auto" }}
				onPointerDown={handleCanvasPointerDown}
				onPointerMove={handleCanvasPointerMove}
				onPointerUp={handleCanvasPointerUp}
				onPointerCancel={handleCanvasPointerUp}
				onPointerLeave={handleCanvasPointerLeave}
			/>

			<div className="grid grid-cols-8 gap-2">
				{steps.map((step, i) => {
					const isActiveStep = i < activeStepCount;
					const isEndStep = i === activeStepCount - 1;
					const isSustainStep = i === sustainStep;
					return (
						<fieldset
							key={STEP_KEYS[i]}
							aria-label={`Step ${i + 1}`}
							className={`flex flex-col rounded-xl border px-1 py-2 transition-colors ${
								!isActiveStep
									? "border-base-300/30 bg-base-300/10"
									: "border-base-300/60 bg-base-300/20"
							}`}
						>
							<div className="mb-1 flex items-center justify-start px-1">
								<div className="text-4xs text-base-content/45 uppercase tracking-[0.2em]">
									{i + 1}
								</div>
							</div>
							<div
								className={`flex flex-col items-center justify-center gap-2 ${!isActiveStep ? "opacity-40" : ""}`}
							>
								<ControlKnob
									value={step.level}
									onChange={(v) => updateStep(i, "level", v)}
									disabled={!isActiveStep || isEndStep}
									size={64}
									min={0}
									max={99}
									label="Lvl"
									tooltip={`Sets envelope level for step ${i + 1}.`}
									valueFormatter={(v) => `${Math.round(v)}`}
									color={
										!isActiveStep || isEndStep ? "#6b7280" : levelKnobColor
									}
									modDestination={resolveTargetFromMetadata("env.stepLevel", {
										lineIndex,
										envKind,
										stepIndex: i + 1,
									})}
								/>
								<ControlKnob
									value={step.rate}
									onChange={(v) => updateStep(i, "rate", v)}
									disabled={!isActiveStep}
									min={0}
									max={99}
									label="Rate"
									tooltip={`Sets envelope transition speed for step ${i + 1}.`}
									valueFormatter={(v) => `${Math.round(v)}`}
									color={!isActiveStep ? "#6b7280" : "#a3a3a3"}
									size={64}
									modDestination={resolveTargetFromMetadata("env.stepRate", {
										lineIndex,
										envKind,
										stepIndex: i + 1,
									})}
								/>
							</div>
							<div className="mt-1 flex w-full flex-col gap-1 pt-1">
								<button
									type="button"
									onClick={() => setSustainStepForIndex(i)}
									disabled={!isActiveStep}
									aria-pressed={isSustainStep}
									className={`rounded border px-1 py-1 font-semibold text-[0.55rem] uppercase tracking-[0.18em] transition-colors ${
										isSustainStep
											? "border-warning/60 bg-warning/15 text-warning"
											: "border-base-300/60 bg-base-100/40 text-base-content/70"
									} disabled:cursor-not-allowed disabled:opacity-40`}
								>
									SUS
								</button>
								<button
									type="button"
									onClick={() => setEndStepForIndex(i)}
									aria-pressed={isEndStep}
									className={`rounded border px-1 py-1 font-semibold text-[0.55rem] uppercase tracking-[0.18em] transition-colors ${
										isEndStep
											? "border-cz-gold/60 bg-cz-gold/15 text-cz-gold"
											: "border-base-300/60 bg-base-100/40 text-base-content/70"
									}`}
								>
									END
								</button>
							</div>
						</fieldset>
					);
				})}
			</div>
		</div>
	);
});

export default StepEnvelopeEditor;
