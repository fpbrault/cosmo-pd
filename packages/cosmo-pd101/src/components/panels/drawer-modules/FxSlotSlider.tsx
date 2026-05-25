import { useCallback, useRef, useState } from "react";
import { ControlValueTooltipPortal } from "@/components/controls/ControlValueTooltip";
import ModulatableControl from "@/components/controls/modulation/ModulatableControl";
import {
	mapPointerDeltaWithCurve,
	type SliderCurveMode,
} from "@/components/controls/sliderInteractionCurve";
import { useHoverInfoHandlers } from "@/components/layout/HoverInfo";
import { useMidiLearnTarget } from "@/features/synth/hooks/useMidiLearnTarget";
import type { ModDestination } from "@/lib/synth/bindings/synth";

type Orientation = "vertical" | "horizontal";

type FxSlotSliderProps = {
	value: number;
	min: number;
	max: number;
	step?: number;
	onChange: (value: number) => void;
	orientation: Orientation;
	label?: string;
	tooltip?: string;
	modDestination?: ModDestination;
	midiTargetKey?: string;
	midiLabel?: string;
	trackLength?: number;
	trackThickness?: number;
	color?: string;
	centerDetent?: boolean;
	centerDetentThreshold?: number;
	valueFormatter?: (value: number) => string;
	curveMode?: SliderCurveMode;
};

function clamp(v: number, min: number, max: number) {
	return Math.max(min, Math.min(max, v));
}

