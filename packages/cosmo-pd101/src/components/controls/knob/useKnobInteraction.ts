import { useCallback, useEffect, useRef, useState } from "react";
import {
	clampValue,
	DEFAULT_ARC_GEOMETRY,
	denormalizeValueCurved,
	isOnHandle,
	type KnobCurve,
	normalizeValueCurved,
	snapToStep,
	svgPointToNorm,
} from "./knobGeometry";

export interface UseKnobInteractionProps {
	value: number;
	min: number;
	max: number;
	step?: number;
	defaultValue?: number;
	/** Pixels of vertical drag required to traverse the full range. Default 200. */
	sensitivity?: number;
	/** Divisor applied to sensitivity when Shift is held. Default 5. */
	fineSensitivity?: number;
	/** Normalized step per wheel tick. Default 0.01. */
	wheelStep?: number;
	/** Normalized step per wheel tick when Shift is held. Default 0.002. */
	fineWheelStep?: number;
	disabled?: boolean;
	onChange: (value: number) => void;
	/** Ref to the SVG element for coordinate transforms (angular drag). */
	svgRef: React.RefObject<SVGSVGElement | null>;
	/** Ref to the interactive element for attaching non-passive wheel listener. */
	buttonRef: React.RefObject<HTMLButtonElement | null>;
	/** Non-linear scaling curve. Default linear. */
	curve?: KnobCurve;
}

export interface UseKnobInteractionResult {
	dragging: boolean;
	editing: boolean;
	editValue: string;
	inputRef: React.RefObject<HTMLInputElement | null>;
	onPointerDown: (e: React.PointerEvent) => void;
	onPointerMove: (e: React.PointerEvent) => void;
	onPointerUp: (e: React.PointerEvent) => void;
	onPointerCancel: (e: React.PointerEvent) => void;
	onLostPointerCapture: () => void;
	onDoubleClick: (e: React.MouseEvent) => void;
	onKeyDown: (e: React.KeyboardEvent) => void;
	beginEdit: (currentDisplay: string) => void;
	commitEdit: () => void;
	cancelEdit: () => void;
	setEditValue: (v: string) => void;
	onEditKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
	onEditBlur: () => void;
}

