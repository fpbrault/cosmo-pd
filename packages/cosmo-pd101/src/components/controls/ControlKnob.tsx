import {
	type CSSProperties,
	type MutableRefObject,
	type ReactNode,
	useCallback,
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { createPortal } from "react-dom";
import Button from "@/components/controls/Button";
import { getControlValueTooltipClassName } from "@/components/controls/ControlValueTooltip";
import ModulatableControl from "@/components/controls/modulation/ModulatableControl";
import { useOptionalSynthController } from "@/features/synth/SynthParamController";
import type { ModDestination } from "@/lib/synth/bindings/synth";
import {
	type ModTarget,
	resolveModDestination,
} from "@/lib/synth/modDestination";
import { useHoverInfo, useHoverInfoHandlers } from "../layout/HoverInfo";
import KnobView, { type KnobVariant } from "./knob/KnobView";
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
	labelAccessory?: ReactNode;
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
	/** Right-click handler. Used by MIDI Learn to unlearn bindings. */
	onContextMenu?: (e: React.MouseEvent) => void;
	/** Click handler. Used by MIDI Learn to select mapping targets. */
	onClick?: (e: React.MouseEvent) => void;
	/** When true, blocks knob value edits while preserving click handling. */
	interactionLocked?: boolean;
	/** Visual learn-mode hint state. */
	midiLearnState?: "available" | "mapped" | "targeted" | null;
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

const VALUE_BUBBLE_REVEAL_DELAY_MS = 180;
const VALUE_BUBBLE_EDGE_PADDING_PX = 8;
const VALUE_BUBBLE_GAP_PX = 20;
const VALUE_BUBBLE_ARROW_HALF_WIDTH_PX = 5;
const VALUE_BUBBLE_LEAVE_GRACE_MS = 120;

function extractFirstNumber(text: string): number | null {
	const match = text.match(/[-+]?\d*\.?\d+/);
	if (!match) {
		return null;
	}
	const parsed = Number.parseFloat(match[0]);
	return Number.isFinite(parsed) ? parsed : null;
}

type ValueBubblePlacement = "above" | "below";

type ValueBubbleLayout = {
	top: number;
	left: number;
	arrowLeft: number;
	placement: ValueBubblePlacement;
	ready: boolean;
};

export default function ControlKnob({
	value,
	onChange,
	disabled = false,
	min = 0,
	max = 1,
	step,
	label,
	labelClassName,
	labelAccessory,
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
	onContextMenu,
	onClick,
	interactionLocked = false,
	midiLearnState = null,
}: ControlKnobProps) {
	const svgRef = useRef<SVGSVGElement | null>(null);
	const buttonRef = useRef<HTMLButtonElement | null>(null);
	const valueBubbleRef = useRef<
		HTMLDivElement | HTMLButtonElement | HTMLInputElement | null
	>(null);
	const revealTimerRef = useRef<number | null>(null);
	const hoverLeaveTimerRef = useRef<number | null>(null);
	const [hovered, setHovered] = useState(false);
	const [passiveHovered, setPassiveHovered] = useState(false);
	const [bubblePinned, setBubblePinned] = useState(false);
	const [passiveRevealReady, setPassiveRevealReady] = useState(false);
	const [valueBubbleLayout, setValueBubbleLayout] = useState<ValueBubbleLayout>(
		{
			top: 0,
			left: 0,
			arrowLeft: 0,
			placement: "above",
			ready: false,
		},
	);
	const [, setModulationTick] = useState(0);
	const resolvedTooltip = tooltip?.trim() ? tooltip : label?.trim();
	const emitChange = useCallback(
		(nextValue: number) => {
			onChange(nextValue);
		},
		[onChange],
	);
	const displayValue = valueFormatter
		? valueFormatter(value)
		: value.toFixed(2);
	const parseDisplayValue = useMemo(() => {
		if (!valueFormatter) {
			return undefined;
		}

		const getDisplayNumber = (raw: number) =>
			extractFirstNumber(valueFormatter(raw));
		const currentDisplay = getDisplayNumber(value);
		const maxDisplay = getDisplayNumber(max);
		const minDisplay = getDisplayNumber(min);

		let scale: number | null = null;
		if (currentDisplay !== null && Math.abs(currentDisplay) > 1e-9) {
			scale = value / currentDisplay;
		} else if (maxDisplay !== null && Math.abs(maxDisplay) > 1e-9) {
			scale = max / maxDisplay;
		} else if (minDisplay !== null && Math.abs(minDisplay) > 1e-9) {
			scale = min / minDisplay;
		}

		const fallbackPercentScale =
			displayValue.includes("%") && min >= -1 && max <= 1 ? 0.01 : 1;
		const resolvedScale = scale ?? fallbackPercentScale;

		return (input: string): number | null => {
			const parsed = extractFirstNumber(input);
			if (parsed === null) {
				return null;
			}
			return parsed * resolvedScale;
		};
	}, [displayValue, max, min, value, valueFormatter]);

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
		parseDisplayValue,
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
		min,
		max,
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

	// Crop empty SVG space below the arc track
	const bottomDeadPx = Math.round(
		((DEFAULT_ARC_GEOMETRY.viewBoxSize -
			DEFAULT_ARC_GEOMETRY.cy -
			DEFAULT_ARC_GEOMETRY.radius -
			DEFAULT_ARC_GEOMETRY.trackWidth / 2) /
			DEFAULT_ARC_GEOMETRY.viewBoxSize) *
			size,
	);
	const topDeadPx = Math.round((8 / DEFAULT_ARC_GEOMETRY.viewBoxSize) * size);

	const valueControlLabel = label ? `${label} value` : "knob value";
	const { setHoverInfo, clearHoverInfo } = useHoverInfo();
	const hoverHandlers = useHoverInfoHandlers(resolvedTooltip, {
		useCapture: true,
	});

	const immediateBubbleVisible =
		valueVisibility === "always" || dragging || editing;
	const passiveBubbleActive = passiveHovered || bubblePinned;

	const clearHoverLeaveTimer = useCallback(() => {
		if (hoverLeaveTimerRef.current !== null) {
			window.clearTimeout(hoverLeaveTimerRef.current);
			hoverLeaveTimerRef.current = null;
		}
	}, []);

	const schedulePassiveHoverClear = useCallback(() => {
		clearHoverLeaveTimer();
		hoverLeaveTimerRef.current = window.setTimeout(() => {
			setPassiveHovered(false);
			setBubblePinned(false);
			hoverLeaveTimerRef.current = null;
		}, VALUE_BUBBLE_LEAVE_GRACE_MS);
	}, [clearHoverLeaveTimer]);

	useEffect(() => {
		return () => {
			clearHoverLeaveTimer();
		};
	}, [clearHoverLeaveTimer]);

	useEffect(() => {
		if (revealTimerRef.current !== null) {
			window.clearTimeout(revealTimerRef.current);
			revealTimerRef.current = null;
		}
		if (valueVisibility === "never") {
			setPassiveRevealReady(false);
			return;
		}
		if (immediateBubbleVisible) {
			setPassiveRevealReady(true);
			return;
		}
		if (!passiveBubbleActive) {
			setPassiveRevealReady(false);
			return;
		}
		revealTimerRef.current = window.setTimeout(() => {
			setPassiveRevealReady(true);
			revealTimerRef.current = null;
		}, VALUE_BUBBLE_REVEAL_DELAY_MS);
		return () => {
			if (revealTimerRef.current !== null) {
				window.clearTimeout(revealTimerRef.current);
				revealTimerRef.current = null;
			}
		};
	}, [immediateBubbleVisible, passiveBubbleActive, valueVisibility]);

	const valueBubbleVisible = useMemo(
		() =>
			valueVisibility !== "never" &&
			(immediateBubbleVisible || passiveRevealReady),
		[immediateBubbleVisible, passiveRevealReady, valueVisibility],
	);

	const updateValueBubbleLayout = useCallback(() => {
		if (typeof window === "undefined") {
			return;
		}
		const knobEl = buttonRef.current;
		if (!knobEl?.isConnected) {
			setValueBubbleLayout((prev) =>
				prev.ready ? { ...prev, ready: false } : prev,
			);
			return;
		}
		const knobRect = knobEl?.getBoundingClientRect();
		const bubbleRect = valueBubbleRef.current?.getBoundingClientRect();
		if (!knobRect || !bubbleRect) {
			setValueBubbleLayout((prev) =>
				prev.ready ? { ...prev, ready: false } : prev,
			);
			return;
		}
		if (
			knobRect.width < 2 ||
			knobRect.height < 2 ||
			bubbleRect.width < 2 ||
			bubbleRect.height < 2
		) {
			setValueBubbleLayout((prev) =>
				prev.ready ? { ...prev, ready: false } : prev,
			);
			return;
		}
		const knobOffscreen =
			knobRect.bottom <= 0 ||
			knobRect.right <= 0 ||
			knobRect.top >= window.innerHeight ||
			knobRect.left >= window.innerWidth;
		if (knobOffscreen) {
			setValueBubbleLayout((prev) =>
				prev.ready ? { ...prev, ready: false } : prev,
			);
			return;
		}

		const bubbleWidth = bubbleRect.width;
		const bubbleHeight = bubbleRect.height;
		const knobCenterX = knobRect.left + knobRect.width / 2;
		const knobScale = size / DEFAULT_ARC_GEOMETRY.viewBoxSize;
		// Anchor the tooltip to the visible knob body (not the whole SVG/button box)
		// so the pointer sits close to the knob face.
		const knobBodyRadiusPx = DEFAULT_ARC_GEOMETRY.radius * 0.8 * knobScale;
		const knobBodyCenterYPx = DEFAULT_ARC_GEOMETRY.cy * knobScale;
		const knobBodyTop = knobRect.top + knobBodyCenterYPx - knobBodyRadiusPx;
		const knobBodyBottom = knobRect.top + knobBodyCenterYPx + knobBodyRadiusPx;
		const hasRoomAbove =
			knobBodyTop - VALUE_BUBBLE_GAP_PX - bubbleHeight >=
			VALUE_BUBBLE_EDGE_PADDING_PX;
		const placement: ValueBubblePlacement = hasRoomAbove ? "above" : "below";
		const rawLeft = knobCenterX - bubbleWidth / 2;
		const minLeft = VALUE_BUBBLE_EDGE_PADDING_PX;
		const maxLeft = Math.max(
			minLeft,
			window.innerWidth - VALUE_BUBBLE_EDGE_PADDING_PX - bubbleWidth,
		);
		const left = Math.min(Math.max(rawLeft, minLeft), maxLeft);
		const top =
			placement === "above"
				? knobBodyTop - VALUE_BUBBLE_GAP_PX - bubbleHeight
				: knobBodyBottom + VALUE_BUBBLE_GAP_PX;
		const arrowMin = VALUE_BUBBLE_ARROW_HALF_WIDTH_PX + 2;
		const arrowMax = Math.max(
			arrowMin,
			bubbleWidth - VALUE_BUBBLE_ARROW_HALF_WIDTH_PX - 2,
		);
		const arrowLeft = Math.min(
			Math.max(knobCenterX - left, arrowMin),
			arrowMax,
		);

		setValueBubbleLayout((prev) => {
			if (
				prev.top === top &&
				prev.left === left &&
				prev.arrowLeft === arrowLeft &&
				prev.placement === placement &&
				prev.ready
			) {
				return prev;
			}
			return { top, left, arrowLeft, placement, ready: true };
		});
	}, [size]);

	useLayoutEffect(() => {
		if (!valueBubbleVisible) {
			setValueBubbleLayout((prev) =>
				prev.ready ? { ...prev, ready: false } : prev,
			);
			return;
		}
		updateValueBubbleLayout();
	}, [updateValueBubbleLayout, valueBubbleVisible]);

	useEffect(() => {
		if (!valueBubbleVisible) {
			return;
		}
		const onLayoutChange = () => updateValueBubbleLayout();
		window.addEventListener("resize", onLayoutChange);
		window.addEventListener("scroll", onLayoutChange, true);
		return () => {
			window.removeEventListener("resize", onLayoutChange);
			window.removeEventListener("scroll", onLayoutChange, true);
		};
	}, [updateValueBubbleLayout, valueBubbleVisible]);

	const valueBubbleShellClass = "pointer-events-none fixed z-[9999]";
	const valueBubbleBodyClass = getControlValueTooltipClassName({
		placement: valueBubbleLayout.placement,
		visible: valueBubbleVisible,
		disabled,
	});
	const valueBubbleInteractive = valueBubbleVisible && valueBubbleLayout.ready;
	const shouldRenderValueBubbleControl = editing || valueBubbleInteractive;
	const shouldRenderValueBubbleMeasurement =
		valueBubbleVisible && !valueBubbleInteractive && !editing;
	const setValueBubbleNodeRef = useCallback(
		(node: HTMLDivElement | HTMLButtonElement | HTMLInputElement | null) => {
			valueBubbleRef.current = node;
			if (node && valueBubbleVisible) {
				requestAnimationFrame(() => {
					updateValueBubbleLayout();
				});
			}
		},
		[updateValueBubbleLayout, valueBubbleVisible],
	);
	const setValueBubbleInputRef = useCallback(
		(node: HTMLInputElement | null) => {
			setValueBubbleNodeRef(node);
			(inputRef as MutableRefObject<HTMLInputElement | null>).current = node;
		},
		[inputRef, setValueBubbleNodeRef],
	);

	const valueIndicatorEl =
		valueVisibility !== "never" ? (
			<div
				className={valueBubbleShellClass}
				data-testid="knob-value-bubble"
				data-placement={valueBubbleLayout.placement}
				style={
					{
						top:
							!valueBubbleVisible || !valueBubbleLayout.ready
								? -10000
								: valueBubbleLayout.top,
						left:
							!valueBubbleVisible || !valueBubbleLayout.ready
								? -10000
								: valueBubbleLayout.left,
					} as CSSProperties
				}
				onPointerEnter={() => {
					clearHoverLeaveTimer();
					setHovered(true);
					setPassiveHovered(true);
					setBubblePinned(true);
				}}
				onPointerLeave={() => {
					setHovered(false);
					schedulePassiveHoverClear();
				}}
			>
				{editing ? (
					<input
						ref={setValueBubbleInputRef}
						type="text"
						aria-label={valueControlLabel}
						className={`${valueBubbleBodyClass} w-16 text-center text-base-content outline-none focus:border-primary`}
						style={
							{
								"--knob-bubble-arrow-left": `${valueBubbleLayout.arrowLeft}px`,
							} as CSSProperties
						}
						value={editValue}
						onChange={(e) => setEditValue(e.target.value)}
						onBlur={onEditBlur}
						onKeyDown={onEditKeyDown}
					/>
				) : shouldRenderValueBubbleMeasurement ? (
					<div
						ref={setValueBubbleNodeRef}
						aria-hidden="true"
						className={valueBubbleBodyClass}
						style={
							{
								"--knob-bubble-arrow-left": `${valueBubbleLayout.arrowLeft}px`,
							} as CSSProperties
						}
					>
						{displayValue}
					</div>
				) : shouldRenderValueBubbleControl ? (
					<Button
						ref={setValueBubbleNodeRef}
						type="button"
						aria-label={valueControlLabel}
						className={valueBubbleBodyClass}
						style={
							{
								"--knob-bubble-arrow-left": `${valueBubbleLayout.arrowLeft}px`,
							} as CSSProperties
						}
						disabled={disabled}
						onDoubleClick={(e) => {
							e.preventDefault();
							e.stopPropagation();
							beginEdit(displayValue);
						}}
					>
						{displayValue}
					</Button>
				) : null}
			</div>
		) : null;

	const valueBubblePortalEl =
		valueIndicatorEl && typeof document !== "undefined"
			? createPortal(
					valueIndicatorEl,
					(document.fullscreenElement as Element | null) ?? document.body,
				)
			: null;

	const knobButton = (
		<div
			className="relative"
			style={{ marginTop: -topDeadPx, marginBottom: -bottomDeadPx }}
		>
			<Button
				ref={buttonRef}
				type="button"
				role="spinbutton"
				data-auv3-gesture-control
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
				onPointerEnter={() => {
					clearHoverLeaveTimer();
					setHovered(true);
					setPassiveHovered(true);
					setHoverInfo(resolvedTooltip);
				}}
				onPointerLeave={() => {
					setHovered(false);
					schedulePassiveHoverClear();
					clearHoverInfo();
				}}
				onFocus={() => {
					clearHoverLeaveTimer();
					setHovered(true);
					setPassiveHovered(true);
					setHoverInfo(resolvedTooltip);
				}}
				onBlur={() => {
					setHovered(false);
					schedulePassiveHoverClear();
					clearHoverInfo();
				}}
				onPointerDown={interactionLocked ? undefined : onPointerDown}
				onPointerMove={interactionLocked ? undefined : onPointerMove}
				onPointerUp={interactionLocked ? undefined : onPointerUp}
				onPointerCancel={interactionLocked ? undefined : onPointerCancel}
				onLostPointerCapture={
					interactionLocked ? undefined : onLostPointerCapture
				}
				onDoubleClick={interactionLocked ? undefined : onDoubleClick}
				onContextMenu={onContextMenu}
				onKeyDown={interactionLocked ? undefined : onKeyDown}
				onClick={onClick}
			>
				<KnobView
					normalizedValue={normalizedValue}
					bipolarNorm={bipolarNorm}
					modulatedNorm={modulatedNorm}
					midiLearnState={midiLearnState}
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
			className={`max-w-24 gap-1 truncate text-4xs text-base-content/55 uppercase tracking-[0.24em] ${labelClassName ?? ""}`}
		>
			<span>{label}</span>
			{labelAccessory}
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
				>
					{knobButton}
				</ModulatableControl>
			) : (
				knobButton
			)}
			{valueBubblePortalEl}
			{labelEl}
		</div>
	);

	return inner;
}