export default function FxSlotSlider({
	value,
	min,
	max,
	step = 0.1,
	onChange,
	orientation,
	label,
	tooltip,
	modDestination,
	midiTargetKey,
	midiLabel,
	trackLength,
	trackThickness,
	color = "#fbbf24",
	centerDetent = false,
	centerDetentThreshold = 0.35,
	valueFormatter,
	curveMode = "linear",
}: FxSlotSliderProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const rootRef = useRef<HTMLDivElement>(null);
	const pointerIdRef = useRef<number | null>(null);
	const pointerStartRef = useRef<{ x: number; y: number } | null>(null);
	const pointerStartValueRef = useRef(value);
	const pointerDragActiveRef = useRef(false);
	const [hovered, setHovered] = useState(false);
	const [dragging, setDragging] = useState(false);
	const [hoverSession, setHoverSession] = useState(0);
	const range = Math.max(max - min, 1e-6);
	const normalized = clamp((value - min) / range, 0, 1);
	const isBipolarVisual = min < 0 && max > 0;
	const zeroNormalized = clamp((0 - min) / range, 0, 1);
	const fillPercent = normalized * 100;
	const centerValue = (min + max) / 2;
	const hoverHandlers = useHoverInfoHandlers(tooltip);
	const midiLearn = useMidiLearnTarget({
		targetKey: midiTargetKey,
		label: midiLabel,
		apply: (rawValue) => onChange(min + (rawValue / 127) * (max - min)),
	});

	const mapPointerToValue = useCallback(
		(
			clientX: number,
			clientY: number,
			shiftKey: boolean,
			startValue: number,
		) => {
			const rect = rootRef.current?.getBoundingClientRect();
			if (!rect) return value;
			const usedStep = shiftKey ? Math.max(step * 0.2, step / 10) : step;
			const start = pointerStartRef.current;
			if (!start) return value;
			const deltaPx =
				orientation === "vertical" ? start.y - clientY : clientX - start.x;
			const trackPx =
				orientation === "vertical"
					? Math.max(rect.height, 1)
					: Math.max(rect.width, 1);
			let next = mapPointerDeltaWithCurve({
				startValue,
				deltaPx,
				trackPx,
				curveMode,
				min,
				max,
			});
			next = Math.round((next - min) / usedStep) * usedStep + min;
			if (
				centerDetent &&
				Math.abs(next - centerValue) <= centerDetentThreshold
			) {
				next = centerValue;
			}
			return clamp(next, min, max);
		},
		[
			centerDetent,
			centerDetentThreshold,
			centerValue,
			max,
			min,
			orientation,
			step,
			value,
			curveMode,
		],
	);

	const nudge = useCallback(
		(direction: 1 | -1, fine: boolean) => {
			const usedStep = fine ? Math.max(step * 0.2, step / 10) : step;
			let next = value + direction * usedStep;
			next = Math.round((next - min) / usedStep) * usedStep + min;
			if (
				centerDetent &&
				Math.abs(next - centerValue) <= centerDetentThreshold
			) {
				next = centerValue;
			}
			onChange(clamp(next, min, max));
		},
		[
			centerDetent,
			centerDetentThreshold,
			centerValue,
			max,
			min,
			onChange,
			step,
			value,
		],
	);

	const control = (
		<div
			ref={containerRef}
			className="relative select-none"
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
				<div className="mb-1 text-center font-semibold text-[0.58rem] text-cz-cream uppercase tracking-[0.2em]">
					{label}
				</div>
			) : null}
			<div
				ref={rootRef}
				role="slider"
				tabIndex={0}
				aria-label={label ?? "FX Slider"}
				aria-valuemin={min}
				aria-valuemax={max}
				aria-valuenow={value}
				onPointerDown={(e) => {
					if (midiLearn.interactionLocked) return;
					pointerIdRef.current = e.pointerId;
					pointerStartRef.current = { x: e.clientX, y: e.clientY };
					pointerStartValueRef.current = value;
					pointerDragActiveRef.current = false;
					e.currentTarget.setPointerCapture(e.pointerId);
				}}
				onPointerMove={(e) => {
					if (
						pointerIdRef.current !== e.pointerId ||
						midiLearn.interactionLocked
					) {
						return;
					}
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
					onChange(
						mapPointerToValue(
							e.clientX,
							e.clientY,
							e.shiftKey,
							pointerStartValueRef.current,
						),
					);
				}}
				onPointerUp={() => {
					pointerIdRef.current = null;
					pointerStartRef.current = null;
					pointerStartValueRef.current = value;
					pointerDragActiveRef.current = false;
					setDragging(false);
				}}
				onPointerCancel={() => {
					pointerIdRef.current = null;
					pointerStartRef.current = null;
					pointerStartValueRef.current = value;
					pointerDragActiveRef.current = false;
					setDragging(false);
				}}
				onLostPointerCapture={() => {
					pointerIdRef.current = null;
					pointerStartRef.current = null;
					pointerStartValueRef.current = value;
					pointerDragActiveRef.current = false;
					setDragging(false);
				}}
				onWheel={(e) => {
					e.preventDefault();
					if (midiLearn.interactionLocked) return;
					nudge(e.deltaY < 0 ? 1 : -1, e.shiftKey);
				}}
				onKeyDown={(e) => {
					if (midiLearn.interactionLocked) return;
					if (e.key === "ArrowUp" || e.key === "ArrowRight") {
						e.preventDefault();
						nudge(1, e.shiftKey);
					}
					if (e.key === "ArrowDown" || e.key === "ArrowLeft") {
						e.preventDefault();
						nudge(-1, e.shiftKey);
					}
				}}
				onDoubleClick={() => onChange(centerDetent ? centerValue : min)}
				onClick={midiLearn.onClick}
				onContextMenu={midiLearn.onContextMenu}
				data-hover-info={tooltip}
				{...hoverHandlers}
				className={`relative rounded-md border border-cz-border/80 bg-cz-inset/85 shadow-inner ${
					orientation === "vertical"
						? "mx-auto cursor-ns-resize"
						: "cursor-ew-resize"
				}`}
				style={{
					touchAction: "none",
					width:
						orientation === "vertical"
							? (trackThickness ?? 20)
							: (trackLength ?? 260),
					height:
						orientation === "vertical"
							? (trackLength ?? 122)
							: (trackThickness ?? 20),
				}}
			>
				<div className="absolute inset-0 rounded-md" />
				<div
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
									background: color,
								};
							}
							return {
								left: 3,
								right: 3,
								bottom: 3,
								height: `calc(${fillPercent}% - 3px)`,
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
								background: color,
							};
						}
						return {
							top: 3,
							bottom: 3,
							left: 3,
							width: `calc(${fillPercent}% - 3px)`,
							background: color,
						};
					})()}
				/>
			</div>
			{(hovered || dragging) && valueFormatter ? (
				<ControlValueTooltipPortal
					key={hoverSession}
					value={valueFormatter(value)}
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

	if (modDestination) {
		return (
			<ModulatableControl destinationId={modDestination}>
				{control}
			</ModulatableControl>
		);
	}

	return control;
}