export function useKnobInteraction({
	value,
	min,
	max,
	step,
	defaultValue,
	sensitivity = 200,
	fineSensitivity = 5,
	wheelStep = 0.01,
	fineWheelStep = 0.002,
	disabled = false,
	onChange,
	svgRef,
	buttonRef,
	curve = "linear",
}: UseKnobInteractionProps): UseKnobInteractionResult {
	const arcGeometry = DEFAULT_ARC_GEOMETRY;
	const [dragging, setDragging] = useState(false);
	const [editing, setEditing] = useState(false);
	const [editValue, setEditValue] = useState("");
	const inputRef = useRef<HTMLInputElement>(null);
	const lastTouchTapAtRef = useRef(0);
	const activePointerIdRef = useRef<number | null>(null);
	const activePointerTargetRef = useRef<Element | null>(null);

	const dragState = useRef<{
		mode: "linear" | "angular";
		startSvgY: number;
		startValue: number;
		isShift: boolean;
	} | null>(null);

	// Emit a domain value, applying step quantization and clamping.
	const emit = useCallback(
		(raw: number) => {
			const clamped = clampValue(raw, min, max);
			const snapped = snapToStep(clamped, step, min, max);
			onChange(snapped);
		},
		[min, max, step, onChange],
	);

	// Convert client coordinates to SVG-local space, accounting for host scaling.
	const toSvgPoint = useCallback(
		(clientX: number, clientY: number): { x: number; y: number } => {
			const svg = svgRef.current;
			if (!svg) return { x: clientX, y: clientY };
			const pt = svg.createSVGPoint();
			if (typeof pt.matrixTransform !== "function") {
				return { x: clientX, y: clientY };
			}
			pt.x = clientX;
			pt.y = clientY;
			const ctm = svg.getScreenCTM();
			if (!ctm || typeof ctm.inverse !== "function") {
				return { x: clientX, y: clientY };
			}
			const svgPt = pt.matrixTransform(ctm.inverse());
			return { x: svgPt.x, y: svgPt.y };
		},
		[svgRef],
	);

	const onPointerDown = useCallback(
		(e: React.PointerEvent) => {
			if (disabled) return;

			if (e.pointerType === "touch") {
				const now = Date.now();
				const isDoubleTouch = now - lastTouchTapAtRef.current <= 300;
				lastTouchTapAtRef.current = now;

				if (isDoubleTouch && defaultValue !== undefined) {
					e.preventDefault();
					dragState.current = null;
					setDragging(false);
					emit(defaultValue);
					lastTouchTapAtRef.current = 0;
					return;
				}
			}

			e.preventDefault();
			const target = e.currentTarget as Element;
			target.setPointerCapture(e.pointerId);
			activePointerIdRef.current = e.pointerId;
			activePointerTargetRef.current = target;
			const pt = toSvgPoint(e.clientX, e.clientY);
			const norm = normalizeValueCurved(value, min, max, curve);
			const mode = isOnHandle(pt.x, pt.y, norm, arcGeometry)
				? "angular"
				: "linear";
			dragState.current = {
				mode,
				startSvgY: pt.y,
				startValue: value,
				isShift: e.shiftKey,
			};
			setDragging(true);
		},
		[disabled, defaultValue, toSvgPoint, value, min, max, curve, emit],
	);

	const onPointerMove = useCallback(
		(e: React.PointerEvent) => {
			if (
				activePointerIdRef.current !== null &&
				e.pointerId !== activePointerIdRef.current
			) {
				return;
			}
			const state = dragState.current;
			if (!state) return;

			if (state.mode === "angular") {
				const pt = toSvgPoint(e.clientX, e.clientY);
				const norm = svgPointToNorm(pt.x, pt.y, arcGeometry);
				emit(denormalizeValueCurved(norm, min, max, curve));
				return;
			}

			const pt = toSvgPoint(e.clientX, e.clientY);
			const deltaY = state.startSvgY - pt.y;
			const effectiveSensitivity =
				state.isShift || e.shiftKey
					? sensitivity * fineSensitivity
					: sensitivity;
			const screenRatio = svgRef.current
				? (svgRef.current.getBoundingClientRect().height || 1) /
					(arcGeometry.viewBoxSize || 1)
				: 1;
			const startPos = normalizeValueCurved(state.startValue, min, max, curve);
			const nextPos = startPos + (deltaY * screenRatio) / effectiveSensitivity;
			emit(denormalizeValueCurved(nextPos, min, max, curve));
		},
		[curve, emit, fineSensitivity, max, min, sensitivity, svgRef, toSvgPoint],
	);

	const endPointerDrag = useCallback(() => {
		const pointerId = activePointerIdRef.current;
		const pointerTarget = activePointerTargetRef.current;
		if (pointerId !== null && pointerTarget?.hasPointerCapture(pointerId)) {
			pointerTarget?.releasePointerCapture(pointerId);
		}
		activePointerIdRef.current = null;
		activePointerTargetRef.current = null;
		dragState.current = null;
		setDragging(false);
	}, []);

	const endPointerDragFromEvent = useCallback(
		(e: React.PointerEvent) => {
			if (
				activePointerIdRef.current !== null &&
				e.pointerId !== activePointerIdRef.current
			) {
				return;
			}
			endPointerDrag();
		},
		[endPointerDrag],
	);

	const onDoubleClick = useCallback(
		(e: React.MouseEvent) => {
			if (disabled) return;
			e.preventDefault();
			if (defaultValue !== undefined) {
				emit(defaultValue);
			}
		},
		[disabled, defaultValue, emit],
	);

	const onKeyDown = useCallback(
		(e: React.KeyboardEvent) => {
			if (disabled) return;
			const currentPos = normalizeValueCurved(value, min, max, curve);
			const stepNorm = step && max > min ? step / (max - min) : undefined;
			const delta = e.shiftKey
				? (stepNorm ?? fineWheelStep)
				: (stepNorm ?? wheelStep);
			switch (e.key) {
				case "ArrowUp":
				case "ArrowRight":
					e.preventDefault();
					emit(
						denormalizeValueCurved(
							clampValue(currentPos + delta, 0, 1),
							min,
							max,
							curve,
						),
					);
					break;
				case "ArrowDown":
				case "ArrowLeft":
					e.preventDefault();
					emit(
						denormalizeValueCurved(
							clampValue(currentPos - delta, 0, 1),
							min,
							max,
							curve,
						),
					);
					break;
				case "Home":
					e.preventDefault();
					emit(min);
					break;
				case "End":
					e.preventDefault();
					emit(max);
					break;
			}
		},
		[disabled, value, min, max, step, wheelStep, fineWheelStep, curve, emit],
	);

	const beginEdit = useCallback(
		(currentDisplay: string) => {
			if (disabled) return;
			setEditValue(currentDisplay);
			setEditing(true);
		},
		[disabled],
	);

	const commitEdit = useCallback(() => {
		setEditing(false);
		const parsed = Number.parseFloat(editValue);
		if (!Number.isNaN(parsed)) {
			emit(parsed);
		}
	}, [editValue, emit]);

	const cancelEdit = useCallback(() => {
		setEditing(false);
	}, []);

	const onEditKeyDown = useCallback(
		(e: React.KeyboardEvent<HTMLInputElement>) => {
			if (e.key === "Enter") commitEdit();
			else if (e.key === "Escape") cancelEdit();
		},
		[commitEdit, cancelEdit],
	);

	const onEditBlur = useCallback(() => {
		commitEdit();
	}, [commitEdit]);

	// Focus the text input when editing starts.
	useEffect(() => {
		if (editing && inputRef.current) {
			inputRef.current.focus();
			inputRef.current.select();
		}
	}, [editing]);

	// Non-passive wheel listener on the button element to allow preventDefault.
	useEffect(() => {
		const el = buttonRef.current;
		if (!el || disabled) return;

		const handleWheel = (e: WheelEvent) => {
			e.preventDefault();
			// Correct for natural scroll inversion (macOS)
			const rawDeltaY = (
				e as WheelEvent & { webkitDirectionInvertedFromDevice?: boolean }
			).webkitDirectionInvertedFromDevice
				? -e.deltaY
				: e.deltaY;
			const delta = e.shiftKey ? fineWheelStep : wheelStep;
			const direction = rawDeltaY > 0 ? -1 : 1;
			const currentPos = normalizeValueCurved(value, min, max, curve);
			emit(
				denormalizeValueCurved(
					clampValue(currentPos + direction * delta, 0, 1),
					min,
					max,
					curve,
				),
			);
		};

		el.addEventListener("wheel", handleWheel, { passive: false });
		return () => el.removeEventListener("wheel", handleWheel);
	}, [
		buttonRef,
		disabled,
		value,
		min,
		max,
		wheelStep,
		fineWheelStep,
		curve,
		emit,
	]);

	// Ensure drag never gets stuck if pointer release happens outside the viewport.
	useEffect(() => {
		if (!dragging) return;

		const handlePointerEnd = (e: PointerEvent) => {
			if (
				activePointerIdRef.current !== null &&
				e.pointerId !== activePointerIdRef.current
			) {
				return;
			}
			endPointerDrag();
		};

		const handleWindowBlur = () => {
			endPointerDrag();
		};

		const handleVisibilityChange = () => {
			if (document.visibilityState !== "visible") {
				endPointerDrag();
			}
		};

		window.addEventListener("pointerup", handlePointerEnd);
		window.addEventListener("pointercancel", handlePointerEnd);
		window.addEventListener("blur", handleWindowBlur);
		document.addEventListener("visibilitychange", handleVisibilityChange);

		return () => {
			window.removeEventListener("pointerup", handlePointerEnd);
			window.removeEventListener("pointercancel", handlePointerEnd);
			window.removeEventListener("blur", handleWindowBlur);
			document.removeEventListener("visibilitychange", handleVisibilityChange);
		};
	}, [dragging, endPointerDrag]);

	return {
		dragging,
		editing,
		editValue,
		inputRef,
		onPointerDown,
		onPointerMove,
		onPointerUp: endPointerDragFromEvent,
		onPointerCancel: endPointerDragFromEvent,
		onLostPointerCapture: endPointerDrag,
		onDoubleClick,
		onKeyDown,
		beginEdit,
		commitEdit,
		cancelEdit,
		setEditValue,
		onEditKeyDown,
		onEditBlur,
	};
}
