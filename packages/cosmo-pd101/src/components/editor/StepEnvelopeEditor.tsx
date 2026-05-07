import { memo, useCallback, useEffect, useRef, useState } from "react";
import ControlKnob from "@/components/controls/ControlKnob";

import type { StepEnvData } from "@/lib/synth/bindings/synth";
import type { EnvKind } from "@/lib/synth/modTargets";
import { resolveTargetFromMetadata } from "@/lib/synth/modTargets";

const STEP_KEYS = ["s0", "s1", "s2", "s3", "s4", "s5", "s6", "s7"] as const;
const DEFAULT_STEP = { level: 0, rate: 50 };

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

export type StepEnvelopeVoiceMarker = {
	id: string | number;
	step: number;
	progress?: number;
	releasing?: boolean;
	color?: string;
};

type StepEnvelopePreviewProps = {
	env: StepEnvData;
	color: string;
	title: string;
	active?: boolean;
	onClick: () => void;
};

type EnvPoint = {
	index: number;
	x: number;
	y: number;
};

const CHART_PADDING_Y = 8;
const CHART_PADDING_X = 12;
const HOVER_RADIUS_PX = 22;

function clamp(value: number, min: number, max: number) {
	return Math.max(min, Math.min(max, value));
}

function normalizeStepCount(stepCount: number) {
	return clamp(Math.round(stepCount), 1, STEP_KEYS.length);
}

function getPaddedSteps(steps: StepEnvData["steps"]) {
	return STEP_KEYS.map((_, index) => {
		const step = steps[index];
		return step ? { ...step } : { ...DEFAULT_STEP };
	});
}

function normalizeEnvelope(env: StepEnvData): StepEnvData {
	const stepCount = normalizeStepCount(env.stepCount);
	const steps = getPaddedSteps(env.steps);
	const endStepIndex = stepCount - 1;
	if (steps[endStepIndex]) {
		steps[endStepIndex] = { ...steps[endStepIndex], level: 0 };
	}
	return {
		...env,
		steps,
		stepCount,
		sustainStep: clamp(Math.round(env.sustainStep), 0, stepCount - 1),
	};
}

function editorStepDuration(rate: number): number {
	// Rate-based duration: higher rate = shorter duration (steeper visually).
	// Direct reciprocal of rate for linear, rate-driven envelope appearance.
	const clampedRate = clamp(Math.round(rate), 0, 99);
	return 1 / (clampedRate + 1);
}

function getStepAllowedXRange(
	stepIndex: number,
	activeStepCount: number,
	canvasWidth: number,
) {
	const drawWidth = canvasWidth - CHART_PADDING_X * 2;
	const safeStepCount = Math.max(1, activeStepCount);
	const cellWidth = drawWidth / safeStepCount;
	const minX = CHART_PADDING_X + stepIndex * cellWidth;
	const maxX = CHART_PADDING_X + (stepIndex + 1) * cellWidth;
	return { minX, maxX };
}

function buildEnvelopePoints(
	env: StepEnvData,
	width: number,
	height: number,
): EnvPoint[] {
	const activeSteps = env.steps.slice(0, env.stepCount);
	if (activeSteps.length === 0) return [];
	const _activeStepCount = activeSteps.length;

	const drawWidth = width - CHART_PADDING_X * 2;
	const drawHeight = height - CHART_PADDING_Y * 2;

	let totalTime = 0;
	for (const step of activeSteps) totalTime += editorStepDuration(step.rate);
	if (totalTime <= 0) totalTime = 1;

	const points: EnvPoint[] = [];
	let x = CHART_PADDING_X;

	for (let i = 0; i < activeSteps.length; i++) {
		const step = activeSteps[i];
		const isLastStep = i === activeSteps.length - 1;
		// CZ behaviour: last step always resolves to 0
		const effectiveLevel = isLastStep ? 0 : step.level;
		const duration = editorStepDuration(step.rate);
		const dx = (duration / totalTime) * drawWidth;
		x += dx;
		points.push({
			index: i,
			x,
			y: CHART_PADDING_Y + (1 - effectiveLevel / 99) * drawHeight,
		});
	}

	return points;
}

