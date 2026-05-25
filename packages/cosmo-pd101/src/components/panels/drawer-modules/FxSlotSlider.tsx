import { useCallback, useRef, useState } from "react";
import ModulatableControl from "@/components/controls/modulation/ModulatableControl";
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
}: FxSlotSliderProps) {
	const rootRef = useRef<HTMLDivElement>(null);
	const [hovered, setHovered] = useState(false);
	const [dragging, setDragging] = useState(false);
	const range = Math.max(max - min, 1e-6);
	const normalized = clamp((value - min) / range, 0, 1);
	const fillPercent = normalized * 100;
	const centerValue = (min + max) / 2;
	const hoverHandlers = useHoverInfoHandlers(tooltip);
	const midiLearn = useMidiLearnTarget({
		targetKey: midiTargetKey,
		label: midiLabel,
		apply: (rawValue) => onChange(min + (rawValue / 127) * (max - min)),
	});

	const mapPointerToValue = useCallback(
		(clientX: number, clientY: number, shiftKey: boolean) => {
			const rect = rootRef.current?.getBoundingClientRect();
			if (!rect) return value;
			const ratio =
				orientation === "vertical"
					? 1 - clamp((clientY - rect.top) / Math.max(rect.height, 1), 0, 1)
					: clamp((clientX - rect.left) / Math.max(rect.width, 1), 0, 1);
			const usedStep = shiftKey ? Math.max(step * 0.2, step / 10) : step;
			let next = min + ratio * (max - min);
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
		<div className="relative select-none">
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
					setDragging(true);
					e.currentTarget.setPointerCapture(e.pointerId);
					onChange(mapPointerToValue(e.clientX, e.clientY, e.shiftKey));
				}}
				onPointerMove={(e) => {
					if (!dragging || midiLearn.interactionLocked) return;
					onChange(mapPointerToValue(e.clientX, e.clientY, e.shiftKey));
				}}
				onPointerUp={() => setDragging(false)}
				onPointerCancel={() => setDragging(false)}
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
				onMouseEnter={() => setHovered(true)}
				onMouseLeave={() => setHovered(false)}
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
				<div
					className="absolute inset-0 rounded-md"
					style={{
						background:
							orientation === "vertical"
								? "linear-gradient(to bottom, rgba(18,21,24,0.95), rgba(36,41,45,0.92))"
								: "linear-gradient(to right, rgba(18,21,24,0.95), rgba(36,41,45,0.92))",
					}}
				/>
				<div
					className="absolute rounded-sm"
					style={
						orientation === "vertical"
							? {
									left: 3,
									right: 3,
									bottom: 3,
									height: `calc(${fillPercent}% - 3px)`,
									background: color,
								}
							: {
									top: 3,
									bottom: 3,
									left: 3,
									width: `calc(${fillPercent}% - 3px)`,
									background: color,
								}
					}
				/>
			</div>
			{(hovered || dragging) && valueFormatter ? (
				<div className="pointer-events-none absolute top-[-1.1rem] left-1/2 -translate-x-1/2 rounded border border-cz-border/70 bg-cz-panel/95 px-1.5 py-0.5 font-mono text-[0.52rem] text-cz-cream shadow-md">
					{valueFormatter(value)}
				</div>
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
