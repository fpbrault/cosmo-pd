import { useCallback, useEffect, useRef, useState } from "react";
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

	const dragStateRef = useRef(dragState);
	dragStateRef.current = dragState;

	const cleanupDragRef = useRef<(() => void) | null>(null);
	useEffect(() => {
		return () => {
			cleanupDragRef.current?.();
		};
	}, []);

	const endDrag = useCallback((pointerId: number) => {
		if (dragStateRef.current?.pointerId !== pointerId) return;
		setDragState(null);
		dragStateRef.current = null;
		cleanupDragRef.current?.();
		cleanupDragRef.current = null;
	}, []);

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
				steps,
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

			const newDragState = {
				pointerId: e.pointerId,
				stepIndex: closest.stepIndex,
				startClientX: e.clientX,
				startClientY: e.clientY,
				startLevel: step.level ?? 0,
				startRate: step.rate ?? 0,
			};
			setDragState(newDragState);
			dragStateRef.current = newDragState;

			cleanupDragRef.current?.();

			const onWindowPointerEnd = (nativeEvent: PointerEvent) => {
				endDrag(nativeEvent.pointerId);
				window.removeEventListener("pointerup", onWindowPointerEnd);
				window.removeEventListener("pointercancel", onWindowPointerEnd);
				cleanupDragRef.current = null;
			};

			window.addEventListener("pointerup", onWindowPointerEnd);
			window.addEventListener("pointercancel", onWindowPointerEnd);
			cleanupDragRef.current = () => {
				window.removeEventListener("pointerup", onWindowPointerEnd);
				window.removeEventListener("pointercancel", onWindowPointerEnd);
			};
		},
		[canvasRef, endDrag, getClosestStepAtPointer, steps],
	);

	const handleCanvasPointerMove = useCallback(
		(e: React.PointerEvent<HTMLCanvasElement>) => {
			const currentDrag = dragStateRef.current;
			if (currentDrag && currentDrag.pointerId === e.pointerId) {
				const pos = getRelativePointerPosition(e.clientX, e.clientY);
				if (!pos) return;

				const levelDelta =
					(currentDrag.startClientY - e.clientY) / pos.rect.height;
				const level = clamp(currentDrag.startLevel + levelDelta * 99, 0, 99);
				const isLastActiveStep = currentDrag.stepIndex === activeStepCount - 1;
				const canvasW = canvasRef.current?.clientWidth ?? 1200;
				const allowed = getStepAllowedXRange(
					currentDrag.stepIndex,
					activeStepCount,
					canvasW,
					steps,
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
					: getRateForPointerX(currentDrag.stepIndex, clampedX, canvasW);
				updateStepValues(currentDrag.stepIndex, level, rate);
				setHoverStep(currentDrag.stepIndex);
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
			getClosestStepAtPointer,
			getRateForPointerX,
			getRelativePointerPosition,
			steps,
			updateStepValues,
		],
	);

	const handleCanvasPointerUp = useCallback(
		(e: React.PointerEvent<HTMLCanvasElement>) => {
			endDrag(e.pointerId);
		},
		[endDrag],
	);

	const handleCanvasPointerLeave = useCallback(() => {
		if (!dragStateRef.current) setHoverStep(null);
	}, []);

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