function getMarkerX(
	points: EnvPoint[],
	marker: StepEnvelopeVoiceMarker,
): number | null {
	if (points.length === 0) return null;
	const stepIndex = clamp(Math.round(marker.step), 0, points.length - 1);
	const point = points[stepIndex];
	if (!point) return null;

	if (marker.progress === undefined) return point.x;

	const fromX = stepIndex === 0 ? CHART_PADDING_X : points[stepIndex - 1].x;
	const progress = clamp(marker.progress, 0, 1);
	return fromX + (point.x - fromX) * progress;
}

function findClosestPoint(
	points: EnvPoint[],
	x: number,
	y: number,
): { point: EnvPoint; distanceSquared: number } | null {
	if (points.length === 0) return null;

	let closest = points[0];
	let bestDist = Number.POSITIVE_INFINITY;

	for (const point of points) {
		const dx = point.x - x;
		const dy = point.y - y;
		const dist = dx * dx + dy * dy;
		if (dist < bestDist) {
			bestDist = dist;
			closest = point;
		}
	}

	return { point: closest, distanceSquared: bestDist };
}

function drawEnvPreview(
	canvas: HTMLCanvasElement,
	env: StepEnvData,
	color: string,
	highlightStep: number | null,
	voiceMarkers: StepEnvelopeVoiceMarker[] = [],
	preview = false,
) {
	const ctx = canvas.getContext("2d");
	if (!ctx) return;
	const dpr = window.devicePixelRatio || 1;
	const w = canvas.clientWidth || canvas.width;
	const h = canvas.clientHeight || canvas.height;
	const targetW = Math.round(w * dpr);
	const targetH = Math.round(h * dpr);
	if (canvas.width !== targetW || canvas.height !== targetH) {
		canvas.width = targetW;
		canvas.height = targetH;
	}
	ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
	const drawHeight = h - CHART_PADDING_Y * 2;
	ctx.clearRect(0, 0, w, h);

	ctx.fillStyle = "rgba(0,0,0,0.3)";
	ctx.fillRect(0, 0, w, h);

	ctx.strokeStyle = preview
		? "rgba(100,100,100,0.18)"
		: "rgba(100,100,100,0.3)";
	ctx.lineWidth = 1;
	for (let y = 0.25; y < 1; y += 0.25) {
		ctx.beginPath();
		ctx.moveTo(CHART_PADDING_X, h * (1 - y));
		ctx.lineTo(w - CHART_PADDING_X, h * (1 - y));
		ctx.stroke();
	}
	const points = buildEnvelopePoints(env, w, h);

	ctx.strokeStyle = color;
	ctx.lineWidth = preview ? 1.5 : 2;
	ctx.beginPath();
	ctx.moveTo(CHART_PADDING_X, CHART_PADDING_Y + drawHeight);
	for (let i = 0; i < points.length; i++) {
		ctx.lineTo(points[i].x, points[i].y);
	}
	ctx.stroke();

	const susStep = Math.min(env.sustainStep, env.stepCount - 1);
	if (susStep >= 0 && susStep < points.length) {
		const sp = points[susStep];
		ctx.strokeStyle = preview ? "rgba(255,200,0,0.45)" : "rgba(255,200,0,0.6)";
		ctx.lineWidth = preview ? 0.8 : 1;
		ctx.setLineDash([3, 3]);
		ctx.beginPath();
		ctx.moveTo(sp.x, CHART_PADDING_Y);
		ctx.lineTo(sp.x, h - CHART_PADDING_Y);
		ctx.stroke();
		ctx.setLineDash([]);
	}

	for (const marker of voiceMarkers) {
		const x = getMarkerX(points, marker);
		if (x === null) continue;

		ctx.strokeStyle =
			marker.color ?? (marker.releasing ? "#f59e0b" : "#f8fafc");
		ctx.lineWidth = marker.releasing ? 1 : 1.5;
		ctx.globalAlpha = marker.releasing ? 0.65 : 0.9;
		ctx.beginPath();
		ctx.moveTo(x, CHART_PADDING_Y);
		ctx.lineTo(x, h - CHART_PADDING_Y);
		ctx.stroke();
		ctx.globalAlpha = 1;
	}

	if (preview) return;

	for (let i = 0; i < points.length; i++) {
		const p = points[i];
		const isHighlighted = highlightStep === p.index;
		if (isHighlighted) {
			ctx.strokeStyle = "rgba(255,255,255,0.8)";
			ctx.lineWidth = 2;
			ctx.beginPath();
			ctx.arc(p.x, p.y, 11, 0, Math.PI * 2);
			ctx.stroke();
		}

		ctx.fillStyle = p.index === susStep ? "#fbbf24" : color;
		ctx.beginPath();
		ctx.arc(p.x, p.y, 8, 0, Math.PI * 2);
		ctx.fill();
	}
}

