import {
	type ReactNode,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
import Button from "@/components/controls/Button";
import ModulatableControl from "@/components/controls/modulation/ModulatableControl";
import { useOptionalSynthController } from "@/features/synth/SynthParamController";
import type { ModDestination } from "@/lib/synth/bindings/synth";
import {
	type ModTarget,
	resolveModDestination,
} from "@/lib/synth/modDestination";
import { useHoverInfo, useHoverInfoHandlers } from "../layout/HoverInfo";
import { type KnobVariant, KnobView } from "./knob/KnobView";
import {
	bipolarCenterNorm,
	clampValue,
	DEFAULT_ARC_GEOMETRY,
	type KnobCurve,
	normalizeValueCurved,
} from "./knob/knobGeometry";
import { useKnobInteraction } from "./knob/useKnobInteraction";

export interface ControlKnobProps {
	value: number;
	onChange: (value: number) => void;
	disabled?: boolean;
	min?: number;
	max?: number;
	/** Quantize to nearest step. Undefined = continuous. */
	step?: number;
	label?: string;
	labelClassName?: string;
	tooltip?: string;
	/** Semantic color variant. Prefer this over `color`. */
	variant?: KnobVariant;
	className?: string;
	/**
	 * Raw CSS color override (migration escape hatch).
	 * Maps to `--knob-value-color` and `--knob-indicator-color`.
	 * Prefer `variant` for new code.
	 */
	color?: string;
	size?: number;
	valueFormatter?: (value: number) => string;
	valueVisibility?: "always" | "hover" | "never";
	defaultValue?: number;
	/** When true, renders a bipolar arc anchored at value = 0. */
	bipolar?: boolean;
	/** Pixels of vertical drag to traverse the full range. Default 200. */
	sensitivity?: number;
	/** Sensitivity divisor when Shift is held. Default 5. */
	fineSensitivity?: number;
	/** Normalized step per wheel tick. Default 0.01. */
	wheelStep?: number;
	/** Normalized step per wheel tick with Shift. Default 0.002. */
	fineWheelStep?: number;
	/** HTML content rendered as a centered overlay on the knob face. */
	children?: ReactNode;
	/**
	 * Simple modulation opt-in: set this to a target key (e.g. "volume" or
	 * line-scoped values like "dcwBase") and the destination is resolved
	 * automatically.
	 */
	modulatable?: ModTarget;
	/** Line context for line-scoped targets (defaults to line 1). */
	lineIndex?: 1 | 2;
	/** When provided, wraps the knob in a ModulatableControl for this destination. */
	modDestination?: ModDestination;
	/** Final value after modulation, used only for indicator rendering. */
	modulatedValue?: number;
	/** How long (ms) each trail dot persists. Set to 0 to disable trail. */
	modTrailDuration?: number;
	/** Non-linear scaling curve for pointer/wheel interaction and rendered position. */
	curve?: KnobCurve;
}

const VARIANT_ACCENT_COLOR: Record<
	NonNullable<ControlKnobProps["variant"]>,
	string
> = {
	default: "var(--color-cz-gold)",
	accent: "var(--color-cz-light-blue)",
	muted: "rgba(191, 189, 48, 0.5)",
	light: "#a0a0a0",
	dark: "var(--color-cz-gold)",
};

export function ControlKnob({
	value,
	onChange,
	disabled = false,
	min = 0,
	max = 1,
	step,
	label,
	labelClassName,
	tooltip,
	variant = "dark",
	className,
	color,
	size = 80,
	valueFormatter,
	valueVisibility = "hover",
	defaultValue,
	bipolar = false,
	sensitivity,
	fineSensitivity,
	wheelStep,
	fineWheelStep,
	children,
	modulatable,
	lineIndex = 1,
	modDestination,
	modulatedValue,
	modTrailDuration = 220,
	curve = "linear",
}: ControlKnobProps) {
	const svgRef = useRef<SVGSVGElement | null>(null);
	const buttonRef = useRef<HTMLButtonElement | null>(null);
	const [hovered, setHovered] = useState(false);
	const [, setModulationTick] = useState(0);
	const { setControlReadout } = useHoverInfo();
	const resolvedTooltip = tooltip?.trim() ? tooltip : label?.trim();
	const readoutRafRef = useRef<number | null>(null);
	const pendingReadoutRef = useRef<{ label: string; value: string } | null>(
		null,
	);

	useEffect(() => {
		return () => {
			if (readoutRafRef.current !== null) {
				cancelAnimationFrame(readoutRafRef.current);
			}
		};
	}, []);

	const formatDisplayValue = useCallback(
		(nextValue: number) => {
			if (valueFormatter) {
				return valueFormatter(nextValue);
			}

			return Number.isInteger(nextValue)
				? `${nextValue}`
				: nextValue?.toFixed(2);
		},
		[valueFormatter],
	);
	const emitChange = useCallback(
		(nextValue: number) => {
			onChange(nextValue);
			pendingReadoutRef.current = {
				label: label ?? "Value",
				value: formatDisplayValue(nextValue),
			};
			if (readoutRafRef.current === null) {
				readoutRafRef.current = requestAnimationFrame(() => {
					readoutRafRef.current = null;
					if (pendingReadoutRef.current) {
						setControlReadout(pendingReadoutRef.current);
					}
				});
			}
		},
		[formatDisplayValue, label, onChange, setControlReadout],
	);

	const {
		dragging,
		editing,
		editValue,
		inputRef,
		onPointerDown,
		onPointerMove,
		onPointerUp,
		onPointerCancel,
		onLostPointerCapture,
		onDoubleClick,
		onKeyDown,
		beginEdit,
		setEditValue,
		onEditKeyDown,
		onEditBlur,
	} = useKnobInteraction({
		value,
		min,
		max,
		step,
		defaultValue,
		sensitivity,
		fineSensitivity,
		wheelStep,
		fineWheelStep,
		disabled,
		onChange: emitChange,
		svgRef,
		buttonRef,
		curve,
	});

	const maybeSynthController = useOptionalSynthController();

	const resolvedDestination =
		modDestination ??
		maybeSynthController?.resolveDestination(modulatable, { lineIndex }) ??
		resolveModDestination(modulatable, { lineIndex });

	useEffect(() => {
		if (!maybeSynthController || modulatedValue !== undefined) {
			return;
		}

		if (!resolvedDestination) {
			return;
		}

		if (!maybeSynthController.hasActiveRoutes(resolvedDestination)) {
			return;
		}

		const onRuntimeModSources = () => {
			setModulationTick((tick) => (tick + 1) % 1_000_000);
		};

		window.addEventListener("cz-runtime-mod-sources", onRuntimeModSources);
		return () => {
			window.removeEventListener("cz-runtime-mod-sources", onRuntimeModSources);
		};
	}, [maybeSynthController, resolvedDestination, modulatedValue]);

	const computedModulatedValue = maybeSynthController?.getModulatedValue({
		destination: resolvedDestination,
		baseValue: value,
	});
	const effectiveModulatedValue = modulatedValue ?? computedModulatedValue;

	// Normalize the effective modulated value for KnobView
	const modulatedNorm =
		effectiveModulatedValue !== undefined && effectiveModulatedValue !== null
			? normalizeValueCurved(
					clampValue(effectiveModulatedValue, min, max),
					min,
					max,
					curve,
				)
			: undefined;

	const normalizedValue = normalizeValueCurved(value, min, max, curve);
	const bipolarNorm = bipolar ? bipolarCenterNorm(min, max) : null;
	const arcOuterPx =
		((DEFAULT_ARC_GEOMETRY.radius + DEFAULT_ARC_GEOMETRY.trackWidth / 2) /
			DEFAULT_ARC_GEOMETRY.viewBoxSize) *
		size;
	const modButtonOffsetY = Math.round(arcOuterPx * 1.2);

	// Crop empty SVG space below the arc track
	const bottomDeadPx = Math.round(
		((DEFAULT_ARC_GEOMETRY.viewBoxSize -
			DEFAULT_ARC_GEOMETRY.cy -
			DEFAULT_ARC_GEOMETRY.radius -
			DEFAULT_ARC_GEOMETRY.trackWidth / 2) /
			DEFAULT_ARC_GEOMETRY.viewBoxSize) *
			size,
	);

	const displayValue = valueFormatter
		? valueFormatter(value)
		: value.toFixed(2);
	const valueControlLabel = label ? `${label} value` : "knob value";
	const hoverHandlers = useHoverInfoHandlers(resolvedTooltip, {
		useCapture: true,
	});

	const valueIndicatorEl =
		valueVisibility !== "never" ? (
			<div
				className="pointer-events-none flex items-center justify-center"
				onPointerEnter={() => setHovered(true)}
				onPointerLeave={() => setHovered(false)}
			>
				{editing ? (
					<input
						ref={inputRef as React.RefObject<HTMLInputElement>}
						type="text"
						aria-label={valueControlLabel}
						className="pointer-events-auto w-16 rounded-sm border border-base-content/25 bg-base-300/95 px-1.5 py-0.5 text-center font-semibold text-2xs text-base-content shadow-[0_2px_6px_rgba(0,0,0,0.5)] outline-none focus:border-primary"
						value={editValue}
						onChange={(e) => setEditValue(e.target.value)}
						onBlur={onEditBlur}
						onKeyDown={onEditKeyDown}
					/>
				) : (
					<Button
						type="button"
						aria-label={valueControlLabel}
						className={`pointer-events-auto whitespace-nowrap rounded-sm border px-1.5 py-0.5 font-semibold text-2xs leading-none shadow-[0_2px_6px_rgba(0,0,0,0.5)] transition-all duration-150 ${
							disabled
								? "cursor-not-allowed border-base-content/15 bg-base-300/85 text-base-content/50"
								: "cursor-pointer border-base-content/25 bg-base-300/95 text-base-content/80 hover:text-base-content"
						} ${
							valueVisibility === "always" || dragging || hovered
								? "translate-y-0 opacity-100"
								: "translate-y-1 opacity-0 group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:translate-y-0 group-hover:opacity-100"
						}`}
						disabled={disabled}
						onDoubleClick={(e) => {
							e.preventDefault();
							e.stopPropagation();
							beginEdit(displayValue);
						}}
					>
						{displayValue}
					</Button>
				)}
			</div>
		) : null;

	const knobButton = (
		<div className="relative" style={{ marginBottom: -bottomDeadPx }}>
			<Button
				ref={buttonRef}
				type="button"
				role="spinbutton"
				className={`block touch-none rounded-full p-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-base-content/30 disabled:border-transparent! disabled:bg-transparent! disabled:shadow-none! ${
					disabled
						? "cursor-not-allowed opacity-60"
						: "cursor-grab active:cursor-grabbing"
				}`}
				aria-label={label ?? "knob"}
				aria-valuemin={min}
				aria-valuemax={max}
				aria-valuenow={value}
				aria-valuetext={displayValue}
				aria-disabled={disabled}
				disabled={disabled}
				onPointerEnter={() => setHovered(true)}
				onPointerLeave={() => setHovered(false)}
				onFocus={() => setHovered(true)}
				onBlur={() => setHovered(false)}
				onPointerDown={onPointerDown}
				onPointerMove={onPointerMove}
				onPointerUp={onPointerUp}
				onPointerCancel={onPointerCancel}
				onLostPointerCapture={onLostPointerCapture}
				onDoubleClick={onDoubleClick}
				onKeyDown={onKeyDown}
			>
				<KnobView
					normalizedValue={normalizedValue}
					bipolarNorm={bipolarNorm}
					modulatedNorm={modulatedNorm}
					variant={variant}
					colorOverride={color}
					size={size}
					hovered={hovered}
					modTrailDuration={modTrailDuration}
					htmlOverlay={children}
					svgRef={svgRef}
				/>
			</Button>
		</div>
	);

	const labelEl = label ? (
		<div
			className={`flex items-center justify-center text-4xs text-base-content/55 uppercase tracking-[0.24em] ${labelClassName ?? ""}`}
		>
			<span>{label}</span>
		</div>
	) : null;

	const inner = (
		<div
			className={`group relative flex flex-col items-center gap-0.5 text-center ${className ?? ""}`}
			data-hover-info={resolvedTooltip}
			{...hoverHandlers}
		>
			{resolvedDestination ? (
				<ModulatableControl
					destinationId={resolvedDestination}
					label={label}
					accentColor={color ?? VARIANT_ACCENT_COLOR[variant]}
					iconButtonStyle={{
						left: "50%",
						top: `calc(50% - ${modButtonOffsetY}px)`,
					}}
				>
					{knobButton}
				</ModulatableControl>
			) : (
				knobButton
			)}
			{labelEl}
			<div className="relative h-0 w-full">
				<div className="absolute top-0 left-1/2 z-20 -translate-x-1/2">
					{valueIndicatorEl}
				</div>
			</div>
		</div>
	);

	return inner;
}

export default ControlKnob;
