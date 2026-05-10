import {
	type CSSProperties,
	type ReactNode,
	type RefObject,
	useId,
} from "react";
import {
	DEFAULT_ARC_GEOMETRY,
	describeArc,
	describeValuePath,
	modTargetPoint,
	polarToCartesian,
	valueToAngle,
} from "./knobGeometry";

export type KnobVariant = "default" | "accent" | "muted" | "light" | "dark";

export interface KnobViewProps {
	normalizedValue: number;
	/** Pre-computed normalized position of the bipolar zero crossing, or null. */
	bipolarNorm?: number | null;
	/** Normalized position of the modulated value; renders animated mod dot when set. */
	modulatedNorm?: number;
	variant?: KnobVariant;
	/** Escape-hatch raw CSS color; overrides the variant's value/indicator tokens. */
	colorOverride?: string;
	/** Pixel width and height of the rendered knob. */
	size?: number;
	hovered?: boolean;
	modTrailDuration?: number;
	/** HTML content rendered as a centered overlay on top of the SVG face. */
	htmlOverlay?: ReactNode;
	/** Forwarded ref for the inner SVG element (used by useKnobInteraction for coordinate transforms). */
	svgRef?: RefObject<SVGSVGElement>;
}

export function KnobView({
	normalizedValue,
	bipolarNorm = null,
	modulatedNorm,
	variant = "default",
	colorOverride,
	size = 64,
	hovered = false,
	modTrailDuration = 220,
	htmlOverlay,
	svgRef,
}: KnobViewProps) {
	const _uid = useId().replace(/:/g, "");

	const {
		cx,
		cy,
		radius,
		trackWidth,
		viewBoxSize,
		startAngle,
		sweepAngle,
		modOrbitRadius,
	} = DEFAULT_ARC_GEOMETRY;

	const safeNormalizedValue = Number.isFinite(normalizedValue)
		? normalizedValue
		: 0;
	const safeModulatedNorm =
		modulatedNorm !== undefined && Number.isFinite(modulatedNorm)
			? modulatedNorm
			: undefined;
	const trailDuration = Number.isFinite(modTrailDuration)
		? modTrailDuration > 0
			? Math.max(60, modTrailDuration)
			: 0
		: 220;

	const indicatorAngle = valueToAngle(
		safeNormalizedValue,
		startAngle,
		sweepAngle,
	);
	const thinTrackWidth = Math.max(1, trackWidth - 2);
	const thickTrackWidth = trackWidth + 1;
	const currentTrackWidth = hovered ? thickTrackWidth : thinTrackWidth;

	const trackPath = describeArc(
		cx,
		cy,
		radius,
		startAngle,
		startAngle + sweepAngle,
	);
	const valuePath = describeValuePath(
		safeNormalizedValue,
		bipolarNorm,
		DEFAULT_ARC_GEOMETRY,
	);
	const modulatedPoint =
		safeModulatedNorm !== undefined
			? modTargetPoint(safeModulatedNorm, DEFAULT_ARC_GEOMETRY)
			: null;
	const modulatedTrailPath =
		safeModulatedNorm !== undefined &&
		Math.abs(safeModulatedNorm - safeNormalizedValue) >= 0.0008
			? (() => {
					const baseAngle = valueToAngle(
						safeNormalizedValue,
						startAngle,
						sweepAngle,
					);
					const modulatedAngle = valueToAngle(
						safeModulatedNorm,
						startAngle,
						sweepAngle,
					);
					const [from, to] =
						safeModulatedNorm >= safeNormalizedValue
							? [baseAngle, modulatedAngle]
							: [modulatedAngle, baseAngle];
					return describeArc(cx, cy, modOrbitRadius, from, to);
				})()
			: "";

	const centerTick =
		bipolarNorm !== null
			? (() => {
					const angle = valueToAngle(bipolarNorm, startAngle, sweepAngle);
					const outer = polarToCartesian(
						cx,
						cy,
						radius + currentTrackWidth / 2 + 1,
						angle,
					);
					const inner = polarToCartesian(
						cx,
						cy,
						radius - currentTrackWidth / 2 - 1,
						angle,
					);
					return { outer, inner };
				})()
			: null;

	const overrideStyle: CSSProperties | undefined = colorOverride
		? ({
				"--knob-value-color": colorOverride,
				"--knob-indicator-color": colorOverride,
			} as CSSProperties)
		: undefined;

	// Calculate knob body dimensions - centered at arc center (cx, cy)
	const knobBodyRadius = radius * 0.8; // Main knob body, proportional to arc radius
	const centerBrightenOpacity = hovered ? 0.14 : 0;

	const resolvedVariant: KnobVariant =
		variant === "light" || colorOverride === "#a0a0a0" ? "light" : variant;
	const bodyGradientByVariant: Record<
		KnobVariant,
		{
			top: string;
			bottom: string;
			tick: string;
			outerEdge: string;
		}
	> = {
		default: {
			top: "#434851",
			bottom: "#232830",
			tick: "#f4f5f6",
			outerEdge: "#1a1f27",
		},
		accent: {
			top: "var(--knob-value-color)",
			bottom: "var(--knob-value-color)",
			tick: "#f4f5f6",
			outerEdge: "var(--knob-value-color)",
		},
		muted: {
			top: "color-mix(in srgb, var(--knob-value-color) 62%, black)",
			bottom: "color-mix(in srgb, var(--knob-value-color) 62%, black)",
			tick: "#f4f5f6",
			outerEdge: "color-mix(in srgb, var(--knob-value-color) 62%, black)",
		},
		light: {
			top: "#e5e5e5",
			bottom: "#c4c4c4",
			tick: "#333",
			outerEdge: "#b0b0b0",
		},
		dark: {
			top: "#323232",
			bottom: "#303030",
			tick: "#f7f7f8",
			outerEdge: "#454545",
		},
	};
	const bodyGradient = bodyGradientByVariant[resolvedVariant];
	const isAccentOrMuted =
		resolvedVariant === "accent" || resolvedVariant === "muted";

	return (
		<div
			className={`relative knob-variant-${variant}`}
			style={{ width: size, height: size, ...overrideStyle }}
		>
			<svg
				ref={svgRef}
				width={size}
				height={size - 12}
				viewBox={`0 0 ${viewBoxSize} ${viewBoxSize - 12}`}
				role="presentation"
				aria-hidden="true"
			>
				{/* SVG Definitions: Filters and Gradients */}
				<defs>
					{/* Soft drop shadow for the knob base */}
					<filter
						id={`knob-shadow-${_uid}`}
						x="-40%"
						y="-40%"
						width="180%"
						height="180%"
					>
						<feDropShadow
							dx="0"
							dy="0"
							stdDeviation="1.8"
							floodColor="#2c2c2c"
							floodOpacity="0.52"
						/>
					</filter>

					{/* Knob body gradient */}
					<linearGradient
						id={`knob-grad-body-${_uid}`}
						x1="0%"
						y1="0%"
						x2="100%"
						y2="100%"
					>
						<stop offset="0%" stopColor={bodyGradient.top} />
						<stop offset="100%" stopColor={bodyGradient.bottom} />
					</linearGradient>
				</defs>

				{/* Background Track Arc (Thin, grey) */}
				<path
					d={trackPath}
					fill="none"
					stroke="var(--knob-track-color)"
					strokeLinecap="round"
					strokeWidth={currentTrackWidth}
				/>

				{/* Value Arc (Thicker, colored) */}
				{valuePath && (
					<path
						d={valuePath}
						fill="none"
						stroke="var(--knob-value-color)"
						strokeLinecap={bipolarNorm !== null ? "butt" : "round"}
						strokeWidth={currentTrackWidth}
					/>
				)}

				{/* Center tick for bipolar mode */}
				{centerTick && (
					<line
						x1={centerTick.inner.x}
						y1={centerTick.inner.y}
						x2={centerTick.outer.x}
						y2={centerTick.outer.y}
						stroke="var(--knob-track-color)"
						strokeWidth="1.5"
						strokeLinecap="round"
					/>
				)}

				{/* Modulation Arc Trail */}
				{safeModulatedNorm !== undefined && trailDuration > 0 && (
					<>
						{modulatedTrailPath ? (
							<path
								d={modulatedTrailPath}
								fill="none"
								stroke="var(--knob-value-color)"
								strokeWidth="2"
								strokeLinecap="round"
								strokeOpacity="0.55"
							/>
						) : null}
						{modulatedPoint ? (
							<circle
								cx={modulatedPoint.x}
								cy={modulatedPoint.y}
								r="2.1"
								fill="var(--knob-value-color)"
								fillOpacity="0.95"
							/>
						) : null}
					</>
				)}

				{/* 3D Knob Body */}
				<circle
					cx={cx}
					cy={cy}
					r={knobBodyRadius}
					fill={`url(#knob-grad-body-${_uid})`}
					filter={`url(#knob-shadow-${_uid})`}
					className="stroke-[0.5px] stroke-base-content/10"
				/>
				<circle
					cx={cx}
					cy={cy}
					r={knobBodyRadius - 1}
					fill="#ffffff"
					style={{
						opacity: centerBrightenOpacity,
						transition: "opacity 420ms ease-out",
					}}
				/>
				<circle
					cx={cx}
					cy={cy}
					r={knobBodyRadius - 0.25}
					fill="none"
					stroke={bodyGradient.outerEdge}
					strokeWidth="1.25"
					opacity={isAccentOrMuted ? 0.72 : 0.95}
				/>

				{/* Indicator Tick on Knob Body */}
				<g transform={`rotate(${indicatorAngle + 90} ${cx} ${cy})`}>
					<line
						x1={cx}
						y1={cy - knobBodyRadius + 3}
						x2={cx}
						y2={cy - knobBodyRadius + 10}
						stroke={bodyGradient.tick}
						strokeWidth="2.5"
						strokeLinecap="round"
						className="opacity-90"
					/>
				</g>
			</svg>

			{htmlOverlay && (
				<div className="pointer-events-none absolute inset-0 flex items-center justify-center">
					{htmlOverlay}
				</div>
			)}
		</div>
	);
}

export default KnobView;