export const StepEnvelopePreview = memo(function StepEnvelopePreview({
	env,
	color,
	title,
	active = false,
	onClick,
}: StepEnvelopePreviewProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const normalizedEnv = normalizeEnvelope(env);

	useEffect(() => {
		if (canvasRef.current) {
			drawEnvPreview(canvasRef.current, normalizedEnv, color, null, [], true);
		}
	}, [normalizedEnv, color]);

	return (
		<button
			type="button"
			onClick={onClick}
			aria-pressed={active}
			aria-label={`Show ${title} envelope`}
			className={`group min-w-0 rounded-md border bg-cz-inset/80 p-1.5 transition-colors focus:outline-none focus:ring-1 focus:ring-cz-light-blue ${
				active
					? "border-cz-gold/70 shadow-[0_0_0_1px_rgba(251,191,36,0.28)]"
					: "border-cz-border/70 hover:border-cz-cream/50"
			}`}
		>
			<canvas
				ref={canvasRef}
				width={220}
				height={50}
				className="block h-10 w-full rounded bg-black/25"
			/>
			<div className="mt-1 flex items-center justify-between gap-2 px-0.5">
				<span className="truncate text-[0.55rem] font-semibold uppercase tracking-[0.18em] text-cz-cream-dim group-hover:text-cz-cream">
					{title}
				</span>
				<span
					className={`h-1.5 w-1.5 shrink-0 rounded-full ${
						active ? "bg-cz-gold" : "bg-cz-border"
					}`}
				/>
			</div>
		</button>
	);
});

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
		<div className="h-full flex flex-col space-y-3">
			<div className="flex items-center justify-between">
				<span className="text-2xs font-semibold uppercase tracking-[0.24em] text-base-content/70">
					{title}
				</span>
				<div className="flex items-center gap-2">
					<label className="text-xs flex items-center gap-1">
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
				className="max-w-full rounded-xl cursor-crosshair border border-base-300/60 bg-base-300/30 touch-none"
				style={{ imageRendering: "auto" }}
				onPointerDown={handleCanvasPointerDown}
				onPointerMove={handleCanvasPointerMove}
				onPointerUp={handleCanvasPointerUp}
				onPointerCancel={handleCanvasPointerUp}
				onPointerLeave={handleCanvasPointerLeave}
			/>

			<div className="grid gap-2 grid-cols-8">
				{steps.map((step, i) => {
					const isActiveStep = i < activeStepCount;
					const isEndStep = i === activeStepCount - 1;
					const isSustainStep = i === sustainStep;
					return (
						<fieldset
							key={STEP_KEYS[i]}
							aria-label={`Step ${i + 1}`}
							className={`flex flex-col rounded-xl border px-1 transition-colors py-2 ${
								!isActiveStep
									? "border-base-300/30 bg-base-300/10"
									: "border-base-300/60 bg-base-300/20"
							}`}
						>
							<div className="mb-1 flex items-center justify-start px-1">
								<div className="text-4xs uppercase tracking-[0.2em] text-base-content/45">
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
									className={`rounded border px-1 py-1 text-[0.55rem] font-semibold uppercase tracking-[0.18em] transition-colors ${
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
									className={`rounded border px-1 py-1 text-[0.55rem] font-semibold uppercase tracking-[0.18em] transition-colors ${
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
