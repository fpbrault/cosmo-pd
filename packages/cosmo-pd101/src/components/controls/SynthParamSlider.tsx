import {
	type KeyboardEvent,
	memo,
	type PointerEvent,
	useCallback,
	useMemo,
	useRef,
	useState,
	type WheelEvent,
} from "react";
import { ControlValueTooltipPortal } from "@/components/controls/ControlValueTooltip";
import ModulatableControl from "@/components/controls/modulation/ModulatableControl";
import { useHoverInfoHandlers } from "@/components/layout/HoverInfo";
import type { SynthParamKey } from "@/features/synth/SynthParamController";
import type { ModDestination } from "@/lib/synth/bindings/synth";
import type { KnobCurve } from "./knob/knobGeometry";
import {
	mapPointerDeltaWithCurve,
	type SliderCurveMode,
} from "./sliderInteractionCurve";
import type { SyncConfig, UiTransform } from "./synthParamControlShared";
import { useSynthParamControl } from "./synthParamControlShared";

type Orientation = "vertical" | "horizontal";

interface SynthParamSliderProps {
	paramKey: SynthParamKey;
	orientation: Orientation;
	value?: number;
	onChange?: (value: number) => void;
	disabled?: boolean;
	label?: string;
	labelClassName?: string;
	color?: string;
	min?: number;
	max?: number;
	bipolar?: boolean;
	step?: number;
	curve?: KnobCurve;
	modDestination?: ModDestination;
	tooltip?: string;
	valueFormatter?: (value: number) => string;
	midiTargetKey?: string;
	midiLabel?: string;
	uiTransform?: UiTransform;
	sync?: SyncConfig;
	className?: string;
	trackLength?: number;
	trackThickness?: number;
	showTicks?: boolean;
	majorTickEvery?: number;
	showLabels?: boolean;
	centerDetent?: boolean;
	centerDetentThreshold?: number;
	centerMarker?: boolean;
	showValueOnInteraction?: boolean;
	curveMode?: SliderCurveMode;
}

const FINE_FACTOR = 0.2;

function clamp(v: number, min: number, max: number) {
	return Math.max(min, Math.min(max, v));
}

function quantize(v: number, min: number, step?: number) {
	if (!step || step <= 0) return v;
	return Math.round((v - min) / step) * step + min;
}

function formatTickLabel(value: number) {
	if (Math.abs(value) >= 1000) {
		return `${(value / 1000).toFixed(1).replace(/\.0$/, "")}k`;
	}
	return `${Math.round(value)}`;
}

