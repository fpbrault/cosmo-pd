import { useCallback, useState } from "react";
import type { StepEnvData } from "@/lib/synth/bindings/synth";
import type { StepEnvelopeVoiceMarker } from "./stepEnvelopeGeometry";
import {
	buildEnvelopePoints,
	CHART_PADDING_X,
	clamp,
	editorStepDuration,
	findClosestPoint,
	getStepAllowedXRange,
	normalizeEnvelope,
} from "./stepEnvelopeGeometry";

const HOVER_RADIUS_PX = 22;

type UseStepEnvelopeCanvasInteractionOptions = {
	env: StepEnvData;
	canvasRef: React.RefObject<HTMLCanvasElement | null>;
	voiceMarkers: StepEnvelopeVoiceMarker[];
	onCommitEnvelope: (nextEnv: StepEnvData) => void;
};

export function useStepEnvelopeCanvasInteraction({
	env,
	canvasRef,
	onCommitEnvelope,
}: UseStepEnvelopeCanvasInteractionOptions) {
	const [hoverStep, setHoverStep] = useState<number | null>(null);
	const [dragState, setDragState] = useState<{
		pointerId: number;
		stepIndex: number;
		startClientX: number;
		startClientY: number;
		startLevel: number;
		startRate: number;
	} | null>(null);

	const normalizedEnv = normalizeEnvelope(env);
	const steps = normalizedEnv.steps;
	const activeStepCount = normalizedEnv.stepCount;

	const updateStepValues = useCallback(
		(index: number, level: number, rate: number) => {
			const newSteps = steps.map((step, i) =>
				i === index ? { ...step, level, rate } : step,
			);
			onCommitEnvelope({ ...normalizedEnv, steps: newSteps });
		},
		[normalizedEnv, onCommitEnvelope, steps],
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
					const rate =
						i === stepIndex ? candidateRate : (activeSteps[i].rate ?? 0);
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
		[canvasRef],
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
		[canvasRef, getRelativePointerPosition, normalizedEnv],
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
				startLevel: step.level ?? 0,
				startRate: step.rate ?? 0,
			});
		},
		[canvasRef, getClosestStepAtPointer, steps],
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
			activeStepCount,
			canvasRef,
			dragState,
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

	return {
		hoverStep,
		dragState,
		normalizedEnv,
		handleCanvasPointerDown,
		handleCanvasPointerMove,
		handleCanvasPointerUp,
		handleCanvasPointerLeave,
	};
}
