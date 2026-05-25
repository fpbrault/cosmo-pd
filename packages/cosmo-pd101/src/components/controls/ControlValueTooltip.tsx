import {
	type CSSProperties,
	type RefObject,
	useCallback,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
} from "react";
import { createPortal } from "react-dom";

type ControlValueTooltipPlacement = "above" | "below";

type ControlValueTooltipProps = {
	value: string;
	visible: boolean;
	placement?: ControlValueTooltipPlacement;
	className?: string;
	style?: CSSProperties;
	onPointerEnter?: () => void;
	onPointerLeave?: () => void;
};

type ControlValueTooltipPortalProps = {
	value: string;
	visible: boolean;
	anchorRef: RefObject<HTMLElement | null>;
	placement?: ControlValueTooltipPlacement;
	gapPx?: number;
	onPointerEnter?: () => void;
	onPointerLeave?: () => void;
};

type TooltipLayout = {
	top: number;
	left: number;
	arrowLeft: number;
	ready: boolean;
};

const TOOLTIP_EDGE_PADDING_PX = 8;
const TOOLTIP_ARROW_HALF_WIDTH_PX = 5;

export function getControlValueTooltipClassName({
	placement,
	visible,
	disabled,
}: {
	placement: ControlValueTooltipPlacement;
	visible: boolean;
	disabled?: boolean;
}) {
	const arrowClass =
		placement === "above"
			? "before:pointer-events-none before:absolute before:top-full before:left-[var(--knob-bubble-arrow-left)] before:-translate-x-1/2 before:border-x-[5px] before:border-t-[5px] before:border-x-transparent before:border-t-white"
			: "before:pointer-events-none before:absolute before:bottom-full before:left-[var(--knob-bubble-arrow-left)] before:-translate-x-1/2 before:border-x-[5px] before:border-b-[5px] before:border-x-transparent before:border-b-white";

	return `pointer-events-auto relative whitespace-nowrap rounded-sm border-transparent bg-white px-1.5 py-0.5 font-semibold text-2xs leading-none text-black shadow-[0_2px_6px_rgba(0,0,0,0.5)] transition-opacity duration-100 ${arrowClass} ${
		disabled ? "cursor-not-allowed opacity-70" : "cursor-pointer"
	} ${visible ? "inline-block opacity-100" : "pointer-events-none inline-block opacity-0"}`;
}

export default function ControlValueTooltip({
	value,
	visible,
	placement = "above",
	className,
	style,
	onPointerEnter,
	onPointerLeave,
}: ControlValueTooltipProps) {
	return (
		<div
			className={`${getControlValueTooltipClassName({ placement, visible })} ${className ?? ""}`.trim()}
			style={style}
			onPointerEnter={onPointerEnter}
			onPointerLeave={onPointerLeave}
		>
			{value}
		</div>
	);
}

export function ControlValueTooltipPortal({
	value,
	visible,
	anchorRef,
	placement = "above",
	gapPx = 14,
	onPointerEnter,
	onPointerLeave,
}: ControlValueTooltipPortalProps) {
	const tooltipRef = useRef<HTMLDivElement | null>(null);
	const previousVisibleRef = useRef(false);
	const [layout, setLayout] = useState<TooltipLayout>({
		top: -10000,
		left: -10000,
		arrowLeft: 0,
		ready: false,
	});
	const becameVisible = visible && !previousVisibleRef.current;

	const updateLayout = useCallback(() => {
		if (!visible) {
			return;
		}

		const anchorRect = anchorRef.current?.getBoundingClientRect();
		const bubbleRect = tooltipRef.current?.getBoundingClientRect();
		if (
			!anchorRect ||
			!bubbleRect ||
			bubbleRect.width < 2 ||
			bubbleRect.height < 2
		) {
			return;
		}

		const anchorCenterX = anchorRect.left + anchorRect.width / 2;
		const rawLeft = anchorCenterX - bubbleRect.width / 2;
		const minLeft = TOOLTIP_EDGE_PADDING_PX;
		const maxLeft = Math.max(
			minLeft,
			window.innerWidth - TOOLTIP_EDGE_PADDING_PX - bubbleRect.width,
		);
		const left = Math.min(Math.max(rawLeft, minLeft), maxLeft);
		const top =
			placement === "above"
				? anchorRect.top - gapPx - bubbleRect.height
				: anchorRect.bottom + gapPx;
		const arrowMin = TOOLTIP_ARROW_HALF_WIDTH_PX + 2;
		const arrowMax = Math.max(
			arrowMin,
			bubbleRect.width - TOOLTIP_ARROW_HALF_WIDTH_PX - 2,
		);
		const arrowLeft = Math.min(
			Math.max(anchorCenterX - left, arrowMin),
			arrowMax,
		);

		setLayout((prev) => {
			if (
				prev.top === top &&
				prev.left === left &&
				prev.arrowLeft === arrowLeft &&
				prev.ready
			) {
				return prev;
			}
			return { top, left, arrowLeft, ready: true };
		});
	}, [anchorRef, gapPx, placement, visible]);

	useLayoutEffect(() => {
		if (!visible) {
			previousVisibleRef.current = false;
			setLayout((prev) => (prev.ready ? { ...prev, ready: false } : prev));
			return;
		}
		updateLayout();
		previousVisibleRef.current = true;
	}, [updateLayout, visible]);

	useEffect(() => {
		if (!visible) {
			return;
		}
		const onLayoutChange = () => updateLayout();
		window.addEventListener("resize", onLayoutChange);
		window.addEventListener("scroll", onLayoutChange, true);
		return () => {
			window.removeEventListener("resize", onLayoutChange);
			window.removeEventListener("scroll", onLayoutChange, true);
		};
	}, [updateLayout, visible]);

	if (typeof document === "undefined" || !visible) {
		return null;
	}

	return createPortal(
		<div className="pointer-events-none fixed inset-0 z-[9999]">
			<ControlValueTooltip
				value={value}
				visible={visible}
				placement={placement}
				className="absolute"
				style={
					{
						top: layout.ready && !becameVisible ? layout.top : -10000,
						left: layout.ready && !becameVisible ? layout.left : -10000,
						"--knob-bubble-arrow-left": `${layout.arrowLeft}px`,
					} as CSSProperties
				}
				onPointerEnter={onPointerEnter}
				onPointerLeave={onPointerLeave}
			/>
			<div
				ref={tooltipRef}
				className="pointer-events-none absolute top-[-10000px] left-[-10000px]"
			>
				<ControlValueTooltip
					value={value}
					visible
					placement={placement}
					style={
						{
							"--knob-bubble-arrow-left": `${layout.arrowLeft}px`,
						} as CSSProperties
					}
				/>
			</div>
		</div>,
		(document.fullscreenElement as Element | null) ?? document.body,
	);
}