function SynthParamSliderInner({
	paramKey,
	orientation,
	value,
	onChange,
	disabled = false,
	label,
	labelClassName,
	color = "#fbbf24",
	min,
	max,
	bipolar,
	step,
	curve,
	modDestination,
	tooltip,
	valueFormatter,
	midiTargetKey,
	midiLabel,
	uiTransform,
	sync,
	className = "",
	trackLength,
	trackThickness,
	showTicks = true,
	majorTickEvery = 3,
	showLabels = false,
	centerDetent = false,
	centerMarker = false,
	centerDetentThreshold,
	showValueOnInteraction = true,
	curveMode = "linear",
}: SynthParamSliderProps) {
	const state = useSynthParamControl({
		paramKey,
		value,
		onChange,
		min,
		max,
		step,
		bipolar,
		curve,
		modDestination,
		tooltip,
		label,
		valueFormatter,
		midiTargetKey,
		midiLabel,
		uiTransform,
		sync,
	});

	const resolvedLabel = label?.trim() ? label : paramKey;
	const resolvedTooltip = tooltip?.trim()
		? tooltip
		: state.syncMode
			? state.syncTooltip
			: state.boundTooltip;
	const hoverHandlers = useHoverInfoHandlers(resolvedTooltip);
	const containerRef = useRef<HTMLDivElement>(null);
	const rootRef = useRef<HTMLDivElement>(null);
	const pointerIdRef = useRef<number | null>(null);
	const pointerStartRef = useRef<{ x: number; y: number } | null>(null);
	const pointerStartValueRef = useRef<number>(state.displayedValue);
	const pointerDragActiveRef = useRef(false);
	const [dragging, setDragging] = useState(false);
	const [hovered, setHovered] = useState(false);
	const [hoverSession, setHoverSession] = useState(0);

	const length = trackLength ?? (orientation === "vertical" ? 126 : 300);
	const thickness = trackThickness ?? (orientation === "vertical" ? 22 : 18);
	const capSize =
		orientation === "vertical" ? { w: 20, h: 14 } : { w: 18, h: 14 };
	const range = state.controlMax - state.controlMin;
	const safeRange = Math.max(range, 1e-6);
	const normalized = clamp(
		(state.displayedValue - state.controlMin) / safeRange,
		0,
		1,
	);
	const isBipolarVisual =
		state.controlBipolar && state.controlMin < 0 && state.controlMax > 0;
	const zeroNormalized = clamp((0 - state.controlMin) / safeRange, 0, 1);
	const fillPercent = normalized * 100;
	const valueText = state.valueFormatter
		? state.valueFormatter(state.displayedValue)
		: Number(state.displayedValue.toFixed(3)).toString();

	const centerValue = (state.controlMin + state.controlMax) / 2;
	const detentThreshold =
		centerDetentThreshold ??
		Math.max((state.controlStep ?? safeRange / 100) * 1.2, 0.001);

	const controlToValue = useCallback(
		(
			clientX: number,
			clientY: number,
			useFineStep: boolean,
			startValue: number,
		) => {
			const rect = rootRef.current?.getBoundingClientRect();
			if (!rect) return state.displayedValue;

			const start = pointerStartRef.current;
			if (!start) return state.displayedValue;
			const deltaPx =
				orientation === "vertical" ? start.y - clientY : clientX - start.x;
			const trackPx =
				orientation === "vertical"
					? Math.max(rect.height, 1)
					: Math.max(rect.width, 1);
			let nextValue = mapPointerDeltaWithCurve({
				startValue,
				deltaPx,
				trackPx,
				curveMode,
				min: state.controlMin,
				max: state.controlMax,
			});

			if (state.controlStep && state.controlStep > 0) {
				const usedStep = useFineStep
					? Math.max(state.controlStep * FINE_FACTOR, state.controlStep / 10)
					: state.controlStep;
				nextValue = quantize(nextValue, state.controlMin, usedStep);
			}

			if (
				centerDetent &&
				Math.abs(nextValue - centerValue) <= detentThreshold
			) {
				nextValue = centerValue;
			}

			return clamp(nextValue, state.controlMin, state.controlMax);
		},
		[
			centerDetent,
			centerValue,
			detentThreshold,
			orientation,
			state.controlMax,
			state.controlMin,
			state.controlStep,
			state.displayedValue,
			curveMode,
		],
	);

	const nudge = useCallback(
		(direction: 1 | -1, fine: boolean) => {
			const baseStep = state.controlStep ?? safeRange / 100;
			const usedStep = fine
				? Math.max(baseStep * FINE_FACTOR, baseStep / 10)
				: baseStep;
			let nextValue = state.displayedValue + direction * usedStep;
			nextValue = quantize(nextValue, state.controlMin, state.controlStep);
			if (
				centerDetent &&
				Math.abs(nextValue - centerValue) <= detentThreshold
			) {
				nextValue = centerValue;
			}
			state.handleControlChange(
				clamp(nextValue, state.controlMin, state.controlMax),
			);
		},
		[centerDetent, centerValue, detentThreshold, safeRange, state],
	);

	const beginPointer = useCallback(
		(e: PointerEvent<HTMLDivElement>) => {
			if (disabled || state.midiLearn.interactionLocked) return;
			e.preventDefault();
			pointerIdRef.current = e.pointerId;
			pointerStartRef.current = { x: e.clientX, y: e.clientY };
			pointerStartValueRef.current = state.displayedValue;
			pointerDragActiveRef.current = false;
			e.currentTarget.setPointerCapture(e.pointerId);
		},
		[disabled, state],
	);

	const handlePointerMove = useCallback(
		(e: PointerEvent<HTMLDivElement>) => {
			if (pointerIdRef.current !== e.pointerId) return;
			if (disabled || state.midiLearn.interactionLocked) return;
			if (!pointerDragActiveRef.current) {
				const start = pointerStartRef.current;
				if (!start) return;
				const dx = e.clientX - start.x;
				const dy = e.clientY - start.y;
				if (Math.hypot(dx, dy) < 2) {
					return;
				}
				pointerDragActiveRef.current = true;
				setDragging(true);
			}
			e.preventDefault();
			state.handleControlChange(
				controlToValue(
					e.clientX,
					e.clientY,
					e.shiftKey,
					pointerStartValueRef.current,
				),
			);
		},
		[controlToValue, disabled, state],
	);

	const handlePointerUp = useCallback(() => {
		pointerIdRef.current = null;
		pointerStartRef.current = null;
		pointerStartValueRef.current = state.displayedValue;
		pointerDragActiveRef.current = false;
		setDragging(false);
	}, [state.displayedValue]);

	const handleWheel = useCallback(
		(e: WheelEvent<HTMLDivElement>) => {
			if (disabled || state.midiLearn.interactionLocked) return;
			e.preventDefault();
			nudge(e.deltaY < 0 ? 1 : -1, e.shiftKey);
		},
		[disabled, nudge, state.midiLearn.interactionLocked],
	);

	const handleKeyDown = useCallback(
		(e: KeyboardEvent<HTMLDivElement>) => {
			if (disabled) return;
			if (state.midiLearn.interactionLocked) {
				if (e.key === "Enter" || e.key === " ") {
					e.preventDefault();
					state.midiLearn.onClick?.();
				}
				return;
			}

			if (e.key === "ArrowUp" || e.key === "ArrowRight" || e.key === "PageUp") {
				e.preventDefault();
				nudge(1, e.shiftKey);
			}
			if (
				e.key === "ArrowDown" ||
				e.key === "ArrowLeft" ||
				e.key === "PageDown"
			) {
				e.preventDefault();
				nudge(-1, e.shiftKey);
			}
			if (e.key === "Home") {
				e.preventDefault();
				state.handleControlChange(state.controlMin);
			}
			if (e.key === "End") {
				e.preventDefault();
				state.handleControlChange(state.controlMax);
			}
		},
		[disabled, nudge, state],
	);

	const ticks = useMemo(() => {
		if (!showTicks) return [];
		const count = 13;
		return Array.from({ length: count }).map((_, i) => {
			const p = i / (count - 1);
			const tickValue = state.controlMin + (1 - p) * safeRange;
			const isMajor = i % majorTickEvery === 0;
			return { p, tickValue, isMajor };
		});
	}, [majorTickEvery, safeRange, showTicks, state.controlMin]);

	const slider = (
		<div
			ref={containerRef}
			className={`relative select-none ${disabled ? "opacity-50" : ""} ${className}`.trim()}
			onPointerEnter={() => {
				setHovered((wasHovered) => {
					if (!wasHovered) {
						setHoverSession((session) => session + 1);
					}
					return true;
				});
			}}
			onPointerLeave={() => setHovered(false)}
		>
			{label ? (
				<div
					className={`mb-1 text-center font-semibold text-[0.58rem] text-cz-cream uppercase tracking-[0.2em] ${labelClassName ?? ""}`.trim()}
				>
					{label}
				</div>
			) : null}

			<div
				ref={rootRef}
				role="slider"
				tabIndex={disabled ? -1 : 0}
				aria-label={resolvedLabel}
				aria-valuemin={state.controlMin}
				aria-valuemax={state.controlMax}
				aria-valuenow={state.displayedValue}
				onPointerDown={beginPointer}
				onPointerMove={handlePointerMove}
				onPointerUp={handlePointerUp}
				onPointerCancel={handlePointerUp}
				onLostPointerCapture={handlePointerUp}
				onWheel={handleWheel}
				onKeyDown={handleKeyDown}
				onDoubleClick={() =>
					state.handleControlChange(
						state.controlDefaultValue ?? state.controlMin,
					)
				}
				onClick={state.midiLearn.onClick}
				onContextMenu={state.midiLearn.onContextMenu}
				data-hover-info={resolvedTooltip}
				{...hoverHandlers}
				className={`relative rounded-md border border-cz-border/80 bg-cz-inset/85 shadow-inner ${
					orientation === "vertical"
						? "mx-auto cursor-ns-resize"
						: "cursor-ew-resize"
				}`}
				style={{
					touchAction: "none",
					width:
						orientation === "vertical" ? thickness : (trackLength ?? "100%"),
					height: orientation === "vertical" ? length : thickness,
				}}
			>
				<div aria-hidden="true" className="absolute inset-0 rounded-md" />

				<div
					aria-hidden="true"
					className="absolute rounded-sm"
					style={(() => {
						if (orientation === "vertical") {
							if (isBipolarVisual) {
								const start = Math.min(normalized, zeroNormalized);
								const span = Math.abs(normalized - zeroNormalized);
								return {
									left: 3,
									right: 3,
									bottom: `calc(3px + (100% - 6px) * ${start})`,
									height: `max(calc((100% - 6px) * ${span}), 1px)`,
									minHeight: 0,
									background: color,
								};
							}
							return {
								left: 3,
								right: 3,
								bottom: 3,
								height: `calc(${fillPercent}% - 3px)`,
								minHeight: 0,
								background: color,
							};
						}

						if (isBipolarVisual) {
							const start = Math.min(normalized, zeroNormalized);
							const span = Math.abs(normalized - zeroNormalized);
							return {
								top: 3,
								bottom: 3,
								left: `calc(3px + (100% - 6px) * ${start})`,
								width: `max(calc((100% - 6px) * ${span}), 1px)`,
								minWidth: 0,
								background: color,
							};
						}
						return {
							top: 3,
							bottom: 3,
							left: 3,
							width: `calc(${fillPercent}% - 3px)`,
							minWidth: 0,
							background: color,
						};
					})()}
				/>

				<div
					aria-hidden="true"
					className="absolute rounded-sm border border-cz-border/70 bg-cz-gold shadow-md"
					style={
						orientation === "vertical"
							? {
									width: capSize.w,
									height: capSize.h,
									left: "50%",
									bottom: `calc(${fillPercent}% - ${capSize.h / 2}px)`,
									transform: "translateX(-50%)",
								}
							: {
									width: capSize.w,
									height: capSize.h,
									top: "50%",
									left: `calc(${fillPercent}% - ${capSize.w / 2}px)`,
									transform: "translateY(-50%)",
								}
					}
				/>

				{centerMarker ? (
					<div
						aria-hidden="true"
						className="pointer-events-none absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cz-cream/80 bg-cz-panel shadow-[0_0_6px_rgba(255,255,255,0.35)]"
						style={{ width: 6, height: 6 }}
					/>
				) : null}
			</div>

			{showTicks ? (
				<div
					className={`pointer-events-none absolute text-cz-cream/75 ${
						orientation === "vertical"
							? "top-5 -right-4.5 bottom-0 w-4"
							: "right-0 -bottom-3.5 left-0 h-4"
					}`}
				>
					{ticks.map((tick) => (
						<div
							key={`${tick.p}`}
							className="absolute"
							style={
								orientation === "vertical"
									? {
											top: `${tick.p * 100}%`,
											left: 0,
											width: tick.isMajor ? 9 : 5,
											height: 1,
											background: tick.isMajor
												? "rgba(241,245,249,0.8)"
												: "rgba(241,245,249,0.45)",
											transform: "translateY(-50%)",
										}
									: {
											left: `${tick.p * 100}%`,
											top: 0,
											width: 1,
											height: tick.isMajor ? 9 : 5,
											background: tick.isMajor
												? "rgba(241,245,249,0.8)"
												: "rgba(241,245,249,0.45)",
											transform: "translateX(-50%)",
										}
							}
						/>
					))}
				</div>
			) : null}

			{showLabels && orientation === "vertical" ? (
				<div className="mt-1 text-center font-mono text-5xs text-cz-cream/80 uppercase tracking-[0.16em]">
					{formatTickLabel(state.controlMin)} /{" "}
					{formatTickLabel(state.controlMax)}
				</div>
			) : null}

			{showValueOnInteraction && (hovered || dragging) ? (
				<ControlValueTooltipPortal
					key={hoverSession}
					value={valueText}
					visible
					placement="above"
					anchorRef={containerRef}
					gapPx={14}
					onPointerEnter={() => setHovered(true)}
					onPointerLeave={() => setHovered(false)}
				/>
			) : null}
		</div>
	);

	if (state.modDestinationResolved) {
		return (
			<ModulatableControl destinationId={state.modDestinationResolved}>
				{slider}
			</ModulatableControl>
		);
	}

	return slider;
}

const SynthParamSlider = memo(SynthParamSliderInner);

export default SynthParamSlider;
